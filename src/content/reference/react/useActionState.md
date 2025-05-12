---
title: useActionState
---

<Intro>

`useActionState` là một Hook cho phép bạn cập nhật trạng thái dựa trên kết quả của một hành động biểu mẫu.

```js
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

</Intro>

<Note>

Trong các phiên bản React Canary trước đây, API này là một phần của React DOM và được gọi là `useFormState`.

</Note>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useActionState(action, initialState, permalink?)` {/*useactionstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

Gọi `useActionState` ở cấp cao nhất của component để tạo trạng thái component được cập nhật [khi một hành động biểu mẫu được gọi](/reference/react-dom/components/form). Bạn chuyển cho `useActionState` một hàm hành động biểu mẫu hiện có cũng như một trạng thái ban đầu, và nó trả về một hành động mới mà bạn sử dụng trong biểu mẫu của mình, cùng với trạng thái biểu mẫu mới nhất và liệu Hành động có còn đang chờ xử lý hay không. Trạng thái biểu mẫu mới nhất cũng được chuyển đến hàm mà bạn đã cung cấp.

```js
import { useActionState } from "react";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  )
}
```

Trạng thái biểu mẫu là giá trị được trả về bởi hành động khi biểu mẫu được gửi lần cuối. Nếu biểu mẫu chưa được gửi, đó là trạng thái ban đầu mà bạn chuyển vào.

Nếu được sử dụng với Server Function, `useActionState` cho phép hiển thị phản hồi của máy chủ từ việc gửi biểu mẫu ngay cả trước khi quá trình hydration hoàn tất.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `fn`: Hàm sẽ được gọi khi biểu mẫu được gửi hoặc nút được nhấn. Khi hàm được gọi, nó sẽ nhận trạng thái trước đó của biểu mẫu (ban đầu là `initialState` mà bạn chuyển vào, sau đó là giá trị trả về trước đó của nó) làm đối số ban đầu, tiếp theo là các đối số mà một hành động biểu mẫu thường nhận được.
* `initialState`: Giá trị bạn muốn trạng thái ban đầu là. Nó có thể là bất kỳ giá trị tuần tự hóa nào. Đối số này bị bỏ qua sau khi hành động được gọi lần đầu tiên.
* **tùy chọn** `permalink`: Một chuỗi chứa URL trang duy nhất mà biểu mẫu này sửa đổi. Để sử dụng trên các trang có nội dung động (ví dụ: nguồn cấp dữ liệu) kết hợp với cải tiến lũy tiến: nếu `fn` là một [hàm máy chủ](/reference/rsc/server-functions) và biểu mẫu được gửi trước khi tải gói JavaScript, trình duyệt sẽ điều hướng đến URL permalink được chỉ định, thay vì URL của trang hiện tại. Đảm bảo rằng cùng một component biểu mẫu được hiển thị trên trang đích (bao gồm cùng một hành động `fn` và `permalink`) để React biết cách truyền trạng thái qua. Sau khi biểu mẫu đã được hydrate, tham số này không có hiệu lực.

{/* TODO T164397693: link to serializable values docs once it exists */}

#### Trả về {/*returns*/}

`useActionState` trả về một mảng với các giá trị sau:

1. Trạng thái hiện tại. Trong lần hiển thị đầu tiên, nó sẽ khớp với `initialState` mà bạn đã chuyển vào. Sau khi hành động được gọi, nó sẽ khớp với giá trị được trả về bởi hành động.
2. Một hành động mới mà bạn có thể chuyển làm prop `action` cho component `form` của bạn hoặc prop `formAction` cho bất kỳ component `button` nào trong biểu mẫu. Hành động cũng có thể được gọi thủ công trong [`startTransition`](/reference/react/startTransition).
3. Cờ `isPending` cho bạn biết liệu có Transition đang chờ xử lý hay không.

#### Lưu ý {/*caveats*/}

* Khi được sử dụng với một framework hỗ trợ React Server Components, `useActionState` cho phép bạn làm cho biểu mẫu tương tác trước khi JavaScript được thực thi trên máy khách. Khi được sử dụng mà không có Server Components, nó tương đương với trạng thái cục bộ của component.
* Hàm được chuyển cho `useActionState` nhận một đối số bổ sung, trạng thái trước đó hoặc trạng thái ban đầu, làm đối số đầu tiên của nó. Điều này làm cho chữ ký của nó khác với khi nó được sử dụng trực tiếp làm một hành động biểu mẫu mà không sử dụng `useActionState`.

---

## Cách sử dụng {/*usage*/}

### Sử dụng thông tin được trả về bởi một hành động biểu mẫu {/*using-information-returned-by-a-form-action*/}

Gọi `useActionState` ở cấp cao nhất của component để truy cập giá trị trả về của một hành động từ lần cuối cùng biểu mẫu được gửi.

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useActionState } from 'react';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useActionState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

`useActionState` trả về một mảng với các mục sau:

1. <CodeStep step={1}>Trạng thái hiện tại</CodeStep> của biểu mẫu, ban đầu được đặt thành <CodeStep step={4}>trạng thái ban đầu</CodeStep> mà bạn đã cung cấp, và sau khi biểu mẫu được gửi, nó được đặt thành giá trị trả về của <CodeStep step={3}>hành động</CodeStep> mà bạn đã cung cấp.
2. Một <CodeStep step={2}>hành động mới</CodeStep> mà bạn chuyển cho `<form>` làm prop `action` của nó hoặc gọi thủ công trong `startTransition`.
3. Một <CodeStep step={1}>trạng thái đang chờ xử lý</CodeStep> mà bạn có thể sử dụng trong khi hành động của bạn đang xử lý.

Khi biểu mẫu được gửi, hàm <CodeStep step={3}>hành động</CodeStep> mà bạn đã cung cấp sẽ được gọi. Giá trị trả về của nó sẽ trở thành <CodeStep step={1}>trạng thái hiện tại</CodeStep> mới của biểu mẫu.

<CodeStep step={3}>Hành động</CodeStep> mà bạn cung cấp cũng sẽ nhận được một đối số đầu tiên mới, cụ thể là <CodeStep step={1}>trạng thái hiện tại</CodeStep> của biểu mẫu. Lần đầu tiên biểu mẫu được gửi, đây sẽ là <CodeStep step={4}>trạng thái ban đầu</CodeStep> mà bạn đã cung cấp, trong khi với các lần gửi tiếp theo, nó sẽ là giá trị trả về từ lần cuối cùng hành động được gọi. Các đối số còn lại giống như khi `useActionState` chưa được sử dụng.

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

<Recipes titleText="Hiển thị thông tin sau khi gửi biểu mẫu" titleId="display-information-after-submitting-a-form">

#### Hiển thị lỗi biểu mẫu {/*display-form-errors*/}

Để hiển thị các thông báo như thông báo lỗi hoặc toast được trả về bởi một Server Function, hãy bọc hành động trong một lệnh gọi đến `useActionState`.

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction, isPending] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Thêm vào giỏ hàng</button>
      {isPending ? "Đang tải..." : message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Đã thêm vào giỏ hàng";
  } else {
    // Thêm một độ trễ giả để làm cho việc chờ đợi trở nên đáng chú ý.
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return "Không thể thêm vào giỏ hàng: mặt hàng đã được bán hết.";
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```
</Sandpack>

<Solution />

#### Hiển thị thông tin có cấu trúc sau khi gửi biểu mẫu {/*display-structured-information-after-submitting-a-form*/}

Giá trị trả về từ một Server Function có thể là bất kỳ giá trị tuần tự hóa nào. Ví dụ: nó có thể là một đối tượng bao gồm một boolean cho biết liệu hành động có thành công hay không, một thông báo lỗi hoặc thông tin được cập nhật.

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useActionState(addToCart, {});
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Thêm vào giỏ hàng</button>
      {formState?.success &&
        <div className="toast">
          Đã thêm vào giỏ hàng! Giỏ hàng của bạn hiện có {formState.cartSize} mặt hàng.
        </div>
      }
      {formState?.success === false &&
        <div className="error">
          Không thể thêm vào giỏ hàng: {formState.message}
        </div>
      }
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return {
      success: true,
      cartSize: 12,
    };
  } else {
    return {
      success: false,
      message: "Mặt hàng đã được bán hết.",
    };
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```
</Sandpack>

<Solution />

</Recipes>

## Khắc phục sự cố {/*troubleshooting*/}

### Hành động của tôi không còn có thể đọc dữ liệu biểu mẫu đã gửi {/*my-action-can-no-longer-read-the-submitted-form-data*/}

Khi bạn bọc một hành động bằng `useActionState`, nó sẽ nhận được một đối số bổ sung *làm đối số đầu tiên của nó*. Do đó, dữ liệu biểu mẫu đã gửi là đối số *thứ hai* của nó thay vì đối số đầu tiên như bình thường. Đối số đầu tiên mới được thêm vào là trạng thái hiện tại của biểu mẫu.

```js
function action(currentState, formData) {
  // ...
}
```
