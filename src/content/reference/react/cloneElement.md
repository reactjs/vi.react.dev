---
title: cloneElement
---

<Pitfall>

Việc sử dụng `cloneElement` là không phổ biến và có thể dẫn đến code dễ bị lỗi. [Xem các lựa chọn thay thế phổ biến.](#alternatives)

</Pitfall>

<Intro>

`cloneElement` cho phép bạn tạo một React element mới bằng cách sử dụng một element khác làm điểm bắt đầu.

```js
const clonedElement = cloneElement(element, props, ...children)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `cloneElement(element, props, ...children)` {/*cloneelement*/}

Gọi `cloneElement` để tạo một React element dựa trên `element`, nhưng với `props` và `children` khác:

```js
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage" isHighlighted={true}>Goodbye</Row>
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `element`: Đối số `element` phải là một React element hợp lệ. Ví dụ: nó có thể là một JSX node như `<Something />`, kết quả của việc gọi [`createElement`](/reference/react/createElement), hoặc kết quả của một lệnh gọi `cloneElement` khác.

* `props`: Đối số `props` phải là một object hoặc `null`. Nếu bạn truyền `null`, element được clone sẽ giữ lại tất cả các `element.props` ban đầu. Nếu không, đối với mỗi prop trong object `props`, element trả về sẽ "ưu tiên" giá trị từ `props` hơn giá trị từ `element.props`. Các prop còn lại sẽ được lấy từ `element.props` ban đầu. Nếu bạn truyền `props.key` hoặc `props.ref`, chúng sẽ thay thế các giá trị ban đầu.

* **tùy chọn** `...children`: Không hoặc nhiều child node. Chúng có thể là bất kỳ React node nào, bao gồm React element, string, number, [portal](/reference/react-dom/createPortal), empty node (`null`, `undefined`, `true` và `false`) và mảng các React node. Nếu bạn không truyền bất kỳ đối số `...children` nào, `element.props.children` ban đầu sẽ được giữ nguyên.

#### Giá trị trả về {/*returns*/}

`cloneElement` trả về một đối tượng React element với một vài thuộc tính:

* `type`: Giống như `element.type`.
* `props`: Kết quả của việc hợp nhất nông `element.props` với `props` ghi đè mà bạn đã truyền.
* `ref`: `element.ref` ban đầu, trừ khi nó bị ghi đè bởi `props.ref`.
* `key`: `element.key` ban đầu, trừ khi nó bị ghi đè bởi `props.key`.

Thông thường, bạn sẽ trả về element từ component của mình hoặc tạo nó thành một child của một element khác. Mặc dù bạn có thể đọc các thuộc tính của element, nhưng tốt nhất là coi mọi element là không rõ ràng sau khi nó được tạo và chỉ render nó.

#### Lưu ý {/*caveats*/}

* Việc clone một element **không sửa đổi element ban đầu.**

* Bạn chỉ nên **truyền children dưới dạng nhiều đối số cho `cloneElement` nếu tất cả chúng đều được biết tĩnh,** như `cloneElement(element, null, child1, child2, child3)`. Nếu children của bạn là động, hãy truyền toàn bộ mảng làm đối số thứ ba: `cloneElement(element, null, listItems)`. Điều này đảm bảo rằng React sẽ [cảnh báo bạn về việc thiếu `key`](/learn/rendering-lists#keeping-list-items-in-order-with-key) cho bất kỳ danh sách động nào. Đối với danh sách tĩnh, điều này là không cần thiết vì chúng không bao giờ sắp xếp lại.

* `cloneElement` làm cho việc theo dõi luồng dữ liệu trở nên khó khăn hơn, vì vậy **hãy thử các [lựa chọn thay thế](#alternatives) thay thế.**

---

## Cách sử dụng {/*usage*/}

### Ghi đè props của một element {/*overriding-props-of-an-element*/}

Để ghi đè các props của một <CodeStep step={1}>React element</CodeStep>, hãy truyền nó cho `cloneElement` với <CodeStep step={2}>các props bạn muốn ghi đè</CodeStep>:

```js [[1, 5, "<Row title=\\"Cabbage\\" />"], [2, 6, "{ isHighlighted: true }"], [3, 4, "clonedElement"]]
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true }
);
```

Ở đây, <CodeStep step={3}>element được clone</CodeStep> kết quả sẽ là `<Row title="Cabbage" isHighlighted={true} />`.

**Hãy xem qua một ví dụ để xem khi nào nó hữu ích.**

Hãy tưởng tượng một component `List` render [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) của nó dưới dạng một danh sách các hàng có thể chọn với một nút "Next" thay đổi hàng nào được chọn. Component `List` cần render `Row` đã chọn khác nhau, vì vậy nó clone mọi child `<Row>` mà nó đã nhận và thêm một prop `isHighlighted: true` hoặc `isHighlighted: false` bổ sung:

```js {6-8}
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
```

Giả sử JSX ban đầu được `List` nhận trông như thế này:

```js {2-4}
<List>
  <Row title="Cabbage" />
  <Row title="Garlic" />
  <Row title="Apple" />
</List>
```

Bằng cách clone children của nó, `List` có thể truyền thêm thông tin cho mọi `Row` bên trong. Kết quả trông như thế này:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

Lưu ý cách nhấn "Next" cập nhật trạng thái của `List` và làm nổi bật một hàng khác:

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List>
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title} 
        />
      )}
    </List>
  );
}
```

```js src/List.js active
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Tóm lại, `List` đã clone các element `<Row />` mà nó nhận được và thêm một prop bổ sung cho chúng.

<Pitfall>

Việc clone children gây khó khăn cho việc biết dữ liệu truyền qua ứng dụng của bạn như thế nào. Hãy thử một trong các [lựa chọn thay thế.](#alternatives)

</Pitfall>

---

## Các lựa chọn thay thế {/*alternatives*/}

### Truyền dữ liệu bằng render prop {/*passing-data-with-a-render-prop*/}

Thay vì sử dụng `cloneElement`, hãy cân nhắc chấp nhận một *render prop* như `renderItem`. Ở đây, `List` nhận `renderItem` làm một prop. `List` gọi `renderItem` cho mỗi item và truyền `isHighlighted` làm một đối số:

```js {1,7}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
```

Prop `renderItem` được gọi là "render prop" vì nó là một prop chỉ định cách render một thứ gì đó. Ví dụ: bạn có thể truyền một implementation `renderItem` render một `<Row>` với giá trị `isHighlighted` đã cho:

```js {3,7}
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

Kết quả cuối cùng giống như với `cloneElement`:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

Tuy nhiên, bạn có thể theo dõi rõ ràng giá trị `isHighlighted` đến từ đâu.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product, isHighlighted) =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={isHighlighted}
        />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Mô hình này được ưu tiên hơn `cloneElement` vì nó rõ ràng hơn.

---

### Truyền dữ liệu qua context {/*passing-data-through-context*/}

Một lựa chọn thay thế khác cho `cloneElement` là [truyền dữ liệu qua context.](/learn/passing-data-deeply-with-context)

Ví dụ: bạn có thể gọi [`createContext`](/reference/react/createContext) để xác định `HighlightContext`:

```js
export const HighlightContext = createContext(false);
```

Component `List` của bạn có thể bọc mọi item mà nó render vào một provider `HighlightContext`:

```js {8,10}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
```

Với cách tiếp cận này, `Row` không cần nhận một prop `isHighlighted` nào cả. Thay vào đó, nó đọc context:

```js src/Row.js {2}
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
```

Điều này cho phép component gọi không biết hoặc lo lắng về việc truyền `isHighlighted` cho `<Row>`:

```js {4}
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

Thay vào đó, `List` và `Row` phối hợp logic làm nổi bật thông qua context.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product) =>
        <Row title={product.title} />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
import { useContext } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/HighlightContext.js
import { createContext } from 'react';

export const HighlightContext = createContext(false);
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

[Tìm hiểu thêm về việc truyền dữ liệu qua context.](/reference/react/useContext#passing-data-deeply-into-the-tree)

---

### Trích xuất logic vào một Hook tùy chỉnh {/*extracting-logic-into-a-custom-hook*/}

Một cách tiếp cận khác mà bạn có thể thử là trích xuất logic "phi trực quan" vào Hook của riêng bạn và sử dụng thông tin được trả về bởi Hook của bạn để quyết định những gì cần render. Ví dụ: bạn có thể viết một Hook tùy chỉnh `useList` như thế này:

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

Sau đó, bạn có thể sử dụng nó như thế này:

```js {2,9,13}
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

Luồng dữ liệu là rõ ràng, nhưng trạng thái nằm bên trong Hook tùy chỉnh `useList` mà bạn có thể sử dụng từ bất kỳ component nào:

<Sandpack>

```js
import Row from './Row.js';
import useList from './useList.js';
import { products } from './data.js';

export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

```js src/useList.js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Cách tiếp cận này đặc biệt hữu ích nếu bạn muốn sử dụng lại logic này giữa các component khác nhau.
