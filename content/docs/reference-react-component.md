---
id: react-component
title: React.Component
layout: docs
category: Reference
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---

Trang này chứa API reference chi tiết cho React component class. Nó giả định rằng bạn đã quen thuộc với các khái niệm cơ bản của React, như [Components và Props](/docs/components-and-props.html), cũng như [State và Lifecycle](/docs/state-and-lifecycle.html). Nếu không, hãy tìm hiểu những khái niệm phía trên trước.

## Tổng Quan {#overview}

React cho phép bạn định nghĩa các component dưới dạng các class hoặc function. Component được định nghĩa dưới dạng class hiện tại cung cấp nhiều tính năng hơn, mô tả chi tiết ở trang này. Để định nghĩa một React component class, bạn cần phải extend `React.Component`:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Phương thức duy nhất bạn *phải* định nghĩa trong một lớp con của `React.Component` được là [`render()`](#render). Tất cả những phương thức còn lại được mô tả trên trang này là tùy chọn.

**Chúng tôi đặc biệt khuyến nghị không nên tạo các base component class của riêng bạn.** Trong các React component, [tái sử dụng mã chủ yếu đạt được thông qua composition hơn là inheritance](/docs/composition-vs-inheritance.html).

>Lưu ý:
>
>React không bắt buộc bạn phải sử dụng cú pháp ES6 class. Nếu bạn muốn tránh cú pháp này, bạn có thể sử dụng `create-react-class` module hoặc một custom abstraction tương tự để thay thế. Xem [Sử dụng React mà không cần ES6](/docs/react-without-es6.html) để tìm hiểu thêm.

### Vòng Đời Của Component {#the-component-lifecycle}

Mỗi component có vài "phương thức lifecycle" mà bạn có thể override để chạy mã tại những thời điểm cụ thể trong quá trình. **Bạn có thể sử dụng [lược đồ vòng đời](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) như một cheat sheet.** Trong danh sách bên dưới, các phương thức lifecycle thường được sử dụng thì được **in đậm**. Phần còn lại tồn tại để sử dụng trong các trường hợp đặc biệt.

#### Mounting {#mounting}

Những phương thức bên dưới được gọi theo thứ tự khi một instance của component đang được tạo và chèn vào DOM:

- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

>Lưu ý:
>
>Những phương thức này được coi là lỗi thời và bạn nên [tránh sử dụng chúng](/blog/2018/03/27/update-on-async-rendering.html) trong mã mới:
>
>- [`UNSAFE_componentWillMount()`](#unsafe_componentwillmount)

#### Updating {#updating}

Một cập nhật có thể được tạo ra bởi những thay đổi tới prop hoặc state. Những phương thức bên dưới được gọi theo thứ tự khi một component đang được render lại:

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)

>Lưu ý:
>
>Những phương thức này được coi là lỗi thời và bạn nên [tránh sử dụng chúng](/blog/2018/03/27/update-on-async-rendering.html) trong mã mới:
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### Unmounting {#unmounting}

Phương thức này được gọi khi một component đang được xóa khỏi DOM:

- [**`componentWillUnmount()`**](#componentwillunmount)

#### Xử Lý Lỗi {#error-handling}

Những phương thức này được gọi khi có lỗi trong quá trình render, trong một phương thức lifecycle, hoặc trong constructor của child component bất kỳ.

- [`static getDerivedStateFromError()`](#static-getderivedstatefromerror)
- [`componentDidCatch()`](#componentdidcatch)

### Những API Khác {#other-apis}

Mỗi component cũng được cung cấp một số APIs khác:

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### Class Properties {#class-properties}

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### Instance Properties {#instance-properties}

  - [`props`](#props)
  - [`state`](#state)

* * *

## Tham Khảo {#reference}

### Những Phương Thức Lifecycle Thường Được Sử Dụng {#commonly-used-lifecycle-methods}

Những phương thức trong phần này bao gồm phần lớn các trường hợp sử dụng bạn sẽ gặp phải khi tạo các React component. **Để tham khảo một cách trực quan, hãy xem [lược đồ vòng đời](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/).**

### `render()` {#render}

```javascript
render()
```

Phương thức `render()` là phương thức bắt buộc duy nhất trong một class component.

Khi được gọi, nó sẽ kiểm tra `this.props` và `this.state` sau đó return một trong các kiểu sau:

- **React elements.** Thường được tạo ra bởi [JSX](/docs/introducing-jsx.html). Ví dụ, `<div />` và `<MyComponent />` là những React element mà chỉ dẫn cho React render một DOM node, hoặc một user-defined (người dùng tự định nghĩa) component.
- **Arrays và fragments.** Cho phép bạn return nhiều element từ render. Xem tài liệu về [fragments](/docs/fragments.html) để biết thêm chi tiết.
- **Portals**. Cho phép bạn render children vào một DOM subtree khác. Xem tài liệu về [portals](/docs/portals.html) để biết thêm chi tiết.
- **String và numbers.** Chúng được render dưới dạng text nodes trong DOM.
- **Booleans hoặc `null`**. Không render. (Hầu hết tồn tại để hỗ trợ `return test && <Child />` pattern, trong đó `test` là boolean.)

Hàm `render()` nên là pure, có nghĩa là nó không làm thay đổi component state, return cùng một kết quả với mỗi lần được gọi, và không tương tác trực tiếp với browser.

Nếu bạn cần tương tác với browser, hãy thực hiện công việc của bạn trong `componentDidMount()` hoặc những phương thức lifecycle khác. Giữ `render()` pure làm cho các component dễ dàng để suy nghĩ hơn.

> Lưu ý
>
> `render()` sẽ không được gọi nếu [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.

* * *

### `constructor()` {#constructor}

```javascript
constructor(props)
```

**Nếu bạn không khởi tạo state và không bind các method, bạn không cần thiết phải implement một constructor cho React component của bạn.**

Constructor của một React component được gọi trước khi component đó được mount. Khi implement constructor cho một `React.Component` subclass, bạn nên gọi `super(props)` trước bất kỳ câu lệnh nào khác. Nếu không, `this.props` sẽ bị undefined trong constructor, điều đó có thể dẫn tới bugs.

Thông thường, trong React các constructor chỉ được sử dụng cho hai mục đích:

* Khởi tạo [local state](/docs/state-and-lifecycle.html) bằng cách gán một object cho `this.state`.
* Binding các phương thức [event handler](/docs/handling-events.html) cho một instance.

Bạn **không nên gọi `setState()`** trong `constructor()`. Thay vào đó, nếu component của bạn cần sử dụng local state, **gán state khởi tạo cho `this.state`** trực tiếp trong constructor:

```js
constructor(props) {
  super(props);
  // Không gọi this.setState() ở đây!
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

Constructor là nơi duy nhất bạn nên gán `this.state` trực tiếp. Trong tất cả những phương thức khác, bạn cần sử dụng `this.setState()` thay thế.

Tránh đặt bất kỳ side-effect hoặc subscription nào trong constructor. Với những trường hợp sử dụng như vậy, dùng `componentDidMount()` thay thế.

>Lưu ý
>
>**Tránh copy props vào state! Đây là một lỗi sai phổ biến:**
>
>```js
>constructor(props) {
>  super(props);
>  // Đừng làm thế!
>  this.state = { color: props.color };
>}
>```
>
>Vấn đề ở đây là việc copy props vào state là không cần thiết (bạn có thể sử dụng `this.props.color` trực tiếp), và sẽ tạo ra bugs (cập nhật `color` prop sẽ không được phản ánh đến state).
>
>**Chỉ sử dụng pattern này nếu bạn muốn cố tình bỏ qua các cập nhật prop.** Trong trường hợp đó, sẽ hợp lý hơn khi bạn đổi tên prop thành `initialColor` hoặc `defaultColor`. Bạn có thể buộc một component "reset" state nội bộ của nó bằng cách [thay đổi `key` của nó](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) khi cần thiết.
>
>Đọc [bài đăng trên blog của chúng tôi về việc tránh derived state](/blog/2018/06/07/you-probably-dont-need-derived-state.html) để tìm hiểu về những gì phải làm nếu bạn nghĩ bạn cần một số state phụ thuộc vào props.


* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

`componentDidMount()` được gọi ngay lập tức sau khi một component được mount (được chèn vào tree). Quá trình khởi tạo mà yêu cầu các DOM node sẽ được thực hiện tại đây. Nếu bạn cần tải dữ liệu từ một remote endpoint, đây là một nơi phù hợp để thực hiện network request.

Phương thức này là một nơi phù hợp để thiết lập subscriptions bất kỳ. Nếu bạn thực hiện điều đó, đừng quên unsubscribe trong `componentWillUnmount()`.

Bạn **có thể gọi `setState()` ngay lập tức** trong `componentDidMount()`. Nó sẽ kích hoạt một lần render bổ sung, nhưng lần render bổ sung sẽ xảy ra trước khi browser cập nhật màn hình. Điều này đảm bảo rằng mặc dù `render()` bị gọi hai lần, nhưng người dùng cũng sẽ không thấy trạng thái trung gian. Sử dụng pattern này một cách cẩn thận bởi vì nó thường gây ra những vấn đề về hiệu suất. Thay vào đó trong hầu hết các trường hợp, bạn nên gán state khởi tạo trong `constructor()`. Tuy nhiên, nó có thể cần thiết cho những trường hợp như modals và tooltips khi bạn cần tính toán một DOM node trước khi render thứ gì mà phụ thuộc vào kích thước hoặc vị trí của node đó.

* * *

### `componentDidUpdate()` {#componentdidupdate}

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

`componentDidUpdate()` được gọi ngay lập tức sau khi quá trình cập nhật diễn ra. Phương thức này không được gọi cho lần render đầu tiên.

Sử dụng phương thức này như một cơ hội để thao tác với DOM khi component cập nhật xong. Đây cũng là một nơi phù hợp để thực hiện các network request miễn là bạn so sánh props hiện tại với props trước đó (e.g. một network request có thể là không cần thiết nếu props không thay đổi).

```js
componentDidUpdate(prevProps) {
  // Cách sử dụng điển hình (đừng quên so sánh props):
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

Bạn **có thể gọi `setState()` ngay lập tức** trong `componentDidUpdate()` nhưng lưu ý rằng **nó phải được đặt trong một điều kiện** như ví dụ phía trên, hoặc bạn sẽ tạo ra một vòng lặp vô hạn. Nó cũng sẽ gây ra một lần render bổ sung, mặc dù người dùng không thấy điều đó, nhưng nó vẫn có thể ảnh hưởng tới hiệu suất của component. Nếu bạn đang cố gắng để "phản chiếu" state nào đó với một prop đến từ phía trên, cân nhắc việc sử dụng trực tiếp prop để thay thế. Đọc thêm về [tại sao việc sao chép props vào state gây ra bugs](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

Nếu component của bạn implement `getSnapshotBeforeUpdate()` lifecycle (khá là hiếm), giá trị mà nó return sẽ được truyền dưới dạng tham số "snapshot" thứ ba tới `componentDidUpdate()`. Nếu không thì tham số này sẽ là undefined.

> Lưu ý
>
> `componentDidUpdate()` sẽ không được gọi nếu [`shouldComponentUpdate()`](#shouldcomponentupdate) return false.

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

`componentWillUnmount()` được gọi ngay trước khi một component bị unmount và destroy. Thực hiện mọi thao tác cleanup cần thiết trong phương thức này, chẳng hạn như invalidating timers, hủy các network request, hoặc cleanup bất kỳ subscription nào mà đã được tạo ra trong `componentDidMount()`.

Bạn **không nên gọi `setState()`** trong `componentWillUnmount()` bởi vì component sẽ không bao giờ được render lại. Một khi mà component instance bị unmount, nó sẽ không bao giờ được mount trở lại.

* * *

### Các Phương Thức Lifecycle Ít Sử Dụng {#rarely-used-lifecycle-methods}

Những phương thức trong phần này tương ứng với các trường hợp sử dụng không phổ biến. Thỉnh thoảng chúng rất hữu ích, nhưng phần lớn các component của bạn có thể sẽ không cần đến bất kỳ phương thức nào trong số chúng. **Bạn có thể thấy hầu hết các phương thức bên dưới trên [lược đồ vòng đời](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) nếu bạn click vào "Show less common lifecycles" checkbox ở phần đầu của lược đồ.**


### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(nextProps, nextState)
```

Sử dụng `shouldComponentUpdate()` để cho phép React biết nếu output của một component không bị ảnh hưởng bởi sự thay đổi của state hoặc props hiện tại. Hành vi mặc định là render lại với mỗi lần state thay đổi, và trong phần lớn các trường hợp bạn nên dựa vào hành vi mặc định đó.

`shouldComponentUpdate()` được gọi trước render khi nhận được props hoặc state mới. Mặc định là `true`. Phương thức này không được gọi ở lần render đầu tiên hoặc khi `forceUpdate()` được sử dụng.

Phương thức này chỉ tồn tại để đóng vai trò trong việc **[tối ưu hóa hiệu suất](/docs/optimizing-performance.html).** Đừng dựa vào nó để "ngăn chặn" việc render, vì điều này có thể dẫn tới bugs. **Cân nhắc sử dụng built-in [`PureComponent`](/docs/react-api.html#reactpurecomponent)** thay vì tự viết `shouldComponentUpdate()`. `PureComponent` thực hiện shallow comparison giữa các prop và state, đồng thời làm giảm thiểu khả năng bạn sẽ bỏ qua một cập nhật cần thiết.

Nếu bạn tự tin rằng bạn muốn tự viết phương thức này, bạn có thể so sánh `this.props` với `nextProps` và `this.state` với `nextState` sau đó return `false` để cho React biết rằng việc cập nhật có thể được bỏ qua. Lưu ý rằng return `false` không ngăn chặn các child component render lại khi state *của chúng* thay đổi.

Chúng tôi không khuyến khích thực hiện kiểm tra deep equality hoặc sử dụng `JSON.stringify()` trong `shouldComponentUpdate()`. Điều này rất kém hiệu quả và và sẽ làm ảnh hưởng xấu tới hiệu suất.

Hiện tại, nếu `shouldComponentUpdate()` return `false`, thì [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate), [`render()`](#render), và [`componentDidUpdate()`](#componentdidupdate) sẽ không được gọi. Trong tương lai, React có thể coi `shouldComponentUpdate()` như là một gợi ý thay vì một strict directive, và return `false` có thể vẫn dẫn đến việc render lại của component.

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

`getDerivedStateFromProps` được gọi ngay trước khi gọi phương thức render, cả ở lần mount ban đầu và các lần cập nhật tiếp theo. Nó nên return một object để cập nhật state, hoặc `null` để không cập nhật.

Phương thức này tồn tại cho [các trường hợp sử dụng hiếm gặp](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) khi state phụ thuộc vào sự thay đổi của props theo thời gian. Ví dụ, nó có thể hữu ích cho việc implement một `<Transition>` component mà so sánh children trước và sau của component đó để quyết định children nào sẽ chuyển động vào và ra.

Deriving state làm cho mã dài dòng và làm các component của bạn khó khăn để suy nghĩ.
[Đảm bảo rằng bạn đã quen với các lựa chọn thay thế đơn giản hơn:](/blog/2018/06/07/you-probably-dont-need-derived-state.html)

* Nếu bạn cần **thực hiện một side effect** (ví dụ, data fetching hoặc một animation) để đáp ứng sự thay đổi về props, sử dụng [`componentDidUpdate`](#componentdidupdate) lifecycle để thay thế.

* Nếu bạn muốn **tính toán lại một số dữ liệu chỉ khi một prop thay đổi**, [sử dụng một memoization helper để thay thế](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).

* Nếu bạn muốn **"reset" một số state khi một prop thay đổi**, cân nhắc tạo một component [fully controlled](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) hoặc [fully uncontrolled với một `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) để thay thế.

Phương thức này không có quyền truy cập vào component instance. Nếu muốn, bạn có thể sử dụng lại mã giữa `getDerivedStateFromProps()` và các phương thức class khác bằng cách trích xuất các hàm pure của component props và state bên ngoài định nghĩa class.

Lưu ý rằng phương thức này được kích hoạt ở *mọi* lần render, bất kể nguyên nhân là gì. Điều này trái ngược với `UNSAFE_componentWillReceiveProps`, chỉ kích hoạt khi parent render lại và không phải do việc `setState` cục bộ.

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(prevProps, prevState)
```

`getSnapshotBeforeUpdate()` được gọi ngay trước khi output của lần render gần nhất được commit tới DOM. Nó cho phép component của bạn lấy một số thông tin từ DOM (ví dụ. vị trí thanh cuộn) trước khi những thông tin đó có khả năng bị thay đổi. Bất kỳ giá trị nào được return bởi phương thức lifecycle này sẽ được truyền dưới dạng tham số cho `componentDidUpdate()`.

Trường hợp sử dụng này không phổ biến, nhưng nó có thể xảy ra trong các UI như một chat thread cần xử lý vị trí thanh cuộn theo cách đặc biệt.

Một giá trị snapshot (hoặc `null`) nên được return.

Ví dụ:

`embed:react-component-reference/get-snapshot-before-update.js`

Ở ví dụ phía trên, điều quan trọng là phải đọc `scrollHeight` property trong `getSnapshotBeforeUpdate` bởi vì có thể có độ trễ giữa các "render" phase lifecycle (như là `render`) và "commit" phase lifecycles (như là `getSnapshotBeforeUpdate` và `componentDidUpdate`).

* * *

### Error boundaries {#error-boundaries}

[Error boundaries](/docs/error-boundaries.html) là những React component mà catch các JavaScript error ở bất kỳ đâu trong child component tree của chúng, log các lỗi đó, và hiển thị một fallback UI để thay thế component tree gặp sự cố. Error boundaries catch các lỗi trong quá trình render, trong các phương thức lifecycle, và trong các constructor của toàn bộ tree bên dưới chúng.

Một class component trở thành một error boundary nếu nó định nghĩa một trong hai (hay cả hai) phương thức lifecycle `static getDerivedStateFromError()` hoặc `componentDidCatch()`. Cập nhật state từ các lifecycle này cho phép bạn bắt một unhandled JavaScript error trong tree bên dưới và hiển thị một fallback UI (User Interface).

Chỉ sử dụng các error boundary cho việc khôi phục từ các ngoại lệ không mong muốn; **đừng cố gắng sử dụng chúng để kiểm soát flow.**

Để biết thêm chi tiết, xem [*Error Handling in React 16*](/blog/2017/07/26/error-handling-in-react-16.html).

> Lưu ý
>
> Error boundaries chỉ catch các lỗi của những component **bên dưới** chúng trong tree. Một error boundary không thể catch một lỗi của chính nó.

### `static getDerivedStateFromError()` {#static-getderivedstatefromerror}
```javascript
static getDerivedStateFromError(error)
```

Lifecycle này được gọi sau khi một component con ném ra một error.
Nó nhận error được ném ra dưới dạng một tham số và sẽ return một giá trị để cập nhật state.

```js{7-10,13-16}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state để lần render tiếp theo sẽ hiển thị fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Bạn có thể render bất kỳ custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

> Lưu ý
>
> `getDerivedStateFromError()` được gọi trong "render" phase, do đó side-effects không được phép thực hiện.
Để thực hiện side-effects, sử dụng `componentDidCatch()` thay thế.

* * *

### `componentDidCatch()` {#componentdidcatch}

```javascript
componentDidCatch(error, info)
```

Lifecycle này được gọi sau khi một component con ném ra một error.
Nó nhận hai tham số:

1. `error` - Error được ném ra.
2. `info` - Một object với một `componentStack` key chứa [thông tin về component nào đã ném ra error](/docs/error-boundaries.html#component-stack-traces).


`componentDidCatch()` được gọi trong "commit" phase, do đó các side-effect được phép thực hiện.
Nó nên được sử dụng cho những việc như log các error:

```js{12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state để lần render tiếp theo sẽ hiển thị fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Bạn có thể render bất kỳ custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

Production và development builds của React tương đối khác biệt về cách thức `componentDidCatch()` xử lý lỗi.

Ở development, các lỗi sẽ nổi lên `window`, có nghĩa là bất kỳ `window.onerror` hoặc `window.addEventListener('error', callback)` sẽ chặn các lỗi mà đã được catch bởi `componentDidCatch()`.

Ở production, thay vào đó, các lỗi sẽ không nổi lên, nghĩa là bất kỳ ancestor error handler sẽ chỉ nhận được các lỗi không được catch bởi `componentDidCatch()`.

> Lưu ý
>
> Trong trường hợp xảy ra lỗi, bạn có thể render một fallback UI với `componentDidCatch()` bằng cách gọi `setState`, nhưng cách này sẽ không được sử dụng nữa trong một phiên bản tương lai.
> Thay vào đó, sử dụng `static getDerivedStateFromError()` để xử lý fallback render.

* * *

### Các Phương Thức Legacy Lifecycle {#legacy-lifecycle-methods}

Các phương thức lifecycle bên dưới được đánh dấu là "legacy". Những phương thức này vẫn hoạt động, nhưng chúng tôi không khuyến khích sử dụng chúng trong mã mới. Bạn có thể tìm hiểu thêm về di dời từ các phương thức legacy lifecycle trong [bài đăng trên blog này](/blog/2018/03/27/update-on-async-rendering.html).

### `UNSAFE_componentWillMount()` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

> Lưu ý
>
> Tên trước đây của lifecycle này là `componentWillMount`. Tên đó sẽ tiếp tục hoạt động cho tới phiên bản 17. Sử dụng [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) để tự động cập nhật các component của bạn.

`UNSAFE_componentWillMount()` được gọi trước khi quá trình mount diễn ra. Nó được gọi trước `render()`, do đó gọi `setState()` một cách đồng bộ trong phương thức này sẽ không gây ra một lần render bổ sung. Nhìn chung, chúng tôi khuyến khích sử dụng `constructor()` để khởi tạo state.

Tránh đặt bất kỳ side-effects hay subscriptions trong phương thức này. Cho những trường hợp như vậy, sử dụng `componentDidMount()` để thay thế.

Đây là phương thức lifecycle duy nhất được gọi trên server rendering.

* * *

### `UNSAFE_componentWillReceiveProps()` {#unsafe_componentwillreceiveprops}

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> Lưu ý
>
> Tên trước đây của lifecycle này là `componentWillReceiveProps`. Tên đó sẽ tiếp tục hoạt động cho tới phiên bản 17. Sử dụng [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) để tự động cập nhật các component của bạn.

> Lưu ý:
>
> Sử dụng phương thức lifecycle này thường dẫn tới bugs và sự thiếu nhất quán
>
> * Nếu bạn cần **thực hiện một side effect** (ví dụ, data fetching hoặc một animation) để đáp ứng sự thay đổi về props, sử dụng [`componentDidUpdate`](#componentdidupdate) lifecycle để thay thế.
> * Nếu bạn sử dụng `componentWillReceiveProps` cho việc **tính toán lại một số dữ liệu chỉ khi một prop thay đổi**, [sử dụng một memoization helper để thay thế](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
> * Nếu bạn sử dụng `componentWillReceiveProps` để **"reset" một số state khi một prop thay đổi**, cân nhắc tạo một component [fully controlled](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) hoặc [fully uncontrolled với một `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) để thay thế.
>
> Đối với những trường hợp khác, [hãy làm theo các khuyến nghị trong bài đăng ở blog này về derived state](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

`UNSAFE_componentWillReceiveProps()` được gọi trước khi một component đã được mount nhận props mới. Nếu bạn cần cập nhật state để đáp lại những thay đổi của prop (ví dụ, đặt lại state), bạn có thể so sánh `this.props` và `nextProps` sau đó thực hiện chuyển đổi state sử dụng `this.setState()` trong phương thức này.

Lưu ý rằng nếu một parent component khiến cho component của bạn render lại, phương thức này sẽ được gọi ngay cả khi props không thay đổi. Đảm bảo rằng hãy so sánh giá trị hiện tại và kế tiếp nếu bạn chỉ muốn xử lý các thay đổi.

React không gọi `UNSAFE_componentWillReceiveProps()` với props khởi tạo trong quá trình [mounting](#mounting). React chỉ gọi phương thức này nếu một số prop của component có thể cập nhật. Gọi `this.setState()` thường không kích hoạt `UNSAFE_componentWillReceiveProps()`.

* * *

### `UNSAFE_componentWillUpdate()` {#unsafe_componentwillupdate}

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

> Lưu ý
>
> Tên trước đây của lifecycle này là `componentWillUpdate`. Tên đó sẽ tiếp tục hoạt động cho tới phiên bản 17. Sử dụng [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) để tự động cập nhật các component của bạn.

`UNSAFE_componentWillUpdate()` được gọi ngay trước render khi component nhận được props hoặc state mới. Sử dụng phương thức này để tiến hành chuẩn bị trước khi quá trình cập nhật xảy ra. Phương thức này không được gọi cho lần render đầu tiên.

Lưu ý rằng bạn không thể gọi `this.setState()` ở trong phương thức này; cũng như không nên làm bất cứ thứ gì khác (ví dụ. dispatch một Redux action) điều đó sẽ gây ra một lần cập nhật cho một React component trước khi `UNSAFE_componentWillUpdate()` return.

Thông thường, phương thức này có thể được thay thế bởi `componentDidUpdate()`. Nếu bạn đã đọc từ DOM trong phương thức này (ví dụ. để lưu vị trí thanh cuộn), bạn có thể di chuyển phần logic đó sang `getSnapshotBeforeUpdate()`.

> Lưu ý
>
> `UNSAFE_componentWillUpdate()` sẽ không được gọi nếu [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.

* * *

## Các API Khác {#other-apis-1}

Không giống các phương thức lifecycle phía trên (React sẽ gọi các phương thức đó cho bạn), các phương thức bên dưới thì *bạn* có thể tự gọi từ các component của bạn.

Chỉ có hai phương thức là: `setState()` và `forceUpdate()`.

### `setState()` {#setstate}

```javascript
setState(updater, [callback])
```

`setState()` tạo ra một hàng đợi những sự thay đổi tới component state và thông báo cho React rằng component này cùng với children của nó cần phải được render lại với state đã được cập nhật. Đây là phương thức chính mà bạn sẽ sử dụng để cập nhật user interface đáp lại các event handler và server response.

Hãy coi `setState()` như một *request* hơn là một mệnh lệnh ngay lập tức để cập nhật component. Để có hiệu suất tốt, React có thể trì hoãn việc cập nhật, và sau đó cập nhật nhiều component trong một lần xử lý. React không đảm bảo rằng các thay đổi đối với state được áp dụng ngay lập tức.

`setState()` không phải lúc nào cũng cập nhật component ngay lập tức. Nó có thể gộp nhóm hoặc trì hoãn việc cập nhật. Điều đó khiến cho việc đọc `this.state` ngay sau khi gọi `setState()` là một cạm bẫy tiềm ẩn. Thay vào đó, sử dụng `componentDidUpdate` hoặc một `setState` callback (`setState(updater, callback)`), một trong hai cách này sẽ đảm bảo việc đọc `this.state` diễn ra sau khi cập nhật được áp dụng. Nếu bạn cần đặt state dựa vào state trước đó, đọc thêm về đối số `updater` bên dưới.

`setState()` sẽ luôn dẫn đến render lại trừ khi `shouldComponentUpdate()` returns `false`. Nếu các mutable object được sử dụng và logic render có điều kiện không thể được thực hiện trong `shouldComponentUpdate()`, gọi `setState()` chỉ khi state mới khác so với state trước đó sẽ tránh được việc render lại mà không cần thiết.

Đối số đầu tiên là một hàm `updater` với signature:

```javascript
(state, props) => stateChange
```

`state` là một tham chiếu tới component state tại thời điểm thay đổi đang được áp dụng. Nó không nên bị thay đổi trực tiếp. Thay vào đó, những sự thay đổi nên được thực hiện bằng cách tạo ra một object mới dựa trên input từ `state` và `props`. Ví dụ, giả sử chúng tôi muốn tăng một giá trị trong state lên `props.step` đơn vị:

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

Cả `state` và `props` mà hàm updater nhận sẽ được đảm bảo cập nhật tới trạng thái mới nhất. Output của updater được shallowly merge với `state`.

Tham số thứ hai truyền cho `setState()` là một optional callback sẽ được thực thi sau khi `setState` hoàn thành và component được render lại. Nhìn chung, chúng tôi khuyến khích sử dụng `componentDidUpdate()` cho những kiểu logic như phía trên.

Bạn có thể truyền một object làm đối số đầu tiên cho `setState()` thay vì một hàm:

```javascript
setState(stateChange[, callback])
```

Ở đoạn mã phía trên, `setState` sẽ thực hiện shallow merge `stateChange` và state mới, ví dụ., để điều chỉnh số lượng mặt hàng trong giỏ hàng:

```javascript
this.setState({quantity: 2})
```

Dạng `setState()` phía trên cũng là bất đồng bộ, và nhiều lời gọi trong cũng một chu kỳ có thể được gộp nhóm lại với nhau. Ví dụ, nếu bạn cố gắng tăng số lượng một mặt hàng lên nhiều hơn một lần trong một chu kỳ, kết quả sẽ tương đương với đoạn mã bên dưới:

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

Các lời gọi tiếp theo sẽ override giá trị của lời gọi trước đó trong cùng một chu kỳ, do đó số lượng chỉ được tăng một lần. Nếu state tiếp theo phụ thuộc vào state hiện tại, chúng tôi khuyến khích sử dụng dạng hàm updater của `setState`:

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

Để biết thêm chi tiết, hãy xem:

* [Hướng dẫn về State và Lifecycle](/docs/state-and-lifecycle.html)
* [Chuyên sâu: Khi nào và tại sao các lời gọi `setState()` được gộp nhóm?](https://stackoverflow.com/a/48610973/458193)
* [Chuyên sâu: Tại sao không cập nhật `this.state` ngay lập tức?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

Mặc định, khi state hoặc props của component thay đổi, component của bạn sẽ render lại. Nếu phương thức `render()` của bạn phụ thuộc vào các dữ liệu khác, bạn có thể thông báo với React rằng component cần được render lại bằng cách gọi `forceUpdate()`.

Gọi `forceUpdate()` sẽ dẫn đến phương thức `render()` của component được gọi, bỏ qua `shouldComponentUpdate()`. Điều này sẽ kích hoạt các phương thức lifecycle thông thường cho các child component, bao gồm phương thức `shouldComponentUpdate()` của mỗi child. React sẽ chỉ cập nhật DOM nếu đánh dấu thay đổi.

Thông thường bạn nên cố gắng tránh sử dụng `forceUpdate()`, chỉ đọc từ `this.props` và `this.state` trong `render()`.

* * *

## Class Properties {#class-properties-1}

### `defaultProps` {#defaultprops}

`defaultProps` có thể được định nghĩa như là một thuộc tính của component class, dùng để đặt props mặc định cho class. Nó được sử dụng cho các `undefined` prop, nhưng không dùng cho các `null` prop. Ví dụ:

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

Nếu `props.color` không được cung cấp, nó sẽ được đặt mặc định là `'blue'`:

```js
  render() {
    return <CustomButton /> ; // props.color sẽ được đặt là blue
  }
```

Nếu `props.color` được đặt là `null`, nó sẽ vẫn được giữ là `null`:

```js
  render() {
    return <CustomButton color={null} /> ; // props.color sẽ vẫn được giữ là null
  }
```

* * *

### `displayName` {#displayname}

Chuỗi `displayName` được sử dụng trong các thông điệp debug. Thông thường, bạn không cần phải đặt nó một cách tường minh bởi vì nó được suy ra từ tên hàm hoặc class mà xác định component. Bạn có thể đặt nó một cách tường minh nếu bạn muốn hiển thị một tên khác cho mục đích debug hoặc khi bạn tạo một higher-order component, xem [Wrap the Display Name for Easy Debugging](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging) để biết thêm chi tiết.

* * *

## Instance Properties {#instance-properties-1}

### `props` {#props}

`this.props` chứa các prop được định nghĩa bởi component mà gọi component này. Xem [Components và Props](/docs/components-and-props.html) cho phần giới thiệu về props.

`this.props.children` là một prop đặc biệt, thường được định nghĩa bởi các child tag trong JSX expression chứ không phải trong chính tag đó.

### `state` {#state}

state chứa dữ liệu đặc trưng của một component và có thể thay đổi theo thời gian. state được người dùng tự định nghĩa, và nó nên là một plain JavaScript object.

Các giá trị không được sử dụng cho việc render hay data flow (ví dụ, một timer ID), bạn không cần thiết phải đặt nó trong state. Những giá trị như thế có thể được định nghĩa như là các field của component instance.

Xem [State và Lifecycle](/docs/state-and-lifecycle.html) để có thêm thông tin về state.

Đừng bao giờ thay đổi `this.state` trực tiếp, vì việc gọi `setState()` sau đó có thể thay thế những sự thay đổi mà bạn đã thực hiện. Coi `this.state` như thể nó là bất biến.
