---
title: Truyền Dữ Liệu Sâu Với Context
---

<Intro>

Thông thường, bạn sẽ truyền thông tin từ component cha tới component con thông qua props. Nhưng việc truyền props có thể trở nên dài dòng và bất tiện nếu bạn phải truyền chúng qua nhiều component ở giữa, hoặc nếu nhiều component trong ứng dụng của bạn cần cùng thông tin đó. *Context* cho phép component cha cung cấp một số thông tin cho bất kỳ component nào trong cây bên dưới nó—bất kể sâu đến đâu—mà không cần truyền một cách rõ ràng thông qua props.

</Intro>

<YouWillLearn>

- "Prop drilling" là gì
- Cách thay thế việc truyền props lặp đi lặp lại bằng context
- Các trường hợp sử dụng phổ biến cho context
- Các phương án thay thế phổ biến cho context

</YouWillLearn>

## Vấn đề với việc truyền props {/*the-problem-with-passing-props*/}

[Truyền props](/learn/passing-props-to-a-component) là một cách tuyệt vời để truyền dữ liệu một cách rõ ràng qua cây UI của bạn tới những component sử dụng nó.

Nhưng việc truyền props có thể trở nên dài dòng và bất tiện khi bạn cần truyền một prop sâu qua cây, hoặc nếu nhiều component cần cùng một prop. Tổ tiên chung gần nhất có thể ở xa những component cần dữ liệu, và [nâng state lên](/learn/sharing-state-between-components) cao như vậy có thể dẫn đến tình huống được gọi là "prop drilling".

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Diagram with a tree of three components. The parent contains a bubble representing a value highlighted in purple. The value flows down to each of the two children, both highlighted in purple." >

Nâng state lên

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="Diagram with a tree of ten nodes, each node with two children or less. The root node contains a bubble representing a value highlighted in purple. The value flows down through the two children, each of which pass the value but do not contain it. The left child passes the value down to two children which are both highlighted purple. The right child of the root passes the value through to one of its two children - the right one, which is highlighted purple. That child passed the value through its single child, which passes it down to both of its two children, which are highlighted purple.">

Prop drilling

</Diagram>

</DiagramGroup>

Sẽ thật tuyệt nếu có cách "dịch chuyển" dữ liệu tới những component trong cây cần nó mà không cần truyền props? Với tính năng context của React, điều đó hoàn toàn có thể!

## Context: một phương án thay thế cho việc truyền props {/*context-an-alternative-to-passing-props*/}

Context cho phép component cha cung cấp dữ liệu cho toàn bộ cây bên dưới nó. Có nhiều cách sử dụng cho context. Đây là một ví dụ. Hãy xem xét component `Heading` này chấp nhận một `level` cho kích thước của nó:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Giả sử bạn muốn nhiều heading trong cùng một `Section` luôn có cùng kích thước:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Hiện tại, bạn truyền prop `level` tới từng `<Heading>` riêng biệt:

```js
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

Sẽ thật tuyệt nếu bạn có thể truyền prop `level` tới component `<Section>` thay vì vào `<Heading>`. Cách này bạn có thể đảm bảo rằng tất cả các heading trong cùng một section có cùng kích thước:

```js
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

Nhưng làm thế nào component `<Heading>` có thể biết level của `<Section>` gần nhất? **Điều đó cần có cách nào đó để component con "hỏi" dữ liệu từ đâu đó ở trên trong cây.**

Bạn không thể làm được điều đó chỉ với props. Đây là lúc context xuất hiện. Bạn sẽ làm điều đó trong ba bước:

1. **Tạo** một context. (Bạn có thể gọi nó là `LevelContext`, vì nó dành cho heading level.)
2. **Sử dụng** context đó từ component cần dữ liệu. (`Heading` sẽ sử dụng `LevelContext`.)
3. **Cung cấp** context đó từ component chỉ định dữ liệu. (`Section` sẽ cung cấp `LevelContext`.)

Context cho phép component cha—thậm chí là component rất xa!—cung cấp một số dữ liệu cho toàn bộ cây bên trong nó.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="Diagram with a tree of three components. The parent contains a bubble representing a value highlighted in orange which projects down to the two children, each highlighted in orange." >

Sử dụng context trong những component con gần

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="Diagram with a tree of ten nodes, each node with two children or less. The root parent node contains a bubble representing a value highlighted in orange. The value projects down directly to four leaves and one intermediate component in the tree, which are all highlighted in orange. None of the other intermediate components are highlighted.">

Sử dụng context trong những component con xa

</Diagram>

</DiagramGroup>

### Bước 1: Tạo context {/*step-1-create-the-context*/}

Đầu tiên, bạn cần tạo context. Bạn sẽ cần **export nó từ một file** để các component của bạn có thể sử dụng nó:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Tham số duy nhất của `createContext` là giá trị _mặc định_. Ở đây, `1` tham chiếu tới level heading lớn nhất, nhưng bạn có thể truyền bất kỳ loại giá trị nào (thậm chí là một object). Bạn sẽ thấy ý nghĩa của giá trị mặc định trong bước tiếp theo.

### Bước 2: Sử dụng context {/*step-2-use-the-context*/}

Import Hook `useContext` từ React và context của bạn:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

Hiện tại, component `Heading` đọc `level` từ props:

```js
export default function Heading({ level, children }) {
  // ...
}
```

Thay vào đó, hãy xóa prop `level` và đọc giá trị từ context bạn vừa import, `LevelContext`:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` là một Hook. Giống như `useState` và `useReducer`, bạn chỉ có thể gọi Hook ngay bên trong component React (không bên trong vòng lặp hoặc điều kiện). **`useContext` thông báo cho React rằng component `Heading` muốn đọc `LevelContext`.**

Bây giờ component `Heading` không có prop `level`, bạn không cần truyền prop level tới `Heading` trong JSX của bạn như thế này nữa:

```js
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```

Cập nhật JSX để `Section` nhận nó thay vào đó:

```jsx
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

Như một lời nhắc, đây là markup mà bạn đang cố gắng làm cho hoạt động:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Chú ý ví dụ này vẫn chưa hoạt động hoàn toàn! Tất cả các heading có cùng kích thước bởi vì **mặc dù bạn đang *sử dụng* context, bạn vẫn chưa *cung cấp* nó.** React không biết lấy nó từ đâu!

Nếu bạn không cung cấp context, React sẽ sử dụng giá trị mặc định mà bạn đã chỉ định trong bước trước. Trong ví dụ này, bạn đã chỉ định `1` làm tham số cho `createContext`, vì vậy `useContext(LevelContext)` trả về `1`, thiết lập tất cả những heading đó thành `<h1>`. Hãy khắc phục vấn đề này bằng cách để mỗi `Section` cung cấp context riêng của nó.

### Bước 3: Cung cấp context {/*step-3-provide-the-context*/}

Component `Section` hiện tại render children của nó:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**Bọc chúng bằng context provider** để cung cấp `LevelContext` cho chúng:

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```

Điều này nói với React: "nếu bất kỳ component nào bên trong `<Section>` này hỏi về `LevelContext`, hãy cung cấp cho chúng `level` này." Component sẽ sử dụng giá trị của `<LevelContext>` gần nhất trong cây UI phía trên nó.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Kết quả giống như code gốc, nhưng bạn không cần truyền prop `level` tới từng component `Heading`! Thay vào đó, nó "tìm ra" heading level bằng cách hỏi `Section` gần nhất phía trên:

1. Bạn truyền prop `level` tới `<Section>`.
2. `Section` bọc children của nó vào `<LevelContext value={level}>`.
3. `Heading` hỏi giá trị gần nhất của `LevelContext` phía trên bằng `useContext(LevelContext)`.

## Sử dụng và cung cấp context từ cùng một component {/*using-and-providing-context-from-the-same-component*/}

Hiện tại, bạn vẫn phải chỉ định `level` của từng section thủ công:

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

Vì context cho phép bạn đọc thông tin từ component phía trên, mỗi `Section` có thể đọc `level` từ `Section` phía trên, và truyền `level + 1` xuống tự động. Đây là cách bạn có thể làm điều đó:

```js src/Section.js {5,8}
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

Với thay đổi này, bạn không cần truyền prop `level` *cho cả* `<Section>` *lẫn* `<Heading>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Bây giờ cả `Heading` và `Section` đều đọc `LevelContext` để tìm hiểu chúng "sâu" đến mức nào. Và `Section` bọc children của nó vào `LevelContext` để chỉ định rằng bất cứ thứ gì bên trong nó đều ở level "sâu hơn".

<Note>

Ví dụ này sử dụng heading level bởi vì chúng hiển thị trực quan cách các component lồng nhau có thể ghi đè context. Nhưng context cũng hữu ích cho nhiều trường hợp sử dụng khác. Bạn có thể truyền xuống bất kỳ thông tin nào cần thiết cho toàn bộ cây con: chủ đề màu hiện tại, người dùng hiện đang đăng nhập, v.v.

</Note>

## Context truyền qua các component trung gian {/*context-passes-through-intermediate-components*/}

Bạn có thể chèn bao nhiêu component tùy thích giữa component cung cấp context và component sử dụng nó. Điều này bao gồm cả những component có sẵn như `<div>` và những component bạn có thể tự xây dựng.

Trong ví dụ này, cùng một component `Post` (với đường viền nét đứt) được render ở hai level lồng nhau khác nhau. Chú ý rằng `<Heading>` bên trong nó tự động lấy level từ `<Section>` gần nhất:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Hello traveller!"
        body="Read about my adventures."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post
        title="Flavors of Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires in the rhythm of tango"
        body="I loved it!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

Bạn không làm gì đặc biệt để điều này hoạt động. `Section` chỉ định context cho cây bên trong nó, vì vậy bạn có thể chèn `<Heading>` bất cứ đâu, và nó sẽ có kích thước chính xác. Hãy thử trong sandbox phía trên!

**Context cho phép bạn viết các component "thích ứng với môi trường xung quanh" và hiển thị khác nhau tùy thuộc vào *nơi* (hay nói cách khác, *trong context nào*) chúng được render.**

Cách context hoạt động có thể nhắc bạn nhớ tới [kế thừa thuộc tính CSS.](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) Trong CSS, bạn có thể chỉ định `color: blue` cho một `<div>`, và bất kỳ DOM node nào bên trong nó, dù sâu đến đâu, sẽ kế thừa màu đó trừ khi một DOM node khác ở giữa ghi đè nó bằng `color: green`. Tương tự, trong React, cách duy nhất để ghi đè một context nào đó từ phía trên là bọc children vào context provider với giá trị khác.

Trong CSS, các thuộc tính khác nhau như `color` và `background-color` không ghi đè lẫn nhau. Bạn có thể thiết lập `color` của tất cả `<div>` thành màu đỏ mà không ảnh hưởng đến `background-color`. Tương tự, **các context React khác nhau không ghi đè lẫn nhau.** Mỗi context mà bạn tạo bằng `createContext()` hoàn toàn tách biệt với những cái khác, và liên kết các component sử dụng và cung cấp *context cụ thể đó*. Một component có thể sử dụng hoặc cung cấp nhiều context khác nhau mà không gặp vấn đề gì.

## Trước khi bạn sử dụng context {/*before-you-use-context*/}

Context rất hấp dẫn để sử dụng! Tuy nhiên, điều này cũng có nghĩa là rất dễ lạm dụng nó. **Chỉ vì bạn cần truyền một số props sâu qua nhiều level không có nghĩa là bạn nên đưa thông tin đó vào context.**

Dưới đây là một số phương án thay thế bạn nên cân nhắc trước khi sử dụng context:

1. **Bắt đầu bằng [truyền props.](/learn/passing-props-to-a-component)** Nếu các component của bạn không quá phức tạp, việc truyền một tá props qua một tá component là điều không bất thường. Có thể cảm thấy cực nhọc, nhưng nó làm cho việc component nào sử dụng dữ liệu nào trở nên rất rõ ràng! Người duy trì code của bạn sẽ rất vui khi bạn đã làm luồng dữ liệu trở nên rõ ràng bằng props.
2. **Trích xuất component và [truyền JSX làm `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) cho chúng.** Nếu bạn truyền một số dữ liệu qua nhiều layer của những component trung gian không sử dụng dữ liệu đó (và chỉ truyền nó xuống), điều này thường có nghĩa là bạn đã quên trích xuất một số component dọc đường. Ví dụ, có thể bạn truyền data props như `posts` tới những component trực quan không sử dụng chúng trực tiếp, như `<Layout posts={posts} />`. Thay vào đó, hãy để `Layout` nhận `children` làm prop, và render `<Layout><Posts posts={posts} /></Layout>`. Điều này giảm số lượng layer giữa component chỉ định dữ liệu và component cần nó.

Nếu cả hai cách tiếp cận này đều không phù hợp với bạn, hãy cân nhắc context.

## Các trường hợp sử dụng cho context {/*use-cases-for-context*/}

- **Theming:** Nếu ứng dụng của bạn cho phép người dùng thay đổi giao diện (ví dụ như dark mode), bạn có thể đặt context provider ở đầu ứng dụng, và sử dụng context đó trong những component cần điều chỉnh giao diện trực quan.
- **Tài khoản hiện tại:** Nhiều component có thể cần biết người dùng hiện đang đăng nhập. Đưa nó vào context giúp việc đọc nó ở bất cứ đâu trong cây trở nên tiện lợi. Một số ứng dụng cũng cho phép bạn vận hành nhiều tài khoản cùng lúc (ví dụ để bình luận dưới tư cách người dùng khác). Trong những trường hợp đó, việc bọc một phần UI vào provider lồng nhau với giá trị tài khoản hiện tại khác có thể rất tiện lợi.
- **Routing:** Hầu hết các giải pháp routing sử dụng context bên trong để giữ route hiện tại. Đây là cách mỗi link "biết" nó có đang hoạt động hay không. Nếu bạn xây dựng router riêng, bạn có thể muốn làm điều đó cũng vậy.
- **Quản lý state:** Khi ứng dụng của bạn phát triển, bạn có thể kết thúc với rất nhiều state gần đầu ứng dụng. Nhiều component xa ở bên dưới có thể muốn thay đổi nó. Việc [sử dụng reducer cùng với context](/learn/scaling-up-with-reducer-and-context) để quản lý state phức tạp và truyền nó xuống những component xa mà không gặp quá nhiều rắc rối là điều phổ biến.
  
Context không giới hạn ở những giá trị tĩnh. Nếu bạn truyền giá trị khác vào lần render tiếp theo, React sẽ cập nhật tất cả các component đang đọc nó bên dưới! Đây là lý do tại sao context thường được sử dụng kết hợp với state.

Nhìn chung, nếu một số thông tin cần thiết cho những component xa trong các phần khác nhau của cây, đó là dấu hiệu tốt cho thấy context sẽ giúp ích cho bạn.

<Recap>

- Context cho phép component cung cấp một số thông tin cho toàn bộ cây bên dưới nó.
- Để truyền context:
  1. Tạo và export nó bằng `export const MyContext = createContext(defaultValue)`.
  2. Truyền nó tới Hook `useContext(MyContext)` để đọc nó trong bất kỳ component con nào, dù sâu đến đâu.
  3. Bọc children vào `<MyContext value={...}>` để cung cấp nó từ component cha.
- Context truyền qua bất kỳ component nào ở giữa.
- Context cho phép bạn viết các component "thích ứng với môi trường xung quanh".
- Trước khi sử dụng context, hãy thử truyền props hoặc truyền JSX làm `children`.

</Recap>

<Challenges>

#### Thay thế prop drilling bằng context {/*replace-prop-drilling-with-context*/}

Trong ví dụ này, việc toggle checkbox thay đổi prop `imageSize` được truyền tới mỗi `<PlaceImage>`. Trạng thái checkbox được giữ trong component `App` cấp cao nhất, nhưng mỗi `<PlaceImage>` cần biết về nó.

Hiện tại, `App` truyền `imageSize` tới `List`, sau đó truyền nó tới mỗi `Place`, rồi truyền nó tới `PlaceImage`. Hãy loại bỏ prop `imageSize`, và thay vào đó truyền nó từ component `App` trực tiếp tới `PlaceImage`.

Bạn có thể khai báo context trong `Context.js`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js

```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people."',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

<Solution>

Loại bỏ prop `imageSize` từ tất cả các component.

Tạo và export `ImageSizeContext` từ `Context.js`. Sau đó bọc List vào `<ImageSizeContext value={imageSize}>` để truyền giá trị xuống, và `useContext(ImageSizeContext)` để đọc nó trong `PlaceImage`:

<Sandpack>

```js src/App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

Lưu ý cách những component ở giữa không cần truyền `imageSize` nữa.

</Solution>

</Challenges>
