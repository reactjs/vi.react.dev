---
title: preloadModule
---

<Note>

Các [framework dựa trên React](/learn/start-a-new-react-project) thường tự động xử lý việc tải tài nguyên cho bạn, vì vậy bạn có thể không cần phải gọi API này. Tham khảo tài liệu của framework để biết thêm chi tiết.

</Note>

<Intro>

`preloadModule` cho phép bạn chủ động tìm nạp một module ESM mà bạn dự định sử dụng.

```js
preloadModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `preloadModule(href, options)` {/*preloadmodule*/}

Để tải trước một module ESM, hãy gọi hàm `preloadModule` từ `react-dom`.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[Xem thêm các ví dụ bên dưới.](#usage)

Hàm `preloadModule` cung cấp cho trình duyệt một gợi ý rằng nó nên bắt đầu tải xuống module đã cho, điều này có thể tiết kiệm thời gian.

#### Tham số {/*parameters*/}

* `href`: một chuỗi. URL của module bạn muốn tải xuống.
* `options`: một đối tượng. Nó chứa các thuộc tính sau:
  * `as`: một chuỗi bắt buộc. Nó phải là `'script'`.
  * `crossOrigin`: một chuỗi. [Chính sách CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) để sử dụng. Các giá trị có thể là `anonymous` và `use-credentials`.
  * `integrity`: một chuỗi. Một hàm băm mật mã của module, để [xác minh tính xác thực của nó](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  * `nonce`: một chuỗi. Một [nonce mật mã để cho phép module](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) khi sử dụng Chính sách Bảo mật Nội dung nghiêm ngặt.

#### Giá trị trả về {/*returns*/}

`preloadModule` không trả về gì cả.

#### Lưu ý {/*caveats*/}

* Nhiều lệnh gọi đến `preloadModule` với cùng một `href` có cùng hiệu ứng như một lệnh gọi duy nhất.
* Trong trình duyệt, bạn có thể gọi `preloadModule` trong mọi tình huống: trong khi hiển thị một component, trong một Effect, trong một trình xử lý sự kiện, v.v.
* Trong quá trình hiển thị phía máy chủ hoặc khi hiển thị Server Components, `preloadModule` chỉ có hiệu lực nếu bạn gọi nó trong khi hiển thị một component hoặc trong một ngữ cảnh không đồng bộ bắt nguồn từ việc hiển thị một component. Bất kỳ lệnh gọi nào khác sẽ bị bỏ qua.

---

## Cách sử dụng {/*usage*/}

### Tải trước khi hiển thị {/*preloading-when-rendering*/}

Gọi `preloadModule` khi hiển thị một component nếu bạn biết rằng nó hoặc các component con của nó sẽ sử dụng một module cụ thể.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Nếu bạn muốn trình duyệt bắt đầu thực thi module ngay lập tức (thay vì chỉ tải xuống), hãy sử dụng [`preinitModule`](/reference/react-dom/preinitModule) thay thế. Nếu bạn muốn tải một script không phải là module ESM, hãy sử dụng [`preload`](/reference/react-dom/preload).

### Tải trước trong một trình xử lý sự kiện {/*preloading-in-an-event-handler*/}

Gọi `preloadModule` trong một trình xử lý sự kiện trước khi chuyển sang một trang hoặc trạng thái nơi module sẽ được cần đến. Điều này giúp quá trình bắt đầu sớm hơn so với việc bạn gọi nó trong quá trình hiển thị trang hoặc trạng thái mới.

```js
import { preloadModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preloadModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
