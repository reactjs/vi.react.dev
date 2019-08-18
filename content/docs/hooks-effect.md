---
id: hooks-state
title: Sử dụng Effect Hook
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-state.html
---

*Hook* là một tính năng mới từ React 16.8. Nó cho phép sử dụng state và các tính năng khác của React mà không cần viết dạng class

*Effect Hook* cho phép thực hiện side effect bên trong các function component:

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Tương tự như componentDidMount và componentDidUpdate:
  useEffect(() => {
    // Cập nhập document title sử dụng browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

Đoạn snippet này dựa trên [ví dụ về counter ở trang trước](/docs/hooks-state.html), chúng ta có thêm tính năng mới: đặt giá trị document title tương ứng với số lần click.

Việc fetching data, thiết lập các subscription, và việc thay đổi DOM trong React component, những hành động như vậy được gọi là "side effect" (hoặc "effect). Bạn có thể đã sử dụng những "side effect" này trong những component của bạn trước đây.

>Mẹo nhỏ
>
>Nếu bạn quen với các phương thức lifecycle của React class, bạn có thể hình dung `useEffect` Hook như sự kết hợp của `componentDidMount`, `componentDidUpdate`, và `componentWillUnmount`.

Có 2 loại side effect phổ biến trong React component: loại không cần cleanup, và loại cần. Cùng phân biệt 2 loại này kỹ hơn.

## Effect không cần Cleanup {#effects-without-cleanup}

Đôi lúc, chúng ta muốn **chạy một vài đoạn code sau khi React đã cập nhập DOM.** Network request, tự ý thay đổi DOM, và logging là những ví dụ điển hình của effect không cần cleanup. Chúng ta gọi như vậy vì có thể chạy chúng và quên ngay lập tức. Hãy so sánh class và Hook cho phép thực hiện side effect như thế ra sao.

### Ví dụ sử dụng Classes {#example-using-classes}

Trong React class components, phương thức `render` không được phép tạo ra side effect. Nó sẽ là quá sớm -- chúng ta thường chỉ muốn chạy effect *sau khi* React đã cập nhập DOM.

Đó là lý do tại sao trong React class, chúng ta đặt side effect bên trong `componentDidMount` và `componentDidUpdate`. Quay lại ví dụ, đây là React counter class component sẽ cập nhập document title ngay sau khi React thay đổi DOM:

```js{9-15}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

Để ý cách **chúng ta đã lập lại 2 thao tác tương tự nhau bên trong 2 phương thức lifecycle**

Đó là bởi vì trong đa phần các trường hợp, chúng ta muốn thực hiện cùng một side effect khi component đã mount hoặc đã update. Một cách tổng quát, chúng ta muốn thực hiện sau mỗi lần render -- nhưng React class component không có phương thức như vậy. Chúng ta có thể tách nó ra thành một hàm riêng, nhưng vẫn phải gọi nó ở 2 nơi khác nhau.

Bây giờ chúng ta xem cách làm tương tự với `useEffect` Hook.

### Ví dụ sử dụng Hook {#example-using-hooks}

Chúng ta đã xem ví dụ ở trên, giờ xem kỹ hơn một lần nữa:

```js{1,6-8}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**`useEffect` đã làm gì?** Bằng cách sử dụng Hook này, chúng ta nói với React rằng component của chúng ta cần thực hiện một việc gì đó sau khi render. React sẽ ghi nhớ hàm bạn truyền vào (chúng tôi thích gọi nó là "effect"), và sau đó gọi lại hàm này sau khi DOM đã update. Trong effect này, chúng ta đổi document title, chúng ta cũng có thể  fetch data hoặc gọi một số API khác.

**Tại sao `useEffect` được gọi bên trong component?** Đặt `useEffect` bên trong component cho phép chúng ta truy xuất đến state `count` (hoặc bất kỳ prop nào) bên trong effect. Chúng ta không cần một API đặc biệt để đọc nó -- nó đã nằm trong scope của function. Hook tận dụng JavaScript closures và tránh cung cấp thêm các APIs mà bản thân JavaScript đã có sẵn giải pháp.

**`useEffect` chạy sau tất cả những lần render?** Đúng! Theo mặc định, nó chạy sau lần render đầu tiên *và* mỗi lần update. (Chúng ta sẽ nói về [làm cách nào để tùy biến lại](#tip-optimizing-performance-by-skipping-effects).) Thay vì nghĩ theo hướng "mounting" và "updating", bạn sẽ thấy dễ hiểu hơn nếu nghĩ theo kiểu "sau khi render". React đảm bảo DOM đã được update trước khi chạy effect.

### Giải thích cụ thể {#detailed-explanation}

Giờ chúng ta đã hiểu về effect, đoạn code này sẽ rất dễ hiểu:

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
}
```

Chúng ta khai báo state `count`, và sau đó nói với React chúng ta cần sử dụng. Chúng ta truyền cho `useEffect` Hook một hàm. Hàm truyền vào này *là* effect. Bên trong effect, chúng ta đặt document title sử dụng API `document.title`. Chúng ta có thể đọc giá trị sau cùng của `count` bên trong effect bởi vì nó nằm chung scope với function. Khi React render component, nó sẽ nhớ lại effect chúng ta đã gửi, và chạy effect sau khi cập nhập DOM. Nó xảy ra ở tất cả các lần render, kể cả lần đầu.

Lập trình viên JavaScript có kinh nghiệm sẽ để ý thấy function truyền vào cho `useEffect` sẽ khác nhau cho tất cả các lần render. Đây là điều cố ý. Thật ra, nó sẽ cho chúng ta đọc giá trị `count` bên trong effect mà không cần lo lắng về việc lấy state. Mỗi lần chúng ta re-render, chúng ta gọi một effect **khác**, thay thế cái trước đó. Bằng cách này, nó làm cho effect như một phần của việc render -- mỗi effect "thuộc vào" một render cụ thể. Chúng ta sẽ hiểu tại sao cách này lại hiệu quả [ở phần sau của bài này](#explanation-why-effects-run-on-each-update).

>Mẹo nhỏ
>
>Không giống `componentDidMount` hoặc `componentDidUpdate`, effect chạy với `useEffect` không block trình duyệt cập nhập màn hình. Các effect chủ yếu không cần xảy ra tuần tự. Trong vài tình huống không mấy phổ biến (ví dụ như đo layout), chúng ta có  [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) Hook với API tính năng tương tự như `useEffect`.

## Effect cần Cleanup {#effects-with-cleanup}

Ở trên, chúng ta đã bàn về những side effect không cần cleanup. Tuy nhiên, một vài effect cần có. Ví dụ, **chúng ta muốn thiết lập các subscription** cho vài data source bên ngoài. Tình huống đó, clean up là rất quan trọng để không xảy ra memory leak! Cùng so sánh cách làm giữa class và Hook

### Ví dụ sử dụng Class {#example-using-classes-1}

Trong React class, chúng ta thường cài đặt một subscription trong `componentDidMount`, và clean it up trong `componentWillUnmount`. Lấy ví dụ, chúng ta có `ChatAPI` module cho phép chúng ta subscribe vào tình trạng online của 1 danh sách friend. Cách chúng ta làm với class

```js{8-26}
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
```

Để ý `componentDidMount` và `componentWillUnmount`. Phương thức Lifecycle buộc chúng ta tách logic này ra thậm chí cả 2 đoạn code trên điều liên quan đến cùng một effect.

>Lưu ý
>
>Nếu để ý kỹ hơn, bạn sẽ thấy chúng ta còn cần thêm `componentDidUpdate` để thực sự chuẩn xác. Tạm thời cứ bỏ qua phần đó vì chúng ta sẽ đề cập lại [ở phần sau](#explanation-why-effects-run-on-each-update) of this page.

### Ví dụ sử dụng Hooks {#example-using-hooks-1}

Cùng xem cách chúng ta làm với Hook.

Bạn có thể sẽ nghĩ chúng ta cần 2 effect khác nhau để thực hiện cleanup. Code khởi tạo và xóa subscription luôn luôn đứng kề nhau, `useEffect` được thiết kế để dữ chúng cùng một chỗ. Nếu effect trả về function, React sẽ chạy  function đó, chúng ta đưa clean up vào bên trong function trả về:

```js{6-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Chỉ định clean up sau khi gọi effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

**Tại sao chúng ta trả về function bên trong effect?** Đây là một tùy chọn để chạy cơ chế cleanup cho effect. Nó cho phép chúng ta đưa tạo và xóa subscription trong cùng một effect.

**Khi nào React clean up một effect?** React thực hiện cleanup khi  component unmount. Tuy nhiên, như đã học trước đó, effect trên tất cả những lần render, không phải chỉ một. Đó là tại sao React *đồng thời* cleans up effect từ những lần render trước. Chúng ta sẽ thảo luận thêm [việc này giúp tránh bug](#explanation-why-effects-run-on-each-update) và [làm cách nào tùy biến đặc tính này để cái thiện performance ](#tip-optimizing-performance-by-skipping-effects) ở bên dưới.

>Ghi chú
>
>Chúng ta không cần trả về một function có tên trong effect. Chúng ta gọi nó là `cleanup` để chỉ rõ mục đích, bạn có thể dùng arrow function trong thực tế.

## Tổng hợp {#recap}

Chúng ta đã học `useEffect` cho phép chúng ta thực hiện nhiều kiểu side effect sau khi component được render. Một vài effect cần cleanup nó sẽ return một function:

```js
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

Một vài effect khác có thể không cần cleanup, thì không cần return gì cả.

```js
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```

Effect Hook được sử dụng trong cả 2 trường hợp.

-------------

**Nếu bạn đã nắm bắt được cách làm việc của Effect Hook, hoặc nếu bạn cảm thấy hơi ngợp, có thể nhảy xuống [phần Nguyên tắc sử dụng Hook](/docs/hooks-rules.html) bây giờ.**

-------------

## Mẹo nhỏ sử dụng Effect {#tips-for-using-effects}

Chúng ta sẽ cùng đi sâu một số khía cạnh của `useEffect` mà các lập trình viên React có kinh nghiệm sẽ thắc mắc. Không cần quá cưỡng ép bản thân, bạn có thể dừng ở đây, và quay lại để tìm hiểu Effect Hook bất cứ lúc nào.

### Mẹo nhỏ: Sử dụng nhiều Effect tách biệt{#tip-use-multiple-effects-to-separate-concerns}

Một trong những vấn đề đã liệt kê ở  [động lực](/docs/hooks-intro.html#complex-components-become-hard-to-understand) tạo ra Hooks là các phương thức lifecycle của class thường chứa những logic không liên quan với nhau, còn những logic đáng lý phải nằm gần nhau lại nằm ở các phương thức khác nhau. Đây là component kết hợp counter và friend status từ ví dụ ở trên

```js
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```

Để ý cái logic của `document.title` đang nằm ở `componentDidMount` và `componentDidUpdate`. Logic của subscription thì cũng nằm ở  `componentDidMount` và `componentWillUnmount`. Và `componentDidMount` chứa code cả hai.

Như vậy hook đã giải quyết vấn đề này như thế nào? Nếu như [bạn có thể sử dụng *State* Hook nhiều lần](/docs/hooks-state.html#tip-using-multiple-state-variables), bạn cũng có thể sử dụng nhiều effect. Nó cho phép tách những logic không liên quan ra thành những effect khác nhau:

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

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
  // ...
}
```

**Hook cho phép tách code dựa trên cái nó đang làm** chứ không đi theo phương thức lifecycle. React sẽ apply *từng* effect được sử dụng trong component, theo thứ tự đã khai báo.

### Giải thích: Tại sao Effect chạy trên mỗi update {#explanation-why-effects-run-on-each-update}

Nếu đã từng sử dụng class, bạn sẽ thắc mắc tại sao bước cleanup effect lại chạy trên mỗi lần re-render, mà không phải khi unmounting. Xét một ví dụ thực tế để thấy tại sao thiết kế này giúp chúng ta có những component ít bug hơn

[Ở phần trước](#example-using-classes-1), chúng ta có đề cập ví dụ `FriendStatus` để hiển thị trạng thái online của Friend. Class đọc `friend.id` từ `this.props`, subscribe sau khi component mount, và unsubscribe trong lúc unmounting:

```js
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

**Chuyện gì sẽ xảy ra nếu prop `friend` thay đổi** trong khi component đang hiển thị trên màn hình (chưa unmount)? Chắc chắn có bug với danh sách status. Chúng ta cũng có thể gây ra memory leak hoặc crash khi đang unmounting và gọi unsubscribe nếu có một Friend ID không đúng.

Trong class component, chúng ta cần thêm `componentDidUpdate` để xử lý tình huống này:

```js{8-19}
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // Unsubscribe friend.id trước đó
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // Subscribe friend.id mới
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

Quên handle `componentDidUpdate` là điều dễ dẫn tới có bug trong React.

Đây là phiên bản sử dụng Hook

```js
function FriendStatus(props) {
  // ...
  useEffect(() => {
    // ...
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

Không còn bị dính bug như ở trên

Sẽ không có một đoạn code nào đặc biệt để xử lý lúc update vì theo cách chạy *mặc định* của `useEffect` nó đã xóa effect trước khi apply effect mới. Để hình dung hóa, đây là các bước gọi subscribe và unsubscribe mà component đã chạy qua:

```js
// Mount với prop { friend: { id: 100 } }
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // Chạy effect đầu tiên

// Cập nhập prop { friend: { id: 200 } }
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Clean effect trước đó
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // Chạy effect tiếp theo

// Cập nhập với { friend: { id: 300 } }
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // Clean effect trước đó
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // Chạy effect tiếp theo

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // Clean effect lần cuối
```

Đặc tính này đảm bảo thống nhất và ngăn bug thường xuất hiện do không cập nhập login với class component

### Mẹo nhỏ: Tối ưu Performance bằng cách bỏ qua Effect {#tip-optimizing-performance-by-skipping-effects}

Trong một số trường hợp, clean và apply effect sau khi render có thể dẫn đến ảnh hưởng performance. Trong class component, chúng ta giải quyết bằng viết một hàm so sánh giữa `prevProps` hoặc `prevState` bên trong `componentDidUpdate`:

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

Đây là yêu cầu rất cần thiết, nên đã được có đưa sẵn trong `useEffect` Hook API. Bạn có thể bảo React *bỏ qua* việc apply effect nếu một số giá trị không thay đổi giữa các lần render. Để làm như vậy, truyền vào một array (không bắt buộc) vào `useEffect`:

```js{3}
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Chỉ re-run effect nếu giá trị count thay đổi
```

Trong ví dụ ở trên, chúng ta truyền vào `[count]` như một tham số thứ 2. Nó nghĩa là gì? Nếu `count` là `5`, rồi sau đó component re-render với `count` vẫn bằng `5`, React sẽ so sánh `[5]` từ lần render trước và `[5]` với lần render hiện tại. Vì tất cả giá trị trong mảng bằng nhau (`5 === 5`), React sẽ bỏ qua  effect. Đó là cách chúng ta tối ưu

Khi chúng ta render với `count` thành `6`, React sẽ so sánh các giá trị trong `[5]` từ lần render trước với các giá trị trong `[6]` lần render hiện tại. Ở lần này, React sẽ gọi lại effect vì `5 !== 6`. Nếu có nhiều giá trị bên trong array, React sẽl re-run effect nếu một trong các giá trị đó khác với lần trước.

Effect cũng làm việc tương tự với quá trình cleanup:

```js{10}
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Chỉ re-subscribe nếu props.friend.id bị thay đổi
```

Trong tương lai, tham số thứ 2 sẽ được tự động thêm vào trong lúc  build-transform.

>Lưu ý
>
>Nếu sử dụng cách tối ưu này, phải chắc chắn array chứa **tất cả giá trị bên trong của component scope (như prop và state) nếu thay đổi theo các lần render và effect có sử dụng**. Nếu không, nếu không nó sẽ tham chiếu tới giá trị trước đó. Đọc thêm [làm việc với function](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) và [làm gì khi array thay đổi thường xuyên](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often).
>
>Nếu muốn chạy 1 effect và clean nó 1 lần duy nhất (lúc mount và unmount), bạn có thể truyền vào array rỗng (`[]`). Đồng nghĩa với việc bạn báo với React, effect này không phụ thuộc *bất kỳ* giá trị nào của prop hoặc state, do đó không bao giờ cần re-run. Nó không phải là một trường hợp  được xử lý đặc biệt -- nó đúng với cách so sánh array hiện tại
>
>Nếu truyền vào array rỗng (`[]`), prop và state bên trong effect sẽ luôn mang giá trị khởi tạo. Trong khi truyền vào `[]` nó gần giống với `componentDidMount` và `componentWillUnmount`, nó thường là [giải pháp](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) [tốt hơn](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) để tránh re-run effect quá thường xuyên. Tuy nhiên, đừng quên React sẽ chỉ chạy `useEffect` sau khi trình duyệt paint.
>
>Chúng tôi khuyến khích sử dụng [`đưa tất cả dependency`](https://github.com/facebook/react/issues/14920), sử dụng  [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package để ràng buộc, và thông báo nếu khai báo dependency không hợp lệ.

## Bước tiếp theo {#next-steps}

Xin chúc mừng! Trang này không hề ngắn, nhưng bạn đã đọc được đến đây. Hy vọng các thắc mắc của bạn về effect đã được phúc đáp. Bạn đã học được State Hook và Effect Hook, và có *rất* nhiều thứ bạn có thể làm khi sử dụng kết hợp chúng.  Nó gần như giải quyết các vấn đề mà chỉ có class mới làm được -- còn nếu không bạn có thể tìm thấy [các Hook mở rộng](/docs/hooks-reference.html).

Chúng ta đã trình bày động lực tạo ra Hook [ở đây](/docs/hooks-intro.html#motivation). Chúng ta cũng thấy được cách  effect cleanup và tránh trùng lặp trong `componentDidUpdate` và `componentWillUnmount`, mang những đoạn code có liên quan lại gần nhau hơn, và giúp chúng ta tránh bug. Chúng ta cũng thấy được cách chúng ta tách effect theo mục đích, cái mà chúng ta không làm được với class.

Đến đây, bạn có thể thắc mắc Hook làm việc như thế nào. Làm cách nào `useState` lấy được đúng giá trị giữa các lần render khác nhau? Làm cách nào React "match" được effect trước và lần đang update? **Ở trang tiếp theo bạn sẽ học được [Quy luật của Hook](/docs/hooks-rules.html) -- mấu chốt làm việc của Hook.**


