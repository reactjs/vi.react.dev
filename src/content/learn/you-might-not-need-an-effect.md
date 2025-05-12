---
title: 'Có Thể Bạn Không Cần Effect'
---

<Intro>

Effect là một lối thoát khỏi mô hình React. Chúng cho phép bạn "bước ra ngoài" React và đồng bộ hóa các component của bạn với một số hệ thống bên ngoài như một widget không phải React, mạng hoặc DOM của trình duyệt. Nếu không có hệ thống bên ngoài nào liên quan (ví dụ: nếu bạn muốn cập nhật state của một component khi một số prop hoặc state thay đổi), bạn không nên cần đến Effect. Loại bỏ các Effect không cần thiết sẽ giúp code của bạn dễ theo dõi hơn, chạy nhanh hơn và ít bị lỗi hơn.

</Intro>

<YouWillLearn>

* Tại sao và làm thế nào để loại bỏ các Effect không cần thiết khỏi component của bạn
* Cách lưu trữ các phép tính tốn kém mà không cần Effect
* Cách đặt lại và điều chỉnh state của component mà không cần Effect
* Cách chia sẻ logic giữa các trình xử lý sự kiện
* Logic nào nên được chuyển sang trình xử lý sự kiện
* Cách thông báo cho các component cha về các thay đổi

</YouWillLearn>

## Làm thế nào để loại bỏ các Effect không cần thiết {/*how-to-remove-unnecessary-effects*/}

Có hai trường hợp phổ biến mà bạn không cần Effect:

* **Bạn không cần Effect để chuyển đổi dữ liệu để hiển thị.** Ví dụ: giả sử bạn muốn lọc một danh sách trước khi hiển thị nó. Bạn có thể cảm thấy muốn viết một Effect để cập nhật một biến state khi danh sách thay đổi. Tuy nhiên, điều này không hiệu quả. Khi bạn cập nhật state, React sẽ gọi các hàm component của bạn để tính toán những gì sẽ hiển thị trên màn hình. Sau đó, React sẽ ["commit"](/learn/render-and-commit) những thay đổi này vào DOM, cập nhật màn hình. Sau đó, React sẽ chạy các Effect của bạn. Nếu Effect của bạn *cũng* ngay lập tức cập nhật state, điều này sẽ khởi động lại toàn bộ quá trình từ đầu! Để tránh các lần render không cần thiết, hãy chuyển đổi tất cả dữ liệu ở cấp cao nhất của component của bạn. Code đó sẽ tự động chạy lại bất cứ khi nào prop hoặc state của bạn thay đổi.
* **Bạn không cần Effect để xử lý các sự kiện của người dùng.** Ví dụ: giả sử bạn muốn gửi một yêu cầu POST `/api/buy` và hiển thị một thông báo khi người dùng mua một sản phẩm. Trong trình xử lý sự kiện click của nút Mua, bạn biết chính xác những gì đã xảy ra. Vào thời điểm Effect chạy, bạn không biết *người dùng* đã làm gì (ví dụ: nút nào đã được click). Đây là lý do tại sao bạn thường xử lý các sự kiện của người dùng trong các trình xử lý sự kiện tương ứng.

Bạn *cần* Effect để [đồng bộ hóa](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) với các hệ thống bên ngoài. Ví dụ: bạn có thể viết một Effect để giữ cho một widget jQuery được đồng bộ hóa với state của React. Bạn cũng có thể tìm nạp dữ liệu bằng Effect: ví dụ: bạn có thể đồng bộ hóa kết quả tìm kiếm với truy vấn tìm kiếm hiện tại. Hãy nhớ rằng các [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) hiện đại cung cấp các cơ chế tìm nạp dữ liệu tích hợp hiệu quả hơn so với việc viết Effect trực tiếp trong component của bạn.

Để giúp bạn có được trực giác đúng đắn, hãy xem một số ví dụ cụ thể phổ biến!

### Cập nhật state dựa trên prop hoặc state {/*updating-state-based-on-props-or-state*/}

Giả sử bạn có một component với hai biến state: `firstName` và `lastName`. Bạn muốn tính toán một `fullName` từ chúng bằng cách nối chúng lại với nhau. Hơn nữa, bạn muốn `fullName` cập nhật bất cứ khi nào `firstName` hoặc `lastName` thay đổi. Bản năng đầu tiên của bạn có thể là thêm một biến state `fullName` và cập nhật nó trong một Effect:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Tránh: state dư thừa và Effect không cần thiết
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Điều này phức tạp hơn mức cần thiết. Nó cũng không hiệu quả: nó thực hiện một lần render hoàn chỉnh với một giá trị cũ cho `fullName`, sau đó ngay lập tức render lại với giá trị đã cập nhật. Loại bỏ biến state và Effect:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Tốt: được tính toán trong quá trình render
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**Khi một cái gì đó có thể được tính toán từ các prop hoặc state hiện có, [đừng đưa nó vào state.](/learn/choosing-the-state-structure#avoid-redundant-state) Thay vào đó, hãy tính toán nó trong quá trình render.** Điều này làm cho code của bạn nhanh hơn (bạn tránh được các cập nhật "xếp tầng" bổ sung), đơn giản hơn (bạn loại bỏ một số code) và ít bị lỗi hơn (bạn tránh được các lỗi do các biến state khác nhau bị lệch pha với nhau). Nếu cách tiếp cận này có vẻ mới đối với bạn, [Thinking in React](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state) giải thích những gì nên đưa vào state.

### Lưu trữ các phép tính tốn kém {/*caching-expensive-calculations*/}

Component này tính toán `visibleTodos` bằng cách lấy `todos` mà nó nhận được bằng prop và lọc chúng theo prop `filter`. Bạn có thể cảm thấy muốn lưu trữ kết quả trong state và cập nhật nó từ một Effect:

```js {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Tránh: state dư thừa và Effect không cần thiết
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

Giống như trong ví dụ trước, điều này vừa không cần thiết vừa không hiệu quả. Đầu tiên, loại bỏ state và Effect:

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Điều này ổn nếu getFilteredTodos() không chậm.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

Thông thường, đoạn code này vẫn ổn! Nhưng có thể `getFilteredTodos()` chạy chậm hoặc bạn có rất nhiều `todos`. Trong trường hợp đó, bạn không muốn tính toán lại `getFilteredTodos()` nếu một biến state không liên quan như `newTodo` đã thay đổi.

Bạn có thể lưu vào bộ nhớ cache (hoặc ["ghi nhớ"](https://en.wikipedia.org/wiki/Memoization)) một phép tính tốn kém bằng cách bọc nó trong một Hook [`useMemo`](/reference/react/useMemo):

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ Không chạy lại trừ khi todos hoặc filter thay đổi
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

Hoặc, viết dưới dạng một dòng duy nhất:

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Không chạy lại getFilteredTodos() trừ khi todos hoặc filter thay đổi
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**Điều này cho React biết rằng bạn không muốn hàm bên trong chạy lại trừ khi `todos` hoặc `filter` đã thay đổi.** React sẽ ghi nhớ giá trị trả về của `getFilteredTodos()` trong quá trình render ban đầu. Trong quá trình render tiếp theo, nó sẽ kiểm tra xem `todos` hoặc `filter` có khác nhau hay không. Nếu chúng giống như lần trước, `useMemo` sẽ trả về kết quả cuối cùng mà nó đã lưu trữ. Nhưng nếu chúng khác nhau, React sẽ gọi lại hàm bên trong (và lưu trữ kết quả của nó).

Hàm bạn bọc trong [`useMemo`](/reference/react/useMemo) chạy trong quá trình render, vì vậy điều này chỉ hoạt động đối với [các phép tính thuần túy.](/learn/keeping-components-pure)

<DeepDive>

#### Làm thế nào để biết một phép tính có tốn kém hay không? {/*how-to-tell-if-a-calculation-is-expensive*/}

Nói chung, trừ khi bạn đang tạo hoặc lặp qua hàng nghìn đối tượng, có lẽ nó không tốn kém. Nếu bạn muốn tự tin hơn, bạn có thể thêm một bản ghi console để đo thời gian dành cho một đoạn code:

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

Thực hiện tương tác bạn đang đo (ví dụ: nhập vào đầu vào). Sau đó, bạn sẽ thấy các bản ghi như `filter array: 0.15ms` trong bảng điều khiển của mình. Nếu tổng thời gian được ghi lại cộng lại thành một lượng đáng kể (ví dụ: `1ms` trở lên), thì có thể có ý nghĩa khi ghi nhớ phép tính đó. Như một thử nghiệm, sau đó bạn có thể bọc phép tính trong `useMemo` để xác minh xem tổng thời gian được ghi lại có giảm cho tương tác đó hay không:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // Bỏ qua nếu todos và filter không thay đổi
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo` sẽ không làm cho quá trình render *đầu tiên* nhanh hơn. Nó chỉ giúp bạn bỏ qua các công việc không cần thiết khi cập nhật.

Hãy nhớ rằng máy của bạn có thể nhanh hơn máy của người dùng, vì vậy bạn nên kiểm tra hiệu suất với một sự chậm lại nhân tạo. Ví dụ: Chrome cung cấp tùy chọn [Điều chỉnh CPU](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) cho việc này.

Cũng lưu ý rằng việc đo hiệu suất trong quá trình phát triển sẽ không cung cấp cho bạn kết quả chính xác nhất. (Ví dụ: khi [Chế độ nghiêm ngặt](/reference/react/StrictMode) được bật, bạn sẽ thấy mỗi thành phần render hai lần thay vì một lần.) Để có được thời gian chính xác nhất, hãy xây dựng ứng dụng của bạn để sản xuất và kiểm tra nó trên một thiết bị như người dùng của bạn có.

</DeepDive>

### Đặt lại tất cả trạng thái khi một prop thay đổi {/*resetting-all-state-when-a-prop-changes*/}

Thành phần `ProfilePage` này nhận một prop `userId`. Trang này chứa một đầu vào nhận xét và bạn sử dụng một biến state `comment` để giữ giá trị của nó. Một ngày nọ, bạn nhận thấy một vấn đề: khi bạn điều hướng từ hồ sơ này sang hồ sơ khác, trạng thái `comment` không được đặt lại. Do đó, rất dễ vô tình đăng nhận xét trên hồ sơ của người dùng sai. Để khắc phục sự cố, bạn muốn xóa biến state `comment` bất cứ khi nào `userId` thay đổi:

```js {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Tránh: Đặt lại trạng thái khi thay đổi prop trong một Effect
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

Điều này không hiệu quả vì `ProfilePage` và các thành phần con của nó sẽ render trước với giá trị cũ, sau đó render lại. Nó cũng phức tạp vì bạn cần phải làm điều này trong *mọi* thành phần có một số state bên trong `ProfilePage`. Ví dụ: nếu giao diện người dùng nhận xét được lồng nhau, bạn cũng muốn xóa state nhận xét lồng nhau.

Thay vào đó, bạn có thể cho React biết rằng hồ sơ của mỗi người dùng về mặt khái niệm là một hồ sơ _khác nhau_ bằng cách cung cấp cho nó một khóa rõ ràng. Chia component của bạn thành hai và chuyển một thuộc tính `key` từ component bên ngoài sang component bên trong:

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
  // ✅ Trạng thái này và bất kỳ trạng thái nào khác bên dưới sẽ tự động đặt lại khi thay đổi khóa
  const [comment, setComment] = useState('');
  // ...
}
```

Thông thường, React giữ nguyên state khi cùng một component được render ở cùng một vị trí. **Bằng cách chuyển `userId` làm `key` cho component `Profile`, bạn đang yêu cầu React coi hai component `Profile` có `userId` khác nhau là hai component khác nhau không được chia sẻ bất kỳ state nào.** Bất cứ khi nào khóa (mà bạn đã đặt thành `userId`) thay đổi, React sẽ tạo lại DOM và [đặt lại state](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) của component `Profile` và tất cả các component con của nó. Bây giờ trường `comment` sẽ tự động xóa khi điều hướng giữa các hồ sơ.

Lưu ý rằng trong ví dụ này, chỉ component `ProfilePage` bên ngoài được xuất và hiển thị cho các tệp khác trong dự án. Các component render `ProfilePage` không cần phải chuyển khóa cho nó: chúng chuyển `userId` làm một prop thông thường. Việc `ProfilePage` chuyển nó làm `key` cho component `Profile` bên trong là một chi tiết triển khai.

### Điều chỉnh một số trạng thái khi một prop thay đổi {/*adjusting-some-state-when-a-prop-changes*/}

Đôi khi, bạn có thể muốn đặt lại hoặc điều chỉnh một phần của state khi một prop thay đổi, nhưng không phải tất cả.

Component `List` này nhận một danh sách `items` làm một prop và duy trì mục đã chọn trong biến state `selection`. Bạn muốn đặt lại `selection` thành `null` bất cứ khi nào

```js {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Tránh: Điều chỉnh trạng thái khi thay đổi prop trong một Effect
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

Điều này cũng không lý tưởng. Mỗi khi `items` thay đổi, `List` và các thành phần con của nó sẽ render với giá trị `selection` cũ trước. Sau đó, React sẽ cập nhật DOM và chạy các Effect. Cuối cùng, lệnh gọi `setSelection(null)` sẽ gây ra một lần render lại `List` và các thành phần con của nó, khởi động lại toàn bộ quá trình này.

Bắt đầu bằng cách xóa Effect. Thay vào đó, hãy điều chỉnh trạng thái trực tiếp trong quá trình render:

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Tốt hơn: Điều chỉnh trạng thái trong khi render
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

[Lưu trữ thông tin từ các lần render trước](/reference/react/useState#storing-information-from-previous-renders) như thế này có thể khó hiểu, nhưng nó tốt hơn là cập nhật cùng một trạng thái trong một Effect. Trong ví dụ trên, `setSelection` được gọi trực tiếp trong quá trình render. React sẽ render lại `List` *ngay lập tức* sau khi nó thoát bằng một câu lệnh `return`. React chưa render các thành phần con `List` hoặc cập nhật DOM, vì vậy điều này cho phép các thành phần con `List` bỏ qua việc render giá trị `selection` cũ.

Khi bạn cập nhật một thành phần trong quá trình render, React sẽ loại bỏ JSX được trả về và thử lại render ngay lập tức. Để tránh các lần thử lại xếp tầng rất chậm, React chỉ cho phép bạn cập nhật trạng thái của *cùng* một thành phần trong quá trình render. Nếu bạn cập nhật trạng thái của một thành phần khác trong quá trình render, bạn sẽ thấy lỗi. Một điều kiện như `items !== prevItems` là cần thiết để tránh các vòng lặp. Bạn có thể điều chỉnh trạng thái như thế này, nhưng bất kỳ tác dụng phụ nào khác (như thay đổi DOM hoặc đặt thời gian chờ) nên ở trong các trình xử lý sự kiện hoặc Effect để [giữ cho các thành phần thuần túy.](/learn/keeping-components-pure)

**Mặc dù mẫu này hiệu quả hơn một Effect, nhưng hầu hết các thành phần cũng không cần nó.** Bất kể bạn làm điều đó như thế nào, việc điều chỉnh trạng thái dựa trên các prop hoặc trạng thái khác sẽ làm cho luồng dữ liệu của bạn khó hiểu và gỡ lỗi hơn. Luôn kiểm tra xem bạn có thể [đặt lại tất cả trạng thái bằng một khóa](#resetting-all-state-when-a-prop-changes) hoặc [tính toán mọi thứ trong quá trình render](#updating-state-based-on-props-or-state) hay không. Ví dụ: thay vì lưu trữ (và đặt lại) *mục* đã chọn, bạn có thể lưu trữ *ID mục* đã chọn:

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Tốt nhất: Tính toán mọi thứ trong quá trình render
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

Bây giờ không cần phải "điều chỉnh" trạng thái nữa. Nếu mục có ID đã chọn nằm trong danh sách, nó vẫn được chọn. Nếu không, `selection` được tính toán trong quá trình render sẽ là `null` vì không tìm thấy mục phù hợp. Hành vi này khác, nhưng có thể tốt hơn vì hầu hết các thay đổi đối với `items` đều giữ nguyên lựa chọn.

### Chia sẻ logic giữa các trình xử lý sự kiện {/*sharing-logic-between-event-handlers*/}

Giả sử bạn có một trang sản phẩm với hai nút (Mua và Thanh toán) cho phép bạn mua sản phẩm đó. Bạn muốn hiển thị thông báo bất cứ khi nào người dùng đặt sản phẩm vào giỏ hàng. Gọi `showNotification()` trong cả hai trình xử lý nhấp của nút có vẻ lặp đi lặp lại, vì vậy bạn có thể muốn đặt logic này trong một Effect:

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 Tránh: Logic dành riêng cho sự kiện bên trong một Effect
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Đã thêm ${product.name} vào giỏ hàng!`);
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

Effect này là không cần thiết. Nó cũng rất có thể gây ra lỗi. Ví dụ: giả sử ứng dụng của bạn "ghi nhớ" giỏ hàng giữa các lần tải lại trang. Nếu bạn thêm một sản phẩm vào giỏ hàng một lần và làm mới trang, thông báo sẽ xuất hiện lại. Nó sẽ tiếp tục xuất hiện mỗi khi bạn làm mới trang sản phẩm đó. Điều này là do `product.isInCart` sẽ đã là `true` khi tải trang, vì vậy Effect trên sẽ gọi `showNotification()`.

**Khi bạn không chắc chắn liệu một số mã nên nằm trong một Effect hay trong một trình xử lý sự kiện, hãy tự hỏi *tại sao* mã này cần chạy. Chỉ sử dụng Effect cho mã nên chạy *vì* thành phần đã được hiển thị cho người dùng.** Trong ví dụ này, thông báo sẽ xuất hiện vì người dùng *nhấn nút*, không phải vì trang đã được hiển thị! Xóa Effect và đặt logic được chia sẻ vào một hàm được gọi từ cả hai trình xử lý sự kiện:

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ Tốt: Logic dành riêng cho sự kiện được gọi từ các trình xử lý sự kiện
  function buyProduct() {
    addToCart(product);
    showNotification(`Đã thêm ${product.name} vào giỏ hàng!`);
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

Điều này vừa loại bỏ Effect không cần thiết vừa sửa lỗi.

### Gửi một yêu cầu POST {/*sending-a-post-request*/}

Thành phần `Form` này gửi hai loại yêu cầu POST. Nó gửi một sự kiện phân tích khi nó được gắn kết. Khi bạn điền vào biểu mẫu và nhấp vào nút Gửi, nó sẽ gửi một yêu cầu POST đến điểm cuối `/api/register`:

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Tốt: Logic này sẽ chạy vì thành phần đã được hiển thị
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Tránh: Logic dành riêng cho sự kiện bên trong một Effect
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

Hãy áp dụng các tiêu chí tương tự như trong ví dụ trước.

Yêu cầu POST phân tích nên vẫn còn trong một Effect. Điều này là do _lý do_ để gửi sự kiện phân tích là biểu mẫu đã được hiển thị. (Nó sẽ kích hoạt hai lần trong quá trình phát triển, nhưng [xem tại đây](/learn/synchronizing-with-effects#sending-analytics) để biết cách xử lý điều đó.)

Tuy nhiên, yêu cầu POST `/api/register` không phải do biểu mẫu được _hiển thị_. Bạn chỉ muốn gửi yêu cầu vào một thời điểm cụ thể: khi người dùng nhấn nút. Nó sẽ chỉ xảy ra _trong tương tác cụ thể đó_. Xóa Effect thứ hai và di chuyển yêu cầu POST đó vào trình xử lý sự kiện:

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Tốt: Logic này chạy vì thành phần đã được hiển thị
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Tốt: Logic dành riêng cho sự kiện nằm trong trình xử lý sự kiện
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

Khi bạn chọn có nên đặt một số logic vào một trình xử lý sự kiện hay một Effect, câu hỏi chính bạn cần trả lời là _loại logic_ đó là gì từ quan điểm của người dùng. Nếu logic này được gây ra bởi một tương tác cụ thể, hãy giữ nó trong trình xử lý sự kiện. Nếu nó được gây ra bởi người dùng _nhìn thấy_ thành phần trên màn hình, hãy giữ nó trong Effect.

### Chuỗi các phép tính {/*chains-of-computations*/}

Đôi khi bạn có thể cảm thấy muốn xâu chuỗi các Effect mà mỗi Effect điều chỉnh một phần của trạng thái dựa trên trạng thái khác:

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Tránh: Chuỗi các Effect điều chỉnh trạng thái chỉ để kích hoạt lẫn nhau
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

Có hai vấn đề với đoạn code này.

Vấn đề đầu tiên là nó rất kém hiệu quả: thành phần (và các thành phần con của nó) phải render lại giữa mỗi lệnh gọi `set` trong chuỗi. Trong ví dụ trên, trong trường hợp xấu nhất (`setCard` → render → `setGoldCardCount` → render → `setRound` → render → `setIsGameOver` → render) có ba lần render lại cây không cần thiết bên dưới.

Vấn đề thứ hai là ngay cả khi nó không chậm, khi code của bạn phát triển, bạn sẽ gặp phải các trường hợp mà "chuỗi" bạn đã viết không phù hợp với các yêu cầu mới. Hãy tưởng tượng bạn đang thêm một cách để xem qua lịch sử các bước di chuyển của trò chơi. Bạn sẽ làm điều đó bằng cách cập nhật từng biến trạng thái thành một giá trị từ quá khứ. Tuy nhiên, việc đặt trạng thái `card` thành một giá trị từ quá khứ sẽ kích hoạt lại chuỗi Effect và thay đổi dữ liệu bạn đang hiển thị. Code như vậy thường cứng nhắc và dễ vỡ.

Trong trường hợp này, tốt hơn là tính toán những gì bạn có thể trong quá trình render và điều chỉnh trạng thái trong trình xử lý sự kiện:

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Tính toán những gì bạn có thể trong quá trình render
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Tính toán tất cả trạng thái tiếp theo trong trình xử lý sự kiện
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

Điều này hiệu quả hơn rất nhiều. Ngoài ra, nếu bạn triển khai một cách để xem lịch sử trò chơi, giờ đây bạn sẽ có thể đặt từng biến trạng thái thành một bước di chuyển từ quá khứ mà không kích hoạt chuỗi Effect điều chỉnh mọi giá trị khác. Nếu bạn cần sử dụng lại logic giữa một số trình xử lý sự kiện, bạn có thể [trích xuất một hàm](#sharing-logic-between-event-handlers) và gọi nó từ các trình xử lý đó.

Hãy nhớ rằng bên trong các trình xử lý sự kiện, [trạng thái hoạt động như một ảnh chụp nhanh.](/learn/state-as-a-snapshot) Ví dụ: ngay cả sau khi bạn gọi `setRound(round + 1)`, biến `round` sẽ phản ánh giá trị tại thời điểm người dùng nhấp vào nút. Nếu bạn cần sử dụng giá trị tiếp theo cho các phép tính, hãy xác định nó theo cách thủ công như `const nextRound = round + 1`.

Trong một số trường hợp, bạn *không thể* tính toán trạng thái tiếp theo trực tiếp trong trình xử lý sự kiện. Ví dụ: hãy tưởng tượng một biểu mẫu có nhiều danh sách thả xuống, trong đó các tùy chọn của danh sách thả xuống tiếp theo phụ thuộc vào giá trị đã chọn của danh sách thả xuống trước đó. Sau đó, một chuỗi các Effect là phù hợp vì bạn đang đồng bộ hóa với mạng.

### Khởi tạo ứng dụng {/*initializing-the-application*/}

Một số logic chỉ nên chạy một lần khi ứng dụng tải.

Bạn có thể muốn đặt nó trong một Effect trong thành phần cấp cao nhất:

```js {2-6}
function App() {
  // 🔴 Tránh: Effect với logic chỉ nên chạy một lần
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

Tuy nhiên, bạn sẽ nhanh chóng phát hiện ra rằng nó [chạy hai lần trong quá trình phát triển.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) Điều này có thể gây ra sự cố--ví dụ: có thể nó làm mất hiệu lực mã thông báo xác thực vì hàm không được thiết kế để được gọi hai lần. Nói chung, các thành phần của bạn nên có khả năng phục hồi khi được gắn lại. Điều này bao gồm thành phần `App` cấp cao nhất của bạn.

Mặc dù nó có thể không bao giờ được gắn lại trong thực tế trong quá trình sản xuất, nhưng việc tuân theo các ràng buộc tương tự trong tất cả các thành phần giúp bạn dễ dàng di chuyển và sử dụng lại code hơn. Nếu một số logic phải chạy *một lần cho mỗi lần tải ứng dụng* thay vì *một lần cho mỗi lần gắn kết thành phần*, hãy thêm một biến cấp cao nhất để theo dõi xem nó đã được thực thi hay chưa:

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Chỉ chạy một lần cho mỗi lần tải ứng dụng
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

Bạn cũng có thể chạy nó trong quá trình khởi tạo mô-đun và trước khi ứng dụng render:

```js {1,5}
if (typeof window !== 'undefined') { // Kiểm tra xem chúng ta có đang chạy trong trình duyệt hay không.
   // ✅ Chỉ chạy một lần cho mỗi lần tải ứng dụng
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Code ở cấp cao nhất chạy một lần khi thành phần của bạn được nhập--ngay cả khi nó không được render. Để tránh chậm trễ hoặc hành vi đáng ngạc nhiên khi nhập các thành phần tùy ý, đừng lạm dụng mẫu này. Giữ logic khởi tạo trên toàn ứng dụng cho các mô-đun thành phần gốc như `App.js` hoặc trong điểm nhập của ứng dụng của bạn.

### Thông báo cho các thành phần cha về các thay đổi trạng thái {/*notifying-parent-components-about-state-changes*/}

Giả sử bạn đang viết một thành phần `Toggle` với trạng thái `isOn` bên trong có thể là `true` hoặc `false`. Có một vài cách khác nhau để chuyển đổi nó (bằng cách nhấp hoặc kéo). Bạn muốn thông báo cho thành phần cha bất cứ khi nào trạng thái bên trong `Toggle` thay đổi, vì vậy bạn hiển thị một sự kiện `onChange` và gọi nó từ một Effect:

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
Giống như trước đây, điều này không lý tưởng. `Toggle` cập nhật trạng thái của nó trước, và React cập nhật màn hình. Sau đó, React chạy Effect, gọi hàm `onChange` được truyền từ một thành phần cha. Bây giờ thành phần cha sẽ cập nhật trạng thái của chính nó, bắt đầu một lượt render khác. Sẽ tốt hơn nếu thực hiện mọi thứ trong một lượt duy nhất.

Xóa Effect và thay vào đó cập nhật trạng thái của *cả hai* thành phần trong cùng một trình xử lý sự kiện:

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Tốt: Thực hiện tất cả các cập nhật trong sự kiện gây ra chúng
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

Với cách tiếp cận này, cả thành phần `Toggle` và thành phần cha của nó đều cập nhật trạng thái của chúng trong sự kiện. React [gom các cập nhật](/learn/queueing-a-series-of-state-updates) từ các thành phần khác nhau lại với nhau, vì vậy sẽ chỉ có một lượt render.

Bạn cũng có thể loại bỏ hoàn toàn trạng thái và thay vào đó nhận `isOn` từ thành phần cha:

```js {1,2}
// ✅ Cũng tốt: thành phần được kiểm soát hoàn toàn bởi thành phần cha
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

["Nâng trạng thái lên"](/learn/sharing-state-between-components) cho phép thành phần cha kiểm soát hoàn toàn `Toggle` bằng cách chuyển đổi trạng thái của chính thành phần cha. Điều này có nghĩa là thành phần cha sẽ phải chứa nhiều logic hơn, nhưng sẽ có ít trạng thái tổng thể hơn để lo lắng. Bất cứ khi nào bạn cố gắng giữ cho hai biến trạng thái khác nhau được đồng bộ hóa, hãy thử nâng trạng thái lên thay thế!

### Truyền dữ liệu cho thành phần cha {/*passing-data-to-the-parent*/}

Thành phần `Child` này tìm nạp một số dữ liệu và sau đó truyền nó cho thành phần `Parent` trong một Effect:

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Tránh: Truyền dữ liệu cho thành phần cha trong một Effect
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

Trong React, dữ liệu chảy từ các thành phần cha xuống các thành phần con của chúng. Khi bạn thấy điều gì đó không đúng trên màn hình, bạn có thể theo dõi thông tin đến từ đâu bằng cách đi lên chuỗi thành phần cho đến khi bạn tìm thấy thành phần nào truyền sai prop hoặc có trạng thái sai. Khi các thành phần con cập nhật trạng thái của các thành phần cha của chúng trong Effects, luồng dữ liệu trở nên rất khó theo dõi. Vì cả thành phần con và thành phần cha đều cần cùng một dữ liệu, hãy để thành phần cha tìm nạp dữ liệu đó và *truyền nó xuống* cho thành phần con thay thế:

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Tốt: Truyền dữ liệu xuống cho thành phần con
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

Điều này đơn giản hơn và giữ cho luồng dữ liệu có thể dự đoán được: dữ liệu chảy xuống từ thành phần cha đến thành phần con.

### Đăng ký vào một kho bên ngoài {/*subscribing-to-an-external-store*/}

Đôi khi, các thành phần của bạn có thể cần đăng ký vào một số dữ liệu bên ngoài trạng thái React. Dữ liệu này có thể đến từ một thư viện của bên thứ ba hoặc một API trình duyệt tích hợp. Vì dữ liệu này có thể thay đổi mà React không hề hay biết, bạn cần đăng ký thủ công các thành phần của mình vào nó. Điều này thường được thực hiện với một Effect, ví dụ:

```js {2-17}
function useOnlineStatus() {
  // Không lý tưởng: Đăng ký kho thủ công trong một Effect
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

Ở đây, thành phần đăng ký vào một kho dữ liệu bên ngoài (trong trường hợp này, API `navigator.onLine` của trình duyệt). Vì API này không tồn tại trên máy chủ (vì vậy nó không thể được sử dụng cho HTML ban đầu), ban đầu trạng thái được đặt thành `true`. Bất cứ khi nào giá trị của kho dữ liệu đó thay đổi trong trình duyệt, thành phần sẽ cập nhật trạng thái của nó.

Mặc dù việc sử dụng Effects cho việc này là phổ biến, nhưng React có một Hook được xây dựng có mục đích để đăng ký vào một kho bên ngoài được ưu tiên hơn. Xóa Effect và thay thế nó bằng một lệnh gọi đến [`useSyncExternalStore`](/reference/react/useSyncExternalStore):

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
  // ✅ Tốt: Đăng ký vào một kho bên ngoài với một Hook tích hợp
  return useSyncExternalStore(
    subscribe, // React sẽ không đăng ký lại miễn là bạn truyền cùng một hàm
    () => navigator.onLine, // Cách lấy giá trị trên máy khách
    () => true // Cách lấy giá trị trên máy chủ
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Cách tiếp cận này ít gây ra lỗi hơn so với việc đồng bộ hóa thủ công dữ liệu có thể thay đổi với trạng thái React bằng một Effect. Thông thường, bạn sẽ viết một Hook tùy chỉnh như `useOnlineStatus()` ở trên để bạn không cần lặp lại mã này trong các thành phần riêng lẻ. [Đọc thêm về đăng ký vào các kho bên ngoài từ các thành phần React.](/reference/react/useSyncExternalStore)

### Tìm nạp dữ liệu {/*fetching-data*/}

Nhiều ứng dụng sử dụng Effects để bắt đầu tìm nạp dữ liệu. Việc viết một Effect tìm nạp dữ liệu như thế này là khá phổ biến:

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Tránh: Tìm nạp mà không có logic dọn dẹp
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

Bạn *không* cần phải di chuyển quá trình tìm nạp này sang một trình xử lý sự kiện.

Điều này có vẻ như một mâu thuẫn với các ví dụ trước đó, nơi bạn cần đặt logic vào các trình xử lý sự kiện! Tuy nhiên, hãy xem xét rằng không phải *sự kiện gõ* là lý do chính để tìm nạp. Các đầu vào tìm kiếm thường được điền trước từ URL và người dùng có thể điều hướng Quay lại và Chuyển tiếp mà không cần chạm vào đầu vào.

Không quan trọng `page` và `query` đến từ đâu. Trong khi thành phần này hiển thị, bạn muốn giữ cho `results` được [đồng bộ hóa](/learn/synchronizing-with-effects) với dữ liệu từ mạng cho `page` và `query` hiện tại. Đây là lý do tại sao nó là một Effect.

Tuy nhiên, mã trên có một lỗi. Hãy tưởng tượng bạn gõ `"hello"` nhanh. Sau đó, `query` sẽ thay đổi từ `"h"`, thành `"he"`, `"hel"`, `"hell"`, và `"hello"`. Điều này sẽ bắt đầu các quá trình tìm nạp riêng biệt, nhưng không có gì đảm bảo về thứ tự các phản hồi sẽ đến. Ví dụ: phản hồi `hell"` có thể đến *sau* phản hồi `"hello"`. Vì nó sẽ gọi `setResults()` cuối cùng, bạn sẽ hiển thị sai kết quả tìm kiếm. Điều này được gọi là một ["điều kiện cuộc đua"](https://en.wikipedia.org/wiki/Race_condition): hai yêu cầu khác nhau "chạy đua" với nhau và đến theo một thứ tự khác với những gì bạn mong đợi.

**Để khắc phục điều kiện cuộc đua, bạn cần [thêm một hàm dọn dẹp](/learn/synchronizing-with-effects#fetching-data) để bỏ qua các phản hồi cũ:**

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

Điều này đảm bảo rằng khi Effect của bạn tìm nạp dữ liệu, tất cả các phản hồi ngoại trừ phản hồi được yêu cầu cuối cùng sẽ bị bỏ qua.

Xử lý các điều kiện cuộc đua không phải là khó khăn duy nhất khi triển khai tìm nạp dữ liệu. Bạn cũng có thể muốn nghĩ về việc lưu vào bộ nhớ cache các phản hồi (để người dùng có thể nhấp vào Quay lại và xem màn hình trước đó ngay lập tức), cách tìm nạp dữ liệu trên máy chủ (để HTML được hiển thị ban đầu trên máy chủ chứa nội dung đã tìm nạp thay vì một trình quay), và cách tránh các thác nước mạng (để một thành phần con có thể tìm nạp dữ liệu mà không cần chờ đợi mọi thành phần cha).

**Những vấn đề này áp dụng cho bất kỳ thư viện giao diện người dùng nào, không chỉ React. Giải quyết chúng không phải là điều tầm thường, đó là lý do tại sao các [khung](/learn/start-a-new-react-project#production-grade-react-frameworks) hiện đại cung cấp các cơ chế tìm nạp dữ liệu tích hợp hiệu quả hơn so với việc tìm nạp dữ liệu trong Effects.**

Nếu bạn không sử dụng một khung (và không muốn xây dựng khung của riêng bạn) nhưng muốn làm cho việc tìm nạp dữ liệu từ Effects trở nên tiện dụng hơn, hãy cân nhắc trích xuất logic tìm nạp của bạn vào một Hook tùy chỉnh như trong ví dụ này:

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

Bạn có thể cũng muốn thêm một số logic để xử lý lỗi và theo dõi xem nội dung có đang tải hay không. Bạn có thể xây dựng một Hook như thế này cho chính mình hoặc sử dụng một trong nhiều giải pháp đã có sẵn trong hệ sinh thái React. **Mặc dù điều này một mình sẽ không hiệu quả bằng việc sử dụng cơ chế tìm nạp dữ liệu tích hợp của một khung, nhưng việc di chuyển logic tìm nạp dữ liệu vào một Hook tùy chỉnh sẽ giúp bạn dễ dàng áp dụng một chiến lược tìm nạp dữ liệu hiệu quả hơn sau này.**

Nói chung, bất cứ khi nào bạn phải dùng đến việc viết Effects, hãy để ý đến khi nào bạn có thể trích xuất một phần chức năng vào một Hook tùy chỉnh với một API khai báo và có mục đích xây dựng hơn như `useData` ở trên. Càng ít lệnh gọi `useEffect` thô mà bạn có trong các thành phần của mình, bạn sẽ càng thấy dễ dàng hơn để bảo trì ứng dụng của mình.

<Recap>

- Nếu bạn có thể tính toán một cái gì đó trong quá trình render, bạn không cần một Effect.
- Để lưu vào bộ nhớ cache các phép tính tốn kém, hãy thêm `useMemo` thay vì `useEffect`.
- Để đặt lại trạng thái của toàn bộ cây thành phần, hãy truyền một `key` khác cho nó.
- Để đặt lại một bit trạng thái cụ thể để đáp ứng với một thay đổi prop, hãy đặt nó trong quá trình render.
- Mã chạy vì một thành phần đã được *hiển thị* nên nằm trong Effects, phần còn lại nên nằm trong các sự kiện.
- Nếu bạn cần cập nhật trạng thái của một số thành phần, tốt hơn là thực hiện nó trong một sự kiện duy nhất.
- Bất cứ khi nào bạn cố gắng đồng bộ hóa các biến trạng thái trong các thành phần khác nhau, hãy cân nhắc nâng trạng thái lên.
- Bạn có thể tìm nạp dữ liệu với Effects, nhưng bạn cần triển khai dọn dẹp để tránh các điều kiện cuộc đua.

</Recap>

<Challenges>

#### Chuyển đổi dữ liệu mà không cần Effects {/*transform-data-without-effects*/}

`TodoList` bên dưới hiển thị một danh sách các todo. Khi hộp kiểm "Chỉ hiển thị các todo đang hoạt động" được đánh dấu, các todo đã hoàn thành sẽ không được hiển thị trong danh sách. Bất kể todo nào hiển thị, chân trang hiển thị số lượng todo chưa hoàn thành.

Đơn giản hóa thành phần này bằng cách loại bỏ tất cả các trạng thái và Effects không cần thiết.

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

Nếu bạn có thể tính toán một cái gì đó trong quá trình render, bạn không cần trạng thái hoặc một Effect để cập nhật nó.

</Hint>

<Solution>

Chỉ có hai phần trạng thái thiết yếu trong ví dụ này: danh sách `todos` và biến trạng thái `showActive` đại diện cho việc hộp kiểm có được đánh dấu hay không. Tất cả các biến trạng thái khác đều [dư thừa](/learn/choosing-the-state-structure#avoid-redundant-state) và có thể được tính toán trong quá trình render thay thế. Điều này bao gồm cả `footer` mà bạn có thể di chuyển trực tiếp vào JSX xung quanh.

Kết quả của bạn sẽ trông như thế này:

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

#### Cache một phép tính mà không cần Effects {/*cache-a-calculation-without-effects*/}

Trong ví dụ này, việc lọc các todo đã được trích xuất thành một hàm riêng biệt có tên là `getVisibleTodos()`. Hàm này chứa một lệnh gọi `console.log()` bên trong nó giúp bạn nhận thấy khi nào nó đang được gọi. Chuyển đổi "Chỉ hiển thị các todo đang hoạt động" và nhận thấy rằng nó khiến `getVisibleTodos()` chạy lại. Điều này là dự kiến vì các todo hiển thị thay đổi khi bạn chuyển đổi những todo nào sẽ hiển thị.

Nhiệm vụ của bạn là loại bỏ Effect tính toán lại danh sách `visibleTodos` trong thành phần `TodoList`. Tuy nhiên, bạn cần đảm bảo rằng `getVisibleTodos()` *không* chạy lại (và do đó không in bất kỳ nhật ký nào) khi bạn nhập vào đầu vào.

<Hint>

Một giải pháp là thêm một lệnh gọi `useMemo` để lưu vào bộ nhớ cache các todo hiển thị. Ngoài ra còn có một giải pháp khác, ít rõ ràng hơn.

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

Xóa biến trạng thái và Effect, và thay vào đó thêm một lệnh gọi `useMemo` để lưu vào bộ nhớ cache kết quả của việc gọi `getVisibleTodos()`:

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

Với thay đổi này, `getVisibleTodos()` sẽ chỉ được gọi nếu `todos` hoặc `showActive` thay đổi. Nhập vào đầu vào chỉ thay đổi biến trạng thái `text`, vì vậy nó không kích hoạt một lệnh gọi đến `getVisibleTodos()`.

Ngoài ra còn có một giải pháp khác không cần `useMemo`. Vì biến trạng thái `text` không thể ảnh hưởng đến danh sách các todo, bạn có thể trích xuất biểu mẫu `NewTodo` thành một thành phần riêng biệt và di chuyển biến trạng thái `text` vào bên trong nó:

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

Cách tiếp cận này cũng đáp ứng các yêu cầu. Khi bạn nhập vào đầu vào, chỉ biến trạng thái `text` được cập nhật. Vì biến trạng thái `text` nằm trong thành phần con `NewTodo`, thành phần `TodoList` cha sẽ không được render lại. Đây là lý do tại sao `getVisibleTodos()` không được gọi khi bạn nhập. (Nó vẫn sẽ được gọi nếu `TodoList` render lại vì một lý do khác.)

</Solution>

#### Đặt lại trạng thái mà không cần Effects {/*reset-state-without-effects*/}

Thành phần `EditContact` này nhận một đối tượng liên hệ có dạng như `{ id, name, email }` làm prop `savedContact`. Hãy thử chỉnh sửa các trường nhập tên và email. Khi bạn nhấn Lưu, nút liên hệ phía trên biểu mẫu sẽ cập nhật theo tên đã chỉnh sửa. Khi bạn nhấn Đặt lại, mọi thay đổi đang chờ xử lý trong biểu mẫu sẽ bị loại bỏ. Hãy chơi với giao diện người dùng này để làm quen với nó.

Khi bạn chọn một liên hệ bằng các nút ở trên cùng, biểu mẫu sẽ đặt lại để phản ánh chi tiết của liên hệ đó. Điều này được thực hiện bằng một Effect bên trong `EditContact.js`. Loại bỏ Effect này. Tìm một cách khác để đặt lại biểu mẫu khi `savedContact.id` thay đổi.


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

Nếu có cách nào để báo cho React biết rằng khi `savedContact.id` khác, thì biểu mẫu `EditContact` về mặt khái niệm là _biểu mẫu của một liên hệ khác_ và không nên giữ lại trạng thái. Bạn có nhớ cách nào như vậy không?
</Hint>

<Solution>

Chia thành phần `EditContact` thành hai. Chuyển tất cả trạng thái biểu mẫu vào thành phần `EditForm` bên trong. Xuất thành phần `EditContact` bên ngoài và làm cho nó truyền `savedContact.id` làm `key` cho thành phần `EditForm` bên trong. Do đó, thành phần `EditForm` bên trong sẽ đặt lại tất cả trạng thái biểu mẫu và tạo lại DOM bất cứ khi nào bạn chọn một liên hệ khác.

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

#### Gửi biểu mẫu mà không cần Hiệu ứng {/*submit-a-form-without-effects*/}

Thành phần `Form` này cho phép bạn gửi tin nhắn cho một người bạn. Khi bạn gửi biểu mẫu, biến trạng thái `showForm` được đặt thành `false`. Điều này kích hoạt một Hiệu ứng gọi `sendMessage(message)`, để gửi tin nhắn (bạn có thể thấy nó trong bảng điều khiển). Sau khi tin nhắn được gửi, bạn sẽ thấy một hộp thoại "Cảm ơn" với nút "Mở trò chuyện" cho phép bạn quay lại biểu mẫu.

Người dùng ứng dụng của bạn đang gửi quá nhiều tin nhắn. Để làm cho việc trò chuyện trở nên khó khăn hơn một chút, bạn đã quyết định hiển thị hộp thoại "Cảm ơn" *trước* thay vì biểu mẫu. Thay đổi biến trạng thái `showForm` để khởi tạo thành `false` thay vì `true`. Ngay sau khi bạn thực hiện thay đổi đó, bảng điều khiển sẽ hiển thị rằng một tin nhắn trống đã được gửi. Có gì đó không đúng trong logic này!

Đâu là nguyên nhân gốc rễ của vấn đề này? Và làm thế nào bạn có thể sửa nó?

<Hint>

Có phải tin nhắn được gửi _vì_ người dùng đã thấy hộp thoại "Cảm ơn"? Hay là ngược lại?

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

Biến trạng thái `showForm` xác định xem có hiển thị biểu mẫu hay hộp thoại "Cảm ơn". Tuy nhiên, bạn không gửi tin nhắn vì hộp thoại "Cảm ơn" đã được _hiển thị_. Bạn muốn gửi tin nhắn vì người dùng đã _gửi biểu mẫu_. Xóa Hiệu ứng gây hiểu lầm và di chuyển lệnh gọi `sendMessage` vào bên trong trình xử lý sự kiện `handleSubmit`:

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

Lưu ý cách trong phiên bản này, chỉ _gửi biểu mẫu_ (đó là một sự kiện) mới khiến tin nhắn được gửi. Nó hoạt động tốt như nhau bất kể `showForm` ban đầu được đặt thành `true` hay `false`. (Đặt nó thành `false` và lưu ý không có thêm tin nhắn bảng điều khiển.)

</Solution>

</Challenges>
