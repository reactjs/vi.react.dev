---
title: preload
---

<Note>

[Các framework dựa trên React](/learn/start-a-new-react-project) thường tự động xử lý việc tải tài nguyên cho bạn, vì vậy bạn có thể không cần phải gọi API này. Tham khảo tài liệu của framework để biết thêm chi tiết.

</Note>

<Intro>

`preload` cho phép bạn chủ động tìm nạp một tài nguyên như stylesheet, font hoặc script bên ngoài mà bạn dự định sử dụng.

```js
preload("https://example.com/font.woff2", {as: "font"});
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `preload(href, options)` {/*preload*/}

Để tải trước một tài nguyên, hãy gọi hàm `preload` từ `react-dom`.

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/font.woff2", {as: "font"});
  // ...
}

```

[Xem thêm các ví dụ bên dưới.](#usage)

Hàm `preload` cung cấp cho trình duyệt một gợi ý rằng nó nên bắt đầu tải xuống tài nguyên đã cho, điều này có thể tiết kiệm thời gian.

#### Tham số {/*parameters*/}

* `href`: một chuỗi. URL của tài nguyên bạn muốn tải xuống.
* `options`: một đối tượng. Nó chứa các thuộc tính sau:
  *  `as`: một chuỗi bắt buộc. Loại tài nguyên. Các [giá trị có thể](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#as) của nó là `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
  *  `crossOrigin`: một chuỗi. [Chính sách CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) để sử dụng. Các giá trị có thể của nó là `anonymous` và `use-credentials`. Nó là bắt buộc khi `as` được đặt thành `"fetch"`.
  *  `referrerPolicy`: một chuỗi. [Tiêu đề Referrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy) để gửi khi tìm nạp. Các giá trị có thể của nó là `no-referrer-when-downgrade` (mặc định), `no-referrer`, `origin`, `origin-when-cross-origin` và `unsafe-url`.
  *  `integrity`: một chuỗi. Một hàm băm mật mã của tài nguyên, để [xác minh tính xác thực của nó](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `type`: một chuỗi. MIME type của tài nguyên.
  *  `nonce`: một chuỗi. Một [nonce mật mã để cho phép tài nguyên](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) khi sử dụng Content Security Policy nghiêm ngặt.
  *  `fetchPriority`: một chuỗi. Đề xuất mức độ ưu tiên tương đối để tìm nạp tài nguyên. Các giá trị có thể là `auto` (mặc định), `high` và `low`.
  *  `imageSrcSet`: một chuỗi. Chỉ sử dụng với `as: "image"`. Chỉ định [tập hợp nguồn của hình ảnh](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
  *  `imageSizes`: một chuỗi. Chỉ sử dụng với `as: "image"`. Chỉ định [kích thước của hình ảnh](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

#### Giá trị trả về {/*returns*/}

`preload` không trả về gì cả.

#### Lưu ý {/*caveats*/}

* Nhiều lệnh gọi tương đương đến `preload` có cùng hiệu ứng như một lệnh gọi duy nhất. Các lệnh gọi đến `preload` được coi là tương đương theo các quy tắc sau:
  * Hai lệnh gọi là tương đương nếu chúng có cùng `href`, ngoại trừ:
  * Nếu `as` được đặt thành `image`, hai lệnh gọi là tương đương nếu chúng có cùng `href`, `imageSrcSet` và `imageSizes`.
* Trong trình duyệt, bạn có thể gọi `preload` trong mọi tình huống: trong khi hiển thị một component, trong một Effect, trong một trình xử lý sự kiện, v.v.
* Trong quá trình render phía máy chủ hoặc khi render Server Components, `preload` chỉ có hiệu lực nếu bạn gọi nó trong khi render một component hoặc trong một ngữ cảnh không đồng bộ bắt nguồn từ việc render một component. Bất kỳ lệnh gọi nào khác sẽ bị bỏ qua.

---

## Cách sử dụng {/*usage*/}

### Tải trước khi render {/*preloading-when-rendering*/}

Gọi `preload` khi render một component nếu bạn biết rằng nó hoặc các component con của nó sẽ sử dụng một tài nguyên cụ thể.

<Recipes titleText="Ví dụ về tải trước">

#### Tải trước một script bên ngoài {/*preloading-an-external-script*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Nếu bạn muốn trình duyệt bắt đầu thực thi script ngay lập tức (thay vì chỉ tải xuống), hãy sử dụng [`preinit`](/reference/react-dom/preinit) thay thế. Nếu bạn muốn tải một mô-đun ESM, hãy sử dụng [`preloadModule`](/reference/react-dom/preloadModule).

<Solution />

#### Tải trước một stylesheet {/*preloading-a-stylesheet*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  return ...;
}
```

Nếu bạn muốn stylesheet được chèn vào tài liệu ngay lập tức (có nghĩa là trình duyệt sẽ bắt đầu phân tích cú pháp nó ngay lập tức thay vì chỉ tải xuống), hãy sử dụng [`preinit`](/reference/react-dom/preinit) thay thế.

<Solution />

#### Tải trước một font {/*preloading-a-font*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  preload("https://example.com/font.woff2", {as: "font"});
  return ...;
}
```

Nếu bạn tải trước một stylesheet, bạn cũng nên tải trước bất kỳ font nào mà stylesheet đó tham chiếu đến. Bằng cách đó, trình duyệt có thể bắt đầu tải xuống font trước khi nó tải xuống và phân tích cú pháp stylesheet.

<Solution />

#### Tải trước một hình ảnh {/*preloading-an-image*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("/banner.png", {
    as: "image",
    imageSrcSet: "/banner512.png 512w, /banner1024.png 1024w",
    imageSizes: "(max-width: 512px) 512px, 1024px",
  });
  return ...;
}
```

Khi tải trước một hình ảnh, các tùy chọn `imageSrcSet` và `imageSizes` giúp trình duyệt [tìm nạp hình ảnh có kích thước chính xác cho kích thước của màn hình](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

<Solution />

</Recipes>

### Tải trước trong một trình xử lý sự kiện {/*preloading-in-an-event-handler*/}

Gọi `preload` trong một trình xử lý sự kiện trước khi chuyển sang một trang hoặc trạng thái nơi các tài nguyên bên ngoài sẽ cần thiết. Điều này giúp quá trình bắt đầu sớm hơn so với việc bạn gọi nó trong quá trình render trang hoặc trạng thái mới.

```js
import { preload } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preload("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
