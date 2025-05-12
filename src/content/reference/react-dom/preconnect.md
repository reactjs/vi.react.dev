---
title: preconnect
---

<Intro>

`preconnect` cho phép bạn chủ động kết nối đến một máy chủ mà bạn dự kiến sẽ tải tài nguyên từ đó.

```js
preconnect("https://example.com");
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `preconnect(href)` {/*preconnect*/}

Để preconnect đến một host, gọi hàm `preconnect` từ `react-dom`.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ...
}

```

[Xem thêm các ví dụ bên dưới.](#usage)

Hàm `preconnect` cung cấp cho trình duyệt một gợi ý rằng nó nên mở một kết nối đến máy chủ đã cho. Nếu trình duyệt chọn làm như vậy, điều này có thể tăng tốc độ tải tài nguyên từ máy chủ đó.

#### Tham số {/*parameters*/}

* `href`: một chuỗi. URL của máy chủ bạn muốn kết nối đến.

#### Giá trị trả về {/*returns*/}

`preconnect` không trả về gì cả.

#### Lưu ý {/*caveats*/}

* Nhiều lệnh gọi đến `preconnect` với cùng một máy chủ có cùng hiệu ứng như một lệnh gọi duy nhất.
* Trong trình duyệt, bạn có thể gọi `preconnect` trong bất kỳ tình huống nào: trong khi render một component, trong một Effect, trong một trình xử lý sự kiện, v.v.
* Trong quá trình render phía máy chủ hoặc khi render Server Components, `preconnect` chỉ có hiệu lực nếu bạn gọi nó trong khi render một component hoặc trong một ngữ cảnh không đồng bộ bắt nguồn từ việc render một component. Bất kỳ lệnh gọi nào khác sẽ bị bỏ qua.
* Nếu bạn biết các tài nguyên cụ thể bạn sẽ cần, bạn có thể gọi [các hàm khác](/reference/react-dom/#resource-preloading-apis) thay vào đó sẽ bắt đầu tải tài nguyên ngay lập tức.
* Không có lợi ích gì khi preconnect đến cùng một máy chủ mà trang web đang được lưu trữ vì nó đã được kết nối vào thời điểm gợi ý được đưa ra.

---

## Cách sử dụng {/*usage*/}

### Preconnect khi render {/*preconnecting-when-rendering*/}

Gọi `preconnect` khi render một component nếu bạn biết rằng các component con của nó sẽ tải tài nguyên bên ngoài từ host đó.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### Preconnect trong một trình xử lý sự kiện {/*preconnecting-in-an-event-handler*/}

Gọi `preconnect` trong một trình xử lý sự kiện trước khi chuyển sang một trang hoặc trạng thái nơi các tài nguyên bên ngoài sẽ cần thiết. Điều này giúp quá trình bắt đầu sớm hơn so với khi bạn gọi nó trong quá trình render trang hoặc trạng thái mới.

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
