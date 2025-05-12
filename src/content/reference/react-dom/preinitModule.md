---
title: preinitModule
---

<Note>

[Các framework dựa trên React](/learn/start-a-new-react-project) thường tự động xử lý việc tải tài nguyên cho bạn, vì vậy bạn có thể không cần phải tự gọi API này. Tham khảo tài liệu của framework để biết thêm chi tiết.

</Note>

<Intro>

`preinitModule` cho phép bạn tìm nạp và thực thi một module ESM một cách chủ động.

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `preinitModule(href, options)` {/*preinitmodule*/}

Để khởi tạo trước một module ESM, hãy gọi hàm `preinitModule` từ `react-dom`.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[Xem thêm các ví dụ bên dưới.](#usage)

Hàm `preinitModule` cung cấp cho trình duyệt một gợi ý rằng nó nên bắt đầu tải xuống và thực thi module đã cho, điều này có thể tiết kiệm thời gian. Các module mà bạn `preinit` sẽ được thực thi khi chúng tải xuống xong.

#### Tham số {/*parameters*/}

* `href`: một chuỗi. URL của module bạn muốn tải xuống và thực thi.
* `options`: một đối tượng. Nó chứa các thuộc tính sau:
  *  `as`: một chuỗi bắt buộc. Nó phải là `'script'`.
  *  `crossOrigin`: một chuỗi. [Chính sách CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) để sử dụng. Các giá trị có thể là `anonymous` và `use-credentials`.
  *  `integrity`: một chuỗi. Một hàm băm mật mã của module, để [xác minh tính xác thực của nó](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: một chuỗi. Một [nonce mật mã để cho phép module](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) khi sử dụng Chính sách Bảo mật Nội dung nghiêm ngặt.

#### Giá trị trả về {/*returns*/}

`preinitModule` không trả về gì cả.

#### Lưu ý {/*caveats*/}

* Nhiều lệnh gọi đến `preinitModule` với cùng một `href` có cùng hiệu ứng như một lệnh gọi duy nhất.
* Trong trình duyệt, bạn có thể gọi `preinitModule` trong mọi tình huống: trong khi render một component, trong một Effect, trong một trình xử lý sự kiện, v.v.
* Trong quá trình render phía máy chủ hoặc khi render Server Components, `preinitModule` chỉ có hiệu lực nếu bạn gọi nó trong khi render một component hoặc trong một ngữ cảnh không đồng bộ bắt nguồn từ việc render một component. Bất kỳ lệnh gọi nào khác sẽ bị bỏ qua.

---

## Cách sử dụng {/*usage*/}

### Tải trước khi render {/*preloading-when-rendering*/}

Gọi `preinitModule` khi render một component nếu bạn biết rằng nó hoặc các component con của nó sẽ sử dụng một module cụ thể và bạn đồng ý với việc module được thực thi và do đó có hiệu lực ngay lập tức sau khi được tải xuống.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Nếu bạn muốn trình duyệt tải xuống module nhưng không thực thi nó ngay lập tức, hãy sử dụng [`preloadModule`](/reference/react-dom/preloadModule) thay thế. Nếu bạn muốn khởi tạo trước một script không phải là module ESM, hãy sử dụng [`preinit`](/reference/react-dom/preinit).

### Tải trước trong một trình xử lý sự kiện {/*preloading-in-an-event-handler*/}

Gọi `preinitModule` trong một trình xử lý sự kiện trước khi chuyển sang một trang hoặc trạng thái nơi module sẽ cần thiết. Điều này giúp quá trình bắt đầu sớm hơn so với khi bạn gọi nó trong quá trình render trang hoặc trạng thái mới.

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
