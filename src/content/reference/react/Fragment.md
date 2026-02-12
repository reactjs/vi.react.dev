---
title: <Fragment> (<>...</>)
---

<Intro>

<<<<<<< HEAD
`<Fragment>`, hay còn được sử dụng với cú pháp `<>...</>`, cho phép bạn nhóm các phần tử mà không cần bọc chúng trong một node nào đó.
=======
`<Fragment>`, often used via `<>...</>` syntax, lets you group elements without a wrapper node. 

<Canary> Fragments can also accept refs, which enable interacting with underlying DOM nodes without adding wrapper elements. See reference and usage below.</Canary>
>>>>>>> 2c7798dcc51fbd07ebe41f49e5ded4839a029f72

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<Fragment>` {/*fragment*/}

Để nhóm các phần tử lại với nhau trong các tình huống mà bạn cần một phần tử đơn, hãy bọc chúng trong thẻ `<Fragment>`. Nhóm các phần tử trong `Fragment` không ảnh hưởng đến DOM; DOM sẽ giống như khi các phần tử không được nhóm lại. Trong hầu hết các trường hợp Thẻ JSX rỗng `<></>` là cách viết tắt cho `<Fragment></Fragment>`.

#### Props {/*props*/}

<<<<<<< HEAD
- `key` **tuỳ chọn** : Các Fragment được khai báo bằng cú pháp rõ ràng `<Fragment>` có thể có [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
=======
- **optional** `key`: Fragments declared with the explicit `<Fragment>` syntax may have [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
- <CanaryBadge />  **optional** `ref`: A ref object (e.g. from [`useRef`](/reference/react/useRef)) or [callback function](/reference/react-dom/components/common#ref-callback). React provides a `FragmentInstance` as the ref value that implements methods for interacting with the DOM nodes wrapped by the Fragment.

### <CanaryBadge /> FragmentInstance {/*fragmentinstance*/}

When you pass a ref to a fragment, React provides a `FragmentInstance` object with methods for interacting with the DOM nodes wrapped by the fragment:

**Event handling methods:**
- `addEventListener(type, listener, options?)`: Adds an event listener to all first-level DOM children of the Fragment.
- `removeEventListener(type, listener, options?)`: Removes an event listener from all first-level DOM children of the Fragment.
- `dispatchEvent(event)`: Dispatches an event to a virtual child of the Fragment to call any added listeners and can bubble to the DOM parent.

**Layout methods:**
- `compareDocumentPosition(otherNode)`: Compares the document position of the Fragment with another node.
  - If the Fragment has children, the native `compareDocumentPosition` value is returned. 
  - Empty Fragments will attempt to compare positioning within the React tree and include `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
  - Elements that have a different relationship in the React tree and DOM tree due to portaling or other insertions are `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
- `getClientRects()`: Returns a flat array of `DOMRect` objects representing the bounding rectangles of all children.
- `getRootNode()`: Returns the root node containing the Fragment's parent DOM node.

**Focus management methods:**
- `focus(options?)`: Focuses the first focusable DOM node in the Fragment. Focus is attempted on nested children depth-first.
- `focusLast(options?)`: Focuses the last focusable DOM node in the Fragment. Focus is attempted on nested children depth-first.
- `blur()`: Removes focus if `document.activeElement` is within the Fragment.

**Observer methods:**
- `observeUsing(observer)`: Starts observing the Fragment's DOM children with an IntersectionObserver or ResizeObserver.
- `unobserveUsing(observer)`: Stops observing the Fragment's DOM children with the specified observer.
>>>>>>> 2c7798dcc51fbd07ebe41f49e5ded4839a029f72

#### Những lưu ý {/*caveats*/}

- Nếu bạn muốn truyền `key` vào một Fragment, bạn không thể sử dụng cú pháp `<>...</>`.  Bạn phải import rõ ràng `Fragment` từ `'react'` và render `<Fragment key={yourKey}>...</Fragment>`.

- React không [đặt lại state](/learn/preserving-and-resetting-state) khi bản chuyển từ việc render `<><Child /></>` sang `[<Child />]` hay ngược lại, hoặc khi bạn chuyển từ render `<><Child /></>` sang `<Child />` và ngược lại. Điều này chỉ hoạt động chính xác ở mức độ một cấp: ví dụ, từ `<><><Child /></></>` sang `<Child />` sẽ đặt lại state. Xem cụ thể về cách hoạt động [ở đây.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

- <CanaryBadge /> If you want to pass `ref` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment ref={yourRef}>...</Fragment>`.

---

## Cách sử dụng {/*usage*/}

### Trả về nhiều phần tử {/*returning-multiple-elements*/}

Sử dụng `Fragment`, hoặc cú pháp tương đương `<>...</>`, để nhóm các phần tử lại với nhau. Bạn có thể sử dụng Fragment để đặt nhiều phần tử vào bất kỳ nơi nào mà một phần tử đơn lẻ có thể được sử dụng. Ví dụ, một thành phần chỉ có thể trả về một phần tử, nhưng bằng cách sử dụng Fragment, bạn có thể nhóm nhiều phần tử lại với nhau và sau đó trả về chúng như một nhóm.:

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Fragments rất hữu ích vì nhóm các phần tử với một Fragment không ảnh hưởng đến bố cục hay cách các phần tử hiển thị, khác với khi bạn bọc các phần tử trong một container khác như một DOM element. Nếu bạn kiểm tra ví dụ này với các công cụ trình duyệt, bạn sẽ thấy tất cả các nút DOM `<h1>` và `<article>` xuất hiện như là các sibling mà không có các wrapper xung quanh chúng:

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="An update" body="It's been a while since I posted..." />
      <Post title="My new blog" body="I am starting a new blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### Làm thế nào để viết Fragment mà không cần cú pháp đặc biệt? {/*how-to-write-a-fragment-without-the-special-syntax*/}

Câu ví dụ trên tương đương với việc import `Fragment` từ React:

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

Thông thường bạn sẽ không cần phải làm thế này trừ khi bạn cần [truyền `key` vào `Fragment`.](#rendering-a-list-of-fragments)

</DeepDive>

---

### Gán nhiều phần tử vào một biến {/*assigning-multiple-elements-to-a-variable*/}

Như mọi phần tử khác, bạn có thể gán các phần tử Fragment vào các biến, truyền chúng như props, và hơn thế nữa:

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

---

### Nhóm các phần tử với văn bản {/*grouping-elements-with-text*/}

Bạn có thể dùng `Fragment` để nhóm các văn bản với các thành phần:

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

---

### Hiển thị một danh sách gồm các Fragment {/*rendering-a-list-of-fragments*/}

Dưới đây là một trường hợp mà bạn cần viết `Fragment` một cách rõ ràng thay vì sử dụng cú pháp `<></>`.  Khi bạn [render  nhiều phần tử trong một vòng lặp](/learn/rendering-lists), bạn cần gán một `key` cho mỗi phần tử. Nếu các phần tử trong vòng lặp là Fragments, bạn cần sử dụng cú pháp JSX thông thường để cung cấp thuộc tính `key`:

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

Bạn có thể kiểm tra DOM để xác nhận rằng không có phần tử bao quanh các phần tử con của Fragmen:

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

---

### <CanaryBadge /> Using Fragment refs for DOM interaction {/*using-fragment-refs-for-dom-interaction*/}

Fragment refs allow you to interact with the DOM nodes wrapped by a Fragment without adding extra wrapper elements. This is useful for event handling, visibility tracking, focus management, and replacing deprecated patterns like `ReactDOM.findDOMNode()`.

```js
import { Fragment } from 'react';

function ClickableFragment({ children, onClick }) {
  return (
    <Fragment ref={fragmentInstance => {
      fragmentInstance.addEventListener('click', handleClick);
      return () => fragmentInstance.removeEventListener('click', handleClick);
    }}>
      {children}
    </Fragment>
  );
}
```
---

### <CanaryBadge /> Tracking visibility with Fragment refs {/*tracking-visibility-with-fragment-refs*/}

Fragment refs are useful for visibility tracking and intersection observation. This enables you to monitor when content becomes visible without requiring the child Components to expose refs:

```js {19,21,31-34}
import { Fragment, useRef, useLayoutEffect } from 'react';

function VisibilityObserverFragment({ threshold = 0.5, onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        onVisibilityChange(entries.some(entry => entry.isIntersecting))
      },
      { threshold }
    );
    
    fragmentRef.current.observeUsing(observer);
    return () => fragmentRef.current.unobserveUsing(observer);
  }, [threshold, onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

function MyComponent() {
  const handleVisibilityChange = (isVisible) => {
    console.log('Component is', isVisible ? 'visible' : 'hidden');
  };

  return (
    <VisibilityObserverFragment onVisibilityChange={handleVisibilityChange}>
      <SomeThirdPartyComponent />
      <AnotherComponent />
    </VisibilityObserverFragment>
  );
}
```

This pattern is an alternative to Effect-based visibility logging, which is an anti-pattern in most cases. Relying on Effects alone does not guarantee that the rendered Component is observable by the user.

---

### <CanaryBadge /> Focus management with Fragment refs {/*focus-management-with-fragment-refs*/}

Fragment refs provide focus management methods that work across all DOM nodes within the Fragment:

```js
import { Fragment, useRef } from 'react';

function FocusFragment({ children }) {
  return (
    <Fragment ref={(fragmentInstance) => fragmentInstance?.focus()}>
      {children}
    </Fragment>
  );
}
```

The `focus()` method focuses the first focusable element within the Fragment, while `focusLast()` focuses the last focusable element.
