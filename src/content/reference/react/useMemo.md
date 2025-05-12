---
title: useMemo
---

<Intro>

`useMemo` là một React Hook cho phép bạn lưu vào bộ nhớ cache kết quả của một phép tính giữa các lần render lại.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

Gọi `useMemo` ở cấp cao nhất của component để lưu vào bộ nhớ cache một phép tính giữa các lần render lại:

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

*   `calculateValue`: Hàm tính toán giá trị mà bạn muốn lưu vào bộ nhớ cache. Nó phải là thuần túy, không có tham số và trả về một giá trị thuộc bất kỳ loại nào. React sẽ gọi hàm của bạn trong quá trình render ban đầu. Trong các lần render tiếp theo, React sẽ trả về lại giá trị tương tự nếu `dependencies` không thay đổi so với lần render cuối cùng. Nếu không, nó sẽ gọi `calculateValue`, trả về kết quả của nó và lưu trữ nó để có thể được sử dụng lại sau này.

*   `dependencies`: Danh sách tất cả các giá trị phản ứng được tham chiếu bên trong mã `calculateValue`. Các giá trị phản ứng bao gồm props, state và tất cả các biến và hàm được khai báo trực tiếp bên trong phần thân component của bạn. Nếu trình lint của bạn được [cấu hình cho React](/learn/editor-setup#linting), nó sẽ xác minh rằng mọi giá trị phản ứng được chỉ định chính xác là một dependency. Danh sách các dependency phải có một số lượng mục không đổi và được viết nội dòng như `[dep1, dep2, dep3]`. React sẽ so sánh từng dependency với giá trị trước đó của nó bằng cách sử dụng so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Trả về {/*returns*/}

Trong lần render ban đầu, `useMemo` trả về kết quả của việc gọi `calculateValue` mà không có tham số.

Trong các lần render tiếp theo, nó sẽ trả về một giá trị đã được lưu trữ từ lần render cuối cùng (nếu các dependency không thay đổi) hoặc gọi lại `calculateValue` và trả về kết quả mà `calculateValue` đã trả về.

#### Lưu ý {/*caveats*/}

*   `useMemo` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất của component** hoặc các Hook của riêng bạn. Bạn không thể gọi nó bên trong các vòng lặp hoặc điều kiện. Nếu bạn cần điều đó, hãy trích xuất một component mới và di chuyển state vào đó.
*   Trong Strict Mode, React sẽ **gọi hàm tính toán của bạn hai lần** để [giúp bạn tìm ra các tạp chất vô tình.](#my-calculation-runs-twice-on-every-re-render) Đây là hành vi chỉ dành cho development và không ảnh hưởng đến production. Nếu hàm tính toán của bạn là thuần túy (như nó phải vậy), điều này sẽ không ảnh hưởng đến logic của bạn. Kết quả từ một trong các lệnh gọi sẽ bị bỏ qua.
*   React **sẽ không loại bỏ giá trị được lưu trong bộ nhớ cache trừ khi có một lý do cụ thể để làm điều đó.** Ví dụ: trong quá trình development, React sẽ loại bỏ bộ nhớ cache khi bạn chỉnh sửa tệp của component. Cả trong development và production, React sẽ loại bỏ bộ nhớ cache nếu component của bạn tạm ngưng trong quá trình mount ban đầu. Trong tương lai, React có thể thêm nhiều tính năng hơn tận dụng việc loại bỏ bộ nhớ cache--ví dụ: nếu React thêm hỗ trợ tích hợp cho danh sách ảo hóa trong tương lai, thì việc loại bỏ bộ nhớ cache cho các mục cuộn ra khỏi khung nhìn của bảng ảo hóa sẽ có ý nghĩa. Điều này sẽ ổn nếu bạn chỉ dựa vào `useMemo` như một tối ưu hóa hiệu suất. Nếu không, một [biến state](/reference/react/useState#avoiding-recreating-the-initial-state) hoặc một [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) có thể phù hợp hơn.

<Note>

Việc lưu vào bộ nhớ cache các giá trị trả về như thế này còn được gọi là [*memoization*,](https://en.wikipedia.org/wiki/Memoization) đó là lý do tại sao Hook này được gọi là `useMemo`.

</Note>

---

## Cách sử dụng {/*usage*/}

### Bỏ qua các phép tính lại tốn kém {/*skipping-expensive-recalculations*/}

Để lưu vào bộ nhớ cache một phép tính giữa các lần render lại, hãy bọc nó trong một lệnh gọi `useMemo` ở cấp cao nhất của component:

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Bạn cần chuyển hai thứ cho `useMemo`:

1.  Một <CodeStep step={1}>hàm tính toán</CodeStep> không có tham số, như `() =>`, và trả về những gì bạn muốn tính toán.
2.  Một <CodeStep step={2}>danh sách các dependency</CodeStep> bao gồm mọi giá trị trong component của bạn được sử dụng bên trong phép tính của bạn.

Trong lần render ban đầu, <CodeStep step={3}>giá trị</CodeStep> bạn nhận được từ `useMemo` sẽ là kết quả của việc gọi <CodeStep step={1}>phép tính</CodeStep> của bạn.

Trong mỗi lần render tiếp theo, React sẽ so sánh <CodeStep step={2}>các dependency</CodeStep> với các dependency bạn đã chuyển trong lần render cuối cùng. Nếu không có dependency nào thay đổi (so sánh với [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useMemo` sẽ trả về giá trị bạn đã tính toán trước đó. Nếu không, React sẽ chạy lại phép tính của bạn và trả về giá trị mới.

Nói cách khác, `useMemo` lưu vào bộ nhớ cache kết quả tính toán giữa các lần render lại cho đến khi các dependency của nó thay đổi.

**Hãy xem qua một ví dụ để xem khi nào điều này hữu ích.**

Theo mặc định, React sẽ chạy lại toàn bộ phần thân component của bạn mỗi khi nó render lại. Ví dụ: nếu `TodoList` này cập nhật state của nó hoặc nhận các props mới từ cha mẹ của nó, hàm `filterTodos` sẽ chạy lại:

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

Thông thường, đây không phải là một vấn đề vì hầu hết các phép tính đều rất nhanh. Tuy nhiên, nếu bạn đang lọc hoặc chuyển đổi một mảng lớn hoặc thực hiện một số tính toán tốn kém, bạn có thể muốn bỏ qua việc thực hiện lại nếu dữ liệu không thay đổi. Nếu cả `todos` và `tab` đều giống như trong lần render cuối cùng, việc bọc phép tính trong `useMemo` như trước cho phép bạn sử dụng lại `visibleTodos` mà bạn đã tính toán trước đó.

Loại lưu vào bộ nhớ cache này được gọi là *[memoization.](https://en.wikipedia.org/wiki/Memoization)*

<Note>

**Bạn chỉ nên dựa vào `useMemo` như một tối ưu hóa hiệu suất.** Nếu mã của bạn không hoạt động nếu không có nó, hãy tìm vấn đề cơ bản và khắc phục nó trước. Sau đó, bạn có thể thêm `useMemo` để cải thiện hiệu suất.


</Note>

<DeepDive>

#### Làm thế nào để biết một phép tính có tốn kém hay không? {/*how-to-tell-if-a-calculation-is-expensive*/}

Nói chung, trừ khi bạn đang tạo hoặc lặp qua hàng ngàn đối tượng, có lẽ nó không tốn kém. Nếu bạn muốn tự tin hơn, bạn có thể thêm một bản ghi console để đo thời gian dành cho một đoạn mã:

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

Thực hiện tương tác bạn đang đo (ví dụ: nhập vào đầu vào). Sau đó, bạn sẽ thấy các bản ghi như `filter array: 0.15ms` trong bảng điều khiển của mình. Nếu tổng thời gian được ghi lại cộng lại thành một lượng đáng kể (ví dụ: `1ms` trở lên), có thể có ý nghĩa khi ghi nhớ phép tính đó. Như một thử nghiệm, sau đó bạn có thể bọc phép tính trong `useMemo` để xác minh xem tổng thời gian được ghi lại có giảm cho tương tác đó hay không:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Bỏ qua nếu todos và tab không thay đổi
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` sẽ không làm cho lần render *đầu tiên* nhanh hơn. Nó chỉ giúp bạn bỏ qua công việc không cần thiết khi cập nhật.

Hãy nhớ rằng máy của bạn có thể nhanh hơn máy của người dùng của bạn, vì vậy bạn nên kiểm tra hiệu suất với một độ chậm nhân tạo. Ví dụ: Chrome cung cấp tùy chọn [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) cho việc này.

Ngoài ra, hãy lưu ý rằng việc đo hiệu suất trong quá trình phát triển sẽ không cung cấp cho bạn kết quả chính xác nhất. (Ví dụ: khi [Strict Mode](/reference/react/StrictMode) được bật, bạn sẽ thấy mỗi thành phần render hai lần thay vì một lần.) Để có được thời gian chính xác nhất, hãy xây dựng ứng dụng của bạn để sản xuất và kiểm tra nó trên một thiết bị giống như thiết bị mà người dùng của bạn có.

</DeepDive>

<DeepDive>

#### Bạn có nên thêm useMemo ở mọi nơi không? {/*should-you-add-usememo-everywhere*/}

Nếu ứng dụng của bạn giống như trang web này và hầu hết các tương tác đều thô (như thay thế một trang hoặc toàn bộ một phần), thì việc ghi nhớ thường là không cần thiết. Mặt khác, nếu ứng dụng của bạn giống một trình chỉnh sửa bản vẽ hơn và hầu hết các tương tác đều chi tiết (như di chuyển hình dạng), thì bạn có thể thấy việc ghi nhớ rất hữu ích.

Tối ưu hóa với `useMemo` chỉ có giá trị trong một vài trường hợp:

- Phép tính bạn đang đưa vào `useMemo` chậm đáng kể và các dependency của nó hiếm khi thay đổi.
- Bạn chuyển nó dưới dạng một prop cho một thành phần được bọc trong [`memo`.](/reference/react/memo) Bạn muốn bỏ qua việc render lại nếu giá trị không thay đổi. Việc ghi nhớ cho phép thành phần của bạn chỉ render lại khi các dependency không giống nhau.
- Giá trị bạn đang chuyển sau đó được sử dụng làm dependency của một Hook nào đó. Ví dụ: có thể một giá trị tính toán `useMemo` khác phụ thuộc vào nó. Hoặc có thể bạn đang phụ thuộc vào giá trị này từ [`useEffect.`](/reference/react/useEffect)

Không có lợi ích gì khi bọc một phép tính trong `useMemo` trong các trường hợp khác. Cũng không có tác hại đáng kể nào khi làm như vậy, vì vậy một số nhóm chọn không nghĩ về các trường hợp riêng lẻ và ghi nhớ càng nhiều càng tốt. Nhược điểm của phương pháp này là mã trở nên khó đọc hơn. Ngoài ra, không phải tất cả các ghi nhớ đều hiệu quả: một giá trị duy nhất "luôn mới" là đủ để phá vỡ việc ghi nhớ cho toàn bộ một thành phần.

**Trong thực tế, bạn có thể làm cho rất nhiều ghi nhớ trở nên không cần thiết bằng cách tuân theo một vài nguyên tắc:**

1. Khi một thành phần bao bọc trực quan các thành phần khác, hãy để nó [chấp nhận JSX làm children.](/learn/passing-props-to-a-component#passing-jsx-as-children) Bằng cách này, khi thành phần bao bọc cập nhật trạng thái của chính nó, React biết rằng các children của nó không cần phải render lại.
2. Ưu tiên trạng thái cục bộ và không [nâng trạng thái lên](/learn/sharing-state-between-components) xa hơn mức cần thiết. Ví dụ: không giữ trạng thái tạm thời như biểu mẫu và việc một mục có được di chuột hay không ở đầu cây của bạn hoặc trong một thư viện trạng thái toàn cục.
3. Giữ cho [logic render của bạn thuần túy.](/learn/keeping-components-pure) Nếu việc render lại một thành phần gây ra sự cố hoặc tạo ra một tạo tác trực quan đáng chú ý, đó là một lỗi trong thành phần của bạn! Hãy sửa lỗi thay vì thêm ghi nhớ.
4. Tránh [các Effect không cần thiết cập nhật trạng thái.](/learn/you-might-not-need-an-effect) Hầu hết các vấn đề về hiệu suất trong các ứng dụng React đều do chuỗi các bản cập nhật bắt nguồn từ các Effect khiến các thành phần của bạn render đi render lại.
5. Cố gắng [loại bỏ các dependency không cần thiết khỏi các Effect của bạn.](/learn/removing-effect-dependencies) Ví dụ: thay vì ghi nhớ, thường đơn giản hơn là di chuyển một số đối tượng hoặc một hàm vào bên trong một Effect hoặc bên ngoài thành phần.

Nếu một tương tác cụ thể vẫn cảm thấy chậm, [hãy sử dụng trình phân tích hiệu năng React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) để xem thành phần nào sẽ được hưởng lợi nhiều nhất từ việc ghi nhớ và thêm ghi nhớ khi cần thiết. Các nguyên tắc này giúp các thành phần của bạn dễ gỡ lỗi và hiểu hơn, vì vậy tốt nhất là tuân theo chúng trong mọi trường hợp. Về lâu dài, chúng tôi đang nghiên cứu [tự động thực hiện ghi nhớ chi tiết](https://www.youtube.com/watch?v=lGEMwh32soc) để giải quyết vấn đề này một lần và mãi mãi.

</DeepDive>

<Recipes titleText="Sự khác biệt giữa useMemo và tính toán trực tiếp một giá trị" titleId="examples-recalculation">

#### Bỏ qua tính toán lại với `useMemo` {/*skipping-recalculation-with-usememo*/}

Trong ví dụ này, việc triển khai `filterTodos` **bị làm chậm một cách giả tạo** để bạn có thể thấy điều gì xảy ra khi một số hàm JavaScript bạn đang gọi trong quá trình render thực sự chậm. Hãy thử chuyển đổi các tab và bật tắt chủ đề.

Việc chuyển đổi các tab có cảm giác chậm vì nó buộc `filterTodos` bị làm chậm phải thực thi lại. Điều đó được mong đợi vì `tab` đã thay đổi và do đó toàn bộ phép tính *cần* phải chạy lại. (Nếu bạn tò mò tại sao nó chạy hai lần, nó được giải thích [ở đây.](#my-calculation-runs-twice-on-every-re-render))

Bật tắt chủ đề. **Nhờ `useMemo`, nó nhanh chóng mặc dù bị làm chậm nhân tạo!** Lệnh gọi `filterTodos` chậm đã bị bỏ qua vì cả `todos` và `tab` (mà bạn chuyển làm dependency cho `useMemo`) đều không thay đổi kể từ lần render cuối cùng.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Lưu ý: <code>filterTodos</code> bị làm chậm một cách giả tạo!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Luôn tính toán lại một giá trị {/*always-recalculating-a-value*/}

Trong ví dụ này, việc triển khai `filterTodos` cũng **bị làm chậm một cách giả tạo** để bạn có thể thấy điều gì xảy ra khi một số hàm JavaScript bạn đang gọi trong quá trình render thực sự chậm. Hãy thử chuyển đổi các tab và bật tắt chủ đề.

Không giống như trong ví dụ trước, việc bật tắt chủ đề cũng chậm bây giờ! Điều này là do **không có lệnh gọi `useMemo` trong phiên bản này,** vì vậy `filterTodos` bị làm chậm một cách giả tạo được gọi trên mỗi lần render lại. Nó được gọi ngay cả khi chỉ có `theme` đã thay đổi.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Lưu ý: <code>filterTodos</code> bị làm chậm một cách giả tạo!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Tuy nhiên, đây là cùng một mã **với độ chậm nhân tạo đã được loại bỏ.** Việc thiếu `useMemo` có cảm thấy đáng chú ý hay không?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Khá thường xuyên, mã không có ghi nhớ hoạt động tốt. Nếu các tương tác của bạn đủ nhanh, bạn có thể không cần ghi nhớ.

Bạn có thể thử tăng số lượng mục todo trong `utils.js` và xem hành vi thay đổi như thế nào. Phép tính cụ thể này không tốn kém lắm ngay từ đầu, nhưng nếu số lượng todo tăng lên đáng kể, hầu hết chi phí sẽ nằm ở việc render lại hơn là ở việc lọc. Hãy tiếp tục đọc bên dưới để xem cách bạn có thể tối ưu hóa việc render lại bằng `useMemo`.

<Solution />

</Recipes>

---

### Bỏ qua việc render lại các thành phần {/*skipping-re-rendering-of-components*/}

Trong một số trường hợp, `useMemo` cũng có thể giúp bạn tối ưu hóa hiệu suất của việc render lại các thành phần con. Để minh họa điều này, giả sử thành phần `TodoList` này chuyển `visibleTodos` làm một prop cho thành phần `List` con:

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

Bạn đã nhận thấy rằng việc bật tắt prop `theme` làm đóng băng ứng dụng trong một khoảnh khắc, nhưng nếu bạn xóa `<List />` khỏi JSX của mình, nó sẽ cảm thấy nhanh. Điều này cho bạn biết rằng đáng để thử tối ưu hóa thành phần `List`.

**Theo mặc định, khi một thành phần render lại, React render lại tất cả các children của nó một cách đệ quy.** Đây là lý do tại sao, khi `TodoList` render lại với một `theme` khác, thành phần `List` *cũng* render lại. Điều này là tốt cho các thành phần không yêu cầu nhiều tính toán để render lại. Nhưng nếu bạn đã xác minh rằng việc render lại chậm, bạn có thể yêu cầu `List` bỏ qua việc render lại khi các prop của nó giống như trên lần render cuối cùng bằng cách bọc nó trong [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**Với thay đổi này, `List` sẽ bỏ qua việc render lại nếu tất cả các prop của nó *giống nhau* như trên lần render cuối cùng.** Đây là nơi việc lưu vào bộ nhớ cache tính toán trở nên quan trọng! Hãy tưởng tượng rằng bạn đã tính toán `visibleTodos` mà không có `useMemo`:

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // Mỗi khi chủ đề thay đổi, đây sẽ là một mảng khác...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... vì vậy các prop của List sẽ không bao giờ giống nhau và nó sẽ render lại mỗi lần */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**Trong ví dụ trên, hàm `filterTodos` luôn tạo ra một mảng *khác*,** tương tự như cách ký tự đối tượng `{}` luôn tạo ra một đối tượng mới. Thông thường, điều này sẽ không phải là một vấn đề, nhưng nó có nghĩa là các prop của `List` sẽ không bao giờ giống nhau và tối ưu hóa [`memo`](/reference/react/memo) của bạn sẽ không hoạt động. Đây là nơi `useMemo` пригодится:

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // Yêu cầu React lưu vào bộ nhớ cache tính toán của bạn giữa các lần render lại...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...miễn là các dependency này không thay đổi...
  );
  return (
    <div className={theme}>
      {/* ...List sẽ nhận được các prop giống nhau và có thể bỏ qua việc render lại */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**Bằng cách bọc tính toán `visibleTodos` trong `useMemo`, bạn đảm bảo rằng nó có giá trị *giống nhau* giữa các lần render lại** (cho đến khi các dependency thay đổi). Bạn không *phải* bọc một tính toán trong `useMemo` trừ khi bạn làm điều đó vì một lý do cụ thể nào đó. Trong ví dụ này, lý do là bạn chuyển nó cho một thành phần được bọc trong [`memo`,](/reference/react/memo) và điều này cho phép nó bỏ qua việc render lại. Có một vài lý do khác để thêm `useMemo` được mô tả thêm trên trang này.

<DeepDive>

#### Ghi nhớ các nút JSX riêng lẻ {/*memoizing-individual-jsx-nodes*/}

Thay vì bọc `List` trong [`memo`](/reference/react/memo), bạn có thể bọc chính nút JSX `<List />` trong `useMemo`:

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

Hành vi sẽ giống nhau. Nếu `visibleTodos` không thay đổi, `List` sẽ không được render lại.

Một nút JSX như `<List items={visibleTodos} />` là một đối tượng như `{ type: List, props: { items: visibleTodos } }`. Việc tạo đối tượng này rất rẻ, nhưng React không biết liệu nội dung của nó có giống như lần trước hay không. Đây là lý do tại sao theo mặc định, React sẽ render lại thành phần `List`.

Tuy nhiên, nếu React thấy chính xác JSX giống như trong quá trình render trước đó, nó sẽ không cố gắng render lại thành phần của bạn. Điều này là do các nút JSX là [bất biến.](https://en.wikipedia.org/wiki/Immutable_object) Một đối tượng nút JSX không thể thay đổi theo thời gian, vì vậy React biết rằng việc bỏ qua render lại là an toàn. Tuy nhiên, để điều này hoạt động, nút phải *thực sự là cùng một đối tượng*, không chỉ trông giống nhau trong mã. Đây là những gì `useMemo` làm trong ví dụ này.

Việc bọc thủ công các nút JSX vào `useMemo` không thuận tiện. Ví dụ: bạn không thể làm điều này có điều kiện. Đây thường là lý do tại sao bạn sẽ bọc các thành phần bằng [`memo`](/reference/react/memo) thay vì bọc các nút JSX.

</DeepDive>

<Recipes titleText="Sự khác biệt giữa việc bỏ qua render lại và luôn render lại" titleId="examples-rerendering">

#### Bỏ qua render lại với `useMemo` và `memo` {/*skipping-re-rendering-with-usememo-and-memo*/}

Trong ví dụ này, thành phần `List` **bị làm chậm một cách giả tạo** để bạn có thể thấy điều gì xảy ra khi một thành phần React bạn đang render thực sự chậm. Hãy thử chuyển đổi các tab và bật tắt chủ đề.

Việc chuyển đổi các tab có cảm giác chậm vì nó buộc `List` bị làm chậm phải render lại. Điều đó được mong đợi vì `tab` đã thay đổi và do đó bạn cần phản ánh lựa chọn mới của người dùng trên màn hình.

Tiếp theo, hãy thử bật tắt chủ đề. **Nhờ `useMemo` cùng với [`memo`](/reference/react/memo), nó nhanh chóng mặc dù bị làm chậm nhân tạo!** `List` đã bỏ qua việc render lại vì mảng `visibleTodos` không thay đổi kể từ lần render cuối cùng. Mảng `visibleTodos` không thay đổi vì cả `todos` và `tab` (mà bạn chuyển làm dependency cho `useMemo`) đều không thay đổi kể từ lần render cuối cùng.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Luôn luôn kết xuất lại một thành phần {/*always-re-rendering-a-component*/}

Trong ví dụ này, việc triển khai `List` cũng **bị làm chậm một cách giả tạo** để bạn có thể thấy điều gì xảy ra khi một thành phần React mà bạn đang kết xuất thực sự chậm. Hãy thử chuyển đổi các tab và bật tắt chủ đề.

Không giống như trong ví dụ trước, việc bật tắt chủ đề bây giờ cũng chậm! Điều này là do **không có lệnh gọi `useMemo` trong phiên bản này,** vì vậy `visibleTodos` luôn là một mảng khác và thành phần `List` bị chậm không thể bỏ qua việc kết xuất lại.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Tuy nhiên, đây là cùng một mã **với độ chậm nhân tạo đã được loại bỏ.** Việc thiếu `useMemo` có cảm thấy đáng chú ý hay không?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Thông thường, mã không có memoization hoạt động tốt. Nếu các tương tác của bạn đủ nhanh, bạn không cần memoization.

Hãy nhớ rằng bạn cần chạy React ở chế độ production, tắt [React Developer Tools](/learn/react-developer-tools) và sử dụng các thiết bị tương tự như những thiết bị mà người dùng ứng dụng của bạn có để có được cảm giác thực tế về những gì thực sự làm chậm ứng dụng của bạn.

<Solution />

</Recipes>

---

### Ngăn chặn một Effect kích hoạt quá thường xuyên {/*preventing-an-effect-from-firing-too-often*/}

Đôi khi, bạn có thể muốn sử dụng một giá trị bên trong một [Effect:](/learn/synchronizing-with-effects)

```js {4-7,10}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: 'https://localhost:1234',
    roomId: roomId
  }

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Điều này tạo ra một vấn đề. [Mọi giá trị phản ứng phải được khai báo là một dependency của Effect của bạn.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Tuy nhiên, nếu bạn khai báo `options` là một dependency, nó sẽ khiến Effect của bạn liên tục kết nối lại với phòng chat:


```js {5}
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🔴 Vấn đề: Dependency này thay đổi trên mỗi lần render
  // ...
```

Để giải quyết vấn đề này, bạn có thể bọc đối tượng bạn cần gọi từ một Effect trong `useMemo`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = useMemo(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Chỉ thay đổi khi roomId thay đổi

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Chỉ thay đổi khi options thay đổi
  // ...
```

Điều này đảm bảo rằng đối tượng `options` là giống nhau giữa các lần render lại nếu `useMemo` trả về đối tượng được lưu trong bộ nhớ cache.

Tuy nhiên, vì `useMemo` là tối ưu hóa hiệu suất, không phải là một đảm bảo về ngữ nghĩa, React có thể loại bỏ giá trị được lưu trong bộ nhớ cache nếu [có một lý do cụ thể để làm điều đó](#caveats). Điều này cũng sẽ khiến effect kích hoạt lại, **vì vậy tốt hơn nữa là loại bỏ nhu cầu về một dependency hàm** bằng cách di chuyển đối tượng của bạn *vào bên trong* Effect:

```js {5-8,13}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { // ✅ Không cần useMemo hoặc các dependencies đối tượng!
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    }
    
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Chỉ thay đổi khi roomId thay đổi
  // ...
```

Bây giờ mã của bạn đơn giản hơn và không cần `useMemo`. [Tìm hiểu thêm về việc loại bỏ các dependencies Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)


### Memoizing một dependency của một Hook khác {/*memoizing-a-dependency-of-another-hook*/}

Giả sử bạn có một phép tính phụ thuộc vào một đối tượng được tạo trực tiếp trong phần thân của thành phần:

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Thận trọng: Dependency trên một đối tượng được tạo trong phần thân của thành phần
  // ...
```

Việc phụ thuộc vào một đối tượng như thế này làm mất đi ý nghĩa của memoization. Khi một thành phần render lại, tất cả mã trực tiếp bên trong phần thân của thành phần sẽ chạy lại. **Các dòng mã tạo đối tượng `searchOptions` cũng sẽ chạy trên mỗi lần render lại.** Vì `searchOptions` là một dependency của lệnh gọi `useMemo` của bạn và nó khác nhau mỗi lần, React biết các dependency khác nhau và tính toán lại `searchItems` mỗi lần.

Để khắc phục điều này, bạn có thể memoize đối tượng `searchOptions` *trước* khi chuyển nó làm dependency:

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ Chỉ thay đổi khi text thay đổi

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Chỉ thay đổi khi allItems hoặc searchOptions thay đổi
  // ...
```

Trong ví dụ trên, nếu `text` không thay đổi, đối tượng `searchOptions` cũng sẽ không thay đổi. Tuy nhiên, một cách khắc phục thậm chí còn tốt hơn là di chuyển khai báo đối tượng `searchOptions` *vào bên trong* hàm tính toán `useMemo`:

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Chỉ thay đổi khi allItems hoặc text thay đổi
  // ...
```

Bây giờ phép tính của bạn phụ thuộc trực tiếp vào `text` (là một chuỗi và không thể "vô tình" trở nên khác biệt).

---

### Memoizing một hàm {/*memoizing-a-function*/}

Giả sử thành phần `Form` được bọc trong [`memo`.](/reference/react/memo) Bạn muốn chuyển một hàm cho nó dưới dạng một prop:

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

Giống như `{}` tạo ra một đối tượng khác, các khai báo hàm như `function() {}` và các biểu thức như `() => {}` tạo ra một hàm *khác* trên mỗi lần render lại. Bản thân việc tạo một hàm mới không phải là một vấn đề. Đây không phải là điều cần tránh! Tuy nhiên, nếu thành phần `Form` được memoize, có lẽ bạn muốn bỏ qua việc render lại nó khi không có prop nào thay đổi. Một prop *luôn* khác biệt sẽ làm mất đi ý nghĩa của memoization.

Để memoize một hàm với `useMemo`, hàm tính toán của bạn sẽ phải trả về một hàm khác:

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

Điều này trông vụng về! **Memoizing các hàm là đủ phổ biến để React có một Hook tích hợp dành riêng cho việc đó. Bọc các hàm của bạn vào [`useCallback`](/reference/react/useCallback) thay vì `useMemo`** để tránh phải viết một hàm lồng nhau bổ sung:

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

Hai ví dụ trên hoàn toàn tương đương. Lợi ích duy nhất của `useCallback` là nó cho phép bạn tránh viết một hàm lồng nhau bổ sung bên trong. Nó không làm bất cứ điều gì khác. [Đọc thêm về `useCallback`.](/reference/react/useCallback)

---

## Khắc phục sự cố {/*troubleshooting*/}

### Phép tính của tôi chạy hai lần trên mỗi lần render lại {/*my-calculation-runs-twice-on-every-re-render*/}

Trong [Strict Mode](/reference/react/StrictMode), React sẽ gọi một số hàm của bạn hai lần thay vì một lần:

```js {2,5,6}
function TodoList({ todos, tab }) {
  // Hàm thành phần này sẽ chạy hai lần cho mỗi lần render.

  const visibleTodos = useMemo(() => {
    // Phép tính này sẽ chạy hai lần nếu bất kỳ dependency nào thay đổi.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

Điều này được mong đợi và không nên làm hỏng mã của bạn.

Hành vi **chỉ dành cho development** này giúp bạn [giữ cho các thành phần thuần túy.](/learn/keeping-components-pure) React sử dụng kết quả của một trong các lệnh gọi và bỏ qua kết quả của lệnh gọi kia. Miễn là thành phần và các hàm tính toán của bạn là thuần túy, điều này sẽ không ảnh hưởng đến logic của bạn. Tuy nhiên, nếu chúng vô tình không thuần túy, điều này sẽ giúp bạn nhận thấy và sửa chữa sai lầm.

Ví dụ: hàm tính toán không thuần túy này làm thay đổi một mảng bạn nhận được dưới dạng một prop:

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Sai lầm: làm thay đổi một prop
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

React gọi hàm của bạn hai lần, vì vậy bạn sẽ nhận thấy todo được thêm hai lần. Phép tính của bạn không được thay đổi bất kỳ đối tượng hiện có nào, nhưng bạn có thể thay đổi bất kỳ đối tượng *mới* nào bạn đã tạo trong quá trình tính toán. Ví dụ: nếu hàm `filterTodos` luôn trả về một mảng *khác*, bạn có thể thay đổi *mảng đó* thay thế:

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Chính xác: làm thay đổi một đối tượng bạn đã tạo trong quá trình tính toán
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

Đọc [giữ cho các thành phần thuần túy](/learn/keeping-components-pure) để tìm hiểu thêm về tính thuần túy.

Ngoài ra, hãy xem các hướng dẫn về [cập nhật các đối tượng](/learn/updating-objects-in-state) và [cập nhật các mảng](/learn/updating-arrays-in-state) mà không cần thay đổi.

---

### Lệnh gọi `useMemo` của tôi được cho là trả về một đối tượng, nhưng trả về undefined {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

Mã này không hoạt động:

```js {1-2,5}
  // 🔴 Bạn không thể trả về một đối tượng từ một hàm mũi tên với () => {
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

Trong JavaScript, `() => {` bắt đầu phần thân của hàm mũi tên, vì vậy dấu ngoặc nhọn `{` không phải là một phần của đối tượng của bạn. Đây là lý do tại sao nó không trả về một đối tượng và dẫn đến sai lầm. Bạn có thể sửa nó bằng cách thêm dấu ngoặc đơn như `({` và `})`:

```js {1-2,5}
  // Điều này hoạt động, nhưng rất dễ để ai đó phá vỡ lại
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

Tuy nhiên, điều này vẫn gây nhầm lẫn và quá dễ để ai đó phá vỡ bằng cách xóa dấu ngoặc đơn.

Để tránh sai lầm này, hãy viết một câu lệnh `return` một cách rõ ràng:

```js {1-3,6-7}
  // ✅ Điều này hoạt động và rõ ràng
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### Mỗi khi thành phần của tôi render, phép tính trong `useMemo` chạy lại {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

Đảm bảo rằng bạn đã chỉ định mảng dependency làm đối số thứ hai!

Nếu bạn quên mảng dependency, `useMemo` sẽ chạy lại phép tính mỗi lần:

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Tính toán lại mỗi lần: không có mảng dependency
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

Đây là phiên bản đã sửa, chuyển mảng dependency làm đối số thứ hai:

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ Không tính toán lại một cách không cần thiết
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

Nếu điều này không giúp ích, thì vấn đề là ít nhất một trong các dependency của bạn khác với lần render trước. Bạn có thể gỡ lỗi vấn đề này bằng cách ghi nhật ký các dependency của bạn vào bảng điều khiển theo cách thủ công:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

Sau đó, bạn có thể nhấp chuột phải vào các mảng từ các lần render lại khác nhau trong bảng điều khiển và chọn "Store as a global variable" cho cả hai. Giả sử cái đầu tiên được lưu dưới dạng `temp1` và cái thứ hai được lưu dưới dạng `temp2`, sau đó bạn có thể sử dụng bảng điều khiển của trình duyệt để kiểm tra xem mỗi dependency trong cả hai mảng có giống nhau hay không:

```js
Object.is(temp1[0], temp2[0]); // Dependency đầu tiên có giống nhau giữa các mảng không?
Object.is(temp1[1], temp2[1]); // Dependency thứ hai có giống nhau giữa các mảng không?
Object.is(temp1[2], temp2[2]); // ... và cứ thế cho mọi dependency ...
```

Khi bạn tìm thấy dependency nào phá vỡ memoization, hãy tìm cách loại bỏ nó hoặc [memoize nó.](#memoizing-a-dependency-of-another-hook)

---

### Tôi cần gọi `useMemo` cho mỗi mục danh sách trong một vòng lặp, nhưng nó không được phép {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Giả sử thành phần `Chart` được bọc trong [`memo`.](/reference/react/memo) Bạn muốn bỏ qua việc render lại mọi `Chart` trong danh sách khi thành phần `ReportList` render lại. Tuy nhiên, bạn không thể gọi `useMemo` trong một vòng lặp:

```js {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 Bạn không thể gọi useMemo trong một vòng lặp như thế này:
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

Thay vào đó, hãy trích xuất một thành phần cho mỗi mục và memoize dữ liệu cho các mục riêng lẻ:

```js {5,12-18}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Gọi useMemo ở cấp cao nhất:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

Ngoài ra, bạn có thể xóa `useMemo` và thay vào đó bọc chính `Report` trong [`memo`.](/reference/react/memo) Nếu prop `item` không thay đổi, `Report` sẽ bỏ qua việc render lại, vì vậy `Chart` cũng sẽ bỏ qua việc render lại:

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
