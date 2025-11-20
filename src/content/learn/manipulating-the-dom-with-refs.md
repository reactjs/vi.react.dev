---
title: 'Thao tác DOM với Refs'
---

<Intro>

React tự động cập nhật [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) để khớp với kết quả render của bạn, vì vậy những component của bạn thường sẽ không cần thao tác với nó. Tuy nhiên, đôi khi bạn có thể cần truy cập vào những element DOM được quản lý bởi React--ví dụ, để focus vào một node, scroll đến nó, hoặc đo kích thước và vị trí của nó. Không có cách nào được tích hợp sẵn để làm những việc đó trong React, vì vậy bạn sẽ cần một *ref* đến DOM node.

</Intro>

<YouWillLearn>

- Cách truy cập một DOM node được quản lý bởi React với thuộc tính `ref`
- Cách thuộc tính `ref` JSX liên quan đến Hook `useRef`
- Cách truy cập DOM node của component khác
- Trong những trường hợp nào thì việc sửa đổi DOM được quản lý bởi React là an toàn

</YouWillLearn>

## Lấy ref đến node {/*getting-a-ref-to-the-node*/}

Để truy cập một DOM node được quản lý bởi React, trước tiên, import Hook `useRef`:

```js
import { useRef } from 'react';
```

Sau đó, sử dụng nó để khai báo một ref bên trong component của bạn:

```js
const myRef = useRef(null);
```

Cuối cùng, truyền ref của bạn làm thuộc tính `ref` cho JSX tag mà bạn muốn lấy DOM node:

```js
<div ref={myRef}>
```

Hook `useRef` trả về một object với một thuộc tính duy nhất gọi là `current`. Ban đầu, `myRef.current` sẽ là `null`. Khi React tạo một DOM node cho `<div>` này, React sẽ đặt một tham chiếu đến node này vào `myRef.current`. Sau đó bạn có thể truy cập DOM node này từ [event handlers](/learn/responding-to-events) của bạn và sử dụng các [browser APIs](https://developer.mozilla.org/docs/Web/API/Element) tích hợp sẵn được định nghĩa trên nó.

```js
// Bạn có thể sử dụng bất kỳ browser APIs nào, ví dụ:
myRef.current.scrollIntoView();
```

### Ví dụ: Focus vào text input {/*example-focusing-a-text-input*/}

Trong ví dụ này, việc click vào button sẽ focus vào input:

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
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Để triển khai điều này:

1. Khai báo `inputRef` với Hook `useRef`.
2. Truyền nó làm `<input ref={inputRef}>`. Điều này báo cho React **đặt DOM node của `<input>` này vào `inputRef.current`.**
3. Trong function `handleClick`, đọc input DOM node từ `inputRef.current` và gọi [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) trên nó với `inputRef.current.focus()`.
4. Truyền event handler `handleClick` cho `<button>` với `onClick`.

Mặc dù thao tác DOM là trường hợp sử dụng phổ biến nhất cho refs, Hook `useRef` có thể được sử dụng để lưu trữ những thứ khác bên ngoài React, như timer IDs. Tương tự như state, refs vẫn tồn tại giữa các lần render. Refs giống như những biến state mà không kích hoạt re-render khi bạn thiết lập chúng. Đọc về refs trong [Tham chiếu giá trị với Refs.](/learn/referencing-values-with-refs)

### Ví dụ: Scroll đến một element {/*example-scrolling-to-an-element*/}

Bạn có thể có nhiều hơn một ref trong một component. Trong ví dụ này, có một carousel ba hình ảnh. Mỗi button sẽ căn giữa một hình ảnh bằng cách gọi phương thức [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) của browser trên DOM node tương ứng:

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Neo
        </button>
        <button onClick={handleScrollToSecondCat}>
          Millie
        </button>
        <button onClick={handleScrollToThirdCat}>
          Bella
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
              ref={thirdCatRef}
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

<DeepDive>

#### Cách quản lý danh sách refs sử dụng ref callback {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

Trong những ví dụ ở trên, có một số lượng refs được xác định trước. Tuy nhiên, đôi khi bạn có thể cần một ref cho từng item trong danh sách, và bạn không biết sẽ có bao nhiều. Một cái gì đó như thế này **sẽ không hoạt động**:

```js
<ul>
  {items.map((item) => {
    // Không hoạt động!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

Điều này là vì **Hooks chỉ được gọi ở top-level của component của bạn.** Bạn không thể gọi `useRef` trong một vòng lặp, trong một điều kiện, hoặc bên trong một lệnh gọi `map()`.

Một cách có thể giải quyết điều này là lấy một ref duy nhất đến parent element của chúng, và sau đó sử dụng các phương thức thao tác DOM như [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) để "tìm" các child nodes riêng lẻ từ nó. Tuy nhiên, điều này dễ vỡ và có thể bị hỏng nếu cấu trúc DOM của bạn thay đổi.

Một giải pháp khác là **truyền một function cho thuộc tính `ref`.** Điều này được gọi là [`ref` callback.](/reference/react-dom/components/common#ref-callback) React sẽ gọi ref callback của bạn với DOM node khi đến lúc thiết lập ref, và với `null` khi đến lúc xóa nó. Điều này cho phép bạn duy trì mảng riêng hoặc một [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), và truy cập bất kỳ ref nào theo index hoặc một loại ID nào đó.

Ví dụ này cho thấy cách bạn có thể sử dụng cách tiếp cận này để scroll đến một node tùy ý trong một danh sách dài:

<Sandpack>

```js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Initialize the Map on first usage.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[5])}>Millie</button>
        <button onClick={() => scrollToCat(catList[9])}>Bella</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat}
              ref={(node) => {
                const map = getMap();
                map.set(cat, node);

                return () => {
                  map.delete(cat);
                };
              }}
            >
              <img src={cat} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push("https://loremflickr.com/320/240/cat?lock=" + i);
  }

  return catList;
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

Trong ví dụ này, `itemsRef` không giữ một DOM node duy nhất. Thay vào đó, nó giữ một [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) từ item ID đến một DOM node. ([Refs có thể giữ bất kỳ giá trị nào!](/learn/referencing-values-with-refs)) [`ref` callback](/reference/react-dom/components/common#ref-callback) trên mỗi list item sẽ đảm nhận việc cập nhật Map:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Thêm vào Map
    map.set(cat, node);

    return () => {
      // Xóa khỏi Map
      map.delete(cat);
    };
  }}
>
```

Điều này cho phép bạn đọc các DOM nodes riêng lẻ từ Map sau này.

<Note>

Khi Strict Mode được bật, ref callbacks sẽ chạy hai lần trong quá trình development.

Đọc thêm về [cách điều này giúp tìm bugs](/reference/react/StrictMode#fixing-bugs-found-by-re-running-ref-callbacks-in-development) trong callback refs.

</Note>

</DeepDive>

## Truy cập DOM nodes của component khác {/*accessing-another-components-dom-nodes*/}

<Pitfall>
Refs là một escape hatch. Việc thao tác thủ công DOM nodes của _component khác_ có thể làm cho code của bạn trở nên dễ vỡ.
</Pitfall>

Bạn có thể truyền refs từ parent component đến child components [giống như bất kỳ prop nào khác](/learn/passing-props-to-a-component).

```js {3-4,9}
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function MyForm() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />
}
```

Trong ví dụ trên, một ref được tạo trong parent component, `MyForm`, và được truyền đến child component, `MyInput`. `MyInput` sau đó truyền ref đến `<input>`. Vì `<input>` là một [built-in component](/reference/react-dom/components/common), React đặt thuộc tính `.current` của ref thành `<input>` DOM element.

`inputRef` được tạo trong `MyForm` bây giờ trỏ đến `<input>` DOM element được trả về bởi `MyInput`. Một click handler được tạo trong `MyForm` có thể truy cập `inputRef` và gọi `focus()` để thiết lập focus trên `<input>`.

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<DeepDive>

### Expose một tập con của API với imperative handle {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

Trong ví dụ trên, ref được truyền đến `MyInput` được chuyển tiếp đến DOM input element gốc. Điều này cho phép parent component gọi `focus()` trên nó. Tuy nhiên, điều này cũng cho phép parent component làm cái gì đó khác--ví dụ, thay đổi CSS styles của nó. Trong những trường hợp không phổ biến, bạn có thể muốn hạn chế chức năng được expose. Bạn có thể làm điều đó với [`useImperativeHandle`](/reference/react/useImperativeHandle):

<Sandpack>

```js
import { useRef, useImperativeHandle } from "react";

function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Chỉ expose focus và không có gì khác
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input ref={realInputRef} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>Focus the input</button>
    </>
  );
}
```

</Sandpack>

Ở đây, `realInputRef` bên trong `MyInput` giữ DOM node input thực tế. Tuy nhiên, [`useImperativeHandle`](/reference/react/useImperativeHandle) hướng dẫn React cung cấp object đặc biệt của riêng bạn làm giá trị của một ref cho parent component. Vì vậy `inputRef.current` bên trong component `Form` sẽ chỉ có phương thức `focus`. Trong trường hợp này, ref "handle" không phải là DOM node, mà là object tùy chỉnh bạn tạo bên trong lệnh gọi [`useImperativeHandle`](/reference/react/useImperativeHandle).

</DeepDive>

## Khi React attach refs {/*when-react-attaches-the-refs*/}

Trong React, mọi cập nhật được chia thành [hai giai đoạn](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

* Trong **render,** React gọi những component của bạn để tìm ra những gì nên có trên màn hình.
* Trong **commit,** React áp dụng những thay đổi vào DOM.

Nói chung, bạn [không muốn](/learn/referencing-values-with-refs#best-practices-for-refs) truy cập refs trong quá trình rendering. Điều đó cũng áp dụng cho refs giữ DOM nodes. Trong lần render đầu tiên, những DOM nodes chưa được tạo, vì vậy `ref.current` sẽ là `null`. Và trong quá trình rendering của các cập nhật, những DOM nodes chưa được cập nhật. Vì vậy quá sớm để đọc chúng.

React đặt `ref.current` trong giai đoạn commit. Trước khi cập nhật DOM, React đặt những giá trị `ref.current` bị ảnh hưởng thành `null`. Sau khi cập nhật DOM, React ngay lập tức đặt chúng thành những DOM nodes tương ứng.

**Thông thường, bạn sẽ truy cập refs từ event handlers.** Nếu bạn muốn làm cái gì đó với một ref, nhưng không có sự kiện cụ thể nào để làm điều đó, bạn có thể cần một Effect. Chúng ta sẽ thảo luận về Effects trong những trang tiếp theo.

<DeepDive>

### Flushing state updates đồng bộ với flushSync {/*flushing-state-updates-synchronously-with-flush-sync*/}

Xem xét code như thế này, nó thêm một todo mới và scroll màn hình xuống child cuối cùng của danh sách. Chú ý rằng, vì một lý do nào đó, nó luôn scroll đến todo mà *vừa trước* todo cuối cùng được thêm:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

Vấn đề nằm ở hai dòng này:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

Trong React, [state updates được xếp hàng.](/learn/queueing-a-series-of-state-updates) Thông thường, đây là điều bạn muốn. Tuy nhiên, ở đây nó gây ra vấn đề vì `setTodos` không ngay lập tức cập nhật DOM. Vì vậy lúc bạn scroll danh sách đến element cuối cùng của nó, todo chưa được thêm vào. Đây là lý do tại sao scrolling luôn "chậm trễ" một item.

Để khắc phục vấn đề này, bạn có thể buộc React cập nhật ("flush") DOM một cách đồng bộ. Để làm điều này, import `flushSync` từ `react-dom` và **wrap state update** vào một lệnh gọi `flushSync`:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

Điều này sẽ hướng dẫn React cập nhật DOM một cách đồng bộ ngay sau khi code được wrap trong `flushSync` thực thi. Kết quả là, todo cuối cùng sẽ đã có trong DOM vào thời điểm bạn cố gắng scroll đến nó:

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## Best practices cho thao tác DOM với refs {/*best-practices-for-dom-manipulation-with-refs*/}

Refs là một escape hatch. Bạn chỉ nên sử dụng chúng khi bạn phải "bước ra ngoài React". Những ví dụ phổ biến của điều này bao gồm quản lý focus, vị trí scroll, hoặc gọi browser APIs mà React không expose.

Nếu bạn bám vào những hành động không phá hủy như focusing và scrolling, bạn không nên gặp bất kỳ vấn đề nào. Tuy nhiên, nếu bạn cố gắng **sửa đổi** DOM thủ công, bạn có thể có nguy cơ xung đột với những thay đổi mà React đang thực hiện.

Để minh họa vấn đề này, ví dụ này bao gồm một thông báo chào mừng và hai buttons. Button đầu tiên toggle sự hiện diện của nó bằng cách sử dụng [conditional rendering](/learn/conditional-rendering) và [state](/learn/state-a-components-memory), như bạn thường làm trong React. Button thứ hai sử dụng [`remove()` DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) để buộc xóa nó khỏi DOM bên ngoài sự kiểm soát của React.

Thử nhấn "Toggle with setState" vài lần. Thông báo sẽ biến mất và xuất hiện trở lại. Sau đó nhấn "Remove from the DOM". Điều này sẽ buộc xóa nó. Cuối cùng, nhấn "Toggle with setState":

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

Sau khi bạn đã xóa DOM element thủ công, việc cố gắng sử dụng `setState` để hiển thị nó lại sẽ dẫn đến crash. Điều này là vì bạn đã thay đổi DOM, và React không biết cách tiếp tục quản lý nó một cách chính xác.

**Tránh thay đổi DOM nodes được quản lý bởi React.** Việc sửa đổi, thêm children vào, hoặc xóa children khỏi những elements được quản lý bởi React có thể dẫn đến kết quả visual không nhất quán hoặc crashes như trên.

Tuy nhiên, điều này không có nghĩa là bạn không thể làm điều đó hoàn toàn. Nó đòi hỏi sự thận trọng. **Bạn có thể an toàn sửa đổi những phần của DOM mà React *không có lý do* để cập nhật.** Ví dụ, nếu một `<div>` nào đó luôn trống trong JSX, React sẽ không có lý do để chạm vào danh sách children của nó. Do đó, việc thêm hoặc xóa elements theo cách thủ công ở đó là an toàn.

<Recap>

- Refs là một khái niệm chung, nhưng thường nhất bạn sẽ sử dụng chúng để giữ DOM elements.
- Bạn hướng dẫn React đặt một DOM node vào `myRef.current` bằng cách truyền `<div ref={myRef}>`.
- Thông thường, bạn sẽ sử dụng refs cho những hành động không phá hủy như focusing, scrolling, hoặc đo DOM elements.
- Một component không expose DOM nodes của nó theo mặc định. Bạn có thể chọn expose một DOM node bằng cách sử dụng prop `ref`.
- Tránh thay đổi DOM nodes được quản lý bởi React.
- Nếu bạn có sửa đổi DOM nodes được quản lý bởi React, hãy sửa đổi những phần mà React không có lý do để cập nhật.

</Recap>



<Challenges>

### Play và pause video {/*play-and-pause-the-video*/}

Trong ví dụ này, button toggle một biến state để chuyển đổi giữa trạng thái playing và paused. Tuy nhiên, để thực sự play hoặc pause video, việc toggle state là không đủ. Bạn cũng cần gọi [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) và [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) trên DOM element cho `<video>`. Thêm một ref vào nó, và làm cho button hoạt động.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Để có thêm thách thức, giữ cho button "Play" đồng bộ với việc video có đang phát hay không ngay cả khi người dùng right-click vào video và phát nó bằng cách sử dụng các browser media controls tích hợp sẵn. Bạn có thể muốn lắng nghe `onPlay` và `onPause` trên video để làm điều đó.

<Solution>

Khai báo một ref và đặt nó trên element `<video>`. Sau đó gọi `ref.current.play()` và `ref.current.pause()` trong event handler tùy thuộc vào next state.

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
        {isPlaying ? 'Pause' : 'Play'}
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
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Để xử lý các browser controls tích hợp sẵn, bạn có thể thêm `onPlay` và `onPause` handlers vào element `<video>` và gọi `setIsPlaying` từ chúng. Bằng cách này, nếu người dùng phát video bằng cách sử dụng browser controls, state sẽ điều chỉnh phù hợp.

</Solution>

### Focus search field {/*focus-the-search-field*/}

Làm sao để việc click vào button "Search" đặt focus vào field.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Search</button>
      </nav>
      <input
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Thêm một ref vào input, và gọi `focus()` trên DOM node để focus nó:

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Search
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

### Scrolling image carousel {/*scrolling-an-image-carousel*/}

Image carousel này có một button "Next" chuyển đổi hình ảnh active. Làm cho gallery scroll ngang đến hình ảnh active khi click. Bạn sẽ muốn gọi [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) trên DOM node của hình ảnh active:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

Bạn không cần có một ref cho mỗi hình ảnh cho bài tập này. Sẽ đủ nếu có một ref đến hình ảnh hiện tại active, hoặc đến danh sách chính nó. Sử dụng `flushSync` để đảm bảo DOM được cập nhật *trước khi* bạn scroll.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://loremflickr.com/250/200/cat?lock=' + i
  });
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

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

Bạn có thể khai báo một `selectedRef`, và sau đó truyền nó có điều kiện chỉ cho hình ảnh hiện tại:

```js
<li ref={index === i ? selectedRef : null}>
```

Khi `index === i`, có nghĩa là hình ảnh là hình được chọn, `<li>` sẽ nhận `selectedRef`. React sẽ đảm bảo rằng `selectedRef.current` luôn trỏ đến DOM node chính xác.

Lưu ý rằng lệnh gọi `flushSync` là cần thiết để buộc React cập nhật DOM trước khi scroll. Nếu không, `selectedRef.current` sẽ luôn trỏ đến item được chọn trước đó.

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });            
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://loremflickr.com/250/200/cat?lock=' + i
  });
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

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

### Focus search field với các components riêng biệt {/*focus-the-search-field-with-separate-components*/}

Làm sao để việc click vào button "Search" đặt focus vào field. Lưu ý rằng mỗi component được định nghĩa trong một file riêng biệt và không nên được di chuyển ra khỏi nó. Làm sao để kết nối chúng lại với nhau?

<Hint>

Bạn sẽ cần truyền `ref` như một prop để chọn expose một DOM node từ component của riêng bạn như `SearchInput`.

</Hint>

<Sandpack>

```js src/App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Bạn sẽ cần thêm một prop `onClick` vào `SearchButton`, và làm cho `SearchButton` truyền nó xuống browser `<button>`. Bạn cũng sẽ truyền một ref xuống `<SearchInput>`, nó sẽ forward nó đến `<input>` thực và populate nó. Cuối cùng, trong click handler, bạn sẽ gọi `focus` trên DOM node được stored bên trong ref đó.

<Sandpack>

```js src/App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput({ ref }) {
  return (
    <input
      ref={ref}
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>
