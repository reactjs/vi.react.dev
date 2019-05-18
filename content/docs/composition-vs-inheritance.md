---
id: composition-vs-inheritance
title: Kết hợp và kế thừa
permalink: docs/composition-vs-inheritance.html
redirect_from:
  - "docs/multiple-components.html"
prev: lifting-state-up.html
next: thinking-in-react.html
---

React có một mô hình kết hợp mạnh mẽ, khuyến khích sử dụng tính kết hợp hơn là kế thừa để tái sử dụng code giữa các component.

Trong phần này, chúng ta sẽ xem xét một vài vấn đề với những người mới bắt đầu với React, họ thường sử dụng kế thừa, và đưa ra cách giải quyết vấn đề đó với tính kế thừa.

## Giới hạn {#containment}

Một vài component không biết về các component con của nó trước thời hạn. Điều này rất phổ biến với những component như `Sidebar` và `Dialog` đóng vài trò như là những chiếc "hộp" chung.

Chúng tôi khuyến khích sử dụng những prop `con` đặc biệt để truyền những element con trực tiếp tới đầu ra của các component này:

```js{4}
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

Nó giúp cho các component khác truyền những element con một cách linh động hơn bằng cách lồng JSX với nhau:

```js{4-9}
function WelcomeDialog() {vào
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```

**[Xem ví dụ trên CodePen](https://codepen.io/gaearon/pen/ozqNOV?editors=0010)**

Tất cả một thứ trong thẻ JSX `<FancyBorder>` được truyền vào trong `FancyBorder` component như là một `children` prop. Vì `FancyBorder` tạo ra `{props.children}` bên trong thẻ `<div>`, nên các phần tử được truyền vào cuối cùng sẽ xuất hiện tại đầu ra.

Khi nó trở nên ít phổ biến hơn, đôi khi bạn có thể cần tới nhiều chỗ trống trong một component. Trong trường hợp như thế bạn có thể tạo ra những quy ước của riêng mình thay vì sử dụng `children`:

```js{5,8,18,21}
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

[**Xem ví dụ trên CodePen**](https://codepen.io/gaearon/pen/gwZOJp?editors=0010)

Các phần tử React như `<Contacts />` và `<Chat />` là các đối tượng, nên bạn có thể truyền nó như là props tương tự như các dữ liệu khác. Phương pháp này có thể nhắc bạn về khái niệm "slots" trong các thư viện khác nhưng không hề có một giới hạn nào với các tham số có thể truyền như props trong React.

## Chuyên biệt hoá {#specialization}

Đôi khi chúng ta nghĩ về các component như là "một trường hợp đặc biệt" của các component khác. Ví dụ, chúng ta có thể nói rằng `WelcomeDialog` là một trường hợp đặc biệt của `Dialog`.

Trong React, nó có thể đạt được bằng cách kết hợp, khi gộp nhiều component "đặc biệt" để tạo ra một component chung và cấu hình nó với props:

```js{5,8,16-18}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}
```

[**Xem ví dụ trên CodePen**](https://codepen.io/gaearon/pen/kkEaOZ?editors=0010)

Phương thức kết hợp hoạt động tốt cho cả các component định nghĩa như là những class:

```js{10,27-31}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Mars Exploration Program"
              message="How should we refer to you?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Welcome aboard, ${this.state.login}!`);
  }
}
```

[**Xem ví dụ trên CodePen**](https://codepen.io/gaearon/pen/gwZbYa?editors=0010)

## Vậy còn tính kế thừa thì sao? {#so-what-about-inheritance}

Tại Facebook, chúng tôi sử dụng React trong hàng ngàn các components, và chúng tôi không thấy một trường hợp nào chúng tôi khuyến khích tạo ra hệ thống component kế thừa.

Props và tính kết hợp mang lại sự linh hoạt mà bạn cần để tuỳ chỉnh giao hiện và hành vi một cách rõ ràng và an toàn. Nhớ rằng các component có thể chấp nhận các props không giới hạn, kể cả các giá trị sơ khai, các phần tử React hoặc các hàm.

Nếu bạn muốn tái sử dụng các chức nằng không liên quan tới giao diện người dùng, chúng tôi khuyến khích nên tách biệt nó ra những module Javascript riêng. Các component có thể nhập nó và sử dụng các hàm, đối tượng hoặc class, mà không phải mở rộng nó.