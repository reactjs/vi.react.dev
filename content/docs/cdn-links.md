---
id: cdn-links
title: CDN Links
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

Cả React và ReactDOM đều có thể dùng được qua một CDN

```html
<script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
```

Những phiên bản trên đều chỉ áp dụng cho việc phát triển, chúng không phù hợp cho sản phẩm thật. Những phiên bản giảm tải và được tối ưu cho sản phẩm là:

```html
<script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
```

To load a specific version of `react` and `react-dom`, replace `17` with the version number.
Để chạy một phiên bản nhất định của `react` và `react-dom`, thay `17` bằng số phiên bản.

### Tại sao là thuộc tính `crossorigin`? {#why-the-crossorigin-attribute}

Nếu bạn dùng React từ một CDN, chúng tôi khuyến khích giữ nguyên thuộc tính [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes):

```html
<script crossorigin src="..."></script>
```

Chúng tôi cũng khuyến khích kiểm tra CDN bạn đang sử dụng có đang thiết lập `Access-Control-Allow-Origin: *` cho HTTP header:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

Điều này sẽ tốt cho [error handling experience](/blog/2017/07/26/error-handling-in-react-16.html) trong React phiên bản 16 hoặc hơn.