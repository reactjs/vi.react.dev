---
title: 'Tái Sử Dụng Logic với Custom Hooks'
---

<Intro>

React đi kèm với một số Hook tích hợp sẵn như `useState`, `useContext`, và `useEffect`. Đôi khi, bạn sẽ muốn có một Hook cho một mục đích cụ thể hơn: ví dụ, để lấy dữ liệu, để theo dõi xem người dùng có trực tuyến hay không, hoặc để kết nối với một phòng chat. Bạn có thể không tìm thấy những Hook này trong React, nhưng bạn có thể tạo ra Hook riêng của mình cho nhu cầu ứng dụng của bạn.

</Intro>

<YouWillLearn>

- Custom Hook là gì, và cách viết Hook của riêng bạn
- Cách tái sử dụng logic giữa các component
- Cách đặt tên và cấu trúc custom Hook của bạn
- Khi nào và tại sao nên trích xuất custom Hook

</YouWillLearn>

## Custom Hook: Chia sẻ logic giữa các component {/*custom-hooks-sharing-logic-between-components*/}

Hãy tưởng tượng bạn đang phát triển một ứng dụng phụ thuộc rất nhiều vào mạng (như hầu hết các ứng dụng). Bạn muốn cảnh báo người dùng nếu kết nối mạng của họ bị mất khi họ đang sử dụng ứng dụng của bạn. Bạn sẽ làm như thế nào? Có vẻ như bạn sẽ cần hai thứ trong component của mình:

1. Một phần state theo dõi xem mạng có đang trực tuyến hay không.
2. Một Effect đăng ký các sự kiện global [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) và [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event), và cập nhật state đó.

Điều này sẽ giữ cho component của bạn [đồng bộ](/learn/synchronizing-with-effects) với trạng thái mạng. Bạn có thể bắt đầu với một cái gì đó như thế này:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

</Sandpack>

Hãy thử bật và tắt mạng của bạn, và chú ý cách `StatusBar` này cập nhật để phản hồi các hành động của bạn.

Bây giờ hãy tưởng tượng bạn *cũng* muốn sử dụng cùng logic này trong một component khác. Bạn muốn triển khai một nút Save sẽ bị vô hiệu hóa và hiển thị "Reconnecting..." thay vì "Save" khi mạng bị ngắt.

Để bắt đầu, bạn có thể sao chép và dán state `isOnline` và Effect vào `SaveButton`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

</Sandpack>

Hãy xác minh rằng, nếu bạn tắt mạng, nút sẽ thay đổi hình thức của nó.

Hai component này hoạt động tốt, nhưng việc trùng lặp logic giữa chúng là không mong muốn. Có vẻ như mặc dù chúng có *diện mạo trực quan* khác nhau, bạn muốn tái sử dụng logic giữa chúng.

### Trích xuất custom Hook của riêng bạn từ một component {/*extracting-your-own-custom-hook-from-a-component*/}

Hãy tưởng tượng một lúc rằng, tương tự như [`useState`](/reference/react/useState) và [`useEffect`](/reference/react/useEffect), có một Hook tích hợp sẵn `useOnlineStatus`. Khi đó cả hai component này có thể được đơn giản hóa và bạn có thể loại bỏ sự trùng lặp giữa chúng:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

Mặc dù không có Hook tích hợp sẵn như vậy, bạn có thể tự viết nó. Khai báo một function có tên `useOnlineStatus` và di chuyển tất cả code trùng lặp vào đó từ các component bạn đã viết trước đó:

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

Ở cuối function, return `isOnline`. Điều này cho phép các component của bạn đọc giá trị đó:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Hãy xác minh rằng việc bật và tắt mạng sẽ cập nhật cả hai component.

Bây giờ các component của bạn không có quá nhiều logic lặp lại. **Quan trọng hơn, code bên trong chúng mô tả *những gì chúng muốn làm* (sử dụng trạng thái online!) thay vì *cách thực hiện* (bằng cách đăng ký các sự kiện trình duyệt).**

Khi bạn trích xuất logic vào custom Hook, bạn có thể ẩn những chi tiết phức tạp về cách bạn xử lý một số hệ thống bên ngoài hoặc API trình duyệt. Code của các component bạn thể hiện ý định của bạn, không phải cách triển khai.

### Tên Hook luôn bắt đầu bằng `use` {/*hook-names-always-start-with-use*/}

Các ứng dụng React được xây dựng từ các component. Các component được xây dựng từ các Hook, dù là tích hợp sẵn hay tùy chỉnh. Bạn có thể thường xuyên sử dụng custom Hook do người khác tạo ra, nhưng đôi khi bạn cũng có thể tự viết một cái!

Bạn phải tuân theo những quy ước đặt tên sau:

1. **Tên component React phải bắt đầu bằng chữ cái in hoa,** như `StatusBar` và `SaveButton`. Các component React cũng cần return một cái gì đó mà React biết cách hiển thị, như một phần JSX.
2. **Tên Hook phải bắt đầu bằng `use` theo sau bởi một chữ cái in hoa,** như [`useState`](/reference/react/useState) (tích hợp sẵn) hoặc `useOnlineStatus` (tùy chỉnh, như ở đầu trang). Hook có thể return bất kỳ giá trị nào.

Quy ước này đảm bảo rằng bạn luôn có thể nhìn vào một component và biết state, Effect và các tính năng React khác có thể "ẩn" ở đâu. Ví dụ, nếu bạn thấy một lời gọi function `getColor()` bên trong component của bạn, bạn có thể chắc chắn rằng nó không thể chứa React state bên trong vì tên của nó không bắt đầu bằng `use`. Tuy nhiên, một lời gọi function như `useOnlineStatus()` rất có thể sẽ chứa các lời gọi đến Hook khác bên trong!

<Note>

Nếu linter của bạn được [cấu hình cho React,](/learn/editor-setup#linting) nó sẽ thực thi quy ước đặt tên này. Cuộn lên sandbox ở trên và đổi tên `useOnlineStatus` thành `getOnlineStatus`. Lưu ý rằng linter sẽ không cho phép bạn gọi `useState` hoặc `useEffect` bên trong nó nữa. Chỉ có Hook và component mới có thể gọi Hook khác!

</Note>

<DeepDive>

#### Có phải tất cả các function được gọi trong quá trình render phải bắt đầu bằng tiền tố use không? {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

Không. Các function không *gọi* Hook thì không cần *phải là* Hook.

Nếu function của bạn không gọi bất kỳ Hook nào, hãy tránh tiền tố `use`. Thay vào đó, hãy viết nó như một function thông thường *không có* tiền tố `use`. Ví dụ, `useSorted` bên dưới không gọi Hook, vì vậy hãy gọi nó là `getSorted` thay thế:

```js
// 🔴 Tránh: Một Hook không sử dụng Hook
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Tốt: Một function thông thường không sử dụng Hook
function getSorted(items) {
  return items.slice().sort();
}
```

Điều này đảm bảo rằng code của bạn có thể gọi function thông thường này ở bất kỳ đâu, bao gồm cả các điều kiện:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ Không sao khi gọi getSorted() có điều kiện vì nó không phải là Hook
    displayedItems = getSorted(items);
  }
  // ...
}
```

Bạn nên đặt tiền tố `use` cho một function (và do đó biến nó thành Hook) nếu nó sử dụng ít nhất một Hook bên trong:

```js
// ✅ Tốt: Một Hook sử dụng Hook khác
function useAuth() {
  return useContext(Auth);
}
```

Về mặt kỹ thuật, điều này không được React thực thi. Về nguyên tắc, bạn có thể tạo một Hook không gọi Hook khác. Điều này thường gây nhầm lẫn và hạn chế nên tốt nhất là tránh pattern đó. Tuy nhiên, có thể có những trường hợp hiếm hoi khi nó hữu ích. Ví dụ, có thể function của bạn không sử dụng bất kỳ Hook nào ngay bây giờ, nhưng bạn dự định thêm một số lời gọi Hook vào nó trong tương lai. Khi đó việc đặt tên với tiền tố `use` là hợp lý:

```js {3-4}
// ✅ Tốt: Một Hook có thể sẽ sử dụng một số Hook khác sau này
function useAuth() {
  // TODO: Thay thế bằng dòng này khi authentication được triển khai:
  // return useContext(Auth);
  return TEST_USER;
}
```

Khi đó các component sẽ không thể gọi nó có điều kiện. Điều này sẽ trở nên quan trọng khi bạn thực sự thêm các lời gọi Hook bên trong. Nếu bạn không dự định sử dụng Hook bên trong nó (bây giờ hoặc sau này), đừng biến nó thành Hook.

</DeepDive>

### Custom Hook cho phép bạn chia sẻ logic stateful, không phải bản thân state {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

Trong ví dụ trước đó, khi bạn bật và tắt mạng, cả hai component đều cập nhật cùng lúc. Tuy nhiên, việc nghĩ rằng một biến state `isOnline` duy nhất được chia sẻ giữa chúng là sai. Hãy nhìn vào code này:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Nó hoạt động giống như trước khi bạn trích xuất sự trùng lặp:

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

Đây là hai biến state và Effect hoàn toàn độc lập! Chúng tình cờ có cùng giá trị cùng một lúc vì bạn đã đồng bộ chúng với cùng một giá trị bên ngoài (việc mạng có bật hay không).

Để minh họa điều này tốt hơn, chúng ta sẽ cần một ví dụ khác. Hãy xem xét component `Form` này:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Có một số logic lặp lại cho mỗi trường form:

1. Có một phần state (`firstName` và `lastName`).
1. Có một change handler (`handleFirstNameChange` và `handleLastNameChange`).
1. Có một phần JSX chỉ định thuộc tính `value` và `onChange` cho input đó.

Bạn có thể trích xuất logic lặp lại vào custom Hook `useFormInput` này:

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js src/useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Lưu ý rằng nó chỉ khai báo *một* biến state có tên `value`.

Tuy nhiên, component `Form` gọi `useFormInput` *hai lần:*

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

Đây là lý do tại sao nó hoạt động giống như khai báo hai biến state riêng biệt!

**Custom Hook cho phép bạn chia sẻ *logic stateful* nhưng không phải *bản thân state.* Mỗi lời gọi đến một Hook hoàn toàn độc lập với mọi lời gọi khác đến cùng Hook đó.** Đây là lý do tại sao hai sandbox ở trên hoàn toàn tương đương. Nếu bạn muốn, hãy cuộn lên trên và so sánh chúng. Hành vi trước và sau khi trích xuất custom Hook là giống hệt nhau.

Khi bạn cần chia sẻ bản thân state giữa nhiều component, hãy [lift it up và pass it down](/learn/sharing-state-between-components) thay thế.

## Truyền giá trị reactive giữa các Hook {/*passing-reactive-values-between-hooks*/}

Code bên trong custom Hook của bạn sẽ chạy lại trong mỗi lần re-render của component. Đây là lý do tại sao, giống như component, custom Hook [cần phải pure.](/learn/keeping-components-pure) Hãy nghĩ về code của custom Hook như một phần của body component của bạn!

Vì custom Hook re-render cùng với component của bạn, chúng luôn nhận được prop và state mới nhất. Để hiểu điều này có nghĩa là gì, hãy xem xét ví dụ phòng chat này. Thay đổi URL server hoặc phòng chat:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Khi bạn thay đổi `serverUrl` hoặc `roomId`, Effect ["phản ứng" với những thay đổi của bạn](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) và đồng bộ lại. Bạn có thể biết bằng các thông báo console rằng chat kết nối lại mỗi khi bạn thay đổi dependencies của Effect.

Bây giờ hãy di chuyển code của Effect vào một custom Hook:

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Điều này cho phép component `ChatRoom` của bạn gọi custom Hook mà không cần lo lắng về cách nó hoạt động bên trong:

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

Điều này trông đơn giản hơn nhiều! (Nhưng nó làm cùng một việc.)

Lưu ý rằng logic *vẫn phản ứng* với những thay đổi của prop và state. Hãy thử chỉnh sửa URL server hoặc phòng được chọn:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Lưu ý cách bạn đang lấy giá trị trả về của một Hook:

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

và truyền nó như một input cho Hook khác:

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Mỗi khi component `ChatRoom` của bạn re-render, nó truyền `roomId` và `serverUrl` mới nhất cho Hook của bạn. Đây là lý do tại sao Effect của bạn kết nối lại với chat bất cứ khi nào giá trị của chúng khác nhau sau khi re-render. (Nếu bạn đã từng làm việc với phần mềm xử lý âm thanh hoặc video, việc kết nối Hook như thế này có thể nhắc bạn đến việc kết nối các effect hình ảnh hoặc âm thanh. Nó giống như đầu ra của `useState` "cấp dữ liệu cho" đầu vào của `useChatRoom`.)

### Truyền event handler cho custom Hook {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

Phần này mô tả một **API thử nghiệm chưa được phát hành** trong phiên bản ổn định của React.

</Wip>

Khi bạn bắt đầu sử dụng `useChatRoom` trong nhiều component hơn, bạn có thể muốn để các component tùy chỉnh hành vi của nó. Ví dụ, hiện tại, logic về việc làm gì khi có tin nhắn đến được hardcode bên trong Hook:

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Giả sử bạn muốn chuyển logic này trở lại component của bạn:

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

Để làm việc này, hãy thay đổi custom Hook của bạn để nhận `onReceiveMessage` như một trong các option được đặt tên:

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ All dependencies declared
}
```

Điều này sẽ hoạt động, nhưng có thêm một cải tiến nữa bạn có thể thực hiện khi custom Hook của bạn chấp nhận event handler.

Thêm dependency vào `onReceiveMessage` không phải là lý tưởng vì nó sẽ khiến chat kết nối lại mỗi khi component re-render. [Bọc event handler này trong một Effect Event để loại bỏ nó khỏi dependencies:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
}
```

Bây giờ chat sẽ không kết nối lại mỗi khi component `ChatRoom` re-render. Đây là một demo hoàn chỉnh về việc truyền event handler cho custom Hook mà bạn có thể chơi với:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Lưu ý cách bạn không còn cần biết *cách* `useChatRoom` hoạt động để sử dụng nó. Bạn có thể thêm nó vào bất kỳ component nào khác, truyền bất kỳ option nào khác, và nó sẽ hoạt động cùng cách. Đó là sức mạnh của custom Hook.

## Khi nào nên sử dụng custom Hook {/*when-to-use-custom-hooks*/}

Bạn không cần trích xuất custom Hook cho từng bit code trùng lặp nhỏ. Một chút trùng lặp là ổn. Ví dụ, việc trích xuất Hook `useFormInput` để bọc một lời gọi `useState` duy nhất như trước đó có thể không cần thiết.

Tuy nhiên, bất cứ khi nào bạn viết một Effect, hãy cân nhắc xem việc bọc nó trong một custom Hook có rõ ràng hơn không. [Bạn không nên cần Effect quá thường xuyên,](/learn/you-might-not-need-an-effect) vì vậy nếu bạn đang viết một cái, điều đó có nghĩa là bạn cần "bước ra khỏi React" để đồng bộ với một số hệ thống bên ngoài hoặc để làm điều gì đó mà React không có API tích hợp sẵn. Bọc nó vào một custom Hook cho phép bạn truyền đạt chính xác ý định của mình và cách dữ liệu chảy qua nó.

Ví dụ, hãy xem xét component `ShippingForm` hiển thị hai dropdown: một hiển thị danh sách các thành phố, và một khác hiển thị danh sách các khu vực trong thành phố được chọn. Bạn có thể bắt đầu với một số code trông như thế này:

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // This Effect fetches cities for a country
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // This Effect fetches areas for the selected city
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

Mặc dù code này khá lặp lại, [việc giữ những Effect riêng biệt với nhau là đúng.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Chúng đồng bộ hai thứ khác nhau, vì vậy bạn không nên kết hợp chúng thành một Effect. Thay vào đó, bạn có thể đơn giản hóa component `ShippingForm` ở trên bằng cách trích xuất logic chung giữa chúng vào Hook `useData` của riêng bạn:

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

Bây giờ bạn có thể thay thế cả hai Effect trong component `ShippingForm` bằng các lời gọi đến `useData`:

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

Trích xuất custom Hook làm cho luồng dữ liệu rõ ràng. Bạn cung cấp `url` và bạn nhận được `data`. Bằng cách "ẩn" Effect của bạn bên trong `useData`, bạn cũng ngăn ai đó làm việc trên component `ShippingForm` thêm [dependencies không cần thiết](/learn/removing-effect-dependencies) vào nó. Theo thời gian, hầu hết Effect của ứng dụng sẽ nằm trong custom Hook.

<DeepDive>

#### Giữ custom Hook của bạn tập trung vào các use case cụ thể và cấp cao {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

Bắt đầu bằng cách chọn tên cho custom Hook của bạn. Nếu bạn gặp khó khăn trong việc chọn một tên rõ ràng, điều đó có thể có nghĩa là Effect của bạn quá gắn kết với phần còn lại của logic component, và chưa sẵn sàng để được trích xuất.

Lý tưởng nhất, tên custom Hook của bạn nên đủ rõ ràng để ngay cả một người không thường xuyên viết code cũng có thể đoán được custom Hook của bạn làm gì, nó nhận gì và trả về gì:

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

Khi bạn đồng bộ với một hệ thống bên ngoài, tên custom Hook của bạn có thể mang tính kỹ thuật hơn và sử dụng thuật ngữ chuyên biệt cho hệ thống đó. Điều này tốt miễn là nó rõ ràng đối với một người quen thuộc với hệ thống đó:

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**Giữ custom Hook tập trung vào các use case cụ thể và cấp cao.** Tránh tạo và sử dụng custom "lifecycle" Hook hoạt động như các lựa chọn thay thế và wrapper tiện lợi cho chính API `useEffect`:

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

Ví dụ, Hook `useMount` này cố gắng đảm bảo rằng một số code chỉ chạy "on mount":

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 Tránh: sử dụng custom "lifecycle" Hook
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 Tránh: tạo custom "lifecycle" Hook
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect có một dependency bị thiếu: 'fn'
}
```

**Custom "lifecycle" Hook như `useMount` không phù hợp tốt với paradigm React.** Ví dụ, ví dụ code này có một lỗi (nó không "phản ứng" với các thay đổi `roomId` hoặc `serverUrl`), nhưng linter sẽ không cảnh báo bạn về điều đó vì linter chỉ kiểm tra các lời gọi `useEffect` trực tiếp. Nó sẽ không biết về Hook của bạn.

Nếu bạn đang viết một Effect, hãy bắt đầu bằng cách sử dụng React API trực tiếp:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Tốt: hai Effect riêng biệt được phân tách theo mục đích

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

Sau đó, bạn có thể (nhưng không bắt buộc) trích xuất custom Hook cho các use case cấp cao khác nhau:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Tuyệt vời: custom Hook được đặt tên theo mục đích của chúng
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**Một custom Hook tốt làm cho code gọi nó trở nên khai báo hơn bằng cách hạn chế những gì nó làm.** Ví dụ, `useChatRoom(options)` chỉ có thể kết nối với phòng chat, trong khi `useImpressionLog(eventName, extraData)` chỉ có thể gửi impression log đến analytics. Nếu API custom Hook của bạn không hạn chế các use case và rất trừu tượng, về lâu dài nó có thể sẽ tạo ra nhiều vấn đề hơn là giải quyết.

</DeepDive>

### Custom Hook giúp bạn di chuyển sang các pattern tốt hơn {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Effect là một ["escape hatch"](/learn/escape-hatches): bạn sử dụng chúng khi bạn cần "bước ra khỏi React" và khi không có giải pháp tích hợp sẵn tốt hơn cho use case của bạn. Theo thời gian, mục tiêu của team React là giảm số lượng Effect trong ứng dụng của bạn xuống mức tối thiểu bằng cách cung cấp các giải pháp cụ thể hơn cho các vấn đề cụ thể hơn. Bọc Effect của bạn trong custom Hook giúp việc nâng cấp code của bạn dễ dàng hơn khi các giải pháp này trở nên khả dụng.

Hãy quay lại ví dụ này:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Trong ví dụ trên, `useOnlineStatus` được triển khai với một cặp [`useState`](/reference/react/useState) và [`useEffect`.](/reference/react/useEffect) Tuy nhiên, đây không phải là giải pháp tốt nhất có thể. Có một số edge case mà nó không xem xét. Ví dụ, nó giả định rằng khi component mount, `isOnline` đã là `true`, nhưng điều này có thể sai nếu mạng đã offline. Bạn có thể sử dụng API trình duyệt [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) để kiểm tra điều đó, nhưng việc sử dụng nó trực tiếp sẽ không hoạt động trên server để tạo HTML ban đầu. Tóm lại, code này có thể được cải thiện.

React bao gồm một API chuyên dụng có tên [`useSyncExternalStore`](/reference/react/useSyncExternalStore) giải quyết tất cả những vấn đề này cho bạn. Đây là Hook `useOnlineStatus` của bạn, được viết lại để tận dụng API mới này:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

```

</Sandpack>

Lưu ý cách **bạn không cần thay đổi bất kỳ component nào** để thực hiện việc di chuyển này:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Đây là một lý do khác tại sao việc bọc Effect trong custom Hook thường có lợi:

1. Bạn làm cho luồng dữ liệu đến và đi từ Effect của bạn trở nên rất rõ ràng.
2. Bạn để các component tập trung vào ý định thay vì vào cách triển khai chính xác của Effect.
3. Khi React thêm các tính năng mới, bạn có thể loại bỏ những Effect đó mà không thay đổi bất kỳ component nào.

Tương tự như một [design system,](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969) bạn có thể thấy hữu ích khi bắt đầu trích xuất các idiom phổ biến từ các component của ứng dụng thành custom Hook. Điều này sẽ giữ cho code của các component tập trung vào ý định, và cho phép bạn tránh viết raw Effect quá thường xuyên. Nhiều custom Hook xuất sắc được duy trì bởi cộng đồng React.

<DeepDive>

#### React có cung cấp giải pháp tích hợp sẵn nào cho data fetching không? {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

Chúng tôi vẫn đang làm việc với các chi tiết, nhưng chúng tôi mong đợi rằng trong tương lai, bạn sẽ viết data fetching như thế này:

```js {1,4,6}
import { use } from 'react'; // Chưa khả dụng!

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

Nếu bạn sử dụng custom Hook như `useData` ở trên trong ứng dụng của mình, nó sẽ yêu cầu ít thay đổi hơn để di chuyển sang cách tiếp cận được khuyến nghị cuối cùng so với nếu bạn viết raw Effect trong mỗi component thủ công. Tuy nhiên, cách tiếp cận cũ vẫn sẽ hoạt động tốt, vì vậy nếu bạn cảm thấy hài lòng khi viết raw Effect, bạn có thể tiếp tục làm điều đó.

</DeepDive>

### Có nhiều cách để thực hiện điều đó {/*there-is-more-than-one-way-to-do-it*/}

Giả sử bạn muốn triển khai animation fade-in *từ đầu* sử dụng API trình duyệt [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame). Bạn có thể bắt đầu với một Effect thiết lập vòng lặp animation. Trong mỗi frame của animation, bạn có thể thay đổi opacity của DOM node mà bạn [giữ trong một ref](/learn/manipulating-the-dom-with-refs) cho đến khi nó đạt `1`. Code của bạn có thể bắt đầu như thế này:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Để làm cho component dễ đọc hơn, bạn có thể trích xuất logic vào custom Hook `useFadeIn`:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Bạn có thể giữ nguyên code `useFadeIn`, nhưng bạn cũng có thể refactor nó nhiều hơn. Ví dụ, bạn có thể trích xuất logic để thiết lập vòng lặp animation ra khỏi `useFadeIn` vào custom Hook `useAnimationLoop`:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

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

</Sandpack>

Tuy nhiên, bạn *không bắt buộc phải* làm điều đó. Giống như với các function thông thường, cuối cùng bạn quyết định nơi vẽ ranh giới giữa các phần khác nhau của code của bạn. Bạn cũng có thể sử dụng một cách tiếp cận rất khác. Thay vì giữ logic trong Effect, bạn có thể di chuyển hầu hết logic mệnh lệnh vào bên trong một [class:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) JavaScript

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
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
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Effect cho phép bạn kết nối React với các hệ thống bên ngoài. Càng cần nhiều sự phối hợp giữa các Effect (ví dụ, để kết nối nhiều animation), càng có ý nghĩa khi trích xuất logic đó ra khỏi Effect và Hook *hoàn toàn* như trong sandbox ở trên. Khi đó, code bạn trích xuất *trở thành* "hệ thống bên ngoài". Điều này cho phép Effect của bạn giữ đơn giản vì chúng chỉ cần gửi thông điệp đến hệ thống bạn đã chuyển ra ngoài React.

Các ví dụ trên giả định rằng logic fade-in cần được viết bằng JavaScript. Tuy nhiên, animation fade-in cụ thể này vừa đơn giản hơn vừa hiệu quả hơn nhiều để triển khai với [CSS Animation:](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) thuần túy

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css src/styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css src/welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

Đôi khi, bạn thậm chí không cần Hook!

<Recap>

- Custom Hook cho phép bạn chia sẻ logic giữa các component.
- Custom Hook phải được đặt tên bắt đầu bằng `use` theo sau bởi một chữ cái in hoa.
- Custom Hook chỉ chia sẻ logic stateful, không phải bản thân state.
- Bạn có thể truyền giá trị reactive từ Hook này sang Hook khác, và chúng luôn cập nhật.
- Tất cả Hook chạy lại mỗi khi component của bạn re-render.
- Code của custom Hook nên pure, giống như code component của bạn.
- Bọc event handler nhận được bởi custom Hook vào Effect Event.
- Đừng tạo custom Hook như `useMount`. Giữ mục đích của chúng cụ thể.
- Bạn tự quyết định cách và nơi chọn ranh giới của code.

</Recap>

<Challenges>

#### Trích xuất Hook `useCounter` {/*extract-a-usecounter-hook*/}

Component này sử dụng một biến state và một Effect để hiển thị một số tăng lên mỗi giây. Trích xuất logic này vào một custom Hook có tên `useCounter`. Mục tiêu của bạn là làm cho triển khai component `Counter` trông chính xác như thế này:

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

Bạn sẽ cần viết custom Hook của mình trong `useCounter.js` và import nó vào file `App.js`.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
// Write your custom Hook in this file!
```

</Sandpack>

<Solution>

Code của bạn nên trông như thế này:

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

Lưu ý rằng `App.js` không còn cần import `useState` hoặc `useEffect` nữa.

</Solution>

#### Làm cho delay của counter có thể cấu hình {/*make-the-counter-delay-configurable*/}

Trong ví dụ này, có một biến state `delay` được điều khiển bởi slider, nhưng giá trị của nó không được sử dụng. Truyền giá trị `delay` cho custom Hook `useCounter` của bạn, và thay đổi Hook `useCounter` để sử dụng `delay` được truyền thay vì hardcode `1000` ms.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

Truyền `delay` cho Hook của bạn với `useCounter(delay)`. Sau đó, bên trong Hook, sử dụng `delay` thay vì giá trị hardcode `1000`. Bạn sẽ cần thêm `delay` vào dependencies của Effect. Điều này đảm bảo rằng một thay đổi trong `delay` sẽ reset lại interval.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### Trích xuất `useInterval` ra khỏi `useCounter` {/*extract-useinterval-out-of-usecounter*/}

Hiện tại, Hook `useCounter` của bạn làm hai việc. Nó thiết lập một interval, và nó cũng tăng một biến state trên mỗi tick của interval. Tách logic thiết lập interval thành một Hook riêng biệt có tên `useInterval`. Nó nên nhận hai tham số: callback `onTick`, và `delay`. Sau thay đổi này, triển khai `useCounter` của bạn nên trông như thế này:

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

Viết `useInterval` trong file `useInterval.js` và import nó vào file `useCounter.js`.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js src/useInterval.js
// Write your Hook here!
```

</Sandpack>

<Solution>

Logic bên trong `useInterval` nên thiết lập và clear interval. Nó không cần làm gì khác.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

Lưu ý có một chút vấn đề với giải pháp này, mà bạn sẽ giải quyết trong challenge tiếp theo.

</Solution>

#### Sửa lỗi interval bị reset {/*fix-a-resetting-interval*/}

Trong ví dụ này, có *hai* interval riêng biệt.

Component `App` gọi `useCounter`, cái mà gọi `useInterval` để cập nhật counter mỗi giây. Nhưng component `App` *cũng* gọi `useInterval` để cập nhật màu nền trang một cách ngẫu nhiên mỗi hai giây.

Vì lý do nào đó, callback cập nhật màu nền trang không bao giờ chạy. Thêm một số log bên trong `useInterval`:

```js {2,5}
  useEffect(() => {
    console.log('✅ Setting up an interval with delay ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Clearing an interval with delay ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

Các log có khớp với những gì bạn mong đợi xảy ra không? Nếu một số Effect của bạn có vẻ re-synchronize một cách không cần thiết, bạn có thể đoán dependency nào đang gây ra điều đó không? Có cách nào để [loại bỏ dependency đó](/learn/removing-effect-dependencies) khỏi Effect của bạn không?

Sau khi bạn sửa vấn đề, bạn nên mong đợi màu nền trang cập nhật mỗi hai giây.

<Hint>

Có vẻ như Hook `useInterval` của bạn chấp nhận một event listener làm tham số. Bạn có thể nghĩ ra cách nào để bọc event listener đó để nó không cần phải là dependency của Effect không?

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

Bên trong `useInterval`, bọc tick callback vào một Effect Event, như bạn đã làm [trước đó trong trang này.](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks)

Điều này sẽ cho phép bạn bỏ qua `onTick` khỏi dependencies của Effect. Effect sẽ không re-synchronize trên mỗi lần re-render của component, vì vậy interval thay đổi màu nền trang sẽ không bị reset mỗi giây trước khi nó có cơ hội kích hoạt.

Với thay đổi này, cả hai interval đều hoạt động như mong đợi và không can thiệp vào nhau:

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### Triển khai staggering movement {/*implement-a-staggering-movement*/}

Trong ví dụ này, Hook `usePointerPosition()` theo dõi vị trí con trỏ hiện tại. Hãy thử di chuyển con trỏ hoặc ngón tay của bạn trên khu vực preview và xem chấm đỏ theo dõi chuyển động của bạn. Vị trí của nó được lưu trong biến `pos1`.

Thực tế, có năm (!) chấm đỏ khác nhau đang được render. Bạn không thấy chúng vì hiện tại chúng đều xuất hiện ở cùng vị trí. Đây là điều bạn cần sửa. Những gì bạn muốn triển khai thay vào đó là chuyển động "staggered": mỗi chấm nên "theo" đường đi của chấm trước đó. Ví dụ, nếu bạn di chuyển con trỏ nhanh chóng, chấm đầu tiên nên theo nó ngay lập tức, chấm thứ hai nên theo chấm đầu tiên với một delay nhỏ, chấm thứ ba nên theo chấm thứ hai, và cứ thế.

Bạn cần triển khai custom Hook `useDelayedValue`. Triển khai hiện tại của nó trả về `value` được cung cấp cho nó. Thay vào đó, bạn muốn trả về giá trị từ `delay` millisecond trước. Bạn có thể cần một số state và Effect để làm điều này.

Sau khi bạn triển khai `useDelayedValue`, bạn sẽ thấy các chấm di chuyển theo nhau.

<Hint>

Bạn sẽ cần lưu trữ `delayedValue` như một biến state bên trong custom Hook của bạn. Khi `value` thay đổi, bạn sẽ muốn chạy một Effect. Effect này nên cập nhật `delayedValue` sau `delay`. Bạn có thể thấy hữu ích khi gọi `setTimeout`.

Effect này có cần cleanup không? Tại sao có hoặc tại sao không?

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: Implement this Hook
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

Đây là phiên bản hoạt động. Bạn giữ `delayedValue` như một biến state. Khi `value` cập nhật, Effect của bạn lên lịch một timeout để cập nhật `delayedValue`. Đây là lý do tại sao `delayedValue` luôn "chậm hơn" `value` thực tế.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

Lưu ý rằng Effect này *không* cần cleanup. Nếu bạn gọi `clearTimeout` trong cleanup function, thì mỗi khi `value` thay đổi, nó sẽ reset timeout đã được lên lịch. Để giữ chuyển động liên tục, bạn muốn tất cả timeout kích hoạt.

</Solution>

</Challenges>
