---
title: flushSync
---

<Pitfall>

Việc sử dụng `flushSync` là không phổ biến và có thể làm giảm hiệu suất ứng dụng của bạn.

</Pitfall>

<Intro>

`flushSync` cho phép bạn buộc React đồng bộ hóa mọi cập nhật bên trong callback được cung cấp. Điều này đảm bảo rằng DOM được cập nhật ngay lập tức.

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

Gọi `flushSync` để buộc React đồng bộ hóa mọi công việc đang chờ xử lý và cập nhật DOM một cách đồng bộ.

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

Hầu hết thời gian, có thể tránh sử dụng `flushSync`. Chỉ sử dụng `flushSync` như là giải pháp cuối cùng.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `callback`: Một hàm. React sẽ gọi ngay lập tức callback này và đồng bộ hóa mọi cập nhật mà nó chứa. Nó cũng có thể đồng bộ hóa bất kỳ cập nhật đang chờ xử lý nào, hoặc Effects, hoặc các cập nhật bên trong Effects. Nếu một cập nhật tạm ngưng do kết quả của lệnh gọi `flushSync` này, thì các fallback có thể được hiển thị lại.

#### Giá trị trả về {/*returns*/}

`flushSync` trả về `undefined`.

#### Lưu ý {/*caveats*/}

* `flushSync` có thể làm giảm đáng kể hiệu suất. Sử dụng một cách tiết kiệm.
* `flushSync` có thể buộc các Suspense boundary đang chờ xử lý hiển thị trạng thái `fallback` của chúng.
* `flushSync` có thể chạy các Effects đang chờ xử lý và áp dụng đồng bộ bất kỳ cập nhật nào chúng chứa trước khi trả về.
* `flushSync` có thể đồng bộ hóa các cập nhật bên ngoài callback khi cần thiết để đồng bộ hóa các cập nhật bên trong callback. Ví dụ: nếu có các cập nhật đang chờ xử lý từ một cú nhấp chuột, React có thể đồng bộ hóa chúng trước khi đồng bộ hóa các cập nhật bên trong callback.

---

## Cách sử dụng {/*usage*/}

### Đồng bộ hóa các cập nhật cho tích hợp của bên thứ ba {/*flushing-updates-for-third-party-integrations*/}

Khi tích hợp với mã của bên thứ ba, chẳng hạn như API trình duyệt hoặc thư viện giao diện người dùng, có thể cần thiết phải buộc React đồng bộ hóa các cập nhật. Sử dụng `flushSync` để buộc React đồng bộ hóa mọi <CodeStep step={1}>cập nhật trạng thái</CodeStep> bên trong callback một cách đồng bộ:

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// Đến dòng này, DOM đã được cập nhật.
```

Điều này đảm bảo rằng, vào thời điểm dòng mã tiếp theo chạy, React đã cập nhật DOM.

**Sử dụng `flushSync` là không phổ biến và sử dụng nó thường xuyên có thể làm giảm đáng kể hiệu suất ứng dụng của bạn.** Nếu ứng dụng của bạn chỉ sử dụng API React và không tích hợp với thư viện của bên thứ ba, thì không cần thiết phải sử dụng `flushSync`.

Tuy nhiên, nó có thể hữu ích cho việc tích hợp với mã của bên thứ ba như API trình duyệt.

Một số API trình duyệt mong đợi kết quả bên trong callback được ghi vào DOM một cách đồng bộ, vào cuối callback, để trình duyệt có thể làm gì đó với DOM đã được hiển thị. Trong hầu hết các trường hợp, React tự động xử lý việc này cho bạn. Nhưng trong một số trường hợp, có thể cần thiết phải buộc cập nhật đồng bộ.

Ví dụ: API `onbeforeprint` của trình duyệt cho phép bạn thay đổi trang ngay trước khi hộp thoại in mở ra. Điều này hữu ích cho việc áp dụng các kiểu in tùy chỉnh cho phép tài liệu hiển thị tốt hơn để in. Trong ví dụ dưới đây, bạn sử dụng `flushSync` bên trong callback `onbeforeprint` để ngay lập tức "đồng bộ hóa" trạng thái React với DOM. Sau đó, vào thời điểm hộp thoại in mở ra, `isPrinting` hiển thị "yes":

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>
        Print
      </button>
    </>
  );
}
```

</Sandpack>

Nếu không có `flushSync`, hộp thoại in sẽ hiển thị `isPrinting` là "no". Điều này là do React xử lý các cập nhật không đồng bộ và hộp thoại in được hiển thị trước khi trạng thái được cập nhật.

<Pitfall>

`flushSync` có thể làm giảm đáng kể hiệu suất và có thể bất ngờ buộc các Suspense boundary đang chờ xử lý hiển thị trạng thái fallback của chúng.

Hầu hết thời gian, có thể tránh sử dụng `flushSync`, vì vậy hãy sử dụng `flushSync` như một giải pháp cuối cùng.

</Pitfall>
