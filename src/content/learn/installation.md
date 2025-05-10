---
title: Cài đặt
---

<Intro>

React được thiết kế ngay từ đầu để dễ dàng tiếp cận. Bạn có thể sử dụng ít hoặc nhiều React tùy theo nhu cầu. Cho dù bạn muốn dùng thử React, thêm một chút tương tác vào trang HTML hay bắt đầu một ứng dụng phức tạp chạy bằng React, phần này sẽ giúp bạn bắt đầu.

</Intro>

## Thử React {/*try-react*/}

Bạn không cần cài đặt bất cứ thứ gì để làm quen với React. Hãy thử chỉnh sửa sandbox này!

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Xin chào, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

Bạn có thể chỉnh sửa trực tiếp hoặc mở nó trong một tab mới bằng cách nhấn nút "Fork" ở góc trên bên phải.

Hầu hết các trang trong tài liệu React đều chứa các sandbox như thế này. Bên ngoài tài liệu React, có rất nhiều sandbox trực tuyến hỗ trợ React: ví dụ: [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), hoặc [CodePen.](https://codepen.io/pen?template=QWYVwWN)

Để thử React cục bộ trên máy tính của bạn, [tải xuống trang HTML này.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Mở nó trong trình soạn thảo và trong trình duyệt của bạn!

## Tạo một ứng dụng React {/*creating-a-react-app*/}

Nếu bạn muốn bắt đầu một ứng dụng React mới, bạn có thể [tạo một ứng dụng React](/learn/creating-a-react-app) bằng một framework được đề xuất.

## Xây dựng một ứng dụng React từ đầu {/*build-a-react-app-from-scratch*/}

Nếu một framework không phù hợp với dự án của bạn, bạn thích tự xây dựng framework của riêng mình hoặc bạn chỉ muốn tìm hiểu những điều cơ bản của một ứng dụng React, bạn có thể [xây dựng một ứng dụng React từ đầu](/learn/build-a-react-app-from-scratch).

## Thêm React vào một dự án hiện có {/*add-react-to-an-existing-project*/}

Nếu bạn muốn thử sử dụng React trong ứng dụng hoặc trang web hiện có của mình, bạn có thể [thêm React vào một dự án hiện có.](/learn/add-react-to-an-existing-project)

<Note>

#### Tôi có nên sử dụng Create React App không? {/*should-i-use-create-react-app*/}

Không. Create React App đã ngừng hoạt động. Để biết thêm thông tin, hãy xem [Ngừng hoạt động Create React App](/blog/2025/02/14/sunsetting-create-react-app).

</Note>

## Các bước tiếp theo {/*next-steps*/}

Truy cập hướng dẫn [Bắt đầu nhanh](/learn) để có một chuyến tham quan về các khái niệm React quan trọng nhất mà bạn sẽ gặp hàng ngày.
