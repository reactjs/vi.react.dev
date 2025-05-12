---
title: <StrictMode>
---

<Intro>

`<StrictMode>` cho phép bạn tìm các lỗi phổ biến trong các component của mình sớm trong quá trình phát triển.

```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

Sử dụng `StrictMode` để bật các hành vi và cảnh báo phát triển bổ sung cho cây component bên trong:

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[Xem thêm các ví dụ bên dưới.](#usage)

Strict Mode kích hoạt các hành vi chỉ dành cho quá trình phát triển sau:

- Các component của bạn sẽ [render lại thêm một lần](#fixing-bugs-found-by-double-rendering-in-development) để tìm các lỗi do quá trình render không thuần túy gây ra.
- Các component của bạn sẽ [chạy lại Effects thêm một lần](#fixing-bugs-found-by-re-running-effects-in-development) để tìm các lỗi do thiếu dọn dẹp Effect.
- Các component của bạn sẽ [chạy lại các callback ref thêm một lần](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) để tìm các lỗi do thiếu dọn dẹp ref.
- Các component của bạn sẽ [được kiểm tra việc sử dụng các API không dùng nữa.](#fixing-deprecation-warnings-enabled-by-strict-mode)

#### Props {/*props*/}

`StrictMode` không chấp nhận props nào.

#### Lưu ý {/*lưu-ý*/}

#### Lưu ý {/*caveats*/}

* Không có cách nào để tắt Strict Mode bên trong một cây được bọc trong `<StrictMode>`. Điều này giúp bạn tin tưởng rằng tất cả các component bên trong `<StrictMode>` đều được kiểm tra. Nếu hai nhóm làm việc trên một sản phẩm không đồng ý về việc họ thấy các kiểm tra có giá trị hay không, họ cần đạt được sự đồng thuận hoặc di chuyển `<StrictMode>` xuống trong cây.

---

## Cách sử dụng {/*usage*/}

### Bật Strict Mode cho toàn bộ ứng dụng {/*enabling-strict-mode-for-entire-app*/}

Strict Mode cho phép các kiểm tra chỉ dành cho quá trình phát triển đối với toàn bộ cây component bên trong component `<StrictMode>`. Các kiểm tra này giúp bạn tìm thấy các lỗi phổ biến trong các component của bạn sớm trong quá trình phát triển.

Để bật Strict Mode cho toàn bộ ứng dụng của bạn, hãy bọc component gốc của bạn bằng `<StrictMode>` khi bạn render nó:

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Chúng tôi khuyên bạn nên bọc toàn bộ ứng dụng của mình trong Strict Mode, đặc biệt đối với các ứng dụng mới tạo. Nếu bạn sử dụng một framework gọi [`createRoot`](/reference/react-dom/client/createRoot) cho bạn, hãy kiểm tra tài liệu của nó để biết cách bật Strict Mode.

Mặc dù các kiểm tra của Strict Mode **chỉ chạy trong quá trình phát triển,** nhưng chúng giúp bạn tìm thấy các lỗi đã tồn tại trong code của bạn nhưng có thể khó tái tạo một cách đáng tin cậy trong production. Strict Mode cho phép bạn sửa lỗi trước khi người dùng của bạn báo cáo chúng.

<Note>

Strict Mode cho phép các kiểm tra sau trong quá trình phát triển:

- Các component của bạn sẽ [render lại thêm một lần](#fixing-bugs-found-by-double-rendering-in-development) để tìm các lỗi do quá trình render không thuần túy gây ra.
- Các component của bạn sẽ [chạy lại Effects thêm một lần](#fixing-bugs-found-by-re-running-effects-in-development) để tìm các lỗi do thiếu dọn dẹp Effect.
- Các component của bạn sẽ [chạy lại các callback ref thêm một lần](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) để tìm các lỗi do thiếu dọn dẹp ref.
- Các component của bạn sẽ [được kiểm tra việc sử dụng các API không dùng nữa.](#fixing-deprecation-warnings-enabled-by-strict-mode)

**Tất cả các kiểm tra này chỉ dành cho quá trình phát triển và không ảnh hưởng đến bản dựng production.**

</Note>

---
### Bật Strict Mode cho một phần của ứng dụng {/*enabling-strict-mode-for-a-part-of-the-app*/}

Bạn cũng có thể bật Strict Mode cho bất kỳ phần nào của ứng dụng của bạn:

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

Trong ví dụ này, các kiểm tra của Strict Mode sẽ không chạy trên các component `Header` và `Footer`. Tuy nhiên, chúng sẽ chạy trên `Sidebar` và `Content`, cũng như tất cả các component bên trong chúng, bất kể độ sâu.

<Note>

Khi `StrictMode` được bật cho một phần của ứng dụng, React sẽ chỉ bật các hành vi có thể xảy ra trong production. Ví dụ: nếu `<StrictMode>` không được bật ở gốc của ứng dụng, nó sẽ không [chạy lại Effects thêm một lần](#fixing-bugs-found-by-re-running-effects-in-development) khi mount ban đầu, vì điều này sẽ khiến các effect con bị kích hoạt gấp đôi mà không có các effect cha, điều này không thể xảy ra trong production.

</Note>

---
### Khắc phục các lỗi được tìm thấy bằng cách render hai lần trong quá trình phát triển {/*fixing-bugs-found-by-double-rendering-in-development*/}

[React giả định rằng mọi component bạn viết là một hàm thuần túy.](/learn/keeping-components-pure) Điều này có nghĩa là các component React bạn viết phải luôn trả về cùng một JSX với cùng một đầu vào (props, state và context).

Các component vi phạm quy tắc này hoạt động không thể đoán trước và gây ra lỗi. Để giúp bạn tìm thấy code không thuần túy một cách vô tình, Strict Mode gọi một số hàm của bạn (chỉ những hàm được cho là thuần túy) **hai lần trong quá trình phát triển.** Điều này bao gồm:

- Phần thân hàm component của bạn (chỉ logic cấp cao nhất, vì vậy điều này không bao gồm code bên trong trình xử lý sự kiện)
- Các hàm mà bạn chuyển cho [`useState`](/reference/react/useState), các hàm [`set`](/reference/react/useState#setstate), [`useMemo`](/reference/react/useMemo) hoặc [`useReducer`](/reference/react/useReducer)
- Một số phương thức component class như [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) ([xem toàn bộ danh sách](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))

Nếu một hàm là thuần túy, việc chạy nó hai lần không thay đổi hành vi của nó vì một hàm thuần túy tạo ra cùng một kết quả mỗi lần. Tuy nhiên, nếu một hàm là không thuần túy (ví dụ: nó thay đổi dữ liệu mà nó nhận được), việc chạy nó hai lần có xu hướng dễ nhận thấy (đó là điều khiến nó không thuần túy!) Điều này giúp bạn phát hiện và sửa lỗi sớm.

**Đây là một ví dụ để minh họa cách render hai lần trong Strict Mode giúp bạn tìm lỗi sớm.**

Component `StoryTray` này lấy một mảng `stories` và thêm một mục "Create Story" cuối cùng vào cuối:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

There is a mistake in the code above. However, it is easy to miss because the initial output appears correct.

This mistake will become more noticeable if the `StoryTray` component re-renders multiple times. For example, let's make the `StoryTray` re-render with a different background color whenever you hover over it: 

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Lưu ý rằng mỗi khi bạn di chuột qua component `StoryTray`, "Create Story" sẽ được thêm lại vào danh sách. Mục đích của code là thêm nó một lần ở cuối. Nhưng `StoryTray` sửa đổi trực tiếp mảng `stories` từ props. Mỗi khi `StoryTray` render, nó lại thêm "Create Story" vào cuối cùng của cùng một mảng. Nói cách khác, `StoryTray` không phải là một hàm thuần túy - việc chạy nó nhiều lần sẽ tạo ra các kết quả khác nhau.

Để khắc phục sự cố này, bạn có thể tạo một bản sao của mảng và sửa đổi bản sao đó thay vì bản gốc:

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Clone the array
  // ✅ Good: Pushing into a new array
  items.push({ id: 'create', label: 'Create Story' });
```

Điều này sẽ [làm cho hàm `StoryTray` trở nên thuần khiết.](/learn/keeping-components-pure) Mỗi khi nó được gọi, nó sẽ chỉ sửa đổi một bản sao mới của mảng và sẽ không ảnh hưởng đến bất kỳ đối tượng hoặc biến bên ngoài nào. Điều này giải quyết lỗi, nhưng bạn phải làm cho component render lại thường xuyên hơn trước khi nó trở nên rõ ràng rằng có điều gì đó không ổn với hành vi của nó.

**Trong ví dụ ban đầu, lỗi không rõ ràng. Bây giờ, hãy bọc mã gốc (có lỗi) trong `<StrictMode>`:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**Strict Mode *luôn* gọi hàm render của bạn hai lần, vì vậy bạn có thể thấy lỗi ngay lập tức** ("Create Story" xuất hiện hai lần). Điều này cho phép bạn nhận thấy những sai sót như vậy sớm trong quá trình này. Khi bạn sửa component của mình để render trong Strict Mode, bạn *cũng* sửa nhiều lỗi sản xuất có thể xảy ra trong tương lai như chức năng di chuột từ trước:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Clone the array
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Nếu không có Strict Mode, bạn có thể dễ dàng bỏ lỡ lỗi cho đến khi bạn thêm nhiều lần render lại. Strict Mode làm cho lỗi tương tự xuất hiện ngay lập tức. Strict Mode giúp bạn tìm lỗi trước khi bạn đẩy chúng cho nhóm của mình và cho người dùng của bạn.

[Đọc thêm về cách giữ cho các component thuần khiết.](/learn/keeping-components-pure)

<Note>

Nếu bạn đã cài đặt [React DevTools](/learn/react-developer-tools), bất kỳ lệnh gọi `console.log` nào trong lần gọi render thứ hai sẽ xuất hiện hơi mờ. React DevTools cũng cung cấp một cài đặt (tắt theo mặc định) để tắt chúng hoàn toàn.
</Note>



---
### Khắc phục các lỗi được tìm thấy bằng cách chạy lại Effects trong quá trình phát triển {/*fixing-bugs-found-by-re-running-effects-in-development*/}

Strict Mode cũng có thể giúp tìm các lỗi trong [Effects.](/learn/synchronizing-with-effects)

Mỗi Effect có một số mã thiết lập và có thể có một số mã dọn dẹp. Thông thường, React gọi thiết lập khi component *mounts* (được thêm vào màn hình) và gọi dọn dẹp khi component *unmounts* (bị xóa khỏi màn hình). Sau đó, React gọi dọn dẹp và thiết lập lại nếu các dependencies của nó thay đổi kể từ lần render cuối cùng.

Khi Strict Mode được bật, React cũng sẽ chạy **một chu kỳ thiết lập + dọn dẹp bổ sung trong quá trình phát triển cho mỗi Effect.** Điều này có vẻ đáng ngạc nhiên, nhưng nó giúp tiết lộ những lỗi nhỏ khó bắt gặp theo cách thủ công.

**Đây là một ví dụ để minh họa cách chạy lại Effects trong Strict Mode giúp bạn tìm lỗi sớm.**

Hãy xem xét ví dụ này kết nối một component với một cuộc trò chuyện:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Có một vấn đề với mã này, nhưng nó có thể không rõ ràng ngay lập tức.

Để làm cho vấn đề trở nên rõ ràng hơn, hãy triển khai một tính năng. Trong ví dụ dưới đây, `roomId` không được mã hóa cứng. Thay vào đó, người dùng có thể chọn `roomId` mà họ muốn kết nối từ một danh sách thả xuống. Nhấp vào "Open chat" và sau đó chọn các phòng chat khác nhau từng cái một. Theo dõi số lượng kết nối đang hoạt động trong bảng điều khiển:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
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
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Bạn sẽ nhận thấy rằng số lượng kết nối đang mở luôn tăng lên. Trong một ứng dụng thực tế, điều này sẽ gây ra các vấn đề về hiệu suất và mạng. Vấn đề là [Effect của bạn đang thiếu một hàm dọn dẹp:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

Giờ đây, Effect của bạn "dọn dẹp" sau chính nó và phá hủy các kết nối lỗi thời, rò rỉ đã được giải quyết. Tuy nhiên, hãy lưu ý rằng sự cố không trở nên rõ ràng cho đến khi bạn thêm nhiều tính năng hơn (hộp chọn).

**Trong ví dụ ban đầu, lỗi không rõ ràng. Bây giờ, hãy bọc mã gốc (có lỗi) trong `<StrictMode>`:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**Với Strict Mode, bạn sẽ thấy ngay rằng có một vấn đề** (số lượng kết nối đang hoạt động tăng lên 2). Strict Mode chạy thêm một chu kỳ thiết lập + dọn dẹp cho mỗi Effect. Effect này không có logic dọn dẹp, vì vậy nó tạo thêm một kết nối nhưng không hủy nó. Đây là một gợi ý rằng bạn đang thiếu một hàm dọn dẹp.

Strict Mode cho phép bạn nhận thấy những sai sót như vậy sớm trong quá trình này. Khi bạn sửa Effect của mình bằng cách thêm một hàm dọn dẹp trong Strict Mode, bạn *cũng* sửa nhiều lỗi sản xuất có thể xảy ra trong tương lai như hộp chọn từ trước:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

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
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Bạn sẽ thấy rằng số lượng kết nối đang hoạt động trong bảng điều khiển không còn tăng lên nữa.

Nếu không có Strict Mode, bạn có thể dễ dàng bỏ lỡ việc Effect của bạn cần dọn dẹp. Bằng cách chạy *thiết lập → dọn dẹp → thiết lập* thay vì *thiết lập* cho Effect của bạn trong quá trình phát triển, Strict Mode giúp bạn dễ nhận thấy logic dọn dẹp bị thiếu hơn.

[Đọc thêm về cách triển khai dọn dẹp Effect.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### Khắc phục các lỗi được tìm thấy bằng cách chạy lại các callback ref trong quá trình phát triển {/*fixing-bugs-found-by-re-running-ref-callbacks-in-development*/}

Strict Mode cũng có thể giúp tìm các lỗi trong [callback refs.](/learn/manipulating-the-dom-with-refs)

Mỗi callback `ref` có một số mã thiết lập và có thể có một số mã dọn dẹp. Thông thường, React gọi thiết lập khi phần tử được *tạo* (được thêm vào DOM) và gọi dọn dẹp khi phần tử bị *xóa* (bị xóa khỏi DOM).

Khi Strict Mode được bật, React cũng sẽ chạy **một chu kỳ thiết lập + dọn dẹp bổ sung trong quá trình phát triển cho mỗi callback `ref`.** Điều này có vẻ đáng ngạc nhiên, nhưng nó giúp tiết lộ những lỗi nhỏ khó bắt gặp theo cách thủ công.

Hãy xem xét ví dụ này, cho phép bạn chọn một animal và sau đó cuộn đến một trong số chúng. Lưu ý khi bạn chuyển từ "Cats" sang "Dogs", nhật ký bảng điều khiển cho thấy số lượng animal trong danh sách tiếp tục tăng lên và các nút "Scroll to" ngừng hoạt động:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ❌ Not using StrictMode.
root.render(<App />);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function AnimalFriends() {
  const itemsRef = useRef([]);
  const [animalList, setAnimalList] = useState(setupAnimalList);
  const [animal, setAnimal] = useState('cat');

  function scrollToAnimal(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
  
  const animals = animalList.filter(a => a.type === animal)
  
  return (
    <>
      <nav>
        <button onClick={() => setAnimal('cat')}>Cats</button>
        <button onClick={() => setAnimal('dog')}>Dogs</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{animals.map((animal, index) => (
          <button key={animal.src} onClick={() => scrollToAnimal(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {animals.map((animal) => (
              <li
                key={animal.src}
                ref={(node) => {
                  const list = itemsRef.current;
                  const item = {animal: animal, node}; 
                  list.push(item);
                  console.log(`✅ Adding animal to the map. Total animals: ${list.length}`);
                  if (list.length > 10) {
                    console.log('❌ Too many animals in the list!');
                  }
                  return () => {
                    // 🚩 No cleanup, this is a bug!
                  }
                }}
              >
                <img src={animal.src} />
              </li>
            ))}
          
        </ul>
      </div>
    </>
  );
}

function setupAnimalList() {
  const animalList = [];
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'cat', src: "https://loremflickr.com/320/240/cat?lock=" + i});
  }
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'dog', src: "https://loremflickr.com/320/240/dog?lock=" + i});
  }

  return animalList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>


**Đây là một lỗi sản xuất!** Vì callback ref không xóa các animal khỏi danh sách trong quá trình dọn dẹp, danh sách các animal tiếp tục tăng lên. Đây là một rò rỉ bộ nhớ có thể gây ra các vấn đề về hiệu suất trong một ứng dụng thực tế và phá vỡ hành vi của ứng dụng.

Vấn đề là callback ref không tự dọn dẹp:

```js {6-8}
<li
  ref={node => {
    const list = itemsRef.current;
    const item = {animal, node};
    list.push(item);
    return () => {
      // 🚩 No cleanup, this is a bug!
    }
  }}
</li>
```

Now let's wrap the original (buggy) code in `<StrictMode>`:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function AnimalFriends() {
  const itemsRef = useRef([]);
  const [animalList, setAnimalList] = useState(setupAnimalList);
  const [animal, setAnimal] = useState('cat');

  function scrollToAnimal(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
  
  const animals = animalList.filter(a => a.type === animal)
  
  return (
    <>
      <nav>
        <button onClick={() => setAnimal('cat')}>Cats</button>
        <button onClick={() => setAnimal('dog')}>Dogs</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{animals.map((animal, index) => (
          <button key={animal.src} onClick={() => scrollToAnimal(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {animals.map((animal) => (
              <li
                key={animal.src}
                ref={(node) => {
                  const list = itemsRef.current;
                  const item = {animal: animal, node} 
                  list.push(item);
                  console.log(`✅ Adding animal to the map. Total animals: ${list.length}`);
                  if (list.length > 10) {
                    console.log('❌ Too many animals in the list!');
                  }
                  return () => {
                    // 🚩 No cleanup, this is a bug!
                  }
                }}
              >
                <img src={animal.src} />
              </li>
            ))}
          
        </ul>
      </div>
    </>
  );
}

function setupAnimalList() {
  const animalList = [];
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'cat', src: "https://loremflickr.com/320/240/cat?lock=" + i});
  }
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'dog', src: "https://loremflickr.com/320/240/dog?lock=" + i});
  }

  return animalList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

**Với Strict Mode, bạn sẽ thấy ngay rằng có một vấn đề**. Strict Mode chạy thêm một chu kỳ thiết lập + dọn dẹp cho mỗi callback ref. Callback ref này không có logic dọn dẹp, vì vậy nó thêm ref nhưng không xóa chúng. Đây là một gợi ý rằng bạn đang thiếu một hàm dọn dẹp.

Strict Mode cho phép bạn tìm thấy những sai sót trong callback ref một cách nhanh chóng. Khi bạn sửa callback của mình bằng cách thêm một hàm dọn dẹp trong Strict Mode, bạn *cũng* sửa nhiều lỗi sản xuất có thể xảy ra trong tương lai như lỗi "Scroll to" từ trước:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function AnimalFriends() {
  const itemsRef = useRef([]);
  const [animalList, setAnimalList] = useState(setupAnimalList);
  const [animal, setAnimal] = useState('cat');

  function scrollToAnimal(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
  
  const animals = animalList.filter(a => a.type === animal)
  
  return (
    <>
      <nav>
        <button onClick={() => setAnimal('cat')}>Cats</button>
        <button onClick={() => setAnimal('dog')}>Dogs</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{animals.map((animal, index) => (
          <button key={animal.src} onClick={() => scrollToAnimal(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {animals.map((animal) => (
              <li
                key={animal.src}
                ref={(node) => {
                  const list = itemsRef.current;
                  const item = {animal, node};
                  list.push({animal: animal, node});
                  console.log(`✅ Adding animal to the map. Total animals: ${list.length}`);
                  if (list.length > 10) {
                    console.log('❌ Too many animals in the list!');
                  }
                  return () => {
                    list.splice(list.indexOf(item));
                    console.log(`❌ Removing animal from the map. Total animals: ${itemsRef.current.length}`);
                  }
                }}
              >
                <img src={animal.src} />
              </li>
            ))}
          
        </ul>
      </div>
    </>
  );
}

function setupAnimalList() {
  const animalList = [];
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'cat', src: "https://loremflickr.com/320/240/cat?lock=" + i});
  }
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'dog', src: "https://loremflickr.com/320/240/dog?lock=" + i});
  }

  return animalList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>
Giờ đây, khi gắn kết ban đầu trong StrictMode, tất cả các callback ref đều được thiết lập, dọn dẹp và thiết lập lại:

```
...
✅ Adding animal to the map. Total animals: 10
...
❌ Removing animal from the map. Total animals: 0
...
✅ Adding animal to the map. Total animals: 10
```

**Điều này là mong đợi.** Strict Mode xác nhận rằng các callback ref được dọn dẹp chính xác, vì vậy kích thước không bao giờ tăng trên mức dự kiến. Sau khi sửa lỗi, không có rò rỉ bộ nhớ và tất cả các tính năng hoạt động như mong đợi.

Nếu không có Strict Mode, bạn có thể dễ dàng bỏ lỡ lỗi cho đến khi bạn nhấp vào ứng dụng để nhận thấy các tính năng bị hỏng. Strict Mode làm cho các lỗi xuất hiện ngay lập tức, trước khi bạn đẩy chúng vào sản xuất.

---

### Khắc phục các cảnh báo không dùng nữa được bật bởi Strict Mode {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

React cảnh báo nếu một số thành phần ở bất kỳ đâu bên trong cây `<StrictMode>` sử dụng một trong các API không dùng nữa này:

* Các phương thức vòng đời lớp `UNSAFE_` như [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [Xem các lựa chọn thay thế.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles)

Các API này chủ yếu được sử dụng trong các [thành phần lớp](/reference/react/Component) cũ hơn, vì vậy chúng hiếm khi xuất hiện trong các ứng dụng hiện đại.
