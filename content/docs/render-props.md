---
id: render-props
title: Render Props
permalink: docs/render-props.html
---

Thuật ngữ ["render prop"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) nói về một kĩ thuật chia sẻ code giữa các React components bằng cách dùng một đối tượng (prop) có giá trị là một hàm (function).

Một component có một render prop sẽ lấy một hàm trả về một phần tử React (React element) và gọi hàm đó thay vì phải thực hiện render với logic riêng biệt.

```jsx
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

Những thư viện sử dụng render props gồm có [React Router](https://reacttraining.com/react-router/web/api/Route/render-func), [Downshift](https://github.com/paypal/downshift) và [Formik](https://github.com/jaredpalmer/formik).

Ở phần này, chúng ta sẽ bàn luận vì sao render props có thể trở nên hữu ích, và cách để tự viết render props.

## Sử Dụng Render Props Cho Cross-Cutting Concerns {#use-render-props-for-cross-cutting-concerns}

Components là những đơn vị cơ bản để tái sử dụng trong React, nhưng có một sự mơ hồ trong cách chia sẻ kho dữ liệu (state) hay hành vi (behavior) mà một component đóng gói tới các components khác cũng cần kho dữ liệu đó.

Ví dụ, component sau đây sẽ theo dõi vị trí con chuột trong một web app:

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

Khi con trỏ di chuyển xung quanh màn hình, component này sẽ hiển thị tọa độ (x, y) của con trỏ trong tag `<p>`.

Câu hỏi phải đặt ra là: Làm sao để chúng biết tái sử dụng hành vi này ở một component khác? Nói cách khác, nếu một component nào đó cũng cần biết vị trí của con trỏ chuột, liệu chúng ta có thể đóng gói (encapsulate) hành vi trên để dễ dàng chia sẻ nó với component này?

Vì components là đơn vị cơ bản để tái sử dụng trong React, hãy thử thay đổi (refactor) code một chút để có thể dùng một component `<Mouse>` đóng gói được hành vi chúng ta cần tái sử dụng ở nơi khác.

```js
// The <Mouse> component encapsulates the behavior we need...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/* ...but how do we render something other than a <p>? */}
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <>
        <h1>Move the mouse around!</h1>
        <Mouse />
      </>
    );
  }
}
```

Bây giờ `<Mouse>` đã đóng gói được toàn bộ hành vi lắng nghe các sự kiện `mousemove` và chứa tọa độ (x, y) của con trỏ, nhưng component này vẫn chưa thực sự có thể tái sử dụng.

Ví dụ, giả sử chúng ta có một component `<Cat>` sẽ render hình ảnh một con mèo đang đuổi chuột quanh màn hình. Chúng ta có thể sẽ sử dụng `<Cat mouse={{ x, y }}>` để cho component này biết được tọa độ của con trỏ chuột và từ đó thay đổi vị trí hình ảnh trên màn hình.

Lúc đầu, bạn có thể sẽ thử render `<Cat>` *bên trong phương thức `render` của `<Mouse>`* như thế này:

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          We could just swap out the <p> for a <Cat> here ... but then
          we would need to create a separate <MouseWithSomethingElse>
          component every time we need to use it, so <MouseWithCat>
          isn't really reusable yet.
        */}
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

Phương pháp này có thể đúng cho trường hợp cụ thể này, nhưng chúng ta vẫn chưa đạt được mục tiêu là hoàn toàn đóng gói hành vi trên để dễ dàng tái sử dụng. Bởi vì hiện tại, mỗi khi chúng ta muốn sử dụng vị trí con trỏ chuột cho một trường hợp nào đó, chúng ta phải tạo một component mới (như là một `<MouseWithCat>` khác) mà sẽ render riêng biệt cho trường hợp đó.

Đây là lúc render prop xuất hiện: Thay vì phải code cứng một `<Cat>` bên trong một component `<Mouse>`, và phải thay đổi đầu ra của nó khi render, chúng ta có thể truyền cho `<Mouse>` một function prop (prop là một hàm) để nó có thể quyết định cái gì cần render một cách linh hoạt-render prop chính là nó.
```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          Instead of providing a static representation of what <Mouse> renders,
          use the `render` prop to dynamically determine what to render.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Lúc này, thay vì phải clone lại component `<Mouse>` và code cứng phương thức `render` của nó để giải quyết một trường hợp cụ thể, chúng ta cung cấp một `render` prop mà `<Mouse>` có thể sử dụng để render một cách linh hoạt.

Chính xác hơn thì, **một render prop là một function prop được component sử dụng để biết cái gì cần render.**

Kĩ thuật này giúp chúng ta chia sẻ hành vi cần thiết rất dễ dàng. Để lấy được hành vi lúc nãy, ta chỉ phải render `<Mouse>` với một `render` prop cho biết cần phải render gì với (x, y) hiện tại của con trỏ.

Một lưu ý thú vị về render props chính là bạn có thể thực hiện hầu hết [higher-order components](/docs/higher-order-components.html) (HOC) bằng cách dùng một component bình thường cùng với một render prop. Ví dụ, nếu bạn thích việc có HOC `withMouse` hơn là một component `<Mouse>`, bạn có thể dễ dàng tạo một `<Mouse>` bình thường cùng với một render prop:

```js
// If you really want a HOC for some reason, you can easily
// create one using a regular component with a render prop!
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```

Vậy nên render prop giúp ta có thể sử dụng giải pháp (pattern) nào trong 2 cái cũng được.

## Sử Dụng Props Ngoài `render` {#using-props-other-than-render}

Điều quan trọng cần phải nhớ là, chỉ vì giải pháp này được gọi là "render props", bạn không *nhất thiết phải dùng một prop có tên là `render` mới dùng được giải pháp này*. Thực chất, [*bất kì* prop nào là một hàm mà component sử dụng để biết cái cần để render đều được gọi là một "render prop"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

Mặc dù các ví dụ trên sử dụng `render`, chúng ta có thể gọi prop đó là `children`!

```js
<Mouse children={mouse => (
  <p>The mouse position is {mouse.x}, {mouse.y}</p>
)}/>
```

Và nhớ là, prop `children` này không cần phải được đặt tên trong các "thuộc tính" (attributes) của một phần tử JSX (JSX element). Thay vào đó, bạn có thể đặt nó vào trực tiếp *bên trong* phần tử đó!

```js
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

Bạn sẽ thấy kĩ thuật này được dùng trong API [react-motion](https://github.com/chenglou/react-motion) API.

Vì kĩ thuật này khá là lạ, bạn có lẽ sẽ muốn nói rõ `children` là một hàm trong `propTypes` của bạn khi thiết kế một API như vậy.

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## Caveats {#caveats}

### Cẩn thận khi sử dụng Render Props với React.PureComponent{#be-careful-when-using-render-props-with-reactpurecomponent}

Sử dụng một render prop có thể phủ nhận lợi thế từ việc sử dụng [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) nếu bạn tạo một hàm bên trong phương thức `render`. Lý do là vì so sánh nông (shallow comparison) prop sẽ luôn trả về `false` cho props mới, và mỗi `render` trong trường hợp này sẽ tạo một giá trị mới cho render prop.

Ví dụ, tiếp tục với component `<Mouse>`, nếu `Mouse` mở rộng với `React.PureComponent` thay vì với `React.Component`, chúng ta sẽ có như thế này:

```js
class Mouse extends React.PureComponent {
  // Same implementation as above...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>

        {/*
          This is bad! The value of the `render` prop will
          be different on each render.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Ở ví dụ trên, mỗi lần `<MouseTracker>` render, nó tạo một hàm mới đồng thời là giá trị của prop `<Mouse render>`, từ đó đã phủ nhận công dụng của việc mở rộng `<Mouse>` với `React.PureComponent`!

Để xử lý được rắc rối này, bạn có thể gọi prop thành một instance method (phương thức thể hiện) như sau:

```js
class MouseTracker extends React.Component {
  // Defined as an instance method, `this.renderTheCat` always
  // refers to *same* function when we use it in render
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

Trong những trường hợp bạn không thể gọi prop đó theo cách tĩnh (có thể là vì bạn cần bọc props và/hoặc kho dữ liệu (state) của component đó), bạn nên mở rộng `<Mouse>` với `React.Component`.
