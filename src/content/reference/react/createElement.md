---
title: createElement
---

<Intro>

`createElement` cho phép bạn tạo một phần tử React. Nó đóng vai trò như một giải pháp thay thế cho việc viết [JSX.](/learn/writing-markup-with-jsx)

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

Gọi `createElement` để tạo một phần tử React với `type`, `props` và `children` đã cho.

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `type`: Đối số `type` phải là một kiểu component React hợp lệ. Ví dụ: nó có thể là một chuỗi tên thẻ (chẳng hạn như `'div'` hoặc `'span'`), hoặc một component React (một hàm, một class hoặc một component đặc biệt như [`Fragment`](/reference/react/Fragment)).

* `props`: Đối số `props` phải là một đối tượng hoặc `null`. Nếu bạn truyền `null`, nó sẽ được coi như một đối tượng trống. React sẽ tạo một phần tử với các props khớp với `props` mà bạn đã truyền. Lưu ý rằng `ref` và `key` từ đối tượng `props` của bạn là đặc biệt và sẽ *không* khả dụng dưới dạng `element.props.ref` và `element.props.key` trên `element` được trả về. Chúng sẽ có sẵn dưới dạng `element.ref` và `element.key`.

* **tùy chọn** `...children`: Không hoặc nhiều node con. Chúng có thể là bất kỳ node React nào, bao gồm các phần tử React, chuỗi, số, [portal](/reference/react-dom/createPortal), các node trống (`null`, `undefined`, `true` và `false`) và mảng các node React.

#### Giá trị trả về {/*returns*/}

`createElement` trả về một đối tượng phần tử React với một vài thuộc tính:

* `type`: `type` bạn đã truyền.
* `props`: `props` bạn đã truyền ngoại trừ `ref` và `key`.
* `ref`: `ref` bạn đã truyền. Nếu thiếu, `null`.
* `key`: `key` bạn đã truyền, được ép thành một chuỗi. Nếu thiếu, `null`.

Thông thường, bạn sẽ trả về phần tử từ component của mình hoặc tạo nó thành một phần tử con của một phần tử khác. Mặc dù bạn có thể đọc các thuộc tính của phần tử, nhưng tốt nhất là coi mọi phần tử là không rõ ràng sau khi nó được tạo và chỉ hiển thị nó.

#### Lưu ý {/*caveats*/}

* Bạn phải **coi các phần tử React và các props của chúng là [bất biến](https://en.wikipedia.org/wiki/Immutable_object)** và không bao giờ thay đổi nội dung của chúng sau khi tạo. Trong quá trình phát triển, React sẽ [đóng băng](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) phần tử được trả về và thuộc tính `props` của nó một cách nông cạn để thực thi điều này.

* Khi bạn sử dụng JSX, **bạn phải bắt đầu một thẻ bằng một chữ cái viết hoa để hiển thị component tùy chỉnh của riêng bạn.** Nói cách khác, `<Something />` tương đương với `createElement(Something)`, nhưng `<something />` (chữ thường) tương đương với `createElement('something')` (lưu ý nó là một chuỗi, vì vậy nó sẽ được coi là một thẻ HTML tích hợp).

* Bạn chỉ nên **truyền children dưới dạng nhiều đối số cho `createElement` nếu tất cả chúng đều được biết tĩnh,** như `createElement('h1', {}, child1, child2, child3)`. Nếu children của bạn là động, hãy truyền toàn bộ mảng làm đối số thứ ba: `createElement('ul', {}, listItems)`. Điều này đảm bảo rằng React sẽ [cảnh báo bạn về việc thiếu `key`](/learn/rendering-lists#keeping-list-items-in-order-with-key) cho bất kỳ danh sách động nào. Đối với danh sách tĩnh, điều này là không cần thiết vì chúng không bao giờ sắp xếp lại.

---

## Cách sử dụng {/*usage*/}

### Tạo một phần tử mà không cần JSX {/*creating-an-element-without-jsx*/}

Nếu bạn không thích [JSX](/learn/writing-markup-with-jsx) hoặc không thể sử dụng nó trong dự án của mình, bạn có thể sử dụng `createElement` như một giải pháp thay thế.

Để tạo một phần tử mà không cần JSX, hãy gọi `createElement` với một <CodeStep step={1}>type</CodeStep>, <CodeStep step={2}>props</CodeStep> và <CodeStep step={3}>children</CodeStep>:

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'Hello ',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'. Welcome!'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

Các <CodeStep step={3}>children</CodeStep> là tùy chọn và bạn có thể truyền bao nhiêu tùy ý (ví dụ trên có ba children). Đoạn code này sẽ hiển thị một tiêu đề `<h1>` với lời chào. Để so sánh, đây là ví dụ tương tự được viết lại bằng JSX:

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "Hello <i>{name}</i>. Welcome!"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

Để hiển thị component React của riêng bạn, hãy truyền một hàm như `Greeting` làm <CodeStep step={1}>type</CodeStep> thay vì một chuỗi như `'h1'`:

```js [[1, 2, "Greeting"], [2, 2, "{ name: 'Taylor' }"]]
export default function App() {
  return createElement(Greeting, { name: 'Taylor' });
}
```

Với JSX, nó sẽ trông như thế này:

```js [[1, 2, "Greeting"], [2, 2, "name=\\"Taylor\\""]]
export default function App() {
  return <Greeting name="Taylor" />;
}
```

Đây là một ví dụ hoàn chỉnh được viết bằng `createElement`:

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Và đây là ví dụ tương tự được viết bằng JSX:

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Cả hai kiểu code đều ổn, vì vậy bạn có thể sử dụng bất kỳ kiểu nào bạn thích cho dự án của mình. Lợi ích chính của việc sử dụng JSX so với `createElement` là dễ dàng nhận thấy thẻ đóng nào tương ứng với thẻ mở nào.

<DeepDive>

#### Chính xác thì một phần tử React là gì? {/*what-is-a-react-element-exactly*/}

Một phần tử là một mô tả nhẹ về một phần của giao diện người dùng. Ví dụ: cả `<Greeting name="Taylor" />` và `createElement(Greeting, { name: 'Taylor' })` đều tạo ra một đối tượng như thế này:

```js
// Đơn giản hóa một chút
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null,
}
```

**Lưu ý rằng việc tạo đối tượng này không hiển thị component `Greeting` hoặc tạo bất kỳ phần tử DOM nào.**

Một phần tử React giống như một mô tả--một hướng dẫn để React hiển thị component `Greeting` sau này. Bằng cách trả về đối tượng này từ component `App` của bạn, bạn cho React biết phải làm gì tiếp theo.

Việc tạo các phần tử cực kỳ rẻ nên bạn không cần cố gắng tối ưu hóa hoặc tránh nó.

</DeepDive>
