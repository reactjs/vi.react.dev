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

Lưu ý rằng React có thể cần render lại component nào đó mà nó đặc biệt trước khi bỏ qua. Bạn không cần quan tâm đến nó bởi React sẽ không "đi sâu" vào cây (tree) một cách không cần thiết. Nếu bạn thực hiện việc tính toán phức tạp khi render, bạn có thể tối ưu nó bằng `useMemo`.

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

>Ghi chú
>
>Nếu bạn sử dụng cách này, hãy chắc chắn rằng mảng được thêm *tất cả giá trị từ component scope (ví dụ props và state), mà nó có thể thay đổi theo thời gian và được sử dụng bởi effect**. Nếu không thì code của bạn sẽ reference giá trị cũ từ lần render trước. Tìm hiều thêm về [các ứng xử với hàm](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) và nên làm gì khi [mảng giá trị thường xuyên thay đổi](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often).
>
>Nếu bạn muốn effect một lần duy nhất (lúc mount và unmount), bạn có thể để mảng rỗng (`[]`) ở argument thứ 2. Nó thông báo với React rằng effect không phụ thuộc vào *bất kỳ* giá trị nào từ props hay state, nên nó sẽ không bao giờ cần phải chạy lại. Đây không phải là trường hợp đặc biệt -- nó tuân theo chính xác cách mà mảng phụ thuộc hoạt động.
>
>Nếu bạn dùng một mảng rỗng (`[]`), props và state bên trong effect sẽ luôn có giá trị khởi đầu của nó. Khi để `[]` ở argument vị trí thứ 2, nó sẽ khá giống với cách hoạt động của `componentDidMount` và `componentWillUnmount`, thường có những [giải pháp](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) [tốt hơn](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) để tránh việc chạy lại các effect quá nhiều lần. Và đừng quên React sẽ trì hoãn khởi chạy `useEffect` cho đến khi trình duyệt vẽ xong (has painted), nên nếu bạn xử lý công việc nhiều hơn sẽ giúp hạn chế được vấn đề phát sinh sau này.
>
>
>Chúng tôi khuyên dùng quy tắc [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) là một phần của [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Nó sẽ cảnh báo khi dependencies có lỗi cụ thể và có thể gợi ý cách sửa lỗi.
Mảng phụ thuộc không được truyền dưới dạng argument cho một effect. Về mặt lý thuyết, mặc dù đây là điều đã được miêu tả: mọi giá trị được tham chiếu bên trong hàm effect nên xuất hiện trong mảng phụ thuộc. Trong tương lai, trình biên dịch đủ nâng cao sẽ có thể tạo mảng này một cách tự động.

### `useContext` {#usecontext}

```js
const value = useContext(MyContext);
```

Chấp nhận một context object (giá trị trả về từ `React.createContext`) và trả về giá trị của context hiện tại. Giá trị context hiện tại được xác định bởi `giá trị` prop của `<MyContext.Provider>` gần nhất bên trên ở component trong một cây.

Khi `<MyContext.Provider>` gần nhất bên trên component cập nhật, Hook này sẽ trigger render lại với context `value` mới nhất đã truyền vào `MyContext` provider. Ngay cả khi bạn dùng [`React.memo`](/docs/react-api.html#reactmemo) hoặc [`shouldComponentUpdate`](/docs/react-component.html#shouldcomponentupdate), việc rerender vẫn sẽ xảy ra khi component đó sử dụng `useContext`.

Đừng quên rằng argument của `useContext` phải là *context object của nó*:

 * **Đúng:** `useContext(MyContext)`
 * **Sai:** `useContext(MyContext.Consumer)`
 * **Sai:** `useContext(MyContext.Provider)`

Một component gọi `useContext` sẽ luôn render lại khi giá trị của context thay đổi. Nếu nó render lại một component phức tạp (expensive), bạn có thể [tối ưu nó bằng memoization](https://github.com/facebook/react/issues/15156#issuecomment-474590693).

>Mẹo
>
>Nếu bạn quen với context API trước Hooks, `useContext(MyContext)` tương đương với `static contextType = MyContext` trong một class, hoặc `<MyContext.Consumer>`.
>
>`useContext(MyContext)` chỉ giúp bạn *đọc* context và subscribe sự thay đổi của nó. Bạn vẫn cần đến `<MyContext.Provider>` ở bên trên của tree để *provide* giá trị cho context này.

**Ví dụ đầy đủ của Context.Provider**
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
      Tôi đang được style bởi theme context!
    </button>
  );
}
```
Ví dụ về hooks này được thay đổi từ ví dụ trước trong mục [Context Advanced Guide](/docs/context.html), nơi bạn có thể tìm thấy thêm thông tin về khi nào và cách sử dụng Context.


## Bổ sung về Hooks {#additional-hooks}

Các hooks sau đây là các biến thể của các hooks cơ bản bên trên, hoặc chỉ cần cho một số trường hợp đặc biệt. Bạn không cần phải học chúng trước.

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

Đây là một thay thế cho [`useState`](#usestate). Chấp nhận một reducer của kiểu `(state, action) => newState, và trả về state hiện tại đi kèm với một `dispatch` method. (Nếu bạn quen thuộc với Redux, bạn đã biết cách nó hoạt động như thế nào).

`useReducer` thường thích hợp hơn `useState` khi bạn có một state phức tạp với nhiều logic bên trong, như là có nhiều sub-values hoặc khi state tiếp theo phụ thuộc vào giá trị của state trước. `useReducer` đồng thời giúp bạn tối ưu hiệu năng của component nào mà nó cập nhật ở sâu (trigger deep updates) bởi vì [bạn có thể bỏ `dispatch` xuống thay vì dùng callbacks](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down).

Đây là ví dụ bộ đếm từ mục [`useState`](#usestate), viết lại dưới dạng sử dụng reducer:

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
      Bộ đếm: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

>Ghi chú
>
>React đảm bảo rằng hàm `dispatch` là stable và sẽ không thay đổi khi render lại. Đây là lý do tại sao nó an toàn để có thể bỏ qua danh sách phụ thuộc của `useEffect` hay là `useCallback`.

#### Chỉ định state ban đầu {#specifying-the-initial-state}

Có hai cách để khởi tạo `useReducer` state. Bạn có thể chọn một trong hai tuỳ chọn tuỳ thuộc vào trường hợp sử dụng. Các đơn giản nhất là truyền trạng thái bạn đầu của state vào argument thứ hai:

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>Ghi chú
>
>React không sử dụng `state = initialState` - quy tắc argument phổ biến của Redux. Giá trị khởi đầu đôi khi cần phải phụ thuộc vào props và nó được xác định thay thế bởi gọi Hook. Nếu bạn cảm thấy cách này nặng nề, bạn có thể dùng `useReducer(reducer, undefined, reducer)` để mô phỏng hành vi của Redux, tuy nhiên cách này không được khuyến khích.

#### Lazy initialization {#lazy-initialization}

Bạn cũng có thể tạo state ban đầu kiểu lazy. Để thực hiện, để hàm `init` ở argument vị trí thứ ba. State khởi tạo sẽ được gán cho `init(initialArg).

Nó sẽ giúp bạn tách logic tính toán của state ban đầu ra ngoài reducer. Đồng thời cũng hữu ích để sau này bạn có thể dùng lại để reset về giá trị ban đầu:

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
      Bộ đếm: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Đặt lại
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

#### Bỏ qua một dispatch {#bailing-out-of-a-dispatch}

Nếu bạn trả về cùng giá trị với state hiện tại từ Reducer Hook, React sẽ bỏ qua mà không render lại children hay bắn ra effects. (React sử dụng [thuật toán so sánh `Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).)

Lưu ý rằng React có thể cần render lại component nào đó mà nó đặc biệt trước khi bỏ qua. Bạn không cần quan tâm đến nó bởi React sẽ không "đi sâu" vào cây (tree) một cách không cần thiết. Nếu bạn thực hiện việc tính toán phức tạp khi render, bạn có thể tối ưu nó bằng `useMemo`.

### `useCallback` {#usecallback}

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

Trả về một callback [đã ghi nhớ](https://en.wikipedia.org/wiki/Memoization).

Bỏ vào một callback và một mảng phụ thuộc. `useCallback` sẽ trả về một bản đã ghi nhớ của callback mà nó chỉ thay đổi khi có ít một phụ thuộc thay đổi. Nó sẽ hữu ích khi bạn để một component con mà nó chỉ render lại phụ thuộc vào một số giá trị nhất định để tránh việc render không cần thiết (giống như `shouldComponentUpdate`).

`useCallback(fn, deps)` tương đương với `useMemo(() => fn, deps)`.

> Note
>
> Mảng phụ thuộc không được truyền dưới dạng argument cho một callback. Về mặt lý thuyết, mặc dù đây là điều đã được miêu tả: mọi giá trị được tham chiếu bên trong hàm callback nên xuất hiện trong mảng phụ thuộc. Trong tương lai, trình biên dịch đủ nâng cao sẽ có thể tạo mảng này một cách tự động.
>
>Chúng tôi khuyên dùng quy tắc [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) là một phần của [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Nó sẽ cảnh báo khi dependencies có lỗi cụ thể và có thể gợi ý cách sửa lỗi.

### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Trả về một giá trị [đã ghi nhớ](https://en.wikipedia.org/wiki/Memoization) value.

Bỏ vào một hàm "tạo" và một mảng phụ thuộc. `useMemo` sẽ chỉ tính toán lại giá trị đã nhớ khi một trong những phụ thuộc thay đổi. Tối ưu này giúp giảm thiểu các tính toán phức tạp mỗi lần render.

Hãy nhớ rằng hàm mà truyền vào `useMemo` chỉ chạy khi render. Đừng làm bất cứ điều gì ở đó mà bạn không thường hay làm trong quá trình render. Ví dụ, như các side effect của `useEffect`, không phải của `useMemo`.

Nếu không có mảng phụ thuộc, giá trị mới sẽ luôn luôn được tính toán mỗi lần render.

**Bạn có thể hiểu `useMemo` là cách để tối ưu hiệu năng, không hoàn toàn đúng về ngữ nghĩa (useMemo giống như bộ nhớ trong tiếng Việt).** Trong tương lại React có thể chọn để **quên đi** một số ghi nhớ đã cũ và tính toán lại chúng trong lần render tiếp theo, ví dụ để làm trống bộ nhớ khi component rời khỏi màn hình. Viết code của bạn mà nó vẫn có thể hoạt động khi không sử dụng `useMemo` - sau đo thêm nó vào để tối ưu hoá hiệu năng sau.

>Ghi chú
>
>Mảng phụ thuộc không được truyền dưới dạng argument cho một hàm. Về mặt lý thuyết, mặc dù đây là điều đã được miêu tả: mọi giá trị được tham chiếu bên trong hàm nên xuất hiện trong mảng phụ thuộc. Trong tương lai, trình biên dịch đủ nâng cao sẽ có thể tạo mảng này một cách tự động.
>
>Chúng tôi khuyên dùng quy tắc [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) là một phần của [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Nó sẽ cảnh báo khi dependencies có lỗi cụ thể và có thể gợi ý cách sửa lỗi.

### `useRef` {#useref}

```js
const refContainer = useRef(initialValue);
```

`useRef` trả về một đối tượng ref có thể thay đổi nơi mà thuộc tính `.current` được khởi tạo và thêm vào giá trị của (`initialValue`). Object trả về sẽ kiên định cho cả vòng đời của component.

Một số trường hợp cơ bản để truy cập vào các lệnh của component con:

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` trỏ vào element text input đã được mount
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Đưa con trỏ vào ô input</button>
    </>
  );
}
```

Bản chất, `useRef` giống như một cái "hộp" mà có thể lưu giữ một giá trị có thể thay đổi (mutable value) bên trong `.current` property của nó.

Bạn có thể quen thuộc với refs chủ yếu như cách để [truy cập DOM](/docs/refs-and-the-dom.html). Nếu bạn truyền một đối tượng ref vào React bằng cách `<div ref={myRef} />`, React sẽ đặt thuộc tính `.current` tương ứng với DOM node bất kể khi nào node đó thay đổi. 

Tuy vậy, `useRef()` sẽ hữu ích nhiều hơn so với thuộc tính `ref`. Nó [tiện dụng để giữ mọi giá trị có thể thay đổi được](/docs/hooks-faq.html#is-there-something-like-instance-variables) tượng tự như là cách bạn dùng instance fields trong class.

Điều này hoạt động vì `useRef()` tạo ra một đối tượng JavaScript thuần. Sự khác biệt duy nhất là giữa `useRef()` và tạo một đối tượng `{current: ...`} của bạn là `useRef()` sẽ đưa bạn cùng một đối tượng `ref` trong mọi lần render.

Nhớ rằng `useRef` *không thông báo cho bạn khi nội dung của nó thay đổi. Thay đổi thuộc tính `.current` sẽ không re-render*. Nếu bạn muốn chạy code khi React gán hoặc tách một ref vào DOM node, bạn có thể muốn sử dụng một [callback ref](/docs/hooks-faq.html#how-can-i-measure-a-dom-node) để thay thế.


### `useImperativeHandle` {#useimperativehandle}

```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` tuỳ biến luồng giá trị mà nó đã được thông với các components cha khi sử dụng `ref`. Như mọi khi, imperative code sử dụng refs nên tránh trong đa số các trường hợp. `useImperativeHandle` nên dùng với [`forwardRef`](/docs/react-api.html#reactforwardref):

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

Trong ví dụ trên, một component cha mà render `<FancyInput ref={inputRef} />` sẽ có thể gọi `inputRef.current.focus()`.

### `useLayoutEffect` {#uselayouteffect}

Có đặc điểm giống với `useEffect`, nhưng sẽ kích hoạt đồng bộ sau khi tất cả DOM thay đổi. Sử dụng nó để đọc bố cục từ DOM và render lại một cách đồng bộ. Các cập nhật được bố trí bên trong `useLayoutEffect` sẽ được xoá một cách đồng bộ, trước khi trình duyệt có cơ hội vẽ.

Tham khảo dùng `useEffect` khi có thể để tránh bị chặn những cập nhật trực quan.

> Mẹo
>
>Nếu bạn đang viết lại code từ class component, lưu ý rằng `useLayoutEffect` kích hoạt cùng giai đoạn như là `compoenntDidMount` và `componentDidUpdate`. Tuy nhiên, **chúng tôi khuyên bạn bắt đầu với `useEffect` trước tiên** và chỉ thử `useLayoutEffect` nếu điều đó gây ra vấn đề.
>
>Nếu bạn sử dụng render từ server, hãy nhớ rằng *cả* `useLayoutEffect` và `useEffect` đều không thể chạy cho đến khi JavaScript tải xong. Đó là lý do tại sao React cảnh báo khi server-renders mà compoent chứa `useLayoutEffect`. Để sửa nó, hoặc là di chuyển logic vào `useEffect` (nếu nó không thực sự cần cho lần render đầu tiên) hoặc trì hoãn hiển thị component đó cho đến sau khi client được renders (có thể HTML trông bị hỏng cho đến khi `useLayoutEffect` chạy).
>
>Để loại bỏ một component mà cần layout effect từ server-rendered HTML, hãy render có điều kiện nó bằng cách `showChild && <Child />` và trì hoãn hiển thị nó bằng cách `useEffect(() => { setShowChild(true); }, [])`. Với cách này, giao diện sẽ không xuất hiện lỗi trước khi client được tải.

### `useDebugValue` {#usedebugvalue}

```js
useDebugValue(value)
```

`useDebugValue` có thể dùng để hiện thỉ label cho hooks của bạn trong React DevTools.

Ví dụ, xem `useFriendStatus` được mô tả ở ["Tạo Hooks của bạn"](/docs/hooks-custom.html):

```js{6-8}
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Hiển thị label trong DevTools ngay cạnh Hook
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

> Mẹo
>
> Chúng tôi không khuyến khích thêm debug value vào mọi Hook. Nó có giá trị nhất cho các Hooks tuỳ biến là một phần của thư viện được chia sẻ.

#### Trì hoãn định dạng debug values {#defer-formatting-debug-values}

Trong một số trường hợp định dạng một giá trị để hiển thì có thể sẽ là một toán tử phức tạp. Nó đồng thời không cần thiết trừ khi nếu một Hook thực sự dùng đến. 

Vì lý do đó `useDebugValue` chấp nhận một hàm format dưới dạng tuỳ chọn tham số thứ hai. Hàm này chỉ gọi nếu Hooks dùng đến. Nó nhận debug value như là tham số và sẽ trả về một giá trị đã được định dạng.

Ví dụ một custom Hook trả về một giá trị `Date` có thể tránh gọi hàm `toDateString` một cách không cần thiết bằng cách tryền hàm formater như bên dưới:

```js
useDebugValue(date, date => date.toDateString());
```
