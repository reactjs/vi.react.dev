---
id: faq-functions
title: Truyền Functions cho Component
permalink: docs/faq-functions.html
layout: docs
category: FAQ
---

### Làm thế nào tôi truyền một sự kiện (như onClick) cho một component?{#how-do-i-pass-an-event-handler-like-onclick-to-a-component}

Truyền một sự kiện xử lý và một function khác như là một props cho component con:

```jsx
<button onClick={this.handleClick}>
```

Nếu bạn cần truy cập vào component cha trong xử lý, bạn cần phải bind function cụ thể với một component (xem bên dưới).

### Làm sao tôi bind một function cho component cụ thể? {#how-do-i-bind-a-function-to-a-component-instance}

Có một số cách để đảm bảo các function có quyền truy cập vào các thuộc tính component như `this.props` và `this.state`, tùy thuộc vào cú pháp và các bước xây dựng mà bạn đang sử dụng.

#### Bind trong Constructor (ES2015) {#bind-in-constructor-es2015}

```jsx
class Foo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```

#### Class Properties (Stage 3 Proposal) {#class-properties-stage-3-proposal}

```jsx
class Foo extends Component {
  // Note: this syntax is experimental and not standardized yet.
  handleClick = () => {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```

#### Bind trong Render {#bind-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>Click Me</button>;
  }
}
```

>**Lưu ý:**
>
>Sử dụng `Function.prototype.bind` trong hàm render tạo ra một function mới mỗi lần component renders, điều đó có thể liên quan tới hiệu suất (Xem bên dưới).

#### Arrow Function trong Render {#arrow-function-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={() => this.handleClick()}>Click Me</button>;
  }
}
```

>**Lưu ý:**
>
>Sử dụng arrow function trong hàm render tạo ra một function mới mỗi lần component renders, điều đó làm phá vỡ tính tối ưu dựa trên so sánh các định danh.

### Có được sử dụng arrow function trong hàm render không? {#is-it-ok-to-use-arrow-functions-in-render-methods}

Nói chung, đồng ý, nó OK, và nó thường là cách dễ nhất để truyền tham số cho các callback functions.

Nếu bạn có vấn đề về hiệu suất, bằng mọi cách, hãy tối ưu hóa!

### Tại sao ràng buộc cần thiết ở tất cả? {#why-is-binding-necessary-at-all}

Trong JavaScript, hai đoạn code này **không** tương đương:

```js
obj.method();
```

```js
var method = obj.method;
method();
```

Các phương thức binding giúp đảm bảo rằng đoạn code thứ hai hoạt động giống như cách đầu tiên.

Với React, thông thường bạn chỉ cần bind các phương thức bạn *truyền* cho các component khác. Ví dụ: `<button onClick = {this.handleClick}>` truyền `this.handleClick` vì vậy bạn phải bind nó. Tuy nhiên, không cần thiết phải bind hàm `render` hoặc phương thức vòng đời: chúng tôi không truyền chúng cho các component khác.

[Bài đăng này của Yehuda Katz](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/) giải thích binding là gì và cách các function hoạt động trong JavaScript, một cách chi tiết.

### Tại sao function của tôi lại gọi lại mỗi khi component render? {#why-is-my-function-being-called-every-time-the-component-renders}

Hãy chắc chắn rằng bạn đã _call function_ khi bạn truyền nó cho component:

```jsx
render() {
  // Wrong: handleClick is called instead of passed as a reference!
  return <button onClick={this.handleClick()}>Click Me</button>
}
```

Thay thế, *pass the function itself* (without parens):

```jsx
render() {
  // Correct: handleClick is passed as a reference!
  return <button onClick={this.handleClick}>Click Me</button>
}
```

### Làm cách nào để truyền tham số cho xử lý sự kiện hoặc callback? {#how-do-i-pass-a-parameter-to-an-event-handler-or-callback}

Bạn có thể sử dụng arrow function để bọc xung quanh xử lý sự kiện và truyền tham số:

```jsx
<button onClick={() => this.handleClick(id)} />
```

This is equivalent to calling `.bind`:

```jsx
<button onClick={this.handleClick.bind(this, id)} />
```

#### Ví dụ: Truyền tham số sử dụng arrow function {#example-passing-params-using-arrow-functions}

```jsx
const A = 65 // ASCII character code

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }
  handleClick(letter) {
    this.setState({ justClicked: letter });
  }
  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} onClick={() => this.handleClick(letter)}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

#### Ví dụ: Truyền tham số sử dụng data-attributes {#example-passing-params-using-data-attributes}

Thông thường, bạn có thể sử dụng DOM APIs để lưu trữ dữ liệu cần thiết cho xử lý sự kiện. Hãy xem xét phương pháp này nếu bạn cần tối ưu hóa một số lượng lớn các phần tử hoặc có một render tree dựa trên các phương thức kiểm tra sự bằng nhau React.PureComponent.

```jsx
const A = 65 // ASCII character code

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }

  handleClick(e) {
    this.setState({
      justClicked: e.target.dataset.letter
    });
  }

  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} data-letter={letter} onClick={this.handleClick}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

### Làm thế nào tôi có thể ngăn chặn một function được gọi quá nhanh hoặc quá nhiều lần liên tiếp? {#how-can-i-prevent-a-function-from-being-called-too-quickly-or-too-many-times-in-a-row}

Nếu bạn có một sự kiện như `onClick` hoặc `onScroll` và muốn ngăn hàm callback gọi lại quá nhanh, thì bạn có thể giới hạn tốc độ thực hiện hàm callback. Điều này có thể được thực hiện bằng cách sử dụng:

- **throttling**: thay đổi dựa vào tần suất dựa trên thời gian (eg [`_.throttle`](https://lodash.com/docs#throttle))
- **debouncing**: thực hiện dựa vào những thay đổi sau một khoảng thời gian (eg [`_.debounce`](https://lodash.com/docs#debounce))
- **`requestAnimationFrame` throttling**: thay đổi mẫu dựa trên [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) (eg [`raf-schd`](https://github.com/alexreardon/raf-schd))

Xem [mô phỏng này](http://demo.nimius.net/debounce_throttle/) để so sánh giữa các hàm `throttle` và `debounce`.

> Lưu ý:
>
> `_.debounce`, `_.throttle` và `raf-schd` cung cấp một phương thức `cancel` để huỷ các hàm callback đang bị trì hoãn. Bạn nên gọi phương thức này từ `componentWillUnmount` _hoặc_ kiểm tra để đảm bảo rằng component đó vẫn được gắn trong function bị trì hoãn.

#### Throttle {#throttle}

Throttle ngăn chặn một function được gọi nhiều lần trong một khung thời gian nhất định. Ví dụ dưới đây điều chỉnh một sự kiện xử lý "click" để ngăn chặn việc gọi nó nhiều hơn một lần mỗi giây.

```jsx
import throttle from 'lodash.throttle';

class LoadMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickThrottled = throttle(this.handleClick, 1000);
  }

  componentWillUnmount() {
    this.handleClickThrottled.cancel();
  }

  render() {
    return <button onClick={this.handleClickThrottled}>Load More</button>;
  }

  handleClick() {
    this.props.loadMore();
  }
}
```

#### Debounce {#debounce}

Debounce đảm bảo rằng một hàm sẽ không được thực thi sau một khoảng thời gian nhất định kể từ khi nó được gọi lần cuối. Điều này có thể hữu ích khi bạn phải thực hiện một số tính toán phức tạp để đáp ứng với một sự kiện có thể gửi đi nhanh chóng (ví dụ: các sự kiện scroll hoặc bàn phím). Ví dụ dưới đây nhập văn bản với độ trễ 250ms.

```jsx
import debounce from 'lodash.debounce';

class Searchbox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.emitChangeDebounced = debounce(this.emitChange, 250);
  }

  componentWillUnmount() {
    this.emitChangeDebounced.cancel();
  }

  render() {
    return (
      <input
        type="text"
        onChange={this.handleChange}
        placeholder="Tìm kiếm..."
        defaultValue={this.props.value}
      />
    );
  }

  handleChange(e) {
    this.emitChangeDebounced(e.target.value);
  }

  emitChange(value) {
    this.props.onChange(value);
  }
}
```

#### `requestAnimationFrame` throttling {#requestanimationframe-throttling}

[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) à cách sắp xếp thứ tự thực thi của một hàm trên trình duyệt tại thời điểm tối ưu cho hiệu suất hiển thị. Một hàm được xếp trong `requestAnimationFrame` sẽ kích hoạt trong khung tiếp theo. Trình duyệt sẽ làm việc liên tục để đảm bảo có 60 khung hình mỗi giây (60 fps). Tuy nhiên, nếu trình duyệt không thể, nó sẽ tự nhiên *giới hạn* số lượng khung hình trong một giây. Ví dụ: một thiết bị có thể chỉ có thể xử lý 30 fps và do đó bạn sẽ chỉ nhận được 30 khung hình trong giây đó. Sử dụng `requestAnimationFrame` để điều chỉnh là một kỹ thuật hữu ích ở chỗ nó ngăn bạn thực hiện hơn 60 cập nhật trong một giây. Nếu bạn đang thực hiện 100 bản cập nhật trong một giây, nó sẽ tạo ra thêm việc cho trình duyệt mà người dùng không hề nhìn thấy.

>**Lưu ý:**
>
>Sử dụng kĩ thuật này sẽ xem được giá trị cuối cùng của mỗi khung hình. Bạn có thể xem một ví dụ về cách tối ưu hóa này hoạt động trên [`MDN`](https://developer.mozilla.org/en-US/docs/Web/Events/scroll)

```jsx
import rafSchedule from 'raf-schd';

class ScrollListener extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);

    // Create a new function to schedule updates.
    this.scheduleUpdate = rafSchedule(
      point => this.props.onScroll(point)
    );
  }

  handleScroll(e) {
    // When we receive a scroll event, schedule an update.
    // If we receive many updates within a frame, we'll only publish the latest value.
    this.scheduleUpdate({ x: e.clientX, y: e.clientY });
  }

  componentWillUnmount() {
    // Cancel any pending updates since we're unmounting.
    this.scheduleUpdate.cancel();
  }

  render() {
    return (
      <div
        style={{ overflow: 'scroll' }}
        onScroll={this.handleScroll}
      >
        <img src="/my-huge-image.jpg" />
      </div>
    );
  }
}
```

#### Kiểm tra tỉ lệ giới hạn {#testing-your-rate-limiting}

Khi kiểm tra code của bạn hoạt động có đang chính xác, thật hữu ích để có khả năng chuyển nhanh thời gian. Nếu bạn đang sử dụng [`jest`](https://facebook.github.io/jest/) thì bạn có thể sử dụng [`mock timers`](https://facebook.github.io/jest/docs/en/timer-mocks.html) để chuyển nhanh thời gian. Nếu bạn đang sử dụng `requestAnimationFrame` thì bạn có thể thấy [`raf-stub`](https://github.com/alexreardon/raf-stub) là một công cụ hữu ích để kiểm soát việc đánh dấu các khung hình động.