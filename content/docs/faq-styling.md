---
id: faq-styling
title: Styling và CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### Làm thế nào tôi chèn class CSS cho các component? {#how-do-i-add-css-classes-to-components}

Truyền tên của class cho prop là `className`:

```jsx
render() {
  return <span className="menu navigation-menu">Menu</span>
}
```

Thông thường các class CSS phụ thuộc vào các component props hoặc state:

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Menu</span>
}
```

>Tip
>
>Nếu bạn thường thấy mình viết code như thế , [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) thư viện này sẽ làm đơn giản nó.

### Tôi có dùng được inline styles? {#can-i-use-inline-styles}

Có, xem tài liệu styling tại [đây](/docs/dom-elements.html#style).

### Viết inline styles xấu? {#are-inline-styles-bad}

Các class CSS thường sẽ có hiệu suất tốt hơn là inline styles.

### CSS-in-JS là gì? {#what-is-css-in-js}

"CSS-in-JS" đề cập đến một pattern trong đó CSS ​​được tạo bằng JavaScript thay vì được định nghĩa trong các tệp bên ngoài.

_Lưu ý đây không phải là thư viện của React, nhưng được cung câp bởi thư viện thứ ba._ React không có ý kiến về cách xác định style; nếu nghi ngờ, bạn có thể định nghĩa style trong một tệp `*.css` riêng và tham chiếu tới chúng sử dụng [`className`](/docs/dom-elements.html#classname).

### Tôi có thể dùng animations trong React? {#can-i-do-animations-in-react}

React có thể sử dụng animations rất tốt. Xem ví dụ [React Transition Group](https://reactcommunity.org/react-transition-group/) và [React Motion](https://github.com/chenglou/react-motion) hoặc [React Spring](https://github.com/react-spring/react-spring).
