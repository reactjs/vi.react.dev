---
id: uncontrolled-components
title: Uncontrolled Components
permalink: docs/uncontrolled-components.html
---

Trong hầu hết các trường hợp, chúng tôi khuyên bạn nên sử dụng [controlled components](/docs/forms.html#controlled-components) để triển khai forms. Trong controlled component, dữ liệu trong form sẽ được quản lí hoàn toàn bởi React component. Trái ngược với điều đó, uncontrolled component, dữ liệu sẽ được quản lí trực tiếp bởi chính DOM.

Để tạo uncontrolled component, thay vì việc xử lí sự kiện mỗi khi state được update, bạn có thể [sử dụng ref](/docs/refs-and-the-dom.html) để lấy dữ liệu từ DOM.

Ví dụ, đoạn code bên dưới nhận vào "name" trong một uncontrolled component:

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

[**Xem ví dụ trên CodePen**](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

Vì uncontrolled component chỉ dựa trên DOM, điều này khiến việc tương tác với code React và non-React khá dễ dàng. Nếu bạn muốn code nhanh và bẩn, uncontrolled components có thể giúp bạn code ít code hơn. Nếu không, bạn nên sử dụng controlled components.

Nếu những giải thích trên vẫn chưa rõ về loại component sử dụng cho các trường hợp cụ thể, bạn có thể tìm thêm ở [bài viết về controlled và uncontrolled inputs](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/).

### Giá trị mặc định {#default-values}

Trong vòng đời render component React, thuộc tính `value` của các thành phần trong form sẽ override các giá trị trong DOM. Với uncontrolled component, bạn thường cần sử dụng React để chỉ định giá trị mặc định, nhưng bạn không thể kiểm soát được các bản thay đổi ở phía sau (nếu bạn dùng `value` mỗi khi form render, nó sẽ luôn gán giá trị này cho input). Để xử lí trong trường hợp này, bạn phải chỉ định giá trị của `defaultValue` thay vì `value`. Việc thay đổi giá trị của `defaultValue` sau khi component được mounted sẽ không làm cập nhật giá trị trên cây DOM.

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

Tương tự như vậy, `<input type="checkbox">` và `<input type="radio">` có hỗ trợ `defaultChecked`, `<select>` và `<textarea>` hỗ trợ `defaultValue`.

## Thẻ input type file  {#the-file-input-tag}

Trong HTML, thẻ`<input type="file">` cho phép người dùng chọn một hoặc nhiều files từ bộ nhớ thiết bị của họ và gửi đến server hoặc xử lí bằng javascript thông qua [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

Trong React, thẻ `<input type="file" />` luôn luôn là uncontrolled component vì giá trị của nó chỉ được gán bởi người dùng, không phải chương trình. 

Bạn nên sử dụng File API để tương tác với những files này. Ví dụ bên dưới mô tả cách tạo một [ref trong DOM node](/docs/refs-and-the-dom.html) để truy xuất các files khi submit:

`embed:uncontrolled-components/input-type-file.js`

[](codepen://uncontrolled-components/input-type-file)

