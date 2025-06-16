---
title: 'Đồng bộ hóa với Effect'
---

<Intro>

Một số component cần đồng bộ hóa với các hệ thống bên ngoài. Ví dụ, bạn có thể muốn điều khiển một component không phải React dựa trên state của React, thiết lập kết nối server, hoặc gửi log phân tích khi một component xuất hiện trên màn hình. *Effect* cho phép bạn chạy một số code sau khi render để có thể đồng bộ hóa component của bạn với một số hệ thống bên ngoài React.

</Intro>

<YouWillLearn>

- Effect là gì
- Effect khác với event như thế nào
- Cách khai báo một Effect trong component của bạn
- Cách bỏ qua việc chạy lại Effect một cách không cần thiết
- Tại sao Effect chạy hai lần trong quá trình phát triển và cách khắc phục chúng

</YouWillLearn>

## Effect là gì và chúng khác với event như thế nào? {/*what-are-effects-and-how-are-they-different-from-events*/}

Trước khi đến với Effect, bạn cần làm quen với hai loại logic bên trong các component React:

- **Code render** (được giới thiệu trong [Mô tả UI](/learn/describing-the-ui)) tồn tại ở cấp độ cao nhất của component của bạn. Đây là nơi bạn lấy props và state, chuyển đổi chúng, và trả về JSX mà bạn muốn thấy trên màn hình. [Code render phải thuần khiết.](/learn/keeping-components-pure) Giống như một công thức toán học, nó chỉ nên *tính toán* kết quả, nhưng không làm gì khác.

- **Event handler** (được giới thiệu trong [Thêm tính tương tác](/learn/adding-interactivity)) là những function lồng nhau bên trong component của bạn mà *thực hiện* những việc thay vì chỉ tính toán chúng. Một event handler có thể cập nhật một trường input, gửi một HTTP POST request để mua một sản phẩm, hoặc điều hướng người dùng đến màn hình khác. Event handler chứa ["side effect"](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) (chúng thay đổi state của chương trình) được gây ra bởi một hành động cụ thể của người dùng (ví dụ, click nút hoặc gõ phím).

Đôi khi điều này chưa đủ. Hãy xem xét một component `ChatRoom` mà phải kết nối với chat server mỗi khi nó hiển thị trên màn hình. Kết nối với server không phải là một phép tính thuần khiết (đó là một side effect) nên nó không thể xảy ra trong quá trình rendering. Tuy nhiên, không có một event cụ thể nào như click mà khiến `ChatRoom` được hiển thị.

***Effect* cho phép bạn chỉ định các side effect được gây ra bởi chính quá trình rendering, thay vì bởi một event cụ thể.** Gửi tin nhắn trong chat là một *event* vì nó được gây ra trực tiếp bởi người dùng click vào một nút cụ thể. Tuy nhiên, thiết lập kết nối server là một *Effect* vì nó nên xảy ra bất kể tương tác nào khiến component xuất hiện. Effect chạy ở cuối của một [commit](/learn/render-and-commit) sau khi màn hình cập nhật. Đây là thời điểm tốt để đồng bộ hóa các component React với một hệ thống bên ngoài (như mạng hoặc thư viện bên thứ ba).

<Note>

Ở đây và sau này trong văn bản này, "Effect" viết hoa đề cập đến định nghĩa cụ thể của React ở trên, tức là một side effect được gây ra bởi rendering. Để đề cập đến khái niệm lập trình rộng hơn, chúng ta sẽ nói "side effect".

</Note>


## Bạn có thể không cần Effect {/*you-might-not-need-an-effect*/}

**Đừng vội vàng thêm Effect vào component của bạn.** Hãy nhớ rằng Effect thường được sử dụng để "thoát ra" khỏi code React của bạn và đồng bộ hóa với một hệ thống *bên ngoài* nào đó. Điều này bao gồm các API trình duyệt, widget bên thứ ba, mạng, v.v. Nếu Effect của bạn chỉ điều chỉnh một số state dựa trên state khác, [bạn có thể không cần Effect.](/learn/you-might-not-need-an-effect)

## Cách viết một Effect {/*how-to-write-an-effect*/}

Để viết một Effect, hãy làm theo ba bước sau:

1. **Khai báo một Effect.** Theo mặc định, Effect của bạn sẽ chạy sau mỗi [commit](/learn/render-and-commit).
2. **Chỉ định các dependency của Effect.** Hầu hết các Effect chỉ nên chạy lại *khi cần thiết* thay vì sau mỗi lần render. Ví dụ, animation fade-in chỉ nên kích hoạt khi một component xuất hiện. Kết nối và ngắt kết nối với phòng chat chỉ nên xảy ra khi component xuất hiện và biến mất, hoặc khi phòng chat thay đổi. Bạn sẽ học cách điều khiển điều này bằng cách chỉ định *dependency.*
3. **Thêm cleanup nếu cần.** Một số Effect cần chỉ định cách dừng, hoàn tác, hoặc dọn dẹp bất cứ thứ gì chúng đang làm. Ví dụ, "connect" cần "disconnect", "subscribe" cần "unsubscribe", và "fetch" cần "cancel" hoặc "ignore". Bạn sẽ học cách thực hiện điều này bằng cách trả về một *cleanup function*.

Hãy xem xét từng bước một cách chi tiết.

### Bước 1: Khai báo một Effect {/*step-1-declare-an-effect*/}

Để khai báo một Effect trong component của bạn, hãy import Hook [`useEffect`](/reference/react/useEffect) từ React:

```js
import { useEffect } from 'react';
```

Sau đó, gọi nó ở cấp độ cao nhất của component và đặt một số code bên trong Effect của bạn:

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // Code here will run after *every* render
  });
  return <div />;
}
```

Mỗi khi component của bạn render, React sẽ cập nhật màn hình *và sau đó* chạy code bên trong `useEffect`. Nói cách khác, **`useEffect` "trì hoãn" một đoạn code khỏi việc chạy cho đến khi lần render đó được phản ánh trên màn hình.**

Hãy xem cách bạn có thể sử dụng Effect để đồng bộ hóa với một hệ thống bên ngoài. Hãy xem xét một component React `<VideoPlayer>`. Sẽ rất tuyệt nếu có thể điều khiển việc nó đang phát hay tạm dừng bằng cách truyền một prop `isPlaying` cho nó:

```js
<VideoPlayer isPlaying={isPlaying} />;
```

Component `VideoPlayer` tùy chỉnh của bạn render thẻ [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) có sẵn trong trình duyệt:

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: do something with isPlaying
  return <video src={src} />;
}
```

Tuy nhiên, thẻ `<video>` của trình duyệt không có prop `isPlaying`. Cách duy nhất để điều khiển nó là gọi thủ công các method [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) và [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) trên DOM element. **Bạn cần đồng bộ hóa giá trị của prop `isPlaying`, cho biết liệu video *nên* đang phát hay không, với các lệnh gọi như `play()` và `pause()`.**

Trước tiên chúng ta cần [lấy một ref](/learn/manipulating-the-dom-with-refs) đến DOM node `<video>`.

Bạn có thể muốn thử gọi `play()` hoặc `pause()` trong quá trình rendering, nhưng điều đó không đúng:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // Calling these while rendering isn't allowed.
  } else {
    ref.current.pause(); // Also, this crashes.
  }

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

Lý do code này không đúng là vì nó cố gắng làm điều gì đó với DOM node trong quá trình rendering. Trong React, [rendering nên là một phép tính thuần khiết](/learn/keeping-components-pure) của JSX và không nên chứa các side effect như sửa đổi DOM.

Hơn nữa, khi `VideoPlayer` được gọi lần đầu tiên, DOM của nó chưa tồn tại! Chưa có DOM node nào để gọi `play()` hoặc `pause()` trên đó, vì React không biết DOM nào cần tạo cho đến khi bạn trả về JSX.

Giải pháp ở đây là **bọc side effect bằng `useEffect` để đưa nó ra khỏi phép tính rendering:**

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

Bằng cách bọc cập nhật DOM trong một Effect, bạn để React cập nhật màn hình trước. Sau đó Effect của bạn chạy.

Khi component `VideoPlayer` của bạn render (hoặc lần đầu tiên hoặc nếu nó render lại), một vài điều sẽ xảy ra. Đầu tiên, React sẽ cập nhật màn hình, đảm bảo thẻ `<video>` có trong DOM với các props đúng. Sau đó React sẽ chạy Effect của bạn. Cuối cùng, Effect của bạn sẽ gọi `play()` hoặc `pause()` tùy thuộc vào giá trị của `isPlaying`.

Nhấn Play/Pause nhiều lần và xem cách video player được đồng bộ hóa với giá trị `isPlaying`:

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
  });

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

Trong ví dụ này, "hệ thống bên ngoài" mà bạn đồng bộ hóa với state React là API media của trình duyệt. Bạn có thể sử dụng cách tiếp cận tương tự để bọc code legacy không phải React (như plugin jQuery) thành các component React khai báo.

Lưu ý rằng việc điều khiển video player phức tạp hơn nhiều trong thực tế. Gọi `play()` có thể thất bại, người dùng có thể phát hoặc tạm dừng bằng cách sử dụng các điều khiển tích hợp sẵn của trình duyệt, v.v. Ví dụ này rất đơn giản hóa và không hoàn chỉnh.

<Pitfall>

Theo mặc định, Effect chạy sau *mỗi* lần render. Đây là lý do tại sao code như thế này sẽ **tạo ra một vòng lặp vô hạn:**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Effect chạy như một *kết quả* của rendering. Thiết lập state *kích hoạt* rendering. Thiết lập state ngay lập tức trong một Effect giống như cắm ổ cắm điện vào chính nó. Effect chạy, nó thiết lập state, điều này gây ra render lại, điều này khiến Effect chạy, nó thiết lập state lại, điều này gây ra render lại khác, và cứ thế.

Effect thường nên đồng bộ hóa component của bạn với một hệ thống *bên ngoài*. Nếu không có hệ thống bên ngoài và bạn chỉ muốn điều chỉnh một số state dựa trên state khác, [bạn có thể không cần Effect.](/learn/you-might-not-need-an-effect)

</Pitfall>

### Bước 2: Chỉ định các dependency của Effect {/*step-2-specify-the-effect-dependencies*/}

Theo mặc định, Effect chạy sau *mỗi* lần render. Thường thì, điều này **không phải là những gì bạn muốn:**

- Đôi khi, nó chậm. Đồng bộ hóa với một hệ thống bên ngoài không phải lúc nào cũng tức thì, vì vậy bạn có thể muốn bỏ qua việc thực hiện nó trừ khi cần thiết. Ví dụ, bạn không muốn kết nối lại với chat server mỗi lần gõ phím.
- Đôi khi, nó sai. Ví dụ, bạn không muốn kích hoạt animation fade-in của component mỗi lần gõ phím. Animation chỉ nên phát một lần khi component xuất hiện lần đầu tiên.

Để minh họa vấn đề, đây là ví dụ trước với một vài lệnh gọi `console.log` và một text input cập nhật state của component cha. Hãy chú ý cách gõ phím khiến Effect chạy lại:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Bạn có thể yêu cầu React **bỏ qua việc chạy lại Effect một cách không cần thiết** bằng cách chỉ định một mảng *dependency* làm tham số thứ hai cho lệnh gọi `useEffect`. Bắt đầu bằng cách thêm một mảng `[]` rỗng vào ví dụ trên ở dòng 14:

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

Bạn sẽ thấy một lỗi cho biết `React Hook useEffect has a missing dependency: 'isPlaying'`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, []); // This causes an error

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Vấn đề là code bên trong Effect của bạn *phụ thuộc vào* prop `isPlaying` để quyết định làm gì, nhưng dependency này không được khai báo rõ ràng. Để khắc phục vấn đề này, hãy thêm `isPlaying` vào mảng dependency:

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // It's used here...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...so it must be declared here!
```

Bây giờ tất cả dependency đều được khai báo, nên không có lỗi. Chỉ định `[isPlaying]` làm mảng dependency yêu cầu React bỏ qua việc chạy lại Effect của bạn nếu `isPlaying` giống như trong lần render trước. Với thay đổi này, gõ vào input không khiến Effect chạy lại, nhưng nhấn Play/Pause thì có:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Mảng dependency có thể chứa nhiều dependency. React sẽ chỉ bỏ qua việc chạy lại Effect nếu *tất cả* các dependency bạn chỉ định có chính xác cùng giá trị như chúng có trong lần render trước. React so sánh các giá trị dependency bằng cách sử dụng so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Xem [tài liệu tham khảo `useEffect`](/reference/react/useEffect#reference) để biết chi tiết.

**Lưu ý rằng bạn không thể "chọn" dependency của mình.** Bạn sẽ gặp lỗi lint nếu các dependency bạn chỉ định không khớp với những gì React mong đợi dựa trên code bên trong Effect của bạn. Điều này giúp phát hiện nhiều bug trong code của bạn. Nếu bạn không muốn một số code chạy lại, [*chỉnh sửa chính code Effect* để không "cần" dependency đó.](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

<Pitfall>

Hành vi không có mảng dependency và có mảng dependency *rỗng* `[]` là khác nhau:

```js {3,7,11}
useEffect(() => {
  // This runs after every render
});

useEffect(() => {
  // This runs only on mount (when the component appears)
}, []);

useEffect(() => {
  // This runs on mount *and also* if either a or b have changed since the last render
}, [a, b]);
```

Chúng ta sẽ xem xét kỹ ý nghĩa của "mount" trong bước tiếp theo.

</Pitfall>

<DeepDive>

#### Tại sao ref bị bỏ qua khỏi mảng dependency? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

Effect này sử dụng *cả* `ref` và `isPlaying`, nhưng chỉ `isPlaying` được khai báo làm dependency:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

Điều này là vì object `ref` có *danh tính ổn định:* React đảm bảo [bạn sẽ luôn nhận được cùng một object](/reference/react/useRef#returns) từ cùng một lệnh gọi `useRef` trong mỗi lần render. Nó không bao giờ thay đổi, vì vậy nó sẽ không bao giờ tự gây ra Effect chạy lại. Do đó, việc bạn có bao gồm nó hay không không quan trọng. Bao gồm nó cũng không sao:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

[Các function `set`](/reference/react/useState#setstate) được trả về bởi `useState` cũng có danh tính ổn định, vì vậy bạn sẽ thường thấy chúng bị bỏ qua khỏi các dependency. Nếu linter cho phép bạn bỏ qua một dependency mà không có lỗi, thì việc làm đó là an toàn.

Bỏ qua các dependency luôn ổn định chỉ hoạt động khi linter có thể "thấy" rằng object đó ổn định. Ví dụ, nếu `ref` được truyền từ component cha, bạn sẽ phải chỉ định nó trong mảng dependency. Tuy nhiên, điều này tốt vì bạn không thể biết liệu component cha luôn truyền cùng một ref, hay truyền một trong vài ref có điều kiện. Vì vậy Effect của bạn *sẽ* phụ thuộc vào ref nào được truyền.

</DeepDive>

### Bước 3: Thêm cleanup nếu cần {/*step-3-add-cleanup-if-needed*/}

Hãy xem xét một ví dụ khác. Bạn đang viết một component `ChatRoom` cần kết nối với chat server khi nó xuất hiện. Bạn được cung cấp một API `createConnection()` trả về một object với các method `connect()` và `disconnect()`. Làm thế nào để giữ component kết nối trong khi nó được hiển thị cho người dùng?

Bắt đầu bằng cách viết logic Effect:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

Sẽ chậm nếu kết nối với chat sau mỗi lần render lại, vì vậy bạn thêm mảng dependency:

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**Code bên trong Effect không sử dụng bất kỳ props hoặc state nào, vì vậy mảng dependency của bạn là `[]` (rỗng). Điều này yêu cầu React chỉ chạy code này khi component "mount", tức là xuất hiện trên màn hình lần đầu tiên.**

Hãy thử chạy code này:

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
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

Effect này chỉ chạy khi mount, vì vậy bạn có thể mong đợi rằng `"✅ Connecting..."` được in một lần trong console. **Tuy nhiên, nếu bạn kiểm tra console, `"✅ Connecting..."` được in hai lần. Tại sao điều này xảy ra?**

Hãy tưởng tượng component `ChatRoom` là một phần của ứng dụng lớn hơn với nhiều màn hình khác nhau. Người dùng bắt đầu hành trình của họ trên trang `ChatRoom`. Component mount và gọi `connection.connect()`. Sau đó hãy tưởng tượng người dùng điều hướng đến màn hình khác--ví dụ, đến trang Settings. Component `ChatRoom` unmount. Cuối cùng, người dùng click Back và `ChatRoom` mount lại. Điều này sẽ thiết lập kết nối thứ hai--nhưng kết nối đầu tiên không bao giờ bị hủy! Khi người dùng điều hướng qua ứng dụng, các kết nối sẽ tiếp tục chồng chất.

Bug như thế này dễ bỏ sót nếu không có kiểm thử thủ công toàn diện. Để giúp bạn phát hiện chúng nhanh chóng, trong quá trình phát triển React remount mỗi component một lần ngay sau khi mount ban đầu.

Thấy log `"✅ Connecting..."` hai lần giúp bạn nhận ra vấn đề thực sự: code của bạn không đóng kết nối khi component unmount.

Để khắc phục vấn đề, hãy trả về một *cleanup function* từ Effect của bạn:

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React sẽ gọi cleanup function của bạn mỗi lần trước khi Effect chạy lại, và một lần cuối cùng khi component unmount (bị loại bỏ). Hãy xem điều gì xảy ra khi cleanup function được triển khai:

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

Bây giờ bạn có ba log console trong quá trình phát triển:

1. `"✅ Connecting..."`
2. `"❌ Disconnected."`
3. `"✅ Connecting..."`

**Đây là hành vi đúng trong quá trình phát triển.** Bằng cách remount component của bạn, React xác minh rằng việc điều hướng đi và quay lại sẽ không làm hỏng code của bạn. Ngắt kết nối rồi kết nối lại chính xác là những gì nên xảy ra! Khi bạn triển khai cleanup tốt, không nên có sự khác biệt có thể nhìn thấy đối với người dùng giữa việc chạy Effect một lần so với chạy nó, dọn dẹp nó, và chạy lại. Có một cặp lệnh gọi connect/disconnect thêm vì React đang kiểm tra code của bạn để tìm bug trong quá trình phát triển. Điều này bình thường--đừng cố gắng làm cho nó biến mất!

**Trong production, bạn sẽ chỉ thấy `"✅ Connecting..."` được in một lần.** Remount component chỉ xảy ra trong quá trình phát triển để giúp bạn tìm các Effect cần cleanup. Bạn có thể tắt [Strict Mode](/reference/react/StrictMode) để thoát khỏi hành vi phát triển, nhưng chúng tôi khuyên bạn nên giữ nó. Điều này cho phép bạn tìm nhiều bug như ví dụ trên.

## Cách xử lý Effect kích hoạt hai lần trong quá trình phát triển? {/*how-to-handle-the-effect-firing-twice-in-development*/}

React cố ý remount component của bạn trong quá trình phát triển để tìm bug như trong ví dụ cuối. **Câu hỏi đúng không phải là "làm thế nào để chạy Effect một lần", mà là "làm thế nào để sửa Effect của tôi để nó hoạt động sau khi remount".**

Thường thì, câu trả lời là triển khai cleanup function. Cleanup function nên dừng hoặc hoàn tác bất cứ thứ gì Effect đang làm. Nguyên tắc chung là người dùng không nên có thể phân biệt giữa Effect chạy một lần (như trong production) và chuỗi *setup → cleanup → setup* (như bạn sẽ thấy trong quá trình phát triển).

Hầu hết các Effect bạn sẽ viết sẽ phù hợp với một trong các pattern phổ biến dưới đây.

<Pitfall>

#### Đừng sử dụng ref để ngăn Effect kích hoạt {/*dont-use-refs-to-prevent-effects-from-firing*/}

Một cạm bẫy phổ biến khi ngăn Effect kích hoạt hai lần trong quá trình phát triển là sử dụng `ref` để ngăn Effect chạy quá một lần. Ví dụ, bạn có thể "sửa" bug trên bằng `useRef`:

```js {1,3-4}
  const connectionRef = useRef(null);
  useEffect(() => {
    // 🚩 This wont fix the bug!!!
    if (!connectionRef.current) {
      connectionRef.current = createConnection();
      connectionRef.current.connect();
    }
  }, []);
```

Điều này làm cho bạn chỉ thấy `"✅ Connecting..."` một lần trong quá trình phát triển, nhưng nó không sửa bug.

Khi người dùng điều hướng đi, kết nối vẫn không được đóng và khi họ điều hướng lại, một kết nối mới được tạo. Khi người dùng điều hướng qua ứng dụng, các kết nối sẽ tiếp tục chồng chất, giống như trước khi có "bản sửa".

Để sửa bug, không đủ để chỉ làm Effect chạy một lần. Effect cần hoạt động sau khi remount, có nghĩa là kết nối cần được dọn dẹp như trong giải pháp ở trên.

Xem các ví dụ dưới đây để biết cách xử lý các pattern phổ biến.

</Pitfall>

### Điều khiển widget không phải React {/*controlling-non-react-widgets*/}

Đôi khi bạn cần thêm widget UI không được viết bằng React. Ví dụ, giả sử bạn đang thêm một component bản đồ vào trang của mình. Nó có method `setZoomLevel()`, và bạn muốn giữ mức độ zoom đồng bộ với biến state `zoomLevel` trong code React của bạn. Effect của bạn sẽ trông tương tự như thế này:

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

Lưu ý rằng không cần cleanup trong trường hợp này. Trong quá trình phát triển, React sẽ gọi Effect hai lần, nhưng điều này không phải là vấn đề vì gọi `setZoomLevel` hai lần với cùng giá trị không làm gì cả. Nó có thể hơi chậm, nhưng điều này không quan trọng vì nó sẽ không remount một cách không cần thiết trong production.

Một số API có thể không cho phép bạn gọi chúng hai lần liên tiếp. Ví dụ, method [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) của element [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) có sẵn sẽ throw nếu bạn gọi nó hai lần. Triển khai cleanup function và làm cho nó đóng dialog:

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

Trong quá trình phát triển, Effect của bạn sẽ gọi `showModal()`, sau đó ngay lập tức `close()`, và sau đó `showModal()` lại. Điều này có cùng hành vi có thể thấy với người dùng như việc gọi `showModal()` một lần, như bạn sẽ thấy trong production.

### Đăng ký event {/*subscribing-to-events*/}

Nếu Effect của bạn đăng ký điều gì đó, cleanup function nên hủy đăng ký:

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

Trong quá trình phát triển, Effect của bạn sẽ gọi `addEventListener()`, sau đó ngay lập tức `removeEventListener()`, và sau đó `addEventListener()` lại với cùng handler. Vì vậy sẽ chỉ có một subscription hoạt động tại một thời điểm. Điều này có cùng hành vi có thể thấy với người dùng như việc gọi `addEventListener()` một lần, như trong production.

### Kích hoạt animation {/*triggering-animations*/}

Nếu Effect của bạn animate điều gì đó vào, cleanup function nên reset animation về giá trị ban đầu:

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Trigger the animation
  return () => {
    node.style.opacity = 0; // Reset to the initial value
  };
}, []);
```

Trong quá trình phát triển, opacity sẽ được set thành `1`, sau đó thành `0`, và sau đó thành `1` lại. Điều này nên có cùng hành vi có thể thấy với người dùng như việc set nó thành `1` trực tiếp, đó là những gì sẽ xảy ra trong production. Nếu bạn sử dụng thư viện animation bên thứ ba có hỗ trợ tweening, cleanup function của bạn nên reset timeline về state ban đầu.

### Fetching data {/*fetching-data*/}

Nếu Effect của bạn fetch điều gì đó, cleanup function nên [abort fetch](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) hoặc bỏ qua kết quả của nó:

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

Bạn không thể "hoàn tác" một network request đã xảy ra, nhưng cleanup function của bạn nên đảm bảo rằng fetch *không còn liên quan nữa* không tiếp tục ảnh hưởng đến ứng dụng của bạn. Nếu `userId` thay đổi từ `'Alice'` thành `'Bob'`, cleanup đảm bảo rằng response `'Alice'` bị bỏ qua ngay cả khi nó đến sau `'Bob'`.

**Trong quá trình phát triển, bạn sẽ thấy hai lần fetch trong tab Network.** Không có gì sai với điều đó. Với cách tiếp cận trên, Effect đầu tiên sẽ ngay lập tức được dọn dẹp nên bản copy của biến `ignore` sẽ được set thành `true`. Vì vậy mặc dù có một request thêm, nó sẽ không ảnh hưởng đến state nhờ vào kiểm tra `if (!ignore)`.

**Trong production, sẽ chỉ có một request.** Nếu request thứ hai trong quá trình phát triển làm phần bạn, cách tiếp cận tốt nhất là sử dụng một giải pháp deduplicate request và cache response giữa các component:

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

Điều này sẽ không chỉ cải thiện trải nghiệm phát triển, mà còn làm cho ứng dụng của bạn cảm thấy nhanh hơn. Ví dụ, người dùng nhấn nút Back sẽ không phải đợi một số data load lại vì nó sẽ được cache. Bạn có thể tự xây dựng cache như vậy hoặc sử dụng một trong nhiều lựa chọn thay thế cho việc fetch thủ công trong Effect.

<DeepDive>

#### Các lựa chọn thay thế tốt cho việc fetch data trong Effect là gì? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Viết các lệnh gọi `fetch` bên trong Effect là một [cách phổ biến để fetch data](https://www.robinwieruch.de/react-hooks-fetch-data/), đặc biệt là trong các ứng dụng hoàn toàn chạy phía client. Tuy nhiên, đây là một cách tiếp cận rất thủ công và có những nhược điểm đáng kể:

- **Effect không chạy trên server.** Điều này có nghĩa là HTML server-rendered ban đầu sẽ chỉ bao gồm trạng thái loading mà không có data. Máy tính client sẽ phải tải tất cả JavaScript và render ứng dụng của bạn chỉ để phát hiện ra rằng bây giờ nó cần load data. Điều này không hiệu quả lắm.
- **Fetch trực tiếp trong Effect dễ tạo ra "network waterfall".** Bạn render component cha, nó fetch một số data, render các component con, và sau đó chúng bắt đầu fetch data của chúng. Nếu mạng không nhanh lắm, điều này chậm hơn đáng kể so với việc fetch tất cả data song song.
- **Fetch trực tiếp trong Effect thường có nghĩa là bạn không preload hoặc cache data.** Ví dụ, nếu component unmount rồi mount lại, nó sẽ phải fetch data lại.
- **Nó không thân thiện với người dùng lắm.** Có khá nhiều boilerplate code liên quan khi viết các lệnh gọi `fetch` theo cách không gặp phải bug như [race condition.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

Danh sách nhược điểm này không dành riêng cho React. Nó áp dụng cho việc fetch data khi mount với bất kỳ thư viện nào. Giống như với routing, data fetching không đơn giản để làm tốt, vì vậy chúng tôi khuyến nghị các cách tiếp cận sau:

- **Nếu bạn sử dụng một [framework](/learn/start-a-new-react-project#production-grade-react-frameworks), hãy sử dụng cơ chế fetch data tích hợp sẵn của nó.** Các framework React hiện đại có cơ chế fetch data tích hợp hiệu quả và không gặp phải các cạm bẫy trên.
- **Nếu không, hãy xem xét sử dụng hoặc xây dựng cache phía client.** Các giải pháp mã nguồn mở phổ biến bao gồm [React Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), và [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) Bạn cũng có thể xây dựng giải pháp của riêng mình, trong trường hợp đó bạn sẽ sử dụng Effect bên dưới, nhưng thêm logic để deduplicate request, cache response, và tránh network waterfall (bằng cách preload data hoặc đưa yêu cầu data lên route).

Bạn có thể tiếp tục fetch data trực tiếp trong Effect nếu không có cách tiếp cận nào trong số này phù hợp với bạn.

</DeepDive>

### Gửi phân tích {/*sending-analytics*/}

Hãy xem xét code này gửi một event phân tích khi ghé thăm trang:

```js
useEffect(() => {
  logVisit(url); // Sends a POST request
}, [url]);
```

Trong quá trình phát triển, `logVisit` sẽ được gọi hai lần cho mỗi URL, vì vậy bạn có thể muốn thử sửa điều đó. **Chúng tôi khuyến nghị giữ code này như vậy.** Giống như với các ví dụ trước, không có sự khác biệt hành vi *có thể nhìn thấy* giữa việc chạy nó một lần và chạy nó hai lần. Từ góc độ thực tế, `logVisit` không nên làm gì trong quá trình phát triển vì bạn không muốn log từ máy phát triển làm lệch các số liệu production. Component của bạn remount mỗi khi bạn lưu file của nó, vì vậy nó log thêm các lần visit trong quá trình phát triển.

**Trong production, sẽ không có log visit trùng lặp.**

Để debug các event phân tích bạn đang gửi, bạn có thể deploy ứng dụng của mình lên môi trường staging (chạy ở chế độ production) hoặc tạm thời thoát khỏi [Strict Mode](/reference/react/StrictMode) và các kiểm tra remount chỉ dành cho phát triển. Bạn cũng có thể gửi phân tích từ các event handler thay đổi route thay vì Effect. Để phân tích chính xác hơn, [intersection observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) có thể giúp theo dõi component nào trong viewport và chúng hiển thị bao lâu.

### Không phải Effect: Khởi tạo ứng dụng {/*not-an-effect-initializing-the-application*/}

Một số logic chỉ nên chạy một lần khi ứng dụng khởi động. Bạn có thể đặt nó bên ngoài component của mình:

```js {2-3}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Điều này đảm bảo rằng logic như vậy chỉ chạy một lần sau khi trình duyệt load trang.

### Không phải Effect: Mua sản phẩm {/*not-an-effect-buying-a-product*/}

Đôi khi, ngay cả khi bạn viết cleanup function, không có cách nào để ngăn chặn hậu quả có thể nhìn thấy của việc chạy Effect hai lần. Ví dụ, có thể Effect của bạn gửi một POST request như mua sản phẩm:

```js {2-3}
useEffect(() => {
  // 🔴 Wrong: This Effect fires twice in development, exposing a problem in the code.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

Bạn sẽ không muốn mua sản phẩm hai lần. Tuy nhiên, đây cũng là lý do tại sao bạn không nên đặt logic này trong Effect. Điều gì sẽ xảy ra nếu người dùng đi đến trang khác rồi nhấn Back? Effect của bạn sẽ chạy lại. Bạn không muốn mua sản phẩm khi người dùng *ghé thăm* một trang; bạn muốn mua nó khi người dùng *click* nút Buy.

Mua hàng không được gây ra bởi rendering; nó được gây ra bởi một tương tác cụ thể. Nó chỉ nên chạy khi người dùng nhấn nút. **Xóa Effect và di chuyển request `/api/buy` của bạn vào event handler của nút Buy:**

```js {2-3}
  function handleClick() {
    // ✅ Buying is an event because it is caused by a particular interaction.
    fetch('/api/buy', { method: 'POST' });
  }
```

**Điều này minh họa rằng nếu remount phá vỡ logic của ứng dụng, điều này thường phát hiện ra các bug hiện có.** Từ góc độ người dùng, ghé thăm một trang không nên khác với việc ghé thăm nó, click vào một link, rồi nhấn Back để xem trang lại. React xác minh rằng component của bạn tuân thủ nguyên tắc này bằng cách remount chúng một lần trong quá trình phát triển.

## Kết hợp tất cả lại {/*putting-it-all-together*/}

Playground này có thể giúp bạn "làm quen" với cách Effect hoạt động trong thực tế.

Ví dụ này sử dụng [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) để lên lịch cho console log với văn bản input xuất hiện ba giây sau khi Effect chạy. Hàm cleanup sẽ hủy timeout đang chờ. Bắt đầu bằng cách nhấn "Mount the component":

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Schedule "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancel "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        What to log:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Unmount' : 'Mount'} the component
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

Bạn sẽ thấy ba log đầu tiên: `Schedule "a" log`, `Cancel "a" log`, và `Schedule "a" log` lại. Ba giây sau cũng sẽ có một log nói `a`. Như bạn đã học trước đó, cặp schedule/cancel thêm là vì React remount component một lần trong quá trình phát triển để xác minh rằng bạn đã triển khai cleanup tốt.

Bây giờ chỉnh sửa input để nói `abc`. Nếu bạn làm đủ nhanh, bạn sẽ thấy `Schedule "ab" log` ngay lập tức theo sau bởi `Cancel "ab" log` và `Schedule "abc" log`. **React luôn dọn dẹp Effect của lần render trước trước khi Effect của lần render tiếp theo.** Đây là lý do tại sao ngay cả khi bạn gõ vào input nhanh, có tối đa một timeout được lên lịch tại một thời điểm. Chỉnh sửa input một vài lần và xem console để làm quen với cách Effect được dọn dẹp.

Gõ gì đó vào input và sau đó ngay lập tức nhấn "Unmount the component". Chú ý cách unmount dọn dẹp Effect của lần render cuối cùng. Ở đây, nó xóa timeout cuối cùng trước khi nó có cơ hội kích hoạt.

Cuối cùng, chỉnh sửa component ở trên và comment out cleanup function để các timeout không bị hủy. Thử gõ `abcde` nhanh. Bạn nghĩ điều gì sẽ xảy ra trong ba giây? `console.log(text)` bên trong timeout sẽ in `text` *mới nhất* và tạo ra năm log `abcde`? Hãy thử để kiểm tra trực giác của bạn!

Ba giây sau, bạn sẽ thấy một chuỗi log (`a`, `ab`, `abc`, `abcd`, và `abcde`) thay vì năm log `abcde`. **Mỗi Effect "bắt" giá trị `text` từ lần render tương ứng của nó.** Không quan trọng rằng state `text` đã thay đổi: một Effect từ lần render với `text = 'ab'` sẽ luôn thấy `'ab'`. Nói cách khác, Effect từ mỗi lần render được cô lập với nhau. Nếu bạn tò mò về cách hoạt động, bạn có thể đọc về [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).

<DeepDive>

#### Each render has its own Effects {/*each-render-has-its-own-effects*/}

Bạn có thể nghĩ về `useEffect` như việc "gắn kết" một hành vi vào kết quả render. Xem xét Effect này:

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to {roomId}!</h1>;
}
```

Hãy xem chính xác điều gì xảy ra khi người dùng điều hướng xung quanh ứng dụng.

#### Initial render {/*initial-render*/}

Người dùng truy cập `<ChatRoom roomId="general" />`. Hãy [thay thế tâm lý](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `roomId` với `'general'`:

```js
  // JSX for the first render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

**The Effect is *also* a part of the rendering output.** The first render's Effect becomes:

```js
  // Effect for the first render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the first render (roomId = "general")
  ['general']
```

React chạy Effect này, kết nối với chat room `'general'`.

#### Re-render with same dependencies {/*re-render-with-same-dependencies*/}

Let's say `<ChatRoom roomId="general" />` re-renders. The JSX output is the same:

```js
  // JSX for the second render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

React thấy rằng kết quả rendering không thay đổi, nên nó không cập nhật DOM.

Effect từ lần render thứ hai trông như thế này:

```js
  // Effect for the second render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the second render (roomId = "general")
  ['general']
```

React so sánh `['general']` từ lần render thứ hai với `['general']` từ lần render đầu tiên. **Vì tất cả các dependency đều giống nhau, React *bỏ qua* Effect từ lần render thứ hai.** Nó không bao giờ được gọi.

#### Re-render with different dependencies {/*re-render-with-different-dependencies*/}

Sau đó, người dùng truy cập `<ChatRoom roomId="travel" />`. Lần này, component trả về JSX khác:

```js
  // JSX for the third render (roomId = "travel")
  return <h1>Welcome to travel!</h1>;
```

React cập nhật DOM để thay đổi `"Welcome to general"` thành `"Welcome to travel"`.

Effect từ lần render thứ ba trông như thế này:

```js
  // Effect for the third render (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the third render (roomId = "travel")
  ['travel']
```

React so sánh `['travel']` từ lần render thứ ba với `['general']` từ lần render thứ hai. Một dependency khác nhau: `Object.is('travel', 'general')` là `false`. Effect không thể bị bỏ qua.

**Trước khi React có thể áp dụng Effect từ lần render thứ ba, nó cần dọn dẹp Effect cuối cùng đã chạy.** Effect của lần render thứ hai đã bị bỏ qua, vì vậy React cần dọn dẹp Effect của lần render đầu tiên. Nếu bạn cuộn lên lần render đầu tiên, bạn sẽ thấy rằng cleanup của nó gọi `disconnect()` trên kết nối được tạo với `createConnection('general')`. Điều này ngắt kết nối ứng dụng khỏi phòng chat `'general'`.

Sau đó, React chạy Effect của lần render thứ ba. Nó kết nối với phòng chat `'travel'`.

#### Unmount {/*unmount*/}

Cuối cùng, giả sử người dùng điều hướng đi, và component `ChatRoom` unmount. React chạy cleanup function của Effect cuối cùng. Effect cuối cùng là từ lần render thứ ba. Cleanup của lần render thứ ba hủy kết nối `createConnection('travel')`. Vì vậy ứng dụng ngắt kết nối khỏi phòng `'travel'`.

#### Hành vi chỉ dành cho phát triển {/*development-only-behaviors*/}

Khi [Strict Mode](/reference/react/StrictMode) được bật, React remount mỗi component một lần trong quá trình phát triển. Điều này giúp phát hiện nhiều bug như race condition. Ngoài ra, React sẽ remount các Effect bất cứ khi nào bạn lưu file trong quá trình phát triển. Cả hai hành vi này chỉ dành cho phát triển.

</DeepDive>

<Recap>

- Không giống như event, Effect được gây ra bởi chính quá trình rendering thay vì một tương tác cụ thể.
- Effect cho phép bạn đồng bộ hóa một component với hệ thống bên ngoài (API bên thứ ba, mạng, v.v.).
- Theo mặc định, Effect chạy sau mỗi lần render (bao gồm cả lần đầu tiên).
- React sẽ bỏ qua Effect nếu tất cả dependency của nó có cùng giá trị như trong lần render cuối.
- Bạn không thể "chọn" dependency của mình. Chúng được xác định bởi code bên trong Effect.
- Mảng dependency rỗng (`[]`) tương ứng với component "mounting", tức là được thêm vào màn hình.
- Trong Strict Mode, React mount component hai lần (chỉ trong quá trình phát triển!) để stress-test Effect của bạn.
- Nếu Effect của bạn bị hỏng vì remounting, bạn cần triển khai cleanup function.
- React sẽ gọi cleanup function của bạn trước khi Effect chạy lần tiếp theo, và trong quá trình unmount.

</Recap>

<Challenges>

#### Focus một trường khi mount {/*focus-a-field-on-mount*/}

Trong ví dụ này, form render một component `<MyInput />`.

Sử dụng method [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) của input để làm cho `MyInput` tự động focus khi nó xuất hiện trên màn hình. Đã có một implementation được comment out, nhưng nó không hoạt động hoàn toàn. Tìm hiểu tại sao nó không hoạt động, và sửa nó. (Nếu bạn quen thuộc với thuộc tính `autoFocus`, hãy giả vờ rằng nó không tồn tại: chúng ta đang triển khai lại cùng chức năng từ đầu.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: This doesn't quite work. Fix it.
  // ref.current.focus()    

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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


Để xác minh rằng giải pháp của bạn hoạt động, nhấn "Show form" và xác minh rằng input nhận được focus (được highlight và con trỏ được đặt bên trong). Nhấn "Hide form" và "Show form" lại. Xác minh input được highlight lại.

`MyInput` chỉ nên focus *khi mount* thay vì sau mỗi lần render. Để xác minh rằng hành vi đúng, nhấn "Show form" và sau đó nhấn checkbox "Make it uppercase" nhiều lần. Click checkbox *không* nên focus input ở trên nó.

<Solution>

Gọi `ref.current.focus()` trong quá trình render là sai vì đó là một *side effect*. Side effect nên được đặt bên trong event handler hoặc được khai báo với `useEffect`. Trong trường hợp này, side effect được *gây ra* bởi việc component xuất hiện thay vì bởi bất kỳ tương tác cụ thể nào, vì vậy có lý khi đặt nó trong Effect.

Để sửa lỗi, bọc lệnh gọi `ref.current.focus()` vào một khai báo Effect. Sau đó, để đảm bảo rằng Effect này chỉ chạy khi mount thay vì sau mỗi lần render, thêm dependency `[]` rỗng vào nó.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

</Solution>

#### Focus một trường có điều kiện {/*focus-a-field-conditionally*/}

Form này render hai component `<MyInput />`.

Nhấn "Show form" và chú ý rằng trường thứ hai tự động được focus. Điều này là vì cả hai component `<MyInput />` đều cố gắng focus trường bên trong. Khi bạn gọi `focus()` cho hai trường input liên tiếp, trường cuối cùng luôn "thắng".

Giả sử bạn muốn focus trường đầu tiên. Component `MyInput` đầu tiên nhận một prop boolean `shouldFocus` được set thành `true`. Thay đổi logic để `focus()` chỉ được gọi nếu prop `shouldFocus` mà `MyInput` nhận được là `true`.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: call focus() only if shouldFocus is true.
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

Để xác minh giải pháp của bạn, nhấn "Show form" và "Hide form" nhiều lần. Khi form xuất hiện, chỉ input *đầu tiên* nên được focus. Điều này là vì component cha render input đầu tiên với `shouldFocus={true}` và input thứ hai với `shouldFocus={false}`. Cũng kiểm tra rằng cả hai input vẫn hoạt động và bạn có thể gõ vào cả hai.

<Hint>

Bạn không thể khai báo Effect có điều kiện, nhưng Effect của bạn có thể bao gồm logic có điều kiện.

</Hint>

<Solution>

Đặt logic có điều kiện bên trong Effect. Bạn sẽ cần chỉ định `shouldFocus` làm dependency vì bạn đang sử dụng nó bên trong Effect. (Điều này có nghĩa là nếu `shouldFocus` của một input nào đó thay đổi từ `false` thành `true`, nó sẽ focus sau khi mount.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

</Solution>

#### Fix an interval that fires twice {/*fix-an-interval-that-fires-twice*/}

This `Counter` component displays a counter that should increment every second. On mount, it calls [`setInterval`.](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) This causes `onTick` to run every second. The `onTick` function increments the counter.

However, instead of incrementing once per second, it increments twice. Why is that? Find the cause of the bug and fix it.

<Hint>

Keep in mind that `setInterval` returns an interval ID, which you can pass to [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) to stop the interval.

</Hint>

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
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

<Solution>

Khi [Strict Mode](/reference/react/StrictMode) được bật (như trong các sandbox trên trang này), React remount mỗi component một lần trong quá trình phát triển. Điều này khiến interval được thiết lập hai lần, và đây là lý do tại sao mỗi giây bộ đếm tăng hai lần.

Tuy nhiên, hành vi của React không phải là *nguyên nhân* của bug: bug đã tồn tại trong code. Hành vi của React làm cho bug trở nên rõ ràng hơn. Nguyên nhân thực sự là Effect này bắt đầu một tiến trình nhưng không cung cấp cách để dọn dẹp nó.

To fix this code, save the interval ID returned by `setInterval`, and implement a cleanup function with [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
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

In development, React will still remount your component once to verify that you've implemented cleanup well. So there will be a `setInterval` call, immediately followed by `clearInterval`, and `setInterval` again. In production, there will be only one `setInterval` call. The user-visible behavior in both cases is the same: the counter increments once per second.

</Solution>

#### Fix fetching inside an Effect {/*fix-fetching-inside-an-effect*/}

Component này hiển thị tiểu sử cho người được chọn. Nó tải tiểu sử bằng cách gọi một function bất đồng bộ `fetchBio(person)` khi mount và bất cứ khi nào `person` thay đổi. Function bất đồng bộ đó trả về một [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) mà cuối cùng resolve thành một string. Khi fetching hoàn thành, nó gọi `setBio` để hiển thị string đó dưới select box.

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
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


Có một bug trong code này. Bắt đầu bằng cách chọn "Alice". Sau đó chọn "Bob" và ngay sau đó chọn "Taylor". Nếu bạn làm điều này đủ nhanh, bạn sẽ nhận thấy bug đó: Taylor được chọn, nhưng đoạn văn bên dưới nói "This is Bob's bio."

Tại sao điều này xảy ra? Hãy sửa bug bên trong Effect này.

<Hint>

If an Effect fetches something asynchronously, it usually needs cleanup.

</Hint>

<Solution>

Để kích hoạt bug, mọi thứ cần xảy ra theo thứ tự này:

- Chọn `'Bob'` kích hoạt `fetchBio('Bob')`
- Chọn `'Taylor'` kích hoạt `fetchBio('Taylor')`
- **Fetching `'Taylor'` hoàn thành *trước* fetching `'Bob'`**
- Effect từ lần render `'Taylor'` gọi `setBio('This is Taylor's bio')`
- Fetching `'Bob'` hoàn thành
- Effect từ lần render `'Bob'` gọi `setBio('This is Bob's bio')`

Đây là lý do tại sao bạn thấy bio của Bob mặc dù Taylor được chọn. Những bug như thế này được gọi là [race conditions](https://en.wikipedia.org/wiki/Race_condition) vì hai thao tác bất đồng bộ đang "chạy đua" với nhau, và chúng có thể đến theo thứ tự không mong muốn.

Để sửa race condition này, hãy thêm một cleanup function:

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

Effect của mỗi lần render có biến `ignore` riêng của nó. Ban đầu, biến `ignore` được đặt thành `false`. Tuy nhiên, nếu Effect bị dọn dẹp (chẳng hạn khi bạn chọn một người khác), biến `ignore` của nó trở thành `true`. Vì vậy bây giờ không quan trọng các request hoàn thành theo thứ tự nào. Chỉ Effect của người cuối cùng sẽ có `ignore` được đặt thành `false`, nên nó sẽ gọi `setBio(result)`. Các Effect trước đó đã được dọn dẹp, vì vậy việc kiểm tra `if (!ignore)` sẽ ngăn chúng gọi `setBio`:

- Chọn `'Bob'` kích hoạt `fetchBio('Bob')`
- Chọn `'Taylor'` kích hoạt `fetchBio('Taylor')` **và dọn dẹp Effect trước đó (của Bob)**
- Fetching `'Taylor'` hoàn thành *trước* fetching `'Bob'`
- Effect từ lần render `'Taylor'` gọi `setBio('This is Taylor's bio')`
- Fetching `'Bob'` hoàn thành
- Effect từ lần render `'Bob'` **không làm gì vì flag `ignore` của nó được đặt thành `true`**

Ngoài việc bỏ qua kết quả của một lời gọi API lỗi thời, bạn cũng có thể sử dụng [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) để hủy các request không còn cần thiết. Tuy nhiên, bản thân điều này không đủ để bảo vệ chống lại race conditions. Nhiều bước bất đồng bộ có thể được nối tiếp sau fetch, vì vậy việc sử dụng một flag rõ ràng như `ignore` là cách đáng tin cậy nhất để sửa loại vấn đề này.

</Solution>

</Challenges>

