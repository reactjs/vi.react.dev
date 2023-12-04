---
title: lazy
---

<Intro>

`lazy` cho phép bạn trì hoãn việc tải code của component cho tới khi được render lần đầu tiên.

```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `lazy(load)` {/*lazy*/}

Gọi `lazy` bên ngoài các component của bạn để khai báo một React component được lazy-load:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[Xem thêm ví dụ ở dưới.](#usage)

#### Tham số {/*parameters*/}

<<<<<<< HEAD
* `load`: Một function trả về một [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) hoặc một *thenable* (một đối tượng giống Promise với một phương thức `then`). React sẽ không gọi hàm `load` cho tới khi bạn render component được trả về. Sau khi React gọi `load` lần đầu tiên, React sẽ đợi cho tới khi hàm này được giải quyết xong (resolve), sau đó sẽ render giá trị được giải quyết như một React component. Cả Promise được trả về và giá trị đã được giải quyết của Promise đó đều được lưu lại, nên React sẽ không gọi `load` thêm nữa. Nếu Promise từ chối, React sẽ `throw` lý do từ chối cho Error Boundary gần nhất để xử lý.
=======
* `load`: A function that returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or another *thenable* (a Promise-like object with a `then` method). React will not call `load` until the first time you attempt to render the returned component. After React first calls `load`, it will wait for it to resolve, and then render the resolved value's `.default` as a React component. Both the returned Promise and the Promise's resolved value will be cached, so React will not call `load` more than once. If the Promise rejects, React will `throw` the rejection reason for the nearest Error Boundary to handle.
>>>>>>> 943e3ce4e52be56bcd75b679448847302f557da1

#### Giá trị trả về {/*returns*/}

`lazy` trả về một React component mà bạn có thể render. Khi đoạn code cho lazy component đó đang được tải, việc thực hiện render nó sẽ *được hoãn lại.* Sử dụng [`<Suspense>`](/reference/react/Suspense) để hiển thị một chỉ báo đang tải (loading).

---

### `load` function {/*load*/}

#### Parameters {/*load-parameters*/}

`load` receives no parameters.

#### Returns {/*load-returns*/}

You need to return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or some other *thenable* (a Promise-like object with a `then` method). It needs to eventually resolve to an object whose `.default` property is a valid React component type, such as a function, [`memo`](/reference/react/memo), or a [`forwardRef`](/reference/react/forwardRef) component.

---

## Các sử dụng {/*usage*/}

### Lazy-loading components với Suspense {/*suspense-for-code-splitting*/}

Thông thường, bạn import các component bằng khai báo tĩnh [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import):

```js
import MarkdownPreview from './MarkdownPreview.js';
```

Để trì hoãn việc tải code của component cho tới khi nó được render lần đầu tiên, thay thế import với:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

<<<<<<< HEAD
Đoạn code này phụ thuộc vào [dynamic `import()`,](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) có thể sẽ cần được hỗ trợ bởi bundler hoặc framework của bạn.
=======
This code relies on [dynamic `import()`,](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) which might require support from your bundler or framework. Using this pattern requires that the lazy component you're importing was exported as the `default` export.
>>>>>>> 943e3ce4e52be56bcd75b679448847302f557da1

Bây giờ code của component sẽ tải khi được yêu cầu, bạn sẽ cần phải xác định cái gì sẽ được hiển thị khi component đang được tải. Bạn có thể làm điều này bằng việc bọc lazy component hoặc bất kì phần tử cha của nó vào trong [`<Suspense>`](/reference/react/Suspense):

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
 </Suspense>
```

Trong ví dụ này, đoạn code cho `MarkdownPreview` sẽ không được tải cho tới khi bạn thực thi việc render nó. Nếu `MarkdownPreview` vẫn chưa được tải xong, `Loading` sẽ được hiển thị vào vị trí của nó. Hãy thử tích vào checkbox dưới đây:

<Sandpack>

```js App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Thêm một khoảng thời gian trì hoãn để bạn có thể thấy được loading state
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js Loading.js
export default function Loading() {
  return <p><i>Loading...</i></p>;
}
```

```js MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

Đoạn demo này được tải với một khoảng thời gian trì hoãn cố ý. Lần sau khi bạn bỏ chọn và chọn lại, `Preview` sẽ được lưu lại, lên sẽ không còn loading state nữa. Để nhìn lại loading state, hãy bấm "Reset" trên sandbox.

[Tìm hiểu thêm về quản lý các loading state với Suspense.](/reference/react/Suspense)

---

## Khắc phục sự cố {/*troubleshooting*/}

### State của `lazy` component của tôi bị đặt lại ngoài ý muốn {/*my-lazy-components-state-gets-reset-unexpectedly*/}

Không khai báo các `lazy` component *bên trong* các component khác:

```js {4-5}
import { lazy } from 'react';

function Editor() {
  // 🔴 Bad: Điều này sẽ khiến các state bị đặt lại khi render lại
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

Thay vào đó, luôn luôn khai báo chúng ở trên cùng module của bạn:

```js {3-4}
import { lazy } from 'react';

// ✅ Good: Khai báo các lazy component bên ngoài các component
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```
