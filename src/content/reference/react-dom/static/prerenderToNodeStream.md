---
title: prerenderToNodeStream
---

<Intro>

`prerenderToNodeStream` kết xuất một cây React thành một chuỗi HTML tĩnh bằng cách sử dụng [Node.js Stream.](https://nodejs.org/api/stream.html).

```js
const {prelude} = await prerenderToNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

API này dành riêng cho Node.js. Các môi trường có [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), như Deno và các runtime edge hiện đại, nên sử dụng [`prerender`](/reference/react-dom/static/prerender) thay thế.

</Note>

---

## Tham khảo {/*reference*/}

### `prerenderToNodeStream(reactNode, options?)` {/*prerender*/}

Gọi `prerenderToNodeStream` để kết xuất ứng dụng của bạn thành HTML tĩnh.

```js
import { prerenderToNodeStream } from 'react-dom/static';

// Cú pháp trình xử lý route phụ thuộc vào framework backend của bạn
app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js'],
  });

  response.setHeader('Content-Type', 'text/plain');
  prelude.pipe(response);
});
```

Trên client, gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để làm cho HTML được tạo từ server trở nên tương tác.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reactNode`: Một node React mà bạn muốn kết xuất thành HTML. Ví dụ: một node JSX như `<App />`. Nó được mong đợi đại diện cho toàn bộ tài liệu, vì vậy component App sẽ kết xuất thẻ `<html>`.

* **optional** `options`: Một đối tượng với các tùy chọn tạo tĩnh.
  * **optional** `bootstrapScriptContent`: Nếu được chỉ định, chuỗi này sẽ được đặt trong một thẻ `<script>` nội tuyến.
  * **optional** `bootstrapScripts`: Một mảng các URL chuỗi cho các thẻ `<script>` để phát ra trên trang. Sử dụng cái này để bao gồm `<script>` gọi [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Bỏ qua nếu bạn không muốn chạy React trên client.
  * **optional** `bootstrapModules`: Giống như `bootstrapScripts`, nhưng phát ra [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) thay thế.
  * **optional** `identifierPrefix`: Một tiền tố chuỗi mà React sử dụng cho các ID được tạo bởi [`useId`.](/reference/react/useId) Hữu ích để tránh xung đột khi sử dụng nhiều root trên cùng một trang. Phải là cùng một tiền tố như được truyền cho [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **optional** `namespaceURI`: Một chuỗi với [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) gốc cho stream. Mặc định là HTML thông thường. Truyền `'http://www.w3.org/2000/svg'` cho SVG hoặc `'http://www.w3.org/1998/Math/MathML'` cho MathML.
  * **optional** `onError`: Một callback kích hoạt bất cứ khi nào có lỗi server, cho dù [có thể khôi phục được](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-outside-the-shell) hay [không.](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-inside-the-shell) Theo mặc định, nó chỉ gọi `console.error`. Nếu bạn ghi đè nó để [ghi lại các báo cáo sự cố,](/reference/react-dom/server/renderToPipeableStream#logging-crashes-on-the-server) hãy đảm bảo rằng bạn vẫn gọi `console.error`. Bạn cũng có thể sử dụng nó để [điều chỉnh mã trạng thái](/reference/react-dom/server/renderToPipeableStream#setting-the-status-code) trước khi shell được phát ra.
  * **optional** `progressiveChunkSize`: Số byte trong một chunk. [Đọc thêm về heuristic mặc định.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **optional** `signal`: Một [tín hiệu abort](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) cho phép bạn [hủy bỏ quá trình kết xuất server](/reference/react-dom/server/renderToPipeableStream#aborting-server-rendering) và kết xuất phần còn lại trên client.

#### Trả về {/*returns*/}

`prerenderToNodeStream` trả về một Promise:
- Nếu kết xuất thành công, Promise sẽ resolve thành một đối tượng chứa:
  - `prelude`: một [Node.js Stream](https://nodejs.org/api/stream.html) của HTML. Bạn có thể sử dụng stream này để gửi phản hồi theo từng chunk hoặc bạn có thể đọc toàn bộ stream vào một chuỗi.
- Nếu kết xuất không thành công, Promise sẽ bị reject. [Sử dụng cái này để xuất shell dự phòng.](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-inside-the-shell)

<Note>

### Khi nào tôi nên sử dụng `prerenderToNodeStream`? {/*when-to-use-prerender*/}

API `prerenderToNodeStream` tĩnh được sử dụng để tạo server-side tĩnh (SSG). Không giống như `renderToString`, `prerenderToNodeStream` đợi tất cả dữ liệu được tải trước khi resolve. Điều này làm cho nó phù hợp để tạo HTML tĩnh cho toàn bộ trang, bao gồm cả dữ liệu cần được tìm nạp bằng Suspense. Để truyền trực tuyến nội dung khi nó tải, hãy sử dụng API kết xuất server-side (SSR) phát trực tuyến như [renderToReadableStream](/reference/react-dom/server/renderToReadableStream).

</Note>

---

## Cách sử dụng {/*usage*/}

### Kết xuất một cây React thành một stream HTML tĩnh {/*rendering-a-react-tree-to-a-stream-of-static-html*/}

Gọi `prerenderToNodeStream` để kết xuất cây React của bạn thành HTML tĩnh vào một [Node.js Stream.](https://nodejs.org/api/stream.html):

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { prerenderToNodeStream } from 'react-dom/static';

// Cú pháp trình xử lý route phụ thuộc vào framework backend của bạn
app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js'],
  });
  
  response.setHeader('Content-Type', 'text/plain');
  prelude.pipe(response);
});
```

Cùng với <CodeStep step={1}>component root</CodeStep>, bạn cần cung cấp một danh sách các <CodeStep step={2}>đường dẫn `<script>` bootstrap</CodeStep>. Component root của bạn sẽ trả về **toàn bộ tài liệu bao gồm thẻ `<html>` gốc.**

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

React sẽ inject [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) và <CodeStep step={2}>thẻ `<script>` bootstrap</CodeStep> của bạn vào stream HTML kết quả:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML từ các component của bạn ... -->
</html>
<script src="/main.js" async=""></script>
```

Trên client, script bootstrap của bạn sẽ [hydrate toàn bộ `document` bằng một lệnh gọi đến `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Điều này sẽ đính kèm các trình xử lý sự kiện vào HTML tĩnh được tạo từ server và làm cho nó có tính tương tác.

<DeepDive>

#### Đọc đường dẫn CSS và JS asset từ đầu ra bản dựng {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Các URL asset cuối cùng (như các tệp JavaScript và CSS) thường được băm sau bản dựng. Ví dụ: thay vì `styles.css`, bạn có thể kết thúc với `styles.123456.css`. Băm tên tệp asset tĩnh đảm bảo rằng mọi bản dựng riêng biệt của cùng một asset sẽ có một tên tệp khác nhau. Điều này rất hữu ích vì nó cho phép bạn bật bộ nhớ cache dài hạn một cách an toàn cho các asset tĩnh: một tệp có tên nhất định sẽ không bao giờ thay đổi nội dung.

Tuy nhiên, nếu bạn không biết URL asset cho đến sau bản dựng, bạn không có cách nào để đưa chúng vào mã nguồn. Ví dụ: việc mã hóa cứng `"/styles.css"` vào JSX như trước đây sẽ không hoạt động. Để giữ chúng bên ngoài mã nguồn của bạn, component root của bạn có thể đọc tên tệp thực từ một map được truyền dưới dạng một prop:

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

Trên server, kết xuất `<App assetMap={assetMap} />` và truyền `assetMap` của bạn với các URL asset:

```js {1-5,8,9}
// Bạn cần lấy JSON này từ công cụ bản dựng của bạn, ví dụ: đọc nó từ đầu ra bản dựng.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: [assetMap['/main.js']]
  });

  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
});
```

Vì server của bạn hiện đang kết xuất `<App assetMap={assetMap} />`, bạn cần kết xuất nó với `assetMap` trên client để tránh các lỗi hydration. Bạn có thể serialize và truyền `assetMap` cho client như sau:

```js {9-10}
// Bạn cần lấy JSON này từ công cụ bản dựng của bạn.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    // Cẩn thận: An toàn để stringify() cái này vì dữ liệu này không phải do người dùng tạo.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });

  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
});
```

Trong ví dụ trên, tùy chọn `bootstrapScriptContent` thêm một thẻ `<script>` nội tuyến bổ sung đặt biến `window.assetMap` toàn cục trên client. Điều này cho phép mã client đọc cùng một `assetMap`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Cả client và server đều kết xuất `App` với cùng một prop `assetMap`, vì vậy không có lỗi hydration.

</DeepDive>

---

### Kết xuất một cây React thành một chuỗi HTML tĩnh {/*rendering-a-react-tree-to-a-string-of-static-html*/}

Gọi `prerenderToNodeStream` để kết xuất ứng dụng của bạn thành một chuỗi HTML tĩnh:

```js
import { prerenderToNodeStream } from 'react-dom/static';

async function renderToString() {
  const {prelude} = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  
  return new Promise((resolve, reject) => {
    let data = '';
    prelude.on('data', chunk => {
      data += chunk;
    });
    prelude.on('end', () => resolve(data));
    prelude.on('error', reject);
  });
}
```

Điều này sẽ tạo ra đầu ra HTML không tương tác ban đầu của các component React của bạn. Trên client, bạn sẽ cần gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để *hydrate* HTML được tạo từ server đó và làm cho nó có tính tương tác.

---

### Chờ tất cả dữ liệu được tải {/*waiting-for-all-data-to-load*/}

`prerenderToNodeStream` đợi tất cả dữ liệu được tải trước khi hoàn thành việc tạo HTML tĩnh và resolve. Ví dụ: hãy xem xét một trang hồ sơ hiển thị ảnh bìa, một sidebar với bạn bè và ảnh và một danh sách các bài đăng:

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

Hãy tưởng tượng rằng `<Posts />` cần tải một số dữ liệu, điều này mất một chút thời gian. Lý tưởng nhất là bạn muốn đợi các bài đăng hoàn thành để nó được đưa vào HTML. Để thực hiện việc này, bạn có thể sử dụng Suspense để tạm dừng dữ liệu và `prerenderToNodeStream` sẽ đợi nội dung bị tạm dừng hoàn thành trước khi resolve thành HTML tĩnh.

<Note>

**Chỉ các nguồn dữ liệu hỗ trợ Suspense mới kích hoạt component Suspense.** Chúng bao gồm:

- Tìm nạp dữ liệu với các framework hỗ trợ Suspense như [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) và [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Tải mã component một cách lazy với [`lazy`](/reference/react/lazy)
- Đọc giá trị của một Promise với [`use`](/reference/react/use)

Suspense **không** phát hiện khi dữ liệu được tìm nạp bên trong một Effect hoặc trình xử lý sự kiện.

Cách chính xác bạn sẽ tải dữ liệu trong component `Posts` ở trên phụ thuộc vào framework của bạn. Nếu bạn sử dụng một framework hỗ trợ Suspense, bạn sẽ tìm thấy các chi tiết trong tài liệu tìm nạp dữ liệu của nó.

Việc tìm nạp dữ liệu hỗ trợ Suspense mà không sử dụng framework có ý kiến vẫn chưa được hỗ trợ. Các yêu cầu để triển khai một nguồn dữ liệu hỗ trợ Suspense là không ổn định và không được ghi lại. Một API chính thức để tích hợp các nguồn dữ liệu với Suspense sẽ được phát hành trong một phiên bản React trong tương lai.

</Note>

---

## Khắc phục sự cố {/*troubleshooting*/}

### Stream của tôi không bắt đầu cho đến khi toàn bộ ứng dụng được kết xuất {/*my-stream-doesnt-start-until-the-entire-app-is-rendered*/}

Phản hồi `prerenderToNodeStream` đợi cho đến khi toàn bộ ứng dụng kết thúc quá trình kết xuất, bao gồm cả việc chờ tất cả các ranh giới Suspense được resolve, trước khi resolve. Nó được thiết kế để tạo trang web tĩnh (SSG) trước thời hạn và không hỗ trợ truyền trực tuyến thêm nội dung khi nó tải.

Để truyền trực tuyến nội dung khi nó tải, hãy sử dụng API kết xuất server phát trực tuyến như [renderToPipeableStream](/reference/react-dom/server/renderToPipeableStream).
