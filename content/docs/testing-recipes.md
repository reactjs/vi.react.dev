---
id: testing-recipes
title: Phương thức Test
permalink: docs/testing-recipes.html
prev: testing.html
next: testing-environments.html
---

Một vài cách viết test phổ biến cho component React.


> Lưu ý:
>
> Trang này mặc định bạn đang dùng [Jest](https://jestjs.io/) làm test runner. Nếu dùng một test runner khác, bạn cần thay đổi API cho phù hợp, giải pháp sẽ gần như nhau. Đọc thêm chi tiết cách cài đặt môi trường test ở [Môi trường Test](/docs/testing-environments.html).


Trên trang này, chúng tôi sẽ tập chung vào function component. Tuy nhiên, cách để tiếp cận test không phụ thuộc vào phần hiện thực cụ thể, nó cũng sẽ làm việc tốt với class component.

- [Cài đặt cụ thể](#setup--teardown)
- [`act()`](#act)
- [Rendering](#rendering)
- [Data Fetching](#data-fetching)
- [Mocking Modules](#mocking-modules)
- [Events](#events)
- [Timers](#timers)
- [Snapshot Testing](#snapshot-testing)
- [Multiple Renderers](#multiple-renderers)
- [Something Missing?](#something-missing)

---

### Cài đặt cụ thể {#setup--teardown}

Trên mỗi test, chúng ta thường muốn render React tree của chúng ta thành DOM element và chèn nó vào `document`. Chỉ như thế chúng ta mới nhận được các sự kiện trên DOM. Khi kết thúc một test, chúng ta muốn "dọn dẹp" và *gỡ bỏ* cây này khỏi DOM.

Một cách phổ biến để làm nó là sử dụng bộ đôi `beforeEach` và `afterEach`, để  chúng luôn chạy một cách độc lập và không ảnh hưởng đến test khác:

```jsx
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // cài đặt một DOM element như là target cho render
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // dọn dẹp lúc thoát
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
```

Bạn có thể sử dụng một cách khác, nhưng hãy nhớ chúng ta muốn chạy việc dọn dẹp ngay cả khi test *fail*. Nếu không, test có thể trở nên "bất ổn", và một test có thể ảnh hưởng đến hoạt động của test khác. Như vậy sẽ rất khó để debug.

---

### `act()` {#act}

Khi viết UI test, công việc như render, sự kiện từ user, hoặc fetch dữ liệu có thể được xem như một "đơn vị" tương tác với giao diện người dùng. `react-dom/test-utils` cung cấp một hàm trợ giúp [`act()`](/docs/test-utils.html#act) để đảm bảo tất cả mọi cập nhập liên quan đến "đơn vị" đã được thực thi và áp dụng đến DOM trước khi chúng ta xác nhận kết quả:

```js
act(() => {
  // render component
});
// xác nhận kết quả
```

Nó giúp test chạy giống nhất với những gì user nhận được khi sử dụng ứng dụng. Tất cả những ví dụ bên dưới sử dụng `act()` để đảm bảo điều này.

Bạn có thể thấy sử dụng `act()` trực tiếp rất rườm rà. Để tránh rườm rà, bạn có thể sử dụng một thư viện như [React Testing Library](https://testing-library.com/react), các hàm hỗ trợ đã được wrap lại sẵn trong `act()`.

> Lưu ý:
>
> Tên `act` có nguồn gốc từ cách làm [Arrange-Act-Assert](http://wiki.c2.com/?ArrangeActAssert).

---

### Rendering {#rendering}

Thường thì, chúng ta muốn test xem một component render đúng hay không với các prop nhận được. Xem xét một component đơn giản sẽ render một thông tin dựa vào prop:

```jsx
// hello.js

import React from "react";

export default function Hello(props) {
  if (props.name) {
    return <h1>Hello, {props.name}!</h1>;
  } else {
    return <span>Hey, stranger</span>;
  }
}
```

Chúng ta có thể viết test cho component:

```jsx{24-27}
// hello.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // cài đặt một DOM element như là target cho render
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // dọn dẹp lúc thoát
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders with or without a name", () => {
  act(() => {
    render(<Hello />, container);
  });
  expect(container.textContent).toBe("Hey, stranger");

  act(() => {
    render(<Hello name="Jenny" />, container);
  });
  expect(container.textContent).toBe("Hello, Jenny!");

  act(() => {
    render(<Hello name="Margaret" />, container);
  });
  expect(container.textContent).toBe("Hello, Margaret!");
});
```

---

### Fetch dữ liệu {#data-fetching}

Thay vì gọi APIs thật trong test, chúng ta có thể giả lập các request này bằng dữ liệu giả. Giả lập dữ liệu với dữ liệu "fake" để tránh ảnh hưởng đến test khi backend không sử dụng được, và để nó chạy nhanh hơn. Lưu ý: bạn có thể muốn nó chạy danh sách các test con sử dụng framework ["end-to-end"](/docs/testing-environments.html#end-to-end-tests-aka-e2e-tests)  để xem toàn bộ ứng dụng có làm việc với nhau không.

```jsx
// user.js

import React, { useState, useEffect } from "react";

export default function User(props) {
  const [user, setUser] = useState(null);

  async function fetchUserData(id) {
    const response = await fetch("/" + id);
    setUser(await response.json());
  }

  useEffect(() => {
    fetchUserData(props.id);
  }, [props.id]);

  if (!user) {
    return "loading...";
  }

  return (
    <details>
      <summary>{user.name}</summary>
      <strong>{user.age}</strong> years old
      <br />
      lives in {user.address}
    </details>
  );
}
```

Bạn có thể viết test cho nó:

```jsx{23-33,44-45}
// user.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import User from "./user";

let container = null;
beforeEach(() => {
  // cài đặt một DOM element như là target cho render
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // dọn dẹp lúc thoát
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders user data", async () => {
  const fakeUser = {
    name: "Joni Baez",
    age: "32",
    address: "123, Charming Avenue"
  };

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser)
    })
  );

  // sử dụng một phiên bản async để áp dụng resolved promise
  await act(async () => {
    render(<User id="123" />, container);
  });

  expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
  expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
  expect(container.textContent).toContain(fakeUser.address);

  // xóa giả lập để đảm bảo test chạy tách biệt
  global.fetch.mockRestore();
});
```

---

### Giả lập các module {#mocking-modules}

Một vài module không làm việc tốt trong môi trường test, hoặc không cần thiết cho test đó. Giả lập các module này bằng dummy để dễ dàng test hơn phần code của chúng ta.

Component `Contact` có nhúng một component third-party `GoogleMap`:

```jsx
// map.js

import React from "react";

import { LoadScript, GoogleMap } from "react-google-maps";
export default function Map(props) {
  return (
    <LoadScript id="script-loader" googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap id="example-map" center={props.center} />
    </LoadScript>
  );
}

// contact.js

import React from "react";
import Map from "./map";

export default function Contact(props) {
  return (
    <div>
      <address>
        Contact {props.name} via{" "}
        <a data-testid="email" href={"mailto:" + props.email}>
          email
        </a>
        or on their <a data-testid="site" href={props.site}>
          website
        </a>.
      </address>
      <Map center={props.center} />
    </div>
  );
}
```

Nếu không muốn load component  `GoogleMap` trong test của chúng ta,  giả lập bằng một dummy component và chạy test:

```jsx{10-18}
// contact.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Contact from "./contact";
import MockedMap from "./map";

jest.mock("./map", () => {
  return function DummyMap(props) {
    return (
      <div data-testid="map">
        {props.center.lat}:{props.center.long}
      </div>
    );
  };
});

let container = null;
beforeEach(() => {
  // cài đặt một DOM element như là target cho render
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // dọn dẹp lúc thoát
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render contact information", () => {
  const center = { lat: 0, long: 0 };
  act(() => {
    render(
      <Contact
        name="Joni Baez"
        email="test@example.com"
        site="http://test.com"
        center={center}
      />,
      container
    );
  });

  expect(
    container.querySelector("[data-testid='email']").getAttribute("href")
  ).toEqual("mailto:test@example.com");

  expect(
    container.querySelector('[data-testid="site"]').getAttribute("href")
  ).toEqual("http://test.com");

  expect(container.querySelector('[data-testid="map"]').textContent).toEqual(
    "0:0"
  );
});
```

---

### Event {#events}

Chúng tôi khuyến nghị dispatch một event DOM thật trên DOM element, và đặt phần xác nhận kết quả. Xem một component `Toggle`:

```jsx
// toggle.js

import React, { useState } from "react";

export default function Toggle(props) {
  const [state, setState] = useState(false);
  return (
    <button
      onClick={() => {
        setState(previousState => !previousState);
        props.onChange(!state);
      }}
      data-testid="toggle"
    >
      {state === true ? "Turn off" : "Turn on"}
    </button>
  );
}
```

Chúng ta có thể viết test cho nó:

```jsx{13-14,35,43}
// toggle.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Toggle from "./toggle";

let container = null;
beforeEach(() => {
  // cài đặt một DOM element như là target cho render
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // dọn dẹp lúc thoát
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("changes value when clicked", () => {
  const onChange = jest.fn();
  act(() => {
    render(<Toggle onChange={onChange} />, container);
  });

  // lấy toàn bộ các element, và trigger một vài sự kiện click
  const button = document.querySelector("[data-testid=toggle]");
  expect(button.innerHTML).toBe("Turn on");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(button.innerHTML).toBe("Turn off");

  act(() => {
    for (let i = 0; i < 5; i++) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });

  expect(onChange).toHaveBeenCalledTimes(6);
  expect(button.innerHTML).toBe("Turn on");
});
```

Các event DOM và thuộc tính được mô tả trong [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent). Lưu ý bạn phải truyền vào `{ bubbles: true }` trên từng event bạn tạo cho nó để đến React listener vì React tự động truyền các event này đến gốc (root).

> Lưu ý:
>
> React Testing Library cung cấp [một số hàm hỗ trợ](https://testing-library.com/docs/dom-testing-library/api-events) cho việc bắn sự kiện.

---

### Timer {#timers}

Code có thể sử dụng hàm liên quan thời gian như `setTimeout` để lên lịch các công việc sẽ thực hiện trong tương lai. Trong ví dụ, một cửa sổ nhiều lựa chọn đợi cho đến khi có lựa chọn, nếu sau 5 giây sẽ không thể chọn:

```jsx
// card.js

import React, { useEffect } from "react";

export default function Card(props) {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      props.onSelect(null);
    }, 5000);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [props.onSelect]);

  return [1, 2, 3, 4].map(choice => (
    <button
      key={choice}
      data-testid={choice}
      onClick={() => props.onSelect(choice)}
    >
      {choice}
    </button>
  ));
}
```

Chúng ta có thể viết test cho component bằng cách dùng [Jest's timer mocks](https://jestjs.io/docs/en/timer-mocks) và test sự khác nhau của state.

```jsx{7,31,37,49,59}
// card.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Card from "./card";

let container = null;
beforeEach(() => {
  // cài đặt một DOM element như là target cho render
  container = document.createElement("div");
  document.body.appendChild(container);
  jest.useFakeTimers();
});

afterEach(() => {
  // dọn dẹp lúc thoát
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  jest.useRealTimers();
});

it("should select null after timing out", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  // chạy đến lúc 100ms
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // và chạy đến lúc 5 giây
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).toHaveBeenCalledWith(null);
});

it("should cleanup on being removed", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // unmount app
  act(() => {
    render(null, container);
  });

  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).not.toHaveBeenCalled();
});

it("should accept selections", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    container
      .querySelector("[data-testid='2']")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onSelect).toHaveBeenCalledWith(2);
});
```

Bạn có thể giả lập thời gian trong một test. Ở trên, chúng ta bật lên bằng cách gọi `jest.useFakeTimers()`. Ưu điểm chính của chúng cho ta là test không cần thực sự đợi đến 5 giây để chạy, và bạn cũng không cần thay đổi component để phục vụ việc test.

---

### Snapshot Test {#snapshot-testing}

Framework như Jest cho chúng ta lưu "ảnh" với [`toMatchSnapshot` / `toMatchInlineSnapshot`](https://jestjs.io/docs/en/snapshot-testing). Với chúng, bạn có thể "lưu" một kết quả render và đảm bảo một thay đổi có thể làm thay đổi của kết quả snapshot.

Trong ví dụ,  chúng ta render một component và định dạng HTML đã render với thư viện [`pretty`](https://www.npmjs.com/package/pretty), trước khi lưu nó như một snapshot inline:

```jsx{29-31}
// hello.test.js, again

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // cài đặt một DOM element như là target cho render
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // dọn dẹp lúc thoát
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render a greeting", () => {
  act(() => {
    render(<Hello />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... được tự động điền bởi jest ... */

  act(() => {
    render(<Hello name="Jenny" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... được tự động điền bởi jest ... */

  act(() => {
    render(<Hello name="Margaret" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... được tự động điền bởi jest ... */
});
```

Thường sẽ tốt hơn nếu chỉ rõ kết quả muốn nhận được thay vì snapshot. Những kiểu test này bao gồm phần hiện thực chi tiết để chúng dễ dàng bị fail. Chọn [giả lập một vài component con](#mocking-modules) có thể giúp giảm kích thước snapshot và giữ chúng dễ độc lúc review code.

---

### Multiple Renderer {#multiple-renderers}

Trong những tình huống hiếm, bạn có thể chạy một test trên một component sử dụng multiple renderer. Lấy ví dụ, bạn có thể chạy snapshot test trên một component với `react-test-renderer`, bên trong đó nó dùng `ReactDOM.render`trong một child component để render một vài nội dung. Tình huống đó, bạn có thể wrap phần cập nhập với `act()` ứng với từng renderer

```jsx
import { act as domAct } from "react-dom/test-utils";
import { act as testAct, create } from "react-test-renderer";
// ...
let root;
domAct(() => {
  testAct(() => {
    root = create(<App />);
  });
});
expect(root).toMatchSnapshot();
```

---

### Còn thiếu gì đó? {#something-missing}

Nếu các tình huống hay gặp không được đề cập ở đây, có thể liên hệ với chúng tôi qua [issue tracker](https://github.com/reactjs/reactjs.org/issues) cho toàn bộ tài liệu của website
