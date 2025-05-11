---
title: captureOwnerStack
---

<Intro>

`captureOwnerStack` đọc Owner Stack hiện tại trong quá trình phát triển và trả về nó dưới dạng một chuỗi nếu có.

```js
const stack = captureOwnerStack();
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `captureOwnerStack()` {/*captureownerstack*/}

Gọi `captureOwnerStack` để lấy Owner Stack hiện tại.

```js {5,5}
import * as React from 'react';

function Component() {
  if (process.env.NODE_ENV !== 'production') {
    const ownerStack = React.captureOwnerStack();
    console.log(ownerStack);
  }
}
```

#### Tham số {/*parameters*/}

`captureOwnerStack` không nhận bất kỳ tham số nào.

#### Giá trị trả về {/*returns*/}

`captureOwnerStack` trả về `string | null`.

Owner Stack có sẵn trong
- Quá trình render Component
- Các Effect (ví dụ: `useEffect`)
- Các trình xử lý sự kiện của React (ví dụ: `<button onClick={...} />`)
- Các trình xử lý lỗi của React ([Tùy chọn React Root](/reference/react-dom/client/createRoot#parameters) `onCaughtError`, `onRecoverableError` và `onUncaughtError`)

Nếu không có Owner Stack nào khả dụng, `null` sẽ được trả về (xem [Khắc phục sự cố: Owner Stack là `null`](#the-owner-stack-is-null)).

#### Lưu ý {/*caveats*/}

- Owner Stack chỉ khả dụng trong quá trình phát triển. `captureOwnerStack` sẽ luôn trả về `null` bên ngoài quá trình phát triển.

<DeepDive>

#### Owner Stack so với Component Stack {/*owner-stack-vs-component-stack*/}

Owner Stack khác với Component Stack có sẵn trong các trình xử lý lỗi của React như [`errorInfo.componentStack` trong `onUncaughtError`](/reference/react-dom/client/hydrateRoot#show-a-dialog-for-uncaught-errors).

Ví dụ: xem xét đoạn mã sau:

<Sandpack>

```js src/App.js
import {Suspense} from 'react';

function SubComponent({disabled}) {
  if (disabled) {
    throw new Error('disabled');
  }
}

export function Component({label}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <SubComponent key={label} disabled={label === 'disabled'} />
    </fieldset>
  );
}

function Navigation() {
  return null;
}

export default function App({children}) {
  return (
    <Suspense fallback="loading...">
      <main>
        <Navigation />
        {children}
      </main>
    </Suspense>
  );
}
```

```js src/index.js
import {captureOwnerStack} from 'react';
import {createRoot} from 'react-dom/client';
import App, {Component} from './App.js';
import './styles.css';

createRoot(document.createElement('div'), {
  onUncaughtError: (error, errorInfo) => {
    // Các stack được ghi lại thay vì hiển thị chúng trực tiếp trong UI để
    // làm nổi bật rằng các trình duyệt sẽ áp dụng sourcemap cho các stack đã ghi lại.
    // Lưu ý rằng sourcemapping chỉ được áp dụng trong bảng điều khiển trình duyệt thực chứ không
    // trong bảng điều khiển giả được hiển thị trên trang này.
    // Nhấn "fork" để có thể xem stack đã được sourcemap trong một bảng điều khiển thực.
    console.log(errorInfo.componentStack);
    console.log(captureOwnerStack());
  },
}).render(
  <App>
    <Component label="disabled" />
  </App>
);
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <p>Kiểm tra đầu ra của console.</p>
  </body>
</html>
```

</Sandpack>

`SubComponent` sẽ ném ra một lỗi.
Component Stack của lỗi đó sẽ là

```
at SubComponent
at fieldset
at Component
at main
at React.Suspense
at App
```

Tuy nhiên, Owner Stack sẽ chỉ đọc

```
at Component
```

Cả `App` và các component DOM (ví dụ: `fieldset`) đều không được coi là Owner trong Stack này vì chúng không đóng góp vào việc "tạo" node chứa `SubComponent`. `App` và các component DOM chỉ chuyển tiếp node. `App` chỉ render node `children` trái ngược với `Component`, component này đã tạo một node chứa `SubComponent` thông qua `<SubComponent />`.

Cả `Navigation` và `legend` đều không có trong stack vì nó chỉ là một sibling của một node chứa `<SubComponent />`.

`SubComponent` bị bỏ qua vì nó đã là một phần của callstack.

</DeepDive>

## Cách sử dụng {/*usage*/}

### Cải thiện lớp phủ lỗi tùy chỉnh {/*enhance-a-custom-error-overlay*/}

```js [[1, 5, "console.error"], [4, 7, "captureOwnerStack"]]
import { captureOwnerStack } from "react";
import { instrumentedConsoleError } from "./errorOverlay";

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Lưu ý rằng trong một ứng dụng thực tế, console.error có thể được
    // gọi với nhiều đối số mà bạn nên tính đến.
    consoleMessage: args[0],
    ownerStack,
  });
};
```

Nếu bạn chặn các lệnh gọi <CodeStep step={1}>`console.error`</CodeStep> để làm nổi bật chúng trong lớp phủ lỗi, bạn có thể gọi <CodeStep step={2}>`captureOwnerStack`</CodeStep> để bao gồm Owner Stack.

<Sandpack>

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>Ứng dụng của tôi</title>
</head>
<body>
<!--
  Hộp thoại lỗi trong HTML thuần
  vì lỗi trong ứng dụng React có thể bị sập.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red">Lỗi</h1>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h2 class="-mb-20">Owner Stack:</h4>
  <pre id="error-owner-stack" class="nowrap"></pre>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Đóng
  </button>
</div>
<!-- Đây là node DOM -->
<div id="root"></div>
</body>
</html>

```

```js src/errorOverlay.js

export function onConsoleError({ consoleMessage, ownerStack }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorBody = document.getElementById("error-body");
  const errorOwnerStack = document.getElementById("error-owner-stack");

  // Hiển thị thông báo console.error()
  errorBody.innerText = consoleMessage;

  // Hiển thị owner stack
  errorOwnerStack.innerText = ownerStack;

  // Hiển thị hộp thoại
  errorDialog.classList.remove("hidden");
}
```

```js src/index.js active
import { captureOwnerStack } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import { onConsoleError } from "./errorOverlay";
import './styles.css';

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Lưu ý rằng trong một ứng dụng thực tế, console.error có thể được
    // gọi với nhiều đối số mà bạn nên tính đến.
    consoleMessage: args[0],
    ownerStack,
  });
};

const container = document.getElementById("root");
createRoot(container).render(<App />);
```

```js src/App.js
function Component() {
  return <button onClick={() => console.error('Some console error')}>Kích hoạt console.error()</button>;
}

export default function App() {
  return <Component />;
}
```

</Sandpack>

## Khắc phục sự cố {/*troubleshooting*/}

### Owner Stack là `null` {/*the-owner-stack-is-null*/}

Lệnh gọi `captureOwnerStack` xảy ra bên ngoài một hàm được kiểm soát bởi React, ví dụ: trong một callback `setTimeout`, sau một lệnh gọi `fetch` hoặc trong một trình xử lý sự kiện DOM tùy chỉnh. Trong quá trình render, Effects, trình xử lý sự kiện React và trình xử lý lỗi React (ví dụ: `hydrateRoot#options.onCaughtError`), Owner Stack sẽ khả dụng.

Trong ví dụ dưới đây, việc nhấp vào nút sẽ ghi lại một Owner Stack trống vì `captureOwnerStack` đã được gọi trong một trình xử lý sự kiện DOM tùy chỉnh. Owner Stack phải được chụp sớm hơn, ví dụ: bằng cách di chuyển lệnh gọi `captureOwnerStack` vào phần thân Effect.
<Sandpack>

```js
import {captureOwnerStack, useEffect} from 'react';

export default function App() {
  useEffect(() => {
    // Nên gọi `captureOwnerStack` ở đây.
    function handleEvent() {
      // Gọi nó trong một trình xử lý sự kiện DOM tùy chỉnh là quá muộn.
      // Owner Stack sẽ là `null` tại thời điểm này.
      console.log('Owner Stack: ', captureOwnerStack());
    }

    document.addEventListener('click', handleEvent);

    return () => {
      document.removeEventListener('click', handleEvent);
    }
  })

  return <button>Nhấp vào tôi để thấy rằng Owner Stack không khả dụng trong trình xử lý sự kiện DOM tùy chỉnh</button>;
}
```

</Sandpack>

### `captureOwnerStack` không khả dụng {/*captureownerstack-is-not-available*/}

`captureOwnerStack` chỉ được xuất trong các bản dựng dành cho quá trình phát triển. Nó sẽ là `undefined` trong các bản dựng production. Nếu `captureOwnerStack` được sử dụng trong các tệp được đóng gói cho cả production và development, bạn nên truy cập có điều kiện từ một namespace import.

```js
// Không sử dụng named import của `captureOwnerStack` trong các tệp được đóng gói cho development và production.
import {captureOwnerStack} from 'react';
// Sử dụng namespace import thay thế và truy cập `captureOwnerStack` có điều kiện.
import * as React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const ownerStack = React.captureOwnerStack();
  console.log('Owner Stack', ownerStack);
}
```
