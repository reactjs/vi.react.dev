---
id: react-api
title: React API cấp cao nhất
layout: docs
category: Reference
permalink: docs/react-api.html
redirect_from:
  - "docs/reference.html"
  - "docs/clone-with-props.html"
  - "docs/top-level-api.html"
  - "docs/top-level-api-ja-JP.html"
  - "docs/top-level-api-ko-KR.html"
  - "docs/top-level-api-zh-CN.html"
---

Để bắt đầu tìm hiểu về bộ thư viện React thì `React` package chính là điểm xuất phát. Nếu bạn load React trực tiếp từ một thẻ `script`, những API ở cấp cao nhất sẽ có sẵn trên React 'global'. Nếu bạn dùng ES6 và npm, bạn có dùng câu lệnh `import React from 'react'`. Nếu bạn dùng ES5 và npm, bạn có thể khai báo `var React = require('react')`.

## Giới thiệu chung {#overview}

### Components {#components}

React components dùng để chia UI thành những thành phần nhỏ độc lập, có tính tái sử dụng, và xem xét chúng như một mảnh riêng biệt. Bạn có thể định nghĩa React components bằng cách kế thừa các lớp con của `React`: `React.Component` hay `React.PureComponent`.

 - [`React.Component`](#reactcomponent)
 - [`React.PureComponent`](#reactpurecomponent)

Nếu bạn không sử dụng classes trong ES6, thì có thể dùng `create-react-class` module thay thế. Xem thêm [Không sử dụng ES6 trong React](/docs/react-without-es6.html) để hiểu rõ hơn.

Các React component cũng có thể được định nghĩa như là những function được bao bọc bởi:

- [`React.memo`](#reactmemo)

### Tạo React Elements {#creating-react-elements}

Chúng tôi khuyến khích bạn nên [sử dụng JSX](/docs/introducing-jsx.html) để cấu trúc phần UI (nó tương tự như HTML vậy). Mỗi JSX element được tạo ra bằng cách gọi hàm [`React.createElement()`](#createelement). Thông thường, bạn sẽ không cần gọi các "phương thức" (method) sau nếu bạn đang sử dụng JSX.

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

Xem thêm [Không sử dụng JSX trong React](/docs/react-without-jsx.html) để hiểu rõ hơn.

### Việc chuyển đổi các element {#transforming-elements}

`React` cung cấp nhiều API để thao tác với các React element:

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#reactchildren)

### Fragments {#fragments}

`React` cũng cung cấp một component cho việc render nhiều elements mà không cần thành phần bao bọc (giống như bạn phải có 1 thẻ `div` để bọc các thành phần con trong HTML).

- [`React.Fragment`](#reactfragment)

### Refs {#refs}

- [`React.createRef`](#reactcreateref)
- [`React.forwardRef`](#reactforwardref)

### Suspense {#suspense}

Suspense giúp cho components "chờ" để xử lý một việc gì đó trước khi rendering. Hiện tại, Suspense chỉ hỗ trợ trong một trường hợp duy nhất: [loading components linh hoạt với `React.lazy`](/docs/code-splitting.html#reactlazy). Trong tương lai, nó sẽ hỗ trợ các trường hợp khác như fetch dữ liệu từ bên ngoài (API, Socket, ...).

- [`React.lazy`](#reactlazy)
- [`React.Suspense`](#reactsuspense)

### Hooks {#hooks}

*Hooks* là một sự bổ sung từ phiên bản React 16.8. Chúng giúp cho bạn có thể sử dụng state và những features khác của React mà không cần phải viết một class. Hooks có hẳn một [chương tài liệu chuyên biệt](/docs/hooks-intro.html) và một bộ API riêng biệt:

- [Các Hooks cơ bản](/docs/hooks-reference.html#basic-hooks)
  - [`useState`](/docs/hooks-reference.html#usestate)
  - [`useEffect`](/docs/hooks-reference.html#useeffect)
  - [`useContext`](/docs/hooks-reference.html#usecontext)
- [Các Hooks bổ trợ](/docs/hooks-reference.html#additional-hooks)
  - [`useReducer`](/docs/hooks-reference.html#usereducer)
  - [`useCallback`](/docs/hooks-reference.html#usecallback)
  - [`useMemo`](/docs/hooks-reference.html#usememo)
  - [`useRef`](/docs/hooks-reference.html#useref)
  - [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)
  - [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect)
  - [`useDebugValue`](/docs/hooks-reference.html#usedebugvalue)

* * *

## Reference {#reference}

### `React.Component` {#reactcomponent}

`React.Component` là lớp cơ sở cho các React components khi ta định nghĩa một component với [ES6 classes](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Classes):

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Xem thêm [React.Component API Reference](/docs/react-component.html) để tìm hiểu thêm danh sách các phương thức và thuộc tính liên quan đến lớp `React.Component` cơ sở.

* * *

### `React.PureComponent` {#reactpurecomponent}

`React.PureComponent` cũng giống như [`React.Component`](#reactcomponent). Điểm khác biệt giữa chúng là [`React.Component`](#reactcomponent) không thực hiện hàm [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate), trong khi đó `React.PureComponent` thì có, nó sẽ so sánh nông (shallow) tất cả các thuộc tính của props và state để quyết định xem component này có cần update hay không.

Nếu như những React components của bạn gọi đến `render()` function để biểu diễn cùng kết quả với cùng props và state, bạn có thể sử dụng `React.PureComponent` để tăng hiệu suất cho ứng dụng trong một số trường hợp.

> Lưu ý
>
> Phương thức `shouldComponentUpdate()` của `React.PureComponent` chỉ so sánh nông (shallow) các đối tượng. Nếu chúng có cấu trúc dữ liệu phức tạp, có thể xảy ra trường hợp bỏ sót nếu sự khác biệt nằm sâu bên trong. Chỉ kế thừa `PureComponent` khi bạn có props và state đơn giản, hoặc sử dụng [`forceUpdate()`](/docs/react-component.html#forceupdate) nếu bạn chắc chắc rằng cấu trúc dữ liệu đã bị thay đổi. Hoặc, bạn có thể sử dụng  [immutable objects](https://facebook.github.io/immutable-js/) để dễ dàng so sánh nhanh các dữ liệu lồng nhau.
>
> Hơn nữa, "phương thức" (method) `shouldComponentUpdate()` của `React.PureComponent` bỏ qua việc cập nhật prop cho toàn bộ các component con. Nên hãy chắc chắn rằng các component con cũng là "pure".

* * *

### `React.memo` {#reactmemo}

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* render using props */
});
```

`React.memo` là một [component bậc cao hơn (higher order component)](/docs/higher-order-components.html).

Nếu function component của bạn biểu diễn cùng kết quả với cùng props, bạn có thể gói chúng lại và gọi đến `React.memo` để tăng hiệu năng trong một số trường hợp bằng cách ghi nhớ kết quả. Điều này có nghĩa là React sẽ bỏ qua việc render component, và sử dụng lại kết quả đã render lần cuối cùng.

`React.memo` chỉ kiểm tra các thay đổi của props. Nếu function component của bạn được wrap với `React.memo` có một [`useState`](/docs/hooks-state.html), [`useReducer`](/docs/hooks-reference.html#usereducer) hoặc [`useContext`](/docs/hooks-reference.html#usecontext) Hook, nó vẫn render lại khi state hoặc context thay đổi.

Mặc định nó sẽ chỉ so sánh cạn (shallow) các đối tượng phức tạp bên trong đối tượng props. Nếu bạn muốn kiểm soát toàn bộ việc so sánh, bạn cũng có thể cung cấp một hàm so sánh tuỳ chỉnh ở đối số thứ hai.

```javascript
function MyComponent(props) {
  /* render using props */
}
function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
}
export default React.memo(MyComponent, areEqual);
```

Phương thức này tồn tại như một cách **[tối ưu hiệu suất](/docs/optimizing-performance.html)** (performance optimization). Đừng dựa vào nó để "ngăn" việc render component, vì rất dễ gây ra lỗi.

> Lưu ý
>
> Không giống như method [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) trong class components, hàm `areEqual` trả về `true` nếu các props bằng nhau và trả về `false` nếu các props không bằng nhau. Nó ngược lại với hàm `shouldComponentUpdate`.

* * *

### `createElement()` {#createelement}

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

Tạo và trả về một [React element](/docs/rendering-elements.html) mới theo kiểu truyền vào. Đối số `type` có thể là tên của thẻ dạng ký tự (ví dụ như `'div'` hay `'span'`), một kiểu [React component](/docs/components-and-props.html) (class hay function), hoặc là một loại [React fragment](#reactfragment).

Mã được viết bằng [JSX](/docs/introducing-jsx.html) sẽ được chuyển đổi để sử dụng `React.createElement()`. Thông thường, bạn sẽ không cần gọi trực tiếp `React.createElement()` nếu bạn sử dụng JSX. Xem thêm [Không sử dụng JSX trong React](/docs/react-without-jsx.html) để hiểu rõ hơn.

* * *

### `cloneElement()` {#cloneelement}

```
React.cloneElement(
  element,
  [config],
  [...children]
)
```

Sao chép và trả về một React element mới bằng cách sử dụng `element` làm điểm bắt đầu. Element kết quả có các props của element gốc kết hợp nông (shallowly) với các props mới. Thành phần con mới sẽ thay thế thành phần con hiện có. `key` và `ref` từ element gốc sẽ được giữ nguyên.

`React.cloneElement()` gần như là tương đương với:

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

Tuy nhiên, nó cũng sẽ giữ lại các `ref`. Điều này có nghĩa rằng nếu bạn có một thành phần con cùng với một `ref` trên nó, bạn đã vô tình đánh cắp nó từ các thành phần cha. Bạn sẽ nhận được cùng `ref` đính kèm trên element mới của bạn.

API này được giới thiệu như là một giải pháp thay thế cho `React.addons.cloneWithProps()` không được dùng nữa.

* * *

### `createFactory()` {#createfactory}

```javascript
React.createFactory(type)
```

Trả về một hàm tạo ra các React element theo kiểu truyền vào. Giống như [`React.createElement()`](#createElement), đối số `type` có thể là tên của thẻ dạng ký tự (ví dụ như `'div'` hay `'span'`), một kiểu [React component](/docs/components-and-props.html) (class hay function), hoặc là một loại [React fragment](#reactfragment).

Hàm này được coi là di sản, và chúng tôi khuyến khích bạn sử dụng JSX hoặc sử dụng trực tiếp `React.createElement()`.

Thông thường, bạn sẽ không gọi trực tiếp `React.createFactory()` nếu bạn sử dụng JSX. Xem thêm [Không sử dụng JSX trong React](/docs/react-without-jsx.html) để tìm hiểu thêm.

* * *

### `isValidElement()` {#isvalidelement}

```javascript
React.isValidElement(object)
```

Để xác thực đối tượng là một React element. Trả về `true` hoặc `false`.

* * *

### `React.Children` {#reactchildren}

`React.Children` cung cấp các tiện ích để tương tác với "cấu trúc dữ liệu ẩn" (opaque data structure) `this.props.children`.

#### `React.Children.map` {#reactchildrenmap}

```javascript
React.Children.map(children, function[(thisArg)])
```

Gọi ngay một hàm trên mỗi thành phần con, bên trong là `children` cùng với `this` được gáng cho `thisArg`. Nếu `children` là một mảng nó sẽ duyệt mảng đó và hàm sẽ được thực thi cho mỗi thành phần con trong mảng. Nếu `children` là `null` hoặc `undefined`, phương thức này sẽ trả về  `null` hoặc `undefined` thay vì là một mảng.

> Lưu ý
>
> Nếu `children` là một `Fragment` nó sẽ được xem như là một thành phần con đơn lẻ và không đi qua.

#### `React.Children.forEach` {#reactchildrenforeach}

```javascript
React.Children.forEach(children, function[(thisArg)])
```

Giống như [`React.Children.map()`](#reactchildrenmap) nhưng không trả về một mảng.

#### `React.Children.count` {#reactchildrencount}

```javascript
React.Children.count(children)
```

Trả về tổng số lượng các component trong `children`, bằng đúng với số lần hàm callback sẽ được gọi trong `map` hay `forEach`.

#### `React.Children.only` {#reactchildrenonly}

```javascript
React.Children.only(children)
```

Xác thực rằng `children` có duy nhất một thành phần con (một React element) và trả về element đó. Nếu không phương thức này sẽ đưa ra lỗi.

> Lưu ý:
>
>`React.Children.only()` không cho phép trả về giá trị của [`React.Children.map()`](#reactchildrenmap) bởi vì nó là một mảng thay vì là một React element.

#### `React.Children.toArray` {#reactchildrentoarray}

```javascript
React.Children.toArray(children)
```

Trả về "cấu trúc dữ liệu ẩn" (opaque data structure) của `children` dưới dạng mảng một chiều với "khoá" (keys) được gắn cho mỗi "thành phần con" (child). Điều này sẽ hữu ích nếu bạn muốn vận dụng "bộ sưu tập" (collections) trong phương thức render của bạn, đặt biệt nếu bạn muốn sắp xếp lại hoặc cắt `this.props.children` trước khi trả về.

> Lưu ý:
>
> `React.Children.toArray()` thay đổi các khoá để giữ nguyên ngữ nghĩa của các mảng lồng nhau khi làm phẳng "flattening" danh sách của children. Nghĩa là, tiền tố `toArray` mỗi "khoá" (key) trong mảng được trả về sao cho mỗi phần thử khoá đặt trong mảng đầu vào có chứa nó.

* * *

### `React.Fragment` {#reactfragment}

`React.Fragment` component cho phép bạn trả về nhiều "phần tử" (elements) trong một phương thức `render()` mà không cần tạo "phần tử" (element) DOM:

```javascript
render() {
  return (
    <React.Fragment>
      Some text.
      <h2>A heading</h2>
    </React.Fragment>
  );
}
```

Bạn cũng có thể sử dụng nó với cú pháp ngắn gọn sau đây `<></>`. Để có thêm thông tin, xem thêm [React v16.2.0: Cải thiện hỗ trợ cho Fragments](/blog/2017/11/28/react-v16.2.0-fragment-support.html) (Improved Support for Fragments).


### `React.createRef` {#reactcreateref}

`React.createRef` tạo ra một [ref](/docs/refs-and-the-dom.html) có thể được gắn vào các phần tử (elements) của React thông qua "thuộc tính" (attribute) ref.
`embed:16-3-release-blog-post/create-ref-example.js`

### `React.forwardRef` {#reactforwardref}

`React.forwardRef` tạo ra một "thành phần" (component) React, giúp "chuyển tiếp" (forwards) "thuộc tính" (attribute) [ref](/docs/refs-and-the-dom.html) mà nó nhận được cho các thành phần khác bên dưới "cây" (tree). Kỹ thuật này không thật sự phổ biến nhưng lại đặc biệt hữu ích trong hai tình huống sau:

* [Chuyển tiếp refs tới các "thành phần" DOM](/docs/forwarding-refs.html#forwarding-refs-to-dom-components) (Forwarding refs to DOM components)
* [Chuyển tiếp refs trong các "thành phần" bậc cao](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components) (Forwarding refs in higher-order-components)

`React.forwardRef` chấp nhận một "hàm biểu diễn" (rendering function) là một đối số. React sẽ gọi đến hàm này với hai đối số là `props` và `ref`. Hàm này nên trả về một "nút" (node) React.

`embed:reference-react-forward-ref.js`

Trong ví dụ trên, React chuyển một `ref` truyền vào "phần tử" (element) `<FancyButton ref={ref}>` ở đối số thứ hai cho "hàm biểu diễn" (rendering function) bên trong lệnh gọi `React.forwardRef`. "Hàm biểu diễn" (rendering function) này chuyển `ref` cho "phần tử" (element) `<button ref={ref}>`.

Kết quả là, sau khi React đính kèm ref, `ref.current` sẽ trỏ trực tiếp tới "phần tử" (element) "đối tượng" (instance) `<button>` DOM.

Để có thểm thông tin, xem thêm ["chuyển tiếp" refs](/docs/forwarding-refs.html) (forwarding refs).

### `React.lazy` {#reactlazy}

`React.lazy()` cho phép bạn định nghĩa một "thành phần" (component) được "tải" (load) một cách "linh động" (dynamically). Nó giúp giảm kích thước `bundle` để trì hoãn việc tải các "thành phần" (components) mà nó không sử dụng trong thời điểm "biểu diễn" (render) ban đầu.

Bạn có thể tìm hiểu cách sử dụng nó từ [tài liệu chia nhỏ mã](/docs/code-splitting.html#reactlazy) (code splitting documentation) của chúng tôi. Bạn có thể cũng muốn xem [bài viết này](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d) giải thích làm thế nào để sử dụng nó chi tiết hơn.

```js
// This component is loaded dynamically
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

Lưu ý việc "biểu diễn" (rendering) các "thành phần" (components) `lazy` đòi hỏi phải có một "thành phần" (component) `<React.Suspense>` cao hơn trong "cây biểu diễn" (rendering tree). Đây là cách bạn chỉ định một "chỉ thị tải" (loading indicator).

> **Lưu ý**
>
> Sử dụng `React.lazy` với "nạp động" (dynamic import) đòi hỏi phải có Promises trong môi trường JS. Điều này đỏi hỏi một polyfill trên IE11 hoặc thấp hơn.

### `React.Suspense` {#reactsuspense}

`React.Suspense` cho phép bạn chỉ định "chỉ thị tải" trong trường hợp một số "thành phần" (component) trong cây bên dưới chưa sẵn sàng để "biểu diễn" (render). Hiện tại, các "thành phần" (component) lazy loading là trường hợp sử dụng **duy nhất** được hỗ trợ bởi `<React.Suspense>`:

```js
// This component is loaded dynamically
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // Displays <Spinner> until OtherComponent loads
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

Nó được ghi lại trong [hướng dẫn tách mã](/docs/code-splitting.html#reactlazy) của chúng tôi. Lưu ý các "thành phần" (component)`lazy` có thể nằm sâu bên trong cây `Suspense` -- nó không cần phải bọc từng cái một. Thói quen tốt nhất là đặt  `<Suspense>` nơi bạn muốn xem một sự kiện báo "tải" (loading), nhưng không dùng `lazy()` ở bất cứ nơi nào bạn muốn chia nhỏ mã.

Mặc dù điều này chưa được hỗ trợ hiện nay, nhưng trong tương lai chúng tôi có kế hoạch để cho `Suspense` xử lý nhiều kịch bản hơn như "nạp dữ liệu" (data fetching). Bạn có thể đọc về điều này trong [lộ trình của chúng tôi](/blog/2018/11/27/react-16-roadmap.html).

>Lưu ý:
>
>`React.lazy()` và `<React.Suspense>` chưa được `ReactDOMServer` hỗ trợ. Đây là một điểm hạn chế sẽ được giải quyết trong tương lai.
