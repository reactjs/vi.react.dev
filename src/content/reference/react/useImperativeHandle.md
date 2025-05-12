---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle` là một React Hook cho phép bạn tùy chỉnh handle được hiển thị dưới dạng một [ref.](/learn/manipulating-the-dom-with-refs)

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

Gọi `useImperativeHandle` ở cấp cao nhất của component để tùy chỉnh ref handle mà nó hiển thị:

```js
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... các phương thức của bạn ...
    };
  }, []);
  // ...
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `ref`: `ref` bạn nhận được như một prop cho component `MyInput`.

* `createHandle`: Một hàm không nhận đối số và trả về ref handle bạn muốn hiển thị. Ref handle đó có thể có bất kỳ kiểu nào. Thông thường, bạn sẽ trả về một object với các phương thức bạn muốn hiển thị.

* **optional** `dependencies`: Danh sách tất cả các giá trị reactive được tham chiếu bên trong code `createHandle`. Các giá trị reactive bao gồm props, state và tất cả các biến và hàm được khai báo trực tiếp bên trong phần thân component của bạn. Nếu linter của bạn được [cấu hình cho React](/learn/editor-setup#linting), nó sẽ xác minh rằng mọi giá trị reactive được chỉ định chính xác như một dependency. Danh sách các dependency phải có một số lượng mục không đổi và được viết nội dòng như `[dep1, dep2, dep3]`. React sẽ so sánh từng dependency với giá trị trước đó của nó bằng cách sử dụng so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Nếu việc render lại dẫn đến thay đổi đối với một số dependency hoặc nếu bạn bỏ qua đối số này, hàm `createHandle` của bạn sẽ thực thi lại và handle mới được tạo sẽ được gán cho ref.

<Note>

Bắt đầu với React 19, [`ref` có sẵn dưới dạng một prop.](/blog/2024/12/05/react-19#ref-as-a-prop) Trong React 18 trở về trước, cần phải lấy `ref` từ [`forwardRef`.](/reference/react/forwardRef)

</Note>

#### Returns {/*returns*/}

`useImperativeHandle` trả về `undefined`.

---

## Cách sử dụng {/*usage*/}

### Hiển thị một ref handle tùy chỉnh cho component cha {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

Để hiển thị một DOM node cho phần tử cha, hãy truyền prop `ref` vào node đó.

```js {2}
function MyInput({ ref }) {
  return <input ref={ref} />;
};
```

Với đoạn code trên, [một ref đến `MyInput` sẽ nhận được DOM node `<input>`.](/learn/manipulating-the-dom-with-refs) Tuy nhiên, bạn có thể hiển thị một giá trị tùy chỉnh thay thế. Để tùy chỉnh handle được hiển thị, hãy gọi `useImperativeHandle` ở cấp cao nhất của component:

```js {4-8}
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... các phương thức của bạn ...
    };
  }, []);

  return <input />;
};
```

Lưu ý rằng trong đoạn code trên, `ref` không còn được truyền cho `<input>`.

Ví dụ: giả sử bạn không muốn hiển thị toàn bộ DOM node `<input>`, nhưng bạn muốn hiển thị hai trong số các phương thức của nó: `focus` và `scrollIntoView`. Để thực hiện việc này, hãy giữ DOM trình duyệt thực trong một ref riêng biệt. Sau đó, sử dụng `useImperativeHandle` để hiển thị một handle chỉ với các phương thức mà bạn muốn component cha gọi:

```js {7-14}
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input ref={inputRef} />;
};
```

Bây giờ, nếu component cha nhận được một ref đến `MyInput`, nó sẽ có thể gọi các phương thức `focus` và `scrollIntoView` trên đó. Tuy nhiên, nó sẽ không có toàn quyền truy cập vào DOM node `<input>` cơ bản.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // Thao tác này sẽ không hoạt động vì DOM node không được hiển thị:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Nhập tên của bạn" ref={ref} />
      <button type="button" onClick={handleClick}>
        Chỉnh sửa
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref, ...props }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
};

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

---

### Hiển thị các phương thức imperative của riêng bạn {/*exposing-your-own-imperative-methods*/}

Các phương thức bạn hiển thị thông qua một imperative handle không nhất thiết phải khớp chính xác với các phương thức DOM. Ví dụ: component `Post` này hiển thị một phương thức `scrollAndFocusAddComment` thông qua một imperative handle. Điều này cho phép `Page` cha cuộn danh sách các comment *và* focus vào trường input khi bạn nhấp vào nút:

<Sandpack>

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Viết một bình luận
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js src/Post.js
import { useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

function Post({ ref }) {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Chào mừng đến với blog của tôi!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
};

export default Post;
```


```js src/CommentList.js
import { useRef, useImperativeHandle } from 'react';

function CommentList({ ref }) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comment #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
}

export default CommentList;
```

```js src/AddComment.js
import { useRef, useImperativeHandle } from 'react';

function AddComment({ ref }) {
  return <input placeholder="Thêm bình luận..." ref={ref} />;
}

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**Không nên lạm dụng refs.** Bạn chỉ nên sử dụng refs cho các hành vi *imperative* mà bạn không thể thể hiện dưới dạng props: ví dụ: cuộn đến một node, focus một node, kích hoạt một animation, chọn văn bản, v.v.

**Nếu bạn có thể thể hiện một cái gì đó dưới dạng một prop, bạn không nên sử dụng ref.** Ví dụ: thay vì hiển thị một imperative handle như `{ open, close }` từ một component `Modal`, tốt hơn là lấy `isOpen` làm một prop như `<Modal isOpen={isOpen} />`. [Effects](/learn/synchronizing-with-effects) có thể giúp bạn hiển thị các hành vi imperative thông qua props.

</Pitfall>
