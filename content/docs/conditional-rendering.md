---
id: conditional-rendering
title: Render Có Điều Kiện
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---

Trong React, bạn có thể tạo ra các component riêng biệt chứa đựng hành vi mà bạn cần. Tiếp đến, dựa trên trạng thái (state) hiện tại của ứng dụng (application), bạn sẽ chỉ định việc các component đó có nên xuất hiện hay không.

Render có điều kiện trong React hoạt động tương tự như cách mà chúng ta vẫn thường thấy trong Javascript. Đó là dùng câu lệnh [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) hay [conditional operator](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) trong Javascript để tạo ra các element ứng với state hiện tại, React sau đó sẽ cập nhật giao diện người dùng (UI) phù hợp với state đó.

Thử xét đến hai component bên dưới:

```js
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}
```

Ta tạo một component với tên `Greeting`, nhiệm vụ của nó là hiển thị một trong hai component phía trên dựa vào trạng thái của người dùng (đã đăng nhập hay chưa).

```javascript{3-7,11,12}
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Thử thay đổi prop isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

Ví dụ này sẽ hiển thị nội dung lời chào khác nhau dựa trên giá trị của prop `isLoggedIn`.

### Gán giá trị element vào biến {#element-variables}

Bạn có thể dùng biến để lưu lại các element. Điều này giúp cho bạn có thể render có điều kiện một phần của component trong khi phần còn lại của component sẽ không bị thay đổi.

Thử khởi tạo hai component thể hiện nút đăng nhập (Login) và đăng xuất (Logout):


```js
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}
```

Trong ví dụ phía dưới, chúng ta sẽ tạo một [stateful component](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) với tên gọi `LoginControl`.

Component ta vừa tạo sẽ hiển thị hoặc `<LoginButton />` hoặc `<LogoutButton />` dựa theo state hiện tại. Nó cũng sẽ hiển thị component `<Greeting />` từ ví dụ trước đó.

```javascript{20-25,29,30}
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

Trong khi việc khởi tạo một biến và sử dụng lệnh `if` là cách làm khá ổn để render có điều kiện một component, nhưng đôi khi, bạn sẽ muốn dùng những cú pháp ngắn hơn. Thật may là chúng ta vẫn có một số ít lựa chọn khác để có thể thực hiện render có điều kiện trực tiếp trên JSX. Chúng sẽ được giải thích rõ bên dưới.

### Thay thế If bằng toán tử logic && {#inline-if-with-logical--operator}

Bạn có thể [nhúng các biểu thức (expression) trong JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx)
You may [embed expressions in JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) bằng cách bọc chúng lại trong cặp ngoặc nhọn `{}`. Điều này bao gồm cả toán tử mang tính logic`&&` JavaScript.Việc này rất hữu ích khi xử lí các điều kiện có element bên trong:

```js{6-10}
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

Đoạn code vừa rồi sẽ hoạt động vì trong Javascript, giá trị của `true && expression` luôn dựa vào `expression`, còn `false && expression` thì sẽ luôn được hiểu là `false`.

Vì thế, nếu điều kiện trả về giá trị là `true`, element phía sau toán tử logic `&&` sẽ xuất hiện ở màn hình. Nếu giá trị trả về là `false`, React sẽ bỏ qua nó.

Chú ý rằng việc trả về một falsy expression sẽ vẫn làm cho element phía sau `&&` bị giữ lại nhưng sẽ trả về một falsy expression. Trong ví dụ bên dưới, `<div>0</div>` sẽ được trả về bởi phương thức render.

```javascript{2,5}
render() {
  const count = 0;
  return (
    <div>
      { count && <h1>Messages: {count}</h1>}
    </div>
  );
}
```

### Thay thế If-Else bằng toán tử điều kiện {#inline-if-else-with-conditional-operator}

Một phương thức khác dùng để thực hiện render có điều kiện trực tiếp trên JSX là dùng toán tử điều kiện (ba ngôi) [`condition ? true : false`](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Operators/Conditional_Operator).

Trong ví dụ phía dưới, ta sử dụng phương thức đã được nêu ở trên để render có điều kiện một đoạn văn bản nhỏ.

```javascript{5}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}
```

Nó cũng có thể được sử dụng ở các biểu thức (expressions) lớn hơn, mặc dù điều đó có thể làm cho chúng ta khó hiểu rõ việc gì đang xảy ra.

```js{5,7,9}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn
        ? <LogoutButton onClick={this.handleLogoutClick} />
        : <LoginButton onClick={this.handleLoginClick} />
      }
    </div>
  );
}
```

Giống hệt như Javascript, việc sử dụng cách thức nào sẽ dựa trên những gì mà bạn và nhóm của bạn thấy dễ đọc hơn. Và nên lưu ý, khi các điều kiện trở nên quá phức tạp thì nên cân nhắc đến việc thực hiện [tách component](/docs/components-and-props.html#extracting-components).

### Ngăn chặn component thực hiện render {#preventing-component-from-rendering}

Trong một số trường hợp hiếm gặp, bạn sẽ muốn một component tự ẩn đi dù nó được render bởi một component khác. Để làm được điều đó, ta sẽ trả về `null` thay vì trả về những gì cần hiện lên màn hình.

Ở ví dụ phía dưới, component `<WarningBanner />` được render dựa trên giá trị của prop `warn`. Nếu giá trị của prop là `false` thì component đó sẽ không được render.

```javascript{2-4,29}
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

Trả về `null` bên trong hàm `render` của component không gây ảnh hưởng đến các phương thức của lifecycle. Ví dụ như `componentDidUpdate` vẫn sẽ được gọi.
