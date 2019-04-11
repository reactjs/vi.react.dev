---
title: A Stateful Component
order: 1
domid: timer-example
---

Ngoài việc lấy dữ liệu đầu vào (được truy cập qua `this.props`), một thành phần có thể duy trì dữ liệu trạng thái bên trong (được truy cập qua` this.state`). Khi dữ liệu trạng thái của một thành phần thay đổi, sẽ được cập nhật bằng cách gọi lại `render ()`.