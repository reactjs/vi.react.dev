---
title: 'Tham chiếu giá trị với ref'
---

<Intro>

Khi bạn muốn một component "nhớ" một thông tin nào đó, nhưng bạn không muốn thông tin đó [kích hoạt render mới](/learn/render-and-commit), bạn có thể sử dụng *ref*.

</Intro>

<YouWillLearn>

- Cách thêm ref vào component của bạn
- Cách cập nhật giá trị của ref
- Sự khác biệt giữa ref và state
- Cách sử dụng ref một cách an toàn

</YouWillLearn>

## Thêm ref vào component của bạn {/*adding-a-ref-to-your-component*/}

Bạn có thể thêm ref vào component của mình bằng cách import Hook `useRef` từ React:

```js
import { useRef } from 'react';
```

Bên trong component, gọi Hook `useRef` và truyền giá trị khởi tạo mà bạn muốn tham chiếu làm đối số duy nhất. Ví dụ, đây là một ref trỏ tới giá trị `0`:

```js
const ref = useRef(0);
```

`useRef` trả về một object như sau:

```js
{ 
  current: 0 // The value you passed to useRef
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="An arrow with 'current' written on it stuffed into a pocket with 'ref' written on it." />

Bạn có thể truy cập giá trị hiện tại của ref thông qua thuộc tính `ref.current`. Giá trị này có thể thay đổi được, nghĩa là bạn có thể đọc và ghi vào nó. Nó giống như một "túi bí mật" của component mà React không theo dõi. (Đây là lý do nó được gọi là "lối thoát" khỏi luồng dữ liệu một chiều của React—sẽ nói rõ hơn bên dưới!)

Ở ví dụ sau, một button sẽ tăng `ref.current` mỗi lần click:

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

Ref này trỏ tới một số, nhưng, giống như [state](/learn/state-a-components-memory), bạn có thể trỏ tới bất cứ thứ gì: một chuỗi, một object, hoặc thậm chí một function. Khác với state, ref là một object JavaScript thuần với thuộc tính `current` mà bạn có thể đọc và sửa đổi.

Lưu ý rằng **component sẽ không re-render mỗi lần tăng giá trị.** Giống như state, ref được React giữ lại giữa các lần re-render. Tuy nhiên, khi set state sẽ làm component re-render. Thay đổi ref thì không!

## Ví dụ: xây dựng đồng hồ bấm giờ {/*example-building-a-stopwatch*/}

Bạn có thể kết hợp ref và state trong cùng một component. Ví dụ, hãy tạo một đồng hồ bấm giờ mà người dùng có thể bắt đầu hoặc dừng bằng cách nhấn nút. Để hiển thị thời gian đã trôi qua kể từ khi người dùng nhấn "Start", bạn cần theo dõi thời điểm nhấn Start và thời gian hiện tại. **Thông tin này được dùng để render, nên bạn sẽ lưu nó trong state:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

Khi người dùng nhấn "Start", bạn sẽ dùng [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) để cập nhật thời gian mỗi 10 mili giây:

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Start counting.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Update the current time every 10ms.
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
    </>
  );
}
```

</Sandpack>

Khi nhấn nút "Stop", bạn cần hủy interval hiện tại để nó ngừng cập nhật biến state `now`. Bạn có thể làm điều này bằng cách gọi [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval), nhưng bạn cần truyền vào ID interval đã được trả về từ `setInterval` khi người dùng nhấn Start. Bạn cần lưu ID interval ở đâu đó. **Vì interval ID không dùng để render, bạn có thể lưu nó trong ref:**

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
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

Khi một thông tin được dùng để render, hãy lưu nó trong state. Khi một thông tin chỉ cần cho event handler và thay đổi nó không cần re-render, dùng ref sẽ hiệu quả hơn.

## Sự khác biệt giữa ref và state {/*differences-between-refs-and-state*/}

Có thể bạn nghĩ ref có vẻ "lỏng lẻo" hơn state—bạn có thể thay đổi trực tiếp thay vì luôn phải dùng hàm set state, chẳng hạn. Nhưng trong hầu hết trường hợp, bạn nên dùng state. Ref là "lối thoát" mà bạn sẽ không cần dùng thường xuyên. So sánh giữa state và ref:

| ref                                                                                  | state                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` trả về `{ current: initialValue }`                            | `useState(initialValue)` trả về giá trị hiện tại của biến state và một hàm set state (`[value, setValue]`) |
| Không kích hoạt re-render khi bạn thay đổi nó.                                         | Kích hoạt re-render khi bạn thay đổi nó.                                                                                    |
| Có thể thay đổi—bạn có thể sửa đổi giá trị `current` bên ngoài quá trình render. | "Không thể thay đổi trực tiếp"—bạn phải dùng hàm set state để sửa đổi biến state và xếp hàng re-render.                       |
| Bạn không nên đọc (hoặc ghi) giá trị `current` trong quá trình render. | Bạn có thể đọc state bất cứ lúc nào. Tuy nhiên, mỗi lần render sẽ có [snapshot](/learn/state-as-a-snapshot) riêng của state và không thay đổi.

Đây là một button đếm số lần nhấn được cài đặt bằng state:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked {count} times
    </button>
  );
}
```

</Sandpack>

Vì giá trị `count` được hiển thị, nên hợp lý khi dùng state cho nó. Khi giá trị counter được set bằng `setCount()`, React sẽ re-render component và màn hình sẽ cập nhật giá trị mới.

Nếu bạn thử cài đặt bằng ref, React sẽ không bao giờ re-render component, nên bạn sẽ không thấy giá trị count thay đổi! Xem ví dụ dưới đây, **click button sẽ không cập nhật text**:

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // This doesn't re-render the component!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

</Sandpack>

Đây là lý do việc đọc `ref.current` trong render sẽ dẫn đến code khó dự đoán. Nếu bạn cần điều này, hãy dùng state thay vì ref.

<DeepDive>

#### useRef hoạt động như thế nào bên trong? {/*how-does-use-ref-work-inside*/}

Mặc dù cả `useState` và `useRef` đều được cung cấp bởi React, về nguyên tắc, `useRef` có thể được cài đặt _dựa trên_ `useState`. Bạn có thể hình dung bên trong React, `useRef` được cài đặt như sau:

```js
// Inside of React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

Trong lần render đầu tiên, `useRef` trả về `{ current: initialValue }`. Object này được React lưu lại, nên ở lần render tiếp theo, cùng một object sẽ được trả về. Lưu ý hàm set state không được dùng ở ví dụ này. Nó không cần thiết vì `useRef` luôn trả về cùng một object!

React cung cấp sẵn `useRef` vì nó đủ phổ biến trong thực tế. Nhưng bạn có thể coi nó như một biến state không có setter. Nếu bạn quen với lập trình hướng đối tượng, ref có thể khiến bạn liên tưởng đến các trường instance—nhưng thay vì `this.something` bạn sẽ viết `somethingRef.current`.

</DeepDive>

## Khi nào nên dùng ref {/*when-to-use-refs*/}

Thông thường, bạn sẽ dùng ref khi component cần "bước ra ngoài" React và giao tiếp với các API bên ngoài—thường là API trình duyệt mà không ảnh hưởng đến giao diện component. Một số trường hợp hiếm gặp này gồm:

- Lưu [timeout ID](https://developer.mozilla.org/docs/Web/API/setTimeout)
- Lưu trữ và thao tác với [DOM element](https://developer.mozilla.org/docs/Web/API/Element), sẽ được nói ở [trang tiếp theo](/learn/manipulating-the-dom-with-refs)
- Lưu các object khác không cần thiết để tính toán JSX.

Nếu component của bạn cần lưu một giá trị, nhưng nó không ảnh hưởng đến logic render, hãy chọn ref.

## Best practices cho ref {/*best-practices-for-refs*/}

Làm theo các nguyên tắc sau sẽ giúp component của bạn dễ dự đoán hơn:

- **Xem ref như một lối thoát.** Ref hữu ích khi bạn làm việc với hệ thống bên ngoài hoặc API trình duyệt. Nếu phần lớn logic và luồng dữ liệu của ứng dụng dựa vào ref, bạn nên xem lại cách tiếp cận.
- **Không đọc hoặc ghi `ref.current` trong quá trình render.** Nếu một thông tin cần thiết khi render, hãy dùng [state](/learn/state-a-components-memory) thay vì ref. Vì React không biết khi nào `ref.current` thay đổi, ngay cả việc đọc nó khi render cũng khiến hành vi component khó đoán. (Ngoại lệ duy nhất là code như `if (!ref.current) ref.current = new Thing()` chỉ set ref một lần ở render đầu tiên.)

Những giới hạn của state không áp dụng cho ref. Ví dụ, state hoạt động như một [snapshot cho mỗi lần render](/learn/state-as-a-snapshot) và [không cập nhật đồng bộ.](/learn/queueing-a-series-of-state-updates) Nhưng khi bạn thay đổi giá trị hiện tại của ref, nó thay đổi ngay lập tức:

```js
ref.current = 5;
console.log(ref.current); // 5
```

Bởi vì **ref thực chất là một object JavaScript thuần,** nên nó hoạt động như vậy.

Bạn cũng không cần lo về [tránh mutation](/learn/updating-objects-in-state) khi làm việc với ref. Miễn là object bạn thay đổi không dùng để render, React không quan tâm bạn làm gì với ref hoặc nội dung của nó.

## Ref và DOM {/*refs-and-the-dom*/}

Bạn có thể trỏ ref tới bất kỳ giá trị nào. Tuy nhiên, trường hợp phổ biến nhất là dùng ref để truy cập DOM element. Ví dụ, điều này rất tiện nếu bạn muốn focus input bằng code. Khi bạn truyền ref vào thuộc tính `ref` trong JSX, như `<div ref={myRef}>`, React sẽ gán DOM element tương ứng vào `myRef.current`. Khi element bị xóa khỏi DOM, React sẽ cập nhật `myRef.current` thành `null`. Bạn có thể đọc thêm ở [Thao tác DOM với ref.](/learn/manipulating-the-dom-with-refs)

<Recap>

- Ref là lối thoát để giữ giá trị không dùng cho render. Bạn sẽ không cần dùng thường xuyên.
- Ref là một object JavaScript thuần với thuộc tính duy nhất là `current`, bạn có thể đọc hoặc gán giá trị cho nó.
- Bạn có thể yêu cầu React cấp cho bạn một ref bằng cách gọi Hook `useRef`.
- Giống như state, ref giúp bạn giữ thông tin giữa các lần re-render của component.
- Khác với state, set giá trị `current` của ref sẽ không kích hoạt re-render.
- Đừng đọc hoặc ghi `ref.current` trong quá trình render. Điều này khiến component khó dự đoán.

</Recap>



<Challenges>

#### Sửa input chat bị lỗi {/*fix-a-broken-chat-input*/}

Nhập một tin nhắn và click "Send". Bạn sẽ thấy có độ trễ ba giây trước khi hiện alert "Sent!". Trong lúc chờ, bạn sẽ thấy nút "Undo". Click vào đó. Nút "Undo" này đáng lẽ phải ngăn không cho hiện thông báo "Sent!". Nó làm điều này bằng cách gọi [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) với timeout ID đã lưu trong `handleSend`. Tuy nhiên, ngay cả khi đã click "Undo", thông báo "Sent!" vẫn xuất hiện. Hãy tìm lý do và sửa lại.

<Hint>

Biến thông thường như `let timeoutID` sẽ không "sống sót" qua các lần re-render vì mỗi lần render sẽ chạy lại component (và khởi tạo lại biến). Bạn nên lưu timeout ID ở đâu?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

Mỗi lần component re-render (ví dụ khi set state), tất cả biến cục bộ sẽ được khởi tạo lại từ đầu. Đó là lý do bạn không thể lưu timeout ID vào biến cục bộ như `timeoutID` rồi mong event handler khác "nhìn thấy" nó sau này. Thay vào đó, hãy lưu nó trong ref, React sẽ giữ lại giữa các lần render.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


#### Sửa component không re-render {/*fix-a-component-failing-to-re-render*/}

Button này đáng lẽ phải chuyển đổi giữa "On" và "Off". Tuy nhiên, nó luôn hiển thị "Off". Sai ở đâu? Hãy sửa lại.

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

Ở ví dụ này, giá trị hiện tại của ref được dùng để tính toán khi render: `{isOnRef.current ? 'On' : 'Off'}`. Đây là dấu hiệu cho thấy thông tin này không nên lưu trong ref, mà nên lưu trong state. Để sửa, hãy bỏ ref và dùng state:

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Sửa debounce {/*fix-debouncing*/}

Ở ví dụ này, tất cả handler click của button đều được ["debounce".](https://kettanaito.com/blog/debounce-vs-throttle) Để thấy điều này, hãy nhấn một button. Chú ý thông báo xuất hiện sau một giây. Nếu bạn nhấn button khi đang chờ, timer sẽ reset. Nếu bạn nhấn liên tục thật nhanh, thông báo sẽ chỉ xuất hiện *sau* khi bạn dừng nhấn một giây. Debounce giúp bạn trì hoãn một hành động cho đến khi người dùng "ngừng thao tác".

Ví dụ này hoạt động, nhưng chưa đúng ý. Các button không độc lập. Để thấy vấn đề, nhấn một button, rồi ngay lập tức nhấn button khác. Bạn sẽ mong sau một lúc sẽ thấy cả hai thông báo. Nhưng chỉ có thông báo của button cuối cùng xuất hiện. Thông báo của button đầu bị mất.

Tại sao các button lại ảnh hưởng lẫn nhau? Hãy tìm và sửa lỗi này.

<Hint>

Biến timeout ID cuối cùng được chia sẻ giữa tất cả component DebouncedButton. Đó là lý do nhấn một button sẽ reset timeout của button khác. Bạn có thể lưu timeout riêng cho từng button không?

</Hint>

<Sandpack>

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

Biến như `timeoutID` được chia sẻ giữa tất cả component. Đó là lý do nhấn button thứ hai sẽ reset timeout đang chờ của button đầu. Để sửa, bạn có thể lưu timeout trong ref. Mỗi button sẽ có một ref riêng, nên chúng không ảnh hưởng nhau. Hãy thử nhấn hai button liên tiếp, bạn sẽ thấy cả hai thông báo xuất hiện.

<Sandpack>

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### Đọc state mới nhất {/*read-the-latest-state*/}

Ở ví dụ này, sau khi bạn nhấn "Send", sẽ có một độ trễ nhỏ trước khi tin nhắn được hiển thị. Hãy nhập "hello", nhấn Send, rồi nhanh chóng chỉnh sửa input. Dù bạn đã chỉnh sửa, alert vẫn hiển thị "hello" (đó là giá trị state [tại thời điểm](/learn/state-as-a-snapshot#state-over-time) nhấn button).

Thông thường, hành vi này là điều bạn muốn trong ứng dụng. Tuy nhiên, đôi khi bạn muốn một đoạn code bất đồng bộ đọc *state mới nhất*. Bạn có nghĩ ra cách nào để alert hiển thị *input hiện tại* thay vì giá trị tại thời điểm click không?

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

State hoạt động [như một snapshot](/learn/state-as-a-snapshot), nên bạn không thể đọc state mới nhất từ một thao tác bất đồng bộ như timeout. Tuy nhiên, bạn có thể lưu input mới nhất vào ref. Ref có thể thay đổi, nên bạn có thể đọc thuộc tính `current` bất cứ lúc nào. Vì text hiện tại cũng dùng để render, trong ví dụ này, bạn sẽ cần *cả* biến state (để render), *và* ref (để đọc trong timeout). Bạn cần cập nhật giá trị ref thủ công.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
