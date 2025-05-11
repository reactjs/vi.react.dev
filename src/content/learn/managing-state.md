---
title: Quản Lý State
---

<Intro>

Khi ứng dụng của bạn phát triển, việc có kế hoạch hơn về cách tổ chức state và cách dữ liệu luân chuyển giữa các component sẽ rất hữu ích. State dư thừa hoặc trùng lặp là một nguồn gốc phổ biến của lỗi. Trong chương này, bạn sẽ học cách cấu trúc state một cách tốt, làm thế nào để giữ cho logic cập nhật state của bạn dễ bảo trì và làm thế nào để chia sẻ state giữa các component ở xa.

</Intro>

<YouWillLearn isChapter={true}>

* [Cách suy nghĩ về các thay đổi UI như là các thay đổi state](/learn/reacting-to-input-with-state)
* [Cách cấu trúc state một cách tốt](/learn/choosing-the-state-structure)
* [Cách "nâng state lên" để chia sẻ nó giữa các component](/learn/sharing-state-between-components)
* [Cách kiểm soát việc state được giữ lại hay đặt lại](/learn/preserving-and-resetting-state)
* [Cách hợp nhất logic state phức tạp vào một hàm](/learn/extracting-state-logic-into-a-reducer)
* [Cách truyền thông tin mà không cần "truyền prop"](/learn/passing-data-deeply-with-context)
* [Cách mở rộng quản lý state khi ứng dụng của bạn phát triển](/learn/scaling-up-with-reducer-and-context)

</YouWillLearn>

## Phản hồi lại input bằng state {/*reacting-to-input-with-state*/}

Với React, bạn sẽ không sửa đổi UI trực tiếp từ code. Ví dụ: bạn sẽ không viết các lệnh như "vô hiệu hóa nút", "kích hoạt nút", "hiển thị thông báo thành công", v.v. Thay vào đó, bạn sẽ mô tả UI bạn muốn thấy cho các trạng thái hiển thị khác nhau của component của bạn ("trạng thái ban đầu", "trạng thái đang nhập", "trạng thái thành công"), và sau đó kích hoạt các thay đổi state để đáp ứng lại input của người dùng. Điều này tương tự như cách các nhà thiết kế nghĩ về UI.

Đây là một biểu mẫu trắc nghiệm được xây dựng bằng React. Lưu ý cách nó sử dụng biến state `status` để xác định xem có nên kích hoạt hoặc vô hiệu hóa nút gửi hay không, và có nên hiển thị thông báo thành công hay không.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

<LearnMore path="/learn/reacting-to-input-with-state">

Đọc **[Phản hồi lại Input bằng State](/learn/reacting-to-input-with-state)** để tìm hiểu cách tiếp cận các tương tác với tư duy hướng đến state.

</LearnMore>

## Lựa chọn cấu trúc state {/*choosing-the-state-structure*/}

Cấu trúc state tốt có thể tạo ra sự khác biệt giữa một component dễ sửa đổi và gỡ lỗi, và một component là nguồn gốc liên tục của lỗi. Nguyên tắc quan trọng nhất là state không nên chứa thông tin dư thừa hoặc trùng lặp. Nếu có state không cần thiết, bạn rất dễ quên cập nhật nó và gây ra lỗi!

Ví dụ: biểu mẫu này có một biến state `fullName` **dư thừa**:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Bạn có thể xóa nó và đơn giản hóa code bằng cách tính toán `fullName` trong khi component đang render:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Điều này có vẻ như là một thay đổi nhỏ, nhưng nhiều lỗi trong các ứng dụng React được sửa bằng cách này.

<LearnMore path="/learn/choosing-the-state-structure">

Đọc **[Lựa Chọn Cấu Trúc State](/learn/choosing-the-state-structure)** để tìm hiểu cách thiết kế hình dạng state để tránh lỗi.

</LearnMore>

## Chia sẻ state giữa các component {/*sharing-state-between-components*/}

Đôi khi, bạn muốn state của hai component luôn thay đổi cùng nhau. Để làm điều đó, hãy xóa state khỏi cả hai, di chuyển nó đến parent chung gần nhất của chúng, và sau đó truyền nó xuống cho chúng thông qua props. Điều này được gọi là "nâng state lên", và đó là một trong những điều phổ biến nhất bạn sẽ làm khi viết code React.

Trong ví dụ này, chỉ một panel được kích hoạt tại một thời điểm. Để đạt được điều này, thay vì giữ state hoạt động bên trong mỗi panel riêng lẻ, component parent giữ state và chỉ định các props cho các component con của nó.

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

<LearnMore path="/learn/sharing-state-between-components">

Đọc **[Chia Sẻ State Giữa Các Component](/learn/sharing-state-between-components)** để tìm hiểu cách nâng state lên và giữ cho các component đồng bộ.

</LearnMore>

## Giữ và đặt lại state {/*preserving-and-resetting-state*/}

Khi bạn render lại một component, React cần quyết định phần nào của cây giữ lại (và cập nhật), và phần nào loại bỏ hoặc tạo lại từ đầu. Trong hầu hết các trường hợp, hành vi tự động của React hoạt động đủ tốt. Theo mặc định, React giữ lại các phần của cây "khớp" với cây component đã render trước đó.

Tuy nhiên, đôi khi đây không phải là điều bạn muốn. Trong ứng dụng trò chuyện này, việc nhập tin nhắn và sau đó chuyển đổi người nhận không đặt lại input. Điều này có thể khiến người dùng vô tình gửi tin nhắn cho nhầm người:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

React cho phép bạn ghi đè hành vi mặc định và *buộc* một component đặt lại state của nó bằng cách truyền cho nó một `key` khác, như `<Chat key={email} />`. Điều này cho React biết rằng nếu người nhận khác, nó nên được coi là một component `Chat` *khác* cần được tạo lại từ đầu với dữ liệu mới (và UI như input). Bây giờ, việc chuyển đổi giữa những người nhận sẽ đặt lại trường input--ngay cả khi bạn render cùng một component.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

<LearnMore path="/learn/preserving-and-resetting-state">

Đọc **[Giữ và Đặt Lại State](/learn/preserving-and-resetting-state)** để tìm hiểu vòng đời của state và cách kiểm soát nó.

</LearnMore>

## Trích xuất logic state vào một reducer {/*extracting-state-logic-into-a-reducer*/}

Các component có nhiều cập nhật state trải rộng trên nhiều trình xử lý sự kiện có thể trở nên quá tải. Đối với những trường hợp này, bạn có thể hợp nhất tất cả logic cập nhật state bên ngoài component của bạn trong một hàm duy nhất, được gọi là "reducer". Các trình xử lý sự kiện của bạn trở nên ngắn gọn vì chúng chỉ định các "hành động" của người dùng. Ở cuối file, hàm reducer chỉ định cách state sẽ cập nhật để đáp ứng với mỗi hành động!

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

Đọc **[Trích Xuất Logic State vào Một Reducer](/learn/extracting-state-logic-into-a-reducer)** để tìm hiểu cách hợp nhất logic trong hàm reducer.

</LearnMore>

## Truyền dữ liệu sâu với context {/*passing-data-deeply-with-context*/}

Thông thường, bạn sẽ truyền thông tin từ một component parent đến một component con thông qua props. Nhưng việc truyền props có thể trở nên bất tiện nếu bạn cần truyền một số prop qua nhiều component, hoặc nếu nhiều component cần cùng một thông tin. Context cho phép component parent cung cấp một số thông tin cho bất kỳ component nào trong cây bên dưới nó—bất kể nó sâu đến đâu—mà không cần truyền nó một cách rõ ràng thông qua props.

Ở đây, component `Heading` xác định cấp độ heading của nó bằng cách "hỏi" `Section` gần nhất về cấp độ của nó. Mỗi `Section` theo dõi cấp độ của riêng nó bằng cách hỏi `Section` parent và thêm một vào nó. Mọi `Section` cung cấp thông tin cho tất cả các component bên dưới nó mà không cần truyền props--nó thực hiện điều đó thông qua context.

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

<LearnMore path="/learn/passing-data-deeply-with-context">

Đọc **[Truyền Dữ Liệu Sâu với Context](/learn/passing-data-deeply-with-context)** để tìm hiểu về cách sử dụng context như một giải pháp thay thế cho việc truyền props.

</LearnMore>

## Mở rộng với reducer và context {/*scaling-up-with-reducer-and-context*/}

Reducers cho phép bạn hợp nhất logic cập nhật state của một component. Context cho phép bạn truyền thông tin sâu xuống các component khác. Bạn có thể kết hợp reducers và context với nhau để quản lý state của một màn hình phức tạp.

Với phương pháp này, một component parent có state phức tạp quản lý nó bằng một reducer. Các component khác ở bất kỳ đâu sâu trong cây có thể đọc state của nó thông qua context. Họ cũng có thể dispatch các hành động để cập nhật state đó.

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
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
      <TasksDispatchContext.Provider
        value={dispatch}
      >
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

export default function AddTask({ onAddTask }) {
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

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

Đọc **[Mở Rộng với Reducer và Context](/learn/scaling-up-with-reducer-and-context)** để tìm hiểu cách quản lý state mở rộng trong một ứng dụng đang phát triển.

</LearnMore>

## Tiếp theo là gì? {/*whats-next*/}

Đi tới [Phản hồi lại Input bằng State](/learn/reacting-to-input-with-state) để bắt đầu đọc trang chương này từng trang một!

Hoặc, nếu bạn đã quen thuộc với các chủ đề này, tại sao không đọc về [Các Lối Thoát Hiểm](/learn/escape-hatches)?
