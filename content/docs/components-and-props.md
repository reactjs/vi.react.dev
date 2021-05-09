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

Components can refer to other components in their output. This lets us use the same component abstraction for any level of detail. A button, a form, a dialog, a screen: in React apps, all those are commonly expressed as components.

For example, we can create an `App` component that renders `Welcome` many times:

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

Typically, new React apps have a single `App` component at the very top. However, if you integrate React into an existing app, you might start bottom-up with a small component like `Button` and gradually work your way to the top of the view hierarchy.

## Extracting Components {#extracting-components}

Don't be afraid to split components into smaller components.

For example, consider this `Comment` component:

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

It accepts `author` (an object), `text` (a string), and `date` (a date) as props, and describes a comment on a social media website.

This component can be tricky to change because of all the nesting, and it is also hard to reuse individual parts of it. Let's extract a few components from it.

First, we will extract `Avatar`:

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

The `Avatar` doesn't need to know that it is being rendered inside a `Comment`. This is why we have given its prop a more generic name: `user` rather than `author`.

We recommend naming props from the component's own point of view rather than the context in which it is being used.

We can now simplify `Comment` a tiny bit:

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

Next, we will extract a `UserInfo` component that renders an `Avatar` next to the user's name:

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

This lets us simplify `Comment` even further:

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

Extracting components might seem like grunt work at first, but having a palette of reusable components pays off in larger apps. A good rule of thumb is that if a part of your UI is used several times (`Button`, `Panel`, `Avatar`), or is complex enough on its own (`App`, `FeedStory`, `Comment`), it is a good candidate to be extracted to a separate component.

## Props are Read-Only {#props-are-read-only}

Whether you declare a component [as a function or a class](#function-and-class-components), it must never modify its own props. Consider this `sum` function:

```js
function sum(a, b) {
  return a + b;
}
```

Such functions are called ["pure"](https://en.wikipedia.org/wiki/Pure_function) because they do not attempt to change their inputs, and always return the same result for the same inputs.

In contrast, this function is impure because it changes its own input:

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React is pretty flexible but it has a single strict rule:

**All React components must act like pure functions with respect to their props.**

Of course, application UIs are dynamic and change over time. In the [next section](/docs/state-and-lifecycle.html), we will introduce a new concept of "state". State allows React components to change their output over time in response to user actions, network responses, and anything else, without violating this rule.
