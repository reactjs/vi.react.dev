---
id: cdn-links
title: Liên kết CDN
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

Cả React và ReactDOM đều có sẵn trên CDN.

```html
<script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
```

Các phiên bản trên chỉ dành cho phát triển và không phù hợp để sản xuất. Các phiên bản sản xuất thu nhỏ và tối ưu hóa của React có sẵn tại:

```html
<script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
```

Để tải một phiên bản cụ thể của `react` và `react-dom`, hãy thay thế `17` bằng số phiên bản.

### Tại sao lại có thuộc tính `crossorigin`? {#why-the-crossorigin-attribute}

Nếu bạn phân phối React từ CDN, chúng tôi khuyên bạn nên giữ bộ thuộc tính [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes):

```html
<script crossorigin src="..."></script>
```

Chúng tôi cũng khuyên bạn nên xác minh rằng CDN bạn đang sử dụng đặt `Access-Control-Allow-Origin: *` ở tiêu đề HTTP:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

Điều này cho phép [trải nghiệm xử lý lỗi](/blog/2017/07/26/error-handling-in-react-16.html) tốt hơn trong React 16 trở lên.
