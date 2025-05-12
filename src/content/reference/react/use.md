---
title: use
---

<Intro>

`use` là một API của React cho phép bạn đọc giá trị của một tài nguyên như [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) hoặc [context](/learn/passing-data-deeply-with-context).

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `use(resource)` {/*use*/}

Gọi `use` trong component của bạn để đọc giá trị của một tài nguyên như [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) hoặc [context](/learn/passing-data-deeply-with-context).

```jsx
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
```

Không giống như React Hooks, `use` có thể được gọi bên trong các vòng lặp và các câu lệnh điều kiện như `if`. Giống như React Hooks, hàm gọi `use` phải là một Component hoặc Hook.

Khi được gọi với một Promise, API `use` tích hợp với [`Suspense`](/reference/react/Suspense) và [error boundaries](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Component gọi `use` sẽ *tạm dừng* trong khi Promise được truyền cho `use` đang ở trạng thái pending. Nếu component gọi `use` được bao bọc trong một Suspense boundary, fallback sẽ được hiển thị. Khi Promise được resolve, Suspense fallback sẽ được thay thế bằng các component được render bằng dữ liệu trả về bởi API `use`. Nếu Promise được truyền cho `use` bị reject, fallback của Error Boundary gần nhất sẽ được hiển thị.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `resource`: Đây là nguồn dữ liệu mà bạn muốn đọc giá trị. Một resource có thể là một [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) hoặc một [context](/learn/passing-data-deeply-with-context).

#### Giá trị trả về {/*returns*/}

API `use` trả về giá trị được đọc từ resource, chẳng hạn như giá trị đã được resolve của một [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) hoặc [context](/learn/passing-data-deeply-with-context).

#### Lưu ý {/*caveats*/}

* API `use` phải được gọi bên trong một Component hoặc một Hook.
* Khi tìm nạp dữ liệu trong một [Server Component](/reference/rsc/server-components), hãy ưu tiên `async` và `await` hơn `use`. `async` và `await` tiếp tục quá trình render từ điểm mà `await` được gọi, trong khi `use` render lại component sau khi dữ liệu được resolve.
* Ưu tiên tạo Promises trong [Server Components](/reference/rsc/server-components) và truyền chúng cho [Client Components](/reference/rsc/use-client) hơn là tạo Promises trong Client Components. Promises được tạo trong Client Components sẽ được tạo lại trên mỗi lần render. Promises được truyền từ một Server Component sang một Client Component sẽ ổn định trên các lần re-render. [Xem ví dụ này](#streaming-data-from-server-to-client).

---

## Cách sử dụng {/*usage*/}

### Đọc context với `use` {/*reading-context-with-use*/}

Khi một [context](/learn/passing-data-deeply-with-context) được truyền cho `use`, nó hoạt động tương tự như [`useContext`](/reference/react/useContext). Trong khi `useContext` phải được gọi ở cấp cao nhất của component, `use` có thể được gọi bên trong các điều kiện như `if` và các vòng lặp như `for`. `use` được ưu tiên hơn `useContext` vì nó linh hoạt hơn.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ... 
```

`use` trả về <CodeStep step={2}>giá trị context</CodeStep> cho <CodeStep step={1}>context</CodeStep> mà bạn đã truyền. Để xác định giá trị context, React tìm kiếm trên cây component và tìm **context provider gần nhất ở phía trên** cho context cụ thể đó.

Để truyền context cho một `Button`, hãy bọc nó hoặc một trong các component cha của nó vào context provider tương ứng.

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

Không quan trọng có bao nhiêu lớp component giữa provider và `Button`. Khi một `Button` *ở bất kỳ đâu* bên trong `Form` gọi `use(ThemeContext)`, nó sẽ nhận được `dark` làm giá trị.

Không giống như [`useContext`](/reference/react/useContext), <CodeStep step={2}>`use`</CodeStep> có thể được gọi trong các điều kiện và vòng lặp như <CodeStep step={1}>`if`</CodeStep>.

```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

<CodeStep step={2}>`use`</CodeStep> được gọi từ bên trong một câu lệnh <CodeStep step={1}>`if`</CodeStep>, cho phép bạn đọc có điều kiện các giá trị từ một Context.

<Pitfall>

Giống như `useContext`, `use(context)` luôn tìm kiếm context provider gần nhất *ở phía trên* component gọi nó. Nó tìm kiếm lên trên và **không** xem xét các context provider trong component mà bạn đang gọi `use(context)`.

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button show={true}>Sign up</Button>
      <Button show={false}>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

### Truyền dữ liệu từ server đến client {/*streaming-data-from-server-to-client*/}

Dữ liệu có thể được truyền từ server đến client bằng cách truyền một Promise như một prop từ một <CodeStep step={1}>Server Component</CodeStep> đến một <CodeStep step={2}>Client Component</CodeStep>.

```js [[1, 4, "App"], [2, 2, "Message"], [3, 7, "Suspense"], [4, 8, "messagePromise", 30], [4, 5, "messagePromise"]]
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

<CodeStep step={2}>Client Component</CodeStep> sau đó nhận <CodeStep step={4}>Promise mà nó nhận được như một prop</CodeStep> và truyền nó cho API <CodeStep step={5}>`use`</CodeStep>. Điều này cho phép <CodeStep step={2}>Client Component</CodeStep> đọc giá trị từ <CodeStep step={4}>Promise</CodeStep> ban đầu được tạo bởi Server Component.

```js [[2, 6, "Message"], [4, 6, "messagePromise"], [4, 7, "messagePromise"], [5, 7, "use"]]
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```
Vì <CodeStep step={2}>`Message`</CodeStep> được bao bọc trong <CodeStep step={3}>[`Suspense`](/reference/react/Suspense)</CodeStep>, fallback sẽ được hiển thị cho đến khi Promise được resolve. Khi Promise được resolve, giá trị sẽ được đọc bởi API <CodeStep step={5}>`use`</CodeStep> và component <CodeStep step={2}>`Message`</CodeStep> sẽ thay thế Suspense fallback.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, "⚛️"));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

</Sandpack>

<Note>

Khi truyền một Promise từ một Server Component đến một Client Component, giá trị đã được resolve của nó phải có thể tuần tự hóa để truyền giữa server và client. Các kiểu dữ liệu như functions không thể tuần tự hóa và không thể là giá trị đã được resolve của một Promise như vậy.

</Note>


<DeepDive>

#### Tôi nên resolve một Promise trong Server Component hay Client Component? {/*resolve-promise-in-server-or-client-component*/}

Một Promise có thể được truyền từ một Server Component đến một Client Component và được resolve trong Client Component với API `use`. Bạn cũng có thể resolve Promise trong một Server Component với `await` và truyền dữ liệu cần thiết cho Client Component như một prop.

```js
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

Nhưng sử dụng `await` trong một [Server Component](/reference/react/components#server-components) sẽ chặn quá trình render của nó cho đến khi câu lệnh `await` kết thúc. Truyền một Promise từ một Server Component đến một Client Component ngăn Promise chặn quá trình render của Server Component.

</DeepDive>

### Xử lý các Promise bị reject {/*dealing-with-rejected-promises*/}

Trong một số trường hợp, một Promise được truyền cho `use` có thể bị reject. Bạn có thể xử lý các Promise bị reject bằng một trong hai cách:

1. [Hiển thị lỗi cho người dùng bằng error boundary.](#displaying-an-error-to-users-with-error-boundary)
2. [Cung cấp một giá trị thay thế với `Promise.catch`](#providing-an-alternative-value-with-promise-catch)

<Pitfall>
Không thể gọi `use` trong một khối try-catch. Thay vì một khối try-catch, [hãy bọc component của bạn trong một Error Boundary](#displaying-an-error-to-users-with-error-boundary), hoặc [cung cấp một giá trị thay thế cho use với phương thức `.catch` của Promise](#providing-an-alternative-value-with-promise-catch).
</Pitfall>

#### Hiển thị lỗi cho người dùng bằng error boundary {/*displaying-an-error-to-users-with-error-boundary*/}

Nếu bạn muốn hiển thị lỗi cho người dùng khi một Promise bị reject, bạn có thể sử dụng một [error boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Để sử dụng một error boundary, hãy bọc component nơi bạn đang gọi API `use` trong một error boundary. Nếu Promise được truyền cho `use` bị reject, fallback cho error boundary sẽ được hiển thị.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <Suspense fallback={<p>⌛Downloading message...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 1000));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

#### Cung cấp một giá trị thay thế với `Promise.catch` {/*providing-an-alternative-value-with-promise-catch*/}

Nếu bạn muốn cung cấp một giá trị thay thế khi Promise được truyền cho `use` bị reject, bạn có thể sử dụng phương thức <CodeStep step={1}>[`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)</CodeStep> của Promise.

```js [[1, 6, "catch"],[2, 7, "return"]]
import { Message } from './message.js';

export default function App() {
  const messagePromise = new Promise((resolve, reject) => {
    reject();
  }).catch(() => {
    return "no new message found.";
  });

  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Để sử dụng phương thức <CodeStep step={1}>`catch`</CodeStep> của Promise, hãy gọi <CodeStep step={1}>`catch`</CodeStep> trên đối tượng Promise. <CodeStep step={1}>`catch`</CodeStep> nhận một đối số duy nhất: một hàm nhận một thông báo lỗi làm đối số. Bất cứ điều gì được <CodeStep step={2}>trả về</CodeStep> bởi hàm được truyền cho <CodeStep step={1}>`catch`</CodeStep> sẽ được sử dụng làm giá trị đã được resolve của Promise.

---

## Khắc phục sự cố {/*troubleshooting*/}

### "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

Bạn đang gọi `use` bên ngoài một React Component hoặc hàm Hook, hoặc gọi `use` trong một khối try-catch. Nếu bạn đang gọi `use` bên trong một khối try-catch, hãy bọc component của bạn trong một error boundary, hoặc gọi `catch` của Promise để bắt lỗi và resolve Promise với một giá trị khác. [Xem các ví dụ này](#dealing-with-rejected-promises).

Nếu bạn đang gọi `use` bên ngoài một React Component hoặc hàm Hook, hãy di chuyển lệnh gọi `use` đến một React Component hoặc hàm Hook.

```jsx
function MessageComponent({messagePromise}) {
  function download() {
    // ❌ hàm gọi `use` không phải là một Component hoặc Hook
    const message = use(messagePromise);
    // ...
```

Thay vào đó, hãy gọi `use` bên ngoài bất kỳ closure component nào, nơi hàm gọi `use` là một Component hoặc Hook.

```jsx
function MessageComponent({messagePromise}) {
  // ✅ `use` đang được gọi từ một component. 
  const message = use(messagePromise);
  // ...
```
