---
id: components-and-props
title: Components and Props
permalink: docs/components-and-props.html
redirect_from:
  - "docs/reusable-components.html"
  - "docs/reusable-components-zh-CN.html"
  - "docs/transferring-props.html"
  - "docs/transferring-props-it-IT.html"
  - "docs/transferring-props-ja-JP.html"
  - "docs/transferring-props-ko-KR.html"
  - "docs/transferring-props-zh-CN.html"
  - "tips/props-in-getInitialState-as-anti-pattern.html"
  - "tips/communicate-between-components.html"
prev: rendering-elements.html
next: state-and-lifecycle.html
---

Components cho phép bạn chia UI thành các phần độc lập, có thể tái sử dụng, và hoàn toàn tách biệt nhau. Tài liệu này đem đến những giới thiệu sơ lược về components. Bạn có thể tìm [tài liệu chi tiết về API ở đây](/docs/react-component.html).

Về mặt khái niệm, components cũng giống như các hàm Javascript. Chúng nhận vào bất kì đầu vào nào (còn được gọi là "props") và trả về các React elements mô tả những gì sẽ xuất hiện trên màn hình.

## Function Components và Class Components {#function-and-class-components}

Cách đơn giản nhất để định nghĩa một component đó là viết một hàm JavaScript:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Hàm này là một React component hợp lệ về nó nhận đầu vào là một tham số object "props" (viết tắt của properties) với dữ liệu và trả về một React element. Chúng ta gọi các components này là "function components" vì chúng là các hàm JavaScript theo đúng nghĩa đen.

Bạn cũng có thể sử dụng [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) để định nghĩa một component:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Hai components phía trên là tương đương nhau dưới góc độ của React.

Function và Class components đều có các tính năng bổ sung khác mà chúng ta sẽ thảo luận ở [phần tiếp theo](/docs/state-and-lifecycle.html).

## Rendering một Component {#rendering-a-component}

Ở phần trước, chúng ta mới chỉ đề cập đến các React elements biểu diễn các DOM tags:

```js
const element = <div />;
```

Thế nhưng, elements cũng có thể biểu diễn các components do người dùng định nghĩa:

```js
const element = <Welcome name="Sara" />;
```

Khi React thấy một element biểu diễn component do người dùng định nghĩa, nó ssẽ truyền các thuộc tính JSX và các phần tử con vào component này như là một object (đối tượng). Chúng ta gọi object đó là "props".

Ví dụ, đoạn code này render ra "Hello, Sara" trên page:

```js{1,5}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://components-and-props/rendering-a-component)

Chúng ta hãy cùng xem những gì diễn ra ở ví dụ này:

1. Chúng ta gọi `ReactDOM.render()` với `<Welcome name="Sara" />` element.
2. React gọi đến `Welcome` component với `{name: 'Sara'}` là props.
3. `Welcome` component của chúng ta trả về kết quả là `<h1>Hello, Sara</h1>` element.
4. React DOM sẽ cập nhật DOM để hiển thị `<h1>Hello, Sara</h1>`.

>**Chú ý:** Luôn luôn bắt đầu tên của component bằng chữ in hoa.
>
>React xử lí các components bắt đầu với chữ thường giống như các DOM tags. Ví dụ, `<div />` biểu diễn HTML div tag, nhưng `<Welcome />` biểu diễn một component và yêu cầu `Welcome` nằm trong scope.
>
>Để hiểu hơn về cách viết này, hãy đọc [JSX Chuyên Sâu](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

## Tạo Components {#composing-components}

Các components có thể tham chiếu đến các components khác tại đầu ra của chúng. Điều này cho phép chúng ta sử dụng cùng một component abstraction cho mọi mức độ chi tiết. Một button, form, dialog, màn hình: trong React apps, chúng đều được hiển thị như là các components.

Ví dụ, chúng ta có thể tạo ra `App` component mà nó sẽ render ra `Welcome` nhiều lần:

```js{8-10}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[](codepen://components-and-props/composing-components)

Thông thường, các React apps mới tạo sẽ có một `App` component ở tầng cao nhất. Thế nhưng, nếu bạn tích hợp React vào ứng dụng hiện có, bạn có thể bắt đầu bằng cách tiếp cận bottom-up với một component nhỏ như là `Button` và dần dần đi lên các tầng trên cùng của cây kế thừa giao diện.

## Tách Components {#extracting-components}

Đừng ngại ngần việc tách components thành các components nhỏ hơn.

Ví dụ, cùng xem component `Comment` dưới đây:

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[](codepen://components-and-props/extracting-components)

Nó nhận `author` (một object), `text` (một sâu kí tự), và `date` (ngày tháng) làm props, và mô phỏng lại một bình luận trên mạng xã hội.

Component này có thể khó để thay đổi vì cấu trúc lồng nhau, đồng thời cũng khó có thể tái sử dụng lại các thành phần con bên trong nó. Hãy thử chia một vài components từ nó.

Đầu tiên, chúng ta sẽ chia `Avatar`:

```js{3-6}
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
```

`Avatar` không cần phải biết nó đang được render bên trong `Comment`. Đây là lí do tại sao chúng ta truyền vào nó một prop với cái tên tổng quát là: `user` thay vì `author`.

Chúng tôi khuyến khích việc đặt tên cho props dựa trên góc nhìn từ chính component hơn là ngữ cảnh mà component được sử dụng.

Chúng ta có thể đơn giản hoá `Comment` đi một chút:

```js{5}
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

Tiếp theo, chúng ta sẽ chia component `UserInfo`, component này sẽ render `Avatar` bên cạnh tên của user:

```js{3-8}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

Điều này giúp chúng ta có thể đơn giản hoá `Comment` hơn nữa:

```js{4}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[](codepen://components-and-props/extracting-components-continued)

Chia các components ngay từ đầu là một công việc không đơn giản, nhưng bù lại chúng ta sẽ có được một tập hợp các components có thể tái sử dụng trong các ứng dụng lớn hơn khác. Một nguyên tắc quan trọng đó là nếu một phần UI của bạn được sử dụng lại nhiều lần (`Button`, `Panel`, `Avatar`), hoặc đủ phức tạp (`App`, `FeedStory`, `Comment`), thì đó là thời điểm thích hợp để chia chúng thành các component riêng.

## Props chỉ dùng để đọc {#props-are-read-only}

Khi bạn định nghĩa một component [dưới dạng function hoặc class](#function-and-class-components), thì nó không được phép thay đổi props của chính nó. Hãy cùng phân tích hàm `sum` dưới đây:

```js
function sum(a, b) {
  return a + b;
}
```

Các hàm này được gọi là ["pure"](https://en.wikipedia.org/wiki/Pure_function) vì chúng không thay đổi giá trị của tham số đầu vào, và luôn trả về cùng một kết quả với các tham số đầu vào giống nhau.

Ngược lại, hàm dưới đây được gọi là impure vì nó thay đổi giá trị của tham số đầu vào:

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React có tính khả chuyển cao nhưng nó cũng có một quy tắc riêng:

**Mọi React components đều phải giống như các pure functions đối với props của chúng.**

Tất nhiên, giao diện của ứng dụng là động và luôn luôn thay đổi theo thời gian. Trong [phần tiếp theo](/docs/state-and-lifecycle.html), chúng tôi sẽ giới thiệu một khái niệm mới, đó là "state". State cho phép React components thay đổi đầu ra của chúng theo thời gian tương ứng với các hành động của người dùng, network responses, và bất kì thứ gì khác, mà không vi phạm quy tắc đối với React component.
