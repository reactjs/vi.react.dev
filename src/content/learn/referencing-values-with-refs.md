---
title: 'Tham chiếu các giá trị với Refs'
---

<Intro>

Khi bạn muốn một component "ghi nhớ" một số thông tin, nhưng bạn không muốn thông tin đó [kích hoạt các lần render mới](/learn/render-and-commit), bạn có thể sử dụng *ref*.

</Intro>

<YouWillLearn>

- Cách thêm một ref vào component của bạn
- Cách cập nhật giá trị của một ref
- Sự khác biệt giữa refs và state
- Cách sử dụng refs một cách an toàn

</YouWillLearn>

## Thêm một ref vào component của bạn {/*adding-a-ref-to-your-component*/}

Bạn có thể thêm một ref vào component của mình bằng cách import Hook `useRef` từ React:

```js
import { useRef } from 'react';
```

Bên trong component của bạn, hãy gọi Hook `useRef` và truyền giá trị ban đầu mà bạn muốn tham chiếu làm đối số duy nhất. Ví dụ: đây là một ref đến giá trị `0`:

```js
const ref = useRef(0);
```

`useRef` trả về một đối tượng như thế này:

```js
{ 
  current: 0 // Giá trị bạn đã truyền cho useRef
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="Một mũi tên có chữ 'current' được viết trên đó nhét vào một túi có chữ 'ref' được viết trên đó." />

Bạn có thể truy cập giá trị hiện tại của ref đó thông qua thuộc tính `ref.current`. Giá trị này có thể thay đổi một cách có chủ ý, có nghĩa là bạn có thể đọc và ghi vào nó. Nó giống như một túi bí mật của component mà React không theo dõi. (Đây là điều làm cho nó trở thành một "lối thoát" khỏi luồng dữ liệu một chiều của React--thêm về điều đó bên dưới!)

Ở đây, một nút sẽ tăng `ref.current` trên mỗi lần nhấp:

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

Ref trỏ đến một số, nhưng, giống như [state](/learn/state-a-components-memory), bạn có thể trỏ đến bất cứ thứ gì: một chuỗi, một đối tượng hoặc thậm chí một hàm. Không giống như state, ref là một đối tượng JavaScript thuần túy với thuộc tính `current` mà bạn có thể đọc và sửa đổi.

Lưu ý rằng **component không re-render với mỗi lần tăng.** Giống như state, refs được React giữ lại giữa các lần re-render. Tuy nhiên, việc đặt state sẽ re-render một component. Thay đổi một ref thì không!

## Ví dụ: xây dựng đồng hồ bấm giờ {/*example-building-a-stopwatch*/}

Bạn có thể kết hợp refs và state trong một component duy nhất. Ví dụ: hãy tạo một đồng hồ bấm giờ mà người dùng có thể bắt đầu hoặc dừng bằng cách nhấn một nút. Để hiển thị thời gian đã trôi qua kể từ khi người dùng nhấn "Bắt đầu", bạn sẽ cần theo dõi thời điểm nút Bắt đầu được nhấn và thời gian hiện tại là bao nhiêu. **Thông tin này được sử dụng để render, vì vậy bạn sẽ giữ nó trong state:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

Khi người dùng nhấn "Bắt đầu", bạn sẽ sử dụng [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) để cập nhật thời gian sau mỗi 10 mili giây:

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Bắt đầu đếm.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Cập nhật thời gian hiện tại sau mỗi 10ms.
      setNow(Date.now());
    }, 10);
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
    </>
  );
}
```

</Sandpack>

Khi nút "Dừng" được nhấn, bạn cần hủy interval hiện có để nó ngừng cập nhật biến state `now`. Bạn có thể thực hiện việc này bằng cách gọi [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval), nhưng bạn cần cung cấp cho nó ID interval đã được trả về trước đó bởi lệnh gọi `setInterval` khi người dùng nhấn Bắt đầu. Bạn cần giữ ID interval ở đâu đó. **Vì ID interval không được sử dụng để render, bạn có thể giữ nó trong một ref:**

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
        Dừng
      </button>
    </>
  );
}
```

</Sandpack>

Khi một phần thông tin được sử dụng để render, hãy giữ nó trong state. Khi một phần thông tin chỉ cần thiết cho các trình xử lý sự kiện và việc thay đổi nó không yêu cầu re-render, thì việc sử dụng ref có thể hiệu quả hơn.

## Sự khác biệt giữa refs và state {/*differences-between-refs-and-state*/}

Có lẽ bạn đang nghĩ rằng refs có vẻ ít "nghiêm ngặt" hơn state—ví dụ: bạn có thể thay đổi chúng thay vì luôn phải sử dụng một hàm thiết lập state. Nhưng trong hầu hết các trường hợp, bạn sẽ muốn sử dụng state. Refs là một "lối thoát" mà bạn sẽ không cần thường xuyên. Đây là cách so sánh state và refs:

| refs                                                                                  | state                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` trả về `{ current: initialValue }`                            | `useState(initialValue)` trả về giá trị hiện tại của một biến state và một hàm thiết lập state ( `[value, setValue]`) |
| Không kích hoạt re-render khi bạn thay đổi nó.                                         | Kích hoạt re-render khi bạn thay đổi nó.                                                                                    |
| Có thể thay đổi—bạn có thể sửa đổi và cập nhật giá trị của `current` bên ngoài quá trình render. | "Bất biến"—bạn phải sử dụng hàm thiết lập state để sửa đổi các biến state để xếp hàng đợi re-render.                       |
| Bạn không nên đọc (hoặc ghi) giá trị `current` trong quá trình render. | Bạn có thể đọc state bất cứ lúc nào. Tuy nhiên, mỗi lần render có [ảnh chụp nhanh](/learn/state-as-a-snapshot) riêng của state mà không thay đổi.

Đây là một nút đếm được triển khai bằng state:

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
      Bạn đã nhấp {count} lần
    </button>
  );
}
```

</Sandpack>

Vì giá trị `count` được hiển thị, nên việc sử dụng giá trị state cho nó là hợp lý. Khi giá trị của bộ đếm được đặt bằng `setCount()`, React sẽ re-render component và màn hình sẽ cập nhật để phản ánh số lượng mới.

Nếu bạn cố gắng triển khai điều này với một ref, React sẽ không bao giờ re-render component, vì vậy bạn sẽ không bao giờ thấy số lượng thay đổi! Xem cách nhấp vào nút này **không cập nhật văn bản của nó**:

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // Điều này không re-render component!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      Bạn đã nhấp {countRef.current} lần
    </button>
  );
}
```

</Sandpack>

Đây là lý do tại sao việc đọc `ref.current` trong quá trình render dẫn đến mã không đáng tin cậy. Nếu bạn cần điều đó, hãy sử dụng state thay thế.

<DeepDive>

#### useRef hoạt động như thế nào bên trong? {/*how-does-use-ref-work-inside*/}

Mặc dù cả `useState` và `useRef` đều được cung cấp bởi React, nhưng về nguyên tắc, `useRef` có thể được triển khai _trên_ `useState`. Bạn có thể tưởng tượng rằng bên trong React, `useRef` được triển khai như thế này:

```js
// Bên trong React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

Trong lần render đầu tiên, `useRef` trả về `{ current: initialValue }`. Đối tượng này được React lưu trữ, vì vậy trong lần render tiếp theo, cùng một đối tượng sẽ được trả về. Lưu ý cách setter state không được sử dụng trong ví dụ này. Nó là không cần thiết vì `useRef` luôn cần trả về cùng một đối tượng!

React cung cấp một phiên bản tích hợp của `useRef` vì nó đủ phổ biến trong thực tế. Nhưng bạn có thể coi nó như một biến state thông thường mà không có setter. Nếu bạn quen thuộc với lập trình hướng đối tượng, refs có thể nhắc bạn về các trường instance--nhưng thay vì `this.something`, bạn viết `somethingRef.current`.

</DeepDive>

## Khi nào nên sử dụng refs {/*when-to-use-refs*/}

Thông thường, bạn sẽ sử dụng ref khi component của bạn cần "bước ra ngoài" React và giao tiếp với các API bên ngoài—thường là một API trình duyệt sẽ không ảnh hưởng đến giao diện của component. Dưới đây là một vài trong số những tình huống hiếm gặp này:

- Lưu trữ [ID timeout](https://developer.mozilla.org/docs/Web/API/setTimeout)
- Lưu trữ và thao tác [các phần tử DOM](https://developer.mozilla.org/docs/Web/API/Element), mà chúng ta sẽ đề cập trên [trang tiếp theo](/learn/manipulating-the-dom-with-refs)
- Lưu trữ các đối tượng khác không cần thiết để tính toán JSX.

Nếu component của bạn cần lưu trữ một số giá trị, nhưng nó không ảnh hưởng đến logic render, hãy chọn refs.

## Các phương pháp hay nhất cho refs {/*best-practices-for-refs*/}

Tuân theo các nguyên tắc này sẽ làm cho các component của bạn dễ đoán hơn:

- **Coi refs như một lối thoát.** Refs rất hữu ích khi bạn làm việc với các hệ thống bên ngoài hoặc API trình duyệt. Nếu phần lớn logic ứng dụng và luồng dữ liệu của bạn dựa vào refs, bạn có thể muốn xem xét lại cách tiếp cận của mình.
- **Không đọc hoặc ghi `ref.current` trong quá trình render.** Nếu một số thông tin là cần thiết trong quá trình render, hãy sử dụng [state](/learn/state-a-components-memory) thay thế. Vì React không biết khi nào `ref.current` thay đổi, ngay cả việc đọc nó trong khi render cũng khiến hành vi của component của bạn khó dự đoán. (Ngoại lệ duy nhất cho điều này là mã như `if (!ref.current) ref.current = new Thing()` chỉ đặt ref một lần trong lần render đầu tiên.)

Các hạn chế của state React không áp dụng cho refs. Ví dụ: state hoạt động như một [ảnh chụp nhanh cho mỗi lần render](/learn/state-as-a-snapshot) và [không cập nhật đồng bộ.](/learn/queueing-a-series-of-state-updates) Nhưng khi bạn thay đổi giá trị hiện tại của một ref, nó sẽ thay đổi ngay lập tức:

```js
ref.current = 5;
console.log(ref.current); // 5
```

Điều này là do **bản thân ref là một đối tượng JavaScript thông thường,** và do đó nó hoạt động như một đối tượng.

Bạn cũng không cần phải lo lắng về việc [tránh đột biến](/learn/updating-objects-in-state) khi bạn làm việc với một ref. Miễn là đối tượng bạn đang đột biến không được sử dụng để render, React không quan tâm bạn làm gì với ref hoặc nội dung của nó.

## Refs và DOM {/*refs-and-the-dom*/}

Bạn có thể trỏ một ref đến bất kỳ giá trị nào. Tuy nhiên, trường hợp sử dụng phổ biến nhất cho một ref là truy cập một phần tử DOM. Ví dụ: điều này rất hữu ích nếu bạn muốn tập trung vào một đầu vào theo chương trình. Khi bạn chuyển một ref đến một thuộc tính `ref` trong JSX, như `<div ref={myRef}>`, React sẽ đặt phần tử DOM tương ứng vào `myRef.current`. Khi phần tử bị xóa khỏi DOM, React sẽ cập nhật `myRef.current` thành `null`. Bạn có thể đọc thêm về điều này trong [Thao tác DOM với Refs.](/learn/manipulating-the-dom-with-refs)

<Recap>

- Refs là một lối thoát để giữ các giá trị không được sử dụng để render. Bạn sẽ không cần chúng thường xuyên.
- Một ref là một đối tượng JavaScript thuần túy với một thuộc tính duy nhất có tên là `current`, mà bạn có thể đọc hoặc đặt.
- Bạn có thể yêu cầu React cung cấp cho bạn một ref bằng cách gọi Hook `useRef`.
- Giống như state, refs cho phép bạn giữ lại thông tin giữa các lần re-render của một component.
- Không giống như state, việc đặt giá trị `current` của ref không kích hoạt re-render.
- Không đọc hoặc ghi `ref.current` trong quá trình render. Điều này làm cho component của bạn khó dự đoán.

</Recap>

<Challenges>

#### Sửa một đầu vào trò chuyện bị hỏng {/*fix-a-broken-chat-input*/}

Nhập một tin nhắn và nhấp vào "Gửi". Bạn sẽ nhận thấy có một độ trễ ba giây trước khi bạn thấy cảnh báo "Đã gửi!". Trong thời gian trễ này, bạn có thể thấy nút "Hoàn tác". Nhấp vào nó. Nút "Hoàn tác" này được cho là để ngăn thông báo "Đã gửi!" xuất hiện. Nó thực hiện điều này bằng cách gọi [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) cho ID timeout được lưu trong `handleSend`. Tuy nhiên, ngay cả sau khi nhấp vào "Hoàn tác", thông báo "Đã gửi!" vẫn xuất hiện. Tìm lý do tại sao nó không hoạt động và sửa nó.

<Hint>

Các biến thông thường như `let timeoutID` không "sống sót" giữa các lần re-render vì mỗi lần render chạy component của bạn (và khởi tạo các biến của nó) từ đầu. Bạn có nên giữ ID timeout ở một nơi khác không?

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
      alert('Đã gửi!');
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
        {isSending ? 'Đang gửi...' : 'Gửi'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Hoàn tác
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

Bất cứ khi nào component của bạn re-render (chẳng hạn như khi bạn đặt state), tất cả các biến cục bộ sẽ được khởi tạo từ đầu. Đây là lý do tại sao bạn không thể lưu ID timeout trong một biến cục bộ như `timeoutID` và sau đó mong đợi một trình xử lý sự kiện khác "nhìn thấy" nó trong tương lai. Thay vào đó, hãy lưu trữ nó trong một ref, mà React sẽ giữ lại giữa các lần render.

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
      alert('Đã gửi!');
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
        {isSending ? 'Đang gửi...' : 'Gửi'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Hoàn tác
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>

#### Sửa một component không re-render {/*fix-a-component-failing-to-re-render*/}

Nút này được cho là chuyển đổi giữa hiển thị "Bật" và "Tắt". Tuy nhiên, nó luôn hiển thị "Tắt". Có gì sai với mã này? Sửa nó.

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'Bật' : 'Tắt'}
    </button>
  );
}
```

</Sandpack>

<Solution>

Trong ví dụ này, giá trị hiện tại của một ref được sử dụng để tính toán đầu ra render: `{isOnRef.current ? 'Bật' : 'Tắt'}`. Đây là một dấu hiệu cho thấy thông tin này không nên ở trong một ref, và thay vào đó nên được đưa vào state. Để sửa nó, hãy xóa ref và sử dụng state thay thế:

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'Bật' : 'Tắt'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Sửa lỗi debouncing {/*fix-debouncing*/}

Trong ví dụ này, tất cả các trình xử lý nhấp vào nút đều được ["debounced".](https://redd.one/blog/debounce-vs-throttle) Để xem điều này có nghĩa là gì, hãy nhấn một trong các nút. Lưu ý cách thông báo xuất hiện một giây sau đó. Nếu bạn nhấn nút trong khi chờ thông báo, bộ hẹn giờ sẽ đặt lại. Vì vậy, nếu bạn tiếp tục nhấp vào cùng một nút nhanh nhiều lần, thông báo sẽ không xuất hiện cho đến một giây *sau khi* bạn ngừng nhấp. Debouncing cho phép bạn trì hoãn một số hành động cho đến khi người dùng "ngừng làm mọi thứ".

Ví dụ này hoạt động, nhưng không hoàn toàn như dự định. Các nút không độc lập. Để xem sự cố, hãy nhấp vào một trong các nút, sau đó nhấp ngay vào một nút khác. Bạn sẽ mong đợi rằng sau một thời gian trễ, bạn sẽ thấy thông báo của cả hai nút. Nhưng chỉ có thông báo của nút cuối cùng hiển thị. Thông báo của nút đầu tiên bị mất.

Tại sao các nút lại can thiệp lẫn nhau? Tìm và sửa sự cố.

<Hint>

Biến ID timeout cuối cùng được chia sẻ giữa tất cả các component `DebouncedButton`. Đây là lý do tại sao việc nhấp vào một nút sẽ đặt lại timeout của một nút khác. Bạn có thể lưu trữ một ID timeout riêng cho mỗi nút không?

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
        onClick={() => alert('Tàu vũ trụ đã được phóng!')}
      >
        Phóng tàu vũ trụ
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Súp đã được đun sôi!')}
      >
        Đun sôi súp
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Bài hát ru đã được hát!')}
      >
        Hát một bài hát ru
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

Một biến như `timeoutID` được chia sẻ giữa tất cả các component. Đây là lý do tại sao việc nhấp vào nút thứ hai sẽ đặt lại timeout đang chờ xử lý của nút đầu tiên. Để sửa lỗi này, bạn có thể giữ timeout trong một ref. Mỗi nút sẽ nhận được ref riêng, vì vậy chúng sẽ không xung đột với nhau. Lưu ý cách nhấp vào hai nút nhanh sẽ hiển thị cả hai thông báo.

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
        onClick={() => alert('Tàu vũ trụ đã được phóng!')}
      >
        Phóng tàu vũ trụ
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Súp đã được đun sôi!')}
      >
        Đun sôi súp
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Bài hát ru đã được hát!')}
      >
        Hát một bài hát ru
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

Trong ví dụ này, sau khi bạn nhấn "Gửi", có một độ trễ nhỏ trước khi thông báo được hiển thị. Nhập "xin chào", nhấn Gửi, và sau đó nhanh chóng chỉnh sửa lại đầu vào. Mặc dù bạn đã chỉnh sửa, cảnh báo vẫn sẽ hiển thị "xin chào" (đó là giá trị của state [vào thời điểm](/learn/state-as-a-snapshot#state-over-time) nút được nhấp).

Thông thường, hành vi này là những gì bạn muốn trong một ứng dụng. Tuy nhiên, có thể có những trường hợp bạn muốn một số mã không đồng bộ đọc phiên bản *mới nhất* của một số state. Bạn có thể nghĩ ra cách nào để làm cho cảnh báo hiển thị văn bản đầu vào *hiện tại* thay vì những gì nó đã có tại thời điểm nhấp không?

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Đang gửi: ' + text);
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
        Gửi
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

State hoạt động [giống như một ảnh chụp nhanh](/learn/state-as-a-snapshot), vì vậy bạn không thể đọc state mới nhất từ một thao tác không đồng bộ như timeout. Tuy nhiên, bạn có thể giữ văn bản đầu vào mới nhất trong một ref. Một ref có thể thay đổi, vì vậy bạn có thể đọc thuộc tính `current` bất cứ lúc nào. Vì văn bản hiện tại cũng được sử dụng để render, trong ví dụ này, bạn sẽ cần *cả* một biến state (để render), *và* một ref (để đọc nó trong timeout). Bạn sẽ cần cập nhật giá trị ref hiện tại theo cách thủ công.

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
      alert('Đang gửi: ' + textRef.current);
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
        Gửi
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
