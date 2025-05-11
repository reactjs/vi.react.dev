---
script: "<script>"
---

<Intro>

[Thành phần `<script>` tích hợp sẵn của trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) cho phép bạn thêm một script vào tài liệu của mình.

```js
<script> alert("hi!") </script>
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<script>` {/*script*/}

Để thêm các script nội tuyến hoặc bên ngoài vào tài liệu của bạn, hãy hiển thị [thành phần `<script>` tích hợp sẵn của trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script). Bạn có thể hiển thị `<script>` từ bất kỳ thành phần nào và React sẽ [trong một số trường hợp](#special-rendering-behavior) đặt phần tử DOM tương ứng vào đầu tài liệu và loại bỏ các script giống hệt nhau.

```js
<script> alert("hi!") </script>
<script src="script.js" />
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<script>` hỗ trợ tất cả [các props phần tử thông thường.](/reference/react-dom/components/common#props)

Nó phải có *hoặc* `children` hoặc một prop `src`.

* `children`: một chuỗi. Mã nguồn của một script nội tuyến.
* `src`: một chuỗi. URL của một script bên ngoài.

Các props được hỗ trợ khác:

* `async`: một boolean. Cho phép trình duyệt trì hoãn việc thực thi script cho đến khi phần còn lại của tài liệu đã được xử lý — hành vi ưu tiên cho hiệu suất.
* `crossOrigin`: một chuỗi. [Chính sách CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) để sử dụng. Các giá trị có thể của nó là `anonymous` và `use-credentials`.
* `fetchPriority`: một chuỗi. Cho phép trình duyệt xếp hạng các script theo thứ tự ưu tiên khi tìm nạp nhiều script cùng một lúc. Có thể là `high`, `low` hoặc `auto` (mặc định).
* `integrity`: một chuỗi. Một hàm băm mật mã của script, để [xác minh tính xác thực của nó](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `noModule`: một boolean. Vô hiệu hóa script trong các trình duyệt hỗ trợ ES modules — cho phép một script dự phòng cho các trình duyệt không hỗ trợ.
* `nonce`: một chuỗi. Một [nonce mật mã để cho phép tài nguyên](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) khi sử dụng Chính sách bảo mật nội dung nghiêm ngặt.
* `referrer`: một chuỗi. Cho biết [tiêu đề Referer nào sẽ gửi](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#referrerpolicy) khi tìm nạp script và bất kỳ tài nguyên nào mà script tìm nạp đến lượt.
* `type`: một chuỗi. Cho biết liệu script là [script cổ điển, ES module hoặc import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type).

Các props vô hiệu hóa [cách xử lý đặc biệt của React đối với các script](#special-rendering-behavior):

* `onError`: một hàm. Được gọi khi script không tải được.
* `onLoad`: một hàm. Được gọi khi script tải xong.

Các props **không được khuyến nghị** sử dụng với React:

* `blocking`: một chuỗi. Nếu được đặt thành `"render"`, hướng dẫn trình duyệt không hiển thị trang cho đến khi scriptsheet được tải. React cung cấp khả năng kiểm soát chi tiết hơn bằng Suspense.
* `defer`: một chuỗi. Ngăn trình duyệt thực thi script cho đến khi tài liệu được tải xong. Không tương thích với các thành phần kết xuất phía máy chủ trực tuyến. Sử dụng prop `async` thay thế.

#### Hành vi kết xuất đặc biệt {/*special-rendering-behavior*/}

React có thể di chuyển các thành phần `<script>` đến `<head>` của tài liệu và loại bỏ các script giống hệt nhau.

Để chọn tham gia hành vi này, hãy cung cấp các prop `src` và `async={true}`. React sẽ loại bỏ các script trùng lặp nếu chúng có cùng `src`. Prop `async` phải là true để cho phép các script được di chuyển một cách an toàn.

Cách xử lý đặc biệt này đi kèm với hai lưu ý:

* React sẽ bỏ qua các thay đổi đối với các prop sau khi script đã được hiển thị. (React sẽ đưa ra cảnh báo trong quá trình phát triển nếu điều này xảy ra.)
* React có thể để lại script trong DOM ngay cả sau khi thành phần hiển thị nó đã bị hủy gắn kết. (Điều này không có hiệu lực vì các script chỉ thực thi một lần khi chúng được chèn vào DOM.)

---

## Cách sử dụng {/*usage*/}

### Kết xuất một script bên ngoài {/*rendering-an-external-script*/}

Nếu một thành phần phụ thuộc vào các script nhất định để được hiển thị chính xác, bạn có thể hiển thị một `<script>` bên trong thành phần đó.
Tuy nhiên, thành phần có thể được commit trước khi script tải xong.
Bạn có thể bắt đầu phụ thuộc vào nội dung script sau khi sự kiện `load` được kích hoạt, ví dụ: bằng cách sử dụng prop `onLoad`.

React sẽ loại bỏ các script trùng lặp có cùng `src`, chỉ chèn một trong số chúng vào DOM ngay cả khi nhiều thành phần hiển thị nó.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" onLoad={() => console.log('script loaded')} />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <Map />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

<Note>
Khi bạn muốn sử dụng một script, có thể có lợi khi gọi hàm [preinit](/reference/react-dom/preinit). Gọi hàm này có thể cho phép trình duyệt bắt đầu tìm nạp script sớm hơn so với khi bạn chỉ hiển thị một thành phần `<script>`, ví dụ: bằng cách gửi [phản hồi HTTP Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
</Note>

### Kết xuất một script nội tuyến {/*rendering-an-inline-script*/}

Để bao gồm một script nội tuyến, hãy hiển thị thành phần `<script>` với mã nguồn script là children của nó. Các script nội tuyến không được loại bỏ trùng lặp hoặc di chuyển đến `<head>` của tài liệu.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Tracking() {
  return (
    <script>
      ga('send', 'pageview');
    </script>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <h1>My Website</h1>
      <Tracking />
      <p>Welcome</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
