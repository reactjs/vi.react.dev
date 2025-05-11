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

Quy ước là đặt tên cho các biến trạng thái như `[something, setSomething]` bằng cách sử dụng [destructuring mảng.](https://javascript.info/destructuring-assignment)

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `initialState`: Giá trị bạn muốn trạng thái ban đầu là. Nó có thể là một giá trị của bất kỳ kiểu nào, nhưng có một hành vi đặc biệt đối với các hàm. Đối số này bị bỏ qua sau lần render ban đầu.
  * Nếu bạn truyền một hàm làm `initialState`, nó sẽ được coi là một _hàm khởi tạo_. Nó phải là thuần khiết, không có đối số và phải trả về một giá trị thuộc bất kỳ kiểu nào. React sẽ gọi hàm khởi tạo của bạn khi khởi tạo component và lưu trữ giá trị trả về của nó làm trạng thái ban đầu. [Xem một ví dụ bên dưới.](#avoiding-recreating-the-initial-state)

#### Trả về {/*returns*/}

`useState` trả về một mảng với chính xác hai giá trị:

1. Trạng thái hiện tại. Trong lần render đầu tiên, nó sẽ khớp với `initialState` bạn đã truyền.
2. Hàm [`set`](#setstate) cho phép bạn cập nhật trạng thái thành một giá trị khác và kích hoạt re-render.

#### Lưu ý {/*caveats*/}

* `useState` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất của component** hoặc Hook của riêng bạn. Bạn không thể gọi nó bên trong các vòng lặp hoặc điều kiện. Nếu bạn cần điều đó, hãy trích xuất một component mới và di chuyển trạng thái vào đó.
* Trong Strict Mode, React sẽ **gọi hàm khởi tạo của bạn hai lần** để [giúp bạn tìm thấy các tạp chất vô tình.](#my-initializer-or-updater-function-runs-twice) Đây là hành vi chỉ dành cho quá trình phát triển và không ảnh hưởng đến sản xuất. Nếu hàm khởi tạo của bạn là thuần khiết (như nó phải như vậy), điều này sẽ không ảnh hưởng đến hành vi. Kết quả từ một trong các lệnh gọi sẽ bị bỏ qua.

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
  * Nếu bạn truyền một hàm làm `nextState`, nó sẽ được coi là một _hàm cập nhật_. Nó phải là thuần khiết, phải lấy trạng thái đang chờ xử lý làm đối số duy nhất và phải trả về trạng thái tiếp theo. React sẽ đặt hàm cập nhật của bạn vào một hàng đợi và re-render component của bạn. Trong quá trình render tiếp theo, React sẽ tính toán trạng thái tiếp theo bằng cách áp dụng tất cả các trình cập nhật được xếp hàng đợi vào trạng thái trước đó. [Xem một ví dụ bên dưới.](#updating-state-based-on-the-previous-state)

#### Trả về {/*setstate-returns*/}

Các hàm `set` không có giá trị trả về.

#### Lưu ý {/*setstate-caveats*/}

* Hàm `set` **chỉ cập nhật biến trạng thái cho lần render *tiếp theo***. Nếu bạn đọc biến trạng thái sau khi gọi hàm `set`, [bạn vẫn sẽ nhận được giá trị cũ](#ive-updated-the-state-but-logging-gives-me-the-old-value) đã có trên màn hình trước khi bạn gọi.

* Nếu giá trị mới bạn cung cấp giống hệt với `state` hiện tại, như được xác định bởi so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React sẽ **bỏ qua việc re-render component và các component con của nó.** Đây là một tối ưu hóa. Mặc dù trong một số trường hợp, React vẫn có thể cần gọi component của bạn trước khi bỏ qua các component con, nhưng nó sẽ không ảnh hưởng đến code của bạn.

* React [gom các bản cập nhật trạng thái.](/learn/queueing-a-series-of-state-updates) Nó cập nhật màn hình **sau khi tất cả các trình xử lý sự kiện đã chạy** và đã gọi các hàm `set` của chúng. Điều này ngăn chặn nhiều lần re-render trong một sự kiện duy nhất. Trong trường hợp hiếm hoi bạn cần buộc React cập nhật màn hình sớm hơn, ví dụ: để truy cập DOM, bạn có thể sử dụng [`flushSync`.](/reference/react-dom/flushSync)

* Hàm `set` có một identity ổn định, vì vậy bạn sẽ thường thấy nó bị bỏ qua khỏi các dependency của Effect, nhưng việc bao gồm nó sẽ không khiến Effect kích hoạt. Nếu linter cho phép bạn bỏ qua một dependency mà không có lỗi, thì việc đó là an toàn. [Tìm hiểu thêm về việc loại bỏ các dependency của Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* Gọi hàm `set` *trong quá trình rendering* chỉ được phép từ bên trong component đang render. React sẽ loại bỏ đầu ra của nó và ngay lập tức cố gắng render lại với trạng thái mới. Mẫu này hiếm khi cần thiết, nhưng bạn có thể sử dụng nó để **lưu trữ thông tin từ các lần render trước đó**. [Xem một ví dụ bên dưới.](#storing-information-from-previous-renders)

* Trong Strict Mode, React sẽ **gọi hàm cập nhật của bạn hai lần** để [giúp bạn tìm thấy các tạp chất vô tình.](#my-initializer-or-updater-function-runs-twice) Đây là hành vi chỉ dành cho quá trình phát triển và không ảnh hưởng đến sản xuất. Nếu hàm cập nhật của bạn là thuần khiết (như nó phải như vậy), điều này sẽ không ảnh hưởng đến hành vi. Kết quả từ một trong các lệnh gọi sẽ bị bỏ qua.

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

Quy ước là đặt tên cho các biến trạng thái như `[something, setSomething]` bằng cách sử dụng [destructuring mảng.](https://javascript.info/destructuring-assignment)

`useState` trả về một mảng với chính xác hai mục:

1. <CodeStep step={1}>Trạng thái hiện tại</CodeStep> của biến trạng thái này, ban đầu được đặt thành <CodeStep step={3}>trạng thái ban đầu</CodeStep> mà bạn đã cung cấp.
2. <CodeStep step={2}>Hàm `set`</CodeStep> cho phép bạn thay đổi nó thành bất kỳ giá trị nào khác để đáp ứng tương tác.

Để cập nhật những gì trên màn hình, hãy gọi hàm `set` với một số trạng thái tiếp theo:

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React sẽ lưu trữ trạng thái tiếp theo, render lại component của bạn với các giá trị mới và cập nhật UI.

<Pitfall>

Gọi hàm `set` [**không** thay đổi trạng thái hiện tại trong code đã thực thi](#ive-updated-the-state-but-logging-gives-me-the-old-value):

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
      Bạn đã nhấn tôi {count} lần
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
      <p>Bạn đã nhập: {text}</p>
      <button onClick={() => setText('hello')}>
        Đặt lại
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
        Tôi thích điều này
      </label>
      <p>Bạn {liked ? 'thích' : 'không thích'} điều này.</p>
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
        Tăng tuổi
      </button>
      <p>Xin chào, {name}. Bạn {age} tuổi.</p>
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

Tuy nhiên, sau một lần nhấp, `age` sẽ chỉ là `43` thay vì `45`! Điều này là do việc gọi hàm `set` [không cập nhật](/learn/state-as-a-snapshot) biến trạng thái `age` trong code đã chạy. Vì vậy, mỗi lệnh gọi `setAge(age + 1)` trở thành `setAge(43)`.

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

Không có bản cập nhật xếp hàng đợi nào khác, vì vậy React sẽ lưu trữ `45` làm trạng thái hiện tại cuối cùng.

Theo quy ước, người ta thường đặt tên cho đối số trạng thái đang chờ xử lý cho chữ cái đầu tiên của tên biến trạng thái, như `a` cho `age`. Tuy nhiên, bạn cũng có thể gọi nó như `prevAge` hoặc một cái gì đó khác mà bạn thấy rõ ràng hơn.

React có thể [gọi các trình cập nhật của bạn hai lần](#my-initializer-or-updater-function-runs-twice) trong quá trình phát triển để xác minh rằng chúng [thuần khiết.](/learn/keeping-components-pure)

<DeepDive>

#### Có phải việc sử dụng trình cập nhật luôn được ưu tiên? {/*is-using-an-updater-always-preferred*/}

Bạn có thể nghe thấy một đề xuất luôn viết code như `setAge(a => a + 1)` nếu trạng thái bạn đang đặt được tính từ trạng thái trước đó. Không có hại gì trong đó, nhưng nó cũng không phải lúc nào cũng cần thiết.

Trong hầu hết các trường hợp, không có sự khác biệt giữa hai cách tiếp cận này. React luôn đảm bảo rằng đối với các hành động có chủ ý của người dùng, như nhấp chuột, biến trạng thái `age` sẽ được cập nhật trước lần nhấp tiếp theo. Điều này có nghĩa là không có rủi ro nào khi trình xử lý nhấp chuột nhìn thấy một `age` "cũ" khi bắt đầu trình xử lý sự kiện.

Tuy nhiên, nếu bạn thực hiện nhiều bản cập nhật trong cùng một sự kiện, trình cập nhật có thể hữu ích. Chúng cũng hữu ích nếu việc truy cập chính biến trạng thái là bất tiện (bạn có thể gặp phải điều này khi tối ưu hóa re-render).

Nếu bạn thích tính nhất quán hơn cú pháp dài dòng hơn một chút, thì việc luôn viết một trình cập nhật nếu trạng thái bạn đang đặt được tính từ trạng thái trước đó là hợp lý. Nếu nó được tính từ trạng thái trước đó của một số biến trạng thái *khác*, bạn có thể muốn kết hợp chúng thành một đối tượng và [sử dụng một reducer.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="Sự khác biệt giữa việc truyền một trình cập nhật và truyền trực tiếp trạng thái tiếp theo" titleId="examples-updater">

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
      <h1>Tuổi của bạn: {age}</h1>
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
      <h1>Tuổi của bạn: {age}</h1>
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

Bạn có thể đặt các đối tượng và mảng vào trạng thái. Trong React, trạng thái được coi là chỉ đọc, vì vậy **bạn nên *thay thế* nó thay vì *thay đổi* các đối tượng hiện có của bạn**. Ví dụ: nếu bạn có một đối tượng `form` trong trạng thái, đừng thay đổi nó:

```js
// 🚩 Đừng thay đổi một đối tượng trong trạng thái như thế này:
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

#### Biểu mẫu (đối tượng) {/*form-object*/}

Trong ví dụ này, biến trạng thái `form` giữ một đối tượng. Mỗi đầu vào có một trình xử lý thay đổi gọi `setForm` với trạng thái tiếp theo của toàn bộ biểu mẫu. Cú pháp spread `{ ...form }` đảm bảo rằng đối tượng trạng thái được thay thế thay vì bị thay đổi.


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

#### Biểu mẫu (đối tượng lồng nhau) {/*form-nested-object*/}

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

Trong ví dụ này, biến trạng thái `todos` giữ một mảng. Mỗi trình xử lý nút gọi `setTodos` với phiên bản tiếp theo của mảng đó. Cú pháp spread `[...todos]`, `todos.map()` và `todos.filter()` đảm bảo mảng trạng thái được thay thế chứ không bị thay đổi.

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

Nếu việc cập nhật mảng và đối tượng mà không cần đột biến cảm thấy tẻ nhạt, bạn có thể sử dụng một thư viện như [Immer](https://github.com/immerjs/use-immer) để giảm mã lặp đi lặp lại. Immer cho phép bạn viết mã ngắn gọn như thể bạn đang đột biến các đối tượng, nhưng bên dưới nó thực hiện các cập nhật bất biến:

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

React lưu trạng thái ban đầu một lần và bỏ qua nó trên các lần hiển thị tiếp theo.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

Mặc dù kết quả của `createInitialTodos()` chỉ được sử dụng cho lần hiển thị ban đầu, nhưng bạn vẫn gọi hàm này trên mỗi lần hiển thị. Điều này có thể lãng phí nếu nó tạo ra các mảng lớn hoặc thực hiện các phép tính tốn kém.

Để giải quyết vấn đề này, bạn có thể **truyền nó như một hàm _khởi tạo_** cho `useState` thay thế:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Lưu ý rằng bạn đang truyền `createInitialTodos`, là *chính hàm*, chứ không phải `createInitialTodos()`, là kết quả của việc gọi nó. Nếu bạn truyền một hàm cho `useState`, React sẽ chỉ gọi nó trong quá trình khởi tạo.

React có thể [gọi các trình khởi tạo của bạn hai lần](#my-initializer-or-updater-function-runs-twice) trong quá trình phát triển để xác minh rằng chúng [thuần túy.](/learn/keeping-components-pure)

<Recipes titleText="The difference between passing an initializer and passing the initial state directly" titleId="examples-initializer">
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

Ví dụ này **không** truyền hàm khởi tạo, vì vậy hàm `createInitialTodos` chạy trên mỗi lần render, chẳng hạn như khi bạn nhập vào input. Không có sự khác biệt nào có thể quan sát được về hành vi, nhưng code này kém hiệu quả hơn.

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
