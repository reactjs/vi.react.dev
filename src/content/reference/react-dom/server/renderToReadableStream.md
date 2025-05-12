---
title: renderToReadableStream
---

<Intro>

`renderToReadableStream` hiển thị một cây React thành một [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
const stream = await renderToReadableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

API này phụ thuộc vào [Web Streams.](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) Đối với Node.js, hãy sử dụng [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) thay thế.

</Note>

---

## Tham khảo {/*reference*/}

### `renderToReadableStream(reactNode, options?)` {/*rendertoreadablestream*/}

Gọi `renderToReadableStream` để hiển thị cây React của bạn thành HTML vào một [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Trên máy khách, gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để làm cho HTML được tạo từ máy chủ trở nên tương tác.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reactNode`: Một nút React mà bạn muốn hiển thị thành HTML. Ví dụ: một phần tử JSX như `<App />`. Nó được mong đợi đại diện cho toàn bộ tài liệu, vì vậy thành phần `App` sẽ hiển thị thẻ `<html>`.

* **tùy chọn** `options`: Một đối tượng với các tùy chọn phát trực tuyến.
  * **tùy chọn** `bootstrapScriptContent`: Nếu được chỉ định, chuỗi này sẽ được đặt trong một thẻ `<script>` nội tuyến.
  * **tùy chọn** `bootstrapScripts`: Một mảng các URL chuỗi cho các thẻ `<script>` để phát ra trên trang. Sử dụng cái này để bao gồm `<script>` gọi [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Bỏ qua nó nếu bạn không muốn chạy React trên máy khách.
  * **tùy chọn** `bootstrapModules`: Giống như `bootstrapScripts`, nhưng phát ra [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) thay thế.
  * **tùy chọn** `identifierPrefix`: Một tiền tố chuỗi mà React sử dụng cho các ID được tạo bởi [`useId`.](/reference/react/useId) Hữu ích để tránh xung đột khi sử dụng nhiều gốc trên cùng một trang. Phải là cùng một tiền tố như được chuyển đến [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **tùy chọn** `namespaceURI`: Một chuỗi với [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) gốc cho luồng. Mặc định là HTML thông thường. Chuyển `'http://www.w3.org/2000/svg'` cho SVG hoặc `'http://www.w3.org/1998/Math/MathML'` cho MathML.
  * **tùy chọn** `nonce`: Một chuỗi [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) để cho phép các tập lệnh cho [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **tùy chọn** `onError`: Một callback kích hoạt bất cứ khi nào có lỗi máy chủ, cho dù [có thể khôi phục được](#recovering-from-errors-outside-the-shell) hay [không.](#recovering-from-errors-inside-the-shell) Theo mặc định, điều này chỉ gọi `console.error`. Nếu bạn ghi đè nó để [ghi lại báo cáo sự cố,](#logging-crashes-on-the-server) hãy đảm bảo rằng bạn vẫn gọi `console.error`. Bạn cũng có thể sử dụng nó để [điều chỉnh mã trạng thái](#setting-the-status-code) trước khi shell được phát ra.
  * **tùy chọn** `progressiveChunkSize`: Số byte trong một chunk. [Đọc thêm về heuristic mặc định.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **tùy chọn** `signal`: Một [tín hiệu hủy bỏ](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) cho phép bạn [hủy bỏ quá trình hiển thị máy chủ](#aborting-server-rendering) và hiển thị phần còn lại trên máy khách.


#### Trả về {/*returns*/}

`renderToReadableStream` trả về một Promise:

- Nếu hiển thị [shell](#specifying-what-goes-into-the-shell) thành công, Promise đó sẽ phân giải thành một [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
- Nếu hiển thị shell không thành công, Promise sẽ bị từ chối. [Sử dụng cái này để xuất một shell dự phòng.](#recovering-from-errors-inside-the-shell)

Luồng trả về có một thuộc tính bổ sung:

* `allReady`: Một Promise phân giải khi tất cả quá trình hiển thị hoàn tất, bao gồm cả [shell](#specifying-what-goes-into-the-shell) và tất cả [nội dung bổ sung.](#streaming-more-content-as-it-loads) Bạn có thể `await stream.allReady` trước khi trả về một phản hồi [cho trình thu thập thông tin và tạo tĩnh.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Nếu bạn làm điều đó, bạn sẽ không nhận được bất kỳ tải lũy tiến nào. Luồng sẽ chứa HTML cuối cùng.

---

## Cách sử dụng {/*usage*/}

### Hiển thị một cây React thành HTML thành một Readable Web Stream {/*rendering-a-react-tree-as-html-to-a-readable-web-stream*/}

Gọi `renderToReadableStream` để hiển thị cây React của bạn thành HTML vào một [Readable Web Stream:](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
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
  {/* ... HTML từ các thành phần của bạn ... */}
</html>
<script src="/main.js" async=""></script>
```

Trên máy khách, tập lệnh bootstrap của bạn sẽ [hydrate toàn bộ `document` bằng một lệnh gọi đến `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Điều này sẽ đính kèm các trình nghe sự kiện vào HTML được tạo từ máy chủ và làm cho nó có tính tương tác.

<DeepDive>

#### Đọc đường dẫn CSS và JS asset từ đầu ra bản dựng {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Các URL asset cuối cùng (như tệp JavaScript và CSS) thường được băm sau khi xây dựng. Ví dụ: thay vì `styles.css`, bạn có thể kết thúc với `styles.123456.css`. Băm tên tệp asset tĩnh đảm bảo rằng mọi bản dựng riêng biệt của cùng một asset sẽ có một tên tệp khác nhau. Điều này rất hữu ích vì nó cho phép bạn bật bộ nhớ cache dài hạn một cách an toàn cho các asset tĩnh: một tệp có tên nhất định sẽ không bao giờ thay đổi nội dung.

Tuy nhiên, nếu bạn không biết URL asset cho đến sau khi xây dựng, bạn không có cách nào để đưa chúng vào mã nguồn. Ví dụ: mã hóa cứng `"/styles.css"` vào JSX như trước đây sẽ không hoạt động. Để giữ chúng bên ngoài mã nguồn của bạn, thành phần gốc của bạn có thể đọc tên tệp thực từ một bản đồ được truyền dưới dạng một prop:

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

Trên máy chủ, hiển thị `<App assetMap={assetMap} />` và chuyển `assetMap` của bạn với các URL asset:

```js {1-5,8,9}
// Bạn cần lấy JSON này từ công cụ xây dựng của bạn, ví dụ: đọc nó từ đầu ra bản dựng.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Vì máy chủ của bạn hiện đang hiển thị `<App assetMap={assetMap} />`, bạn cần hiển thị nó với `assetMap` trên máy khách để tránh lỗi hydration. Bạn có thể tuần tự hóa và chuyển `assetMap` cho máy khách như thế này:

```js {9-10}
// Bạn cần lấy JSON này từ công cụ xây dựng của bạn.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    // Cẩn thận: An toàn để stringify() cái này vì dữ liệu này không phải do người dùng tạo.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(stream, {
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

Cả máy khách và máy chủ đều hiển thị `App` với cùng một prop `assetMap`, vì vậy không có lỗi hydration.

</DeepDive>

---

### Phát trực tuyến thêm nội dung khi nó tải {/*streaming-more-content-as-it-loads*/}

Phát trực tuyến cho phép người dùng bắt đầu xem nội dung ngay cả trước khi tất cả dữ liệu đã được tải trên máy chủ. Ví dụ: hãy xem xét một trang hồ sơ hiển thị ảnh bìa, một thanh bên với bạn bè và ảnh và một danh sách các bài đăng:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

Hãy tưởng tượng rằng việc tải dữ liệu cho `<Posts />` mất một chút thời gian. Lý tưởng nhất là bạn muốn hiển thị phần còn lại của nội dung trang hồ sơ cho người dùng mà không cần chờ các bài đăng. Để làm điều này, [gói `Posts` trong một ranh giới `<Suspense>`:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

```js {9,11}
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

Điều này cho React biết để bắt đầu phát trực tuyến HTML trước khi `Posts` tải dữ liệu của nó. React sẽ gửi HTML cho fallback tải (`PostsGlimmer`) trước, và sau đó, khi `Posts` hoàn tất việc tải dữ liệu của nó, React sẽ gửi HTML còn lại cùng với một thẻ `<script>` nội tuyến thay thế fallback tải bằng HTML đó. Từ quan điểm của người dùng, trang sẽ xuất hiện đầu tiên với `PostsGlimmer`, sau đó được thay thế bằng `Posts`.

Bạn có thể tiếp tục [lồng các ranh giới `<Suspense>`](/reference/react/Suspense#revealing-nested-content-as-it-loads) để tạo một chuỗi tải chi tiết hơn:

```js {5,13}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```


Trong ví dụ này, React có thể bắt đầu phát trực tuyến trang thậm chí sớm hơn. Chỉ `ProfileLayout` và `ProfileCover` phải hoàn thành hiển thị trước vì chúng không được gói trong bất kỳ ranh giới `<Suspense>` nào. Tuy nhiên, nếu `Sidebar`, `Friends` hoặc `Photos` cần tải một số dữ liệu, React sẽ gửi HTML cho fallback `BigSpinner` thay thế. Sau đó, khi có thêm dữ liệu, nhiều nội dung sẽ tiếp tục được hiển thị cho đến khi tất cả đều trở nên hiển thị.

Phát trực tuyến không cần phải đợi React tự tải trong trình duyệt hoặc cho ứng dụng của bạn trở nên tương tác. Nội dung HTML từ máy chủ sẽ được hiển thị dần dần trước khi bất kỳ thẻ `<script>` nào tải.

[Đọc thêm về cách hoạt động của HTML phát trực tuyến.](https://github.com/reactwg/react-18/discussions/37)

<Note>

**Chỉ các nguồn dữ liệu hỗ trợ Suspense mới kích hoạt thành phần Suspense.** Chúng bao gồm:

- Tìm nạp dữ liệu với các framework hỗ trợ Suspense như [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) và [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Tải mã thành phần lười biếng với [`lazy`](/reference/react/lazy)
- Đọc giá trị của một Promise với [`use`](/reference/react/use)

Suspense **không** phát hiện khi dữ liệu được tìm nạp bên trong một Effect hoặc trình xử lý sự kiện.

Cách chính xác bạn sẽ tải dữ liệu trong thành phần `Posts` ở trên phụ thuộc vào framework của bạn. Nếu bạn sử dụng một framework hỗ trợ Suspense, bạn sẽ tìm thấy các chi tiết trong tài liệu tìm nạp dữ liệu của nó.

Tìm nạp dữ liệu hỗ trợ Suspense mà không sử dụng một framework có ý kiến vẫn chưa được hỗ trợ. Các yêu cầu để triển khai một nguồn dữ liệu hỗ trợ Suspense là không ổn định và không được ghi lại. Một API chính thức để tích hợp các nguồn dữ liệu với Suspense sẽ được phát hành trong một phiên bản React trong tương lai.

</Note>

---

### Chỉ định những gì đi vào shell {/*specifying-what-goes-into-the-shell*/}

Phần ứng dụng của bạn bên ngoài bất kỳ ranh giới `<Suspense>` nào được gọi là *shell:*

```js {3-5,13,14}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

Nó xác định trạng thái tải sớm nhất mà người dùng có thể thấy:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

Nếu bạn gói toàn bộ ứng dụng vào một ranh giới `<Suspense>` ở gốc, shell sẽ chỉ chứa spinner đó. Tuy nhiên, đó không phải là một trải nghiệm người dùng dễ chịu vì việc nhìn thấy một spinner lớn trên màn hình có thể cảm thấy chậm hơn và khó chịu hơn là chờ đợi thêm một chút và nhìn thấy bố cục thực tế. Đây là lý do tại sao bạn thường muốn đặt các ranh giới `<Suspense>` để shell cảm thấy *tối thiểu nhưng hoàn chỉnh*--giống như một bộ xương của toàn bộ bố cục trang.

Lệnh gọi không đồng bộ đến `renderToReadableStream` sẽ phân giải thành một `stream` ngay sau khi toàn bộ shell đã được hiển thị. Thông thường, bạn sẽ bắt đầu phát trực tuyến sau đó bằng cách tạo và trả về một phản hồi với `stream` đó:

```js {5}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Vào thời điểm `stream` được trả về, các thành phần trong các ranh giới `<Suspense>` lồng nhau có thể vẫn đang tải dữ liệu.

---

### Ghi lại sự cố trên máy chủ {/*logging-crashes-on-the-server*/}

Theo mặc định, tất cả các lỗi trên máy chủ được ghi vào console. Bạn có thể ghi đè hành vi này để ghi lại báo cáo sự cố:

```js {4-7}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onError(error) {
      console.error(error);
      logServerCrashReport(error);
    }
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Nếu bạn cung cấp một triển khai `onError` tùy chỉnh, đừng quên ghi lại các lỗi vào console như trên.

---

### Khôi phục từ các lỗi bên trong shell {/*recovering-from-errors-inside-the-shell*/}

Trong ví dụ này, shell chứa `ProfileLayout`, `ProfileCover` và `PostsGlimmer`:

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Nếu một lỗi xảy ra trong khi hiển thị các thành phần đó, React sẽ không có bất kỳ HTML có ý nghĩa nào để gửi đến máy khách. Gói lệnh gọi `renderToReadableStream` của bạn trong một `try...catch` để gửi một HTML fallback không dựa vào hiển thị máy chủ như là phương sách cuối cùng:

```js {2,13-18}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Đã xảy ra lỗi</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Nếu có một lỗi trong khi tạo shell, cả `onError` và khối `catch` của bạn sẽ kích hoạt. Sử dụng `onError` để báo cáo lỗi và sử dụng khối `catch` để gửi tài liệu HTML fallback. HTML fallback của bạn không cần phải là một trang lỗi. Thay vào đó, bạn có thể bao gồm một shell thay thế chỉ hiển thị ứng dụng của bạn trên máy khách.

---

### Khôi phục từ các lỗi bên ngoài shell {/*recovering-from-errors-outside-the-shell*/}

Trong ví dụ này, thành phần `<Posts />` được gói trong `<Suspense>` vì vậy nó *không* phải là một phần của shell:

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Nếu một lỗi xảy ra trong thành phần `Posts` hoặc đâu đó bên trong nó, React sẽ [cố gắng khôi phục từ nó:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. Nó sẽ phát ra fallback tải cho ranh giới `<Suspense>` gần nhất (`PostsGlimmer`) vào HTML.
2. Nó sẽ "từ bỏ" việc cố gắng hiển thị nội dung `Posts` trên máy chủ nữa.
3. Khi mã JavaScript tải trên máy khách, React sẽ *thử lại* hiển thị `Posts` trên máy khách.

Nếu thử lại hiển thị `Posts` trên máy khách *cũng* không thành công, React sẽ ném lỗi trên máy khách. Như với tất cả các lỗi được ném trong quá trình hiển thị, [ranh giới lỗi mẹ gần nhất](/reference/react/Component#static-getderivedstatefromerror) xác định cách trình bày lỗi cho người dùng. Trong thực tế, điều này có nghĩa là người dùng sẽ thấy một chỉ báo tải cho đến khi chắc chắn rằng lỗi không thể khôi phục được.

Nếu thử lại hiển thị `Posts` trên máy khách thành công, fallback tải từ máy chủ sẽ được thay thế bằng đầu ra hiển thị máy khách. Người dùng sẽ không biết rằng có một lỗi máy chủ. Tuy nhiên, callback `onError` máy chủ và callback [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) máy khách sẽ kích hoạt để bạn có thể được thông báo về lỗi.

---

### Đặt mã trạng thái {/*setting-the-status-code*/}

Phát trực tuyến giới thiệu một sự đánh đổi. Bạn muốn bắt đầu phát trực tuyến trang càng sớm càng tốt để người dùng có thể thấy nội dung sớm hơn. Tuy nhiên, khi bạn bắt đầu phát trực tuyến, bạn không còn có thể đặt mã trạng thái phản hồi.

Bằng cách [chia ứng dụng của bạn](#specifying-what-goes-into-the-shell) thành shell (trên tất cả các ranh giới `<Suspense>`) và phần còn lại của nội dung, bạn đã giải quyết một phần của vấn đề này. Nếu shell bị lỗi, khối `catch` của bạn sẽ chạy cho phép bạn đặt mã trạng thái lỗi. Nếu không, bạn biết rằng ứng dụng có thể khôi phục trên máy khách, vì vậy bạn có thể gửi "OK".

```js {11}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Đã xảy ra lỗi</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Nếu một thành phần *bên ngoài* shell (tức là bên trong một ranh giới `<Suspense>`) ném một lỗi, React sẽ không ngừng hiển thị. Điều này có nghĩa là callback `onError` sẽ kích hoạt, nhưng mã của bạn sẽ tiếp tục chạy mà không đi vào khối `catch`. Điều này là do React sẽ cố gắng khôi phục từ lỗi đó trên máy khách, [như được mô tả ở trên.](#recovering-from-errors-outside-the-shell)

Tuy nhiên, nếu bạn muốn, bạn có thể sử dụng thực tế là một cái gì đó đã bị lỗi để đặt mã trạng thái:

```js {3,7,13}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Đã xảy ra lỗi</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Điều này sẽ chỉ bắt các lỗi bên ngoài shell đã xảy ra trong khi tạo nội dung shell ban đầu, vì vậy nó không đầy đủ. Nếu biết liệu một lỗi có xảy ra đối với một số nội dung là rất quan trọng, bạn có thể di chuyển nó lên shell.

---

### Xử lý các lỗi khác nhau theo những cách khác nhau {/*handling-different-errors-in-different-ways*/}

Bạn có thể [tạo các lớp con `Error` của riêng bạn](https://javascript.info/custom-errors) và sử dụng toán tử [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) để kiểm tra lỗi nào được ném. Ví dụ: bạn có thể xác định một `NotFoundError` tùy chỉnh và ném nó từ thành phần của bạn. Sau đó, bạn có thể lưu lỗi trong `onError` và làm điều gì đó khác trước khi trả về phản hồi tùy thuộc vào loại lỗi:

```js {2-3,5-15,22,28,33}
async function handler(request) {
  let didError = false;
  let caughtError = null;

  function getStatusCode() {
    if (didError) {
      if (caughtError instanceof NotFoundError) {
        return 404;
      } else {
        return 500;
      }
    } else {
      return 200;
    }
  }

  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        caughtError = error;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Đã xảy ra lỗi</h1>', {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Hãy nhớ rằng khi bạn phát ra shell và bắt đầu phát trực tuyến, bạn không thể thay đổi mã trạng thái.

---

### Chờ tất cả nội dung tải cho trình thu thập thông tin và tạo tĩnh {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

Phát trực tuyến cung cấp một trải nghiệm người dùng tốt hơn vì người dùng có thể thấy nội dung khi nó có sẵn.

Tuy nhiên, khi một trình thu thập thông tin truy cập trang của bạn, hoặc nếu bạn đang tạo các trang tại thời điểm xây dựng, bạn có thể muốn để tất cả nội dung tải trước và sau đó tạo ra đầu ra HTML cuối cùng thay vì hiển thị nó dần dần.

Bạn có thể đợi tất cả nội dung tải bằng cách chờ Promise `stream.allReady`:

```js {12-15}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    let isCrawler = // ... phụ thuộc vào chiến lược phát hiện bot của bạn ...
    if (isCrawler) {
      await stream.allReady;
    }
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Đã xảy ra lỗi</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Một khách truy cập thông thường sẽ nhận được một luồng nội dung được tải dần dần. Một trình thu thập thông tin sẽ nhận được đầu ra HTML cuối cùng sau khi tất cả dữ liệu tải. Tuy nhiên, điều này cũng có nghĩa là trình thu thập thông tin sẽ phải đợi *tất cả* dữ liệu, một số trong đó có thể tải chậm hoặc bị lỗi. Tùy thuộc vào ứng dụng của bạn, bạn có thể chọn gửi shell cho trình thu thập thông tin.

---

### Hủy bỏ quá trình hiển thị máy chủ {/*aborting-server-rendering*/}

Bạn có thể buộc quá trình hiển thị máy chủ "từ bỏ" sau một thời gian chờ:

```js {3,4-6,9}
async function handler(request) {
  try {
    const controller = new AbortController();
    setTimeout(() => {
      controller.abort();
    }, 10000);

    const stream = await renderToReadableStream(<App />, {
      signal: controller.signal,
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    // ...
```

React sẽ xả các fallback tải còn lại dưới dạng HTML và sẽ cố gắng hiển thị phần còn lại trên máy khách.
