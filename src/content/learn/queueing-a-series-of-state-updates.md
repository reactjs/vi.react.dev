---
title: Xếp hàng đợi cho một chuỗi các cập nhật state
---

<Intro>

Thiết lập một biến state sẽ đưa một lần render khác vào hàng đợi. Nhưng đôi khi bạn có thể muốn thực hiện nhiều thao tác trên giá trị đó trước khi đưa lần render tiếp theo vào hàng đợi. Để làm điều này, sẽ hữu ích khi hiểu cách React gom nhóm các cập nhật state.

</Intro>

<YouWillLearn>

* "Batching" là gì và React sử dụng nó như thế nào để xử lý nhiều cập nhật state
* Cách áp dụng liên tiếp nhiều cập nhật cho cùng một biến state

</YouWillLearn>

## React gom nhóm các cập nhật state {/*react-batches-state-updates*/}

Bạn có thể nghĩ rằng việc nhấp vào nút "+3" sẽ tăng bộ đếm ba lần bởi vì nó gọi `setNumber(number + 1)` ba lần:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Tuy nhiên, như bạn có thể nhớ lại từ phần trước, [giá trị state của mỗi lần render được cố định](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), vì vậy giá trị của `number` bên trong event handler của lần render đầu tiên luôn là `0`, bất kể bạn gọi `setNumber(1)` bao nhiêu lần:

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

Nhưng có một yếu tố khác đang tác động ở đây. **React chờ đợi cho đến khi *tất cả* code trong các event handler đã chạy xong trước khi xử lý các cập nhật state của bạn.** Đây là lý do tại sao việc render lại chỉ xảy ra *sau* tất cả các lệnh gọi `setNumber()` này.

Điều này có thể gợi nhớ đến một người phục vụ nhận đơn hàng tại nhà hàng. Người phục vụ không chạy đến bếp ngay khi nghe thấy món đầu tiên của bạn! Thay vào đó, họ để bạn hoàn thành đơn hàng, để bạn thực hiện các thay đổi, và thậm chí nhận đơn hàng từ những người khác tại bàn.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="An elegant cursor at a restaurant places and order multiple times with React, playing the part of the waiter. After she calls setState() multiple times, the waiter writes down the last one she requested as her final order." />

Điều này cho phép bạn cập nhật nhiều biến state--thậm chí từ nhiều component--mà không kích hoạt quá nhiều [lần render lại.](/learn/render-and-commit#re-renders-when-state-updates) Nhưng điều này cũng có nghĩa là UI sẽ không được cập nhật cho đến _sau_ khi event handler của bạn, và bất kỳ code nào trong đó, hoàn thành. Hành vi này, còn được gọi là **batching,** làm cho ứng dụng React của bạn chạy nhanh hơn nhiều. Nó cũng tránh việc phải đối phó với các lần render "chưa hoàn thành" gây nhầm lẫn khi chỉ một số biến được cập nhật.

**React không gom nhóm qua *nhiều* sự kiện có chủ ý như click**--mỗi click được xử lý riêng biệt. Hãy yên tâm rằng React chỉ thực hiện batching khi nó thường an toàn để làm như vậy. Điều này đảm bảo rằng, ví dụ, nếu click nút đầu tiên vô hiệu hóa một form, click thứ hai sẽ không gửi nó lần nữa.

## Cập nhật cùng một state nhiều lần trước lần render tiếp theo {/*updating-the-same-state-multiple-times-before-the-next-render*/}

Đây là một trường hợp sử dụng không phổ biến, nhưng nếu bạn muốn cập nhật cùng một biến state nhiều lần trước lần render tiếp theo, thay vì truyền *giá trị state tiếp theo* như `setNumber(number + 1)`, bạn có thể truyền một *function* tính toán state tiếp theo dựa trên state trước đó trong hàng đợi, như `setNumber(n => n + 1)`. Đây là cách để nói với React "làm điều gì đó với giá trị state" thay vì chỉ thay thế nó.

Hãy thử tăng bộ đếm ngay bây giờ:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Ở đây, `n => n + 1` được gọi là **updater function.** Khi bạn truyền nó cho một state setter:

1. React đưa function này vào hàng đợi để được xử lý sau khi tất cả code khác trong event handler đã chạy.
2. Trong lần render tiếp theo, React duyệt qua hàng đợi và cung cấp cho bạn state cuối cùng đã cập nhật.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

Đây là cách React xử lý các dòng code này khi thực thi event handler:

1. `setNumber(n => n + 1)`: `n => n + 1` là một function. React thêm nó vào hàng đợi.
1. `setNumber(n => n + 1)`: `n => n + 1` là một function. React thêm nó vào hàng đợi.
1. `setNumber(n => n + 1)`: `n => n + 1` là một function. React thêm nó vào hàng đợi.

Khi bạn gọi `useState` trong lần render tiếp theo, React duyệt qua hàng đợi. State `number` trước đó là `0`, vì vậy đó là những gì React truyền cho updater function đầu tiên làm tham số `n`. Sau đó React lấy giá trị trả về của updater function trước đó và truyền nó cho updater tiếp theo làm `n`, và cứ thế:

|  cập nhật trong hàng đợi | `n` | trả về |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React lưu trữ `3` là kết quả cuối cùng và trả về nó từ `useState`.

Đây là lý do tại sao việc nhấp "+3" trong ví dụ trên đúng cách tăng giá trị lên 3.

### Điều gì xảy ra nếu bạn cập nhật state sau khi thay thế nó {/*what-happens-if-you-update-state-after-replacing-it*/}

Còn event handler này thì sao? Bạn nghĩ `number` sẽ là gì trong lần render tiếp theo?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Đây là những gì event handler này yêu cầu React thực hiện:

1. `setNumber(number + 5)`: `number` là `0`, vì vậy `setNumber(0 + 5)`. React thêm *"thay thế bằng `5`"* vào hàng đợi của nó.
2. `setNumber(n => n + 1)`: `n => n + 1` là một updater function. React thêm *function đó* vào hàng đợi của nó.

Trong lần render tiếp theo, React duyệt qua hàng đợi state:

|   cập nhật trong hàng đợi       | `n` | trả về |
|--------------|---------|-----|
| "thay thế bằng `5`" | `0` (không sử dụng) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React lưu trữ `6` là kết quả cuối cùng và trả về nó từ `useState`.

<Note>

Bạn có thể đã nhận thấy rằng `setState(5)` thực tế hoạt động như `setState(n => 5)`, nhưng `n` không được sử dụng!

</Note>

### Điều gì xảy ra nếu bạn thay thế state sau khi cập nhật nó {/*what-happens-if-you-replace-state-after-updating-it*/}

Hãy thử thêm một ví dụ nữa. Bạn nghĩ `number` sẽ là gì trong lần render tiếp theo?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Đây là cách React xử lý các dòng code này khi thực thi event handler này:

1. `setNumber(number + 5)`: `number` là `0`, vì vậy `setNumber(0 + 5)`. React thêm *"thay thế bằng `5`"* vào hàng đợi của nó.
2. `setNumber(n => n + 1)`: `n => n + 1` là một updater function. React thêm *function đó* vào hàng đợi của nó.
3. `setNumber(42)`: React thêm *"thay thế bằng `42`"* vào hàng đợi của nó.

Trong lần render tiếp theo, React duyệt qua hàng đợi state:

|   cập nhật trong hàng đợi       | `n` | trả về |
|--------------|---------|-----|
| "thay thế bằng `5`" | `0` (không sử dụng) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "thay thế bằng `42`" | `6` (không sử dụng) | `42` |

Sau đó React lưu trữ `42` là kết quả cuối cùng và trả về nó từ `useState`.

Để tóm tắt, đây là cách bạn có thể nghĩ về những gì bạn đang truyền cho state setter `setNumber`:

* **Một updater function** (ví dụ `n => n + 1`) được thêm vào hàng đợi.
* **Bất kỳ giá trị nào khác** (ví dụ số `5`) thêm "thay thế bằng `5`" vào hàng đợi, bỏ qua những gì đã có trong hàng đợi.

Sau khi event handler hoàn thành, React sẽ kích hoạt một lần render lại. Trong quá trình render lại, React sẽ xử lý hàng đợi. Các updater function chạy trong quá trình rendering, vì vậy **các updater function phải [thuần khiết](/learn/keeping-components-pure)** và chỉ *trả về* kết quả. Đừng cố gắng set state từ bên trong chúng hoặc chạy các side effect khác. Trong Strict Mode, React sẽ chạy mỗi updater function hai lần (nhưng bỏ qua kết quả lần thứ hai) để giúp bạn tìm ra lỗi.

### Quy ước đặt tên {/*naming-conventions*/}

Thông thường người ta đặt tên cho tham số của updater function bằng các chữ cái đầu của biến state tương ứng:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

Nếu bạn thích code chi tiết hơn, một quy ước phổ biến khác là lặp lại tên đầy đủ của biến state, như `setEnabled(enabled => !enabled)`, hoặc sử dụng tiền tố như `setEnabled(prevEnabled => !prevEnabled)`.

<Recap>

* Thiết lập state không thay đổi biến trong lần render hiện tại, nhưng nó yêu cầu một lần render mới.
* React xử lý các cập nhật state sau khi các event handler đã chạy xong. Điều này được gọi là batching.
* Để cập nhật một số state nhiều lần trong một sự kiện, bạn có thể sử dụng updater function `setNumber(n => n + 1)`.

</Recap>



<Challenges>

#### Sửa bộ đếm yêu cầu {/*fix-a-request-counter*/}

Bạn đang làm việc trên một ứng dụng thị trường nghệ thuật cho phép người dùng gửi nhiều đơn hàng cho một tác phẩm nghệ thuật cùng một lúc. Mỗi khi người dùng nhấn nút "Buy", bộ đếm "Pending" sẽ tăng lên một. Sau ba giây, bộ đếm "Pending" sẽ giảm xuống, và bộ đếm "Completed" sẽ tăng lên.

Tuy nhiên, bộ đếm "Pending" không hoạt động như dự định. Khi bạn nhấn "Buy", nó giảm xuống `-1` (điều này không thể xảy ra!). Và nếu bạn nhấp nhanh hai lần, cả hai bộ đếm dường như hoạt động không thể đoán trước.

Tại sao điều này xảy ra? Hãy sửa cả hai bộ đếm.

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

Bên trong event handler `handleClick`, các giá trị của `pending` và `completed` tương ứng với những gì chúng có tại thời điểm sự kiện click. Đối với lần render đầu tiên, `pending` là `0`, vì vậy `setPending(pending - 1)` trở thành `setPending(-1)`, điều này sai. Vì bạn muốn *tăng* hoặc *giảm* các bộ đếm, thay vì set chúng thành một giá trị cụ thể được xác định trong lúc click, bạn có thể truyền các updater function thay thế:

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

Điều này đảm bảo rằng khi bạn tăng hoặc giảm một bộ đếm, bạn làm điều đó liên quan đến state *mới nhất* của nó thay vì state tại thời điểm click.

</Solution>

#### Tự triển khai hàng đợi state {/*implement-the-state-queue-yourself*/}

Trong thử thách này, bạn sẽ tự triển khai một phần nhỏ của React từ đầu! Nó không khó như nghe có vẻ.

Cuộn qua bản xem trước sandbox. Lưu ý rằng nó hiển thị **bốn test case.** Chúng tương ứng với các ví dụ bạn đã thấy trước đó trên trang này. Nhiệm vụ của bạn là triển khai function `getFinalState` để nó trả về kết quả chính xác cho mỗi trường hợp đó. Nếu bạn triển khai chính xác, tất cả bốn bài test sẽ pass.

Bạn sẽ nhận được hai tham số: `baseState` là state ban đầu (như `0`), và `queue` là một mảng chứa hỗn hợp các số (như `5`) và các updater function (như `n => n + 1`) theo thứ tự chúng được thêm vào.

Nhiệm vụ của bạn là trả về state cuối cùng, giống như các bảng trên trang này hiển thị!

<Hint>

Nếu bạn cảm thấy bế tắc, hãy bắt đầu với cấu trúc code này:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: apply the updater function
    } else {
      // TODO: replace the state
    }
  }

  return finalState;
}
```

Điền vào các dòng còn thiếu!

</Hint>

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: do something with the queue...

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

Đây chính xác là thuật toán được mô tả trên trang này mà React sử dụng để tính toán state cuối cùng:

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Apply the updater function.
      finalState = update(finalState);
    } else {
      // Replace the next state.
      finalState = update;
    }
  }

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

Bây giờ bạn đã biết cách phần này của React hoạt động!

</Solution>

</Challenges>