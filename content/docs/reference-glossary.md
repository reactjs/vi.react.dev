---
id: glossary
title: Bảng chú giải thuật ngữ React
layout: docs
category: Reference
permalink: docs/glossary.html

---

## Single-page Application {#single-page-application}

Single-page application là một ứng dụng tải một trang HTML và tất cả nội dung cần thiết (chẳng hạn như JavaScript và CSS) để ứng dụng chạy. Bất kỳ tương tác nào với trang hoặc chuyển trang tiếp theo sẽ không yêu cầu chuyển đến máy chủ, có nghĩa là sẽ không cần tải lại trang.

Mặc dù bạn có thể xây dựng single-page application trong React, nhưng nó không phải là một yêu cầu bắt buộc. React cũng có thể được sử dụng để tăng cường các phần nhỏ của các trang web hiện có với khả năng tương tác bổ sung. Code được viết bằng React có thể cùng tồn tại với ngôn ngữ kịch bản hiển thị trên máy chủ như PHP, hoặc các thư viện client-side khác. Trên thực tế, đây chính xác là cách React đang được sử dụng tại Facebook.
## ES6, ES2015, ES2016, v.v. {#es6-es2015-es2016-etc}

ất cả các từ viết tắt này đều đề cập đến các phiên bản mới nhất của tiêu chuẩn Đặc tả ngôn ngữ ECMAScript, được triển khai bằng ngôn ngữ Javascript. Phiên bản ES6 (còn được gọi là ES2015) bao gồm nhiều bổ sung cho các phiên bản trước đó như: arrow functions, classes, template literals, `let` và `const`. Bạn có thể tìm hiểu thêm về các phiên bản cụ thể [tại đây](https://en.wikipedia.org/wiki/ECMAScript#Versions).

## Compilers {#compilers}

Một trình biên dịch JavaScript lấy code JavaScript, biến đổi nó và trả về code JavaScript ở một định dạng khác. Trường hợp sử dụng phổ biến nhất là sử dụng cú pháp ES6 và chuyển nó thành cú pháp mà các trình duyệt cũ hơn có khả năng thông dịch. [Babel](https://babeljs.io/) là trình biên dịch được sử dụng phổ biến nhất với React.

## Bundlers {#bundlers}

Bundlers lấy code JavaScript và CSS được viết dưới dạng các mô-đun riêng biệt (thường là hàng trăm mô-đun), và kết hợp chúng với nhau thành một số tệp được tối ưu hóa tốt hơn cho trình duyệt. Một số Bundlers thường được sử dụng trong các ứng dụng React bao gồm [Webpack](https://webpack.js.org/) và [Browserify](http://browserify.org/).

## Package Managers {#package-managers}

Package managers là công cụ cho phép bạn quản lý các phần phụ thuộc trong dự án của mình. [npm](https://www.npmjs.com/) và [Yarn](https://yarnpkg.com/) là hai package managers thường được sử dụng trong các ứng dụng React. Cả hai đều ở phía clients và cùng quản lý thư viện bằng npm.

## CDN {#cdn}

CDN là viết tắt của Content Delivery Network. CDN cung cấp nội dung tĩnh, được lưu trong bộ nhớ cache từ một mạng máy chủ trên toàn cầu.

## JSX {#jsx}

JSX là một phần mở rộng cú pháp cho JavaScript. Nó tương tự một ngôn ngữ template, nhưng nó có đầy đủ sức mạnh của JavaScript. JSX được biên dịch thành `React.createElement()` được gọi trả về JavaScript thuần gọi là "React elements". Để biết về JSX giới thiệu cơ bản, [xem tài liệu tại đây](/docs/introducing-jsx.html) và tìm hướng dẫn chuyên sâu hơn về JSX [tại đây](/docs/jsx-in-depth.html).

React DOM sử dụng quy ước đặt tên thuộc tính camelCase thay vì tên thuộc tính HTML. Ví dụ, `tabindex` trở thành `tabIndex` trong JSX. Thuộc tính `class` cũng được viết dưới dạng `className` kể từ khi `class` là một từ dành riêng trong JavaScript:

```jsx
<h1 className="hello">My name is Clementine!</h1>
```

## [Elements](/docs/rendering-elements.html) {#elements}

React elements là các khối xây dựng của các ứng dụng React. Người ta có thể nhầm lẫn các element với một khái niệm được biết đến rộng rãi hơn là "components". Một element mô tả những gì bạn muốn xem trên màn hình. Các phần tử React là bất biến.

```js
const element = <h1>Hello, world</h1>;
```

Thông thường, các phần tử không được sử dụng trực tiếp mà được trả về từ các components.

## [Components](/docs/components-and-props.html) {#components}

React components là các đoạn mã nhỏ, có thể tái sử dụng, trả về một React element để được hiển thị trên trang. Phiên bản đơn giản nhất của React component là một hàm JavaScript thuần túy trả về một React element:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Các thành phần cũng có thể là các lớp ES6:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Components có thể được chia nhỏ thành các phần chức năng riêng biệt và được sử dụng trong các components khác. Components có thể trả về các components, arrays, strings và numbers. Một nguyên tắc chung là nếu một phần của giao diện người dùng của bạn được sử dụng nhiều lần (Button, Panel, Avatar), hoặc tự nó đủ phức tạp (App, FeedStory, Comment), thì nó là một ứng cử viên sáng giá để trở thành một component có thể tái sử dụng. Tên component cũng phải luôn bắt đầu bằng chữ in hoa (`<Wrapper/>` **không phải** `<wrapper/>`). Xem [tài liệu này](/docs/components-and-props.html#rendering-a-component) để biết thêm thông tin về hiển thị components. 

### [`props`](/docs/components-and-props.html) {#props}

`props` là đầu vào cho một React component. Chúng là dữ liệu được truyền từ component cha sang component con.

Hãy nhớ rằng `props` chỉ có thể đọc. Chúng không nên được sửa đổi theo bất kỳ cách nào:

```js
// Wrong!
props.number = 42;
```

Nếu bạn cần sửa đổi một số giá trị để phản hồi thông tin đầu vào của người dùng hoặc phản hồi mạng, hãy sử dụng `state` để thay thế.

### `props.children` {#propschildren}

`props.children` có sẵn trên mọi component. Nó chứa nội dung giữa thẻ mở và thẻ đóng của một component. Ví dụ:

```js
<Welcome>Hello world!</Welcome>
```

Chuỗi  `Hello world!` có sẵn trong `props.children` của `Welcome` component:

```js
function Welcome(props) {
  return <p>{props.children}</p>;
}
```

Đối với các thành phần được định nghĩa là các class, hãy sử dụng `this.props.children`:

```js
class Welcome extends React.Component {
  render() {
    return <p>{this.props.children}</p>;
  }
}
```

### [`state`](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) {#state}

Một component cần `state` khi một số dữ liệu được liên kết với nó thay đổi theo thời gian. Ví dụ, một `Checkbox` component có thể cần state `isChecked` và một `NewsFeed` component có thể muốn theo dõi state `fetchedPosts`.

Sự khác biệt quan trọng nhất giữa `state` và `props` là `props` được truyền từ một component cha, nhưng `state` được quản lý bởi chính component đó. Một component không thể thay đổi `props`, nhưng nó có thể thay đổi `state`.

Đối với mỗi phần dữ liệu thay đổi cụ thể, chỉ nên có một component "sở hữu" state đó. Đừng cố gắng đồng bộ hóa state của hai component khác nhau. Thay vào đó, hãy [nâng nó lên](/docs/lifting-state-up.html) tới cha chung gần nhất của họ, và truyền lại props xuống cho cả hai.

## [Phương thức Lifecycle](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) {#lifecycle-methods}

Lifecycle là chức năng tùy chỉnh được thực thi trong các giai đoạn khác nhau của một component. Có các phương thức khả dụng khi thành phần được tạo và chèn vào DOM ([mounting](/docs/react-component.html#mounting)), khi thành phần cập nhật và khi thành phần được ngắt kết nối hoặc xóa khỏi DOM.

 ## [Controlled](/docs/forms.html#controlled-components) vs. [Uncontrolled Components](/docs/uncontrolled-components.html)

React có hai cách tiếp cận khác nhau để xử lý các đầu vào của form inputs. 

Một input form có giá trị được kiểm soát bởi React được gọi là *controlled component*. Khi người dùng nhập dữ liệu vào một controlled component, trình xử lý sự kiện thay đổi sẽ được kích hoạt và mã của bạn quyết định xem đầu vào có hợp lệ hay không (bằng cách hiển thị lại với giá trị được cập nhật). Nếu bạn không re-render thì form element sẽ không thay đổi

Một *uncontrolled component*  giống như các form element hoạt động bên ngoài React. Khi người dùng nhập dữ liệu vào một form field (một input box, dropdown, etc), thông tin cập nhật sẽ được phản ánh mà React không cần phải làm gì cả. Tuy nhiên, điều này cũng có nghĩa là bạn không thể buộc trường phải có một giá trị nhất định.

Trong hầu hết các trường hợp, bạn nên sử dụng controlled components.

## [Keys](/docs/lists-and-keys.html) {#keys}

Một "key" là một thuộc tính chuỗi đặc biệt mà bạn cần đưa vào khi tạo mảng các elements. Keys giúp React xác định những mục nào đã thay đổi, được thêm vào hoặc bị xóa. Các Key phải được cấp cho các phần tử bên trong một mảng để cung cấp cho các phần tử một định danh ổn định.

Keys chỉ cần là duy nhất giữa các phần tử anh em trong cùng một mảng. Chúng không cần phải là duy nhất trên toàn bộ ứng dụng hoặc thậm chí là một thành phần duy nhất.

Đừng truyền thứ gì đó như `Math.random()` vào keys. Điều quan trọng là các key phải có "định danh ổn định" qua các lần hiển thị lại để React có thể xác định khi nào các mục được thêm, xóa hoặc sắp xếp lại. Tốt nhất, các key phải tương ứng với các số nhận dạng duy nhất và ổn định đến từ dữ liệu của bạn, chẳng hạn như `post.id`.

## [Refs](/docs/refs-and-the-dom.html) {#refs}

React hỗ trợ một thuộc tính đặc biệt mà bạn có thể đính kèm vào bất kỳ thành phần nào. Các thuộc tính `ref` có thể là một đối tượng được tạo ra bởi [`React.createRef()` function](/docs/react-api.html#reactcreateref) hoặc một callback function, hoặc string (trong API cũ). Khi thuộc tính `ref` là một callback function, hàm nhận phần tử DOM cơ bản hoặc class (tùy thuộc vào loại phần tử) làm đối số của nó. Điều này cho phép bạn có quyền truy cập trực tiếp vào phần tử DOM hoặc cá thể component.

Hãy sử dụng refs một cách tiết kiệm. Nếu bạn thấy mình thường sử dụng refs để "làm mọi thứ" trong ứng dụng của mình, hãy cân nhắc làm quen hơn với [top-down data flow](/docs/lifting-state-up.html).

## [Events](/docs/handling-events.html) {#events}

Xử lý các event với React elements có một số khác biệt về cú pháp:

* Các trình xử lý event trong React được đặt tên bằng cách sử dụng camelCase, thay vì chữ thường.
* Với JSX bạn có thể truyền một function làm một trình xử lý event, thay vì một string.

## [Reconciliation](/docs/reconciliation.html) {#reconciliation}

Khi component's props hoặc state thay đổi, sẽ quyết định xem liệu bản cập nhật DOM thực sự có cần thiết hay không bằng cách so sánh phần tử mới được trả về với phần tử được hiển thị trước đó. Khi chúng không bằng nhau, React sẽ cập nhật DOM. Quá trình này được gọi là "reconciliation".
