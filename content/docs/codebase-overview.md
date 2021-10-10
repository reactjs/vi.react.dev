---
id: codebase-overview
title: Tổng quan về Codebase
layout: contributing
permalink: docs/codebase-overview.html
prev: how-to-contribute.html
next: implementation-notes.html
redirect_from:
  - "contributing/codebase-overview.html"
---

Phần này sẽ cung cấp cho bạn tổng quan về tổ chức codebase React, các quy ước của nó và cách triển khai.

Nếu bạn muốn [đóng góp cho React](/docs/how-to-contribute.html), chúng tôi hy vọng rằng hướng dẫn này sẽ giúp bạn cảm thấy thuận tiện hơn khi thực hiện các thay đổi.

Chúng tôi không nhất thiết phải đề xuất bất kỳ quy ước nào trong số này trong ứng dụng React. Nhiều quy tắc này có thể thay đổi theo thời gian.

### Top-Level Folders {#top-level-folders}

Sau khi clone [React repository](https://github.com/facebook/react), bạn sẽ thấy một vài thư mục top-level trong đó:

* [`packages`](https://github.com/facebook/react/tree/main/packages) chứa metadata (như `package.json`) và the source code (thư mục con `src` ) cho tất cả các package trong React repository. **Nếu thay đổi của bạn liên quan đến mã nguồn, thư mục con src của mỗi package sẽ là nơi bạn dành phần lớn thời gian để làm việc.**
* [`fixtures`](https://github.com/facebook/react/tree/main/fixtures) chứa một vài ứng dụng React kiểm thử cho những người đóng góp
* `build` là kết quả của quá trình build của React. Nó không có trong repository nhưng sẽ xuất hiện trong bản clone React của bạn sau khi bạn [build nó](/docs/how-to-contribute.html#development-workflow) lần đầu tiên

Tài liệu được lưu trữ [trong một repository từ React](https://github.com/reactjs/reactjs.org).

Có một số thư mục top-level khác nhưng chúng chủ yếu được sử dụng cho công cụ và bạn có thể sẽ không bao giờ gặp phải khi đóng góp.

### Colocated Tests {#colocated-tests}

Chúng tôi không có thư mục top-level cho các việc thực hiện unit test. Thay vào đó, chúng tôi đặt chúng vào một thư mục có tên `__tests__` liên quan đến các tệp mà chúng kiểm tra.

Ví dụ, một bài kiểm thử cho [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) được đặt trong [`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js) ngay bên cạnh nó 

### Warnings and Invariants {#warnings-and-invariants}

React codebase sử dụng `console.error` để hiển thị các cảnh báo:

```js
if (__DEV__) {
  console.error('Something is wrong.');
}
```

Cảnh báo chỉ được kích hoạt trong quá trình phát triển. Trong sản phẩm, chúng hoàn toàn bị loại bỏ. Nếu bạn cần cấm một số đường dẫn mã thực thi, hãy sử dụng mô-đun `invariant` để thay thế:

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'You shall not pass!'
);
```

**Bất biến - Invariant được ném ra khi điều kiện `invariant` là `false`.**

“Bất biến - Invariant” chỉ là một cách nói “điều kiện này luôn đúng”. Bạn có thể nghĩ về nó như một khẳng định.

Điều quan trọng là phải giữ cho sự phát triển và hành vi sản phẩm tương tự nhau, vì vậy `invariant` cả trong quá trình phát triển và sản xuất. Các thông báo lỗi được tự động thay thế bằng mã lỗi trong quá trình sản xuất để tránh ảnh hưởng tiêu cực đến kích thước byte.

### Development and Production {#development-and-production}

Bạn có thể dùng `__DEV__` biến giả toàn cục trong codebase để bảo vệ các khối mã chỉ dành cho quá trình phát triển.

Nó được nội tuyến trong bước biên dịch và chuyển thành kiểm tra `process.env.NODE_ENV !== 'production'` trong các bản CommonJS build.

Đối với các bản build độc lập, nó trở thành `true` trong các bản build không hợp nhất và hoàn toàn bị loại bỏ khỏi các khối `if` mà nó bảo vệ trong các bản build thu nhỏ.

```js
if (__DEV__) {
  // This code will only run in development.
}
```

### Flow {#flow}

Gần đây, chúng tôi đã bắt đầu giới thiệu kiểm tra Luồng -  [Flow](https://flow.org/) cho codebase. Các tệp được đánh dấu bằng chú thích `@flow` trong nhận xét tiêu đề giấy phép đang được kiểm tra.

Chúng tôi chấp nhận pull request [thêm các Flow annotation vào mã hiện có](https://github.com/facebook/react/pull/7600/files). Flow annotations sẽ như thế này:

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

Khi có thể, mã mới nên sử dụng các chú thích Flow annotation.
Bạn có thể chạy `yarn flow` ở local để kiểm tra mã của bạn với Flow.

### Multiple Packages {#multiple-packages}

React là một [monorepo](https://danluu.com/monorepo/). Repository của nó chứa nhiều package riêng biệt để các thay đổi của chúng có thể được phối hợp với nhau và các issue được đặt tại một nơi.

### React Core {#react-core}

"Core" của React bao gồm tất cả [top-level `React` APIs](/docs/react-api.html#react), ví dụ:

* `React.createElement()`
* `React.Component`
* `React.Children`

**React core chỉ bao gồm các API cần thiết để định nghĩa các component**. Nó không bao gồm thuật toán [reconciliation](/docs/reconciliation.html) hoặc bất kỳ mã nền tảng cụ thể nào. Nó được sử dụng bởi cả các component của React DOM và React Native.

Mã cho React core được đặt tại [`packages/react`](https://github.com/facebook/react/tree/main/packages/react) trong source tree. Nó có sẵn trên npm dưới dạng [`react`](https://www.npmjs.com/package/react) package. Bản build trình duyệt độc lập tương ứng được gọi là `react.js` và nó xuất ra toàn cầu có tên là `React`.

### Renderers {#renderers}

React ban đầu được tạo cho DOM nhưng sau đó nó đã được điều chỉnh để cũng hỗ trợ các platform native với [React Native](https://reactnative.dev/). Điều này đã giới thiệu khái niệm “rederers - trình kết xuất” cho nội bộ React.

**Renderers quản lý cách React tree chuyển thành các lệnh gọi platform.**

Renderers được đặt tại [`packages/`](https://github.com/facebook/react/tree/main/packages/):

* [React DOM Renderer](https://github.com/facebook/react/tree/main/packages/react-dom) render React components với DOM. Nó triển khai [top-level `ReactDOM` APIs](/docs/react-dom.html) avà có sẵn dưới dạng [`react-dom`](https://www.npmjs.com/package/react-dom) npm package. Nó cũng có thể được sử dụng như một package trình duyệt độc lập gọi là `react-dom.js` để xuất ra toàn cục `ReactDOM`.
* [React Native Renderer](https://github.com/facebook/react/tree/main/packages/react-native-renderer) renders React components với native views. Nó được sử dụng trong nội bộ React Native.
* [React Test Renderer](https://github.com/facebook/react/tree/main/packages/react-test-renderer) renders React components với JSON trees. Nó được sử dụng bởi chức năng [Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) của [Jest](https://facebook.github.io/jest) và có sẵn dưới dạng[react-test-renderer](https://www.npmjs.com/package/react-test-renderer) npm package.

Trình kết xuất - renderer duy nhất được hỗ trợ chính thức là [`react-art`](https://github.com/facebook/react/tree/main/packages/react-art). Nó từng nằm trong [GitHub repository](https://github.com/reactjs/react-art) riêng biệt nhưng chúng tôi đã chuyển nó vào cây nguồn chính từ bây giờ.

>**Lưu ý:**
>
>Về mặt kỹ thuật [`react-native-renderer`](https://github.com/facebook/react/tree/main/packages/react-native-renderer) là một layer rất nhỏ hướng dẫn React tương tác với việc triển khai React Native. Mã thực sự dành riêng cho platform quản lý các native view nằm trong [React Native repository](https://github.com/facebook/react-native) cùng với các component của nó.

### Reconcilers {#reconcilers}

Ngay cả những trình render rất khác nhau như React DOM và React Native cũng cần phải chia sẻ rất nhiều logic. Đặc biệt, thuật toán [đối chiếu - reconciliation](/docs/reconciliation.html) phải giống nhau nhất có thể để declarative rendering, tùy chỉnh components, state, các lifecycle method, và refs hoạt động nhất quán trên các nền tảng.

Để giải quyết vấn đề này, các trình render khác nhau chia sẻ một số mã giữa chúng. Chúng tôi gọi phần này của React là “trình điều hòa - reconciler”. Khi thực hiện cập nhật như `setState()` được lên lịch, trình reconciler sẽ gọi `render()` trên các component trong tree và mount, update hoặc unmount chúng.

Reconcilers không được đóng gói riêng biệt vì chúng hiện không có API công khai. Thay vào đó, chúng được sử dụng độc quyền bởi các trình kết xuất như React DOM và React Native.

### Stack Reconciler {#stack-reconciler}

Trình "stack" reconciler là trình triển khai cung cấp "năng lượng" cho React 15 trở về trước. Chúng tôi đã ngừng sử dụng nó, nhưng nó sẽ được ghi lại chi tiết trong [phần tiếp theo.](/docs/implementation-notes.html).

### Fiber Reconciler {#fiber-reconciler}

Trình "fiber" reconciler là một nỗ lực mới nhằm giải quyết các vấn đề vốn có trong trình stack reconciler và khắc phục một số sự cố lâu đời. Nó đã là trình reconciler mặc định kể từ React 16.

Mục tiêu của nó là:

* Khả năng phân chia công việc bị gián đoạn thành nhiều phần.
* Khả năng sắp xếp thứ tự ưu tiên, rebase và tái sử dụng công việc đang thực hiện.
* Khả năng "nhường nhịn qua lại" giữa cha mẹ và con cái để hỗ trợ layout bố cục trong React.
* Khả năng trả về nhiều component từ `render()`.
* Hỗ trợ tốt hơn cho các error boundary.

Bạn có thể đọc thêm về React Fiber Architecture [tại đây](https://github.com/acdlite/react-fiber-architecture) và [tại đây](https://blog.ag-grid.com/inside-fiber-an-in-depth-overview-of-the-new-reconciliation-algorithm-in-react). Mặc dù nó đã được triển khai với React 16, nhưng các tính năng bất đồng bộ vẫn chưa được kích hoạt theo mặc định.

Mã nguồn của nó được đặt ở [`packages/react-reconciler`](https://github.com/facebook/react/tree/main/packages/react-reconciler).

### Event System {#event-system}

React triển khai một layer trên các sự kiện native để giải quyết sự khác biệt giữa các trình duyệt. Mã nguồn được đặt tại [`packages/react-dom/src/events`](https://github.com/facebook/react/tree/main/packages/react-dom/src/events).

### What Next? {#what-next}

Đọc [phần tiếp theo](/docs/implementation-notes.html) để tìm hiểu chi tiết hơn về việc triển khai trình reconciler trước React 16. Chúng tôi chưa ghi lại nội dung bên trong của trình reconciler mới.
