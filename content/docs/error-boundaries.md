---
id: error-boundaries
title: Error Boundaries
permalink: docs/error-boundaries.html
---

Trước đây, các lỗi JavaScript bên trong các thành phần được sử dụng để làm hỏng trạng thái bên trong của React và khiến
nó [emit](https://github.com/facebook/react/issues/4026) [cryptic](https://github.com/facebook/react/issues/6895) [errors](https://github.com/facebook/react/issues/8579)
vào lần hiển thị tiếp theo. Những lỗi này luôn do lỗi trước đó trong mã ứng dụng gây ra, nhưng React không cung cấp cách
xử lý chúng một cách linh hoạt trong các thành phần và không thể khôi phục chúng.

## Introducing Error Boundaries {#introducing-error-boundaries}

Lỗi JavaScript trong một phần của giao diện người dùng sẽ không làm hỏng toàn bộ ứng dụng. Để giải quyết vấn đề này cho
người dùng React, React 16 giới thiệu một khái niệm mới về “error boundary”.

Ranh giới lỗi là các thành phần React **bắt lỗi JavaScript ở bất kỳ đâu trong cây thành phần con của chúng, ghi lại
các lỗi đó và hiển thị giao diện người dùng dự phòng** thay vì cây thành phần bị rơi. Các ranh giới lỗi bắt lỗi trong
quá trình kết xuất, trong các phương thức vòng đời và trong các hàm tạo của toàn bộ cây bên dưới chúng.

> Note
>
> Ranh giới lỗi *không* bắt lỗi đối với:
>
> * Trình xử lý sự kiện ([learn more](#how-about-event-handlers))
> * Code bất đồng bộ (e.g. `setTimeout` or `requestAnimationFrame` callbacks)
> * Server side rendering
> * Lỗi được tạo ra trong chính ranh giới lỗi (chứ không phải con của nó)

Một thành phần lớp trở thành một ranh giới lỗi nếu nó xác định một trong hai (hoặc cả hai) phương thức vòng
đời [`static getDerivedStateFromError()`](/docs/react-component.html#static-getderivedstatefromerror)
hoặc [`componentDidCatch()`](/docs/react-component.html#componentdidcatch). Sử dụng `static getDerivedStateFromError()`
để hiển thị một giao diện người dùng dự phòng sau khi một lỗi đã được tạo ra. Để `componentDidCatch()` ghi lỗi
information.

```js{7-10,12-15,18-21}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

Sau đó, bạn có thể sử dụng nó như một thành phần thông thường:

```js
<ErrorBoundary>
  <MyWidget/>
</ErrorBoundary>
```

Các ranh giới lỗi hoạt động giống như một khối JavaScript `catch {}`, nhưng đối với các thành phần. Chỉ các thành phần
lớp mới có thể là ranh giới lỗi. Trong thực tế, hầu hết thời gian bạn sẽ muốn khai báo một thành phần ranh giới lỗi một
lần và sử dụng nó trong toàn bộ ứng dụng của mình.

Lưu ý rằng **ranh giới lỗi chỉ bắt lỗi trong các thành phần bên dưới chúng trong cây**. Ranh giới lỗi không thể tự bắt
lỗi.
Nếu một ranh giới lỗi không cố gắng hiển thị thông báo lỗi, lỗi sẽ lan truyền đến ranh giới lỗi gần nhất phía trên nó.
Điều này cũng tương tự như cách khối catch {} hoạt động trong JavaScript.

## Live Demo {#live-demo}

<<<<<<< HEAD
Check out [this example of declaring and using an error boundary](https://codepen.io/gaearon/pen/wqvxGa?editors=0010)
with [React 16](/blog/2017/09/26/react-v16.0.html).
=======
Check out [this example of declaring and using an error boundary](https://codepen.io/gaearon/pen/wqvxGa?editors=0010).

>>>>>>> 8223159395aae806f8602de35e6527d35260acfb

## Where to Place Error Boundaries {#where-to-place-error-boundaries}

Mức độ chi tiết của ranh giới lỗi là tùy thuộc vào bạn. Bạn có thể bao bọc các thành phần tuyến cấp cao nhất để hiển thị
thông báo “Đã xảy ra sự cố” cho người dùng, giống như cách các khuôn khổ phía máy chủ thường xử lý các sự cố. Bạn cũng
có thể bao bọc các widget riêng lẻ trong một ranh giới lỗi để bảo vệ chúng khỏi làm hỏng phần còn lại của ứng dụng.

## New Behavior for Uncaught Errors {#new-behavior-for-uncaught-errors}

Sự thay đổi này có một hàm ý quan trọng. **Kể từ React 16, các lỗi không nằm trong bất kỳ ranh giới lỗi nào sẽ dẫn đến
việc ngắt kết nối toàn bộ cây thành phần React.**

Chúng tôi đã tranh luận về quyết định này, nhưng theo kinh nghiệm của chúng tôi, việc để lại giao diện người dùng bị
hỏng tại chỗ còn tệ hơn là xóa hoàn toàn. Ví dụ: trong một sản phẩm như Messenger, việc hiển thị giao diện người dùng bị
hỏng có thể dẫn đến việc ai đó gửi tin nhắn đến nhầm người. Tương tự, ứng dụng thanh toán hiển thị sai số tiền còn tệ
hơn là không hiển thị gì.

Thay đổi này có nghĩa là khi bạn chuyển sang React 16, bạn có thể sẽ phát hiện ra các lỗi hiện có trong ứng dụng của
mình mà trước đây chưa được chú ý. Thêm ranh giới lỗi cho phép bạn cung cấp trải nghiệm người dùng tốt hơn khi có sự cố.

Ví dụ: Facebook Messenger kết hợp nội dung của thanh bên, bảng thông tin, nhật ký cuộc trò chuyện và đầu vào tin nhắn
thành các ranh giới lỗi riêng biệt. Nếu một số thành phần trong một trong các khu vực giao diện người dùng này gặp sự
cố, phần còn lại của chúng vẫn tương tác.

Chúng tôi cũng khuyến khích bạn sử dụng các dịch vụ báo cáo lỗi JS (hoặc xây dựng của riêng bạn) để bạn có thể tìm hiểu
về các trường hợp ngoại lệ không được khắc phục khi chúng xảy ra trong quá trình sản xuất và khắc phục chúng.

## Component Stack Traces {#component-stack-traces}

React 16 in tất cả các lỗi xảy ra trong quá trình hiển thị cho bảng điều khiển đang phát triển, ngay cả khi ứng dụng vô
tình nuốt chúng. Ngoài thông báo lỗi và ngăn xếp JavaScript, nó cũng cung cấp dấu vết ngăn xếp thành phần. Bây giờ bạn
có thể thấy vị trí chính xác trong cây thành phần mà lỗi đã xảy ra:

<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="Error caught by Error Boundary component">

Bạn cũng có thể xem tên tệp và số dòng trong dấu vết ngăn xếp thành phần. Điều này hoạt động theo mặc định
trong [Create React App](https://github.com/facebookincubator/create-react-app) projects:

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="Error caught by Error Boundary component with line numbers">

Nếu không sử dụng Tạo ứng dụng React, bạn có thể
thêm [this plugin](https://www.npmjs.com/package/@babel/plugin-transform-react-jsx-source) theo cách thủ công với cấu
hình Babel của bạn. Lưu ý rằng nó chỉ nhằm mục đích phát triển và **phải bị vô hiệu hóa trong quá trình sản xuất**.

> Ghi chú
>
> Tên thành phần được hiển thị trong dấu vết ngăn xếp phụ thuộc vào các
> [`Function.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name)
> tài sản. Nếu bạn hỗ trợ các trình duyệt và thiết bị cũ hơn có thể chưa cung cấp tính năng này (ví dụ: IE 11), hãy xem
> xét đưa polyfill `Function.name` vào ứng dụng đi kèm của bạn, chẳng hạn
> như [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name). Ngoài ra, bạn có thể đặt rõ
> ràng [`displayName`](/docs/react-component.html#displayname) tài sản trên tất cả các thành phần của bạn.

## How About try/catch? {#how-about-trycatch}

`try` / `catch` thật tuyệt nhưng nó chỉ hoạt động đối với mã mệnh lệnh:

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

Tuy nhiên, các thành phần React là khai báo và chỉ định *những gì* sẽ được hiển thị

```js
<Button/>
```

Các ranh giới lỗi bảo toàn bản chất khai báo của React và hoạt động như bạn mong đợi. Ví dụ: ngay cả khi lỗi xảy ra
trong phương thức `componentDidUpdate` do` setState` ở đâu đó sâu trong cây, nó vẫn sẽ truyền chính xác đến ranh giới
lỗi gần nhất.

## How About Event Handlers? {#how-about-event-handlers}

Ranh giới lỗi **không bắt lỗi** bên trong trình xử lý sự kiện.

React không cần ranh giới lỗi để khôi phục lỗi trong trình xử lý sự kiện. Không giống như phương thức kết xuất và phương
thức vòng đời, trình xử lý sự kiện không xảy ra trong quá trình kết xuất. Vì vậy, nếu họ ném, React vẫn biết những gì sẽ
hiển thị trên màn hình.

Nếu bạn cần bắt lỗi bên trong trình xử lý sự kiện, hãy sử dụng câu lệnh JavaScript thông thường `try` `catch`:

```js{9-13,17-20}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // Do something that could throw
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return <button onClick={this.handleClick}>Click Me</button>
  }
}
```

Lưu ý rằng ví dụ trên thể hiện hành vi JavaScript thông thường và không sử dụng ranh giới lỗi.

## Naming Changes from React 15 {#naming-changes-from-react-15}

React 15 bao gồm một hỗ trợ rất hạn chế cho các ranh giới lỗi dưới một tên phương thức khác: `stable_handleError`.
Phương pháp này không còn hoạt động nữa và bạn sẽ cần phải thay đổi nó thành `componentDidCatch` trong mã của mình bắt
đầu từ bản phát hành 16 beta đầu tiên.

Đối với thay đổi này, chúng tôi đã cung cấp [codemod](https://github.com/reactjs/react-codemod#error-boundaries) để tự
động di chuyển mã của bạn.
