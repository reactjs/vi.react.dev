---
id: hooks-overview
title: Cái nhìn đầu tiên về Hooks
permalink: docs/hooks-overview.html
next: hooks-state.html
prev: hooks-intro.html
---

*Hooks* mới được thêm ở phiên bản React 16.8. Cho phép bạn sử dụng state và các chức năng khác của React mà không cần tạo class.

Hooks [tương thích với các phiên bản trước](/docs/hooks-intro.html#no-breaking-changes). Trang này cung cấp thông tin tổng quan về Hooks cho người dùng React có kinh nghiệm. Trang này giới thiệu nhanh. Nếu bạn thấy bối rối, hãy tìm phần đóng khung vàng như này:

>Diễn giải chi tiết
>
>Đọc phần [nguồn cảm hứng](/docs/hooks-intro.html#motivation) để biết tại sao chúng tôi giới thiệu Hooks tới React.

**↑↑↑ Mỗi phần sẽ kết thúc với một phần đóng khung vàng như này.** Chúng dẫn đến trang diễn giải chi tiết.

## 📌 State Hook {#state-hook}

Ví dụ này làm một bộ đếm. Khi bạn bấm vào nút, giá trị sẽ tăng 1:

```js{1,4,5}
import React, { useState } from 'react';

function Example() {
  // Khai báo 1 biến số đếm, gọi là "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Bạn đã bấm {count} lần</p>
      <button onClick={() => setCount(count + 1)}>
        Bấm vào tôi
      </button>
    </div>
  );
}
```

Tại đây, `useState` là một *Hook* (chúng tôi sẽ nói về ý nghĩa của nó lát nữa). Chúng tôi gọi nó trong một function component để thêm local state cho nó. React sẽ giữ trạng thái này giữa các lần render lại. `useState` trả về một cặp: giá trị state *hiện tại* và một hàm cho phép bạn cập nhật trạng thái đó. Bạn có thể gọi hàm này từ một event handler hoặc nơi nào đó khác. Nó tương tự như `this.setState` trong một class, ngoại trừ việc nó không gộp trạng thái cũ với trạng thái mới. (Chúng tôi sẽ đưa ra một ví dụ so sánh `useState` với `this.state` trong [Sử dụng State Hook](/docs/hooks-state.html).)

Đối số duy nhất của `useState` là trạng thái khởi tạo. Trong ví dụ trên, nó là `0` bởi vì bộ đếm của chúng ta bắt đầu từ số không. Chú ý rằng không giống `this.state`, trạng thái ở đây không cần phải là 1 đối tượng -- mặc dù nó có thể nếu bạn muốn. Đối số trạng thái khởi tạo chỉ sử dụng trong lần render đầu tiên.

#### Khai báo nhiều biến trạng thái {#declaring-multiple-state-variables}

Bạn có thể sử dụng State Hook nhiều hơn một lần trên một component:

```js
function ExampleWithManyStates() {
  // Khai báo nhiều biến trạng thái!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('chuối');
  const [todos, setTodos] = useState([{ text: 'Học Hooks' }]);
  // ...
}
```

Cú pháp [array destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring) cho phép chúng ta dùng các tên khác nhau cho các biến trạng thái khi khai báo gọi hàm `useState`. Các tên đó không thuộc về `useState` API. Thay vì thế, React giả sử nếu bạn gọi `useState` nhiều lần, bạn làm thế trên cùng thứ tự mọi lần render. Chúng tôi sẽ giải thích tại sao cái này hoạt động và khi nào nó hữu ích sau.

#### Nhưng Hook là gì? {#but-what-is-a-hook}

Hooks là các hàm mà cho phép bạn "hook into (móc vào)" trạng thái của React và các tính năng vòng đời  từ các hàm components. Hooks không hoạt động bên trong classes -- chúng cho phép bạn sử dụng React không cần classes. (Chúng tôi [không khuyến khích](/docs/hooks-intro.html#gradual-adoption-strategy) viết lại các components hiện tại của bạn qua đêm nhưng bạn có thể sử dụng Hooks trong những cái mới nếu bạn thích.)

React cung cấp một vài Hooks sẵn có như `useState`. Bạn cũng có thể tạo Hooks của bạn để sử dụng lại những hành vi có trạng thái giữa các components khác nhau. Chúng tôi sẽ xem các Hooks có sẵn trước.

>Diễn giải chi tiết
>
>Bạn có thể học thêm về State Hook tại: [Sử dụng State Hook](/docs/hooks-state.html).

## ⚡️ Effect Hook {#effect-hook}

Bạn thực hiện lấy dữ liệu, đăng ký, hoặc thay đổi DOM thủ công từ React components trước đây. Chúng tôi gọi các hoạt động đó là "side effects" (hoặc "effects" cho ngắn) bởi vì chúng có thể ảnh hưởng các components khác và không để xong trong qua trình render.

Effect Hook, `useEffect`, thêm khả năng để thực hiện side effects từ các components dạng hàm. Nó phục vụ cùng mục đích như `componentDidMount`, `componentDidUpdate`, và `componentWillUnmount` trong React classes, nhưng thống nhất lại trong một API duy nhất. (Chúng tôi sẽ đưa ra ví dụ so sánh `useEffect` cùng các phương thức trong [Sử dụng Effect Hook](/docs/hooks-effect.html).)

Ví dụ, các components này cài đặt tiêu đề của trang web sau khi React cập nhật DOM:

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Giống componentDidMount và componentDidUpdate:
  useEffect(() => {
    // Cập nhật tiêu đề trang web sử dụng API trình duyệt
    document.title = `Bạn đã bấm ${count} lần`;
  });

  return (
    <div>
      <p>Bạn đã bấm {count} lần</p>
      <button onClick={() => setCount(count + 1)}>
        Bấm vào tôi
      </button>
    </div>
  );
}
```

Khi bạn gọi `useEffect`, bạn đã nói với React chạy hàm "effect" của bạn sau khi đẩy những thay đổi tới DOM. Effects được khai báo bên trong component vây chúng có truy cập đến props và state. Mặc định, React chạy các effects sau mỗi render -- *bao gồm* lần render đầu tiên. (Chúng tôi sẽ nói thêm về cách chúng so sánh với vòng đời trong class trong [Sử dụng Effect Hook](/docs/hooks-effect.html).)

Effects có thể tuỳ chọn xác định cách "dọn dẹp" bằng cách trả về một hàm. Ví dụ, component này sử dụng một effect để đăng ký theo dõi trạng thái online của bạn bè, và dọn dẹp bằng cách huỷ theo dõi:

```js{10-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Đang tải...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

Trong ví dụ này, React huỷ đăng ký `ChatAPI` khi component unmount, cũng như trước việc chạy lại effect vì subsequent render. (Nếu bạn muốn, có một cách để [React bỏ qua việc đăng ký lại](/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects) nếu `props.friend.id` chúng ta truyền vào `ChatAPI` đã không thay đổi.)

Giống như `useState`, bạn có thể sử dụng nhiều hơn một effect trong một component:

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `Bạn đã bấm ${count} lần`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  // ...
```

Hooks cho phép bạn tổ chức side effects trong một component bằng những phần được liên quan (chẳng hạn như thêm hoặc xoá đăng ký), hơn là ép chia theo các hàm vòng đời.

>Diễn giải chi tiết
>
>Bạn có thể học thêm về `useEffect` trên trang: [Sử dụng Effect Hook](/docs/hooks-effect.html).

## ✌️ Quy tắc của Hooks {#rules-of-hooks}

Hooks là các hàm Javascript, nhưng nó bắt buộc thêm hai quy tắc:

* Chỉ gọi Hooks **trên cùng**. Không gọi Hooks bên trong vòng lặp, điều kiện, hoặc các hàm lồng nhau.
* Chỉ gọi Hooks **từ các React components dạng hàm**. Không gọi Hooks từ hàm JavaScript bình thường. (Chỉ có một chỗ khác đúng để gọi Hooks -- Hooks tuỳ chọn của bạn. Chúng ta sẽ học vào chúng sau.)

Chúng tôi cung cấp [linter plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) để ép những quy tắc trên tự động. Chúng tôi hiểu là những quy tắc trên dường như có giới hạn và bối rối lần đầu, nhưng nó là những điều bản chất để Hooks làm việc tốt.

>Diễn giải chi tiết
>
>Bạn có thể học thêm về các quy tắc ở trang: [Quy tắc của Hooks](/docs/hooks-rules.html).

## 💡 Xây dựng Hooks của bạn {#building-your-own-hooks}

Thỉnh thoảng, chúng ta muốn sử dụng lại vài logic có trạng thái giữa các components.
Sometimes, we want to reuse some stateful logic between components. Theo truyền thống, có hai cách phổ biến cho vấn đề này: [higher-order components](/docs/higher-order-components.html) và [render props](/docs/render-props.html). Tuỳ chọn Hooks cho phép bạn làm việc nàu, mà không cần phải add thêm components vào cây components của bạn.

Phần trước của trang này, chúng tôi giới thiệu `FriendStatus` component cái mà gọi `useState` và `useEffect` Hooks để đăng ký vào trạng thái online của bạn bè. Chúng ta muốn sử dụng logic đăng ký nàu trong một component khác.

Đầu tiên chúng ta sẽ tách logic thành một Hook tuỳ chọn gọi là `useFriendStatus`:

```js{3}
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

Nó lấy `friendID` như một đối số, và trả về khi nào bạn bè của chúng ta online.

Bây giờ chúng ta có thể sử dụng nó trong các components:


```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Đang tải...';
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

Trạng thái (state) của các components hoàn toàn độc lập. Hooks là một cách để sử dụng lại *logic có trạng thái*, không chỉ bản thân state. Thực tế, mỗi lần *gọi* vào một Hook có hoàn toàn một trạng thái độc lập -- vì thế bạn có thể sử dụng cùng một Hook hai lần trong một component.

Tuỳ chọn Hooks nhiều về quy ước(convention) hơn là một tính năng. Nếu một tên hàm bắt đầu với "`use`" và nó gọi các Hooks khác, chúng tôi gọi đó là một Hook tuỳ chọn. `useSomething` quy ước đặt tên là cách linter plugin của chúng tôi có khả năng để tìm bugs trong code sử dụng Hooks.

Bạn có thể viết Hooks tuỳ chọn mà xử lý được rộng các trường hợp như xử lý form, animation, khai báo đăng ký, timers, và cũng có thể nhiều hơn những cái chúng tôi cân nhắc. Chúng tôi hào hứng để xem những Hook tuỳ chọn của cộng đồng React.

>Diễn giải chi tiết
>
>Bạn có thể học thêm về Hooks tại trang: [Xây dựng Hooks tuỳ chọn của bạn](/docs/hooks-custom.html).

## 🔌 Các Hooks khác {#other-hooks}

Có một số ít phổ biết Hooks có sẵn được sử dụng mà bạn có thể thấy hữu ích. Ví dụ, [`useContext`](/docs/hooks-reference.html#usecontext) cho phép bạn đăng ký vào React context mà không cần lồng thêm vào nhau (introducing nesting):

```js{2,3}
function Example() {
  const locale = useContext(LocaleContext);
  const theme = useContext(ThemeContext);
  // ...
}
```

Và [`useReducer`](/docs/hooks-reference.html#usereducer) cho phép bạn quản lý trạng trái của một components phức tạp với một reducer:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer);
  // ...
```

>Diễn giải chi tiết
>
>Bạn có thể học về tất cả các Hooks có sẵn tại trang: [Tham chiếu Hooks API](/docs/hooks-reference.html).

## Bước tiếp theo {#next-steps}

Phew, thật là nhanh! Nếu điều gì đó không quá gợi hình dễ hiểu hoặc bạn muốn học chi tiết hơn, bạn hãy đọc trang tiếp theo, bắt đầu với tài liệu [State Hook](/docs/hooks-state.html).

Bạn cũng có thể xem [tham chiếu Hooks API](/docs/hooks-reference.html) và [Hooks FAQ](/docs/hooks-faq.html).

Cuối cùng, đừng bỏ qua [trang giới thiệu](/docs/hooks-intro.html) để giải thích *tại sao* chúng tôi thêm Hooks và cách chugns tôi bắt đầu sử dụng chúng bên cạnh classes -- mà không cần viết lại apps của bạn.
