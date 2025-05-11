---
title: useContext
---
<Intro>

`useContext` là một React Hook cho phép bạn đọc và đăng ký [context](/learn/passing-data-deeply-with-context) từ component của bạn.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

Gọi `useContext` ở cấp cao nhất của component để đọc và đăng ký [context.](/learn/passing-data-deeply-with-context)

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `SomeContext`: Context mà bạn đã tạo trước đó bằng [`createContext`](/reference/react/createContext). Bản thân context không chứa thông tin, nó chỉ đại diện cho loại thông tin bạn có thể cung cấp hoặc đọc từ các component.

#### Giá trị trả về {/*returns*/}

`useContext` trả về giá trị context cho component gọi. Nó được xác định là `value` được truyền cho `SomeContext.Provider` gần nhất ở trên component gọi trong cây. Nếu không có provider nào như vậy, thì giá trị trả về sẽ là `defaultValue` mà bạn đã truyền cho [`createContext`](/reference/react/createContext) cho context đó. Giá trị trả về luôn được cập nhật. React tự động render lại các component đọc một số context nếu nó thay đổi.

#### Lưu ý {/*caveats*/}

* Lệnh gọi `useContext()` trong một component không bị ảnh hưởng bởi các provider được trả về từ *cùng* component đó. `<Context.Provider>` tương ứng **cần phải ở *trên*** component thực hiện lệnh gọi `useContext()`.
* React **tự động render lại** tất cả các phần tử con sử dụng một context cụ thể bắt đầu từ provider nhận được một `value` khác. Các giá trị trước và tiếp theo được so sánh bằng phép so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Việc bỏ qua render lại bằng [`memo`](/reference/react/memo) không ngăn các phần tử con nhận các giá trị context mới.
* Nếu hệ thống build của bạn tạo ra các module trùng lặp trong đầu ra (điều này có thể xảy ra với các symlink), điều này có thể phá vỡ context. Việc truyền một thứ gì đó qua context chỉ hoạt động nếu `SomeContext` mà bạn sử dụng để cung cấp context và `SomeContext` mà bạn sử dụng để đọc nó là ***chính xác* cùng một đối tượng**, như được xác định bằng phép so sánh `===`.

---

## Cách sử dụng {/*usage*/}

### Truyền dữ liệu sâu vào cây {/*passing-data-deeply-into-the-tree*/}

Gọi `useContext` ở cấp cao nhất của component để đọc và đăng ký [context.](/learn/passing-data-deeply-with-context)

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ... 
```

`useContext` trả về <CodeStep step={2}>giá trị context</CodeStep> cho <CodeStep step={1}>context</CodeStep> mà bạn đã truyền. Để xác định giá trị context, React tìm kiếm cây component và tìm **provider context gần nhất ở trên** cho context cụ thể đó.

Để truyền context cho một `Button`, hãy bọc nó hoặc một trong các component cha của nó vào provider context tương ứng:

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

Không quan trọng có bao nhiêu lớp component giữa provider và `Button`. Khi một `Button` *ở bất kỳ đâu* bên trong `Form` gọi `useContext(ThemeContext)`, nó sẽ nhận được `"dark"` làm giá trị.

<Pitfall>

`useContext()` luôn tìm kiếm provider gần nhất *ở trên* component gọi nó. Nó tìm kiếm lên trên và **không** xem xét các provider trong component mà từ đó bạn đang gọi `useContext()`.

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Cập nhật dữ liệu được truyền qua context {/*updating-data-passed-via-context*/}

Thông thường, bạn sẽ muốn context thay đổi theo thời gian. Để cập nhật context, hãy kết hợp nó với [state.](/reference/react/useState) Khai báo một biến state trong component cha và truyền state hiện tại xuống dưới dạng <CodeStep step={2}>giá trị context</CodeStep> cho provider.

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Switch to light theme
      </Button>
    </ThemeContext.Provider>
  );
}
```

Bây giờ bất kỳ `Button` nào bên trong provider sẽ nhận được giá trị `theme` hiện tại. Nếu bạn gọi `setTheme` để cập nhật giá trị `theme` mà bạn truyền cho provider, tất cả các component `Button` sẽ render lại với giá trị `'light'` mới.

<Recipes titleText="Ví dụ về cập nhật context" titleId="examples-basic">

#### Cập nhật một giá trị thông qua context {/*updating-a-value-via-context*/}

Trong ví dụ này, component `MyApp` giữ một biến state sau đó được truyền cho provider `ThemeContext`. Việc đánh dấu vào ô "Dark mode" sẽ cập nhật state. Thay đổi giá trị được cung cấp sẽ render lại tất cả các component sử dụng context đó.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </ThemeContext.Provider>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

Lưu ý rằng `value="dark"` truyền chuỗi `"dark"`, nhưng `value={theme}` truyền giá trị của biến JavaScript `theme` với [dấu ngoặc nhọn JSX.](/learn/javascript-in-jsx-with-curly-braces) Dấu ngoặc nhọn cũng cho phép bạn truyền các giá trị context không phải là chuỗi.

<Solution />

#### Cập nhật một đối tượng thông qua context {/*updating-an-object-via-context*/}

Trong ví dụ này, có một biến state `currentUser` giữ một đối tượng. Bạn kết hợp `{ currentUser, setCurrentUser }` thành một đối tượng duy nhất và truyền nó xuống thông qua context bên trong `value={}`. Điều này cho phép bất kỳ component nào bên dưới, chẳng hạn như `LoginButton`, đọc cả `currentUser` và `setCurrentUser`, và sau đó gọi `setCurrentUser` khi cần.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext.Provider>
  );
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>You logged in as {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Log in as Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### Nhiều context {/*multiple-contexts*/}

Trong ví dụ này, có hai context độc lập. `ThemeContext` cung cấp theme hiện tại, là một chuỗi, trong khi `CurrentUserContext` giữ đối tượng đại diện cho người dùng hiện tại.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Use dark mode
        </label>
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName.trim() !== '' && lastName.trim() !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Trích xuất các provider vào một component {/*extracting-providers-to-a-component*/}

Khi ứng dụng của bạn phát triển, bạn có thể sẽ có một "kim tự tháp" các context gần gốc ứng dụng của bạn hơn. Không có gì sai với điều đó. Tuy nhiên, nếu bạn không thích việc lồng nhau về mặt thẩm mỹ, bạn có thể trích xuất các provider vào một component duy nhất. Trong ví dụ này, `MyProviders` ẩn "hệ thống ống nước" và render các phần tử con được truyền cho nó bên trong các provider cần thiết. Lưu ý rằng state `theme` và `setTheme` là cần thiết trong chính `MyApp`, vì vậy `MyApp` vẫn sở hữu phần state đó.


<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />
#### Mở rộng với context và reducer {/*scaling-up-with-context-and-a-reducer*/}

Trong các ứng dụng lớn hơn, việc kết hợp context với [reducer](/reference/react/useReducer) để tách logic liên quan đến một số trạng thái ra khỏi các component là điều phổ biến. Trong ví dụ này, tất cả các "dây" được ẩn trong `TasksContext.js`, chứa một reducer và hai context riêng biệt.

Đọc [hướng dẫn đầy đủ](/learn/scaling-up-with-reducer-and-context) về ví dụ này.

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Ngày nghỉ ở Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

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

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
import { useState, useContext } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

</Recipes>

---

### Chỉ định giá trị mặc định dự phòng {/*specifying-a-fallback-default-value*/}

Nếu React không thể tìm thấy bất kỳ provider nào của <CodeStep step={1}>context</CodeStep> cụ thể đó trong cây cha, giá trị context được trả về bởi `useContext()` sẽ bằng với <CodeStep step={3}>giá trị mặc định</CodeStep> mà bạn đã chỉ định khi bạn [tạo context đó](/reference/react/createContext):

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

Giá trị mặc định **không bao giờ thay đổi**. Nếu bạn muốn cập nhật context, hãy sử dụng nó với state như [đã mô tả ở trên.](#updating-data-passed-via-context)

Thông thường, thay vì `null`, có một số giá trị ý nghĩa hơn mà bạn có thể sử dụng làm mặc định, ví dụ:

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

Bằng cách này, nếu bạn vô tình render một số component mà không có provider tương ứng, nó sẽ không bị hỏng. Điều này cũng giúp các component của bạn hoạt động tốt trong môi trường thử nghiệm mà không cần thiết lập nhiều provider trong các thử nghiệm.

Trong ví dụ dưới đây, nút "Toggle theme" luôn có màu sáng vì nó **nằm ngoài bất kỳ theme context provider nào** và giá trị theme context mặc định là `'light'`. Hãy thử chỉnh sửa theme mặc định thành `'dark'`.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext.Provider value={theme}>
        <Form />
      </ThemeContext.Provider>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Toggle theme
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Ghi đè context cho một phần của cây {/*overriding-context-for-a-part-of-the-tree*/}

Bạn có thể ghi đè context cho một phần của cây bằng cách bọc phần đó trong một provider với một giá trị khác.

```js {3,5}
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

Bạn có thể lồng và ghi đè provider bao nhiêu lần tùy thích.

<Recipes titleText="Ví dụ về ghi đè context">

#### Ghi đè một theme {/*overriding-a-theme*/}

Ở đây, nút *bên trong* `Footer` nhận một giá trị context khác (`"light"`) so với các nút bên ngoài (`"dark"`).

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
      <ThemeContext.Provider value="light">
        <Footer />
      </ThemeContext.Provider>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Settings</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Tự động lồng các tiêu đề {/*automatically-nested-headings*/}

Bạn có thể "tích lũy" thông tin khi bạn lồng các context provider. Trong ví dụ này, component `Section` theo dõi `LevelContext` chỉ định độ sâu của việc lồng các section. Nó đọc `LevelContext` từ section cha và cung cấp số `LevelContext` tăng thêm một cho các phần tử con của nó. Do đó, component `Heading` có thể tự động quyết định sử dụng thẻ `<h1>`, `<h2>`, `<h3>`, ..., nào dựa trên số lượng component `Section` mà nó được lồng bên trong.

Đọc [hướng dẫn chi tiết](/learn/passing-data-deeply-with-context) về ví dụ này.

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
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
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

<Solution />

</Recipes>

---

### Tối ưu hóa việc render lại khi truyền các đối tượng và hàm {/*optimizing-re-renders-when-passing-objects-and-functions*/}

Bạn có thể truyền bất kỳ giá trị nào qua context, bao gồm cả đối tượng và hàm.

```js [[2, 10, "{ currentUser, login }"]] 
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      <Page />
    </AuthContext.Provider>
  );
}
```

Ở đây, <CodeStep step={2}>giá trị context</CodeStep> là một đối tượng JavaScript với hai thuộc tính, một trong số đó là một hàm. Bất cứ khi nào `MyApp` render lại (ví dụ: khi cập nhật route), đây sẽ là một đối tượng *khác* trỏ đến một hàm *khác*, vì vậy React cũng sẽ phải render lại tất cả các component sâu trong cây gọi `useContext(AuthContext)`.

Trong các ứng dụng nhỏ hơn, đây không phải là vấn đề. Tuy nhiên, không cần thiết phải render lại chúng nếu dữ liệu cơ bản, như `currentUser`, không thay đổi. Để giúp React tận dụng lợi thế đó, bạn có thể bọc hàm `login` bằng [`useCallback`](/reference/react/useCallback) và bọc việc tạo đối tượng vào [`useMemo`](/reference/react/useMemo). Đây là một tối ưu hóa hiệu suất:

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

Do thay đổi này, ngay cả khi `MyApp` cần render lại, các component gọi `useContext(AuthContext)` sẽ không cần render lại trừ khi `currentUser` đã thay đổi.

Đọc thêm về [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) và [`useCallback`.](/reference/react/useCallback#skipping-re-rendering-of-components)

---

## Khắc phục sự cố {/*troubleshooting*/}

### Component của tôi không thấy giá trị từ provider của tôi {/*my-component-doesnt-see-the-value-from-my-provider*/}

Có một vài cách phổ biến mà điều này có thể xảy ra:

1. Bạn đang render `<SomeContext.Provider>` trong cùng một component (hoặc bên dưới) với nơi bạn đang gọi `useContext()`. Di chuyển `<SomeContext.Provider>` *lên trên và ra ngoài* component gọi `useContext()`.
2. Bạn có thể đã quên bọc component của mình bằng `<SomeContext.Provider>`, hoặc bạn có thể đã đặt nó ở một phần khác của cây so với những gì bạn nghĩ. Kiểm tra xem hệ thống phân cấp có đúng không bằng cách sử dụng [React DevTools.](/learn/react-developer-tools)
3. Bạn có thể đang gặp phải một số sự cố build với công cụ của mình khiến `SomeContext` như được thấy từ component cung cấp và `SomeContext` như được thấy bởi component đọc là hai đối tượng khác nhau. Điều này có thể xảy ra nếu bạn sử dụng symlink, chẳng hạn. Bạn có thể xác minh điều này bằng cách gán chúng cho các biến toàn cục như `window.SomeContext1` và `window.SomeContext2` và sau đó kiểm tra xem `window.SomeContext1 === window.SomeContext2` trong console hay không. Nếu chúng không giống nhau, hãy khắc phục sự cố đó ở cấp độ công cụ build.

### Tôi luôn nhận được `undefined` từ context của mình mặc dù giá trị mặc định khác {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

Bạn có thể có một provider không có `value` trong cây:

```js {1,2}
// 🚩 Không hoạt động: không có prop value
<ThemeContext.Provider>
   <Button />
</ThemeContext.Provider>
```

Nếu bạn quên chỉ định `value`, nó giống như truyền `value={undefined}`.

Bạn cũng có thể đã nhầm lẫn sử dụng một tên prop khác do nhầm lẫn:

```js {1,2}
// 🚩 Không hoạt động: prop phải được gọi là "value"
<ThemeContext.Provider theme={theme}>
   <Button />
</ThemeContext.Provider>
```

Trong cả hai trường hợp này, bạn sẽ thấy cảnh báo từ React trong console. Để khắc phục chúng, hãy gọi prop là `value`:

```js {1,2}
// ✅ Truyền prop value
<ThemeContext.Provider value={theme}>
   <Button />
</ThemeContext.Provider>
```

Lưu ý rằng [giá trị mặc định từ lệnh gọi `createContext(defaultValue)` của bạn](#specifying-a-fallback-default-value) chỉ được sử dụng **nếu hoàn toàn không có provider phù hợp nào ở trên.** Nếu có một component `<SomeContext.Provider value={undefined}>` ở đâu đó trong cây cha, component gọi `useContext(SomeContext)` *sẽ* nhận `undefined` làm giá trị context.
