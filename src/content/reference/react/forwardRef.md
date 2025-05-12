---
title: forwardRef
---

<Deprecated>

Trong React 19, `forwardRef` không còn cần thiết nữa. Thay vào đó, hãy truyền `ref` như một prop.

`forwardRef` sẽ bị loại bỏ trong một bản phát hành trong tương lai. Tìm hiểu thêm [tại đây](/blog/2024/04/25/react-19#ref-as-a-prop).

</Deprecated>

<Intro>

`forwardRef` cho phép component của bạn hiển thị một DOM node cho component cha bằng một [ref.](/learn/manipulating-the-dom-with-refs)

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

Gọi `forwardRef()` để cho phép component của bạn nhận một ref và chuyển nó đến một component con:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `render`: Hàm render cho component của bạn. React gọi hàm này với các props và `ref` mà component của bạn nhận được từ component cha. JSX bạn trả về sẽ là đầu ra của component của bạn.

#### Giá trị trả về {/*returns*/}

`forwardRef` trả về một React component mà bạn có thể render trong JSX. Không giống như các React component được định nghĩa là các hàm thuần túy, một component được trả về bởi `forwardRef` cũng có thể nhận một prop `ref`.

#### Lưu ý {/*caveats*/}

* Trong Strict Mode, React sẽ **gọi hàm render của bạn hai lần** để [giúp bạn tìm các tạp chất vô tình.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) Đây là hành vi chỉ dành cho quá trình phát triển và không ảnh hưởng đến production. Nếu hàm render của bạn là thuần túy (như nó phải vậy), điều này sẽ không ảnh hưởng đến logic của component của bạn. Kết quả từ một trong các lệnh gọi sẽ bị bỏ qua.


---

### Hàm `render` {/*render-function*/}

`forwardRef` chấp nhận một hàm render làm đối số. React gọi hàm này với `props` và `ref`:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### Tham số {/*render-parameters*/}

* `props`: Các props được truyền bởi component cha.

* `ref`: Thuộc tính `ref` được truyền bởi component cha. `ref` có thể là một đối tượng hoặc một hàm. Nếu component cha không truyền ref, nó sẽ là `null`. Bạn nên truyền `ref` bạn nhận được cho một component khác hoặc truyền nó cho [`useImperativeHandle`.](/reference/react/useImperativeHandle)

#### Giá trị trả về {/*render-returns*/}

`forwardRef` trả về một React component mà bạn có thể render trong JSX. Không giống như các React component được định nghĩa là các hàm thuần túy, component được trả về bởi `forwardRef` có thể nhận một prop `ref`.

---

## Cách sử dụng {/*usage*/}

### Hiển thị một DOM node cho component cha {/*exposing-a-dom-node-to-the-parent-component*/}

Theo mặc định, các DOM node của mỗi component là riêng tư. Tuy nhiên, đôi khi hữu ích khi hiển thị một DOM node cho component cha--ví dụ: để cho phép focus nó. Để chọn tham gia, hãy bọc định nghĩa component của bạn vào `forwardRef()`:

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

Bạn sẽ nhận được một <CodeStep step={1}>ref</CodeStep> làm đối số thứ hai sau props. Truyền nó đến DOM node mà bạn muốn hiển thị:

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

Điều này cho phép component `Form` cha truy cập <CodeStep step={2}>`<input>` DOM node</CodeStep> được hiển thị bởi `MyInput`:

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

Component `Form` này [truyền một ref](/reference/react/useRef#manipulating-the-dom-with-a-ref) cho `MyInput`. Component `MyInput` *chuyển tiếp* ref đó đến thẻ trình duyệt `<input>`. Do đó, component `Form` có thể truy cập DOM node `<input>` đó và gọi [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) trên nó.

Hãy nhớ rằng việc hiển thị một ref cho DOM node bên trong component của bạn sẽ khiến việc thay đổi các thành phần bên trong của component sau này trở nên khó khăn hơn. Bạn thường sẽ hiển thị các DOM node từ các component cấp thấp có thể tái sử dụng như nút hoặc đầu vào văn bản, nhưng bạn sẽ không làm điều đó cho các component cấp ứng dụng như hình đại diện hoặc nhận xét.

<Recipes titleText="Ví dụ về chuyển tiếp ref">

#### Tập trung vào một đầu vào văn bản {/*focusing-a-text-input*/}

Nhấp vào nút sẽ tập trung vào đầu vào. Component `Form` xác định một ref và truyền nó cho component `MyInput`. Component `MyInput` chuyển tiếp ref đó đến trình duyệt `<input>`. Điều này cho phép component `Form` tập trung vào `<input>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### Phát và tạm dừng video {/*playing-and-pausing-a-video*/}

Nhấp vào nút sẽ gọi [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) và [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) trên một DOM node `<video>`. Component `App` xác định một ref và truyền nó cho component `MyVideoPlayer`. Component `MyVideoPlayer` chuyển tiếp ref đó đến node trình duyệt `<video>`. Điều này cho phép component `App` phát và tạm dừng `<video>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js src/MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Chuyển tiếp một ref qua nhiều component {/*forwarding-a-ref-through-multiple-components*/}

Thay vì chuyển tiếp một `ref` đến một DOM node, bạn có thể chuyển tiếp nó đến component của riêng bạn như `MyInput`:

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

Nếu component `MyInput` đó chuyển tiếp một ref đến `<input>` của nó, một ref đến `FormField` sẽ cung cấp cho bạn `<input>` đó:

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

Component `Form` xác định một ref và truyền nó cho `FormField`. Component `FormField` chuyển tiếp ref đó đến `MyInput`, và `MyInput` chuyển tiếp nó đến một DOM node `<input>` của trình duyệt. Đây là cách `Form` truy cập DOM node đó.


<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)} 
      />
      {(isRequired && value === '') &&
        <i>Required</i>
      }
    </>
  );
});

export default FormField;
```


```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### Hiển thị một imperative handle thay vì một DOM node {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

Thay vì hiển thị toàn bộ DOM node, bạn có thể hiển thị một đối tượng tùy chỉnh, được gọi là *imperative handle,* với một tập hợp các phương thức bị ràng buộc hơn. Để làm điều này, bạn cần xác định một ref riêng biệt để giữ DOM node:

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

Truyền `ref` bạn nhận được cho [`useImperativeHandle`](/reference/react/useImperativeHandle) và chỉ định giá trị bạn muốn hiển thị cho `ref`:

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

Nếu một số component nhận được một ref đến `MyInput`, nó sẽ chỉ nhận được đối tượng `{ focus, scrollIntoView }` của bạn thay vì DOM node. Điều này cho phép bạn giới hạn thông tin bạn hiển thị về DOM node của mình ở mức tối thiểu.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[Đọc thêm về sử dụng imperative handle.](/reference/react/useImperativeHandle)

<Pitfall>

**Không lạm dụng refs.** Bạn chỉ nên sử dụng refs cho các hành vi *bắt buộc* mà bạn không thể thể hiện dưới dạng props: ví dụ: cuộn đến một node, tập trung vào một node, kích hoạt một hoạt ảnh, chọn văn bản, v.v.

**Nếu bạn có thể thể hiện một cái gì đó như một prop, bạn không nên sử dụng ref.** Ví dụ: thay vì hiển thị một imperative handle như `{ open, close }` từ một component `Modal`, tốt hơn là lấy `isOpen` làm một prop như `<Modal isOpen={isOpen} />`. [Effects](/learn/synchronizing-with-effects) có thể giúp bạn hiển thị các hành vi bắt buộc thông qua props.

</Pitfall>

---

## Khắc phục sự cố {/*troubleshooting*/}

### Component của tôi được bọc trong `forwardRef`, nhưng `ref` đến nó luôn là `null` {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

Điều này thường có nghĩa là bạn đã quên sử dụng `ref` mà bạn đã nhận được.

Ví dụ: component này không làm gì với `ref` của nó:

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

Để khắc phục, hãy truyền `ref` xuống một DOM node hoặc một component khác có thể chấp nhận một ref:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

`ref` đến `MyInput` cũng có thể là `null` nếu một số logic là có điều kiện:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

Nếu `showInput` là `false`, thì ref sẽ không được chuyển tiếp đến bất kỳ node nào và một ref đến `MyInput` sẽ vẫn trống. Điều này đặc biệt dễ bỏ lỡ nếu điều kiện được ẩn bên trong một component khác, như `Panel` trong ví dụ này:

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```
