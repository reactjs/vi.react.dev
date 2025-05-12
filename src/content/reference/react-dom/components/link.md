---
link: "<link>"
---

<Intro>

[Thành phần `<link>` tích hợp sẵn của trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) cho phép bạn sử dụng các tài nguyên bên ngoài như biểu định kiểu hoặc chú thích tài liệu bằng siêu dữ liệu liên kết.

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<link>` {/*link*/}

Để liên kết đến các tài nguyên bên ngoài như biểu định kiểu, phông chữ và biểu tượng, hoặc để chú thích tài liệu bằng siêu dữ liệu liên kết, hãy hiển thị [thành phần `<link>` tích hợp sẵn của trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link). Bạn có thể hiển thị `<link>` từ bất kỳ thành phần nào và React sẽ [trong hầu hết các trường hợp](#special-rendering-behavior) đặt phần tử DOM tương ứng trong phần đầu của tài liệu.

```js
<link rel="icon" href="favicon.ico" />
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<link>` hỗ trợ tất cả [các props phần tử thông thường.](/reference/react-dom/components/common#props)

* `rel`: một chuỗi, bắt buộc. Chỉ định [mối quan hệ với tài nguyên](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel). React [xử lý các liên kết có `rel="stylesheet"` khác biệt](#special-rendering-behavior) so với các liên kết khác.

Các props này áp dụng khi `rel="stylesheet"`:

* `precedence`: một chuỗi. Cho React biết vị trí xếp hạng nút DOM `<link>` so với các nút khác trong `<head>` của tài liệu, điều này xác định biểu định kiểu nào có thể ghi đè biểu định kiểu khác. React sẽ suy ra rằng các giá trị precedence mà nó khám phá đầu tiên là "thấp hơn" và các giá trị precedence mà nó khám phá sau là "cao hơn". Nhiều hệ thống kiểu có thể hoạt động tốt bằng cách sử dụng một giá trị precedence duy nhất vì các quy tắc kiểu là nguyên tử. Các biểu định kiểu có cùng precedence đi cùng nhau cho dù chúng là thẻ `<link>` hay thẻ `<style>` nội tuyến hoặc được tải bằng các hàm [`preinit`](/reference/react-dom/preinit).
* `media`: một chuỗi. Hạn chế biểu định kiểu cho một [truy vấn phương tiện](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) nhất định.
* `title`: một chuỗi. Chỉ định tên của một [biểu định kiểu thay thế](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

Các props này áp dụng khi `rel="stylesheet"` nhưng tắt [cách xử lý đặc biệt của React đối với biểu định kiểu](#special-rendering-behavior):

* `disabled`: một boolean. Vô hiệu hóa biểu định kiểu.
* `onError`: một hàm. Được gọi khi biểu định kiểu không tải được.
* `onLoad`: một hàm. Được gọi khi biểu định kiểu tải xong.

Các props này áp dụng khi `rel="preload"` hoặc `rel="modulepreload"`:

* `as`: một chuỗi. Loại tài nguyên. Các giá trị có thể của nó là `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
* `imageSrcSet`: một chuỗi. Chỉ áp dụng khi `as="image"`. Chỉ định [tập hợp nguồn của hình ảnh](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
* `imageSizes`: một chuỗi. Chỉ áp dụng khi `as="image"`. Chỉ định [kích thước của hình ảnh](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

Các props này áp dụng khi `rel="icon"` hoặc `rel="apple-touch-icon"`:

* `sizes`: một chuỗi. [Kích thước của biểu tượng](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

Các props này áp dụng trong mọi trường hợp:

* `href`: một chuỗi. URL của tài nguyên được liên kết.
* `crossOrigin`: một chuỗi. [Chính sách CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) để sử dụng. Các giá trị có thể của nó là `anonymous` và `use-credentials`. Nó là bắt buộc khi `as` được đặt thành `"fetch"`.
* `referrerPolicy`: một chuỗi. [Tiêu đề Referrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy) để gửi khi tìm nạp. Các giá trị có thể của nó là `no-referrer-when-downgrade` (mặc định), `no-referrer`, `origin`, `origin-when-cross-origin` và `unsafe-url`.
* `fetchPriority`: một chuỗi. Đề xuất mức độ ưu tiên tương đối để tìm nạp tài nguyên. Các giá trị có thể là `auto` (mặc định), `high` và `low`.
* `hrefLang`: một chuỗi. Ngôn ngữ của tài nguyên được liên kết.
* `integrity`: một chuỗi. Một hàm băm mật mã của tài nguyên, để [xác minh tính xác thực của nó](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `type`: một chuỗi. Loại MIME của tài nguyên được liên kết.

Các props **không được khuyến nghị** sử dụng với React:

* `blocking`: một chuỗi. Nếu được đặt thành `"render"`, hướng dẫn trình duyệt không hiển thị trang cho đến khi biểu định kiểu được tải. React cung cấp khả năng kiểm soát chi tiết hơn bằng cách sử dụng Suspense.

#### Hành vi hiển thị đặc biệt {/*special-rendering-behavior*/}

React sẽ luôn đặt phần tử DOM tương ứng với thành phần `<link>` trong `<head>` của tài liệu, bất kể nó được hiển thị ở đâu trong cây React. `<head>` là vị trí hợp lệ duy nhất cho `<link>` tồn tại trong DOM, nhưng thật tiện lợi và giữ cho mọi thứ có thể kết hợp nếu một thành phần đại diện cho một trang cụ thể có thể tự hiển thị các thành phần `<link>`.

Có một vài ngoại lệ đối với điều này:

* Nếu `<link>` có prop `rel="stylesheet"`, thì nó cũng phải có prop `precedence` để có được hành vi đặc biệt này. Điều này là do thứ tự của các biểu định kiểu trong tài liệu là quan trọng, vì vậy React cần biết cách sắp xếp biểu định kiểu này so với các biểu định kiểu khác, mà bạn chỉ định bằng cách sử dụng prop `precedence`. Nếu prop `precedence` bị bỏ qua, sẽ không có hành vi đặc biệt nào.
* Nếu `<link>` có prop [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), sẽ không có hành vi đặc biệt nào, vì trong trường hợp này, nó không áp dụng cho tài liệu mà thay vào đó đại diện cho siêu dữ liệu về một phần cụ thể của trang.
* Nếu `<link>` có prop `onLoad` hoặc `onError`, vì trong trường hợp đó, bạn đang quản lý việc tải tài nguyên được liên kết theo cách thủ công trong thành phần React của mình.

#### Hành vi đặc biệt đối với biểu định kiểu {/*special-behavior-for-stylesheets*/}

Ngoài ra, nếu `<link>` là một biểu định kiểu (cụ thể là nó có `rel="stylesheet"` trong các props của nó), React sẽ xử lý nó đặc biệt theo những cách sau:

* Thành phần hiển thị `<link>` sẽ [tạm ngưng](/reference/react/Suspense) trong khi biểu định kiểu đang tải.
* Nếu nhiều thành phần hiển thị các liên kết đến cùng một biểu định kiểu, React sẽ loại bỏ các liên kết trùng lặp và chỉ đặt một liên kết duy nhất vào DOM. Hai liên kết được coi là giống nhau nếu chúng có cùng prop `href`.

Có hai ngoại lệ đối với hành vi đặc biệt này:

* Nếu liên kết không có prop `precedence`, sẽ không có hành vi đặc biệt nào, vì thứ tự của các biểu định kiểu trong tài liệu là quan trọng, vì vậy React cần biết cách sắp xếp biểu định kiểu này so với các biểu định kiểu khác, mà bạn chỉ định bằng cách sử dụng prop `precedence`.
* Nếu bạn cung cấp bất kỳ prop `onLoad`, `onError` hoặc `disabled` nào, sẽ không có hành vi đặc biệt nào, vì các prop này chỉ ra rằng bạn đang quản lý việc tải biểu định kiểu theo cách thủ công trong thành phần của mình.

Cách xử lý đặc biệt này đi kèm với hai lưu ý:

* React sẽ bỏ qua các thay đổi đối với các props sau khi liên kết đã được hiển thị. (React sẽ đưa ra cảnh báo trong quá trình phát triển nếu điều này xảy ra.)
* React có thể để lại liên kết trong DOM ngay cả sau khi thành phần hiển thị nó đã bị hủy gắn kết.

---

## Cách sử dụng {/*usage*/}

### Liên kết đến các tài nguyên liên quan {/*linking-to-related-resources*/}

Bạn có thể chú thích tài liệu bằng các liên kết đến các tài nguyên liên quan như biểu tượng, URL chuẩn hoặc pingback. React sẽ đặt siêu dữ liệu này trong `<head>` của tài liệu bất kể nó được hiển thị ở đâu trong cây React.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function BlogPage() {
  return (
    <ShowRenderedHTML>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>Blog của tôi</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Liên kết đến một biểu định kiểu {/*linking-to-a-stylesheet*/}

Nếu một thành phần phụ thuộc vào một biểu định kiểu nhất định để được hiển thị chính xác, bạn có thể hiển thị một liên kết đến biểu định kiểu đó trong thành phần. Thành phần của bạn sẽ [tạm ngưng](/reference/react/Suspense) trong khi biểu định kiểu đang tải. Bạn phải cung cấp prop `precedence`, cho React biết vị trí đặt biểu định kiểu này so với các biểu định kiểu khác — các biểu định kiểu có precedence cao hơn có thể ghi đè các biểu định kiểu có precedence thấp hơn.

<Note>
Khi bạn muốn sử dụng một biểu định kiểu, có thể có lợi khi gọi hàm [preinit](/reference/react-dom/preinit). Gọi hàm này có thể cho phép trình duyệt bắt đầu tìm nạp biểu định kiểu sớm hơn so với khi bạn chỉ hiển thị một thành phần `<link>`, ví dụ: bằng cách gửi [phản hồi HTTP Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
</Note>

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Kiểm soát precedence của biểu định kiểu {/*controlling-stylesheet-precedence*/}

Các biểu định kiểu có thể xung đột với nhau và khi chúng xung đột, trình duyệt sẽ sử dụng biểu định kiểu xuất hiện sau trong tài liệu. React cho phép bạn kiểm soát thứ tự của các biểu định kiểu bằng prop `precedence`. Trong ví dụ này, ba thành phần hiển thị các biểu định kiểu và các thành phần có cùng precedence được nhóm lại với nhau trong `<head>`.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <FirstComponent />
      <SecondComponent />
      <ThirdComponent/>
      ...
    </ShowRenderedHTML>
  );
}

function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="first" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="second" />;
}

function ThirdComponent() {
  return <link rel="stylesheet" href="third.css" precedence="first" />;
}

```

</SandpackWithHTMLOutput>

Lưu ý rằng các giá trị `precedence` là tùy ý và việc đặt tên chúng là tùy thuộc vào bạn. React sẽ suy ra rằng các giá trị precedence mà nó khám phá đầu tiên là "thấp hơn" và các giá trị precedence mà nó khám phá sau là "cao hơn".

### Loại bỏ hiển thị biểu định kiểu trùng lặp {/*deduplicated-stylesheet-rendering*/}

Nếu bạn hiển thị cùng một biểu định kiểu từ nhiều thành phần, React sẽ chỉ đặt một `<link>` duy nhất trong phần đầu của tài liệu.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <Component />
      <Component />
      ...
    </ShowRenderedHTML>
  );
}

function Component() {
  return <link rel="stylesheet" href="styles.css" precedence="medium" />;
}
```

</SandpackWithHTMLOutput>

### Chú thích các mục cụ thể trong tài liệu bằng các liên kết {/*annotating-specific-items-within-the-document-with-links*/}

Bạn có thể sử dụng thành phần `<link>` với prop `itemProp` để chú thích các mục cụ thể trong tài liệu bằng các liên kết đến các tài nguyên liên quan. Trong trường hợp này, React sẽ *không* đặt các chú thích này trong `<head>` của tài liệu mà sẽ đặt chúng như bất kỳ thành phần React nào khác.

```js
<section itemScope>
  <h3>Chú thích các mục cụ thể</h3>
  <link itemProp="author" href="http://example.com/" />
  <p>...</p>
</section>
```
