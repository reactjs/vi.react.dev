---
title: Hiển thị phần tử có điều kiện
---

<Intro>

Các phần tử JSX trên trang web của bạn thường sẽ hiển thị những nội dung khác nhau tùy thuộc vào một số điều kiện nhất định. Với React, bạn có thể hiển thị những phần tử đó một cách có điều kiện bằng những câu lệnh JavaScript như `if`, `&&`, và `? :`.

</Intro>

<YouWillLearn>

* Cách hiển thị nội dung khác nhau dựa trên một điều kiện nhất định
* Cách thêm vào (hay loại bỏ) một phần tử dựa trên một điều kiện nhất định
* Những cú pháp ngắn gọn thường gặp khi hiển thị phần tử có điều kiện với React

</YouWillLearn>

## Trả về phần tử JSX có điều kiện {/*conditionally-returning-jsx*/}

Lấy ví dụ về phần tử `PackingList` bên dưới. Nó có chứa những phần tử con `Item`, những phần tử con này có một thuộc tính đi kèm là `isPacked`:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Để ý kĩ ta sẽ thấy những phần tử con `Item` có điều kiện (thuộc tính) đi kèm `isPacked` khác nhau (một số là `true` trong khi một số khác lại là `false`). Giả sử ta muốn thêm vào một dấu tích xanh (✔) cho những phần tử con `Item` thỏa mãn điều kiện: `isPacked={true}`.

Ta có thể thực hiện điều đó bằng câu lệnh [`if`/`else`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) như sau:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Nếu thuộc tính `isPacked` là `true`, đoạn code trên sẽ chỉ **trả về những phần tử `Item` có thuộc tính `isPacked` thỏa mãn điều kiện đó.** Như vậy ta sẽ có được kết quả như bên dưới:

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Nếu thay đổi giá trị thuộc tính `isPacked` của những phần tử `Item` ở đoạn code trên, ta sẽ thấy những dấu tích được thêm vào/loại bỏ tùy thuộc vào giá trị thuộc tính `isPacked`.

Để ý kĩ ta sẽ thấy cú pháp `if` và `return` bên trên rất giống với những đoạn code JavaScript thường gặp, đó là vì React sử dụng JavaScript để trả về những phần tử JSX một cách có điều kiện.

### Hiển thị phần tử "rỗng" (`null`) có điều kiện {/*conditionally-returning-nothing-with-null*/}

Trong một vài trường hợp nếu điều kiện hiển thị một phần tử không được thỏa mãn, ta hoàn toàn có thể không hiển thị phần tử đó. Để thực hiện điều đó, ta có thể trả về một giá trị rỗng (`null`) như đoạn code bên dưới:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

Dựa vào đoạn code trên ta thấy những phần tử `Item` thỏa mãn điều kiện `isPacked === true` sẽ không được hiển thị (`return null`) và ngược lại. 

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
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Trên thực tế, việc trả về một giá trị `null` không phải là một cách thức phổ biến để ẩn đi một phần tử. Thường thì ta nên loại bỏ hay thêm vào một phần tử JSX theo cách áp dụng sau đây:

## Thêm vào (hay loại bỏ) một phần tử JSX dựa trên một điều kiện nhất định {/*conditionally-including-jsx*/}

Từ ví dụ "dấu tích xanh" trước đó, để ý kĩ ta sẽ thấy có một lượng code khá giống nhau giữa 2 đoạn code 

```js
<li className="item">{name} ✔</li>
```

và

```js
<li className="item">{name}</li>
```

Chúng đều trả về phần tử `<li className="item">...</li>` và chỉ khác nhau ở mỗi nội dung bên trong (đó là dấu tích):

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Việc trùng lặp code như vậy không hẳn sẽ đem lại một hiệu ứng gì đó quá tai hại, nhưng nó khiến cho việc kiểm soát và debug code khó khăn hơn. Ví dụ nếu ta muốn sửa đổi thuộc tính `className`, ta sẽ phải sửa đổi nó ở 2 chỗ khác nhau. Điều này tốn nhiều công sức và thời gian hơn khi ta phải đảm bảo rằng giá trị của `className` ở 2 nơi phải trùng khớp! Trong trường hợp như vậy, để giúp cho đoạn code trên được [ngắn gọn và súc tích hơn](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), ta có thể áp dụng những phương pháp dưới đây: 

### Sử dụng toán tử ba ngôi (`? :`) {/*conditional-ternary-operator--*/}

JavaScript cung cấp cho ta một cách thức để rút gọn những câu lệnh `if` dài dòng  bằng cách sử dụng [toán tử ba ngôi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator).

Sử dụng toán tử ba ngôi, ta có thể viết lại đoạn code dưới đây:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

như sau:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

Đoạn code rút gọn bên trên có thể được hiểu là: *"Nếu thuộc tính `isPacked` là true, thì (`?`) dấu tích '✔' sẽ được thêm vào ngay sau biến `name`, và ngược lại (`:`) thì ta sẽ chỉ hiện thị mỗi biến `name` mà thôi"*

<DeepDive>

#### Liệu 2 ví dụ trên có thực sự giống nhau? {/*are-these-two-examples-fully-equivalent*/}

Nếu đã quen thuộc với lập trình hướng đối tượng (OOP), bạn có thể cho rằng 2 ví dụ trên là khác nhau về mặt bản chất, vì một trong 2 ví dụ trên trả về một "đối tượng" (instance) `<li>`. Tuy nhiên, các phần tử JSX không phải là đổi tượng của một "lớp" (class) cụ thể nào vì chúng là "virtual DOM" (hay đúng hơn, chúng không thuộc về cây thư mục "thực") và trên hết chúng không nắm dữ một trạng thái nội bộ (internal state) nào. Cho nên trên thực tế 2 ví dụ này là hoàn toàn tương đồng. Đọc thêm về [Preserving and Resetting State](/learn/preserving-and-resetting-state).

</DeepDive>

Giả sử nếu muốn gạch đi (strike out) những `Item` mà có dấu tích bằng cách sử dụng phần tử `<del>`, bạn có thể thay đổi đoạn code như dưới dây:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
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
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Ví dụ trên khá phổ biến, tuy nhiên trên thực tế khi phải làm việc với bất kì dự án React lớn nào, cú pháp trên có thể khiến codebase của bạn trở nên rườm rà và khó kiểm soát hơn. Khi có quá nhiều điều kiện khác nhau được gói gọn trong một phần tử, bạn nên tách chúng ra thành những phần tử con để mọi thứ trở nên gọn gàng hơn. Với React, bạn hoàn toàn có thể làm việc đó bằng cách gán chúng vào những biến (variable) khác nhau.

### Toán tử logic AND (`&&`) {/*logical-and-operator-*/}

Một trong những phương thức rút gọn các đoạn code điều kiện khác đó là việc sử dụng [toán tử AND (`&&`) trong JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.). Như đã bàn ở trên, nếu điều kiện hiển thị một phần tử không được thỏa mãn, ta hoàn toàn có thể không hiển thị phần tử đó. Với toán tử `&&`, ta có thể in ra dấu tích (✔) chỉ khi `isPacked` bằng `true`:

```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

Đoạn code trên có thể được hiểu là *"nếu `isPacked` bằng `true`, thì (`&&`) ta hiển thị dấu tích '✔', còn không thì sẽ không hiển thị gì cả"*.

Tham khảo đoạn code dưới đây để hiểu rõ thêm:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Toán tử [&& trong JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) trả về giá trị ở vế bên phải (trong trường hợp này đó chính là dấu tích '✔') nếu điều kiện ở vế bên trái là `true`. Tuy nhiên nếu điều kiện đó là `false`, giá trị ở về phải được trả về sẽ là `false`. Dưới con mắt của React, `false` có hiệu ứng tương tự như `null` hay `undefined`, cho nên nó sẽ không in ra gì cả.


<Pitfall>

**Cẩn thận khi đặt các giá trị số (numeric values) trước toán tử `&&`.**

Để kiểm tra điều kiện được cho, JavaScript sẽ tự động chuyển đổi vế bên trái của `&&` thành kiểu dữ liệu boolean. Tuy nhiên, nếu vế trái là số `0`, thì toàn bộ biểu thức sẽ nhận giá trị là số (`0`) thay vì `false`, và React sẽ hiển thị `0` là kết quả cuối cùng, thay vì không hiển thị gì cả.

Ví dụ sau đây là một lỗi căn bản dành cho trường hợp trên: `messageCount && <p>New messages</p>`. Chúng ta rất dễ nhầm lẫn rằng đoạn code trên sẽ không hiển thị phần tử `<p>` vì `messageCount` bằng `0`, mà dưới con mắt của JavaScript, `0` chính là một giá trị "sai" (falsy value), Tuy nhiên trong trường hợp này React sẽ hiển thị đúng giá trị `0` đó ra màn hình, thay vì không hiển thị gì cả!

Để khắc phục, ta nên chuyển đổi biểu thức bên tay trái thành kiểu dữ liệu boolean như sau: `messageCount > 0 && <p>New messages</p>`.

</Pitfall>

### Gán biểu thức JSX vào biến (variable) một cách có điều kiện {/*conditionally-assigning-jsx-to-a-variable*/}

Khi các điều kiện trở nên phức tạp khiến cho việc viết code trở nên rườm rà, hãy thử áp dụng phương pháp gán biến kết hợp với câu lệnh `if`. Lưu ý là những biến được khai báo bằng [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) hoàn toàn có thể được ghi đè, cho nên ta có thể khai báo biến `itemContent` bằng một giá trị mặc định như sau:

```js
let itemContent = name;
```

Sau đó, ta sử dụng câu lệnh `if` để ghi đè giá trị của `itemContent` nếu `isPacked` bằng `true`:

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

Cuối cùng, việc sử dụng [dấu ngoặc nhọn"](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) sẽ giúp cho việc "nhúng" (embed) biến ở trên vào trong phần tử JSX:

```js
<li className="item">
  {itemContent}
</li>
```

Phương pháp trên khá dài dòng nhưng đồng thời cũng cực kì linh hoạt. Để hiểu rõ thêm hãy tham khảo đoạn code dưới đây:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
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
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Phương pháp gán biến này cũng có thể được áp dụng với những biểu thức JSX bất kì như sau:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
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
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Nếu còn xa lạ với JavaScript, bạn có thể sẽ thấy choáng ngợp với muôn vàn cách viết code khác nhau cho cùng một vấn đề. Tuy nhiên việc hiểu biết về những cách thức trên sẽ giúp bạn trau dồi thêm kiến thức về JavaScript chứ không phải chỉ mỗi React thôi đâu! Để bắt đầu hãy chọn một phương án phù hợp với mình, và tham khảo lại chủ đề này trong tương lai.

<Recap>

* Với React, bạn sử dụng JavaScript để kiểm soát những nhánh logic khác nhau.
* Bạn có thể trả về các biểu thức JSX một cách có điều kiện bằng câu lệnh `if`.
* Các biểu thức JSX có thể được lưu dưới dạng biến (variable) một cách có điều kiện. Sau đó chúng có thể được dùng (nhúng) vào các biểu thức JSX khác bằng cách sử dụng cặp dấu ngoặc nhọn `{ }`.
* Trong JSX, `{cond ? <A /> : <B />}` có thể được hiểu là *"Nếu điều kiện `cond` được thỏa mãn, ta sẽ hiển thị (trả về) phần tử `<A />`, nếu không thì ta sẽ hiển thị phần tử `<B />`"*.
* Trong JSX, `{cond && <A />}` có nghĩa là *"Nếu điều kiện `cond` được thỏa mãn, ta sẽ trả về phần tử `<A />`, nếu không thì ta sẽ không hiển thị gì cả"*.
* Những phương thức rút gọn bên trên khá phổ biến, tuy nhiên bạn hoàn toàn có thể đạt được kết quả tương tự bằng cách sử dụng lệnh `if`.

</Recap>



<Challenges>

#### Hiển thị icon cho những items chưa hoàn thành bằng toán tử 3 ngôi `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Sử dụng toán tử điều kiện (`cond ? a : b`) để hiển thị dấu ❌ nếu `isPacked` khác `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
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
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### Hiển thị item dựa trên độ quan trọng bằng toán tử `&&` {/*show-the-item-importance-with-*/}

Trong ví dụ này, mỗi `Item` có một thuộc tính đi kèm `importance` với kiểu dữ liệu là số. Sử dụng toán tử `&&` để hiển thị cú pháp "_(Importance: X)_" (viết in nghiêng) với những items có thuộc tính `importance` khác không (`0`). Danh sách các items được in ra trông sẽ như sau:

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

Lưu ý đừng quên thêm vào dấu cách (khoảng trống) giữa `name` và cú pháp "_(Importance: X)_"

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
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

Dưới đây là một phương án hiệu quả cho thử thách trên:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Lưu ý là ở vế trái ta phải viết `importance > 0 && ...` thay vì `importance && ...` để tránh trường hợp `importance` bằng `0`, vì theo đề bài, ta chỉ in ra giá trị của `importance` với các biến khác `0`!

Trong đáp án này, 2 câu lệnh điều kiện khác nhau được sử dụng để chèn khoảng trống vào giữa `name` và cú pháp "_(Importance: X)_". Một cách làm khác là sử dụng phần tử rỗng (fragment) kèm theo sau là khoảng trống như sau: `importance > 0 && <> <i>...</i></>` hoặc thêm khoảng trống vào ngay bên trong phần tử `<i>`:  `importance > 0 && <i> ...</i>`.

</Solution>

#### Thay thế `? :` bằng phương pháp gán biến kết hợp với lệnh `if` {/*refactor-a-series-of---to-if-and-variables*/}

Ta có  hàm`Drink` đang sử dụng một loạt các toán tử `? :` để hiển thị những thông tin khác nhau dựa trên giá trị của thuộc tính `name` là `"tea"` hay là `"coffee"`. Vấn đề ở đây là những thông tin về mỗi món uống được nằm rải rác ở những điều kiện khác nhau. Hãy tái cấu trúc lại đoạn code này bằng cách sử dụng một câu lệnh `if` duy nhất thay vì 3 toán tử `? :`.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
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

Câu hỏi đặt ra là, sau khi đã cấu trúc lại đoạn code trên bằng những câu lệnh `if`, liệu có cách nào để đơn giản hóa và làm nó trở nên ngắn gọn hơn hay không?

<Solution>

Có khá nhiều phương án cho thử thách trên, dưới đây là một ví dụ:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
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

Phương pháp này nhóm tất cả thông tin của những món uống vào một chỗ thay vì rải rác chúng ở những vị trí khác nhau. Nó giúp cho việc thêm những món uống khác trở nên dễ dàng hơn trong tương lai.

Một giải pháp hiệu quả khác mà không cần dùng bất kì một câu lệnh điều kiện nào đó chính là nhóm những thông tin của các món uống vào những "object" riêng biệt:

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
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