---
title: React Element Factories and JSX Warning
layout: single
permalink: warnings/legacy-factories.html
---

Bạn có thể đã đến đây bởi vì đoạn mã của bạn đang gọi thành phần (component) như một cách gọi hàm đơn giản. Cách này bây giờ đã không còn sử dụng nữa:

```javascript
var MyComponent = require('MyComponent');

function render() {
  return MyComponent({ foo: 'bar' });  // WARNING
}
```

## JSX {#jsx}

React components không còn được gọi một cách trực tiếp như vầy. Thay vào đó [bạn có thể sử dụng JSX](/docs/jsx-in-depth.html).

```javascript
var React = require('react');
var MyComponent = require('MyComponent');

function render() {
  return <MyComponent foo="bar" />;
}
```

## Không sử dụng JSX {#without-jsx}

Nếu bạn không muốn, hoặc không thể sử dụng JSX, thì bạn sẽ cần bọc thành phần (component) của bạn trong một factory trước khi gọi nó:

```javascript
var React = require('react');
var MyComponent = React.createFactory(require('MyComponent'));

function render() {
  return MyComponent({ foo: 'bar' });
}
```

Đây là một cách nâng cấp dễ dàng nếu bạn đã có nhiều lời gọi hàm (function call) tồn tại.

## Những thành phần động mà không có JSX {#dynamic-components-without-jsx}

Nếu bạn lấy được một class component từ mã nguồn động, thì không cần thiết tạo một factory cái mà bạn thực hiện một cách tức thì. Thay vào đó, bạn chỉ cần tạo những phần tử nội tuyến:

```javascript
var React = require('react');

function render(MyComponent) {
  return React.createElement(MyComponent, { foo: 'bar' });
}
```

## Chuyên sâu {#in-depth}

[Đọc thêm về TẠI SAO chúng tôi thực hiện thay đổi này.](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)
