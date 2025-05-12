---
title: Chia sẻ State giữa các Component
---

<Intro>

Đôi khi, bạn muốn state của hai component luôn thay đổi cùng nhau. Để làm điều đó, hãy loại bỏ state khỏi cả hai component, di chuyển nó lên component cha chung gần nhất của chúng, và sau đó truyền nó xuống cho chúng thông qua props. Điều này được gọi là *nâng state lên,* và nó là một trong những điều phổ biến nhất bạn sẽ làm khi viết code React.

</Intro>

<YouWillLearn>

- Cách chia sẻ state giữa các component bằng cách nâng nó lên
- Component được kiểm soát và không được kiểm soát là gì

</YouWillLearn>

## Nâng state lên bằng ví dụ {/*lifting-state-up-by-example*/}

Trong ví dụ này, một component `Accordion` cha hiển thị hai `Panel` riêng biệt:

* `Accordion`
  - `Panel`
  - `Panel`

Mỗi component `Panel` có một state `isActive` kiểu boolean để xác định xem nội dung của nó có hiển thị hay không.

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

Lưu ý rằng việc nhấn nút của một panel không ảnh hưởng đến panel còn lại - chúng độc lập với nhau.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Sơ đồ hiển thị một cây gồm ba component, một component cha được gắn nhãn Accordion và hai component con được gắn nhãn Panel. Cả hai component Panel đều chứa isActive với giá trị false.">

Ban đầu, state `isActive` của mỗi `Panel` là `false`, vì vậy cả hai đều xuất hiện ở trạng thái thu gọn

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="Cùng sơ đồ như trên, với isActive của component Panel con đầu tiên được tô sáng cho biết một cú nhấp với giá trị isActive được đặt thành true. Component Panel thứ hai vẫn chứa giá trị false." >

Nhấp vào nút của `Panel` nào sẽ chỉ cập nhật state `isActive` của riêng `Panel` đó

</Diagram>

</DiagramGroup>

**Nhưng bây giờ giả sử bạn muốn thay đổi nó sao cho chỉ một panel được mở rộng tại bất kỳ thời điểm nào.** Với thiết kế đó, việc mở rộng panel thứ hai sẽ thu gọn panel đầu tiên. Bạn sẽ làm điều đó như thế nào?

Để phối hợp hai panel này, bạn cần "nâng state của chúng lên" một component cha theo ba bước:

1. **Loại bỏ** state khỏi các component con.
2. **Truyền** dữ liệu được mã hóa cứng từ component cha chung.
3. **Thêm** state vào component cha chung và truyền nó xuống cùng với các trình xử lý sự kiện.

Điều này sẽ cho phép component `Accordion` điều phối cả hai `Panel` và chỉ mở rộng một `Panel` tại một thời điểm.

### Bước 1: Loại bỏ state khỏi các component con {/*step-1-remove-state-from-the-child-components*/}

Bạn sẽ cung cấp quyền kiểm soát `isActive` của `Panel` cho component cha của nó. Điều này có nghĩa là component cha sẽ truyền `isActive` cho `Panel` dưới dạng một prop. Bắt đầu bằng cách **xóa dòng này** khỏi component `Panel`:

```js
const [isActive, setIsActive] = useState(false);
```

Và thay vào đó, hãy thêm `isActive` vào danh sách các prop của `Panel`:

```js
function Panel({ title, children, isActive }) {
```

Bây giờ component cha của `Panel` có thể *kiểm soát* `isActive` bằng cách [truyền nó xuống dưới dạng một prop.](/learn/passing-props-to-a-component) Ngược lại, component `Panel` bây giờ *không có quyền kiểm soát* đối với giá trị của `isActive` - bây giờ nó phụ thuộc vào component cha!

### Bước 2: Truyền dữ liệu được mã hóa cứng từ component cha chung {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

Để nâng state lên, bạn phải xác định vị trí component cha chung gần nhất của *cả hai* component con mà bạn muốn phối hợp:

* `Accordion` *(component cha chung gần nhất)*
  - `Panel`
  - `Panel`

Trong ví dụ này, đó là component `Accordion`. Vì nó nằm trên cả hai panel và có thể kiểm soát các prop của chúng, nó sẽ trở thành "nguồn sự thật" cho panel nào hiện đang hoạt động. Làm cho component `Accordion` truyền một giá trị được mã hóa cứng của `isActive` (ví dụ: `true`) cho cả hai panel:

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

Hãy thử chỉnh sửa các giá trị `isActive` được mã hóa cứng trong component `Accordion` và xem kết quả trên màn hình.

### Bước 3: Thêm state vào component cha chung {/*step-3-add-state-to-the-common-parent*/}

Việc nâng state lên thường thay đổi bản chất của những gì bạn đang lưu trữ dưới dạng state.

Trong trường hợp này, chỉ một panel sẽ hoạt động tại một thời điểm. Điều này có nghĩa là component cha chung `Accordion` cần theo dõi *panel nào* đang hoạt động. Thay vì một giá trị `boolean`, nó có thể sử dụng một số làm chỉ mục của `Panel` đang hoạt động cho biến state:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

Khi `activeIndex` là `0`, panel đầu tiên đang hoạt động và khi nó là `1`, panel thứ hai đang hoạt động.

Việc nhấp vào nút "Show" trong một trong hai `Panel` cần thay đổi chỉ mục hoạt động trong `Accordion`. Một `Panel` không thể đặt state `activeIndex` trực tiếp vì nó được xác định bên trong `Accordion`. Component `Accordion` cần *cho phép rõ ràng* component `Panel` thay đổi state của nó bằng cách [truyền một trình xử lý sự kiện xuống dưới dạng một prop](/learn/responding-to-events#passing-event-handlers-as-props):

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

`<button>` bên trong `Panel` bây giờ sẽ sử dụng prop `onShow` làm trình xử lý sự kiện nhấp chuột của nó:

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

Điều này hoàn thành việc nâng state lên! Việc di chuyển state vào component cha chung cho phép bạn điều phối hai panel. Sử dụng chỉ mục hoạt động thay vì hai cờ "is shown" đảm bảo rằng chỉ một panel hoạt động tại một thời điểm. Và việc truyền trình xử lý sự kiện xuống cho con cho phép con thay đổi state của cha.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Sơ đồ hiển thị một cây gồm ba component, một component cha được gắn nhãn Accordion và hai component con được gắn nhãn Panel. Accordion chứa một giá trị activeIndex bằng không, giá trị này biến thành giá trị isActive bằng true được truyền cho Panel đầu tiên và giá trị isActive bằng false được truyền cho Panel thứ hai." >

Ban đầu, `activeIndex` của `Accordion` là `0`, vì vậy `Panel` đầu tiên nhận được `isActive = true`

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="Cùng sơ đồ như trên, với giá trị activeIndex của component Accordion cha được tô sáng cho biết một cú nhấp với giá trị được thay đổi thành một. Luồng đến cả hai component Panel con cũng được tô sáng và giá trị isActive được truyền cho mỗi con được đặt thành ngược lại: false cho Panel đầu tiên và true cho Panel thứ hai." >

Khi state `activeIndex` của `Accordion` thay đổi thành `1`, `Panel` thứ hai sẽ nhận được `isActive = true` thay thế

</Diagram>

</DiagramGroup>

<DeepDive>

#### Component được kiểm soát và không được kiểm soát {/*controlled-and-uncontrolled-components*/}

Người ta thường gọi một component có một số state cục bộ là "không được kiểm soát". Ví dụ: component `Panel` ban đầu với một biến state `isActive` là không được kiểm soát vì cha của nó không thể ảnh hưởng đến việc panel có hoạt động hay không.

Ngược lại, bạn có thể nói một component là "được kiểm soát" khi thông tin quan trọng trong đó được điều khiển bởi props thay vì state cục bộ của chính nó. Điều này cho phép component cha chỉ định đầy đủ hành vi của nó. Component `Panel` cuối cùng với prop `isActive` được kiểm soát bởi component `Accordion`.

Các component không được kiểm soát dễ sử dụng hơn trong cha của chúng vì chúng yêu cầu ít cấu hình hơn. Nhưng chúng kém linh hoạt hơn khi bạn muốn phối hợp chúng với nhau. Các component được kiểm soát có tính linh hoạt tối đa, nhưng chúng yêu cầu các component cha định cấu hình chúng đầy đủ bằng props.

Trong thực tế, "được kiểm soát" và "không được kiểm soát" không phải là các thuật ngữ kỹ thuật nghiêm ngặt - mỗi component thường có một số kết hợp giữa state cục bộ và props. Tuy nhiên, đây là một cách hữu ích để nói về cách các component được thiết kế và những khả năng mà chúng cung cấp.

Khi viết một component, hãy xem xét thông tin nào trong đó nên được kiểm soát (thông qua props) và thông tin nào nên không được kiểm soát (thông qua state). Nhưng bạn luôn có thể thay đổi ý định và tái cấu trúc sau này.

</DeepDive>

## Một nguồn sự thật duy nhất cho mỗi state {/*a-single-source-of-truth-for-each-state*/}

Trong một ứng dụng React, nhiều component sẽ có state riêng của chúng. Một số state có thể "sống" gần các component lá (các component ở dưới cùng của cây) như các input. Các state khác có thể "sống" gần đầu ứng dụng hơn. Ví dụ: ngay cả các thư viện định tuyến phía máy khách thường được triển khai bằng cách lưu trữ tuyến đường hiện tại trong state React và truyền nó xuống bằng props!

**Đối với mỗi phần state duy nhất, bạn sẽ chọn component "sở hữu" nó.** Nguyên tắc này còn được gọi là có một ["nguồn sự thật duy nhất".](https://en.wikipedia.org/wiki/Single_source_of_truth) Nó không có nghĩa là tất cả state đều sống ở một nơi - nhưng đối với _mỗi_ phần state, có một component _cụ thể_ giữ phần thông tin đó. Thay vì sao chép state được chia sẻ giữa các component, hãy *nâng nó lên* component cha được chia sẻ chung của chúng và *truyền nó xuống* cho các con cần nó.

Ứng dụng của bạn sẽ thay đổi khi bạn làm việc trên nó. Thông thường, bạn sẽ di chuyển state xuống hoặc trở lại khi bạn vẫn đang tìm hiểu xem mỗi phần state "sống" ở đâu. Đây là tất cả một phần của quá trình!

Để xem điều này cảm thấy như thế nào trong thực tế với một vài component khác, hãy đọc [Tư duy trong React.](/learn/thinking-in-react)

<Recap>

* Khi bạn muốn điều phối hai component, hãy di chuyển state của chúng đến cha chung của chúng.
* Sau đó, truyền thông tin xuống thông qua props từ cha chung của chúng.
* Cuối cùng, truyền các trình xử lý sự kiện xuống để các con có thể thay đổi state của cha.
* Thật hữu ích khi xem xét các component là "được kiểm soát" (được điều khiển bởi props) hoặc "không được kiểm soát" (được điều khiển bởi state).

</Recap>

<Challenges>

#### Các input được đồng bộ hóa {/*synced-inputs*/}

Hai input này độc lập với nhau. Làm cho chúng luôn đồng bộ: việc chỉnh sửa một input sẽ cập nhật input còn lại bằng cùng một văn bản và ngược lại.

<Hint>

Bạn sẽ cần nâng state của chúng lên component cha.

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

Di chuyển biến state `text` vào component cha cùng với trình xử lý `handleChange`. Sau đó, truyền chúng xuống dưới dạng props cho cả hai component `Input`. Điều này sẽ giữ cho chúng đồng bộ.

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

#### Lọc một danh sách {/*filtering-a-list*/}

Trong ví dụ này, `SearchBar` có state `query` riêng để kiểm soát input văn bản. Component `FilterableList` cha của nó hiển thị một `List` các mục, nhưng nó không tính đến truy vấn tìm kiếm.

Sử dụng hàm `filterItems(foods, query)` để lọc danh sách theo truy vấn tìm kiếm. Để kiểm tra các thay đổi của bạn, hãy xác minh rằng việc nhập "s" vào input sẽ lọc danh sách xuống còn "Sushi", "Shish kebab" và "Dim sum".

Lưu ý rằng `filterItems` đã được triển khai và nhập, vì vậy bạn không cần phải tự viết nó!

<Hint>

Bạn sẽ muốn xóa state `query` và trình xử lý `handleChange` khỏi `SearchBar` và di chuyển chúng đến `FilterableList`. Sau đó, truyền chúng xuống `SearchBar` dưới dạng các prop `query` và `onChange`.

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

Nâng state `query` lên component `FilterableList`. Gọi `filterItems(foods, query)` để lấy danh sách đã lọc và truyền nó xuống `List`. Bây giờ, việc thay đổi input truy vấn được phản ánh trong danh sách:

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
