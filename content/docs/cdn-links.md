---
id: cdn-links
title: CDN Links
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

Cả React và ReactDOM đều có sẵn thông qua CDN.

```html
<script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
```

Các phiên bản trên chỉ dành cho việc phát triển, và không thích hợp để tạo ra sản phẩm. Các phiên bản sản xuất thu nhỏ và tối ưu hóa của React có sẵn tại:

```html
<script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
```

Để tải một phiên bản cụ thể của `react` và `react-dom`, thay `17` bằng số phiên bản.

### Tại sao là thuộc tính `crossorigin`? {#why-the-crossorigin-attribute}

Nếu bạn dùng React từ CDN, chúng tôi khuyên bạn nên giữ tập thuộc tính [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes):

```html
<script crossorigin src="..."></script>
```

Chúng tôi cũng khuyên bạn nên xác định rằng CDN bạn đang sử dụng đặt `Access-Control-Allow-Origin: *` HTTP header:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

Điều này cho phép tốt hơn [error handling experience](/blog/2017/07/26/error-handling-in-react-16.html) trong React 16 và sau này.
