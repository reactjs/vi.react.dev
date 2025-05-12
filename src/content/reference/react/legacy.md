---
title: "API React Kế Thừa"
---

<Intro>

Các API này được xuất từ gói `react`, nhưng chúng không được khuyến nghị sử dụng trong mã mới viết. Xem các trang API riêng lẻ được liên kết để biết các giải pháp thay thế được đề xuất.

</Intro>

---

## Các API Kế Thừa {/*legacy-apis*/}

* [`Children`](/reference/react/Children) cho phép bạn thao tác và chuyển đổi JSX nhận được dưới dạng prop `children`. [Xem các giải pháp thay thế.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) cho phép bạn tạo một phần tử React bằng cách sử dụng một phần tử khác làm điểm bắt đầu. [Xem các giải pháp thay thế.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) cho phép bạn định nghĩa một component React dưới dạng một lớp JavaScript. [Xem các giải pháp thay thế.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) cho phép bạn tạo một phần tử React. Thông thường, bạn sẽ sử dụng JSX thay thế.
* [`createRef`](/reference/react/createRef) tạo một đối tượng ref có thể chứa giá trị tùy ý. [Xem các giải pháp thay thế.](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) cho phép component của bạn hiển thị một nút DOM cho component cha với một [ref.](/learn/manipulating-the-dom-with-refs)
* [`isValidElement`](/reference/react/isValidElement) kiểm tra xem một giá trị có phải là một phần tử React hay không. Thường được sử dụng với [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) tương tự như [`Component`,](/reference/react/Component) nhưng nó bỏ qua việc render lại với các props giống nhau. [Xem các giải pháp thay thế.](/reference/react/PureComponent#alternatives)

---

## Các API Đã Xóa {/*removed-apis*/}

Các API này đã bị xóa trong React 19:

* [`createFactory`](https://18.react.dev/reference/react/createFactory): sử dụng JSX thay thế.
* Class Components: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): sử dụng [`static contextType`](#static-contexttype) thay thế.
* Class Components: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): sử dụng [`static contextType`](#static-contexttype) thay thế.
* Class Components: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): sử dụng [`Context.Provider`](/reference/react/createContext#provider) thay thế.
* Class Components: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): sử dụng một hệ thống kiểu như [TypeScript](https://www.typescriptlang.org/) thay thế.
* Class Components: [`this.refs`](https://18.react.dev//reference/react/Component#refs): sử dụng [`createRef`](/reference/react/createRef) thay thế.
