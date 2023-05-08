---
title: useDebugValue
---

<Intro>

`useDebugValue` là một React Hook để giúp thêm nhãn (label) vào một custom Hook trên [Công cụ phát triển React (React DevTools).](/learn/react-developer-tools)

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

Gọi `useDebugValue` ở cấp cao nhất trong [custom Hook](/learn/reusing-logic-with-custom-hooks) của bạn để hiển thị một giá trị debug (debug value) dễ đọc:

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

[Xem thêm các ví dụ phía dưới.](#usage)

#### Các tham số (Parameters) {/*parameters*/}

* `value`: Giá trị bạn muốn hiển thị trên React DevTools. Giá trị này có thể thuộc bất cứ kiểu nào.
* **không bắt buộc** `format`: Là một hàm dùng để định dạng. Khi bạn kiểm tra các thành phần (component), React DevTools sẽ gọi hàm này với đối số là giá trị của `value`, sau đó sẽ hiển thị giá trị sau khi định dạng (giá trị sau khi định dạng cũng có thể thuộc bất cứ kiểu nào). Nếu bạn không thiết lập hàm định dạng, giá trị ban đầu của `value` sẽ được hiển thị.

#### Giá trị trả về (Returns) {/*returns*/}

`useDebugValue` không trả về bất cứ giá trị nào.

## Cách sử dụng {/*usage*/}

### Thêm label cho custom Hook {/*adding-a-label-to-a-custom-hook*/}

Gọi `useDebugValue` ở cấp cao nhất cho [custom Hook](/learn/reusing-logic-with-custom-hooks) của bạn để hiển thị một <CodeStep step={1}>debug value</CodeStep> dễ đọc trên [React DevTools.](/learn/react-developer-tools)

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

Việc này sẽ gắn thêm label như là `OnlineStatus: "Online"` cho các component gọi `useOnlineStatus` khi bạn kiểm tra chúng:

![Một ảnh chụp của React DevTools khi hiển thị debug value](/images/docs/react-devtools-usedebugvalue.png)

Nếu không gọi `useDebugValue`, sẽ chỉ có dữ liệu cơ bản (như ví dụ này là `true`) được hiển thị.

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

<Note>

Đừng lạm dụng debug value cho tất cả các custom Hook. Nó có giá trị nhất khi sử dụng cho những custom Hook là một phần của các thư viện dùng chung và có cấu trúc dữ liệu nội bội phức tạp gây khó khăn cho việc kiểm tra.

</Note>

---

### Trì hoãn việc định dạng một debug value {/*deferring-formatting-of-a-debug-value*/}

Bạn có thể đưa vào một hàm định dạng làm đối số thứ hai cho `useDebugValue`:

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

Hàm định dạng của bạn sẽ nhận được tham số là <CodeStep step={1}>debug value</CodeStep> và cần trả về một <CodeStep step={2}>giá trị đã định dạng để hiển thị (formatted display value)</CodeStep>. Chỉ khi nào component của bạn được kiểm tra, React DevTools sẽ gọi hàm này và hiển thị kết quả được trả về.

Điều này giúp bạn tránh việc luôn chạy những logic định dạng (đôi khi những logic này có thể sẽ rất tốn kém), trừ phi là lúc component đó đang được kiểm tra. Ví dụ như, `date` là một giá trị kiểu Date, việc sử dụng `useDebugValue` giúp tránh gọi đến `toDateString()` trên giá trị đó cho mỗi lần render.
