---
id: refs-and-the-dom
title: Refs and the DOM
permalink: docs/refs-and-the-dom.html
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
---

Refs cung cấp một cách để truy cập DOM nodes hoặc các React elements được tạo trong phương thức render.

Trong luồng dữ liệu đặc trưng của React, [props](/docs/components-and-props.html) là cách duy nhất để các parent components tương tác với child của chúng. Để thay đổi child, bạn re-render nó với props mới. Tuy nhiên, có một vài trường hợp mà ở đó bạn cần thay đổi child bên ngoài luồng dữ liệu đặc trưng ở thức mệnh lệnh. Child được thay đổi có thể là một thể hiện của một React component, hoặc nó có thể là DOM element. Đối với cả hai trường hợp này, React cung cấp một cách để giải quyết.

### Khi nào sử dụng Refs {#when-to-use-refs}

Có vài trường hợp tốt để sử dụng refs:

* Quản lý focus, text selection, hoặc media playback.
* Kích hoạt animations quan trọng.
* Tích hợp với những thư viện DOM của bên thứ ba.

Tránh sử dụng refs cho bất cứ điều gì mà có thể được hoàn thành một cách khai báo.

Ví dụ, thay vì sử dụng các phương thức `open()` và `close()` cho một `Dialog` component, truyền một thuộc tính `isOpen` cho nó.

### Đừng lạm dụng Refs {#dont-overuse-refs}

Xu hướng đầu tiên của bạn có thể là sử dụng ref để "làm cái gì đó hoạt động" trong ứng dụng của bạn. Nếu đúng như vậy, hãy dành một chút thời gian và suy nghĩ kỹ hơn về state nên được sử dụng ở đâu trong hệ thống phân cấp component. Thông thường, rõ ràng là nơi thích hợp để "đặt" state đó là ở một cấp cao hơn trong hệ thống phân cấp. Xem hướng dẫn [Lifting State Up](/docs/lifting-state-up.html) cho nhiều ví dụ về cách này.

> Chú ý
>
> Các ví dụ phía dưới đã được cập nhật để sử dụng `React.createRef()` API được giới thiệu trong React 16.3. Nếu bạn đang sử dụng các phiên bản React trước, chúng tôi khuyến nghị bạn sử dụng [callback refs](#callback-refs) để thay thế.

### Tạo Refs {#creating-refs}

Refs được tạo bằng `React.createRef()` và gán cho React elements thông qua thuộc tính `ref`. Refs thường được gán cho một instance property khi một component được xây dựng để chúng có thể được tham chiếu khắp component.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

### Truy cập Refs {#accessing-refs}

Khi một ref được truyền cho một element trong `render`, một tham chiếu đến node có thể truy cập được bằng thuộc tính `current` của ref.

```javascript
const node = this.myRef.current;
```

Giá trị của ref khác nhau phụ thuộc vào loại của node:

- khi thuộc tính `ref` được sử dụng trên một HTML element, `ref` tạo một constructor với `React.createRef()` nhận DOM element bên dưới là thuộc tính `current` của nó.
- Khi thuộc tính `ref` được sử dụng trên một custom class component, đối tượng `ref` nhận mounted instance của component là `current` của nó.
- **Bạn có thể không sử dụng thuộc tính `ref` cho function components** bởi vì chúng không có instances.

Các ví dụ dưới đây chứng minh sự khác biệt.

#### Thêm một Ref cho một DOM Element {#adding-a-ref-to-a-dom-element}

Đoạn code này sử dụng một `ref` để lưu một tham chiếu đến một DOM node:

```javascript{5,12,22}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus();
  }

  render() {
    // tell React that we want to associate the <input> ref
    // with the `textInput` that we created in the constructor
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React sẽ gán thuộc tính `current` với DOM element khi component mounts, và gán nó trở lại `null` khi nó unmounts. Các cập nhật `ref` xảy ra trước các phương thức trong lifecycle như `componentDidMount` hoặc `componentDidUpdate`.

#### Thêm một Ref cho một Class Component {#adding-a-ref-to-a-class-component}

Nếu chúng ta muốn bọc `CustomTextInput` bên trên để mô phỏng nó đang được click ngay lập tức sau khi mounting, chúng ta có thể sử dụng một ref để có thể truy cập custom input và gọi phương thức `focusTextInput` của nó một cách thủ công:

```javascript{4,8,13}
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

Chú ý rằng điều này chỉ hoạt động nếu `CustomTextInput` được khai báo là một class:

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

#### Refs và Function Components {#refs-and-function-components}

Theo mặc định, **bạn không thể sử dụng thuộc tính `ref` trên function components** bởi vì chúng không có các instances:

```javascript{1,8,13}
function MyFunctionComponent() {
  return <input />;
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // This will *not* work!
    return (
      <MyFunctionComponent ref={this.textInput} />
    );
  }
}
```

Nếu bạn muốn cho phép mọi người lấy một `ref` cho function component của bạn, bạn có thể sử dụng [`forwardRef`](/docs/forwarding-refs.html) (có thể kết hợp với [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)), hoặc bạn có thể chuyển component sang class.

Tuy nhiên, bạn có thể **sử dụng thuộc tính `ref` bên trong một function component** miễn là bạn tham chiếu đến một DOM element hoặc một class component:

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // textInput must be declared here so the ref can refer to it
  const textInput = useRef(null);
  
  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );
}
```

### Phơi bày DOM Refs cho Parent Components {#exposing-dom-refs-to-parent-components}

Trong một số ít trường hợp, bạn có thể muốn truy cập vào một child's DOM node từ một parent component. Điều này thường không được khuyến nghị bởi vì nó phá vỡ tính đóng gói của component, nhưng đôi khi nó có thể hữu ích cho việc kích hoạt focus hoặc đo kích thước hoặc vị trí của một child DOM node.

Mặc dù bạn có thể [thêm một ref cho child component](#adding-a-ref-to-a-class-component), đây không phải là một giải pháp lý tưởng, vì bạn sẽ chỉ nhận một component instance thay vì một DOM node. Ngoài ra, cách này sẽ không hoạt động với function components.

Nếu bạn sử dụng React 16.3 hoặc cao hơn, chúng tôi khuyến nghị sử dụng [ref forwarding](/docs/forwarding-refs.html) cho những trường hợp này. **Ref forwarding cho phép các components tham gia vào việc phơi bày bất kì child component's ref như là của chính chúng**. Bạn có thể tìm một ví dụ chi tiết về cách phơi bày một child's DOM node cho một parent component [trong tài liệu ref forwarding](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Nếu bạn sử dụng React 16.2 hoặc thấp hơn, hoặc nếu bạn cần nhiều sự linh hoạt hơn mức được cung cấp bởi ref forwarding, bạn có thể sử dụng [cách tiếp cận thay thế này](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509) và truyền một cách rõ ràng một ref dưới dạng một prop tên khác.

Nếu có thể, chúng tôi khuyên bạn không nên để lộ các DOM nodes, nhưng nó có thể là một lối thoát hiểm hữu ích. Chú ý rằng phương pháp này yêu cầu bạn thêm một số code vào child component. Nếu bạn hoàn toàn không kiểm soát được triển khai của child component, lựa chọn cuối cùng của bạn là sử dụng [`findDOMNode()`](/docs/react-dom.html#finddomnode), nhưng nó không được khuyến khích và chấp nhận trong [`StrictMode`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage).

### Callback Refs {#callback-refs}

React cũng hỗ trợ một cách khác để thiết lập các refs được gọi là "callback refs", cách này giúp kiểm soát chi tiết hơn khi refs được thiết lập và bị hủy bỏ.

Thay vì truyền vào một thuộc tính `ref` được tạo bởi `createRef()`, bạn truyền một function. Function này nhận React component instance hoặc HTML DOM element làm đối số của nó, được lưu trữ và truy cập ở nơi khác.

Ví dụ dưới đây triển khai một mẫu phổ thông: sử dụng `ref` callback để lưu trữ một tham chiếu đến một DOM node trong một instance property.

```javascript{5,7-9,11-14,19,29,34}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Focus the text input using the raw DOM API
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // autofocus the input on mount
    this.focusTextInput();
  }

  render() {
    // Use the `ref` callback to store a reference to the text input DOM
    // element in an instance field (for example, this.textInput).
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React sẽ gọi `ref` callback với DOM element khi component mounts, và gọi nó với `null` khi component unmounts. Refs được đảm bảo được cập nhật trước `componentDidMount` hoặc `componentDidUpdate` kích hoạt.

Bạn có thể truyền callback refs giữa các components như bạn có thể với object refs được tạo bằng `React.createRef()`.

```javascript{4,13}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

Trong ví dụ trên, `Parent` truyền ref callback của nó như một thuộc tính `inputRef` cho `CustomTextInput`, và `CustomTextInput` truyền function này như một thuộc tính `ref` đặc biệt cho `<input>`. Do đó, `this.inputElement` trong `Parent` sẽ được thiết lập cho DOM node tương ứng với `<input>` element trong `CustomTextInput`.

### API lỗi thời: String Refs {#legacy-api-string-refs}

Nếu bạn đã làm việc với React trước đây, bạn có thể quen thuộc với một API cũ hơn trong đó thuộc tính `ref` là một string, như `"textInput"`, và DOM node được truy cập như `this.refs.textInput`. Chúng tôi khuyên bạn không nên làm như vậy bởi vì string refs có [một vài vấn đề](https://github.com/facebook/react/pull/8333#issuecomment-271648615), được cân nhắc là lỗi thời, và **có khả năng bị xóa trong một trong những bản phát hành trong tương lai**. 

> Chú ý
>
> Nếu bạn hiện đang sử dụng `this.refs.textInput` để truy cập refs, chúng tôi khuyến nghị bạn sử dụng [mẫu callback](#callback-refs) hoặc [`createRef` API](#creating-refs) để thay thế.

### Cảnh báo với callback refs {#caveats-with-callback-refs}

Nếu `ref` callback được định nghĩa như một inline function, nó sẽ được gọi hai lần trong quá trình cập nhật, lần đầu với `null` và lần sau với DOM element. Điều này là bởi vì một instance mới của function được tạo lại với mỗi lần render, vì vậy React cần xóa ref cũ và thiết lập ref mới. Bạn có thể tránh điều này bằng cách định nghĩa `ref` callback như là một thuộc tính trong class, nhưng lưu ý rằng nó không quan trọng trong hầu hết các trường hợp.
