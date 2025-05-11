---
title: useReducer
---

<Intro>

`useReducer` là một React Hook cho phép bạn thêm một [reducer](/learn/extracting-state-logic-into-a-reducer) vào component của bạn.

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useReducer(reducer, initialArg, init?)` {/*usereducer*/}

Gọi `useReducer` ở cấp cao nhất của component để quản lý trạng thái của nó bằng một [reducer.](/learn/extracting-state-logic-into-a-reducer)

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reducer`: Hàm reducer chỉ định cách trạng thái được cập nhật. Nó phải là thuần túy, nhận trạng thái và action làm đối số và trả về trạng thái tiếp theo. Trạng thái và action có thể thuộc bất kỳ loại nào.
* `initialArg`: Giá trị từ đó trạng thái ban đầu được tính toán. Nó có thể là một giá trị của bất kỳ loại nào. Cách trạng thái ban đầu được tính toán từ nó phụ thuộc vào đối số `init` tiếp theo.
* **tùy chọn** `init`: Hàm khởi tạo nên trả về trạng thái ban đầu. Nếu nó không được chỉ định, trạng thái ban đầu được đặt thành `initialArg`. Nếu không, trạng thái ban đầu được đặt thành kết quả của việc gọi `init(initialArg)`.

#### Trả về {/*returns*/}

`useReducer` trả về một mảng với chính xác hai giá trị:

1. Trạng thái hiện tại. Trong quá trình render đầu tiên, nó được đặt thành `init(initialArg)` hoặc `initialArg` (nếu không có `init`).
2. Hàm [`dispatch`](#dispatch) cho phép bạn cập nhật trạng thái thành một giá trị khác và kích hoạt render lại.

#### Lưu ý {/*caveats*/}

* `useReducer` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất của component** hoặc Hook của riêng bạn. Bạn không thể gọi nó bên trong các vòng lặp hoặc điều kiện. Nếu bạn cần điều đó, hãy trích xuất một component mới và di chuyển trạng thái vào đó.
* Hàm `dispatch` có một định danh ổn định, vì vậy bạn sẽ thường thấy nó bị bỏ qua khỏi các dependencies của Effect, nhưng việc bao gồm nó sẽ không làm cho Effect kích hoạt. Nếu trình kiểm tra lỗi cho phép bạn bỏ qua một dependency mà không có lỗi, thì việc đó là an toàn. [Tìm hiểu thêm về việc loại bỏ các dependencies của Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
* Trong Strict Mode, React sẽ **gọi reducer và trình khởi tạo của bạn hai lần** để [giúp bạn tìm thấy các tạp chất vô tình.](#my-reducer-or-initializer-function-runs-twice) Đây là hành vi chỉ dành cho phát triển và không ảnh hưởng đến sản xuất. Nếu reducer và trình khởi tạo của bạn là thuần túy (như chúng phải vậy), điều này sẽ không ảnh hưởng đến logic của bạn. Kết quả từ một trong các lệnh gọi bị bỏ qua.

---

### Hàm `dispatch` {/*dispatch*/}

Hàm `dispatch` được trả về bởi `useReducer` cho phép bạn cập nhật trạng thái thành một giá trị khác và kích hoạt render lại. Bạn cần chuyển action làm đối số duy nhất cho hàm `dispatch`:

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

React sẽ đặt trạng thái tiếp theo thành kết quả của việc gọi hàm `reducer` mà bạn đã cung cấp với `state` hiện tại và action bạn đã chuyển cho `dispatch`.

#### Tham số {/*dispatch-parameters*/}

* `action`: Hành động được thực hiện bởi người dùng. Nó có thể là một giá trị của bất kỳ loại nào. Theo quy ước, một action thường là một đối tượng có thuộc tính `type` xác định nó và, tùy chọn, các thuộc tính khác với thông tin bổ sung.

#### Trả về {/*dispatch-returns*/}

Hàm `dispatch` không có giá trị trả về.

#### Lưu ý {/*setstate-caveats*/}

* Hàm `dispatch` **chỉ cập nhật biến trạng thái cho lần render *tiếp theo***. Nếu bạn đọc biến trạng thái sau khi gọi hàm `dispatch`, [bạn vẫn sẽ nhận được giá trị cũ](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value) đã có trên màn hình trước khi bạn gọi.

* Nếu giá trị mới bạn cung cấp giống hệt với `state` hiện tại, như được xác định bởi so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React sẽ **bỏ qua việc render lại component và các component con của nó.** Đây là một tối ưu hóa. React vẫn có thể cần gọi component của bạn trước khi bỏ qua kết quả, nhưng nó không ảnh hưởng đến mã của bạn.

* React [gom các bản cập nhật trạng thái.](/learn/queueing-a-series-of-state-updates) Nó cập nhật màn hình **sau khi tất cả các trình xử lý sự kiện đã chạy** và đã gọi các hàm `set` của chúng. Điều này ngăn chặn nhiều lần render lại trong một sự kiện duy nhất. Trong trường hợp hiếm hoi bạn cần buộc React cập nhật màn hình sớm hơn, ví dụ: để truy cập DOM, bạn có thể sử dụng [`flushSync`.](/reference/react-dom/flushSync)

---

## Cách sử dụng {/*usage*/}

### Thêm một reducer vào một component {/*adding-a-reducer-to-a-component*/}

Gọi `useReducer` ở cấp cao nhất của component để quản lý trạng thái bằng một [reducer.](/learn/extracting-state-logic-into-a-reducer)

```js [[1, 8, "state"], [2, 8, "dispatch"], [4, 8, "reducer"], [3, 8, "{ age: 42 }"]]
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

`useReducer` trả về một mảng với chính xác hai mục:

1. <CodeStep step={1}>Trạng thái hiện tại</CodeStep> của biến trạng thái này, ban đầu được đặt thành <CodeStep step={3}>trạng thái ban đầu</CodeStep> mà bạn đã cung cấp.
2. Hàm <CodeStep step={2}>`dispatch`</CodeStep> cho phép bạn thay đổi nó để đáp ứng với tương tác.

Để cập nhật những gì trên màn hình, hãy gọi <CodeStep step={2}>`dispatch`</CodeStep> với một đối tượng đại diện cho những gì người dùng đã làm, được gọi là một *action*:

```js [[2, 2, "dispatch"]]
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

React sẽ chuyển trạng thái hiện tại và action cho <CodeStep step={4}>hàm reducer</CodeStep> của bạn. Reducer của bạn sẽ tính toán và trả về trạng thái tiếp theo. React sẽ lưu trữ trạng thái tiếp theo đó, render component của bạn với nó và cập nhật UI.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

`useReducer` rất giống với [`useState`](/reference/react/useState), nhưng nó cho phép bạn di chuyển logic cập nhật trạng thái từ các trình xử lý sự kiện vào một hàm duy nhất bên ngoài component của bạn. Đọc thêm về [lựa chọn giữa `useState` và `useReducer`.](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)

---

### Viết hàm reducer {/*writing-the-reducer-function*/}

Một hàm reducer được khai báo như thế này:

```js
function reducer(state, action) {
  // ...
}
```

Sau đó, bạn cần điền vào mã sẽ tính toán và trả về trạng thái tiếp theo. Theo quy ước, nó thường được viết dưới dạng một câu lệnh [`switch`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) Đối với mỗi `case` trong `switch`, hãy tính toán và trả về một số trạng thái tiếp theo.

```js {4-7,10-13}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

Actions có thể có bất kỳ hình dạng nào. Theo quy ước, người ta thường truyền các đối tượng có thuộc tính `type` xác định action. Nó nên bao gồm thông tin cần thiết tối thiểu mà reducer cần để tính toán trạng thái tiếp theo.

```js {5,9-12}
function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });
  
  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }
  // ...
```

Tên loại action là cục bộ đối với component của bạn. [Mỗi action mô tả một tương tác duy nhất, ngay cả khi điều đó dẫn đến nhiều thay đổi trong dữ liệu.](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well) Hình dạng của trạng thái là tùy ý, nhưng thông thường nó sẽ là một đối tượng hoặc một mảng.

Đọc [trích xuất logic trạng thái vào một reducer](/learn/extracting-state-logic-into-a-reducer) để tìm hiểu thêm.

<Pitfall>

Trạng thái là chỉ đọc. Không sửa đổi bất kỳ đối tượng hoặc mảng nào trong trạng thái:

```js {4,5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Đừng đột biến một đối tượng trong trạng thái như thế này:
      state.age = state.age + 1;
      return state;
    }
```

Thay vào đó, luôn trả về các đối tượng mới từ reducer của bạn:

```js {4-8}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Thay vào đó, hãy trả về một đối tượng mới
      return {
        ...state,
        age: state.age + 1
      };
    }
```

Đọc [cập nhật các đối tượng trong state](/learn/updating-objects-in-state) và [cập nhật các mảng trong state](/learn/updating-arrays-in-state) để tìm hiểu thêm.

</Pitfall>

<Recipes titleText="Các ví dụ cơ bản về useReducer" titleId="examples-basic">

#### Biểu mẫu (đối tượng) {/*form-object*/}

Trong ví dụ này, reducer quản lý một đối tượng trạng thái với hai trường: `name` và `age`.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

const initialState = { name: 'Taylor', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    }); 
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Increment age
      </button>
      <p>Hello, {state.name}. You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

#### Danh sách việc cần làm (mảng) {/*todo-list-array*/}

Trong ví dụ này, reducer quản lý một mảng các nhiệm vụ. Mảng cần được cập nhật [mà không bị thay đổi.](/learn/updating-arrays-in-state)

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

Nếu việc cập nhật các mảng và đối tượng mà không bị thay đổi cảm thấy tẻ nhạt, bạn có thể sử dụng một thư viện như [Immer](https://github.com/immerjs/use-immer#useimmerreducer) để giảm mã lặp đi lặp lại. Immer cho phép bạn viết mã ngắn gọn như thể bạn đang thay đổi các đối tượng, nhưng bên dưới nó thực hiện các cập nhật bất biến:

<Sandpack>

```js src/App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
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

React lưu trạng thái ban đầu một lần và bỏ qua nó trong các lần kết xuất tiếp theo.

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
}
```

Mặc dù kết quả của `createInitialState(username)` chỉ được sử dụng cho lần kết xuất ban đầu, nhưng bạn vẫn gọi hàm này trên mỗi lần kết xuất. Điều này có thể gây lãng phí nếu nó tạo ra các mảng lớn hoặc thực hiện các tính toán tốn kém.

Để giải quyết vấn đề này, bạn có thể **truyền nó như một hàm _khởi tạo_** cho `useReducer` làm đối số thứ ba:

```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```
Lưu ý rằng bạn đang truyền `createInitialState`, là *chính hàm*, chứ không phải `createInitialState()`, là kết quả của việc gọi nó. Bằng cách này, trạng thái ban đầu không bị tạo lại sau khi khởi tạo.

Trong ví dụ trên, `createInitialState` nhận một đối số `username`. Nếu trình khởi tạo của bạn không cần bất kỳ thông tin nào để tính toán trạng thái ban đầu, bạn có thể truyền `null` làm đối số thứ hai cho `useReducer`.

<Recipes titleText="Sự khác biệt giữa việc truyền một trình khởi tạo và truyền trực tiếp trạng thái ban đầu" titleId="examples-initializer">

#### Truyền hàm khởi tạo {/*passing-the-initializer-function*/}

Ví dụ này truyền hàm khởi tạo, vì vậy hàm `createInitialState` chỉ chạy trong quá trình khởi tạo. Nó không chạy khi thành phần kết xuất lại, chẳng hạn như khi bạn nhập vào đầu vào.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
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

Ví dụ này **không** truyền hàm khởi tạo, vì vậy hàm `createInitialState` chạy trên mỗi lần kết xuất, chẳng hạn như khi bạn nhập vào đầu vào. Không có sự khác biệt đáng chú ý nào về hành vi, nhưng mã này kém hiệu quả hơn.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(username)
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
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

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi đã gửi một action, nhưng nhật ký cho tôi giá trị trạng thái cũ {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

Gọi hàm `dispatch` **không thay đổi trạng thái trong mã đang chạy**:

```js {4,5,8}
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // Yêu cầu kết xuất lại với 43
  console.log(state.age);  // Vẫn là 42!

  setTimeout(() => {
    console.log(state.age); // Cũng là 42!
  }, 5000);
}
```

Điều này là do [trạng thái hoạt động như một ảnh chụp nhanh.](/learn/state-as-a-snapshot) Cập nhật trạng thái yêu cầu một kết xuất khác với giá trị trạng thái mới, nhưng không ảnh hưởng đến biến JavaScript `state` trong trình xử lý sự kiện đang chạy của bạn.

Nếu bạn cần đoán giá trị trạng thái tiếp theo, bạn có thể tính toán nó theo cách thủ công bằng cách tự gọi reducer:

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

---

### Tôi đã gửi một action, nhưng màn hình không cập nhật {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

React sẽ **bỏ qua bản cập nhật của bạn nếu trạng thái tiếp theo bằng với trạng thái trước đó,** như được xác định bởi so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Điều này thường xảy ra khi bạn thay đổi trực tiếp một đối tượng hoặc một mảng trong trạng thái:

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Sai: đột biến đối tượng hiện có
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 Sai: đột biến đối tượng hiện có
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

Bạn đã đột biến một đối tượng `state` hiện có và trả về nó, vì vậy React đã bỏ qua bản cập nhật. Để khắc phục điều này, bạn cần đảm bảo rằng bạn luôn [cập nhật các đối tượng trong trạng thái](/learn/updating-objects-in-state) và [cập nhật các mảng trong trạng thái](/learn/updating-arrays-in-state) thay vì đột biến chúng:

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Đúng: tạo một đối tượng mới
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ Đúng: tạo một đối tượng mới
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

---

### Một phần trạng thái reducer của tôi trở thành không xác định sau khi gửi {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

Đảm bảo rằng mọi nhánh `case` **sao chép tất cả các trường hiện có** khi trả về trạng thái mới:

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // Đừng quên điều này!
        age: state.age + 1
      };
    }
    // ...
```

Nếu không có `...state` ở trên, trạng thái tiếp theo được trả về sẽ chỉ chứa trường `age` và không có gì khác.

---

### Toàn bộ trạng thái reducer của tôi trở thành không xác định sau khi gửi {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

Nếu trạng thái của bạn bất ngờ trở thành `undefined`, có thể bạn đang quên `return` trạng thái trong một trong các trường hợp hoặc loại action của bạn không khớp với bất kỳ câu lệnh `case` nào. Để tìm lý do, hãy đưa ra một lỗi bên ngoài `switch`:

```js {10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

Bạn cũng có thể sử dụng trình kiểm tra kiểu tĩnh như TypeScript để bắt các lỗi như vậy.

---

### Tôi gặp lỗi: "Quá nhiều lần kết xuất lại" {/*im-getting-an-error-too-many-re-renders*/}

Bạn có thể gặp lỗi cho biết: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` (Quá nhiều lần kết xuất lại. React giới hạn số lần kết xuất để ngăn chặn vòng lặp vô hạn.) Thông thường, điều này có nghĩa là bạn đang gửi một action vô điều kiện *trong quá trình kết xuất*, vì vậy thành phần của bạn đi vào một vòng lặp: kết xuất, gửi (gây ra kết xuất), kết xuất, gửi (gây ra kết xuất), v.v. Rất thường xuyên, điều này là do một sai lầm trong việc chỉ định một trình xử lý sự kiện:

```js {1-2}
// 🚩 Sai: gọi trình xử lý trong quá trình kết xuất
return <button onClick={handleClick()}>Click me</button>

// ✅ Đúng: chuyển trình xử lý sự kiện xuống
return <button onClick={handleClick}>Click me</button>

// ✅ Đúng: chuyển một hàm nội tuyến xuống
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

Nếu bạn không thể tìm thấy nguyên nhân của lỗi này, hãy nhấp vào mũi tên bên cạnh lỗi trong bảng điều khiển và xem qua ngăn xếp JavaScript để tìm lệnh gọi hàm `dispatch` cụ thể chịu trách nhiệm cho lỗi.

---

### Hàm reducer hoặc hàm khởi tạo của tôi chạy hai lần {/*my-reducer-or-initializer-function-runs-twice*/}

Trong [Chế độ nghiêm ngặt](/reference/react/StrictMode), React sẽ gọi các hàm reducer và hàm khởi tạo của bạn hai lần. Điều này sẽ không phá vỡ mã của bạn.

Hành vi **chỉ dành cho phát triển** này giúp bạn [giữ cho các thành phần thuần túy.](/learn/keeping-components-pure) React sử dụng kết quả của một trong các lệnh gọi và bỏ qua kết quả của lệnh gọi kia. Miễn là thành phần, trình khởi tạo và các hàm reducer của bạn là thuần túy, điều này sẽ không ảnh hưởng đến logic của bạn. Tuy nhiên, nếu chúng vô tình không thuần túy, điều này sẽ giúp bạn nhận thấy những sai lầm.

Ví dụ: hàm reducer không thuần túy này đột biến một mảng trong trạng thái:

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 Sai lầm: đột biến trạng thái
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

Vì React gọi hàm reducer của bạn hai lần, bạn sẽ thấy todo đã được thêm hai lần, vì vậy bạn sẽ biết rằng có một sai lầm. Trong ví dụ này, bạn có thể sửa sai lầm bằng cách [thay thế mảng thay vì đột biến nó](/learn/updating-arrays-in-state#adding-to-an-array):

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ Đúng: thay thế bằng trạng thái mới
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

Bây giờ hàm reducer này là thuần túy, việc gọi nó thêm một lần không tạo ra sự khác biệt trong hành vi. Đây là lý do tại sao React gọi nó hai lần giúp bạn tìm thấy những sai lầm. **Chỉ các hàm thành phần, trình khởi tạo và reducer cần phải thuần túy.** Các trình xử lý sự kiện không cần phải thuần túy, vì vậy React sẽ không bao giờ gọi các trình xử lý sự kiện của bạn hai lần.

Đọc [giữ cho các thành phần thuần túy](/learn/keeping-components-pure) để tìm hiểu thêm.
