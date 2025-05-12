---
title: renderToString
---

<Pitfall>

`renderToString` không hỗ trợ truyền trực tuyến hoặc chờ dữ liệu. [Xem các lựa chọn thay thế.](#alternatives)

</Pitfall>

<Intro>

`renderToString` hiển thị một cây React thành một chuỗi HTML.

```js
const html = renderToString(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `renderToString(reactNode, options?)` {/*rendertostring*/}

Trên máy chủ, gọi `renderToString` để hiển thị ứng dụng của bạn thành HTML.

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

Trên máy khách, gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để làm cho HTML được tạo từ máy chủ trở nên tương tác.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reactNode`: Một nút React mà bạn muốn hiển thị thành HTML. Ví dụ: một nút JSX như `<App />`.

* **tùy chọn** `options`: Một đối tượng cho hiển thị phía máy chủ.
  * **tùy chọn** `identifierPrefix`: Một tiền tố chuỗi mà React sử dụng cho các ID được tạo bởi [`useId`.](/reference/react/useId) Hữu ích để tránh xung đột khi sử dụng nhiều gốc trên cùng một trang. Phải là cùng một tiền tố như đã truyền cho [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)

#### Trả về {/*returns*/}

Một chuỗi HTML.

#### Lưu ý {/*caveats*/}

* `renderToString` có hỗ trợ Suspense hạn chế. Nếu một thành phần tạm dừng, `renderToString` sẽ gửi ngay lập tức phần dự phòng của nó dưới dạng HTML.

* `renderToString` hoạt động trong trình duyệt, nhưng việc sử dụng nó trong mã phía máy khách là [không được khuyến nghị.](#removing-rendertostring-from-the-client-code)

---

## Cách sử dụng {/*usage*/}

### Hiển thị một cây React thành HTML thành một chuỗi {/*rendering-a-react-tree-as-html-to-a-string*/}

Gọi `renderToString` để hiển thị ứng dụng của bạn thành một chuỗi HTML mà bạn có thể gửi cùng với phản hồi của máy chủ:

```js {5-6}
import { renderToString } from 'react-dom/server';

// Cú pháp trình xử lý tuyến đường phụ thuộc vào khung máy chủ của bạn
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

Điều này sẽ tạo ra đầu ra HTML không tương tác ban đầu của các thành phần React của bạn. Trên máy khách, bạn sẽ cần gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để *hydrate* HTML được tạo từ máy chủ đó và làm cho nó có tính tương tác.

<Pitfall>

`renderToString` không hỗ trợ truyền trực tuyến hoặc chờ dữ liệu. [Xem các lựa chọn thay thế.](#alternatives)

</Pitfall>

---

## Các lựa chọn thay thế {/*alternatives*/}

### Di chuyển từ `renderToString` sang hiển thị phát trực tuyến trên máy chủ {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString` trả về một chuỗi ngay lập tức, vì vậy nó không hỗ trợ truyền trực tuyến nội dung khi nó tải.

Khi có thể, chúng tôi khuyên bạn nên sử dụng các giải pháp thay thế đầy đủ tính năng này:

* Nếu bạn sử dụng Node.js, hãy sử dụng [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)
* Nếu bạn sử dụng Deno hoặc một thời gian chạy biên hiện đại với [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), hãy sử dụng [`renderToReadableStream`.](/reference/react-dom/server/renderToReadableStream)

Bạn có thể tiếp tục sử dụng `renderToString` nếu môi trường máy chủ của bạn không hỗ trợ luồng.

---

### Di chuyển từ `renderToString` sang kết xuất trước tĩnh trên máy chủ {/*migrating-from-rendertostring-to-a-static-prerender-on-the-server*/}

`renderToString` trả về một chuỗi ngay lập tức, vì vậy nó không hỗ trợ chờ dữ liệu tải để tạo HTML tĩnh.

Chúng tôi khuyên bạn nên sử dụng các giải pháp thay thế đầy đủ tính năng này:

* Nếu bạn sử dụng Node.js, hãy sử dụng [`prerenderToNodeStream`.](/reference/react-dom/static/prerenderToNodeStream)
* Nếu bạn sử dụng Deno hoặc một thời gian chạy biên hiện đại với [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), hãy sử dụng [`prerender`.](/reference/react-dom/static/prerender)

Bạn có thể tiếp tục sử dụng `renderToString` nếu môi trường tạo trang web tĩnh của bạn không hỗ trợ luồng.

---

### Loại bỏ `renderToString` khỏi mã phía máy khách {/*removing-rendertostring-from-the-client-code*/}

Đôi khi, `renderToString` được sử dụng trên máy khách để chuyển đổi một số thành phần sang HTML.

```js {1-2}
// 🚩 Không cần thiết: sử dụng renderToString trên máy khách
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // Ví dụ: "<svg>...</svg>"
```

Nhập `react-dom/server` **trên máy khách** làm tăng kích thước gói của bạn một cách không cần thiết và nên tránh. Nếu bạn cần hiển thị một số thành phần sang HTML trong trình duyệt, hãy sử dụng [`createRoot`](/reference/react-dom/client/createRoot) và đọc HTML từ DOM:

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // Ví dụ: "<svg>...</svg>"
```

Lệnh gọi [`flushSync`](/reference/react-dom/flushSync) là cần thiết để DOM được cập nhật trước khi đọc thuộc tính [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) của nó.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Khi một thành phần tạm dừng, HTML luôn chứa một dự phòng {/*when-a-component-suspends-the-html-always-contains-a-fallback*/}

`renderToString` không hỗ trợ đầy đủ Suspense.

Nếu một số thành phần tạm dừng (ví dụ: vì nó được xác định bằng [`lazy`](/reference/react/lazy) hoặc tìm nạp dữ liệu), `renderToString` sẽ không đợi nội dung của nó được giải quyết. Thay vào đó, `renderToString` sẽ tìm ranh giới [`<Suspense>`](/reference/react/Suspense) gần nhất ở trên nó và hiển thị thuộc tính `fallback` của nó trong HTML. Nội dung sẽ không xuất hiện cho đến khi mã phía máy khách tải.

Để giải quyết vấn đề này, hãy sử dụng một trong các [giải pháp phát trực tuyến được đề xuất.](#alternatives) Đối với kết xuất phía máy chủ, chúng có thể truyền trực tuyến nội dung theo các đoạn khi nó được giải quyết trên máy chủ để người dùng thấy trang được điền dần dần trước khi mã phía máy khách tải. Đối với tạo trang web tĩnh, chúng có thể đợi tất cả nội dung được giải quyết trước khi tạo HTML tĩnh.
