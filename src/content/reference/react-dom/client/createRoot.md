---
title: createRoot
---

<Intro>

`createRoot` cho phép bạn tạo một gốc để hiển thị các thành phần React bên trong một nút DOM của trình duyệt.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

Gọi `createRoot` để tạo một gốc React để hiển thị nội dung bên trong một phần tử DOM của trình duyệt.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React sẽ tạo một gốc cho `domNode` và tiếp quản việc quản lý DOM bên trong nó. Sau khi bạn đã tạo một gốc, bạn cần gọi [`root.render`](#root-render) để hiển thị một thành phần React bên trong nó:

```js
root.render(<App />);
```

Một ứng dụng được xây dựng hoàn toàn bằng React thường chỉ có một lệnh gọi `createRoot` cho thành phần gốc của nó. Một trang sử dụng "rắc" React cho các phần của trang có thể có nhiều gốc riêng biệt khi cần thiết.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `domNode`: Một [phần tử DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React sẽ tạo một gốc cho phần tử DOM này và cho phép bạn gọi các hàm trên gốc, chẳng hạn như `render` để hiển thị nội dung React đã được render.

* **tùy chọn** `options`: Một đối tượng với các tùy chọn cho gốc React này.

  * **tùy chọn** `onCaughtError`: Callback được gọi khi React bắt được lỗi trong một Error Boundary. Được gọi với `error` bị bắt bởi Error Boundary và một đối tượng `errorInfo` chứa `componentStack`.
  * **tùy chọn** `onUncaughtError`: Callback được gọi khi một lỗi được ném ra và không bị bắt bởi một Error Boundary. Được gọi với `error` đã được ném ra và một đối tượng `errorInfo` chứa `componentStack`.
  * **tùy chọn** `onRecoverableError`: Callback được gọi khi React tự động phục hồi từ các lỗi. Được gọi với một `error` mà React ném ra và một đối tượng `errorInfo` chứa `componentStack`. Một số lỗi có thể phục hồi có thể bao gồm nguyên nhân gây ra lỗi ban đầu là `error.cause`.
  * **tùy chọn** `identifierPrefix`: Một tiền tố chuỗi mà React sử dụng cho các ID được tạo bởi [`useId`.](/reference/react/useId) Hữu ích để tránh xung đột khi sử dụng nhiều gốc trên cùng một trang.

#### Trả về {/*returns*/}

`createRoot` trả về một đối tượng với hai phương thức: [`render`](#root-render) và [`unmount`.](#root-unmount)

#### Lưu ý {/*caveats*/}
* Nếu ứng dụng của bạn được render phía máy chủ, việc sử dụng `createRoot()` không được hỗ trợ. Sử dụng [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) thay thế.
* Bạn có thể chỉ có một lệnh gọi `createRoot` trong ứng dụng của mình. Nếu bạn sử dụng một framework, nó có thể thực hiện lệnh gọi này cho bạn.
* Khi bạn muốn render một đoạn JSX ở một phần khác của cây DOM mà không phải là con của thành phần của bạn (ví dụ: một modal hoặc một tooltip), hãy sử dụng [`createPortal`](/reference/react-dom/createPortal) thay vì `createRoot`.

---

### `root.render(reactNode)` {/*root-render*/}

Gọi `root.render` để hiển thị một đoạn [JSX](/learn/writing-markup-with-jsx) ("React node") vào nút DOM của trình duyệt của gốc React.

```js
root.render(<App />);
```

React sẽ hiển thị `<App />` trong `root` và tiếp quản việc quản lý DOM bên trong nó.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*root-render-parameters*/}

* `reactNode`: Một *React node* mà bạn muốn hiển thị. Đây thường sẽ là một đoạn JSX như `<App />`, nhưng bạn cũng có thể truyền một phần tử React được xây dựng bằng [`createElement()`](/reference/react/createElement), một chuỗi, một số, `null` hoặc `undefined`.


#### Trả về {/*root-render-returns*/}

`root.render` trả về `undefined`.

#### Lưu ý {/*root-render-caveats*/}

* Lần đầu tiên bạn gọi `root.render`, React sẽ xóa tất cả nội dung HTML hiện có bên trong gốc React trước khi render thành phần React vào đó.

* Nếu nút DOM của gốc của bạn chứa HTML được tạo bởi React trên máy chủ hoặc trong quá trình xây dựng, hãy sử dụng [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) thay thế, nó sẽ đính kèm các trình xử lý sự kiện vào HTML hiện có.

* Nếu bạn gọi `render` trên cùng một gốc nhiều lần, React sẽ cập nhật DOM khi cần thiết để phản ánh JSX mới nhất mà bạn đã truyền. React sẽ quyết định phần nào của DOM có thể được sử dụng lại và phần nào cần được tạo lại bằng cách ["ghép nó lại"](/learn/preserving-and-resetting-state) với cây đã được render trước đó. Gọi `render` trên cùng một gốc một lần nữa tương tự như gọi hàm [`set`](/reference/react/useState#setstate) trên thành phần gốc: React tránh các cập nhật DOM không cần thiết.

* Mặc dù việc render là đồng bộ sau khi nó bắt đầu, `root.render(...)` thì không. Điều này có nghĩa là mã sau `root.render()` có thể chạy trước bất kỳ hiệu ứng nào (`useLayoutEffect`, `useEffect`) của quá trình render cụ thể đó được kích hoạt. Điều này thường ổn và hiếm khi cần điều chỉnh. Trong những trường hợp hiếm hoi mà thời gian hiệu ứng quan trọng, bạn có thể bọc `root.render(...)` trong [`flushSync`](https://react.dev/reference/react-dom/client/flushSync) để đảm bảo quá trình render ban đầu chạy hoàn toàn đồng bộ.
  
  ```js
  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
  // 🚩 HTML sẽ không bao gồm <App /> đã được render:
  console.log(document.body.innerHTML);
  ```

---

### `root.unmount()` {/*root-unmount*/}

Gọi `root.unmount` để phá hủy một cây đã được render bên trong một gốc React.

```js
root.unmount();
```

Một ứng dụng được xây dựng hoàn toàn bằng React thường sẽ không có bất kỳ lệnh gọi nào đến `root.unmount`.

Điều này chủ yếu hữu ích nếu nút DOM của gốc React của bạn (hoặc bất kỳ tổ tiên nào của nó) có thể bị xóa khỏi DOM bởi một số mã khác. Ví dụ: hãy tưởng tượng một bảng điều khiển tab jQuery loại bỏ các tab không hoạt động khỏi DOM. Nếu một tab bị xóa, mọi thứ bên trong nó (bao gồm cả các gốc React bên trong) cũng sẽ bị xóa khỏi DOM. Trong trường hợp đó, bạn cần báo cho React "dừng" quản lý nội dung của gốc đã bị xóa bằng cách gọi `root.unmount`. Nếu không, các thành phần bên trong gốc đã bị xóa sẽ không biết cách dọn dẹp và giải phóng các tài nguyên toàn cục như đăng ký.

Gọi `root.unmount` sẽ unmount tất cả các thành phần trong gốc và "tách" React khỏi nút DOM gốc, bao gồm cả việc xóa bất kỳ trình xử lý sự kiện hoặc trạng thái nào trong cây.


#### Tham số {/*root-unmount-parameters*/}

`root.unmount` không chấp nhận bất kỳ tham số nào.


#### Trả về {/*root-unmount-returns*/}

`root.unmount` trả về `undefined`.

#### Lưu ý {/*root-unmount-caveats*/}

* Gọi `root.unmount` sẽ unmount tất cả các thành phần trong cây và "tách" React khỏi nút DOM gốc.

* Sau khi bạn gọi `root.unmount`, bạn không thể gọi lại `root.render` trên cùng một gốc. Cố gắng gọi `root.render` trên một gốc đã unmount sẽ ném ra lỗi "Không thể cập nhật một gốc đã unmount". Tuy nhiên, bạn có thể tạo một gốc mới cho cùng một nút DOM sau khi gốc trước đó cho nút đó đã được unmount.

---

## Cách sử dụng {/*usage*/}

### Render một ứng dụng được xây dựng hoàn toàn bằng React {/*rendering-an-app-fully-built-with-react*/}

Nếu ứng dụng của bạn được xây dựng hoàn toàn bằng React, hãy tạo một gốc duy nhất cho toàn bộ ứng dụng của bạn.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Thông thường, bạn chỉ cần chạy mã này một lần khi khởi động. Nó sẽ:

1. Tìm <CodeStep step={1}>nút DOM của trình duyệt</CodeStep> được xác định trong HTML của bạn.
2. Hiển thị <CodeStep step={2}>thành phần React</CodeStep> cho ứng dụng của bạn bên trong.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>Ứng dụng của tôi</title></head>
  <body>
    {/* Đây là nút DOM */}
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Xin chào, thế giới!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Bạn đã nhấp vào tôi {count} lần
    </button>
  );
}
```

</Sandpack>

**Nếu ứng dụng của bạn được xây dựng hoàn toàn bằng React, bạn không cần tạo thêm bất kỳ gốc nào hoặc gọi lại [`root.render`](#root-render).**

Từ thời điểm này trở đi, React sẽ quản lý DOM của toàn bộ ứng dụng của bạn. Để thêm nhiều thành phần hơn, [lồng chúng bên trong thành phần `App`.](/learn/importing-and-exporting-components) Khi bạn cần cập nhật UI, mỗi thành phần của bạn có thể thực hiện việc này bằng cách [sử dụng state.](/reference/react/useState) Khi bạn cần hiển thị nội dung bổ sung như modal hoặc tooltip bên ngoài nút DOM, [render nó bằng một portal.](/reference/react-dom/createPortal)

<Note>

Khi HTML của bạn trống, người dùng sẽ thấy một trang trống cho đến khi mã JavaScript của ứng dụng tải và chạy:

```html
<div id="root"></div>
```

Điều này có thể cảm thấy rất chậm! Để giải quyết vấn đề này, bạn có thể tạo HTML ban đầu từ các thành phần của mình [trên máy chủ hoặc trong quá trình xây dựng.](/reference/react-dom/server) Sau đó, khách truy cập của bạn có thể đọc văn bản, xem hình ảnh và nhấp vào liên kết trước khi bất kỳ mã JavaScript nào tải. Chúng tôi khuyên bạn nên [sử dụng một framework](/learn/start-a-new-react-project#production-grade-react-frameworks) thực hiện tối ưu hóa này ngay lập tức. Tùy thuộc vào thời điểm nó chạy, điều này được gọi là *server-side rendering (SSR)* hoặc *static site generation (SSG).*

</Note>

<Pitfall>

**Các ứng dụng sử dụng server rendering hoặc static generation phải gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) thay vì `createRoot`.** React sau đó sẽ *hydrate* (sử dụng lại) các nút DOM từ HTML của bạn thay vì phá hủy và tạo lại chúng.

</Pitfall>

---

### Render một trang được xây dựng một phần bằng React {/*rendering-a-page-partially-built-with-react*/}

Nếu trang của bạn [không được xây dựng hoàn toàn bằng React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), bạn có thể gọi `createRoot` nhiều lần để tạo một gốc cho mỗi phần UI cấp cao nhất được quản lý bởi React. Bạn có thể hiển thị nội dung khác nhau trong mỗi gốc bằng cách gọi [`root.render`.](#root-render)

Ở đây, hai thành phần React khác nhau được render vào hai nút DOM được xác định trong tệp `index.html`:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>Ứng dụng của tôi</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>Đoạn văn này không được render bởi React (mở index.html để xác minh).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode); 
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode); 
commentRoot.render(<Comments />);
```

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Trang chủ</NavLink>
      <NavLink href="/about">Giới thiệu</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Bình luận</h2>
      <Comment text="Xin chào!" author="Sophie" />
      <Comment text="Bạn khỏe không?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

Bạn cũng có thể tạo một nút DOM mới bằng [`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) và thêm nó vào tài liệu theo cách thủ công.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode); 
root.render(<Comment />);
document.body.appendChild(domNode); // Bạn có thể thêm nó vào bất kỳ đâu trong tài liệu
```

Để xóa cây React khỏi nút DOM và dọn dẹp tất cả các tài nguyên được sử dụng bởi nó, hãy gọi [`root.unmount`.](#root-unmount)

```js
root.unmount();
```

Điều này chủ yếu hữu ích nếu các thành phần React của bạn nằm bên trong một ứng dụng được viết bằng một framework khác.

---

### Cập nhật một thành phần gốc {/*updating-a-root-component*/}

Bạn có thể gọi `render` nhiều lần trên cùng một gốc. Miễn là cấu trúc cây thành phần khớp với những gì đã được render trước đó, React sẽ [giữ lại trạng thái.](/learn/preserving-and-resetting-state) Lưu ý cách bạn có thể nhập vào đầu vào, điều đó có nghĩa là các bản cập nhật từ các lệnh gọi `render` lặp đi lặp lại mỗi giây trong ví dụ này không mang tính phá hủy:

<Sandpack>

```js src/index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Xin chào, thế giới! {counter}</h1>
      <input placeholder="Nhập gì đó vào đây" />
    </>
  );
}
```

</Sandpack>

Việc gọi `render` nhiều lần là không phổ biến. Thông thường, các thành phần của bạn sẽ [cập nhật state](/reference/react/useState) thay thế.

### Ghi nhật ký lỗi trong sản xuất {/*error-logging-in-production*/}

Theo mặc định, React sẽ ghi tất cả các lỗi vào bảng điều khiển. Để triển khai báo cáo lỗi của riêng bạn, bạn có thể cung cấp các tùy chọn gốc trình xử lý lỗi tùy chọn `onUncaughtError`, `onCaughtError` và `onRecoverableError`:

```js [[1, 6, "onCaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack", 15]]
import { createRoot } from "react-dom/client";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== "Known error") {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack,
      });
    }
  },
});
```

Tùy chọn <CodeStep step={1}>onCaughtError</CodeStep> là một hàm được gọi với hai đối số:

1. <CodeStep step={2}>lỗi</CodeStep> đã được ném ra.
2. Một đối tượng <CodeStep step={3}>errorInfo</CodeStep> chứa <CodeStep step={4}>componentStack</CodeStep> của lỗi.

Cùng với `onUncaughtError` và `onRecoverableError`, bạn có thể triển khai hệ thống báo cáo lỗi của riêng mình:

<Sandpack>

```js src/reportError.js
function reportError({ type, error, errorInfo }) {
  // Việc triển khai cụ thể là tùy thuộc vào bạn.
  // `console.error()` chỉ được sử dụng cho mục đích trình diễn.
  console.error(type, error, "Component Stack: ");
  console.error("Component Stack: ", errorInfo.componentStack);
}

export function onCaughtErrorProd(error, errorInfo) {
  if (error.message !== "Known error") {
    reportError({ type: "Caught", error, errorInfo });
  }
}

export function onUncaughtErrorProd(error, errorInfo) {
  reportError({ type: "Uncaught", error, errorInfo });
}

export function onRecoverableErrorProd(error, errorInfo) {
  reportError({ type: "Recoverable", error, errorInfo });
}
```

```js src/index.js active
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
const root = createRoot(container, {
  // Hãy nhớ xóa các tùy chọn này trong quá trình phát triển để tận dụng
  // các trình xử lý mặc định của React hoặc triển khai lớp phủ của riêng bạn để phát triển.
  // Các trình xử lý chỉ được chỉ định vô điều kiện ở đây cho mục đích trình diễn.
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});
root.render(<App />);
```

```js src/App.js
import { Component, useState } from "react";

function Boom() {
  foo.bar = "baz";
}

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Đã xảy ra lỗi.</h1>;
    }
    return this.props.children;
  }
}

export default function App() {
  const [triggerUncaughtError, settriggerUncaughtError] = useState(false);
  const [triggerCaughtError, setTriggerCaughtError] = useState(false);

  return (
    <>
      <button onClick={() => settriggerUncaughtError(true)}>
        Kích hoạt lỗi không bị bắt
      </button>
      {triggerUncaughtError && <Boom />}
      <button onClick={() => setTriggerCaughtError(true)}>
        Kích hoạt lỗi bị bắt
      </button>
      {triggerCaughtError && (
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      )}
    </>
  );
}
```

</Sandpack>

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi đã tạo một gốc, nhưng không có gì được hiển thị {/*ive-created-a-root-but-nothing-is-displayed*/}

Đảm bảo rằng bạn không quên thực sự *render* ứng dụng của mình vào gốc:

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Cho đến khi bạn làm điều đó, không có gì được hiển thị.

---

### Tôi gặp lỗi: "Bạn đã truyền một đối số thứ hai cho root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

Một lỗi phổ biến là truyền các tùy chọn cho `createRoot` cho `root.render(...)`:

<ConsoleBlock level="error">

Cảnh báo: Bạn đã truyền một đối số thứ hai cho root.render(...) nhưng nó chỉ chấp nhận một đối số.

</ConsoleBlock>

Để sửa lỗi, hãy truyền các tùy chọn gốc cho `createRoot(...)`, không phải `root.render(...)`:
```js {2,5}
// 🚩 Sai: root.render chỉ nhận một đối số.
root.render(App, {onUncaughtError});

// ✅ Đúng: truyền các tùy chọn cho createRoot.
const root = createRoot(container, {onUncaughtError}); 
root.render(<App />);
```

---

### Tôi gặp lỗi: "Target container is not a DOM element" {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

Lỗi này có nghĩa là bất cứ thứ gì bạn đang truyền cho `createRoot` không phải là một nút DOM.

Nếu bạn không chắc chắn điều gì đang xảy ra, hãy thử ghi nhật ký nó:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

Ví dụ: nếu `domNode` là `null`, điều đó có nghĩa là [`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) trả về `null`. Điều này sẽ xảy ra nếu không có nút nào trong tài liệu có ID đã cho tại thời điểm bạn gọi. Có thể có một vài lý do cho việc này:

1. ID bạn đang tìm kiếm có thể khác với ID bạn đã sử dụng trong tệp HTML. Kiểm tra lỗi chính tả!
2. Thẻ `<script>` của bundle của bạn không thể "nhìn thấy" bất kỳ nút DOM nào xuất hiện *sau* nó trong HTML.

Một cách phổ biến khác để gặp lỗi này là viết `createRoot(<App />)` thay vì `createRoot(domNode)`.

---

### Tôi gặp lỗi: "Functions are not valid as a React child." {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

Lỗi này có nghĩa là bất cứ thứ gì bạn đang truyền cho `root.render` không phải là một thành phần React.

Điều này có thể xảy ra nếu bạn gọi `root.render` với `Component` thay vì `<Component />`:

```js {2,5}
// 🚩 Sai: App là một hàm, không phải một thành phần.
root.render(App);

// ✅ Đúng: <App /> là một thành phần.
root.render(<App />);
```

Hoặc nếu bạn truyền một hàm cho `root.render`, thay vì kết quả của việc gọi nó:

```js {2,5}
// 🚩 Sai: createApp là một hàm, không phải một thành phần.
root.render(createApp);

// ✅ Đúng: gọi createApp để trả về một thành phần.
root.render(createApp());
```

---

### HTML được render phía máy chủ của tôi được tạo lại từ đầu {/*my-server-rendered-html-gets-re-created-from-scratch*/}

Nếu ứng dụng của bạn được render phía máy chủ và bao gồm HTML ban đầu được tạo bởi React, bạn có thể nhận thấy rằng việc tạo một gốc và gọi `root.render` sẽ xóa tất cả HTML đó và sau đó tạo lại tất cả các nút DOM từ đầu. Điều này có thể chậm hơn, đặt lại vị trí tiêu điểm và cuộn và có thể làm mất các đầu vào khác của người dùng.

Các ứng dụng được render phía máy chủ phải sử dụng [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) thay vì `createRoot`:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

Lưu ý rằng API của nó khác. Đặc biệt, thường sẽ không có lệnh gọi `root.render` nào nữa.
