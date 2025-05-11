---
title: Các API React DOM Tĩnh
---

<Intro>

Các API `react-dom/static` cho phép bạn tạo HTML tĩnh cho các thành phần React. Chúng có chức năng giới hạn so với các API streaming. Một [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) có thể gọi chúng cho bạn. Hầu hết các thành phần của bạn không cần nhập hoặc sử dụng chúng.

</Intro>

---

## Các API Tĩnh cho Web Streams {/*static-apis-for-web-streams*/}

Các phương thức này chỉ khả dụng trong các môi trường có [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), bao gồm trình duyệt, Deno và một số runtime edge hiện đại:

* [`prerender`](/reference/react-dom/static/prerender) hiển thị một cây React thành HTML tĩnh với một [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)


---

## Các API Tĩnh cho Node.js Streams {/*static-apis-for-nodejs-streams*/}

Các phương thức này chỉ khả dụng trong các môi trường có [Node.js Streams](https://nodejs.org/api/stream.html):

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) hiển thị một cây React thành HTML tĩnh với một [Node.js Stream.](https://nodejs.org/api/stream.html)
