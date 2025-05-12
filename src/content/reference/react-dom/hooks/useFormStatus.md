---
title: useFormStatus
---

<Intro>

`useFormStatus` là một Hook cung cấp cho bạn thông tin trạng thái của lần gửi biểu mẫu cuối cùng.

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useFormStatus()` {/*use-form-status*/}

Hook `useFormStatus` cung cấp thông tin trạng thái của lần gửi biểu mẫu cuối cùng.

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

Để lấy thông tin trạng thái, component `Submit` phải được render bên trong một `<form>`. Hook trả về thông tin như thuộc tính <CodeStep step={1}>`pending`</CodeStep> cho bạn biết nếu biểu mẫu đang được gửi.

Trong ví dụ trên, `Submit` sử dụng thông tin này để vô hiệu hóa các lần nhấn `<button>` trong khi biểu mẫu đang được gửi.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

`useFormStatus` không nhận bất kỳ tham số nào.

#### Giá trị trả về {/*returns*/}

Một đối tượng `status` với các thuộc tính sau:

* `pending`: Một giá trị boolean. Nếu `true`, điều này có nghĩa là `<form>` cha đang chờ gửi. Ngược lại, `false`.

* `data`: Một đối tượng triển khai [`FormData interface`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) chứa dữ liệu mà `<form>` cha đang gửi. Nếu không có gửi hoạt động hoặc không có `<form>` cha, nó sẽ là `null`.

* `method`: Một giá trị chuỗi là `'get'` hoặc `'post'`. Điều này thể hiện việc `<form>` cha đang gửi bằng phương thức [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) `GET` hoặc `POST`. Theo mặc định, một `<form>` sẽ sử dụng phương thức `GET` và có thể được chỉ định bởi thuộc tính [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method).

[//]: # (Liên kết đến tài liệu `<form>`. "Đọc thêm về prop `action` trên `<form>`.")
* `action`: Một tham chiếu đến hàm được truyền cho prop `action` trên `<form>` cha. Nếu không có `<form>` cha, thuộc tính là `null`. Nếu có một giá trị URI được cung cấp cho prop `action` hoặc không có prop `action` nào được chỉ định, `status.action` sẽ là `null`.

#### Lưu ý {/*caveats*/}

* Hook `useFormStatus` phải được gọi từ một component được render bên trong một `<form>`.
* `useFormStatus` sẽ chỉ trả về thông tin trạng thái cho một `<form>` cha. Nó sẽ không trả về thông tin trạng thái cho bất kỳ `<form>` nào được render trong cùng một component hoặc các component con.

---

## Cách sử dụng {/*usage*/}

### Hiển thị trạng thái chờ trong khi gửi biểu mẫu {/*display-a-pending-state-during-form-submission*/}
Để hiển thị trạng thái chờ trong khi biểu mẫu đang được gửi, bạn có thể gọi Hook `useFormStatus` trong một component được render trong một `<form>` và đọc thuộc tính `pending` được trả về.

Ở đây, chúng ta sử dụng thuộc tính `pending` để chỉ ra rằng biểu mẫu đang được gửi.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Đang gửi..." : "Gửi"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```
</Sandpack>

<Pitfall>

##### `useFormStatus` sẽ không trả về thông tin trạng thái cho một `<form>` được render trong cùng một component. {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

Hook `useFormStatus` chỉ trả về thông tin trạng thái cho một `<form>` cha và không cho bất kỳ `<form>` nào được render trong cùng một component gọi Hook hoặc các component con.

```js
function Form() {
  // 🚩 `pending` sẽ không bao giờ là true
  // useFormStatus không theo dõi biểu mẫu được render trong component này
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

Thay vào đó, hãy gọi `useFormStatus` từ bên trong một component nằm bên trong `<form>`.

```js
function Submit() {
  // ✅ `pending` sẽ được lấy từ biểu mẫu bao bọc component Submit
  const { pending } = useFormStatus();
  return <button disabled={pending}>...</button>;
}

function Form() {
  // Đây là `<form>` mà `useFormStatus` theo dõi
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### Đọc dữ liệu biểu mẫu đang được gửi {/*read-form-data-being-submitted*/}

Bạn có thể sử dụng thuộc tính `data` của thông tin trạng thái được trả về từ `useFormStatus` để hiển thị dữ liệu đang được người dùng gửi.

Ở đây, chúng ta có một biểu mẫu nơi người dùng có thể yêu cầu tên người dùng. Chúng ta có thể sử dụng `useFormStatus` để hiển thị một thông báo trạng thái tạm thời xác nhận tên người dùng mà họ đã yêu cầu.

<Sandpack>

```js src/UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  return (
    <div>
      <h3>Yêu cầu tên người dùng: </h3>
      <input type="text" name="username" disabled={pending}/>
      <button type="submit" disabled={pending}>
        Gửi
      </button>
      <br />
      <p>{data ? `Đang yêu cầu ${data?.get("username")}...`: ''}</p>
    </div>
  );
}
```

```js src/App.js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";
import {useRef} from 'react';

export default function App() {
  const ref = useRef(null);
  return (
    <form ref={ref} action={async (formData) => {
      await submitForm(formData);
      ref.current.reset();
    }}>
      <UsernameForm />
    </form>
  );
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 2000));
}
```

```css
p {
    height: 14px;
    padding: 0;
    margin: 2px 0 0 0 ;
    font-size: 14px
}

button {
    margin-left: 2px;
}

```

</Sandpack>

---

## Gỡ rối {/*troubleshooting*/}

### `status.pending` không bao giờ là `true` {/*pending-is-never-true*/}

`useFormStatus` sẽ chỉ trả về thông tin trạng thái cho một `<form>` cha.

Nếu component gọi `useFormStatus` không được lồng trong một `<form>`, `status.pending` sẽ luôn trả về `false`. Xác minh `useFormStatus` được gọi trong một component là con của một phần tử `<form>`.

`useFormStatus` sẽ không theo dõi trạng thái của một `<form>` được render trong cùng một component. Xem [Pitfall](#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component) để biết thêm chi tiết.
