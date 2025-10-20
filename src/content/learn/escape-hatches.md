---
title: Lối Thoát (Escape Hatches)
---

<Intro>

Một số component của bạn có thể cần kiểm soát và đồng bộ hóa với các hệ thống bên ngoài React. Ví dụ, bạn có thể cần focus một input bằng browser API, phát và tạm dừng một video player được triển khai không sử dụng React, hoặc kết nối và lắng nghe tin nhắn từ một server từ xa. Trong chương này, bạn sẽ học các lối thoát (escape hatches) cho phép bạn "bước ra ngoài" React và kết nối với các hệ thống bên ngoài. Phần lớn logic ứng dụng và data flow của bạn không nên dựa vào những tính năng này.

</Intro>

<YouWillLearn isChapter={true}>

* [Cách "nhớ" thông tin mà không cần re-render](/learn/referencing-values-with-refs)
* [Cách truy cập các DOM element được quản lý bởi React](/learn/manipulating-the-dom-with-refs)
* [Cách đồng bộ hóa component với các hệ thống bên ngoài](/learn/synchronizing-with-effects)
* [Cách loại bỏ những Effect không cần thiết khỏi component của bạn](/learn/you-might-not-need-an-effect)
* [Cách lifecycle của Effect khác với lifecycle của một component](/learn/lifecycle-of-reactive-effects)
* [Cách ngăn một số giá trị khỏi việc re-trigger Effect](/learn/separating-events-from-effects)
* [Cách làm cho Effect của bạn re-run ít thường xuyên hơn](/learn/removing-effect-dependencies)
* [Cách chia sẻ logic giữa các component](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## Nhớ giá trị với refs {/*referencing-values-with-refs*/}

Khi bạn muốn một component "nhớ" một số thông tin, nhưng bạn không muốn thông tin đó [trigger render mới](/learn/render-and-commit), bạn có thể sử dụng một *ref*:

```js
const ref = useRef(0);
```

Giống như state, refs được React giữ lại giữa các lần re-render. Tuy nhiên, việc thiết lập state sẽ re-render một component. Thay đổi một ref thì không! Bạn có thể truy cập giá trị hiện tại của ref đó thông qua thuộc tính `ref.current`.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

Một ref giống như một ngăn bí mật của component mà React không theo dõi. Ví dụ, bạn có thể sử dụng refs để lưu trữ [timeout IDs](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [DOM elements](https://developer.mozilla.org/en-US/docs/Web/API/Element), và các object khác không ảnh hưởng đến kết quả render của component.

<LearnMore path="/learn/referencing-values-with-refs">

Đọc **[Nhớ giá trị với Refs](/learn/referencing-values-with-refs)** để học cách sử dụng refs để nhớ thông tin.

</LearnMore>

## Thao tác DOM với refs {/*manipulating-the-dom-with-refs*/}

React tự động cập nhật DOM để phù hợp với kết quả render của bạn, vì vậy component của bạn thường sẽ không cần thao tác với DOM. Tuy nhiên, thỉnh thoảng bạn có thể cần truy cập vào các DOM element được quản lý bởi React—ví dụ, để focus một node, scroll tới nó, hoặc đo kích thước và vị trí của nó. Không có cách built-in nào để làm những việc đó trong React, vì vậy bạn sẽ cần một ref tới DOM node. Ví dụ, nhấp vào button sẽ focus input bằng cách sử dụng một ref:

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
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

Đọc **[Thao tác DOM với Refs](/learn/manipulating-the-dom-with-refs)** để học cách truy cập các DOM element được quản lý bởi React.

</LearnMore>

## Đồng bộ hóa với Effects {/*synchronizing-with-effects*/}

Một số component cần đồng bộ hóa với các hệ thống bên ngoài. Ví dụ, bạn có thể muốn kiểm soát một component không phải React dựa trên React state, thiết lập kết nối server, hoặc gửi analytics log khi một component xuất hiện trên màn hình. Không giống như event handlers, cho phép bạn xử lý các sự kiện cụ thể, *Effects* cho phép bạn chạy một số code sau khi render. Sử dụng chúng để đồng bộ hóa component của bạn với một hệ thống bên ngoài React.

Nhấn Play/Pause một vài lần và xem video player làm thế nào để đồng bộ với giá trị prop `isPlaying`:

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
        {isPlaying ? 'Pause' : 'Play'}
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

Nhiều Effect cũng "dọn dẹp" sau chính chúng. Ví dụ, một Effect thiết lập kết nối tới chat server nên trả về một *cleanup function* để báo cho React biết cách ngắt kết nối component của bạn khỏi server đó:

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
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

Trong môi trường development, React sẽ ngay lập tức chạy và dọn dẹp Effect của bạn thêm một lần nữa. Đó là lý do tại sao bạn thấy `"✅ Connecting..."` được in ra hai lần. Điều này đảm bảo rằng bạn không quên triển khai cleanup function.

<LearnMore path="/learn/synchronizing-with-effects">

Đọc **[Đồng bộ hóa với Effects](/learn/synchronizing-with-effects)** để học cách đồng bộ hóa component với các hệ thống bên ngoài.

</LearnMore>

## Có thể bạn không cần một Effect {/*you-might-not-need-an-effect*/}

Effects là một lối thoát khỏi React paradigm. Chúng cho phép bạn "bước ra ngoài" React và đồng bộ hóa component của bạn với một số hệ thống bên ngoài. Nếu không có hệ thống bên ngoài nào liên quan (ví dụ, nếu bạn muốn cập nhật state của một component khi một số props hoặc state thay đổi), bạn không nên cần một Effect. Loại bỏ những Effect không cần thiết sẽ làm cho code của bạn dễ theo dõi hơn, chạy nhanh hơn, và ít dễ gây lỗi hơn.

Có hai trường hợp phổ biến mà bạn không cần Effects:
- **Bạn không cần Effects để transform data cho việc render.**
- **Bạn không cần Effects để xử lý user events.**

Ví dụ, bạn không cần một Effect để điều chỉnh một số state dựa trên state khác:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Thay vào đó, hãy tính toán nhiều nhất có thể trong khi render:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

Tuy nhiên, bạn *vẫn* cần Effects để đồng bộ hóa với các hệ thống bên ngoài.

<LearnMore path="/learn/you-might-not-need-an-effect">

Đọc **[Có thể bạn không cần một Effect](/learn/you-might-not-need-an-effect)** để học cách loại bỏ những Effect không cần thiết.

</LearnMore>

## Lifecycle của reactive effects {/*lifecycle-of-reactive-effects*/}

Effects có một lifecycle khác với component. Component có thể mount, update, hoặc unmount. Một Effect chỉ có thể làm hai việc: bắt đầu đồng bộ hóa cái gì đó, và sau đó ngừng đồng bộ hóa nó. Chu kỳ này có thể xảy ra nhiều lần nếu Effect của bạn phụ thuộc vào props và state thay đổi theo thời gian.

Effect này phụ thuộc vào giá trị của prop `roomId`. Props là *reactive values,* có nghĩa là chúng có thể thay đổi khi re-render. Lưu ý rằng Effect *re-synchronizes* (và kết nối lại với server) nếu `roomId` thay đổi:

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

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
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
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

React cung cấp một linter rule để kiểm tra rằng bạn đã chỉ định dependencies của Effect một cách chính xác. Nếu bạn quên chỉ định `roomId` trong danh sách dependencies trong ví dụ trên, linter sẽ tự động tìm ra bug đó.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

Đọc **[Lifecycle của Reactive Effects](/learn/lifecycle-of-reactive-effects)** để học cách lifecycle của một Effect khác với lifecycle của một component.

</LearnMore>

## Tách biệt events khỏi Effects {/*separating-events-from-effects*/}

<Wip>

Phần này mô tả một **experimental API chưa được phát hành** trong phiên bản ổn định của React.

</Wip>

Event handlers chỉ re-run khi bạn thực hiện lại cùng một tương tác. Không giống như event handlers, Effects re-synchronize nếu bất kỳ giá trị nào mà chúng đọc, như props hoặc state, khác so với lần render cuối cùng. Thỉnh thoảng, bạn muốn một sự kết hợp của cả hai hành vi: một Effect re-run để phản hồi với một số giá trị nhưng không phải với những giá trị khác.

Tất cả code bên trong Effects đều *reactive.* Nó sẽ chạy lại nếu một số reactive value mà nó đọc đã thay đổi do re-render. Ví dụ, Effect này sẽ kết nối lại với chat nếu `roomId` hoặc `theme` đã thay đổi:

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
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
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
        Use dark theme
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
  // A real implementation would actually connect to the server
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
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
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

Điều này không lý tưởng. Bạn muốn kết nối lại với chat chỉ khi `roomId` đã thay đổi. Việc chuyển đổi `theme` không nên kết nối lại với chat! Di chuyển code đọc `theme` ra khỏi Effect của bạn vào một *Effect Event*:

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
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
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
        Use dark theme
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
  // A real implementation would actually connect to the server
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
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
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

Code bên trong Effect Events không reactive, vì vậy việc thay đổi `theme` không còn làm cho Effect của bạn kết nối lại.

<LearnMore path="/learn/separating-events-from-effects">

Đọc **[Tách biệt Events khỏi Effects](/learn/separating-events-from-effects)** để học cách ngăn một số giá trị khỏi việc re-trigger Effects.

</LearnMore>

## Loại bỏ Effect dependencies {/*removing-effect-dependencies*/}

Khi bạn viết một Effect, linter sẽ xác minh rằng bạn đã bao gồm mọi reactive value (như props và state) mà Effect đọc trong danh sách dependencies của Effect. Điều này đảm bảo rằng Effect của bạn vẫn đồng bộ với props và state mới nhất của component. Dependencies không cần thiết có thể khiến Effect của bạn chạy quá thường xuyên, hoặc thậm chí tạo ra vòng lặp vô hạn. Cách bạn loại bỏ chúng phụ thuộc vào trường hợp.

Ví dụ, Effect này phụ thuộc vào object `options` được tạo lại mỗi khi bạn chỉnh sửa input:

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
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
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
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Bạn không muốn chat kết nối lại mỗi khi bạn bắt đầu gõ tin nhắn trong chat đó. Để khắc phục vấn đề này, hãy di chuyển việc tạo object `options` vào bên trong Effect để Effect chỉ phụ thuộc vào chuỗi `roomId`:

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
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
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
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Lưu ý rằng bạn không bắt đầu bằng việc chỉnh sửa danh sách dependency để loại bỏ dependency `options`. Điều đó sẽ là sai. Thay vào đó, bạn đã thay đổi code xung quanh để dependency trở nên *không cần thiết.* Hãy nghĩ về danh sách dependency như một danh sách tất cả các reactive values được sử dụng bởi code Effect của bạn. Bạn không cố ý chọn những gì để đưa vào danh sách đó. Danh sách mô tả code của bạn. Để thay đổi danh sách dependency, hãy thay đổi code.

<LearnMore path="/learn/removing-effect-dependencies">

Đọc **[Loại bỏ Effect Dependencies](/learn/removing-effect-dependencies)** để học cách làm cho Effect của bạn re-run ít thường xuyên hơn.

</LearnMore>

## Tái sử dụng logic với custom Hooks {/*reusing-logic-with-custom-hooks*/}

React đi kèm với các built-in Hooks như `useState`, `useContext`, và `useEffect`. Thỉnh thoảng, bạn sẽ mong muốn có một Hook cho một số mục đích cụ thể hơn: ví dụ, để fetch data, để theo dõi xem user có online không, hoặc để kết nối tới một chat room. Để làm điều này, bạn có thể tạo các Hook của riêng mình cho nhu cầu của ứng dụng.

Trong ví dụ này, custom Hook `usePointerPosition` theo dõi vị trí con trỏ chuột, trong khi custom Hook `useDelayedValue` trả về một giá trị "chậm trễ" so với giá trị bạn truyền vào một số milliseconds. Di chuyển con trỏ chuột qua vùng preview sandbox để thấy một dãy các chấm di chuyển theo con trỏ chuột:

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

Bạn có thể tạo custom Hooks, kết hợp chúng với nhau, truyền data giữa chúng, và tái sử dụng chúng giữa các component. Khi ứng dụng của bạn phát triển, bạn sẽ viết ít Effects bằng tay hơn vì bạn sẽ có thể tái sử dụng custom Hooks mà bạn đã viết. Cũng có nhiều custom Hooks xuất sắc được duy trì bởi cộng đồng React.

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

Đọc **[Tái sử dụng Logic với Custom Hooks](/learn/reusing-logic-with-custom-hooks)** để học cách chia sẻ logic giữa các component.

</LearnMore>

## Tiếp theo là gì? {/*whats-next*/}

Hãy chuyển đến [Nhớ giá trị với Refs](/learn/referencing-values-with-refs) để bắt đầu đọc chương này từng trang một!
