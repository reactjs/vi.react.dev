---
title: Các API React DOM phía máy chủ
---

<Intro>

Các API `react-dom/server` cho phép bạn hiển thị phía máy chủ các thành phần React thành HTML. Các API này chỉ được sử dụng trên máy chủ ở cấp cao nhất của ứng dụng để tạo HTML ban đầu. Một [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) có thể gọi chúng cho bạn. Hầu hết các thành phần của bạn không cần nhập hoặc sử dụng chúng.

</Intro>

---

## Các API máy chủ cho Node.js Streams {/*server-apis-for-nodejs-streams*/}

Các phương thức này chỉ khả dụng trong các môi trường có [Node.js Streams:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) hiển thị một cây React thành một [Node.js Stream](https://nodejs.org/api/stream.html) có thể truyền tải được.

---

## Các API máy chủ cho Web Streams {/*server-apis-for-web-streams*/}

Các phương thức này chỉ khả dụng trong các môi trường có [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), bao gồm trình duyệt, Deno và một số runtime edge hiện đại:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) hiển thị một cây React thành một [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

---

## Các API máy chủ cũ cho các môi trường không hỗ trợ streaming {/*legacy-server-apis-for-non-streaming-environments*/}

Các phương thức này có thể được sử dụng trong các môi trường không hỗ trợ streams:

* [`renderToString`](/reference/react-dom/server/renderToString) hiển thị một cây React thành một chuỗi.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) hiển thị một cây React không tương tác thành một chuỗi.

Chúng có chức năng giới hạn so với các API streaming.
