---
title: 'Tách biệt sự kiện và Effect'
---

<Intro>

Event handler chỉ chạy lại khi bạn thực hiện lại cùng một tương tác. Khác với event handler, Effect sẽ đồng bộ lại nếu một giá trị mà nó đọc, như một prop hoặc một biến state, khác với giá trị ở lần render trước. Đôi khi, bạn cũng muốn kết hợp cả hai hành vi: một Effect chạy lại khi một số giá trị thay đổi nhưng không phải tất cả. Trang này sẽ hướng dẫn bạn cách làm điều đó.

</Intro>

<YouWillLearn>

- Cách lựa chọn giữa event handler và Effect
- Vì sao Effect là reactive, còn event handler thì không
- Làm gì khi bạn muốn một phần code trong Effect không bị reactive
- Effect Event là gì, và cách tách chúng ra khỏi Effect
- Cách đọc giá trị props và state mới nhất từ Effect bằng Effect Event

</YouWillLearn>

## Lựa chọn giữa event handler và Effect {/*choosing-between-event-handlers-and-effects*/}

Trước tiên, hãy cùng ôn lại sự khác biệt giữa event handler và Effect.

Hãy tưởng tượng bạn đang triển khai một component phòng chat. Yêu cầu của bạn như sau:

1. Component của bạn nên tự động kết nối tới phòng chat được chọn.
1. Khi bạn nhấn nút "Send", nó sẽ gửi tin nhắn tới phòng chat.

Giả sử bạn đã triển khai code cho chúng, nhưng bạn không chắc nên đặt ở đâu. Bạn nên dùng event handler hay Effect? Mỗi khi cần trả lời câu hỏi này, hãy cân nhắc [*vì sao* đoạn code đó cần chạy.](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)

### Event handler chạy để phản hồi các tương tác cụ thể {/*event-handlers-run-in-response-to-specific-interactions*/}

Từ góc nhìn của người dùng, việc gửi tin nhắn chỉ nên xảy ra *bởi vì* nút "Send" cụ thể đã được nhấn. Người dùng sẽ rất khó chịu nếu bạn gửi tin nhắn của họ vào bất kỳ thời điểm nào khác hoặc vì lý do nào khác. Đó là lý do gửi tin nhắn nên là một event handler. Event handler cho phép bạn xử lý các tương tác cụ thể:

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}
```

Với event handler, bạn có thể chắc chắn rằng `sendMessage(message)` sẽ *chỉ* chạy nếu người dùng nhấn nút.

### Effect chạy bất cứ khi nào cần đồng bộ hóa {/*effects-run-whenever-synchronization-is-needed*/}

Hãy nhớ rằng bạn cũng cần giữ cho component luôn kết nối với phòng chat. Đoạn code đó nên đặt ở đâu?

*Lý do* để chạy đoạn code này không phải là một tương tác cụ thể nào. Không quan trọng vì sao hoặc bằng cách nào người dùng điều hướng tới màn hình phòng chat. Khi họ đang xem nó và có thể tương tác, component cần giữ kết nối với server chat đã chọn. Ngay cả khi component phòng chat là màn hình đầu tiên của ứng dụng, và người dùng chưa thực hiện bất kỳ tương tác nào, bạn *vẫn* cần kết nối. Đó là lý do nó nên là một Effect:

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Với đoạn code này, bạn có thể chắc chắn rằng luôn có một kết nối hoạt động tới server chat hiện tại, *bất kể* người dùng đã thực hiện những tương tác nào. Dù người dùng chỉ vừa mở app, chọn phòng khác, hay điều hướng sang màn hình khác rồi quay lại, Effect của bạn đảm bảo component sẽ *luôn đồng bộ* với phòng hiện tại, và sẽ [kết nối lại khi cần thiết.](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
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
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

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
input, select { margin-right: 20px; }
```

</Sandpack>

## Giá trị reactive và logic reactive {/*reactive-values-and-reactive-logic*/}

Một cách trực quan, bạn có thể nói rằng event handler luôn được kích hoạt "thủ công", ví dụ như khi nhấn một nút. Ngược lại, Effect là "tự động": chúng sẽ chạy và chạy lại khi cần để giữ cho mọi thứ đồng bộ.

Có một cách chính xác hơn để suy nghĩ về điều này.

Props, state, và các biến được khai báo bên trong thân component của bạn được gọi là <CodeStep step={2}>giá trị reactive</CodeStep>. Trong ví dụ này, `serverUrl` không phải là giá trị reactive, nhưng `roomId` và `message` thì có. Chúng tham gia vào luồng dữ liệu khi render:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Những giá trị reactive như vậy có thể thay đổi do một lần render lại. Ví dụ, người dùng có thể chỉnh sửa `message` hoặc chọn một `roomId` khác trong dropdown. Event handler và Effect phản hồi sự thay đổi này theo cách khác nhau:

- **Logic bên trong event handler *không phải là reactive.*** Nó sẽ không chạy lại trừ khi người dùng thực hiện lại cùng một tương tác (ví dụ: click). Event handler có thể đọc giá trị reactive mà không "phản ứng" với sự thay đổi của chúng.
- **Logic bên trong Effect *là reactive.*** Nếu Effect của bạn đọc một giá trị reactive, [bạn phải khai báo nó là dependency.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Khi một lần render lại làm giá trị đó thay đổi, React sẽ chạy lại logic của Effect với giá trị mới.

Hãy xem lại ví dụ trước để minh họa sự khác biệt này.

### Logic bên trong event handler không phải là reactive {/*logic-inside-event-handlers-is-not-reactive*/}

Xem dòng code này. Logic này có nên là reactive không?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

Từ góc nhìn của người dùng, **việc thay đổi `message` _không_ có nghĩa là họ muốn gửi tin nhắn.** Nó chỉ có nghĩa là người dùng đang gõ. Nói cách khác, logic gửi tin nhắn không nên là reactive. Nó không nên chạy lại chỉ vì <CodeStep step={2}>giá trị reactive</CodeStep> đã thay đổi. Đó là lý do nó thuộc về event handler:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

Event handler không phải là reactive, nên `sendMessage(message)` chỉ chạy khi người dùng nhấn nút Send.

### Logic bên trong Effect là reactive {/*logic-inside-effects-is-reactive*/}

Bây giờ hãy quay lại các dòng này:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

Từ góc nhìn của người dùng, **việc thay đổi `roomId` *có nghĩa* là họ muốn kết nối tới phòng khác.** Nói cách khác, logic kết nối tới phòng nên là reactive. Bạn *muốn* các dòng code này "theo sát" <CodeStep step={2}>giá trị reactive</CodeStep>, và chạy lại nếu giá trị đó thay đổi. Đó là lý do nó nên nằm trong một Effect:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Effect là reactive, nên `createConnection(serverUrl, roomId)` và `connection.connect()` sẽ chạy cho mỗi giá trị khác nhau của `roomId`. Effect của bạn giữ cho kết nối chat luôn đồng bộ với phòng hiện tại.

## Tách logic không reactive ra khỏi Effect {/*extracting-non-reactive-logic-out-of-effects*/}

Mọi thứ trở nên phức tạp hơn khi bạn muốn kết hợp logic reactive với logic không reactive.

Ví dụ, hãy tưởng tượng bạn muốn hiển thị thông báo khi người dùng kết nối tới chat. Bạn đọc theme hiện tại (tối hoặc sáng) từ props để có thể hiển thị thông báo với màu đúng:

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
```

Tuy nhiên, `theme` là một giá trị reactive (nó có thể thay đổi do render lại), và [mọi giá trị reactive được đọc bởi Effect phải được khai báo làm dependency.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Bây giờ bạn phải khai báo `theme` là dependency của Effect:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ All dependencies declared
  // ...
```

Thử với ví dụ này và xem bạn có thể phát hiện vấn đề với trải nghiệm người dùng này không:

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

Khi `roomId` thay đổi, chat sẽ kết nối lại như bạn mong đợi. Nhưng vì `theme` cũng là một dependency, chat *cũng* kết nối lại mỗi khi bạn chuyển giữa theme tối và sáng. Điều đó không tốt!

Nói cách khác, bạn *không* muốn dòng này là reactive, mặc dù nó nằm trong một Effect (vốn là reactive):

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

Bạn cần một cách để tách logic không reactive này ra khỏi Effect reactive xung quanh nó.

### Khai báo Effect Event {/*declaring-an-effect-event*/}

<Wip>

Phần này mô tả một **API thử nghiệm chưa được phát hành** trong phiên bản ổn định của React.

</Wip>

Sử dụng một Hook đặc biệt gọi là [`useEffectEvent`](/reference/react/experimental_useEffectEvent) để tách logic không reactive này ra khỏi Effect:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

Ở đây, `onConnected` được gọi là *Effect Event*. Nó là một phần của logic Effect, nhưng nó hoạt động giống như một event handler hơn. Logic bên trong nó không phải là reactive, và nó luôn "thấy" giá trị mới nhất của props và state.

Bây giờ bạn có thể gọi Effect Event `onConnected` từ bên trong Effect:

```js {2-4,9,13}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Điều này giải quyết vấn đề. Lưu ý rằng bạn phải *xóa* `theme` khỏi danh sách dependency của Effect, vì nó không còn được sử dụng trong Effect nữa. Bạn cũng không cần *thêm* `onConnected` vào đó, vì **Effect Event không phải là reactive và phải được bỏ qua khỏi dependency.**

Xác minh rằng hành vi mới hoạt động như bạn mong đợi:

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

Bạn có thể nghĩ về Effect Event như rất giống với event handler. Sự khác biệt chính là event handler chạy để phản hồi tương tác của người dùng, trong khi Effect Event được kích hoạt bởi bạn từ Effect. Effect Event cho phép bạn "phá vỡ chuỗi" giữa tính reactive của Effect và code không nên là reactive.

### Đọc props và state mới nhất bằng Effect Event {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

Phần này mô tả một **API thử nghiệm chưa được phát hành** trong phiên bản ổn định của React.

</Wip>

Effect Event cho phép bạn sửa nhiều pattern mà bạn có thể muốn bỏ qua dependency linter.

Ví dụ, giả sử bạn có một Effect để ghi lại lượt truy cập trang:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

Sau đó, bạn thêm nhiều route vào trang web. Bây giờ component `Page` nhận một prop `url` với đường dẫn hiện tại. Bạn muốn truyền `url` như một phần của lời gọi `logVisit`, nhưng dependency linter phàn nàn:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

Hãy suy nghĩ về những gì bạn muốn code làm. Bạn *muốn* ghi nhật ký một lần truy cập riêng biệt cho các URL khác nhau vì mỗi URL đại diện cho một trang khác nhau. Nói cách khác, lời gọi `logVisit` này *nên* là reactive đối với `url`. Đó là lý do trong trường hợp này, việc tuân theo dependency linter và thêm `url` làm dependency là hợp lý:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

Bây giờ giả sử bạn muốn bao gồm số lượng mặt hàng trong giỏ hàng cùng với mỗi lần truy cập trang:

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect has a missing dependency: 'numberOfItems'
  // ...
}
```

Bạn đã sử dụng `numberOfItems` bên trong Effect, nên linter yêu cầu bạn thêm nó làm dependency. Tuy nhiên, bạn *không* muốn lời gọi `logVisit` là reactive đối với `numberOfItems`. Nếu người dùng đưa thứ gì đó vào giỏ hàng và `numberOfItems` thay đổi, điều này *không có nghĩa* là người dùng đã truy cập trang lại. Nói cách khác, *việc truy cập trang* theo một nghĩa nào đó là một "sự kiện". Nó xảy ra tại một thời điểm chính xác.

Chia code thành hai phần:

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

Ở đây, `onVisit` là một Effect Event. Code bên trong nó không phải là reactive. Đó là lý do bạn có thể sử dụng `numberOfItems` (hoặc bất kỳ giá trị reactive nào khác!) mà không lo lắng rằng nó sẽ khiến code xung quanh chạy lại khi có thay đổi.

Mặt khác, bản thân Effect vẫn là reactive. Code bên trong Effect sử dụng prop `url`, nên Effect sẽ chạy lại sau mỗi lần render lại với `url` khác nhau. Điều này, đến lượt nó, sẽ gọi Effect Event `onVisit`.

Kết quả là, bạn sẽ gọi `logVisit` cho mỗi thay đổi của `url`, và luôn đọc `numberOfItems` mới nhất. Tuy nhiên, nếu `numberOfItems` thay đổi một mình, điều này sẽ không khiến bất kỳ code nào chạy lại.

<Note>

Bạn có thể thắc mắc liệu có thể gọi `onVisit()` không có tham số và đọc `url` bên trong nó không:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

Điều này sẽ hoạt động, nhưng tốt hơn là truyền `url` này cho Effect Event một cách rõ ràng. **Bằng cách truyền `url` làm tham số cho Effect Event, bạn đang nói rằng việc truy cập một trang với `url` khác nhau tạo thành một "sự kiện" riêng biệt từ góc nhìn của người dùng.** `visitedUrl` là một *phần* của "sự kiện" đã xảy ra:

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Vì Effect Event của bạn rõ ràng "yêu cầu" `visitedUrl`, bây giờ bạn không thể vô tình xóa `url` khỏi dependency của Effect. Nếu bạn xóa dependency `url` (khiến các lần truy cập trang khác nhau được tính là một), linter sẽ cảnh báo bạn về điều đó. Bạn muốn `onVisit` là reactive đối với `url`, nên thay vì đọc `url` bên trong (nơi nó sẽ không reactive), bạn truyền nó *từ* Effect của mình.

Điều này trở nên đặc biệt quan trọng nếu có logic bất đồng bộ bên trong Effect:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Delay logging visits
  }, [url]);
```

Ở đây, `url` bên trong `onVisit` tương ứng với `url` *mới nhất* (có thể đã thay đổi), nhưng `visitedUrl` tương ứng với `url` ban đầu đã khiến Effect này (và lời gọi `onVisit` này) chạy.

</Note>

<DeepDive>

#### Có được phép bỏ qua dependency linter thay thế không? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

Trong các codebase hiện có, đôi khi bạn có thể thấy quy tắc lint bị bỏ qua như thế này:

```js {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Avoid suppressing the linter like this:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

Sau khi `useEffectEvent` trở thành một phần ổn định của React, chúng tôi khuyến nghị **không bao giờ bỏ qua linter**.

Nhược điểm đầu tiên của việc bỏ qua quy tắc là React sẽ không còn cảnh báo bạn khi Effect của bạn cần "phản ứng" với một dependency reactive mới mà bạn đã thêm vào code. Trong ví dụ trước, bạn đã thêm `url` vào dependency *bởi vì* React nhắc nhở bạn làm điều đó. Bạn sẽ không còn nhận được những lời nhắc nhở như vậy cho bất kỳ chỉnh sửa nào trong tương lai của Effect đó nếu bạn vô hiệu hóa linter. Điều này dẫn đến bugs.

Đây là một ví dụ về một bug khó hiểu do việc bỏ qua linter. Trong ví dụ này, function `handleMove` được cho là sẽ đọc giá trị biến state `canMove` hiện tại để quyết định xem dấu chấm có nên theo con trỏ hay không. Tuy nhiên, `canMove` luôn là `true` bên trong `handleMove`.

Bạn có thể thấy tại sao không?

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>


Vấn đề với code này nằm ở việc bỏ qua dependency linter. Nếu bạn xóa comment bỏ qua, bạn sẽ thấy rằng Effect này nên phụ thuộc vào function `handleMove`. Điều này hợp lý: `handleMove` được khai báo bên trong thân component, điều này khiến nó trở thành một giá trị reactive. Mọi giá trị reactive phải được khai báo làm dependency, hoặc nó có thể trở nên cũ theo thời gian!

Tác giả của code gốc đã "nói dối" React bằng cách nói rằng Effect không phụ thuộc (`[]`) vào bất kỳ giá trị reactive nào. Đó là lý do tại sao React không đồng bộ lại Effect sau khi `canMove` thay đổi (và `handleMove` cùng với nó). Bởi vì React không đồng bộ lại Effect, `handleMove` được gắn làm listener là function `handleMove` được tạo trong lần render đầu tiên. Trong lần render đầu tiên, `canMove` là `true`, đó là lý do tại sao `handleMove` từ lần render đầu tiên sẽ mãi mãi thấy giá trị đó.

**Nếu bạn không bao giờ bỏ qua linter, bạn sẽ không bao giờ gặp vấn đề với giá trị cũ.**

Với `useEffectEvent`, không cần "nói dối" linter, và code hoạt động như bạn mong đợi:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Điều này không có nghĩa là `useEffectEvent` *luôn* là giải pháp đúng. Bạn chỉ nên áp dụng nó cho những dòng code mà bạn không muốn là reactive. Trong sandbox ở trên, bạn không muốn code của Effect là reactive đối với `canMove`. Đó là lý do việc tách ra một Effect Event có ý nghĩa.

Đọc [Removing Effect Dependencies](/learn/removing-effect-dependencies) để biết các lựa chọn khác đúng đắn thay cho việc bỏ qua linter.

</DeepDive>

### Giới hạn của Effect Event {/*limitations-of-effect-events*/}

<Wip>

Phần này mô tả một **API thử nghiệm chưa được phát hành** trong phiên bản ổn định của React.

</Wip>

Effect Event rất hạn chế trong cách bạn có thể sử dụng chúng:

- **Chỉ gọi chúng từ bên trong Effect.**
- **Không bao giờ truyền chúng cho component hoặc Hook khác.**

Ví dụ, đừng khai báo và truyền Effect Event như thế này:

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Avoid: Passing Effect Events

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Need to specify "callback" in dependencies
}
```

Thay vào đó, luôn khai báo Effect Event trực tiếp bên cạnh Effect sử dụng chúng:

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Good: Only called locally inside an Effect
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // No need to specify "onTick" (an Effect Event) as a dependency
}
```

Effect Event là những "mảnh" không reactive của code Effect. Chúng nên được đặt gần Effect sử dụng chúng.

<Recap>

- Event handler chạy để phản hồi các tương tác cụ thể.
- Effect chạy bất cứ khi nào cần đồng bộ hóa.
- Logic bên trong event handler không phải là reactive.
- Logic bên trong Effect là reactive.
- Bạn có thể chuyển logic không reactive từ Effect vào Effect Event.
- Chỉ gọi Effect Event từ bên trong Effect.
- Không truyền Effect Event cho component hoặc Hook khác.

</Recap>

<Challenges>

#### Sửa biến không cập nhật {/*fix-a-variable-that-doesnt-update*/}

Component `Timer` này giữ một biến state `count` tăng lên mỗi giây. Giá trị mà nó tăng lên được lưu trong biến state `increment`. Bạn có thể điều khiển biến `increment` bằng các nút cộng và trừ.

Tuy nhiên, dù bạn nhấn nút cộng bao nhiêu lần, bộ đếm vẫn chỉ tăng lên một mỗi giây. Có gì sai với code này? Vì sao `increment` luôn bằng `1` bên trong code Effect? Tìm lỗi và sửa nó.

<Hint>

Để sửa code này, chỉ cần tuân theo các quy tắc.

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Như thường lệ, khi bạn tìm kiếm bugs trong Effect, hãy bắt đầu bằng cách tím kiếm những chỗ bỏ qua linter.

Nếu bạn xóa comment bỏ qua, React sẽ cho bạn biết rằng code của Effect này phụ thuộc vào `increment`, nhưng bạn đã "nói dối" React bằng cách khẳng định rằng Effect này không phụ thuộc vào bất kỳ giá trị reactive nào (`[]`). Thêm `increment` vào mảng dependency:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Bây giờ, khi `increment` thay đổi, React sẽ đồng bộ lại Effect của bạn, điều này sẽ khởi động lại interval.

</Solution>

#### Sửa bộ đếm bị đóng băng {/*fix-a-freezing-counter*/}

Component `Timer` này giữ một biến state `count` tăng lên mỗi giây. Giá trị mà nó tăng lên được lưu trong biến state `increment`, bạn có thể điều khiển nó bằng các nút cộng và trừ. Ví dụ, hãy thử nhấn nút cộng chín lần và để ý rằng `count` giờ đây tăng mỗi giây là mười thay vì một.

Có một vấn đề nhỏ với giao diện người dùng này. Bạn có thể để ý rằng nếu bạn liên tục nhấn nút cộng hoặc trừ nhanh hơn một lần mỗi giây, bản thân timer dường như bị tạm dừng. Nó chỉ tiếp tục sau khi một giây trôi qua kể từ lần cuối bạn nhấn một trong hai nút. Tìm hiểu tại sao điều này xảy ra và sửa vấn đề để timer tick trên *mỗi* giây không bị gián đoạn.

<Hint>

Có vẻ như Effect thiết lập timer "phản ứng" với giá trị `increment`. Dòng sử dụng giá trị `increment` hiện tại để gọi `setCount` có thực sự cần là reactive không?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Vấn đề là code bên trong Effect sử dụng biến state `increment`. Vì nó là dependency của Effect, mỗi thay đổi đối với `increment` khiến Effect đồng bộ lại, điều này khiến interval bị xóa. Nếu bạn liên tục xóa interval mỗi lần trước khi nó có cơ hội kích hoạt, nó sẽ xuất hiện như thể timer đã bị dừng.

Để giải quyết vấn đề, hãy tách một Effect Event `onTick` ra khỏi Effect:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

Vì `onTick` là một Effect Event, code bên trong nó không phải là reactive. Thay đổi đối với `increment` không kích hoạt bất kỳ Effect nào.

</Solution>

#### Sửa delay không thể điều chỉnh {/*fix-a-non-adjustable-delay*/}

Trong ví dụ này, bạn có thể tùy chỉnh delay của interval. Nó được lưu trong biến state `delay` được cập nhật bởi hai nút. Tuy nhiên, ngay cả khi bạn nhấn nút "plus 100 ms" cho đến khi `delay` là 1000 milliseconds (tức là một giây), bạn sẽ để ý rằng timer vẫn tăng rất nhanh (mỗi 100 ms). Như thể những thay đổi của bạn đối với `delay` bị bỏ qua. Tìm và sửa bug.

<Hint>

Code bên trong Effect Event không phải là reactive. Có trường hợp nào mà bạn *muốn* lời gọi `setInterval` chạy lại không?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Vấn đề với ví dụ trên là nó đã tách một Effect Event gọi là `onMount` mà không xem xét code thực sự nên làm gì. Bạn chỉ nên tách Effect Event vì một lý do cụ thể: khi bạn muốn làm cho một phần code không reactive. Tuy nhiên, lời gọi `setInterval` *nên* là reactive đối với biến state `delay`. Nếu `delay` thay đổi, bạn muốn thiết lập interval từ đầu! Để sửa code này, kéo tất cả code reactive trở lại bên trong Effect:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Nói chung, bạn nên nghi ngờ các function như `onMount` tập trung vào *thời điểm* thay vì *mục đích* của một đoạn code. Lúc đầu nó có thể cảm thấy "mô tả hơn" nhưng nó che khuất ý định của bạn. Theo quy tắc chung, Effect Event nên tương ứng với điều gì đó xảy ra từ góc nhìn của *người dùng*. Ví dụ, `onMessage`, `onTick`, `onVisit`, hoặc `onConnected` là những tên Effect Event tốt. Code bên trong chúng có thể sẽ không cần là reactive. Mặt khác, `onMount`, `onUpdate`, `onUnmount`, hoặc `onAfterRender` quá chung chung đến mức dễ vô tình đặt code *nên* là reactive vào trong chúng. Đó là lý do bạn nên đặt tên Effect Event theo *điều người dùng nghĩ đã xảy ra*, không phải khi nào code được chạy.

</Solution>

#### Sửa thông báo bị trì hoãn {/*fix-a-delayed-notification*/}

Khi bạn tham gia một phòng chat, component này hiển thị thông báo. Tuy nhiên, nó không hiển thị thông báo ngay lập tức. Thay vào đó, thông báo được trì hoãn nhân tạo hai giây để người dùng có cơ hội nhìn xung quanh UI.

Điều này gần như hoạt động, nhưng có một bug. Hãy thử đổi dropdown từ "general" sang "travel" rồi sang "music" rất nhanh. Nếu bạn làm đủ nhanh, bạn sẽ thấy hai thông báo (như mong đợi!) nhưng chúng sẽ *đều* nói "Welcome to music".

Sửa nó để khi bạn chuyển từ "general" sang "travel" rồi sang "music" rất nhanh, bạn thấy hai thông báo, cái đầu tiên là "Welcome to travel" và cái thứ hai là "Welcome to music". (Để thử thách thêm, giả sử bạn *đã* làm cho các thông báo hiển thị đúng phòng, hãy thay đổi code để chỉ thông báo sau cùng được hiển thị.)

<Hint>

Effect của bạn biết phòng nào nó kết nối. Có thông tin nào bạn có thể muốn truyền cho Effect Event không?

</Hint>

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
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
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

<Solution>

Bên trong Effect Event, `roomId` là giá trị *tại thời điểm Effect Event được gọi.*

Effect Event của bạn được gọi với delay hai giây. Nếu bạn nhanh chóng chuyển từ phòng travel sang phòng music, vào thời điểm thông báo của phòng travel hiển thị, `roomId` đã là `"music"`. Đó là lý do tại sao cả hai thông báo đều nói "Welcome to music".

Để sửa vấn đề, thay vì đọc `roomId` *mới nhất* bên trong Effect Event, hãy làm nó thành tham số của Effect Event, như `connectedRoomId` bên dưới. Sau đó truyền `roomId` từ Effect bằng cách gọi `onConnected(roomId)`:

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
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
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

Effect có `roomId` được set thành `"travel"` (vì vậy nó kết nối với phòng `"travel"`) sẽ hiển thị thông báo cho `"travel"`. Effect có `roomId` được set thành `"music"` (vì vậy nó kết nối với phòng `"music"`) sẽ hiển thị thông báo cho `"music"`. Nói cách khác, `connectedRoomId` đến từ Effect của bạn (vốn là reactive), trong khi `theme` luôn sử dụng giá trị mới nhất.

Để giải quyết thử thách bổ sung, lưu ID timeout của thông báo và xóa nó trong cleanup function của Effect:

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
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
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

Điều này đảm bảo rằng các thông báo đã được lên lịch (nhưng chưa được hiển thị) sẽ bị hủy khi bạn đổi phòng.

</Solution>

</Challenges>
