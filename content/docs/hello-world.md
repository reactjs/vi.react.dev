---
id: hello-world
title: Hello World
permalink: docs/hello-world.html
prev: cdn-links.html
next: introducing-jsx.html
---

Một ví dụ đơn giản nhất của React trông như thế này:

```js
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

Ví dụ trên hiển thị một tiêu đề với dòng chữ "Hello, world!" trên trang web.

[](codepen://hello-world)

Nhấn vào link bên trên để mở một trình soạn thảo trực tuyến. Hãy tự nhiên để làm vài sự thay đổi và thấy nó ảnh hưởng đến kết quả như thế nào. Hầu hết các trang trong hướng dẫn này sẽ có những ví dụ mà bạn có thể thay đổi được giống như ví dụ này.


## Làm sao để đọc hướng dẫn này {#how-to-read-this-guide}

Trong hướng dẫn này, chúng ta sẽ xem xét các "khối xây dựng" (building block) của các ứng dụng React: element và component. Một khi bạn đã nắm vững chúng, bạn có thể tạo ra những ứng dụng lớn hơn từ những component nhỏ có tính tái sử dụng.

>Mẹo nhỏ
>
>Hướng dẫn này được thiết kế cho những người dự định **tiếp cận các khái niệm từng bước một**. Nếu bạn có dự định tiếp cận theo cách thực hành, bạn nên tham khảo [hướng dẫn thực hành](/tutorial/tutorial.html) của chúng tôi. Bạn có thể tìm hướng dẫn này và chỉ dẫn thực hành bổ sung cho nhau.

Đây là chương đầu tiên trong hướng dẫn từng bước về các khái niệm cơ bản của React. Bạn có thể tìm thấy một danh sách tất cả các chương của nó trong thanh công cụ điều hướng. Nếu bạn đang đọc cái này trên điện thoại, bạn cũng có thể truy cập điều hướng bằng cách nhấn vào nút ở bên phải phía dưới góc màn hình của bạn.

Mỗi chương trong hướng dẫn này xây dựng trên kiến thức đã giới thiệu trong những chương trước. **Bạn có thể học phần lớn React bằng cách đọc các chương hướng dẫn “Các khái niệm chính” theo thứ tự của chúng ở trong thanh công cụ**. Ví dụ, [“Giới thiệu JSX”](/docs/introducing-jsx.html) là chương kế tiếp của chương này.

## Kiến thức cơ bản cần có {#knowledge-level-assumptions}

React là một thư viện JavaScript, và vì thế chúng tôi giả định là bạn có một sự hiểu biết cơ bản về ngôn ngữ JavaScript. **Nếu bạn cảm thấy không tự tin, chúng tôi khuyên bạn [lướt qua một hướng dẫn về JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) để kiểm tra kiến thức của bạn** và điều đó sẽ giúp bạn tiếp tục hướng dẫn này mà không bị lạc hướng. Điều này có thể cần 30 phút hoặc một tiếng đồng hồ, nhưng với kết quả cuối cùng thì bạn sẽ không phải cảm thấy giống như bạn đang học React và JavaScript cùng một thời điểm.

>Ghi chú
>
>Hướng dẫn này thỉnh thoảng sử dụng một vài cấu trúc JavaScript mới trong các ví dụ. Nếu bạn chưa từng làm việc với JavaScript trong những năm gần đây, [Ba điều này](https://gist.github.com/gaearon/683e676101005de0add59e8bb345340c) sẽ mang cho bạn kiến thức để bạn cảm thấy thoải mái hơn khi đọc các tài liệu của React.


## Hãy cùng bắt đầu nhé! {#lets-get-started}

Tiếp tục kéo xuống bên dưới, và bạn sẽ tìm thấy đường dẫn đến [chương kế tiếp của hướng dẫn này](/docs/introducing-jsx.html) ngay mép bên phải trên cái chân của website.


