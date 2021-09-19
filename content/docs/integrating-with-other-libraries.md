---
id: integrating-with-other-libraries
title: Tích hợp các thư viện bên ngoài
permalink: docs/integrating-with-other-libraries.html
---

React có thể được sử dụng trong bất kỳ ứng dụng web nào. Nó có thể được thêm vào các ứng dụng khác, và ngược lại, những ứng dụng khác cũng có thể được thêm vào trong React. Bài hướng dẫn này sẽ đi vào một vài trường hợp phổ biến, tập trung vào việc tích hợp [jQuery](https://jquery.com/) và [Backbone](https://backbonejs.org/), với cách làm tương tự có thể được áp dụng để tích hợp component với bất kỳ đoạn code có sẵn nào đó.

## Tích hợp các Plugin thao tác DOM {#integrating-with-dom-manipulation-plugins}

React không nhận biết được những sự thay đổi của DOM nếu DOM được tác động từ bên ngoài. Việc quyết định update hay không sẽ dựa trên chính những thành phần đại diện bên trong nó, và nếu những DOM node này được thay đổi bởi một thứ viện khác, React sẽ cảm thấy khó hiểu và không có cách nào để xử lý chúng.

Nhưng điều này không có nghĩa là không thể hoặc quá khó trong việc kết hợp React với những plugin thao tác DOM khác, bạn chỉ cần chú ý đến nhiệm vụ của mỗi phần và mỗi phần đó sẽ làm những việc gì.

Cách dễ nhất để tránh xung đột là ngăn chặn component khỏi việc update. Bạn có thể làm việc này bằng cách render các element mà React không có động cơ để update nó, ví dụ như một thẻ div trống `<div />`.

### Tiếp cận vấn đề {#how-to-approach-the-problem}

Để chứng minh điều trên, hãy bắt đầu với một đoạn wrapper của plugin jQuery

Chúng ta sẽ gán [ref](/docs/refs-and-the-dom.html) vào phần tử root DOM. Bên trong `componentDidMount`, chúng ta sẽ tham chiếu đến nó và có thể truyền nó đến plugin jQuery.

Để ngăn việc React tác động đến DOM sau khi DOM được mount, chúng ta sẽ trả về một `<div />` trống từ method `render()`. Bởi vì phần tử `<div />` không có thuộc tính hay phần tử con, nên React sẽ không có lí do gì để update nó, và để cho jQuery plugin được thoải mái quản lý phần DOM này:

```js{3,4,8,12}
class SomePlugin extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }

  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }

  render() {
    return <div ref={el => this.el = el} />;
  }
}
```

Chú ý chúng ta sử dụng [lifecycle method](/docs/react-component.html#the-component-lifecycle) `componentDidMount` và `componentWillUnmount`. Nhiều plugin jQuery chứa các sự kiện lắng nghe của DOM nên việc cleanup những event listener trong `componentWillUnmount` là điều quan trọng. Nếu những plugin này không cung cấp method cho việc cleanup, có thể bạn phải tự mình làm việc đó, hãy nhớ xóa hết các event listener của plugin để ngăn chặn tình trạng tràn bộ nhớ.

### Tích hợp với một plugin jQuery cụ thể {#integrating-with-jquery-chosen-plugin}

Để có một ví dụ rõ ràng hơn cho những khái niệm này, hãy làm một wrapper nho nhỏ cho plugin [Chosen](https://harvesthq.github.io/chosen/), một plugin hỗ trợ input `<select>`.

>**Lưu ý:**
>
>Vì nó khả thi, không có nghĩa rằng nó là cách tiếp cận tốt nhất cho các ứng dụng React. Chúng tôi khuyến khích bạn sử dụng các component React khi có thể. Các component React dễ dàng được tái sử dụng hơn trong các ứng dụng React, và thường cung cấp nhiều hơn các khả năng điều khiển hành động và hiển thị của component đó.

Đầu tiên, hãy xem plugin Chosen làm gì với DOM.

Nếu bạn gọi Chosen trên một phần tử DOM `<select>`, nó sẽ đọc các attribute của phần tử DOM ban đầu, ẩn DOM này bằng inline style, và sau đó thêm một phần tử DOM riêng biệt của chính nó ngay sau `<select>`. Sau đó sẽ kích hoạt sự kiện jQuery để thông báo cho chúng ta về sự thay đổi.

Hãy cho rằng đây là API chúng ta đang sử dụng với component wrapper `<Chosen>`

```js
function Example() {
  return (
    <Chosen onChange={value => console.log(value)}>
      <option>vanilla</option>
      <option>chocolate</option>
      <option>strawberry</option>
    </Chosen>
  );
}
```

Chúng ta sẽ đơn giản coi nó như là một [uncontrolled component](/docs/uncontrolled-components.html).

Đầu tiên, chúng ta sẽ tạo một component trống với method `render()` trả về `<select>` được bọc trong `<div>`:

```js{4,5}
class Chosen extends React.Component {
  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

Để ý cách chúng ta bọc `<select>` trong thẻ `<div>` này. Điều này là cần thiết bởi vì Chosen sẽ thêm một phần tử DOM khác ngay sau `<select>` chúng ta truyền vào. Tuy nhiên, theo như những gì React được biết, `<div>` chỉ luôn luôn có một phần tử con. Đây là cách chúng ta chắc chắn rằng những update sẽ không gây xung đột với phần tử DOM được thêm bởi Chosen. Nên điều quan trọng là nếu bạn chỉnh sửa DOM từ bên ngoài React, bạn phải chắc chắn rằng React không có lí do gì để động vào những DOM đó.

Tiếp theo, chúng ta sẽ thực hiện các method lifecycle. Chúng ta cần khởi tạo Chosen và gán ref cho `<select>` bên trong `componentDidMount`, sau đó cleanup trong `componentWillUnmount`:

```js{2,3,7}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();
}

componentWillUnmount() {
  this.$el.chosen('destroy');
}
```

[**Thử trên Codepen**](https://codepen.io/gaearon/pen/qmqeQx?editors=0010)

Lưu ý rằng React không gán bất kỳ một ý nghĩa đặc biệt nào cho field `this.el`. Nó hoạt động chỉ bởi vì chúng ta đã gán cho nó một `ref` trong method `render()`:

```js
<select className="Chosen-select" ref={el => this.el = el}>
```

Chừng này là đủ để cho component của chúng ta render, nhưng nếu chúng ta cũng muốn được thông báo về sự thay đổi của giá trị thì sao. Để làm việc này, chúng ta sẽ theo dõi sự kiện `change` của jQuery trên `<select>` - thẻ được quản lý bởi Chosen.

Chúng ta sẽ không truyền `this.props.onChange` trực tiếp đến Chosen bởi vì những props của component có thể thay đổi liên tục, và nó bao gồm cả những hàm xử lý sự kiện. Thay vào đó, chúng ta sẽ định nghĩa một method `handleChange()` và gọi `this.props.onChange`, sau đó theo dõi nó thông qua sự kiện `change` của jQuery:

```js{5,6,10,14-16}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();

  this.handleChange = this.handleChange.bind(this);
  this.$el.on('change', this.handleChange);
}

componentWillUnmount() {
  this.$el.off('change', this.handleChange);
  this.$el.chosen('destroy');
}

handleChange(e) {
  this.props.onChange(e.target.value);
}
```

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/bWgbeE?editors=0010)

Cuối cùng, còn một việc nữa. Trong React, props có thể thay đổi liên tục. Ví dụ, component `<Chosen>` có thể có những children khác nhau nếu state của component cha thay đổi. Nghĩa là khi tích hợp, điều quan trọng là chúng ta phải update DOM một cách thủ công trong trong việc phản ứng các update của prop, bởi vì chúng ta không còn để React quản lý DOM nữa.

Tài liệu của Chosen cho rằng chúng ta có thể sử dụng jQuery API `trigger()` để thông báo về những thay đổi trong DOM ban đầu. Chúng ta sẽ để React lo phần update của `this.props.children` bên trong `<select>`, nhưng chúng ta cũng sẽ thêm method vòng đời `componentDidUpdate()` để thông báo cho Chosen về những thay đổi trong list children:

```js{2,3}
componentDidUpdate(prevProps) {
  if (prevProps.children !== this.props.children) {
    this.$el.trigger("chosen:updated");
  }
}
```

Bằng cách này, Chosen sẽ biết để update DOM của nó khi children `<select>` được thay đổi bởi React. 

Cách vận hành đầy đủ của component `Chosen` sẽ trông như thế này:

```js
class Chosen extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();

    this.handleChange = this.handleChange.bind(this);
    this.$el.on('change', this.handleChange);
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.trigger("chosen:updated");
    }
  }

  componentWillUnmount() {
    this.$el.off('change', this.handleChange);
    this.$el.chosen('destroy');
  }
  
  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/xdgKOz?editors=0010)

## Tích hợp những thư viện View khác {#integrating-with-other-view-libraries}

React có thể được thêm vào bên trong các ứng dụng khác nhờ vào sự linh hoạt của [`ReactDOM.render()`](/docs/react-dom.html#render).

Mặc dù React thường được sử dụng ban đầu để thêm một component root vào DOM, `ReactDOM.render()` cũng có thể được gọi nhiều lần với những phần UI độc lập, ví dụ những thành phần nhỏ như một button, hoặc lớn như một ứng dụng.

Thực tế, đây là chính xác cách mà React được sử dụng trong Facebook. Nó để chúng tôi viết từng phần nhỏ của ứng dụng bằng React, và kết hợp chúng với những template được tạo bởi server có sẵn của chúng tôi và những đoạn code khác trên phần client.

### Thay thế String-Based Rendering với React {#replacing-string-based-rendering-with-react}

Một pattern phổ biến trên những ứng dụng cũ là viết các phần của DOM như là một string và thêm nó vào DOM chẳng hạn như: `$el.html(htmlString)`. Những đặc điểm này trong codebase là những trường hợp hoàn hảo cho việc sử dụng React. Chỉ cần viết lại string based rendering như một component React.

Hãy theo dõi cách sử dụng jQuery sau...

```js
$('#container').html('<button id="btn">Say Hello</button>');
$('#btn').click(function() {
  alert('Hello!');
});
```

...có thể được viết lại sử dụng một component React:

```js
function Button() {
  return <button id="btn">Say Hello</button>;
}

ReactDOM.render(
  <Button />,
  document.getElementById('container'),
  function() {
    $('#btn').click(function() {
      alert('Hello!');
    });
  }
);
```

Từ đây bạn có thể bắt đầu sử dụng nhiều logic hơn với component và áp dụng nhiều React practice hơn. Ví dụ, trong những component, việc không phụ thuộc vào ID là tốt nhất bởi vì một component tương tự không thể được render nhiều lần. Thay vào đó, chúng tôi sử dụng [React event system](/docs/handling-events.html) và xử lý sự kiện click trực tiếp trên phần tử `<button>`:

```js{2,6,9}
function Button(props) {
  return <button onClick={props.onClick}>Say Hello</button>;
}

function HelloButton() {
  function handleClick() {
    alert('Hello!');
  }
  return <Button onClick={handleClick} />;
}

ReactDOM.render(
  <HelloButton />,
  document.getElementById('container')
);
```

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/RVKbvW?editors=1010)

Bạn có thể có nhiều component riêng biệt nhiều như ý bạn mong muốn, và sử dụng `ReactDOM.render()` để render chúng trên những DOM container khác nhau. Dần dần, khi bạn chuyển các ứng dụng của bạn sang React, bạn sẽ có thể kết hợp nó thành những components lớn hơn, và sử dụng `ReactDOM.render()` theo một hệ thống phân cấp.

### Thêm React vào một Backbone View {#embedding-react-in-a-backbone-view}

[Backbone](https://backbonejs.org/) view đặc trưng sử dụng HTML string, hoặc các hàm string-producing template để tạo nội dung cho các phần tử DOM của nó. Quá trình này, cũng có thể được thay thế bằng việc render một component React.

Dưới đây, chúng ta sẽ tạo một Backbone view gọi là `ParagraphView`. Chúng ta sẽ ghi đè lên function `render()` của Backbone để render một component `<Paragraph>` vào phần tử DOM được cung cấp bởi Backbone (`this.el`). Ở đây, chúng ta cũng sử dụng [`ReactDOM.render()`](/docs/react-dom.html#render):

```js{1,5,8,12}
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  render() {
    const text = this.model.get('text');
    ReactDOM.render(<Paragraph text={text} />, this.el);
    return this;
  },
  remove() {
    ReactDOM.unmountComponentAtNode(this.el);
    Backbone.View.prototype.remove.call(this);
  }
});
```

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/gWgOYL?editors=0010)

Một điều quan trọng là chúng ta cũng gọi `ReactDOM.unmountComponentAtNode()` trong method `remove` để React có thể xóa các hàm xử lý sự kiện và những tài nguyên khác liên quan tới component tree khi bị loại bỏ.

Khi một component bị loại bỏ *từ bên trong* một React tree, việc cleanup được thực hiện một cách tự động, nhưng bởi vì chúng ta đang loại bỏ toàn bộ tree một cách thủ công, nên chúng ta phải gọi method này.

## Tích hợp với Model Layers {#integrating-with-model-layers}

Bình thường chúng ta được đề xuất sử dụng data flow một chiều như [React state](/docs/lifting-state-up.html), [Flux](https://facebook.github.io/flux/), hoặc [Redux](https://redux.js.org/), các component React cũng có thể sử dụng model layer từ những framework và thư viện khác.

### Sử dụng Backbone Models trong Component React {#using-backbone-models-in-react-components}

Cách đơn giản nhất để sử dụng những [Backbone](https://backbonejs.org/) model và collection từ một component React là lắng nghe các sự kiện thay đổi trước đó và ép buộc việc update một cách thủ công.

Những component chịu trách nhiệm việc render model sẽ lắng nghe những sự kiện `'change'`, trong khi những component chịu trách nhiệm việc render collection sẽ lắng nghe sự kiện `'add'` và `'remove'`. Trong cả hai trường hợp này, chúng ta gọi [`this.forceUpdate()`](/docs/react-component.html#forceupdate) để rerender component với data mới.

Trong ví dụ dưới đây, component `List` render một Backbone collection, và sử dụng component `Item` để render những item bên trong.

```js{1,7-9,12,16,24,30-32,35,39,46}
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.model.on('change', this.handleChange);
  }

  componentWillUnmount() {
    this.props.model.off('change', this.handleChange);
  }

  render() {
    return <li>{this.props.model.get('text')}</li>;
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.collection.on('add', 'remove', this.handleChange);
  }

  componentWillUnmount() {
    this.props.collection.off('add', 'remove', this.handleChange);
  }

  render() {
    return (
      <ul>
        {this.props.collection.map(model => (
          <Item key={model.cid} model={model} />
        ))}
      </ul>
    );
  }
}
```

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/GmrREm?editors=0010)

### Trích xuất dữ liệu từ Backbone Models {#extracting-data-from-backbone-models}

Cách áp dụng trên yêu cầu những component React của bạn phải theo dõi những model và collection Backbone. Nếu sau này bạn có kế hoạch chuyển sang một giải pháp quản lý data khác, bạn có thể muốn tổng hợp các kiến thức về Backbone một cách ít code nhất có thể.

Một giải pháp cho việc này là trích xuất các attributes của model như những dữ liệu đơn giản, và giữ logic này trong một khu vực riêng biệt. Sử dụng [higher-order component](/docs/higher-order-components.html) để trích xuất tất cả attribute của một Backbone model vào một state, sau đó truyền dữ liệu đến component con.

Bằng cách này, chỉ những higher-order component mới biết về bên trong Backbone model, và hầu hết các component trong ứng không liên quan gì đến Backbone.

Ở trong ví dụ dưới đây, chúng ta sẽ tạo một bản copy của các attribute của model làm một state khởi tạo. Chúng ta theo dõi sự kiện `change` (sẽ dừng lại khi unmount), và khi sự kiện xảy ra, chúng ta update state với những attribute hiện tại của model. Cuối cùng, chúng ta cần đảm bảo rằng nếu prop `model` tự thay đổi, chúng ta sẽ dừng theo dõi model cũ, và chuyển qua theo dõi model mới.

Lưu ý rằng ví dụ này không phải là đầy đủ trong việc làm việc với Backbone, nhưng nó sẽ cho bạn một ý tưởng về cách tiếp cận theo một cách chung chung:

```js{1,5,10,14,16,17,22,26,32}
function connectToBackboneModel(WrappedComponent) {
  return class BackboneComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = Object.assign({}, props.model.attributes);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.props.model.on('change', this.handleChange);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(Object.assign({}, nextProps.model.attributes));
      if (nextProps.model !== this.props.model) {
        this.props.model.off('change', this.handleChange);
        nextProps.model.on('change', this.handleChange);
      }
    }

    componentWillUnmount() {
      this.props.model.off('change', this.handleChange);
    }

    handleChange(model) {
      this.setState(model.changedAttributes());
    }

    render() {
      const propsExceptModel = Object.assign({}, this.props);
      delete propsExceptModel.model;
      return <WrappedComponent {...propsExceptModel} {...this.state} />;
    }
  }
}
```

Để chứng minh làm sao sử dụng nó, chúng ta sẽ connect một component `NameInput` đến một Backbone model, và update attribute `firstName` của nó mỗi khi input thay đổi:

```js{4,6,11,15,19-21}
function NameInput(props) {
  return (
    <p>
      <input value={props.firstName} onChange={props.handleChange} />
      <br />
      My name is {props.firstName}.
    </p>
  );
}

const BackboneNameInput = connectToBackboneModel(NameInput);

function Example(props) {
  function handleChange(e) {
    props.model.set('firstName', e.target.value);
  }

  return (
    <BackboneNameInput
      model={props.model}
      handleChange={handleChange}
    />
  );
}

const model = new Backbone.Model({ firstName: 'Frodo' });
ReactDOM.render(
  <Example model={model} />,
  document.getElementById('root')
);
```

[**Thử trên CodePen**](https://codepen.io/gaearon/pen/PmWwwa?editors=0010)

Kỹ thuật này không chỉ giới hạn cho Backbone. Bạn cũng có thể sử dụng React với bấy kỳ thư viện model nào bằng cách theo dõi các thay đổi của nó trong các method lifecycle và tùy ý copy các dữ liệu vào các state local.
