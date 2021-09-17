---
id: shallow-compare
title: Shallow Compare
permalink: docs/shallow-compare.html
layout: docs
category: Reference
---

> Lưu ý:
>
> `shallowCompare` được kế thừa từ add-on. Sử dụng [`React.memo`](/docs/react-api.html#reactmemo) hoặc [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) thay thế.

**Importing**

```javascript
import shallowCompare from 'react-addons-shallow-compare'; // ES6
var shallowCompare = require('react-addons-shallow-compare'); // ES5 với npm
```

## Tổng quát {#overview}


Trước khi [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) được giới thiệu, `shallowCompare` thường được sử dụng có chức năng tương tự như [`PureRenderMixin`](pure-render-mixin.html) trong khi sử dụng các lớp ES6 với React.

Nếu render function của React component là "thuần" (nói một cách khác, nó trả về cùng một kết quả với cùng props và state), bạn có thể dùng helper function để tăng cường hiệu suất trong một số trường hợp.


Ví dụ:

```js
export class SampleComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return <div className={this.props.className}>foo</div>;
  }
}
```

`shallowCompare` thực hiện kiểm tra shallow equality ở các đối tượng `props` và `nextProps` hiện tại cũng như các đối tượng `state` và `nextState` hiện tại. Nó thực hiện điều này bằng cách thực hiện lặp đi lặp lại trên các khóa của đối tượng được so sánh và trả về true khi các giá trị của khóa ở mỗi đối tượng không hoàn toàn bằng nhau.

`shallowCompare` trả về `true` nếu phép so sánh shallow cho props hoặc state thất bại và component sẽ được cập nhật.

`shallowCompare` trả về `false` nếu phép so sánh shallow cho props hoặc state thành công và component không cần cập nhật.

