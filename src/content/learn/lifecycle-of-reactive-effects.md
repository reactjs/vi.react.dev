---
title: 'Vòng đời của Reactive Effects'
---

<Intro>

Effect có một vòng đời khác với các component. Các component có thể mount, update, hoặc unmount. Một Effect chỉ có thể làm hai việc: bắt đầu đồng bộ hóa một thứ gì đó, và sau đó ngừng đồng bộ hóa nó. Chu kỳ này có thể xảy ra nhiều lần nếu Effect của bạn phụ thuộc vào props và state thay đổi theo thời gian. React cung cấp một quy tắc linter để kiểm tra rằng bạn đã chỉ định đúng các dependency của Effect. Điều này giữ cho Effect của bạn được đồng bộ hóa với props và state mới nhất.

</Intro>

<YouWillLearn>

- Effect có vòng đời khác với vòng đời của component như thế nào
- Cách suy nghĩ về từng Effect riêng lẻ một cách độc lập
- Khi nào Effect của bạn cần đồng bộ hóa lại, và tại sao
- Cách xác định các dependency của Effect
- Ý nghĩa của một giá trị reactive là gì
- Ý nghĩa của một mảng dependency trống
- React xác minh các dependency của bạn đúng với linter như thế nào
- Làm gì khi bạn không đồng ý với linter

</YouWillLearn>

## Vòng đời của một Effect {/*the-lifecycle-of-an-effect*/}

Mọi React component đều trải qua cùng một vòng đời:

- Một component _mount_ khi nó được thêm vào màn hình.
- Một component _update_ khi nó nhận được props hoặc state mới, thường để phản hồi lại một tương tác.
- Một component _unmount_ khi nó được loại bỏ khỏi màn hình.

**Đó là một cách tốt để nghĩ về component, nhưng _không phải_ về Effect.** Thay vào đó, hãy cố gắng nghĩ về từng Effect một cách độc lập với vòng đời của component. Một Effect mô tả cách [đồng bộ hóa một hệ thống bên ngoài](/learn/synchronizing-with-effects) với props và state hiện tại. Khi code của bạn thay đổi, việc đồng bộ hóa sẽ cần xảy ra nhiều hơn hoặc ít hơn.

Để minh họa điểm này, hãy xem xét Effect này kết nối component của bạn với một chat server:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

Body của Effect chỉ định cách **bắt đầu đồng bộ hóa:**

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Function cleanup được trả về bởi Effect chỉ định cách **ngừng đồng bộ hóa:**

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Theo trực giác, bạn có thể nghĩ rằng React sẽ **bắt đầu đồng bộ hóa** khi component mount và **ngừng đồng bộ hóa** khi component unmount. Tuy nhiên, đây không phải là kết thúc của câu chuyện! Đôi khi, cũng có thể cần **bắt đầu và ngừng đồng bộ hóa nhiều lần** trong khi component vẫn được mount.

Hãy xem _tại sao_ điều này cần thiết, _khi nào_ nó xảy ra, và _cách_ bạn có thể kiểm soát hành vi này.

<Note>

Một số Effect không trả về function cleanup nào cả. [Thông thường,](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) bạn sẽ muốn trả về một cái--nhưng nếu bạn không làm vậy, React sẽ hoạt động như thể bạn đã trả về một function cleanup rỗng.

</Note>

### Tại sao việc đồng bộ hóa có thể cần xảy ra nhiều lần {/*why-synchronization-may-need-to-happen-more-than-once*/}

Hãy tưởng tượng component `ChatRoom` này nhận một prop `roomId` mà người dùng chọn trong một dropdown. Giả sử ban đầu người dùng chọn phòng `"general"` làm `roomId`. Ứng dụng của bạn hiển thị phòng chat `"general"`:

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Sau khi UI được hiển thị, React sẽ chạy Effect để **bắt đầu đồng bộ hóa.** Nó kết nối với phòng `"general"`:

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
    connection.connect();
    return () => {
      connection.disconnect(); // Disconnects from the "general" room
    };
  }, [roomId]);
  // ...
```

Tới đây, mọi thứ vẫn ổn.

Sau đó, người dùng chọn một phòng khác trong dropdown (ví dụ, `"travel"`). Trước tiên, React sẽ cập nhật UI:

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Hãy nghĩ về những gì sẽ xảy ra tiếp theo. Người dùng thấy rằng `"travel"` là phòng chat được chọn trong UI. Tuy nhiên, Effect đã chạy lần cuối vẫn còn kết nối với phòng `"general"`. **Prop `roomId` đã thay đổi, vì vậy những gì Effect của bạn đã làm trước đó (kết nối với phòng `"general"`) không còn khớp với UI nữa.**

Tại thời điểm này, bạn muốn React thực hiện hai việc:

1. Ngừng đồng bộ hóa với `roomId` cũ (ngắt kết nối khỏi phòng `"general"`)
2. Bắt đầu đồng bộ hóa với `roomId` mới (kết nối với phòng `"travel"`)

**May mắn thay, bạn đã dạy React cách thực hiện cả hai việc này!** Body Effect của bạn chỉ định cách bắt đầu đồng bộ hóa, và function cleanup chỉ định cách ngừng đồng bộ hóa. Tất cả những gì React cần làm bây giờ là gọi chúng theo đúng thứ tự và với props và state đúng. Hãy xem chính xác điều đó xảy ra như thế nào.

### React đồng bộ hóa lại Effect của bạn như thế nào {/*how-react-re-synchronizes-your-effect*/}

Hãy nhớ lại rằng component `ChatRoom` của bạn đã nhận một giá trị mới cho prop `roomId`. Trước đó là `"general"`, và bây giờ là `"travel"`. React cần đồng bộ hóa lại Effect để kết nối lại bạn với một phòng khác.

Để **ngừng đồng bộ hóa,** React sẽ gọi function cleanup mà Effect của bạn trả về sau khi kết nối với phòng `"general"`. Vì `roomId` là `"general"`, function cleanup ngắt kết nối khỏi phòng `"general"`:

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
    connection.connect();
    return () => {
      connection.disconnect(); // Disconnects from the "general" room
    };
    // ...
```

Sau đó React sẽ chạy Effect mà bạn đã cung cấp trong lần render này. Lần này, `roomId` là `"travel"` nên nó sẽ **bắt đầu đồng bộ hóa** với phòng chat `"travel"` (cho đến khi function cleanup của nó cũng được gọi):

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "travel" room
    connection.connect();
    // ...
```

Nhờ điều này, bây giờ bạn đã kết nối với cùng phòng mà người dùng đã chọn trong UI. Tránh được thảm họa!

Mỗi lần sau khi component render lại với một `roomId` khác, Effect của bạn sẽ đồng bộ hóa lại. Ví dụ, giả sử người dùng thay đổi `roomId` từ `"travel"` thành `"music"`. React sẽ lại **ngừng đồng bộ hóa** Effect của bạn bằng cách gọi function cleanup (ngắt kết nối bạn khỏi phòng `"travel"`). Sau đó nó sẽ **bắt đầu đồng bộ hóa** lại bằng cách chạy body với prop `roomId` mới (kết nối bạn với phòng `"music"`).

Cuối cùng, khi người dùng chuyển sang một màn hình khác, `ChatRoom` unmount. Bây giờ không cần phải duy trì kết nối nữa. React sẽ **ngừng đồng bộ hóa** Effect của bạn lần cuối cùng và ngắt kết nối bạn khỏi phòng chat `"music"`.

### Suy nghĩ từ góc độ của Effect {/*thinking-from-the-effects-perspective*/}

Hãy tóm tắt mọi thứ đã xảy ra từ góc độ của component `ChatRoom`:

1. `ChatRoom` mount với `roomId` được đặt thành `"general"`
1. `ChatRoom` update với `roomId` được đặt thành `"travel"`
1. `ChatRoom` update với `roomId` được đặt thành `"music"`
1. `ChatRoom` unmount

Trong mỗi điểm này trong vòng đời của component, Effect của bạn đã làm những việc khác nhau:

1. Effect của bạn kết nối với phòng `"general"`
1. Effect của bạn ngắt kết nối khỏi phòng `"general"` và kết nối với phòng `"travel"`
1. Effect của bạn ngắt kết nối khỏi phòng `"travel"` và kết nối với phòng `"music"`
1. Effect của bạn ngắt kết nối khỏi phòng `"music"`

Bây giờ hãy nghĩ về những gì đã xảy ra từ góc độ của chính Effect:

```js
  useEffect(() => {
    // Your Effect connected to the room specified with roomId...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...until it disconnected
      connection.disconnect();
    };
  }, [roomId]);
```

Cấu trúc của code này có thể truyền cảm hứng cho bạn để thấy những gì đã xảy ra như một chuỗi các khoảng thời gian không chồng chéo:

1. Effect của bạn kết nối với phòng `"general"` (cho đến khi nó ngắt kết nối)
1. Effect của bạn kết nối với phòng `"travel"` (cho đến khi nó ngắt kết nối)
1. Effect của bạn kết nối với phòng `"music"` (cho đến khi nó ngắt kết nối)

Trước đây, bạn đang suy nghĩ từ góc độ của component. Khi bạn nhìn từ góc độ của component, có thể dễ dàng nghĩ về Effect như "callback" hoặc "lifecycle event" được kích hoạt tại một thời điểm như "sau một lần render" hoặc "trước khi unmount". Cách suy nghĩ này trở nên phức tạp rất nhanh, vì vậy tốt nhất là tránh.

**Thay vào đó, hãy luôn tập trung vào một chu kỳ bắt đầu/dừng duy nhất tại một thời điểm. Không quan trọng liệu component đang mount, update, hay unmount. Tất cả những gì bạn cần làm là mô tả cách bắt đầu đồng bộ hóa và cách dừng nó. Nếu bạn làm tốt, Effect của bạn sẽ chịu đựng được việc được bắt đầu và dừng bao nhiêu lần cần thiết.**

Điều này có thể nhắc nhở bạn về cách bạn không nghĩ liệu component đang mount hoặc update khi bạn viết logic rendering tạo JSX. Bạn mô tả những gì nên có trên màn hình, và React [tìm ra phần còn lại.](/learn/reacting-to-input-with-state)

### React xác minh rằng Effect của bạn có thể đồng bộ hóa lại như thế nào {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

Đây là một ví dụ trực tiếp mà bạn có thể chơi với. Nhấn "Open chat" để mount component `ChatRoom`:

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

Lưu ý rằng khi component mount lần đầu tiên, bạn thấy ba log:

1. `✅ Connecting to "general" room at https://localhost:1234...` *(chỉ trong development)*
1. `❌ Disconnected from "general" room at https://localhost:1234.` *(chỉ trong development)*
1. `✅ Connecting to "general" room at https://localhost:1234...`

Hai log đầu tiên chỉ dành cho development. Trong development, React luôn remount mỗi component một lần.

**React xác minh rằng Effect của bạn có thể đồng bộ hóa lại bằng cách buộc nó thực hiện điều đó ngay lập tức trong development.** Điều này có thể nhắc nhở bạn về việc mở cửa và đóng nó thêm một lần để kiểm tra xem ổ khóa cửa có hoạt động không. React bắt đầu và dừng Effect của bạn thêm một lần trong development để kiểm tra [bạn đã triển khai function cleanup tốt chưa.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

Lý do chính Effect của bạn sẽ đồng bộ hóa lại trong thực tế là nếu một số data mà nó sử dụng đã thay đổi. Trong sandbox ở trên, hãy thay đổi phòng chat được chọn. Lưu ý cách, khi `roomId` thay đổi, Effect của bạn đồng bộ hóa lại.

Tuy nhiên, cũng có những trường hợp bất thường hơn mà việc đồng bộ hóa lại là cần thiết. Ví dụ, hãy thử chỉnh sửa `serverUrl` trong sandbox ở trên trong khi chat đang mở. Lưu ý cách Effect đồng bộ hóa lại để phản hồi lại các chỉnh sửa của bạn đối với code. Trong tương lai, React có thể thêm nhiều tính năng hơn dựa trên việc đồng bộ hóa lại.

### React biết rằng nó cần đồng bộ hóa lại Effect như thế nào {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

Bạn có thể tự hỏi React biết rằng Effect của bạn cần đồng bộ hóa lại sau khi `roomId` thay đổi như thế nào. Đó là bởi vì *bạn đã nói với React* rằng code của nó phụ thuộc vào `roomId` bằng cách bao gồm nó trong [danh sách dependency:](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)

```js {1,3,8}
function ChatRoom({ roomId }) { // The roomId prop may change over time
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads roomId 
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // So you tell React that this Effect "depends on" roomId
  // ...
```

Đây là cách hoạt động của nó:

1. Bạn biết `roomId` là một prop, có nghĩa là nó có thể thay đổi theo thời gian.
2. Bạn biết rằng Effect đọc `roomId` (do đó logic của nó phụ thuộc vào giá trị có thể thay đổi sau này).
3. Đây là lý do tại sao bạn chỉ định nó như dependency của Effect (để nó đồng bộ hóa lại khi `roomId` thay đổi).

Mỗi lần sau khi component render lại, React sẽ xem xét mảng các dependency mà bạn đã truyền. Nếu bất kỳ giá trị nào trong mảng khác với giá trị tại cùng vị trí mà bạn đã truyền trong lần render trước, React sẽ đồng bộ hóa lại Effect của bạn.

Ví dụ, nếu bạn truyền `["general"]` trong lần render đầu tiên, và sau đó bạn truyền `["travel"]` trong lần render tiếp theo, React sẽ so sánh `"general"` và `"travel"`. Đây là những giá trị khác nhau (so sánh với [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), do đó React sẽ đồng bộ hóa lại Effect của bạn. Mặt khác, nếu component render lại nhưng `roomId` không thay đổi, Effect của bạn sẽ vẫn kết nối với cùng phòng.

### Mỗi Effect đại diện cho một quá trình đồng bộ hóa riêng biệt {/*each-effect-represents-a-separate-synchronization-process*/}

Hãy tránh thêm logic không liên quan vào Effect của bạn chỉ vì logic này cần chạy cùng lúc với Effect mà bạn đã viết. Ví dụ, giả sử bạn muốn gửi một sự kiện analytics khi người dùng truy cập phòng. Bạn đã có một Effect phụ thuộc vào `roomId`, vì vậy bạn có thể muốn thêm cuộc gọi analytics vào đó:

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Nhưng hãy tưởng tượng sau này bạn thêm một dependency khác vào Effect này mà cần thiết lập lại kết nối. Nếu Effect này đồng bộ hóa lại, nó cũng sẽ gọi `logVisit(roomId)` cho cùng phòng, điều mà bạn không có ý định. Ghi log lần truy cập **là một quá trình riêng biệt** so với việc kết nối. Viết chúng như hai Effect riêng biệt:

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**Mỗi Effect trong code của bạn nên đại diện cho một quá trình đồng bộ hóa riêng biệt và độc lập.**

Trong ví dụ trên, việc xóa một Effect sẽ không làm hỏng logic của Effect khác. Đây là dấu hiệu tốt cho thấy chúng đồng bộ hóa những thứ khác nhau, và vì vậy việc tách chúng ra là hợp lý. Mặt khác, nếu bạn tách một phần logic gắn kết thành các Effect riêng biệt, code có thể trông "sạch sẽ" hơn nhưng sẽ [khó duy trì hơn.](/learn/you-might-not-need-an-effect#chains-of-computations) Đây là lý do tại sao bạn nên suy nghĩ xem các quá trình có giống nhau hay riêng biệt, chứ không phải xem code có trông sạch hơn hay không.

## Effect "phản ứng" với các giá trị reactive {/*effects-react-to-reactive-values*/}

Effect của bạn đọc hai biến (`serverUrl` và `roomId`), nhưng bạn chỉ chỉ định `roomId` làm dependency:

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

Tại sao `serverUrl` không cần là một dependency?

Điều này là vì `serverUrl` không bao giờ thay đổi do việc render lại. Nó luôn giống nhau bất kể component render lại bao nhiêu lần và vì lý do gì. Vì `serverUrl` không bao giờ thay đổi, việc chỉ định nó làm dependency sẽ không có ý nghĩa. Xét cho cùng, dependency chỉ có tác dụng khi chúng thay đổi theo thời gian!

Mặt khác, `roomId` có thể khác trong lần render lại. **Props, state, và các giá trị khác được khai báo bên trong component là *reactive* vì chúng được tính toán trong quá trình rendering và tham gia vào luồng data của React.**

Nếu `serverUrl` là một biến state, nó sẽ là reactive. Các giá trị reactive phải được bao gồm trong dependency:

```js {2,5,10}
function ChatRoom({ roomId }) { // Props change over time
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // State may change over time

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Your Effect reads props and state
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // So you tell React that this Effect "depends on" on props and state
  // ...
}
```

Bằng cách bao gồm `serverUrl` làm dependency, bạn đảm bảo rằng Effect đồng bộ hóa lại sau khi nó thay đổi.

Hãy thử thay đổi phòng chat được chọn hoặc chỉnh sửa URL server trong sandbox này:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
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
      <h1>Welcome to the {roomId} room!</h1>
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

Bất cứ khi nào bạn thay đổi một giá trị reactive như `roomId` hoặc `serverUrl`, Effect sẽ kết nối lại với chat server.

### Ý nghĩa của một Effect với dependency rỗng {/*what-an-effect-with-empty-dependencies-means*/}

Điều gì xảy ra nếu bạn di chuyển cả `serverUrl` và `roomId` ra ngoài component?

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

Bây giờ code Effect của bạn không sử dụng *bất kỳ* giá trị reactive nào, vì vậy dependencies của nó có thể rỗng (`[]`).

Suy nghĩ từ góc độ của component, mảng dependency rỗng `[]` có nghĩa là Effect này kết nối với phòng chat chỉ khi component mount, và ngắt kết nối chỉ khi component unmount. (Hãy nhớ rằng React vẫn sẽ [đồng bộ hóa lại nó thêm một lần nữa](#how-react-verifies-that-your-effect-can-re-synchronize) trong development để kiểm tra logic của bạn.)


<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
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

Tuy nhiên, nếu bạn [suy nghĩ từ góc độ của Effect,](#thinking-from-the-effects-perspective) bạn không cần nghĩ về mounting và unmounting chút nào. Điều quan trọng là bạn đã chỉ định những gì Effect của bạn làm để bắt đầu và dừng đồng bộ hóa. Hôm nay, nó không có dependencies reactive. Nhưng nếu bạn muốn người dùng thay đổi `roomId` hoặc `serverUrl` theo thời gian (và chúng sẽ trở thành reactive), code Effect của bạn sẽ không thay đổi. Bạn sẽ chỉ cần thêm chúng vào dependencies.

### Tất cả các biến được khai báo trong body component đều là reactive {/*all-variables-declared-in-the-component-body-are-reactive*/}

Props và state không phải là những giá trị reactive duy nhất. Các giá trị mà bạn tính toán từ chúng cũng là reactive. Nếu props hoặc state thay đổi, component của bạn sẽ render lại, và các giá trị được tính toán từ chúng cũng sẽ thay đổi. Đây là lý do tại sao tất cả các biến từ body component được sử dụng bởi Effect nên có trong danh sách dependency của Effect.

Giả sử người dùng có thể chọn một chat server trong dropdown, nhưng họ cũng có thể cấu hình một server mặc định trong cài đặt. Giả sử bạn đã đặt state cài đặt trong một [context](/learn/scaling-up-with-reducer-and-context) để bạn đọc `settings` từ context đó. Bây giờ bạn tính toán `serverUrl` dựa trên server được chọn từ props và server mặc định:

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId is reactive
  const settings = useContext(SettingsContext); // settings is reactive
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl is reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Your Effect reads roomId and serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // So it needs to re-synchronize when either of them changes!
  // ...
}
```

Trong ví dụ này, `serverUrl` không phải là một prop hoặc biến state. Nó là một biến thông thường mà bạn tính toán trong quá trình rendering. Nhưng nó được tính toán trong quá trình rendering, vì vậy nó có thể thay đổi do việc render lại. Đây là lý do tại sao nó là reactive.

**Tất cả các giá trị bên trong component (bao gồm props, state, và các biến trong body component của bạn) đều là reactive. Bất kỳ giá trị reactive nào cũng có thể thay đổi trong lần render lại, vì vậy bạn cần bao gồm các giá trị reactive làm dependencies của Effect.**

Nói cách khác, Effect "phản ứng" với tất cả các giá trị từ body component.

<DeepDive>

#### Các giá trị global hoặc mutable có thể là dependencies không? {/*can-global-or-mutable-values-be-dependencies*/}

Các giá trị mutable (bao gồm các biến global) không phải là reactive.

**Một giá trị mutable như [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) không thể là một dependency.** Nó có thể thay đổi (mutable), vì vậy nó có thể thay đổi bất cứ lúc nào hoàn toàn bên ngoài luồng data rendering của React. Việc thay đổi nó sẽ không kích hoạt render lại component của bạn. Do đó, ngay cả khi bạn chỉ định nó trong dependencies, React *sẽ không biết* để đồng bộ hóa lại Effect khi nó thay đổi. Điều này cũng vi phạm các quy tắc của React vì việc đọc data mutable trong quá trình rendering (là lúc bạn tính toán dependencies) vi phạm [tính thuần khiết của rendering.](/learn/keeping-components-pure) Thay vào đó, bạn nên đọc và subscribe vào một giá trị mutable bên ngoài với [`useSyncExternalStore`.](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)

**Một giá trị mutable như [`ref.current`](/reference/react/useRef#reference) hoặc những thứ bạn đọc từ nó cũng không thể là một dependency.** Object ref được trả về bởi `useRef` có thể là một dependency, nhưng thuộc tính `current` của nó có thể thay đổi một cách có chủ ý. Nó cho phép bạn [theo dõi một thứ gì đó mà không kích hoạt render lại.](/learn/referencing-values-with-refs) Nhưng vì việc thay đổi nó không kích hoạt render lại, nó không phải là một giá trị reactive, và React sẽ không biết để chạy lại Effect của bạn khi nó thay đổi.

Như bạn sẽ học bên dưới trang này, một linter sẽ kiểm tra những vấn đề này một cách tự động.

</DeepDive>

### React xác minh rằng bạn đã chỉ định mọi giá trị reactive làm dependency {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

Nếu linter của bạn được [cấu hình cho React,](/learn/editor-setup#linting) nó sẽ kiểm tra rằng mọi giá trị reactive được sử dụng bởi code Effect của bạn đều được khai báo làm dependency của nó. Ví dụ, đây là một lỗi lint vì cả `roomId` và `serverUrl` đều là reactive:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Something's wrong here!

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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

Điều này có thể trông giống như một lỗi React, nhưng thực sự React đang chỉ ra một bug trong code của bạn. Cả `roomId` và `serverUrl` đều có thể thay đổi theo thời gian, nhưng bạn đang quên đồng bộ hóa lại Effect của bạn khi chúng thay đổi. Bạn sẽ vẫn kết nối với `roomId` và `serverUrl` ban đầu ngay cả sau khi người dùng chọn các giá trị khác trong UI.

Để sửa bug, hãy làm theo gợi ý của linter để chỉ định `roomId` và `serverUrl` làm dependencies của Effect:

```js {9}
function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ All dependencies declared
  // ...
}
```

Hãy thử sửa lỗi này trong sandbox ở trên. Xác minh rằng lỗi linter đã biến mất, và chat kết nối lại khi cần thiết.

<Note>

Trong một số trường hợp, React *biết* rằng một giá trị không bao giờ thay đổi mặc dù nó được khai báo bên trong component. Ví dụ, [function `set`](/reference/react/useState#setstate) được trả về từ `useState` và object ref được trả về bởi [`useRef`](/reference/react/useRef) là *ổn định*--chúng được đảm bảo không thay đổi trong lần render lại. Các giá trị ổn định không phải là reactive, vì vậy bạn có thể bỏ qua chúng khỏi danh sách. Việc bao gồm chúng cũng được cho phép: chúng sẽ không thay đổi, vì vậy không quan trọng.

</Note>

### Làm gì khi bạn không muốn đồng bộ hóa lại {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

Trong ví dụ trước, bạn đã sửa lỗi lint bằng cách liệt kê `roomId` và `serverUrl` làm dependencies.

**Tuy nhiên, thay vào đó bạn có thể "chứng minh" với linter rằng những giá trị này không phải là giá trị reactive,** tức là chúng *không thể* thay đổi do việc render lại. Ví dụ, nếu `serverUrl` và `roomId` không phụ thuộc vào rendering và luôn có cùng giá trị, bạn có thể di chuyển chúng ra ngoài component. Bây giờ chúng không cần phải là dependencies:

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
const roomId = 'general'; // roomId is not reactive

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

Bạn cũng có thể di chuyển chúng *vào bên trong* Effect. Chúng không được tính toán trong quá trình rendering, vì vậy chúng không phải là reactive:

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
    const roomId = 'general'; // roomId is not reactive
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

**Effect là những khối code reactive.** Chúng đồng bộ hóa lại khi các giá trị bạn đọc bên trong chúng thay đổi. Không giống như event handler chỉ chạy một lần cho mỗi tương tác, Effect chạy bất cứ khi nào việc đồng bộ hóa là cần thiết.

**Bạn không thể "chọn" dependencies của mình.** Dependencies của bạn phải bao gồm mọi [giá trị reactive](#all-variables-declared-in-the-component-body-are-reactive) mà bạn đọc trong Effect. Linter thực thi điều này. Đôi khi điều này có thể dẫn đến các vấn đề như vòng lặp vô hạn và làm cho Effect của bạn đồng bộ hóa lại quá thường xuyên. Đừng sửa những vấn đề này bằng cách loại bỏ linter! Thay vào đó hãy thử những điều sau:

* **Kiểm tra rằng Effect của bạn đại diện cho một quá trình đồng bộ hóa độc lập.** Nếu Effect của bạn không đồng bộ hóa bất cứ thứ gì, [nó có thể không cần thiết.](/learn/you-might-not-need-an-effect) Nếu nó đồng bộ hóa nhiều thứ độc lập, [hãy tách nó ra.](#each-effect-represents-a-separate-synchronization-process)

* **Nếu bạn muốn đọc giá trị mới nhất của props hoặc state mà không "phản ứng" với nó và đồng bộ hóa lại Effect,** bạn có thể tách Effect của mình thành một phần reactive (mà bạn sẽ giữ trong Effect) và một phần non-reactive (mà bạn sẽ trích xuất thành thứ được gọi là *Effect Event*). [Đọc về việc tách Events khỏi Effects.](/learn/separating-events-from-effects)

* **Tránh dựa vào các object và function làm dependencies.** Nếu bạn tạo các object và function trong quá trình rendering và sau đó đọc chúng từ Effect, chúng sẽ khác nhau trong mỗi lần render. Điều này sẽ khiến Effect của bạn đồng bộ hóa lại mỗi lần. [Đọc thêm về việc loại bỏ các dependencies không cần thiết khỏi Effects.](/learn/removing-effect-dependencies)

<Pitfall>

Linter là bạn của bạn, nhưng sức mạnh của nó có hạn. Linter chỉ biết khi nào dependencies *sai*. Nó không biết cách *tốt nhất* để giải quyết từng trường hợp. Nếu linter gợi ý một dependency, nhưng việc thêm nó gây ra vòng lặp, điều đó không có nghĩa là linter nên bị bỏ qua. Bạn cần thay đổi code bên trong (hoặc bên ngoài) Effect để giá trị đó không phải là reactive và không *cần* phải là dependency.

Nếu bạn có một codebase hiện có, bạn có thể có một số Effect loại bỏ linter như thế này:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

Trên [trang](/learn/separating-events-from-effects) [tiếp theo](/learn/removing-effect-dependencies), bạn sẽ học cách sửa code này mà không vi phạm các quy tắc. Việc sửa luôn đáng giá!

</Pitfall>

<Recap>

- Các component có thể mount, update, và unmount.
- Mỗi Effect có một vòng đời riêng biệt với component xung quanh.
- Mỗi Effect mô tả một quá trình đồng bộ hóa riêng biệt có thể *bắt đầu* và *dừng*.
- Khi bạn viết và đọc Effect, hãy suy nghĩ từ góc độ của từng Effect riêng lẻ (cách bắt đầu và dừng đồng bộ hóa) thay vì từ góc độ của component (cách nó mount, update, hoặc unmount).
- Các giá trị được khai báo bên trong body component là "reactive".
- Các giá trị reactive nên đồng bộ hóa lại Effect vì chúng có thể thay đổi theo thời gian.
- Linter xác minh rằng tất cả các giá trị reactive được sử dụng bên trong Effect đều được chỉ định làm dependencies.
- Tất cả các lỗi được linter đánh dấu đều hợp lệ. Luôn có cách để sửa code để không vi phạm các quy tắc.

</Recap>

<Challenges>

#### Sửa lỗi kết nối lại sau mỗi phím gõ {/*fix-reconnecting-on-every-keystroke*/}

Trong ví dụ này, component `ChatRoom` kết nối với phòng chat khi component mount, ngắt kết nối khi nó unmount, và kết nối lại khi bạn chọn một phòng chat khác. Hành vi này là đúng, vì vậy bạn cần giữ nó hoạt động.

Tuy nhiên, có một vấn đề. Bất cứ khi nào bạn gõ vào ô input tin nhắn ở phía dưới, `ChatRoom` *cũng* kết nối lại với chat. (Bạn có thể nhận thấy điều này bằng cách xóa console và gõ vào input.) Hãy sửa vấn đề để điều này không xảy ra.

<Hint>

Bạn có thể cần thêm một mảng dependency cho Effect này. Những dependency nào nên có ở đây?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

<Solution>

Effect này không có mảng dependency nào cả, vì vậy nó đồng bộ hóa lại sau mỗi lần render lại. Đầu tiên, hãy thêm một mảng dependency. Sau đó, đảm bảo rằng mọi giá trị reactive được sử dụng bởi Effect đều được chỉ định trong mảng. Ví dụ, `roomId` là reactive (vì nó là một prop), vì vậy nó nên được bao gồm trong mảng. Điều này đảm bảo rằng khi người dùng chọn một phòng khác, chat sẽ kết nối lại. Mặt khác, `serverUrl` được định nghĩa bên ngoài component. Đây là lý do tại sao nó không cần phải có trong mảng.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

</Solution>

#### Bật và tắt đồng bộ hóa {/*switch-synchronization-on-and-off*/}

Trong ví dụ này, một Effect subscribe vào sự kiện [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) của window để di chuyển một chấm màu hồng trên màn hình. Hãy thử di chuyển con trỏ chuột qua vùng preview (hoặc chạm vào màn hình nếu bạn đang dùng thiết bị di động), và xem chấm màu hồng theo dõi chuyển động của bạn như thế nào.

Ngoài ra còn có một checkbox. Tích vào checkbox sẽ thay đổi biến state `canMove`, nhưng biến state này không được sử dụng ở đâu trong code. Nhiệm vụ của bạn là thay đổi code để khi `canMove` là `false` (checkbox bị bỏ tích), chấm sẽ ngừng di chuyển. Sau khi bạn tích lại checkbox (và đặt `canMove` thành `true`), ô sẽ theo dõi chuyển động trở lại. Nói cách khác, việc chấm có thể di chuyển hay không nên được đồng bộ hóa với việc checkbox có được tích hay không.

<Hint>

Bạn không thể khai báo một Effect một cách có điều kiện. Tuy nhiên, code bên trong Effect có thể sử dụng điều kiện!

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
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

<Solution>

Một giải pháp là bọc cuộc gọi `setPosition` vào trong một điều kiện `if (canMove) { ... }`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

Ngoài ra, bạn có thể bọc logic *event subscription* vào trong một điều kiện `if (canMove) { ... }`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

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

Trong cả hai trường hợp này, `canMove` là một biến reactive mà bạn đọc bên trong Effect. Đây là lý do tại sao nó phải được chỉ định trong danh sách dependencies của Effect. Điều này đảm bảo rằng Effect đồng bộ hóa lại sau mỗi thay đổi giá trị của nó.

</Solution>

#### Điều tra bug giá trị cũ {/*investigate-a-stale-value-bug*/}

Trong ví dụ này, chấm màu hồng nên di chuyển khi checkbox được bật, và nên ngừng di chuyển khi checkbox bị tắt. Logic cho điều này đã được triển khai: event handler `handleMove` kiểm tra biến state `canMove`.

Tuy nhiên, vì lý do nào đó, biến state `canMove` bên trong `handleMove` dường như "cũ": nó luôn là `true`, ngay cả sau khi bạn bỏ tích checkbox. Làm sao điều này có thể xảy ra? Hãy tìm lỗi trong code và sửa nó.

<Hint>

Nếu bạn thấy một quy tắc linter bị loại bỏ, hãy gỡ bỏ việc loại bỏ đó! Đó thường là nơi có lỗi.

</Hint>

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

<Solution>

Vấn đề với code gốc là việc loại bỏ dependency linter. Nếu bạn gỡ bỏ việc loại bỏ đó, bạn sẽ thấy rằng Effect này phụ thuộc vào function `handleMove`. Điều này có ý nghĩa: `handleMove` được khai báo bên trong body component, điều này làm cho nó trở thành một giá trị reactive. Mọi giá trị reactive đều phải được chỉ định làm dependency, hoặc nó có thể trở nên cũ theo thời gian!

Tác giả của code gốc đã "nói dối" React bằng cách nói rằng Effect không phụ thuộc (`[]`) vào bất kỳ giá trị reactive nào. Đây là lý do tại sao React không đồng bộ hóa lại Effect sau khi `canMove` đã thay đổi (và `handleMove` cùng với nó). Bởi vì React không đồng bộ hóa lại Effect, `handleMove` được gắn làm listener là function `handleMove` được tạo ra trong lần render ban đầu. Trong lần render ban đầu, `canMove` là `true`, đây là lý do tại sao `handleMove` từ lần render ban đầu sẽ mãi mãi thấy giá trị đó.

**Nếu bạn không bao giờ loại bỏ linter, bạn sẽ không bao giờ thấy các vấn đề với giá trị cũ.** Có một vài cách khác nhau để giải quyết bug này, nhưng bạn nên luôn bắt đầu bằng việc gỡ bỏ việc loại bỏ linter. Sau đó thay đổi code để sửa lỗi lint.

Bạn có thể thay đổi dependencies của Effect thành `[handleMove]`, nhưng vì nó sẽ là một function được định nghĩa mới cho mỗi lần render, bạn có thể gỡ bỏ hoàn toàn mảng dependencies. Khi đó Effect *sẽ* đồng bộ hóa lại sau mỗi lần render lại:

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
  });

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

Giải pháp này hoạt động, nhưng không lý tưởng. Nếu bạn đặt `console.log('Resubscribing')` bên trong Effect, bạn sẽ nhận thấy rằng nó subscribe lại sau mỗi lần render lại. Việc subscribe lại nhanh, nhưng sẽ tốt hơn nếu tránh làm điều đó quá thường xuyên.

Một cách sửa tốt hơn là di chuyển function `handleMove` *vào bên trong* Effect. Khi đó `handleMove` sẽ không phải là một giá trị reactive, và do đó Effect của bạn sẽ không phụ thuộc vào một function. Thay vào đó, nó sẽ cần phụ thuộc vào `canMove` mà code của bạn hiện đọc từ bên trong Effect. Điều này khớp với hành vi bạn muốn, vì Effect của bạn bây giờ sẽ được đồng bộ hóa với giá trị của `canMove`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

Hãy thử thêm `console.log('Resubscribing')` vào bên trong body Effect và lưu ý rằng bây giờ nó chỉ subscribe lại khi bạn bật/tắt checkbox (`canMove` thay đổi) hoặc chỉnh sửa code. Điều này làm cho nó tốt hơn cách tiếp cận trước đó luôn subscribe lại.

Bạn sẽ học một cách tiếp cận tổng quát hơn cho loại vấn đề này trong [Tách Events khỏi Effects.](/learn/separating-events-from-effects)

</Solution>

#### Sửa lỗi chuyển đổi kết nối {/*fix-a-connection-switch*/}

Trong ví dụ này, dịch vụ chat trong `chat.js` cung cấp hai API khác nhau: `createEncryptedConnection` và `createUnencryptedConnection`. Component `App` gốc cho phép người dùng chọn có sử dụng mã hóa hay không, và sau đó truyền method API tương ứng xuống component con `ChatRoom` như prop `createConnection`.

Lưu ý rằng ban đầu, các log console nói rằng kết nối không được mã hóa. Hãy thử bật checkbox: không có gì sẽ xảy ra. Tuy nhiên, nếu bạn thay đổi phòng được chọn sau đó, thì chat sẽ kết nối lại *và* bật mã hóa (như bạn sẽ thấy từ các tin nhắn console). Đây là một bug. Hãy sửa bug để việc bật/tắt checkbox *cũng* khiến chat kết nối lại.

<Hint>

Việc loại bỏ linter luôn đáng nghi ngờ. Đây có thể là một bug không?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Nếu bạn gỡ bỏ việc loại bỏ linter, bạn sẽ thấy một lỗi lint. Vấn đề là `createConnection` là một prop, vì vậy nó là một giá trị reactive. Nó có thể thay đổi theo thời gian! (Và thực sự, nó nên như vậy--khi người dùng tích checkbox, component cha truyền một giá trị khác của prop `createConnection`.) Đây là lý do tại sao nó nên là một dependency. Hãy bao gồm nó trong danh sách để sửa bug:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Việc `createConnection` là một dependency là đúng. Tuy nhiên, code này hơi dễ vỡ vì ai đó có thể chỉnh sửa component `App` để truyền một inline function làm giá trị của prop này. Trong trường hợp đó, giá trị của nó sẽ khác nhau mỗi khi component `App` render lại, vì vậy Effect có thể đồng bộ hóa lại quá thường xuyên. Để tránh điều này, bạn có thể truyền `isEncrypted` xuống thay thế:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Trong phiên bản này, component `App` truyền một boolean prop thay vì một function. Bên trong Effect, bạn quyết định function nào để sử dụng. Vì cả `createEncryptedConnection` và `createUnencryptedConnection` đều được khai báo bên ngoài component, chúng không phải là reactive, và không cần phải là dependencies. Bạn sẽ học thêm về điều này trong [Loại bỏ Dependencies của Effect.](/learn/removing-effect-dependencies)

</Solution>

#### Điền vào chuỗi các ô select {/*populate-a-chain-of-select-boxes*/}

Trong ví dụ này, có hai ô select. Một ô select cho phép người dùng chọn một hành tinh. Ô select khác cho phép người dùng chọn một địa điểm *trên hành tinh đó.* Ô thứ hai chưa hoạt động. Nhiệm vụ của bạn là làm cho nó hiển thị các địa điểm trên hành tinh được chọn.

Hãy xem cách ô select đầu tiên hoạt động. Nó điền vào state `planetList` với kết quả từ cuộc gọi API `"/planets"`. ID của hành tinh hiện tại được chọn được lưu trong biến state `planetId`. Bạn cần tìm nơi để thêm một số code bổ sung để biến state `placeList` được điền với kết quả của cuộc gọi API `"/planets/" + planetId + "/places"`.

Nếu bạn triển khai đúng, việc chọn một hành tinh sẽ điền vào danh sách địa điểm. Thay đổi một hành tinh sẽ thay đổi danh sách địa điểm.

<Hint>

Nếu bạn có hai quá trình đồng bộ hóa độc lập, bạn cần viết hai Effect riêng biệt.

</Hint>

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Có hai quá trình đồng bộ hóa độc lập:

- Ô select đầu tiên được đồng bộ hóa với danh sách hành tinh từ xa.
- Ô select thứ hai được đồng bộ hóa với danh sách địa điểm từ xa cho `planetId` hiện tại.

Đây là lý do tại sao việc mô tả chúng như hai Effect riêng biệt là hợp lý. Đây là một ví dụ về cách bạn có thể làm điều này:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // Nothing is selected in the first box yet
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Fetched a list of places on "' + planetId + '".');
        setPlaceList(result);
        setPlaceId(result[0].id); // Select the first place
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Code này hơi lặp lại. Tuy nhiên, đó không phải là lý do tốt để kết hợp nó thành một Effect duy nhất! Nếu bạn làm điều này, bạn sẽ phải kết hợp dependencies của cả hai Effect thành một danh sách, và sau đó việc thay đổi hành tinh sẽ fetch lại danh sách tất cả các hành tinh. Effect không phải là một công cụ để tái sử dụng code.

Thay vào đó, để giảm sự lặp lại, bạn có thể trích xuất một số logic thành một custom Hook như `useSelectOptions` bên dưới:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '...'} on {planetId || '...'} </p>
    </>
  );
}
```

```js src/useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Kiểm tra tab `useSelectOptions.js` trong sandbox để xem cách nó hoạt động. Lý tưởng nhất là hầu hết các Effect trong ứng dụng của bạn cuối cùng nên được thay thế bằng các custom Hook, cho dù được viết bởi bạn hay bởi cộng đồng. Các custom Hook ẩn logic đồng bộ hóa, vì vậy component gọi không biết về Effect. Khi bạn tiếp tục làm việc trên ứng dụng của mình, bạn sẽ phát triển một bộ sưu tập các Hook để lựa chọn, và cuối cùng bạn sẽ không cần viết Effect trong các component của mình thường xuyên nữa.

</Solution>

</Challenges>
