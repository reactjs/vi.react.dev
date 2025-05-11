---
title: useId
---

<Intro>

`useId` là một React Hook để tạo ID duy nhất có thể được truyền cho các thuộc tính hỗ trợ tiếp cận.

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useId()` {/*useid*/}

Gọi `useId` ở cấp cao nhất của component để tạo một ID duy nhất:

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

`useId` không nhận bất kỳ tham số nào.

#### Giá trị trả về {/*returns*/}

`useId` trả về một chuỗi ID duy nhất được liên kết với lệnh gọi `useId` cụ thể này trong component cụ thể này.

#### Lưu ý {/*caveats*/}

* `useId` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất của component** hoặc Hook của riêng bạn. Bạn không thể gọi nó bên trong vòng lặp hoặc điều kiện. Nếu bạn cần điều đó, hãy trích xuất một component mới và di chuyển state vào đó.

* `useId` **không nên được sử dụng để tạo key** trong một danh sách. [Key nên được tạo từ dữ liệu của bạn.](/learn/rendering-lists#where-to-get-your-key)

* `useId` hiện không thể được sử dụng trong [Server Components không đồng bộ](/reference/rsc/server-components#async-components-with-server-components).

---

## Cách sử dụng {/*usage*/}

<Pitfall>

**Không gọi `useId` để tạo key trong một danh sách.** [Key nên được tạo từ dữ liệu của bạn.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### Tạo ID duy nhất cho các thuộc tính hỗ trợ tiếp cận {/*generating-unique-ids-for-accessibility-attributes*/}

Gọi `useId` ở cấp cao nhất của component để tạo một ID duy nhất:

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

Sau đó, bạn có thể truyền <CodeStep step={1}>ID đã tạo</CodeStep> cho các thuộc tính khác nhau:

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**Hãy cùng xem qua một ví dụ để thấy khi nào điều này hữu ích.**

[Các thuộc tính hỗ trợ tiếp cận HTML](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) như [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) cho phép bạn chỉ định rằng hai thẻ có liên quan đến nhau. Ví dụ: bạn có thể chỉ định rằng một phần tử (như một input) được mô tả bởi một phần tử khác (như một đoạn văn).

Trong HTML thông thường, bạn sẽ viết nó như thế này:

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  The password should contain at least 18 characters
</p>
```

Tuy nhiên, việc mã hóa cứng các ID như thế này không phải là một phương pháp tốt trong React. Một component có thể được render nhiều lần trên trang--nhưng ID phải là duy nhất! Thay vì mã hóa cứng một ID, hãy tạo một ID duy nhất với `useId`:

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}
```

Bây giờ, ngay cả khi `PasswordField` xuất hiện nhiều lần trên màn hình, các ID được tạo sẽ không xung đột.

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
      <h2>Confirm password</h2>
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

Với [server rendering](/reference/react-dom/server), **`useId` yêu cầu một cây component giống hệt nhau trên server và client**. Nếu cây bạn render trên server và client không khớp chính xác, các ID được tạo sẽ không khớp.

</Pitfall>

<DeepDive>

#### Tại sao useId tốt hơn một bộ đếm tăng dần? {/*why-is-useid-better-than-an-incrementing-counter*/}

Bạn có thể tự hỏi tại sao `useId` tốt hơn việc tăng một biến toàn cục như `nextId++`.

Lợi ích chính của `useId` là React đảm bảo rằng nó hoạt động với [server rendering.](/reference/react-dom/server) Trong quá trình server rendering, các component của bạn tạo ra đầu ra HTML. Sau đó, trên client, [hydration](/reference/react-dom/client/hydrateRoot) đính kèm các trình xử lý sự kiện của bạn vào HTML đã tạo. Để hydration hoạt động, đầu ra của client phải khớp với HTML của server.

Điều này rất khó để đảm bảo với một bộ đếm tăng dần vì thứ tự mà Client Components được hydrate có thể không khớp với thứ tự mà HTML của server được phát ra. Bằng cách gọi `useId`, bạn đảm bảo rằng hydration sẽ hoạt động và đầu ra sẽ khớp giữa server và client.

Bên trong React, `useId` được tạo từ "đường dẫn cha" của component gọi. Đây là lý do tại sao, nếu cây client và server giống nhau, thì "đường dẫn cha" sẽ khớp nhau bất kể thứ tự rendering.

</DeepDive>

---

### Tạo ID cho một số phần tử liên quan {/*generating-ids-for-several-related-elements*/}

Nếu bạn cần cung cấp ID cho nhiều phần tử liên quan, bạn có thể gọi `useId` để tạo một tiền tố chung cho chúng:

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

Điều này cho phép bạn tránh gọi `useId` cho mọi phần tử cần một ID duy nhất.

---

### Chỉ định một tiền tố chung cho tất cả các ID được tạo {/*specifying-a-shared-prefix-for-all-generated-ids*/}

Nếu bạn render nhiều ứng dụng React độc lập trên một trang, hãy truyền `identifierPrefix` làm một tùy chọn cho các lệnh gọi [`createRoot`](/reference/react-dom/client/createRoot#parameters) hoặc [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) của bạn. Điều này đảm bảo rằng các ID được tạo bởi hai ứng dụng khác nhau không bao giờ xung đột vì mọi identifier được tạo bằng `useId` sẽ bắt đầu bằng tiền tố riêng biệt mà bạn đã chỉ định.

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
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
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

Nếu bạn [render nhiều ứng dụng React độc lập trên cùng một trang](#specifying-a-shared-prefix-for-all-generated-ids), và một số ứng dụng này được render phía server, hãy đảm bảo rằng `identifierPrefix` bạn truyền cho lệnh gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) ở phía client giống với `identifierPrefix` bạn truyền cho [API server](/reference/react-dom/server) như [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)

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

Bạn không cần phải truyền `identifierPrefix` nếu bạn chỉ có một ứng dụng React trên trang.
