---
id: lists-and-keys
title: Lists và Keys
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

Đầu tiên, hãy xem lại cách bạn chuyển đổi danh sách trong Javascript.

Trong đoạn code bên dưới, chúng ta sử dụng hàm [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) để nhân đôi giá trị của từng phần tử trong mảng `numbers`. Chúng ta gán mảng mới là kết quả trả về từ hàm `map()` vào biến `doubled` và xuất kết quả đó ra:

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

Đoạn code trên xuất kết quả `[2, 4, 6, 8, 10]` ra màn hình console.

Trong React, việc chuyển đổi mảng các phần tử thành danh sách của các [element](/docs/rendering-elements.html) là gần như giống hệt nhau.

### Render Nhiều Component {#rendering-multiple-components}

Bạn có thể xây dựng các tập hợp của các element và [nhúng những tập hợp element này vào JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) bằng việc sử dụng dấu ngoặc nhọn `{}`.

Dưới đây, chúng ta sử dụng vòng lặp trên mảng `numbers` và sử dụng hàm [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) trong JavaScript. Kết quả trả về là một thẻ `<li>` cho mỗi vòng lặp. Cuối cùng, chúng ta gán mảng kết quả gồm những element cho `listItems`:

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

Chúng ta nhúng toàn bộ `listItems` vào trong thẻ `<ul>` , và [render mảng này ra DOM](/docs/rendering-elements.html#rendering-an-element-into-the-dom):

```javascript{2}
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

Đoạn code trên hiển thị một danh sách dấu chấm tròn đứng trước các số từ 1 đến 5.

### Danh Sách Component cơ bản {#basic-list-component}

Thông thường bạn sẽ render các danh sách trong một [component](/docs/components-and-props.html).

Chúng ta có thể điều chỉnh để đưa đoạn code trong ví dụ trước vào một component và trong component đó nhận một mảng `numbers` và xuất ra danh sách các element.

```javascript{3-5,7,13}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</u
    
    l>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

Khi bạn chạy đoạn code này, bạn sẽ nhận một thông báo lưu ý rằng một thuộc tính key nên được truyền vào cho mỗi phần tử. Một "key" là một thuộc tính chuỗi đặc biệt bạn cần phải đưa vào khi tạo danh sách các element. Chúng ta sẽ thảo luận tại sao điều này lại quan trọng trong mục kế tiếp.

Hãy gán một `key` vào danh sách các phần tử của chúng ta bên trong `numbers.map()` và sửa cảnh báo bị thiếu key lúc nãy.

```javascript{4}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## Keys {#keys}

Các key giúp React xác định những phần tử nào đã thay đổi, được thêm, hay bị xóa. Các key nên được truyền vào các element bên trong một mảng để cho các element này có một định danh ổn định:

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

Các tốt nhất để chọn một key là sử dụng một chuỗi mà được xác định là duy nhất trong một danh sách các phần tử. Cách thông thường nhất mà bạn sẽ sử dụng là dùng các ID từ dữ liệu của bạn như là key:

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

Khi bạn không có các ID ổn định cho việc render các phần tử, bạn có thể sử dụng thứ tự của phần tử đó trong danh sách như là một key cũng như là một phương án cuối cùng:

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);
```

Chúng tôi không khuyến khích sử dụng các thứ tự của phần tử cho các key nếu thứ tự của các phần tử có thể thay đổi. Điều này có thể ảnh hưởng đến hiệu suất và có thể gây ra một vài vấn đề với state của component. Xem qua bài viết của Robin Pokorny về việc [giải thích ảnh hưởng tiêu cực của việc sử dụng thứ tự phần tử cho key](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318). Nếu bạn lựa chọn việc không gán cho key một định danh rõ ràng thì mặc định React sẽ sử dựng thứ tự của phần tử cho key.

Đây là một [giải thích về việc tại sao các key là cần thiết](/docs/reconciliation.html#recursing-on-children) nếu bạn quan tâm nhiều về vấn đề này.

### Extracting Components with Keys {#extracting-components-with-keys}

Keys only make sense in the context of the surrounding array.

For example, if you [extract](/docs/components-and-props.html#extracting-components) a `ListItem` component, you should keep the key on the `<ListItem />` elements in the array rather than on the `<li>` element in the `ListItem` itself.

**Example: Incorrect Key Usage**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // Wrong! There is no need to specify the key here:
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Wrong! The key should have been specified here:
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

**Example: Correct Key Usage**

```javascript{2,3,9,10}
function ListItem(props) {
  // Correct! There is no need to specify the key here:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Correct! Key should be specified inside the array.
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/ZXeOGM?editors=0010)

A good rule of thumb is that elements inside the `map()` call need keys.

### Keys Must Only Be Unique Among Siblings {#keys-must-only-be-unique-among-siblings}

Keys used within arrays should be unique among their siblings. However they don't need to be globally unique. We can use the same keys when we produce two different arrays:

```js{2,5,11,12,19,21}
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

Keys serve as a hint to React but they don't get passed to your components. If you need the same value in your component, pass it explicitly as a prop with a different name:

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

With the example above, the `Post` component can read `props.id`, but not `props.key`.

### Embedding map() in JSX {#embedding-map-in-jsx}

In the examples above we declared a separate `listItems` variable and included it in JSX:

```js{3-6}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

JSX allows [embedding any expression](/docs/introducing-jsx.html#embedding-expressions-in-jsx) in curly braces so we could inline the `map()` result:

```js{5-8}
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

Sometimes this results in clearer code, but this style can also be abused. Like in JavaScript, it is up to you to decide whether it is worth extracting a variable for readability. Keep in mind that if the `map()` body is too nested, it might be a good time to [extract a component](/docs/components-and-props.html#extracting-components).
