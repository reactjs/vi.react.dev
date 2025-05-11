---
title: useRef
---

<Intro>

`useRef` là một React Hook cho phép bạn tham chiếu một giá trị không cần thiết cho việc hiển thị.

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

Gọi `useRef` ở cấp cao nhất của component để khai báo một [ref.](/learn/referencing-values-with-refs)

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `initialValue`: Giá trị bạn muốn thuộc tính `current` của đối tượng ref được khởi tạo ban đầu. Nó có thể là một giá trị của bất kỳ kiểu nào. Đối số này bị bỏ qua sau lần hiển thị ban đầu.

#### Giá trị trả về {/*returns*/}

`useRef` trả về một đối tượng với một thuộc tính duy nhất:

* `current`: Ban đầu, nó được đặt thành `initialValue` mà bạn đã truyền. Sau đó, bạn có thể đặt nó thành một giá trị khác. Nếu bạn truyền đối tượng ref cho React dưới dạng thuộc tính `ref` cho một nút JSX, React sẽ đặt thuộc tính `current` của nó.

Trong các lần hiển thị tiếp theo, `useRef` sẽ trả về cùng một đối tượng.

#### Lưu ý {/*caveats*/}

* Bạn có thể thay đổi thuộc tính `ref.current`. Không giống như state, nó có thể thay đổi được. Tuy nhiên, nếu nó chứa một đối tượng được sử dụng để hiển thị (ví dụ: một phần của state của bạn), thì bạn không nên thay đổi đối tượng đó.
* Khi bạn thay đổi thuộc tính `ref.current`, React không hiển thị lại component của bạn. React không nhận biết được khi bạn thay đổi nó vì ref là một đối tượng JavaScript thuần túy.
* Không viết _hoặc đọc_ `ref.current` trong quá trình hiển thị, ngoại trừ [khởi tạo.](#avoiding-recreating-the-ref-contents) Điều này làm cho hành vi của component của bạn trở nên khó đoán.
* Trong Strict Mode, React sẽ **gọi hàm component của bạn hai lần** để [giúp bạn tìm ra những tạp chất vô tình.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) Đây là hành vi chỉ dành cho quá trình phát triển và không ảnh hưởng đến production. Mỗi đối tượng ref sẽ được tạo hai lần, nhưng một trong các phiên bản sẽ bị loại bỏ. Nếu hàm component của bạn là thuần túy (như nó phải vậy), điều này sẽ không ảnh hưởng đến hành vi.

---

## Cách sử dụng {/*usage*/}

### Tham chiếu một giá trị với ref {/*referencing-a-value-with-a-ref*/}

Gọi `useRef` ở cấp cao nhất của component để khai báo một hoặc nhiều [refs.](/learn/referencing-values-with-refs)

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` trả về một <CodeStep step={1}>đối tượng ref</CodeStep> với một <CodeStep step={2}>thuộc tính `current`</CodeStep> duy nhất ban đầu được đặt thành <CodeStep step={3}>giá trị ban đầu</CodeStep> mà bạn đã cung cấp.

Trong các lần hiển thị tiếp theo, `useRef` sẽ trả về cùng một đối tượng. Bạn có thể thay đổi thuộc tính `current` của nó để lưu trữ thông tin và đọc nó sau này. Điều này có thể khiến bạn nhớ đến [state](/reference/react/useState), nhưng có một sự khác biệt quan trọng.

**Thay đổi ref không kích hoạt hiển thị lại.** Điều này có nghĩa là ref là hoàn hảo để lưu trữ thông tin không ảnh hưởng đến đầu ra trực quan của component của bạn. Ví dụ: nếu bạn cần lưu trữ một [ID khoảng thời gian](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) và truy xuất nó sau này, bạn có thể đặt nó trong một ref. Để cập nhật giá trị bên trong ref, bạn cần thay đổi thủ công <CodeStep step={2}>thuộc tính `current`</CodeStep> của nó:

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

Sau đó, bạn có thể đọc ID khoảng thời gian đó từ ref để bạn có thể gọi [xóa khoảng thời gian đó](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

Bằng cách sử dụng ref, bạn đảm bảo rằng:

- Bạn có thể **lưu trữ thông tin** giữa các lần hiển thị lại (không giống như các biến thông thường, được đặt lại trên mỗi lần hiển thị).
- Thay đổi nó **không kích hoạt hiển thị lại** (không giống như các biến state, kích hoạt hiển thị lại).
- **Thông tin là cục bộ** cho mỗi bản sao của component của bạn (không giống như các biến bên ngoài, được chia sẻ).

Thay đổi ref không kích hoạt hiển thị lại, vì vậy ref không phù hợp để lưu trữ thông tin bạn muốn hiển thị trên màn hình. Thay vào đó, hãy sử dụng state. Đọc thêm về [lựa chọn giữa `useRef` và `useState`.](/learn/referencing-values-with-refs#differences-between-refs-and-state)

<Recipes titleText="Ví dụ về tham chiếu một giá trị với useRef" titleId="examples-value">

#### Bộ đếm nhấp chuột {/*click-counter*/}

Component này sử dụng ref để theo dõi số lần nút được nhấp. Lưu ý rằng bạn có thể sử dụng ref thay vì state ở đây vì số lần nhấp chỉ được đọc và ghi trong một trình xử lý sự kiện.

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

Nếu bạn hiển thị `{ref.current}` trong JSX, số sẽ không cập nhật khi nhấp. Điều này là do việc đặt `ref.current` không kích hoạt hiển thị lại. Thông tin được sử dụng để hiển thị nên là state.

<Solution />

#### Đồng hồ bấm giờ {/*a-stopwatch*/}

Ví dụ này sử dụng kết hợp state và ref. Cả `startTime` và `now` đều là các biến state vì chúng được sử dụng để hiển thị. Nhưng chúng ta cũng cần giữ một [ID khoảng thời gian](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) để chúng ta có thể dừng khoảng thời gian khi nhấn nút. Vì ID khoảng thời gian không được sử dụng để hiển thị, nên việc giữ nó trong một ref và cập nhật thủ công là phù hợp.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Thời gian đã trôi qua: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Bắt đầu
      </button>
      <button onClick={handleStop}>
        Dừng lại
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

**Không viết _hoặc đọc_ `ref.current` trong quá trình hiển thị.**

React mong đợi rằng phần thân của component của bạn [hoạt động như một hàm thuần túy](/learn/keeping-components-pure):

- Nếu các đầu vào ([props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory) và [context](/learn/passing-data-deeply-with-context)) giống nhau, nó sẽ trả về chính xác cùng một JSX.
- Gọi nó theo một thứ tự khác hoặc với các đối số khác nhau sẽ không ảnh hưởng đến kết quả của các lệnh gọi khác.

Đọc hoặc ghi ref **trong quá trình hiển thị** phá vỡ những kỳ vọng này.

```js {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 Không viết ref trong quá trình hiển thị
  myRef.current = 123;
  // ...
  // 🚩 Không đọc ref trong quá trình hiển thị
  return <h1>{myOtherRef.current}</h1>;
}
```

Bạn có thể đọc hoặc ghi ref **từ các trình xử lý sự kiện hoặc hiệu ứng thay thế**.

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ Bạn có thể đọc hoặc ghi ref trong các hiệu ứng
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ Bạn có thể đọc hoặc ghi ref trong các trình xử lý sự kiện
    doSomething(myOtherRef.current);
  }
  // ...
}
```

Nếu bạn *phải* đọc [hoặc viết](/reference/react/useState#storing-information-from-previous-renders) một cái gì đó trong quá trình hiển thị, hãy [sử dụng state](/reference/react/useState) thay thế.

Khi bạn phá vỡ các quy tắc này, component của bạn vẫn có thể hoạt động, nhưng hầu hết các tính năng mới hơn mà chúng tôi đang thêm vào React sẽ dựa trên những kỳ vọng này. Đọc thêm về [giữ cho component của bạn thuần túy.](/learn/keeping-components-pure#where-you-_can_-cause-side-effects)

</Pitfall>

---

### Thao tác DOM với ref {/*manipulating-the-dom-with-a-ref*/}

Việc sử dụng ref để thao tác [DOM](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) là đặc biệt phổ biến. React có hỗ trợ tích hợp cho việc này.

Đầu tiên, khai báo một <CodeStep step={1}>đối tượng ref</CodeStep> với một <CodeStep step={3}>giá trị ban đầu</CodeStep> là `null`:

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

Sau đó, chuyển đối tượng ref của bạn làm thuộc tính `ref` cho JSX của nút DOM bạn muốn thao tác:

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

Sau khi React tạo nút DOM và đặt nó trên màn hình, React sẽ đặt <CodeStep step={2}>thuộc tính `current`</CodeStep> của đối tượng ref của bạn thành nút DOM đó. Bây giờ bạn có thể truy cập nút DOM của `<input>` và gọi các phương thức như [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus):

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

React sẽ đặt thuộc tính `current` trở lại `null` khi nút bị xóa khỏi màn hình.

Đọc thêm về [thao tác DOM với ref.](/learn/manipulating-the-dom-with-refs)

<Recipes titleText="Ví dụ về thao tác DOM với useRef" titleId="examples-dom">

#### Tập trung vào một ô nhập văn bản {/*focusing-a-text-input*/}

Trong ví dụ này, việc nhấp vào nút sẽ tập trung vào ô nhập:

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
        Tập trung vào ô nhập
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Cuộn một hình ảnh vào chế độ xem {/*scrolling-an-image-into-view*/}

Trong ví dụ này, việc nhấp vào nút sẽ cuộn một hình ảnh vào chế độ xem. Nó sử dụng ref cho nút DOM danh sách, sau đó gọi API DOM [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) để tìm hình ảnh chúng ta muốn cuộn đến.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // Dòng này giả định một cấu trúc DOM cụ thể:
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Neo
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Millie
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Bella
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
            />
          </li>
        </ul>
      </div>
    </>
  );
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

<Solution />

#### Phát và tạm dừng video {/*playing-and-pausing-a-video*/}

Ví dụ này sử dụng ref để gọi [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) và [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) trên một nút DOM `<video>`.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Tạm dừng' : 'Phát'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### Hiển thị ref cho component của riêng bạn {/*exposing-a-ref-to-your-own-component*/}

Đôi khi, bạn có thể muốn cho phép component cha thao tác DOM bên trong component của bạn. Ví dụ: có thể bạn đang viết một component `MyInput`, nhưng bạn muốn component cha có thể tập trung vào ô nhập (mà component cha không có quyền truy cập). Bạn có thể tạo một `ref` trong component cha và chuyển `ref` làm prop cho component con. Đọc [hướng dẫn chi tiết](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) tại đây.

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Tập trung vào ô nhập
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Tránh tạo lại nội dung ref {/*avoiding-recreating-the-ref-contents*/}

React lưu giá trị ref ban đầu một lần và bỏ qua nó trong các lần hiển thị tiếp theo.

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

Mặc dù kết quả của `new VideoPlayer()` chỉ được sử dụng cho lần hiển thị ban đầu, nhưng bạn vẫn đang gọi hàm này trên mỗi lần hiển thị. Điều này có thể gây lãng phí nếu nó đang tạo ra các đối tượng tốn kém.

Để giải quyết vấn đề này, bạn có thể khởi tạo ref như thế này thay thế:

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

Thông thường, việc viết hoặc đọc `ref.current` trong quá trình hiển thị là không được phép. Tuy nhiên, điều này là ổn trong trường hợp này vì kết quả luôn giống nhau và điều kiện chỉ thực thi trong quá trình khởi tạo nên nó hoàn toàn có thể đoán trước được.

<DeepDive>

#### Làm thế nào để tránh kiểm tra null khi khởi tạo useRef sau {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

Nếu bạn sử dụng trình kiểm tra kiểu và không muốn luôn kiểm tra `null`, bạn có thể thử một mẫu như thế này thay thế:

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

Ở đây, bản thân `playerRef` có thể null. Tuy nhiên, bạn sẽ có thể thuyết phục trình kiểm tra kiểu của mình rằng không có trường hợp nào `getPlayer()` trả về `null`. Sau đó, sử dụng `getPlayer()` trong các trình xử lý sự kiện của bạn.

</DeepDive>

---

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi không thể lấy ref cho một component tùy chỉnh {/*i-cant-get-a-ref-to-a-custom-component*/}

Nếu bạn cố gắng chuyển một `ref` cho component của riêng bạn như thế này:

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

Bạn có thể gặp lỗi trong bảng điều khiển:

<ConsoleBlock level="error">

TypeError: Không thể đọc các thuộc tính của null

</ConsoleBlock>

Theo mặc định, các component của riêng bạn không hiển thị ref cho các nút DOM bên trong chúng.

Để khắc phục điều này, hãy tìm component mà bạn muốn lấy ref:

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

Và sau đó thêm `ref` vào danh sách các prop mà component của bạn chấp nhận và chuyển `ref` làm prop cho [component tích hợp sẵn](/reference/react-dom/components/common) có liên quan như thế này:

```js {1,6}
function MyInput({ value, onChange, ref }) {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
};

export default MyInput;
```

Sau đó, component cha có thể lấy ref cho nó.

Đọc thêm về [truy cập các nút DOM của component khác.](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)
