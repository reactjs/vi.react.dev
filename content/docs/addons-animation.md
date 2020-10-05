---
id: animation
title: Animation Add-Ons
permalink: docs/animation.html
layout: docs
category: Add-Ons
redirect_from:
  - "docs/animation-ja-JP.html"
  - "docs/animation-ko-KR.html"
  - "docs/animation-zh-CN.html"
---

> Chú ý:
>
> `ReactTransitionGroup` và `ReactCSSTransitionGroup` đã được di chuyển tới [`react-transition-group`](https://github.com/reactjs/react-transition-group/tree/v1-stable) package và được bảo trì bởi cộng đồng. Nhánh 1.x của nó gồm các API tương thích với các addons đang có. Hãy thông báo bugs và tạo các feature requests cho [repository mới](https://github.com/reactjs/react-transition-group/tree/v1-stable).

[`ReactTransitionGroup`](#low-level-api-reacttransitiongroup) add-on component là API cấp thấp (low-level) cho animation (hiệu ứng), [`ReactCSSTransitionGroup`](#high-level-api-reactcsstransitiongroup) là một add-on component giúp triển khai CSS animations và transitions một cách dễ dàng.

## API cấp cao (high-level): ReactCSSTransitionGroup {#high-level-api-reactcsstransitiongroup}

`ReactCSSTransitionGroup` là một API cấp cao dựa trên [`ReactTransitionGroup`](#low-level-api-reacttransitiongroup), khá dễ dàng để thực hiện các CSS transitions và animations khi một React component được thêm vào hoặc bị loại bỏ khỏi DOM. Điều này được lấy cảm hứng từ một thư viện tuyệt vời là [ng-animate](https://docs.angularjs.org/api/ngAnimate).

**Tiến hành triển khai**

```javascript
import ReactCSSTransitionGroup from 'react-transition-group'; // ES6
var ReactCSSTransitionGroup = require('react-transition-group'); // ES5 with npm
```

```javascript{31-36}
class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {items: ['hello', 'world', 'click', 'me']};
    this.handleAdd = this.handleAdd.bind(this);
  }

  handleAdd() {
    const newItems = this.state.items.concat([
      prompt('Enter some text')
    ]);
    this.setState({items: newItems});
  }

  handleRemove(i) {
    let newItems = this.state.items.slice();
    newItems.splice(i, 1);
    this.setState({items: newItems});
  }

  render() {
    const items = this.state.items.map((item, i) => (
      <div key={i} onClick={() => this.handleRemove(i)}>
        {item}
      </div>
    ));

    return (
      <div>
        <button onClick={this.handleAdd}>Add Item</button>
        <ReactCSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {items}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
```

> Chú ý:
>
> Bạn phải cung cấp [thuộc tính `key`](/docs/lists-and-keys.html#keys) cho tất cả các phần tử con của `ReactCSSTransitionGroup`, kể cả khi chỉ render một phần tử đơn duy nhất. Đây là cách React sẽ chỉ ra rằng phần tử con nào ở trung tâm, bên trái hoặc giữ nguyên vị trí hiện tại.

Trong component này, khi một item mới được thêm vào `ReactCSSTransitionGroup` nó sẽ lấy về được `example-enter` CSS class và `example-enter-active` CSS class được thêm ở ngay sau. Đây là quy tắc dựa trên `transitionName` prop.

Bạn có thể sử dụng các classes này để kích hoạt CSS animation hoặc transition. Ví dụ, thử thêm đoạn code CSS này và thêm một danh sách các phần tử mới:

```css
.example-enter {
  opacity: 0.01;
}

.example-enter.example-enter-active {
  opacity: 1;
  transition: opacity 500ms ease-in;
}

.example-leave {
  opacity: 1;
}

.example-leave.example-leave-active {
  opacity: 0.01;
  transition: opacity 300ms ease-in;
}
```

Bạn sẽ nhận ra rằng khoảng thời gian animation chạy cần phải chỉ định ở cả CSS và phương thức render; nó sẽ thông báo cho React khi nào loại bỏ animation classes của element và -- Nếu nó đang rời đi -- khi loại bỏ element khỏi DOM.

### Animate Initial Mounting {#animate-initial-mounting}

`ReactCSSTransitionGroup` cung cấp tuỳ chọn prop là `transitionAppear`, để thêm một pha transition khác ở thời điểm component được initial mount. Không hề có pha transition ở thời điểm initial mount với giá trị mặc định của `transitionAppear` là `false`. Sau đây là một ví dụ mà sẽ truyền prop  `transitionAppear` với giá trị là `true`.

```javascript{5-6}
render() {
  return (
    <ReactCSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnter={false}
      transitionLeave={false}>
      <h1>Fading at Initial Mount</h1>
    </ReactCSSTransitionGroup>
  );
}
```

Trong quá trình initial mount `ReactCSSTransitionGroup` sẽ lấy `example-appear` CSS class và `example-appear-active` CSS class được thêm ngay sau.

```css
.example-appear {
  opacity: 0.01;
}

.example-appear.example-appear-active {
  opacity: 1;
  transition: opacity .5s ease-in;
}
```

Ở thời điểm initial mount, mọi phần tử con của `ReactCSSTransitionGroup` sẽ  `appear` nhưng không `enter`. Dù vậy, mọi phần tử con sau này được thêm vào `ReactCSSTransitionGroup` đang tồn tại sẽ là `enter` chứ không phải là `appear`.

> Chú ý:
>
> prop `transitionAppear` đã được thêm vào `ReactCSSTransitionGroup` ở phiên bản `0.13`. Để đảm bảo tính tương thích ngược, giá trị mặc định sẽ được thiết lập là `false`.
>
> Tuy nhiên, các giá trị mặc định của `transitionEnter` và `transitionLeave` đều là `true` nên mặc định bạn phải chỉ ra `transitionEnterTimeout` và `transitionLeaveTimeout`. Nếu bạn không cần việc bắt đầu cũng như kết thúc các animations, truyền `transitionEnter={false}` hoặc `transitionLeave={false}`.

### Custom Classes {#custom-classes}

Hoàn toàn có thể sử dụng các custom class names cho mỗi một bước trong transitions của bạn. Thay vì truyền một xâu vào transitionName bạn có thể truyền một object bao gồm hoặc là `enter` và `leave` class names, hoặc là một object bao gồm `enter`, `enter-active`, `leave-active`, và `leave` class names. Nếu chỉ đưa vào và bỏ đi các classes được cung cấp, enter-active và leave-active classes sẽ được chỉ ra bằng cách thêm hậu tố '-active' vào tên của class. Đây là hai ví dụ sử dụng custom classes:

```javascript
// ...
<ReactCSSTransitionGroup
  transitionName={ {
    enter: 'enter',
    enterActive: 'enterActive',
    leave: 'leave',
    leaveActive: 'leaveActive',
    appear: 'appear',
    appearActive: 'appearActive'
  } }>
  {item}
</ReactCSSTransitionGroup>

<ReactCSSTransitionGroup
  transitionName={ {
    enter: 'enter',
    leave: 'leave',
    appear: 'appear'
  } }>
  {item2}
</ReactCSSTransitionGroup>
// ...
```

### Animation Group phải được mounted để hoạt động {#animation-group-must-be-mounted-to-work}

Để có thể áp dụng transitions cho các phần tử con của nó, `ReactCSSTransitionGroup` phải được mounted trong DOM hoặc prop `transitionAppear` phải được thiết lập giá trị `true`.

Ví dụ bên dưới sẽ **không** hoạt động, vì `ReactCSSTransitionGroup` đang được mounted với item mới, thay vì item mới đang được mounted bên trong nó. So sánh với phần [khởi động](#getting-started) phía trên để thấy sự khác biệt.

```javascript{4,6,13}
render() {
  const items = this.state.items.map((item, i) => (
    <div key={item} onClick={() => this.handleRemove(i)}>
      <ReactCSSTransitionGroup transitionName="example">
        {item}
      </ReactCSSTransitionGroup>
    </div>
  ));

  return (
    <div>
      <button onClick={this.handleAdd}>Add Item</button>
      {items}
    </div>
  );
}
```

### Animating Một hoặc Không items nào {#animating-one-or-zero-items}

Trong ví dụ phía trên, chúng ta đã rendered ra 1 danh sách các items vào bên trong `ReactCSSTransitionGroup`. Tuy nhiên, phần tử con của `ReactCSSTransitionGroup` cũng có thể là một hoặc không có phần tử nào. Điều này khiến cho nó hoàn toàn có thể animate một element đơn đi vào hoặc rời đi. Tương tự, bạn có thể animate một element mới thay thế cho element hiện tại. Ví dụ, chúng ta có thể triển khai một image carousel đơn giản như sau:

```javascript{10}
import ReactCSSTransitionGroup from 'react-transition-group';

function ImageCarousel(props) {
  return (
    <div>
      <ReactCSSTransitionGroup
        transitionName="carousel"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        <img src={props.imageSrc} key={props.imageSrc} />
      </ReactCSSTransitionGroup>
    </div>
  );
}
```

### Tắt các Animations {#disabling-animations}

Bạn có thể tắt (vô hiệu hoá) các hiệu ứng `enter` hoặc `leave` nếu bạn muốn. Ví dụ, đôi khi có thể bạn muốn chỉ có `enter` animation mà không có `leave` animation, nhưng `ReactCSSTransitionGroup` đợi một animation kết thúc hoàn toàn trước khi loại bỏ DOM node của bạn. Bạn có thể thêm `transitionEnter={false}` hoặc `transitionLeave={false}` props cho `ReactCSSTransitionGroup` để vô hiệu hoá các animations đó.

> Chú ý:
>
> Khi sử dụng `ReactCSSTransitionGroup`, không có cách nào để cho các components của bạn được thông báo rằng khi nào hết hoặc thực thi nhiều hơn các logic phức tạp xung quanh animation. Nếu bạn muốn nhiều hơn các fine-grained control, bạn có thể sử dụng các API cấp thấp của `ReactTransitionGroup`, chúng sẽ cung cấp các hooks mà bạn cần để thực hiện custom transitions.

* * *

## API cấp thấp: ReactTransitionGroup {#low-level-api-reacttransitiongroup}

**Importing**

```javascript
import ReactTransitionGroup from 'react-addons-transition-group' // ES6
var ReactTransitionGroup = require('react-addons-transition-group') // ES5 với npm
```

`ReactTransitionGroup` là nền tảng cho animations. Khi các phần tử con được thêm hoặc bị loại bỏ khỏi nó (như ở [ví dụ trên](#getting-started)), các phương thức vòng đời (lifecycle) sẽ được gọi trên chúng.

 - [`componentWillAppear()`](#componentwillappear)
 - [`componentDidAppear()`](#componentdidappear)
 - [`componentWillEnter()`](#componentwillenter)
 - [`componentDidEnter()`](#componentdidenter)
 - [`componentWillLeave()`](#componentwillleave)
 - [`componentDidLeave()`](#componentdidleave)

#### Rendering một Component khác {#rendering-a-different-component}

`ReactTransitionGroup` mặc định renders như một phần tử `span`. Bạn có thể thay đổi đặc điểm này bằng cách truyền một `component` prop. Ví dụ, đây là cách bạn sẽ render một phần tử `<ul>`:

```javascript{1}
<ReactTransitionGroup component="ul">
  {/* ... */}
</ReactTransitionGroup>
```

Bất kì các thuộc tính bổ sung hay các thuộc tính user-defined (định nghĩa bởi developer) sẽ trở thành thuộc tính của component đã rendered. Ví dụ, đây là cách mà bạn render một phần tử `<ul>` với CSS class:

```javascript{1}
<ReactTransitionGroup component="ul" className="animated-list">
  {/* ... */}
</ReactTransitionGroup>
```

Mọi DOM component mà React có thể render đều sẵn sàng để sử dụng. Tuy nhiên, `component` không nhất thiết phải là một DOM component. Nó có thể là bất kì React component nào mà bạn muốn; kể cả những components do bạn tự viết! Chỉ cần viết `component={List}` và component của bạn sẽ nhận được `this.props.children`.

#### Rendering một phần tử con duy nhất {#rendering-a-single-child}

Chúng ta thường sử dụng `ReactTransitionGroup` để mounting cũng như unmounting các hiệu ứng của một phần tử con đơn như là panel có thể đóng mở (collapsible). Thông thường `ReactTransitionGroup` bao lấy toàn bộ con của nó trong một phần tử `span` (hoặc là một custom `component` như đã mô tả phía trên). Điều này là bởi vì bất kì React component nào cũng phải trả về 1 root element duy nhất, và `ReactTransitionGroup` cũng phải là một ngoại lệ của quy tắc này.

Tuy nhiên nếu bạn chỉ render một phần tử con duy nhất bên trong `ReactTransitionGroup`, bạn có thể hoàn toàn tránh được việc bao nó trong một phần tử `<span>` hoặc bất kì DOM component nào khác. Để làm điều này, tạo một custom component mà nó sẽ renders ra phần từ con đầu tiên được truyền vào nó một cách trực tiếp:

```javascript
function FirstChild(props) {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
}
```

Bây giờ bạn có thể chỉ định `FirstChild` như là `component` prop trong `<ReactTransitionGroup>` props và tránh bất kì wrappers nào trong kết quả DOM thu được:

```javascript
<ReactTransitionGroup component={FirstChild}>
  {someCondition ? <MyComponent /> : null}
</ReactTransitionGroup>
```

Đoạn code này chỉ hoạt động khi bạn tạo hiệu ứng xuất hiện và biến mất của một phần tử con duy nhất, như là panel có khả năng đóng-mở. Cách tiếp cận này sẽ không hoạt động khi tạo hiệu ứng cho nhiều phần tử con hoặc thay thế một phần tử con bởi một phần tử con khác, ví dụ như là image carousel. Với một image carousel, trong khi hình ảnh hiện tại đang được animating out, thì hình ảnh khác sẽ animate in, nên `<ReactTransitionGroup>` cần đem đến cho chúng một phần tử DOM chung. Bạn không thể tránh được wrapper cho nhiều phần tử con, nhưng bạn có thể customize wrapper đó với `component` prop như đã mô tả ở trên.

* * *

## Tham khảo {#reference}

### `componentWillAppear()` {#componentwillappear}

```javascript
componentWillAppear(callback)
```

Phương thức này được gọi ở cùng thời điểm với phương thức `componentDidMount()` cho components mới được mounted trong một `TransitionGroup`. Nó sẽ chặn các animations khác từ lúc diễn ra cho đến khi `callback` được gọi. Nó chỉ được gọi trong lần render đầu tiên của `TransitionGroup`.

* * *

### `componentDidAppear()` {#componentdidappear}

```javascript
componentDidAppear()
```

Phương thức này được gọi sau khi hàm `callback` được truyền cho phương thức `componentWillAppear` được gọi.

* * *

### `componentWillEnter()` {#componentwillenter}

```javascript
componentWillEnter(callback)
```

Phương thức này được gọi cùng thời điểm với phương thức `componentDidMount()` khi các components được thêm vào một `TransitionGroup` đang tồn tại. Nó sẽ chặn các animations khác từ khi chạy cho đến khi hàm `callback` được gọi. Nó sẽ không được gọi trong lần render đầu tiên của `TransitionGroup`.

* * *

### `componentDidEnter()` {#componentdidenter}

```javascript
componentDidEnter()
```

Phương thức này được gọi sau khi hàm `callback` truyền vào phương thức [`componentWillEnter()`](#componentwillenter) được gọi.

* * *

### `componentWillLeave()` {#componentwillleave}

```javascript
componentWillLeave(callback)
```

Phương thức này được gọi khi phần tử con bị loại bỏ khỏi `ReactTransitionGroup`. Tuy nhiên khi phần tử con bị loại bỏ, `ReactTransitionGroup` sẽ giữ nó trong DOM cho đến khi hàm `callback` được gọi.

* * *

### `componentDidLeave()` {#componentdidleave}

```javascript
componentDidLeave()
```

Phương thức này được gọi khi `willLeave` `callback` được gọi (cùng thời điểm với `componentWillUnmount()`).
