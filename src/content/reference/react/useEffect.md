---
title: useEffect
---

<Intro>

`useEffect` là một React Hook cho phép bạn [đồng bộ hóa một component với một hệ thống bên ngoài.](/learn/synchronizing-with-effects)

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

Gọi `useEffect` ở cấp cao nhất của component để khai báo một Effect:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `setup`: Hàm chứa logic Effect của bạn. Hàm thiết lập của bạn cũng có thể trả về một hàm *dọn dẹp* (cleanup) tùy chọn. Khi component của bạn được thêm vào DOM, React sẽ chạy hàm thiết lập của bạn. Sau mỗi lần re-render với các dependency đã thay đổi, React sẽ chạy hàm dọn dẹp (nếu bạn cung cấp) với các giá trị cũ, và sau đó chạy hàm thiết lập của bạn với các giá trị mới. Sau khi component của bạn bị xóa khỏi DOM, React sẽ chạy hàm dọn dẹp của bạn.
 
* **tùy chọn** `dependencies`: Danh sách tất cả các giá trị reactive được tham chiếu bên trong code `setup`. Các giá trị reactive bao gồm props, state và tất cả các biến và hàm được khai báo trực tiếp bên trong phần thân component của bạn. Nếu trình lint của bạn được [cấu hình cho React](/learn/editor-setup#linting), nó sẽ xác minh rằng mọi giá trị reactive được chỉ định chính xác là một dependency. Danh sách các dependency phải có một số lượng mục không đổi và được viết nội tuyến như `[dep1, dep2, dep3]`. React sẽ so sánh từng dependency với giá trị trước đó của nó bằng cách sử dụng so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Nếu bạn bỏ qua đối số này, Effect của bạn sẽ chạy lại sau mỗi lần re-render của component. [Xem sự khác biệt giữa việc truyền một mảng dependency, một mảng trống và không có dependency nào cả.](#examples-dependencies)

#### Giá trị trả về {/*returns*/}

`useEffect` trả về `undefined`.

#### Lưu ý {/*caveats*/}

* `useEffect` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất của component** hoặc Hook của riêng bạn. Bạn không thể gọi nó bên trong các vòng lặp hoặc điều kiện. Nếu bạn cần điều đó, hãy trích xuất một component mới và di chuyển state vào đó.

* Nếu bạn **không cố gắng đồng bộ hóa với một số hệ thống bên ngoài,** [có lẽ bạn không cần một Effect.](/learn/you-might-not-need-an-effect)

* Khi Strict Mode được bật, React sẽ **chạy thêm một chu kỳ thiết lập + dọn dẹp chỉ dành cho quá trình phát triển** trước khi thiết lập thực tế đầu tiên. Đây là một bài kiểm tra áp lực để đảm bảo rằng logic dọn dẹp của bạn "phản ánh" logic thiết lập của bạn và nó dừng hoặc hoàn tác bất cứ điều gì mà thiết lập đang làm. Nếu điều này gây ra sự cố, [hãy triển khai hàm dọn dẹp.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Nếu một số dependency của bạn là các đối tượng hoặc hàm được xác định bên trong component, có một rủi ro là chúng sẽ **khiến Effect chạy lại thường xuyên hơn mức cần thiết.** Để khắc phục điều này, hãy loại bỏ các dependency [đối tượng](#removing-unnecessary-object-dependencies) và [hàm](#removing-unnecessary-function-dependencies) không cần thiết. Bạn cũng có thể [trích xuất các bản cập nhật state](#updating-state-based-on-previous-state-from-an-effect) và [logic không reactive](#reading-the-latest-props-and-state-from-an-effect) ra khỏi Effect của bạn.

* Nếu Effect của bạn không phải do một tương tác (như một cú nhấp chuột) gây ra, React thường sẽ cho phép trình duyệt **vẽ màn hình được cập nhật trước khi chạy Effect của bạn.** Nếu Effect của bạn đang làm một cái gì đó trực quan (ví dụ: định vị một tooltip) và độ trễ là đáng chú ý (ví dụ: nó nhấp nháy), hãy thay thế `useEffect` bằng [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* Nếu Effect của bạn là do một tương tác (như một cú nhấp chuột) gây ra, **React có thể chạy Effect của bạn trước khi trình duyệt vẽ màn hình được cập nhật**. Điều này đảm bảo rằng kết quả của Effect có thể được quan sát bởi hệ thống sự kiện. Thông thường, điều này hoạt động như mong đợi. Tuy nhiên, nếu bạn phải trì hoãn công việc cho đến sau khi vẽ, chẳng hạn như một `alert()`, bạn có thể sử dụng `setTimeout`. Xem [reactwg/react-18/128](https://github.com/reactwg/react-18/discussions/128) để biết thêm thông tin.

* Ngay cả khi Effect của bạn là do một tương tác (như một cú nhấp chuột) gây ra, **React có thể cho phép trình duyệt vẽ lại màn hình trước khi xử lý các bản cập nhật state bên trong Effect của bạn.** Thông thường, điều này hoạt động như mong đợi. Tuy nhiên, nếu bạn phải chặn trình duyệt vẽ lại màn hình, bạn cần thay thế `useEffect` bằng [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* Các Effect **chỉ chạy trên client.** Chúng không chạy trong quá trình server rendering.

---

## Cách sử dụng {/*usage*/}

### Kết nối với một hệ thống bên ngoài {/*connecting-to-an-external-system*/}

Một số component cần duy trì kết nối với mạng, một số API của trình duyệt hoặc một thư viện của bên thứ ba, trong khi chúng được hiển thị trên trang. Các hệ thống này không được React kiểm soát, vì vậy chúng được gọi là *bên ngoài*.

Để [kết nối component của bạn với một số hệ thống bên ngoài,](/learn/synchronizing-with-effects) hãy gọi `useEffect` ở cấp cao nhất của component của bạn:

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

Bạn cần truyền hai đối số cho `useEffect`:

1. Một *hàm thiết lập* với <CodeStep step={1}>code thiết lập</CodeStep> kết nối với hệ thống đó.
   - Nó sẽ trả về một *hàm dọn dẹp* với <CodeStep step={2}>code dọn dẹp</CodeStep> ngắt kết nối khỏi hệ thống đó.
2. Một <CodeStep step={3}>danh sách các dependency</CodeStep> bao gồm mọi giá trị từ component của bạn được sử dụng bên trong các hàm đó.

**React gọi các hàm thiết lập và dọn dẹp của bạn bất cứ khi nào cần thiết, điều này có thể xảy ra nhiều lần:**

1. <CodeStep step={1}>Code thiết lập</CodeStep> của bạn chạy khi component của bạn được thêm vào trang *(mounts)*.
2. Sau mỗi lần re-render của component của bạn, nơi <CodeStep step={3}>các dependency</CodeStep> đã thay đổi:
   - Đầu tiên, <CodeStep step={2}>code dọn dẹp</CodeStep> của bạn chạy với các props và state cũ.
   - Sau đó, <CodeStep step={1}>code thiết lập</CodeStep> của bạn chạy với các props và state mới.
3. <CodeStep step={2}>Code dọn dẹp</CodeStep> của bạn chạy lần cuối cùng sau khi component của bạn bị xóa khỏi trang *(unmounts).*

**Hãy minh họa chuỗi này cho ví dụ trên.**

Khi component `ChatRoom` ở trên được thêm vào trang, nó sẽ kết nối với phòng chat với `serverUrl` và `roomId` ban đầu. Nếu `serverUrl` hoặc `roomId` thay đổi do kết quả của một re-render (ví dụ: nếu người dùng chọn một phòng chat khác trong một dropdown), Effect của bạn sẽ *ngắt kết nối khỏi phòng trước đó và kết nối với phòng tiếp theo.* Khi component `ChatRoom` bị xóa khỏi trang, Effect của bạn sẽ ngắt kết nối lần cuối cùng.

**Để [giúp bạn tìm lỗi,](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) trong quá trình phát triển, React chạy <CodeStep step={1}>thiết lập</CodeStep> và <CodeStep step={2}>dọn dẹp</CodeStep> thêm một lần trước <CodeStep step={1}>thiết lập</CodeStep>.** Đây là một bài kiểm tra áp lực để xác minh logic Effect của bạn được triển khai chính xác. Nếu điều này gây ra các vấn đề có thể nhìn thấy, thì hàm dọn dẹp của bạn đang thiếu một số logic. Hàm dọn dẹp sẽ dừng hoặc hoàn tác bất cứ điều gì mà hàm thiết lập đã làm. Nguyên tắc chung là người dùng không thể phân biệt giữa việc thiết lập được gọi một lần (như trong production) và một chuỗi *thiết lập* → *dọn dẹp* → *thiết lập* (như trong quá trình phát triển). [Xem các giải pháp phổ biến.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

**Cố gắng [viết mọi Effect như một quy trình độc lập](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) và [suy nghĩ về một chu kỳ thiết lập/dọn dẹp duy nhất tại một thời điểm.](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective)** Không quan trọng component của bạn đang mounting, updating hay unmounting. Khi logic dọn dẹp của bạn "phản ánh" chính xác logic thiết lập, Effect của bạn có khả năng phục hồi để chạy thiết lập và dọn dẹp thường xuyên khi cần thiết.

<Note>

Một Effect cho phép bạn [giữ cho component của bạn được đồng bộ hóa](/learn/synchronizing-with-effects) với một số hệ thống bên ngoài (như một dịch vụ chat). Ở đây, *hệ thống bên ngoài* có nghĩa là bất kỳ đoạn code nào không được React kiểm soát, chẳng hạn như:

* Một bộ hẹn giờ được quản lý bằng <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep> và <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep>.
* Một đăng ký sự kiện sử dụng <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)</CodeStep> và <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)</CodeStep>.
* Một thư viện hoạt ảnh của bên thứ ba với một API như <CodeStep step={1}>`animation.start()`</CodeStep> và <CodeStep step={2}>`animation.reset()`</CodeStep>.

**Nếu bạn không kết nối với bất kỳ hệ thống bên ngoài nào, [có lẽ bạn không cần một Effect.](/learn/you-might-not-need-an-effect)**

</Note>

<Recipes titleText="Ví dụ về kết nối với một hệ thống bên ngoài" titleId="examples-connecting">

#### Kết nối với một máy chủ chat {/*connecting-to-a-chat-server*/}

Trong ví dụ này, component `ChatRoom` sử dụng một Effect để duy trì kết nối với một hệ thống bên ngoài được xác định trong `chat.js`. Nhấn "Open chat" để làm cho component `ChatRoom` xuất hiện. Sandbox này chạy ở chế độ phát triển, vì vậy có một chu kỳ kết nối và ngắt kết nối bổ sung, như [đã giải thích ở đây.](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) Hãy thử thay đổi `roomId` và `serverUrl` bằng cách sử dụng dropdown và input, và xem Effect kết nối lại với chat như thế nào. Nhấn "Close chat" để xem Effect ngắt kết nối lần cuối cùng.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Chào mừng đến phòng {roomId}!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Chọn phòng chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Đóng chat' : 'Mở chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Một implementation thực tế sẽ thực sự kết nối đến server
  return {
    connect() {
      console.log('✅ Đang kết nối đến phòng "' + roomId + '" tại ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Đã ngắt kết nối khỏi phòng "' + roomId + '" tại ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### Lắng nghe một sự kiện trình duyệt toàn cục {/*listening-to-a-global-browser-event*/}

Trong ví dụ này, hệ thống bên ngoài là chính DOM của trình duyệt. Thông thường, bạn sẽ chỉ định các trình lắng nghe sự kiện bằng JSX, nhưng bạn không thể lắng nghe đối tượng [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) toàn cục theo cách này. Một Effect cho phép bạn kết nối với đối tượng `window` và lắng nghe các sự kiện của nó. Lắng nghe sự kiện `pointermove` cho phép bạn theo dõi vị trí con trỏ (hoặc ngón tay) và cập nhật dấu chấm màu đỏ để di chuyển cùng với nó.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Kích hoạt một hoạt ảnh {/*triggering-an-animation*/}

Trong ví dụ này, hệ thống bên ngoài là thư viện hoạt ảnh trong `animation.js`. Nó cung cấp một class JavaScript có tên là `FadeInAnimation` lấy một DOM node làm đối số và hiển thị các phương thức `start()` và `stop()` để điều khiển hoạt ảnh. Component này [sử dụng một ref](/learn/manipulating-the-dom-with-refs) để truy cập DOM node cơ bản. Effect đọc DOM node từ ref và tự động bắt đầu hoạt ảnh cho node đó khi component xuất hiện.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Chào mừng
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Gỡ bỏ' : 'Hiển thị'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution />

#### Điều khiển một hộp thoại phương thức {/*controlling-a-modal-dialog*/}

Trong ví dụ này, hệ thống bên ngoài là DOM của trình duyệt. Component `ModalDialog` render một phần tử [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog). Nó sử dụng một Effect để đồng bộ hóa prop `isOpen` với các lệnh gọi phương thức [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) và [`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close).

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Mở hộp thoại
      </button>
      <ModalDialog isOpen={show}>
        Xin chào!
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Đóng</button>
      </ModalDialog>
    </>
  );
}
```

```js src/ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Theo dõi khả năng hiển thị của phần tử {/*tracking-element-visibility*/}

Trong ví dụ này, hệ thống bên ngoài lại là DOM của trình duyệt. Component `App` hiển thị một danh sách dài, sau đó là một component `Box` và sau đó là một danh sách dài khác. Cuộn danh sách xuống. Lưu ý rằng khi tất cả component `Box` hoàn toàn hiển thị trong khung nhìn, màu nền sẽ thay đổi thành màu đen. Để triển khai điều này, component `Box` sử dụng một Effect để quản lý một [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). API trình duyệt này thông báo cho bạn khi phần tử DOM hiển thị trong khung nhìn.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Mục #{i} (tiếp tục cuộn)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Gói các Effect trong các Hook tùy chỉnh {/*wrapping-effects-in-custom-hooks*/}

Các Effect là một ["lối thoát hiểm":](/learn/escape-hatches) bạn sử dụng chúng khi bạn cần "bước ra ngoài React" và khi không có giải pháp tích hợp tốt hơn cho trường hợp sử dụng của bạn. Nếu bạn thấy mình thường xuyên cần viết Effect theo cách thủ công, thì đó thường là một dấu hiệu cho thấy bạn cần trích xuất một số [Hook tùy chỉnh](/learn/reusing-logic-with-custom-hooks) cho các hành vi phổ biến mà các component của bạn dựa vào.

Ví dụ: Hook tùy chỉnh `useChatRoom` này "ẩn" logic của Effect của bạn đằng sau một API khai báo hơn:

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Sau đó, bạn có thể sử dụng nó từ bất kỳ component nào như thế này:

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Ngoài ra còn có nhiều Hook tùy chỉnh tuyệt vời cho mọi mục đích có sẵn trong hệ sinh thái React.

[Tìm hiểu thêm về việc gói các Effect trong các Hook tùy chỉnh.](/learn/reusing-logic-with-custom-hooks)

<Recipes titleText="Ví dụ về việc gói các Effect trong các Hook tùy chỉnh" titleId="examples-custom-hooks">

#### Hook `useChatRoom` tùy chỉnh {/*custom-usechatroom-hook*/}

Ví dụ này giống hệt với một trong những [ví dụ trước đó,](#examples-connecting) nhưng logic được trích xuất sang một Hook tùy chỉnh.

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Chào mừng đến phòng {roomId}!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Chọn phòng chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Đóng chat' : 'Mở chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Một implementation thực tế sẽ thực sự kết nối đến server
  return {
    connect() {
      console.log('✅ Đang kết nối đến phòng "' + roomId + '" tại ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Đã ngắt kết nối khỏi phòng "' + roomId + '" tại ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### Hook `useWindowListener` tùy chỉnh {/*custom-usewindowlistener-hook*/}

Ví dụ này giống hệt với một trong những [ví dụ trước đó,](#examples-connecting) nhưng logic được trích xuất sang một Hook tùy chỉnh.

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Hook `useIntersectionObserver` tùy chỉnh {/*custom-useintersectionobserver-hook*/}

Ví dụ này giống hệt với một trong những [ví dụ trước đó,](#examples-connecting) nhưng logic được trích xuất một phần sang một Hook tùy chỉnh.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Mục #{i} (tiếp tục cuộn)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js src/useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Kiểm soát một widget không phải React {/*controlling-a-non-react-widget*/}

Đôi khi, bạn muốn giữ một hệ thống bên ngoài được đồng bộ hóa với một số prop hoặc state của component của bạn.

Ví dụ: nếu bạn có một widget bản đồ của bên thứ ba hoặc một component trình phát video được viết mà không cần React, bạn có thể sử dụng Effect để gọi các phương thức trên nó để làm cho state của nó khớp với state hiện tại của component React của bạn. Effect này tạo một instance của một class `MapWidget` được định nghĩa trong `map-widget.js`. Khi bạn thay đổi prop `zoomLevel` của component `Map`, Effect sẽ gọi `setZoom()` trên instance class để giữ cho nó được đồng bộ hóa:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
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

```js src/App.js
import { useState } from 'react';
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Zoom level: {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>-</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js src/Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

Trong ví dụ này, một hàm dọn dẹp là không cần thiết vì class `MapWidget` chỉ quản lý DOM node đã được truyền cho nó. Sau khi component `Map` React bị xóa khỏi cây, cả DOM node và instance class `MapWidget` sẽ tự động được thu gom rác bởi engine JavaScript của trình duyệt.

---

### Tìm nạp dữ liệu với Effects {/*fetching-data-with-effects*/}

Bạn có thể sử dụng Effect để tìm nạp dữ liệu cho component của bạn. Lưu ý rằng [nếu bạn sử dụng một framework,](/learn/start-a-new-react-project#production-grade-react-frameworks) việc sử dụng cơ chế tìm nạp dữ liệu tích hợp của framework của bạn sẽ hiệu quả hơn nhiều so với việc viết Effects thủ công.

Nếu bạn muốn tìm nạp dữ liệu từ một Effect thủ công, code của bạn có thể trông như thế này:

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

Lưu ý biến `ignore` được khởi tạo thành `false` và được đặt thành `true` trong quá trình dọn dẹp. Điều này đảm bảo [code của bạn không bị "race conditions":](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) các phản hồi mạng có thể đến theo một thứ tự khác với thứ tự bạn đã gửi chúng.

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

Bạn cũng có thể viết lại bằng cú pháp [`async` / `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), nhưng bạn vẫn cần cung cấp một hàm dọn dẹp:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

Việc viết code tìm nạp dữ liệu trực tiếp trong Effects trở nên lặp đi lặp lại và gây khó khăn cho việc thêm các tối ưu hóa như caching và server rendering sau này. [Sẽ dễ dàng hơn khi sử dụng một Hook tùy chỉnh--hoặc của riêng bạn hoặc được duy trì bởi cộng đồng.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

<DeepDive>

#### Những lựa chọn thay thế tốt cho việc tìm nạp dữ liệu trong Effects là gì? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Việc viết các lệnh gọi `fetch` bên trong Effects là một [cách phổ biến để tìm nạp dữ liệu](https://www.robinwieruch.de/react-hooks-fetch-data/), đặc biệt là trong các ứng dụng hoàn toàn phía client. Tuy nhiên, đây là một cách tiếp cận rất thủ công và nó có những nhược điểm đáng kể:

- **Effects không chạy trên server.** Điều này có nghĩa là HTML được render ban đầu phía server sẽ chỉ bao gồm một state loading mà không có dữ liệu. Máy tính của client sẽ phải tải xuống tất cả JavaScript và render ứng dụng của bạn chỉ để phát hiện ra rằng bây giờ nó cần tải dữ liệu. Điều này không hiệu quả lắm.
- **Việc tìm nạp trực tiếp trong Effects giúp dễ dàng tạo ra "network waterfalls".** Bạn render component cha, nó tìm nạp một số dữ liệu, render các component con, và sau đó chúng bắt đầu tìm nạp dữ liệu của chúng. Nếu mạng không nhanh lắm, điều này sẽ chậm hơn đáng kể so với việc tìm nạp tất cả dữ liệu song song.
- **Việc tìm nạp trực tiếp trong Effects thường có nghĩa là bạn không preload hoặc cache dữ liệu.** Ví dụ: nếu component unmount và sau đó mount lại, nó sẽ phải tìm nạp lại dữ liệu.
- **Nó không được tiện dụng lắm.** Có khá nhiều code boilerplate liên quan khi viết các lệnh gọi `fetch` theo cách không bị các lỗi như [race conditions.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

Danh sách các nhược điểm này không dành riêng cho React. Nó áp dụng cho việc tìm nạp dữ liệu trên mount với bất kỳ thư viện nào. Giống như với routing, việc tìm nạp dữ liệu không phải là điều tầm thường để thực hiện tốt, vì vậy chúng tôi khuyên bạn nên sử dụng các cách tiếp cận sau:

- **Nếu bạn sử dụng một [framework](/learn/start-a-new-react-project#production-grade-react-frameworks), hãy sử dụng cơ chế tìm nạp dữ liệu tích hợp của nó.** Các framework React hiện đại có các cơ chế tìm nạp dữ liệu tích hợp hiệu quả và không mắc phải những cạm bẫy trên.
- **Nếu không, hãy cân nhắc sử dụng hoặc xây dựng một cache phía client.** Các giải pháp mã nguồn mở phổ biến bao gồm [React Query](https://tanstack.com/query/latest/), [useSWR](https://swr.vercel.app/), và [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) Bạn cũng có thể xây dựng giải pháp của riêng mình, trong trường hợp đó, bạn sẽ sử dụng Effects bên dưới nhưng cũng thêm logic để loại bỏ các yêu cầu trùng lặp, caching các phản hồi và tránh network waterfalls (bằng cách preload dữ liệu hoặc nâng các yêu cầu dữ liệu lên các route).

Bạn có thể tiếp tục tìm nạp dữ liệu trực tiếp trong Effects nếu không có cách tiếp cận nào trong số này phù hợp với bạn.

</DeepDive>

---

### Chỉ định các dependency reactive {/*specifying-reactive-dependencies*/}

**Lưu ý rằng bạn không thể "chọn" các dependency của Effect của bạn.** Mọi <CodeStep step={2}>giá trị reactive</CodeStep> được sử dụng bởi code Effect của bạn phải được khai báo là một dependency. Danh sách dependency của Effect của bạn được xác định bởi code xung quanh:

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // Đây là một giá trị reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // Đây cũng là một giá trị reactive

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Effect này đọc các giá trị reactive này
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ Vì vậy, bạn phải chỉ định chúng làm dependency của Effect của bạn
  // ...
}
```

Nếu `serverUrl` hoặc `roomId` thay đổi, Effect của bạn sẽ kết nối lại với chat bằng các giá trị mới.

**[Các giá trị reactive](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) bao gồm các prop và tất cả các biến và hàm được khai báo trực tiếp bên trong component của bạn.** Vì `roomId` và `serverUrl` là các giá trị reactive, bạn không thể xóa chúng khỏi các dependency. Nếu bạn cố gắng bỏ qua chúng và [linter của bạn được định cấu hình chính xác cho React,](/learn/editor-setup#linting) linter sẽ gắn cờ điều này là một lỗi bạn cần sửa:

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect có các dependency bị thiếu: 'roomId' và 'serverUrl'
  // ...
}
```

**Để xóa một dependency, bạn cần phải ["chứng minh" cho linter rằng nó *không cần* phải là một dependency.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)** Ví dụ: bạn có thể di chuyển `serverUrl` ra khỏi component của bạn để chứng minh rằng nó không reactive và sẽ không thay đổi khi re-render:

```js {1,8}
const serverUrl = 'https://localhost:1234'; // Không còn là một giá trị reactive nữa

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Tất cả các dependency đã được khai báo
  // ...
}
```

Bây giờ `serverUrl` không phải là một giá trị reactive (và không thể thay đổi khi re-render), nó không cần phải là một dependency. **Nếu code Effect của bạn không sử dụng bất kỳ giá trị reactive nào, danh sách dependency của nó phải trống (`[]`):**

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // Không còn là một giá trị reactive nữa
const roomId = 'music'; // Không còn là một giá trị reactive nữa

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Tất cả các dependency đã được khai báo
  // ...
}
```

[Một Effect với các dependency trống](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) không chạy lại khi bất kỳ prop hoặc state nào của component của bạn thay đổi.

<Pitfall>

Nếu bạn có một codebase hiện có, bạn có thể có một số Effects bỏ qua linter như thế này:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Tránh bỏ qua linter như thế này:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Khi các dependency không khớp với code, có một nguy cơ cao gây ra các lỗi.** Bằng cách bỏ qua linter, bạn "nói dối" với React về các giá trị mà Effect của bạn phụ thuộc vào. [Thay vào đó, hãy chứng minh rằng chúng là không cần thiết.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)

</Pitfall>

<Recipes titleText="Ví dụ về việc truyền các dependency reactive" titleId="examples-dependencies">

#### Truyền một mảng dependency {/*passing-a-dependency-array*/}

Nếu bạn chỉ định các dependency, Effect của bạn sẽ chạy **sau lần render ban đầu _và_ sau khi re-render với các dependency đã thay đổi.**

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // Runs again if a or b are different
```

Trong ví dụ bên dưới, `serverUrl` và `roomId` là [các giá trị reactive,](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) vì vậy cả hai phải được chỉ định làm dependency. Do đó, việc chọn một phòng khác trong dropdown hoặc chỉnh sửa input URL của server sẽ khiến chat kết nối lại. Tuy nhiên, vì `message` không được sử dụng trong Effect (và do đó nó không phải là một dependency), việc chỉnh sửa message sẽ không kết nối lại với chat.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Chào mừng đến phòng {roomId}!</h1>
      <label>
        Tin nhắn của bạn:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Chọn phòng chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Đóng chat' : 'Mở chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Một implementation thực tế sẽ thực sự kết nối đến server
  return {
    connect() {
      console.log('✅ Đang kết nối đến phòng "' + roomId + '" tại ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Đã ngắt kết nối khỏi phòng "' + roomId + '" tại ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Truyền một mảng dependency rỗng {/*passing-an-empty-dependency-array*/}

Nếu Effect của bạn thực sự không sử dụng bất kỳ giá trị reactive nào, nó sẽ chỉ chạy **sau lần render ban đầu.**

```js {3}
useEffect(() => {
  // ...
}, []); // Không chạy lại (ngoại trừ một lần trong quá trình phát triển)
```

**Ngay cả với các dependency rỗng, việc thiết lập và dọn dẹp sẽ [chạy thêm một lần trong quá trình phát triển](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) để giúp bạn tìm lỗi.**


Trong ví dụ này, cả `serverUrl` và `roomId` đều được hardcode. Vì chúng được khai báo bên ngoài component, chúng không phải là các giá trị reactive, và do đó chúng không phải là dependency. Danh sách dependency là rỗng, vì vậy Effect không chạy lại khi re-render.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>Chào mừng đến phòng {roomId}!</h1>
      <label>
        Tin nhắn của bạn:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Đóng chat' : 'Mở chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Một implementation thực tế sẽ thực sự kết nối đến server
  return {
    connect() {
      console.log('✅ Đang kết nối đến phòng "' + roomId + '" tại ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Đã ngắt kết nối khỏi phòng "' + roomId + '" tại ' + serverUrl);
    }
  };
}
```

</Sandpack>

<Solution />


#### Không truyền mảng dependency nào cả {/*passing-no-dependency-array-at-all*/}

Nếu bạn không truyền mảng dependency nào cả, Effect của bạn sẽ chạy **sau mỗi lần render (và re-render)** của component của bạn.

```js {3}
useEffect(() => {
  // ...
}); // Luôn chạy lại
```

Trong ví dụ này, Effect chạy lại khi bạn thay đổi `serverUrl` và `roomId`, điều này là hợp lý. Tuy nhiên, nó *cũng* chạy lại khi bạn thay đổi `message`, điều này có lẽ là không mong muốn. Đây là lý do tại sao bạn thường sẽ chỉ định mảng dependency.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // Không có mảng dependency nào cả

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Chào mừng đến phòng {roomId}!</h1>
      <label>
        Tin nhắn của bạn:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Chọn phòng chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Đóng chat' : 'Mở chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Một implementation thực tế sẽ thực sự kết nối đến server
  return {
    connect() {
      console.log('✅ Đang kết nối đến phòng "' + roomId + '" tại ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Đã ngắt kết nối khỏi phòng "' + roomId + '" tại ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Cập nhật state dựa trên state trước đó từ một Effect {/*updating-state-based-on-previous-state-from-an-effect*/}

Khi bạn muốn cập nhật state dựa trên state trước đó từ một Effect, bạn có thể gặp phải một vấn đề:

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // Bạn muốn tăng bộ đếm mỗi giây...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... nhưng việc chỉ định `count` làm dependency luôn reset interval.
  // ...
}
```

Vì `count` là một giá trị reactive, nó phải được chỉ định trong danh sách các dependency. Tuy nhiên, điều đó khiến Effect dọn dẹp và thiết lập lại mỗi khi `count` thay đổi. Điều này không lý tưởng.

Để khắc phục điều này, [truyền hàm cập nhật state `c => c + 1`](/reference/react/useState#updating-state-based-on-the-previous-state) cho `setCount`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Truyền một hàm cập nhật state
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Bây giờ count không phải là một dependency

  return <h1>{count}</h1>;
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Bây giờ bạn đang truyền `c => c + 1` thay vì `count + 1`, [Effect của bạn không còn cần phải phụ thuộc vào `count`.](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) Do kết quả của việc sửa lỗi này, nó sẽ không cần phải dọn dẹp và thiết lập lại interval mỗi khi `count` thay đổi.

---


### Loại bỏ các dependency object không cần thiết {/*removing-unnecessary-object-dependencies*/}

Nếu Effect của bạn phụ thuộc vào một đối tượng hoặc một hàm được tạo trong quá trình rendering, nó có thể chạy quá thường xuyên. Ví dụ: Effect này kết nối lại sau mỗi lần render vì đối tượng `options` [khác nhau cho mỗi lần render:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 Đối tượng này được tạo mới hoàn toàn sau mỗi lần re-render
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // Nó được sử dụng bên trong Effect
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 Kết quả là, các dependency này luôn khác nhau sau mỗi lần re-render
  // ...
```

Tránh sử dụng một đối tượng được tạo trong quá trình rendering làm dependency. Thay vào đó, hãy tạo đối tượng bên trong Effect:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Chào mừng đến phòng {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Chọn phòng chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Một implementation thực tế sẽ thực sự kết nối đến server
  return {
    connect() {
      console.log('✅ Đang kết nối đến phòng "' + roomId + '" tại ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Đã ngắt kết nối khỏi phòng "' + roomId + '" tại ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Bây giờ bạn tạo đối tượng `options` bên trong Effect, bản thân Effect chỉ phụ thuộc vào chuỗi `roomId`.

Với sửa đổi này, việc nhập vào input sẽ không kết nối lại chat. Không giống như một đối tượng được tạo lại, một chuỗi như `roomId` không thay đổi trừ khi bạn gán nó một giá trị khác. [Đọc thêm về loại bỏ dependency.](/learn/removing-effect-dependencies)

---
### Loại bỏ các dependency function không cần thiết {/*removing-unnecessary-function-dependencies*/}

Nếu Effect của bạn phụ thuộc vào một đối tượng hoặc một hàm được tạo trong quá trình render, nó có thể chạy quá thường xuyên. Ví dụ: Effect này kết nối lại sau mỗi lần render vì hàm `createOptions` [khác nhau sau mỗi lần render:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 Hàm này được tạo mới hoàn toàn sau mỗi lần re-render
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // Nó được sử dụng bên trong Effect
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 Kết quả là, các dependency này luôn khác nhau sau mỗi lần re-render
  // ...
```

Bản thân việc tạo một hàm mới hoàn toàn sau mỗi lần re-render không phải là một vấn đề. Bạn không cần phải tối ưu hóa điều đó. Tuy nhiên, nếu bạn sử dụng nó như một dependency của Effect, nó sẽ khiến Effect của bạn chạy lại sau mỗi lần re-render.

Tránh sử dụng một hàm được tạo trong quá trình render làm dependency. Thay vào đó, hãy khai báo nó bên trong Effect:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Chào mừng đến phòng {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Chọn phòng chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Một implementation thực tế sẽ thực sự kết nối đến server
  return {
    connect() {
      console.log('✅ Đang kết nối đến phòng "' + roomId + '" tại ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Đã ngắt kết nối khỏi phòng "' + roomId + '" tại ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Bây giờ bạn đã định nghĩa hàm `createOptions` bên trong Effect, bản thân Effect chỉ phụ thuộc vào chuỗi `roomId`. Với sửa đổi này, việc nhập vào input sẽ không kết nối lại chat. Không giống như một hàm được tạo lại, một chuỗi như `roomId` không thay đổi trừ khi bạn gán nó một giá trị khác. [Đọc thêm về loại bỏ dependency.](/learn/removing-effect-dependencies)

---

### Đọc các props và state mới nhất từ ​​Effect {/*reading-the-latest-props-and-state-from-an-effect*/}

<Wip>

Phần này mô tả một **API thử nghiệm chưa được phát hành** trong phiên bản ổn định của React.

</Wip>

Theo mặc định, khi bạn đọc một giá trị reactive từ Effect, bạn phải thêm nó làm dependency. Điều này đảm bảo rằng Effect của bạn "phản ứng" với mọi thay đổi của giá trị đó. Đối với hầu hết các dependency, đó là hành vi bạn muốn.

**Tuy nhiên, đôi khi bạn sẽ muốn đọc các props và state *mới nhất* từ ​​Effect mà không cần "phản ứng" với chúng.** Ví dụ: hãy tưởng tượng bạn muốn ghi lại số lượng các mặt hàng trong giỏ hàng cho mỗi lần truy cập trang:

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ Tất cả các dependency đã được khai báo
  // ...
}
```

**Điều gì sẽ xảy ra nếu bạn muốn ghi lại một lượt truy cập trang mới sau mỗi thay đổi `url`, nhưng *không phải* nếu chỉ `shoppingCart` thay đổi?** Bạn không thể loại trừ `shoppingCart` khỏi các dependency mà không phá vỡ [các quy tắc reactive.](#specifying-reactive-dependencies) Tuy nhiên, bạn có thể thể hiện rằng bạn *không muốn* một đoạn code "phản ứng" với các thay đổi mặc dù nó được gọi từ bên trong Effect. [Khai báo một *Effect Event*](/learn/separating-events-from-effects#declaring-an-effect-event) với Hook [`useEffectEvent`](/reference/react/experimental_useEffectEvent) và di chuyển code đọc `shoppingCart` vào bên trong nó:

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Tất cả các dependency đã được khai báo
  // ...
}
```

**Effect Events không reactive và phải luôn được bỏ qua khỏi các dependency của Effect của bạn.** Đây là điều cho phép bạn đặt code không reactive (nơi bạn có thể đọc giá trị mới nhất của một số props và state) bên trong chúng. Bằng cách đọc `shoppingCart` bên trong `onVisit`, bạn đảm bảo rằng `shoppingCart` sẽ không chạy lại Effect của bạn.

[Đọc thêm về cách Effect Events cho phép bạn tách code reactive và không reactive.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

---

### Hiển thị nội dung khác nhau trên server và client {/*displaying-different-content-on-the-server-and-the-client*/}

Nếu ứng dụng của bạn sử dụng server rendering (hoặc [trực tiếp](/reference/react-dom/server) hoặc thông qua một [framework](/learn/start-a-new-react-project#production-grade-react-frameworks)), component của bạn sẽ render trong hai môi trường khác nhau. Trên server, nó sẽ render để tạo ra HTML ban đầu. Trên client, React sẽ chạy lại code rendering để nó có thể đính kèm các trình xử lý sự kiện của bạn vào HTML đó. Đây là lý do tại sao, để [hydration](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) hoạt động, đầu ra render ban đầu của bạn phải giống hệt nhau trên client và server.

Trong một số trường hợp hiếm hoi, bạn có thể cần hiển thị nội dung khác nhau trên client. Ví dụ: nếu ứng dụng của bạn đọc một số dữ liệu từ [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), thì nó không thể thực hiện điều đó trên server. Đây là cách bạn có thể triển khai điều này:

```js
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... trả về JSX chỉ dành cho client ...
  }  else {
    // ... trả về JSX ban đầu ...
  }
}
```

Trong khi ứng dụng đang tải, người dùng sẽ thấy đầu ra render ban đầu. Sau đó, khi nó được tải và hydrate, Effect của bạn sẽ chạy và đặt `didMount` thành `true`, kích hoạt re-render. Điều này sẽ chuyển sang đầu ra render chỉ dành cho client. Các Effect không chạy trên server, vì vậy đây là lý do tại sao `didMount` là `false` trong quá trình server render ban đầu.

Sử dụng pattern này một cách tiết kiệm. Hãy nhớ rằng người dùng có kết nối chậm sẽ thấy nội dung ban đầu trong một khoảng thời gian khá dài - có khả năng là nhiều giây - vì vậy bạn không muốn thực hiện các thay đổi khó chịu đối với giao diện của component. Trong nhiều trường hợp, bạn có thể tránh sự cần thiết của điều này bằng cách hiển thị có điều kiện những thứ khác nhau bằng CSS.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Effect của tôi chạy hai lần khi component được mount {/*my-effect-runs-twice-when-the-component-mounts*/}

Khi Strict Mode được bật, trong quá trình phát triển, React sẽ chạy thiết lập và dọn dẹp thêm một lần trước khi thiết lập thực tế.

Đây là một bài kiểm tra áp lực để xác minh logic Effect của bạn được triển khai chính xác. Nếu điều này gây ra các vấn đề có thể nhìn thấy, thì hàm dọn dẹp của bạn đang thiếu một số logic. Hàm dọn dẹp sẽ dừng hoặc hoàn tác bất cứ điều gì mà hàm thiết lập đã làm. Nguyên tắc chung là người dùng không thể phân biệt giữa việc thiết lập được gọi một lần (như trong production) và một chuỗi thiết lập → dọn dẹp → thiết lập (như trong quá trình phát triển).

Đọc thêm về [cách điều này giúp tìm lỗi](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) và [cách sửa logic của bạn.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### Effect của tôi chạy sau mỗi lần re-render {/*my-effect-runs-after-every-re-render*/}

Đầu tiên, hãy kiểm tra xem bạn có quên chỉ định mảng dependency hay không:

```js {3}
useEffect(() => {
  // ...
}); // 🚩 Không có mảng dependency: chạy lại sau mỗi lần render!
```

Nếu bạn đã chỉ định mảng dependency nhưng Effect của bạn vẫn chạy lại trong một vòng lặp, thì đó là vì một trong các dependency của bạn khác nhau sau mỗi lần re-render.

Bạn có thể gỡ lỗi vấn đề này bằng cách ghi thủ công các dependency của bạn vào console:

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

Sau đó, bạn có thể nhấp chuột phải vào các mảng từ các re-render khác nhau trong console và chọn "Store as a global variable" cho cả hai. Giả sử cái đầu tiên được lưu dưới dạng `temp1` và cái thứ hai được lưu dưới dạng `temp2`, sau đó bạn có thể sử dụng console của trình duyệt để kiểm tra xem mỗi dependency trong cả hai mảng có giống nhau hay không:

```js
Object.is(temp1[0], temp2[0]); // Dependency đầu tiên có giống nhau giữa các mảng không?
Object.is(temp1[1], temp2[1]); // Dependency thứ hai có giống nhau giữa các mảng không?
Object.is(temp1[2], temp2[2]); // ... và cứ thế cho mọi dependency ...
```

Khi bạn tìm thấy dependency khác nhau sau mỗi lần re-render, bạn thường có thể sửa nó theo một trong những cách sau:

- [Cập nhật state dựa trên state trước đó từ Effect](#updating-state-based-on-previous-state-from-an-effect)
- [Loại bỏ các dependency object không cần thiết](#removing-unnecessary-object-dependencies)
- [Loại bỏ các dependency function không cần thiết](#removing-unnecessary-function-dependencies)
- [Đọc các props và state mới nhất từ ​​Effect](#reading-the-latest-props-and-state-from-an-effect)

Phương sách cuối cùng (nếu các phương pháp này không giúp ích), hãy bọc việc tạo nó bằng [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) hoặc [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often) (cho các function).

---

### Effect của tôi tiếp tục chạy lại trong một vòng lặp vô hạn {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

Nếu Effect của bạn chạy trong một vòng lặp vô hạn, thì hai điều này phải đúng:

- Effect của bạn đang cập nhật một số state.
- State đó dẫn đến re-render, khiến các dependency của Effect thay đổi.

Trước khi bạn bắt đầu sửa vấn đề, hãy tự hỏi Effect của bạn có kết nối với một số hệ thống bên ngoài (như DOM, mạng, một widget của bên thứ ba, v.v.) hay không. Tại sao Effect của bạn cần đặt state? Nó có đồng bộ hóa với hệ thống bên ngoài đó không? Hay bạn đang cố gắng quản lý luồng dữ liệu của ứng dụng của mình bằng nó?

Nếu không có hệ thống bên ngoài, hãy xem xét liệu [loại bỏ Effect hoàn toàn](/learn/you-might-not-need-an-effect) có đơn giản hóa logic của bạn hay không.

Nếu bạn thực sự đang đồng bộ hóa với một số hệ thống bên ngoài, hãy suy nghĩ về lý do và trong điều kiện nào Effect của bạn sẽ cập nhật state. Có điều gì đó đã thay đổi ảnh hưởng đến đầu ra hình ảnh của component của bạn không? Nếu bạn cần theo dõi một số dữ liệu không được sử dụng bởi rendering, thì [ref](/reference/react/useRef#referencing-a-value-with-a-ref) (không kích hoạt re-render) có thể phù hợp hơn. Xác minh Effect của bạn không cập nhật state (và kích hoạt re-render) nhiều hơn mức cần thiết.

Cuối cùng, nếu Effect của bạn đang cập nhật state vào đúng thời điểm, nhưng vẫn còn một vòng lặp, thì đó là vì bản cập nhật state đó dẫn đến một trong các dependency của Effect thay đổi. [Đọc cách gỡ lỗi các thay đổi dependency.](/reference/react/useEffect#my-effect-runs-after-every-re-render)

---

### Logic dọn dẹp của tôi chạy ngay cả khi component của tôi không unmount {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

Hàm dọn dẹp chạy không chỉ trong quá trình unmount, mà trước mỗi lần re-render với các dependency đã thay đổi. Ngoài ra, trong quá trình phát triển, React [chạy thiết lập + dọn dẹp thêm một lần ngay sau khi component được mount.](#my-effect-runs-twice-when-the-component-mounts)

Nếu bạn có code dọn dẹp mà không có code thiết lập tương ứng, thì đó thường là một dấu hiệu xấu:

```js {2-5}
useEffect(() => {
  // 🔴 Tránh: Logic dọn dẹp mà không có logic thiết lập tương ứng
  return () => {
    doSomething();
  };
}, []);
```

Logic dọn dẹp của bạn phải "đối xứng" với logic thiết lập và phải dừng hoặc hoàn tác bất cứ điều gì mà thiết lập đã làm:

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[Tìm hiểu cách vòng đời Effect khác với vòng đời của component.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)

---

### Effect của tôi làm điều gì đó trực quan và tôi thấy một nhấp nháy trước khi nó chạy {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

Nếu Effect của bạn phải chặn trình duyệt [vẽ màn hình,](/learn/render-and-commit#epilogue-browser-paint) hãy thay thế `useEffect` bằng [`useLayoutEffect`](/reference/react/useLayoutEffect). Lưu ý rằng **điều này không cần thiết cho phần lớn các Effect.** Bạn sẽ chỉ cần điều này nếu điều quan trọng là phải chạy Effect của bạn trước khi trình duyệt vẽ: ví dụ: để đo và định vị một tooltip trước khi người dùng nhìn thấy nó.
