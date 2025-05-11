---
title: Sử dụng TypeScript
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript là một cách phổ biến để thêm định nghĩa kiểu vào các codebase JavaScript. Ngay khi xuất xưởng, TypeScript [hỗ trợ JSX](/learn/writing-markup-with-jsx) và bạn có thể nhận được hỗ trợ đầy đủ cho React Web bằng cách thêm [`@types/react`](https://www.npmjs.com/package/@types/react) và [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) vào dự án của bạn.

</Intro>

<YouWillLearn>

* [TypeScript với React Components](/learn/typescript#typescript-with-react-components)
* [Ví dụ về cách gõ với Hooks](/learn/typescript#example-hooks)
* [Các kiểu phổ biến từ `@types/react`](/learn/typescript/#useful-types)
* [Các địa điểm học tập thêm](/learn/typescript/#further-learning)

</YouWillLearn>

## Cài đặt {/*installation*/}

Tất cả [các framework React cấp production](/learn/start-a-new-react-project#production-grade-react-frameworks) đều cung cấp hỗ trợ sử dụng TypeScript. Làm theo hướng dẫn cụ thể của framework để cài đặt:

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### Thêm TypeScript vào một dự án React hiện có {/*adding-typescript-to-an-existing-react-project*/}

Để cài đặt phiên bản mới nhất của các định nghĩa kiểu React:

<TerminalBlock>
npm install @types/react @types/react-dom
</TerminalBlock>

Các tùy chọn trình biên dịch sau đây cần được đặt trong `tsconfig.json` của bạn:

1. `dom` phải được bao gồm trong [`lib`](https://www.typescriptlang.org/tsconfig/#lib) (Lưu ý: Nếu không có tùy chọn `lib` nào được chỉ định, `dom` sẽ được bao gồm theo mặc định).
2. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) phải được đặt thành một trong các tùy chọn hợp lệ. `preserve` sẽ đủ cho hầu hết các ứng dụng.
  Nếu bạn đang xuất bản một thư viện, hãy tham khảo [`jsx` documentation](https://www.typescriptlang.org/tsconfig/#jsx) về giá trị cần chọn.

## TypeScript với React Components {/*typescript-with-react-components*/}

<Note>

Mọi tệp chứa JSX phải sử dụng phần mở rộng tệp `.tsx`. Đây là một phần mở rộng dành riêng cho TypeScript cho TypeScript biết rằng tệp này chứa JSX.

</Note>

Viết TypeScript với React rất giống với viết JavaScript với React. Sự khác biệt chính khi làm việc với một component là bạn có thể cung cấp các kiểu cho các props của component đó. Các kiểu này có thể được sử dụng để kiểm tra tính chính xác và cung cấp tài liệu nội tuyến trong trình soạn thảo.

Lấy [`MyButton` component](/learn#components) từ hướng dẫn [Quick Start](/learn), chúng ta có thể thêm một kiểu mô tả `title` cho nút:

<Sandpack>

```tsx src/App.tsx active
function MyButton({ title }: { title: string }) {
  return (
   <button>{title}</button>
  );
}

export default function MyApp() {
  return (
   <div>
    <h1>Chào mừng đến với ứng dụng của tôi</h1>
    <MyButton title="Tôi là một nút" />
   </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

 <Note>

Các sandbox này có thể xử lý mã TypeScript, nhưng chúng không chạy trình kiểm tra kiểu. Điều này có nghĩa là bạn có thể sửa đổi các sandbox TypeScript để học, nhưng bạn sẽ không nhận được bất kỳ lỗi hoặc cảnh báo kiểu nào. Để nhận được kiểm tra kiểu, bạn có thể sử dụng [TypeScript Playground](https://www.typescriptlang.org/play) hoặc sử dụng một sandbox trực tuyến đầy đủ tính năng hơn.

</Note>

Cú pháp nội tuyến này là cách đơn giản nhất để cung cấp các kiểu cho một component, mặc dù khi bạn bắt đầu có một vài trường để mô tả, nó có thể trở nên khó sử dụng. Thay vào đó, bạn có thể sử dụng `interface` hoặc `type` để mô tả các props của component:

<Sandpack>

```tsx src/App.tsx active
interface MyButtonProps {
  /** Văn bản để hiển thị bên trong nút */
  title: string;
  /** Cho dù nút có thể tương tác được hay không */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
   <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
   <div>
    <h1>Chào mừng đến với ứng dụng của tôi</h1>
    <MyButton title="Tôi là một nút bị vô hiệu hóa" disabled={true}/>
   </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Kiểu mô tả các props của component của bạn có thể đơn giản hoặc phức tạp tùy theo nhu cầu của bạn, mặc dù chúng phải là một kiểu đối tượng được mô tả bằng `type` hoặc `interface`. Bạn có thể tìm hiểu về cách TypeScript mô tả các đối tượng trong [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) nhưng bạn cũng có thể quan tâm đến việc sử dụng [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) để mô tả một prop có thể là một trong một vài kiểu khác nhau và hướng dẫn [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) cho các trường hợp sử dụng nâng cao hơn.

## Ví dụ Hooks {/*example-hooks*/}

Các định nghĩa kiểu từ `@types/react` bao gồm các kiểu cho các Hook tích hợp, vì vậy bạn có thể sử dụng chúng trong các component của mình mà không cần bất kỳ thiết lập bổ sung nào. Chúng được xây dựng để tính đến mã bạn viết trong component của mình, vì vậy bạn sẽ nhận được [các kiểu được suy luận](https://www.typescriptlang.org/docs/handbook/type-inference.html) rất nhiều và lý tưởng nhất là không cần xử lý các chi tiết nhỏ của việc cung cấp các kiểu.

Tuy nhiên, chúng ta có thể xem xét một vài ví dụ về cách cung cấp các kiểu cho Hooks.

### `useState` {/*typing-usestate*/}

[`useState` Hook](/reference/react/useState) sẽ sử dụng lại giá trị được truyền vào làm trạng thái ban đầu để xác định kiểu của giá trị đó. Ví dụ:

```ts
// Suy luận kiểu là "boolean"
const [enabled, setEnabled] = useState(false);
```

Điều này sẽ gán kiểu `boolean` cho `enabled` và `setEnabled` sẽ là một hàm chấp nhận một đối số `boolean` hoặc một hàm trả về một `boolean`. Nếu bạn muốn cung cấp rõ ràng một kiểu cho trạng thái, bạn có thể làm như vậy bằng cách cung cấp một đối số kiểu cho lệnh gọi `useState`:

```ts
// Đặt rõ ràng kiểu thành "boolean"
const [enabled, setEnabled] = useState<boolean>(false);
```

Điều này không hữu ích lắm trong trường hợp này, nhưng một trường hợp phổ biến mà bạn có thể muốn cung cấp một kiểu là khi bạn có một kiểu union. Ví dụ: `status` ở đây có thể là một trong một vài chuỗi khác nhau:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

Hoặc, như được khuyến nghị trong [Principles for structuring state](/learn/choosing-the-state-structure#principles-for-structuring-state), bạn có thể nhóm trạng thái liên quan thành một đối tượng và mô tả các khả năng khác nhau thông qua các kiểu đối tượng:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

[`useReducer` Hook](/reference/react/useReducer) là một Hook phức tạp hơn, lấy một hàm reducer và một trạng thái ban đầu. Các kiểu cho hàm reducer được suy luận từ trạng thái ban đầu. Bạn có thể tùy chọn cung cấp một đối số kiểu cho lệnh gọi `useReducer` để cung cấp một kiểu cho trạng thái, nhưng thường tốt hơn là đặt kiểu trên trạng thái ban đầu thay thế:

<Sandpack>

```tsx src/App.tsx active
import {useReducer} from 'react';

interface State {
  count: number 
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
   case "reset":
    return initialState;
   case "setCount":
    return { ...state, count: action.value };
   default:
    throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
   <div>
    <h1>Chào mừng đến với bộ đếm của tôi</h1>

    <p>Đếm: {state.count}</p>
    <button onClick={addFive}>Thêm 5</button>
    <button onClick={reset}>Đặt lại</button>
   </div>
  );
}

```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Chúng ta đang sử dụng TypeScript ở một vài nơi quan trọng:

 - `interface State` mô tả hình dạng của trạng thái của reducer.
 - `type CounterAction` mô tả các hành động khác nhau có thể được gửi đến reducer.
 - `const initialState: State` cung cấp một kiểu cho trạng thái ban đầu và cũng là kiểu được sử dụng bởi `useReducer` theo mặc định.
 - `stateReducer(state: State, action: CounterAction): State` đặt các kiểu cho các đối số và giá trị trả về của hàm reducer.

Một giải pháp thay thế rõ ràng hơn cho việc đặt kiểu trên `initialState` là cung cấp một đối số kiểu cho `useReducer`:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

[`useContext` Hook](/reference/react/useContext) là một kỹ thuật để truyền dữ liệu xuống cây component mà không cần phải truyền các props thông qua các component. Nó được sử dụng bằng cách tạo một component provider và thường bằng cách tạo một Hook để sử dụng giá trị trong một component con.

Kiểu của giá trị được cung cấp bởi context được suy luận từ giá trị được truyền cho lệnh gọi `createContext`:

<Sandpack>

```tsx src/App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
   <ThemeContext.Provider value={theme}>
    <MyComponent />
   </ThemeContext.Provider>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
   <div>
    <p>Chủ đề hiện tại: {theme}</p>
   </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Kỹ thuật này hoạt động khi bạn có một giá trị mặc định có ý nghĩa - nhưng đôi khi có những trường hợp bạn không có và trong những trường hợp đó, `null` có thể cảm thấy hợp lý như một giá trị mặc định. Tuy nhiên, để cho phép hệ thống kiểu hiểu mã của bạn, bạn cần đặt rõ ràng `ContextShape | null` trên `createContext`.

Điều này gây ra vấn đề là bạn cần loại bỏ `| null` trong kiểu cho người tiêu dùng context. Đề xuất của chúng tôi là để Hook thực hiện kiểm tra thời gian chạy về sự tồn tại của nó và đưa ra lỗi khi không có:

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// Đây là một ví dụ đơn giản hơn, nhưng bạn có thể tưởng tượng một đối tượng phức tạp hơn ở đây
type ComplexObject = {
  kind: string
};

// Context được tạo với `| null` trong kiểu, để phản ánh chính xác giá trị mặc định.
const Context = createContext<ComplexObject | null>(null);

// `| null` sẽ bị xóa thông qua kiểm tra trong Hook.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject phải được sử dụng trong một Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
   <Context.Provider value={object}>
    <MyComponent />
   </Context.Provider>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
   <div>
    <p>Đối tượng hiện tại: {object.kind}</p>
   </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

[`useMemo`](/reference/react/useMemo) Hooks sẽ tạo/truy cập lại một giá trị được ghi nhớ từ một lệnh gọi hàm, chạy lại hàm chỉ khi các phụ thuộc được truyền làm tham số thứ 2 bị thay đổi. Kết quả của việc gọi Hook được suy luận từ giá trị trả về từ hàm trong tham số đầu tiên. Bạn có thể rõ ràng hơn bằng cách cung cấp một đối số kiểu cho Hook.

```ts
// Kiểu của visibleTodos được suy luận từ giá trị trả về của filterTodos
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```

### `useCallback` {/*typing-usecallback*/}

[`useCallback`](/reference/react/useCallback) cung cấp một tham chiếu ổn định đến một hàm miễn là các phụ thuộc được truyền vào tham số thứ hai giống nhau. Giống như `useMemo`, kiểu của hàm được suy luận từ giá trị trả về của hàm trong tham số đầu tiên và bạn có thể rõ ràng hơn bằng cách cung cấp một đối số kiểu cho Hook.

```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

Khi làm việc ở chế độ nghiêm ngặt của TypeScript, `useCallback` yêu cầu thêm các kiểu cho các tham số trong callback của bạn. Điều này là do kiểu của callback được suy luận từ giá trị trả về của hàm và nếu không có tham số, kiểu không thể được hiểu đầy đủ.

Tùy thuộc vào tùy chọn kiểu mã của bạn, bạn có thể sử dụng các hàm `*EventHandler` từ các kiểu React để cung cấp kiểu cho trình xử lý sự kiện đồng thời xác định callback:

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Thay đổi tôi");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
   setValue(event.currentTarget.value);
  }, [setValue])
  
  return (
   <>
    <input value={value} onChange={handleChange} />
    <p>Giá trị: {value}</p>
   </>
  );
}
```

## Các kiểu hữu ích {/*useful-types*/}

Có một tập hợp các kiểu khá mở rộng đến từ gói `@types/react`, rất đáng để đọc khi bạn cảm thấy thoải mái với cách React và TypeScript tương tác. Bạn có thể tìm thấy chúng [trong thư mục React trong DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts). Chúng ta sẽ đề cập đến một vài kiểu phổ biến hơn ở đây.

### Sự kiện DOM {/*typing-dom-events*/}

Khi làm việc với các sự kiện DOM trong React, kiểu của sự kiện thường có thể được suy luận từ trình xử lý sự kiện. Tuy nhiên, khi bạn muốn trích xuất một hàm để được truyền cho một trình xử lý sự kiện, bạn sẽ cần đặt rõ ràng kiểu của sự kiện.

<Sandpack>

```tsx src/App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Thay đổi tôi");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
   setValue(event.currentTarget.value);
  }

  return (
   <>
    <input value={value} onChange={handleChange} />
    <p>Giá trị: {value}</p>
   </>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Có nhiều loại sự kiện được cung cấp trong các kiểu React - danh sách đầy đủ có thể được tìm thấy [ở đây](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373) dựa trên [các sự kiện phổ biến nhất từ DOM](https://developer.mozilla.org/en-US/docs/Web/Events).

Khi xác định kiểu bạn đang tìm kiếm, trước tiên bạn có thể xem thông tin di chuột cho trình xử lý sự kiện bạn đang sử dụng, thông tin này sẽ hiển thị kiểu của sự kiện.

Nếu bạn cần sử dụng một sự kiện không có trong danh sách này, bạn có thể sử dụng kiểu `React.SyntheticEvent`, đây là kiểu cơ sở cho tất cả các sự kiện.

### Children {/*typing-children*/}

Có hai đường dẫn phổ biến để mô tả các children của một component. Đầu tiên là sử dụng kiểu `React.ReactNode`, đây là một union của tất cả các kiểu có thể được truyền làm children trong JSX:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

Đây là một định nghĩa rất rộng về children. Thứ hai là sử dụng kiểu `React.ReactElement`, đây chỉ là các phần tử JSX và không phải là các nguyên thủy JavaScript như chuỗi hoặc số:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

Lưu ý rằng bạn không thể sử dụng TypeScript để mô tả rằng các children là một loại phần tử JSX nhất định, vì vậy bạn không thể sử dụng hệ thống kiểu để mô tả một component chỉ chấp nhận các children `<li>`.

Bạn có thể xem một ví dụ về cả `React.ReactNode` và `React.ReactElement` với trình kiểm tra kiểu trong [TypeScript playground này](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA).

### Style Props {/*typing-style-props*/}

Khi sử dụng các kiểu nội tuyến trong React, bạn có thể sử dụng `React.CSSProperties` để mô tả đối tượng được truyền cho prop `style`. Kiểu này là một union của tất cả các thuộc tính CSS có thể và là một cách tốt để đảm bảo bạn đang truyền các thuộc tính CSS hợp lệ cho prop `style` và để nhận được tự động hoàn thành trong trình soạn thảo của bạn.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## Học thêm {/*further-learning*/}

Hướng dẫn này đã đề cập đến những điều cơ bản về sử dụng TypeScript với React, nhưng vẫn còn rất nhiều điều để học.
Các trang API riêng lẻ trên tài liệu có thể chứa tài liệu chuyên sâu hơn về cách sử dụng chúng với TypeScript.

Chúng tôi khuyên dùng các tài nguyên sau:

 - [Sổ tay TypeScript](https://www.typescriptlang.org/docs/handbook/) là tài liệu chính thức cho TypeScript và bao gồm hầu hết các tính năng ngôn ngữ chính.

 - [Các ghi chú phát hành TypeScript](https://devblogs.microsoft.com/typescript/) bao gồm các tính năng mới một cách chuyên sâu.

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) là một cheatsheet do cộng đồng duy trì để sử dụng TypeScript với React, bao gồm rất nhiều trường hợp hữu ích và cung cấp độ rộng hơn tài liệu này.

 - [TypeScript Community Discord](https://discord.com/invite/typescript) là một nơi tuyệt vời để đặt câu hỏi và nhận trợ giúp về các vấn đề TypeScript và React.
