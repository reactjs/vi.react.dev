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

Trước đây [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) đã được giới thiệu, `shallowCompare` thường được sử dụng với chức năng tương tự như [`PureRenderMixin`](pure-render-mixin.html) khi sử dụng ES6 class với React.

Nếu function render của React component của bạn là "pure" (hay nói cách khác, nó render cùng một kết quả với cùng prop và state), bạn có thể sử dụng helper function này để tăng hiệu suất trong một số trường hợp.

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

`shallowCompare` thực hiện so sánh nông object để kiểm tra `props` hiện tại và `nextProps` cũng như `state` hiện tại và `nextState`.  
Nó thực hiện bằng cách lặp lại các key của các object được so sánh và trả về true khi giá trị của key trong mỗi object không hoàn toàn bằng nhau.

`shallowCompare` trả về `true` nếu so sánh nông cho prop or state không thành công và do đó component sẽ được cập nhật.  
`shallowCompare` trả về `false` nếu so sánh nông cho prop and state đều thành công và do đó component không cần cập nhật.
