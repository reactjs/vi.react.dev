---
id: portals
title: Portals
permalink: docs/portals.html
---

Portals cung cấp một cách hạng nhất để kết xuất phần tử con thành một nút DOM tồn tại bên ngoài phân cấp DOM của thành phần cha.

```js
ReactDOM.createPortal(child, container)
```

Đối số đầu tiên (`child`) là bất kỳ [phần tử con nào của React có thể kết xuất được](/docs/react-component.html#render), chẳng hạn như một phần tử, chuỗi, hoặc đoạn. Đối số thứ hai (`container`) là một phần tử DOM.

## Sử dụng {#usage}

Thông thường, khi bạn trả về một phần tử từ phương thức kết xuất của một thành phần, nó sẽ được gắn vào DOM dưới dạng phần tử con của nút cha gần nhất:

```js{4,6}
render() {
  // React mounts a new div and renders the children into it
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

Tuy nhiên, đôi khi sẽ hữu ích nếu chèn trẻ vào một vị trí khác trong DOM:

```js{6}
render() {
  // React does *not* create a new div. It renders the children into `domNode`.
  // `domNode` is any valid DOM node, regardless of its location in the DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

Một trường hợp điển hình sử dụng cho các portals là khi một thành phần cha có kiểu `overflow: hidden` or `z-index`, nhưng bạn cần thành phần con “thoát ra” khỏi vùng chứa của nó một cách trực quan. Ví dụ: hộp thoại, thẻ di chuột và chú giải công cụ.

> Chú ý:
>
> Khi làm việc với các portals, hãy nhớ rằng việc [quản lý tiêu điểm bàn phím](/docs/accessibility.html#programmatically-managing-focus) trở nên rất quan trọng.
>
> Đối với modal dialogs, hãy đảm bảo rằng mọi người đều có thể tương tác với chúng bằng cách tuân theo [WAI-ARIA Modal Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal).

[**Try it on CodePen**](https://codepen.io/gaearon/pen/yzMaBd)

## Sự Kiện Bong Bóng qua Portals {#event-bubbling-through-portals}

Mặc dù một portal có thể ở bất kỳ đâu trong DOM tree, nhưng theo mọi cách khác, nó hoạt động giống như một React con bình thường. Các tính năng như ngữ cảnh hoạt động giống hệt nhau bất kể thành phần con có phải là portal hay không, vì portal vẫn tồn tại trong *React tree* bất kể vị trí trong *DOM tree*.

Điều này bao gồm sự kiện bong bóng. Một sự kiện được kích hoạt từ bên trong portal sẽ truyền đến ancestors trong *React tree* có chứa, ngay cả khi những phần tử đó không phải là ancestors trong *DOM tree*. Giả sử cấu trúc HTML sau:

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

Một thành phần `Parent` trong `#app-root` sẽ có thể bắt được một sự kiện bong bóng chưa được giải quyết từ nút anh chị em `#modal-root`.

```js{28-31,42-49,53,61-63,70-71,74}
// These two containers are siblings in the DOM
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This will fire when the button in Child is clicked,
    // updating Parent's state, even though button
    // is not direct descendant in the DOM.
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools
          to observe that the button
          is not a child of the div
          with the onClick handler.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // The click event on this button will bubble up to parent,
  // because there is no 'onClick' attribute defined
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/jGBWpE)

Việc nắm bắt một sự kiện xảy ra từ một portal trong thành phần cha cho phép phát triển các tính năng trừu tượng linh hoạt hơn vốn không phụ thuộc vào các portal. Ví dụ: nếu bạn hiển thị một thành phần `<Modal />`, thành phần gốc có thể nắm bắt các sự kiện của nó bất kể nó có được triển khai bằng portal hay không.
