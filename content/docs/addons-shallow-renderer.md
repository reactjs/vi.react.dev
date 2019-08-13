---
id: shallow-renderer
title: Shallow Renderer
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

**Importing**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 with npm
```

## Overview {#overview}

Khi viết Unit Test cho React, render cạn có thể là cách hữu dụng. Việc render cạn cho phép bạn render một component "sâu một lớp" và xác nhận được sự trung thực của kết quả trả về từ hàm render, mà không cần quan tâm về cách hoạt động của những component con, khi mà chúng không được khởi tạo và render. Việc này không cần dùng DOM.

Ví dụ, nếu bạn cần render component sau:

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">Tiêu đề</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

Rồi bạn có thể xác nhận rằng:

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// in your test:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Title</span>,
  <Subcomponent foo="bar" />
]);
```

Kiểm tra cạn hiện tại vẫn có một vài hạn chế, có thể kể tên là việc chưa hỗ trợ refs.

> Lưu ý:
>
> Chúng tôi cũng khuyến khích bạn xem thêm về [API Render cạn](https://airbnb.io/enzyme/docs/api/shallow.html) của Enzyme. Nó cung cấp API cấp cao hơn và tốt hơn cho cùng chức năng.

## Tài liệu tham khảo {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

Bạn có thể tưởng tượng shallowRenderer như là một "nơi" để render component bạn muốn kiểm tra, và từ đó bạn có thể tách đầu ra của component đó.

`shallowRenderer.render()` gần giống với [`ReactDOM.render()`](/docs/react-dom.html#render), nhưng nó không cần dùng DOM và chỉ render sâu một lớp. Việc này nghĩa là bạn có thể kiểm tra những component mà không phụ thuộc vào cách những component con được triển khai.

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

Sau khi gọi hàm `shallowRenderer.render()`, bạn có thể dùng `shallowRenderer.getRenderOutput()` để lấy đầu ra của việc render cạn.

Rồi bạn có thể bắt đầu việc xác nhận sự trung thực của đầu ra.
