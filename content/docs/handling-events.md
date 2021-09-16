---
id: handling-events
title: Việc Bắt các Sự kiện
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

Việc bắt sự kiện của những element React rất giống với những element DOM. Có một số khác biệt về cú pháp như:

* Những sự kiện của React được đặt tên theo dạng camelCase, thay vì lowercase.
* Với JSX, bạn có thể sử dụng "hàm" (function) để bắt sự kiện thay vì phải truyền vào một chuỗi.

Ví dụ, đoạn HTML sau:

```html
<button onclick="activateLasers()">
  Activate Lasers
</button>
```

sẽ có đôi chút khác biệt trong React:

```js{1}
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

Một điểm khác biệt nữa trong React là bạn không thể trả về `false` để chặn những hành vi mặc định mà phải gọi `preventDefault` trực tiếp. Lấy ví dụ với đoạn HTML sau, để chặn hành vi mặc định của đường dẫn là mở trang mới, bạn có thể viết:

```html
<form onsubmit="console.log('You clicked submit.'); return false">
  <button type="submit">Submit</button>
</form>
```

Còn trong React, bạn có thể làm như thế này:

```js{3}
function Form() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log('You clicked submit.');
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}
```

Ở đây, `e` là một sự kiện ảo (synthetic event). React định nghĩa những sự kiện ảo này dựa trên [chuẩn W3C](https://www.w3.org/TR/DOM-Level-3-Events/), nên bạn không cần lo lắng về sự tương thích giữa những browser. React events không hoạt động chính xác giống như những event nguyên bản (native event). Hãy tham khảo tài liệu về [`SyntheticEvent`](/docs/events.html) để tìm hiểu thêm.

Khi làm việc với React, bạn thường không cần phải gọi `addEventListener` để gắn listener cho element DOM sau khi nó được khởi tạo. Thay vào đó, bạn chỉ cần cung cấp một listener ngay lần đầu element được render.

Khi bạn định nghĩa component bằng [class ES6](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Classes), một mẫu thiết kế phổ biến là sử dụng phương thức của class để bắt sự kiện. Ví dụ, component `Toggle` dưới đây render một chiếc nút để người dùng thay đổi giữa state “ON” và “OFF":

```js{6,7,10-14,18}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // Phép "ràng buộc" (bind) này là cần thiết để `this` hoạt động trong callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/xEmzGg?editors=0010)

Bạn phải cẩn thận về ý nghĩa của `this` trong những callback JSX. Trong JavaScript, những phương thức của class mặc định không bị [ràng buộc](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind). Nếu bạn quên ràng buộc `this.handleClick` và truyền nó vào `onClick`, `this` sẽ có giá trị là `undefined` khi phương thức này được thực thi.

Đây không phải là tính chất của React mà là một phần trong [cách những hàm JavaScript hoạt động](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/). Thông thường, nếu bạn trỏ tới phương thức mà không có `()` theo sau như `onClick={this.handleClick}`, bạn nên ràng buộc phương thức đó.

Nếu bạn thấy việc gọi `bind` phiền phức thì có hai giải pháp. Trong trường hợp bạn đang sử dụng [cú pháp thuộc tính class public](https://babeljs.io/docs/plugins/transform-class-properties/) thử nghiệm, bạn có thể dùng những thuộc tính class để ràng buộc callback một cách chính xác:

```js{2-6}
class LoggingButton extends React.Component {
  // Cú pháp này đảm bảo `this` được ràng buộc trong handleClick.
  // Lưu ý: đây là cú pháp *thử nghiệm*.
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

Cú pháp này được bật theo mặc định trong [Create React App](https://github.com/facebookincubator/create-react-app).

Nếu bạn không sử dụng cú pháp thuộc tính class, bạn có thể dùng "hàm rút gọn" [arrow function](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Functions/Arrow_functions) trong callback:

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // Cú pháp này đảm bảo `this` được ràng buộc trong handleClick
    return (
      <button onClick={() => this.handleClick()}>
        Click me
      </button>
    );
  }
}
```

Vấn đề với cú pháp này nằm ở chỗ một callback khác sẽ được khởi tạo mỗi khi `LogginButton` render. Điều này ổn với đa số trường hợp. Tuy nhiên, nếu callback này được truyền duới dạng prop xuống những component con, những component này sẽ bị render lại. Nói chung, chúng tôi khuyến khích việc ràng buộc ở constructor hoặc sử dụng cú pháp thuộc tính class để ngăn chặn vấn đề về hiệu suất này.

## Truyền Tham số vào Hàm Bắt Sự kiện {#passing-arguments-to-event-handlers}

Bên trong một vòng lặp, người ta thường muốn truyền thêm một parameter cho một event handler. Ví dụ như, nếu `id` là ID của dòng (row), thì 2 dòng code bên dưới sẽ work:

```js
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

Hai dòng code trên là tương đương, và lần lượt sử dụng [hàm rút gọn](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Functions/Arrow_functions) và [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind).

Trong cả hai trường hợp, tham số `e`, đại diện cho sự kiện React, sẽ được truyền là tham số thứ hai sau số định danh. Với hàm rút gọn, chúng ta phải truyền nó trực tiếp, nhưng với `bind` thì những tham số còn lại sẽ tự động nối tiếp.
