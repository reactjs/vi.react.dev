---
id: uncontrolled-components
title: Uncontrolled Components
permalink: docs/uncontrolled-components.html
---

Trong hầu hết các trường hợp, chúng tôi đề xuất sử dụng [controlled components](/docs/forms.html#controlled-components) để thực hiện form. Trong một controlled component, dữ liệu của form được xử lí bởi một component của React. Giải pháp thay thế là uncontrolled components, nơi mà dữ liệu của form được sử xí bởi chính DOM.

Để viết một uncontrolled component, thay vì viết một sự kiện xử lí cho mỗi lần cập nhật state, bạn có thể [sử dụng một ref](/docs/refs-and-the-dom.html) để lấy các giá trị của form từ DOM.

Ví dụ, đoạn code này sử dụng một tên biến duy nhất trong một uncontrolled component:

```javascript{5,9,18}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**Thử dùng với CodePen**](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

Bởi vì một uncontrolled component lưu giữ mã nguồn trong trong DOM, đôi khi, nó tích hợp dễ dàng hơn với React và non-React khi sử dụng uncontrolled components. Nó cũng có thể giúp mã nguồn ngắn gọn hơn một chút nếu như bạn muốn nhanh chóng và lộn xộn. Ngược lại, bạn nên thường xuyên sử dụng controlled components.

Nếu bạn vẫn không rõ nên sử dụng loại thành phần nào cho một tình huống cụ thể, bạn có thể tìm [bài viết so sánh input của controlled và uncontrolled](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) rất có hữu ích.

### Giá trị mặc định {#default-values}

Trong vòng đời của React, thuộc tính `value` trên các phần tử của form elements sẽ được ghi đè lên các giá trị trong DOM. Với một uncontrolled component, bạn thường muốn dùng React để chỉ định giá trị ban đầu, nhưng không kiểm soát được ở các các lần cập nhật tiếp theo. Để giải quyết trường hợp này, bạn có thể chỉ định một thuộc tính `defaultValue` attribute thay cho thuộc tính `value`. Thay đổi giá trị của thuộc tính `defaultValue` sau khi một component được mount sẽ không có bất cứ cập giá trị nào trong DOM.

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={this.input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

Tương tự, `<input type="checkbox">` và `<input type="radio">` hỗ trợ `defaultChecked`, và `<select>` và `<textarea>` hỗ trợ `defaultValue`.

## File của thẻ input {#the-file-input-tag}

Trong HTML, một `<input type="file">` cho phép người dùng chọn một hoặc nhiều file từ thiết bị của họ để được tải lên máy chủ hoặc thao tác bởi JavaScript thông qua [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

Trong React, một `<input type="file" />` luôn luôn có uncontrolled component bởi vì giá trị của nó có thể được truyền bởi người dùng và không theo chương trình.

Bạn nên sử dụng File API để tương tác với các file. Ví dụ sau đây cho thấy cách tạo một [ref đến DOM node](/docs/refs-and-the-dom.html) để truy cập vào (các) file trong một trình xử lí:

`embed:uncontrolled-components/input-type-file.js`

[](codepen://uncontrolled-components/input-type-file)

