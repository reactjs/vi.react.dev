---
title: "<textarea>"
---

<Intro>

[Thành phần `<textarea>` tích hợp sẵn của trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) cho phép bạn hiển thị một trường nhập văn bản nhiều dòng.

```js
<textarea />
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<textarea>` {/*textarea*/}

Để hiển thị một vùng văn bản, hãy hiển thị thành phần [`<textarea>` tích hợp sẵn của trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea).

```js
<textarea name="postContent" />
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<textarea>` hỗ trợ tất cả [các thuộc tính phần tử chung.](/reference/react-dom/components/common#props)

Bạn có thể [làm cho một vùng văn bản được kiểm soát](#controlling-a-text-area-with-a-state-variable) bằng cách truyền một thuộc tính `value`:

*   `value`: Một chuỗi. Kiểm soát văn bản bên trong vùng văn bản.

Khi bạn truyền `value`, bạn cũng phải truyền một trình xử lý `onChange` để cập nhật giá trị đã truyền.

Nếu `<textarea>` của bạn không được kiểm soát, bạn có thể truyền thuộc tính `defaultValue` thay thế:

*   `defaultValue`: Một chuỗi. Chỉ định [giá trị ban đầu](#providing-an-initial-value-for-a-text-area) cho một vùng văn bản.

Các thuộc tính `<textarea>` này có liên quan cho cả vùng văn bản được kiểm soát và không được kiểm soát:

*   [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autocomplete): Hoặc `'on'` hoặc `'off'`. Chỉ định hành vi tự động hoàn thành.
*   [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autofocus): Một boolean. Nếu `true`, React sẽ tập trung vào phần tử khi mount.
*   `children`: `<textarea>` không chấp nhận children. Để đặt giá trị ban đầu, hãy sử dụng `defaultValue`.
*   [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols): Một số. Chỉ định chiều rộng mặc định theo chiều rộng ký tự trung bình. Mặc định là `20`.
*   [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#disabled): Một boolean. Nếu `true`, đầu vào sẽ không tương tác và sẽ xuất hiện mờ đi.
*   [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#form): Một chuỗi. Chỉ định `id` của `<form>` mà đầu vào này thuộc về. Nếu bỏ qua, nó là biểu mẫu cha gần nhất.
*   [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength): Một số. Chỉ định độ dài tối đa của văn bản.
*   [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#minlength): Một số. Chỉ định độ dài tối thiểu của văn bản.
*   [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): Một chuỗi. Chỉ định tên cho đầu vào này được [gửi cùng với biểu mẫu.](#reading-the-textarea-value-when-submitting-a-form)
*   `onChange`: Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Bắt buộc đối với [các vùng văn bản được kiểm soát.](#controlling-a-text-area-with-a-state-variable) Kích hoạt ngay lập tức khi giá trị của đầu vào được thay đổi bởi người dùng (ví dụ: nó kích hoạt trên mỗi lần nhấn phím). Hoạt động giống như trình duyệt [`input` event.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
*   `onChangeCapture`: Một phiên bản của `onChange` kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
*   [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Kích hoạt ngay lập tức khi giá trị được thay đổi bởi người dùng. Vì lý do lịch sử, trong React, thành ngữ là sử dụng `onChange` thay thế, hoạt động tương tự.
*   `onInputCapture`: Một phiên bản của `onInput` kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
*   [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Kích hoạt nếu một đầu vào không vượt qua xác thực khi gửi biểu mẫu. Không giống như sự kiện `invalid` tích hợp, sự kiện `onInvalid` của React nổi lên.
*   `onInvalidCapture`: Một phiên bản của `onInvalid` kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
*   [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Kích hoạt sau khi lựa chọn bên trong `<textarea>` thay đổi. React mở rộng sự kiện `onSelect` để cũng kích hoạt cho lựa chọn trống và khi chỉnh sửa (có thể ảnh hưởng đến lựa chọn).
*   `onSelectCapture`: Một phiên bản của `onSelect` kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
*   [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#placeholder): Một chuỗi. Được hiển thị bằng màu mờ khi giá trị của vùng văn bản trống.
*   [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly): Một boolean. Nếu `true`, vùng văn bản không thể chỉnh sửa được bởi người dùng.
*   [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#required): Một boolean. Nếu `true`, giá trị phải được cung cấp để biểu mẫu được gửi.
*   [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows): Một số. Chỉ định chiều cao mặc định theo chiều cao ký tự trung bình. Mặc định là `2`.
*   [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap): Hoặc `'hard'`, `'soft'`, hoặc `'off'`. Chỉ định cách văn bản sẽ được xuống dòng khi gửi biểu mẫu.

#### Lưu ý {/*caveats*/}

*   Không được phép truyền children như `<textarea>something</textarea>`. [Sử dụng `defaultValue` cho nội dung ban đầu.](#providing-an-initial-value-for-a-text-area)
*   Nếu một vùng văn bản nhận được một thuộc tính `value` chuỗi, nó sẽ được [xử lý như được kiểm soát.](#controlling-a-text-area-with-a-state-variable)
*   Một vùng văn bản không thể vừa được kiểm soát vừa không được kiểm soát cùng một lúc.
*   Một vùng văn bản không thể chuyển đổi giữa việc được kiểm soát hoặc không được kiểm soát trong suốt vòng đời của nó.
*   Mỗi vùng văn bản được kiểm soát cần một trình xử lý sự kiện `onChange` để đồng bộ cập nhật giá trị sao lưu của nó.

---

## Cách sử dụng {/*usage*/}

### Hiển thị một vùng văn bản {/*displaying-a-text-area*/}

Hiển thị `<textarea>` để hiển thị một vùng văn bản. Bạn có thể chỉ định kích thước mặc định của nó với các thuộc tính [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) và [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols), nhưng theo mặc định, người dùng sẽ có thể thay đổi kích thước nó. Để tắt thay đổi kích thước, bạn có thể chỉ định `resize: none` trong CSS.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Write your post:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### Cung cấp một nhãn cho một vùng văn bản {/*providing-a-label-for-a-text-area*/}

Thông thường, bạn sẽ đặt mọi `<textarea>` bên trong một thẻ [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). Điều này cho trình duyệt biết rằng nhãn này được liên kết với vùng văn bản đó. Khi người dùng nhấp vào nhãn, trình duyệt sẽ tập trung vào vùng văn bản. Nó cũng rất cần thiết cho khả năng truy cập: một trình đọc màn hình sẽ thông báo chú thích nhãn khi người dùng tập trung vào vùng văn bản.

Nếu bạn không thể lồng `<textarea>` vào một `<label>`, hãy liên kết chúng bằng cách truyền cùng một ID cho `<textarea id>` và [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Để tránh xung đột giữa các phiên bản của một thành phần, hãy tạo một ID như vậy với [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Write your post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Cung cấp một giá trị ban đầu cho một vùng văn bản {/*providing-an-initial-value-for-a-text-area*/}

Bạn có thể tùy chọn chỉ định giá trị ban đầu cho vùng văn bản. Truyền nó dưới dạng chuỗi `defaultValue`.

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

Không giống như trong HTML, việc truyền văn bản ban đầu như `<textarea>Some content</textarea>` không được hỗ trợ.

</Pitfall>

---

### Đọc giá trị vùng văn bản khi gửi biểu mẫu {/*reading-the-textarea-value-when-submitting-a-form*/}

Thêm một [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) xung quanh vùng văn bản của bạn với một [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) bên trong. Nó sẽ gọi trình xử lý sự kiện `<form onSubmit>` của bạn. Theo mặc định, trình duyệt sẽ gửi dữ liệu biểu mẫu đến URL hiện tại và làm mới trang. Bạn có thể ghi đè hành vi đó bằng cách gọi `e.preventDefault()`. Đọc dữ liệu biểu mẫu với [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Post title: <input name="postTitle" defaultValue="Biking" />
      </label>
      <label>
        Edit your post:
        <textarea
          name="postContent"
          defaultValue="I really enjoyed biking yesterday!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Reset edits</button>
      <button type="submit">Save post</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

Cung cấp một `name` cho `<textarea>` của bạn, ví dụ: `<textarea name="postContent" />`. `name` bạn đã chỉ định sẽ được sử dụng làm khóa trong dữ liệu biểu mẫu, ví dụ: `{ postContent: "Your post" }`.

</Note>

<Pitfall>

Theo mặc định, *bất kỳ* `<button>` nào bên trong một `<form>` sẽ gửi nó. Điều này có thể gây ngạc nhiên! Nếu bạn có thành phần React `Button` tùy chỉnh của riêng mình, hãy cân nhắc trả về [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) thay vì `<button>`. Sau đó, để rõ ràng, hãy sử dụng `<button type="submit">` cho các nút *được* cho là để gửi biểu mẫu.

</Pitfall>

---

### Kiểm soát một vùng văn bản với một biến trạng thái {/*controlling-a-text-area-with-a-state-variable*/}

Một vùng văn bản như `<textarea />` là *không được kiểm soát*. Ngay cả khi bạn [truyền một giá trị ban đầu](#providing-an-initial-value-for-a-text-area) như `<textarea defaultValue="Initial text" />`, JSX của bạn chỉ định giá trị ban đầu, không phải giá trị ngay bây giờ.

**Để hiển thị một vùng văn bản _được kiểm soát_, hãy truyền thuộc tính `value` cho nó.** React sẽ buộc vùng văn bản luôn có `value` mà bạn đã truyền. Thông thường, bạn sẽ kiểm soát một vùng văn bản bằng cách khai báo một [biến trạng thái:](/reference/react/useState)

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Khai báo một biến trạng thái...
  // ...
  return (
    <textarea
      value={postContent} // ...buộc giá trị của đầu vào khớp với biến trạng thái...
      onChange={e => setPostContent(e.target.value)} // ...và cập nhật biến trạng thái trên bất kỳ chỉnh sửa nào!
    />
  );
}
```

Điều này hữu ích nếu bạn muốn hiển thị lại một phần của giao diện người dùng để đáp ứng với mỗi lần nhấn phím.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**Nếu bạn truyền `value` mà không có `onChange`, sẽ không thể nhập vào vùng văn bản.** Khi bạn kiểm soát một vùng văn bản bằng cách truyền một số `value` cho nó, bạn *buộc* nó luôn có giá trị mà bạn đã truyền. Vì vậy, nếu bạn truyền một biến trạng thái làm `value` nhưng quên cập nhật biến trạng thái đó một cách đồng bộ trong trình xử lý sự kiện `onChange`, React sẽ hoàn nguyên vùng văn bản sau mỗi lần nhấn phím trở lại `value` mà bạn đã chỉ định.

</Pitfall>

---

## Khắc phục sự cố {/*troubleshooting*/}

### Vùng văn bản của tôi không cập nhật khi tôi nhập vào nó {/*my-text-area-doesnt-update-when-i-type-into-it*/}

Nếu bạn hiển thị một vùng văn bản với `value` nhưng không có `onChange`, bạn sẽ thấy một lỗi trong bảng điều khiển:

```js
// 🔴 Lỗi: vùng văn bản được kiểm soát không có trình xử lý onChange
<textarea value={something} />
```

<ConsoleBlock level="error">

Bạn đã cung cấp một thuộc tính `value` cho một trường biểu mẫu mà không có trình xử lý `onChange`. Điều này sẽ hiển thị một trường chỉ đọc. Nếu trường có thể thay đổi, hãy sử dụng `defaultValue`. Nếu không, hãy đặt `onChange` hoặc `readOnly`.

</ConsoleBlock>

Như thông báo lỗi gợi ý, nếu bạn chỉ muốn [chỉ định giá trị *ban đầu*,](#providing-an-initial-value-for-a-text-area) hãy truyền `defaultValue` thay thế:

```js
// ✅ Tốt: vùng văn bản không được kiểm soát với một giá trị ban đầu
<textarea defaultValue={something} />
```

Nếu bạn muốn [kiểm soát vùng văn bản này với một biến trạng thái,](#controlling-a-text-area-with-a-state-variable) hãy chỉ định một trình xử lý `onChange`:

```js
// ✅ Tốt: vùng văn bản được kiểm soát với onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

Nếu giá trị cố ý chỉ đọc, hãy thêm một thuộc tính `readOnly` để ngăn chặn lỗi:

```js
// ✅ Tốt: vùng văn bản được kiểm soát chỉ đọc không có on change
<textarea value={something} readOnly={true} />
```

---

### Dấu mũ vùng văn bản của tôi nhảy về đầu mỗi khi nhấn phím {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

Nếu bạn [kiểm soát một vùng văn bản,](#controlling-a-text-area-with-a-state-variable) bạn phải cập nhật biến trạng thái của nó thành giá trị của vùng văn bản từ DOM trong `onChange`.

Bạn không thể cập nhật nó thành một cái gì đó khác với `e.target.value`:

```js
function handleChange(e) {
  // 🔴 Lỗi: cập nhật một đầu vào thành một cái gì đó khác với e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Bạn cũng không thể cập nhật nó một cách không đồng bộ:

```js
function handleChange(e) {
  // 🔴 Lỗi: cập nhật một đầu vào một cách không đồng bộ
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Để sửa mã của bạn, hãy cập nhật nó một cách đồng bộ thành `e.target.value`:

```js
function handleChange(e) {
  // ✅ Cập nhật một đầu vào được kiểm soát thành e.target.value một cách đồng bộ
  setFirstName(e.target.value);
}
```

Nếu điều này không khắc phục được sự cố, có thể là vùng văn bản bị xóa và thêm lại từ DOM trên mỗi lần nhấn phím. Điều này có thể xảy ra nếu bạn vô tình [đặt lại trạng thái](/learn/preserving-and-resetting-state) trên mỗi lần hiển thị lại. Ví dụ: điều này có thể xảy ra nếu vùng văn bản hoặc một trong các phần tử cha của nó luôn nhận được một thuộc tính `key` khác nhau, hoặc nếu bạn lồng các định nghĩa thành phần (điều này không được phép trong React và khiến thành phần "bên trong" được gắn lại trên mỗi lần hiển thị).

---

### Tôi đang gặp lỗi: "Một thành phần đang thay đổi một đầu vào không được kiểm soát thành được kiểm soát" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}

Nếu bạn cung cấp một `value` cho thành phần, nó phải vẫn là một chuỗi trong suốt vòng đời của nó.

Bạn không thể truyền `value={undefined}` trước và sau đó truyền `value="some string"` vì React sẽ không biết bạn muốn thành phần không được kiểm soát hay được kiểm soát. Một thành phần được kiểm soát phải luôn nhận được một chuỗi `value`, không phải `null` hoặc `undefined`.

Nếu `value` của bạn đến từ một API hoặc một biến trạng thái, nó có thể được khởi tạo thành `null` hoặc `undefined`. Trong trường hợp đó, hãy đặt nó thành một chuỗi trống (`''`) ban đầu hoặc truyền `value={someValue ?? ''}` để đảm bảo `value` là một chuỗi.
