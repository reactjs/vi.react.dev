---
id: pure-render-mixin
title: PureRenderMixin
permalink: docs/pure-render-mixin.html
layout: docs
category: Add-Ons
---

> Lưu ý:
>
> `PureRenderMixin` được kế thừa từ add-on. Sử dụng [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) thay thế.

**Importing**

```javascript
import PureRenderMixin from 'react-addons-pure-render-mixin'; // ES6
var PureRenderMixin = require('react-addons-pure-render-mixin'); // ES5 với npm
```

## Tổng quát {#overview}

Nếu function render của React component của bạn hiển thị cùng một kết quả với cùng prop và state, bạn có thể sử dụng mixin để tăng hiệu suất trong một số trường hợp.

Ví dụ:

```js
const createReactClass = require('create-react-class');

createReactClass({
  mixins: [PureRenderMixin],

  render: function() {
    return <div className={this.props.className}>foo</div>;
  }
});
```

Xem xét một cách kỹ lưỡng, mixin thực hiện [shouldComponentUpdate](/docs/component-specs.html#updating-shouldcomponentupdate), trong đó nó so sánh prop và state hiện tại với những cái tiếp theo và trả về `false` nếu chúng bằng nhau.

> Lưu ý:
>
<<<<<<< HEAD
> Đây chỉ là so sánh nông với các object. Nếu object chứa cấu trúc dữ liệu phức tạp, nó có thể tạo ra các trường hợp sai đối với sự khác nhau sâu trong nhiều cấp của object. Chỉ được dùng đối với component có prop và state đơn giản, hoặc dùng `forceUpdate()` khi bạn biết cấu trúc dữ liệu sâu bên trong đã thay đổi. Có thể cân nhắc sử dụng [immutable objects](https://facebook.github.io/immutable-js/) để dễ dàng so sánh các dữ liệu lồng nhau.
=======
> This only shallowly compares the objects. If these contain complex data structures, it may produce false-negatives for deeper differences. Only mix into components which have simple props and state, or use `forceUpdate()` when you know deep data structures have changed. Or, consider using [immutable objects](https://immutable-js.com/) to facilitate fast comparisons of nested data.
>>>>>>> 868d525a74b717a10e0f61bb576213e133aa8d07
>
> Hơn nữa, `shouldComponentUpdate` bỏ qua cập nhật toàn bộ các component con. Hãy đảm bảo rằng tất cả các component con cũng là "pure".
