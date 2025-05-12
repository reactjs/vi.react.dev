---
title: Children
---

<Pitfall>

Việc sử dụng `Children` là không phổ biến và có thể dẫn đến code dễ bị lỗi. [Xem các giải pháp thay thế phổ biến.](#alternatives)

</Pitfall>

<Intro>

`Children` cho phép bạn thao tác và chuyển đổi JSX mà bạn nhận được dưới dạng [`children` prop.](/learn/passing-props-to-a-component#passing-jsx-as-children)

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `Children.count(children)` {/*children-count*/}

Gọi `Children.count(children)` để đếm số lượng phần tử con trong cấu trúc dữ liệu `children`.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Tổng số hàng: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[Xem thêm các ví dụ bên dưới.](#counting-children)

#### Tham số {/*children-count-parameters*/}

* `children`: Giá trị của [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) mà component của bạn nhận được.

#### Giá trị trả về {/*children-count-returns*/}

Số lượng node bên trong `children`.

#### Lưu ý {/*children-count-caveats*/}

- Các node rỗng (`null`, `undefined` và Booleans), strings, numbers và [React elements](/reference/react/createElement) được tính là các node riêng lẻ. Mảng không được tính là các node riêng lẻ, nhưng các phần tử con của chúng thì có. **Việc duyệt không đi sâu hơn các React elements:** chúng không được render và các phần tử con của chúng không được duyệt. [Fragments](/reference/react/Fragment) không được duyệt.

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

Gọi `Children.forEach(children, fn, thisArg?)` để chạy một đoạn code cho mỗi phần tử con trong cấu trúc dữ liệu `children`.

```js src/RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[Xem thêm các ví dụ bên dưới.](#running-some-code-for-each-child)

#### Tham số {/*children-foreach-parameters*/}

* `children`: Giá trị của [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) mà component của bạn nhận được.
* `fn`: Hàm bạn muốn chạy cho mỗi phần tử con, tương tự như callback của [array `forEach` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). Nó sẽ được gọi với phần tử con là đối số đầu tiên và chỉ mục của nó là đối số thứ hai. Chỉ mục bắt đầu từ `0` và tăng lên trên mỗi lần gọi.
* **optional** `thisArg`: Giá trị [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) mà hàm `fn` sẽ được gọi. Nếu bỏ qua, nó là `undefined`.

#### Giá trị trả về {/*children-foreach-returns*/}

`Children.forEach` trả về `undefined`.

#### Lưu ý {/*children-foreach-caveats*/}

- Các node rỗng (`null`, `undefined` và Booleans), strings, numbers và [React elements](/reference/react/createElement) được tính là các node riêng lẻ. Mảng không được tính là các node riêng lẻ, nhưng các phần tử con của chúng thì có. **Việc duyệt không đi sâu hơn các React elements:** chúng không được render và các phần tử con của chúng không được duyệt. [Fragments](/reference/react/Fragment) không được duyệt.

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

Gọi `Children.map(children, fn, thisArg?)` để ánh xạ hoặc chuyển đổi mỗi phần tử con trong cấu trúc dữ liệu `children`.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[Xem thêm các ví dụ bên dưới.](#transforming-children)

#### Tham số {/*children-map-parameters*/}

* `children`: Giá trị của [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) mà component của bạn nhận được.
* `fn`: Hàm ánh xạ, tương tự như callback của [array `map` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map). Nó sẽ được gọi với phần tử con là đối số đầu tiên và chỉ mục của nó là đối số thứ hai. Chỉ mục bắt đầu từ `0` và tăng lên trên mỗi lần gọi. Bạn cần trả về một React node từ hàm này. Đây có thể là một node rỗng (`null`, `undefined` hoặc Boolean), một string, một number, một React element hoặc một mảng các React node khác.
* **optional** `thisArg`: Giá trị [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) mà hàm `fn` sẽ được gọi. Nếu bỏ qua, nó là `undefined`.

#### Giá trị trả về {/*children-map-returns*/}

Nếu `children` là `null` hoặc `undefined`, trả về giá trị tương tự.

Nếu không, trả về một mảng phẳng bao gồm các node bạn đã trả về từ hàm `fn`. Mảng trả về sẽ chứa tất cả các node bạn đã trả về ngoại trừ `null` và `undefined`.

#### Lưu ý {/*children-map-caveats*/}

- Các node rỗng (`null`, `undefined` và Booleans), strings, numbers và [React elements](/reference/react/createElement) được tính là các node riêng lẻ. Mảng không được tính là các node riêng lẻ, nhưng các phần tử con của chúng thì có. **Việc duyệt không đi sâu hơn các React elements:** chúng không được render và các phần tử con của chúng không được duyệt. [Fragments](/reference/react/Fragment) không được duyệt.

- Nếu bạn trả về một element hoặc một mảng các element có keys từ `fn`, **các keys của các element được trả về sẽ tự động được kết hợp với key của mục gốc tương ứng từ `children`.** Khi bạn trả về nhiều element từ `fn` trong một mảng, các keys của chúng chỉ cần là duy nhất cục bộ giữa chúng với nhau.

---

### `Children.only(children)` {/*children-only*/}

Gọi `Children.only(children)` để xác nhận rằng `children` đại diện cho một React element duy nhất.

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### Tham số {/*children-only-parameters*/}

* `children`: Giá trị của [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) mà component của bạn nhận được.

#### Giá trị trả về {/*children-only-returns*/}

Nếu `children` [là một element hợp lệ,](/reference/react/isValidElement) trả về element đó.

Nếu không, đưa ra một lỗi.

#### Lưu ý {/*children-only-caveats*/}

- Phương thức này luôn **ném ra lỗi nếu bạn truyền một mảng (chẳng hạn như giá trị trả về của `Children.map`) làm `children`.** Nói cách khác, nó thực thi rằng `children` là một React element duy nhất, không phải là một mảng với một element duy nhất.

---

### `Children.toArray(children)` {/*children-toarray*/}

Gọi `Children.toArray(children)` để tạo một mảng từ cấu trúc dữ liệu `children`.

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### Tham số {/*children-toarray-parameters*/}

* `children`: Giá trị của [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) mà component của bạn nhận được.

#### Giá trị trả về {/*children-toarray-returns*/}

Trả về một mảng phẳng các element trong `children`.

#### Lưu ý {/*children-toarray-caveats*/}

- Các node rỗng (`null`, `undefined` và Booleans) sẽ bị bỏ qua trong mảng trả về. **Các keys của các element được trả về sẽ được tính toán từ các keys của các element gốc và mức độ lồng nhau và vị trí của chúng.** Điều này đảm bảo rằng việc làm phẳng mảng không gây ra thay đổi trong hành vi.

---

## Cách sử dụng {/*usage*/}

### Chuyển đổi các phần tử con {/*transforming-children*/}

Để chuyển đổi JSX children mà component của bạn [nhận được dưới dạng `children` prop,](/learn/passing-props-to-a-component#passing-jsx-as-children) hãy gọi `Children.map`:

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

Trong ví dụ trên, `RowList` bao bọc mọi phần tử con mà nó nhận được vào một container `<div className="Row">`. Ví dụ: giả sử component cha truyền ba thẻ `<p>` làm `children` prop cho `RowList`:

```js
<RowList>
  <p>Đây là mục đầu tiên.</p>
  <p>Đây là mục thứ hai.</p>
  <p>Đây là mục thứ ba.</p>
</RowList>
```

Sau đó, với việc triển khai `RowList` ở trên, kết quả render cuối cùng sẽ trông như thế này:

```js
<div className="RowList">
  <div className="Row">
    <p>Đây là mục đầu tiên.</p>
  </div>
  <div className="Row">
    <p>Đây là mục thứ hai.</p>
  </div>
  <div className="Row">
    <p>Đây là mục thứ ba.</p>
  </div>
</div>
```

`Children.map` tương tự như [chuyển đổi mảng với `map()`.](/learn/rendering-lists) Sự khác biệt là cấu trúc dữ liệu `children` được coi là *opaque*. Điều này có nghĩa là ngay cả khi đôi khi nó là một mảng, bạn không nên cho rằng nó là một mảng hoặc bất kỳ kiểu dữ liệu cụ thể nào khác. Đây là lý do tại sao bạn nên sử dụng `Children.map` nếu bạn cần chuyển đổi nó.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Đây là mục đầu tiên.</p>
      <p>Đây là mục thứ hai.</p>
      <p>Đây là mục thứ ba.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<DeepDive>

#### Tại sao children prop không phải lúc nào cũng là một mảng? {/*why-is-the-children-prop-not-always-an-array*/}

Trong React, `children` prop được coi là một cấu trúc dữ liệu *opaque*. Điều này có nghĩa là bạn không nên dựa vào cách nó được cấu trúc. Để chuyển đổi, lọc hoặc đếm các phần tử con, bạn nên sử dụng các phương thức `Children`.

Trong thực tế, cấu trúc dữ liệu `children` thường được biểu diễn dưới dạng một mảng bên trong. Tuy nhiên, nếu chỉ có một phần tử con duy nhất, thì React sẽ không tạo một mảng bổ sung vì điều này sẽ dẫn đến chi phí bộ nhớ không cần thiết. Miễn là bạn sử dụng các phương thức `Children` thay vì trực tiếp xem xét `children` prop, code của bạn sẽ không bị hỏng ngay cả khi React thay đổi cách cấu trúc dữ liệu được thực hiện trên thực tế.

Ngay cả khi `children` là một mảng, `Children.map` có hành vi đặc biệt hữu ích. Ví dụ: `Children.map` kết hợp các [keys](/learn/rendering-lists#keeping-list-items-in-order-with-key) trên các element được trả về với các keys trên `children` mà bạn đã truyền cho nó. Điều này đảm bảo rằng các JSX children ban đầu không "mất" keys ngay cả khi chúng được bao bọc như trong ví dụ trên.

</DeepDive>

<Pitfall>

Cấu trúc dữ liệu `children` **không bao gồm đầu ra được render** của các component bạn truyền dưới dạng JSX. Trong ví dụ bên dưới, `children` mà `RowList` nhận được chỉ chứa hai mục thay vì ba:

1. `<p>Đây là mục đầu tiên.</p>`
2. `<MoreRows />`

Đây là lý do tại sao chỉ có hai trình bao bọc hàng được tạo trong ví dụ này:

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Đây là mục đầu tiên.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>Đây là mục thứ hai.</p>
      <p>Đây là mục thứ ba.</p>
    </>
  );
}
```

```js src/RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

**Không có cách nào để lấy đầu ra được render của một component bên trong** như `<MoreRows />` khi thao tác `children`. Đây là lý do tại sao [thường tốt hơn là sử dụng một trong các giải pháp thay thế.](#alternatives)

</Pitfall>

---

### Chạy một đoạn code cho mỗi phần tử con {/*running-some-code-for-each-child*/}

Gọi `Children.forEach` để lặp lại trên mỗi phần tử con trong cấu trúc dữ liệu `children`. Nó không trả về bất kỳ giá trị nào và tương tự như [array `forEach` method.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) Bạn có thể sử dụng nó để chạy logic tùy chỉnh như xây dựng mảng của riêng bạn.

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>Đây là mục đầu tiên.</p>
      <p>Đây là mục thứ hai.</p>
      <p>Đây là mục thứ ba.</p>
    </SeparatorList>
  );
}
```

```js src/SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Remove the last separator
  return result;
}
```

</Sandpack>

<Pitfall>

Như đã đề cập trước đó, không có cách nào để lấy đầu ra được render của một component bên trong khi thao tác `children`. Đây là lý do tại sao [thường tốt hơn là sử dụng một trong các giải pháp thay thế.](#alternatives)

</Pitfall>

---

### Đếm các phần tử con {/*counting-children*/}

Gọi `Children.count(children)` để tính số lượng phần tử con.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Đây là mục đầu tiên.</p>
      <p>Đây là mục thứ hai.</p>
      <p>Đây là mục thứ ba.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Tổng số hàng: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

Như đã đề cập trước đó, không có cách nào để lấy đầu ra được render của một component bên trong khi thao tác `children`. Đây là lý do tại sao [thường tốt hơn là sử dụng một trong các giải pháp thay thế.](#alternatives)

</Pitfall>

---

### Chuyển đổi các phần tử con thành một mảng {/*converting-children-to-an-array*/}

Gọi `Children.toArray(children)` để biến cấu trúc dữ liệu `children` thành một mảng JavaScript thông thường. Điều này cho phép bạn thao tác mảng với các phương thức mảng tích hợp như [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) hoặc [`reverse`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>Đây là mục đầu tiên.</p>
      <p>Đây là mục thứ hai.</p>
      <p>Đây là mục thứ ba.</p>
    </ReversedList>
  );
}
```

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

Như đã đề cập trước đó, không có cách nào để lấy đầu ra được render của một component bên trong khi thao tác `children`. Đây là lý do tại sao [thường tốt hơn là sử dụng một trong các giải pháp thay thế.](#alternatives)

</Pitfall>

---

## Các giải pháp thay thế {/*alternatives*/}

<Note>

Phần này mô tả các giải pháp thay thế cho `Children` API (viết hoa `C`) được import như thế này:

```js
import { Children } from 'react';
```

Đừng nhầm lẫn nó với [việc sử dụng `children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) (viết thường `c`), điều này là tốt và được khuyến khích.

</Note>


### Trình bày nhiều component {/*exposing-multiple-components*/}

Việc thao tác các phần tử con bằng các phương thức `Children` thường dẫn đến code dễ bị lỗi. Khi bạn truyền các phần tử con vào một component trong JSX, bạn thường không mong đợi component đó thao tác hoặc chuyển đổi các phần tử con riêng lẻ.

Khi có thể, hãy cố gắng tránh sử dụng các phương thức `Children`. Ví dụ: nếu bạn muốn mọi phần tử con của `RowList` được bao bọc trong `<div className="Row">`, hãy xuất một component `Row` và tự bao bọc từng hàng vào nó như sau:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>Đây là mục đầu tiên.</p>
      </Row>
      <Row>
        <p>Đây là mục thứ hai.</p>
      </Row>
      <Row>
        <p>Đây là mục thứ ba.</p>
      </Row>
    </RowList>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Không giống như sử dụng `Children.map`, phương pháp này không tự động bao bọc mọi phần tử con. **Tuy nhiên, phương pháp này có một lợi ích đáng kể so với [ví dụ trước với `Children.map`](#transforming-children) vì nó hoạt động ngay cả khi bạn tiếp tục trích xuất thêm các component.** Ví dụ: nó vẫn hoạt động nếu bạn trích xuất component `MoreRows` của riêng bạn:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>Đây là mục đầu tiên.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>Đây là mục thứ hai.</p>
      </Row>
      <Row>
        <p>Đây là mục thứ ba.</p>
      </Row>
    </>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Điều này sẽ không hoạt động với `Children.map` vì nó sẽ "nhìn thấy" `<MoreRows />` như một phần tử con duy nhất (và một hàng duy nhất).

---

### Chấp nhận một mảng các đối tượng làm prop {/*accepting-an-array-of-objects-as-a-prop*/}

Bạn cũng có thể truyền một mảng một cách rõ ràng làm prop. Ví dụ: `RowList` này chấp nhận một mảng `rows` làm prop:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>Đây là mục đầu tiên.</p> },
      { id: 'second', content: <p>Đây là mục thứ hai.</p> },
      { id: 'third', content: <p>Đây là mục thứ ba.</p> }
    ]} />
  );
}
```

```js src/RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Vì `rows` là một mảng JavaScript thông thường, component `RowList` có thể sử dụng các phương thức mảng tích hợp như [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) trên nó.

Mô hình này đặc biệt hữu ích khi bạn muốn có thể truyền thêm thông tin dưới dạng dữ liệu có cấu trúc cùng với các phần tử con. Trong ví dụ dưới đây, component `TabSwitcher` nhận một mảng các đối tượng làm prop `tabs`:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'First',
        content: <p>Đây là mục đầu tiên.</p>
      },
      {
        id: 'second',
        header: 'Second',
        content: <p>Đây là mục thứ hai.</p>
      },
      {
        id: 'third',
        header: 'Third',
        content: <p>Đây là mục thứ ba.</p>
      }
    ]} />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

Không giống như truyền các phần tử con dưới dạng JSX, phương pháp này cho phép bạn liên kết một số dữ liệu bổ sung như `header` với mỗi mục. Vì bạn đang làm việc trực tiếp với `tabs` và nó là một mảng, bạn không cần các phương thức `Children`.

---

### Gọi một render prop để tùy chỉnh rendering {/*calling-a-render-prop-to-customize-rendering*/}

Thay vì tạo JSX cho mọi mục duy nhất, bạn cũng có thể truyền một hàm trả về JSX và gọi hàm đó khi cần thiết. Trong ví dụ này, component `App` truyền một hàm `renderContent` cho component `TabSwitcher`. Component `TabSwitcher` chỉ gọi `renderContent` cho tab đã chọn:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>Đây là mục {tabId}.</p>;
      }}
    />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

Một prop như `renderContent` được gọi là *render prop* vì nó là một prop chỉ định cách render một phần của giao diện người dùng. Tuy nhiên, không có gì đặc biệt về nó: nó là một prop thông thường, tình cờ là một hàm.

Render props là các hàm, vì vậy bạn có thể truyền thông tin cho chúng. Ví dụ: component `RowList` này truyền `id` và `index` của mỗi hàng cho render prop `renderRow`, sử dụng `index` để làm nổi bật các hàng chẵn:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>Đây là mục {id}.</p>
          </Row> 
        );
      }}
    />
  );
}
```

```js src/RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Tổng số hàng: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

Đây là một ví dụ khác về cách các component cha và con có thể hợp tác mà không cần thao tác các phần tử con.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi truyền một component tùy chỉnh, nhưng các phương thức `Children` không hiển thị kết quả render của nó {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

Giả sử bạn truyền hai phần tử con cho `RowList` như sau:

```js
<RowList>
  <p>Mục đầu tiên</p>
  <MoreRows />
</RowList>
```

Nếu bạn thực hiện `Children.count(children)` bên trong `RowList`, bạn sẽ nhận được `2`. Ngay cả khi `MoreRows` render 10 mục khác nhau hoặc nếu nó trả về `null`, `Children.count(children)` vẫn sẽ là `2`. Từ góc độ của `RowList`, nó chỉ "nhìn thấy" JSX mà nó đã nhận được. Nó không "nhìn thấy" các phần bên trong của component `MoreRows`.

Hạn chế này gây khó khăn cho việc trích xuất một component. Đây là lý do tại sao [các giải pháp thay thế](#alternatives) được ưu tiên hơn là sử dụng `Children`.
