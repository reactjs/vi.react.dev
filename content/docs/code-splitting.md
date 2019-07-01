---
id: code-splitting
title: Code-Splitting
permalink: docs/code-splitting.html
---

## Đóng Gói (Bundling) {#bundling}

Hầu hết files trong các ứng dụng React sẽ được "đóng gói" bằng cách
sử dụng những công cụ như [Webpack](https://webpack.js.org/) hay [Browserify](http://browserify.org/).
Đóng gói là quá trình xử lý những files đã được import và kết hợp chúng thành một file duy nhất: File đóng gói này
sau đó có thể được trang web tải lên chỉ một lần.

#### Ví Dụ {#example}

**App:**

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**Bundle:**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> Chú ý:
>
> Bundle của bạn có thể sẽ trông rất khác bên trên.

Nếu bạn đang sử dụng [Create React App](https://github.com/facebookincubator/create-react-app), [Next.js](https://github.com/zeit/next.js/), [Gatsby](https://www.gatsbyjs.org/), hay một công cụ tương tự,
bạn sẽ được thiết lập sẵn webpack để đóng gói ứng dụng của mình.

Nếu không, bạn sẽ cần phải tự thiết lập. Ví dụ, tham khảo
[Installation](https://webpack.js.org/guides/installation/) và
[Getting Started](https://webpack.js.org/guides/getting-started/)
hướng dẫn ở tài liệu Webpack.

## Phân chia Code {#code-splitting}

Đóng gói hẵn rất tuyệt vời, nhưng khi ứng dụng của bạn trở nên lớn hơn,
file đóng gói của bạn cũng sẽ lớn theo. Đặc biệt khi bạn sử dụng third-party library (thư viện bên thứ 3) lớn.
Bạn cần phải cẩn thận với những đoạn code bạn đang include vào bundle của mình, bằng cách đó bạn sẽ không
vô tình làm nó trở nên quá lớn khiến ứng dụng mất nhiều thời gian để tải.

Để tránh việc hỏng bundle vì file đóng gói quá lớn. Bạn nên chủ động bắt đầu "phân chia" bundle của mình ngay từ đầu.
 [Code-Splitting](https://webpack.js.org/guides/code-splitting/) là một tính năng được hỗ trợ bởi nhiều bundlers như Webpack và
 Browserfy (bằng [factor-bundle](https://github.com/browserify/factor-bundle)) có thể tạo ra nhiều bundles để load động tại thời điểm
 runtime.

Phân chia code cho ứng dụng giúp "lazy-load" chỉ những phần người dùng đang cần, tăng đáng kể hiệu suất mà không cần phải giảm số lượng
code trong ứng dụng, bạn đã tránh phải tải những đoạn code người dùng có thể sẽ không bao giờ cần đến,
và giảm số lượng code cần tải lên trong lần đầu tiên.

## `import()` {#import}

Phương pháp tốt nhất để sử dụng code-splitting trong ứng dụng là thông qua cú pháp `import()` động.

**Trước:**

```js
import { add } from './math';

console.log(add(16, 26));
```

**Sau:**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

> Chú ý:
>
> Cú pháp `import()` động là một đoạn ECMAScript (JavaScript)
> [proposal](https://github.com/tc39/proposal-dynamic-import) hiện tại chưa được xem
> như một phần tiêu chuẩn của ngôn ngữ. Nó mong đợi sẽ được chấp nhận trong tương lai gần.

Khi Webpack chạy đến cú pháp này, nó sẽ tự động phân chia code trong ứng dụng của bạn. Nếu bạn sử dụng Create React App,
việc này đã được thiết lập sẵn cho bạn và bạn có thể [bắt đầu sử dụng](https://facebook.github.io/create-react-app/docs/code-splitting)
ngay. Nó cũng được hỗ trợ sẵn trong [Next.js](https://github.com/zeit/next.js/#dynamic-import).

Nếu bạn đang tự mình cấu hình Webpack, bạn có thể sẽ muốn tham khảo Webpack's
[hướng dẫn phân chia code](https://webpack.js.org/guides/code-splitting/). Cấu hình Webpack của bạn có thể sẽ trông mơ hồ [như thế này](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

Khi sử dụng [Babel](https://babeljs.io/), bạn sẽ cần phải chắc chắn rằng Babel có thể phân giải cú pháp import động nhưng không làm nó
bị biến đổi. Bạn sẽ cần [babel-plugin-syntax-dynamic-import](https://yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

> Chú ý:
>
<<<<<<< HEAD
> `React.lazy` và Suspense chưa có sẵn cho server-side rendering. Nếu bạn muốn phân chia code ở những ứng dụng render tại server,
chúng tôi xin giới thiệu [Loadable Components](https://github.com/smooth-code/loadable-components). Nó có [hướng dẫn phân chia code với
server-side rendering](https://github.com/smooth-code/loadable-components/blob/master/packages/server/README.md).
=======
> `React.lazy` and Suspense are not yet available for server-side rendering. If you want to do code-splitting in a server rendered app, we recommend [Loadable Components](https://github.com/smooth-code/loadable-components). It has a nice [guide for bundle splitting with server-side rendering](https://github.com/smooth-code/loadable-components/blob/master/packages/server/README.md).
>>>>>>> c024001caf50180a896c09467d06b2ad7b2fb8f4

Chức năng `React.lazy` cho phép bạn render một import động như một component bình thường.

**Trước:**

```js
import OtherComponent from './OtherComponent';

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

**Sau:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

Nó sẽ tự động tải bundle có chứa `OtherComponent` khi component này được gọi đến.

`React.lazy` chỉ lấy một function mà nó được gọi `import()` động. Nó phải trả về một `Promise` và phân giải thành một module với một
`default` export có chứa một React component.

### Suspense {#suspense}

Nếu module có chứa `OtherComponent` mà nó chưa được tải lên tại thời điểm `MyComponent` renders,
chúng ta phải hiển thị một số nội dung fallback trong khi chờ đợi nó hiển thị - ví dụ như một loading indicator.
Việc này có thể thực hiện nhờ vào `Suspense` component.

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

Thuộc tính `fallback` chấp nhận bất kỳ React elements nào bạn muốn render trong khi chờ component được tải lên.
Bạn có thể đặt `Suspense` component bất kỳ nơi nào bên trên lazy component.
Bạn thậm chí có thể bọc nhiều lazy component với duy nhất một `Suspense` component.

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

### Error boundaries {#error-boundaries}

Nếu `OtherComponent` không thể tải lên (Ví dụ, lỗi mạng), nó sẽ kích hoạt lỗi.
Bạn có thể điều khiển những lỗi đó để hiển thị một trải nghiệm người dùng tốt hơn và quản lý phục hồi với [Error Boundaries](/docs/error-boundaries.html). Một khi bạn đã tạo Error Boundary, bạn có thể sử dụng nó bất kỳ nơi nào bên trên lazy components của bạn
để hiển thị thông báo lỗi khi có sự cố về mạng.

```js
import MyErrorBoundary from './MyErrorBoundary';
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

## Phân chia code dựa vào định tuyến(Route-based) {#route-based-code-splitting}

Việc quyết định nơi nào cần phân chia code trong ứng dụng của bạn có thể sẽ gặp một chút khó khăn.
Bạn muốn chắc chắn những nơi bạn chọn sẽ đều nhau, nhưng không phá vỡ
trải nghiệm người dùng.

Một nơi tốt để bắt đầu là với routes. Hầu hết mọi người trên web
đã quen với việc chuyển trang sẽ mất một khoảng thời gian nhất định.
Bạn cũng có xu hướng render lại cả trang cùng một lần để ngăn người dùng
không tương tác với những elements khác trong trang cùng một lúc.

Đây là một ví dụ hướng dẫn cách cài đặt ứng dụng của bạn phân chia code dựa trên route
bằng cách sử dụng những thư viện như [React Router](https://reacttraining.com/react-router/) with `React.lazy`.

```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

## Named Exports (Đặt tên Export) {#named-exports}

`React.lazy` hiện tại chỉ hỗ trợ default export. Nếu module bạn muốn import sử dụng named export, bạn có thể tạo một module trung gian và sau đó export dưới dạng export default. Điều này chắc đảm bảo rằng tree shaking vẫn hoạt động và bạn không kéo những component chưa được sử dụng.

```js
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```

```js
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

```js
// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```
