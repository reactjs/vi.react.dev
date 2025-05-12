---
title: createRef
---

<Pitfall>

`createRef` chủ yếu được sử dụng cho [component class.](/reference/react/Component) Các component function thường dựa vào [`useRef`](/reference/react/useRef) để thay thế.

</Pitfall>

<Intro>

`createRef` tạo ra một đối tượng [ref](/learn/referencing-values-with-refs) có thể chứa giá trị tùy ý.

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `createRef()` {/*createref*/}

Gọi `createRef` để khai báo một [ref](/learn/referencing-values-with-refs) bên trong một [component class.](/reference/react/Component)

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

`createRef` không có tham số.

#### Giá trị trả về {/*returns*/}

`createRef` trả về một đối tượng với một thuộc tính duy nhất:

* `current`: Ban đầu, nó được đặt thành `null`. Bạn có thể đặt nó thành một giá trị khác sau này. Nếu bạn truyền đối tượng ref cho React dưới dạng một thuộc tính `ref` cho một nút JSX, React sẽ đặt thuộc tính `current` của nó.

#### Lưu ý {/*caveats*/}

* `createRef` luôn trả về một đối tượng *khác*. Nó tương đương với việc tự viết `{ current: null }`.
* Trong một component function, bạn có thể muốn sử dụng [`useRef`](/reference/react/useRef) thay thế, nó luôn trả về cùng một đối tượng.
* `const ref = useRef()` tương đương với `const [ref, _] = useState(() => createRef(null))`.

---

## Cách sử dụng {/*usage*/}

### Khai báo một ref trong một component class {/*declaring-a-ref-in-a-class-component*/}

Để khai báo một ref bên trong một [component class,](/reference/react/Component) gọi `createRef` và gán kết quả của nó cho một trường class:

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

Nếu bây giờ bạn truyền `ref={this.inputRef}` cho một `<input>` trong JSX của bạn, React sẽ điền `this.inputRef.current` với nút DOM input. Ví dụ: đây là cách bạn tạo một nút tập trung vào input:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef` chủ yếu được sử dụng cho [component class.](/reference/react/Component) Các component function thường dựa vào [`useRef`](/reference/react/useRef) để thay thế.

</Pitfall>

---

## Các lựa chọn thay thế {/*alternatives*/}

### Chuyển đổi từ một class với `createRef` sang một function với `useRef` {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

Chúng tôi khuyên bạn nên sử dụng component function thay vì [component class](/reference/react/Component) trong code mới. Nếu bạn có một số component class hiện tại đang sử dụng `createRef`, đây là cách bạn có thể chuyển đổi chúng. Đây là code gốc:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

Khi bạn [chuyển đổi component này từ một class sang một function,](/reference/react/Component#alternatives) hãy thay thế các lệnh gọi đến `createRef` bằng các lệnh gọi đến [`useRef`:](/reference/react/useRef)

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
