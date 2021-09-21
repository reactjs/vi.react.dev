---
id: test-utils
title: Test Utilities
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**Importing**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 với npm
```

## Tổng quan {#overview}

`ReactTestUtils` giúp cho việc test các component trong React dễ dàng hơn trong một test framework mà bạn muốn. Ở Facebook chúng tôi dùng [Jest](https://facebook.github.io/jest/) để test JavaScript một cách dễ dàng. Giờ bạn có thể tìm hiểu cách bắt đầu với Jest thông qua website này [React Tutorial](https://jestjs.io/docs/tutorial-react).

> Lưu ý:
>
> Chúng tôi khuyên dùng [React Testing Library](https://testing-library.com/react) được thiết kế để hỗ trợ viết test mà dùng các component của bạn như là những người dùng cuối cùng(có thể hiểu như là người dùng thực tế).
> 
> Đối với phiên bản React <= 16, thư viện [Enzyme](https://airbnb.io/enzyme/) giúp bạn dễ dàng assert(là một xác nhận - assert - là một vị từ được kết nối với một điểm trong chương trình, luôn được đánh giá là true tại thời điểm đó trong quá trình thực thi mã), sử dụng và kiểm tra output của các React Component.



 - [`act()`](#act)
 - [`mockComponent()`](#mockcomponent)
 - [`isElement()`](#iselement)
 - [`isElementOfType()`](#iselementoftype)
 - [`isDOMComponent()`](#isdomcomponent)
 - [`isCompositeComponent()`](#iscompositecomponent)
 - [`isCompositeComponentWithType()`](#iscompositecomponentwithtype)
 - [`findAllInRenderedTree()`](#findallinrenderedtree)
 - [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)
 - [`findRenderedDOMComponentWithClass()`](#findrendereddomcomponentwithclass)
 - [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)
 - [`findRenderedDOMComponentWithTag()`](#findrendereddomcomponentwithtag)
 - [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)
 - [`findRenderedComponentWithType()`](#findrenderedcomponentwithtype)
 - [`renderIntoDocument()`](#renderintodocument)
 - [`Simulate`](#simulate)

## Chức vụ {#reference}

### `act()` {#act}

Để chuẩn bị một component cho các assertion(assertion chính là những method dùng để kiểm tra kết quả của đơn vị cần test có đúng với mong đợi không), render component đó và thực hiện cập nhật bên trong hàm `act()`. Điều này giúp cho test của bạn chạy gần giống như với cách React chạy trên browser thực tế.

>Lưu ý
>
>Nếu bạn dùng `react-test-renderer`, nó cũng cung cấp một `act` chạy tương tự.

Ví dụ, chúng ta có một `Counter` component:

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.title = `Bạn click ${this.state.count} lần`;
  }
  componentDidUpdate() {
    document.title = `Bạn click ${this.state.count} lần`;
  }
  handleClick() {
    this.setState(state => ({
      count: state.count + 1,
    }));
  }
  render() {
    return (
      <div>
        <p>Bạn đã click {this.state.count} lần</p>
        <button onClick={this.handleClick}>
          Click vào đây
        </button>
      </div>
    );
  }
}
```

Đây là cách mà chúng ta test nó:

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('có thể render và cập nhật một counter', () => {
  // Test first render and componentDidMount
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Bạn click 0 lần');
  expect(document.title).toBe('Bạn click 0 lần');

  // Test second render and componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('Bạn click 1 lần');
  expect(document.title).toBe('Bạn click 1 lần');
});
```

- Nhớ rằng việc điều phối các sự kiện DOM chỉ hoạt động khi vùng chứa DOM được thêm vào `document`. Bạn có thể dùng thư viện như [React Testing Library](https://testing-library.com/react) để dùng code đã có sẵn (boilerplate code).

- Document này [`recipes`](/docs/testing-recipes.html) cho biết thông tin chi tiết cách `act()` hoạt động, gồm cả ví dụ lẫn cách sử dụng.

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

Sơ qua một mocked module component, có một phương pháp để kết hợp nó với các method hữu ích mà cho phép nó được sử dụng như một component giả lập trong React. Thay vì render nó ra như bình thường, component chỉ ngắn gọn như một thẻ `<div>` (hoặc là một thẻ khác nếu `mockTagName` được đặt) chứa bất kỳ children nào trong nó.

> Lưu ý:
>
> `mockComponent()` là một API kế thừa. Chúng tôi khuyên nên dùng [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock) thay cho nó.

* * *

### `isElement()` {#iselement}

```javascript
isElement(element)
```

Trả về `true` nếu `element` thuộc bất kỳ element trong React.

* * *

### `isElementOfType()` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

Trả về `true` nếu `element` là một element trong React mà có kiểu thuộc `componentClass` trong React.

* * *

### `isDOMComponent()` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

Trả về `true` nếu `instance` là một component trong DOM (ví dụ như là `<div>` hoặc `<span>`).

* * *

### `isCompositeComponent()` {#iscompositecomponent}

```javascript
isCompositeComponent(instance)
```

Trả về `true` nếu `instance` là một component do người dùng tự định nghĩa, như là class component hoặc function component.

* * *

### `isCompositeComponentWithType()` {#iscompositecomponentwithtype}

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

Trả về `true` nếu `instance` là một component mà có kiểu thuộc `componentClass` trong React.

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

Duyệt tất cả các component trong `tree` và gom lại tất cả các component mà `test(component)` trả về `true`. Điều này tuy không có ích lắm, nhưng được sử dụng làm nền tảng cho các test-util khác.

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

Tìm tất cả các element trong DOM thuộc các component trong tree đã render mà component DOM có tên của class giống với `className`.

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

Giống với [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass) nhưng sẽ chỉ có một và trả về một kết quả duy nhất, hoặc throw ra exception nếu có bất kỳ các kết quả trùng nhau.

* * *

### `scryRenderedDOMComponentsWithTag()` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

Tìm tất cả các element trong DOM thuộc các component trong tree đã render mà component DOM có tên của thẻ giống với `tagName`.

* * *

### `findRenderedDOMComponentWithTag()` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

Giống [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag) nhưng sẽ chỉ có một và trả về một kết quả duy nhất, hoặc throw ra exception nếu có bất kỳ các kết quả trùng nhau.

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

Tìm tất cả các instance của các component có kiểu giống với `componentClass`.

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

Giống với [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype) nhưng sẽ chỉ có một và trả về một kết quả duy nhất, hoặc throw ra exception nếu có bất kỳ các kết quả trùng nhau.

***

### `renderIntoDocument()` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

Render một element của React vào một node riêng của DOM trong một document. **Function này yêu cầu DOM.** Nó tương tự với:

```js
const domContainer = document.createElement('div');
ReactDOM.render(element, domContainer);
```

> Lưu ý:
>
> Bạn cần có `window`, `window.document` và `window.document.createElement` có sẵn ở toàn cục **trước khi** bạn import `React`. Nếu không, React sẽ nghĩ rằng nó không thể truy cập DOM và các phương thức như `setState` không hoạt động.

* * *

## Các tiện ích khác {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

Giả lập một sự kiện được gửi trên một node DOM với tùy chọn dữ liệu của sự kiện `eventData`.

`Simulate` có một method cho [tất cả sự kiện mà React hỗ trợ](/docs/events.html#supported-events).

**Click vào một element**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**Thay đổi giá trị của trường đầu vào rồi ENTER.**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'giraffe';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> Lưu ý
>
> React sẽ không tạo ra mà bạn phải cung cấp tất cả event property đang dùng trong component của bạn (v.d. keyCode, which, etc...).

* * *
