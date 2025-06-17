---
title: 'Bạn có thể không cần Effect'
---

<Intro>

Effect là một lối thoát khỏi tư duy React. Chúng cho phép bạn "bước ra ngoài" React và đồng bộ hóa các component của bạn với một hệ thống bên ngoài như widget không phải React, mạng, hoặc DOM trình duyệt. Nếu không có hệ thống bên ngoài nào liên quan (ví dụ, nếu bạn muốn cập nhật state của component khi một số props hoặc state thay đổi), bạn không nên cần Effect. Loại bỏ những Effect không cần thiết sẽ làm cho code của bạn dễ theo dõi hơn, chạy nhanh hơn, và ít lỗi hơn.

</Intro>

<YouWillLearn>

* Tại sao và cách loại bỏ những Effect không cần thiết khỏi các component của bạn
* Cách cache những phép tính đắt đỏ mà không cần Effect
* Cách reset và điều chỉnh state component mà không cần Effect
* Cách chia sẻ logic giữa các event handler
* Logic nào nên được chuyển vào event handler
* Cách thông báo cho component cha về những thay đổi

</YouWillLearn>

## Cách loại bỏ những Effect không cần thiết {/*how-to-remove-unnecessary-effects*/}

Có hai trường hợp phổ biến mà bạn không cần Effect:

* **Bạn không cần Effect để biến đổi dữ liệu cho việc render.** Ví dụ, giả sử bạn muốn lọc một danh sách trước khi hiển thị nó. Bạn có thể cảm thấy muốn viết một Effect để cập nhật một biến state khi danh sách thay đổi. Tuy nhiên, điều này không hiệu quả. Khi bạn cập nhật state, React sẽ trước tiên gọi các function component của bạn để tính toán những gì nên hiển thị trên màn hình. Sau đó React sẽ ["commit"](/learn/render-and-commit) những thay đổi này vào DOM, cập nhật màn hình. Sau đó React sẽ chạy các Effect của bạn. Nếu Effect của bạn *cũng* ngay lập tức cập nhật state, điều này khởi động lại toàn bộ quá trình từ đầu! Để tránh những lần render không cần thiết, hãy biến đổi tất cả dữ liệu ở cấp cao nhất của các component của bạn. Code đó sẽ tự động chạy lại bất cứ khi nào props hoặc state của bạn thay đổi.
* **Bạn không cần Effect để xử lý sự kiện người dùng.** Ví dụ, giả sử bạn muốn gửi một POST request `/api/buy` và hiển thị một thông báo khi người dùng mua một sản phẩm. Trong event handler click của nút Buy, bạn biết chính xác điều gì đã xảy ra. Vào thời điểm một Effect chạy, bạn không biết *gì* mà người dùng đã làm (ví dụ, nút nào đã được click). Đây là lý do tại sao bạn thường sẽ xử lý sự kiện người dùng trong các event handler tương ứng.

Bạn *có* cần Effect để [đồng bộ hóa](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) với các hệ thống bên ngoài. Ví dụ, bạn có thể viết một Effect giữ cho widget jQuery đồng bộ với state React. Bạn cũng có thể fetch dữ liệu với Effect: ví dụ, bạn có thể đồng bộ hóa kết quả tìm kiếm với truy vấn tìm kiếm hiện tại. Hãy nhớ rằng các [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) hiện đại cung cấp các cơ chế fetch dữ liệu tích hợp hiệu quả hơn so với việc viết Effect trực tiếp trong các component của bạn.

Để giúp bạn có được trực giác đúng, hãy xem một số ví dụ cụ thể phổ biến!

### Cập nhật state dựa trên props hoặc state {/*updating-state-based-on-props-or-state*/}

Giả sử bạn có một component với hai biến state: `firstName` và `lastName`. Bạn muốn tính toán một `fullName` từ chúng bằng cách nối chúng lại. Hơn nữa, bạn muốn `fullName` cập nhật bất cứ khi nào `firstName` hoặc `lastName` thay đổi. Bản năng đầu tiên của bạn có thể là thêm một biến state `fullName` và cập nhật nó trong một Effect:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Điều này phức tạp hơn mức cần thiết. Nó cũng không hiệu quả: nó thực hiện một lần render pass hoàn chỉnh với giá trị cũ cho `fullName`, sau đó ngay lập tức render lại với giá trị đã cập nhật. Hãy loại bỏ biến state và Effect:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**Khi một cái gì đó có thể được tính toán từ props hoặc state hiện có, [đừng đặt nó vào state.](/learn/choosing-the-state-structure#avoid-redundant-state) Thay vào đó, hãy tính toán nó trong quá trình render.** Điều này làm cho code của bạn nhanh hơn (bạn tránh được các cập nhật "liên tục" bổ sung), đơn giản hơn (bạn loại bỏ một số code), và ít lỗi hơn (bạn tránh được những bug gây ra bởi các biến state khác nhau không đồng bộ với nhau). Nếu cách tiếp cận này cảm thấy mới lạ với bạn, [Thinking in React](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state) giải thích những gì nên đưa vào state.

### Cache những phép tính đắt đỏ {/*caching-expensive-calculations*/}

Component này tính toán `visibleTodos` bằng cách lấy `todos` mà nó nhận từ props và lọc chúng theo `filter` prop. Bạn có thể cảm thấy muốn lưu trữ kết quả trong state và cập nhật nó từ một Effect:

```js {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

Giống như trong ví dụ trước đó, điều này vừa không cần thiết vừa không hiệu quả. Trước tiên, hãy loại bỏ state và Effect:

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ This is fine if getFilteredTodos() is not slow.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

Thường thì code này ổn! Nhưng có thể `getFilteredTodos()` chậm hoặc bạn có rất nhiều `todos`. Trong trường hợp đó bạn không muốn tính toán lại `getFilteredTodos()` nếu một biến state không liên quan như `newTodo` đã thay đổi.

Bạn có thể cache (hoặc ["memoize"](https://en.wikipedia.org/wiki/Memoization)) một phép tính đắt đỏ bằng cách bọc nó trong một [`useMemo`](/reference/react/useMemo) Hook:

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ Does not re-run unless todos or filter change
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

Or, written as a single line:

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Does not re-run getFilteredTodos() unless todos or filter change
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**Điều này nói với React rằng bạn không muốn function bên trong chạy lại trừ khi `todos` hoặc `filter` đã thay đổi.** React sẽ nhớ giá trị trả về của `getFilteredTodos()` trong lần render đầu tiên. Trong những lần render tiếp theo, nó sẽ kiểm tra xem `todos` hoặc `filter` có khác không. Nếu chúng giống như lần trước, `useMemo` sẽ trả về kết quả cuối cùng mà nó đã lưu trữ. Nhưng nếu chúng khác, React sẽ gọi function bên trong một lần nữa (và lưu trữ kết quả của nó).

Function mà bạn bọc trong [`useMemo`](/reference/react/useMemo) chạy trong quá trình render, vì vậy điều này chỉ hoạt động cho [các phép tính thuần túy.](/learn/keeping-components-pure)

<DeepDive>

#### Làm sao để biết một phép tính có đắt đỏ không? {/*how-to-tell-if-a-calculation-is-expensive*/}

Nói chung, trừ khi bạn đang tạo hoặc lặp qua hàng nghìn đối tượng, nó có thể không đắt đỏ. Nếu bạn muốn có thêm sự tự tin, bạn có thể thêm một console log để đo thời gian dành cho một đoạn code:

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

Thực hiện tương tác mà bạn đang đo (ví dụ, gõ vào input). Sau đó bạn sẽ thấy các log như `filter array: 0.15ms` trong console của bạn. Nếu tổng thời gian log cộng lại đạt đến một số lượng đáng kể (chẳng hạn, `1ms` hoặc hơn), có thể có ý nghĩa để memoize phép tính đó. Như một thử nghiệm, sau đó bạn có thể bọc phép tính trong `useMemo` để xác minh xem tổng thời gian log có giảm cho tương tác đó hay không:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // Bỏ qua nếu todos và filter không thay đổi
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo` sẽ không làm cho lần render *đầu tiên* nhanh hơn. Nó chỉ giúp bạn bỏ qua công việc không cần thiết trong các lần cập nhật.

Hãy nhớ rằng máy của bạn có thể nhanh hơn máy của người dùng vì vậy nên test hiệu suất với việc làm chậm nhân tạo. Ví dụ, Chrome cung cấp một tùy chọn [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) cho việc này.

Cũng lưu ý rằng đo hiệu suất trong quá trình phát triển sẽ không cho bạn kết quả chính xác nhất. (Ví dụ, khi [Strict Mode](/reference/react/StrictMode) được bật, bạn sẽ thấy mỗi component render hai lần thay vì một lần.) Để có được thời gian chính xác nhất, hãy build ứng dụng của bạn cho production và test nó trên một thiết bị giống như người dùng của bạn có.

</DeepDive>

### Reset tất cả state khi một prop thay đổi {/*resetting-all-state-when-a-prop-changes*/}

Component `ProfilePage` này nhận một `userId` prop. Trang chứa một input comment, và bạn sử dụng một biến state `comment` để giữ giá trị của nó. Một ngày, bạn nhận thấy một vấn đề: khi bạn điều hướng từ một profile này sang profile khác, state `comment` không được reset. Kết quả là, dễ dàng vô tình đăng một comment trên profile của người dùng sai. Để khắc phục sự cố, bạn muốn xóa biến state `comment` bất cứ khi nào `userId` thay đổi:

```js {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Avoid: Resetting state on prop change in an Effect
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

Điều này không hiệu quả vì `ProfilePage` và các children của nó sẽ trước tiên render với giá trị cũ, và sau đó render lại. Nó cũng phức tạp vì bạn sẽ cần phải làm điều này trong *mọi* component có một số state bên trong `ProfilePage`. Ví dụ, nếu UI comment được lồng nhau, bạn cũng sẽ muốn xóa state comment lồng nhau.

Thay vào đó, bạn có thể nói với React rằng profile của mỗi người dùng về mặt khái niệm là một profile *khác nhau* bằng cách cho nó một key rõ ràng. Chia component của bạn thành hai và truyền một thuộc tính `key` từ component bên ngoài vào component bên trong:

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ This and any other state below will reset on key change automatically
  const [comment, setComment] = useState('');
  // ...
}
```

Thông thường, React bảo toàn state khi cùng một component được render ở cùng vị trí. **Bằng cách truyền `userId` như một `key` cho component `Profile`, bạn đang yêu cầu React coi hai component `Profile` với `userId` khác nhau như hai component khác nhau không nên chia sẻ bất kỳ state nào.** Bất cứ khi nào key (mà bạn đã đặt thành `userId`) thay đổi, React sẽ tạo lại DOM và [reset state](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) của component `Profile` và tất cả các children của nó. Bây giờ trường `comment` sẽ tự động xóa khi điều hướng giữa các profile.

Lưu ý rằng trong ví dụ này, chỉ component `ProfilePage` bên ngoài được export và hiển thị với các file khác trong dự án. Các component render `ProfilePage` không cần truyền key cho nó: chúng truyền `userId` như một prop thông thường. Việc `ProfilePage` truyền nó như một `key` cho component `Profile` bên trong là một chi tiết triển khai.

### Điều chỉnh một số state khi một prop thay đổi {/*adjusting-some-state-when-a-prop-changes*/}

Đôi khi, bạn có thể muốn reset hoặc điều chỉnh một phần của state khi prop thay đổi, nhưng không phải tất cả.

Component `List` này nhận một list `items` như một prop, và duy trì item được chọn trong biến state `selection`. Bạn muốn reset `selection` thành `null` bất cứ khi nào `items` prop nhận một array khác:

```js {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Avoid: Adjusting state on prop change in an Effect
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

Điều này cũng không lý tưởng. Mỗi khi `items` thay đổi, `List` và các component con của nó sẽ render trước với giá trị `selection` cũ. Sau đó React sẽ cập nhật DOM và chạy các Effect. Cuối cùng, lời gọi `setSelection(null)` sẽ gây ra một lần re-render khác của `List` và các component con của nó, khởi động lại toàn bộ quá trình này một lần nữa.

Bắt đầu bằng cách xóa Effect. Thay vào đó, điều chỉnh state trực tiếp trong quá trình render:

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Better: Adjust the state while rendering
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

[Storing information from previous renders](/reference/react/useState#storing-information-from-previous-renders) like this can be hard to understand, but it’s better than updating the same state in an Effect. In the above example, `setSelection` is called directly during a render. React will re-render the `List` *immediately* after it exits with a `return` statement. React has not rendered the `List` children or updated the DOM yet, so this lets the `List` children skip rendering the stale `selection` value.

When you update a component during rendering, React throws away the returned JSX and immediately retries rendering. To avoid very slow cascading retries, React only lets you update the *same* component's state during a render. If you update another component's state during a render, you'll see an error. A condition like `items !== prevItems` is necessary to avoid loops. You may adjust state like this, but any other side effects (like changing the DOM or setting timeouts) should stay in event handlers or Effects to [keep components pure.](/learn/keeping-components-pure)

**Although this pattern is more efficient than an Effect, most components shouldn't need it either.** No matter how you do it, adjusting state based on props or other state makes your data flow more difficult to understand and debug. Always check whether you can [reset all state with a key](#resetting-all-state-when-a-prop-changes) or [calculate everything during rendering](#updating-state-based-on-props-or-state) instead. For example, instead of storing (and resetting) the selected *item*, you can store the selected *item ID:*

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Best: Calculate everything during rendering
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

Bây giờ không cần "điều chỉnh" state nữa. Nếu item với ID được chọn có trong danh sách, nó vẫn được chọn. Nếu không, `selection` được tính toán trong quá trình render sẽ là `null` vì không tìm thấy item nào khớp. Hành vi này khác, nhưng có thể tốt hơn vì hầu hết các thay đổi đối với `items` bảo toàn selection.

### Chia sẻ logic giữa các event handler {/*sharing-logic-between-event-handlers*/}

Giả sử bạn có một trang sản phẩm với hai nút (Buy và Checkout) đều cho phép bạn mua sản phẩm đó. Bạn muốn hiển thị một thông báo bất cứ khi nào người dùng đặt sản phẩm vào giỏ hàng. Gọi `showNotification()` trong click handler của cả hai nút cảm thấy lặp lại vì vậy bạn có thể bị cám dỗ đặt logic này trong một Effect:

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 Avoid: Event-specific logic inside an Effect
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

Effect này không cần thiết. Nó cũng rất có thể gây ra bug. Ví dụ, giả sử ứng dụng của bạn "nhớ" giỏ hàng giữa các lần reload trang. Nếu bạn thêm một sản phẩm vào giỏ hàng một lần và làm mới trang, thông báo sẽ xuất hiện lại. Nó sẽ tiếp tục xuất hiện mỗi khi bạn làm mới trang của sản phẩm đó. Điều này là do `product.isInCart` sẽ đã là `true` khi trang load, vì vậy Effect ở trên sẽ gọi `showNotification()`.

**Khi bạn không chắc liệu một code nào đó nên ở trong Effect hay trong event handler, hãy tự hỏi *tại sao* code này cần chạy. Chỉ sử dụng Effect cho code nên chạy *vì* component được hiển thị cho người dùng.** Trong ví dụ này, thông báo nên xuất hiện vì người dùng *nhấn nút*, không phải vì trang được hiển thị! Xóa Effect và đặt logic được chia sẻ vào một function được gọi từ cả hai event handler:

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ Good: Event-specific logic is called from event handlers
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

Điều này vừa loại bỏ Effect không cần thiết và sửa bug.

### Gửi POST request {/*sending-a-post-request*/}

Component `Form` này gửi hai loại POST request. Nó gửi một sự kiện analytics khi nó mount. Khi bạn điền vào form và click nút Submit, nó sẽ gửi một POST request đến endpoint `/api/register`:

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic should run because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Avoid: Event-specific logic inside an Effect
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

Hãy áp dụng cùng tiêu chí như trong ví dụ trước.

POST request analytics nên vẫn ở trong một Effect. Điều này là do *lý do* để gửi sự kiện analytics là form đã được hiển thị. (Nó sẽ chạy hai lần trong quá trình phát triển, nhưng [xem ở đây](/learn/synchronizing-with-effects#sending-analytics) để biết cách xử lý điều đó.)

Tuy nhiên, POST request `/api/register` không được gây ra bởi form được *hiển thị*. Bạn chỉ muốn gửi request tại một thời điểm cụ thể: khi người dùng nhấn nút. Nó chỉ nên xảy ra *trong tương tác cụ thể đó*. Xóa Effect thứ hai và chuyển POST request đó vào event handler:

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic runs because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Good: Event-specific logic is in the event handler
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

Khi bạn chọn có nên đặt một logic nào đó vào event handler hay Effect, câu hỏi chính bạn cần trả lời là *loại logic* nào từ góc độ người dùng. Nếu logic này được gây ra bởi một tương tác cụ thể, hãy giữ nó trong event handler. Nếu nó được gây ra bởi việc người dùng *nhìn thấy* component trên màn hình, hãy giữ nó trong Effect.

### Chuỗi các phép tính {/*chains-of-computations*/}

Đôi khi bạn có thể cảm thấy muốn chain các Effect mà mỗi Effect điều chỉnh một phần state dựa trên state khác:

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Avoid: Chains of Effects that adjust the state solely to trigger each other
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

Có hai vấn đề với code này.

Vấn đề đầu tiên là nó rất không hiệu quả: component (và các children của nó) phải re-render giữa mỗi lời gọi `set` trong chuỗi. Trong ví dụ trên, trong trường hợp tệ nhất (`setCard` → render → `setGoldCardCount` → render → `setRound` → render → `setIsGameOver` → render) có ba lần re-render không cần thiết của cây bên dưới.

Vấn đề thứ hai là ngay cả khi nó không chậm, khi code của bạn phát triển, bạn sẽ gặp phải những trường hợp mà "chuỗi" bạn viết không phù hợp với yêu cầu mới. Hãy tưởng tượng bạn đang thêm cách để bước qua lịch sử các nước đi của game. Bạn sẽ làm điều đó bằng cách cập nhật mỗi biến state thành một giá trị từ quá khứ. Tuy nhiên, việc đặt state `card` thành một giá trị từ quá khứ sẽ kích hoạt chuỗi Effect một lần nữa và thay đổi dữ liệu bạn đang hiển thị. Code như vậy thường cứng nhắc và dễ vỡ.

Trong trường hợp này, tốt hơn là tính toán những gì bạn có thể trong quá trình render, và điều chỉnh state trong event handler:

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Calculate what you can during rendering
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Calculate all the next state in the event handler
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

Điều này hiệu quả hơn rất nhiều. Ngoài ra, nếu bạn triển khai cách để xem lịch sử game, bây giờ bạn sẽ có thể đặt mỗi biến state thành một nước đi từ quá khứ mà không kích hoạt chuỗi Effect điều chỉnh mọi giá trị khác. Nếu bạn cần tái sử dụng logic giữa nhiều event handler, bạn có thể [trích xuất một function](#sharing-logic-between-event-handlers) và gọi nó từ những handler đó.

Hãy nhớ rằng bên trong event handler, [state hoạt động như một snapshot.](/learn/state-as-a-snapshot) Ví dụ, ngay cả sau khi bạn gọi `setRound(round + 1)`, biến `round` sẽ phản ánh giá trị tại thời điểm người dùng click nút. Nếu bạn cần sử dụng giá trị tiếp theo cho các phép tính, hãy định nghĩa nó thủ công như `const nextRound = round + 1`.

Trong một số trường hợp, bạn *không thể* tính toán state tiếp theo trực tiếp trong event handler. Ví dụ, hãy tưởng tượng một form với nhiều dropdown mà các tùy chọn của dropdown tiếp theo phụ thuộc vào giá trị được chọn của dropdown trước đó. Khi đó, một chuỗi Effect là phù hợp vì bạn đang đồng bộ hóa với mạng.

### Khởi tạo ứng dụng {/*initializing-the-application*/}

Một số logic chỉ nên chạy một lần khi ứng dụng load.

Bạn có thể bị cám dỗ đặt nó trong một Effect trong component cấp cao nhất:

```js {2-6}
function App() {
  // 🔴 Avoid: Effects with logic that should only ever run once
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

Tuy nhiên, bạn sẽ nhanh chóng phát hiện ra rằng nó [chạy hai lần trong quá trình phát triển.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) Điều này có thể gây ra vấn đề--ví dụ, có thể nó làm vô hiệu hóa authentication token vì function không được thiết kế để được gọi hai lần. Nói chung, các component của bạn nên có khả năng chịu đựng việc được remount. Điều này bao gồm cả component `App` cấp cao nhất của bạn.

Mặc dù nó có thể không bao giờ được remount trong thực tế trong production, việc tuân theo các ràng buộc tương tự trong tất cả các component giúp việc di chuyển và tái sử dụng code dễ dàng hơn. Nếu một số logic phải chạy *một lần mỗi lần load ứng dụng* thay vì *một lần mỗi lần mount component*, hãy thêm một biến cấp cao để theo dõi xem nó đã được thực thi chưa:

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Only runs once per app load
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

Bạn cũng có thể chạy nó trong quá trình khởi tạo module và trước khi ứng dụng render:

```js {1,5}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
   // ✅ Only runs once per app load
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Code ở cấp cao nhất chạy một lần khi component của bạn được import--ngay cả khi nó không được render cuối cùng. Để tránh làm chậm hoặc hành vi bất ngờ khi import các component tùy ý, đừng lạm dụng pattern này. Giữ logic khởi tạo toàn ứng dụng cho các module component gốc như `App.js` hoặc trong entry point của ứng dụng của bạn.

### Thông báo cho component cha về những thay đổi state {/*notifying-parent-components-about-state-changes*/}

Giả sử bạn đang viết một component `Toggle` với state nội bộ `isOn` có thể là `true` hoặc `false`. Có một vài cách khác nhau để toggle nó (bằng cách click hoặc kéo). Bạn muốn thông báo cho component cha bất cứ khi nào state nội bộ `Toggle` thay đổi, vì vậy bạn expose một event `onChange` và gọi nó từ một Effect:

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 Avoid: The onChange handler runs too late
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

Giống như trước đó, điều này không lý tưởng. `Toggle` cập nhật state của nó trước, và React cập nhật màn hình. Sau đó React chạy Effect, gọi function `onChange` được truyền từ component cha. Bây giờ component cha sẽ cập nhật state của chính nó, bắt đầu một render pass khác. Sẽ tốt hơn nếu làm mọi thứ trong một lần pass.

Xóa Effect và thay vào đó cập nhật state của *cả hai* component trong cùng một event handler:

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Good: Perform all updates during the event that caused them
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

Với cách tiếp cận này, cả component `Toggle` và component cha của nó đều cập nhật state trong sự kiện. React [gom nhóm các cập nhật](/learn/queueing-a-series-of-state-updates) từ các component khác nhau lại với nhau, vì vậy sẽ chỉ có một render pass.

Bạn cũng có thể loại bỏ hoàn toàn state, và thay vào đó nhận `isOn` từ component cha:

```js {1,2}
// ✅ Also good: the component is fully controlled by its parent
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["Nâng state lên"](/learn/sharing-state-between-components) cho phép component cha kiểm soát hoàn toàn `Toggle` bằng cách toggle state của chính cha. Điều này có nghĩa là component cha sẽ phải chứa nhiều logic hơn, nhưng sẽ có ít state tổng thể hơn để lo lắng. Bất cứ khi nào bạn cố gắng giữ hai biến state khác nhau đồng bộ, hãy thử nâng state lên thay thế!

### Truyền dữ liệu cho cha {/*passing-data-to-the-parent*/}

Component `Child` này fetch một số dữ liệu và sau đó truyền nó cho component `Parent` trong một Effect:

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Avoid: Passing data to the parent in an Effect
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

Trong React, dữ liệu chảy từ các component cha xuống children của chúng. Khi bạn thấy điều gì đó sai trên màn hình, bạn có thể theo dõi thông tin đến từ đâu bằng cách đi lên chuỗi component cho đến khi bạn tìm thấy component nào truyền prop sai hoặc có state sai. Khi các component con cập nhật state của component cha trong Effect, data flow trở nên rất khó theo dõi. Vì cả con và cha đều cần cùng dữ liệu, hãy để component cha fetch dữ liệu đó, và *truyền nó xuống* cho con thay thế:

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Good: Passing data down to the child
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

Điều này đơn giản hơn và giữ cho data flow có thể dự đoán được: dữ liệu chảy xuống từ cha đến con.

### Subscribe vào external store {/*subscribing-to-an-external-store*/}

Đôi khi, các component của bạn có thể cần subscribe vào một số dữ liệu bên ngoài state React. Dữ liệu này có thể đến từ thư viện bên thứ ba hoặc API trình duyệt tích hợp. Vì dữ liệu này có thể thay đổi mà React không biết, bạn cần manually subscribe các component của bạn vào nó. Điều này thường được thực hiện với một Effect, ví dụ:

```js {2-17}
function useOnlineStatus() {
  // Not ideal: Manual store subscription in an Effect
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Ở đây, component subscribe vào một external data store (trong trường hợp này là API `navigator.onLine` của trình duyệt). Vì API này không tồn tại trên server (vì vậy nó không thể được sử dụng cho HTML ban đầu), ban đầu state được đặt thành `true`. Bất cứ khi nào giá trị của data store đó thay đổi trong trình duyệt, component cập nhật state của nó.

Mặc dù việc sử dụng Effect cho điều này là phổ biến, React có một Hook được xây dựng có mục đích để subscribe vào external store và được ưa chuộng thay thế. Xóa Effect và thay thế nó bằng một lời gọi đến [`useSyncExternalStore`](/reference/react/useSyncExternalStore):

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Good: Subscribing to an external store with a built-in Hook
  return useSyncExternalStore(
    subscribe, // React won't resubscribe for as long as you pass the same function
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Cách tiếp cận này ít lỗi hơn so với việc manually đồng bộ hóa dữ liệu có thể thay đổi với state React bằng Effect. Thông thường, bạn sẽ viết một custom Hook như `useOnlineStatus()` ở trên để bạn không cần lặp lại code này trong các component riêng lẻ. [Đọc thêm về việc subscribe vào external store từ các component React.](/reference/react/useSyncExternalStore)

### Fetch dữ liệu {/*fetching-data*/}

Nhiều ứng dụng sử dụng Effect để khởi động fetch dữ liệu. Việc viết một Effect fetch dữ liệu như thế này khá phổ biến:

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Avoid: Fetching without cleanup logic
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

Bạn *không* cần chuyển fetch này sang event handler.

Điều này có thể trông như một mâu thuẫn với các ví dụ trước đó khi bạn cần đặt logic vào event handler! Tuy nhiên, hãy xem xét rằng không phải *sự kiện gõ* là lý do chính để fetch. Input tìm kiếm thường được điền sẵn từ URL, và người dùng có thể điều hướng Back và Forward mà không chạm vào input.

Không quan trọng `page` và `query` đến từ đâu. Trong khi component này hiển thị, bạn muốn giữ `results` [đồng bộ](/learn/synchronizing-with-effects) với dữ liệu từ mạng cho `page` và `query` hiện tại. Đây là lý do tại sao nó là một Effect.

Tuy nhiên, code trên có một bug. Hãy tưởng tượng bạn gõ `"hello"` nhanh. Khi đó `query` sẽ thay đổi từ `"h"`, đến `"he"`, `"hel"`, `"hell"`, và `"hello"`. Điều này sẽ khởi động các fetch riêng biệt, nhưng không có gì đảm bảo về thứ tự mà các response sẽ đến. Ví dụ, response `"hell"` có thể đến *sau* response `"hello"`. Vì nó sẽ gọi `setResults()` cuối cùng, bạn sẽ hiển thị kết quả tìm kiếm sai. Điều này được gọi là ["race condition"](https://en.wikipedia.org/wiki/Race_condition): hai request khác nhau "đua" với nhau và đến theo thứ tự khác với mong đợi của bạn.

**Để sửa race condition, bạn cần [thêm một cleanup function](/learn/synchronizing-with-effects#fetching-data) để bỏ qua các response cũ:**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

Điều này đảm bảo rằng khi Effect của bạn fetch dữ liệu, tất cả các response trừ response cuối cùng được yêu cầu sẽ bị bỏ qua.

Xử lý race condition không phải là khó khăn duy nhất khi triển khai fetch dữ liệu. Bạn có thể cũng muốn nghĩ về việc cache response (để người dùng có thể click Back và thấy màn hình trước đó ngay lập tức), cách fetch dữ liệu trên server (để HTML được render ban đầu từ server chứa nội dung đã fetch thay vì một spinner), và cách tránh network waterfall (để con có thể fetch dữ liệu mà không cần chờ mọi cha).

**Những vấn đề này áp dụng cho bất kỳ thư viện UI nào, không chỉ React. Giải quyết chúng không đơn giản, đó là lý do tại sao các [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) hiện đại cung cấp các cơ chế fetch dữ liệu tích hợp hiệu quả hơn so với việc fetch dữ liệu trong Effect.**

Nếu bạn không sử dụng framework (và không muốn xây dựng của riêng bạn) nhưng muốn làm cho việc fetch dữ liệu từ Effect trở nên ergonomic hơn, hãy xem xét việc trích xuất logic fetch của bạn vào một custom Hook như trong ví dụ này:

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

Bạn có thể cũng sẽ muốn thêm một số logic cho việc xử lý lỗi và theo dõi xem nội dung có đang loading hay không. Bạn có thể tự xây dựng một Hook như thế này hoặc sử dụng một trong nhiều giải pháp đã có sẵn trong React ecosystem. **Mặc dù điều này một mình sẽ không hiệu quả bằng việc sử dụng cơ chế fetch dữ liệu tích hợp của framework, việc chuyển logic fetch dữ liệu vào một custom Hook sẽ giúp việc áp dụng chiến lược fetch dữ liệu hiệu quả sau này dễ dàng hơn.**

Nói chung, bất cứ khi nào bạn phải viết Effect, hãy chú ý đến khi bạn có thể trích xuất một phần chức năng vào một custom Hook với API khai báo và có mục đích hơn như `useData` ở trên. Càng ít lời gọi `useEffect` thô bạn có trong các component của bạn, bạn sẽ càng dễ dàng duy trì ứng dụng của mình.

<Recap>

- Nếu bạn có thể tính toán điều gì đó trong quá trình render, bạn không cần Effect.
- Để cache các phép tính đắt đỏ, hãy thêm `useMemo` thay vì `useEffect`.
- Để reset state của toàn bộ cây component, hãy truyền một `key` khác cho nó.
- Để reset một bit cụ thể của state để đáp ứng thay đổi prop, hãy đặt nó trong quá trình render.
- Code chạy vì một component đã được *hiển thị* nên ở trong Effect, phần còn lại nên ở trong event.
- Nếu bạn cần cập nhật state của nhiều component, tốt hơn là làm điều đó trong một sự kiện duy nhất.
- Bất cứ khi nào bạn cố gắng đồng bộ hóa các biến state trong các component khác nhau, hãy xem xét việc nâng state lên.
- Bạn có thể fetch dữ liệu với Effect, nhưng bạn cần triển khai cleanup để tránh race condition.

</Recap>

<Challenges>

#### Biến đổi dữ liệu mà không cần Effect {/*transform-data-without-effects*/}

`TodoList` bên dưới hiển thị một danh sách các todo. Khi checkbox "Show only active todos" được tích, các todo đã hoàn thành không được hiển thị trong danh sách. Bất kể todo nào hiển thị, footer hiển thị số lượng todo chưa hoàn thành.

Đơn giản hóa component này bằng cách loại bỏ tất cả state và Effect không cần thiết.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

Nếu bạn có thể tính toán điều gì đó trong quá trình render, bạn không cần state hoặc Effect để cập nhật nó.

</Hint>

<Solution>

Chỉ có hai phần state cần thiết trong ví dụ này: danh sách `todos` và biến state `showActive` đại diện cho việc checkbox có được tích hay không. Tất cả các biến state khác đều [dư thừa](/learn/choosing-the-state-structure#avoid-redundant-state) và có thể được tính toán trong quá trình render thay thế. Điều này bao gồm `footer` mà bạn có thể chuyển trực tiếp vào JSX xung quanh.

Kết quả của bạn nên trông như thế này:

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Cache một phép tính mà không cần Effect {/*cache-a-calculation-without-effects*/}

Trong ví dụ này, việc lọc todo đã được trích xuất vào một function riêng biệt được gọi là `getVisibleTodos()`. Function này chứa một lời gọi `console.log()` bên trong giúp bạn nhận ra khi nào nó được gọi. Toggle "Show only active todos" và nhận thấy rằng nó khiến `getVisibleTodos()` chạy lại. Điều này như mong đợi vì các todo hiển thị thay đổi khi bạn toggle những cái nào để hiển thị.

Nhiệm vụ của bạn là loại bỏ Effect tính toán lại danh sách `visibleTodos` trong component `TodoList`. Tuy nhiên, bạn cần đảm bảo rằng `getVisibleTodos()` *không* chạy lại (và do đó không in bất kỳ log nào) khi bạn gõ vào input.

<Hint>

Một giải pháp là thêm một lời gọi `useMemo` để cache các todo hiển thị. Cũng có một giải pháp khác ít rõ ràng hơn.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

Loại bỏ biến state và Effect, và thay vào đó thêm một lời gọi `useMemo` để cache kết quả của việc gọi `getVisibleTodos()`:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

Với thay đổi này, `getVisibleTodos()` sẽ chỉ được gọi nếu `todos` hoặc `showActive` thay đổi. Gõ vào input chỉ thay đổi biến state `text`, vì vậy nó không kích hoạt lời gọi đến `getVisibleTodos()`.

Cũng có một giải pháp khác không cần `useMemo`. Vì biến state `text` không thể ảnh hưởng đến danh sách todo, bạn có thể trích xuất form `NewTodo` thành một component riêng biệt, và chuyển biến state `text` vào trong đó:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

Cách tiếp cận này cũng thỏa mãn yêu cầu. Khi bạn gõ vào input, chỉ biến state `text` cập nhật. Vì biến state `text` ở trong component con `NewTodo`, component cha `TodoList` sẽ không được re-render. Đây là lý do tại sao `getVisibleTodos()` không được gọi khi bạn gõ. (Nó vẫn sẽ được gọi nếu `TodoList` re-render vì lý do khác.)

</Solution>

#### Reset state mà không cần Effect {/*reset-state-without-effects*/}

Component `EditContact` này nhận một đối tượng contact có dạng `{ id, name, email }` như prop `savedContact`. Thử chỉnh sửa các trường input name và email. Khi bạn nhấn Save, nút contact phía trên form sẽ cập nhật thành tên đã chỉnh sửa. Khi bạn nhấn Reset, bất kỳ thay đổi nào đang chờ trong form sẽ bị hủy bỏ. Chơi với UI này để cảm nhận nó.

Khi bạn chọn một contact với các nút ở phía trên, form sẽ reset để phản ánh chi tiết của contact đó. Điều này được thực hiện với một Effect bên trong `EditContact.js`. Loại bỏ Effect này. Tìm cách khác để reset form khi `savedContact.id` thay đổi.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

Sẽ tuyệt vời nếu có cách để nói với React rằng khi `savedContact.id` khác, form `EditContact` về mặt khái niệm là *form của contact khác* và không nên bảo toàn state. Bạn có nhớ cách nào như vậy không?

</Hint>

<Solution>

Chia component `EditContact` thành hai. Chuyển tất cả form state vào component `EditForm` bên trong. Export component `EditContact` bên ngoài, và làm cho nó truyền `savedContact.id` làm `key` cho component `EditForm` bên trong. Kết quả là, component `EditForm` bên trong reset tất cả form state và tạo lại DOM bất cứ khi nào bạn chọn một contact khác.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Submit form mà không cần Effect {/*submit-a-form-without-effects*/}

Component `Form` này cho phép bạn gửi tin nhắn cho bạn bè. Khi bạn submit form, biến state `showForm` được đặt thành `false`. Điều này kích hoạt một Effect gọi `sendMessage(message)`, gửi tin nhắn (bạn có thể thấy nó trong console). Sau khi tin nhắn được gửi, bạn thấy dialog "Thank you" với nút "Open chat" cho phép bạn quay lại form.

Người dùng ứng dụng của bạn đang gửi quá nhiều tin nhắn. Để làm cho việc chat khó khăn hơn một chút, bạn quyết định hiển thị dialog "Thank you" *trước* thay vì form. Thay đổi biến state `showForm` để khởi tạo thành `false` thay vì `true`. Ngay khi bạn thực hiện thay đổi đó, console sẽ hiển thị rằng một tin nhắn trống đã được gửi. Có điều gì đó trong logic này không đúng!

Nguyên nhân gốc rễ của vấn đề này là gì? Và bạn có thể sửa nó như thế nào?

<Hint>

Tin nhắn có nên được gửi *vì* người dùng đã thấy dialog "Thank you" không? Hay là ngược lại?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

Biến state `showForm` xác định có hiển thị form hay dialog "Thank you". Tuy nhiên, bạn không gửi tin nhắn vì dialog "Thank you" đã được *hiển thị*. Bạn muốn gửi tin nhắn vì người dùng đã *submit form.* Xóa Effect gây nhầm lẫn và chuyển lời gọi `sendMessage` vào trong event handler `handleSubmit`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Lưu ý rằng trong phiên bản này, chỉ *submit form* (đó là một sự kiện) mới khiến tin nhắn được gửi. Nó hoạt động tốt bất kể `showForm` ban đầu được đặt thành `true` hay `false`. (Đặt nó thành `false` và chú ý không có tin nhắn console bổ sung.)

</Solution>

</Challenges>
