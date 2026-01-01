---
title: useId
---

<Intro>

`useId` là một React Hook dùng để sinh ra các ID duy nhất có thể được dùng để truyền vào các thuộc tính accessibility.

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useId()` {/*useid*/}

Gọi `useId` ở top level của component để sinh ra một ID duy nhất:

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[Xem nhiều ví dụ hơn ở bên dưới.](#usage)

#### Tham số {/*parameters*/}

`useId` không nhận tham số.

#### Trả về {/*returns*/}

`useId` trả về một ID dạng chuỗi duy nhất với lần gọi `useId` trong component hiện tại.

#### Lưu ý {/*caveats*/}

* `useId` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở top level của component**  hoặc các Hook tuỳ chỉnh của bạn. Bạn không thể gọi nó bên trong vòng lặp hoặc trong câu lệnh điều kiện. Nếu bạn cần làm vậy, hãy tách nó thành một component mới và di chuyển state vào đó.

* `useId` **không nên được sử dụng để sinh key** cho danh sách. [Key nên được tạo từ dữ liệu của bạn.](/learn/rendering-lists#where-to-get-your-key)

* `useId` hiện tại không thể sử dụng trong [async Server Component](/reference/rsc/server-components#async-components-with-server-components).

---

## Sử dụng {/*usage*/}

<Pitfall>

**Không gọi `useId` để sinh key trong một danh sách.** [Key nên được tạo từ dữ liệu của bạn.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### Sinh ID duy nhất cho các thuộc tính accessibility {/*generating-unique-ids-for-accessibility-attributes*/}

Gọi `useId` tại top level của component để sinh ra một ID duy nhất:

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

Sau đó bạn có thể truyền <CodeStep step={1}>ID đã sinh ra</CodeStep> vào các thuộc tính khác:

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**Hãy xem một ví dụ để thấy khi nào nó hữu ích.**

[HTML accessibility attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) như [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) cho bạn chỉ định rằng hai thẻ có liên quan với nhau. Ví dụ, bạn có thể chỉ định rằng một phần tử (như input) được mô tả bởi một phần tử khác (như đoạn văn).

Trong HTML thuần, bạn sẽ viết như sau:

```html {5,8}
<label>
  Mật khẩu:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  Mật khẩu nên chứa ít nhất 18 ký tự
</p>
```

Tuy nhiên, việc hardcode ID như thế không phải là một practice tốt trong React. một component có thể được render nhiều lần trên trang--nhưng ID thì phải là duy nhất! Thay vì hardcode một ID, hãy sinh ra một ID duy nhất với `useId`:

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Mật khẩu:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        Mật khẩu nên chứa ít nhất 18 ký tự
      </p>
    </>
  );
}
```

Và giờ, ngay cả khi bạn render nhiều instance của `PasswordField`, các ID được sinh ra sẽ không bị trùng lặp:

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Mật khẩu:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        Mật khẩu nên chứa ít nhất 18 ký tự
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Tạo mật khẩu</h2>
      <PasswordField />
      <h2>Xác nhận mật khẩu</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[Xem video này](https://www.youtube.com/watch?v=0dNzNcuEuOo) để thấy sự khác biệt trong trải nghiệm người dùng với các công nghệ hỗ trợ.

<Pitfall>

Với [server rendering](/reference/react-dom/server), **`useId` yêu cầu component tree phải giống hệt nhau trên server và client**. Nếu cây bạn render trên server và client không khớp hoàn toàn, các ID được sinh ra sẽ không khớp.

</Pitfall>

<DeepDive>

#### Tại sao useId tốt hơn một counter tăng dần {/*why-is-useid-better-than-an-incrementing-counter*/}

Bạn có thể sẽ thắc mắc tại sao `useId` lại tốt hơn là tăng một biến toàn cục như `nextId++`.

Lợi ích chính của `useId` là React đảm bảo rằng nó hoạt động với [server rendering.](/reference/react-dom/server) Trong server rendering, các component của bạn sinh ra output HTML. Sau đó, trên client, [hydration](/reference/react-dom/client/hydrateRoot) gắn các event handler của bạn vào HTML đã sinh ra. Để hydration hoạt động, output trên client phải khớp với HTML trên server.

Điều này quá khó để đảm bảo với một biến đếm tăng dần vì thứ tự mà các Client Component được hydrated có thể không khớp với thứ tự mà HTML trên server được sinh ra. Bằng cách gọi `useId`, bạn đảm bảo rằng hydration sẽ hoạt động, và output sẽ khớp giữa server và client.

Trong React, `useId` được sinh ra từ "parent path" của component gọi nó. Đây là lý do tại sao, nếu cây trên client và server giống nhau, "parent path" sẽ khớp với nhau bất kể thứ tự render.

</DeepDive>

---

### Sinh ID cho nhiều phần tử liên quan {/*generating-ids-for-several-related-elements*/}

Nếu bạn cần gán ID cho nhiều phần tử liên quan, bạn có thể gọi `useId` để sinh ra một tiền tố (prefix) dùng chung cho chúng:

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-lastName'}>Họ:</label>
      <input id={id + '-lastName'} type="text" />
      <hr />
      <label htmlFor={id + '-firstName'}>Tên:</label>
      <input id={id + '-firstName'} type="text" />
    </form>
  );
}
```

```css
label { min-width: 50px; display: inline-block; }
input { margin: 5px; }
```

</Sandpack>

Điều này giúp bạn tránh phải gọi `useId` cho từng phần tử cần ID duy nhất.

---

### Đặt tiền tố dùng chung cho tất cả ID được sinh ra {/*specifying-a-shared-prefix-for-all-generated-ids*/}

Nếu bạn render nhiều ứng dụng React độc lập trên một trang, hãy truyền `identifierPrefix` như một tuỳ chọn vào các lệnh gọi [`createRoot`](/reference/react-dom/client/createRoot#parameters) hoặc [`hydrateRoot`](/reference/react-dom/client/hydrateRoot). Điều này đảm bảo rằng các ID được sinh ra bởi hai ứng dụng khác nhau sẽ không bao giờ bị trùng lặp vì mỗi ID được sinh ra với `useId` sẽ bắt đầu với tiền tố riêng biệt mà bạn đã chỉ định.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Generated identifier:', passwordHintId)
  return (
    <>
      <label>
        Mật khẩu:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        Mật khẩu nên chứa ít nhất 18 ký tự
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Tạo mật khẩu</h2>
      <PasswordField />
    </>
  );
}
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

---

### Sử dụng cùng một tiền tố ID trên client và server {/*using-the-same-id-prefix-on-the-client-and-the-server*/}

Nếu bạn [render nhiều ứng dụng React độc lập trên cùng một trang](#specifying-a-shared-prefix-for-all-generated-ids), và một số trong các ứng dụng này được server-rendered, hãy đảm bảo rằng `identifierPrefix` bạn truyền vào lệnh gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) ở phía client giống với `identifierPrefix` bạn truyền vào các [API server](/reference/react-dom/server) như [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)

```js
// Server
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(
  <App />,
  { identifierPrefix: 'react-app1' }
);
```

```js
// Client
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(
  domNode,
  reactNode,
  { identifierPrefix: 'react-app1' }
);
```

Bạn không cần truyền `identifierPrefix` nếu bạn chỉ có một ứng dụng React trên trang.