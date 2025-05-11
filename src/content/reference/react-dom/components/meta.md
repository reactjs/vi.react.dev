---
meta: "<meta>"
---

<Intro>

[Thành phần `<meta>` tích hợp sẵn của trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) cho phép bạn thêm metadata vào tài liệu.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<meta>` {/*meta*/}

Để thêm metadata cho tài liệu, hãy render [thành phần `<meta>` tích hợp sẵn của trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta). Bạn có thể render `<meta>` từ bất kỳ thành phần nào và React sẽ luôn đặt phần tử DOM tương ứng vào phần đầu của tài liệu.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<meta>` hỗ trợ tất cả [các props phần tử thông thường.](/reference/react-dom/components/common#props)

Nó phải có *chính xác một* trong các props sau: `name`, `httpEquiv`, `charset`, `itemProp`. Thành phần `<meta>` thực hiện một việc khác nhau tùy thuộc vào prop nào trong số này được chỉ định.

* `name`: một chuỗi. Chỉ định [loại metadata](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name) sẽ được đính kèm vào tài liệu.
* `charset`: một chuỗi. Chỉ định bộ ký tự được sử dụng bởi tài liệu. Giá trị hợp lệ duy nhất là `"utf-8"`.
* `httpEquiv`: một chuỗi. Chỉ định một chỉ thị để xử lý tài liệu.
* `itemProp`: một chuỗi. Chỉ định metadata về một mục cụ thể trong tài liệu thay vì toàn bộ tài liệu.
* `content`: một chuỗi. Chỉ định metadata sẽ được đính kèm khi được sử dụng với các props `name` hoặc `itemProp` hoặc hành vi của chỉ thị khi được sử dụng với prop `httpEquiv`.

#### Hành vi render đặc biệt {/*special-rendering-behavior*/}

React sẽ luôn đặt phần tử DOM tương ứng với thành phần `<meta>` bên trong `<head>` của tài liệu, bất kể nó được render ở đâu trong cây React. `<head>` là vị trí hợp lệ duy nhất cho `<meta>` tồn tại trong DOM, nhưng thật tiện lợi và giữ cho mọi thứ có thể kết hợp được nếu một thành phần đại diện cho một trang cụ thể có thể tự render các thành phần `<meta>`.

Có một ngoại lệ đối với điều này: nếu `<meta>` có một prop [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), thì không có hành vi đặc biệt nào, vì trong trường hợp này, nó không đại diện cho metadata về tài liệu mà là metadata về một phần cụ thể của trang.

---

## Cách sử dụng {/*usage*/}

### Chú thích tài liệu bằng metadata {/*annotating-the-document-with-metadata*/}

Bạn có thể chú thích tài liệu bằng metadata như từ khóa, tóm tắt hoặc tên tác giả. React sẽ đặt metadata này trong `<head>` của tài liệu bất kể nó được render ở đâu trong cây React.

```html
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="Tham khảo API cho thành phần <meta> trong React DOM" />
```

Bạn có thể render thành phần `<meta>` từ bất kỳ thành phần nào. React sẽ đặt một node DOM `<meta>` trong `<head>` của tài liệu.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <meta name="keywords" content="React" />
      <meta name="description" content="Sơ đồ trang web cho trang web React" />
      <h1>Sơ đồ trang web</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Chú thích các mục cụ thể trong tài liệu bằng metadata {/*annotating-specific-items-within-the-document-with-metadata*/}

Bạn có thể sử dụng thành phần `<meta>` với prop `itemProp` để chú thích các mục cụ thể trong tài liệu bằng metadata. Trong trường hợp này, React sẽ *không* đặt các chú thích này trong `<head>` của tài liệu mà sẽ đặt chúng như bất kỳ thành phần React nào khác.

```js
<section itemScope>
  <h3>Chú thích các mục cụ thể</h3>
  <meta itemProp="description" content="Tham khảo API để sử dụng <meta> với itemProp" />
  <p>...</p>
</section>
```
