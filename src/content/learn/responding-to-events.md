---
title: Phản hồi các sự kiện
---

<Intro>

React cho bạn thêm các *hàm xử lý sự kiện* vào JSX. Hàm xử lý sự kiện là các hàm bạn tự định nghĩa mà sẽ được kích hoạt để phản hồi lại các tương tác như nhấn chuột, hover chuột hay focus các trường input của form, và các tương tác tương tự.

</Intro>

<YouWillLearn>

* Những cách khác nhau để viết một hàm xử lý sự kiện
* Cách truyền logic xử lý sự kiện từ một component cha
* Cách các sự kiện lan truyền và cách dừng sự lan truyền sự kiện

</YouWillLearn>

## Thêm các hàm xử lý sự kiện {/*adding-event-handlers*/}

Để thêm các hàm xử lý sự kiện, bạn sẽ cần khai báo hàm rồi [truyền nó như một prop](/learn/passing-props-to-a-component) tới thẻ JSX thích hợp. Ví dụ, đây là một nút hiện tại chưa có chức năng gì:

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```

</Sandpack>

Bạn có thể làm nó hiển thị một lời nhắn khi người dùng nhấn vào qua các bước sau:

1. Khai báo một hàm `handleClick` *bên trong* component `Button` của bạn
2. Thực thi logic bên trong hàm đó (sử dụng `alert` để hiện lời nhắn)
3. Thêm `onClick={handleClick}` vào thẻ JSX `<button>`

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Bạn đã định nghĩa hàm `handleClick` rồi [truyền nó như một prop](/learn/passing-props-to-a-component) tới `<button>`. `handleClick` là một **hàm xử lý sự kiện**. Hàm xử lý sự kiện:

* Thường được định nghĩa *bên trong* các component của bạn.
* Có tên bắt đầu với `handle`, theo sau đó là tên sự kiện.

Theo quy chuẩn, ta thường đặt tên các hàm xử lý sự kiện là `handle` rồi đến tên sự kiện. Bạn sẽ hay thấy `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}`, ...

Cách khác, bạn có thể định nghĩa một hàm xử lý sự kiện theo kiểu inline trong JSX như sau:

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

Hoặc, ngắn gọn hơn, sử dụng hàm mũi tên:

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

Tất cả cách viết trên đều như nhau. Các hàm xử lý sự kiện inline sẽ tiện hơn cho các hàm ngắn.

<Pitfall>

Các hàm phải được truyền cho hàm xử lý sự kiện chứ không được gọi. Ví dụ:

| truyền hàm (đúng)     | gọi hàm (sai)     |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

Một sự khác biệt nhỏ. Trong ví dụ đầu tiên, hàm `handleClick` được truyền như một hàm xử lý sự kiện `onClick`. Điều này bảo React hãy nhớ hàm của bạn và chỉ được gọi nó khi người dùng nhấn nút.

Trong ví dụ thứ hai, cặp ngoặc `()` ở cuối `handleClick()` kích hoạt hàm *ngay lập tức* trong quá trình [rendering](/learn/render-and-commit) mà không cần nhấn nút. Đó là bởi vì Javascript trong [`{` và `} của JSX`](/learn/javascript-in-jsx-with-curly-braces) được triển khai luôn.

Khi bạn viết code theo kiểu inline, những lưu ý tương tự được thể hiện theo một cách khác:

| truyền hàm (đúng)            | gọi hàm (sai)    |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


Truyền code inline thế này sẽ không kích hoạt khi nhấn-nó kích hoạt mỗi lần component render:

```jsx
// alert này sẽ chạy khi component render, không phải khi nút được nhấn!
<button onClick={alert('You clicked me!')}>
```

Nếu bạn muốn định nghĩa hàm xử lý sự kiện của mình kiểu inline, hãy bọc nó trong một hàm ẩn danh như thế này:

```jsx
<button onClick={() => alert('You clicked me!')}>
```

Thay vì triển khai code bên trong mỗi lần render, điều này tạo ra một hàm để được gọi sau này.

Trong cả hai trường hợp, thứ bạn muốn truyền là một hàm:

* `<button onClick={handleClick}>` truyền hàm `handleClick`.
* `<button onClick={() => alert('...')}>` truyền hàm `() => alert('...')`.

[Đọc thêm về hàm mũi tên.](https://javascript.info/arrow-functions-basics)

</Pitfall>

### Đọc các prop trong hàm xử lý sự kiện {/*reading-props-in-event-handlers*/}

Vì các hàm xử lý sự kiện được khai báo trong một component, chúng có quyền truy cập vào các prop của component. Đây là một nút mà khi nhấn, hiện ra một alert với prop `message` của nó:

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Đang phát!">
        Phát phim
      </AlertButton>
      <AlertButton message="Đang tải!">
        Tải ảnh lên
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Điều này sẽ cho hai nút hiển thị hai lời nhắn khác nhau. Hãy thử thay đổi lời nhắn (`message`) được truyền cho các nút.

### Truyền các hàm xử lý sự kiện như prop {/*passing-event-handlers-as-props*/}

Thông thường, bạn sẽ muốn component cha chỉ định hàm xử lý sự kiện của component con. Xem xét các nút: tuỳ thuộc vào nơi bạn đang sử dụng component `Button`, bạn có thể muốn thực thi một hàm khác--có thể là một nút phát phim còn một nút khác tải ảnh lên.

Để làm được điều này, truyền một prop mà component nhận từ cha của nó như một hàm xử lý sự kiện:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Đang phát ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Phát "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Đang tải!')}>
      Tải ảnh lên
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Tại đây, component `Toolbar` render một `PlayButton` và một `UploadButton`:

- `PlayButton` truyền `handlePlayClick` như một prop `onClick` tới `Button` bên trong.
- `UploadButton` truyền `() => alert('Uploading!')` như một prop `onClick` tới `Button` bên trong.

Cuối cùng, component `Button` của bạn nhận một prop được gọi là `onClick`. Nó truyền prop đó trực tiếp tới thẻ `<button>` có sẵn của trình duyệt với `onClick={onClick}`. Điều này bảo React gọi hàm được truyền khi nhấn nút.

Nếu bạn sử dụng một [hệ thống thiết kế](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), thông thường các component như các nút (`Button`) chứa styling chứ không chỉ định hành vi. Thay vào đó, các component như `PlayButton` và `UploadButton` sẽ truyền hàm xử lý sự kiện xuống `Button`.

### Đặt tên cho các prop hàm xử lý sự kiện {/*naming-event-handler-props*/}

Các component có sẵn như `<button>` và `<div>` chỉ hỗ trợ các [tên sự kiện của trình duyệt](/reference/react-dom/components/common#common-props) như `onClick`. Tuy nhiên, khi xây dựng những component của riêng mình, bạn có thể đặt tên cho các prop hàm xử lý sự kiện của các component đó tuỳ ý.

Theo quy chuẩn, các prop hàm xử lý sự kiện nên bắt đầu bằng `on`, theo sau đó là chữ cái viết hoa.

Ví dụ, prop `onClick` của component `Button` có thể được gọi là `onSmash`:

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Đang phát!')}>
        Phát phim
      </Button>
      <Button onSmash={() => alert('Đang tải!')}>
        Tải ảnh lên
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Ở ví dụ này, `<button onClick={onSmash}>` cho ta thấy `<button>` (viết thường) của trình duyệt vẫn cần một prop gọi là `onClick`, nhưng tên prop nhận bởi component tuỳ chỉnh `Button` là do bạn quyết định!

Khi component của bạn hỗ trợ nhiều tương tác, bạn có thể đặt các prop hàm xử lý sự kiện cho các khái niệm riêng của ứng dụng. Ví dụ, component `Toolbar` này nhận hàm xử lý sự kiện `onPlayMovie` và `onUploadImage`:

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Đang phát!')}
      onUploadImage={() => alert('Đang tải!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Phát phim
      </Button>
      <Button onClick={onUploadImage}>
        Tải ảnh lên
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Hãy để ý cách component `App` không cần biết `Toolbar` sẽ làm gì với `onPlayMovie` hoặc `onUploadImage`. Đó là chi tiết thực thi của riêng `Toolbar`. Ở đây, `Toolbar` truyền chúng bằng các prop hàm xử lý `onClick` xuống các `Button` của `Toolbar`, nhưng `Toolbar` cũng có thể kích hoạt chúng sau trên phím tắt của bàn phím. Đặt tên prop theo các tương tác riêng của ứng dụng như `onPlayMovie` cho bạn sự linh hoạt trong việc thay đổi cách sử dụng chúng sau này.

## Sự lan truyền sự kiện {/*event-propagation*/}

Các hàm xử lý sự kiện cũng sẽ bắt các sự kiện từ bất cứ component con nào mà component của bạn có thể có. Ta nói sự kiện "nổi bọt" hay "lan truyền" lên cây component: bắt đầu từ nơi sự kiện xảy ra, và sau đó lan lên trên cây.

`<div>` này chứa hai nút. Cả `<div>` *và* mỗi nút đều có hàm xử lý `onClick` riêng. Bạn nghĩ hàm xử lý nào sẽ được kích hoạt khi bạn nhấn vào một nút?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('Bạn đã nhấn vào thanh công cụ!');
    }}>
      <button onClick={() => alert('Đang phát!')}>
        Phát phim
      </button>
      <button onClick={() => alert('Đang tải lên!')}>
        Tải ảnh lên
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Nếu bạn nhấn vào một trong hai nút, `onClick` của nút đó sẽ chạy trước, tiếp đến là `onClick` của `<div>` cha. Nên hai lời nhắn sẽ xuất hiện. Nếu bạn nhấn vào thanh công cụ, sẽ chỉ có `onClick` của `<div>` cha chạy.

<Pitfall>

Tất cả sự kiện đều lan truyền trong React ngoại trừ `onScroll`, nó chỉ hoạt động trên thẻ JSX mà bạn gắn nó.

</Pitfall>

### Dừng sự lan truyền {/*stopping-propagation*/}

Các hàm xử lý sự kiện nhận một đối tượng sự kiện làm tham số duy nhất. Theo quy chuẩn, tham số này thường được gọi là `e`, viết tắt cho `event` (sự kiện). Bạn có thể sử dụng dối tượng này để đọc thông tin về sự kiện.

Đối tượng sự kiện đó cũng cho bạn dừng sự lan truyền. Nếu bạn muốn ngăn một sự kiện truyền tới các component cha, bạn cần gọi `e.stopPropagation()` như component `Button` dưới đây:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('Bạn đã nhấn vào thanh công cụ!');
    }}>
      <Button onClick={() => alert('Đang phát!')}>
        Phát phim
      </Button>
      <Button onClick={() => alert('Đang tải lên!')}>
        Tải ảnh lên
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Khi bạn nhấn vào một nút:

1. React gọi hàm xử lý `onClick` được truyền tới `<button>`.
2. Hàm xử lý đó, được định nghĩa trong `Button`:
   * Gọi `e.stopPropagation()`, ngăn sự kiện nổi bọt xa hơn.
   * Gọi hàm `onClick`, một prop được truyền từ component `Toolbar`.
3. Hàm đó, được định nghĩa trong component `Toolbar`, hiển thị alert riêng của button.
4. Vì sự lan truyền đã bị dừng, hàm xử lý `onClick` của `<div>` cha *không* chạy.

Như một hệ quả của `e.stopPropagation()`, nhấn vào các nút giờ chỉ hiện một alert duy nhất (từ `<button>`) chứ không phải hai alert (từ `<button>` và từ `<div>` cha). Nhấn một nút không giống như việc nhấn vào xung quanh thanh công cụ, nên việc dừng sự lan truyền hợp lý cho giao diện này.

<DeepDive>

#### Các sự kiện trong giai đoạn bắt {/*capture-phase-events*/}

Trong một số trường hợp hiếm hoi, bạn có thể cần bắt tất cả sự kiện trên các element con, *kể cả khi chúng đã bị dừng lan truyền*. Ví dụ, có thể bạn muốn log mỗi lượt nhấn để phân tích, bất kể logic lan truyền là gì. Bạn có thể làm thế bằng cách thêm `Capture` vào cuối tên sự kiện:

```js
<div onClickCapture={() => { /* hàm này chạy trước */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

Mỗi sự kiện lan truyền theo ba giai đoạn:

1. Đi xuống, gọi tất cả hàm xử lý `onClickCapture`.
2. Chạy hàm xử lý `onClick` của element được nhấn.
3. Đi lên, gọi tất cả hàm xử lý `onClick`.

Việc bắt các sự kiện có lợi cho code như router hay phân tích, nhưng bạn có thể sẽ không cần sử dụng chúng trong code của ứng dụng.

</DeepDive>

### Truyền các hàm xử lý thay thế cho sự lan truyền {/*passing-handlers-as-alternative-to-propagation*/}

Hãy để ý cách hàm xử lý `onClick` chạy một dòng code _và sau đó_ gọi prop `onClick` được truyền từ component cha:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

Bạn cũng có thể thêm code vào hàm xử lý trước khi gọi hàm xử lý sự kiện `onClick` cha. Pattern này cung cấp một *phương án thay thế* cho sự lan truyền. Nó cho component con xử lý sự kiện, đồng thời cũng cho component cha chỉ định thêm một số hành vi. Không như sự lan truyền, nó không hề tự động. Nhưng lợi ích của pattern này là bạn có thể theo dõi rõ ràng toàn bộ chuỗi code được thực thi do một số sự kiện gây ra.

Nếu bạn dựa vào sự lan truyền và thấy khó theo dõi hàm xử lý nào thực thi và tại sao, hãy thử phương pháp này xem.

### Ngăn hành vi mặc định {/*preventing-default-behavior*/}

Một số sự kiện trình duyệt có hành vi mặc định gắn liền với chúng. Ví dụ, sự kiện submit của `<form>` xảy ra khi một nút bên trong nó bị nhấn, sẽ mặc định tải lại toàn bộ trang:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Bạn có thể gọi `e.preventDefault()` trên đối tượng sự kiện để ngăn hành vi này xảy ra:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Đừng nhầm lẫn `e.stopPropagation()` và `e.preventDefault()`. Cả hai đều có ích, nhưng không liên quan:

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) không cho các hàm xử lý sự kiện được gắn vào các thẻ trên kích hoạt.
* [`e.preventDefault()` ](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) ngăn các hành vi mặc định từ trình duyệt của một số ít các sự kiện.

## Hàm xử lý sự kiện có thể có các side effects không? {/*can-event-handlers-have-side-effects*/}

Chắc chắn rồi! Các hàm xử lý sự kiện là nơi dễ có side effects nhất.

Không như các hàm rendering, các hàm xử lý sự kiện không cần phải [pure](/learn/keeping-components-pure), nên nó rất dễ *thay đổi* một thứ gì đó-ví dụ, thay đổi giá trị của input khi gõ phím, hay thay dổi một danh sách khi nhấn nút. Tuy nhiên, để thay đổi một số thông tin, trước tiên bạn cần một vài cách để chứa nó. Trong React, có thể làm điều này bằng cách sử dụng [state, bộ nhớ của component.](/learn/state-a-components-memory) Bạn sẽ học tất cả về nó trong trang tiếp theo.

<Recap>

* You can handle events by passing a function as a prop to an element like `<button>`.
* Event handlers must be passed, **not called!** `onClick={handleClick}`, not `onClick={handleClick()}`.
* You can define an event handler function separately or inline.
* Event handlers are defined inside a component, so they can access props.
* You can declare an event handler in a parent and pass it as a prop to a child.
* You can define your own event handler props with application-specific names.
* Events propagate upwards. Call `e.stopPropagation()` on the first argument to prevent that.
* Events may have unwanted default browser behavior. Call `e.preventDefault()` to prevent that.
* Explicitly calling an event handler prop from a child handler is a good alternative to propagation.

</Recap>

<Challenges>

#### Fix an event handler {/*fix-an-event-handler*/}

Clicking this button is supposed to switch the page background between white and black. However, nothing happens when you click it. Fix the problem. (Don't worry about the logic inside `handleClick`—that part is fine.)

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

<Solution>

The problem is that `<button onClick={handleClick()}>` _calls_ the `handleClick` function while rendering instead of _passing_ it. Removing the `()` call so that it's `<button onClick={handleClick}>` fixes the issue:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

Alternatively, you could wrap the call into another function, like `<button onClick={() => handleClick()}>`:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Wire up the events {/*wire-up-the-events*/}

This `ColorSwitch` component renders a button. It's supposed to change the page color. Wire it up to the `onChangeColor` event handler prop it receives from the parent so that clicking the button changes the color.

After you do this, notice that clicking the button also increments the page click counter. Your colleague who wrote the parent component insists that `onChangeColor` does not increment any counters. What else might be happening? Fix it so that clicking the button *only* changes the color, and does _not_ increment the counter.

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Change color
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

First, you need to add the event handler, like `<button onClick={onChangeColor}>`.

However, this introduces the problem of the incrementing counter. If `onChangeColor` does not do this, as your colleague insists, then the problem is that this event propagates up, and some handler above does it. To solve this problem, you need to stop the propagation. But don't forget that you should still call `onChangeColor`.

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Change color
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
