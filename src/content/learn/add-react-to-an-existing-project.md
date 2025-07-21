---
title: Thêm React vào dự án có sẵn
---

<Intro>

Nếu bạn muốn thêm một số tính năng vào dự án hiện tại của mình, bạn không cần phải viết lại dự án đó bằng React. Thêm React vào stack công nghệ của bạn, và hiển thị các component của React ở bất kì đâu.

</Intro>

<Note>

**Bạn cần cài đặt [Node.js](https://nodejs.org/en/) cho môi trường phát triển trên máy tính cá nhân.** Mặc dù bạn có thể [thử React](/learn/installation#try-react) trực tuyến hoặc với một trang HTML đơn giản, nhưng thực tế hầu hết các công cụ JavaScript mà bạn muốn sử dụng cho việc phát triển phần mềm đều yêu cầu Node.js.

</Note>

## Sử dụng React cho một đường dẫn của trang web của bạn {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

Giả sử bạn có một ứng dụng web tại `example.com` được phát triển với một công nghệ khác (như Rails), và bạn muốn triển khai tất cả các đường dẫn bắt đầu bằng. `example.com/some-app/` hoàn toàn với React.

Đây là cách chúng tôi đề xuất để cài đặt:

<<<<<<< HEAD
1. **Xây dựng phần React của ứng dụng của bạn** sử dụng một trong những [nền tảng ứng dụng (framework) sử dụng React](/learn/start-a-new-react-project).
2. **Chỉ định `/some-app` là *đường dẫn gốc*** trong cấu hình ứng dụng của bạn. (xem hướng dẫn với: [Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Cấu hình máy chủ của bạn hoặc một proxy** để tất cả các requests ở `/some-app/` được xử lý bởi ứng dụng React của bạn.

Điều này đảm bảo phần React của ứng dụng của bạn có thể được [hưởng lợi từ các tiêu chuẩn tốt nhất](/learn/start-a-new-react-project#can-i-use-react-without-a-framework) đã được tích hợp sẵn trong các Frameworks đó.
=======
1. **Build the React part of your app** using one of the [React-based frameworks](/learn/creating-a-react-app).
2. **Specify `/some-app` as the *base path*** in your framework's configuration (here's how: [Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Configure your server or a proxy** so that all requests under `/some-app/` are handled by your React app.

This ensures the React part of your app can [benefit from the best practices](/learn/creating-a-react-app#full-stack-frameworks) baked into those frameworks.
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

Nhiều frameworks dựa trên React là full-stack và cho phép ứng dụng React của bạn tận dụng các tính năng của máy chủ. Tuy nhiên, bạn có thể sử dụng cùng một phương pháp ngay cả khi bạn không thể hoặc không muốn chạy JavaScript trên máy chủ. Trong trường hợp đó, hãy chuẩn bị HTML/CSS/JS export ([`next export` output](https://nextjs.org/docs/advanced-features/static-html-export) cho Next.js, mặc định cho Gatsby) tại `/some-app/`.

## Sử dụng React cho một phần của trang web của bạn {/*using-react-for-a-part-of-your-existing-page*/}

Giả sử bạn đã có một trang web được xây dựng bằng một công nghệ khác (có thể là công nghệ phía server như Rails, hoặc công nghệ phía client như Backbone), và bạn muốn hiển thị các component React tương tác ở một số nơi trên trang đó. Đó là một cách thông thường để tích hợp React - thực tế, đó là cách mà hầu hết các ứng dụng React được sử dụng tại Meta trong nhiều năm qua!

Bạn có thể làm điều này trong hai bước:

1. **Thiết lập môi trường JavaScript** cho phép bạn sử dụng [cú pháp JSX](/learn/writing-markup-with-jsx), chia code của bạn thành các module với cú pháp [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export), và sử dụng các package (ví dụ như React) từ [npm](https://www.npmjs.com/) package registry.
2. **Render các component React của bạn** tại nơi bạn muốn xem chúng trên trang web.

Cách tiếp cận cụ thể phụ thuộc vào thiết lập trang web hiện tại của bạn, vì vậy hãy cùng đi vào chi tiết.

### Bước 1: Thiết lập môi trường JavaScript module hóa {/*step-1-set-up-a-modular-javascript-environment*/}

Môi trường JavaScript module hóa cho phép bạn viết các component React của mình trong các tệp riêng lẻ, thay vì viết toàn bộ mã của bạn trong một tệp duy nhất. Nó cũng cho phép bạn sử dụng tất cả các package tuyệt vời bởi các nhà phát triển khác trên [npm](https://www.npmjs.com/) registry--bao gồm cả chính React! Cách thực hiện điều này phụ thuộc vào cài đặt hiện có của bạn:

* **Nếu ứng dụng của bạn đã được chia thành các tệp sử dụng các câu lệnh `import`,** hãy cố gắng sử dụng thiết lập hiện có của bạn. Kiểm tra xem viết `<div />` trong mã JS có gây lỗi cú pháp không. Nếu nó gây ra lỗi cú pháp, bạn có thể cần [chuyển đổi mã JavaScript của mình bằng Babel](https://babeljs.io/setup), và kích hoạt [Babel React preset](https://babeljs.io/docs/babel-preset-react) để sử dụng JSX.

* **Nếu ứng dụng của bạn không có cài đặt cho việc biên dịch các module JavaScript,** hãy cài đặt với [Vite](https://vitejs.dev/). Cộng động Vite duy trì [nhiều tích hợp với các framework back-end](https://github.com/vitejs/awesome-vite#integrations-with-backends), bao gồm Rails, Django, và Laravel. Nếu framework backend của bạn không được liệt kê, [hãy làm theo hướng dẫn này](https://vite.dev/guide/backend-integration.html) để tích hợp Vite với backend của bạn bằng cách thủ công.

Để kiểm tra xem thiết lập của bạn hoạt động, chạy lệnh này trong thư mục dự án của bạn:

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

Sau đó thêm những dòng code này vào đầu của file JavaScript chính của bạn (đó có thể là `index.js` hoặc `main.js`):

<Sandpack>

```html public/index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Nội dung website của bạn trước đó (chúng sẽ được thay thế trong ví dụ này) -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

// Xoá đi những nội dung HTML tồn tại trước đó
document.body.innerHTML = '<div id="app"></div>';

// Render component React của bạn
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

Nếu toàn bộ nội dung của trang web của bạn đã bị thay thế bằng một dòng chữ "Hello, world", điều đó có nghĩa là mọi thứ đã hoạt động! Hãy tiếp tục đọc.

<Note>

Việc tích hợp môi trường JavaScript theo module vào một dự án có sẵn có thể làm bạn cảm thấy hơi đáng sợ trong lần đầu tiên, nhưng sẽ rất đáng công sức bỏ ra! Nếu bạn gặp khó khăn, hãy xem [tài liệu của cộng đồng](/community) hoặc qua [Vite Chat](https://chat.vite.dev/).

</Note>

### Bước 2: Render các component React bất kỳ nơi nào trên trang {/*step-2-render-react-components-anywhere-on-the-page*/}

Trong bước trước đó, bạn đã đưa code này lên đầu tệp chính của mình:

```js
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

Tất nhiên, bạn không muốn xóa toàn bộ nội dung HTML hiện có của mình!

Hãy xoá đoạn code này.

Thay vào đó, bạn sẽ muốn render các component React ở những nơi cụ thể trong HTML của mình. Hãy mở trang HTML của bạn (hoặc template server nào đó đã sinh ra chúng) và thêm vào thuộc tính [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) độc nhất cho bất kì thẻ HTML nào, ví dụ như:

```html
<!-- ... đâu đó trong html của bạn ... -->
<nav id="navigation"></nav>
<!-- ... thêm html ... -->
```

Điều này sẽ giúp bạn tìm kiếm phần tử HTML với [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) và truyền vào [`createRoot`](/reference/react-dom/client/createRoot) để bạn có thể render component React bên trong:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>Đoạn văn này là 1 phần của HTML.</p>
    <nav id="navigation"></nav>
    <p>Đoạn văn này cũng là 1 phần của HTML.</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Actually implement a navigation bar
  return <h1>Xin chào từ React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

Chú ý là nội dung HTML ban đầu từ `index.html` được giữ nguyên, nhưng component  `NavigationBar` React của bạn giờ đây hiển thị bên trong `<nav id="navigation">` từ trong HTML của bạn. Hãy đọc [`tài liệu sử dụng createRoot`](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) để tìm hiểu thêm về cách hiển thị các component React trong một trang HTML hiện có.

<<<<<<< HEAD
Khi bạn sử dụng React với một dự án tồn tại trước đó, thường thì bạn sẽ bắt đầu với những component tương tác nhỏ (như nút bấm), và sau đó dần dần "tiến lên trước" cho tới khi toàn bộ trang web của bạn được xây dựng bằng React. Khi bạn đạt đến đó, chúng tôi khuyến nghị hãy chuyển đổi sang một [React framework](/learn/start-a-new-react-project) ngay sau đó để có thể sử dụng tối ưu React.
=======
When you adopt React in an existing project, it's common to start with small interactive components (like buttons), and then gradually keep "moving upwards" until eventually your entire page is built with React. If you ever reach that point, we recommend migrating to [a React framework](/learn/creating-a-react-app) right after to get the most out of React.
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

## Sử dụng React Native trong một ứng dụng di động native hiện có {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) cũng có thể được tích hợp vào các ứng dụng native hiện có một cách từ từ và tăng dần. Nếu bạn có một ứng dụng native hiện có cho Android (Java hoặc Kotlin) hoặc iOS (Objective-C hoặc Swift), [hãy làm theo hướng dẫn này](https://reactnative.dev/docs/integration-with-existing-apps) để thêm một màn hình React Native vào ứng dụng của bạn.
