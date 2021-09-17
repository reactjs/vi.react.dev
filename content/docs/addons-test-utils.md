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

`ReactTestUtils` giúp cho việc test các React component dễ dàng trong một framework test mà bạn tùy chọn. Ở Facebook chúng tôi dùng [Jest](https://facebook.github.io/jest/) để test JavaScript mà không tốn nhiều công sức. Giờ hãy tìm hiểu cách bắt đầu với Jest thông qua Jest website's [React Tutorial](https://jestjs.io/docs/tutorial-react).

> Lưu ý:
>
> Chúng tôi khuyến nghị dùng [React Testing Library](https://testing-library.com/react) được thiết kế để kích hoạt và hỗ trợ viết các test mà dùng các component của bạn như là những người dùng cuối cùng(có thể hiểu như là người dùng thực tế).
> 
> Đối với phiên bản React <= 16, thư viện [Enzyme](https://airbnb.io/enzyme/) giúp bạn dễ dàng xác nhận, sử dụng, và kiểm qua output các React Component của bạn.



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

Để chuẩn bị một component cho các assertion(assertion chính là những method dùng để kiểm tra kết quả của đơn vị cần test có đúng với mong đợi không), cho code render cái đó và thực hiện cập nhật bên trong hàm gọi `act()`. Điều này làm cho thử nghiệm của bạn chạy gần giống hơn với cách React chạy trên browser(trình duyệt).

>Lưu ý
>
>Nếu bạn dùng `react-test-renderer`, nó cũng cung cấp một `act` hoạt động tương tự.

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
        <p>You clicked {this.state.count} times</p>
        <button onClick={this.handleClick}>
          Click me
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

it('có thể render và cập nhật counter', () => {
  // Test first render and componentDidMount
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('nút bấm');
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

- Đừng quên rằng việc điều phối các sự kiện DOM chỉ hoạt động khi vùng chứa DOM được thêm vào `document`. Bạn có thể dùng thư viện như [React Testing Library](https://testing-library.com/react) để giảm bớt code có sẵn.

- Document này [`recipes`](/docs/testing-recipes.html) cho biết thông tin chi tiết cách `act()` hoạt động, gồm cả ví dụ lẫn cách sử dụng.

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

Sơ qua một module component mocked đến phương pháp để tăng cường nó với các method hữu ích mà cho phép nó được sử dụng như một giả lập component trong React. Thay vì render nó ra như bình thường, component sẽ trở nên đơn giản như `<div>` (hoặc là một thẻ khác nếu `mockTagName` được đặt) chứa bất kỳ children nào được cung cấp.

> Lưu ý:
>
> `mockComponent()` là một API kế thừa. Chúng tôi khuyên nên dùng [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock) thay cho nó.

* * *

### `isElement()` {#iselement}

```javascript
isElement(element)
```

Trả về `true` nếu `element` thuộc bất kỳ React element.

* * *

### `isElementOfType()` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

Trả về `true` if `element` là một React element mà có kiểu thuộc React `componentClass`.

* * *

### `isDOMComponent()` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

Trả về `true` nếu `instance` là một DOM component (như là `<div>` hoặc `<span>`).

* * *

### `isCompositeComponent()` {#iscompositecomponent}

```javascript
isCompositeComponent(instance)
```

Trả về `true` nếu `instance` là một component do người dùng xác định, như là class component hoặc function component.

* * *

### `isCompositeComponentWithType()` {#iscompositecomponentwithtype}

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

Trả về `true` nếu `instance` là một component mà có kiểu thuộc React `componentClass`.

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

Duyệt qua tất cả các component trong `tree` và dồn tất cả các component nơi mà `test(component)` là `true`. Điều này tuy không hữu ích cho mình, nhưng nó được sử dụng làm nền tảng cho các hộp test khác.

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

Tìm tất cả các DOM element thuộc các component trong tree rendered mà DOM component có tên class phù hợp `className`.

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

Như là [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass) nhưng sẽ chỉ có một kết quả, và trả về một kết quả duy nhất, hoặc throw ra exception nếu có bất kỳ kết quả nào khác trùng nhau cạnh một kết quả duy nhất.

* * *

### `scryRenderedDOMComponentsWithTag()` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

Tìm tất cả các DOM element trong các component trong rendered tree mà có DOM component có tên của thẻ trùng với `tagName`.

* * *

### `findRenderedDOMComponentWithTag()` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

Như [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag) nhưng sẽ chỉ có một kết quả, và trả về một kết quả duy nhất, hoặc throw ra exception nếu có bất kỳ kết quả nào khác trùng nhau cạnh một kết quả duy nhất.

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

Tìm tất cả các trường hợp của các thành phần có kiểu như `componentClass`.

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

Tương tự như [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype) nhưng sẽ chỉ có một kết quả, và trả về một kết quả duy nhất, hoặc throw ra exception nếu có bất kỳ kết quả nào khác trùng nhau cạnh một kết quả duy nhất.

***

### `renderIntoDocument()` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

Render một React element vào trong một node DOM riêng trong một document. **Function này yêu cầu một DOM.** Nó tương tự với:

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

Mô phỏng một sự kiện gửi đi trên một node DOM với tùy chọn `eventData` sự kiện của dữ liệu.

`Simulate` có một method cho [tất cả sự kiện mà React hiểu](/docs/events.html#supported-events).

**Click vào một element**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**Thay đổi giá trị của trường đầu vào rồi nhấn ENTER.**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'giraffe';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> Lưu ý
>
> Bạn sẽ phải cung cấp bất kỳ event property mà bạn đang dùng trong component của bạn (v.d. keyCode, which, etc...) mà React không tạo ra bất kỳ gì trong số đó cho bạn.

* * *
