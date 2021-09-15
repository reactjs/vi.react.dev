---
id: react-without-es6
title: React Không Dùng ES6
permalink: docs/react-without-es6.html
---

Thông thường, bạn sẽ định nghĩa một React component như là một JavaScript class:

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Nếu bạn chưa sử dụng ES6, bạn có thể sử dụng `create-react-class` module để thay thế:


```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```

API của các ES6 class tương tự như `createReactClass()` với một vài trường hợp ngoại lệ.

## Khai báo Props mặc định {#declaring-default-props}

Với các function và các ES6 class, `defaultProps` được định nghĩa như là một property trên chính component:

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};
```

Với `createReactClass()`, bạn cần xác định `getDefaultProps()` như là một function trên đối tượng được truyền:

```javascript
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },

  // ...

});
```

## Cài đặt State ban đầu {#setting-the-initial-state}

Trong các ES6 class, bạn cần định nghĩa state ban đầu bằng cách gán `this.state` bên trong constructor:

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

Với `createReactClass()`, bạn phải cung cấp một `getInitialState` method trả về state ban đầu::

```javascript
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

## Autobinding {#autobinding}

Trong các React component được khai báo như là các ES6 class, các method tuân theo ngữ nghĩa giống như các ES6 class thông thường. Điều này có nghĩa là chúng không tự động bind `this` đến instance. Bạn sẽ phải sử dụng rõ ràng `.bind(this)` bên trong constructor:

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
    // This line is important!
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // Because `this.handleClick` is bound, we can use it as an event handler.
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

Với `createReactClass()`, điều này là không cần thiết vì nó sẽ bind tất cả các method:

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
});
```

Điều này có nghĩa là viết các ES6 class đi kèm với một chút code soạn sẵn cho các trình xử lý event, nhưng mặt trái của nó là performance tốt hơn một chút trong các ứng dụng lớn.

Nếu code soạn sẵn quá không hấp dẫn đối với bạn, bạn có thể bật **experimental** [Class Properties](https://babeljs.io/docs/plugins/transform-class-properties/) syntax proposal với Babel:


```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
  }
  // WARNING: this syntax is experimental!
  // Using an arrow here binds the method:
  handleClick = () => {
    alert(this.state.message);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

Xin lưu ý rằng cú pháp ở trên là **experimental** và cú pháp có thể thay đổi, hoặc đề xuất có thể không biến nó thành ngôn ngữ.

Nếu bạn muốn an toàn hơn, bạn có thể có một số lựa chọn bên dưới:

* Bind methods bên trong constructor.
* Sử dụng arrow functions, e.g. `onClick={(e) => this.handleClick(e)}`.
* Tiếp tục sử dụng `createReactClass`.

## Mixins {#mixins}

>**Ghi chú:**
>
>ES6 ra mắt mà không có bất kỳ hỗ trợ mixin nào. Do đó, sẽ không có hỗ trợ cho các mixin khi bạn sử dụng React với các ES6 class.
>
>**Chúng tôi cũng tìm thấy nhiều vấn đề trong các codebase sử dụng các mixin [và không khuyên bạn sử dụng chúng trong code mới](/blog/2016/07/13/mixins-considered-harmful.html).**
>
>Phần này chỉ để tham khảo.

Đôi khi các component rất khác nhau có thể chia sẻ một số chức năng chung. Đây đôi khi được gọi là [cross-cutting concerns](https://en.wikipedia.org/wiki/Cross-cutting_concern). `createReactClass` cho phép bạn sử dụng hệ thống `mixins` kế thừa cho việc đó.

Một trường hợp sử dụng phổ biến là một component muốn tự cập nhật trong một khoảng thời gian (time interval). Thật dễ dàng để sử dụng `setInterval()`, nhưng điều quan trọng là phải hủy interval của bạn khi bạn không cần nó nữa để tiết kiệm bộ nhớ. React cung cấp các [lifecycle methods](/docs/react-component.html#the-component-lifecycle) cho bạn biết khi nào một component sắp được tạo hoặc bị phá hủy. Hãy tạo một mixin đơn giản sử dụng các method này để cung cấp một `setInterval()` function dễ dàng sẽ tự động được dọn dẹp khi component của bạn bị phá hủy.

```javascript
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var createReactClass = require('create-react-class');

var TickTock = createReactClass({
  mixins: [SetIntervalMixin], // Use the mixin
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // Call a method on the mixin
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        React has been running for {this.state.seconds} seconds.
      </p>
    );
  }
});

ReactDOM.render(
  <TickTock />,
  document.getElementById('example')
);
```

Nếu một component đang sử dụng nhiều mixin và một số mixin xác định cùng một lifecycle method (tức là một số mixin muốn thực hiện một số dọn dẹp khi component bị phá hủy), tất cả các lifecycle method được đảm bảo sẽ được gọi. Các method được xác định trên các mixin chạy theo thứ tự các mixin được liệt kê, theo sau là một lệnh gọi method trên component.
