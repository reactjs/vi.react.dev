---
title: Các API React DOM Client
---

<Intro>

Các API `react-dom/client` cho phép bạn hiển thị các thành phần React trên client (trong trình duyệt). Các API này thường được sử dụng ở cấp cao nhất của ứng dụng để khởi tạo cây React của bạn. Một [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) có thể gọi chúng cho bạn. Hầu hết các thành phần của bạn không cần nhập hoặc sử dụng chúng.

</Intro>

---

## Các API Client {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) cho phép bạn tạo một root để hiển thị các thành phần React bên trong một nút DOM của trình duyệt.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) cho phép bạn hiển thị các thành phần React bên trong một nút DOM của trình duyệt có nội dung HTML đã được tạo trước đó bởi [`react-dom/server`.](/reference/react-dom/server)

---

## Hỗ trợ trình duyệt {/*browser-support*/}

React hỗ trợ tất cả các trình duyệt phổ biến, bao gồm Internet Explorer 9 trở lên. Một số polyfill là bắt buộc đối với các trình duyệt cũ hơn như IE 9 và IE 10.