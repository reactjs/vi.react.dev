---
title: 'Loại bỏ các dependency không cần thiết của Effect'
---

<Intro>

Khi bạn viết một Effect, linter sẽ xác minh rằng bạn đã bao gồm mọi giá trị reactive (như props và state) mà Effect đọc trong danh sách các dependency của Effect đó. Điều này đảm bảo rằng Effect của bạn luôn đồng bộ với props và state mới nhất của component. Các dependency không cần thiết có thể khiến Effect chạy quá thường xuyên, hoặc thậm chí tạo ra một vòng lặp vô hạn. Hãy làm theo hướng dẫn này để xem xét và loại bỏ các dependency không cần thiết khỏi Effect của bạn.

</Intro>

<YouWillLearn>

- Cách sửa vòng lặp dependency Effect vô hạn
- Phải làm gì khi bạn muốn loại bỏ một dependency
- Cách đọc một giá trị từ Effect mà không "phản ứng" với nó
- Cách và tại sao nên tránh các dependency là object và function
- Tại sao việc bỏ qua dependency linter là nguy hiểm, và phải làm gì thay thế

</YouWillLearn>

## Các dependency nên khớp với code {/*dependencies-should-match-the-code*/}

Khi bạn viết một Effect, trước tiên bạn chỉ định cách [bắt đầu và dừng](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) những gì bạn muốn Effect thực hiện:

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

Sau đó, nếu bạn để các dependency của Effect trống (`[]`), linter sẽ gợi ý các dependency đúng:

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
  }, []); // <-- Fix the mistake here!
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

Điền chúng theo những gì linter nói:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

[Effect "phản ứng" với các giá trị reactive.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Vì `roomId` là một giá trị reactive (nó có thể thay đổi do một lần render lại), linter xác minh rằng bạn đã chỉ định nó như một dependency. Nếu `roomId` nhận một giá trị khác, React sẽ đồng bộ lại Effect của bạn. Điều này đảm bảo rằng cuộc trò chuyện luôn kết nối với phòng được chọn và "phản ứng" với dropdown:

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

### Để loại bỏ một dependency, hãy chứng minh rằng nó không phải là dependency {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

Lưu ý rằng bạn không thể "chọn" các dependency của Effect. Mọi <CodeStep step={2}>giá trị reactive</CodeStep> được sử dụng bởi code Effect của bạn đều phải được khai báo trong danh sách dependency của bạn. Danh sách dependency được xác định bởi code xung quanh:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // This is a reactive value
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads that reactive value
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ So you must specify that reactive value as a dependency of your Effect
  // ...
}
```

[Giá trị reactive](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) bao gồm props và tất cả các biến và function được khai báo trực tiếp bên trong component của bạn. Vì `roomId` là một giá trị reactive, bạn không thể loại bỏ nó khỏi danh sách dependency. Linter sẽ không cho phép:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'roomId'
  // ...
}
```

Và linter sẽ đúng! Vì `roomId` có thể thay đổi theo thời gian, điều này sẽ tạo ra một bug trong code của bạn.

**Để loại bỏ một dependency, hãy "chứng minh" cho linter rằng nó *không cần* phải là một dependency.** Ví dụ, bạn có thể di chuyển `roomId` ra khỏi component để chứng minh rằng nó không reactive và sẽ không thay đổi khi render lại:

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // Not a reactive value anymore

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
}
```

Bây giờ `roomId` không phải là một giá trị reactive (và không thể thay đổi khi render lại), nó không cần phải là một dependency:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
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

Đây là lý do tại sao bây giờ bạn có thể chỉ định [danh sách dependency trống (`[]`)](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means). Effect của bạn *thực sự không* phụ thuộc vào bất kỳ giá trị reactive nào nữa, vì vậy nó *thực sự không* cần chạy lại khi bất kỳ props hoặc state nào của component thay đổi.

### Để thay đổi các dependency, hãy thay đổi code {/*to-change-the-dependencies-change-the-code*/}

Bạn có thể nhận thấy một mô hình trong quy trình làm việc của mình:

1. Trước tiên, bạn **thay đổi code** của Effect hoặc cách các giá trị reactive được khai báo.
2. Sau đó, bạn làm theo linter và điều chỉnh các dependency để **khớp với code bạn đã thay đổi.**
3. Nếu bạn không hài lòng với danh sách dependency, bạn **quay lại bước đầu tiên** (và thay đổi code lại).

Phần cuối cùng rất quan trọng. **Nếu bạn muốn thay đổi các dependency, hãy thay đổi code xung quanh trước.** Bạn có thể nghĩ về danh sách dependency như [một danh sách tất cả các giá trị reactive được sử dụng bởi code Effect của bạn.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Bạn không *chọn* cái gì để đưa vào danh sách đó. Danh sách *mô tả* code của bạn. Để thay đổi danh sách dependency, hãy thay đổi code.

Điều này có thể giống như việc giải một phương trình. Bạn có thể bắt đầu với một mục tiêu (ví dụ, để loại bỏ một dependency), và bạn cần "tìm" code phù hợp với mục tiêu đó. Không phải ai cũng thấy việc giải phương trình thú vị, và điều tương tự có thể nói về việc viết Effect! May mắn thay, có một danh sách các công thức phổ biến mà bạn có thể thử bên dưới.

<Pitfall>

Nếu bạn có một codebase hiện có, bạn có thể có một số Effect bỏ qua linter như thế này:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Khi các dependency không khớp với code, có nguy cơ rất cao sẽ tạo ra bug.** Bằng cách bỏ qua linter, bạn "nói dối" React về các giá trị mà Effect của bạn phụ thuộc vào.

Thay vào đó, hãy sử dụng các kỹ thuật bên dưới.

</Pitfall>

<DeepDive>

#### Tại sao việc bỏ qua dependency linter lại nguy hiểm? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

Việc bỏ qua linter dẫn đến những bug rất khó hiểu và khó tìm và sửa. Đây là một ví dụ:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
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

Giả sử bạn muốn chạy Effect "chỉ khi mount". Bạn đã đọc rằng [dependency trống (`[]`)](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) làm điều đó, vì vậy bạn quyết định bỏ qua linter, và cưỡng chế chỉ định `[]` làm dependency.

Bộ đếm này được cho là sẽ tăng mỗi giây theo số lượng có thể cấu hình bằng hai nút. Tuy nhiên, vì bạn đã "nói dối" React rằng Effect này không phụ thuộc vào gì, React mãi mãi tiếp tục sử dụng function `onTick` từ lần render ban đầu. [Trong lần render đó,](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count` là `0` và `increment` là `1`. Đây là lý do tại sao `onTick` từ lần render đó luôn gọi `setCount(0 + 1)` mỗi giây, và bạn luôn thấy `1`. Những bug như thế này khó sửa hơn khi chúng lan rộng qua nhiều component.

Luôn có một giải pháp tốt hơn việc bỏ qua linter! Để sửa code này, bạn cần thêm `onTick` vào danh sách dependency. (Để đảm bảo interval chỉ được thiết lập một lần, [làm `onTick` thành một Effect Event.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))

**Chúng tôi khuyến nghị coi lỗi lint dependency như một lỗi biên dịch. Nếu bạn không bỏ qua nó, bạn sẽ không bao giờ thấy những bug như thế này.** Phần còn lại của trang này tài liệu hóa các giải pháp thay thế cho trường hợp này và các trường hợp khác.

</DeepDive>

## Loại bỏ các dependency không cần thiết {/*removing-unnecessary-dependencies*/}

Mỗi khi bạn điều chỉnh các dependency của Effect để phản ánh code, hãy nhìn vào danh sách dependency. Có hợp lý không khi Effect chạy lại khi bất kỳ dependency nào trong số này thay đổi? Đôi khi, câu trả lời là "không":

* Bạn có thể muốn thực thi lại *các phần khác nhau* của Effect trong những điều kiện khác nhau.
* Bạn có thể chỉ muốn đọc *giá trị mới nhất* của một số dependency thay vì "phản ứng" với những thay đổi của nó.
* Một dependency có thể thay đổi quá thường xuyên *một cách không cố ý* vì nó là một object hoặc function.

Để tìm giải pháp đúng, bạn sẽ cần trả lời một vài câu hỏi về Effect của mình. Hãy cùng xem qua chúng.

### Code này có nên chuyển sang event handler không? {/*should-this-code-move-to-an-event-handler*/}

Điều đầu tiên bạn nên nghĩ đến là liệu code này có nên là một Effect hay không.

Hãy tưởng tượng một form. Khi submit, bạn đặt biến state `submitted` thành `true`. Bạn cần gửi một POST request và hiển thị một thông báo. Bạn đã đặt logic này bên trong một Effect "phản ứng" với `submitted` là `true`:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Sau đó, bạn muốn tạo kiểu cho thông báo theo theme hiện tại, vì vậy bạn đọc theme hiện tại. Vì `theme` được khai báo trong thân component, nó là một giá trị reactive, vì vậy bạn thêm nó như một dependency:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ All dependencies declared

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

Bằng cách làm điều này, bạn đã tạo ra một bug. Hãy tưởng tượng bạn submit form trước, sau đó chuyển đổi giữa theme Dark và Light. `theme` sẽ thay đổi, Effect sẽ chạy lại, và vì vậy nó sẽ hiển thị cùng một thông báo lần nữa!

**Vấn đề ở đây là điều này không nên là một Effect ngay từ đầu.** Bạn muốn gửi POST request này và hiển thị thông báo để phản hồi việc *submit form,* đó là một tương tác cụ thể. Để chạy một số code phản hồi tương tác cụ thể, hãy đặt logic đó trực tiếp vào event handler tương ứng:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Good: Event-specific logic is called from event handlers
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }  

  // ...
}
```

Bây giờ code ở trong event handler, nó không phải là reactive--vì vậy nó sẽ chỉ chạy khi người dùng submit form. Đọc thêm về [lựa chọn giữa event handler và Effect](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) và [cách xóa các Effect không cần thiết.](/learn/you-might-not-need-an-effect)

### Effect của bạn có đang làm nhiều việc không liên quan không? {/*is-your-effect-doing-several-unrelated-things*/}

Câu hỏi tiếp theo bạn nên tự hỏi là liệu Effect của bạn có đang làm nhiều việc không liên quan.

Hãy tưởng tượng bạn đang tạo một form vận chuyển nơi người dùng cần chọn thành phố và khu vực của họ. Bạn fetch danh sách `cities` từ server theo `country` được chọn để hiển thị chúng trong dropdown:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

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
  }, [country]); // ✅ All dependencies declared

  // ...
```

Đây là một ví dụ tốt về [fetch data trong Effect.](/learn/you-might-not-need-an-effect#fetching-data) Bạn đang đồng bộ state `cities` với mạng theo prop `country`. Bạn không thể làm điều này trong event handler vì bạn cần fetch ngay khi `ShippingForm` được hiển thị và bất cứ khi nào `country` thay đổi (bất kể tương tác nào gây ra).

Bây giờ, giả sử bạn đang thêm một select box thứ hai cho các khu vực thành phố, sẽ fetch `areas` cho `city` hiện tại được chọn. Bạn có thể bắt đầu bằng cách thêm một cuộc gọi `fetch` thứ hai cho danh sách các khu vực bên trong cùng một Effect:

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Avoid: A single Effect synchronizes two independent processes
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ All dependencies declared

  // ...
```

Tuy nhiên, vì Effect bây giờ sử dụng biến state `city`, bạn đã phải thêm `city` vào danh sách dependency. Điều đó, lần lượt, gây ra một vấn đề: khi người dùng chọn một thành phố khác, Effect sẽ chạy lại và gọi `fetchCities(country)`. Kết quả là, bạn sẽ fetch lại danh sách các thành phố một cách không cần thiết nhiều lần.

**Vấn đề với code này là bạn đang đồng bộ hai thứ khác nhau không liên quan:**

1. Bạn muốn đồng bộ state `cities` với mạng dựa trên prop `country`.
1. Bạn muốn đồng bộ state `areas` với mạng dựa trên state `city`.

Chia logic thành hai Effect, mỗi Effect phản ứng với prop mà nó cần đồng bộ:

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
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
  }, [country]); // ✅ All dependencies declared

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
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
  }, [city]); // ✅ All dependencies declared

  // ...
```

Bây giờ Effect đầu tiên chỉ chạy lại nếu `country` thay đổi, trong khi Effect thứ hai chạy lại khi `city` thay đổi. Bạn đã tách chúng theo mục đích: hai thứ khác nhau được đồng bộ bởi hai Effect riêng biệt. Hai Effect riêng biệt có hai danh sách dependency riêng biệt, vì vậy chúng sẽ không kích hoạt lẫn nhau một cách không cố ý.

Code cuối cùng dài hơn bản gốc, nhưng tách các Effect này vẫn đúng. [Mỗi Effect nên đại diện cho một quá trình đồng bộ độc lập.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) Trong ví dụ này, xóa một Effect không phá vỡ logic của Effect khác. Điều này có nghĩa là chúng *đồng bộ những thứ khác nhau,* và việc tách chúng ra là tốt. Nếu bạn lo lắng về việc trùng lặp, bạn có thể cải thiện code này bằng cách [trích xuất logic lặp lại thành một custom Hook.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

### Bạn có đang đọc một số state để tính toán state tiếp theo không? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

Effect này cập nhật biến state `messages` với một array mới được tạo mỗi khi có tin nhắn mới đến:

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

Nó sử dụng biến `messages` để [tạo một array mới](/learn/updating-arrays-in-state) bắt đầu với tất cả các tin nhắn hiện có và thêm tin nhắn mới vào cuối. Tuy nhiên, vì `messages` là một giá trị reactive được đọc bởi Effect, nó phải là một dependency:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ All dependencies declared
  // ...
```

Và việc làm `messages` thành dependency gây ra một vấn đề.

Mỗi khi bạn nhận được tin nhắn, `setMessages()` khiến component render lại với một array `messages` mới bao gồm tin nhắn đã nhận. Tuy nhiên, vì Effect này bây giờ phụ thuộc vào `messages`, điều này cũng sẽ đồng bộ lại Effect. Vì vậy, mỗi tin nhắn mới sẽ làm cho chat kết nối lại. Người dùng sẽ không thích điều đó!

Để sửa vấn đề, đừng đọc `messages` bên trong Effect. Thay vào đó, truyền một [updater function](/reference/react/useState#updating-state-based-on-the-previous-state) cho `setMessages`:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

**Lưu ý cách Effect của bạn không đọc biến `messages` chút nào bây giờ.** Bạn chỉ cần truyền một updater function như `msgs => [...msgs, receivedMessage]`. React [đặt updater function của bạn vào một hàng đợi](/learn/queueing-a-series-of-state-updates) và sẽ cung cấp tham số `msgs` cho nó trong lần render tiếp theo. Đây là lý do tại sao bản thân Effect không cần phụ thuộc vào `messages` nữa. Kết quả của việc sửa này, việc nhận tin nhắn chat sẽ không còn làm cho chat kết nối lại.

### Bạn có muốn đọc một giá trị mà không "phản ứng" với những thay đổi của nó không? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

Phần này mô tả một **API thử nghiệm chưa được phát hành** trong phiên bản ổn định của React.

</Wip>

Giả sử bạn muốn phát âm thanh khi người dùng nhận tin nhắn mới trừ khi `isMuted` là `true`:

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

Vì Effect của bạn bây giờ sử dụng `isMuted` trong code, bạn phải thêm nó vào dependency:

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ All dependencies declared
  // ...
```

Vấn đề là mỗi khi `isMuted` thay đổi (ví dụ, khi người dùng nhấn nút "Muted"), Effect sẽ đồng bộ lại và kết nối lại với chat. Đây không phải là trải nghiệm người dùng mong muốn! (Trong ví dụ này, ngay cả việc vô hiệu hóa linter cũng không hoạt động--nếu bạn làm vậy, `isMuted` sẽ bị "kẹt" với giá trị cũ.)

Để giải quyết vấn đề này, bạn cần trích xuất logic không nên là reactive ra khỏi Effect. Bạn không muốn Effect này "phản ứng" với những thay đổi trong `isMuted`. [Di chuyển đoạn logic không reactive này vào một Effect Event:](/learn/separating-events-from-effects#declaring-an-effect-event)

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Effect Event cho phép bạn chia một Effect thành các phần reactive (nên "phản ứng" với các giá trị reactive như `roomId` và những thay đổi của chúng) và các phần không reactive (chỉ đọc các giá trị mới nhất của chúng, như `onMessage` đọc `isMuted`). **Bây giờ bạn đọc `isMuted` bên trong Effect Event, nó không cần phải là dependency của Effect.** Kết quả là, chat sẽ không kết nối lại khi bạn bật/tắt cài đặt "Muted", giải quyết vấn đề ban đầu!

#### Bao bọc event handler từ props {/*wrapping-an-event-handler-from-the-props*/}

Bạn có thể gặp phải vấn đề tương tự khi component nhận event handler như một prop:

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ All dependencies declared
  // ...
```

Giả sử component cha truyền một function `onReceiveMessage` *khác* trong mỗi lần render:

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

Vì `onReceiveMessage` là một dependency, nó sẽ khiến Effect đồng bộ lại sau mỗi lần component cha render lại. Điều này sẽ làm cho nó kết nối lại với chat. Để giải quyết điều này, hãy bao bọc cuộc gọi trong Effect Event:

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Effect Event không phải là reactive, vì vậy bạn không cần chỉ định chúng làm dependency. Kết quả là, chat sẽ không còn kết nối lại ngay cả khi component cha truyền một function khác trong mỗi lần render lại.

#### Tách code reactive và không reactive {/*separating-reactive-and-non-reactive-code*/}

Trong ví dụ này, bạn muốn ghi log một lần visit mỗi khi `roomId` thay đổi. Bạn muốn bao gồm `notificationCount` hiện tại với mọi log, nhưng bạn *không* muốn một thay đổi trong `notificationCount` kích hoạt sự kiện log.

Giải pháp một lần nữa là tách code không reactive vào Effect Event:

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

Bạn muốn logic của mình reactive đối với `roomId`, vì vậy bạn đọc `roomId` bên trong Effect. Tuy nhiên, bạn không muốn thay đổi `notificationCount` ghi log thêm visit, vì vậy bạn đọc `notificationCount` bên trong Effect Event. [Tìm hiểu thêm về việc đọc props và state mới nhất từ Effect bằng Effect Event.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### Có giá trị reactive nào thay đổi một cách không cố ý không? {/*does-some-reactive-value-change-unintentionally*/}

Đôi khi, bạn *thực sự* muốn Effect "phản ứng" với một giá trị nhất định, nhưng giá trị đó thay đổi thường xuyên hơn bạn muốn--và có thể không phản ánh bất kỳ thay đổi thực tế nào từ góc độ người dùng. Ví dụ, giả sử bạn tạo một object `options` trong thân component của mình, và sau đó đọc object đó từ bên trong Effect:

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Object này được khai báo trong thân component, vì vậy nó là một [giá trị reactive.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Khi bạn đọc một giá trị reactive như thế này bên trong Effect, bạn khai báo nó như một dependency. Điều này đảm bảo Effect của bạn "phản ứng" với những thay đổi của nó:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

Việc khai báo nó như một dependency là rất quan trọng! Điều này đảm bảo, ví dụ, nếu `roomId` thay đổi, Effect của bạn sẽ kết nối lại với chat với `options` mới. Tuy nhiên, cũng có một vấn đề với code ở trên. Để thấy điều đó, hãy thử gõ vào input trong sandbox bên dưới, và xem điều gì xảy ra trong console:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Temporarily disable the linter to demonstrate the problem
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

Trong sandbox ở trên, input chỉ cập nhật biến state `message`. Từ góc độ người dùng, điều này không nên ảnh hưởng đến kết nối chat. Tuy nhiên, mỗi khi bạn cập nhật `message`, component của bạn sẽ render lại. Khi component render lại, code bên trong nó chạy lại từ đầu.

Một object `options` mới được tạo từ đầu mỗi khi `ChatRoom` component render lại. React thấy rằng object `options` là một *object khác* với object `options` được tạo trong lần render trước. Đây là lý do tại sao nó đồng bộ lại Effect của bạn (phụ thuộc vào `options`), và chat kết nối lại khi bạn gõ.

**Vấn đề này chỉ ảnh hưởng đến object và function. Trong JavaScript, mỗi object và function mới được tạo ra đều được coi là khác biệt với tất cả các object/function khác. Không quan trọng nội dung bên trong chúng có giống nhau hay không!**

```js {7-8}
// During the first render
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// During the next render
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// These are two different objects!
console.log(Object.is(options1, options2)); // false
```

**Các dependency là object và function có thể khiến Effect đồng bộ lại thường xuyên hơn bạn cần.** 

Đây là lý do tại sao, bất cứ khi nào có thể, bạn nên cố gắng tránh các object và function làm dependency của Effect. Thay vào đó, hãy thử di chuyển chúng ra ngoài component, vào trong Effect, hoặc trích xuất các giá trị nguyên thủy từ chúng.

#### Di chuyển các object và function tĩnh ra ngoài component {/*move-static-objects-and-functions-outside-your-component*/}

Nếu object không phụ thuộc vào bất kỳ props và state nào, bạn có thể di chuyển object đó ra ngoài component:

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

Bằng cách này, bạn *chứng minh* cho linter rằng nó không reactive. Nó không thể thay đổi do kết quả của việc render lại, vì vậy nó không cần phải là một dependency. Bây giờ việc render lại `ChatRoom` sẽ không khiến Effect của bạn đồng bộ lại.

Điều này cũng hoạt động cho function:

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

Vì `createOptions` được khai báo bên ngoài component của bạn, nó không phải là một giá trị reactive. Đây là lý do tại sao nó không cần được chỉ định trong các dependency của Effect, và tại sao nó sẽ không bao giờ khiến Effect của bạn đồng bộ lại.

#### Di chuyển các object và function động vào trong Effect {/*move-dynamic-objects-and-functions-inside-your-effect*/}

Nếu object của bạn phụ thuộc vào một số giá trị reactive có thể thay đổi do kết quả của việc render lại, như một prop `roomId`, bạn không thể kéo nó ra *bên ngoài* component. Tuy nhiên, bạn có thể di chuyển việc tạo nó *vào trong* code Effect của bạn:

```js {7-10,11,14}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Bây giờ `options` được khai báo bên trong Effect của bạn, nó không còn là dependency của Effect nữa. Thay vào đó, giá trị reactive duy nhất được sử dụng bởi Effect là `roomId`. Vì `roomId` không phải là object hoặc function, bạn có thể chắc chắn rằng nó sẽ không *vô tình* khác biệt. Trong JavaScript, number và string được so sánh theo nội dung của chúng:

```js {7-8}
// During the first render
const roomId1 = 'music';

// During the next render
const roomId2 = 'music';

// These two strings are the same!
console.log(Object.is(roomId1, roomId2)); // true
```

Nhờ vào sửa chữa này, chat không còn kết nối lại nếu bạn chỉnh sửa input:

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

Tuy nhiên, nó *có* kết nối lại khi bạn thay đổi dropdown `roomId`, như bạn mong đợi.

Điều này cũng hoạt động với các function:

```js {7-12,14}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Bạn có thể viết các function của riêng mình để nhóm các phần logic bên trong Effect. Miễn là bạn cũng khai báo chúng *bên trong* Effect, chúng không phải là giá trị reactive, và vì vậy chúng không cần phải là dependency của Effect.

#### Đọc các giá trị nguyên thủy từ object {/*read-primitive-values-from-objects*/}

Đôi khi, bạn có thể nhận một object từ props:

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

Rủi ro ở đây là component cha sẽ tạo object trong quá trình rendering:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

Điều này sẽ khiến Effect của bạn kết nối lại mỗi khi component cha render lại. Để sửa điều này, hãy đọc thông tin từ object *bên ngoài* Effect, và tránh có các dependency là object và function:

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

Logic trở nên hơi lặp lại (bạn đọc một số giá trị từ object bên ngoài Effect, và sau đó tạo một object với các giá trị giống nhau bên trong Effect). Nhưng nó làm cho việc Effect của bạn *thực sự* phụ thuộc vào thông tin gì trở nên rất rõ ràng. Nếu một object được tạo lại một cách không cố ý bởi component cha, chat sẽ không kết nối lại. Tuy nhiên, nếu `options.roomId` hoặc `options.serverUrl` thực sự khác, chat sẽ kết nối lại.

#### Tính toán các giá trị nguyên thủy từ function {/*calculate-primitive-values-from-functions*/}

Cách tiếp cận tương tự có thể hoạt động cho function. Ví dụ, giả sử component cha truyền một function:

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

Để tránh làm cho nó trở thành dependency (và khiến nó kết nối lại khi render lại), hãy gọi nó bên ngoài Effect. Điều này cung cấp cho bạn các giá trị `roomId` và `serverUrl` không phải là object, và bạn có thể đọc từ bên trong Effect:

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

Điều này chỉ hoạt động cho các [function thuần khiết](/learn/keeping-components-pure) vì chúng an toàn để gọi trong quá trình rendering. Nếu function của bạn là một event handler, nhưng bạn không muốn những thay đổi của nó đồng bộ lại Effect, [hãy bao bọc nó vào một Effect Event thay thế.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- Các dependency nên luôn khớp với code.
- Khi bạn không hài lòng với các dependency, điều bạn cần chỉnh sửa là code.
- Việc bỏ qua linter dẫn đến những bug rất khó hiểu, và bạn nên luôn tránh điều đó.
- Để loại bỏ một dependency, bạn cần "chứng minh" cho linter rằng nó không cần thiết.
- Nếu một số code nên chạy để phản hồi một tương tác cụ thể, hãy di chuyển code đó vào một event handler.
- Nếu các phần khác nhau của Effect nên chạy lại vì những lý do khác nhau, hãy chia nó thành nhiều Effect.
- Nếu bạn muốn cập nhật một số state dựa trên state trước đó, hãy truyền một updater function.
- Nếu bạn muốn đọc giá trị mới nhất mà không "phản ứng" với nó, hãy trích xuất một Effect Event từ Effect của bạn.
- Trong JavaScript, các object và function được coi là khác nhau nếu chúng được tạo ra ở những thời điểm khác nhau.
- Hãy cố gắng tránh các dependency là object và function. Di chuyển chúng ra ngoài component hoặc vào trong Effect.

</Recap>

<Challenges>

#### Sửa interval bị reset {/*fix-a-resetting-interval*/}

Effect này thiết lập một interval tick mỗi giây. Bạn nhận thấy có điều gì đó lạ xảy ra: có vẻ như interval bị hủy và tạo lại mỗi khi nó tick. Hãy sửa code để interval không bị tạo lại liên tục.

<Hint>

Có vẻ như code Effect này phụ thuộc vào `count`. Có cách nào để không cần dependency này không? Nên có cách để cập nhật state `count` dựa trên giá trị trước đó mà không cần thêm dependency vào giá trị đó.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

<Solution>

Bạn muốn cập nhật state `count` thành `count + 1` từ bên trong Effect. Tuy nhiên, điều này khiến Effect của bạn phụ thuộc vào `count`, thay đổi với mỗi tick, và đó là lý do tại sao interval của bạn bị tạo lại ở mỗi tick.

Để giải quyết điều này, hãy sử dụng [updater function](/reference/react/useState#updating-state-based-on-the-previous-state) và viết `setCount(c => c + 1)` thay vì `setCount(count + 1)`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

Thay vì đọc `count` bên trong Effect, bạn truyền một chỉ thị `c => c + 1` ("tăng số này lên!") cho React. React sẽ áp dụng nó trong lần render tiếp theo. Và vì bạn không cần đọc giá trị của `count` bên trong Effect nữa, bạn có thể giữ cho các dependency của Effect trống (`[]`). Điều này ngăn Effect của bạn tạo lại interval ở mỗi tick.

</Solution>

#### Sửa animation bị kích hoạt lại {/*fix-a-retriggering-animation*/}

Trong ví dụ này, khi bạn nhấn "Show", một thông báo chào mừng sẽ fade in. Animation mất một giây. Khi bạn nhấn "Remove", thông báo chào mừng biến mất ngay lập tức. Logic cho animation fade-in được triển khai trong file `animation.js` như một [animation loop](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) JavaScript thuần. Bạn không cần thay đổi logic đó. Bạn có thể coi nó như một thư viện bên thứ ba. Effect của bạn tạo một instance của `FadeInAnimation` cho DOM node, và sau đó gọi `start(duration)` hoặc `stop()` để điều khiển animation. `duration` được điều khiển bằng một slider. Điều chỉnh slider và xem animation thay đổi như thế nào.

Code này đã hoạt động, nhưng có điều gì đó bạn muốn thay đổi. Hiện tại, khi bạn di chuyển slider điều khiển biến state `duration`, nó kích hoạt lại animation. Thay đổi hành vi để Effect không "phản ứng" với biến `duration`. Khi bạn nhấn "Show", Effect nên sử dụng `duration` hiện tại trên slider. Tuy nhiên, việc di chuyển slider bản thân nó không nên kích hoạt lại animation.

<Hint>

Có một dòng code bên trong Effect không nên là reactive không? Làm thế nào bạn có thể di chuyển code không reactive ra khỏi Effect?

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
import { useState, useEffect, useRef } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

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
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
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

<Solution>

Effect của bạn cần đọc giá trị mới nhất của `duration`, nhưng bạn không muốn nó "phản ứng" với những thay đổi trong `duration`. Bạn sử dụng `duration` để bắt đầu animation, nhưng việc bắt đầu animation không phải là reactive. Trích xuất dòng code không reactive vào một Effect Event, và gọi function đó từ Effect của bạn.

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
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
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
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
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
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
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

Effect Event như `onAppear` không phải là reactive, vì vậy bạn có thể đọc `duration` bên trong mà không kích hoạt lại animation.

</Solution>

#### Sửa chat bị kết nối lại {/*fix-a-reconnecting-chat*/}

Trong ví dụ này, mỗi khi bạn nhấn "Toggle theme", chat sẽ kết nối lại. Tại sao điều này xảy ra? Hãy sửa lỗi để chat chỉ kết nối lại khi bạn chỉnh sửa Server URL hoặc chọn một phòng chat khác.

Coi `chat.js` như một thư viện bên thứ ba: bạn có thể tham khảo nó để kiểm tra API, nhưng đừng chỉnh sửa nó.

<Hint>

Có nhiều cách để sửa điều này, nhưng cuối cùng bạn muốn tránh có một object làm dependency của mình.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Effect của bạn đang chạy lại vì nó phụ thuộc vào object `options`. Các object có thể được tạo lại một cách không cố ý, bạn nên cố gắng tránh chúng làm dependency của Effect bất cứ khi nào có thể.

Cách sửa ít xâm lấn nhất là đọc `roomId` và `serverUrl` ngay bên ngoài Effect, và sau đó làm cho Effect phụ thuộc vào những giá trị nguyên thủy đó (không thể thay đổi một cách không cố ý). Bên trong Effect, tạo một object và truyền nó cho `createConnection`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Sẽ tốt hơn nữa nếu thay thế prop object `options` bằng các prop cụ thể hơn là `roomId` và `serverUrl`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Giữ các prop nguyên thủy bất cứ khi nào có thể sẽ giúp việc tối ưu hóa component của bạn dễ dàng hơn sau này.

</Solution>

#### Sửa chat bị kết nối lại, lần nữa {/*fix-a-reconnecting-chat-again*/}

Ví dụ này kết nối với chat có hoặc không có mã hóa. Bật/tắt checkbox và chú ý các thông báo khác nhau trong console khi mã hóa được bật và tắt. Thử thay đổi phòng. Sau đó, thử bật/tắt theme. Khi bạn kết nối với một phòng chat, bạn sẽ nhận được tin nhắn mới vài giây một lần. Xác minh rằng màu của chúng khớp với theme bạn đã chọn.

Trong ví dụ này, chat kết nối lại mỗi khi bạn cố gắng thay đổi theme. Hãy sửa điều này. Sau khi sửa, việc thay đổi theme không nên kết nối lại chat, nhưng việc bật/tắt cài đặt mã hóa hoặc thay đổi phòng thì nên kết nối lại.

Đừng thay đổi bất kỳ code nào trong `chat.js`. Ngoài ra, bạn có thể thay đổi bất kỳ code nào miễn là nó tạo ra cùng một hành vi. Ví dụ, bạn có thể thấy hữu ích khi thay đổi props nào được truyền xuống.

<Hint>

Bạn đang truyền xuống hai function: `onMessage` và `createConnection`. Cả hai đều được tạo từ đầu mỗi khi `App` render lại. Chúng được coi là các giá trị mới mỗi lần, đó là lý do tại sao chúng kích hoạt lại Effect của bạn.

Một trong những function này là event handler. Bạn có biết cách nào để gọi một event handler trong Effect mà không "phản ứng" với các giá trị mới của function event handler không? Điều đó sẽ rất hữu ích!

Một function khác chỉ tồn tại để truyền một số state cho một phương thức API đã import. Function này có thực sự cần thiết không? Thông tin quan trọng nào đang được truyền xuống? Bạn có thể cần di chuyển một số import từ `App.js` sang `ChatRoom.js`.

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Có nhiều cách đúng để giải quyết điều này, nhưng đây là một giải pháp có thể.

Trong ví dụ ban đầu, việc bật/tắt theme khiến các function `onMessage` và `createConnection` khác nhau được tạo và truyền xuống. Vì Effect phụ thuộc vào những function này, chat sẽ kết nối lại mỗi khi bạn bật/tắt theme.

Để sửa vấn đề với `onMessage`, bạn cần bao bọc nó vào một Effect Event:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

Không giống như prop `onMessage`, Effect Event `onReceiveMessage` không phải là reactive. Đó là lý do tại sao nó không cần phải là dependency của Effect. Kết quả là, những thay đổi trong `onMessage` sẽ không khiến chat kết nối lại.

Bạn không thể làm điều tương tự với `createConnection` vì nó *nên* là reactive. Bạn *muốn* Effect kích hoạt lại nếu người dùng chuyển đổi giữa kết nối mã hóa và không mã hóa, hoặc nếu người dùng chuyển đổi phòng hiện tại. Tuy nhiên, vì `createConnection` là một function, bạn không thể kiểm tra liệu thông tin mà nó đọc có *thực sự* thay đổi hay không. Để giải quyết điều này, thay vì truyền `createConnection` xuống từ component `App`, hãy truyền các giá trị `roomId` và `isEncrypted` thô:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

Bây giờ bạn có thể di chuyển function `createConnection` *vào trong* Effect thay vì truyền nó xuống từ `App`:

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

Sau hai thay đổi này, Effect của bạn không còn phụ thuộc vào bất kỳ giá trị function nào:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Reactive values
  const onReceiveMessage = useEffectEvent(onMessage); // Not reactive

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Reading a reactive value
      };
      if (isEncrypted) { // Reading a reactive value
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ All dependencies declared
```

Kết quả là, chat chỉ kết nối lại khi có điều gì đó có ý nghĩa (`roomId` hoặc `isEncrypted`) thay đổi:

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
