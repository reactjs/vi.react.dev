---
title: Chia Sẻ State Giữa Các Component
---

<Intro>

Đôi khi, bạn muốn state của hai component luôn thay đổi cùng nhau. Để làm được điều này, hãy loại bỏ state khỏi cả hai component, di chuyển nó lên parent gần nhất chung của chúng, và sau đó truyền xuống cho chúng thông qua props. Điều này được gọi là *lifting state up*, và đây là một trong những việc phổ biến nhất mà bạn sẽ làm khi viết code React.

</Intro>

<YouWillLearn>

- Cách chia sẻ state giữa các component bằng cách lifting nó lên
- Controlled và uncontrolled component là gì

</YouWillLearn>

## Lifting state up bằng ví dụ {/*lifting-state-up-by-example*/}

Trong ví dụ này, component parent `Accordion` render hai `Panel` riêng biệt:

* `Accordion`
  - `Panel`
  - `Panel`

Mỗi component `Panel` có một state boolean `isActive` để xác định liệu nội dung của nó có hiển thị hay không.

Nhấn nút Show cho cả hai panel:

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About">
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology">
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Lưu ý cách nhấn nút của một panel không ảnh hưởng đến panel khác--chúng độc lập với nhau.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Both Panel components contain isActive with value false.">

Ban đầu, state `isActive` của mỗi `Panel` là `false`, vì vậy cả hai đều xuất hiện dạng thu gọn

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="The same diagram as the previous, with the isActive of the first child Panel component highlighted indicating a click with the isActive value set to true. The second Panel component still contains value false." >

Nhấp vào nút của bất kỳ `Panel` nào sẽ chỉ cập nhật state `isActive` của `Panel` đó một mình

</Diagram>

</DiagramGroup>

**Nhưng giờ giả sử bạn muốn thay đổi để chỉ có một panel được mở rộng tại bất kỳ thời điểm nào.** Với thiết kế đó, việc mở rộng panel thứ hai sẽ thu gọn panel đầu tiên. Bạn sẽ làm thế nào?

Để phối hợp hai panel này, bạn cần "lift state của chúng lên" component parent trong ba bước:

1. **Loại bỏ** state khỏi các component con.
2. **Truyền** dữ liệu cứng từ parent chung.
3. **Thêm** state vào parent chung và truyền nó xuống cùng với các event handler.

Điều này sẽ cho phép component `Accordion` phối hợp cả hai `Panel` và chỉ mở rộng một panel tại một thời điểm.

### Bước 1: Loại bỏ state khỏi các component con {/*step-1-remove-state-from-the-child-components*/}

Bạn sẽ giao quyền kiểm soát `isActive` của `Panel` cho component parent của nó. Điều này có nghĩa là component parent sẽ truyền `isActive` cho `Panel` như một prop thay vì. Bắt đầu bằng cách **loại bỏ dòng này** khỏi component `Panel`:

```js
const [isActive, setIsActive] = useState(false);
```

Và thay vào đó, thêm `isActive` vào danh sách props của `Panel`:

```js
function Panel({ title, children, isActive }) {
```

Bây giờ component parent của `Panel` có thể *kiểm soát* `isActive` bằng cách [truyền nó xuống như một prop.](/learn/passing-props-to-a-component) Ngược lại, component `Panel` bây giờ *không có quyền kiểm soát* giá trị của `isActive`--giờ đây việc này thuộc về component parent!

### Bước 2: Truyền dữ liệu cứng từ parent chung {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

Để lift state lên, bạn phải tìm component parent chung gần nhất của *cả hai* component con mà bạn muốn phối hợp:

* `Accordion` *(parent chung gần nhất)*
  - `Panel`
  - `Panel`

Trong ví dụ này, đó là component `Accordion`. Vì nó ở trên cả hai panel và có thể kiểm soát props của chúng, nó sẽ trở thành "nguồn chân lý" cho việc panel nào hiện đang active. Làm cho component `Accordion` truyền một giá trị cứng của `isActive` (ví dụ, `true`) cho cả hai panel:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About" isActive={true}>
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology" isActive={true}>
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Thử chỉnh sửa các giá trị `isActive` cứng trong component `Accordion` và xem kết quả trên màn hình.

### Bước 3: Thêm state vào parent chung {/*step-3-add-state-to-the-common-parent*/}

Lifting state lên thường thay đổi bản chất của những gì bạn đang lưu trữ dưới dạng state.

Trong trường hợp này, chỉ một panel được active tại một thời điểm. Điều này có nghĩa là component parent chung `Accordion` cần theo dõi *panel nào* là panel active. Thay vì giá trị `boolean`, nó có thể sử dụng một số như index của `Panel` active cho biến state:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

Khi `activeIndex` là `0`, panel đầu tiên đang active, và khi nó là `1`, thì là panel thứ hai.

Nhấp vào nút "Show" trong bất kỳ `Panel` nào cần thay đổi active index trong `Accordion`. Một `Panel` không thể đặt state `activeIndex` trực tiếp vì nó được định nghĩa bên trong `Accordion`. Component `Accordion` cần *cho phép rõ ràng* component `Panel` thay đổi state của nó bằng cách [truyền một event handler xuống như một prop](/learn/responding-to-events#passing-event-handlers-as-props):

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

`<button>` bên trong `Panel` bây giờ sẽ sử dụng prop `onShow` như event handler click của nó:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Điều này hoàn thành việc lifting state lên! Di chuyển state vào component parent chung đã cho phép bạn phối hợp hai panel. Sử dụng active index thay vì hai cờ "is shown" đảm bảo rằng chỉ một panel active tại một thời điểm nhất định. Và việc truyền event handler xuống cho con đã cho phép con thay đổi state của parent.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Accordion contains an activeIndex value of zero which turns into isActive value of true passed to the first Panel, and isActive value of false passed to the second Panel." >

Ban đầu, `activeIndex` của `Accordion` là `0`, vì vậy `Panel` đầu tiên nhận `isActive = true`

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="The same diagram as the previous, with the activeIndex value of the parent Accordion component highlighted indicating a click with the value changed to one. The flow to both of the children Panel components is also highlighted, and the isActive value passed to each child is set to the opposite: false for the first Panel and true for the second one." >

Khi state `activeIndex` của `Accordion` thay đổi thành `1`, `Panel` thứ hai nhận `isActive = true` thay thế

</Diagram>

</DiagramGroup>

<DeepDive>

#### Controlled và uncontrolled component {/*controlled-and-uncontrolled-components*/}

Thông thường người ta gọi một component có một số local state là "uncontrolled". Ví dụ, component `Panel` ban đầu với biến state `isActive` là uncontrolled vì parent của nó không thể ảnh hưởng đến việc panel có active hay không.

Ngược lại, bạn có thể nói một component là "controlled" khi thông tin quan trọng trong nó được điều khiển bởi props thay vì local state của chính nó. Điều này cho phép component parent hoàn toàn chỉ định hành vi của nó. Component `Panel` cuối cùng với prop `isActive` được controlled bởi component `Accordion`.

Uncontrolled component dễ sử dụng hơn trong parent của chúng vì chúng yêu cầu ít cấu hình hơn. Nhưng chúng kém linh hoạt hơn khi bạn muốn phối hợp chúng cùng nhau. Controlled component có tính linh hoạt tối đa, nhưng chúng yêu cầu các component parent phải cấu hình hoàn toàn chúng bằng props.

Trong thực tế, "controlled" và "uncontrolled" không phải là thuật ngữ kỹ thuật nghiêm ngặt--mỗi component thường có hỗn hợp cả local state và props. Tuy nhiên, đây là một cách hữu ích để nói về cách các component được thiết kế và khả năng chúng cung cấp.

Khi viết một component, hãy xem xét thông tin nào trong đó nên được controlled (thông qua props), và thông tin nào nên là uncontrolled (thông qua state). Nhưng bạn luôn có thể thay đổi ý kiến và refactor sau.

</DeepDive>

## Một nguồn chân lý duy nhất cho mỗi state {/*a-single-source-of-truth-for-each-state*/}

Trong một ứng dụng React, nhiều component sẽ có state riêng của chúng. Một số state có thể "sống" gần các component lá (component ở dưới cùng của cây) như input. State khác có thể "sống" gần hơn với đỉnh của ứng dụng. Ví dụ, ngay cả các thư viện routing phía client thường được triển khai bằng cách lưu trữ route hiện tại trong React state, và truyền nó xuống bằng props!

**Đối với mỗi phần state duy nhất, bạn sẽ chọn component "sở hữu" nó.** Nguyên tắc này còn được gọi là có một ["single source of truth".](https://en.wikipedia.org/wiki/Single_source_of_truth) Điều này không có nghĩa là tất cả state sống ở một nơi--nhưng với _mỗi_ phần state, có một component _cụ thể_ giữ thông tin đó. Thay vì sao chép shared state giữa các component, hãy *lift nó lên* parent chung được chia sẻ của chúng, và *truyền nó xuống* cho các con cần nó.

Ứng dụng của bạn sẽ thay đổi khi bạn làm việc trên nó. Thông thường bạn sẽ di chuyển state xuống hoặc ngược lại lên trong khi bạn vẫn đang tìm hiểu nơi mỗi phần state "sống". Tất cả điều này đều là một phần của quá trình!

Để xem điều này cảm thấy như thế nào trong thực tế với một vài component khác, hãy đọc [Thinking in React.](/learn/thinking-in-react)

<Recap>

* Khi bạn muốn phối hợp hai component, hãy di chuyển state của chúng lên parent chung.
* Sau đó truyền thông tin xuống thông qua props từ parent chung của chúng.
* Cuối cùng, truyền các event handler xuống để các con có thể thay đổi state của parent.
* Sẽ hữu ích khi xem xét các component là "controlled" (được điều khiển bởi props) hoặc "uncontrolled" (được điều khiển bởi state).

</Recap>

<Challenges>

#### Input đồng bộ {/*synced-inputs*/}

Hai input này độc lập với nhau. Hãy làm cho chúng luôn đồng bộ: chỉnh sửa một input nên cập nhật input khác với cùng văn bản, và ngược lại.

<Hint>

Bạn sẽ cần lift state của chúng lên component parent.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="First input" />
      <Input label="Second input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

Di chuyển biến state `text` vào component parent cùng với handler `handleChange`. Sau đó truyền chúng xuống như props cho cả hai component `Input`. Điều này sẽ giữ chúng đồng bộ.

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="First input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Second input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### Lọc danh sách {/*filtering-a-list*/}

Trong ví dụ này, `SearchBar` có state `query` riêng để kiểm soát text input. Component parent `FilterableList` hiển thị một `List` các item, nhưng nó không tính đến search query.

Sử dụng function `filterItems(foods, query)` để lọc danh sách theo search query. Để kiểm tra thay đổi của bạn, hãy xác minh rằng việc gõ "s" vào input sẽ lọc danh sách xuống còn "Sushi", "Shish kebab", và "Dim sum".

Lưu ý rằng `filterItems` đã được triển khai và import sẵn nên bạn không cần viết nó!

<Hint>

Bạn sẽ muốn loại bỏ state `query` và handler `handleChange` khỏi `SearchBar`, và di chuyển chúng vào `FilterableList`. Sau đó truyền chúng xuống cho `SearchBar` như props `query` và `onChange`.

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

<Solution>

Lift state `query` lên component `FilterableList`. Gọi `filterItems(foods, query)` để lấy danh sách đã lọc và truyền nó xuống cho `List`. Bây giờ việc thay đổi query input được phản ánh trong danh sách:

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody> 
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

</Solution>

</Challenges>
