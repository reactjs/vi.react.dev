---
id: cross-origin-errors
title: Lỗi Cross-origin
permalink: docs/cross-origin-errors.html
---

> Ghi chú:
>
> Bài này chỉ áp dụng trong chế độ phát triển của React. Xử lý lỗi trong chế độ sản phẩm (production mode) được thực hiện với các câu lệnh try/catch.

Trong [chế độ phát triển](/docs/optimizing-performance.html), React sử dụng trình xử lý sự kiện `error` toàn cục để duy trình hành vi "pause on exceptions" ("Tạm dừng khi xảy ra ngoại lệ") của công cụ phát triển của trình duyệt. Nó cũng ghi lại lỗi vào bảng điều khiển dành cho nhà phát triển.

Nếu có một lỗi được đưa ra từ một [nguồn khác](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) trình duyệt sẽ che đi các chi tiết của nó và React sẽ không thể ghi lại thông báo lỗi gốc. Đây là biện pháp phòng ngừa bảo mật được thực hiện bởi trình duyệt nhằm tránh rò rỉ thông tin nhạy cảm.

Bạn có thể đơn giản hóa quy trình phát triển/gỡ lỗi bằng cách đảm bảo rằng các lỗi được đưa ra với cùng một nguồn. Dưới đây là một số nguyên nhân phổ biến gây ra lỗi có nguồn gốc khác nhau và cách giải quyết chúng.

### CDN {#cdn}

Khi tải React (hoặc các thư viện khác có thể gây ra lỗi) từ một CDN (mạng phân phối nội dung), hãy thêm thuộc tính [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) vào trong thẻ `<script>` của bạn:

```html
<script crossorigin src="..."></script>
```

Đồng thời chắc chắn rằng CDN phản hồi với một HTTP header `Access-Control-Allow-Origin: *`:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

### Webpack {#webpack}

#### Source maps {#source-maps}

Một số công cụ đóng gói Javascript có thể bọc mã ứng dụng bằng các câu lệnh `eval` trong quá trình phát triển. (Ví dụ: Webpack sẽ thực hiện việc này nếu [`devtool`](https://webpack.js.org/configuration/devtool/) được thiết lập từ bất kỳ giá trị nào có chưa từ khóa "eval".) Điều này có thể khiến các lỗi được coi là có nguồn gốc chéo nhau.

Nếu bạn sử dụng Webpack, chúng tôi khuyên bạn nên sử dụng cài đặt `cheap-module-source-map` trong quá trình phát triển để tránh vấn đề này.

#### Tách code {#code-splitting}

Nếu ứng dụng của bạn được chia thành nhiều gói, các gói này có thể được tải bằng JSONP. Điều này có thể gây ra lỗi được đưa ra trong code của các gói này sẽ được coi là có nguồn gốc chéo nhau.

Để giải quyết vấn đề này, sử dụng cài đặt [`crossOriginLoading`](https://webpack.js.org/configuration/output/#output-crossoriginloading) trong khi phát triển để thêm thuộc tính `crossorigin` vào thẻ `<script>` được tạo ra bởi JSONP request.
