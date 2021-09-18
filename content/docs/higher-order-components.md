---
id: higher-order-components
title: Higher-Order Components
permalink: docs/higher-order-components.html
---

Higher-order component (HOC) là một kĩ thuật nâng cao trong React để tái sử dụng logic của component. HOC không thuộc React API. Nó là một pattern được sinh ra từ khả năng sử dụng kết hợp (compositional) của React.

Một cách cụ thể, **một higher-order component là một hàm nhận vào một component và trả về một component.**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

Nếu như một component chuyển đổi props thành UI, thì một higher-order component chuyển đổi một component thành một component khác.

HOCs rất phổ biến với các thư viện React, chẳng hạn như Redux [`connect`](https://github.com/reduxjs/react-redux/blob/main/docs/api/connect.md#connect) và Relay [`createFragmentContainer`](https://relay.dev/docs/v10.1.3/fragment-container/#createfragmentcontainer).

Trong tài liệu này, chúng ta sẽ thảo luận tại sao higher-order components lại có ích và cách tạo ra một HOC.

## Sử dụng HOCs cho Cross-Cutting Concerns {#use-hocs-for-cross-cutting-concerns}

> **Chú ý**
>
> Trước đó chúng tôi đã khuyên sử dụng mixins như là một cách để đảm nhận những ảnh hưởng chung. Nhưng mixins gây ra nhiều khó khăn hơn là ích lợi. [Tham khảo](/blog/2016/07/13/mixins-considered-harmful.html) tại sao chúng tôi không còn sử dụng mixins và cách bạn có thể thay đổi những components đã tồn tại.

Components là những đơn vị cơ bản trong việc tái sử dụng code trong React. Tuy nhiên, bạn có thể thấy một số patterns không thực sự phù hợp cho những components truyền thống.

Ví dụ, bạn có component `CommentList` lấy dữ liệu từ nguồn bên ngoài và hiển thị một list các bình luận:

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" là nguồn dữ liệu từ bên ngoài
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Lắng nghe các thay đổi
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Dọn dẹp listener
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Cập nhật lại component khi nguồn dữ liệu thay đổi
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

Sau đó, bạn viết một component cho một bài blog, với pattern tương tự:

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

`CommentList` và `BlogPost` không giống nhau - chúng gọi các hàm khác nhau trên `DataSource`, và hiển thị nội dung khác nhau. Tuy nhiên cách viết lại có điểm chung:

- Khi được mount, thêm một listener lắng nghe thay đổi từ `DataSource`.
- Trong hàm listener, gọi `setState` khi dữ liệu thay đổi.
- Khi unmount, xóa listener.

Bạn có thể tưởng tượng trong một ứng dụng lớn, việc lắng nghe `DataSource` và gọi `setState` sẽ lặp đi lặp lại rất nhiều lần. Chúng tôi muốn một khung sườn cho phép định nghĩa logic trên vào một nơi và chia sẻ nó cho các component khác. Đây chính là điểm nổi trội của higher-order component

Chúng ta có thể viết một hàm tạo ra các component, như `CommentList` và `BlogPost`, lắng nghe `DataSource`. Hàm sẽ nhận vào một component con như là một đối số và lấy data trả về như là một prop. Gọi hàm đó là `withSubscription`:

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

Tham số đầu tiên là component đầu vào. Tham số thứ hai là dữ liệu mà chúng ta quan tâm, `DataSource` và các props hiện tại.

Khi `CommentListWithSubscription` và `BlogPostWithSubscription` được render, `CommentList` và `BlogPost` sẽ nhận vào prop `data` với dữ liệu được trả về từ `DataSource`:

```js
// Hàm nhận vào một component...
function withSubscription(WrappedComponent, selectData) {
  // ...và trả về một component khác...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ...đảm nhận việc lắng nghe thay đổi...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... và render component đầu vào với dữ liệu mới!
      // Chú ý ta có thể thêm vào các props khác
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

Cần nhớ một điều là HOC không chỉnh sửa, làm thay đổi component đầu vào mà nó chỉ kế thừa các hành vi của component đó. Một HOC *xào nấu* component gốc bằng cách gói nó vào một component. Một HOC là một hàm không có tác dụng phụ (side-effects).

Và đó là tất cả! Component bên trong nhận tất cả các props của component bên ngoài, bên cạnh prop mới, `data`, cái mà được sử dụng để render. HOC không quan tâm dữ liệu được sử dụng như thế nào hoặc tại sao, và component bên trong cũng không quan tâm dữ liệu đến từ đâu.

Bởi vì `withSubscription` là một hàm bình thường, bạn có thể thêm vào bao nhiêu tham số bạn muốn. Ví dụ, bạn muốn tên của `data` có thể tùy biến, để cho HOC độc lập với component bên trong. Hoặc bạn có thể nhận một tham số mà có thể tùy chỉnh `shouldComponentUpdate`, và một cho thay đổi nguồn dữ liệu. Những điều đó đều có thể vì HOC kiểm soát hoàn toàn cách một component định nghĩa.

Giống như các components khác, mối quan hệ giữa `withSubscription` và component con hoàn toàn dựa vào props. Nó giúp cho việc đổi một HOC này với một HOC khác dễ dàng hơn, miễn là chúng cung cấp cùng props cho component con. Rất hữu ích nếu bạn thay đổi thư viện lấy dữ liệu.

## Đừng thay đổi (mutate) Component Gốc. Hãy sử dụng Composition.{#dont-mutate-the-original-component-use-composition}

Kiểm soát ham muốn chỉnh sửa prototype của component (nói cách khác là mutate nó) bên trong một HOC.

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentDidUpdate = function(prevProps) {
    console.log('Current props: ', this.props);
    console.log('Previous props: ', prevProps);
  };
  // Việc trả về component ban đầu cho thấy nó đã được mutate
  return InputComponent;
}

// EnhancedComponent sẽ được log khi có props được nhận vào
const EnhancedComponent = logProps(InputComponent);
```

Có một số vấn đề với việc này. InputComponent không thể được tái sử dụng tách rời với EnhancedComponent. Nếu bạn sử dụng một HOC khác lên `EnhancedComponent`, cái mà *cũng* mutate `componentDidUpdate`, chức năng của HOC đầu sẽ bị ghi đè. HOC này cũng không dùng được với function components, thứ mà không có các hàm lifecycle.

Những HOC được mutate thì khá mơ hồ - Những người sử dụng cần biết cách áp dụng để tránh bị xung đột với những HOC khác.
Thay vì mutate, HOC nên sử dụng composition, bằng cách gói component đầu vào bên trong một container:

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('Current props: ', this.props);
      console.log('Previous props: ', prevProps);
    }
    render() {
      // Thật tốt khi Input component được bọc bởi một container và nó không bị thay đổi (mutate)
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

HOC này có đầy đủ chức năng với bản được mutate mà tránh được nguy cơ xung đột. Nó hoạt động hiệu quả cả với class và function component. Vì nó là một pure function, nó có thể được ghép với những HOC khác, hoặc kể cả chính nó.

Bạn có thể nhận ra điểm chung giữa HOCs và một pattern gọi là **container components**. Container components là một phần của chiến lược trách nhiệm phân chia giữa các điều high-level và low-level. Containers quản lý những thứ như lắng nghe (subscriptions) và trạng thái (state), và truyền props đến components con để thực hiện các nhiệm vụ như render UI. HOCs sử dụng container như một thừa kế. Bạn có thể nghĩ đến HOC như là một container component có thể truyền tham số.

## Quy ước: Truyền những props không liên quan đến component con{#convention-pass-unrelated-props-through-to-the-wrapped-component}


HOC giúp bạn thêm các tính năng mới vào component. Chúng không nên thay đổi mạnh mẽ cấu trúc. Component trả về từ HOC nên có chung interface với component con.

Những HOC nên truyền qua các props mà không liên quan đến những quan tâm đặc thù. Hầu hết các HOC đều chứa một hàm render có dạng như sau:

```js
render() {
  // Lọc những props mà chỉ liên quan đến HOC này mà không cần truyền xuống
  const { extraProp, ...passThroughProps } = this.props;

  // Truyền những props vào component con. Chúng thường là giá trị state hoặc method.
  const injectedProp = someStateOrInstanceMethod;

  // Truyền props đến component con
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

Quy ước này giúp cho những HOC trở nên linh hoạt và có thể tái sử dụng.

## Quy ước : Khả năng kết hợp tối đa (maximizing composability) {#convention-maximizing-composability}

Không phải tất cả các HOC đều như sau. Đôi khi chúng chỉ nhận một tham số, component con:

```js
const NavbarWithRouter = withRouter(Navbar);
```

Thông thường, HOC nhận nhiều tham số. Trong ví dụ với Relay, config object được dùng để chỉ ra dữ liệu phụ thuộc của component:

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

Điển hình nhất cho một HOC:

```js
// React Redux's `connect`
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

Sẽ dễ dàng hơn nếu chia nhỏ nó ra.

```js
// connect là một hàm trả về một hàm khác
const enhance = connect(commentListSelector, commentListActions);
// Hàm trả về là một HOC, thứ mà trả về một component kết nối với Redux store
const ConnectedComment = enhance(CommentList);
```
Nói cách khác, `connect` là một higher-order function trả về một higher-order component!

Dạng này có thể gây nhầm lẫn hoặc không cần thiết nhưng lại rất hữu ích. Những HOC nhận môt tham số giống như được trả về từ `connect` có đặc điểm `Component => Component`. Những hàm mà output type giống như input type thì rất dễ để kết hợp với nhau.

```js
// Thay vì làm như sau...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... you can use a function composition utility
// compose(f, g, h) is the same as (...args) => f(g(h(...args)))
// bạn có thể sử dụng function composition
// compose(f, g, h) giống với (...args) => f(g(h(...args)))
const enhance = compose(
  // Đây đều là HOC đơn tham số
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

(Property này cũng cho phép `connect` với enhancer-style HOCs để sử dụng như decorators, một JavaScript proposal.)

Hàm `compose` được cung cấp bởi nhiều third-party libraries như lodash ([`lodash.flowRight`](https://lodash.com/docs/#flowRight)), [Redux](https://redux.js.org/api/compose), và  [Ramda](https://ramdajs.com/docs/#compose).

## Quy ước: Cách đặt tên HOC để tiện cho việc debug (tìm và gỡ lỗi){#convention-wrap-the-display-name-for-easy-debugging}

Những container component tạo bởi HOCs đều xuất hiện trong [React Developer Tools](https://github.com/facebook/react/tree/main/packages/react-devtools) như bao component khác. Để dễ debug, chọn tên sao cho nó thể hiện rằng nó được sinh ra từ HOC.

Một cách thông dụng nhất là bọc display name của component được bọc. Vì vậy nếu higher-order component của bạn có tên `withSubscription`, và tên của wrapped component hiển thị là `CommentList`, thì bạn nên sử dụng tên hiển thị là `WithSubscription(CommentList)`:
Một kỹ thuật thường gặp là tạo tên với tên của component bên trong. Nếu HOC có tên là `withSubscription`, và component con có tên là `CommentList`, hãy dùng tên `WithSubscription(CommentList)`

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```


## Lưu Ý {#caveats}

Higher-order components có một số lưu ý không rõ ràng nếu bạn là người mới học React.

### Đừng dùng HOC bên trong hàm render {#dont-use-hocs-inside-the-render-method}

Thuật toán diffing của React (gọi là [Reconciliation](/docs/reconciliation.html)) dùng nhận dạng của componet để quyết định xem có nên cập nhật substree hay mount một cái mới. Nếu một component trả về từ `render` giống (`===`) với component từ lần render trước, React sẽ đệ quy cập nhật substree bằng so sánh (diffing) với cái mới. Nếu chúng không giống nhau, substree được unmount hoàn tất.

Bạn không cần nghĩ về điều này nhiều. Nó chỉ ảnh hưởng đến HOC vì bạn không thể áp dụng HOC cho một component bên trong hàm render của một component khác:

```js
render() {
  // Một phiên bản mới của EnhancedComponent được tạo ra sau mỗi lần render
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // Điều đó gây ra việc mount/unmount substree mỗi lần như vậy!
  return <EnhancedComponent />;
}
```

Vấn đề ở đây không chỉ là về hiệu năng - việc remount một component gây ra tình trạng cả state cũng như những children đều bị mất.

Áp dụng HOC bên ngoài định nghĩa của component để component sẽ chỉ tạo ra một lần. Định danh của nó sẽ không thay đổi qua mỗi lần render.

Trong những trường hợp hiếm mà bạn cần phải dùng HOC một cách linh hoạt, bạn có thể dùng nó bên trong những hàm licycle hoặc constructor của component.

### Những static methods phải được sao chép qua {#static-methods-must-be-copied-over}

Đôi khi sẽ rất hữu ích nếu tạo một static method trong React component. Ví dụ, Relay containers có một static method `getFragment` để đơn giản hóa việc kết hợp của GraphQL fragment.

Khi dùng HOC với một component, mặc dù component được bao bọc bởi container, nó không có nghĩa là component mới sẽ có những static methods của component ban đầu.

```js
// Định nghĩa một static method
WrappedComponent.staticMethod = function() {/*...*/}
// Bây giờ, áp dụng HOC
const EnhancedComponent = enhance(WrappedComponent);

// EnhancedComponent không có static method trên
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

Để giải quyết điều này, bạn cần sao chép hàm qua container trước khi chạy:

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Cần biết chính xác hàm nào cần sao chép :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

Tuy nhiên việc này yêu cầu bạn biết chính xác hàm nào cần sao chép. Bạn có thể sử dụng [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics) để tự động copy tất cả các hàm không phải dạng tĩnh của React:

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

Một cách khác là export những static methods ra khỏi component.

```js
// Thay vì...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...export hoàn toàn khỏi component...
export { someFunction };

// ...import cả hai vào...
import MyComponent, { someFunction } from './MyComponent.js';
```

### Refs không được truyền xuống {#refs-arent-passed-through}

Mặc dù quy ước của HOC là truyền tất cả props xuống component, nhưng điều này không áp dụng với refs. Bởi vì `ref` không hẳng là một prop - như `key`, nó được xử lý bởi React. Nếu bạn thêm một ref vào một element mà component là kết quả từ HOC, refs sẽ mặc nhiên là của container ngoài cùng nhất, không phải component được bao bọc.

The solution for this problem is to use the `React.forwardRef` API (introduced with React 16.3). [Learn more about it in the forwarding refs section](/docs/forwarding-refs.html).
Giải pháp cho vấn đề này là dùng `React.forwardRef` API (được giới thiệu ở React 16.3). [Tìm hiểu thêm về forward ref tại đây](/docs/forwarding-refs.html).
