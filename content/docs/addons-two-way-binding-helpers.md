---
id: two-way-binding-helpers
title: Two-way Binding Helpers
permalink: docs/two-way-binding-helpers.html
layout: docs
category: Add-Ons
---

> Note:
>
> `LinkedStateMixin` is deprecated as of React v15. The recommendation is to explicitly set the value and change handler, instead of using `LinkedStateMixin`.

**Importing**

```javascript
import LinkedStateMixin from 'react-addons-linked-state-mixin'; // ES6
var LinkedStateMixin = require('react-addons-linked-state-mixin'); // ES5 with npm
```

## Overview {#overview}

`LinkedStateMixin` là một cách dễ dàng để thể hiện ràng buộc (binding) hai chiều với React..

Trong React, dữ liệu đổ theo một chiều: từ chủ sở hữu sang con. Chúng tôi nghĩ rằng điều này làm cho code ứng dụng của bạn dễ hiểu hơn. Bạn có thể coi nó là "ràng buộc (binding) dữ liệu một chiều".

Tuy nhiên, có rất nhiều ứng dụng yêu cầu bạn đọc một số dữ liệu và chuyển nó trở lại chương trình của bạn. Ví dụ: khi phát triển forms, bạn thường muốn cập nhật một số `state` của React khi nhận được thông tin đầu vào của người dùng. Hoặc có lẽ bạn muốn thực hiện layout trong JavaScript và react thay đổi một số kích thước phần tử DOM.

Trong React, bạn sẽ triển khai điều này bằng cách lắng nghe sự kiện "thay đổi", đọc từ nguồn dữ liệu của bạn (thường là DOM) và gọi `setState()` trên một trong các components. "Dừng vòng lặp dữ liệu" cho ra các chương trình dễ hiểu hơn và dễ bảo trì hơn. Xem [our forms documentation](/docs/forms.html) để biết thêm chi tiết.

Ràng buộc hai chiều -- ngầm thực thi rằng một số giá trị trong DOM luôn nhất quán với một số trong React `state` -- ngắn gọn và hỗ trợ nhiều ứng dụng. Chúng tôi đã cung cấp `LinkedStateMixin`: cú pháp để thiết lập mẫu vòng lặp luồng dữ liệu chung được mô tả ở trên, hoặc "kết nối" một số nguồn dữ liệu tới React `state`.

> Note:
>
> `LinkedStateMixin` chỉ là một lớp vỏ bọc mỏng và quy ước xung quanh `onChange`/`setState()`. Về cơ bản, nó không thay đổi cách dữ liệu hoạt động trong ứng dụng React của bạn.

## LinkedStateMixin: Trước và sau {#linkedstatemixin-before-and-after}

Đây là một ví dụ về biểu mẫu đơn giản mà không cần sử dụng `LinkedStateMixin`:

```javascript
var createReactClass = require('create-react-class');

var NoLink = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },
  handleChange: function(event) {
    this.setState({message: event.target.value});
  },
  render: function() {
    var message = this.state.message;
    return <input type="text" value={message} onChange={this.handleChange} />;
  }
});
```

Điều này thực sự hoạt động tốt và rất rõ ràng về cách dữ liệu đang hoạt động, tuy nhiên, với nhiều trường biểu mẫu, nó có thể hơi dài dòng. Hãy dùng `LinkedStateMixin` để tiết kiệm thời gian viết:

```javascript{4,9}
var createReactClass = require('create-react-class');

var WithLink = createReactClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return {message: 'Hello!'};
  },
  render: function() {
    return <input type="text" valueLink={this.linkState('message')} />;
  }
});
```

`LinkedStateMixin` thêm một phương thức vào thành phần React của bạn được gọi là `linkState()`. `linkState()` trả về một `valueLink` đối tượng chứa giá trị hiện tại của trạng thái React và một lệnh gọi lại để thay đổi nó.

`valueLink` object có thể được đưa lên và xuống "cây" làm props, vì vậy nó dễ dàng (và rõ ràng) để thiết lập ràng buộc hai chiều giữa một thành phần nằm sâu trong hệ thống phân cấp và trạng thái tồn tại cao hơn trong hệ thống phân cấp.

Lưu ý rằng các hộp kiểm có một hành vi đặc biệt liên quan đến thuộc tính `value`, là giá trị sẽ được gửi khi gửi biểu mẫu nếu hộp kiểm được chọn (mặc định là `on`). Thuộc tính `value` không được cập nhật khi hộp kiểm được chọn hoặc bỏ chọn. Đối với các hộp kiểm, bạn nên dùng `checkedLink` thay cho `valueLink`:
```
<input type="checkbox" checkedLink={this.linkState('booleanValue')} />
```

## Under the Hood {#under-the-hood}

Có hai mặt để `LinkedStateMixin`: nơi bạn tạo ra `valueLink` và nơi bạn sử dụng nó. Để chứng minh một cách đơn giản `LinkedStateMixin` là gì, hãy viết lại từng bên riêng biệt để rõ ràng hơn.

### valueLink Without LinkedStateMixin {#valuelink-without-linkedstatemixin}

```javascript{7-9,11-14}
var createReactClass = require('create-react-class');

var WithoutMixin = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },
  handleChange: function(newValue) {
    this.setState({message: newValue});
  },
  render: function() {
    var valueLink = {
      value: this.state.message,
      requestChange: this.handleChange
    };
    return <input type="text" valueLink={valueLink} />;
  }
});
```

Bạn có thể thấy, đối tượng `valueLink` là những đối tượng rất đơn giản chỉ có `value` và `requestChange`. Và `LinkedStateMixin` tương tự đơn giản như: nó chỉ điền vào các trường đó một giá trị từ `this.state` và một "callback" để gọi lại `this.setState()`.

### LinkedStateMixin Without valueLink {#linkedstatemixin-without-valuelink}

```javascript
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var createReactClass = require('create-react-class');

var WithoutLink = createReactClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return {message: 'Hello!'};
  },
  render: function() {
    var valueLink = this.linkState('message');
    var handleChange = function(e) {
      valueLink.requestChange(e.target.value);
    };
    return <input type="text" value={valueLink.value} onChange={handleChange} />;
  }
});
```

`valueLink` cũng khá đơn giản. Nó chỉ đơn giản là xử lý sự kiện `onChange` và gọi `this.props.valueLink.requestChange()` và cũng được dùng như `this.props.valueLink.value` thay cho `this.props.value`. Là vậy đó!
