---
title: Thêm React vào một Dự án Hiện có
---

<Intro>

Nếu bạn muốn thêm một số tương tác vào dự án hiện có của mình, bạn không cần phải viết lại nó bằng React. Hãy thêm React vào ngăn xếp hiện tại của bạn và hiển thị các thành phần React tương tác ở bất kỳ đâu.

</Intro>

<Note>

**Bạn cần cài đặt [Node.js](https://nodejs.org/en/) để phát triển cục bộ.** Mặc dù bạn có thể [thử React](/learn/installation#try-react) trực tuyến hoặc với một trang HTML đơn giản, nhưng thực tế hầu hết các công cụ JavaScript bạn muốn sử dụng để phát triển đều yêu cầu Node.js.

</Note>

## Sử dụng React cho toàn bộ đường dẫn con của trang web hiện tại của bạn {/*using-react-react-for-an-entire-subroute-of-your-existing-website*/}

Giả sử bạn có một ứng dụng web hiện tại tại `example.com` được xây dựng bằng một công nghệ máy chủ khác (như Rails) và bạn muốn triển khai tất cả các tuyến đường bắt đầu bằng `example.com/some-app/` hoàn toàn bằng React.

Đây là cách chúng tôi khuyên bạn nên thiết lập nó:

1. **Xây dựng phần React của ứng dụng của bạn** bằng cách sử dụng một trong các [khung dựa trên React](/learn/start-a-new-react-project).
2. **Chỉ định `/some-app` làm *đường dẫn cơ sở*** trong cấu hình khung của bạn (đây là cách thực hiện: [Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Định cấu hình máy chủ hoặc proxy của bạn** để tất cả các yêu cầu dưới `/some-app/` được xử lý bởi ứng dụng React của bạn.

Điều này đảm bảo phần React của ứng dụng của bạn có thể [hưởng lợi từ các phương pháp hay nhất](/learn/start-a-new-react-project#can-i-use-react-without-a-framework) được tích hợp trong các khung đó.

Nhiều khung dựa trên React là full-stack và cho phép ứng dụng React của bạn tận dụng máy chủ. Tuy nhiên, bạn có thể sử dụng cùng một phương pháp ngay cả khi bạn không thể hoặc không muốn chạy JavaScript trên máy chủ. Trong trường hợp đó, hãy phục vụ xuất HTML/CSS/JS ([đầu ra `next export`](https://nextjs.org/docs/advanced-features/static-html-export) cho Next.js, mặc định cho Gatsby) tại `/some-app/` thay thế.

## Sử dụng React cho một phần của trang hiện tại của bạn {/*using-react-for-a-part-of-your-existing-page*/}

Giả sử bạn có một trang hiện tại được xây dựng bằng một công nghệ khác (hoặc một máy chủ như Rails, hoặc một máy khách như Backbone) và bạn muốn hiển thị các thành phần React tương tác ở đâu đó trên trang đó. Đó là một cách phổ biến để tích hợp React--thực tế, đó là cách hầu hết việc sử dụng React trông giống như ở Meta trong nhiều năm!

Bạn có thể làm điều này trong hai bước:

1. **Thiết lập một môi trường JavaScript** cho phép bạn sử dụng [cú pháp JSX](/learn/writing-markup-with-jsx), chia mã của bạn thành các mô-đun với cú pháp [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) và sử dụng các gói (ví dụ: React) từ kho lưu trữ gói [npm](https://www.npmjs.com/).
2. **Hiển thị các thành phần React của bạn** nơi bạn muốn xem chúng trên trang.

Cách tiếp cận chính xác phụ thuộc vào thiết lập trang hiện tại của bạn, vì vậy hãy xem qua một số chi tiết.

### Bước 1: Thiết lập môi trường JavaScript mô-đun {/*step-1-set-up-a-modular-javascript-environment*/}

Môi trường JavaScript mô-đun cho phép bạn viết các thành phần React của mình trong các tệp riêng lẻ, thay vì viết tất cả mã của bạn trong một tệp duy nhất. Nó cũng cho phép bạn sử dụng tất cả các gói tuyệt vời được xuất bản bởi các nhà phát triển khác trên kho lưu trữ [npm](https://www.npmjs.com/)--bao gồm cả chính React! Cách bạn thực hiện việc này phụ thuộc vào thiết lập hiện tại của bạn:

* **Nếu ứng dụng của bạn đã được chia thành các tệp sử dụng câu lệnh `import`,** hãy thử sử dụng thiết lập bạn đã có. Kiểm tra xem việc viết `<div />` trong mã JS của bạn có gây ra lỗi cú pháp hay không. Nếu nó gây ra lỗi cú pháp, bạn có thể cần [biến đổi mã JavaScript của bạn bằng Babel](https://babeljs.io/setup) và bật [Babel React preset](https://babeljs.io/docs/babel-preset-react) để sử dụng JSX.

* **Nếu ứng dụng của bạn không có thiết lập hiện tại để biên dịch các mô-đun JavaScript,** hãy thiết lập nó với [Vite](https://vite.dev/). Cộng đồng Vite duy trì [nhiều tích hợp với các khung backend](https://github.com/vitejs/awesome-vite#integrations-with-backends), bao gồm Rails, Django và Laravel. Nếu khung backend của bạn không được liệt kê, [hãy làm theo hướng dẫn này](https://vite.dev/guide/backend-integration.html) để tích hợp thủ công các bản dựng Vite với backend của bạn.

Để kiểm tra xem thiết lập của bạn có hoạt động hay không, hãy chạy lệnh này trong thư mục dự án của bạn:

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

Sau đó, thêm các dòng mã này vào đầu tệp JavaScript chính của bạn (nó có thể được gọi là `index.js` hoặc `main.js`):

<Sandpack>

```html public/index.html hidden
<!DOCTYPE html>
<html>
  <head><title>Ứng dụng của tôi</title></head>
  <body>
    {/* Nội dung trang hiện tại của bạn (trong ví dụ này, nó sẽ được thay thế) */}
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

// Xóa nội dung HTML hiện tại
document.body.innerHTML = '<div id="app"></div>';

// Hiển thị thành phần React của bạn thay thế
const root = createRoot(document.getElementById('app'));
root.render(<h1>Xin chào, thế giới</h1>);
```

</Sandpack>

Nếu toàn bộ nội dung trang của bạn được thay thế bằng "Xin chào, thế giới!", mọi thứ đã hoạt động! Tiếp tục đọc.

<Note>

Tích hợp môi trường JavaScript mô-đun vào một dự án hiện có lần đầu tiên có thể cảm thấy khó khăn, nhưng nó đáng giá! Nếu bạn gặp khó khăn, hãy thử [tài nguyên cộng đồng](/community) của chúng tôi hoặc [Vite Chat](https://chat.vite.dev/).

</Note>

### Bước 2: Hiển thị các thành phần React ở bất kỳ đâu trên trang {/*step-2-render-react-components-anywhere-on-the-page*/}

Trong bước trước, bạn đã đặt mã này lên đầu tệp chính của mình:

```js
import { createRoot } from 'react-dom/client';

// Xóa nội dung HTML hiện tại
document.body.innerHTML = '<div id="app"></div>';

// Hiển thị thành phần React của bạn thay thế
const root = createRoot(document.getElementById('app'));
root.render(<h1>Xin chào, thế giới</h1>);
```

Tất nhiên, bạn không thực sự muốn xóa nội dung HTML hiện tại!

Xóa mã này.

Thay vào đó, bạn có thể muốn hiển thị các thành phần React của mình ở những vị trí cụ thể trong HTML của bạn. Mở trang HTML của bạn (hoặc các mẫu máy chủ tạo ra nó) và thêm một thuộc tính [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) duy nhất vào bất kỳ thẻ nào, ví dụ:

```html
{/* ... đâu đó trong html của bạn ... */}
<nav id="navigation"></nav>
{/* ... thêm html ... */}
```

Điều này cho phép bạn tìm thấy phần tử HTML đó bằng [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) và chuyển nó đến [`createRoot`](/reference/react-dom/client/createRoot) để bạn có thể hiển thị thành phần React của riêng mình bên trong:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>Ứng dụng của tôi</title></head>
  <body>
    <p>Đoạn văn này là một phần của HTML.</p>
    <nav id="navigation"></nav>
    <p>Đoạn văn này cũng là một phần của HTML.</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Thực sự triển khai một thanh điều hướng
  return <h1>Xin chào từ React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

Lưu ý cách nội dung HTML ban đầu từ `index.html` được giữ nguyên, nhưng thành phần React `NavigationBar` của riêng bạn hiện xuất hiện bên trong `<nav id="navigation">` từ HTML của bạn. Đọc [tài liệu sử dụng `createRoot`](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) để tìm hiểu thêm về việc hiển thị các thành phần React bên trong một trang HTML hiện có.

Khi bạn áp dụng React trong một dự án hiện có, bạn nên bắt đầu với các thành phần tương tác nhỏ (như nút) và sau đó dần dần "di chuyển lên trên" cho đến khi cuối cùng toàn bộ trang của bạn được xây dựng bằng React. Nếu bạn đạt đến điểm đó, chúng tôi khuyên bạn nên di chuyển sang [khung React](/learn/start-a-new-react-project) ngay sau đó để tận dụng tối đa React.

## Sử dụng React Native trong một ứng dụng di động gốc hiện có {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) cũng có thể được tích hợp vào các ứng dụng gốc hiện có một cách gia tăng. Nếu bạn có một ứng dụng gốc hiện có cho Android (Java hoặc Kotlin) hoặc iOS (Objective-C hoặc Swift), [hãy làm theo hướng dẫn này](https://reactnative.dev/docs/integration-with-existing-apps) để thêm màn hình React Native vào đó.
