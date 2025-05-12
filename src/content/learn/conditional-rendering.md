---
title: Kết xuất có điều kiện
---

<Intro>

Các component của bạn thường cần hiển thị những thứ khác nhau tùy thuộc vào các điều kiện khác nhau. Trong React, bạn có thể kết xuất JSX có điều kiện bằng cú pháp JavaScript như câu lệnh `if`, `&&` và toán tử `? :`.

</Intro>

<YouWillLearn>

* Cách trả về JSX khác nhau tùy thuộc vào một điều kiện
* Cách bao gồm hoặc loại trừ một phần JSX có điều kiện
* Các phím tắt cú pháp có điều kiện phổ biến mà bạn sẽ gặp trong các codebase React

</YouWillLearn>

## Kết xuất JSX có điều kiện {/*conditionally-returning-jsx*/}

Giả sử bạn có một component `PackingList` kết xuất một số `Item`, có thể được đánh dấu là đã đóng gói hoặc chưa:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Danh sách đóng gói của Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Bộ đồ vũ trụ" 
        />
        <Item 
          isPacked={true} 
          name="Mũ bảo hiểm với một chiếc lá vàng" 
        />
        <Item 
          isPacked={false} 
          name="Ảnh của Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Lưu ý rằng một số component `Item` có prop `isPacked` được đặt thành `true` thay vì `false`. Bạn muốn thêm dấu kiểm (✅) vào các mục đã đóng gói nếu `isPacked={true}`.

Bạn có thể viết điều này dưới dạng câu lệnh [`if`/`else`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) như sau:

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

Nếu prop `isPacked` là `true`, đoạn code này **trả về một cây JSX khác.** Với thay đổi này, một số mục sẽ có dấu kiểm ở cuối:

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Danh sách đóng gói của Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Bộ đồ vũ trụ" 
        />
        <Item 
          isPacked={true} 
          name="Mũ bảo hiểm với một chiếc lá vàng" 
        />
        <Item 
          isPacked={false} 
          name="Ảnh của Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Hãy thử chỉnh sửa những gì được trả về trong mỗi trường hợp và xem kết quả thay đổi như thế nào!

Lưu ý cách bạn đang tạo logic phân nhánh với các câu lệnh `if` và `return` của JavaScript. Trong React, luồng điều khiển (như điều kiện) được xử lý bởi JavaScript.

### Kết xuất có điều kiện không có gì với `null` {/*conditionally-returning-nothing-with-null*/}

Trong một số trường hợp, bạn sẽ không muốn kết xuất bất cứ thứ gì. Ví dụ: giả sử bạn không muốn hiển thị các mục đã đóng gói. Một component phải trả về một cái gì đó. Trong trường hợp này, bạn có thể trả về `null`:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

Nếu `isPacked` là true, component sẽ không trả về gì, `null`. Nếu không, nó sẽ trả về JSX để kết xuất.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Danh sách đóng gói của Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Bộ đồ vũ trụ" 
        />
        <Item 
          isPacked={true} 
          name="Mũ bảo hiểm với một chiếc lá vàng" 
        />
        <Item 
          isPacked={false} 
          name="Ảnh của Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Trong thực tế, việc trả về `null` từ một component không phổ biến vì nó có thể gây bất ngờ cho một developer đang cố gắng kết xuất nó. Thông thường, bạn sẽ bao gồm hoặc loại trừ component một cách có điều kiện trong JSX của component cha. Đây là cách thực hiện!

## Bao gồm JSX có điều kiện {/*conditionally-including-jsx*/}

Trong ví dụ trước, bạn đã kiểm soát cây JSX nào (nếu có!) sẽ được trả về bởi component. Bạn có thể đã nhận thấy một số trùng lặp trong đầu ra kết xuất:

```js
<li className="item">{name} ✅</li>
```

rất giống với

```js
<li className="item">{name}</li>
```

Cả hai nhánh có điều kiện đều trả về `<li className="item">...</li>`:

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

Mặc dù sự trùng lặp này không có hại, nhưng nó có thể khiến code của bạn khó bảo trì hơn. Điều gì sẽ xảy ra nếu bạn muốn thay đổi `className`? Bạn sẽ phải thực hiện nó ở hai nơi trong code của bạn! Trong một tình huống như vậy, bạn có thể bao gồm một chút JSX có điều kiện để làm cho code của bạn [DRY hơn.](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)

### Toán tử điều kiện (bậc ba) (`? :`) {/*conditional-ternary-operator--*/}

JavaScript có một cú pháp ngắn gọn để viết một biểu thức điều kiện -- [toán tử điều kiện](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) hoặc "toán tử bậc ba".

Thay vì thế này:

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

Bạn có thể viết thế này:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```

Bạn có thể đọc nó là *"nếu `isPacked` là true, thì (`?`) kết xuất `name + ' ✅'`, nếu không (`:`) kết xuất `name`"*.

<DeepDive>

#### Hai ví dụ này có hoàn toàn tương đương không? {/*are-these-two-examples-fully-equivalent*/}

Nếu bạn đến từ nền tảng lập trình hướng đối tượng, bạn có thể cho rằng hai ví dụ trên hơi khác nhau vì một trong số chúng có thể tạo ra hai "thể hiện" khác nhau của `<li>`. Nhưng các phần tử JSX không phải là "thể hiện" vì chúng không giữ bất kỳ trạng thái bên trong nào và không phải là các nút DOM thực. Chúng là các mô tả nhẹ, giống như bản thiết kế. Vì vậy, hai ví dụ này, trên thực tế, *hoàn toàn* tương đương. [Bảo toàn và Đặt lại Trạng thái](/learn/preserving-and-resetting-state) đi vào chi tiết về cách thức hoạt động của điều này.

</DeepDive>

Bây giờ, giả sử bạn muốn bọc văn bản của mục đã hoàn thành vào một thẻ HTML khác, chẳng hạn như `<del>` để gạch bỏ nó. Bạn có thể thêm nhiều dòng mới và dấu ngoặc đơn hơn để dễ dàng lồng thêm JSX vào mỗi trường hợp:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✅'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Danh sách đóng gói của Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Bộ đồ vũ trụ" 
        />
        <Item 
          isPacked={true} 
          name="Mũ bảo hiểm với một chiếc lá vàng" 
        />
        <Item 
          isPacked={false} 
          name="Ảnh của Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Kiểu này hoạt động tốt cho các điều kiện đơn giản, nhưng hãy sử dụng nó một cách điều độ. Nếu các component của bạn trở nên lộn xộn với quá nhiều đánh dấu có điều kiện lồng nhau, hãy cân nhắc trích xuất các component con để làm cho mọi thứ gọn gàng hơn. Trong React, đánh dấu là một phần của code của bạn, vì vậy bạn có thể sử dụng các công cụ như biến và hàm để sắp xếp các biểu thức phức tạp.

### Toán tử AND logic (`&&`) {/*logical-and-operator-*/}

Một phím tắt phổ biến khác mà bạn sẽ gặp là [toán tử AND logic (`&&`) của JavaScript.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.) Bên trong các component React, nó thường xuất hiện khi bạn muốn kết xuất một số JSX khi điều kiện là true, **hoặc không kết xuất gì nếu không.** Với `&&`, bạn có thể kết xuất dấu kiểm một cách có điều kiện chỉ khi `isPacked` là `true`:

```js
return (
  <li className="item">
    {name} {isPacked && '✅'}
  </li>
);
```

Bạn có thể đọc điều này là *"nếu `isPacked`, thì (`&&`) kết xuất dấu kiểm, nếu không, không kết xuất gì"*.

Đây là cách nó hoạt động:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Danh sách đóng gói của Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Bộ đồ vũ trụ" 
        />
        <Item 
          isPacked={true} 
          name="Mũ bảo hiểm với một chiếc lá vàng" 
        />
        <Item 
          isPacked={false} 
          name="Ảnh của Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Một [biểu thức && JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) trả về giá trị của phía bên phải của nó (trong trường hợp của chúng ta, dấu kiểm) nếu phía bên trái (điều kiện của chúng ta) là `true`. Nhưng nếu điều kiện là `false`, toàn bộ biểu thức sẽ trở thành `false`. React coi `false` là một "lỗ hổng" trong cây JSX, giống như `null` hoặc `undefined`, và không kết xuất bất cứ thứ gì ở vị trí của nó.

<Pitfall>

**Không đặt số ở phía bên trái của `&&`.**

Để kiểm tra điều kiện, JavaScript tự động chuyển đổi phía bên trái thành boolean. Tuy nhiên, nếu phía bên trái là `0`, thì toàn bộ biểu thức sẽ nhận giá trị đó (`0`) và React sẽ vui vẻ kết xuất `0` thay vì không có gì.

Ví dụ: một lỗi phổ biến là viết code như `messageCount && <p>Tin nhắn mới</p>`. Thật dễ dàng để cho rằng nó không kết xuất gì khi `messageCount` là `0`, nhưng nó thực sự kết xuất chính `0`!

Để khắc phục, hãy làm cho phía bên trái thành boolean: `messageCount > 0 && <p>Tin nhắn mới</p>`.

</Pitfall>

### Gán JSX có điều kiện cho một biến {/*conditionally-assigning-jsx-to-a-variable*/}

Khi các phím tắt cản trở việc viết code đơn giản, hãy thử sử dụng câu lệnh `if` và một biến. Bạn có thể gán lại các biến được xác định bằng [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), vì vậy hãy bắt đầu bằng cách cung cấp nội dung mặc định bạn muốn hiển thị, tên:

```js
let itemContent = name;
```

Sử dụng câu lệnh `if` để gán lại một biểu thức JSX cho `itemContent` nếu `isPacked` là `true`:

```js
if (isPacked) {
  itemContent = name + " ✅";
}
```

[Dấu ngoặc nhọn mở "cửa sổ vào JavaScript".](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) Nhúng biến với dấu ngoặc nhọn trong cây JSX được trả về, lồng biểu thức đã tính trước đó bên trong JSX:

```js
<li className="item">
  {itemContent}
</li>
```

Kiểu này là dài dòng nhất, nhưng nó cũng linh hoạt nhất. Đây là cách nó hoạt động:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✅";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Danh sách đóng gói của Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Bộ đồ vũ trụ" 
        />
        <Item 
          isPacked={true} 
          name="Mũ bảo hiểm với một chiếc lá vàng" 
        />
        <Item 
          isPacked={false} 
          name="Ảnh của Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Giống như trước đây, điều này không chỉ hoạt động cho văn bản mà còn cho cả JSX tùy ý:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✅"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Danh sách đóng gói của Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Bộ đồ vũ trụ" 
        />
        <Item 
          isPacked={true} 
          name="Mũ bảo hiểm với một chiếc lá vàng" 
        />
        <Item 
          isPacked={false} 
          name="Ảnh của Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Nếu bạn không quen thuộc với JavaScript, sự đa dạng của các kiểu này có thể gây choáng ngợp lúc đầu. Tuy nhiên, việc học chúng sẽ giúp bạn đọc và viết bất kỳ code JavaScript nào -- và không chỉ các component React! Hãy chọn một kiểu bạn thích để bắt đầu, và sau đó tham khảo lại tài liệu này nếu bạn quên cách các kiểu khác hoạt động.

<Recap>

* Trong React, bạn kiểm soát logic phân nhánh bằng JavaScript.
* Bạn có thể trả về một biểu thức JSX có điều kiện bằng câu lệnh `if`.
* Bạn có thể lưu một số JSX vào một biến có điều kiện và sau đó bao gồm nó bên trong JSX khác bằng cách sử dụng dấu ngoặc nhọn.
* Trong JSX, `{cond ? <A /> : <B />}` có nghĩa là *"nếu `cond`, kết xuất `<A />`, nếu không `<B />`"*.
* Trong JSX, `{cond && <A />}` có nghĩa là *"nếu `cond`, kết xuất `<A />`, nếu không không có gì"*.
* Các phím tắt là phổ biến, nhưng bạn không cần phải sử dụng chúng nếu bạn thích `if` đơn giản.

</Recap>

<Challenges>

#### Hiển thị một biểu tượng cho các mục chưa hoàn thành với `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Sử dụng toán tử điều kiện (`cond ? a : b`) để kết xuất một ❌ nếu `isPacked` không phải là `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Danh sách đóng gói của Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Bộ đồ vũ trụ" 
        />
        <Item 
          isPacked={true} 
          name="Mũ bảo hiểm với một chiếc lá vàng" 
        />
        <Item 
          isPacked={false} 
          name="Ảnh của Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✅' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Danh sách đóng gói của Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Bộ đồ vũ trụ" 
        />
        <Item 
          isPacked={true} 
          name="Mũ bảo hiểm với một chiếc lá vàng" 
        />
        <Item 
          isPacked={false} 
          name="Ảnh của Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### Hiển thị tầm quan trọng của mục với `&&` {/*show-the-item-importance-with-*/}

Trong ví dụ này, mỗi `Item` nhận một prop `importance` bằng số. Sử dụng toán tử `&&` để kết xuất "_(Tầm quan trọng: X)_" in nghiêng, nhưng chỉ dành cho các mục có tầm quan trọng khác không. Danh sách mục của bạn sẽ trông như thế này:

* Bộ đồ vũ trụ _(Tầm quan trọng: 9)_
* Mũ bảo hiểm với một chiếc lá vàng
* Ảnh của Tam _(Tầm quan trọng: 6)_

Đừng quên thêm một khoảng trắng giữa hai nhãn!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Danh sách đóng gói của Sally Ride</h1>
      <ul>
        <Item 
          importance={9} 
          name="Bộ đồ vũ trụ" 
        />
        <Item 
          importance={0} 
          name="Mũ bảo hiểm với một chiếc lá vàng" 
        />
        <Item 
          importance={6} 
          name="Ảnh của Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

Điều này sẽ làm được:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Tầm quan trọng: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Danh sách đóng gói của Sally Ride</h1>
      <ul>
        <Item 
          importance={9} 
          name="Bộ đồ vũ trụ" 
        />
        <Item 
          importance={0} 
          name="Mũ bảo hiểm với một chiếc lá vàng" 
        />
        <Item 
          importance={6} 
          name="Ảnh của Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Lưu ý rằng bạn phải viết `importance > 0 && ...` thay vì `importance && ...` để nếu `importance` là `0`, `0` không được kết xuất làm kết quả!

Trong giải pháp này, hai điều kiện riêng biệt được sử dụng để chèn một khoảng trắng giữa tên và nhãn tầm quan trọng. Ngoài ra, bạn có thể sử dụng một Fragment với một khoảng trắng ở đầu: `importance > 0 && <> <i>...</i></>` hoặc thêm một khoảng trắng ngay bên trong `<i>`: `importance > 0 && <i> ...</i>`.

</Solution>

#### Tái cấu trúc một loạt `? :` thành `if` và các biến {/*refactor-a-series-of---to-if-and-variables*/}

Component `Drink` này sử dụng một loạt các điều kiện `? :` để hiển thị thông tin khác nhau tùy thuộc vào việc prop `name` là `"tea"` hay `"coffee"`. Vấn đề là thông tin về mỗi loại đồ uống được trải rộng trên nhiều điều kiện. Tái cấu trúc code này để sử dụng một câu lệnh `if` duy nhất thay vì ba điều kiện `? :`.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Bộ phận của cây</dt>
        <dd>{name === 'tea' ? 'lá' : 'hạt'}</dd>
        <dt>Hàm lượng caffeine</dt>
        <dd>{name === 'tea' ? '15–70 mg/cốc' : '80–185 mg/cốc'}</dd>
        <dt>Tuổi</dt>
        <dd>{name === 'tea' ? '4.000+ năm' : '1.000+ năm'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Sau khi bạn đã tái cấu trúc code để sử dụng `if`, bạn có ý tưởng nào khác về cách đơn giản hóa nó không?

<Solution>

Có nhiều cách bạn có thể thực hiện điều này, nhưng đây là một điểm khởi đầu:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'lá';
    caffeine = '15–70 mg/cốc';
    age = '4.000+ năm';
  } else if (name === 'coffee') {
    part = 'hạt';
    caffeine = '80–185 mg/cốc';
    age = '1.000+ năm';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Bộ phận của cây</dt>
        <dd>{part}</dd>
        <dt>Hàm lượng caffeine</dt>
        <dd>{caffeine}</dd>
        <dt>Tuổi</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Ở đây, thông tin về mỗi loại đồ uống được nhóm lại với nhau thay vì trải rộng trên nhiều điều kiện. Điều này giúp bạn dễ dàng thêm nhiều loại đồ uống hơn trong tương lai.

Một giải pháp khác là loại bỏ hoàn toàn điều kiện bằng cách chuyển thông tin vào các đối tượng:

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'lá',
    caffeine: '15–70 mg/cốc',
    age: '4.000+ năm'
  },
  coffee: {
    part: 'hạt',
    caffeine: '80–185 mg/cốc',
    age: '1.000+ năm'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Bộ phận của cây</dt>
        <dd>{info.part}</dd>
        <dt>Hàm lượng caffeine</dt>
        <dd>{info.caffeine}</dd>
        <dt>Tuổi</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
