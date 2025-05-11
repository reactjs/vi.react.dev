---
title: renderToPipeableStream
---

<Intro>

`renderToPipeableStream` kết xuất một cây React thành một [Node.js Stream](https://nodejs.org/api/stream.html) có thể truyền tải được.

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

API này dành riêng cho Node.js. Các môi trường có [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), như Deno và các runtime edge hiện đại, nên sử dụng [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) thay thế.

</Note>

---

## Tham khảo {/*reference*/}

### `renderToPipeableStream(reactNode, options?)` {/*rendertopipeablestream*/}

Gọi `renderToPipeableStream` để kết xuất cây React của bạn thành HTML vào một [Node.js Stream.](https://nodejs.org/api/stream.html#writable-streams)

```js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

Trên client, gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để làm cho HTML được tạo từ server trở nên tương tác.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reactNode`: Một node React mà bạn muốn kết xuất thành HTML. Ví dụ: một phần tử JSX như `<App />`. Nó được mong đợi đại diện cho toàn bộ tài liệu, vì vậy component `App` sẽ kết xuất thẻ `<html>`.

* **optional** `options`: Một đối tượng với các tùy chọn streaming.
  * **optional** `bootstrapScriptContent`: Nếu được chỉ định, chuỗi này sẽ được đặt trong một thẻ `<script>` nội tuyến.
  * **optional** `bootstrapScripts`: Một mảng các URL chuỗi cho các thẻ `<script>` để phát ra trên trang. Sử dụng cái này để bao gồm `<script>` gọi [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Bỏ qua nếu bạn không muốn chạy React trên client.
  * **optional** `bootstrapModules`: Giống như `bootstrapScripts`, nhưng phát ra [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) thay thế.
  * **optional** `identifierPrefix`: Một tiền tố chuỗi mà React sử dụng cho các ID được tạo bởi [`useId`.](/reference/react/useId) Hữu ích để tránh xung đột khi sử dụng nhiều root trên cùng một trang. Phải là cùng một tiền tố như đã truyền cho [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **optional** `namespaceURI`: Một chuỗi với [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) gốc cho stream. Mặc định là HTML thông thường. Truyền `'http://www.w3.org/2000/svg'` cho SVG hoặc `'http://www.w3.org/1998/Math/MathML'` cho MathML.
  * **optional** `nonce`: Một chuỗi [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) để cho phép các script cho [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **optional** `onAllReady`: Một callback kích hoạt khi tất cả quá trình kết xuất hoàn tất, bao gồm cả [shell](#specifying-what-goes-into-the-shell) và tất cả [nội dung bổ sung.](#streaming-more-content-as-it-loads) Bạn có thể sử dụng cái này thay vì `onShellReady` [cho trình thu thập thông tin và tạo tĩnh.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Nếu bạn bắt đầu streaming ở đây, bạn sẽ không nhận được bất kỳ tải tuần tự nào. Stream sẽ chứa HTML cuối cùng.
  * **optional** `onError`: Một callback kích hoạt bất cứ khi nào có lỗi server, cho dù [có thể khôi phục được](#recovering-from-errors-outside-the-shell) hay [không.](#recovering-from-errors-inside-the-shell) Theo mặc định, cái này chỉ gọi `console.error`. Nếu bạn ghi đè nó để [ghi lại các báo cáo sự cố,](#logging-crashes-on-the-server) hãy đảm bảo rằng bạn vẫn gọi `console.error`. Bạn cũng có thể sử dụng nó để [điều chỉnh mã trạng thái](#setting-the-status-code) trước khi shell được phát ra.
  * **optional** `onShellReady`: Một callback kích hoạt ngay sau khi [shell ban đầu](#specifying-what-goes-into-the-shell) đã được kết xuất. Bạn có thể [đặt mã trạng thái](#setting-the-status-code) và gọi `pipe` ở đây để bắt đầu streaming. React sẽ [stream nội dung bổ sung](#streaming-more-content-as-it-loads) sau shell cùng với các thẻ `<script>` nội tuyến thay thế các fallback tải HTML bằng nội dung.
  * **optional** `onShellError`: Một callback kích hoạt nếu có lỗi khi kết xuất shell ban đầu. Nó nhận lỗi làm đối số. Chưa có byte nào được phát ra từ stream và cả `onShellReady` lẫn `onAllReady` sẽ không được gọi, vì vậy bạn có thể [xuất ra một shell HTML fallback.](#recovering-from-errors-inside-the-shell)
  * **optional** `progressiveChunkSize`: Số byte trong một chunk. [Đọc thêm về heuristic mặc định.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)


#### Returns {/*returns*/}

`renderToPipeableStream` trả về một đối tượng với hai phương thức:

* `pipe` xuất HTML vào [Writable Node.js Stream](https://nodejs.org/api/stream.html#writable-streams) được cung cấp. Gọi `pipe` trong `onShellReady` nếu bạn muốn bật streaming hoặc trong `onAllReady` cho trình thu thập thông tin và tạo tĩnh.
* `abort` cho phép bạn [hủy bỏ kết xuất server](#aborting-server-rendering) và kết xuất phần còn lại trên client.

---

## Cách sử dụng {/*usage*/}

### Kết xuất một cây React thành HTML vào một Node.js Stream {/*rendering-a-react-tree-as-html-to-a-nodejs-stream*/}

Gọi `renderToPipeableStream` để kết xuất cây React của bạn thành HTML vào một [Node.js Stream:](https://nodejs.org/api/stream.html#writable-streams)

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { renderToPipeableStream } from 'react-dom/server';

// Cú pháp route handler phụ thuộc vào framework backend của bạn
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Cùng với <CodeStep step={1}>component root</CodeStep>, bạn cần cung cấp một danh sách <CodeStep step={2}>các đường dẫn `<script>` bootstrap</CodeStep>. Component root của bạn sẽ trả về **toàn bộ tài liệu bao gồm thẻ `<html>` gốc.**

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

React sẽ chèn [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) và <CodeStep step={2}>các thẻ `<script>` bootstrap</CodeStep> của bạn vào stream HTML kết quả:

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

Điều này sẽ đính kèm các trình xử lý sự kiện vào HTML được tạo từ server và làm cho nó có tính tương tác.

<DeepDive>

#### Đọc các đường dẫn CSS và JS asset từ đầu ra bản dựng {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Các URL asset cuối cùng (như các tệp JavaScript và CSS) thường được băm sau khi bản dựng. Ví dụ: thay vì `styles.css`, bạn có thể kết thúc với `styles.123456.css`. Băm tên tệp asset tĩnh đảm bảo rằng mọi bản dựng riêng biệt của cùng một asset sẽ có một tên tệp khác nhau. Điều này rất hữu ích vì nó cho phép bạn bật bộ nhớ đệm dài hạn một cách an toàn cho các asset tĩnh: một tệp có một tên nhất định sẽ không bao giờ thay đổi nội dung.

Tuy nhiên, nếu bạn không biết các URL asset cho đến sau bản dựng, bạn không có cách nào để đưa chúng vào mã nguồn. Ví dụ: mã hóa cứng `"/styles.css"` vào JSX như trước đây sẽ không hoạt động. Để giữ chúng bên ngoài mã nguồn của bạn, component root của bạn có thể đọc tên tệp thực từ một map được truyền dưới dạng một prop:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        ...
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
        ...
      </head>
      ...
    </html>
  );
}
```

Trên server, kết xuất `<App assetMap={assetMap} />` và truyền `assetMap` của bạn với các URL asset:

```js {1-5,8,9}
// Bạn sẽ cần lấy JSON này từ công cụ bản dựng của bạn, ví dụ: đọc nó từ đầu ra bản dựng.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Vì server của bạn hiện đang kết xuất `<App assetMap={assetMap} />`, bạn cần kết xuất nó với `assetMap` trên client để tránh các lỗi hydration. Bạn có thể tuần tự hóa và truyền `assetMap` cho client như thế này:

```js {9-10}
// Bạn sẽ cần lấy JSON này từ công cụ bản dựng của bạn.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // Cẩn thận: An toàn để stringify() cái này vì dữ liệu này không phải do người dùng tạo.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
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

### Streaming thêm nội dung khi nó tải {/*streaming-more-content-as-it-loads*/}

Streaming cho phép người dùng bắt đầu xem nội dung ngay cả trước khi tất cả dữ liệu đã được tải trên server. Ví dụ: hãy xem xét một trang hồ sơ hiển thị ảnh bìa, một sidebar với bạn bè và ảnh và một danh sách các bài đăng:

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

Hãy tưởng tượng rằng việc tải dữ liệu cho `<Posts />` mất một chút thời gian. Lý tưởng nhất là bạn muốn hiển thị phần còn lại của nội dung trang hồ sơ cho người dùng mà không cần đợi các bài đăng. Để làm điều này, [gói `Posts` trong một boundary `<Suspense>`:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

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

Điều này cho React biết để bắt đầu streaming HTML trước khi `Posts` tải dữ liệu của nó. React sẽ gửi HTML cho fallback tải (`PostsGlimmer`) trước, và sau đó, khi `Posts` hoàn tất việc tải dữ liệu của nó, React sẽ gửi HTML còn lại cùng với một thẻ `<script>` nội tuyến thay thế fallback tải bằng HTML đó. Từ góc độ của người dùng, trang sẽ xuất hiện đầu tiên với `PostsGlimmer`, sau đó được thay thế bằng `Posts`.

Bạn có thể tiếp tục [lồng các boundary `<Suspense>`](/reference/react/Suspense#revealing-nested-content-as-it-loads) để tạo một chuỗi tải chi tiết hơn:

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

Trong ví dụ này, React có thể bắt đầu streaming trang thậm chí sớm hơn. Chỉ `ProfileLayout` và `ProfileCover` phải hoàn tất việc kết xuất trước vì chúng không được gói trong bất kỳ boundary `<Suspense>`. Tuy nhiên, nếu `Sidebar`, `Friends` hoặc `Photos` cần tải một số dữ liệu, React sẽ gửi HTML cho fallback `BigSpinner` thay thế. Sau đó, khi có thêm dữ liệu, nhiều nội dung sẽ tiếp tục được hiển thị cho đến khi tất cả đều hiển thị.

Streaming không cần phải đợi React tải trong trình duyệt hoặc cho ứng dụng của bạn trở nên tương tác. Nội dung HTML từ server sẽ được hiển thị dần dần trước khi bất kỳ thẻ `<script>` nào tải.

[Đọc thêm về cách streaming HTML hoạt động.](https://github.com/reactwg/react-18/discussions/37)

<Note>

**Chỉ các nguồn dữ liệu hỗ trợ Suspense mới kích hoạt component Suspense.** Chúng bao gồm:

- Tìm nạp dữ liệu với các framework hỗ trợ Suspense như [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) và [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Tải mã component một cách lazy với [`lazy`](/reference/react/lazy)
- Đọc giá trị của một Promise với [`use`](/reference/react/use)

Suspense **không** phát hiện khi dữ liệu được tìm nạp bên trong một Effect hoặc trình xử lý sự kiện.

Cách chính xác bạn sẽ tải dữ liệu trong component `Posts` ở trên phụ thuộc vào framework của bạn. Nếu bạn sử dụng một framework hỗ trợ Suspense, bạn sẽ tìm thấy các chi tiết trong tài liệu tìm nạp dữ liệu của nó.

Tìm nạp dữ liệu hỗ trợ Suspense mà không sử dụng framework có ý kiến vẫn chưa được hỗ trợ. Các yêu cầu để triển khai một nguồn dữ liệu hỗ trợ Suspense là không ổn định và không được ghi lại. Một API chính thức để tích hợp các nguồn dữ liệu với Suspense sẽ được phát hành trong một phiên bản React trong tương lai.

</Note>

---

### Chỉ định những gì đi vào shell {/*specifying-what-goes-into-the-shell*/}

Phần ứng dụng của bạn bên ngoài bất kỳ boundary `<Suspense>` nào được gọi là *shell:*

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

Nếu bạn gói toàn bộ ứng dụng vào một boundary `<Suspense>` ở root, shell sẽ chỉ chứa spinner đó. Tuy nhiên, đó không phải là một trải nghiệm người dùng dễ chịu vì việc nhìn thấy một spinner lớn trên màn hình có thể cảm thấy chậm hơn và khó chịu hơn là chờ đợi thêm một chút và nhìn thấy bố cục thực tế. Đây là lý do tại sao bạn thường muốn đặt các boundary `<Suspense>` sao cho shell cảm thấy *tối thiểu nhưng hoàn chỉnh*--giống như một bộ xương của toàn bộ bố cục trang.

Callback `onShellReady` kích hoạt khi toàn bộ shell đã được kết xuất. Thông thường, bạn sẽ bắt đầu streaming sau đó:

```js {3-6}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

Vào thời điểm `onShellReady` kích hoạt, các component trong các boundary `<Suspense>` lồng nhau vẫn có thể đang tải dữ liệu.

---

### Ghi lại các sự cố trên server {/*logging-crashes-on-the-server*/}

Theo mặc định, tất cả các lỗi trên server được ghi vào console. Bạn có thể ghi đè hành vi này để ghi lại các báo cáo sự cố:

```js {7-10}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
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

Nếu một lỗi xảy ra trong khi kết xuất các component đó, React sẽ không có bất kỳ HTML có ý nghĩa nào để gửi đến client. Ghi đè `onShellError` để gửi một HTML fallback không dựa vào kết xuất server như là phương sách cuối cùng:

```js {7-11}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Đã xảy ra lỗi</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Nếu có lỗi trong khi tạo shell, cả `onError` và `onShellError` sẽ kích hoạt. Sử dụng `onError` để báo cáo lỗi và sử dụng `onShellError` để gửi tài liệu HTML fallback. HTML fallback của bạn không cần phải là một trang lỗi. Thay vào đó, bạn có thể bao gồm một shell thay thế chỉ kết xuất ứng dụng của bạn trên client.

---

### Khôi phục từ các lỗi bên ngoài shell {/*recovering-from-errors-outside-the-shell*/}

Trong ví dụ này, component `<Posts />` được gói trong `<Suspense>` vì vậy nó *không* phải là một phần của shell:

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

Nếu một lỗi xảy ra trong component `Posts` hoặc ở đâu đó bên trong nó, React sẽ [cố gắng khôi phục từ nó:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. Nó sẽ phát ra fallback tải cho boundary `<Suspense>` gần nhất (`PostsGlimmer`) vào HTML.
2. Nó sẽ "từ bỏ" việc cố gắng kết xuất nội dung `Posts` trên server nữa.
3. Khi mã JavaScript tải trên client, React sẽ *thử lại* kết xuất `Posts` trên client.

Nếu thử lại kết xuất `Posts` trên client *cũng* không thành công, React sẽ ném lỗi trên client. Như với tất cả các lỗi được ném trong quá trình kết xuất, [boundary lỗi cha gần nhất](/reference/react/Component#static-getderivedstatefromerror) xác định cách trình bày lỗi cho người dùng. Trong thực tế, điều này có nghĩa là người dùng sẽ thấy một chỉ báo tải cho đến khi chắc chắn rằng lỗi không thể khôi phục được.

Nếu thử lại kết xuất `Posts` trên client thành công, fallback tải từ server sẽ được thay thế bằng đầu ra kết xuất client. Người dùng sẽ không biết rằng có một lỗi server. Tuy nhiên, callback `onError` của server và callback [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) của client sẽ kích hoạt để bạn có thể được thông báo về lỗi.

---

### Đặt mã trạng thái {/*setting-the-status-code*/}

Streaming giới thiệu một sự đánh đổi. Bạn muốn bắt đầu streaming trang càng sớm càng tốt để người dùng có thể thấy nội dung sớm hơn. Tuy nhiên, khi bạn bắt đầu streaming, bạn không còn có thể đặt mã trạng thái phản hồi.

Bằng cách [chia ứng dụng của bạn](#specifying-what-goes-into-the-shell) thành shell (phía trên tất cả các boundary `<Suspense>`) và phần còn lại của nội dung, bạn đã giải quyết một phần của vấn đề này. Nếu shell bị lỗi, bạn sẽ nhận được callback `onShellError` cho phép bạn đặt mã trạng thái lỗi. Nếu không, bạn biết rằng ứng dụng có thể khôi phục trên client, vì vậy bạn có thể gửi "OK".

```js {4}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Đã xảy ra lỗi</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Nếu một component *bên ngoài* shell (tức là bên trong một boundary `<Suspense>`) ném một lỗi, React sẽ không ngừng kết xuất. Điều này có nghĩa là callback `onError` sẽ kích hoạt, nhưng bạn vẫn sẽ nhận được `onShellReady` thay vì `onShellError`. Điều này là do React sẽ cố gắng khôi phục từ lỗi đó trên client, [như được mô tả ở trên.](#recovering-from-errors-outside-the-shell)

Tuy nhiên, nếu bạn muốn, bạn có thể sử dụng thực tế là một cái gì đó đã bị lỗi để đặt mã trạng thái:

```js {1,6,16}
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Đã xảy ra lỗi</h1>'); 
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Điều này sẽ chỉ bắt các lỗi bên ngoài shell đã xảy ra trong khi tạo nội dung shell ban đầu, vì vậy nó không phải là đầy đủ. Nếu việc biết liệu một lỗi có xảy ra đối với một số nội dung là rất quan trọng, bạn có thể di chuyển nó lên shell.

---

### Xử lý các lỗi khác nhau theo những cách khác nhau {/*handling-different-errors-in-different-ways*/}

Bạn có thể [tạo các lớp con `Error` của riêng bạn](https://javascript.info/custom-errors) và sử dụng toán tử [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) để kiểm tra lỗi nào được ném. Ví dụ: bạn có thể xác định một `NotFoundError` tùy chỉnh và ném nó từ component của bạn. Sau đó, các callback `onError`, `onShellReady` và `onShellError` của bạn có thể làm một cái gì đó khác nhau tùy thuộc vào loại lỗi:

```js {2,4-14,19,24,30}
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

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Đã xảy ra lỗi</h1>'); 
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Hãy nhớ rằng khi bạn phát ra shell và bắt đầu streaming, bạn không thể thay đổi mã trạng thái.

---

### Chờ tất cả nội dung tải cho trình thu thập thông tin và tạo tĩnh {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

Streaming cung cấp trải nghiệm người dùng tốt hơn vì người dùng có thể thấy nội dung khi nó có sẵn.

Tuy nhiên, khi một trình thu thập thông tin truy cập trang của bạn hoặc nếu bạn đang tạo các trang tại thời điểm bản dựng, bạn có thể muốn cho phép tất cả nội dung tải trước và sau đó tạo ra đầu ra HTML cuối cùng thay vì hiển thị nó một cách tuần tự.

Bạn có thể đợi tất cả nội dung tải bằng callback `onAllReady`:


```js {2,7,11,18-24}
let didError = false;
let isCrawler = // ... phụ thuộc vào chiến lược phát hiện bot của bạn ...

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Đã xảy ra lỗi</h1>'); 
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);      
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Một khách truy cập thông thường sẽ nhận được một stream nội dung được tải tuần tự. Một trình thu thập thông tin sẽ nhận được đầu ra HTML cuối cùng sau khi tất cả dữ liệu tải. Tuy nhiên, điều này cũng có nghĩa là trình thu thập thông tin sẽ phải đợi *tất cả* dữ liệu, một số trong đó có thể tải chậm hoặc bị lỗi. Tùy thuộc vào ứng dụng của bạn, bạn có thể chọn gửi shell cho trình thu thập thông tin.

---

### Hủy bỏ kết xuất server {/*aborting-server-rendering*/}

Bạn có thể buộc kết xuất server "từ bỏ" sau một thời gian chờ:

```js {1,5-7}
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

React sẽ flush các fallback tải còn lại dưới dạng HTML và sẽ cố gắng kết xuất phần còn lại trên client.
