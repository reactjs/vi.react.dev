---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, hay còn được sử dụng với cú pháp `<>...</>`, cho phép bạn nhóm các phần tử mà không cần bọc chúng trong một node nào đó.

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## Tham khảo {/*tham-khảo*/}

### `<Fragment>` {/*fragment*/}

Để nhóm các phần tử lại với nhau trong các tình huống mà bạn cần một phần tử đơn, hãy bọc chúng trong thẻ `<Fragment>`. Nhóm các phần tử trong `Fragment` không ảnh hưởng đến DOM; DOM sẽ giống như khi các phần tử không được nhóm lại. Trong hầu hết các trường hợp Thẻ JSX rỗng `<></>` là cách viết tắt cho `<Fragment></Fragment>`.

#### Props {/*props*/}

- `key` **tuỳ chọn** : Các Fragment được khai báo bằng cú pháp rõ ràng `<Fragment>` có thể có [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key)

#### Những lưu ý {/*những-lưu-ý*/}

- Nếu bạn muốn truyền `key` vào một Fragment, bạn không thể sử dụng cú pháp `<>...</>`.  Bạn phải import rõ ràng `Fragment` từ `'react'` và render `<Fragment key={yourKey}>...</Fragment>`.

- React không [đặt lại state](/learn/preserving-and-resetting-state) khi bản chuyển từ việc render `<><Child /></>` sang `[<Child />]` hay ngược lại, hoặc khi bạn chuyển từ render `<><Child /></>` sang `<Child />` và ngược lại. Điều này chỉ hoạt động chính xác ở mức độ một cấp: ví dụ, từ `<><><Child /></></>` sang `<Child />` sẽ đặt lại state. Xem cụ thể về cách hoạt động [ở đây.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

---

## Cách sử dụng {/*cách-sử-dụng*/}

### Trả về nhiều phần tử {/*trả-về-nhiều-phần-tử*/}

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

Fragments rất hữu ích vì nhóm các phần tử với một Fragment không ảnh hưởng đến bố cục hay cách các phần tử hiển thị, khác với khi bạn bọc các phần tử trong một container khác như một DOM element. Nếu bạn kiểm tra ví dụ này với các công cụ trình duyệt, bạn sẽ thấy tất cả các nút DOM `<h1>` và `<p>` xuất hiện như là các sibling mà không có các wrapper xung quanh chúng:

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

#### Làm thế nào để viết Fragment mà không cần cú pháp đặc biệt? {/*làm-thế-nào-để-viết-fragment-mà-không-cần-cú-pháp-đặc-biệt*/}

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

### Gán nhiều phần tử vào một biến {/*gán-nhiều-phần-tử-vào-một-biến*/}

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

### Nhóm các phần tử với văn bản {/*nhóm-các-phần-tử-với-văn-bản*/}

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
