---
title: useState
---

<Intro>

`useState` là một React Hook cho phép bạn thêm một [biến trạng thái](/learn/state-a-components-memory) vào component của bạn.

```js
const [state, setState] = useState(initialState)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useState(initialState)` {/*usestate*/}

Gọi `useState` ở cấp cao nhất của component để khai báo một [biến trạng thái.](/learn/state-a-components-memory)

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

Quy ước là đặt tên các biến trạng thái như `[something, setSomething]` bằng cách sử dụng [destructuring mảng.](https://javascript.info/destructuring-assignment)

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `initialState`: Giá trị bạn muốn trạng thái ban đầu là. Nó có thể là một giá trị của bất kỳ kiểu nào, nhưng có một hành vi đặc biệt đối với các hàm. Đối số này bị bỏ qua sau lần render ban đầu.
  * Nếu bạn truyền một hàm làm `initialState`, nó sẽ được coi là một _hàm khởi tạo_. Nó phải thuần khiết, không nhận bất kỳ đối số nào và phải trả về một giá trị thuộc bất kỳ kiểu nào. React sẽ gọi hàm khởi tạo của bạn khi khởi tạo component và lưu trữ giá trị trả về của nó làm trạng thái ban đầu. [Xem một ví dụ bên dưới.](#avoiding-recreating-the-initial-state)

#### Trả về {/*returns*/}

`useState` trả về một mảng chính xác hai giá trị:

1. Trạng thái hiện tại. Trong quá trình render đầu tiên, nó sẽ khớp với `initialState` mà bạn đã truyền.
2. Hàm [`set`](#setstate) cho phép bạn cập nhật trạng thái thành một giá trị khác và kích hoạt re-render.

#### Lưu ý {/*caveats*/}

* `useState` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất của component** hoặc Hook của riêng bạn. Bạn không thể gọi nó bên trong các vòng lặp hoặc điều kiện. Nếu bạn cần điều đó, hãy trích xuất một component mới và di chuyển trạng thái vào đó.
* Trong Strict Mode, React sẽ **gọi hàm khởi tạo của bạn hai lần** để [giúp bạn tìm thấy các tạp chất vô tình.](#my-initializer-or-updater-function-runs-twice) Đây là hành vi chỉ dành cho quá trình phát triển và không ảnh hưởng đến sản xuất. Nếu hàm khởi tạo của bạn là thuần khiết (như nó phải vậy), điều này sẽ không ảnh hưởng đến hành vi. Kết quả từ một trong các lệnh gọi sẽ bị bỏ qua.

---

### Các hàm `set`, như `setSomething(nextState)` {/*setstate*/}

Hàm `set` được trả về bởi `useState` cho phép bạn cập nhật trạng thái thành một giá trị khác và kích hoạt re-render. Bạn có thể truyền trạng thái tiếp theo trực tiếp hoặc một hàm tính toán nó từ trạng thái trước đó:

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### Tham số {/*setstate-parameters*/}

* `nextState`: Giá trị bạn muốn trạng thái là. Nó có thể là một giá trị của bất kỳ kiểu nào, nhưng có một hành vi đặc biệt đối với các hàm.
  * Nếu bạn truyền một hàm làm `nextState`, nó sẽ được coi là một _hàm cập nhật_. Nó phải thuần khiết, chỉ nhận trạng thái đang chờ xử lý làm đối số duy nhất và phải trả về trạng thái tiếp theo. React sẽ đặt hàm cập nhật của bạn vào một hàng đợi và re-render component của bạn. Trong quá trình render tiếp theo, React sẽ tính toán trạng thái tiếp theo bằng cách áp dụng tất cả các trình cập nhật được xếp hàng vào trạng thái trước đó. [Xem một ví dụ bên dưới.](#updating-state-based-on-the-previous-state)

#### Trả về {/*setstate-returns*/}

Các hàm `set` không có giá trị trả về.

#### Lưu ý {/*setstate-caveats*/}

* Hàm `set` **chỉ cập nhật biến trạng thái cho lần render *tiếp theo***. Nếu bạn đọc biến trạng thái sau khi gọi hàm `set`, [bạn vẫn sẽ nhận được giá trị cũ](#ive-updated-the-state-but-logging-gives-me-the-old-value) đã có trên màn hình trước khi bạn gọi.

* Nếu giá trị mới bạn cung cấp giống hệt với `state` hiện tại, như được xác định bởi so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React sẽ **bỏ qua việc re-render component và các children của nó.** Đây là một tối ưu hóa. Mặc dù trong một số trường hợp, React vẫn có thể cần gọi component của bạn trước khi bỏ qua các children, nhưng nó không ảnh hưởng đến mã của bạn.

* React [gom các bản cập nhật trạng thái.](/learn/queueing-a-series-of-state-updates) Nó cập nhật màn hình **sau khi tất cả các trình xử lý sự kiện đã chạy** và đã gọi các hàm `set` của chúng. Điều này ngăn chặn nhiều lần re-render trong một sự kiện duy nhất. Trong trường hợp hiếm hoi bạn cần buộc React cập nhật màn hình sớm hơn, ví dụ: để truy cập DOM, bạn có thể sử dụng [`flushSync`.](/reference/react-dom/flushSync)

* Hàm `set` có một identity ổn định, vì vậy bạn sẽ thường thấy nó bị bỏ qua khỏi các dependency của Effect, nhưng việc bao gồm nó sẽ không khiến Effect kích hoạt. Nếu trình lint cho phép bạn bỏ qua một dependency mà không có lỗi, thì điều đó là an toàn. [Tìm hiểu thêm về việc loại bỏ các dependency của Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* Gọi hàm `set` *trong quá trình render* chỉ được phép từ bên trong component đang render. React sẽ loại bỏ đầu ra của nó và ngay lập tức cố gắng render lại với trạng thái mới. Mẫu này hiếm khi cần thiết, nhưng bạn có thể sử dụng nó để **lưu trữ thông tin từ các lần render trước**. [Xem một ví dụ bên dưới.](#storing-information-from-previous-renders)

* Trong Strict Mode, React sẽ **gọi hàm cập nhật của bạn hai lần** để [giúp bạn tìm thấy các tạp chất vô tình.](#my-initializer-or-updater-function-runs-twice) Đây là hành vi chỉ dành cho quá trình phát triển và không ảnh hưởng đến sản xuất. Nếu hàm cập nhật của bạn là thuần khiết (như nó phải vậy), điều này sẽ không ảnh hưởng đến hành vi. Kết quả từ một trong các lệnh gọi sẽ bị bỏ qua.

---

## Cách sử dụng {/*usage*/}

### Thêm trạng thái vào một component {/*adding-state-to-a-component*/}

Gọi `useState` ở cấp cao nhất của component để khai báo một hoặc nhiều [biến trạng thái.](/learn/state-a-components-memory)

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

Quy ước là đặt tên các biến trạng thái như `[something, setSomething]` bằng cách sử dụng [destructuring mảng.](https://javascript.info/destructuring-assignment)

`useState` trả về một mảng chính xác hai mục:

1. <CodeStep step={1}>Trạng thái hiện tại</CodeStep> của biến trạng thái này, ban đầu được đặt thành <CodeStep step={3}>trạng thái ban đầu</CodeStep> mà bạn đã cung cấp.
2. Hàm <CodeStep step={2}>`set`</CodeStep> cho phép bạn thay đổi nó thành bất kỳ giá trị nào khác để đáp ứng với tương tác.

Để cập nhật những gì trên màn hình, hãy gọi hàm `set` với một số trạng thái tiếp theo:

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React sẽ lưu trữ trạng thái tiếp theo, render lại component của bạn với các giá trị mới và cập nhật UI.

<Pitfall>

Gọi hàm `set` [**không** thay đổi trạng thái hiện tại trong mã đã thực thi](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // Vẫn là "Taylor"!
}
```

Nó chỉ ảnh hưởng đến những gì `useState` sẽ trả về bắt đầu từ lần render *tiếp theo*.

</Pitfall>

<Recipes titleText="Các ví dụ cơ bản về useState" titleId="examples-basic">

#### Bộ đếm (số) {/*counter-number*/}

Trong ví dụ này, biến trạng thái `count` giữ một số. Nhấp vào nút sẽ tăng nó.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Trường văn bản (chuỗi) {/*text-field-string*/}

Trong ví dụ này, biến trạng thái `text` giữ một chuỗi. Khi bạn nhập, `handleChange` đọc giá trị đầu vào mới nhất từ phần tử DOM đầu vào của trình duyệt và gọi `setText` để cập nhật trạng thái. Điều này cho phép bạn hiển thị `text` hiện tại bên dưới.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Hộp kiểm (boolean) {/*checkbox-boolean*/}

Trong ví dụ này, biến trạng thái `liked` giữ một boolean. Khi bạn nhấp vào đầu vào, `setLiked` cập nhật biến trạng thái `liked` với việc đầu vào hộp kiểm của trình duyệt có được chọn hay không. Biến `liked` được sử dụng để render văn bản bên dưới hộp kiểm.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Biểu mẫu (hai biến) {/*form-two-variables*/}

Bạn có thể khai báo nhiều hơn một biến trạng thái trong cùng một component. Mỗi biến trạng thái hoàn toàn độc lập.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Cập nhật trạng thái dựa trên trạng thái trước đó {/*updating-state-based-on-the-previous-state*/}

Giả sử `age` là `42`. Trình xử lý này gọi `setAge(age + 1)` ba lần:


```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```
Tuy nhiên, sau một lần nhấp, `age` sẽ chỉ là `43` thay vì `45`! Điều này là do việc gọi hàm `set` [không cập nhật](/learn/state-as-a-snapshot) biến trạng thái `age` trong mã đang chạy. Vì vậy, mỗi lệnh gọi `setAge(age + 1)` trở thành `setAge(43)`.

Để giải quyết vấn đề này, **bạn có thể truyền một *hàm cập nhật*** cho `setAge` thay vì trạng thái tiếp theo:

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

Ở đây, `a => a + 1` là hàm cập nhật của bạn. Nó lấy <CodeStep step={1}>trạng thái đang chờ xử lý</CodeStep> và tính toán <CodeStep step={2}>trạng thái tiếp theo</CodeStep> từ đó.

React đặt các hàm cập nhật của bạn vào một [hàng đợi.](/learn/queueing-a-series-of-state-updates) Sau đó, trong quá trình render tiếp theo, nó sẽ gọi chúng theo cùng một thứ tự:

1. `a => a + 1` sẽ nhận `42` làm trạng thái đang chờ xử lý và trả về `43` làm trạng thái tiếp theo.
2. `a => a + 1` sẽ nhận `43` làm trạng thái đang chờ xử lý và trả về `44` làm trạng thái tiếp theo.
3. `a => a + 1` sẽ nhận `44` làm trạng thái đang chờ xử lý và trả về `45` làm trạng thái tiếp theo.

Không có bản cập nhật nào khác đang chờ xử lý, vì vậy React sẽ lưu trữ `45` làm trạng thái hiện tại cuối cùng.

Theo quy ước, người ta thường đặt tên đối số trạng thái đang chờ xử lý cho chữ cái đầu tiên của tên biến trạng thái, chẳng hạn như `a` cho `age`. Tuy nhiên, bạn cũng có thể gọi nó là `prevAge` hoặc một cái gì đó khác mà bạn thấy rõ ràng hơn.

React có thể [gọi các hàm cập nhật của bạn hai lần](#my-initializer-or-updater-function-runs-twice) trong quá trình phát triển để xác minh rằng chúng [thuần khiết.](/learn/keeping-components-pure)

<DeepDive>

#### Có phải việc sử dụng hàm cập nhật luôn được ưu tiên? {/*is-using-an-updater-always-preferred*/}

Bạn có thể nghe một khuyến nghị là luôn viết mã như `setAge(a => a + 1)` nếu trạng thái bạn đang đặt được tính từ trạng thái trước đó. Không có hại gì trong đó, nhưng nó cũng không phải lúc nào cũng cần thiết.

Trong hầu hết các trường hợp, không có sự khác biệt giữa hai cách tiếp cận này. React luôn đảm bảo rằng đối với các hành động cố ý của người dùng, chẳng hạn như nhấp chuột, biến trạng thái `age` sẽ được cập nhật trước lần nhấp tiếp theo. Điều này có nghĩa là không có rủi ro nào khi trình xử lý nhấp chuột nhìn thấy một `age` "cũ" khi bắt đầu trình xử lý sự kiện.

Tuy nhiên, nếu bạn thực hiện nhiều cập nhật trong cùng một sự kiện, thì hàm cập nhật có thể hữu ích. Chúng cũng hữu ích nếu việc truy cập chính biến trạng thái là bất tiện (bạn có thể gặp phải điều này khi tối ưu hóa việc render lại).

Nếu bạn thích tính nhất quán hơn là cú pháp dài dòng hơn một chút, thì việc luôn viết một hàm cập nhật nếu trạng thái bạn đang đặt được tính từ trạng thái trước đó là hợp lý. Nếu nó được tính từ trạng thái trước đó của một số biến trạng thái *khác*, bạn có thể muốn kết hợp chúng thành một đối tượng và [sử dụng một reducer.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="Sự khác biệt giữa việc truyền một hàm cập nhật và truyền trực tiếp trạng thái tiếp theo" titleId="examples-updater">

#### Truyền hàm cập nhật {/*passing-the-updater-function*/}

Ví dụ này truyền hàm cập nhật, vì vậy nút "+3" hoạt động.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### Truyền trực tiếp trạng thái tiếp theo {/*passing-the-next-state-directly*/}

Ví dụ này **không** truyền hàm cập nhật, vì vậy nút "+3" **không hoạt động như dự định**.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Cập nhật các đối tượng và mảng trong trạng thái {/*updating-objects-and-arrays-in-state*/}

Bạn có thể đặt các đối tượng và mảng vào trạng thái. Trong React, trạng thái được coi là chỉ đọc, vì vậy **bạn nên *thay thế* nó thay vì *mutate* các đối tượng hiện có của bạn**. Ví dụ: nếu bạn có một đối tượng `form` trong trạng thái, đừng mutate nó:

```js
// 🚩 Đừng mutate một đối tượng trong trạng thái như thế này:
form.firstName = 'Taylor';
```

Thay vào đó, hãy thay thế toàn bộ đối tượng bằng cách tạo một đối tượng mới:

```js
// ✅ Thay thế trạng thái bằng một đối tượng mới
setForm({
  ...form,
  firstName: 'Taylor'
});
```

Đọc [cập nhật các đối tượng trong trạng thái](/learn/updating-objects-in-state) và [cập nhật các mảng trong trạng thái](/learn/updating-arrays-in-state) để tìm hiểu thêm.

<Recipes titleText="Ví dụ về các đối tượng và mảng trong trạng thái" titleId="examples-objects">

#### Form (đối tượng) {/*form-object*/}

Trong ví dụ này, biến trạng thái `form` giữ một đối tượng. Mỗi input có một trình xử lý thay đổi gọi `setForm` với trạng thái tiếp theo của toàn bộ form. Cú pháp spread `{ ...form }` đảm bảo rằng đối tượng trạng thái được thay thế chứ không phải bị mutate.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        First name:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Last name:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Form (đối tượng lồng nhau) {/*form-nested-object*/}

Trong ví dụ này, trạng thái được lồng sâu hơn. Khi bạn cập nhật trạng thái lồng nhau, bạn cần tạo một bản sao của đối tượng bạn đang cập nhật, cũng như bất kỳ đối tượng nào "chứa" nó trên đường đi lên. Đọc [cập nhật một đối tượng lồng nhau](/learn/updating-objects-in-state#updating-a-nested-object) để tìm hiểu thêm.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### Danh sách (mảng) {/*list-array*/}

Trong ví dụ này, biến trạng thái `todos` giữ một mảng. Mỗi trình xử lý nút gọi `setTodos` với phiên bản tiếp theo của mảng đó. Cú pháp spread `[...todos]`, `todos.map()` và `todos.filter()` đảm bảo mảng trạng thái được thay thế chứ không phải bị mutate.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

#### Viết logic cập nhật ngắn gọn với Immer {/*writing-concise-update-logic-with-immer*/}

Nếu việc cập nhật các mảng và đối tượng mà không cần mutation cảm thấy tẻ nhạt, bạn có thể sử dụng một thư viện như [Immer](https://github.com/immerjs/use-immer) để giảm mã lặp đi lặp lại. Immer cho phép bạn viết mã ngắn gọn như thể bạn đang mutate các đối tượng, nhưng bên dưới nó thực hiện các cập nhật bất biến:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Tránh tạo lại trạng thái ban đầu {/*avoiding-recreating-the-initial-state*/}

React lưu trạng thái ban đầu một lần và bỏ qua nó trong các lần render tiếp theo.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

Mặc dù kết quả của `createInitialTodos()` chỉ được sử dụng cho lần render ban đầu, bạn vẫn đang gọi hàm này trên mỗi lần render. Điều này có thể gây lãng phí nếu nó tạo ra các mảng lớn hoặc thực hiện các tính toán tốn kém.

Để giải quyết vấn đề này, bạn có thể **truyền nó như một hàm _khởi tạo_** cho `useState` thay thế:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Lưu ý rằng bạn đang truyền `createInitialTodos`, là *chính hàm*, chứ không phải `createInitialTodos()`, là kết quả của việc gọi nó. Nếu bạn truyền một hàm cho `useState`, React sẽ chỉ gọi nó trong quá trình khởi tạo.

React có thể [gọi các hàm khởi tạo của bạn hai lần](#my-initializer-or-updater-function-runs-twice) trong quá trình phát triển để xác minh rằng chúng [thuần khiết.](/learn/keeping-components-pure)

<Recipes titleText="Sự khác biệt giữa việc truyền một hàm khởi tạo và truyền trực tiếp trạng thái ban đầu" titleId="examples-initializer">

#### Truyền hàm khởi tạo {/*passing-the-initializer-function*/}

Ví dụ này truyền hàm khởi tạo, vì vậy hàm `createInitialTodos` chỉ chạy trong quá trình khởi tạo. Nó không chạy khi component re-render, chẳng hạn như khi bạn nhập vào input.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Truyền trực tiếp trạng thái ban đầu {/*passing-the-initial-state-directly*/}

Ví dụ này **không** truyền hàm khởi tạo, vì vậy hàm `createInitialTodos` chạy trên mỗi lần render, chẳng hạn như khi bạn nhập vào input. Không có sự khác biệt có thể quan sát được trong hành vi, nhưng mã này kém hiệu quả hơn.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Đặt lại trạng thái bằng một key {/*resetting-state-with-a-key*/}

Bạn sẽ thường gặp thuộc tính `key` khi [render danh sách.](/learn/rendering-lists) Tuy nhiên, nó cũng phục vụ một mục đích khác.

Bạn có thể **đặt lại trạng thái của một component bằng cách truyền một `key` khác cho component đó.** Trong ví dụ này, nút Reset thay đổi biến trạng thái `version`, mà chúng ta truyền dưới dạng `key` cho `Form`. Khi `key` thay đổi, React sẽ tạo lại component `Form` (và tất cả các children của nó) từ đầu, vì vậy trạng thái của nó sẽ được đặt lại.

Đọc [duy trì và đặt lại trạng thái](/learn/preserving-and-resetting-state) để tìm hiểu thêm.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### Lưu trữ thông tin từ các lần render trước {/*storing-information-from-previous-renders*/}

Thông thường, bạn sẽ cập nhật trạng thái trong các trình xử lý sự kiện. Tuy nhiên, trong một số trường hợp hiếm hoi, bạn có thể muốn điều chỉnh trạng thái để đáp ứng với việc render -- ví dụ: bạn có thể muốn thay đổi một biến trạng thái khi một prop thay đổi.

Trong hầu hết các trường hợp, bạn không cần điều này:

* **Nếu giá trị bạn cần có thể được tính toán hoàn toàn từ các prop hiện tại hoặc trạng thái khác, [hãy loại bỏ trạng thái dư thừa đó hoàn toàn.](/learn/choosing-the-state-structure#avoid-redundant-state)** Nếu bạn lo lắng về việc tính toán lại quá thường xuyên, thì [`useMemo Hook`](/reference/react/useMemo) có thể giúp ích.
* Nếu bạn muốn đặt lại trạng thái của toàn bộ cây component, [hãy truyền một `key` khác cho component của bạn.](#resetting-state-with-a-key)
* Nếu có thể, hãy cập nhật tất cả các trạng thái liên quan trong các trình xử lý sự kiện.

Trong trường hợp hiếm hoi mà không có điều nào trong số này áp dụng, có một mẫu bạn có thể sử dụng để cập nhật trạng thái dựa trên các giá trị đã được render cho đến nay, bằng cách gọi một hàm `set` trong khi component của bạn đang render.

Đây là một ví dụ. Component `CountLabel` này hiển thị prop `count` được truyền cho nó:

```js src/CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

Giả sử bạn muốn hiển thị xem bộ đếm đã *tăng hay giảm* kể từ lần thay đổi cuối cùng. Prop `count` không cho bạn biết điều này -- bạn cần theo dõi giá trị trước đó của nó. Thêm biến trạng thái `prevCount` để theo dõi nó. Thêm một biến trạng thái khác có tên là `trend` để giữ xem số lượng đã tăng hay giảm. So sánh `prevCount` với `count` và nếu chúng không bằng nhau, hãy cập nhật cả `prevCount` và `trend`. Bây giờ bạn có thể hiển thị cả prop số lượng hiện tại và *cách nó đã thay đổi kể từ lần render cuối cùng*.


<Sandpack>

```js src/App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js src/CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>
Lưu ý rằng nếu bạn gọi một hàm `set` trong khi render, nó phải nằm trong một điều kiện như `prevCount !== count`, và phải có một lệnh gọi như `setPrevCount(count)` bên trong điều kiện đó. Nếu không, component của bạn sẽ re-render trong một vòng lặp cho đến khi nó bị crash. Ngoài ra, bạn chỉ có thể cập nhật trạng thái của component *đang render* theo cách này. Gọi hàm `set` của một component *khác* trong khi render là một lỗi. Cuối cùng, lệnh gọi `set` của bạn vẫn nên [cập nhật trạng thái mà không cần mutation](#updating-objects-and-arrays-in-state) -- điều này không có nghĩa là bạn có thể phá vỡ các quy tắc khác của [hàm thuần khiết.](/learn/keeping-components-pure)

Mô hình này có thể khó hiểu và thường nên tránh. Tuy nhiên, nó tốt hơn là cập nhật trạng thái trong một effect. Khi bạn gọi hàm `set` trong quá trình render, React sẽ re-render component đó ngay sau khi component của bạn thoát bằng một câu lệnh `return` và trước khi render các children. Bằng cách này, children không cần phải render hai lần. Phần còn lại của hàm component của bạn vẫn sẽ thực thi (và kết quả sẽ bị loại bỏ). Nếu điều kiện của bạn nằm dưới tất cả các lệnh gọi Hook, bạn có thể thêm một `return;` sớm để khởi động lại quá trình render sớm hơn.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi đã cập nhật trạng thái, nhưng việc ghi log lại cho tôi giá trị cũ {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

Gọi hàm `set` **không thay đổi trạng thái trong mã đang chạy**:

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Yêu cầu re-render với 1
  console.log(count);  // Vẫn là 0!

  setTimeout(() => {
    console.log(count); // Cũng là 0!
  }, 5000);
}
```

Điều này là do [trạng thái hoạt động như một snapshot.](/learn/state-as-a-snapshot) Cập nhật trạng thái yêu cầu một render khác với giá trị trạng thái mới, nhưng không ảnh hưởng đến biến JavaScript `count` trong trình xử lý sự kiện đang chạy của bạn.

Nếu bạn cần sử dụng trạng thái tiếp theo, bạn có thể lưu nó trong một biến trước khi chuyển nó cho hàm `set`:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### Tôi đã cập nhật trạng thái, nhưng màn hình không cập nhật {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React sẽ **bỏ qua bản cập nhật của bạn nếu trạng thái tiếp theo bằng với trạng thái trước đó,** như được xác định bởi so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Điều này thường xảy ra khi bạn thay đổi trực tiếp một đối tượng hoặc một mảng trong trạng thái:

```js
obj.x = 10;  // 🚩 Sai: mutating đối tượng hiện có
setObj(obj); // 🚩 Không làm gì cả
```

Bạn đã mutate một đối tượng `obj` hiện có và chuyển nó trở lại `setObj`, vì vậy React đã bỏ qua bản cập nhật. Để khắc phục điều này, bạn cần đảm bảo rằng bạn luôn [_thay thế_ các đối tượng và mảng trong trạng thái thay vì _mutating_ chúng](#updating-objects-and-arrays-in-state):

```js
// ✅ Đúng: tạo một đối tượng mới
setObj({
  ...obj,
  x: 10
});
```

---

### Tôi đang gặp lỗi: "Quá nhiều lần re-render" {/*im-getting-an-error-too-many-re-renders*/}

Bạn có thể nhận được một lỗi cho biết: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` (Quá nhiều lần re-render. React giới hạn số lần render để ngăn chặn một vòng lặp vô hạn.) Thông thường, điều này có nghĩa là bạn đang đặt trạng thái *trong quá trình render* một cách vô điều kiện, vì vậy component của bạn đi vào một vòng lặp: render, đặt trạng thái (gây ra một render), render, đặt trạng thái (gây ra một render), v.v. Rất thường xuyên, điều này là do một sai lầm trong việc chỉ định một trình xử lý sự kiện:

```js {1-2}
// 🚩 Sai: gọi trình xử lý trong quá trình render
return <button onClick={handleClick()}>Click me</button>

// ✅ Đúng: chuyển trình xử lý sự kiện xuống
return <button onClick={handleClick}>Click me</button>

// ✅ Đúng: chuyển một hàm inline xuống
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

Nếu bạn không thể tìm thấy nguyên nhân của lỗi này, hãy nhấp vào mũi tên bên cạnh lỗi trong bảng điều khiển và xem qua ngăn xếp JavaScript để tìm lệnh gọi hàm `set` cụ thể chịu trách nhiệm cho lỗi.

---

### Hàm khởi tạo hoặc hàm cập nhật của tôi chạy hai lần {/*my-initializer-or-updater-function-runs-twice*/}

Trong [Strict Mode](/reference/react/StrictMode), React sẽ gọi một số hàm của bạn hai lần thay vì một lần:

```js {2,5-6,11-12}
function TodoList() {
  // Hàm component này sẽ chạy hai lần cho mỗi lần render.

  const [todos, setTodos] = useState(() => {
    // Hàm khởi tạo này sẽ chạy hai lần trong quá trình khởi tạo.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // Hàm cập nhật này sẽ chạy hai lần cho mỗi lần nhấp.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

Điều này được mong đợi và không nên phá vỡ mã của bạn.

Hành vi **chỉ dành cho quá trình phát triển** này giúp bạn [giữ cho các component thuần khiết.](/learn/keeping-components-pure) React sử dụng kết quả của một trong các lệnh gọi và bỏ qua kết quả của lệnh gọi kia. Miễn là component, hàm khởi tạo và hàm cập nhật của bạn là thuần khiết, điều này sẽ không ảnh hưởng đến logic của bạn. Tuy nhiên, nếu chúng vô tình không thuần khiết, điều này sẽ giúp bạn nhận thấy những sai lầm.

Ví dụ: hàm cập nhật không thuần khiết này mutate một mảng trong trạng thái:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Sai lầm: mutating trạng thái
  prevTodos.push(createTodo());
});
```

Vì React gọi hàm cập nhật của bạn hai lần, bạn sẽ thấy todo đã được thêm hai lần, vì vậy bạn sẽ biết rằng có một sai lầm. Trong ví dụ này, bạn có thể sửa sai lầm bằng cách [thay thế mảng thay vì mutating nó](#updating-objects-and-arrays-in-state):

```js {2,3}
setTodos(prevTodos => {
  // ✅ Đúng: thay thế bằng trạng thái mới
  return [...prevTodos, createTodo()];
});
```

Bây giờ hàm cập nhật này là thuần khiết, việc gọi nó thêm một lần không tạo ra sự khác biệt trong hành vi. Đây là lý do tại sao React gọi nó hai lần giúp bạn tìm thấy những sai lầm. **Chỉ các hàm component, hàm khởi tạo và hàm cập nhật cần phải thuần khiết.** Các trình xử lý sự kiện không cần phải thuần khiết, vì vậy React sẽ không bao giờ gọi các trình xử lý sự kiện của bạn hai lần.

Đọc [giữ cho các component thuần khiết](/learn/keeping-components-pure) để tìm hiểu thêm.

---

### Tôi đang cố gắng đặt trạng thái thành một hàm, nhưng nó lại được gọi thay vì được lưu trữ {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

Bạn không thể đặt một hàm vào trạng thái như thế này:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

Vì bạn đang chuyển một hàm, React giả định rằng `someFunction` là một [hàm khởi tạo](#avoiding-recreating-the-initial-state) và `someOtherFunction` là một [hàm cập nhật](#updating-state-based-on-the-previous-state), vì vậy nó cố gắng gọi chúng và lưu trữ kết quả. Để thực sự *lưu trữ* một hàm, bạn phải đặt `() =>` trước chúng trong cả hai trường hợp. Sau đó, React sẽ lưu trữ các hàm bạn chuyển.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
