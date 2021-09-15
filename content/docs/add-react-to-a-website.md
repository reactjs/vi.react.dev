---
id: add-react-to-a-website
title: Thêm React vào một Website
permalink: docs/add-react-to-a-website.html
redirect_from:
  - "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

Sử dụng ít hay nhiều React tuỳ theo nhu cầu của bạn.

React được thiết kế nhằm mục đích thích ứng khả chuyển, và **bạn có thể sử dụng ít hay nhiều React tuỳ theo nhu cầu của bạn**. Có thể bạn chỉ muốn thêm một vài tính năng tương tác vào trong trang hiện có. React components là một cách tuyệt vời để thực hiện điều đó.

Đa phần các websites đều không phải, và cũng không cần thiết phải là single-page apps. Với **một vài dòng code và không cần công cụ build**, áp dụng React vào một phần nhỏ trong website của bạn. Sau đó bạn có thể mở rộng dần dần sự hiện diện của nó, hoặc giữ cho website chỉ sử dụng một vài dynamic widgets.

---

- [Thêm React trong vòng một phút](#add-react-in-one-minute)
- [Tuỳ chọn: Thử React với JSX](#optional-try-react-with-jsx) (không cần phải có bundler!)

## Thêm React trong vòng một phút {#add-react-in-one-minute}

Trong phần này, chúng tôi sẽ trình bày về cách làm thế nào để thêm một React component vào một trang HTML đang có. Bạn có thể áp dụng với trang web của bạn, hoặc tạo một file HTML trống để luyện tập.

Sẽ không cần đến các công cụ phức tạp hoặc các cài đặt khác -- **để hoàn thiện phần này, bạn chỉ cần kết nối mạng internet, và một khoảng thời gian tầm một phút.**

Tuỳ chọn: [Tải xuống ví dụ đầy đủ (2KB zipped)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)

### Bước 1: Thêm DOM Container vào HTML {#step-1-add-a-dom-container-to-the-html}

Đầu tiên, mở trang HTML mà bạn muốn chỉnh sửa. Thêm thẻ `<div>` rỗng để đánh dấu chỗ mà bạn muốn hiển thị một phần tử nào đó với React. Ví dụ:

```html{3}
<!-- ... existing HTML ... -->

<div id="like_button_container"></div>

<!-- ... existing HTML ... -->
```

Chúng ta gán thuộc tính HTML `id` của thẻ `<div>` với giá trị duy nhất. Điều này sẽ cho phép chúng ta tìm thấy phần tử này từ Javascript code và hiển thị một React component bên trong nó.

>Tip
>
>Bạn có thể thay thế "container" `<div>` như thế này **ở bất cứ đâu** bên trong thẻ `<body>`. Bạn có thể có nhiều các containers DOM độc lập trong một trang tuỳ theo nhu cầu. Chúng thường ở trạng thái trống -- React sẽ thay thế bất kì nội dung nào đang tồn tại bên trong DOM containers.

### Bước 2: Thêm các thẻ Script (Script Tags) {#step-2-add-the-script-tags}

Tiếp theo, thêm ba thẻ `<script>` vào trang HTML ngay trước thẻ đóng `</body>`:

```html{5,6,9}
  <!-- ... other HTML ... -->

  <!-- Load React. -->
  <!-- Note: when deploying, replace "development.js" with "production.min.js". -->
  <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>

  <!-- Load our React component. -->
  <script src="like_button.js"></script>

</body>
```

Hai thẻ đầu tiên sẽ load React. Thẻ thứ ba sẽ load component code của bạn.

### Bước 3: Tạo một React Component {#step-3-create-a-react-component}

Tạo một file với tên `like_button.js` cùng với trang HTML của bạn.

Mở **[đoạn code khởi tạo sau](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** và dán nó vào trong file mà bạn vừa tạo.

>Tip
>
>Đoạn code này định nghĩa một React component gọi là `LikeButton`. Đừng lo lắng nếu bạn không hiểu nó ngay lập tức -- chúng tôi sẽ giải thích về building blocks của React trong phần [hands-on tutorial](/tutorial/tutorial.html) của chúng tôi và [hướng dẫn các khái niệm chính](/docs/hello-world.html). Còn bây giờ, hãy cùng hiển thị chúng trên màn hình!

Sau **[đoạn code khởi tạo](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)**, thêm 2 dòng vào cuối file `like_button.js`:

```js{3,4}
// ... Đoạn code khởi tạo bạn vừa dán ...

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);
```

Hai dòng code này tìm thẻ `<div>` mà chúng ta đã thêm vào trang HTML ở bước đầu tiên, và sau đó hiển thị nút "Like" - một React component bên trong div ở trên.

### Và đó là tất cả những gì cần làm! {#thats-it}

Sẽ không có bước thứ tư. **Bạn đã hoàn thành việc thêm React component đầu tiên vào website của bạn.**

Chuyển qua phần tiếp theo với nhiều tips hơn trong việc tích hợp React.

**[Xem toàn bộ source code của ví dụ](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[Tải xuống đầy đủ ví dụ (2KB zipped)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)**

### Tip: Tái sử dụng một component {#tip-reuse-a-component}

Thông thường, có thể bạn muốn hiển thị các React components trong nhiều chỗ của trang HTML. Đây là một ví dụ dùng để hiển thị nút "Like" 3 lần và truyền thêm một vài dữ liệu vào trong nó::

[Xem toàn bộ source code của ví dụ](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

[Tải xuống đầy đủ ví dụ (2KB zipped)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/9d0dd0ee941fea05fd1357502e5aa348abb84c12.zip)

>Ghi chú
>
>Cách làm này rất hữu dụng trong khi các phần hỗ trợ React của trang nằm tách biệt so với các phần khác. Trong React code, thay vào đó lại khá dễ dàng để sử dụng [component composition](/docs/components-and-props.html#composing-components).

### Tip: Minify (thu nhỏ) JavaScript cho Production {#tip-minify-javascript-for-production}

Trước khi deploy website của bạn lên môi trường production, hãy chú ý rằng unminified JavaScript (JavaScript code chưa nén - chưa thu nhỏ) có thể làm chậm đáng kể tốc độ tải trang ở phía người dùng (client).

Nếu bạn đã nén các scripts của ứng dụng, **trang của bạn sẽ sẵn sàng để được deploy lên môi trường production** nếu bạn đảm bảo rằng HTML đã deploy sẽ tải phiên bản của React được chứa trong file `production.min.js`:

```js
<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>
```

Nếu bạn không có bước nén - thu nhỏ cho scripts, thì [đây là một cách thiết lập](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).

## Tuỳ chọn: Trải nghiệm React với JSX {#optional-try-react-with-jsx}

Trong các ví dụ ở trên, chúng ta chỉ dựa trên các tính năng được hỗ trợ bởi trình duyệt. Đó chính là lý do tại sao chúng ta lại sử dụng lời gọi hàm của Javascript để gửi đến React những gì ta muốn hiển thị:

```js
const e = React.createElement;

// Hiển thị một "Like" <button>
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Like'
);
```

Dù sao thì, React cũng cung cấp một tuỳ chọn để sử dụng [JSX](/docs/introducing-jsx.html) để thay thế:

```js
// Hiển thị một "Like" <button>
return (
  <button onClick={() => this.setState({ liked: true })}>
    Like
  </button>
);
```

Hai đoạn code trên là tương đương nhau. Trong khi **JSX [hoàn toàn là tuỳ chọn](/docs/react-without-jsx.html)**, nhiều người thấy rằng nó khá hữu ích cho việc viết UI code -- cả với React và với các thư viện khác.

Bạn có thể trải nghiệm với JSX bằng cách sử dụng [bộ chuyển đổi online](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.4.3).

### Thử nhanh JSX {#quickly-try-jsx}

Cách nhanh nhất để thử JSX trong project của bạn đó là thêm thẻ `<script>` vào trang của bạn:

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

Bây giờ bạn có thể sử dụng JSX trong bất kì thẻ `<script>` nào bằng cách thêm thuộc tính `type="text/babel"` cho nó. Đây là [file HTML ví dụ với JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html) mà bạn có thể tải xuống và chạy thử nó.

Cách tiếp cận này khá ổn cho việc học và tạo các ví dụ demos đơn giản. Nhưng dù sao thì, nó cũng khiến cho website của bạn chậm và **không phù hợp cho môi trường production**. Khi bạn đã sẵn sàng để tiếp tục, hãy loại bỏ thẻ `<script>` này và thuộc tính `type="text/babel"` mà bạn vừa thêm. Thay vào đó, trong phần tiếp theo bạn sẽ thiết lập 1 bộ tiền xử lí (preprocessor) JSX để chuyển đổi các thẻ `<script>` một cách tự động.

### Thêm JSX vào Project {#add-jsx-to-a-project}

Thêm JSX vào project không yêu cầu những công cụ phức tạp như bundler hoặc một development server. Cụ thể là, thêm JSX **khá giống như thêm 1 bộ tiền xử lí (preprocessor) của CSS.** Yêu cầu duy nhất đó là bạn phải cài đặt [Node.js](https://nodejs.org/) trong máy tính.

Di chuyển đến thư mục project của bạn trong terminal, dán và thực thi 2 câu lệnh sau:

1. **Bước 1:** Chạy `npm init -y` (nếu thất bại, [đây là link hướng dẫn cách sửa](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. **Bước 2:** Chạy `npm install babel-cli@6 babel-preset-react-app@3`

>Tip
>
>Chúng ta **đang chỉ sử dụng npm ở đây để cài đặt JSX preprocessor;** bạn sẽ không cần nó cho bất kì mục đích nào khác. Cả React và application code có thể nằm trong thẻ `<script>` mà không có sự thay đổi nào.

Chúc mừng! Bạn vừa thêm **production-ready JSX setup** cho project của bạn.


### Chạy JSX Preprocessor {#run-jsx-preprocessor}

Tạo một thư mục có tên là `src` và chạy câu lệnh terminal sau đây:

```
npx babel --watch src --out-dir . --presets react-app/prod
```

>Chú ý
>
>`npx` không phải lỗi đánh máy -- Nó là [công cụ chạy package đi cùng với npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).
>
>Nếu bạn thấy thông báo lỗi "You have mistakenly installed the `babel` package", bạn có thể đã bỏ lỡ [bước trước](#add-jsx-to-a-project). Thực thi nó trong cùng một thư mục, và thử lại sau đó.

Đừng đợi cho đến khi nó kết thúc -- Câu lệnh này sẽ bắt đầu theo dõi JSX một cách tự động.

Nếu bạn tạo một file với tên `src/like_button.js` với **[đoạn code JSX này](https://gist.github.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)**, watcher sẽ tạo một preprocessed `like_button.js` với code Javascript thuần túy phù hợp với trình duyệt. Khi bạn chỉnh sửa file nguồn với JSX, bộ thông dịch sẽ tự động chạy lại.

Thông tin thêm, điều này cũng cho phép bạn sử dụng các cú pháp Javascript hiện đại như classes mà không cần phải lo lắng về vấn đề tương thích với các trình duyệt thế hệ cũ. Công cụ chúng ta vừa sử dụng được gọi là Babel, và bạn có thể nghiên cứu thêm về nó thông qua [tài liệu](https://babeljs.io/docs/en/babel-cli/).

Nếu bạn nhận thấy rằng bạn đang có được sự tiện lợi với các công cụ build và muốn chúng làm nhiều thứ hơn cho bạn, [phần tiếp theo](/docs/create-a-new-react-app.html) sẽ trình bày về một vài công cụ phổ biến và dễ tiếp cận nhất. Nếu không - các thẻ scripts vẫn là một sự lựa chọn ổn cho bạn!
