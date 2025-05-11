---
title: Lối Thoát Hiểm
---

<Intro>

Một số component của bạn có thể cần điều khiển và đồng bộ hóa với các hệ thống bên ngoài React. Ví dụ: bạn có thể cần tập trung vào một input bằng API của trình duyệt, phát và tạm dừng trình phát video được triển khai mà không cần React hoặc kết nối và lắng nghe tin nhắn từ một máy chủ từ xa. Trong chương này, bạn sẽ tìm hiểu các lối thoát hiểm cho phép bạn "bước ra ngoài" React và kết nối với các hệ thống bên ngoài. Hầu hết logic ứng dụng và luồng dữ liệu của bạn không nên dựa vào các tính năng này.

</Intro>

<YouWillLearn isChapter={true}>

* [Cách "ghi nhớ" thông tin mà không cần render lại](/learn/referencing-values-with-refs)
* [Cách truy cập các phần tử DOM được quản lý bởi React](/learn/manipulating-the-dom-with-refs)
* [Cách đồng bộ hóa các component với các hệ thống bên ngoài](/learn/synchronizing-with-effects)
* [Cách loại bỏ các Effect không cần thiết khỏi component của bạn](/learn/you-might-not-need-an-effect)
* [Vòng đời của một Effect khác với vòng đời của một component như thế nào](/learn/lifecycle-of-reactive-effects)
* [Cách ngăn một số giá trị kích hoạt lại Effect](/learn/separating-events-from-effects)
* [Cách làm cho Effect của bạn chạy lại ít thường xuyên hơn](/learn/removing-effect-dependencies)
* [Cách chia sẻ logic giữa các component](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## Tham chiếu các giá trị bằng ref {/*referencing-values-with-refs*/}

Khi bạn muốn một component "ghi nhớ" một số thông tin, nhưng bạn không muốn thông tin đó [kích hoạt các lần render mới](/learn/render-and-commit), bạn có thể sử dụng *ref*:

```js
const ref = useRef(0);
```

Giống như state, ref được React giữ lại giữa các lần re-render. Tuy nhiên, việc đặt state sẽ re-render một component. Thay đổi một ref thì không! Bạn có thể truy cập giá trị hiện tại của ref đó thông qua thuộc tính `ref.current`.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('Bạn đã nhấp ' + ref.current + ' lần!');
  }

  return (
    <button onClick={handleClick}>
      Nhấp vào tôi!
    </button>
  );
}
```

</Sandpack>

Một ref giống như một túi bí mật của component mà React không theo dõi. Ví dụ: bạn có thể sử dụng ref để lưu trữ [ID timeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [các phần tử DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element) và các đối tượng khác không ảnh hưởng đến đầu ra render của component.

<LearnMore path="/learn/referencing-values-with-refs">

Đọc **[Tham chiếu các giá trị bằng Ref](/learn/referencing-values-with-refs)** để tìm hiểu cách sử dụng ref để ghi nhớ thông tin.

</LearnMore>

## Thao tác với DOM bằng ref {/*manipulating-the-dom-with-refs*/}

React tự động cập nhật DOM để khớp với đầu ra render của bạn, vì vậy các component của bạn sẽ không thường xuyên cần thao tác với nó. Tuy nhiên, đôi khi bạn có thể cần truy cập vào các phần tử DOM được quản lý bởi React—ví dụ: để tập trung một node, cuộn đến nó hoặc đo kích thước và vị trí của nó. Không có cách tích hợp sẵn để thực hiện những việc đó trong React, vì vậy bạn sẽ cần một ref đến DOM node. Ví dụ: nhấp vào nút sẽ tập trung vào input bằng một ref:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Tập trung vào input
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

Đọc **[Thao tác với DOM bằng Ref](/learn/manipulating-the-dom-with-refs)** để tìm hiểu cách truy cập các phần tử DOM được quản lý bởi React.

</LearnMore>

## Đồng bộ hóa với Effect {/*synchronizing-with-effects*/}

Một số component cần đồng bộ hóa với các hệ thống bên ngoài. Ví dụ: bạn có thể muốn điều khiển một component không phải React dựa trên state của React, thiết lập kết nối máy chủ hoặc gửi nhật ký phân tích khi một component xuất hiện trên màn hình. Không giống như các trình xử lý sự kiện, cho phép bạn xử lý các sự kiện cụ thể, *Effect* cho phép bạn chạy một số code sau khi render. Sử dụng chúng để đồng bộ hóa component của bạn với một hệ thống bên ngoài React.

Nhấn Play/Pause một vài lần và xem cách trình phát video vẫn được đồng bộ hóa với giá trị prop `isPlaying`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Tạm dừng' : 'Phát'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Nhiều Effect cũng "dọn dẹp" sau khi chúng chạy. Ví dụ: một Effect thiết lập kết nối với máy chủ trò chuyện sẽ trả về một *hàm dọn dẹp* cho React biết cách ngắt kết nối component của bạn khỏi máy chủ đó:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Chào mừng đến với phòng chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // Một triển khai thực tế sẽ thực sự kết nối với máy chủ
  return {
    connect() {
      console.log('✅ Đang kết nối...');
    },
    disconnect() {
      console.log('❌ Đã ngắt kết nối.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

Trong quá trình phát triển, React sẽ ngay lập tức chạy và dọn dẹp Effect của bạn thêm một lần nữa. Đây là lý do tại sao bạn thấy `"✅ Đang kết nối..."` được in hai lần. Điều này đảm bảo rằng bạn không quên triển khai hàm dọn dẹp.

<LearnMore path="/learn/synchronizing-with-effects">

Đọc **[Đồng bộ hóa với Effect](/learn/synchronizing-with-effects)** để tìm hiểu cách đồng bộ hóa các component với các hệ thống bên ngoài.

</LearnMore>

## Bạn có thể không cần Effect {/*you-might-not-need-an-effect*/}

Effect là một lối thoát hiểm khỏi mô hình React. Chúng cho phép bạn "bước ra ngoài" React và đồng bộ hóa các component của bạn với một số hệ thống bên ngoài. Nếu không có hệ thống bên ngoài nào liên quan (ví dụ: nếu bạn muốn cập nhật state của một component khi một số prop hoặc state thay đổi), bạn sẽ không cần Effect. Việc loại bỏ các Effect không cần thiết sẽ giúp code của bạn dễ theo dõi hơn, chạy nhanh hơn và ít bị lỗi hơn.

Có hai trường hợp phổ biến mà bạn không cần Effect:
- **Bạn không cần Effect để chuyển đổi dữ liệu để render.**
- **Bạn không cần Effect để xử lý các sự kiện của người dùng.**

Ví dụ: bạn không cần Effect để điều chỉnh một số state dựa trên state khác:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Tránh: state dư thừa và Effect không cần thiết
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Thay vào đó, hãy tính toán càng nhiều càng tốt trong khi render:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Tốt: được tính toán trong khi render
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

Tuy nhiên, bạn *cần* Effect để đồng bộ hóa với các hệ thống bên ngoài.

<LearnMore path="/learn/you-might-not-need-an-effect">

Đọc **[Bạn có thể không cần Effect](/learn/you-might-not-need-an-effect)** để tìm hiểu cách loại bỏ các Effect không cần thiết.

</LearnMore>

## Vòng đời của các effect phản ứng {/*lifecycle-of-reactive-effects*/}

Effect có vòng đời khác với component. Component có thể mount, update hoặc unmount. Một Effect chỉ có thể làm hai việc: bắt đầu đồng bộ hóa một cái gì đó và sau đó dừng đồng bộ hóa nó. Chu kỳ này có thể xảy ra nhiều lần nếu Effect của bạn phụ thuộc vào các prop và state thay đổi theo thời gian.

Effect này phụ thuộc vào giá trị của prop `roomId`. Prop là *các giá trị phản ứng*, có nghĩa là chúng có thể thay đổi khi re-render. Lưu ý rằng Effect *tái đồng bộ hóa* (và kết nối lại với máy chủ) nếu `roomId` thay đổi:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Chào mừng đến với phòng {roomId}!</h1>;
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
export function createConnection(serverUrl, roomId) {
  // Một triển khai thực tế sẽ thực sự kết nối với máy chủ
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

React cung cấp một quy tắc linter để kiểm tra xem bạn đã chỉ định các dependency của Effect một cách chính xác hay chưa. Nếu bạn quên chỉ định `roomId` trong danh sách các dependency trong ví dụ trên, linter sẽ tự động tìm thấy lỗi đó.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

Đọc **[Vòng đời của các sự kiện phản ứng](/learn/lifecycle-of-reactive-effects)** để tìm hiểu vòng đời của một Effect khác với vòng đời của một component như thế nào.

</LearnMore>

## Tách các sự kiện khỏi Effect {/*separating-events-from-effects*/}

<Wip>

Phần này mô tả một **API thử nghiệm chưa được phát hành** trong phiên bản ổn định của React.

</Wip>

Trình xử lý sự kiện chỉ chạy lại khi bạn thực hiện lại cùng một tương tác. Không giống như trình xử lý sự kiện, Effect tái đồng bộ hóa nếu bất kỳ giá trị nào chúng đọc, như prop hoặc state, khác với lần render cuối cùng. Đôi khi, bạn muốn kết hợp cả hai hành vi: một Effect chạy lại để đáp ứng với một số giá trị nhưng không phải các giá trị khác.

Tất cả code bên trong Effect đều *phản ứng*. Nó sẽ chạy lại nếu một số giá trị phản ứng mà nó đọc đã thay đổi do re-render. Ví dụ: Effect này sẽ kết nối lại với chat nếu `roomId` hoặc `theme` đã thay đổi:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Đã kết nối!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Chào mừng đến với phòng {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Sử dụng giao diện tối
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Một triển khai thực tế sẽ thực sự kết nối với máy chủ
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Không thể thêm trình xử lý hai lần.');
      }
      if (event !== 'connected') {
        throw Error('Chỉ hỗ trợ sự kiện "connected".');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Điều này không lý tưởng. Bạn chỉ muốn kết nối lại với chat nếu `roomId` đã thay đổi. Việc chuyển đổi `theme` không nên kết nối lại với chat! Di chuyển code đọc `theme` ra khỏi Effect của bạn vào một *Effect Event*:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Đã kết nối!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Chào mừng đến với phòng {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Sử dụng giao diện tối
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Một triển khai thực tế sẽ thực sự kết nối với máy chủ
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Không thể thêm trình xử lý hai lần.');
      }
      if (event !== 'connected') {
        throw Error('Chỉ hỗ trợ sự kiện "connected".');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Code bên trong Effect Event không phản ứng, vì vậy việc thay đổi `theme` không còn khiến Effect của bạn kết nối lại.

<LearnMore path="/learn/separating-events-from-effects">

Đọc **[Tách các sự kiện khỏi Effect](/learn/separating-events-from-effects)** để tìm hiểu cách ngăn một số giá trị kích hoạt lại Effect.

</LearnMore>

## Loại bỏ các dependency của Effect {/*removing-effect-dependencies*/}

Khi bạn viết một Effect, linter sẽ xác minh rằng bạn đã bao gồm mọi giá trị phản ứng (như prop và state) mà Effect đọc trong danh sách các dependency của Effect. Điều này đảm bảo rằng Effect của bạn vẫn được đồng bộ hóa với các prop và state mới nhất của component của bạn. Các dependency không cần thiết có thể khiến Effect của bạn chạy quá thường xuyên hoặc thậm chí tạo ra một vòng lặp vô hạn. Cách bạn loại bỏ chúng phụ thuộc vào trường hợp.

Ví dụ: Effect này phụ thuộc vào đối tượng `options` được tạo lại mỗi khi bạn chỉnh sửa input:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Chào mừng đến với phòng {roomId}!</h1>
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
  // Một triển khai thực tế sẽ thực sự kết nối với máy chủ
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

Bạn không muốn chat kết nối lại mỗi khi bạn bắt đầu nhập tin nhắn vào chat đó. Để khắc phục sự cố này, hãy di chuyển việc tạo đối tượng `options` vào bên trong Effect để Effect chỉ phụ thuộc vào chuỗi `roomId`:

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
      <h1>Chào mừng đến với phòng {roomId}!</h1>
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
  // Một triển khai thực tế sẽ thực sự kết nối với máy chủ
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

Lưu ý rằng bạn không bắt đầu bằng cách chỉnh sửa danh sách dependency để loại bỏ dependency `options`. Điều đó sẽ là sai. Thay vào đó, bạn đã thay đổi code xung quanh để dependency trở nên *không cần thiết*. Hãy nghĩ về danh sách dependency như một danh sách tất cả các giá trị phản ứng được sử dụng bởi code Effect của bạn. Bạn không cố ý chọn những gì để đưa vào danh sách đó. Danh sách mô tả code của bạn. Để thay đổi danh sách dependency, hãy thay đổi code.

<LearnMore path="/learn/removing-effect-dependencies">

Đọc **[Loại bỏ các dependency của Effect](/learn/removing-effect-dependencies)** để tìm hiểu cách làm cho Effect của bạn chạy lại ít thường xuyên hơn.

</LearnMore>

## Sử dụng lại logic với Hook tùy chỉnh {/*reusing-logic-with-custom-hooks*/}

React đi kèm với các Hook tích hợp sẵn như `useState`, `useContext` và `useEffect`. Đôi khi, bạn sẽ ước có một Hook cho một mục đích cụ thể hơn: ví dụ: để tìm nạp dữ liệu, để theo dõi xem người dùng có trực tuyến hay không hoặc để kết nối với phòng chat. Để thực hiện việc này, bạn có thể tạo Hook của riêng mình cho nhu cầu của ứng dụng.

Trong ví dụ này, Hook tùy chỉnh `usePointerPosition` theo dõi vị trí con trỏ, trong khi Hook tùy chỉnh `useDelayedValue` trả về một giá trị "chậm hơn" giá trị bạn đã truyền một số mili giây nhất định. Di chuyển con trỏ qua khu vực xem trước của sandbox để xem một vệt chấm chuyển động theo con trỏ:

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
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

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

Bạn có thể tạo Hook tùy chỉnh, kết hợp chúng với nhau, truyền dữ liệu giữa chúng và sử dụng lại chúng giữa các component. Khi ứng dụng của bạn phát triển, bạn sẽ viết ít Effect thủ công hơn vì bạn sẽ có thể sử dụng lại các Hook tùy chỉnh mà bạn đã viết. Ngoài ra còn có nhiều Hook tùy chỉnh tuyệt vời được duy trì bởi cộng đồng React.

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

Đọc **[Sử dụng lại logic với Hook tùy chỉnh](/learn/reusing-logic-with-custom-hooks)** để tìm hiểu cách chia sẻ logic giữa các component.

</LearnMore>

## Tiếp theo là gì? {/*whats-next*/}

Hãy chuyển đến [Tham chiếu các giá trị bằng Ref](/learn/referencing-values-with-refs) để bắt đầu đọc trang này theo từng trang!
