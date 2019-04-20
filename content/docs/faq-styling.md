---
id: faq-styling
title: Styling và CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### Làm thế nào tôi chèn class CSS cho components? {#how-do-i-add-css-classes-to-components}

Truyền tên của class cho prop là `className`:

```jsx
render() {
  return <span className="menu navigation-menu">Menu</span>
}
```

It is common for CSS classes to depend on the component props or state:

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
>If you often find yourself writing code like this, [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) package can simplify it.

### Tôi có dùng được inline styles? {#can-i-use-inline-styles}

Có, xem tài liệu styling tại [đây](/docs/dom-elements.html#style).

### Viết inline styles xấu? {#are-inline-styles-bad}

Các class CSS thường sẽ có hiệu xuất tốt hơn là inline styles.

### CSS-in-JS là gì? {#what-is-css-in-js}

"CSS-in-JS" refers to a pattern where CSS is composed using JavaScript instead of defined in external files. Read a comparison of CSS-in-JS libraries [here](https://github.com/MicheleBertoli/css-in-js).

_Note that this functionality is not a part of React, but provided by third-party libraries._ React does not have an opinion about how styles are defined; if in doubt, a good starting point is to define your styles in a separate `*.css` file as usual and refer to them using [`className`](/docs/dom-elements.html#classname).

### Tôi có thể dùng animations trong React? {#can-i-do-animations-in-react}

React có thể sử dụng animations rất tốt. Xem ví dụ [React Transition Group](https://reactcommunity.org/react-transition-group/) và [React Motion](https://github.com/chenglou/react-motion).
