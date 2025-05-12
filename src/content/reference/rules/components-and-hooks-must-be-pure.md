---
title: Các thành phần và Hook phải thuần khiết
---

<Intro>
Các hàm thuần khiết chỉ thực hiện một phép tính và không làm gì khác. Nó giúp mã của bạn dễ hiểu, gỡ lỗi hơn và cho phép React tự động tối ưu hóa các thành phần và Hook của bạn một cách chính xác.
</Intro>

<Note>
Trang tham khảo này bao gồm các chủ đề nâng cao và yêu cầu bạn phải làm quen với các khái niệm được đề cập trong trang [Giữ cho các thành phần thuần khiết](/learn/keeping-components-pure).
</Note>

<InlineToc />

### Tại sao tính thuần khiết lại quan trọng? {/*why-does-purity-matter*/}

Một trong những khái niệm chính làm nên React, _React_ là _tính thuần khiết_. Một thành phần hoặc hook thuần khiết là một thành phần:

*   **Idempotent (Tính lũy đẳng)** – Bạn [luôn nhận được kết quả giống nhau mỗi khi](/learn/keeping-components-pure#purity-components-as-formulas) bạn chạy nó với cùng một đầu vào – props, state, context cho đầu vào thành phần; và các đối số cho đầu vào hook.
*   **Không có tác dụng phụ trong quá trình render** – Mã có tác dụng phụ nên chạy [**tách biệt với quá trình render**](#how-does-react-run-your-code). Ví dụ: như một [trình xử lý sự kiện](/learn/responding-to-events) – nơi người dùng tương tác với giao diện người dùng và khiến nó cập nhật; hoặc như một [Effect](/reference/react/useEffect) – chạy sau khi render.
*   **Không làm thay đổi các giá trị không cục bộ**: Các thành phần và Hook không bao giờ được [sửa đổi các giá trị không được tạo cục bộ](#mutation) trong quá trình render.

Khi quá trình render được giữ thuần khiết, React có thể hiểu cách ưu tiên các bản cập nhật nào là quan trọng nhất để người dùng thấy trước. Điều này có thể thực hiện được nhờ tính thuần khiết của quá trình render: vì các thành phần không có tác dụng phụ [trong quá trình render](#how-does-react-run-your-code), React có thể tạm dừng render các thành phần không quan trọng bằng cách cập nhật và chỉ quay lại chúng sau khi cần.

Cụ thể, điều này có nghĩa là logic render có thể được chạy nhiều lần theo cách cho phép React mang lại cho người dùng của bạn trải nghiệm người dùng dễ chịu. Tuy nhiên, nếu thành phần của bạn có một tác dụng phụ không được theo dõi – chẳng hạn như sửa đổi giá trị của một biến toàn cục [trong quá trình render](#how-does-react-run-your-code) – khi React chạy lại mã render của bạn, các tác dụng phụ của bạn sẽ được kích hoạt theo cách không khớp với những gì bạn muốn. Điều này thường dẫn đến các lỗi không mong muốn có thể làm giảm trải nghiệm ứng dụng của người dùng. Bạn có thể xem [ví dụ về điều này trong trang Giữ cho các thành phần thuần khiết](/learn/keeping-components-pure#side-effects-unintended-consequences).

#### React chạy mã của bạn như thế nào? {/*how-does-react-run-your-code*/}

React là khai báo: bạn cho React biết _cái gì_ để render và React sẽ tìm ra _cách_ tốt nhất để hiển thị nó cho người dùng của bạn. Để làm điều này, React có một vài giai đoạn để chạy mã của bạn. Bạn không cần phải biết về tất cả các giai đoạn này để sử dụng React tốt. Nhưng ở cấp độ cao, bạn nên biết về mã nào chạy trong _render_ và mã nào chạy bên ngoài nó.

_Rendering_ đề cập đến việc tính toán giao diện của phiên bản tiếp theo của giao diện người dùng của bạn. Sau khi render, [Effects](/reference/react/useEffect) được _flush_ (có nghĩa là chúng được chạy cho đến khi không còn cái nào nữa) và có thể cập nhật phép tính nếu Effects có tác động đến bố cục. React lấy phép tính mới này và so sánh nó với phép tính được sử dụng để tạo phiên bản trước của giao diện người dùng của bạn, sau đó _commit_ chỉ những thay đổi tối thiểu cần thiết cho [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) (những gì người dùng của bạn thực sự thấy) để bắt kịp phiên bản mới nhất.

<DeepDive>

#### Làm thế nào để biết mã có chạy trong quá trình render hay không {/*how-to-tell-if-code-runs-in-render*/}

Một phương pháp heuristic nhanh chóng để biết liệu mã có chạy trong quá trình render hay không là kiểm tra vị trí của nó: nếu nó được viết ở cấp cao nhất như trong ví dụ bên dưới, thì rất có thể nó chạy trong quá trình render.

```js {2}
function Dropdown() {
  const selectedItems = new Set(); // được tạo trong quá trình render
  // ...
}
```

Trình xử lý sự kiện và Effects không chạy trong quá trình render:

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  const onSelect = (item) => {
    // mã này nằm trong trình xử lý sự kiện, vì vậy nó chỉ được chạy khi người dùng kích hoạt nó
    selectedItems.add(item);
  }
}
```

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  useEffect(() => {
    // mã này nằm bên trong Effect, vì vậy nó chỉ chạy sau khi render
    logForAnalytics(selectedItems);
  }, [selectedItems]);
}
```

</DeepDive>

---

## Các thành phần và Hook phải là idempotent {/*components-and-hooks-must-be-idempotent*/}

Các thành phần phải luôn trả về cùng một đầu ra đối với đầu vào của chúng – props, state và context. Điều này được gọi là _idempotency_ (tính lũy đẳng). [Idempotency](https://en.wikipedia.org/wiki/Idempotence) là một thuật ngữ được phổ biến trong lập trình hàm. Nó đề cập đến ý tưởng rằng bạn [luôn nhận được kết quả giống nhau mỗi khi](learn/keeping-components-pure) bạn chạy đoạn mã đó với cùng một đầu vào.

Điều này có nghĩa là _tất cả_ mã chạy [trong quá trình render](#how-does-react-run-your-code) cũng phải là idempotent để quy tắc này có hiệu lực. Ví dụ: dòng mã này không phải là idempotent (và do đó, thành phần cũng không phải):

```js {2}
function Clock() {
  const time = new Date(); // 🔴 Sai: luôn trả về một kết quả khác!
  return <span>{time.toLocaleString()}</span>
}
```

`new Date()` không phải là idempotent vì nó luôn trả về ngày hiện tại và thay đổi kết quả của nó mỗi khi nó được gọi. Khi bạn render thành phần trên, thời gian hiển thị trên màn hình sẽ bị kẹt vào thời điểm thành phần được render. Tương tự, các hàm như `Math.random()` cũng không phải là idempotent, vì chúng trả về các kết quả khác nhau mỗi khi chúng được gọi, ngay cả khi đầu vào giống nhau.

Điều này không có nghĩa là bạn không nên sử dụng các hàm không idempotent như `new Date()` _hoàn toàn_ – bạn chỉ nên tránh sử dụng chúng [trong quá trình render](#how-does-react-run-your-code). Trong trường hợp này, chúng ta có thể _đồng bộ hóa_ ngày mới nhất với thành phần này bằng cách sử dụng [Effect](/reference/react/useEffect):

<Sandpack>

```js
import { useState, useEffect } from 'react';

function useTime() {
  // 1. Theo dõi trạng thái của ngày hiện tại. `useState` nhận một hàm khởi tạo làm trạng thái ban đầu của nó.
  //    Nó chỉ chạy một lần khi hook được gọi, vì vậy chỉ ngày hiện tại tại thời điểm hook được gọi được đặt trước.
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // 2. Cập nhật ngày hiện tại mỗi giây bằng cách sử dụng `setInterval`.
    const id = setInterval(() => {
      setTime(new Date()); // ✅ Tốt: mã không idempotent không còn chạy trong quá trình render
    }, 1000);
    // 3. Trả về một hàm dọn dẹp để chúng ta không làm rò rỉ bộ hẹn giờ `setInterval`.
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Clock() {
  const time = useTime();
  return <span>{time.toLocaleString()}</span>;
}
```

</Sandpack>

Bằng cách gói lệnh gọi `new Date()` không idempotent trong một Effect, nó sẽ di chuyển phép tính đó [ra khỏi quá trình render](#how-does-react-run-your-code).

Nếu bạn không cần đồng bộ hóa một số trạng thái bên ngoài với React, bạn cũng có thể cân nhắc sử dụng [trình xử lý sự kiện](/learn/responding-to-events) nếu nó chỉ cần được cập nhật để đáp ứng với tương tác của người dùng.

---

## Các tác dụng phụ phải chạy bên ngoài quá trình render {/*side-effects-must-run-outside-of-render*/}

[Các tác dụng phụ](/learn/keeping-components-pure#side-effects-unintended-consequences) không nên chạy [trong quá trình render](#how-does-react-run-your-code), vì React có thể render các thành phần nhiều lần để tạo ra trải nghiệm người dùng tốt nhất có thể.

<Note>
Tác dụng phụ là một thuật ngữ rộng hơn Effects. Effects đặc biệt đề cập đến mã được gói trong `useEffect`, trong khi tác dụng phụ là một thuật ngữ chung cho mã có bất kỳ tác dụng quan sát được nào khác ngoài kết quả chính của nó là trả về một giá trị cho người gọi.

Tác dụng phụ thường được viết bên trong [trình xử lý sự kiện](/learn/responding-to-events) hoặc Effects. Nhưng không bao giờ trong quá trình render.
</Note>

Mặc dù quá trình render phải được giữ thuần khiết, nhưng các tác dụng phụ là cần thiết tại một thời điểm nào đó để ứng dụng của bạn có thể làm bất cứ điều gì thú vị, như hiển thị thứ gì đó trên màn hình! Điểm mấu chốt của quy tắc này là các tác dụng phụ không nên chạy [trong quá trình render](#how-does-react-run-your-code), vì React có thể render các thành phần nhiều lần. Trong hầu hết các trường hợp, bạn sẽ sử dụng [trình xử lý sự kiện](learn/responding-to-events) để xử lý các tác dụng phụ. Sử dụng trình xử lý sự kiện sẽ cho React biết một cách rõ ràng rằng mã này không cần chạy trong quá trình render, giữ cho quá trình render thuần khiết. Nếu bạn đã sử dụng hết tất cả các tùy chọn – và chỉ là phương sách cuối cùng – bạn cũng có thể xử lý các tác dụng phụ bằng cách sử dụng `useEffect`.

### Khi nào thì được phép có mutation? {/*mutation*/}

#### Mutation cục bộ {/*local-mutation*/}

Một ví dụ phổ biến về tác dụng phụ là mutation, trong JavaScript đề cập đến việc thay đổi giá trị của một giá trị không phải là [primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive). Nói chung, mặc dù mutation không phải là thành ngữ trong React, nhưng mutation _cục bộ_ hoàn toàn ổn:

```js {2,7}
function FriendList({ friends }) {
  const items = []; // ✅ Tốt: được tạo cục bộ
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // ✅ Tốt: mutation cục bộ là ổn
  }
  return <section>{items}</section>;
}
```

Không cần phải bóp méo mã của bạn để tránh mutation cục bộ. [`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) cũng có thể được sử dụng ở đây để ngắn gọn, nhưng không có gì sai khi tạo một mảng cục bộ và sau đó đẩy các mục vào đó [trong quá trình render](#how-does-react-run-your-code).

Mặc dù có vẻ như chúng ta đang thay đổi `items`, nhưng điểm mấu chốt cần lưu ý là mã này chỉ thực hiện _cục bộ_ – mutation không được "ghi nhớ" khi thành phần được render lại. Nói cách khác, `items` chỉ tồn tại chừng nào thành phần còn tồn tại. Vì `items` luôn được _tạo lại_ mỗi khi `<FriendList />` được render, thành phần sẽ luôn trả về cùng một kết quả.

Mặt khác, nếu `items` được tạo bên ngoài thành phần, nó sẽ giữ lại các giá trị trước đó và ghi nhớ các thay đổi:

```js {1,7}
const items = []; // 🔴 Sai: được tạo bên ngoài thành phần
function FriendList({ friends }) {
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // 🔴 Sai: thay đổi một giá trị được tạo bên ngoài quá trình render
  }
  return <section>{items}</section>;
}
```

Khi `<FriendList />` chạy lại, chúng ta sẽ tiếp tục nối `friends` vào `items` mỗi khi thành phần đó được chạy, dẫn đến nhiều kết quả trùng lặp. Phiên bản `<FriendList />` này có các tác dụng phụ có thể quan sát được [trong quá trình render](#how-does-react-run-your-code) và **phá vỡ quy tắc**.

#### Khởi tạo lazy {/*lazy-initialization*/}

Khởi tạo lazy cũng ổn mặc dù không hoàn toàn "thuần khiết":

```js {2}
function ExpenseForm() {
  SuperCalculator.initializeIfNotReady(); // ✅ Tốt: nếu nó không ảnh hưởng đến các thành phần khác
  // Tiếp tục render...
}
```

#### Thay đổi DOM {/*changing-the-dom*/}

Các tác dụng phụ hiển thị trực tiếp cho người dùng không được phép trong logic render của các thành phần React. Nói cách khác, chỉ cần gọi một hàm thành phần không được tự nó tạo ra một thay đổi trên màn hình.

```js {2}
function ProductDetailPage({ product }) {
  document.title = product.title; // 🔴 Sai: Thay đổi DOM
}
```

Một cách để đạt được kết quả mong muốn là cập nhật `document.title` bên ngoài quá trình render là [đồng bộ hóa thành phần với `document`](/learn/synchronizing-with-effects).

Miễn là việc gọi một thành phần nhiều lần là an toàn và không ảnh hưởng đến quá trình render của các thành phần khác, React không quan tâm nếu nó thuần khiết 100% theo nghĩa lập trình hàm nghiêm ngặt của từ này. Điều quan trọng hơn là [các thành phần phải là idempotent](/reference/rules/components-and-hooks-must-be-pure).

---

## Props và state là bất biến {/*props-and-state-are-immutable*/}

Props và state của một thành phần là [ảnh chụp nhanh](learn/state-as-a-snapshot) bất biến. Không bao giờ thay đổi chúng trực tiếp. Thay vào đó, hãy truyền các props mới xuống và sử dụng hàm setter từ `useState`.

Bạn có thể coi các giá trị props và state là ảnh chụp nhanh được cập nhật sau khi render. Vì lý do này, bạn không sửa đổi trực tiếp các biến props hoặc state: thay vào đó, bạn truyền các props mới hoặc sử dụng hàm setter được cung cấp cho bạn để cho React biết rằng state cần cập nhật vào lần thành phần được render tiếp theo.

### Không thay đổi Props {/*props*/}

Props là bất biến vì nếu bạn thay đổi chúng, ứng dụng sẽ tạo ra đầu ra không nhất quán, điều này có thể khó gỡ lỗi vì nó có thể hoạt động hoặc không hoạt động tùy thuộc vào hoàn cảnh.

```js {2}
function Post({ item }) {
  item.url = new Url(item.url, base); // 🔴 Sai: không bao giờ thay đổi props trực tiếp
  return <Link url={item.url}>{item.title}</Link>;
}
```

```js {2}
function Post({ item }) {
  const url = new Url(item.url, base); // ✅ Tốt: thay vào đó hãy tạo một bản sao
  return <Link url={url}>{item.title}</Link>;
}
```

### Không thay đổi State {/*state*/}

`useState` trả về biến state và một setter để cập nhật state đó.

```js
const [stateVariable, setter] = useState(0);
```

Thay vì cập nhật biến state tại chỗ, chúng ta cần cập nhật nó bằng hàm setter được trả về bởi `useState`. Thay đổi các giá trị trên biến state không khiến thành phần cập nhật, khiến người dùng của bạn có một giao diện người dùng lỗi thời. Sử dụng hàm setter thông báo cho React rằng state đã thay đổi và chúng ta cần xếp hàng đợi render lại để cập nhật giao diện người dùng.

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    count = count + 1; // 🔴 Sai: không bao giờ thay đổi state trực tiếp
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // ✅ Tốt: sử dụng hàm setter được trả về bởi useState
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

---

## Các giá trị trả về và đối số cho Hook là bất biến {/*return-values-and-arguments-to-hooks-are-immutable*/}

Sau khi các giá trị được truyền cho một hook, bạn không nên sửa đổi chúng. Giống như props trong JSX, các giá trị trở nên bất biến khi được truyền cho một hook.

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  if (icon.enabled) {
    icon.className = computeStyle(icon, theme); // 🔴 Sai: không bao giờ thay đổi trực tiếp các đối số hook
  }
  return icon;
}
```

```js {3}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  const newIcon = { ...icon }; // ✅ Tốt: thay vào đó hãy tạo một bản sao
  if (icon.enabled) {
    newIcon.className = computeStyle(icon, theme);
  }
  return newIcon;
}
```

Một nguyên tắc quan trọng trong React là _lý luận cục bộ_: khả năng hiểu những gì một thành phần hoặc hook làm bằng cách xem xét mã của nó một cách riêng biệt. Các hook nên được coi là "hộp đen" khi chúng được gọi. Ví dụ: một hook tùy chỉnh có thể đã sử dụng các đối số của nó làm phần phụ thuộc để ghi nhớ các giá trị bên trong nó:

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);

  return useMemo(() => {
    const newIcon = { ...icon };
    if (icon.enabled) {
      newIcon.className = computeStyle(icon, theme);
    }
    return newIcon;
  }, [icon, theme]);
}
```

Nếu bạn thay đổi các đối số của Hook, quá trình ghi nhớ của hook tùy chỉnh sẽ trở nên không chính xác, vì vậy điều quan trọng là phải tránh làm điều đó.

```js {4}
style = useIconStyle(icon);         // `style` được ghi nhớ dựa trên `icon`
icon.enabled = false;               // Sai: 🔴 không bao giờ thay đổi trực tiếp các đối số hook
style = useIconStyle(icon);         // kết quả được ghi nhớ trước đó được trả về
```

```js {4}
style = useIconStyle(icon);         // `style` được ghi nhớ dựa trên `icon`
icon = { ...icon, enabled: false }; // Tốt: ✅ thay vào đó hãy tạo một bản sao
style = useIconStyle(icon);         // giá trị mới của `style` được tính toán
```

Tương tự, điều quan trọng là không sửa đổi các giá trị trả về của Hook, vì chúng có thể đã được ghi nhớ.

---

## Các giá trị là bất biến sau khi được truyền cho JSX {/*values-are-immutable-after-being-passed-to-jsx*/}

Không thay đổi các giá trị sau khi chúng đã được sử dụng trong JSX. Di chuyển mutation trước khi JSX được tạo.

Khi bạn sử dụng JSX trong một biểu thức, React có thể đánh giá JSX một cách háo hức trước khi thành phần kết thúc render. Điều này có nghĩa là việc thay đổi các giá trị sau khi chúng đã được truyền cho JSX có thể dẫn đến giao diện người dùng lỗi thời, vì React sẽ không biết cập nhật đầu ra của thành phần.

```js {4}
function Page({ colour }) {
  const styles = { colour, size: "large" };
  const header = <Header styles={styles} />;
  styles.size = "small"; // 🔴 Sai: styles đã được sử dụng trong JSX ở trên
  const footer = <Footer styles={styles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```

```js {4}
function Page({ colour }) {
  const headerStyles = { colour, size: "large" };
  const header = <Header styles={headerStyles} />;
  const footerStyles = { colour, size: "small" }; // ✅ Tốt: chúng ta đã tạo một giá trị mới
  const footer = <Footer styles={footerStyles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```
