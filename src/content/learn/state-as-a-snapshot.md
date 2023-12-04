---
title: State như một snapshot
---

<Intro>

Những biến state thoạt nhìn có thể trông như biến JavaScript bình thường mà bạn có thể đọc và ghi vào. Tuy nhiên, state hoạt động giống như một snapshot hay "bản chụp" - một thuật ngữ được mượn từ nhiếp ảnh - chỉ trạng thái của phần mềm trong một thời điểm xác định. Việc thiết lập nó không thay đổi biến state bạn đã có, mà thay vào đó kích hoạt một lần re-render.

</Intro>

<YouWillLearn>

* Thiết lập state để kích hoạt re-render
* Khi nào và cách cập nhật state
* Tại sao state không cập nhật ngay sau khi bạn thiết lập nó
* Cách event handler truy cập snapshot của state

</YouWillLearn>

## Thiết lập state để kích hoạt re-render {/*setting-state-triggers-renders*/}

Bạn có thể nghĩ rằng giao diện sẽ thay đổi trực tiếp khi đáp ứng sự kiện của người dùng, như khi một cú nhấp chuột xảy ra. Trong React, cơ chế hoạt động có đôi chút khác so với mô hình tư duy này. Trong trang trước, bạn đã thấy rằng [thiết lập state yêu cầu một lần re-render](/learn/render-and-commit#step-1-trigger-a-render) từ React. Điều này có nghĩa là để một giao diện phản ứng với sự kiện, bạn cần *cập nhật state*.

Trong ví dụ dưới đây, khi bạn nhấn "Gửi", `setIsSent(true)` báo cho React biết để re-render UI:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Tin nhắn của bạn đã được gửi đi!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Gửi</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Đây là những gì xảy ra khi bạn nhấn nút "Gửi":
1. `onSubmit` event handler thực thi.
2. `setIsSent(true)` thiết lập `isSent` thành `true` và đưa vào hàng đợi một lần re-render mới.
3. React re-render component theo giá trị `isSent` mới.

Chúng ta sẽ xem xét kỹ hơn mối quan hệ giữa state và re-render trong phần tiếp theo.

## Render lưu giữ một snapshot {/*rendering-takes-a-snapshot-in-time*/}

["Rendering"](/learn/render-and-commit#step-2-react-renders-your-components) có nghĩa là khi React "gọi" component của bạn (vốn là một hàm). JSX bạn trả về từ hàm đó giống như một snapshot của UI tại thời điểm thực thi. Props, event handler và biến cục bộ của nó đều được tính toán **bằng việc sử dụng state của component tại thời điểm render.**

Không giống như một bức ảnh hay một khung hình phim, snapshot UI bạn trả về có tính tương tác. Nó bao gồm logic như event handler chỉ định điều gì xảy ra khi input thay đổi. React cập nhật màn hình để phù hợp với snapshot này và kết nối các event handler. Kết quả là, khi nhấn nút sẽ kích hoạt event handler từ JSX của bạn.

<<<<<<< HEAD
Khi React re-render một component:
1. React gọi lại hàm của bạn.
2. Hàm của bạn trả về một snapshot JSX mới.
3. React cập nhật màn hình sao cho tương đồng với snapshot bạn đã trả về.
=======
Unlike a photograph or a movie frame, the UI "snapshot" you return is interactive. It includes logic like event handlers that specify what happens in response to inputs. React updates the screen to match this snapshot and connects the event handlers. As a result, pressing a button will trigger the click handler from your JSX.

When React re-renders a component:

1. React calls your function again.
2. Your function returns a new JSX snapshot.
3. React then updates the screen to match the snapshot your function returned.
>>>>>>> 943e3ce4e52be56bcd75b679448847302f557da1

<IllustrationBlock sequential>
    <Illustration caption="React thực thi hàm của bạn" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Tính toán snapshot mới" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="Cập nhật cây DOM" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

Đối với một component, state không phải là một biến thông thường, sẽ biến mất sau khi hàm của bạn trả về. State thực sự "sống" ở trong chính React, ở bên ngoài hàm của bạn. Khi React gọi component của bạn, nó cung cấp cho bạn một snapshot của state cho lần render cụ thể đó. Component của bạn trả về một snapshot của UI với một bộ props và event handler mới trong JSX của nó, tất cả được tính toán **bằng việc sử dụng các giá trị state từ render đó!**

<IllustrationBlock sequential>
  <Illustration caption="Bạn yêu cầu React cập nhật state" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React cập nhật giá trị của biến state" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React truyền một snapshot của giá trị state mới cho component" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>


Sau đây là một thí dụ để minh họa điều này. Trong thí dụ này, bạn có thể cho rằng khi bạn nhấn nút "+3" thì counter sẽ tăng lên 3 lần vì nó gọi `setNumber(number + 1)` ba lần.

Hãy quan sát xem điều gì thực sự xảy ra khi bạn nhấn nút "+3":

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

Quan sát rằng `number` chỉ tăng lên một lần cho mỗi lần nhấn!

**Thiết lập state chỉ thay đổi nó cho lần render *tiếp theo*.** Trong lần render đầu tiên, `number` là `0`. Đây là lý do tại sao, trong `onClick` handler của *lần render đó*, `number` vẫn là `0` ngay cả sau khi `setNumber(number + 1)` được gọi:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Đây là những gì `onClick` handler của nút này báo cho React làm:
1. `setNumber(number + 1)`: `number` là `0` nên `setNumber(0 + 1)`.
    - React chuẩn bị thay đổi `number` thành `1` trong lần render tiếp theo.
2. `setNumber(number + 1)`: `number` là `0` nên `setNumber(0 + 1)`.
    - React chuẩn bị thay đổi `number` thành `1` trong lần render tiếp theo.
3. `setNumber(number + 1)`: `number` là `0` nên `setNumber(0 + 1)`.
    - React chuẩn bị thay đổi `number` thành `1` trong lần render tiếp theo.


Kể cả khi bạn gọi `setNumber(number + 1)` ba lần, trong `onClick` handler của *lần render này*, biến `number` vẫn là `0`, vì vậy bạn thiết lập state thành `1` ba lần. Đây là lý do tại sao, sau khi `onClick` handler kết thúc, React re-render component với `number` bằng `1` thay vì `3`.

Bạn cũng có thể hình dung điều này bằng cách sử dụng phương pháp "gán" các biến state bằng giá trị của chúng trong code của bạn. Vì biến state `number` là `0` cho *lần render này*, `onClick` handler của nó sẽ như thế này:


```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

Trong lần render tiếp theo, `number` là `1`, vì vậy `onClick` handler của nó sẽ như thế này:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

Đây là lí do tại sao khi bạn nhất lại nút "+3", `number` sẽ thay đổi thành `2` thay vì `3`, và cứ như vậy.

## State theo thời gian {/*state-over-time*/}

Code React nói chung là nhàn. Đoán xem browser sẽ alert giá trị bao nhiêu khi bạn nhấn nút "+5" trong thí dụ này:

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
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Nếu bạn dùng phương pháp gán biến từ trước, bạn có thể đoán ra rằng alert sẽ hiển thị "0":

```js
setNumber(0 + 5);
alert(0);
```

Nhưng nếu bạn đặt hàm `alert` vào trong một timer sao cho hàm này chỉ chạy _sau_ khi component rerender, đoán xem kết quả sẽ là "0" hay "5"? 

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
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Ngạc nhiên chưa? Nếu bạn dùng phương pháp "gán" biến khi trước, bạn sẽ thấy được rằng "snapshot" của state được truyền vào alert.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

State được lưu trong React có thể đã được thay đổi vào lúc hàm alert được chạy, nhưng kết quả của alert đã được tính toán dựa trên snapshot của state khi người dùng tương tác với nó!

**Giá trị của một biến state không bao giờ thay đổi trong một lần render**, kể cả khi mã xử lý sự kiện là bất đồng bộ. Bên trong hàm `onClick` của *lần render đó*, giá trị của `number` giữ nguyên là `0` cho dù sau khi sau khi `setNumber(number + 5)` được gọi. Giá trị của nó đã được thiết lập "cứng" (không đổi) khi React "chụp một snapshot" của UI bằng cách gọi (render) component của bạn.

Sau đây là một ví dụ giải thích tại sao cơ chế này sẽ làm cho hàm xử lý sự kiện của ít khả năng bị dính timing bug hơn. Chúng ta có một form dùng để gửi tin nhắn với độ trễ 5 giây. Hãy hình dung trường hợp sau:

1. Bạn nhấn nút "Gửi" để gửi "Xin chào" tới Alice
2. Trong khoảng thời gian dưới 5s, bạn thay đổi giá trị của "Tới" sang "Bob"

Bạn nghĩ alert sẽ hiển thị giá trị gì, "Bạn đã gửi Xin chào tới Alice" hay là "Bạn đã gửi Xin chào tới Bob"? Hãy thử đưa ra dự đoán dựa trên những gì bạn đã học được và thử chạy mã:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Xin chào');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`Bạn đã gửi ${message} tới ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Gửi</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React giữ "cứng" giá trị của state trong các hàm xử lý sự kiện của mỗi lần render**. Bạn không cần phải lo về việc state đã thay đổi khi code vẫn đang chạy.

Nhưng nếu như bạn muốn đọc giá trị mới nhất của state trước mỗi lần re-render thì sao? Để làm được việc đó, bạn sẽ cần sử dụng [hàm state updater](/learn/queueing-a-series-of-state-updates), được giải thích ở trang sau!

<Recap>

* Thiết lập state kích hoạt một lần render mới.
* React lưu state ở ngoài component của bạn, như kiểu "ở trên kệ".
* Khi bạn gọi `setState`, React cho bạn một bản chụp của state cho *lần render đó*.
* Biến và các hàm xử lý sự kiện sẽ "không qua khỏi" mỗi lần re-render. Mỗi lần render sẽ có các hàm xử lý sự kiện riêng.
* Mỗi lần render (và các hàm ở trong) sẽ luôn "thấy" bản chụp snapshot của state mà React đưa cho *lần render đó*.
* Bạn có thể tư duy theo hướng "gán" giá trị của state trong mỗi hàm xử lý sự kiện, tương tự như cách mà bạn nghĩ về kết quả render JSX.
* Hàm xử lý sự kiện trong quá khứ có các giá trị state từ lần render mà nó được tạo ra.

</Recap>



<Challenges>

#### Xây dựng một cột đèn giao thông {/*implement-a-traffic-light*/}

Sau đây là một component đèn giao thông. Nó có một nút để chuyển đổi qua lại giữa hai trạng thái: "Đi" và "Dừng".

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Dừng' : 'Đi'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Đi' : 'Dừng'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Hãy thêm một `alert` vào hàm xử lý sự kiện click. Khi đèn giao thông màu xanh và nó nói "Đi", nhấp vào nút sẽ hiển thị "Dừng là tiếp theo". Khi đèn giao thông màu đỏ và nó nói "Dừng", nhấp vào nút sẽ hiển thị "Đi là tiếp theo".

Bạn có thấy sự khác biệt khi bạn đặt `alert` trước hay sau lời gọi `setWalk` không?

<Solution>

Hàm `alert` của bạn nên trông như thế này:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Dừng là tiếp theo' : 'Đi là tiếp theo');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Dừng' : 'Đi'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Đi' : 'Dừng'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Việc đặt `alert` trước hay sau lời gọi `setWalk` không có sự khác biệt. Giá trị của `walk` trong hàm xử lý sự kiện của bạn sẽ luôn là giá trị của `walk` trong lần render đó. Gọi `setWalk` chỉ thay đổi giá trị của `walk` cho lần render tiếp theo, nhưng không ảnh hưởng đến hàm xử lý sự kiện của lần render trước.

Dòng này ban đầu trông hơi có vẻ ngược đời:

```js
alert(walk ? 'Dừng là tiếp theo' : 'Đi là tiếp theo');
```

Nhưng nó sẽ trở nên hợp lý nếu bạn đọc nó như thế này: "Nếu đèn giao thông hiện 'Đi', thì thông báo sẽ nói 'Dừng là tiếp theo'". Biến `walk` trong hàm xử lý sự kiện của bạn khớp với giá trị của `walk` trong lần render đó và không thay đổi.

Bạn có thể xác nhận điều này là đúng bằng cách áp dụng phương pháp thay thế. Khi `walk` là `true`, bạn sẽ có:

```js
<button onClick={() => {
  setWalk(false);
  alert('Dừng là tiếp theo');
}}>
  Đổi sang Dừng
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

Vậy nhấp vào nút "Đổi sang Dừng" sẽ kich hoạt một lần render mới. Lần render mới này sẽ có giá trị `walk` là `false`, và alert sẽ nói "Dừng là tiếp theo".

</Solution>

</Challenges>
