---
id: hooks-custom
title: Xây dựng Hook của riêng bạn
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

*Hooks* là một tính năng mới từ React 16.8. Nó cho phép sử dụng state và các tính năng khác của React mà không cần viết dưới dạng class.

Xây dựng Hook của riêng bạn cho phép bạn tách logic của component thành một hàm có thể sử dụng lại.

Khi chúng ta học về [cách sử dụng Effect Hook](/docs/hooks-effect.html#example-using-hooks-1), chúng ta có thể thấy rằng component này sử dụng trong một ứng dụng nhắn tin, dùng để thể hiển tin nhắn khi một liên hệ đang trực tuyến hoặc ngoại tuyến:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

Hãy cho là ứng dụng nhắn tin của chúng ta cũng có một danh sách bao gồm các liên hệ, và chúng ta muốn hiển thị tên của những người đang trực tuyến bằng màu xanh. Chúng ta có thể sao chép và dán những logic tương tự như trên vào component `FriendListItem`, nhưng đây không phải là một cách lí tưởng:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

Thay vào đó, chúng ta sẽ chia sẻ logic giữa `FriendStatus` và `FriendListItem`.

Thông thường ở React, chúng ta có hai cách thông dụng nhất để chia sẻ logic giữa các component: [render props](/docs/render-props.html) và [higher-order components](/docs/higher-order-components.html). Hãy xem cách mà Hook giải quyết những vấn đề chung mà không bắt buộc bạn phải viết thêm component vào ứng dụng.

## Tách logic thành một Hook {#extracting-a-custom-hook}

Khi chúng ta muốn chia sẻ logic giữa hai hàm JavaScript, chúng ta tách nó thành một hàm thứ ba. Có thể thấy component và hook đầu là những hàm, vậy nên điều nãy cũng áp dụng được!

**Hook là hàm JavaScript với tên được bắt đầu bằng "`use`" và nó có thể gọi tới những Hook khác.** Ví dụ như, `useFriendStatus` là một Hook:

```js{3}
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

Có thể thấy tất cả logic đều được sao chép từ các component trước đó. Cũng như trong component, hãy đảm bảo rằng việc sử dụng các Hook khác không nằm trong khối điều kiện nào và được dùng ở ngoài cùng của hook bạn tạo ra.

Không như React component, một Hook tùy chọn không cần thiết phải có những đặc tính cụ thể. Chúng ta có thể quyết định những gì sẽ là tham số, và cái gì sẽ được trả về. Theo một các nói khác, Hook chỉ như một hàm thông thường. Tên của một Hook luôn nên bắt đầu bằng `use` và bạn có thể khẳng định ngay [quy tắc của Hooks](/docs/hooks-rules.html) đã được áp dụng.

Chức năng chính của `useFriendStatus` Hook là theo dõi trạng thái của các liên hệ trong danh sách. Đây là lí do Hook nhận `friendID` là tham số, và trả về trạng thái của liên hệ khi có sự thay đổi

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

Hãy xem các cách chúng ta có thể sử dụng một Hook.

## Cách sử dụng một Hook {#using-a-custom-hook}

Ngay từ đầu, mục đích chính của một Hook là loại bỏ những logic bị lặp lại khỏi `FriendStatus` và `FriendListItem` component. Cả hai component đều được dùng để hiện thị trạng thái của các liên hệ là trực tuyến hay ngoại tuyến.

Bây giờ chúng ta có thể tách logic này thành `useFriendStatus` hook, sau đó *chỉ cần sử dụng:*

```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

**Đoạn mã này có tương đương với ví dụ gốc?** Có, nó hoạt động theo một cách hoàn toàn giống. Nếu bạn xem kĩ, bạn sẽ nhận ra chúng tôi không hề tạo ra bất kì sự thay đổi nào đối với cách hoạt động. Tất cả những gì chúng tôi làm chỉ là tách những đoạn mã chung giữa hai hàm thành 1 hàm tách biệt. **Các Hook là một quy ước mà chúng tuân theo thiết kế của Hook một cách tự nhiên, chứ không phải là một tính năng của React.**

**Tôi có bắt buộc phải đặt tên Hook của mình bắt đầu bởi `use`?** Bạn nên làm vậy. Quy ước này rất quan trọng. Nếu không có quy ước này, chúng ta sẽ không thể tự động tìm các sự vi phạm đối với [quy tắc của Hooks](/docs/hooks-rules.html) bởi vì chúng tôi không thể biết liệu một hàm nào đó có chứa các lệnh gọi tới Hook bên trong nó hay không.

**Hai component cùng sử dụng một Hook có chia sẻ state với nhau không?** Không. Các Hook là những cơ chế để sử dụng lại *logic có trạng thái* (ví dụ như cài đặt một sự theo dõi và ghi nhớ giá trị), nhưng mỗi lần bạn sử dụng một Hook, tất cả state và effect bên trong sẽ hoàn toàn được cô lập.

Mỗi khi một Hook được *gọi* thì Hook sẽ nhận được state đã được cô lập. Bởi vì chúng ta gọi đến `useFriendStatus` một cách trực tiếp, từ góc nhìn của React, component của chúng ta chỉ gọi đến `useState` và `useEffect`. Và như chúng ta [đã học](/docs/hooks-state.html#tip-using-multiple-state-variables) [trước đó](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns), chúng ta có thể gọi đến `useState` và `useEffect` nhiều lần trong một component, và chúng hoàn toàn độc lập với nhau.

### Lời khuyên: Chuyển giao thông tin giữa các Hook {#tip-pass-information-between-hooks}

Việc Hook là hàm, chúng ta có thể chuyển giao các giá trị giữa chúng.

Để minh họa điều này, chúng ta sẽ dùng các component khác từ một ứng dụng nhắn tin giả định. Đây là một giao diện chọn người nhận tin nhắn dùng để hiện thị liên hệ đã chọn đang trực tuyến hay ngoại tuyến:

```js{8-9,13}
const friendList = [
  { id: 1, name: 'Phoebe' },
  { id: 2, name: 'Rachel' },
  { id: 3, name: 'Ross' },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red'} />
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```

Chúng ta giữ ID của liên hệ hiện đang chọn vào `recipientID`, và cập nhật chúng nếu người dùng chọn một người khác trong giao diện chọn người nhận tin nhắn `<select>`.

Bởi vì `useState` Hook được gọi và cho chúng ta giá trị mới nhất của `recipientID`, chúng ta có thể gửi giá trị đó vào `useFriendStatus` Hook dưới dạng một tham số:

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

Điều này cho chúng ta biết nếu *liên hệ đã được chọn* là trực tuyến hay ngoại tuyến. Nếu chúng ta chọn 1 liên hệ khác và cập nhật giá trị `recipientID`, `useFriendStatus` Hook sẽ ngưng theo dõi trạng thái của liên hệ đã được chọn trước đó, và theo dõi trạng thái của liên hệ vừa mới được chọn.

## `useYourImagination()` {#useyourimagination}

Hook cung cấp sự linh hoạt trong việc chia sẻ logic mà trước đó đây là điều không thể trong React component. Bạn có thể tạo ra một Hook giải quyết một lượng lớn các trường hợp như xử lí các giá trị trong biểu mẫu, hoạt cảnh, các dạng theo dõi giá trị, bộ đếm giờ, và rất nhiều trường hợp khác mà chúng ta chưa đề cập tới. Hơn nữa, chúng ta có thể xây dựng Hook mới dễ dàng như việc sử dụng một tính năng đã có sẵn từ React.

Cố gắng không thêm các nội dung mang tính trừu tượng quá sớm. Bây giờ function component có thể làm được nhiều thứ hơn, có vẻ như những hàm bình thường trong codebase sẽ trở nên dài hơn. Điều này hoàn toàn bình thường -- đừng cảm thấy bản thân *cần phải* tách logic thành các Hook ngay lúc này. Nhưng chúng tôi khuyến khích bạn nên bắt đầu xem xét những trường hợp mà Hook sẽ giúp ẩn bớt những logic phức tạp, hoặc giúp gỡ rối những component quá phức tạp.

Ví dụ như, có thể bạn có một component phức tạp bao gồm rất nhiều state nội bộ được tạo ra chỉ cho những trường hợp cụ thể cần giải quyết. `useState` không thể giúp tập trung hóa việc cập nhật logic dễ dàng hơn, vậy bạn có thể sẽ ưu tiện viết dưới dạng [Redux](https://redux.js.org/) reducer:

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ... other actions ...
    default:
      return state;
  }
}
```

Các reducer rất tiện dụng cho việc kiểm thử độc lập, và có thể mở rộng hoặc thu hẹp quy mô tùy ý để thực hiện các cập nhật logic phức tạp. Bạn cũng có thể tách chúng thành những reducer nhỏ hơn nếu cần. Tuy nhiên, có thể bạn cũng sẽ thích những tiện ích mà state nội bộ của React mang lại, hoặc cũng có thể không muốn cài đặt thêm thư viện ngoài.

Vậy nếu chúng ta có thể viết một `useReducer` Hook giúp chúng ta quản lý *state nội bộ* của các component bằng reducer? Một phiên bản đơn giản của nó sẽ như sau:


```js
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

Bây giờ chúng ta có thể sử dụng chúng trong các component, và để cho các reducer quản lí state của chúng:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

Sự cần thiết của việc quản lí state nội bộ bằng reducer trong một component phức tạp là điều hiển nhiên nên chúng tôi đã tạo ra `useReducer` Hook và đưa vào React. Bạn có thể tìm thấy chúng cùng với những Hook khác ở [Hooks API reference](/docs/hooks-reference.html).
