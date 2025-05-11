---
title: renderToStaticMarkup
---

<Intro>

`renderToStaticMarkup` hiển thị một cây React không tương tác thành một chuỗi HTML.

```js
const html = renderToStaticMarkup(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `renderToStaticMarkup(reactNode, options?)` {/*rendertostaticmarkup*/}

Trên máy chủ, gọi `renderToStaticMarkup` để hiển thị ứng dụng của bạn thành HTML.

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

Nó sẽ tạo ra đầu ra HTML không tương tác của các thành phần React của bạn.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reactNode`: Một nút React mà bạn muốn hiển thị thành HTML. Ví dụ: một nút JSX như `<Page />`.
* **tùy chọn** `options`: Một đối tượng cho quá trình hiển thị trên máy chủ.
  * **tùy chọn** `identifierPrefix`: Một tiền tố chuỗi mà React sử dụng cho các ID được tạo bởi [`useId`.](/reference/react/useId) Hữu ích để tránh xung đột khi sử dụng nhiều gốc trên cùng một trang.

#### Giá trị trả về {/*returns*/}

Một chuỗi HTML.

#### Lưu ý {/*caveats*/}

* Đầu ra của `renderToStaticMarkup` không thể hydrate.

* `renderToStaticMarkup` có hỗ trợ Suspense hạn chế. Nếu một thành phần tạm ngưng, `renderToStaticMarkup` sẽ gửi ngay lập tức fallback của nó dưới dạng HTML.

* `renderToStaticMarkup` hoạt động trong trình duyệt, nhưng không nên sử dụng nó trong mã phía máy khách. Nếu bạn cần hiển thị một thành phần thành HTML trong trình duyệt, [lấy HTML bằng cách hiển thị nó vào một nút DOM.](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)

---

## Cách sử dụng {/*usage*/}

### Hiển thị một cây React không tương tác thành HTML thành một chuỗi {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

Gọi `renderToStaticMarkup` để hiển thị ứng dụng của bạn thành một chuỗi HTML mà bạn có thể gửi cùng với phản hồi của máy chủ:

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// Cú pháp trình xử lý tuyến đường phụ thuộc vào framework backend của bạn
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

Điều này sẽ tạo ra đầu ra HTML không tương tác ban đầu của các thành phần React của bạn.

<Pitfall>

Phương pháp này hiển thị **HTML không tương tác và không thể hydrate.** Điều này hữu ích nếu bạn muốn sử dụng React như một trình tạo trang tĩnh đơn giản hoặc nếu bạn đang hiển thị nội dung hoàn toàn tĩnh như email.

Các ứng dụng tương tác nên sử dụng [`renderToString`](/reference/react-dom/server/renderToString) trên máy chủ và [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) trên máy khách.

</Pitfall>
