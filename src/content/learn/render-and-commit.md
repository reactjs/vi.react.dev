---
title: Render và Commit
---

<Intro>

Trước khi các component của bạn được hiển thị trên màn hình, chúng sẽ được render bởi React. Việc hiểu được các bước trong quá trình này sẽ giúp bạn suy nghĩ về cách mà code của bạn thực thi và giải thích được hành vi của nó.

</Intro>

<YouWillLearn>

* Render nghĩa là gì trong React
* Khi nào và tại sao React render một component
* Các bước liên quan tới việc hiển thị một component lên màn hình
* Tại sao render không phải lúc nào cũng sinh ra một lần cập nhật DOM

</YouWillLearn>

Hãy tưởng tượng rằng các component của bạn là các đầu bếp đang chế biến các món ăn ngon bằng nguyên liệu trong nhà bếp. Trong ngữ cảnh này, React là người bồi bàn nhận các yêu cầu gọi món từ khách hàng và phục vụ các món ăn cho họ. Quy trình yêu cầu và phục vụ giao diện sẽ gồm 3 bước:

1. **Trigger** một lần render (chuyển yêu cầu gọi món của khách tới nhà bếp)
2. **Render** một component (chuẩn bị các món ăn bên trong nhà bếp)
3. **Commit** vào DOM (bày các món ăn lên bàn)

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="The Card Chef gives React a fresh Card component." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React delivers the Card to the user at their table." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## Bước 1: Trigger một lần render {/*step-1-trigger-a-render*/}

Có hai lý do khiến một component phải render:
1. Đó là lần **render khởi tạo** của component đó.
2. **State** của component đó (hoặc của các component bọc ngoài nó) bị thay đổi.

### Render khởi tạo {/*initial-render*/}

Khi ứng dụng của bạn khởi chạy, bạn cần phải trigger một lần render khởi tạo. Các framework và sandbox đôi khi thường ẩn đoạn code này đi, nhưng nó được thực hiện bằng cách gọi hàm [`createRoot`](/reference/react-dom/client/createRoot) cùng với DOM node, sau đó gọi phương thức `render` cùng component của bạn:

<Sandpack>

```js src/index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js src/Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

</Sandpack>

Thử comment dòng gọi `root.render()` lại và bạn sẽ thấy component đó biến mất!

### Render lại khi state cập nhật {/*re-renders-when-state-updates*/}

Khi component đã được render khởi tạo, bạn có thể trigger thêm nhiều lần render khác bằng cách cập nhật lại state của nó bằng [`set` function.](/reference/react/useState#setstate) Việc cập nhật lại state cho component của bạn sẽ tự động yêu cầu một lần render. (Bạn có thể tưởng tượng những thứ này giống như việc một vị khách trong nhà hàng đang gọi thêm trà, món tráng miệng và các món khác sau lần gọi món đầu tiên, tùy thuộc vào trạng thái đói hay khát của họ).

<IllustrationBlock sequential>
  <Illustration caption="State update..." alt="React as a server in a restaurant, serving a Card UI to the user, represented as a patron with a cursor for their head. The patron expresses they want a pink card, not a black one!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...triggers..." alt="React returns to the Component Kitchen and tells the Card Chef they need a pink Card." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="The Card Chef gives React the pink Card." src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## Bước 2: React render các component của bạn {/*step-2-react-renders-your-components*/}

Sau khi bạn trigger một lần render, React sẽ gọi tới các component của bạn để xác định cái gì cần hiển thị lên màn hình. **"Rendering" nghĩa là React đang gọi tới các component của bạn.**

* **Trong lần render khởi tạo,** React sẽ gọi tới root component.
* **Trong các lần render tiếp theo,** React sẽ gọi tới function component có chứa state bị thay đổi và trigger việc render. 

Quá trình này là một vòng lặp đệ quy: nếu component được cập nhật trả về component thì React tiếp theo sẽ render component _đó_, và nếu component đó lại cũng trả về một component khác thì React sẽ lại tiếp tục render component và cứ thế. Quá trình này sẽ kéo dài cho tới khi không còn component lồng nhau nào nữa và React biết chính xác cái gì sẽ được hiển thị lên màn hình. 

<<<<<<< HEAD
Trong ví dụ phía dưới, React sẽ gọi tới `Gallery()` và `Image()` nhiều lần:
=======
In the following example, React will call `Gallery()` and `Image()` several times:
>>>>>>> 2859efa07357dfc2927517ce9765515acf903c7c

<Sandpack>

```js src/Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

```js src/index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **Trong lần render khởi tạo,** React sẽ [tạo ra các DOM node](https://developer.mozilla.org/docs/Web/API/Document/createElement) cho các thẻ `<section>`, `<h1>`, and ba thẻ `<img>`.
* **Trong lần render lại,** React sẽ tính toán xem có thuộc tính nào của chúng đã thay đổi kể từ lần render trước đó không. React sẽ xử lý các thông tin đó ở tới bước tiếp theo, giai đoạn commit. 

<Pitfall>

Render luôn phải là một [phép tính toán thuần khiết](/learn/keeping-components-pure):

* **Cùng một đầu vào thì đầu ra tương ứng.** Với các đầu vào giống nhau, một component nên luôn luôn trả về đoạn JSX tương ứng. (Khi một ai đó gọi món salad với cà chua sống, họ không nên nhận được món salad với hành tây!)

* **Chỉ quan tâm đến việc của nó.** Nó không nên thay đổi bất kì object hay variable nào tồn tại trước lúc render. (Một đơn gọi món không nên thay đổi các đơn gọi món khác)

Nếu không, bạn có thể sẽ gặp phải các lỗi khó hiểu và khó lường trước được hành vi của chúng khi codebase của bạn phát triển phức tạp. Khi phát triển trong chế độ "Strict Mode", React sẽ gọi tới từng function của component 2 lần, giúp dễ xác định các lỗi sinh ra bởi các function không thuần khiết.

</Pitfall>

<DeepDive>

#### Tối ưu hiệu suất {/*optimizing-performance*/}

Hành vi mặc định của việc render tất cả các component lồng bên trong một component được cập nhật sẽ không tối ưu cho hiệu suất nếu component đó nằm ở một vị trí cao trong cây. Nếu bạn gặp phải vấn đề về hiệu suất, có rất nhiều cách chủ động để giải quyết nó được mô tả cụ thể ở trong phần [Performance](https://reactjs.org/docs/optimizing-performance.html). **Nhưng đừng vội vàng tối ưu hóa!**

</DeepDive>

## Step 3: React commit các thay đổi vào DOM {/*step-3-react-commits-changes-to-the-dom*/}

<<<<<<< HEAD
Sau khi render (gọi tới) các component của bạn, React sẽ thay đổi DOM.

* **Đối với lần render khởi tạo,** React sẽ dùng DOM API [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) để hiển thị tất cả các DOM node mà nó đã tạo ra lên trên màn hình.
=======
After rendering (calling) your components, React will modify the DOM.

* **For the initial render,** React will use the [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API to put all the DOM nodes it has created on screen.
* **For re-renders,** React will apply the minimal necessary operations (calculated while rendering!) to make the DOM match the latest rendering output.
>>>>>>> 2859efa07357dfc2927517ce9765515acf903c7c

* **Đối với các lần render lại,** React sẽ áp dụng các thao tác tối thiểu cần thiết (được tính toán trong khi render!) để làm cho DOM khớp với kết quả render mới nhất.

**React chỉ thay đổi các DOM node nếu có sự khác biệt giữa các lần render.** Ví dụ, dưới đây là một component bị render lại mỗi giây với các props khác nhau được truyền từ component cha của nó. Lưu ý rằng bạn có thể thêm văn bản vào `<input>`, cập nhật `value` của nó, nhưng đoạn văn bản kia sẽ không biến mất khi component render lại:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

Điều này hoạt động bởi vì trong bước cuối cùng này, React chỉ cập nhật nội dung của thẻ `<h1>` với giá trị `time` mới. Nó thấy rằng thẻ `<input>` vẫn xuất hiện tại vị trí đó trong đoạn JSX, nên React không hề đụng vào thẻ `<input>` hay thuộc tính `value` của nó!

## Tổng kết: Trình duyệt vẽ  {/*epilogue-browser-paint*/}

Sau khi quá trình render được hoàn tất và React đã cập nhật xong DOM, trình duyệt sẽ tiến hành vẽ lại màn hình. Mặc dù quá trình này thường được biết đến là "render", nhưng chúng ta sẽ gọi nó là "vẽ" để tránh nhầm lẫn xuyên suốt tài liệu này.  

<Illustration alt="A browser painting 'still life with card element'." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* Bất cứ khi nào màn hình được cập nhật trong một ứng dụng React thì đều cần 3 bước:
  1. Trigger
  2. Render
  3. Commit
* Bạn có thể dùng Strict Mode để tìm các lỗi sai trong các component của bạn
* React không đụng vào DOM nếu kết quả render của nó giống với lần render trước.
</Recap>