---
id: faq-internals
title: Virtual DOM and Internals
permalink: docs/faq-internals.html
layout: docs
category: FAQ
---

### Virtual DOM là gì?{#what-is-the-virtual-dom}

Virtual DOM (VDOM) là một khái niệm lập trình trong đó dạng đại diện tiêu chuẩn, hoặc đại diện "ảo" của giao diện người dùng sẽ được lưu trong bộ nhớ và được đồng bộ hóa với DOM "thật" bởi một dạng thư viện như là ReactDOM. Quá trình đó được gọi là [reconciliation](https://reactjs.org/docs/reconciliation.html).

Cách tiếp cận này kích hoạt API khai báo của React: Bạn cho React biết bạn muốn giao diện người dùng ở trạng thái nào và nó đảm bảo DOM khớp với trạng thái đó. Nhờ vậy sẽ rút gọn thao tác thuộc tính, xử lý sự kiện, và cập nhật DOM thủ công, tất cả mọi thứ bạn cần phải làm để xây dựng ứng dụng của mình.

Vì "virtual DOM" giống một kiểu mẫu có sẵn hơn là một công nghệ cụ thể, nên đôi khi mọi người nói nó có một ý nghĩa khác. Trong thế giới React, thuật ngữ "virtual DOM" thường được kết hợp với các phần tử React vì chúng là các đối tượng đại diện cho giao diện người dùng. Tuy nhiên, các phần tử của React cũng sử dụng các đối tượng bên trong, hay còn gọi là "sợi", để giữ thông tin bổ sung theo sơ đồ cây. Chúng cũng có thể được coi là một phần của việc triển khai "virtual DOM" trong React.
### Shadow DOM có giống Virtual DOM không? {#is-the-shadow-dom-the-same-as-the-virtual-dom}

Không, chúng khác nhau. Shadow DOM là một công nghệ trình duyệt được thiết kế chủ yếu cho các Variable Scope(phạm vi của biến) và CSS trong các thành web(components). Virtual DOM là một khái niệm được thực hiện bởi các thư viện bằng JavaScript trên các API của trình duyệt.

### "React Fiber" là gì? {#what-is-react-fiber}

React Fiber là bản tái cấu trúc thuật toán nền tảng của React trong React 16. Mục tiêu của React Fiber là tăng cường khả năng thích ứng với một số khía cạnh như hoạt ảnh (animation), bố cục (layout) hay cử chỉ (gestures). [Read more](https://github.com/acdlite/react-fiber-architecture).
