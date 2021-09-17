---
id: addons
title: Add-Ons
permalink: docs/addons.html
---

> Note:
>
> `React.addons` entry point is deprecated as of React v15.5. The add-ons have moved to separate modules, and some of them have been deprecated.

Add-ons trong React là một tập hợp các module tiện ích có ích (plugins hoặc libararies) để tạo ra các ứng dụng React. **Đây nên được coi là chưa thực sự hoàn chỉnh** và có xu hướng cập nhật cốt lõi thường xuyên.

- [`createFragment`](/docs/create-fragment.html), để tạo một tập hợp các children có khóa ngoài.

Add-ons bên dưới chỉ nằm trong phiên bản phát triển (chưa được tổng hợp) của React:

- [`Perf`](/docs/perf.html), một công cụ tạo thông tin hồ sơ để tìm kiếm các phương pháp tối ưu hóa.
- [`ReactTestUtils`](/docs/test-utils.html), những công cụ trợ giúp đơn giản để viết các trường hợp kiểm thử (test case).

### Add-ons kế thừa {#legacy-add-ons}

Add-ons bên dưới được coi là kế thừa và việc sử dụng chúng không được khuyến khích. Họ (developers) sẽ tiếp tục làm việc trong tương lai gần (để cải thiện, sửa lỗi), nhưng không thực sự có sự phát triển thêm (nghĩa là sự phát triển tập trung và dừng lại chỉ ở tính năng đặc thù).

- [`PureRenderMixin`](/docs/pure-render-mixin.html). Thay vì vậy, dùng [`React.PureComponent`](/docs/react-api.html#reactpurecomponent).
- [`shallowCompare`](/docs/shallow-compare.html), một chức năng trợ giúp thực hiện so sánh sơ qua cho "props and state" trong một component để quyết định xem component đó có cập nhật hay không. Thay vì vậy, chúng tôi khuyên dùng [`React.PureComponent`](/docs/react-api.html#reactpurecomponent).
- [`update`](/docs/update.html). Thay vì vậy, dùng [`kolodny/immutability-helper`](https://github.com/kolodny/immutability-helper).
- [`ReactDOMFactories`](https://www.npmjs.com/package/react-dom-factories), DOM được cấu hình trước để làm React dùng dễ hơn mà không cần tới JSX.

### Add-ons không được sử dụng nữa {#deprecated-add-ons}

- [`LinkedStateMixin`](/docs/two-way-binding-helpers.html) đã không cho phép dùng nữa.
- [`TransitionGroup` and `CSSTransitionGroup`](/docs/animation.html) đã không còn được dùng, hãy dùng [their drop-in replacements](https://github.com/reactjs/react-transition-group/tree/v1-stable).

## Dùng React với Add-ons {#using-react-with-add-ons}

Bạn có thể cài đặt Add-ons riêng lẻ từ npm (v.d. `npm install react-addons-create-fragment`) và "import" nó:

```javascript
import createFragment from 'react-addons-create-fragment'; // ES6
var createFragment = require('react-addons-create-fragment'); // ES5 with npm
```

Khi sử dụng React 15 hoặc bản trước đó từ CDN, có thể dùng `react-with-addons.js` thay cho `react.js`:

```html
<script src="https://unpkg.com/react@15/dist/react-with-addons.js"></script>
```

Add-ons sẽ có sẵn thông qua `React.addons` (v.d. `React.addons.TestUtils`).
