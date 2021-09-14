---
id: cdn-links
title: CDN Links
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

Cả React và ReactDOM đều có thể sử dụng thông qua một CDN

```html
<script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
```

Những phiên bản trên đều chỉ được áp dụng cho phiên bản thử nghiệm, không phù hợp để đưa vào thực tế. Những phiên bản nhỏ gọn và tối ưu cho dự án thực tế là:

```html
<script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
```

Để chạy một phiên bản cụ thể của `react` và `react-dom`, thay thế `17` bằng số phiên bản.

### Tại sao là thuộc tính `crossorigin`? {#why-the-crossorigin-attribute}

Nếu bạn sử dụng React từ một CDN, chúng tôi khuyến khích giữ lại thuộc tính [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes):

```html
<script crossorigin src="..."></script>
```

Chúng tôi cũng khuyến khích kiểm tra xem CDN của bạn đã thiết lập `Access-Control-Allow-Origin: *` vào HTTP header hay chưa:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

Điều này sẽ tốt hơn cho [error handling experience](/blog/2017/07/26/error-handling-in-react-16.html) trong phiên bản React 16 hoặc hơn.
