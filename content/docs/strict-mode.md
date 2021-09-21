---
id: strict-mode
title: Strict Mode
permalink: docs/strict-mode.html
---

`StrictMode` là một công cụ để làm nổi bật các vấn đề tiềm ẩn trong một ứng dụng. Giống như `Fragment`, `StrictMode` không render bất kỳ giao diện nào. Nó kích hoạt các kiểm tra mở rộng và cảnh báo bổ sung cho các component con.

> Ghi chú:
>
> Các kiểm tra StrictMode chỉ thực hiện trong môi trường phát triển; _chúng không ảnh hưởng đến quá trình build production_.

Bạn có thể bật chế độ StrictMode cho bất kỳ phần nào trong ứng dụng của mình. Ví dụ :
`embed:strict-mode/enabling-strict-mode.js`

Trong ví dụ trên, các kiểm tra StrictMode *không* chạy trên component `Header` và `Footer`. Tuy nhiên, `ComponentOne` và `ComponentTwo`, cũng như tất cả các component con sẽ có các kiểm tra.

`StrictMode` hiện tại hỗ trợ:
* [Xác định các thành phần có lifecycle không an toàn](#identifying-unsafe-lifecycles)
* [Cảnh báo về việc sử dụng API tham chiếu chuỗi kiểu cũ](#warning-about-legacy-string-ref-api-usage)
* [Cảnh báo về việc sử dụng findDOMNode không còn dùng nữa](#warning-about-deprecated-finddomnode-usage)
* [Phát hiện các side-effects không mong muốn](#detecting-unexpected-side-effects)
* [Phát hiện Context API cũ](#detecting-legacy-context-api)

Chức năng bổ sung sẽ được thêm vào với các bản phát hành React trong tương lai.

### Xác định các lifecycle không an toàn {#identifying-unsafe-lifecycles}

Như đã giải thích [trong bài viết này](/blog/2018/03/27/update-on-async-rendering.html), một số phương thức lifecycle cũ không an toàn để sử dụng trong ứng dụng React bất đồng bộ. Tuy nhiên, nếu ứng dụng của bạn sử dụng thư viện của bên thứ ba, có thể khó đảm bảo rằng những lifecycle này không được sử dụng. May mắn, chế độ StrictMode có thể giúp giải quyết vấn đề này!

Khi chế độ StrictMode được bật, React biên dịch danh sách tất cả các component bằng cách sử dụng các lifecycle không an toàn, và ghi lại một thông báo cảnh báo với thông tin về các component này, như sau: 

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

Giải quyết các vấn đề được xác định bởi StrictMode _bây giờ_ sẽ giúp bạn dễ dàng hơn trong việc tận dụng render đồng thời trong các phiên bản tương lai của React.

### Cảnh báo về việc sử dụng API tham chiếu chuỗi kiểu cũ {#warning-about-legacy-string-ref-api-usage}

Trước đây, React đã cung cấp hai cách để quản lý các tham chiếu: API tham chiếu chuỗi kiểu cũ và API gọi lại. Mặc dù API tham chiếu chuỗi thuận tiện hơn trong cả hai, nhưng nó có [một số nhược điểm](https://github.com/facebook/react/issues/1373) và vì vậy khuyến nghị chính thức của chúng tôi là [sử dụng biểu mẫu gọi lại để thay thế](/docs/refs-and-the-dom.html#legacy-api-string-refs).

React 16.3 đã thêm một tùy chọn thứ ba mang lại sự tiện lợi của một chuỗi tham chiếu mà không có bất kỳ nhược điểm nào:
`embed:16-3-release-blog-post/create-ref-example.js`

Vì các đối tượng tham chiếu được đưa vào để thay thế cho các tham chiếu chuỗi, StrictMode sẽ hiện cảnh báo về việc sử dụng các tham chiếu chuỗi.

> **Ghi chú:**
>
> Các tham chiếu callback sẽ tiếp tục được hỗ trợ ngoài `createRef` API mới.
>
> Bạn không cần phải thay thế các tham chiếu callback trong các components của bạn. Chúng linh hoạt hơn một chút, vì vậy chúng sẽ vẫn là một tính năng nâng cao.

[Tìm hiểu thêm về API `createRef` mới tại đây.](/docs/refs-and-the-dom.html)

### Cảnh báo về việc sử dụng findDOMNode không còn dùng nữa {#warning-about-deprecated-finddomnode-usage}

React được sử dụng để hỗ trợ `findDOMNode` tìm kiếm trên cây cho một nút DOM đã xác định phiên bản lớp. Thông thường, bạn không cần điều này bởi vì bạn có thể [đính kèm một tham chiếu trực tiếp vào một nút DOM] (/docs/refs-and-the-dom.html#creating-refs).

`findDOMNode` cũng có thể được sử dụng trên class components nhưng điều này đã phá vỡ mức trừu tượng bằng cách cho phép lớp cha yêu cầu một số lớp con nhất định được render. Nó tạo ra một nguy cơ tái cấu trúc nơi bạn không thể thay đổi chi tiết triển khai của một component bởi vì một lớp cha có thể đang truy cập vào nút DOM của nó. `findDOMNode` chỉ trả về thành phần con đầu tiên, nhưng với việc sử dụng Fragments, một component có thể render nhiều nút DOM. `findDOMNode` là API đọc một lần. Nó chỉ cho bạn câu trả lời khi bạn yêu cầu nó. Nếu một component con hiển thị một nút khác, không có cách nào để xử lý thay đổi này. Do đó, `findDOMNode` chỉ hoạt động nếu các component luôn trả về một nút DOM duy nhất không bao giờ thay đổi.

Thay vào đó, bạn có thể làm cho điều này rõ ràng bằng cách chuyển một tham chiếu đến component tùy chỉnh của bạn và chuyển nó cùng với DOM bằng cách sử dụng [chuyển tiếp tham chiếu](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Bạn cũng có thể thêm một lớp bọc nút DOM trong component và đính kèm một tham chiếu trực tiếp đến nó.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }
  render() {
    return <div ref={this.wrapper}>{this.props.children}</div>;
  }
}
```

> Ghi chú:
>
> Trong CSS, thuộc tính [`display: contents`](https://developer.mozilla.org/en-US/docs/Web/CSS/display#display_contents) có thể được sử dụng nếu bạn không muốn một nút thành một phần của layout.

### Phát hiện side-effects không mong muốn {#detecting-unexpected-side-effects}

Về mặt khái niệm, React hoạt động theo hai giai đoạn:
* Giai đoạn **render** xác định thay đổi nào cần được thực hiện. Ví dụ: DOM. Trong giai đoạn này, React gọi `render` và sau đó so sánh kết quả với lần render trước đó.
* Giai đoạn **commit** là khi React áp dụng bất kỳ thay đổi nào. (Trong trường hợp của React DOM, đây là khi React chèn, cập nhật và loại bỏ các nút DOM .) React cũng sẽ gọi các lifecycles như `componentDidMount` và `componentDidUpdate` trong giai đoạn này.

Giai đoạn commit thường rất nhanh, nhưng render có thể chậm. Vì lý do này, chế độ concurrent (chưa được bật theo mặc định) chia nhỏ công việc render thành nhiều mảnh, tạm dừng và tiếp tục công việc để tránh chặn trình duyệt. Điều này có nghĩa là React sẽ gọi các lifecycle của giai đoạn render nhiều lần trước khi commit, hoặc nó có thể gọi chúng mà không thực hiện commit (do một lỗi hoặc sự gián đoạn có mức độ ưu tiên cao hơn).

Các lifecycle trong giai đoạn render bao gồm những phương thức sau:
* `constructor`
* `componentWillMount` (hoặc `UNSAFE_componentWillMount`)
* `componentWillReceiveProps` (hoặc `UNSAFE_componentWillReceiveProps`)
* `componentWillUpdate` (hoặcor `UNSAFE_componentWillUpdate`)
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* `setState` hàm cập nhật (tham số đầu tiên)

Vì các phương thức trên có thể được gọi nhiều lần, điều quan trọng là nó không chứa side-effects. Bỏ qua quy tắc này có thể dẫn đến nhiều vấn đề, bao gồm rò rỉ bộ nhớ và trạng thái ứng dụng không hợp lệ. Thật không may, có thể khó phát hiện những vấn đề này vì chúng thường có thể [không xác định](https://en.wikipedia.org/wiki/Deterministic_algorithm).

StrictMode không thể tự phát hiện các side-effect cho bạn, nhưng nó có thể giúp bạn phát hiện chúng bằng cách làm cho chúng dễ xác định hơn một chút. Điều này được thực hiện bằng cách cố ý gọi kép các hàm sau:

* Các phương thức `constructor`, `render`, and `shouldComponentUpdate` trong class component
* Phương thức tĩnh `getDerivedStateFromProps` trong class component
* Phần thân của function component
* Hàm cập nhật state (tham số đầu tiên của `setState`)
* Các hàm được chuyển vào `useState`, `useMemo`, hoặc `useReducer`

> Ghi chú:
>
> Điều này chỉ áp dụng cho chế độ development. _Lifecycles sẽ không được gọi kép trong chế độ production._ 

Ví dụ, hãy xem xét đoạn mã sau: 
`embed:strict-mode/side-effects-in-constructor.js`

Thoạt nhìn, đoạn mã này có vẻ không có vấn đề. Nhưng nếu `SharedApplicationState.recordEvent` không phải là [idempotent](https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning), thì việc khởi tạo thành phần này nhiều lần có thể dẫn đến trạng thái ứng dụng không hợp lệ. Loại lỗi tinh vi này có thể không biểu hiện trong quá trình phát triển hoặc nó có thể hoạt động không nhất quán và do đó bị bỏ qua.

Bằng các phương thức gọi kép có chủ ý như hàm tạo của component, chế độ StrictMode làm cho các mẫu như thế này dễ phát hiện hơn.

> Ghi chú:
>
> Bắt đầu từ React 17, React tự động sửa đổi các phương thức trong console như `console.log()` để tắt logs trong lần gọi thứ hai đến các hàm lifecycle. Tuy nhiên, nó có thể gây ra hành vi không mong muốn trong một số trường hợp nhất định [có thể sử dụng giải pháp thay thế](https://github.com/facebook/react/issues/20090#issuecomment-715927125).

### Phát hiện Context API cũ {#detecting-legacy-context-api}

Context API cũ dễ xảy ra lỗi và sẽ bị xóa trong phiên bản chính thức tương lai. Nó vẫn hoạt động cho tất cả các bản phát hành 16.x nhưng sẽ hiển thị thông báo cảnh báo này ở chế độ StrictMode:

![](../images/blog/warn-legacy-context-in-strict-mode.png)

Đọc [tài liệu Context API mới](/docs/context.html) để giúp chuyển sang phiên bản mới.
