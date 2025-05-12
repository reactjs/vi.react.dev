---
style: "<style>"
---

<Intro>

[Thành phần `<style>` tích hợp sẵn của trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) cho phép bạn thêm các biểu định kiểu CSS nội tuyến vào tài liệu của mình.

```js
<style>{` p { color: red; } `}</style>
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<style>` {/*style*/}

Để thêm các kiểu nội tuyến vào tài liệu của bạn, hãy hiển thị [thành phần `<style>` tích hợp sẵn của trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style). Bạn có thể hiển thị `<style>` từ bất kỳ thành phần nào và React sẽ [trong một số trường hợp](#special-rendering-behavior) đặt phần tử DOM tương ứng vào đầu tài liệu và loại bỏ các kiểu giống hệt nhau.

```js
<style>{` p { color: red; } `}</style>
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<style>` hỗ trợ tất cả [các props phần tử thông thường.](/reference/react-dom/components/common#props)

*   `children`: một chuỗi, bắt buộc. Nội dung của biểu định kiểu.
*   `precedence`: một chuỗi. Cho React biết vị trí xếp hạng nút DOM `<style>` so với các nút khác trong `<head>` của tài liệu, điều này xác định biểu định kiểu nào có thể ghi đè lên biểu định kiểu khác. React sẽ suy ra rằng các giá trị độ ưu tiên mà nó khám phá đầu tiên là "thấp hơn" và các giá trị độ ưu tiên mà nó khám phá sau là "cao hơn". Nhiều hệ thống kiểu có thể hoạt động tốt bằng cách sử dụng một giá trị độ ưu tiên duy nhất vì các quy tắc kiểu là nguyên tử. Các biểu định kiểu có cùng độ ưu tiên đi cùng nhau cho dù chúng là thẻ `<link>` hay thẻ `<style>` nội tuyến hoặc được tải bằng các hàm [`preinit`](/reference/react-dom/preinit).
*   `href`: một chuỗi. Cho phép React [loại bỏ các kiểu trùng lặp](#special-rendering-behavior) có cùng `href`.
*   `media`: một chuỗi. Hạn chế biểu định kiểu cho một [truy vấn phương tiện](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) nhất định.
*   `nonce`: một chuỗi. Một [nonce mật mã để cho phép tài nguyên](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) khi sử dụng Chính sách bảo mật nội dung nghiêm ngặt.
*   `title`: một chuỗi. Chỉ định tên của một [biểu định kiểu thay thế](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

Các props **không được khuyến nghị** sử dụng với React:

*   `blocking`: một chuỗi. Nếu được đặt thành `"render"`, hãy hướng dẫn trình duyệt không hiển thị trang cho đến khi biểu định kiểu được tải. React cung cấp khả năng kiểm soát chi tiết hơn bằng cách sử dụng Suspense.

#### Hành vi hiển thị đặc biệt {/*special-rendering-behavior*/}

React có thể di chuyển các thành phần `<style>` đến `<head>` của tài liệu, loại bỏ các biểu định kiểu giống hệt nhau và [tạm ngưng](/reference/react/Suspense) trong khi biểu định kiểu đang tải.

Để chọn tham gia hành vi này, hãy cung cấp các props `href` và `precedence`. React sẽ loại bỏ các kiểu trùng lặp nếu chúng có cùng `href`. Prop precedence cho React biết vị trí xếp hạng nút DOM `<style>` so với các nút khác trong `<head>` của tài liệu, điều này xác định biểu định kiểu nào có thể ghi đè lên biểu định kiểu khác.

Cách xử lý đặc biệt này đi kèm với hai lưu ý:

*   React sẽ bỏ qua các thay đổi đối với các props sau khi kiểu đã được hiển thị. (React sẽ đưa ra cảnh báo trong quá trình phát triển nếu điều này xảy ra.)
*   React sẽ loại bỏ tất cả các props thừa khi sử dụng prop `precedence` (ngoài `href` và `precedence`).
*   React có thể để lại kiểu trong DOM ngay cả sau khi thành phần hiển thị nó đã bị hủy gắn kết.

---

## Cách sử dụng {/*usage*/}

### Hiển thị biểu định kiểu CSS nội tuyến {/*rendering-an-inline-css-stylesheet*/}

Nếu một thành phần phụ thuộc vào các kiểu CSS nhất định để hiển thị chính xác, bạn có thể hiển thị một biểu định kiểu nội tuyến trong thành phần đó.

Prop `href` phải xác định duy nhất biểu định kiểu, vì React sẽ loại bỏ các biểu định kiểu trùng lặp có cùng `href`.
Nếu bạn cung cấp một prop `precedence`, React sẽ sắp xếp lại các biểu định kiểu nội tuyến dựa trên thứ tự các giá trị này xuất hiện trong cây thành phần.

Các biểu định kiểu nội tuyến sẽ không kích hoạt các ranh giới Suspense trong khi chúng đang tải.
Ngay cả khi chúng tải các tài nguyên không đồng bộ như phông chữ hoặc hình ảnh.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index}: \{ color: "${color}"; \}`
  ).join();
  return (
    <>
      <style href={"PieChart-" + JSON.stringify(colors)} precedence="medium">
        {stylesheet}
      </style>
      <svg id={id}>
        …
      </svg>
    </>
  );
}

export default function App() {
  return (
    <ShowRenderedHTML>
      <PieChart data="..." colors={['red', 'green', 'blue']} />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
