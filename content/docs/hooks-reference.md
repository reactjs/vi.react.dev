---
id: hooks-reference
title: Tài liệu tham khảo Hooks API
permalink: docs/hooks-reference.html
prev: hooks-custom.html
next: hooks-faq.html
---

*Hooks* được thêm ở phiên bản React 16.8. Nó giúp bạn sử dụng state và các tính năng khác của React mà không cần viết một `class`.

Trang này mô tả các APIs có sẵn của Hooks trong React. 

Nếu bạn mới làm quen với Hooks, bạn có thể muốn xem [tổng quan](/docs/hooks-overview.html) trước. Bạn có thể tìn thấy vài thông tin có ích ở mục [câu hỏi thường gặp](/docs/hooks-faq.html).

- [Hooks Cơ bản](#basic-hooks)
  - [`useState`](#usestate)
  - [`useEffect`](#useeffect)
  - [`useContext`](#usecontext)
- [Bổ sung Hooks](#additional-hooks)
  - [`useReducer`](#usereducer)
  - [`useCallback`](#usecallback)
  - [`useMemo`](#usememo)
  - [`useRef`](#useref)
  - [`useImperativeHandle`](#useimperativehandle)
  - [`useLayoutEffect`](#uselayouteffect)
  - [`useDebugValue`](#usedebugvalue)

## Hooks Cơ bản {#basic-hooks}

### `useState` {#usestate}

```js
const [state, setState] = useState(initialState);
```

Trả về một giá trị stateful, và hàm để cập nhật nó.

Với lần render đầu tiên, trạng thái trả về của (`state`) là giống với giá trị mà bạn để ở tham số đầu tiên (`initialState`).

Hàm `setState` được dùng để thay đổi state. Nó chấp nhận giá trị state mới và sẽ thực hiện render lại (re-render) component.

```js
setState(newState);
```

Trong những lần re-renders tiếp theo, giá trị đầu tiên trả về bởi `useState` sẽ luôn là state mới nhất sau khi hoàn thành các thay đổi.

>Ghi chú
>
>React đảm bảm rằng identity của hàm `setState` là stable và sẽ không thay đổi khi re-renders. Nó giải thích tại sao nó an toàn để có thể bỏ qua danh sách phụ thuộc của hàm `useEffect` hay `useCallback` (xem thêm về danh sách phụ thuộc ở bên dưới).

#### Functional updates {#functional-updates}

Nếu state mới được tính dựa vào state trước đó, bạn có thể dùng hàm trong `setState`. Hàm sẽ nhận về giá trị trước đó, và trả về giá trị đã được cập nhật. Dưới đây là component ví dụ về bộ đếm sử dụng 2 dạng của `setState`:

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Bộ đếm: {count}
      <button onClick={() => setCount(initialCount)}>Chạy lại</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );
}
```

Các nút "+" và "-" sử dụng hàm bởi vì chúng thay đổi giá trị dựa vào giá trị cũ. Nhưng nút "Chạy lại" sử dụng giá trị trực tiếp, bởi chúng lúc nào cũng gán lại biến `count` về giá trị ban đầu.

Nếu hàm cập nhật của bạn trả về giống với giá trị của state hiện tại, việc rerender tiếp theo sẽ được bỏ qua hoàn toàn.

> Ghi chú
>
> Không giống method `setState` method ở class components, `useState` sẽ không tự động merge objects. Tuy nhiên bạn có thể tự triển khai function đó với cú pháp (spread syntax) như bên dưới:
>
> ```js
> const [state, setState] = useState({});
> setState(prevState => {
>   // Object.assign cũng có thể sử dụng được ở đây
>   return {...prevState, ...updatedValues};
> });
> ```
>
> Một lựa chọn khác là `useReducer`, có thể sẽ phù hợp hơn nếu bạn cần quản lý state mà nó chưa nhiều giá trị con (sub-values).

#### Lazy initial state {#lazy-initial-state}

`initialState` argument là một state được sử dụng ở lần render đầu tiên. Trong các lần render tiếp theo, nó sẽ bị bỏ qua. Nếu initial state kết quả của một phép tính phức tạp, bạn có thể phải chuẩn bị một hàm để thay thể, để nó chỉ chạy khi render lần đầu tiên:

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

#### Bỏ qua một cập nhật state {#bailing-out-of-a-state-update}

Nếu bạn cập nhật một State Hook với một giá trị giống với state hiện tại, React sẽ bỏ qua việc render the children hoặc bắn effects. (React sử dụng [Thuật toán so sánh `Object.is` ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).)

Lưu ý rằng React có thể cần render lại component đặc biệt trước khi bỏ qua. Bạn không cần quan tâm đến nó bởi React sẽ không "đi sâu" vào cây (tree) một cách không cần thiết. Nếu bạn thực hiện việc tính toán phức tạp khi render, bạn có thể tối ưu nó bằng `useMemo`.

### `useEffect` {#useeffect}

```js
useEffect(didUpdate);
```

Xác định một hàm với code có thể có effect hoặc không (possibly effectful code).

Mutations, subscriptions, timers, logging, và các side effects không được phép sử dụng bên trong body của function component (gọi là React's _render phase_). Nếu làm vậy có thể sẽ dẫn đến những lỗi kì lạ và không nhất quán trên giao diện.

Thay vào đó, sử dụng `useEffect`. Hàm được gọi bởi `useEffect` sẽ chạy sau khi render hoàn thành (render is committed to the screen). Hãy coi các effects như là cách để biến các hàm thuần túy trở thành các hàm của React.

Mặc định, effetcs sẽ chạy mỗi lần sau khi render hoàn tất, nhưng bạn có thể điều chỉnh nó [chỉ khi chắc chắn giá trị thay đổi](#conditionally-firing-an-effect).

#### Loại bỏ một effect (Cleaning up an effect) {#cleaning-up-an-effect}

Thông thường, effets tạo ra tài nguyên mà nó cần được loại bỏ trước khi component rời khỏi màn hình, ví dụ như là subscription hoặc timer ID. Để làm vậy, hàm sử dụng ở `useEffect` có thể trả về một hàm clean-up. Ví dụ, để tạo một subscription:

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Loại bỏ subscription
    subscription.unsubscribe();
  };
});
```

Hàm clean-up chạy trước khi component bị loại bỏ khỏi UI để tránh bị rò rỉ bộ nhớ (memory leaks). Ngoài ra, nếu compoment render nhiều lần (thường sẽ như thế), **effect trước đó sẽ bị loại bỏ trước khi effect mới thực thi**. Trong ví dụ trên, subscription mới sẽ được tạo mỗi lần cập nhật. Để tránh bị effect mỗi khi update, hãy xem phần kế tiếp.

#### Timing of effects {#timing-of-effects}

Không giống `componentDidMount` và `componentDidUpdate`, hàm được gán cho `useEffect` sẽ chạy **sau khi** render hoàn tất, trong khi trì hoãn event này. Điều đó khiến nó phù hợp cho rất nhiều dạng side effects cơ bản, như là subscriptions và event handles, bời vì đa số tác vụ không nên chặn (block) trình duyệt thực hiện cập nhật thay đổi màn hình.

Tuy nhiên, không phải tất cả effects có thể trì hoãn. Lấy ví dụ, một DOM mutation mà nó hiển thị cho người dùng bắt buộc cập nhật đồng bộ trước khi có sự thay đổi kế tiếp để người dùng không cảm thấy có sự không thống nhất. (Sự khác nhau ở đây về mặt khái niệm tương tự như event listeners chủ động so với bị động.) Đối với những loại effects này, React cung cấp một bổ sung cho Hook gọi là [`useLayoutEffect`](#uselayouteffect). Nó có những đặc tính giống như `useEffect`, và chỉ khác ở thời gian mà nó thực thi (fired).

Mặc dù `useEffect` trì hoãn đến khi trình duyệt vẽ xong (painted), nó được đảm bảo sẽ thực thi trước mỗi khi có một render mới. React sẽ luôn loại bỏ các effect của render cũ trước khi bắt đầu thực hiện thay đổi mới.

#### Thực thi có điều kiện của một effect {#conditionally-firing-an-effect}

Hành vi mặc định của các effetcs là thực thi mỗi khi hoàn thành việc render. Với cách này một effect sẽ luôn được khởi tạo lại nếu một trong những dependencies (danh sách phụ thuộc) của nó thay đổi. 

Tuy nhiên, điều này có thể quá đà trong một số trường hợp, giống như ví dụ về subscription ở mục bên trên. Chúng ta không cần thiết phải tạo lại một subscription mỗi lần cập nhật, chỉ cần nếu `nguồn đầu vào` thay đổi 

Để triển khai code, hãy để argument thứ hai vào `useEffect` dưới dạng mảng những giá trị mà effect này phụ thuộc vào. Sửa lại ví dụ bên trên ta có:

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

Từ giờ subscription sẽ chỉ tạo lại khi `props.source` thay đổi.

>Note
>
>If you use this optimization, make sure the array includes **all values from the component scope (such as props and state) that change over time and that are used by the effect**. Otherwise, your code will reference stale values from previous renders. Learn more about [how to deal with functions](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) and what to do when the [array values change too often](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often).
>
>If you want to run an effect and clean it up only once (on mount and unmount), you can pass an empty array (`[]`) as a second argument. This tells React that your effect doesn't depend on *any* values from props or state, so it never needs to re-run. This isn't handled as a special case -- it follows directly from how the dependencies array always works.
>
>If you pass an empty array (`[]`), the props and state inside the effect will always have their initial values. While passing `[]` as the second argument is closer to the familiar `componentDidMount` and `componentWillUnmount` mental model, there are usually [better](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [solutions](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) to avoid re-running effects too often. Also, don't forget that React defers running `useEffect` until after the browser has painted, so doing extra work is less of a problem.
>
>
>We recommend using the [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) rule as part of our [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package. It warns when dependencies are specified incorrectly and suggests a fix.

The array of dependencies is not passed as arguments to the effect function. Conceptually, though, that's what they represent: every value referenced inside the effect function should also appear in the dependencies array. In the future, a sufficiently advanced compiler could create this array automatically.

### `useContext` {#usecontext}

```js
const value = useContext(MyContext);
```

Accepts a context object (the value returned from `React.createContext`) and returns the current context value for that context. The current context value is determined by the `value` prop of the nearest `<MyContext.Provider>` above the calling component in the tree.

When the nearest `<MyContext.Provider>` above the component updates, this Hook will trigger a rerender with the latest context `value` passed to that `MyContext` provider. Even if an ancestor uses [`React.memo`](/docs/react-api.html#reactmemo) or [`shouldComponentUpdate`](/docs/react-component.html#shouldcomponentupdate), a rerender will still happen starting at the component itself using `useContext`.

Don't forget that the argument to `useContext` must be the *context object itself*:

 * **Correct:** `useContext(MyContext)`
 * **Incorrect:** `useContext(MyContext.Consumer)`
 * **Incorrect:** `useContext(MyContext.Provider)`

A component calling `useContext` will always re-render when the context value changes. If re-rendering the component is expensive, you can [optimize it by using memoization](https://github.com/facebook/react/issues/15156#issuecomment-474590693).

>Tip
>
>If you're familiar with the context API before Hooks, `useContext(MyContext)` is equivalent to `static contextType = MyContext` in a class, or to `<MyContext.Consumer>`.
>
>`useContext(MyContext)` only lets you *read* the context and subscribe to its changes. You still need a `<MyContext.Provider>` above in the tree to *provide* the value for this context.

**Putting it together with Context.Provider**
```js{31-36}
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```
This example is modified for hooks from a previous example in the [Context Advanced Guide](/docs/context.html), where you can find more information about when and how to use Context.


## Additional Hooks {#additional-hooks}

The following Hooks are either variants of the basic ones from the previous section, or only needed for specific edge cases. Don't stress about learning them up front.

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

An alternative to [`useState`](#usestate). Accepts a reducer of type `(state, action) => newState`, and returns the current state paired with a `dispatch` method. (If you're familiar with Redux, you already know how this works.)

`useReducer` is usually preferable to `useState` when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one. `useReducer` also lets you optimize performance for components that trigger deep updates because [you can pass `dispatch` down instead of callbacks](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down).

Here's the counter example from the [`useState`](#usestate) section, rewritten to use a reducer:

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

>Note
>
>React guarantees that `dispatch` function identity is stable and won't change on re-renders. This is why it's safe to omit from the `useEffect` or `useCallback` dependency list.

#### Specifying the initial state {#specifying-the-initial-state}

There are two different ways to initialize `useReducer` state. You may choose either one depending on the use case. The simplest way is to pass the initial state as a second argument:

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>Note
>
>React doesn’t use the `state = initialState` argument convention popularized by Redux. The initial value sometimes needs to depend on props and so is specified from the Hook call instead. If you feel strongly about this, you can call `useReducer(reducer, undefined, reducer)` to emulate the Redux behavior, but it's not encouraged.

#### Lazy initialization {#lazy-initialization}

You can also create the initial state lazily. To do this, you can pass an `init` function as the third argument. The initial state will be set to `init(initialArg)`.

It lets you extract the logic for calculating the initial state outside the reducer. This is also handy for resetting the state later in response to an action:

```js{1-3,11-12,19,24}
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

#### Bailing out of a dispatch {#bailing-out-of-a-dispatch}

If you return the same value from a Reducer Hook as the current state, React will bail out without rendering the children or firing effects. (React uses the [`Object.is` comparison algorithm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).)

Note that React may still need to render that specific component again before bailing out. That shouldn't be a concern because React won't unnecessarily go "deeper" into the tree. If you're doing expensive calculations while rendering, you can optimize them with `useMemo`.

### `useCallback` {#usecallback}

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

Returns a [memoized](https://en.wikipedia.org/wiki/Memoization) callback.

Pass an inline callback and an array of dependencies. `useCallback` will return a memoized version of the callback that only changes if one of the dependencies has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders (e.g. `shouldComponentUpdate`).

`useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.

> Note
>
> The array of dependencies is not passed as arguments to the callback. Conceptually, though, that's what they represent: every value referenced inside the callback should also appear in the dependencies array. In the future, a sufficiently advanced compiler could create this array automatically.
>
> We recommend using the [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) rule as part of our [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package. It warns when dependencies are specified incorrectly and suggests a fix.

### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Returns a [memoized](https://en.wikipedia.org/wiki/Memoization) value.

Pass a "create" function and an array of dependencies. `useMemo` will only recompute the memoized value when one of the dependencies has changed. This optimization helps to avoid expensive calculations on every render.

Remember that the function passed to `useMemo` runs during rendering. Don't do anything there that you wouldn't normally do while rendering. For example, side effects belong in `useEffect`, not `useMemo`.

If no array is provided, a new value will be computed on every render.

**You may rely on `useMemo` as a performance optimization, not as a semantic guarantee.** In the future, React may choose to "forget" some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance.

> Note
>
> The array of dependencies is not passed as arguments to the function. Conceptually, though, that's what they represent: every value referenced inside the function should also appear in the dependencies array. In the future, a sufficiently advanced compiler could create this array automatically.
>
> We recommend using the [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) rule as part of our [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package. It warns when dependencies are specified incorrectly and suggests a fix.

### `useRef` {#useref}

```js
const refContainer = useRef(initialValue);
```

`useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument (`initialValue`). The returned object will persist for the full lifetime of the component.

A common use case is to access a child imperatively:

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

Essentially, `useRef` is like a "box" that can hold a mutable value in its `.current` property.

You might be familiar with refs primarily as a way to [access the DOM](/docs/refs-and-the-dom.html). If you pass a ref object to React with `<div ref={myRef} />`, React will set its `.current` property to the corresponding DOM node whenever that node changes.

However, `useRef()` is useful for more than the `ref` attribute. It's [handy for keeping any mutable value around](/docs/hooks-faq.html#is-there-something-like-instance-variables) similar to how you'd use instance fields in classes.

This works because `useRef()` creates a plain JavaScript object. The only difference between `useRef()` and creating a `{current: ...}` object yourself is that `useRef` will give you the same ref object on every render.

Keep in mind that `useRef` *doesn't* notify you when its content changes. Mutating the `.current` property doesn't cause a re-render. If you want to run some code when React attaches or detaches a ref to a DOM node, you may want to use a [callback ref](/docs/hooks-faq.html#how-can-i-measure-a-dom-node) instead.


### `useImperativeHandle` {#useimperativehandle}

```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` customizes the instance value that is exposed to parent components when using `ref`. As always, imperative code using refs should be avoided in most cases. `useImperativeHandle` should be used with [`forwardRef`](/docs/react-api.html#reactforwardref):

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

In this example, a parent component that renders `<FancyInput ref={inputRef} />` would be able to call `inputRef.current.focus()`.

### `useLayoutEffect` {#uselayouteffect}

The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations. Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside `useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.

Prefer the standard `useEffect` when possible to avoid blocking visual updates.

> Tip
>
> If you're migrating code from a class component, note `useLayoutEffect` fires in the same phase as `componentDidMount` and `componentDidUpdate`. However, **we recommend starting with `useEffect` first** and only trying `useLayoutEffect` if that causes a problem.
>
>If you use server rendering, keep in mind that *neither* `useLayoutEffect` nor `useEffect` can run until the JavaScript is downloaded. This is why React warns when a server-rendered component contains `useLayoutEffect`. To fix this, either move that logic to `useEffect` (if it isn't necessary for the first render), or delay showing that component until after the client renders (if the HTML looks broken until `useLayoutEffect` runs).
>
>To exclude a component that needs layout effects from the server-rendered HTML, render it conditionally with `showChild && <Child />` and defer showing it with `useEffect(() => { setShowChild(true); }, [])`. This way, the UI doesn't appear broken before hydration.

### `useDebugValue` {#usedebugvalue}

```js
useDebugValue(value)
```

`useDebugValue` can be used to display a label for custom hooks in React DevTools.

For example, consider the `useFriendStatus` custom Hook described in ["Building Your Own Hooks"](/docs/hooks-custom.html):

```js{6-8}
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Show a label in DevTools next to this Hook
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

> Tip
>
> We don't recommend adding debug values to every custom Hook. It's most valuable for custom Hooks that are part of shared libraries.

#### Defer formatting debug values {#defer-formatting-debug-values}

In some cases formatting a value for display might be an expensive operation. It's also unnecessary unless a Hook is actually inspected.

For this reason `useDebugValue` accepts a formatting function as an optional second parameter. This function is only called if the Hooks are inspected. It receives the debug value as a parameter and should return a formatted display value.

For example a custom Hook that returned a `Date` value could avoid calling the `toDateString` function unnecessarily by passing the following formatter:

```js
useDebugValue(date, date => date.toDateString());
```
