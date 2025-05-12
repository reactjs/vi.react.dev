---
title: preinit
---

<Note>

[Các framework dựa trên React](/learn/start-a-new-react-project) thường tự động xử lý việc tải tài nguyên cho bạn, vì vậy bạn có thể không cần phải tự gọi API này. Tham khảo tài liệu của framework để biết thêm chi tiết.

</Note>

<Intro>

`preinit` cho phép bạn tìm nạp và thực thi một cách chủ động một stylesheet hoặc script bên ngoài.

```js
preinit("https://example.com/script.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `preinit(href, options)` {/*preinit*/}

Để preinit một script hoặc stylesheet, hãy gọi hàm `preinit` từ `react-dom`.

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  // ...
}

```

[Xem thêm các ví dụ bên dưới.](#usage)

Hàm `preinit` cung cấp cho trình duyệt một gợi ý rằng nó nên bắt đầu tải xuống và thực thi tài nguyên đã cho, điều này có thể tiết kiệm thời gian. Các script mà bạn `preinit` sẽ được thực thi khi chúng tải xuống xong. Các stylesheet mà bạn preinit sẽ được chèn vào tài liệu, điều này khiến chúng có hiệu lực ngay lập tức.

#### Tham số {/*parameters*/}

* `href`: một chuỗi. URL của tài nguyên bạn muốn tải xuống và thực thi.
* `options`: một đối tượng. Nó chứa các thuộc tính sau:
  * `as`: một chuỗi bắt buộc. Loại tài nguyên. Các giá trị có thể là `script` và `style`.
  * `precedence`: một chuỗi. Bắt buộc với stylesheet. Cho biết vị trí chèn stylesheet so với các stylesheet khác. Các stylesheet có độ ưu tiên cao hơn có thể ghi đè các stylesheet có độ ưu tiên thấp hơn. Các giá trị có thể là `reset`, `low`, `medium`, `high`.
  * `crossOrigin`: một chuỗi. [Chính sách CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) để sử dụng. Các giá trị có thể là `anonymous` và `use-credentials`. Nó là bắt buộc khi `as` được đặt thành `"fetch"`.
  * `integrity`: một chuỗi. Một hàm băm mật mã của tài nguyên, để [xác minh tính xác thực của nó](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  * `nonce`: một chuỗi. Một [nonce mật mã để cho phép tài nguyên](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) khi sử dụng Chính sách bảo mật nội dung nghiêm ngặt.
  * `fetchPriority`: một chuỗi. Đề xuất mức độ ưu tiên tương đối để tìm nạp tài nguyên. Các giá trị có thể là `auto` (mặc định), `high` và `low`.

#### Giá trị trả về {/*returns*/}

`preinit` không trả về gì cả.

#### Lưu ý {/*caveats*/}

* Nhiều lệnh gọi đến `preinit` với cùng một `href` có cùng hiệu ứng như một lệnh gọi duy nhất.
* Trong trình duyệt, bạn có thể gọi `preinit` trong mọi tình huống: trong khi hiển thị một component, trong một Effect, trong một trình xử lý sự kiện, v.v.
* Trong quá trình hiển thị phía máy chủ hoặc khi hiển thị Server Components, `preinit` chỉ có hiệu lực nếu bạn gọi nó trong khi hiển thị một component hoặc trong một ngữ cảnh không đồng bộ bắt nguồn từ việc hiển thị một component. Bất kỳ lệnh gọi nào khác sẽ bị bỏ qua.

---

## Cách sử dụng {/*usage*/}

### Preinit khi hiển thị {/*preiniting-when-rendering*/}

Gọi `preinit` khi hiển thị một component nếu bạn biết rằng nó hoặc các component con của nó sẽ sử dụng một tài nguyên cụ thể và bạn đồng ý với việc tài nguyên được đánh giá và do đó có hiệu lực ngay lập tức sau khi được tải xuống.

<Recipes titleText="Ví dụ về preinit">

#### Preinit một script bên ngoài {/*preiniting-an-external-script*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Nếu bạn muốn trình duyệt tải xuống script nhưng không thực thi nó ngay lập tức, hãy sử dụng [`preload`](/reference/react-dom/preload) thay thế. Nếu bạn muốn tải một mô-đun ESM, hãy sử dụng [`preinitModule`](/reference/react-dom/preinitModule).

<Solution />

#### Preinit một stylesheet {/*preiniting-a-stylesheet*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

Tùy chọn `precedence`, là bắt buộc, cho phép bạn kiểm soát thứ tự của các stylesheet trong tài liệu. Các stylesheet có độ ưu tiên cao hơn có thể ghi đè các stylesheet có độ ưu tiên thấp hơn.

Nếu bạn muốn tải xuống stylesheet nhưng không chèn nó vào tài liệu ngay lập tức, hãy sử dụng [`preload`](/reference/react-dom/preload) thay thế.

<Solution />

</Recipes>

### Preinit trong một trình xử lý sự kiện {/*preiniting-in-an-event-handler*/}

Gọi `preinit` trong một trình xử lý sự kiện trước khi chuyển sang một trang hoặc trạng thái nơi các tài nguyên bên ngoài sẽ cần thiết. Điều này giúp quá trình bắt đầu sớm hơn so với khi bạn gọi nó trong quá trình hiển thị trang hoặc trạng thái mới.

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
