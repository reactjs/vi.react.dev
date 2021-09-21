---
id: forwarding-refs
title: Chuyển Tiếp Refs
permalink: docs/forwarding-refs.html
---

Chuyển tiếp Refs là một kỹ thuật để tự động chuyển một [ref](/docs/refs-and-the-dom.html) qua một component đến một trong các component con của nó. Điều này thường không cần thiết đối với hầu hết các components trong ứng dụng. Tuy nhiên, nó có thể hữu ích cho một số loại component, đặc biệt là trong các thư viện component có thể tái sử dụng. Các tình huống phổ biến nhất được mô tả dưới đây.

## Chuyển tiếp refs tới các DOM components {#forwarding-refs-to-dom-components}

Hãy xem xét component `FancyButton` hiển thị phần tử DOM của `button` gốc:
`embed:forwarding-refs/fancy-button-simple.js`

Các React components ẩn chi tiết triển khai của chúng, bao gồm cả đầu ra được hiển thị của chúng. Các components khác sử dụng `FancyButton` **thường sẽ không cần** [lấy tham chiếu](/docs/refs-and-the-dom.html) đến phần tử DOM của `button` bên trong. Điều này là tốt vì nó ngăn các components dựa vào cấu trúc DOM của nhau quá nhiều.

Mặc dù việc đóng gói như vậy là mong muốn đối với các components cấp ứng dụng như `FeedStory` hoặc `Comment`, nhưng nó có thể gây bất tiện cho các components “leaf” có thể tái sử dụng cao như `FancyButton` hoặc `MyTextInput`. Các components này có xu hướng được sử dụng trong toàn bộ ứng dụng theo cách tương tự như `button` và `input` DOM thông thường, và việc truy cập vào các DOM nodes của chúng có thể không thể tránh khỏi để quản lý tiêu điểm, lựa chọn hoặc hoạt ảnh.

**Chuyển tiếp Ref là một tính năng chọn tham gia cho phép một số components nhận `tham chiếu` mà chúng nhận được và chuyển tiếp nó xuống (nói cách khác, “chuyển tiếp” nó) cho thành phần con.**

Trong ví dụ dưới đây, `FancyButton` sử dụng `React.forwardRef` để lấy `ref` được chuyển đến nó, sau đó chuyển tiếp nó đến DOM `button` mà nó hiển thị:

`embed:forwarding-refs/fancy-button-simple-ref.js`

Bằng cách này, các components sử dụng `FancyButton` có thể nhận được tham chiếu đến DOM `button` bên dưới và truy cập nó nếu cần - giống như nếu chúng sử dụng trực tiếp DOM `button`.

Dưới đây là giải thích từng bước về những gì xảy ra trong ví dụ trên:

1. Chúng ta tạo một [React ref](/docs/refs-and-the-dom.html) bằng cách gọi `React.createRef` và gán nó cho một biến` ref`.
1. Chúng ta chuyển `ref` xuống`<FancyButton ref={ref}>` bằng cách chỉ định nó như một thuộc tính JSX.
1. React chuyển `ref` tới hàm `(props, ref) => ...` bên trong `forwardRef` như một đối số thứ hai.
1. Chúng ta chuyển tiếp đối số `ref` này xuống `<button ref={ref}>` bằng cách chỉ định nó làm thuộc tính JSX.
1. Khi ref được đính kèm, `ref.current` sẽ trỏ đến DOM node `<button>`.

>Chú ý
>
>Đối số `ref` thứ hai chỉ tồn tại khi bạn xác định một component với lệnh gọi `React.forwardRef`. Các function hoặc class component thông thường không nhận được đối số `ref` và ref cũng không có sẵn trong các props.
>
>Chuyển tiếp Ref không giới hạn đối với các DOM components. Bạn cũng có thể chuyển tiếp các refs đến các class component cá thể.

## Lưu ý cho người bảo trì thư viện component {#note-for-component-library-maintainers}

**Khi bạn bắt đầu sử dụng `forwardRef` trong thư viện component, bạn nên coi nó như một thay đổi đột phá và phát hành một phiên bản chính mới của thư viện của bạn.** Điều này là do thư viện của bạn có thể có một hành vi khác nhau có thể quan sát được (chẳng hạn như những ref được gán cho, và những loại được xuất ra) và điều này có thể phá vỡ các ứng dụng và thư viện khác phụ thuộc vào hành vi cũ.

Việc áp dụng có điều kiện `React.forwardRef` khi nó tồn tại cũng không được khuyến khích vì những lý do tương tự: nó thay đổi cách thư viện của bạn hoạt động và có thể phá vỡ ứng dụng của người dùng khi họ tự nâng cấp React.

## Chuyển tiếp refs trong higher-order components {#forwarding-refs-in-higher-order-components}

Kỹ thuật này cũng có thể đặc biệt hữu ích với [higher-order components](/docs/higher-order-components.html) (còn được gọi là HOCs). Hãy bắt đầu với một HOC mẫu logs ra các props vào console:
`embed:forwarding-refs/log-props-before.js`

HOC "logProps" chuyển tất cả các `props` đến component mà nó bao bọc, vì vậy kết quả hiển thị sẽ giống nhau. Ví dụ, chúng ta có thể sử dụng HOC này để log lại tất cả các props được chuyển đến component "fancy button":
`embed:forwarding-refs/fancy-button.js`

Có một lưu ý cho ví dụ trên: refs sẽ không được chuyển qua. Đó là bởi vì `ref` không phải là một prop. Giống như `key`, nó được React xử lý theo cách khác. Nếu bạn thêm một ref vào HOC, ref này sẽ tham chiếu đến thành phần chứa ngoài cùng, không phải thành phần được bao bọc.

Điều này có nghĩa là các refs dành cho component `FancyButton` của chúng ta sẽ thực sự được gắn vào component `LogProps`:
`embed:forwarding-refs/fancy-button-ref.js`

May mắn thay, chúng ta có thể chuyển tiếp rõ ràng các refs đến thành phần `FancyButton` bên trong bằng cách sử dụng API `React.forwardRef`. `React.forwardRef` chấp nhận một hàm render nhận các tham số `props` và `ref` và trả về một React node. Ví dụ:
`embed:forwarding-refs/log-props-after.js`

## Hiển thị tên tùy chỉnh trong DevTools {#displaying-a-custom-name-in-devtools}

`React.forwardRef` chấp nhận một hàm render. React DevTools sử dụng chức năng này để xác định những gì sẽ hiển thị cho component chuyển tiếp ref.

Ví dụ, component sau sẽ xuất hiện dưới dạng "*ForwardRef*" trong DevTools.

`embed:forwarding-refs/wrapped-component.js`

Nếu bạn đặt tên cho hàm render, DevTools cũng sẽ bao gồm tên của nó (ví dụ: "*ForwardRef(myFunction)*"):

`embed:forwarding-refs/wrapped-component-with-function-name.js`

Bạn thậm chí có thể đặt thuộc tính `displayName` của hàm để bao gồm thành phần mà bạn đang gói:

`embed:forwarding-refs/customized-display-name.js`
