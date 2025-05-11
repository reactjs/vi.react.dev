---
title: prerender
---

<Intro>

`prerender` kết xuất một cây React thành một chuỗi HTML tĩnh bằng cách sử dụng [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

```js
const {prelude} = await prerender(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

API này phụ thuộc vào [Web Streams.](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) Đối với Node.js, hãy sử dụng [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) thay thế.

</Note>

---

## Tham khảo {/*reference*/}

### `prerender(reactNode, options?)` {/*prerender*/}

Gọi `prerender` để kết xuất ứng dụng của bạn thành HTML tĩnh.

```js
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Trên máy khách, hãy gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để làm cho HTML do máy chủ tạo ra trở nên tương tác.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reactNode`: Một nút React mà bạn muốn kết xuất thành HTML. Ví dụ: một nút JSX như `<App />`. Nó được mong đợi đại diện cho toàn bộ tài liệu, vì vậy thành phần App sẽ kết xuất thẻ `<html>`.

* **tùy chọn** `options`: Một đối tượng với các tùy chọn tạo tĩnh.
  * **tùy chọn** `bootstrapScriptContent`: Nếu được chỉ định, chuỗi này sẽ được đặt trong một thẻ `<script>` nội tuyến.
  * **tùy chọn** `bootstrapScripts`: Một mảng các URL chuỗi cho các thẻ `<script>` để phát ra trên trang. Sử dụng cái này để bao gồm `<script>` gọi [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Bỏ qua nó nếu bạn không muốn chạy React trên máy khách.
  * **tùy chọn** `bootstrapModules`: Giống như `bootstrapScripts`, nhưng phát ra [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) thay thế.
  * **tùy chọn** `identifierPrefix`: Một tiền tố chuỗi mà React sử dụng cho ID được tạo bởi [`useId`.](/reference/react/useId) Hữu ích để tránh xung đột khi sử dụng nhiều gốc trên cùng một trang. Phải là tiền tố giống như đã truyền cho [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **tùy chọn** `namespaceURI`: Một chuỗi với [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) gốc cho luồng. Mặc định là HTML thông thường. Truyền `'http://www.w3.org/2000/svg'` cho SVG hoặc `'http://www.w3.org/1998/Math/MathML'` cho MathML.
  * **tùy chọn** `onError`: Một lệnh gọi lại kích hoạt bất cứ khi nào có lỗi máy chủ, cho dù [có thể khôi phục được](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) hay [không.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) Theo mặc định, điều này chỉ gọi `console.error`. Nếu bạn ghi đè nó để [ghi nhật ký báo cáo sự cố,](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) hãy đảm bảo rằng bạn vẫn gọi `console.error`. Bạn cũng có thể sử dụng nó để [điều chỉnh mã trạng thái](/reference/react-dom/server/renderToReadableStream#setting-the-status-code) trước khi shell được phát ra.
  * **tùy chọn** `progressiveChunkSize`: Số byte trong một đoạn. [Đọc thêm về heuristic mặc định.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **tùy chọn** `signal`: Một [tín hiệu hủy bỏ](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) cho phép bạn [hủy bỏ kết xuất máy chủ](/reference/react-dom/server/renderToReadableStream#aborting-server-rendering) và kết xuất phần còn lại trên máy khách.

#### Trả về {/*returns*/}

`prerender` trả về một Promise:
- Nếu kết xuất thành công, Promise sẽ phân giải thành một đối tượng chứa:
  - `prelude`: một [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) của HTML. Bạn có thể sử dụng luồng này để gửi phản hồi theo các đoạn hoặc bạn có thể đọc toàn bộ luồng vào một chuỗi.
- Nếu kết xuất không thành công, Promise sẽ bị từ chối. [Sử dụng cái này để xuất một shell dự phòng.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)

<Note>

### Khi nào tôi nên sử dụng `prerender`? {/*when-to-use-prerender*/}

API `prerender` tĩnh được sử dụng để tạo phía máy chủ tĩnh (SSG). Không giống như `renderToString`, `prerender` đợi tất cả dữ liệu được tải trước khi phân giải. Điều này làm cho nó phù hợp để tạo HTML tĩnh cho toàn bộ trang, bao gồm cả dữ liệu cần được tìm nạp bằng Suspense. Để truyền trực tuyến nội dung khi nó tải, hãy sử dụng API kết xuất phía máy chủ (SSR) phát trực tuyến như [renderToReadableStream](/reference/react-dom/server/renderToReadableStream).

</Note>

---

## Cách sử dụng {/*usage*/}

### Kết xuất một cây React thành một luồng HTML tĩnh {/*rendering-a-react-tree-to-a-stream-of-static-html*/}

Gọi `prerender` để kết xuất cây React của bạn thành HTML tĩnh vào một [Readable Web Stream:](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream):

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Cùng với <CodeStep step={1}>thành phần gốc</CodeStep>, bạn cần cung cấp một danh sách <CodeStep step={2}>đường dẫn `<script>` bootstrap</CodeStep>. Thành phần gốc của bạn sẽ trả về **toàn bộ tài liệu bao gồm thẻ `<html>` gốc.**

Ví dụ: nó có thể trông như thế này:

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>Ứng dụng của tôi</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React sẽ chèn [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) và <CodeStep step={2}>thẻ `<script>` bootstrap</CodeStep> của bạn vào luồng HTML kết quả:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML từ các thành phần của bạn ... -->
</html>
<script src="/main.js" async=""></script>
```

Trên máy khách, tập lệnh bootstrap của bạn sẽ [hydrate toàn bộ `document` bằng một lệnh gọi đến `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Điều này sẽ đính kèm trình nghe sự kiện vào HTML tĩnh do máy chủ tạo ra và làm cho nó có tính tương tác.

<DeepDive>

#### Đọc đường dẫn tài sản CSS và JS từ đầu ra bản dựng {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Các URL tài sản cuối cùng (như tệp JavaScript và CSS) thường được băm sau khi xây dựng. Ví dụ: thay vì `styles.css`, bạn có thể kết thúc bằng `styles.123456.css`. Băm tên tệp tài sản tĩnh đảm bảo rằng mọi bản dựng riêng biệt của cùng một tài sản sẽ có một tên tệp khác nhau. Điều này rất hữu ích vì nó cho phép bạn bật bộ nhớ đệm dài hạn một cách an toàn cho các tài sản tĩnh: một tệp có tên nhất định sẽ không bao giờ thay đổi nội dung.

Tuy nhiên, nếu bạn không biết URL tài sản cho đến sau khi xây dựng, bạn không có cách nào để đưa chúng vào mã nguồn. Ví dụ: mã hóa cứng `"/styles.css"` vào JSX như trước đây sẽ không hoạt động. Để giữ chúng bên ngoài mã nguồn của bạn, thành phần gốc của bạn có thể đọc tên tệp thực từ một bản đồ được truyền dưới dạng một prop:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>Ứng dụng của tôi</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

Trên máy chủ, kết xuất `<App assetMap={assetMap} />` và truyền `assetMap` của bạn với các URL tài sản:

```js {1-5,8,9}
// Bạn sẽ cần lấy JSON này từ công cụ xây dựng của bạn, ví dụ: đọc nó từ đầu ra bản dựng.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const {prelude} = await prerender(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Vì máy chủ của bạn hiện đang kết xuất `<App assetMap={assetMap} />`, bạn cần kết xuất nó với `assetMap` trên máy khách để tránh lỗi hydration. Bạn có thể tuần tự hóa và truyền `assetMap` cho máy khách như thế này:

```js {9-10}
// Bạn sẽ cần lấy JSON này từ công cụ xây dựng của bạn.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const {prelude} = await prerender(<App assetMap={assetMap} />, {
    // Cẩn thận: An toàn để stringify() dữ liệu này vì dữ liệu này không phải do người dùng tạo.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Trong ví dụ trên, tùy chọn `bootstrapScriptContent` thêm một thẻ `<script>` nội tuyến bổ sung đặt biến `window.assetMap` toàn cục trên máy khách. Điều này cho phép mã máy khách đọc cùng một `assetMap`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Cả máy khách và máy chủ đều kết xuất `App` với cùng một prop `assetMap`, vì vậy không có lỗi hydration.

</DeepDive>

---

### Kết xuất một cây React thành một chuỗi HTML tĩnh {/*rendering-a-react-tree-to-a-string-of-static-html*/}

Gọi `prerender` để kết xuất ứng dụng của bạn thành một chuỗi HTML tĩnh:

```js
import { prerender } from 'react-dom/static';

async function renderToString() {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  
  const reader = prelude.getReader();
  let content = '';
  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      return content;
    }
    content += Buffer.from(value).toString('utf8');
  }
}
```

Điều này sẽ tạo ra đầu ra HTML không tương tác ban đầu của các thành phần React của bạn. Trên máy khách, bạn sẽ cần gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để *hydrate* HTML do máy chủ tạo ra đó và làm cho nó có tính tương tác.

---

### Chờ tất cả dữ liệu được tải {/*waiting-for-all-data-to-load*/}

`prerender` đợi tất cả dữ liệu được tải trước khi hoàn thành việc tạo HTML tĩnh và phân giải. Ví dụ: hãy xem xét một trang hồ sơ hiển thị ảnh bìa, thanh bên với bạn bè và ảnh và danh sách các bài đăng:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Hãy tưởng tượng rằng `<Posts />` cần tải một số dữ liệu, điều này mất một chút thời gian. Lý tưởng nhất là bạn muốn đợi các bài đăng hoàn thành để nó được đưa vào HTML. Để thực hiện việc này, bạn có thể sử dụng Suspense để tạm dừng dữ liệu và `prerender` sẽ đợi nội dung bị tạm dừng hoàn thành trước khi phân giải thành HTML tĩnh.

<Note>

**Chỉ các nguồn dữ liệu hỗ trợ Suspense mới kích hoạt thành phần Suspense.** Chúng bao gồm:

- Tìm nạp dữ liệu với các framework hỗ trợ Suspense như [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) và [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Tải mã thành phần lười biếng với [`lazy`](/reference/react/lazy)
- Đọc giá trị của một Promise với [`use`](/reference/react/use)

Suspense **không** phát hiện khi dữ liệu được tìm nạp bên trong một Effect hoặc trình xử lý sự kiện.

Cách chính xác bạn sẽ tải dữ liệu trong thành phần `Posts` ở trên phụ thuộc vào framework của bạn. Nếu bạn sử dụng một framework hỗ trợ Suspense, bạn sẽ tìm thấy các chi tiết trong tài liệu tìm nạp dữ liệu của nó.

Tìm nạp dữ liệu hỗ trợ Suspense mà không sử dụng framework có ý kiến ​​vẫn chưa được hỗ trợ. Các yêu cầu để triển khai một nguồn dữ liệu hỗ trợ Suspense là không ổn định và không được ghi lại. Một API chính thức để tích hợp các nguồn dữ liệu với Suspense sẽ được phát hành trong một phiên bản React trong tương lai.

</Note>

---

## Khắc phục sự cố {/*troubleshooting*/}

### Luồng của tôi không bắt đầu cho đến khi toàn bộ ứng dụng được kết xuất {/*my-stream-doesnt-start-until-the-entire-app-is-rendered*/}

Phản hồi `prerender` đợi cho đến khi toàn bộ ứng dụng kết thúc kết xuất, bao gồm cả việc chờ tất cả các ranh giới Suspense được giải quyết, trước khi giải quyết. Nó được thiết kế để tạo trang web tĩnh (SSG) trước thời hạn và không hỗ trợ truyền trực tuyến thêm nội dung khi nó tải.

Để truyền trực tuyến nội dung khi nó tải, hãy sử dụng API kết xuất máy chủ phát trực tuyến như [renderToReadableStream](/reference/react-dom/server/renderToReadableStream).
