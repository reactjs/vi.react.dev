---
title: "<title>"
---

<Intro>

[Built-in browser `<title>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) cho phép bạn chỉ định tiêu đề của tài liệu.

```js
<title>My Blog</title>
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<title>` {/*title*/}

Để chỉ định tiêu đề của tài liệu, hãy render [built-in browser `<title>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title). Bạn có thể render `<title>` từ bất kỳ component nào và React sẽ luôn đặt DOM element tương ứng vào document head.

```js
<title>My Blog</title>
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<title>` hỗ trợ tất cả [common element props.](/reference/react-dom/components/common#props)

* `children`: `<title>` chỉ chấp nhận text làm child. Text này sẽ trở thành tiêu đề của tài liệu. Bạn cũng có thể truyền các component của riêng bạn miễn là chúng chỉ render text.

#### Special rendering behavior {/*special-rendering-behavior*/}

React sẽ luôn đặt DOM element tương ứng với component `<title>` vào bên trong `<head>` của tài liệu, bất kể nó được render ở đâu trong React tree. `<head>` là vị trí hợp lệ duy nhất cho `<title>` tồn tại trong DOM, tuy nhiên, sẽ rất tiện lợi và giữ cho mọi thứ có thể kết hợp được nếu một component đại diện cho một trang cụ thể có thể tự render `<title>` của nó.

Có hai ngoại lệ cho điều này:
* Nếu `<title>` nằm trong một component `<svg>`, thì sẽ không có hành vi đặc biệt nào, vì trong ngữ cảnh này, nó không đại diện cho tiêu đề của tài liệu mà là một [accessibility annotation cho SVG graphic đó](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title).
* Nếu `<title>` có một [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) prop, thì sẽ không có hành vi đặc biệt nào, vì trong trường hợp này, nó không đại diện cho tiêu đề của tài liệu mà là metadata về một phần cụ thể của trang.

<Pitfall>

Chỉ render một `<title>` tại một thời điểm. Nếu nhiều hơn một component render một thẻ `<title>` cùng một lúc, React sẽ đặt tất cả các tiêu đề đó vào document head. Khi điều này xảy ra, hành vi của trình duyệt và công cụ tìm kiếm là không xác định.

</Pitfall>

---

## Cách sử dụng {/*usage*/}

### Đặt tiêu đề tài liệu {/*set-the-document-title*/}

Render component `<title>` từ bất kỳ component nào với text làm children của nó. React sẽ đặt một `<title>` DOM node trong document `<head>`.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function ContactUsPage() {
  return (
    <ShowRenderedHTML>
      <title>My Site: Contact Us</title>
      <h1>Contact Us</h1>
      <p>Email us at support@example.com</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Sử dụng biến trong tiêu đề {/*use-variables-in-the-title*/}

Children của component `<title>` phải là một chuỗi text duy nhất. (Hoặc một số duy nhất hoặc một đối tượng duy nhất có phương thức `toString`.) Có vẻ không rõ ràng, nhưng sử dụng dấu ngoặc nhọn JSX như thế này:

```js
<title>Results page {pageNumber}</title> // 🔴 Vấn đề: Đây không phải là một chuỗi duy nhất
```

... thực sự khiến component `<title>` nhận được một mảng hai phần tử làm children của nó (chuỗi `"Results page"` và giá trị của `pageNumber`). Điều này sẽ gây ra lỗi. Thay vào đó, hãy sử dụng string interpolation để truyền cho `<title>` một chuỗi duy nhất:

```js
<title>{`Results page ${pageNumber}`}</title>
```

