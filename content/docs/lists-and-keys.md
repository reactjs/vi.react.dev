---
id: lists-and-keys
title: Lists và Keys
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

Đầu tiên, hãy xem lại cách bạn chuyển đổi "danh sách" (lists) trong Javascript.

Trong đoạn code bên dưới, chúng ta sử dụng hàm [`map()`](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Global_Objects/Array/map) để nhân đôi giá trị của từng phần tử trong mảng `numbers`. Chúng ta gán mảng mới là kết quả trả về từ hàm `map()` vào biến `doubled` và xuất kết quả đó ra:

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

Đoạn code trên xuất kết quả `[2, 4, 6, 8, 10]` ra màn hình console.

Trong React, việc chuyển đổi mảng các phần tử thành danh sách (arrays into lists) của các [element](/docs/rendering-elements.html) là gần như giống hệt nhau.

### Render Nhiều Component {#rendering-multiple-components}

Bạn có thể xây dựng nhiều tập hợp (collections) của các element và [nhúng những tập hợp element này vào JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) bằng việc sử dụng dấu ngoặc nhọn `{}`.

Dưới đây, chúng ta sử dụng vòng lặp trên mảng `numbers` và sử dụng hàm [`map()`](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Global_Objects/Array/map) trong JavaScript. Kết quả trả về là một thẻ `<li>` cho mỗi vòng lặp. Cuối cùng, chúng ta gán mảng kết quả gồm những element (thẻ `<li>`) cho `listItems`:

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

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

Đoạn code trên hiển thị một danh sách từ 1 đến 5 và có chứa các dấu chấm tròn trước mỗi số.

### Component Có Danh Sách Cơ Bản (Basic List Component) {#basic-list-component}

Thông thường bạn sẽ render các danh sách trong một [component](/docs/components-and-props.html).

Chúng ta có thể điều chỉnh để đưa đoạn code trong ví dụ trước vào một component và trong component đó sẽ nhận một mảng `numbers` và xuất ra danh sách các element.

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

Khi bạn chạy đoạn code này, bạn sẽ nhận một thông báo lưu ý rằng một thuộc tính key nên được truyền vào cho mỗi phần tử (thẻ `<li>` bên trong hàm `map()`). Một "key" là một thuộc tính chuỗi đặc biệt bạn cần phải đưa vào khi tạo danh sách các element. Chúng ta sẽ thảo luận tại sao điều này lại quan trọng trong mục kế tiếp.

Hãy gán `key` vào từng phần tử của chúng ta bên trong `numbers.map()` và sửa cảnh báo bị thiếu key lúc nãy.

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

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## Keys {#keys}

Các key giúp React xác định những phần tử nào đã thay đổi, được thêm, hay bị xóa. Các key nên được truyền vào các element bên trong một mảng để cho các element này có một định danh cố định (stable identity):

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

Các tốt nhất để chọn một key là sử dụng một chuỗi mà được xác định là duy nhất trong các nút anh em (siblings). Cách thông thường nhất mà bạn sẽ sử dụng là dùng các ID từ dữ liệu của bạn làm key:

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

Khi bạn không có các ID cố định (stable IDs) cho việc render các phần tử, bạn có thể sử dụng thứ tự của phần tử đó trong danh sách như là một key cũng như là một phương án cuối cùng:

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // Chỉ làm điều này khi không có ID cố định
  <li key={index}>
    {todo.text}
  </li>
);
```

Chúng tôi không khuyến khích sử dụng thứ tự của các phần tử cho các key nếu thứ tự của các phần tử có thể thay đổi. Điều này có thể ảnh hưởng đến hiệu suất và có thể gây ra một vài vấn đề với state của component. Xem qua bài viết của Robin Pokorny về việc [giải thích ảnh hưởng tiêu cực của việc sử dụng thứ tự phần tử cho key](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318). Nếu bạn lựa chọn việc không gán cho key một định danh rõ ràng thì mặc định React sẽ sử dựng thứ tự của phần tử cho key.

Xem thêm [giải thích về việc tại sao các key là cần thiết](/docs/reconciliation.html#recursing-on-children) nếu bạn quan tâm nhiều về vấn đề này.

### Chia Nhỏ Các Component Với Key {#extracting-components-with-keys}

Các key chỉ hợp lí trong trường hợp liên quan đến mảng dữ liệu.

Ví dụ, nếu bạn [chia nhỏ](/docs/components-and-props.html#extracting-components) component `ListItem`, bạn nên giữ việc truyền key vào các `<ListItem />` element trong mảng thay vì truyền vào thẻ `<li>` bên trong `ListItem` element.

**Ví dụ: Trường hợp sử dụng key chưa chính xác**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // Sai! Ở đây không cần truyền vào key:
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Sai! Key nên được truyền vào ở đây:
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

**Ví dụ: Trường hợp sử dụng key chính xác**

```javascript{2,3,9,10}
function ListItem(props) {
  // Đúng! Ở đây không cần cụ thể key:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Đúng! Key nên được xác định bên trong mảng:
    <ListItem key={number.toString()} value={number} />
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

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/ZXeOGM?editors=0010)

Một nguyên tắc nhỏ đó là các element bên trong hàm gọi `map()` cần các key.

### Các Key Chỉ Bắt Buộc Là Duy Nhất Giữa Các Nút Anh Em (Siblings) {#keys-must-only-be-unique-among-siblings}

Các Key được sử dụng bên trong các mảng nên là duy nhất giữa các nút anh em của chúng. Tuy nhiên chúng không cần là duy nhất đối với toàn bộ component. Chúng ta có thể sử dụng các key giống nhau khi chúng ta tạo hai mảng khác nhau:

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

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

Các key được sử dụng để gợi ý cho React nhưng chúng không được truyền vào cho các component (Nghĩa là các component con sẽ không đọc được prop.key). Nếu bạn cần đọc giá trị giống với giá trị của key bên trong component của bạn, truyền giá trị đó như một prop với một cái tên khác:

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

Với ví dụ bên trên, component `Post` có thể đọc giá trị của `props.id`, mà không phải là `props.key`.

### Nhúng map() vào JSX {#embedding-map-in-jsx}

Trong các ví dụ trên chúng ta đã khái báo `listItems` thành một biến riêng biệt và đưa nó vào JSX:

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

JSX cho phép [nhúng expression](/docs/introducing-jsx.html#embedding-expressions-in-jsx) bất kì vào trong dấu ngoặc nhọn vì vậy chúng ta có thể xuất kết quả của hàm `map()` như sau:

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

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

Thỉnh thoảng cách làm như trên làm code gọn gàng hơn, nhưng kiểu này cũng có thể bị lạm dụng. Như trong JavaScript, đôi khi bạn phải quyết định xem có cần phải tạo thêm một biến để cho dễ đọc hay không. Hãy nhớ rằng nếu bên trong hàm `map()` bị lồng (nested) quá nhiều, đó có thể là lúc thích hợp để [chia nhỏ một component](/docs/components-and-props.html#extracting-components).
