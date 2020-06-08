---
id: state-and-lifecycle
title: State and Lifecycle
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

Trang này giới thiệu khái niệm về state và lifecycle trong React component. Bạn có thể tìm [tham chiếu component API chi tiết tại đây](/docs/react-component.html).

Xem xem lại ví dụ đồng hồ tíc tắc [một phần của chương trước](/docs/rendering-elements.html#updating-the-rendered-element). Trong [Rendering Elements](/docs/rendering-elements.html#rendering-an-element-into-the-dom), chúng ta chỉ học cách để update UI. chúng ta gọi `ReactDOM.render()` để thay đổi đầu ra được kết xuất (rendered output):

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Thử trên Codepen**](https://codepen.io/gaearon/pen/gwoJZk?editors=0010)

Trong chương này, chúng ta sẽ học làm thế thế nào để tạo thành phần `Clock` có thể tái sử dụng và đóng gói. Nó sẽ tự đặt bộ hẹn giờ của mình và tự cập nhập mỗi giây

Chúng ta có thể bắt đầu đóng gói clock và trông nó sẽ như thế này:

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/dpdoYR?editors=0010)

Tuy nhiên, nó thiếu một yếu tố quan trọng: trong tực tế `Clock` sẽ đặt bộ hẹn giờ và cập nhập lại UI mỗi giây vì vậy ta nên làm nó một cách chi tiết hơn `Clock`

Lý tưởng nhất là ta làm điều này một lần duy nhất và `Clock` tự cập nhập chính nó:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Để thực hiện điều này, ta cần thêm "state" vào component `Clock`

State cũng tương tự như props, nhưng nó là của riêng component và được kiểm soát hoàn toàn bởi chúng

## Chyển đổi Function thành Class {#converting-a-function-to-a-class}

Bạn có thể chuyển đổi một function của thành phần như `Clock` thành class trong năm bước:

1. Tạo một [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes), cùng tên, cho nó extends `React.Component`.

2. Thêm một phương thức rỗng gọi là `render()`.

3. Di chuyển nội dung của function vào bên trong phương thức `render()`

4. Thay thế `props` thành `this.props` trong nội dung của `render()`.

5. Xóa khai function rỗng thừa lại mà ta đã lấy nội dung từ nó.

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/zKRGpo?editors=0010)

`Clock` giờ sẽ được định nghĩa là một class chứ không còn là một function.

Phương thức `render` sẽ được gọi mỗi khi sự cập nhập xảy ra, miễn sao là chúng ta render `<Clock/>` bên trong cùng DOM node, chỉ có duy nhất instance đơn lẻ của class `Clock` sẽ sử dụng được. Điều này làm ta có thể sử dụng thêm các feature khác như local state và các phương thức lifecycle

## Thêm Local State vào Class {#adding-local-state-to-a-class}

Chúng ta sẽ di chuyển `date` từ props vào state trong ba bước:

1) Thay thế `this.props.date` thành `this.state.date` bên trong phương thức `render()`

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) Thêm một [class constructor](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes#Constructor) gán `this.state` ban đầu:

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Lưu ý cách ta truyền `props` vào base contructor

```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

Thành phần Class nên luôn luôn gọi đến base contructor bằng `props`

3) Xóa prop `date` từ phần tử `<Clock />`:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Sau đó chúng ta sẽ truyền code của bộ hẹn giờ trở về component đó.

Kết quả sẽ trông như sau:

```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/KgQpJd?editors=0010)

Tiếp theo, chúng ta sẽ cho `Clock` một bộ hẹn giờ và tự cập nhập mỗi giây.

## Thêm các phương thức Lifecycle vào Class {#adding-lifecycle-methods-to-a-class}

Trong ứng dụng với nhiều component, điều rất quan trọng đó là giải phóng tài nguyên được dùng bởi những component sau khi chúng bị gỡ bỏ

Chúng ta muốn [cài đặt hẹn giờ](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) khi `Clock` được render vào trong DOM lần đầu tiên. Đây được gọi là "mouting" trong React.

Chúng ta cũng muốn [xóa cài đặt hẹn giờ](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval) khi DOM đã được tạo bằng cách `Clock` sẽ bị xóa. Đây được gọi là "unmouting" trong React.

Chúng ta có thể định nghĩa những phương thức đặc biệt trong component class để chạy code khi compoent mount và unmount:

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Những phương thức đặc biệt đó được gọi là "lifecycle methods".

Phương thức `componentDidMount()` chạy sau khi đầu ra component đã được render vào trong DOM. Đây là vị trí thuận lợi để đặt bộ hẹn giờ:

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

Lưu ý chúng ta lưu ID của bộ hẹn giờ vào `this` (`this.timerID`)

Trong khi `this.props` được thiết lập bởi React và `this.state` có một ý nghĩa đặc biệt, bạn có thể thoải mái thêm các trường bổ sung vào class thủ công nếu bạn cần lưu thứ gì đó không tham gia vào dòng chảy dữ liệu (như ID của bộ hẹn giờ)

Chúng ta sẽ gỡ bộ hẹn giờ trong phương thức lifecycle `componentWillMount()`:

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

Cuối cùng, chúng ta sẽ thực hiện một phương thức được gọi là `tick()` cái mà component `Clock` sẽ chạy mỗi giây.

Nó sẽ sử dụng `this.setState()` để hẹn giờ cập nhập cho component state cục bộ:

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Thử trên Codepen**](https://codepen.io/gaearon/pen/amqdNA?editors=0010)

Giờ đồng hồ sẽ được đếm mỗi giây

Hãy tóm tắt nhanh những gì đã diễn ra và thứ tự các method được gọi:

1) Khi `<Clock/>` được truyền vào `ReactDOM.render()`, React gọi đến contructor của component `Clock`. Kể từ khi `Clock` cần hiển thị thời gian hiện tại, nó khởi tạo `this.state` với một object bao gồm cả thời gian hiện tại. Chúng ta sẽ cập nhập state này sau đó

2) React sau đó gọi phương thức render() của component `Clock`. Đây là cách React học(đọc) những gì sẽ được hiển thị ra màn hình. React sau đó cập nhập DOM để trùng khớp với đầu ra kết xuất(render) của `Clock`

3) Khi đầu ra `Clock` được thêm vào DOM, React gọi đến phương thức lifecycle `componentDidMount`. Bên trong nó, component `Clock` hỏi trình duyệt để cài đặt bộ hẹn giờ sau đó gọi đến phương thức `tick()` của component mỗi lần trong 1 giây

4) Mỗi giây trình duyệt gọi đến phương thức `tick()`. Bên trong nó, component `Clock` lên lịch trình để UI cập nhập bằng cách gọi `setState()` với một object chứa thời gian hiện tại. Nhờ vào `setState()`, React biết rằng state đã được thay đổi, và phương thức `render()` được gọi là để học (đọc) cái gì sẽ được in ra màn hình. Thời điểm này, `this.state.date` bên trong phương thức `render()` sẽ khác, vì vậy kết xuất đầu ra sẽ bao gồm thời gian đã được cập nhập. React cập nhập DOM sao phù hợp

5) Nếu component `Clock` chưa bị xóa khỏi DOM, React gọi đến phương thức lifecycle `componentWillUnmount()` thì bộ hẹn giờ bị dừng lại

## Sử dụng state đúng cách {#using-state-correctly}

Có 3 điều bạn nên biết về `setState()`.

### Không sửa đổi state trực tiếp {#do-not-modify-state-directly}

Ví dụ, điều này sẽ không render lại component:

```js
// Wrong
this.state.comment = 'Hello';
```

Thay vào đó, sử dụng `setState()`:

```js
// Đúng
this.setState({comment: 'Hello'});
```

Nơi duy nhất mà bạn có thể gán `this.state` là contructor

### Cập nhập state có thể là bất đồng bộ {#state-updates-may-be-asynchronous}

React có thể gộp nhiều lệnh gọi `setState()` vào một lần cập nhập để tăng hiệu năng

Bởi vì `this.props` và `this.state` có thể được cập nhập bất đồng bộ, bạn không nên dựa vào giá trị của chúng để tính toán state tiếp theo

Ví dụ, đoạn mã này có thể thất bại để cập nhập counter:

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

Để sửa nó, sử dụng một dạng thứ hai của `setState()` nó nhận một funtion chứ không phải object. Funtion này sẽ nhận state trước đó làm tham số đầu tiên, và props tại thời điểm cập nhập được nhận làm tham số thứ hai:

```js
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

Ta đã sử dụng [arrow function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) ở ví dụ trên, nhưng nó vẫn hoạt động với funtion truyền thống:

```js
// Correct
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### Cập nhập trạng thái được gộp lại {#state-updates-are-merged}

Khi mà bạn gọi `setState()`, React gộp object bạn cung cấp vào state hiện tại

Ví dụ, state của bạn có thể chứa một số biến độc lập:

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

Sau đó bạn có cập nhập chúng một cách độc lập bằng cách gọi `setState` cho biến cần cập nhập:

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

Sự hợp nhất là nông (shallow), nên `this.setState({comments})` để lại `this.state.posts` nguyên vẹn, còn `this.state.comments` sẽ hoàn toàn được thay thế bằng giá trị mới.

## Dữ liệu chảy từ trên xuống dưới {#the-data-flows-down}

Parent và child component, cả hai có thể không hiểu dù component có là stateful hoặc stateless, và chúng sẽ không quan tâm liệu rằng chúng được định nghĩa là một function hoặc một class

Đó là lý do vì sao state thường xuyên được gọi cục bộ hoặc và được khép kín. Nó không truy cập đến bất cứ component khác ngoài cái mà đang sở hữu và đặt giá trị cho nó

Một component có thể chọn để truyền state của nó như một prop cho những child component của nó:

```js
<FormattedDate date={this.state.date} />
```

Component `FomattedDate`sẽ nhận `date` trong prop của nó và sẽ không biết liệu rằng nó đến từ state của `Clock`, từ props của `Clock`, hay được nhập bằng tay:

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/zKRqNB?editors=0010)

Đây được gọi chung là dòng chảy dữ liệu "top-down" hoặc "unidirectional". Bất kỳ state luôn được sở hữu bởi một vài component đặc biệt, và bất cứ dữ liệu hoặc nguồn gốc UI sinh ra từ state có thế ảnh hưởng đến những component "phía dưới" chúng và trong "tree"

Nếu bạn tưởng tượng một "component tree" như một thác nước của những props, mỗi state của component như bổ sung thêm nguồn nước tụ lại tại một điểm nhưng cuối cùng vẫn chảy xuống

Để thấy rằng tất cả những component hoàn toàn bị cô lập, ta có thể tạo một component `App` render bên trong nó ba `<Clock>`

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[**Thử nó trên Codepen**](https://codepen.io/gaearon/pen/vXdGmd?editors=0010)

Mỗi `Clock` thiết lập bộ hẹn giờ của riêng mình và update hoàn toàn độc lập.

Trong React apps, việc một component là stateful hoặc stateless của component được cân nhắc thực hiện rõ ràng, điều này có thể thay đổi theo thời gian. Bạn có thể sử dụng những stateless component bên trong những stateful component, và ngược lại
