---
title: "'use server'"
titleForTitleTag: "Chỉ thị `'use server'`"
---

<RSC>

`'use server'` dùng để sử dụng với [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).

</RSC>

<Intro>

`'use server'` đánh dấu các hàm phía máy chủ có thể được gọi từ mã phía máy khách.

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `'use server'` {/*use-server*/}

Thêm `'use server'` vào đầu phần thân hàm async để đánh dấu hàm đó có thể được gọi bởi máy khách. Chúng ta gọi những hàm này là [_Server Functions_](/reference/rsc/server-functions).

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

Khi gọi một Server Function trên máy khách, nó sẽ tạo một yêu cầu mạng đến máy chủ bao gồm một bản sao được tuần tự hóa của bất kỳ đối số nào được truyền. Nếu Server Function trả về một giá trị, giá trị đó sẽ được tuần tự hóa và trả về cho máy khách.

Thay vì đánh dấu riêng lẻ các hàm bằng `'use server'`, bạn có thể thêm chỉ thị vào đầu tệp để đánh dấu tất cả các exports trong tệp đó là Server Functions có thể được sử dụng ở bất kỳ đâu, kể cả được nhập trong mã máy khách.

#### Lưu ý {/*caveats*/}
* `'use server'` phải ở ngay đầu hàm hoặc mô-đun của chúng; phía trên bất kỳ mã nào khác bao gồm cả imports (các comment phía trên các chỉ thị đều OK). Chúng phải được viết bằng dấu nháy đơn hoặc dấu nháy kép, không phải dấu backtick.
* `'use server'` chỉ có thể được sử dụng trong các tệp phía máy chủ. Các Server Functions kết quả có thể được truyền đến Client Components thông qua props. Xem các [kiểu được hỗ trợ để tuần tự hóa](#serializable-parameters-and-return-values).
* Để nhập một Server Functions từ [mã máy khách](/reference/rsc/use-client), chỉ thị phải được sử dụng ở cấp độ mô-đun.
* Vì các lệnh gọi mạng cơ bản luôn không đồng bộ, `'use server'` chỉ có thể được sử dụng trên các hàm async.
* Luôn coi các đối số cho Server Functions là đầu vào không đáng tin cậy và ủy quyền cho bất kỳ thay đổi nào. Xem [các cân nhắc về bảo mật](#security).
* Server Functions nên được gọi trong một [Transition](/reference/react/useTransition). Server Functions được truyền đến [`<form action>`](/reference/react-dom/components/form#props) hoặc [`formAction`](/reference/react-dom/components/input#props) sẽ tự động được gọi trong một transition.
* Server Functions được thiết kế cho các thay đổi cập nhật trạng thái phía máy chủ; chúng không được khuyến nghị để tìm nạp dữ liệu. Theo đó, các framework triển khai Server Functions thường xử lý một hành động tại một thời điểm và không có cách nào để lưu vào bộ nhớ cache giá trị trả về.

### Cân nhắc về bảo mật {/*security*/}

Các đối số cho Server Functions hoàn toàn do máy khách kiểm soát. Vì lý do bảo mật, hãy luôn coi chúng là đầu vào không đáng tin cậy và đảm bảo xác thực và thoát các đối số khi thích hợp.

Trong bất kỳ Server Function nào, hãy đảm bảo xác thực rằng người dùng đã đăng nhập được phép thực hiện hành động đó.

<Wip>

Để ngăn chặn việc gửi dữ liệu nhạy cảm từ một Server Function, có các API taint thử nghiệm để ngăn chặn các giá trị và đối tượng duy nhất được truyền đến mã máy khách.

Xem [experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) và [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference).

</Wip>

### Các đối số và giá trị trả về có thể tuần tự hóa {/*serializable-parameters-and-return-values*/}

Vì mã máy khách gọi Server Function qua mạng, bất kỳ đối số nào được truyền sẽ cần phải được tuần tự hóa.

Dưới đây là các kiểu được hỗ trợ cho các đối số của Server Function:

* Các kiểu nguyên thủy
  * [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
  * [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
  * [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
  * [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
  * [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
  * [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
  * [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), chỉ các symbol được đăng ký trong registry Symbol toàn cục thông qua [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Các iterable chứa các giá trị có thể tuần tự hóa
  * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
  * [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
  * [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
  * [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
  * [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) và [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* Các instance của [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
* Các [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) thuần túy: những object được tạo bằng [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), với các thuộc tính có thể tuần tự hóa
* Các function là Server Functions
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Đáng chú ý, những điều này không được hỗ trợ:
* Các phần tử React, hoặc [JSX](/learn/writing-markup-with-jsx)
* Các function, bao gồm các function component hoặc bất kỳ function nào khác không phải là Server Function
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Các object là instance của bất kỳ class nào (ngoài các built-in đã đề cập) hoặc các object có [prototype null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Các Symbol không được đăng ký trên toàn cục, ví dụ: `Symbol('my new symbol')`
* Các Event từ trình xử lý sự kiện


Các giá trị trả về có thể tuần tự hóa được hỗ trợ giống như [các prop có thể tuần tự hóa](/reference/rsc/use-client#passing-props-from-server-to-client-components) cho một Client Component boundary.


## Cách sử dụng {/*usage*/}

### Server Functions trong các form {/*server-functions-in-forms*/}

Trường hợp sử dụng phổ biến nhất của Server Functions sẽ là gọi các function làm thay đổi dữ liệu. Trên trình duyệt, [phần tử form HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) là phương pháp truyền thống để người dùng gửi một thay đổi. Với React Server Components, React giới thiệu hỗ trợ hạng nhất cho Server Functions dưới dạng Actions trong [các form](/reference/react-dom/components/form).

Đây là một form cho phép người dùng yêu cầu tên người dùng.

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Yêu cầu</button>
    </form>
  );
}
```

Trong ví dụ này, `requestUsername` là một Server Function được truyền cho một `<form>`. Khi người dùng gửi form này, có một yêu cầu mạng đến server function `requestUsername`. Khi gọi một Server Function trong một form, React sẽ cung cấp <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> của form làm đối số đầu tiên cho Server Function.

Bằng cách truyền một Server Function cho form `action`, React có thể [cải thiện dần](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) form. Điều này có nghĩa là các form có thể được gửi trước khi bundle JavaScript được tải.

#### Xử lý các giá trị trả về trong các form {/*handling-return-values*/}

Trong form yêu cầu tên người dùng, có thể có trường hợp tên người dùng không khả dụng. `requestUsername` sẽ cho chúng ta biết nếu nó thất bại hay không.

Để cập nhật UI dựa trên kết quả của một Server Function trong khi hỗ trợ cải thiện dần, hãy sử dụng [`useActionState`](/reference/react/useActionState).

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```

```js {4,8}, [[2, 2, "'use client'"]]
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Yêu cầu</button>
      </form>
      <p>Yêu cầu gửi gần nhất trả về: {state}</p>
    </>
  );
}
```

Lưu ý rằng giống như hầu hết các Hook, `useActionState` chỉ có thể được gọi trong <CodeStep step={1}>[mã máy khách](/reference/rsc/use-client)</CodeStep>.

### Gọi một Server Function bên ngoài `<form>` {/*calling-a-server-function-outside-of-form*/}

Server Functions được hiển thị các endpoint máy chủ và có thể được gọi ở bất kỳ đâu trong mã máy khách.

Khi sử dụng một Server Function bên ngoài một [form](/reference/react-dom/components/form), hãy gọi Server Function trong một [Transition](/reference/react/useTransition), cho phép bạn hiển thị chỉ báo tải, hiển thị [cập nhật trạng thái lạc quan](/reference/react/useOptimistic) và xử lý các lỗi không mong muốn. Các form sẽ tự động bọc Server Functions trong các transition.

```js {9-12}
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Tổng số lượt thích: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Thích</button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

Để đọc giá trị trả về của Server Function, bạn sẽ cần `await` promise được trả về.
