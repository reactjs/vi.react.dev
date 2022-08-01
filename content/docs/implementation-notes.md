---
id: implementation-notes
title: Implementation Notes
layout: contributing
permalink: docs/implementation-notes.html
prev: codebase-overview.html
next: design-principles.html
redirect_from:
  - "contributing/implementation-notes.html"
---

Bài viết này bao gồm các ghi chú về việc thực thi [stack reconciler](/docs/codebase-overview.html#stack-reconciler).

Bài viết đòi hỏi kiến thức chuyên môn cao và sự thông hiểu tốt về các public API của React cũng như cách nó được phân ra các phần cốt lõi (core), các phần render (renderer) và phần điều phối, cập nhật component (reconciler). Nếu bạn chưa nắm rõ về codebase của React, trước tiên hãy đọc [tổng quan codebase](/docs/codebase-overview.html).

Bạn cũng cần hiểu về [sự khác biệt giữa React components, các instance và phần tử (element) của chúng](/blog/2015/12/18/react-components-elements-and-instances.html) trước khi bước vào bài viết này.

Stack reconciler đã được sử dụng trong React 15 và các phiên bản trước đó. Hiện thực của nó nằm ở [src/renderers/shared/stack/reconciler](https://github.com/facebook/react/tree/15-stable/src/renderers/shared/stack/reconciler).

### Video: Xây dựng React từ con số không {#video-building-react-from-scratch}

[Paul O'Shannessy](https://twitter.com/zpao) đã có một bài nói về việc [xây dựng React từ con số không](https://www.youtube.com/watch?v=_MAD4Oly9yg). Bài nói đó đã giúp ích rất nhiều cho bài viết này.

Cả bài nói và bài viết là cách trình bày đơn giản hóa cho codebase thật sự của React, nên bạn có thể hiểu rõ hơn về codebase nếu đi qua cả hai.

### Tổng quan {#overview}

Bản thân reconciler không có API mở (public API). [Các phần render](/docs/codebase-overview.html#renderers) như React DOM và React Native sử dụng nó để cập nhật giao diện người dùng một cách hiệu quả theo những component mà người dùng viết.

### Quá trình mounting đệ quy {#mounting-as-a-recursive-process}

Hãy nhìn lại lần đầu tiên chúng ta mount một component:

```js
const root = ReactDOM.createRoot(rootEl);
root.render(<App />);
```

<<<<<<< HEAD
React DOM sẽ đưa `<App />` đến reconciler. Hãy nhớ rằng `<App />` là một phần tử của React, nghĩa là, nó miêu tả *cái gì* được render. Bạn có thể xem nó như là một object thuần:
=======
`root.render` will pass `<App />` along to the reconciler. Remember that `<App />` is a React element, that is, a description of *what* to render. You can think about it as a plain object:
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb

```js
console.log(<App />);
// { type: App, props: {} }
```

Reconciler sẽ kiểm tra xem `App` là một lớp hay một hàm.

Nếu `App` là một hàm, reconciler sẽ gọi đến `App(props)` để lấy ra những phần tử được render.

Nếu `App` là một lớp, reconciler sẽ tạo ra một thực thể mới từ `App` với `new App(props)`, gọi đến hàm lifecycle `componentWillMount()`, và rồi gọi đến hàm `render()` để lấy ra những phần tử được render.

Theo hướng nào đi nữa, reconciler đều sẽ xem `App` sẽ render ra những phần tử gì.

Quá trình này là đệ quy - được lặp đi lặp lại. `App` có thể render ra `<Greeting />`, `Greeting` render ra `<Button />`, và cứ thế tiếp tục. Theo cách này, reconciler sẽ "đào sâu" vào những component được viết bởi người dùng để xem những component đó render ra những gì.

Bạn có thể tưởng tượng rõ hơn về quá trình này thông qua đoạn mã giả bên dưới:

```js
function isClass(type) {
  // Các lớp con của React.Component thì có thuộc tính this.
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// Hàm này nhận vào một phần tử của React (ví dụ như <App />)
// và trả về một node DOM hoặc Native biểu diễn cây đã được mount.
function mount(element) {
  var type = element.type;
  var props = element.props;

  // Chúng ta sẽ xác định các phần tử được render ra
  // bằng cách dùng type làm hàm
  // hoặc tạo ra một thực thể từ lóp và gọi hàm render().
  var renderedElement;
  if (isClass(type)) {
    // Componenet kiểu lớp
    var publicInstance = new type(props);
    // Đặt giá trị cho props
    publicInstance.props = props;
    // Gọi hàm lifecycle nếu cần thiết
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    // Lấy ra những phần tử được render bằng cách gọi hàm render()
    renderedElement = publicInstance.render();
  } else {
    // Component kiểu hàm
    renderedElement = type(props);
  }

  // Quá trình này là đệ quy vì một component có thể trả về
  // một phần tử của một component khác.
  return mount(renderedElement);

  // Ghi chú: việc thực thi này là chưa hoàn chỉnh, và còn đệ quy đến vô cùng!
  // Nó chỉ kiểm soát các phần tử như <App /> hay <Button />.
  // Nó chưa handle các phần tử như <div /> hay <p />.
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

>**Ghi chú:**
>
>Đây *thực sự* chỉ là một đoạn mã giả. Nó không giống với cách viết thực tế. Nó còn gây ra tràn bộ nhớ (stack overflow) vì chúng ta chưa chỉ ra khi nào sẽ kết thúc việc lặp đệ quy.

Hãy chốt lại một vài ý quan trọng trong ví dụ ở trên:

* Các phần tử của React là các object thuần biểu diễn kiểu component (ví dụ như `App`) và các props.
* Những component do người dùng viết (như `App`) có thể là lớp hoặc hàm, nhưng điểm chung là chúng đều chỉ ra những gì sẽ được render.
* "Mounting" là một quá trình đệ quy, tạo ra một cây DOM hoặc Native khi được cho trước một phần tử cấp cao (như là `<App />`).

### Mounting phần tử của hệ thống {#mounting-host-elements}

Quá trình mounting sẽ trở nên vô nghĩa nếu chúng ta không render được kết quả lên màn hình.

Bên cạnh các component được viết bởi người dùng (còn được gọi là "composite"), React còn có các component của hệ thống (được gọi là "host"). Ví dụ, `Button` có thể trả về `<div />` từ hàm render của nó.

Nếu thuộc tính `type` của phần tử là một chuỗi, chúng ta đang có một phần tử của hệ thống:

```js
console.log(<div />);
// { type: 'div', props: {} }
```

Người dùng không được viết lại hay định nghĩa lại các phần tử hệ thống.

Khi reconciler gặp một phần tử hệ thống, nó để cho renderer xử lí việc mounting cho phần tử đó. Ví dụ, React DOM sẽ tạo ra một node DOM.

Nếu phần tử hệ thống có các phần tử con, reconciler sẽ mount chúng một cách đệ quy theo giải thuật ở trên, không quan trọng các phần tử con là phần tử hệ thống (như `<div><hr /></div>`) hay do người dùng viết (như `<div><Button /></div>`), hay là cả hai.

Các node DOM được tạo ra bởi các component con sẽ được thêm vào node DOM cha, và cứ lặp lại như vậy, cấu trúc DOM hoàn chỉnh sẽ được tạo ra.

>**Ghi chú:**
>
>Bản thân reconciler không gắn liền với DOM. Kết quả chính xác của việc mounting (đôi lúc được gọi là "mount image" trong mã nguồn) phụ thuộc vào renderer, và có thể là một node DOM (React DOM), một chuỗi (React DOM Server), hoặc là một số để biểu diễn cách nhìn (như React Native).

Nếu chúng ta phải mở rộng code để xử lý các phần tử hệ thống, kết quả sẽ như thế này:

```js
function isClass(type) {
  // Các lớp con của React.Component thì có thuộc tính this.
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// Hàm này chỉ xử lý các phần tử với kiểu composite (từ component do người dùng viết)
// Ví dụ, nó xử lý <App /> và <Button />, nhưng không xử lý <div />.
function mountComposite(element) {
  var type = element.type;
  var props = element.props;

  var renderedElement;
  if (isClass(type)) {
    // Component kiểu lớp
    var publicInstance = new type(props);
    // Đặt giá trị cho props
    publicInstance.props = props;
    // Gọi hàm lifecycle nếu cần thiết
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    renderedElement = publicInstance.render();
  } else if (typeof type === 'function') {
    // Component kiểu hàm
    renderedElement = type(props);
  }

  // Đây là quá trình đệ quy nhưng quá trình lặp sẽ dừng lại
  // khi gặp một phần tử kiểu host (ví dụ <div />) chứ không phải kiểu composite (e.g. <App />):
  return mount(renderedElement);
}

// Hàm này chỉ xử lý các phần tử kiểu host
// Ví dụ, nó xử lý <div /> và <p /> nhưng không xử lý <App />.
function mountHost(element) {
  var type = element.type;
  var props = element.props;
  var children = props.children || [];
  if (!Array.isArray(children)) {
    children = [children];
  }
  children = children.filter(Boolean);

  // Phần code này không nên nằm trong reconciler.
  // Các renderer khác nhau có thể khởi tạo các node khác nhau.
  // Ví dụ, React Native sẽ tạo theo góc nhìn iOS và Android.
  var node = document.createElement(type);
  Object.keys(props).forEach(propName => {
    if (propName !== 'children') {
      node.setAttribute(propName, props[propName]);
    }
  });

  // Mount phần tử con
  children.forEach(childElement => {
    // Kiểu của phần tử con có thể là host (như <div />) hoặc composite (như <Button />).
    // Chúng ta cũng sẽ mount các phần tử con này một cách đệ quy:
    var childNode = mount(childElement);

    // Kết quả của dòng code này cũng phụ thuộc vào renderer.
    // Kết quả khác nhau có thể được sinh ra từ các renderer khác nhau:
    node.appendChild(childNode);
  });

  // Trả về node DOM là kết quả của quá trình mounting.
  // Đây là điểm kết thúc của việc lặp đệ quy.
  return node;
}

function mount(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // Component được viết bởi người dùng
    return mountComposite(element);
  } else if (typeof type === 'string') {
    // Componenet của hệ thống
    return mountHost(element);
  }
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

Cách làm này vẫn dùng được nhưng còn xa so với cách reconciler thực sự được thực thi. Thiếu sót quan trọng ở đây là việc hỗ trợ cho các cập nhật và thay đổi.

### Giới thiệu các thực thể nội {#introducing-internal-instances}

Tính năng then chốt của React là bạn có thể render lại mọi thứ, và nó sẽ không tạo lại DOM hay đặt lại trạng thái (state):

```js
<<<<<<< HEAD
ReactDOM.render(<App />, rootEl);
// DOM có sẵn nên được sử dụng lại:
ReactDOM.render(<App />, rootEl);
=======
root.render(<App />);
// Should reuse the existing DOM:
root.render(<App />);
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb
```

Tuy nhiên, cách thực thi ở trên chỉ mount cây được tạo đầu tiên. Nó không thể thực hiện việc cập nhật trên cây đó vì nó không có những thông tin cần thiết, ví dụ như các `publicInstance`, hay `node` DOM nào tương ứng với component nào.

Codebase của stack reconciler giải quyết vấn đề này bằng cách biến hàm `mount` thành một phương thức và đưa nó vào trong lớp. Cách tiếp cận này có nhược điểm, và đi ngược lại so với hướng đi trong việc [viết lại reconciler](/docs/codebase-overview.html#fiber-reconciler). Tuy vậy hiện tại thì đây là cách thực thi.

Thay vì chia ra hai hàm `mountHost` và `mountComposite`, chúng ta sẽ tạo ra hai lớp: `DOMComponent` và `CompositeComponent`.

Cả hai lớp này có một hàm dựng (constructor) nhận phần tử (`element`) là tham số đầu vào, và một hàm `mount()` trả về node đã được mount. Chúng ta sẽ thay thế hàm cấp cao `mount()` bằng một hàm khác để khởi tạo một lớp phù hợp:

```js
function instantiateComponent(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // Component được viết bởi người dùng
    return new CompositeComponent(element);
  } else if (typeof type === 'string') {
    // Component hệ thống
    return new DOMComponent(element);
  }  
}
```

Đầu tiên, hãy xem cách hiện thực của `CompositeComponent`:

```js
class CompositeComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedComponent = null;
    this.publicInstance = null;
  }

  getPublicInstance() {
    // Đối với component được viết bởi người dùng, ta trả về thực thể (instance) của lớp.
    return this.publicInstance;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;

    var publicInstance;
    var renderedElement;
    if (isClass(type)) {
      // Component kiểu lớp
      publicInstance = new type(props);
      // Đặt giá trị cho props
      publicInstance.props = props;
      // Gọi hàm lifecycle nếu cần
      if (publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      renderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Component kiểu hàm
      publicInstance = null;
      renderedElement = type(props);
    }

    // Lưu lại publicInstance
    this.publicInstance = publicInstance;

    // Khởi tạo thực thể con bên trong tương ứng với element.
    // Đó có thể là một component hệ thống như <div /> hay <p />,
    // hoặc một component được viết bởi người dùng như <App /> hay <Button />:
    var renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent = renderedComponent;

    // Mount kết quả được render
    return renderedComponent.mount();
  }
}
```

Không khác nhiều so với cách hiện thực trước đó của hàm `mountComposite()`, nhưng cách này cho chúng ta có thể lưu trữ thông tin, ví dụ như `this.currentElement`, `this.renderedComponent`, và `this.publicInstance`, để sử dụng trong quá trình cập nhật.

Hãy nhớ rằng một thực thể tạo ra từ `CompositeComponent` không giống với một thực thể người dùng tạo ra có kiểu `element.type`. `CompositeComponent` là chi tiết về cách hiện thực của reconciler, và sẽ không bao giờ được đưa ra cho phía người dùng. Các lớp do người dùng định nghĩa có kiểu `element.type`, và `CompositeComponent` sẽ tạo ra một thực thể của nó

Để tránh sự rắc rối này, chúng ta gọi các thực thể từ `CompositeComponent` và `DOMComponent` là các "thực thể nội" (internal instances). Việc này cho phép chúng ta sử dụng những dữ liệu mang tính lâu dài ở trong các thành phần này. Chỉ có renderer và reconciler mới cần quan tâm đến sự hiện diện của các thực thể này.

Ngược lại, với các lớp do người dùng định nghĩa, các thực thể tạo ra từ đó sẽ được gọi là các "thực thể chung" (public instance). Thực thể chung là những gì chúng ta thấy ở thuộc tính `this` của `render()` và những phương thức khác của component của bạn viết.

Hàm `mountHost()`, được cấu trúc lại thành phương thức `mount()` trong `DOMComponent`, cũng được hiện thực tương tự:

```js
class DOMComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedChildren = [];
    this.node = null;
  }

  getPublicInstance() {
    // Đối với các component của DOM, ta chỉ trả về các node DOM.
    return this.node;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;
    var children = props.children || [];
    if (!Array.isArray(children)) {
      children = [children];
    }

    // Khởi tạo node mới và lưu lại
    var node = document.createElement(type);
    this.node = node;

    // Gán giá trị cho các thuộc tính
    Object.keys(props).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, props[propName]);
      }
    });

    // Khởi tạo và lưu lại những thành phần con được chứa bên trong.
    // Mỗi thành phần có thể là DOMComponent hoặc CompositeComponent,
    // phụ thuộc vào kiểu của element là chuỗi hay hàm.
    var renderedChildren = children.map(instantiateComponent);
    this.renderedChildren = renderedChildren;

    // Lưu lại những node DOM được trả về từ quá trình mounting
    var childNodes = renderedChildren.map(child => child.mount());
    childNodes.forEach(childNode => node.appendChild(childNode));

    // Trả về node DOM là kết quả của quá trình mounting
    return node;
  }
}
```

Khác biệt chính sau khi cấu trúc lại `mountHost()` là bây giờ chúng ta lưu các thuộc tính `this.node` và `this.renderedChildren` cùng với các thực thể nội của DOM component. Sau này, chúng ta sẽ sử dụng chúng để hiện thực việc cập nhật mà không cần phải xây dựng lại cây DOM từ đầu.

Kết quả là, mỗi thực thể nội, xuất phát từ người dùng hay hệ thống, bây giờ đều chỉ đến những thực thể con bên trong. Ví dụ để làm rõ hơn điều này, nếu một component kiểu hàm `<App>` render ra một component kiểu lớp `<Button>`, và lớp `Button` render ra một thẻ `<div>`, cây cấu trúc của thực thể nội sẽ trông như thế này:

```js
[object CompositeComponent] {
  currentElement: <App />,
  publicInstance: null,
  renderedComponent: [object CompositeComponent] {
    currentElement: <Button />,
    publicInstance: [object Button],
    renderedComponent: [object DOMComponent] {
      currentElement: <div />,
      node: [object HTMLDivElement],
      renderedChildren: []
    }
  }
}
```

Trong cấu trúc DOM bạn sẽ chỉ thấy `<div>`. Tuy nhiên cây cấu trúc của thực thể nội chứa các thực thể nội của người dùng lẫn hệ thống.

Những thực thể nội của người dùng cần lưu trữ:

* Phần tử hiện tại.
* Thực thể chung nếu thực thể có kiểu lớp.
* Một thực thể nội được render ra. Đó có thể là `DOMComponent` hoặc `CompositeComponent`.

Những thực thể nội của hệ thống cần lưu trữ:

* Phần tử hiện tại
* Node DOM
* Tất cả các thực thể con bên trong. Mỗi thực thể con có thể là `DOMComponent` hoặc `CompositeComponent`.

Nếu bạn gặp khó khăn trong việc hình dung một cây cấu trúc thực thể nội được tổ chức như thế nào ở các ứng dụng phức tạp hơn, [React DevTools](https://github.com/facebook/react-devtools) có thể cho bạn một cái nhìn rõ hơn, khi nó biểu diễn các thực thể hệ thống bằng màu xám, và các thực thể của người dùng bằng màu tím:

 <img src="../images/docs/implementation-notes-tree.png" width="500" style="max-width: 100%" alt="React DevTools tree" />

<<<<<<< HEAD
Để hoàn thành việc cấu trúc lại `mountHost()`, chúng tôi sẽ giới thiệu một hàm thực hiện việc mount một cây hoàn chỉnh và một node cha chứa nó, như hàm `ReactDOM.render()`. Cũng như `ReactDOM.render()`, nó trả về một thực thể chung:
=======
To complete this refactoring, we will introduce a function that mounts a complete tree into a container node and a public instance:
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb

```js
function mountTree(element, containerNode) {
  // Tạo ra thực thể nội cấp cao
  var rootComponent = instantiateComponent(element);

  // Mount thực thể nội cấp cao đó vào node cha (containerNode)
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Trả về thực thể chung nhận được từ thực thể nội đó
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}

var rootEl = document.getElementById('root');
mountTree(<App />, rootEl);
```

### Unmounting {#unmounting}

Bây giờ chúng ta đã có các thực thể nội cùng với các con của chúng và các node DOM, chúng ta có thể hiện thực việc unmount. Đối với một component do người dùng định nghĩa, quá trình unmounting gọi hàm lifecycle và lặp lại như vậy xuống các component con.

```js
class CompositeComponent {

  // ...

  unmount() {
    // Gọi hàm lifecycle nếu cần thiết
    var publicInstance = this.publicInstance;
    if (publicInstance) {
      if (publicInstance.componentWillUnmount) {
        publicInstance.componentWillUnmount();
      }
    }

    // Unmount một component đã được render
    var renderedComponent = this.renderedComponent;
    renderedComponent.unmount();
  }
}
```

`DOMComponent` hiện thực việc unmount trên các component con:

```js
class DOMComponent {

  // ...

  unmount() {
    // Unmount tất cả các component con
    var renderedChildren = this.renderedChildren;
    renderedChildren.forEach(child => child.unmount());
  }
}
```

Thực tế, unmount các DOM component cũng sẽ loại bỏ các sự kiện kèm theo (event listeners) và xóa bộ nhớ đệm, nhưng chúng ta sẽ không đi vào chi tiết của việc này.

Bây giờ chúng ta có thể thêm một hàm cấp cao `unmountTree(containerNode)` tương tự như `ReactDOM.unmountComponentAtNode()`:

```js
function unmountTree(containerNode) {
  // Lấy thực thể nội từ node DOM:
  // (Vẫn chưa chạy được, chúng ta sẽ cần thay đổi hàm mountTree() để lưu trữ những thông tin lấy được.)
  var node = containerNode.firstChild;
  var rootComponent = node._internalInstance;

  // Unmount cây và xóa nội dung bên trong container
  rootComponent.unmount();
  containerNode.innerHTML = '';
}
```

Để thực thi theo cách này, chúng ta cần thực thể nội ở gốc từ một node DOM. Chúng ta sẽ thay đổi `mountTree()` để thêm thuộc tính `_internalInstance` vào node gốc của DOM. Chúng ta cũng sẽ cho `mountTree()` xóa một cây đang tồn tại để công việc này có thể thuận tiện thực hiện nhiều lần:

```js
function mountTree(element, containerNode) {
  // Xóa một cây đang tồn tại
  if (containerNode.firstChild) {
    unmountTree(containerNode);
  }

  // Tạo ra một thực thể nội cấp cao
  var rootComponent = instantiateComponent(element);

  // Mount component cấp cao vào container
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Lưu lại một tham chiếu đến thực thể nội đó
  node._internalInstance = rootComponent;

  // Trả về thực thể chung nhận được từ thực thể nội
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}
```

Bây giờ, thực thi `unmountTree()`, hay chạy `mountTree()` lặp lại nhiều lần, sẽ loại bỏ cây cũ và gọi đến hàm lifecycle `componentWillUnmount()` của các component.

### Cập nhật {#updating}

Trong phần trước, chúng ta hiện thực quá trình unmount. Tuy vậy, React sẽ không hiệu quả như bây giờ nếu mỗi sự thay đổi của prop sẽ unmount và mount lại toàn bộ cây. Mục tiêu của reconciler là tái sử dụng những thực thể khi có thể giữ lại được DOM và trạng thái:

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Nên sử dụng lại DOM đang tồn tại:
mountTree(<App />, rootEl);
```

Chúng ta sẽ mở rộng thực thể nội của chúng ta thêm một phương thức. Bên cạnh `mount()` và `unmount()`, cả `DOMComponent` và `CompositeComponent` đều sẽ hiện thực một phương thức mới là `receive(nextElement)`:

```js
class CompositeComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}

class DOMComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}
```

Công việc của phương thức này là giữ cho component và các con của nó luôn được cập nhật mới nhất theo như trình bày trong `nextElement`.

Phần này thường được gọi là "tìm điểm khác biệt trên cây DOM ảo" (virtual DOM diffing), mặc dù việc thực sự diễn ra là chúng ta duyệt đệ quy cây cấu trúc và cập nhật từng thực thể nội.

### Cập nhật các component kiểu composite {#updating-composite-components}

Khi một component kiểu composite (component do người dùng định nghĩa) nhận được một phần tử mới, nó sẽ gọi đến phương thức lifecycle `componentWillUpdate()`.

Sau đó component được render lại với props mới, và chúng ta nhận được phần tử tiếp theo được render:

```js
class CompositeComponent {

  // ...

  receive(nextElement) {
    var prevProps = this.currentElement.props;
    var publicInstance = this.publicInstance;
    var prevRenderedComponent = this.renderedComponent;
    var prevRenderedElement = prevRenderedComponent.currentElement;

    // Cập nhật phần tử của chính component
    this.currentElement = nextElement;
    var type = nextElement.type;
    var nextProps = nextElement.props;

    // Xác định đầu ra tiếp theo của render()
    var nextRenderedElement;
    if (isClass(type)) {
      // Component kiểu lớp
      // Gọi hàm lifecycle nếu cần thiết
      if (publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(nextProps);
      }
      // Cập nhật props
      publicInstance.props = nextProps;
      // Render lại
      nextRenderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Component kiểu hàm
      nextRenderedElement = type(nextProps);
    }

    // ...
```

Tiếp theo, chúng ta có thể xét `type` của phần tử đã được render. Nếu `type` không đổi trong lần render mới nhất, component dưới đây có thể được cập nhật ngay tại chỗ.

Ví dụ, nếu kết quả trả về là `<Button color="red" />` trong lần đầu tiên, và `<Button color="blue" />` trong lần thứ hai, thực thể nội tương ứng chỉ cần gọi `receive()` với tham số đầu vào là phần tử tiếp theo:

```js
    // ...

    // Nếu kiểu của phần tử được render ra là không đổi,
    // sử dụng lại thực thể hiện tại và hoàn thành.
    if (prevRenderedElement.type === nextRenderedElement.type) {
      prevRenderedComponent.receive(nextRenderedElement);
      return;
    }

    // ...
```

Tuy nhiên, nếu phần tử được render tiếp theo có `type` khác so với phần tử trước đó, chúng ta không thể cập nhật thực thể nội. Một `<button>` không thể biến thành một `<input>`.

Thay vào đó, chúng ta phải unmount thực thể nội hiện tại và mount thực thể mới tương ứng với kiểu phần tử đã được render. Ví dụ, đây là những gì diễn ra khi một componenet trước đó render ra một `<button>`, bây giờ render ra một `<input>`:

```js
    // ...

    // Nếu rơi vào trường hợp này, chúng ta cần unmount component đã được mount trước đó,
    // mount component mới, và hoán đổi các node của hai component này.

    // Tìm ra node cũ cần được thay thế
    var prevNode = prevRenderedComponent.getHostNode();

    // Unmount node con cũ và mount node con mới
    prevRenderedComponent.unmount();
    var nextRenderedComponent = instantiateComponent(nextRenderedElement);
    var nextNode = nextRenderedComponent.mount();

    // Thay thế tham chiếu đến node con
    this.renderedComponent = nextRenderedComponent;

    // Thay thế node cũ bằng node mới
    // Ghi chú: đoạn code này phụ thuộc vào các renderer khác nhau và
    // lý tưởng thì nên được đặt bên ngoài CompositeComponent:
    prevNode.parentNode.replaceChild(nextNode, prevNode);
  }
}
```

Tóm lại, khi một component kiểu composite nhận một phần tử mới, nó có thể giao phó việc cập nhật cho thực thể nội đã được render, hoặc unmount thực thể đó và mount một thực thể mới vào vị trí đó.

Còn một điều kiện nữa xác định khi nào một component sẽ phải mount lại hoặc là nhận một phần tử mới, đó là khi `key` của phần tử thay đổi. Chúng ta không bàn luận về việc xử lý `key` ở đây, vì nó khiến bài viết vốn đã phức tạp này trở nên phức tạp hơn.

Nhớ rằng chúng ta cần thêm vào thực thể nội một phương thức là `getHostNode()` để có thể xác định vị trí node của hệ thống và thay thế nó trong quá trình cập nhật. Cách hiện thực cho phương thức này là trực diện cho cả hai lớp:

```js
class CompositeComponent {
  // ...

  getHostNode() {
    // Tìm vị trí host node từ component render ra nó.
    // Việc này sẽ đi sâu vào bất kì các component kiểu composite nào.
    return this.renderedComponent.getHostNode();
  }
}

class DOMComponent {
  // ...

  getHostNode() {
    return this.node;
  }  
}
```

### Cập nhật các component kiểu host {#updating-host-components}

Với các component kiểu host (component của hệ thống), như `DOMComponent`, quá trình cập nhật được hiện thực theo cách khác. Khi chúng nhận một phần tử, chúng cần cập nhật những thành phần nằm bên trong hệ thống. Đối với React DOM, đó sẽ là công việc cập nhật cái thuộc tính của DOM.

```js
class DOMComponent {
  // ...

  receive(nextElement) {
    var node = this.node;
    var prevElement = this.currentElement;
    var prevProps = prevElement.props;
    var nextProps = nextElement.props;    
    this.currentElement = nextElement;

    // Loại bỏ những thuộc tính cũ.
    Object.keys(prevProps).forEach(propName => {
      if (propName !== 'children' && !nextProps.hasOwnProperty(propName)) {
        node.removeAttribute(propName);
      }
    });
    // Gán giá trị mới cho các thuộc tính.
    Object.keys(nextProps).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, nextProps[propName]);
      }
    });

    // ...
```

Sau đó, các component kiểu host cần cập nhật các con của chúng. Không giống như component kiểu composite, các host component có thể có nhiều hơn một con.

Trong ví dụ đơn giản dưới đây, chúng ta sử dụng một mảng để chứa các thực thể nội và duyệt lần lượt qua các phần tử bên trong mảng, thực hiện việc cập nhật hoặc thay thế tùy theo thuộc tính `type` nhận được có giống với thuộc tính `type` trước đó hay không. Thực tế thì bên cạnh việc thêm và xóa các phần tử, reconciler còn xét đến thuộc tính `key` để theo dõi sự di chuyển của các phần tử đó, tuy nhiên chúng ta sẽ bỏ qua việc này.

Chúng ta lưu những thao tác DOM trên các phần tử con vào một danh sách (list) để có thể hiện thực chúng cùng lúc:

```js
    // ...

    // Đây là các mảng chứa các phần tử trong React:
    var prevChildren = prevProps.children || [];
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }
    var nextChildren = nextProps.children || [];
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    // Đây là các mảng chứa các thực thể nội:
    var prevRenderedChildren = this.renderedChildren;
    var nextRenderedChildren = [];

    // Chúng ta duyệt qua các phần tử con và thêm các phép thay đổi vào mảng này.
    var operationQueue = [];

    // Ghi chú: đoạn code dưới đây đã được đơn giản hóa đi đáng kể!
    // Nó không thực hiện sắp xếp lại, hay xử lý các phần tử con với các chỗ trống (hole) hoặc key.
    // Nó chỉ làm rõ luồng thực thi tổng quát mà không đi sâu vào cụ thể.

    for (var i = 0; i < nextChildren.length; i++) {
      // Lấy một thực thể nội có tồn tại của phần tử con
      var prevChild = prevRenderedChildren[i];

      // Nếu không lấy được thực thể nội nào ở chỉ số i hiện tại,
      // một phần tử con được thêm vào cuối. Tạo ra một thực thể nội mới,
      // mount nó, và sử dụng node từ thực thể vừa được mount.
      if (!prevChild) {
        var nextChild = instantiateComponent(nextChildren[i]);
        var node = nextChild.mount();

        // Ghi lại hành động thêm (append) một node
        operationQueue.push({type: 'ADD', node});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // Chúng ta chỉ có thể cập nhật lại một thực thể nếu thuộc tính type của nó không đổi.
      // Ví dụ, <Button size="small" /> có thể được cập nhật thành
      // <Button size="large" /> nhưng không thể cập nhật thành <App />.
      var canUpdate = prevChildren[i].type === nextChildren[i].type;

      // Nếu chúng ta không thể cập nhật một thực thể đang tồn tại, chúng ta phải unmount nó
      // và mount một thực thể mới vào thay thế.
      if (!canUpdate) {
        var prevNode = prevChild.getHostNode();
        prevChild.unmount();

        var nextChild = instantiateComponent(nextChildren[i]);
        var nextNode = nextChild.mount();

        // Ghi lại hành động hoán đổi (swap) các node
        operationQueue.push({type: 'REPLACE', prevNode, nextNode});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // Nếu chúng ta có thể cập nhật một thực thể nội đang tồn tại,
      // cứ để nó nhận phần tử mới và cho nó tự xử lý việc cập nhật.
      prevChild.receive(nextChildren[i]);
      nextRenderedChildren.push(prevChild);
    }

    // Cuối cùng, unmount các phần tử con không tồn tại nữa:
    for (var j = nextChildren.length; j < prevChildren.length; j++) {
      var prevChild = prevRenderedChildren[j];
      var node = prevChild.getHostNode();
      prevChild.unmount();

      // Ghi lại hành động xóa một node
      operationQueue.push({type: 'REMOVE', node});
    }

    // Cập nhật lại danh sách các phần tử con được render.
    this.renderedChildren = nextRenderedChildren;

    // ...
```

Ở bước cuối cùng, chúng ta thực hiện các thao tác DOM. Nhắc lại một lần nữa là, việc hiện thực reconciler thực tế phức tạp hơn vì nó còn kiểm soát việc di chuyển của các phần tử:

```js
    // ...

    // Thực thi các thao tác đang có trong hàng chờ.
    while (operationQueue.length > 0) {
      var operation = operationQueue.shift();
      switch (operation.type) {
      case 'ADD':
        this.node.appendChild(operation.node);
        break;
      case 'REPLACE':
        this.node.replaceChild(operation.nextNode, operation.prevNode);
        break;
      case 'REMOVE':
        this.node.removeChild(operation.node);
        break;
      }
    }
  }
}
```

Và đó là cách cập nhật các component kiểu host.

### Cập nhật các phần tử cấp cao {#top-level-updates}

Bây giờ `CompositeComponent` và `DOMComponent` đều đã hiện thực phương thức `receive(nextElement)`, chúng ta có thể thay đổi hàm cấp cao `mountTree()` để sử dụng khi thuộc tính `type` của phần tử không thay đổi:

```js
function mountTree(element, containerNode) {
  // Kiểm tra cây hiện tại
  if (containerNode.firstChild) {
    var prevNode = containerNode.firstChild;
    var prevRootComponent = prevNode._internalInstance;
    var prevElement = prevRootComponent.currentElement;

    // Tái sử dụng lại component gốc hiện tại nếu có thể
    if (prevElement.type === element.type) {
      prevRootComponent.receive(element);
      return;
    }

    // Nếu không, unmount cây hiện tại
    unmountTree(containerNode);
  }

  // ...

}
```

Bây giờ gọi hàm `mountTree()` hai lần với cùng một `type` sẽ không cần thực hiện việc xóa trên cây:

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Sử dụng lại DOM hiện tại:
mountTree(<App />, rootEl);
```

Đây là những điều cơ bản mà cách React vận hành ở bên trong.

### Những vấn đề chưa đề cập {#what-we-left-out}

Bài viết này đã được đơn giản đi so với codebase thật sự. Có một vài điều quan trọng mà chúng ta chưa đề cập:

* Các component có thể render ra `null`, và reconciler có thể xử lý các "phần tử trống" trong các mảng và các phần tử được render ra.

* Reconciler dùng `key` của các phần tử để xác định thực thể nội nào tương ứng với phần tử nào trong mảng. Điều này tạo thêm một chút độ phức tạp trong việc hiện thực React trong thực tế.

* Bên cạnh các thực thể nội từ các lớp kiểu composite và host, còn xuất hiện các component từ các lớp kiểu "text" và "empty". Chúng biểu diễn các node text và "phần tử trống" mà chúng ta nhận được khi render `null`.

* Các renderer dùng cách [injection](/docs/codebase-overview.html#dynamic-injection) để đưa lớp nội kiểu host đến reconciler. Ví dụ, React DOM nhắc reconciler hiện thực `ReactDOMComponent` như là thực thể nội kiểu host.

* Ý tưởng của việc cập nhật các phần tử con có thể được gói gọn thành thuật ngữ `ReactMultiChild`, được áp dụng vào trong việc hiện thực thực thể nội kiểu host ở cả ReactDOM và React Native.

* Reconciler cũng hỗ trợ việc thực thi `setState()` trong các component kiểu composite. Nhiều cập nhật bên trong trình xử lý sự kiện (event handlers) được gộp lại thành một cập nhật duy nhất.

* Reconciler cũng đảm bảo việc thêm hay gỡ các tham chiếu đến các component kiểu composite và node kiểu host.

* Các phương thức lifecycle được gọi sau khi DOM được tải xong, ví dụ như `componentDidMount()` và `componentDidUpdate()`, được gom vào "callback queue" và được thực thi cùng nhau.

* React lưu trữ thông tin về các cập nhật hiện tại vào trong một object nội là "transaction". Transaction giúp ích trong việc kiểm soát hàng chờ của các phương thức lifecycle đang chờ thực thi, kiểm soát DOM để xác định và thông báo lỗi, và những cái toàn cục (global) của một cập nhật nhất định. Transaction còn thực hiện việc sắp xếp lại sau khi cập nhật. Ví dụ, lớp transaction của React DOM đặt lại các lựa chọn của các trường input sau mỗi cập nhật.

### Đi sâu vào Code {#jumping-into-the-code}

* [`ReactMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/client/ReactMount.js) là nơi lưu các đoạn code được sử dụng trong bài viết này như `mountTree()` và `unmountTree()`. Nó kiểm soát việc mount và unmount các component cấp cao. [`ReactNativeMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeMount.js) là phiên bản tương tự của React Native.
* [`ReactDOMComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/shared/ReactDOMComponent.js) tương đương với `DOMComponent` trong bài viết này. Nó hiện thực các component từ lớp kiểu host cho React DOM renderer. [`ReactNativeBaseComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeBaseComponent.js) là phiên bản tương tự của React Native.
* [`ReactCompositeComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js) tương đương với `CompositeComponent` trong bài viết này. Nó kiểm soát việc gọi đến các component do người dùng định nghĩa và quản lý trạng thái (state) của các component đó.
* [`instantiateReactComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/instantiateReactComponent.js) giúp chọn ra lớp thực thể nội phù hợp để tạo nên một phần tử. Nó tương đương với `instantiateComponent()` trong bài viết này.

* [`ReactReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactReconciler.js) là bản wrapper của các phương thức `mountComponent()`, `receiveComponent()`, và `unmountComponent()`. Nó gọi đến chi tiết bên trong việc hiện thực các thực thể nội, nhưng cũng thêm các đoạn code bên ngoài được dùng chung bởi tất cả các phần hiện thực thực thể nội.

* [`ReactChildReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactChildReconciler.js) hiện thực các logic cho việc mount, cập nhật, và unmount các phần tử con dựa trên `key` của chúng.

* [`ReactMultiChild`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactMultiChild.js) hiện thực hàng chờ các thao tác của renderer cho việc thêm, xóa và di chuyển độc lập các phần tử con.

* `mount()`, `receive()`, và `unmount()` thực sự được gọi là `mountComponent()`, `receiveComponent()`, và `unmountComponent()` trong React codebase vì những lí do lịch sử và quá khứ, tuy nhiên thì chúng vẫn nhận đầu vào là các phần tử.

* Các thuộc tính của các thực thể nội bắt đầu bằng dấu gạch dưới, ví dụ như `_currentElement`. Chúng được xem như những phần chỉ cho phép đọc (read-only) và được dùng chung (public) trong cả codebase.

### Hướng đi trong tương lai {#future-directions}

Stack reconciler kế thừa những hạn chế như việc thực thi đồng bộ và không thể dừng một công việc đang thực thi hay chia nó thành các phần việc nhỏ hơn. Chúng tôi đang tạo ra reconciler mới là [Fiber reconciler](/docs/codebase-overview.html#fiber-reconciler) với một [kiến trúc hoàn toàn khác](https://github.com/acdlite/react-fiber-architecture). Trong tương lai, chúng tôi muốn dùng nó thay thế cho stack reconciler, nhưng ở hiện tại nó vẫn còn xa vời.

### Các bước tiếp theo {#next-steps}

Đọc [phần tiếp theo](/docs/design-principles.html) để biết về những nguyên tắc thiết kế mà chúng tôi sử dụng trong việc phát triển React.
