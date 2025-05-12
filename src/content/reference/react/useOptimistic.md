---
title: useOptimistic
---

<Intro>

`useOptimistic` là một React Hook cho phép bạn cập nhật giao diện người dùng một cách lạc quan.

```js
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useOptimistic(state, updateFn)` {/*use*/}

`useOptimistic` là một React Hook cho phép bạn hiển thị một trạng thái khác trong khi một hành động không đồng bộ đang diễn ra. Nó chấp nhận một số trạng thái làm đối số và trả về một bản sao của trạng thái đó có thể khác trong suốt thời gian của một hành động không đồng bộ như một yêu cầu mạng. Bạn cung cấp một hàm lấy trạng thái hiện tại và đầu vào cho hành động, và trả về trạng thái lạc quan sẽ được sử dụng trong khi hành động đang chờ xử lý.

Trạng thái này được gọi là trạng thái "lạc quan" vì nó thường được sử dụng để ngay lập tức trình bày cho người dùng kết quả của việc thực hiện một hành động, mặc dù hành động đó thực sự mất thời gian để hoàn thành.

```js
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // hợp nhất và trả về trạng thái mới
      // với giá trị lạc quan
    }
  );
}
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `state`: giá trị sẽ được trả về ban đầu và bất cứ khi nào không có hành động nào đang chờ xử lý.
* `updateFn(currentState, optimisticValue)`: một hàm lấy trạng thái hiện tại và giá trị lạc quan được truyền cho `addOptimistic` và trả về trạng thái lạc quan kết quả. Nó phải là một hàm thuần túy. `updateFn` nhận hai tham số. `currentState` và `optimisticValue`. Giá trị trả về sẽ là giá trị được hợp nhất của `currentState` và `optimisticValue`.

#### Giá trị trả về {/*returns*/}

* `optimisticState`: Trạng thái lạc quan kết quả. Nó bằng `state` trừ khi một hành động đang chờ xử lý, trong trường hợp đó nó bằng giá trị được trả về bởi `updateFn`.
* `addOptimistic`: `addOptimistic` là hàm điều phối để gọi khi bạn có một bản cập nhật lạc quan. Nó nhận một đối số, `optimisticValue`, thuộc bất kỳ loại nào và sẽ gọi `updateFn` với `state` và `optimisticValue`.

---

## Cách sử dụng {/*usage*/}

### Cập nhật lạc quan với biểu mẫu {/*optimistically-updating-with-forms*/}

Hook `useOptimistic` cung cấp một cách để cập nhật giao diện người dùng một cách lạc quan trước khi một hoạt động nền, như một yêu cầu mạng, hoàn thành. Trong ngữ cảnh của biểu mẫu, kỹ thuật này giúp làm cho ứng dụng có cảm giác phản hồi nhanh hơn. Khi người dùng gửi biểu mẫu, thay vì chờ phản hồi của máy chủ để phản ánh các thay đổi, giao diện sẽ được cập nhật ngay lập tức với kết quả dự kiến.

Ví dụ: khi người dùng nhập một tin nhắn vào biểu mẫu và nhấn nút "Gửi", Hook `useOptimistic` cho phép tin nhắn xuất hiện ngay lập tức trong danh sách với nhãn "Đang gửi...", ngay cả trước khi tin nhắn thực sự được gửi đến máy chủ. Cách tiếp cận "lạc quan" này tạo ấn tượng về tốc độ và khả năng phản hồi. Sau đó, biểu mẫu cố gắng thực sự gửi tin nhắn trong nền. Khi máy chủ xác nhận rằng tin nhắn đã được nhận, nhãn "Đang gửi..." sẽ bị xóa.

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
