---
title: Trích xuất State Logic vào một Reducer
---

<Intro>

Những component có nhiều cập nhật state trải rộng khắp nhiều event handler có thể trở nên phức tạp quá mức. Trong những trường hợp này, bạn có thể hợp nhất tất cả logic cập nhật state bên ngoài component của bạn vào một function duy nhất, được gọi là _reducer._

</Intro>

<YouWillLearn>

- Function reducer là gì
- Cách refactor từ `useState` sang `useReducer`
- Khi nào nên sử dụng reducer
- Cách viết reducer tốt

</YouWillLearn>

## Hợp nhất logic state với reducer {/*consolidate-state-logic-with-a-reducer*/}

Khi những component của bạn phát triển theo độ phức tạp, có thể trở nên khó khăn hơn để nhìn thoáng qua tất cả những cách khác nhau mà state của component được cập nhật. Ví dụ, component `TaskApp` bên dưới giữ một mảng `tasks` trong state và sử dụng ba event handler khác nhau để thêm, xóa và chỉnh sửa task:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Mỗi event handler của nó gọi `setTasks` để cập nhật state. Khi component này phát triển, cũng như số lượng logic state rải rác khắp nó. Để giảm độ phức tạp này và giữ tất cả logic của bạn ở một nơi dễ truy cập, bạn có thể di chuyển logic state đó thành một function duy nhất bên ngoài component của bạn, **được gọi là "reducer".**

Reducer là một cách khác để xử lý state. Bạn có thể di chuyển từ `useState` sang `useReducer` trong ba bước:

1. **Di chuyển** từ việc setting state sang dispatching action.
2. **Viết** một function reducer.
3. **Sử dụng** reducer từ component của bạn.

### Bước 1: Di chuyển từ setting state sang dispatching action {/*step-1-move-from-setting-state-to-dispatching-actions*/}

Những event handler hiện tại của bạn chỉ định _phải làm gì_ bằng cách setting state:

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

Loại bỏ tất cả logic setting state. Những gì bạn còn lại là ba event handler:

- `handleAddTask(text)` được gọi khi người dùng nhấn "Add".
- `handleChangeTask(task)` được gọi khi người dùng toggle một task hoặc nhấn "Save".
- `handleDeleteTask(taskId)` được gọi khi người dùng nhấn "Delete".

Quản lý state với reducer hơi khác so với việc setting state trực tiếp. Thay vì nói với React "phải làm gì" bằng cách setting state, bạn chỉ định "người dùng vừa làm gì" bằng cách dispatching "action" từ những event handler của bạn. (Logic cập nhật state sẽ tồn tại ở nơi khác!) Vì vậy thay vì "setting `tasks`" thông qua một event handler, bạn đang dispatching một action "added/changed/deleted a task". Điều này mô tả ý định của người dùng một cách rõ ràng hơn.

```js
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
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

Object bạn truyền cho `dispatch` được gọi là "action":

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // "action" object:
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

Đó là một object JavaScript thông thường. Bạn quyết định đặt gì vào đó, nhưng nói chung nó nên chứa thông tin tối thiểu về _điều gì đã xảy ra_. (Bạn sẽ thêm chính function `dispatch` ở bước sau.)

<Note>

Một object action có thể có bất kỳ hình dạng nào.

Theo quy ước, việc thường thấy là đặt cho nó một string `type` mô tả điều gì đã xảy ra, và truyền bất kỳ thông tin bổ sung nào trong những field khác. `type` cụ thể cho một component, vì vậy trong ví dụ này `'added'` hoặc `'added_task'` đều ổn. Chọn một tên nói lên điều gì đã xảy ra!

```js
dispatch({
  // specific to component
  type: 'what_happened',
  // other fields go here
});
```

</Note>

### Bước 2: Viết một function reducer {/*step-2-write-a-reducer-function*/}

Function reducer là nơi bạn sẽ đặt logic state của mình. Nó nhận hai tham số, state hiện tại và object action, và nó trả về state tiếp theo:

```js
function yourReducer(state, action) {
  // return next state for React to set
}
```

React sẽ set state thành những gì bạn return từ reducer.

Để di chuyển logic setting state từ những event handler của bạn sang một function reducer trong ví dụ này, bạn sẽ:

1. Khai báo state hiện tại (`tasks`) như tham số đầu tiên.
2. Khai báo object `action` như tham số thứ hai.
3. Return state _tiếp theo_ từ reducer (mà React sẽ set state thành).

Đây là tất cả logic setting state được di chuyển sang một function reducer:

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```

Bởi vì function reducer nhận state (`tasks`) như một tham số, bạn có thể **khai báo nó bên ngoài component của bạn.** Điều này giảm mức độ thụt lề và có thể làm cho code của bạn dễ đọc hơn.

<Note>

Code trên sử dụng câu lệnh if/else, nhưng việc thường thấy là sử dụng [câu lệnh switch](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch) bên trong reducer. Kết quả giống nhau, nhưng có thể dễ đọc hơn khi nhìn thoáng qua câu lệnh switch.

Chúng ta sẽ sử dụng chúng trong phần còn lại của tài liệu này như sau:

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

Chúng tôi khuyến nghị bao bọc mỗi khối `case` vào dấu ngoặc nhọn `{` và `}` để các biến được khai báo bên trong những `case` khác nhau không xung đột với nhau. Ngoài ra, một `case` thường nên kết thúc bằng `return`. Nếu bạn quên `return`, code sẽ "rơi qua" đến `case` tiếp theo, có thể dẫn đến lỗi!

Nếu bạn chưa quen với câu lệnh switch, sử dụng if/else hoàn toàn ổn.

</Note>

<DeepDive>

#### Tại sao reducer được gọi như vậy? {/*why-are-reducers-called-this-way*/}

Mặc dù reducer có thể "giảm" số lượng code bên trong component của bạn, thực tế chúng được đặt tên theo phép toán [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) mà bạn có thể thực hiện trên mảng.

Phép toán `reduce()` cho phép bạn lấy một mảng và "tích lũy" một giá trị duy nhất từ nhiều giá trị:

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

Function bạn truyền cho `reduce` được gọi là "reducer". Nó nhận _kết quả hiện tại_ và _phần tử hiện tại,_ sau đó nó trả về _kết quả tiếp theo._ React reducer là một ví dụ của cùng một ý tưởng: chúng nhận _state hiện tại_ và _action_, và trả về _state tiếp theo._ Theo cách này, chúng tích lũy những action theo thời gian thành state.

Bạn thậm chí có thể sử dụng method `reduce()` với một `initialState` và một mảng `actions` để tính toán state cuối cùng bằng cách truyền function reducer của bạn vào nó:

<Sandpack>

```js src/index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Visit Kafka Museum'},
  {type: 'added', id: 2, text: 'Watch a puppet show'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Lennon Wall pic'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

Có thể bạn sẽ không cần phải tự làm điều này, nhưng đây là tương tự với những gì React làm!

</DeepDive>

### Bước 3: Sử dụng reducer từ component của bạn {/*step-3-use-the-reducer-from-your-component*/}

Cuối cùng, bạn cần kết nối `tasksReducer` với component của bạn. Import Hook `useReducer` từ React:

```js
import { useReducer } from 'react';
```

Sau đó bạn có thể thay thế `useState`:

```js
const [tasks, setTasks] = useState(initialTasks);
```

bằng `useReducer` như thế này:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

Hook `useReducer` tương tự như `useState`—bạn phải truyền cho nó một initial state và nó trả về một stateful value và một cách để set state (trong trường hợp này, function dispatch). Nhưng nó hơi khác một chút.

Hook `useReducer` nhận hai tham số:

1. Một function reducer
2. Một initial state

Và nó trả về:

1. Một stateful value
2. Một function dispatch (để "dispatch" những action của người dùng tới reducer)

Bây giờ nó đã được kết nối đầy đủ! Ở đây, reducer được khai báo ở cuối file component:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Nếu bạn muốn, bạn thậm chí có thể di chuyển reducer sang một file khác:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Component logic có thể dễ đọc hơn khi bạn tách biệt các mối quan tâm như thế này. Bây giờ những event handler chỉ chỉ định _điều gì đã xảy ra_ bằng cách dispatching action, và function reducer xác định _cách state cập nhật_ để phản hồi chúng.

## So sánh `useState` và `useReducer` {/*comparing-usestate-and-usereducer*/}

Reducer không phải là không có nhược điểm! Đây là một vài cách bạn có thể so sánh chúng:

- **Kích thước code:** Nói chung, với `useState` bạn phải viết ít code hơn từ đầu. Với `useReducer`, bạn phải viết cả function reducer _và_ dispatch action. Tuy nhiên, `useReducer` có thể giúp cắt giảm code nếu nhiều event handler chỉnh sửa state theo cách tương tự.
- **Khả năng đọc:** `useState` rất dễ đọc khi những cập nhật state đơn giản. Khi chúng trở nên phức tạp hơn, chúng có thể làm phình to code component của bạn và làm cho nó khó để quét qua. Trong trường hợp này, `useReducer` cho phép bạn tách biệt một cách sạch sẽ _cách thức_ của logic cập nhật khỏi _điều gì đã xảy ra_ của những event handler.
- **Debugging:** Khi bạn có bug với `useState`, có thể khó để nói _ở đâu_ state được set không chính xác, và _tại sao_. Với `useReducer`, bạn có thể thêm console log vào reducer của mình để thấy mọi cập nhật state, và _tại sao_ nó xảy ra (do `action` nào). Nếu mỗi `action` đúng, bạn sẽ biết rằng lỗi nằm trong chính logic reducer. Tuy nhiên, bạn phải bước qua nhiều code hơn so với `useState`.
- **Testing:** Reducer là một pure function không phụ thuộc vào component của bạn. Điều này có nghĩa là bạn có thể export và test nó riêng biệt trong cô lập. Mặc dù nói chung tốt nhất là test component trong môi trường thực tế hơn, đối với logic cập nhật state phức tạp, có thể hữu ích để khẳng định rằng reducer của bạn trả về một state cụ thể cho một initial state và action cụ thể.
- **Sở thích cá nhân:** Một số người thích reducer, những người khác thì không. Điều đó ổn. Đó là vấn đề sở thích. Bạn luôn có thể chuyển đổi giữa `useState` và `useReducer` qua lại: chúng tương đương!

Chúng tôi khuyên sử dụng reducer nếu bạn thường gặp bug do cập nhật state không chính xác trong một số component, và muốn giới thiệu thêm cấu trúc vào code của nó. Bạn không phải sử dụng reducer cho mọi thứ: cứ thoải mái kết hợp và phối hợp! Bạn thậm chí có thể `useState` và `useReducer` trong cùng một component.

## Viết reducer tốt {/*writing-reducers-well*/}

Hãy ghi nhớ hai mẹo này khi viết reducer:

- **Reducer phải là pure.** Tương tự như [state updater function](/learn/queueing-a-series-of-state-updates), reducer chạy trong quá trình render! (Action được xếp hàng cho đến lần render tiếp theo.) Điều này có nghĩa là reducer [phải là pure](/learn/keeping-components-pure)—cùng input luôn dẫn đến cùng output. Chúng không nên gửi request, lên lịch timeout, hoặc thực hiện bất kỳ side effect nào (phép toán ảnh hưởng đến những thứ bên ngoài component). Chúng nên cập nhật [object](/learn/updating-objects-in-state) và [mảng](/learn/updating-arrays-in-state) mà không có mutation.
- **Mỗi action mô tả một tương tác người dùng duy nhất, ngay cả khi điều đó dẫn đến nhiều thay đổi trong dữ liệu.** Ví dụ, nếu người dùng nhấn "Reset" trên một form với năm field được quản lý bởi reducer, việc dispatch một action `reset_form` có ý nghĩa hơn so với năm action `set_field` riêng biệt. Nếu bạn log mọi action trong reducer, log đó nên đủ rõ ràng để bạn tái tạo những tương tác hoặc phản hồi nào đã xảy ra theo thứ tự nào. Điều này giúp với debugging!

## Viết reducer ngắn gọn với Immer {/*writing-concise-reducers-with-immer*/}

Giống như với [cập nhật object](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) và [mảng](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) trong state thông thường, bạn có thể sử dụng thư viện Immer để làm cho reducer ngắn gọn hơn. Ở đây, [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) cho phép bạn mutate state với `push` hoặc gán `arr[i] =`:

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
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
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

Reducer phải là pure, vì vậy chúng không nên mutate state. Nhưng Immer cung cấp cho bạn một object `draft` đặc biệt mà an toàn để mutate. Bên dưới, Immer sẽ tạo một bản copy của state của bạn với những thay đổi bạn đã thực hiện trên `draft`. Đây là lý do tại sao những reducer được quản lý bởi `useImmerReducer` có thể mutate tham số đầu tiên của chúng và không cần return state.

<Recap>

- Để chuyển đổi từ `useState` sang `useReducer`:
  1. Dispatch action từ những event handler.
  2. Viết một function reducer trả về state tiếp theo cho một state và action đã cho.
  3. Thay thế `useState` bằng `useReducer`.
- Reducer yêu cầu bạn viết nhiều code hơn một chút, nhưng chúng giúp với debugging và testing.
- Reducer phải là pure.
- Mỗi action mô tả một tương tác người dùng duy nhất.
- Sử dụng Immer nếu bạn muốn viết reducer theo kiểu mutating.

</Recap>

<Challenges>

#### Dispatch action từ event handler {/*dispatch-actions-from-event-handlers*/}

Hiện tại, những event handler trong `ContactList.js` và `Chat.js` có comment `// TODO`. Đây là lý do tại sao việc gõ vào input không hoạt động, và nhấp vào những button không thay đổi người nhận được chọn.

Thay thế hai `// TODO` này bằng code để `dispatch` những action tương ứng. Để thấy hình dạng mong đợi và loại của những action, kiểm tra reducer trong `messengerReducer.js`. Reducer đã được viết sẵn nên bạn sẽ không cần thay đổi nó. Bạn chỉ cần dispatch những action trong `ContactList.js` và `Chat.js`.

<Hint>

Function `dispatch` đã có sẵn trong cả hai component này vì nó được truyền như một prop. Vì vậy bạn cần gọi `dispatch` với object action tương ứng.

Để kiểm tra hình dạng object action, bạn có thể nhìn vào reducer và thấy những field `action` nào nó mong đợi thấy. Ví dụ, case `changed_selection` trong reducer trông như thế này:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

Điều này có nghĩa là object action của bạn nên có `type: 'changed_selection'`. Bạn cũng thấy `action.contactId` được sử dụng, nên bạn cần bao gồm một thuộc tính `contactId` vào action của bạn.

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                // TODO: dispatch changed_selection
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          // TODO: dispatch edited_message
          // (Read the input value from e.target.value)
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Từ code reducer, bạn có thể suy ra rằng những action cần trông như thế này:

```js
// When the user presses "Alice"
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// When user types "Hello!"
dispatch({
  type: 'edited_message',
  message: 'Hello!',
});
```

Đây là ví dụ được cập nhật để dispatch những message tương ứng:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

#### Xóa input khi gửi message {/*clear-the-input-on-sending-a-message*/}

Hiện tại, nhấn "Send" không làm gì cả. Thêm một event handler vào button "Send" sẽ:

1. Hiển thị một `alert` với email của người nhận và message.
2. Xóa message input.

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Có một vài cách bạn có thể làm điều đó trong event handler của button "Send". Một cách tiếp cận là hiển thị alert và sau đó dispatch một action `edited_message` với `message` rỗng:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Điều này hoạt động và xóa input khi bạn nhấn "Send".

Tuy nhiên, _từ quan điểm của người dùng_, gửi message là một action khác so với chỉnh sửa field. Để phản ánh điều đó, bạn có thể tạo một action _mới_ gọi là `sent_message`, và xử lý nó riêng biệt trong reducer:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Hành vi kết quả là giống nhau. Nhưng hãy nhớ rằng những loại action lý tưởng nên mô tả "người dùng đã làm gì" thay vì "bạn muốn state thay đổi như thế nào". Điều này làm cho việc thêm nhiều tính năng sau này dễ dàng hơn.

Với cả hai giải pháp, điều quan trọng là bạn **không** đặt `alert` bên trong reducer. Reducer nên là một pure function--nó chỉ nên tính toán state tiếp theo. Nó không nên "làm" bất cứ điều gì, bao gồm hiển thị message cho người dùng. Điều đó nên xảy ra trong event handler. (Để giúp bắt những lỗi như thế này, React sẽ gọi những reducer của bạn nhiều lần trong Strict Mode. Đây là lý do tại sao, nếu bạn đặt alert trong reducer, nó kích hoạt hai lần.)

</Solution>

#### Khôi phục giá trị input khi chuyển đổi giữa các tab {/*restore-input-values-when-switching-between-tabs*/}

Trong ví dụ này, chuyển đổi giữa những người nhận khác nhau luôn xóa text input:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // Clears the input
  };
```

Điều này là vì bạn không muốn chia sẻ một message draft duy nhất giữa nhiều người nhận. Nhưng sẽ tốt hơn nếu ứng dụng của bạn "nhớ" một draft cho mỗi contact riêng biệt, khôi phục chúng khi bạn chuyển đổi contact.

Nhiệm vụ của bạn là thay đổi cách state được cấu trúc để bạn nhớ một message draft riêng biệt _cho mỗi contact_. Bạn sẽ cần thực hiện một vài thay đổi đối với reducer, initial state, và những component.

<Hint>

Bạn có thể cấu trúc state của mình như thế này:

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor', // Draft for contactId = 0
    1: 'Hello, Alice', // Draft for contactId = 1
  },
};
```

Cú pháp `[key]: value` [computed property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) có thể giúp bạn cập nhật object `messages`:

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Bạn sẽ cần cập nhật reducer để lưu trữ và cập nhật một message draft riêng biệt cho mỗi contact:

```js
// When the input is edited
case 'edited_message': {
  return {
    // Keep other state like selection
    ...state,
    messages: {
      // Keep messages for other contacts
      ...state.messages,
      // But change the selected contact's message
      [state.selectedId]: action.message
    }
  };
}
```

Bạn cũng sẽ cập nhật component `Messenger` để đọc message cho contact hiện đang được chọn:

```js
const message = state.messages[state.selectedId];
```

Đây là giải pháp hoàn chỉnh:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Đáng chú ý, bạn không cần thay đổi bất kỳ event handler nào để triển khai hành vi khác này. Không có reducer, bạn sẽ phải thay đổi mọi event handler cập nhật state.

</Solution>

#### Triển khai `useReducer` từ đầu {/*implement-usereducer-from-scratch*/}

Trong những ví dụ trước đó, bạn đã import Hook `useReducer` từ React. Lần này, bạn sẽ triển khai _chính Hook `useReducer`!_ Đây là một stub để bạn bắt đầu. Nó không nên mất hơn 10 dòng code.

Để test những thay đổi của bạn, thử gõ vào input hoặc chọn một contact.

<Hint>

Đây là một bản phác thảo chi tiết hơn về việc triển khai:

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

Nhớ rằng một function reducer nhận hai tham số--state hiện tại và object action--và nó trả về state tiếp theo. Việc triển khai `dispatch` của bạn nên làm gì với nó?

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Dispatching một action gọi reducer với state hiện tại và action, và lưu trữ kết quả như state tiếp theo. Đây là cách nó trông trong code:

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Mặc dù nó không quan trọng trong hầu hết các trường hợp, một triển khai chính xác hơn một chút trông như thế này:

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

Điều này là vì những action được dispatch được xếp hàng cho đến lần render tiếp theo, [tương tự như những updater function.](/learn/queueing-a-series-of-state-updates)

</Solution>

</Challenges>
