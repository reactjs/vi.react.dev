---
title: Cài đặt
---

<Intro>

React được thiết kế từ đầu với khả năng áp dụng vào dự án một cách từ từ. Bạn có thể sử dụng càng ít hoặc càng nhiều React theo nhu cầu. Dù là bạn muốn trải nghiệm React, thêm một số tính năng tương tác vào một trang HTML, hay bắt đầu một ứng dụng phức tạp được xây dựng bằng React, phần này sẽ giúp bạn bắt đầu.

</Intro>

## Thử dùng React {/*try-react*/}

Bạn không phải cài đặt bất cứ thứ gì để trải nghiệm React. Hãy thử chỉnh sửa sandbox này!

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

Bạn có thể chỉnh sửa trực tiếp hoặc mở nó trong một tab mới bằng cách ấn vào nút "Fork" ở góc trên bên phải.

Hầu hết các trang trong tài liệu React chứa các sandbox như thế này. Ngoài trang tài liệu React, có rất nhiều các online sandbox hỗ trợ React: ví dụ, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), or [CodePen.](https://codepen.io/pen?template=QWYVwWN)

### Thử dùng React trên máy tính của bạn {/*try-react-locally*/}

Để thử sử dụng React trên máy tính của bạn, [tải về trang HTML này.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Mở nó trong trình soạn thảo và trình duyệt của bạn!

## Tạo một ứng dụng React {/*creating-a-react-app*/}

Nếu bạn muốn bắt đầu xây dựng một ứng dụng React, bạn có thể [tạo một ứng dụng React](/learn/creating-a-react-app) bằng cách sử dụng một framework được giới thiệu.

## Xây dựng một ứng dụng React từ đầu {/*build-a-react-app-from-scratch*/}

Nếu một framework không phù hợp cho dự án của bạn, bạn có thể xây dựng một framework của chính bạn, hoặc bạn chỉ muốn học những cái cơ bản của ứng dụng React, bạn có thể [xây dựng một ứng dụng React từ đầu](/learn/build-a-react-app-from-scratch).

## Thêm React vào một dự án có sẵn {/*add-react-to-an-existing-project*/}

Nếu bạn muốn thử sử dụng React cho ứng dụng đang có sẵn của bạn hoặc một website, [thêm React vào một dự án có sẵn.](/learn/add-react-to-an-existing-project)


<Note>

#### Tôi có nên tạo một ứng dụng React (Create React App)? {/*should-i-use-create-react-app*/}

Không nên. Create React App đã bị lỗi thời. Thêm thông tin, xem tại [Loại bỏ Create React App](/blog/2025/02/14/sunsetting-create-react-app).

</Note>

## Các bước tiếp theo {/*next-steps*/}

Ghé thăm phần [Bắt đầu](/learn) để thăm quan các khái niệm quan trọng nhất của React mà bạn sẽ gặp phải hàng ngày.

