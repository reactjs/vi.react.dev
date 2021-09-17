---
title: Refs Must Have Owner Warning
layout: single
permalink: warnings/refs-must-have-owner.html
---

Có thể bạn đang ở đây vì bạn đang gặp một trong các thông báo lỗi sau đây:

*React 16.0.0+*
> Lời cảnh báo:
>
> Element ref đã được chỉ định dưới dạng một string (myRefName) nhưng không có chủ sở hữu được thiết lập. Bạn có thể đang nạp nhiều bản sao của React. (thông tin chi tiết: https://fb.me/react-refs-must-have-owner).

*đối với các phiên bản trước của React*
> Lời cảnh báo:
>
> addComponentAsRefTo(...): Chỉ duy nhất ReactOwner mới có thể có refs. Bạn có thể đang thêm một ref vào một component không được tạo ra bên trong phương thức `render` của component này, hoặc bạn có nhiều bản sao của React đang được nạp.

Điều này thường được hiểu theo một trong ba điều sau:

- Bạn đang cố gắng thêm một `ref` vào một function component.
- Bạn đang cố gắng thêm một `ref` vào một element đang được khởi tạo bên ngoài hàm render của component bạn đang muốn thêm `ref`.
- Bạn có nhiều (conflicting: xung đột) bản sao của React đang được nạp (ví dụ : do npm dependency bị cấu hình sai)

## Refs trong Function Components {#refs-on-function-components}

Nếu `<Foo>` là một function component, Bạn không thể thêm một ref vào nó:

```js
// Không hoạt động nếu Foo là một function!
<Foo ref={foo} />
```

Nếu bạn cần thêm một ref vào component, hãy chuyển component đó sang class thay vì dùng function, hoặc xem xét không sử dụng refs vì chúng [hiếm khi cần thiết](/docs/refs-and-the-dom.html#when-to-use-refs).

## Strings Refs bên ngoài phương thức Render {#strings-refs-outside-the-render-method}

Điều này thường có nghĩa là bạn đang cố gắng thêm một ref vào component không có chủ sở hữu (nghĩa là nó không được tạo bên trong phương thức `render` của component khác). Ví dụ, điều này sẽ không thể hoạt động:

```js
// Không hoạt động!
ReactDOM.render(<App ref="app" />, el);
```

Thử rendering component này bên trong một component cấp cao hơn (thường được gọi là component cha), component này sẽ giữ ref. Ngoài ra, bạn có thể sử dụng một callback ref như sau:

```js
let app;
ReactDOM.render(
  <App ref={inst => {
    app = inst;
  }} />,
  el
);
```

Hãy cân nhắc xem bạn có  [thực sự cần một ref](/docs/refs-and-the-dom.html#when-to-use-refs) trước khi sử dụng phương pháp này hay không.

## Các bản sao của React {#multiple-copies-of-react}

Bower thực hiện tốt công việc loại bỏ trùng lặp các dependency, nhưng npm thì không. Nếu bạn không làm bất cứ điều gì (yêu thích) với refs, đây là một cơ hội tốt vì vấn đề không phải ở refs của bạn, mà là vấn đề với việc đang có nhiều bản sao của React được nạp vào dự án của bạn. Đôi khi, khi bạn đang tải về một module thứ ba thông qua npm, bạn sẽ nhận được một bản sao của thư viện dependency, và điều này có thể đã tạo ra vấn đề.

Nếu bạn đang sử dụng npm... `npm ls` hoặc `npm ls react` có thể giúp bạn giải quyết.
