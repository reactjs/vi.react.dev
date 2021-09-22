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
Refs là một cách giúp chúng ta truy cập đến những nút DOM hoặc những phần tử React được tạo ra trong phương thức render.

Trong luồng dữ liệu của React, [props](/docs/components-and-props.html) là cách duy nhất để các component cha tương tác với component con. Để cập nhật component con, ta phải re-render nó với các props mới. Tuy nhiên, một số trường hợp buộc ta phải thay đổi thành phần con bên ngoài luồng dữ liệu điển hình của React. Component con được sửa đổi có thể là một instance của một React component, hoặc nó có thể là một DOM element. Với những trường hợp trên, ta có thể xử lý bằng Refs.

### Khi nào sử dụng Refs {#when-to-use-refs}

Một vài trường hợp hữu ích để sử dụng refs:

* Quản lý focus, text selection, hoặc media playback.
* Trigger animation của một element khác.
* Tích hợp những thư viện DOM từ bên thứ ba.

Tránh sử dụng refs trong trường hợp chúng ta có thể khai báo.

Ví dụ, thay vì hiển thị phương thức `open()` và `close()` trong `Dialog` component, thì chúng ta sẽ sử dụng `isOpen` như một prop để xử lý nó.

### Không nên lạm dụng Refs {#dont-overuse-refs}

Chúng ta hay có xu hướng sử dụng Refs để xử lý mọi thử xảy ra trong ứng dụng của mình. Nếu rơi vào trường hợp này, thì lời khuyên là bạn nên dành thời gian để suy nghĩ nhiều hơn về vị trí mà bạn nên đặt State trong hệ thống cập bậc component (Component Hierarchy) của bạn. Thông thường, để rõ ràng nhất, thì vị trí State sẽ được đặt ở cấp bậc cao nhất của Component Hierarchy. Bạn có thể tham khảo thêm hướng dẫn và các ví dụ tại đây [Lifting State Up](/docs/lifting-state-up.html).

> Lưu ý
>
> Những ví dụ bên dưới đã được cập nhật để sử dụng `React.createRef()` API được giới thiệu trong React 16.3. Nếu bạn sử dụng những phiên bản trước, React khuyên bạn nên sử dụng [callback refs](#callback-refs) để thay thế.

### Tạo Refs {#creating-refs}

Refs được khởi tạo bằng `React.createRef()` và được gắn vào các React element thông qua thuộc tính `ref`. Refs thường được gán cho một element nào đó, tại đó chúng ta có thể tham chiếu đến tất cả các thành phần bên trong nó.

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

Khi một element có chứa ref `render`, chúng ta có thể sử dụng một thuộc tính của ref là `current` để truy cập đến node hiện tại.

```javascript
const node = this.myRef.current;
```

Giá trị tham chiếu khác nhau, phụ thuộc vào loại cuả node:

- Khi thuộc tính `ref` được sử dụng trong HTML element, `ref` sẽ nhận DOM element bên dưới làm thuộc tính `current` của nó.
- Khi thuộc tính `ref` được sử dụng  trong class component tùy chỉnh, `ref` sẽ nhận instance của component làm thuộc tính `current` của nó.
- **Bạn không thể sử dụng thuộc tính `ref` trong function components** vì nó không có instances.

Các ví dụ dưới đây chứng minh sự khác biệt:

#### Thêm Ref vào một DOM Element {#adding-a-ref-to-a-dom-element}

Đoạn code sử dụng `ref` để lưu trữ một tham chiếu đến một DOM node:

```javascript{5,12,22}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // Tạo ra một ref để lưu textInput DOM element
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: Chúng ra truy cập đến "current" để lấy DOM node
    this.textInput.current.focus();
  }

  render() {
    // Nói với React chúng ta muốn liên kết tới <input> ref
    // Với `textInput` chúng ta đã tạo ở constructor
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

React sẽ gắn `current` cho DOM element khi component mounts, và gắn nó trở lại `null` khi unmounts. `ref` được cập nhật trước `componentDidMount` hoặc `componentDidUpdate`.

#### Thêm Ref vào Class Component {#adding-a-ref-to-a-class-component}

Nếu chúng ta muốn wrap `CustomTextInput` bên trên để nó được click ngay sau khi mounting, chúng ta có thể sử dụng một ref để có quyền truy cập vào input, tùy chỉnh và gọi phương thức `focusTextInput` của nó theo cách thủ công:

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

Chú ý nó chỉ hoạt động nếu `CustomTextInput` được khai báo dưới dạng class:

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

#### Refs và Function Components {#refs-and-function-components}

Mặc định, **bạn không thể sử dụng thuộc tính `ref` trong function components** vì nó không có instances:

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
    // Nó sẽ không thực hiện được
    return (
      <MyFunctionComponent ref={this.textInput} />
    );
  }
}
```

Nếu bạn muốn cho phép mọi người sử dụng `ref` từ function component của bạn, bạn có thể dùng [`forwardRef`](/docs/forwarding-refs.html) (có thể kết hợp với [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)), hoặc bạn có thể chuyển đổi component thành class.

Tuy nhiên, bạn có thể **sử dụng thuộc tính `ref` bên trong function component** miễn là bạn tham chiếu đến phần tử DOM hoặc class component:

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // textInput phải được khai báo ở đây để ref có thể tham chiếu đến nó
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

### Hiển thị DOM Refs cho Components cha {#exposing-dom-refs-to-parent-components}

Một số ít trường hợp, bạn muốn có quyền truy cập vào DOM node của element con từ component cha. Nhưng chúng tôi không khuyến khích điều đó vì nó sẽ phá hủy tính đóng gói của component, một số ít nó hữu dụng khi trigger focus hoặc xác định kích thước, vị trí của một DOM node con.

Mặc dù bạn có thể [thêm ref vào component con](#adding-a-ref-to-a-class-component), tuy nhiên đây cũng không phải là một ý tưởng tốt, vì cái bạn nhận được chỉ là một component instance chứ không phải là một DOM node. Ý tưởng này cũng sẽ không hoạt động với function components.

Nếu bạn sử dụng React 16.3 hoặc các phiên bản mới hơn, chúng tôi gợi ý bạn sử dụng [ref forwarding](/docs/forwarding-refs.html) cho những trường hợp như thế này. **Ref forwarding cho phép các component tham gia hiển thị bất kỳ bản tham chiếu nào của component là con của nó**. Bạn có thể tìm hiểu chi tiết thông qua các ví dụ cách component cha hiển thị DOM node con của nó [tại ref forwarding documentation](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Nếu bạn sử dụng React 16.2 hoặc các phiên bản thấp hơn, hoặc nếu bạn cần sự linh hoạt hơn được cung cấp bởi ref forwarding, bạn có thể sử dụng [cách tiếp cận thay thể này](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509) và chuyển một tham chiếu dưới dạng tên một prop khác.

Khi có thể, chúng tôi khuyên bạn tránh để lộ các DOM node. Lưu ý rằng cách tiếp cận này yêu cầu bạn thêm một số đoạn code vào component con. Nếu bạn hoàn toàn không kiểm soát được việc triển khai thành phần con, lựa chọn cuối của bạn là sử dụng [`findDOMNode()`](/docs/react-dom.html#finddomnode), nhưng nó không được khuyến khích và không được chấp nhận trong [`StrictMode`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage).

### Callback Refs {#callback-refs}

React cũng hỗ trợ một cách set refs khác gọi là "callback refs", giúp kiểm soát tốt hơn khi set và unset ref.

Thay vì chuyển thuộc tính `ref` được tạo từ `createRef()`, bạn chuyển nó thành một function. Function này sẽ nhận vào một React component instance hoặc HTML DOM element như một argument của nó, có thể được lưu trữ và truy cập ở một nơi khác. 

Ví dụ dưới đây thực hiện việc sử dụng một `ref` callback để lưu trữ tham chiếu tới một DOM node trong một thuộc tính instance.


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

React sẽ gọi `ref` callback với DOM element khi component mounts, và gọi `null` khi component unmounts. Refs đảm bảo được cập nhật trước khi `componentDidMount` hoặc `componentDidUpdate` khởi chạy.

Bạn có thể chuyển callback refs giữa những component giống như các đối tượng tham chiếu được tạo bởi `React.createRef()`.

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

Trong ví dụ trên, `Parent` sẽ chuyển ref callback dưới dạng một `inputRef` prop tới `CustomTextInput`, và `CustomTextInput` chuyển một function tương tự như một thuộc tính `ref` tới `<input>`. Lúc đó `this.inputElement` ở `Parent` sẽ set DOM node tương ứng với `<input>` element trong `CustomTextInput`.

### API lỗi thời: String Refs {#legacy-api-string-refs}

Nếu bạn đã làm việc với React trước đây, bạn có thể quen thuộc với một API cũ hơn trong đó thuộc tính `ref` là một String, như `"textInput"`, và DOM node được truy cập bằng `this.refs.textInput`. Chúng tôi khuyên bạn nên tránh sử dụng nó vì string refs có [một vài vấn đề](https://github.com/facebook/react/pull/8333#issuecomment-271648615), liên quan đến kế thừa, và **có khả năng bị xóa trong các bản phát hành tiếp theo.**. 

> Lưu ý
>
> Nếu hiên tại bạn đang sử dụng `this.refs.textInput` để truy cập đến refs, chúng tôi khuyên bạn nên sử dụng [callback pattern](#callback-refs) hoặc [`createRef` API](#creating-refs) để thay thế.

### Cảnh báo với callback refs {#caveats-with-callback-refs}

Nếu `ref` callback được định nghĩa như một inline function, nó sẽ được gọi 2 lần khi cập nhật, lần thứ 1 có giá trị là `null` và lần thứ 2 là DOM element. Điều này xảy ra bởi vì một instance của function được tạo ra sau mỗi lần render, React cần phải xóa những ref cũ và set up một cái mới. Bạn có thể tránh điều này bằng cách định nghĩa `ref` callback như một method trên class, nhưng nó cũng không quan trọng trong hầu hết các trường hợp.
