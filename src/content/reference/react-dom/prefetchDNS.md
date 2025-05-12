---
title: prefetchDNS
---

<Intro>

`prefetchDNS` cho phép bạn tìm kiếm trước địa chỉ IP của một máy chủ mà bạn dự kiến sẽ tải tài nguyên từ đó.

```js
prefetchDNS("https://example.com");
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `prefetchDNS(href)` {/*prefetchdns*/}

Để tìm kiếm một máy chủ, hãy gọi hàm `prefetchDNS` từ `react-dom`.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  // ...
}

```

[Xem thêm các ví dụ bên dưới.](#usage)

Hàm prefetchDNS cung cấp cho trình duyệt một gợi ý rằng nó nên tìm kiếm địa chỉ IP của một máy chủ nhất định. Nếu trình duyệt chọn làm như vậy, điều này có thể tăng tốc độ tải tài nguyên từ máy chủ đó.

#### Tham số {/*parameters*/}

* `href`: một chuỗi. URL của máy chủ bạn muốn kết nối.

#### Giá trị trả về {/*returns*/}

`prefetchDNS` không trả về gì cả.

#### Lưu ý {/*caveats*/}

* Nhiều lệnh gọi đến `prefetchDNS` với cùng một máy chủ có tác dụng tương tự như một lệnh gọi duy nhất.
* Trong trình duyệt, bạn có thể gọi `prefetchDNS` trong mọi tình huống: trong khi hiển thị một component, trong một Effect, trong một trình xử lý sự kiện, v.v.
* Trong quá trình render phía máy chủ hoặc khi render Server Components, `prefetchDNS` chỉ có hiệu lực nếu bạn gọi nó trong khi render một component hoặc trong một ngữ cảnh không đồng bộ bắt nguồn từ việc render một component. Bất kỳ lệnh gọi nào khác sẽ bị bỏ qua.
* Nếu bạn biết các tài nguyên cụ thể bạn sẽ cần, bạn có thể gọi [các hàm khác](/reference/react-dom/#resource-preloading-apis) thay vào đó để bắt đầu tải tài nguyên ngay lập tức.
* Không có lợi ích gì khi tìm nạp trước cùng một máy chủ mà trang web đang được lưu trữ vì nó đã được tìm kiếm vào thời điểm gợi ý được đưa ra.
* So với [`preconnect`](/reference/react-dom/preconnect), `prefetchDNS` có thể tốt hơn nếu bạn đang kết nối một cách suy đoán với một số lượng lớn các tên miền, trong trường hợp đó, chi phí của việc thiết lập trước các kết nối có thể lớn hơn lợi ích.

---

## Cách sử dụng {/*usage*/}

### Tìm nạp trước DNS khi render {/*prefetching-dns-when-rendering*/}

Gọi `prefetchDNS` khi render một component nếu bạn biết rằng các component con của nó sẽ tải tài nguyên bên ngoài từ máy chủ đó.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  return ...;
}
```

### Tìm nạp trước DNS trong một trình xử lý sự kiện {/*prefetching-dns-in-an-event-handler*/}

Gọi `prefetchDNS` trong một trình xử lý sự kiện trước khi chuyển sang một trang hoặc trạng thái nơi các tài nguyên bên ngoài sẽ cần thiết. Điều này giúp quá trình bắt đầu sớm hơn so với việc bạn gọi nó trong quá trình render trang hoặc trạng thái mới.

```js
import { prefetchDNS } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    prefetchDNS('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
