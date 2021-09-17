---
id: web-components
title: Web Components
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React và [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) được xây dựng để giải quyết những vấn đề khác nhau. Web Components cung cấp sự đóng gói mạnh mẽ cho việc tái sử dụng components, trong khi đó React cung cấp một thư viện khai báo giữ DOM đồng bộ với dữ liệu của bạn. Hai mục tiêu này bổ trợ cho nhau. Là một developer, bạn có quyền sử dụng React trong Web Components của bạn, hoặc sử dụng Web Components trong React, hoặc cả hai.

Hầu hết những người sử dụng React thì không sử dụng Web Components, nhưng bạn có thể muốn sử dụng, đặc biệt là khi bạn đang sử dụng UI components của bên thứ ba được viết bằng Web Components.

## Sử dụng Web Components trong React {#using-web-components-in-react}

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Hello <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> Chú ý:
>
> Web Components thường có các imperative API. Ví dụ, một `video` Web Component có thể có các hàm `play()` và `pause()`. Để tiếp cận các imperative APIs của một Web Component, bạn sẽ cần sử dụng một ref để tương tác với DOM node trực tiếp. Nếu bạn đang sử dụng Web Components của bên thứ ba, giải pháp tốt nhất là viết một React component vận hành như một vỏ bọc cho Web Component của bạn.
>
> Events được phát ra bởi một Web Component có thể không được truyền đúng cách qua React render tree.
> Bạn sẽ cần gán một cách thủ công các event handlers để xử lí các events bên trong React components của bạn.

Một sự nhầm lẫn phổ biến là Web Component sử dụng "class" thay vì "className".

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>front</div>
      <div>back</div>
    </brick-flipbox>
  );
}
```

## Sử dụng React trong Web Components của bạn {#using-react-in-your-web-components}

```javascript
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}
customElements.define('x-search', XSearch);
```

>Chú ý:
>
>Đoạn code này **sẽ không** hoạt động nếu bạn thay đổi classes với Babel. Xem [vấn đề này](https://github.com/w3c/webcomponents/issues/587) về việc thảo luận.
>Include [custom-elements-es5-adapter](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs#custom-elements-es5-adapterjs) trước khi bạn tải web components để khắc phục vấn đề này.
