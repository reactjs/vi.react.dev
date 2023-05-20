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

## Event propagation {/*event-propagation*/}

Event handlers will also catch events from any children your component might have. We say that an event "bubbles" or "propagates" up the tree: it starts with where the event happened, and then goes up the tree.

This `<div>` contains two buttons. Both the `<div>` *and* each button have their own `onClick` handlers. Which handlers do you think will fire when you click a button?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
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

If you click on either button, its `onClick` will run first, followed by the parent `<div>`'s `onClick`. So two messages will appear. If you click the toolbar itself, only the parent `<div>`'s `onClick` will run.

<Pitfall>

All events propagate in React except `onScroll`, which only works on the JSX tag you attach it to.

</Pitfall>

### Stopping propagation {/*stopping-propagation*/}

Event handlers receive an **event object** as their only argument. By convention, it's usually called `e`, which stands for "event". You can use this object to read information about the event.

That event object also lets you stop the propagation. If you want to prevent an event from reaching parent components, you need to call `e.stopPropagation()` like this `Button` component does:

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
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
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

When you click on a button:

1. React calls the `onClick` handler passed to `<button>`. 
2. That handler, defined in `Button`, does the following:
   * Calls `e.stopPropagation()`, preventing the event from bubbling further.
   * Calls the `onClick` function, which is a prop passed from the `Toolbar` component.
3. That function, defined in the `Toolbar` component, displays the button's own alert.
4. Since the propagation was stopped, the parent `<div>`'s `onClick` handler does *not* run.

As a result of `e.stopPropagation()`, clicking on the buttons now only shows a single alert (from the `<button>`) rather than the two of them (from the `<button>` and the parent toolbar `<div>`). Clicking a button is not the same thing as clicking the surrounding toolbar, so stopping the propagation makes sense for this UI.

<DeepDive>

#### Capture phase events {/*capture-phase-events*/}

In rare cases, you might need to catch all events on child elements, *even if they stopped propagation*. For example, maybe you want to log every click to analytics, regardless of the propagation logic. You can do this by adding `Capture` at the end of the event name:

```js
<div onClickCapture={() => { /* this runs first */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

Each event propagates in three phases: 

1. It travels down, calling all `onClickCapture` handlers.
2. It runs the clicked element's `onClick` handler. 
3. It travels upwards, calling all `onClick` handlers.

Capture events are useful for code like routers or analytics, but you probably won't use them in app code.

</DeepDive>

### Passing handlers as alternative to propagation {/*passing-handlers-as-alternative-to-propagation*/}

Notice how this click handler runs a line of code _and then_ calls the `onClick` prop passed by the parent:

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

You could add more code to this handler before calling the parent `onClick` event handler, too. This pattern provides an *alternative* to propagation. It lets the child component handle the event, while also letting the parent component specify some additional behavior. Unlike propagation, it's not automatic. But the benefit of this pattern is that you can clearly follow the whole chain of code that executes as a result of some event.

If you rely on propagation and it's difficult to trace which handlers execute and why, try this approach instead.

### Preventing default behavior {/*preventing-default-behavior*/}

Some browser events have default behavior associated with them. For example, a `<form>` submit event, which happens when a button inside of it is clicked, will reload the whole page by default:

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

You can call `e.preventDefault()` on the event object to stop this from happening:

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

Don't confuse `e.stopPropagation()` and `e.preventDefault()`. They are both useful, but are unrelated:

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) stops the event handlers attached to the tags above from firing.
* [`e.preventDefault()` ](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) prevents the default browser behavior for the few events that have it.

## Can event handlers have side effects? {/*can-event-handlers-have-side-effects*/}

Absolutely! Event handlers are the best place for side effects.

Unlike rendering functions, event handlers don't need to be [pure](/learn/keeping-components-pure), so it's a great place to *change* something—for example, change an input's value in response to typing, or change a list in response to a button press. However, in order to change some information, you first need some way to store it. In React, this is done by using [state, a component's memory.](/learn/state-a-components-memory) You will learn all about it on the next page.

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
