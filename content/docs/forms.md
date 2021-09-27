---
id: forms
title: Forms
permalink: docs/forms.html
prev: lists-and-keys.html
next: lifting-state-up.html
redirect_from:
  - "tips/controlled-input-null-value.html"
  - "docs/forms-zh-CN.html"
---

Trong React, HTML form element sẽ hoạt động hơi khác một chút so với các DOM element còn lại, form element sẽ giữ và tự xử lí một số state nội bộ (internal state) của riêng nó. Ví dụ như form dưới đây trong HTML sẽ nhận vào giá trị của input name.

```html
<form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

Thẻ form này có các hành vi của một HTML form mặc đinh: đó là là khi user ấn vào nút sumit để gửi thông tin, nó vẫn sẽ browsing (chuyển trang) sang một trang mới. Và tất nhiên ở React thì form element vẫn sẽ xử lí hệt như thế. Nhưng ở những trường hợp thường gặp, sẽ tiện lợi hơn khi ta sử dụng một hàm (function) trong Javascript để xử lí quá trình gửi dữ liệu (submission) của form, function đó sẽ có thể truy cập vào dữ liệu (data) của form khi người dùng tương tác với form. Kĩ thuật vừa được đề cập ở trên là một quy chuẩn có tên "controlled components".

## Controlled Components {#controlled-components}

Trong HTML, các form element như `<input>`, `<textarea>`, hay `<select>` thông thường sẽ tự quản lý trạng thái của chúng và tự động cập nhật dựa trên dữ liệu người dùng nhập vào. Còn với React, các trạng thái thay đổi (mutable state) thì sẽ được giữ trong state của component, và chỉ được cập nhật khi sử dụng hàm [`setState()`](/docs/react-component.html#setstate).

Chúng ta có thể kết hợp hai cách xử lí đó lại với nhau bằng cách dùng React state như là một "nguồn dữ liệu đáng tin cậy duy nhất" (single source of truth). Component khi thực hiện render một form element sẽ kiểm soát được điều gì đang xảy ra với form element khi mà user nhập vào. Một input form element mà giá trị của nó được điều khiển bởi React bằng phương pháp đã nêu phía trên, được gọi là một "controlled component".

Từ đoạn code ví dụ ở phía trên, nếu ta muốn xuất ra màn hình một thông báo chứa dữ liệu nhập vào khi form được submit ,ta có thể viết form theo định dạng của một controlled component, như đoạn code sau đây:

```javascript{4,10-12,21,24}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**Thử trên Codepen**](https://codepen.io/gaearon/pen/VmmPgp?editors=0010)

Khi `value` attribute được gán vào form element, giá trị hiển thị lên màn hình sẽ luôn là `this.state.value`. Sau mỗi lần tương tác với bàn phím, `handleChange` được gọi để cập nhật lại React state, giá trị hiển thị lên màn hình sẽ luôn được cập nhật mỗi khi người dùng gõ phím.

Đối với một controlled component, giá trị của input luôn luôn được điều khiển bởi state của React. Điều này có nghĩa là bạn phải gõ (type) nhiều code hơn một chút, từ đó bạn có thể truyền giá trị này đến những thành phần (element) khác của UI, hoặc là làm mới (reset) nó từ những sự kiện (event handler) khác.

## Thẻ textarea {#the-textarea-tag}

Trong HTML, một thẻ `<textarea>` sẽ chứa các đoạn văn bản bên trong nó.

```html
<textarea>
  Xin chào, đây là đoạn văn bản trong thẻ textarea.
</textarea>
```

Còn với React, thay vì nằm bên trong, thẻ `<textarea>` sẽ sử dụng thuộc tính `value` để lưu trữ các đoạn văn bản. Khi sử dụng cách này, một form có chứa `<textarea>` sẽ có thể được biểu diễn tương tự như một form sử dụng thẻ input tự đóng `<input />` (single-line input).

```javascript{4-6,12-14,26}
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

Chú ý rằng `this.state.value` đã được khởi tạo bên trong hàm khởi tạo (constructor) nên vùng văn bản sẽ hiển thị một vài câu chữ mà ta khởi tạo.

## Thẻ select {#the-select-tag}

Trong HTML, ta dùng thẻ `<select>` tạo ra một drop-down list. Ở ví dụ bên dưới là một drop-down list chứa các hương vị trái cây:

```html
<select>
  <option value="grapefruit">Grapefruit</option>
  <option value="lime">Lime</option>
  <option selected value="coconut">Coconut</option>
  <option value="mango">Mango</option>
</select>
```

Như đoạn code phía trên , thẻ `option` 'Coconut' sẽ là giá trị khởi tạo của thẻ `select` vì nó có thuộc tính `selected`. Trong React, thay vì dùng thuộc tính `selected`, sẽ dùng thuộc tính `value` ở thẻ `select`. Có thể thấy việc dùng controlled component tiện lợi hơn rất nhiều vì chỉ phải cập nhật dữ liệu ở một nơi duy nhất. Ví dụ cụ thể ở phía dưới:

```javascript{4,10-12,24}
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick your favorite flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**Thử trên Codepen**](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)

Tổng hợp lại, ta có thể thấy rằng `<input type="text">`, `<textarea>`, và `<select>` đều hoạt động tương tự nhau, tất cả chúng đều nhận vào một
thuộc tính `value` từ đó trở thành một controlled component.

> Lưu ý
>
> Ban có thể truyền một mảng vào thuộc tính `value`, điều đó sẽ giúp bạn có thể chọn được nhiều tuỳ chọn trọng thẻ `select`
>
>```js
><select multiple={true} value={['B', 'C']}>
>```

## Thẻ input file {#the-file-input-tag}

Trong HTML, thẻ `<input type="file">` cho phép người dùng chọn một hay nhiều file từ bộ nhớ trong thiết bị của họ, sao đó những file sẽ được gửi lên server hoặc được tuỳ biến bởi Javascript thông qua [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

Bời vì giá trị của file input chặn quyền ghi (read-only), nên nó là một **uncontrolled** component trong React. Chúng ta sẽ bàn về thẻ này cùng với các uncontrolled component khác ở một phần khác [chi tiết ở phần này](/docs/uncontrolled-components.html#the-file-input-tag)

## Xử lí nhiều thẻ input {#handling-multiple-inputs}

Khi bạn cần xử lí nhiều controlled `input`, bạn có thể thêm thuộc tính `name` vào từng element và để hàm xử lí (handler function) lựa chọn được chính xác element nào đang tương tác với người dùng thông qua  `event.target.name`

Ví dụ:

```javascript{15,18,28,37}
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

[**Thử trên Codepen**](https://codepen.io/gaearon/pen/wgedvV?editors=0010)

Đây là cách sử dụng cú pháp [computed property name](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names) trong ES6 để cập nhật state đúng với những input dược định danh bằng thuộc tính name:

```js{2}
this.setState({
  [name]: value
});
```

Đoạn code phía trên tương tự với đoạn code ES5 sau:

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

Ngoài ra, kể từ khi `setState()` tự động [gộp các phần của state thành state hiện tại](/docs/state-and-lifecycle.html#state-updates-are-merged), ta chỉ cần gọi hàm `setState()` đối với những phần của state bị thay đổi.

## Controlled Input với giá trị null {#controlled-input-null-value}

Cũng có ngoại lệ, giá trị của prop trong một [controlled component](/docs/forms.html#controlled-components) sẽ ngăn người dùng thay đổi nó trừ khi bạn cũng muốn vậy. Nếu bạn đã cung cấp một `value` nhưng thẻ input vẫn có khả năng bị sửa đổi, bạn đã vô tình gán `value` bằng với `undefined` hay `null`.

Đoạn code bên dưới sẽ làm rõ điều ta vừa đề cập. (Thẻ input đã được gán giá trị lúc bạn đầu nhưng trở nên có thể bị sửa đổi sau một khoảng thời gian chờ.)

```javascript
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## Lựa chọn thay thế cho Controlled Component {#alternatives-to-controlled-components}

Đôi khi việc sử dụng controller component khá là tẻ nhạt, bởi vì bạn cần phải viết một hàm xử lí sự kiện (event handler) cho tất các các trường hợp làm thay đổi data và kết nối lại tất cả các input state thông qua React component. Nó còn phiền phức hơn khi bạn đang cố chuyển đổi codebase cũ sang React, hay là việc tích hợp React vào một ứng dụng khác. Trong các trường hợp đó, có lẽ bạn sẽ muốn thử [uncontrolled components](/docs/uncontrolled-components.html), một cách làm thay thế để xử lí input form.

## Giải pháp đầy đủ {#fully-fledged-solutions}

Nếu bạn đang tìm kiêm một giải pháp đầy đủ, bao gồm cả việc kiểm tra, theo dõi các trường đã được tác động, hay xử lí form submitssion, [Formik](https://jaredpalmer.com/formik) là một trong những lựa chọn thông dụng. Tuy nhiên, formik được xây dựng dựa trên các nguyên tắc về controlled components và quản lí state - vì thế không cần phải cố gắng hiểu sâu về Formik đâu.
