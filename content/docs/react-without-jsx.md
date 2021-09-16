---
id: react-without-jsx
title: React Không Dùng JSX
permalink: docs/react-without-jsx.html
---

JSX không phải là một yêu cầu bắt buộc để sử dụng React. Sử dụng React mà không dùng JSX đặc biệt thuận tiện khi bạn không muốn thiết lập compilation trong môi trường build của bạn.

Mỗi phần tử JSX chỉ là một syntactic sugar để gọi `React.createElement(component, props, ...children)`. Vì vậy, bất cứ điều gì bạn có thể làm với JSX thì cũng có thể thực hiện được chỉ với JavaScript đơn giản.

Ví dụ, đoạn code này được viết bằng JSX:

```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

có thể được biên dịch thành đoạn code bên dưới, không sử dụng JSX:

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

Nếu bạn tò mò muốn xem thêm các ví dụ về cách JSX được chuyển đổi sang JavaScript, bạn có thể thử [trình biên dịch Babel online](babel://jsx-simple-example).

Component có thể được cung cấp dưới dạng một string, dưới dạng subclass của `React.Component` hoặc một function thuần túy.

Nếu bạn cảm thấy mệt mỏi với việc gõ `React.createElement` quá nhiều, một pattern phổ biến là hãy gán cho một biến và dùng nó như dạng viết tắt:

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```

Nếu bạn sử dụng dạng viết tắt này cho `React.createElement`, thì việc sử dụng React mà không có JSX có thể rất thuận tiện.

Ngoài ra, bạn có thể tham khảo các dự án cộng đồng như [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) và [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers) sẽ cung cấp cho bạn cú pháp ngắn gọn hơn.

