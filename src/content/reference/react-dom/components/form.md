---
title: "<form>"
---

<Intro>

[Component `<form>` tích hợp sẵn của trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) cho phép bạn tạo các điều khiển tương tác để gửi thông tin.

```js
<form action={search}>
  <input name="query" />
  <button type="submit">Tìm kiếm</button>
</form>
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<form>` {/*form*/}

Để tạo các điều khiển tương tác để gửi thông tin, hãy render [component `<form>` tích hợp sẵn của trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form).

```js
<form action={search}>
  <input name="query" />
  <button type="submit">Tìm kiếm</button>
</form>

```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<form>` hỗ trợ tất cả [các props phần tử thông thường.](/reference/react-dom/components/common#props)

[`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): một URL hoặc một hàm. Khi một URL được truyền cho `action`, form sẽ hoạt động giống như component form HTML. Khi một hàm được truyền cho `action`, hàm đó sẽ xử lý việc gửi form. Hàm được truyền cho `action` có thể là async và sẽ được gọi với một đối số duy nhất chứa [dữ liệu form](https://developer.mozilla.org/en-US/docs/Web/API/FormData) của form đã gửi. Prop `action` có thể bị ghi đè bởi thuộc tính `formAction` trên component `<button>`, `<input type="submit">` hoặc `<input type="image">`.

#### Lưu ý {/*caveats*/}

* Khi một hàm được truyền cho `action` hoặc `formAction`, phương thức HTTP sẽ là POST bất kể giá trị của prop `method`.

---

## Cách sử dụng {/*usage*/}

### Xử lý việc gửi form trên client {/*handle-form-submission-on-the-client*/}

Truyền một hàm cho prop `action` của form để chạy hàm khi form được gửi. [`formData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) sẽ được truyền cho hàm như một đối số để bạn có thể truy cập dữ liệu được gửi bởi form. Điều này khác với [action HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action) thông thường, chỉ chấp nhận URL. Sau khi hàm `action` thành công, tất cả các phần tử trường không được kiểm soát trong form sẽ được đặt lại.

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
  const query = formData.get("query");
  alert(`Bạn đã tìm kiếm '${query}'`);
  }
  return (
  <form action={search}>
    <input name="query" />
    <button type="submit">Tìm kiếm</button>
  </form>
  );
}
```

</Sandpack>

### Xử lý việc gửi form bằng Server Function {/*handle-form-submission-with-a-server-function*/}

Render một `<form>` với một input và nút submit. Truyền một Server Function (một hàm được đánh dấu bằng [`'use server'`](/reference/rsc/use-server)) cho prop `action` của form để chạy hàm khi form được gửi.

Việc truyền một Server Function cho `<form action>` cho phép người dùng gửi form mà không cần bật JavaScript hoặc trước khi code được tải. Điều này có lợi cho những người dùng có kết nối chậm, thiết bị chậm hoặc đã tắt JavaScript và tương tự như cách form hoạt động khi một URL được truyền cho prop `action`.

Bạn có thể sử dụng các trường form ẩn để cung cấp dữ liệu cho action của `<form>`. Server Function sẽ được gọi với dữ liệu trường form ẩn như một instance của [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
  'use server'
  const productId = formData.get('productId')
  await updateCart(productId)
  }
  return (
  <form action={addToCart}>
    <input type="hidden" name="productId" value={productId} />
    <button type="submit">Thêm vào giỏ hàng</button>
  </form>

  );
}
```

Thay vì sử dụng các trường form ẩn để cung cấp dữ liệu cho action của `<form>`, bạn có thể gọi phương thức <CodeStep step={1}>`bind`</CodeStep> để cung cấp thêm các đối số cho nó. Điều này sẽ liên kết một đối số mới (<CodeStep step={2}>`productId`</CodeStep>) với hàm ngoài <CodeStep step={3}>`formData`</CodeStep> được truyền như một đối số cho hàm.

```jsx [[1, 8, "bind"], [2,8, "productId"], [2,4, "productId"], [3,4, "formData"]]
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
  "use server";
  await updateCart(productId)
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
  <form action={addProductToCart}>
    <button type="submit">Thêm vào giỏ hàng</button>
  </form>
  );
}
```

Khi `<form>` được render bởi một [Server Component](/reference/rsc/use-client) và một [Server Function](/reference/rsc/server-functions) được truyền cho prop `action` của `<form>`, form sẽ được [nâng cấp dần](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement).

### Hiển thị trạng thái chờ trong khi gửi form {/*display-a-pending-state-during-form-submission*/}
Để hiển thị trạng thái chờ khi form đang được gửi, bạn có thể gọi Hook `useFormStatus` trong một component được render trong `<form>` và đọc thuộc tính `pending` được trả về.

Ở đây, chúng ta sử dụng thuộc tính `pending` để chỉ ra rằng form đang được gửi.

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

Để tìm hiểu thêm về Hook `useFormStatus`, hãy xem [tài liệu tham khảo](/reference/react-dom/hooks/useFormStatus).

### Cập nhật dữ liệu form một cách lạc quan {/*optimistically-updating-form-data*/}
Hook `useOptimistic` cung cấp một cách để cập nhật giao diện người dùng một cách lạc quan trước khi một hoạt động nền, như một yêu cầu mạng, hoàn thành. Trong ngữ cảnh của form, kỹ thuật này giúp làm cho ứng dụng có cảm giác phản hồi nhanh hơn. Khi người dùng gửi một form, thay vì chờ phản hồi của máy chủ để phản ánh các thay đổi, giao diện được cập nhật ngay lập tức với kết quả dự kiến.

Ví dụ: khi người dùng nhập một tin nhắn vào form và nhấn nút "Gửi", Hook `useOptimistic` cho phép tin nhắn xuất hiện ngay lập tức trong danh sách với nhãn "Đang gửi...", ngay cả trước khi tin nhắn thực sự được gửi đến máy chủ. Cách tiếp cận "lạc quan" này tạo ấn tượng về tốc độ và khả năng phản hồi. Sau đó, form cố gắng thực sự gửi tin nhắn trong nền. Khi máy chủ xác nhận rằng tin nhắn đã được nhận, nhãn "Đang gửi..." sẽ bị xóa.

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
  addOptimisticMessage(formData.get("message"));
  formRef.current.reset();
  await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
  messages,
  (state, newMessage) => [
    ...state,
    {
    text: newMessage,
    sending: true
    }
  ]
  );

  return (
  <>
    {optimisticMessages.map((message, index) => (
    <div key={index}>
      {message.text}
      {!!message.sending && <small> (Đang gửi...)</small>}
    </div>
    ))}
    <form action={formAction} ref={formRef}>
    <input type="text" name="message" placeholder="Xin chào!" />
    <button type="submit">Gửi</button>
    </form>
  </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
  { text: "Xin chào!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
  const sentMessage = await deliverMessage(formData.get("message"));
  setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

</Sandpack>

[//]: # 'Uncomment the next line, and delete this line after the `useOptimistic` reference documentatino page is published'
[//]: # 'To learn more about the `useOptimistic` Hook see the [reference documentation](/reference/react/hooks/useOptimistic).'

### Xử lý lỗi gửi form {/*handling-form-submission-errors*/}

Trong một số trường hợp, hàm được gọi bởi prop `action` của `<form>` sẽ ném ra một lỗi. Bạn có thể xử lý các lỗi này bằng cách bọc `<form>` trong một Error Boundary. Nếu hàm được gọi bởi prop `action` của `<form>` ném ra một lỗi, fallback cho error boundary sẽ được hiển thị.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
  throw new Error("lỗi tìm kiếm");
  }
  return (
  <ErrorBoundary
    fallback={<p>Đã xảy ra lỗi khi gửi form</p>}
  >
    <form action={search}>
    <input name="query" />
    <button type="submit">Tìm kiếm</button>
    </form>
  </ErrorBoundary>
  );
}

```

```json package.json hidden
{
  "dependencies": {
  "react": "19.0.0-rc-3edc000d-20240926",
  "react-dom": "19.0.0-rc-3edc000d-20240926",
  "react-scripts": "^5.0.0",
  "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### Hiển thị lỗi gửi form mà không cần JavaScript {/*display-a-form-submission-error-without-javascript*/}

Để hiển thị thông báo lỗi gửi form trước khi bundle JavaScript tải cho progressive enhancement, cần phải:

1. `<form>` được render bởi một [Server Component](/reference/rsc/use-client)
2. hàm được truyền cho prop `action` của `<form>` là một [Server Function](/reference/rsc/server-functions)
3. Hook `useActionState` được sử dụng để hiển thị thông báo lỗi

`useActionState` nhận hai tham số: một [Server Function](/reference/rsc/server-functions) và một trạng thái ban đầu. `useActionState` trả về hai giá trị, một biến trạng thái và một action. Action được trả về bởi `useActionState` nên được truyền cho prop `action` của form. Biến trạng thái được trả về bởi `useActionState` có thể được sử dụng để hiển thị thông báo lỗi. Giá trị được trả về bởi Server Function được truyền cho `useActionState` sẽ được sử dụng để cập nhật biến trạng thái.

<Sandpack>

```js src/App.js
import { useActionState } from "react";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
  "use server";
  const email = formData.get("email");
  try {
    await signUpNewUser(email);
    alert(`Đã thêm "${email}"`);
  } catch (err) {
    return err.toString();
  }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
  <>
    <h1>Đăng ký nhận bản tin của tôi</h1>
    <p>Đăng ký với cùng một email hai lần để xem lỗi</p>
    <form action={signupAction} id="signup-form">
    <label htmlFor="email">Email: </label>
    <input name="email" id="email" placeholder="react@example.com" />
    <button>Đăng ký</button>
    {!!message && <p>{message}</p>}
    </form>
  </>
  );
}
```

```js src/api.js hidden
let emails = [];

export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
  throw new Error("Địa chỉ email này đã được thêm");
  }
  emails.push(newEmail);
}
```

</Sandpack>

Tìm hiểu thêm về cách cập nhật trạng thái từ một form action với tài liệu [`useActionState`](/reference/react/useActionState)

### Xử lý nhiều loại gửi {/*handling-multiple-submission-types*/}

Form có thể được thiết kế để xử lý nhiều action gửi khác nhau dựa trên nút được người dùng nhấn. Mỗi nút bên trong một form có thể được liên kết với một action hoặc hành vi riêng biệt bằng cách đặt prop `formAction`.

Khi người dùng nhấn vào một nút cụ thể, form sẽ được gửi và một action tương ứng, được xác định bởi các thuộc tính và action của nút đó, sẽ được thực thi. Ví dụ: một form có thể gửi một bài viết để xem xét theo mặc định nhưng có một nút riêng biệt với `formAction` được đặt để lưu bài viết dưới dạng bản nháp.

<Sandpack>

```js src/App.js
export default function Search() {
  function publish(formData) {
  const content = formData.get("content");
  const button = formData.get("button");
  alert(`'${content}' đã được xuất bản bằng nút '${button}'`);
  }

  function save(formData) {
  const content = formData.get("content");
  alert(`Bản nháp của bạn về '${content}' đã được lưu!`);
  }

  return (
  <form action={publish}>
    <textarea name="content" rows={4} cols={40} />
    <br />
    <button type="submit" name="button" value="submit">Xuất bản</button>
    <button formAction={save}>Lưu bản nháp</button>
  </form>
  );
}
```

</Sandpack>
