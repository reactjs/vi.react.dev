---
title: Server Functions
---

<RSC>

Server Functions (Hàm máy chủ) dùng cho [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).

**Lưu ý:** Đến tháng 9 năm 2024, chúng tôi gọi tất cả Server Functions là "Server Actions". Nếu một Server Function được truyền cho một thuộc tính action hoặc được gọi từ bên trong một action thì nó là một Server Action, nhưng không phải tất cả Server Functions đều là Server Actions. Tên gọi trong tài liệu này đã được cập nhật để phản ánh rằng Server Functions có thể được sử dụng cho nhiều mục đích.

</RSC>

<Intro>

Server Functions cho phép Client Components gọi các hàm async được thực thi trên máy chủ.

</Intro>

<InlineToc />

<Note>

#### Làm cách nào để xây dựng hỗ trợ cho Server Functions? {/*how-do-i-build-support-for-server-functions*/}

Mặc dù Server Functions trong React 19 ổn định và sẽ không bị hỏng giữa các phiên bản nhỏ, nhưng các API cơ bản được sử dụng để triển khai Server Functions trong một bundler hoặc framework React Server Components không tuân theo semver và có thể bị hỏng giữa các phiên bản nhỏ trong React 19.x.

Để hỗ trợ Server Functions như một bundler hoặc framework, chúng tôi khuyên bạn nên ghim vào một phiên bản React cụ thể hoặc sử dụng bản phát hành Canary. Chúng tôi sẽ tiếp tục làm việc với các bundler và framework để ổn định các API được sử dụng để triển khai Server Functions trong tương lai.

</Note>

Khi một Server Function được định nghĩa với directive [`"use server"`](/reference/rsc/use-server), framework của bạn sẽ tự động tạo một tham chiếu đến server function và chuyển tham chiếu đó đến Client Component. Khi hàm đó được gọi trên client, React sẽ gửi một yêu cầu đến máy chủ để thực thi hàm và trả về kết quả.

Server Functions có thể được tạo trong Server Components và được truyền dưới dạng props cho Client Components, hoặc chúng có thể được import và sử dụng trong Client Components.

## Usage {/*usage*/}

### Tạo Server Function từ Server Component {/*creating-a-server-function-from-a-server-component*/}

Server Components có thể định nghĩa Server Functions với directive `”use server”`:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Server Component
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Server Function
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

Khi React render Server Function `EmptyNote`, nó sẽ tạo một tham chiếu đến hàm `createNoteAction` và chuyển tham chiếu đó đến Client Component `Button`. Khi nút được nhấp, React sẽ gửi một yêu cầu đến máy chủ để thực thi hàm `createNoteAction` với tham chiếu được cung cấp:

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Create Empty Note</button>
}
```

Để biết thêm, hãy xem tài liệu cho [`"use server"`](/reference/rsc/use-server).

### Import Server Functions từ Client Components {/*importing-server-functions-from-client-components*/}

Client Components có thể import Server Functions từ các file sử dụng directive `”use server”`:

```js [[1, 3, "createNote"]]
"use server";

export async function createNote() {
  await db.notes.create();
}

```

Khi bundler xây dựng Client Component `EmptyNote`, nó sẽ tạo một tham chiếu đến hàm `createNote` trong bundle. Khi `button` được nhấp, React sẽ gửi một yêu cầu đến máy chủ để thực thi hàm `createNote` bằng tham chiếu được cung cấp:

```js [[1, 2, "createNote"], [1, 5, "createNote"], [1, 7, "createNote"]]
"use client";
import {createNote} from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  <button onClick={() => createNote()} />
}
```

Để biết thêm, hãy xem tài liệu cho [`"use server"`](/reference/rsc/use-server).

### Server Functions với Actions {/*server-functions-with-actions*/}

Server Functions có thể được gọi từ Actions trên client:

```js [[1, 3, "updateName"]]
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
}
```

```js [[1, 3, "updateName"], [1, 13, "updateName"], [2, 11, "submitAction"],  [2, 23, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {error && <span>Failed: {error}</span>}
    </form>
  )
}
```

Điều này cho phép bạn truy cập trạng thái `isPending` của Server Function bằng cách bọc nó trong một Action trên client.

Để biết thêm, hãy xem tài liệu cho [Gọi Server Function bên ngoài `<form>`](/reference/rsc/use-server#calling-a-server-function-outside-of-form)

### Server Functions với Form Actions {/*using-server-functions-with-form-actions*/}

Server Functions hoạt động với các tính năng Form mới trong React 19.

Bạn có thể chuyển một Server Function cho một Form để tự động gửi form đến máy chủ:

```js [[1, 3, "updateName"], [1, 7, "updateName"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  )
}
```

Khi quá trình gửi Form thành công, React sẽ tự động reset form. Bạn có thể thêm `useActionState` để truy cập trạng thái pending, phản hồi cuối cùng hoặc để hỗ trợ progressive enhancement.

Để biết thêm, hãy xem tài liệu cho [Server Functions trong Forms](/reference/rsc/use-server#server-functions-in-forms).

### Server Functions với `useActionState` {/*server-functions-with-use-action-state*/}

Bạn có thể gọi Server Functions với `useActionState` cho trường hợp phổ biến khi bạn chỉ cần truy cập vào trạng thái pending của action và phản hồi cuối cùng được trả về:

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "submitAction"], [2, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  );
}
```

Khi sử dụng `useActionState` với Server Functions, React cũng sẽ tự động phát lại các lần gửi form được nhập trước khi quá trình hydration hoàn tất. Điều này có nghĩa là người dùng có thể tương tác với ứng dụng của bạn ngay cả trước khi ứng dụng được hydrate.

Để biết thêm, hãy xem tài liệu cho [`useActionState`](/reference/react-dom/hooks/useFormState).

### Progressive enhancement với `useActionState` {/*progressive-enhancement-with-useactionstate*/}

Server Functions cũng hỗ trợ progressive enhancement với đối số thứ ba của `useActionState`.

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "/name/update"], [3, 6, "submitAction"], [3, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, null, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

Khi <CodeStep step={2}>permalink</CodeStep> được cung cấp cho `useActionState`, React sẽ chuyển hướng đến URL được cung cấp nếu form được gửi trước khi bundle JavaScript tải.

Để biết thêm, hãy xem tài liệu cho [`useActionState`](/reference/react-dom/hooks/useFormState).
