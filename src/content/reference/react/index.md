---
title: Tổng quan tài liệu tham khảo React
---

<Intro>

Phần này cung cấp tài liệu tham khảo chi tiết để làm việc với React. Để có phần giới thiệu về React, vui lòng truy cập phần [Học tập](/learn).

</Intro>

Tài liệu tham khảo React được chia thành các phần chức năng sau:

## React {/*react*/}

Các tính năng React theo chương trình:

* [Hooks](/reference/react/hooks) - Sử dụng các tính năng React khác nhau từ các components của bạn.
* [Components](/reference/react/components) - Các components dựng sẵn mà bạn có thể sử dụng trong JSX của mình.
* [APIs](/reference/react/apis) - Các API hữu ích để xác định các components.
* [Directives](/reference/rsc/directives) - Cung cấp hướng dẫn cho các bundlers tương thích với React Server Components.

## React DOM {/*react-dom*/}

React-dom chứa các tính năng chỉ được hỗ trợ cho các ứng dụng web (chạy trong môi trường DOM của trình duyệt). Phần này được chia thành các phần sau:

* [Hooks](/reference/react-dom/hooks) - Hooks cho các ứng dụng web chạy trong môi trường DOM của trình duyệt.
* [Components](/reference/react-dom/components) - React hỗ trợ tất cả các components HTML và SVG được tích hợp sẵn của trình duyệt.
* [APIs](/reference/react-dom) - Gói `react-dom` chứa các phương thức chỉ được hỗ trợ trong các ứng dụng web.
* [Client APIs](/reference/react-dom/client) - Các API `react-dom/client` cho phép bạn hiển thị các React components trên máy khách (trong trình duyệt).
* [Server APIs](/reference/react-dom/server) - Các API `react-dom/server` cho phép bạn hiển thị các React components thành HTML trên máy chủ.

## Các quy tắc của React {/*rules-of-react*/}

React có các thành ngữ — hoặc quy tắc — về cách thể hiện các mẫu theo cách dễ hiểu và mang lại các ứng dụng chất lượng cao:

* [Components và Hooks phải thuần khiết](/reference/rules/components-and-hooks-must-be-pure) – Sự thuần khiết giúp mã của bạn dễ hiểu, gỡ lỗi và cho phép React tự động tối ưu hóa các components và hooks của bạn một cách chính xác.
* [React gọi Components và Hooks](/reference/rules/react-calls-components-and-hooks) – React chịu trách nhiệm hiển thị các components và hooks khi cần thiết để tối ưu hóa trải nghiệm người dùng.
* [Quy tắc của Hooks](/reference/rules/rules-of-hooks) – Hooks được định nghĩa bằng các hàm JavaScript, nhưng chúng đại diện cho một loại logic UI có thể tái sử dụng đặc biệt với các hạn chế về nơi chúng có thể được gọi.

## API kế thừa {/*legacy-apis*/}

* [API kế thừa](/reference/react/legacy) - Được xuất từ gói `react`, nhưng không được khuyến nghị sử dụng trong mã mới được viết.
