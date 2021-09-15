---
id: faq-state
title: Component State
permalink: docs/faq-state.html
layout: docs
category: FAQ
---

### `setState` để làm gì? {#what-does-setstate-do}

`setState()` lên lịch cập nhật cho một object `state` của component. Khi state thay đổi, component phản hồi bằng cách hiển thị lại.

### Sự khác biệt giữa `state` và `props`? {#what-is-the-difference-between-state-and-props}

[`props`](/docs/components-and-props.html) (viết tắt của "properties") và [`state`](/docs/state-and-lifecycle.html) đều là các object JavaScript đơn giản. Mặc dù cả hai đều nắm giữ thông tin ảnh hưởng đến kết quả hiển thị, nhưng chúng khác nhau ở một điểm quan trọng: `props` được chuyển *cho* component (tương tự như các tham số function) nhưng trái lại `state` được quản lý *trong* component (tương tự như các biến được khai báo trong một function).

Dưới đây là một số nguồn tốt để đọc thêm về thời điểm sử dụng `props` so với `state`:
* [Props với State](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
* [ReactJS: Props với State](https://lucybain.com/blog/2016/react-state-vs-pros/)

### Tại sao `setState` lại cho tôi giá trị sai? {#why-is-setstate-giving-me-the-wrong-value}

Trong React, cả `this.props` và `this.state` đều đại diện cho các giá trị *được hiển thị*, tức là những gì hiện có trên màn hình.

Các lệnh gọi đến `setState` là bất đồng bộ - đừng dựa vào `this.state` để phản ánh giá trị mới sau khi gọi `setState`. Truyền một function cập nhật thay vì một object nếu bạn cần tính toán các giá trị dựa trên state hiện tại (xem chi tiết bên dưới).

Ví dụ về code sẽ *không* hoạt động như mong đợi:

```jsx
incrementCount() {
  // Ghi chú: điều này sẽ *không* hoạt động như dự định.
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // Giả sử `this.state.count` bắt đầu 0.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();
  // Khi React hiển thị lại component, `this.state.count` sẽ là 1, bạn mong muốn là 3.

  // Điều này do hàm `incrementCount()` ở trên đọc từ `this.state.count`,
  // nhưng React không cập nhật `this.state.count` cho đến khi thành phần được hiển thị lại.
  // Vì vậy `incrementCount()` kết thúc bằng cách đọc `this.state.count` là 0 mỗi lần, và đặt nó thành 1.

  // Cách khắc phục được mô tả bên dưới!
}
```

Xem bên dưới để biết cách khắc phục sự cố này.

### Làm cách nào để cập nhật state với các giá trị phụ thuộc vào state hiện tại? {#how-do-i-update-state-with-values-that-depend-on-the-current-state}

Truyền một function thay vì một object vào `setState` để đảm bảo cuộc gọi luôn sử dụng state cập nhật mới nhất (xem bên dưới). 

### Sự khác biệt giữa truyền một object hoặc một function trong `setState` là gì? {#what-is-the-difference-between-passing-an-object-or-a-function-in-setstate}

Chuyển một function cập nhật cho phép bạn truy cập giá trị trạng thái hiện tại bên trong trình cập nhật. Vì các lệnh gọi `setState` được thực hiện theo đợt, điều này cho phép bạn cập nhật chuỗi và đảm bảo chúng xây dựng dựa trên nhau thay vì xung đột:

```jsx
incrementCount() {
  this.setState((state) => {
    // Quan trọng: đọc `state` thay vì` this.state` khi cập nhật.
    return {count: state.count + 1}
  });
}

handleSomething() {
  // Giả sử `this.state.count` bắt đầu từ 0.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();

  // Nếu bây giờ bạn đọc `this.state.count`, nó vẫn là 0.
  // Nhưng khi React hiển thị component, nó sẽ là 3.
}
```

[Tìm hiểu thêm về setState](/docs/react-component.html#setstate)

### Khi nào `setState` bất đồng bộ? {#when-is-setstate-asynchronous}

Hiện tại, `setState` là bất đồng bộ bên trong các trình xử lý sự kiện.

Ví dụ, điều này đảm bảo rằng nếu cả `Cha` và `Con` gọi `setState` trong một sự kiện nhấp chuột, `Con` con không được hiển thị lại 2 lần. Thay vào đó, React “xóa” các cập nhật state vào cuối sự kiện trình duyệt. Điều này dẫn đến cải thiện hiệu suất đáng kể trong các ứng dụng lớn hơn.

Đây là một chi tiết hoàn thiện nên tránh dựa dẫm vào nó trực tiếp. Trong các phiên bản tương lai, React sẽ cập nhật hàng loạt theo mặc định trong nhiều trường hợp hơn.

### Tại sao React không cập nhật `this.state` một cách đồng bộ? {#why-doesnt-react-update-thisstate-synchronously}

Như đã giải thích trong phần trước, React chủ ý "đợi" cho đến khi tất cả các thành phần gọi `setState()` trong trình xử lý sự kiện của họ trước khi bắt đầu hiển thị lại. Điều này tăng hiệu suất bằng cách tránh các hiển thị không cần thiết.

Tuy nhiên, bạn vẫn có thể thắc mắc tại sao React không cập nhật `this.state` ngay lập tức mà không hiển thị lại.

Có hai lý do chính:

* Điều này sẽ phá vỡ sự nhất quán giữa `props` và `state`, gây ra các vấn đề rất khó gỡ lỗi.
* Điều này sẽ khiến một số tính năng mới mà chúng tôi đang nghiên cứu không thể triển khai.

[Nhận xét Github](https://github.com/facebook/react/issues/11527#issuecomment-360199710) này đi sâu vào các ví dụ cụ thể.

### Tôi có nên sử dụng thư viện quản lý state như Redux hoặc MobX không? {#should-i-use-a-state-management-library-like-redux-or-mobx}

[Có lẽ.](https://redux.js.org/faq/general#when-should-i-use-redux)

Bạn nên làm quen với React trước, trước khi sử dụng các thư viện bổ sung. Bạn có thể xây dựng các ứng dụng khá phức tạp chỉ bằng React.
