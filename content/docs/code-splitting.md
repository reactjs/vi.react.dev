---
id: code-splitting
title: Code-Splitting
permalink: docs/code-splitting.html
---

## Đóng Gói (Bundling) {#bundling}

Hầu hết files trong các ứng dụng React sẽ được "đóng gói" bằng cách sử dụng những công cụ như [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) hay [Browserify](http://browserify.org/). Đóng gói là quá trình xử lý những files đã được import và kết hợp chúng thành một file duy nhất: một "bundle".File đóng gói này sau đó có thể được trang web tải lên chỉ một lần.

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

Nếu bạn đang sử dụng [Create React App](https://create-react-app.dev/), [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/), hay một công cụ tương tự, bạn sẽ được thiết lập sẵn webpack để đóng gói ứng dụng của mình.

Nếu không, bạn sẽ cần phải tự thiết lập. Ví dụ, tham khảo [Cách cài đặt](https://webpack.js.org/guides/installation/) và [Làm thê nào để bắt đầu sử dụng](https://webpack.js.org/guides/getting-started/) hướng dẫn ở tài liệu Webpack.

## Phân chia Code {#code-splitting}

Đóng gói hẵn rất tuyệt vời, nhưng khi ứng dụng của bạn trở nên lớn hơn, file đóng gói của bạn cũng sẽ lớn theo. Đặc biệt khi bạn sử dụng third-party library (thư viện bên thứ 3) lớn. Bạn cần phải cẩn thận với những đoạn code bạn đang include vào bundle của mình, bằng cách đó bạn sẽ không vô tình làm nó trở nên quá lớn khiến ứng dụng mất nhiều thời gian để tải.

Để tránh việc nhận được một bundle lớn, tốt nhất nên bắt đầu "splitting (chia nhỏ)" gói bundle của bạn.
Code-Splitting là một feature hỗ trợ bởi bundler như [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) và Browserify (via [factor-bundle](https://github.com/browserify/factor-bundle)) nó có thể tạo ra nhiều bundle nhỏ có thể được load một cách tự động tại thời điểm runtime.

Phân chia code cho ứng dụng giúp "lazy-load" chỉ những phần người dùng đang cần, tăng đáng kể hiệu suất mà không cần phải giảm số lượng code trong ứng dụng, bạn đã tránh phải tải những đoạn code người dùng có thể sẽ không bao giờ cần đến, và giảm số lượng code cần tải lên trong lần đầu tiên.

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

Khi Webpack chạy đến cú pháp này, nó sẽ tự động phân chia code trong ứng dụng của bạn. Nếu bạn sử dụng Create React App,
việc này đã được thiết lập sẵn cho bạn và bạn có thể [bắt đầu sử dụng](https://create-react-app.dev/docs/code-splitting/)
ngay. Nó cũng được hỗ trợ sẵn trong [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

Nếu bạn đang tự mình cấu hình Webpack, bạn có thể sẽ muốn tham khảo Webpack's
[hướng dẫn phân chia code](https://webpack.js.org/guides/code-splitting/). Cấu hình Webpack của bạn có thể sẽ trông mơ hồ [như thế này](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

Khi sử dụng [Babel](https://babeljs.io/), bạn sẽ cần phải chắc chắn rằng Babel có thể phân giải cú pháp import động nhưng không làm nó bị biến đổi. Bạn sẽ cần [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

<<<<<<< HEAD
> Chú ý:
>
> `React.lazy` và Suspense chưa có sẵn cho server-side rendering. Nếu bạn muốn phân chia code ở những ứng dụng render tại server, chúng tôi xin giới thiệu [Loadable Components](https://github.com/gregberge/loadable-components). Nó có [hướng dẫn phân chia code với server-side rendering](https://loadable-components.com/docs/server-side-rendering/).

Chức năng `React.lazy` cho phép bạn render một import động như một component bình thường.
=======
The `React.lazy` function lets you render a dynamic import as a regular component.
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb

**Trước:**

```js
import OtherComponent from './OtherComponent';
```

**Sau:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

Nó sẽ tự động tải bundle có chứa `OtherComponent` khi component này được được render lần đầu tiên.

`React.lazy` chỉ lấy một function mà nó được gọi `import()` động. Nó phải trả về một `Promise` và phân giải thành một module với một `default` export có chứa một React component.

Lazy component nên được render bên trong một `Suspense` component, điều này cho phép chúng ta thể hiện vài nội dung fallback cho người dùng (ví dụ như một loading indicator) trong khi chời đợi lazy component được load.

```js
import React, { Suspense } from 'react';

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

Thuộc tính `fallback` chấp nhận bất kỳ React elements nào bạn muốn render trong khi chờ component được tải lên. Bạn có thể đặt `Suspense` component bất kỳ nơi nào bên trên lazy component. Bạn thậm chí có thể bọc nhiều lazy component với duy nhất một `Suspense` component.

```js
import React, { Suspense } from 'react';

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

### Avoiding fallbacks {#avoiding-fallbacks}
Any component may suspend as a result of rendering, even components that were already shown to the user. In order for screen content to always be consistent, if an already shown component suspends, React has to hide its tree up to the closest `<Suspense>` boundary. However, from the user's perspective, this can be disorienting.

Consider this tab switcher:

```js
import React, { Suspense } from 'react';
import Tabs from './Tabs';
import Glimmer from './Glimmer';

const Comments = React.lazy(() => import('./Comments'));
const Photos = React.lazy(() => import('./Photos'));

function MyComponent() {
  const [tab, setTab] = React.useState('photos');
  
  function handleTabSelect(tab) {
    setTab(tab);
  };

  return (
    <div>
      <Tabs onTabSelect={handleTabSelect} />
      <Suspense fallback={<Glimmer />}>
        {tab === 'photos' ? <Photos /> : <Comments />}
      </Suspense>
    </div>
  );
}

```

In this example, if tab gets changed from `'photos'` to `'comments'`, but `Comments` suspends, the user will see a glimmer. This makes sense because the user no longer wants to see `Photos`, the `Comments` component is not ready to render anything, and React needs to keep the user experience consistent, so it has no choice but to show the `Glimmer` above.

However, sometimes this user experience is not desirable. In particular, it is sometimes better to show the "old" UI while the new UI is being prepared. You can use the new [`startTransition`](/docs/react-api.html#starttransition) API to make React do this:

```js
function handleTabSelect(tab) {
  startTransition(() => {
    setTab(tab);
  });
}
```

Here, you tell React that setting tab to `'comments'` is not an urgent update, but is a [transition](/docs/react-api.html#transitions) that may take some time. React will then keep the old UI in place and interactive, and will switch to showing `<Comments />` when it is ready. See [Transitions](/docs/react-api.html#transitions) for more info.

### Error boundaries {#error-boundaries}

Nếu `OtherComponent` không thể tải lên (Ví dụ, lỗi mạng), nó sẽ kích hoạt lỗi. Bạn có thể điều khiển những lỗi đó để hiển thị một trải nghiệm người dùng tốt hơn và quản lý phục hồi với [Error Boundaries](/docs/error-boundaries.html). Một khi bạn đã tạo Error Boundary, bạn có thể sử dụng nó bất kỳ nơi nào bên trên lazy components của bạn để hiển thị thông báo lỗi khi có sự cố về mạng.

```js
import React, { Suspense } from 'react';
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

Việc quyết định nơi nào cần phân chia code trong ứng dụng của bạn có thể sẽ gặp một chút khó khăn. Bạn muốn chắc chắn những nơi bạn chọn sẽ đều nhau, nhưng không phá vỡ trải nghiệm người dùng.

Một nơi tốt để bắt đầu là với routes. Hầu hết mọi người trên web đã quen với việc chuyển trang sẽ mất một khoảng thời gian nhất định. Bạn cũng có xu hướng render lại cả trang cùng một lần để ngăn người dùng không tương tác với những elements khác trong trang cùng một lúc.

<<<<<<< HEAD
Đây là một ví dụ hướng dẫn cách cài đặt ứng dụng của bạn phân chia code dựa trên route bằng cách sử dụng những thư viện như [React Router](https://reacttraining.com/react-router/) with `React.lazy`.
=======
Here's an example of how to setup route-based code splitting into your app using libraries like [React Router](https://reactrouter.com/) with `React.lazy`.
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
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
