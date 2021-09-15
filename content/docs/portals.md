---
id: portals
title: Portals
permalink: docs/portals.html
---

Portals cung cấp một cách render các phần tử DOM bên ngoài phân cấp của DOM chính.

```js
ReactDOM.createPortal(child, container)
```

Tham số đầu tiên (`child`) là bất bỳ [thành phần có thể render của React](/docs/react-component.html#render), như là element, string, hoặc fragment. Tham số thứ hai (`container`) là một DOM element.

## Cách dùng {#usage}

Thông thường, khi bạn trả về một phần tử từ phương thức render của một component, nó sẽ được gắn vào DOM dưới dạng phần tử con của nút cha gần nhất:

```js{4,6}
render() {
  // React tạo một thẻ div mới và render các phần tử con vào trong thẻ div đó:
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

Tuy nhiên, đôi khi sẽ thuận tiện hơn nếu chèn phần tử con đó vào một vị trí khác trong DOM:

```js{6}
render() {
  // React *không* tạo mới thẻ div. Nó render phần tử con vào `domNode`.
  // `domNode` là bất kỳ phần tử DOM hợp lệ nào, ở bất kỳ vị trí nào trong DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

Một trường hợp thuờng dùng Portals là khi một thành phần mẹ có thuộc tính `overflow: hidden` hoặc `z-index`, nhưng bạn muốn hiển thị nó một cách "độc lập" khỏi thành phần mẹ. Ví dụ, các hộp thoại (dialogs), hovercards, và tooltips.

> Lưu ý:
>
> Khi làm việc với Portals, hãy nhớ [quản lý các sự kiện focus từ bàn phím](/docs/accessibility.html#programmatically-managing-focus) là rất quan trọng.
>
> Đối với hộp thoại, hãy đảm bảo rằng mọi người có thể tương tác với chúng bằng cách làm theo [WAI-ARIA Modal Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal).

[**Try it on CodePen**](https://codepen.io/gaearon/pen/yzMaBd)

## Xử lý sự kiện ở Portals {#event-bubbling-through-portals}

Mặc dù Portals có thể ở bất kỳ đâu trong cây DOM, nhưng theo mọi cách khác, nó hoạt động giống như một React component bình thường. Các tính năng như context hoạt động giống hệt nhau bất kể component đó có phải là Portals hay không, vì Portals vẫn tồn tại trong *React tree* bất kể vị trí nào trong *DOM tree*.

Bao gồm các event bubbling. Một sự kiện được kích hoạt từ bên trong Portals sẽ truyền đến tất node cha trong *React tree* chứa portals đó, ngay cả khi những phần tử đó không phải là node cha trong *DOM tree*. Giả sử với cấu trúc HTML sau:

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

Một thành phần `Parent` trong `#app-root` sẽ có thể bắt được một bubbling event chưa được bắt từ sibling node `#modal-root`.

```js{28-31,42-49,53,61-63,70-71,74}
// Đây là 2 container cùng cấp trong DOM
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // Phần tử Portals được chèn vào cây DOM sau khi
    // phần tử con của Modal được hiển thị, có nghĩa là những phần tử con đó
    // sẽ được gắn trên một phần tử DOM tách rời độc lập. Nếu một phần tử con
    // yêu cầu được gắn vào DOM tree ngay tức khắc khi 'mounted',
    // ví dụ để đo lường thuộc tính DOM, hoặc sử dụng 'autoFocus' 
    // trong các phần tử con, thêm state vào Modal và
    // chỉ render các phẩn tử con khi Modal
    // được chèn vào DOM tree.
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
    // Hàm này sẽ kích hoạt khi button tại Child được click,
    // cập nhật Parent's state, mặc dù button
    // không phải là phần tử con trực tiếp trong DOM.
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Số lượng clicks: {this.state.clicks}</p>
        <p>
          Mở DevTools của trình duyệt
          để quan sát rằng button
          không phải con của div
          xử lý sự kiện onClick.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // Sự kiện nhấp chuột vào nút này sẽ xuất hiện đối với phần tử cha chứa nó
  // bởi vì không có thuộc tính 'onClick' được định nghĩa
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/jGBWpE)

Việc nắm bắt một sự kiện xảy ra từ một Portals trong một component cha cho phép phát triển các tính năng trừu tượng linh hoạt hơn vốn không phụ thuộc vào các Portals. Ví dụ, nếu bạn render một phần tử `<Modal />` , thành phần cha có thể nhận được các sự kiện của nó dù cho nó có được triển khai bằng portals hay không.
