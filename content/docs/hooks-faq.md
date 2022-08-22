---
id: hooks-faq
title: Một số câu hỏi thường gặp với Hook
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

*Hook* là một tính năng mới từ React 16.8. Nó cho phép sử dụng state và các tính năng khác của React mà không cần viết dạng class

Trang này sẽ trả lời các câu hỏi thường gặp với [Hook](/docs/hooks-overview.html).

<!--
  if you ever need to regenerate this, this snippet in the devtools console might help:

  $$('.anchor').map(a =>
    `${' '.repeat(2 * +a.parentNode.nodeName.slice(1))}` +
    `[${a.parentNode.textContent}](${a.getAttribute('href')})`
  ).join('\n')
-->

* **[Kế hoạch chuyển đổi](#adoption-strategy)**
  * [Phiên bản nào của React đã bao gồm Hook?](#which-versions-of-react-include-hooks)
  * [Tôi có cần viết lại toàn bộ class component?](#do-i-need-to-rewrite-all-my-class-components)
  * [Những gì tôi có thể làm với Hook mà không thể làm với class?](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [Những kiến thức React trước đây của tôi có còn liên quan?](#how-much-of-my-react-knowledge-stays-relevant)
  * [Tôi có nên sử dụng Hook, class, hay kết hợp cả ?](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [Hook có đã bao gồm tất cả trường hợp sử dụng của class?](#do-hooks-cover-all-use-cases-for-classes)
  * [Hook có thay thế prop và higher-order component?](#do-hooks-replace-render-props-and-higher-order-components)
  * [Hook có ý nghĩa như thế nào với các API  phổ biến như Redux connect() và React Router?](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [Hook có làm việc với kiểu static không?](#do-hooks-work-with-static-typing)
  * [Làm sao để test component sử dụng Hook?](#how-to-test-components-that-use-hooks)
  * [Thực sự thì các luật lệ mà lint đang bắt buộc là gì?](#what-exactly-do-the-lint-rules-enforce)
* **[Từ Class sang Hook](#from-classes-to-hooks)**
  * [Các phương thức lifecycle tương ứng với Hook như thế nào?](#how-do-lifecycle-methods-correspond-to-hooks)
  * [Làm thế nào tôi có thể fetching data với Hook?](#how-can-i-do-data-fetching-with-hooks)
  * [Thực sự có một instance của biến không?](#is-there-something-like-instance-variables)
  * [Tôi có nên sử dụng 1 hay nhiều biến state?](#should-i-use-one-or-many-state-variables)
  * [Tôi có thể chạy effect chỉ khi update không?](#can-i-run-an-effect-only-on-updates)
  * [Làm sao để lấy được prop và state trước đó?](#how-to-get-the-previous-props-or-state)
  * [Tại sao tôi có thể thấy prop và state bên trong function?](#why-am-i-seeing-stale-props-or-state-inside-my-function)
  * [Tôi viết  getDerivedStateFromProps như thế nào?](#how-do-i-implement-getderivedstatefromprops)
  * [Có thể forceUpdate không?](#is-there-something-like-forceupdate)
  * [Tôi có thể dùng ref đến một function component không?](#can-i-make-a-ref-to-a-function-component)
  * [Làm sao tôi có thể đo được 1 DOM node?](#how-can-i-measure-a-dom-node)
  * [Viết const [thing, setThing] = useState() nghĩa là gì?](#what-does-const-thing-setthing--usestate-mean)
* **[Tối ưu hiệu năng](#performance-optimizations)**
  * [Tôi có thể bỏ qua một effect khi update không?](#can-i-skip-an-effect-on-updates)
  * [Liệu có an toàn nếu omit functions từ các dependency?](#is-it-safe-to-omit-functions-from-the-list-of-dependencies)
  * [Tôi phải làm gì nếu các giá trị phụ thuộc của effect thay đổi quá thường xuyên?](#what-can-i-do-if-my-effect-dependencies-change-too-often)
  * [Viết shouldComponentUpdate như thế nào?](#how-do-i-implement-shouldcomponentupdate)
  * [Làm sao để lưu trữ một tính toán?](#how-to-memoize-calculations)
  * [Làm thế nào để tạo object lớn một cách lazy?](#how-to-create-expensive-objects-lazily)
  * [Có phải Hook chậm bởi vì tạo function trong render?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [Làm thế nào để tránh truyền callback xuống?](#how-to-avoid-passing-callbacks-down)
  * [Làm thế nào để đọc một giá trị thay đổi thường xuyên  từ useCallback ?](#how-to-read-an-often-changing-value-from-usecallback)
* **[Bên dưới là gì](#under-the-hood)**
  * [Làm sao React liên kết được khi gọi Hook với component?](#how-does-react-associate-hook-calls-with-components)
  * [Hook được lấy ý tưởng từ người tiền nhiệm nào?](#what-is-the-prior-art-for-hooks)

## Kế hoạch chuyển đổi {#adoption-strategy}

### Phiên bản nào của React đã bao gồm Hook? {#which-versions-of-react-include-hooks}

Kể từ phiên bản 16.8.0, React đã bổ sung một React Hook hoàn chỉnh để sử dụng cho:

* React DOM
* React Native
* React DOM Server
* React Test Renderer
* React Shallow Renderer

Lưu ý là **để sử dụng Hook, tất cả package React phải từ phiên bản 16.8.0 trở lên**. Hook sẽ không chạy nếu bạn quên update, ví dụ như React DOM.

[React Native phiên bản 0.59](https://facebook.github.io/react-native/blog/2019/03/12/releasing-react-native-059) trở lên hỗ trợ Hooks.

### Tôi có cần viết lại toàn bộ class component? {#do-i-need-to-rewrite-all-my-class-components}

Không. [Không hề có kế hoạch](/docs/hooks-intro.html#gradual-adoption-strategy) để bỏ class khỏi React -- tất cả chúng ta điều cần đưa ra sản phẩm và không tốn công viết lại. Chúng tôi đề xuất sử dụng Hook khi viết code mới.

### Những gì tôi có thể làm với Hook mà không thể làm với class? {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

Hook cung cấp một cách làm mới, mạnh mẽ, trực quan hơn để tái sử dụng các chức năng giữa các component. ["Tự viết custom Hook"](/docs/hooks-custom.html) cung cấp một cái nhìn sơ lược những gì có thể làm được. [Trong bài viết](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889) bởi một thành viên chính trong team React sẽ nói sâu hơn những khả năng mới có được của Hook.

### Những kiến thức React trước đây của tôi có còn liên quan? {#how-much-of-my-react-knowledge-stays-relevant}

Hook là cách sử dụng trực tiếp hơn các tính năng của React mà bạn đã biết trước đây -- như state, lifecycle, context, và refs. Nó không thay đổi cách React làm việc, những kiến thức của bạn về component, prop, và top-down data flow vẫn không thay đổi.

Hook là kiến trúc mới có nhiều điều cần để học. Nếu tài liệu này thiếu những thông tin bạn cần, [hãy tạo 1 issue](https://github.com/reactjs/reactjs.org/issues/new) chúng tôi sẽ cố gắng giúp bạn.

### Tôi có nên sử dụng Hook, class, hay kết hợp cả hai? {#should-i-use-hooks-classes-or-a-mix-of-both}

Khi bạn đã sẵn sàng, chúng tôi khuyến khích bạn bắt đầu thử dùng Hook khi viết một component mới. Đảm bảo mọi người trong team đồng thuận sử dụng chúng và đã đọc qua tài liệu này. Chúng tôi không khuyến khích viết lại toàn bộ các class component trước đây sang dùng Hook, trừ khi bạn cũng đã có ý định viết lại chúng (ví dụ như để fix bug).

Bạn không thể sử dụng Hook *bên trong* một class component, nhưng tất nhiên bạn có thể kết hợp class và function component với Hook trong một cây (single tree). Bất kể là một component được tạo bởi class hay function đều sử dụng Hook được. Trong tương lai, chúng tôi kỳ vọng Hook sẽ là cách chính để mọi người viết React component.

### Hook có đã bao gồm tất cả trường hợp sử dụng của class? {#do-hooks-cover-all-use-cases-for-classes}

Mục tiêu của chúng tôi cho Hook là bao gồm tất cả trường hợp sử dụng của class sớm nhất có thế. Sẽ không có những Hook tương ứng với các phương thức lifecycle không phổ biến  `getSnapshotBeforeUpdate`, `getDerivedStateFromError` và `componentDidCatch`, nhưng chúng tôi sẽ sớm thêm chúng.

<<<<<<< HEAD
Trong giai đoạn đầu của Hook, có một vài thư viện third-party có thể sẽ không tương thích với Hook

### Hook có thay thế prop và higher-order component? {#do-hooks-replace-render-props-and-higher-order-components}
=======
### Do Hooks replace render props and higher-order components? {#do-hooks-replace-render-props-and-higher-order-components}
>>>>>>> 37cf98d075de3133b5ae69fe80fbecb6a742530a

Thông thường, render prop và higher-order component chỉ render 1 component con. Chúng tôi nghĩ theo hướng đơn giản hơn cho mục đích này. Vẫn có những chỗ để sử dụng cho 2 pattern này (ví dụ, 1 virtual scroller component có thể có một prop `renderItem`, hoặc 1 visual container component có thể chứa cấu trúc DOM riêng). Tuy nhiên đa số các trường hợp, Hook sẽ là cách hiệu quả có thể giúp giảm số lần lồng ghép component.

### Hook có ý nghĩa như thế nào với các API  phổ biến như Redux connect() và React Router? {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

Bạn có thể tiếp tục sử dụng  chính xác các API đã và đang sử dụng; nó sẽ làm việc bình thường.

React Redux từ phiên bản v7.1.0 [hỗ trợ Hooks API](https://react-redux.js.org/api/hooks) và expose hooks `useDispatch` hoặc `useSelector`.

React Router [đã hỗ trợ hooks] từ phiên bản v5.1 (https://reacttraining.com/react-router/web/api/Hooks).

Các thư viện khác cũng có thể hỗ trợ hook trong tương lai.

### Hook có làm việc với kiểu static không? {#do-hooks-work-with-static-typing}

Hook được thiết kế với kiểu static ngay từ đầu. Bởi vì chúng là function, sẽ dễ dàng kiểm soát kiểu hơn là các pattern như higher-order component. Flow và TypeScript cho React bản mới nhất đã hỗ trợ React Hook.

Quan trọng hơn cả, custom Hook cho bạn khả năng ràng buộc React API nếu bạn muốn, một cách khắc khe hơn. React cung cấp các kiểu chính, nhưng bạn có thể kết hợp chúng lại tùy ý, chúng tôi đã hỗ trợ sẵn.

### Làm sao để test component sử dụng Hook? {#how-to-test-components-that-use-hooks}

Từ cái nhìn của React, 1 component sử dụng Hook chỉ là 1 component bình thường, nếu cách bạn đang test không phụ thuộc vào các phần sâu bên trong của React, test các component có Hook sẽ không khác gì với test các component bình thường.

>Ghi chú
>
>[Công thức cho testing](/docs/testing-recipes.html) bao gồm nhiều ví dụ bạn có thể sao chép và sử dụng lại.

Như ví dụ bên dưới, chúng ta có component counter:

```js
function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

Chúng ta sẽ test nó sử dụng DOM. Để đảm bảo hoạt động đúng với những gì xảy ra trên trình duyệt, chúng ta bọc đoạn code render và cập nhập nó bên trong [`ReactTestUtils.act()`](/docs/test-utils.html#act):

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // Test first render and effect
  act(() => {
    ReactDOM.createRoot(container).render(<Counter />);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // Test lần render thứ 2 và effect
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

Gọi `act()` đồng thời sẽ flush các effect bên trong nó

Nếu cần test một custom Hook, bạn có thể làm bằng cách tạo một component trong test, và sử dụng Hook từ đó. Sau đó bạn có thể test component bạn viết

Để giảm tải cho boilerplate, chúng tôi khuyến khích dùng [Thưc viện cho React Testing](https://testing-library.com/react) thư viện này được thiết kế để khuyến khích việc viết những phần test dùng cho các component của bạn giống như là người dùng làm.

Xem thêm thông tin tại đây [Testing Recipes](/docs/testing-recipes.html).

### Thực sự thì các luật lệ mà lint đang bắt buộc là gì](https://www.npmjs.com/package/eslint-plugin-react-hooks)? {#what-exactly-do-the-lint-rules-enforce}

Chúng tôi cung câp [Plugin ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks) để ràng buộc [các nguyên tắc khi dùng Hook](/docs/hooks-rules.html) nhằm tránh bug. Giả định rằng tất cả các hàm bắt đầu bằng "`use`" và chữ cái ngay sau đó được viết hoa là một Hook. Chúng tôi biết cách xác định này không phải luôn luôn đúng, có vài trường hợp sẽ sai, nhưng nếu không có một sự thống nhất rộng rãi về cách đặt tên thì sẽ không có cách nào để  Hook làm việc trơn tru -- và nếu tên nếu quá dài sẽ khiến mọi người không muốn áp dụng Hook hoặc đi theo cách đặt tên đó.

Cụ thể là, luật này ràng buộc như sau:

* Gọi Hook bên trong một hàm `PascalCase` (như một component) hoặc hàm  `useSomething` (trường hợp là custom Hook).
* Hook được gọi theo đúng thứ tự trong các lần render.

Có một vài nguyên tắc khác, chúng có thể thay đổi theo thời gian, trong trường hợp sau khi chúng tôi tinh chỉnh để cân bằng giữa tìm bug với tránh các trường hợp sai.

## Từ Class sang Hook {#from-classes-to-hooks}

### Các phương thức lifecycle tương ứng với Hook như thế nào? {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor`: Function component không cần constructor. Bạn có thể khởi tạo state trong lúc gọi [`useState`](/docs/hooks-reference.html#usestate). Nếu tính toán giá trị khởi tạo quá tốn kém, bạn có thể truyền vào một hàm cho `useState`.

* `getDerivedStateFromProps`: lên lịch cho một cập nhập [trong lúc đang render](#how-do-i-implement-getderivedstatefromprops).

* `shouldComponentUpdate`: Xem `React.memo` [bên dưới](#how-do-i-implement-shouldcomponentupdate).

* `render`: nội dung chính của function component.

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: [`useEffect` Hook](/docs/hooks-reference.html#useeffect) được dùng để kết hợp cho cả ba trường hợp (bao gồm các tính huống [ít](#can-i-skip-an-effect-on-updates) [phổ biến](#can-i-run-an-effect-only-on-updates)).

* `getSnapshotBeforeUpdate`, `componentDidCatch` và `getDerivedStateFromError`: Hiện tại không có Hook nào tương ứng với các phương thức này, chúng tôi sẽ sớm thêm nó.

### Làm thế nào tôi có thể fetching data với Hook? {#how-can-i-do-data-fetching-with-hooks}

Đây là [một ví dụ nhỏ](https://codesandbox.io/s/jvvkoo8pq3)  để bạn bắt đầu. Để biết nhiều hơn, xem thêm [bài viết này](https://www.robinwieruch.de/react-hooks-fetch-data/) chỉ cách fetching data với Hook.

### Thực sự có một instance của biến không? {#is-there-something-like-instance-variables}

Có! Hook [`useRef()`](/docs/hooks-reference.html#useref) không chỉ dành cho DOM refs. Object "ref" là một container bao quát, trong đó property `current` là mutable và có thể giữa bất kỳ giá trị nào, tương tự như một instance property trong class.

Có  thể viết vào bên trong `useEffect`:

```js{2,8}
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // ...
}
```

Nếu chúng ta chỉ muốn set một interval, chúng ta không cần ref (`id` là một giá trị local của từng effect), nếu chúng ta muốn xóa một interval từ một event handle, nó sẽ hữu dụng:

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

Một cách trừu tượng, bạn có thể nghĩ ref tương tự như một biến instance của class. Trừ khi bạn đang [khởi tạo lazy](#how-to-create-expensive-objects-lazily), tránh đặt ref trong quá trình render -- nó có thể dẫn đến các tình huống ngoài ý muốn. Thay vào đó,  bạn muốn thay đổi ref bên trong event handle và effect.

### Tôi nên sử dụng 1 hay nhiều biến state? {#should-i-use-one-or-many-state-variables}

Nếu trước đây bạn dùng Class,  bạn có thể nghĩ tới việc gọi `useState()` một lần duy nhất và đặt một biến state vào trong 1 object. Bạn có thể làm vậy nếu thích. Ví dụ bên dưới là 1 component sẽ đi theo khi chuột di chuyển. Giữ giá trị `position` và `size` bên trong biến state

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

Giờ giả dụ bạn muốn viết một logic để thay đổi giá trị `left` và `top` khi user di chuột. Để ý cách chúng ta merge những field này vào các giá trị state trước đó một cách thủ công


```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // "...state" để đảm bảo không "mất" giá trị width và height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // Lưu ý: phần này viết đơn giản nhất có thể
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

Đó là bởi vì khi chúng ta cập nhập lại biến state, chúng ta *thay thế* giá trị của nó. Điều này khác với `this.setState` bên trong class, *merge* các field được update vào trong object.

Nếu bạn muốn dùng cách merge tự động, bạn có thể viết một custom hook `useLegacyState`. Tuy nhiên, thay vào đó **chúng tôi đề xuất bạn nên tách state ra thành nhiều biến khác nhau dựa trên các giá trị có khuynh hướng thay đổi cùng nhau**

Lấy ví dụ, bạn có thể tách state `position` và `size`, và luôn luôn thay thế `position` mà không phải merge:

```js{2,7}
function Box() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });
    }
    // ...
```

Tách các biến state ra độc lập với nhau còn có thêm ưu điểm, sau này dễ dàng tách những logic có liên quan với nhau ra thành một custom hook, ví dụ:

```js{2,7}
function Box() {
  const position = useWindowPosition();
  const [size, setSize] = useState({ width: 100, height: 100 });
  // ...
}

function useWindowPosition() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // ...
  }, []);
  return position;
}
```

Để ý cách chúng ta có thể di chuyển gọi `useState` để thay đổi `position` và effect liên quan vào trong một custom hook mà ko cần thay đổi code. Nếu tất cả state bên trong 1 object duy nhất, tách logic này ra sẽ khó khăn hơn.

Cả 2 lựa chọn: đưa tất cả state vào trong 1 câu gọi `useState`, và tách từng field với từng `useState` đều có thể làm việc bình thường. Các component sẽ dễ đọc hơn khi bạn cân đối giữa 2 cách này. Nếu logic của state trở nên phức tạp, chúng tôi đề xuất [quản lý nó bằng reducer](/docs/hooks-reference.html#usereducer) hoặc 1 custom hook

### Tôi có thể chạy effect chỉ khi update không?{#can-i-run-an-effect-only-on-updates}

Đây là trường hợp rất hiếm. Nếu bạn cần, có thể [sử dụng một mutable ref](#is-there-something-like-instance-variables) lưu lại giá trị (kiểu boolean) để kiểm tra có ở lần render đầu tiên hay không, rồi sau đó sử dụng cờ này bên trong effect (Nếu bạn thấy mình sử dụng việc này thường xuyên, có thể tạo một custom hook cho nó)


<<<<<<< HEAD
### Làm sao để lấy được prop và state trước đó?{#how-to-get-the-previous-props-or-state}

Hiện tại, bạn có thể làm một cách thủ công [với một ref](#is-there-something-like-instance-variables):
=======
There are two cases in which you might want to get previous props or state.
>>>>>>> 37cf98d075de3133b5ae69fe80fbecb6a742530a

Sometimes, you need previous props to **clean up an effect.** For example, you might have an effect that subscribes to a socket based on the `userId` prop. If the `userId` prop changes, you want to unsubscribe from the _previous_ `userId` and subscribe to the _next_ one. You don't need to do anything special for this to work:

```js
useEffect(() => {
  ChatAPI.subscribeToSocket(props.userId);
  return () => ChatAPI.unsubscribeFromSocket(props.userId);
}, [props.userId]);
```

<<<<<<< HEAD
Nó có hơi ngược ngạo nhưng bạn có thể tách nó ra vào 1 custom hook:
=======
In the above example, if `userId` changes from `3` to `4`, `ChatAPI.unsubscribeFromSocket(3)` will run first, and then `ChatAPI.subscribeToSocket(4)` will run. There is no need to get "previous" `userId` because the cleanup function will capture it in a closure.
>>>>>>> 37cf98d075de3133b5ae69fe80fbecb6a742530a

Other times, you might need to **adjust state based on a change in props or other state**. This is rarely needed and is usually a sign you have some duplicate or redundant state. However, in the rare case that you need this pattern, you can [store previous state or props in state and update them during rendering](#how-do-i-implement-getderivedstatefromprops).

<<<<<<< HEAD
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

Để ý cách nó làm việc với prop, state, và các giá trị tính toán khác

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count + 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

Trong tương lai, React sẽ cung cấp 1 hook `usePrevious` vì đây cũng là một trường hợp hay sử dụng.

=======
We have previously suggested a custom Hook called `usePrevious` to hold the previous value. However, we've found that most use cases fall into the two patterns described above. If your use case is different, you can [hold a value in a ref](#is-there-something-like-instance-variables) and manually update it when needed. Avoid reading and updating refs during rendering because this makes your component's behavior difficult to predict and understand.
>>>>>>> 37cf98d075de3133b5ae69fe80fbecb6a742530a

Xem thêm [pattern đề xuất cho derived state](#how-do-i-implement-getderivedstatefromprops).

### Tại sao tôi có thể thấy prop và state bên trong function?{#why-am-i-seeing-stale-props-or-state-inside-my-function}

Tất cả function bên trong một component, bao gồm event handle và effect, "thấy" prop và state từ render mà nó được tạo trong đó. Ví dụ, xem xét đoạn code như bên dưới:

```js
function Example() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
```

Nếu lần đầu click "Show alert" và sau đó tăng counter, alert sẽ hiển thị biến `count` **tại thời điểm bạn click "Show alert"**. Cái này sẽ ngăn ngừa bug gây ra bởi code *nghĩ* là giá trị prop và state không đổi

Nếu bạn muốn đọc giá trị *cuối cùng* của state từ một vài callback bất đồng bộ, bạn có thể giữ nó trong [một ref](/docs/hooks-faq.html#is-there-something-like-instance-variables), mutate nó và đọc từ nó ra.

Cuối cùng, một lý do khác bạn muốn xem prop hoặc state là bạn sử dụng "dependency array" tối ưu nhưng không chỉ rõ tất cả các dependency. Ví dụ, nếu một effect chỉ định `[]` nhưng bên trong lại đọc một giá trị prop nào đó, nó sẽ vẫn thấy giá trị khởi tạo của prop đó. Giáp pháp là bỏ dependency array. Đây là [cách bạn xử lý với function](#is-it-safe-to-omit-functions-from-the-list-of-dependencies), và đây là [một cách giải quyết phổ biến khác](#what-can-i-do-if-my-effect-dependencies-change-too-often) để giảm số lần chạy effect mà không bỏ qua dependency không hợp lệ.

>Lưu ý
>
>Chúng tôi cung cấp một [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) ESLint rule như là một phần của [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Nó sẽ cảnh báo khi dependency không được chỉ định đụng và gợi ý cách khắc phục.

### Tôi viết  getDerivedStateFromProps như thế nào? {#how-do-i-implement-getderivedstatefromprops}

Trong khi bạn có thể [không cần đến nó](/blog/2018/06/07/you-probably-dont-need-derived-state.html), trong trường hợp rất hiếm thấy, như viết một component `<Transition>` , bạn có thể cập nhập state ngay lúc render. React sẽ re-run component với state được cập nhập ngay lập tức sau khi kết thúc lần render đầu tiên, nên nó sẽ không tốn kém tài nguyên.

Chúng ta lưu lại giá trị prop `row` trước đó trong một biến state, để có thể so sánh:


```js
function ScrollView({row}) {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row đã thay đổi sau lần render cuối cùng. Cập nhập isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

Thoạt nhìn nó sẽ hơi lạ, tuy nhiên cập nhập lúc render chính là những gì `getDerivedStateFromProps` trước nay vẫn làm

### Có thể forceUpdate không? {#is-there-something-like-forceupdate}

Cả `useState` và `useReducer` Hook [thoát ra khỏi update](/docs/hooks-reference.html#bailing-out-of-a-state-update) nếu giá trị mới giống với giá trị trước đó. Mutate state trong đây và gọi `setState` sẽ không gây ra re-render

Thông thường, bạn không nên mutate state trong React. Tuy nhiên, như một lối thoát, bạn có thể sử dụng để tăng biến đếm để ép buộc re-render thậm chí khi state không thay đổi.

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

Tránh sử dụng pattern này nếu có thể.

### Tôi có thể dùng ref đến một function component không? {#can-i-make-a-ref-to-a-function-component}

Bởi vì bạn không thường xuyên cần đến, bạn có thể nghĩ đến một phương pháp trực tiếp hơn đến component cha với hook [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)

### Làm sao tôi có thể đo được 1 DOM node? {#how-can-i-measure-a-dom-node}

Có một cách để đo vị trí hoặc kích thước của DOM node là sử dụng một [callback rè](/docs/refs-and-the-dom.html#callback-refs). React sẽ gọi callback này bất cứ khi nào ref được đính vào một node khác. Đây là [một demo nhỏ](https://codesandbox.io/s/l7m0v5x4v9)

```js{4-8,12}
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
```

Chúng tôi đã không sử dụng `useRef` trong ví dụ  trên, bởi vì một ref object  sẽ không thông báo chúng ta *những thay đổi* của giá trị ref hiện tại. Sử dụng ref callback đảm bảo [thậm chí nếu một component con hiển thị node đã đo sau đó](https://codesandbox.io/s/818zzk8m78) (ví dụ để response lại click), chúng ta sẽ vẫn nhận được thông báo trong component cha và có thể cập nhập giá trị kích thước.

Để ý chúng ta truyền `[]` như một dependency array vào `useCallback`. Đảm bảo ref callback của chúng ta không thay đổi giữa những lần re-render, như vậy React sẽ không gọi nó không cần thiết.

In this example, the callback ref will be called only when the component mounts and unmounts, since the rendered `<h1>` component stays present throughout any rerenders. If you want to be notified any time a component resizes, you may want to use [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) or a third-party Hook built on it.
Trong ví dụ này, callback ref chỉ được gọi khi component mount và unmount,

Nếu bạn muốn, bạn có thể [tách  logic](https://codesandbox.io/s/m5o42082xy) vào một hook để sử dụng:

```js{2}
function MeasureExample() {
  const [rect, ref] = useClientRect();
  return (
    <>
      <h1 ref={ref}>Hello, world</h1>
      {rect !== null &&
        <h2>The above header is {Math.round(rect.height)}px tall</h2>
      }
    </>
  );
}

function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
}
```


### Viết const [thing, setThing] = useState() nghĩa là gì?? {#what-does-const-thing-setthing--usestate-mean}

Nếu bạn không quen với cú pháp này, xem [giải thích](/docs/hooks-state.html#tip-what-do-square-brackets-mean) trong tài liệu State Hook

## Tối ưu hiệu năng {#performance-optimizations}

### Tôi có thể bỏ qua một effect khi update không? {#can-i-skip-an-effect-on-updates}

Có. Xem [chạy một effect theo điều kiện](/docs/hooks-reference.html#conditionally-firing-an-effect). Để ý rằng quên handle update thường xuyên [sẽ dẫn tới bug](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update), đó là lý do tại sau nó không phải là cách hoạt động mặc định.


### Liệu có an toàn nếu omit function từ các dependency? {#is-it-safe-to-omit-functions-from-the-list-of-dependencies}

Một cách thẳng thắn, KHÔNG

```js{3,8}
function Example({ someProp }) {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 Không an toàn (hàm `doSomething` có sử dụng `someProp`)
}
```

Rất khó để nhở prop hoặc state nào đã sử dụng bởi các function bên ngoài effect. Đó là lý do tại sao **thường bạn sẽ không muốn khai báo function, bên trong effect bạn sử dụng function đó**. Dễ thấy các giá trị từ component scope mà effect phụ thuộc:

```js{4,8}
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]); // ✅ TỐT (effect của chúng ta dùng `someProp`)
}
```

Nếu sau đó chúng ta vẫn không sử dụng bất kỳ giá trị nào từ component scope, chỉ định `[]` là an toàn:


```js{7}
useEffect(() => {
  function doSomething() {
    console.log('hello');
  }

  doSomething();
}, []); // ✅ TỐT trong ví dụ này, bởi vì chúng ta không sử dụng *bất kỳ* giá trị nào trong component scope
```

Tuy theo tình huống, có một vài lựa chọn như bên dưới

>Lưu ý
>
>Chúng tôi cung cấp [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) ESLint rule như là một phần của [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Nó giúp bạn tìm các component không handle cập nhập đồng nhất.

Cùng xem tại sao nó quan trọng

Nếu bạn cung cấp một [danh sách phụ thuộc](/docs/hooks-reference.html#conditionally-firing-an-effect) như là tham số (argument) cuối cùng cho `useEffect`, `useMemo`, `useCallback`, hoặc `useImperativeHandle`, nó phải bao gồm tất cả các giá trị sử dụng bên trong hàm callback liên quan đến luồng dữ liệu của React, bao gồm prop, state và những giá trị có nguồn gốc từ chúng.

Chỉ **an toàn** khi omit một function từ danh sách phụ thuộc nếu không có gì bên trong (hoặc các hàm được gọi bởi nó) tham chiếu đến prop, state, các giá trị có nguồn gốc từ chúng. Ví dụ như bên dưới sẽ có có bug

```js{5,12}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  async function fetchProduct() {
    const response = await fetch('http://myapi/product' + productId); // Uses productId prop
    const json = await response.json();
    setProduct(json);
  }

  useEffect(() => {
    fetchProduct();
  }, []); // 🔴 Không hợp lệ vì `fetchProduct` sử dụng `productId`
  // ...
}
```

**Cách làm được đề xuất để sửa lỗi này là đưa function vào bên trong effect**. Để dễ dàng thấy được prop hoặc state nào có sử dụng trong effect, và đảm bảo chúng được khai báo.

```js{5-10,13}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Bằng cách chuyển hàm vào bên trong effect, chúng ta dễ dàng thay được các giá trị đang sử dụng.
    async function fetchProduct() {
      const response = await fetch('http://myapi/product' + productId);
      const json = await response.json();
      setProduct(json);
    }

    fetchProduct();
  }, [productId]); // ✅ Hợp lệ vì effect chỉ sử dụng productId
  // ...
}
```

Nó cho phép bạn xử lý các kết quả trả về không theo tuần tự với một biến cục bộ bên trong effect

```js{2,6,10}
  useEffect(() => {
    let ignore = false;
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      if (!ignore) setProduct(json);
    }

    fetchProduct();
    return () => { ignore = true };
  }, [productId]);
```
Chúng ta chuyển hàm vào trong effect để nó không cần nằm trong danh sách phụ thuộc

>Mẹo nhỏ
>
>Xem thêm [ví dụ nhỏ](https://codesandbox.io/s/jvvkoo8pq3)và [bài biết này](https://www.robinwieruch.de/react-hooks-fetch-data/) để học thêm cách fetching dữ liệu với hook.

**Nếu vì lý do nào đó bạn không thể chuyển hàm vào trong effect, còn một vài cách khác:**

* **Bạn có thể chuyển hàm ra khỏi component**. Trong trường hợp đó, hàm cần đảm bảo không sử dụng bất kỳ prop và state, và không cần nằm trong dependency
Trong trường hợp đó, hàm được đảm bảo  không tham chiếu đến bất kỳ prop hoặc state nào, và nó cũng không cần nằm trong danh sách phụ thuộc.

* Nếu hàm bạn gọi làm một hàm thuần tính toán và an toàn để gọi trong lúc render, bạn có thể **gọi nó bên ngoài của effect**, và để effect phụ thuộc vào giá trị trả về.
* Như là cách cuối cùng, bạn có thể **thêm một hàm vào danh sách phụ thuộc của effect nhưng wrap phần khai báo của nó ** bên trong [`useCallback`](/docs/hooks-reference.html#usecallback) Hook. Việc này đảm bảo nó không thay đổi trong tất cả các lần render trừ khi danh sách phụ thuộc của *chính nó* cũng thay đổi:

```js{2-5}
function ProductPage({ productId }) {
  // ✅ Wrap trong useCallback để tránh thay đổi trên tất cả các lần render
  const fetchProduct = useCallback(() => {
    // ... làm gì đó với productId ...
  }, [productId]); // ✅ Tất cả phụ thuộc của useCallback được chỉ định

  return <ProductDetails fetchProduct={fetchProduct} />;
}

function ProductDetails({ fetchProduct }) {
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // ✅ All useEffect dependencies are specified
  // ...
}
```
Lưu ý trong ví dụ trên, chúng ta **cần** đưa function vào trong danh sách phụ thuộc. Để đảm bảo những thay đổi trên prop `productId` của `ProductPage` tự động làm phát sinh re-fetch trong component `ProductDetails`

### Tôi phải làm gì nếu các giá trị phụ thuộc của effect thay đổi quá thường xuyên? {#what-can-i-do-if-my-effect-dependencies-change-too-often}

Đôi khi, effect có thể dùng state bị thay đổi rất thường xuyên. Bạn có thể đã đưa nó vào danh sách phụ thuộc, nhưng sẽ thường dẫn đến bug

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // effect phụ thuộc vào state `count`
    }, 1000);
    return () => clearInterval(id);
  }, []); // 🔴 Bug: `count` không được khai báo như một biến phụ thuộc

  return <h1>{count}</h1>;
}
```

Tập hợp rỗng của dependency, `[]`, có nghĩ là effect chỉ thực thi một lần khi component mount, nó không được thực thi mỗi lần re-render. Vấn đề ở đây là bên trong hàm callback của `setInterval`, giá trị của `count` không thay đổi, bởi vì chúng ta đã tạo ra một closure với giá trị của `count` được gán bằng `0` khi hàm callback của effect thực thi. Trong mỗi giây, hàm callback này sẽ gọi hàm `setCount(0 + 1)`, vì thế giá trị của count sẽ không bao giờ vượt quá 1.
Chỉ định `[count]` như một danh sách phụ thuộc có thể sửa bug này, nhưng nó sẽ gây ra reset interval trên mỗi lần thay đổi. Đó có thể là điều không mong muốn. Để sửa, bạn có thể sử dụng [hàm dùng để cập nhập `setState`](/docs/hooks-reference.html#functional-updates). Cho phép chúng ta chỉ định **cách** state cần thay đổi mà không cần tham khảo đến state hiện tại.

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ Không phụ thuộc vào biến `count` bên ngoài
    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ effect của chúng ta không sử dụng bất kỳ biến nào trong phạm vi component

  return <h1>{count}</h1>;
}
```

(Theo như định nghĩa hàm `setCount` được đảm bảo có thể sử dụng an toàn, nên an toàn để omit)

Bây giờ, hàm callback của `setInterval` thực thi một lần mỗi giây, nhưng mỗi lần như vậy bên trong hàm này sẽ gọi đến `setCount` có thể sử dụng giá trị mới nhất cho `count` (ở đây mình gọi nó là `c`.)
Trong các tình huống phức tạp hơn (ví dụ như 1 state phụ thuộc vào một state khác), hãy chuyển logic cập nhập state ra khỏi effect với [`useReducer` Hook](/docs/hooks-reference.html#usereducer). [Bài này](https://adamrackis.dev/state-and-use-reducer/) cung cấp 1 ví dụ để chúng ta làm điều đó. **Theo định nghĩa hàm `dispatch` từ `useReducer` luôn ổn định** - thậm chí là khi hàm reducer được định nghĩa bên trong component và đọc giá trị của prop.

Như là cách cuối cùng, nếu bạn muốn cái gì đó giống với `this` trong class, bạn có thể [sử dụng  ref](/docs/hooks-faq.html#is-there-something-like-instance-variables) để giữ 1 biến mutable. Sau đó bạn có thể đọc và ghi xuống nó. Lấy ví dụ:

```js{2-6,10-11,16}
function Example(props) {
  // Giữ giá trị prop trong 1 ref.
  let latestProps = useRef(props);
  useEffect(() => {
    latestProps.current = props;
  });

  useEffect(() => {
    function tick() {
      // Đọc giá trị prop cuối cùng ở bất kỳ thời điểm nào
      console.log(latestProps.current);
    }

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []); // This effect never re-runs
}
```

Chỉ làm như vậy nếu bạn không có lựa chọn nào tốt hơn, bởi nó phụ thuộc vào việc mutate, dẫn đến component khó đoán hơn. Nếu có một pattern không được chuyển đổi tốt, [gửi 1 issue](https://github.com/facebook/react/issues/new) với code ví dụ chạy được và chúng tôi sẽ cố giúp


### Viết `shouldComponentUpdate` như thế nào? {#how-do-i-implement-shouldcomponentupdate}
Bạn có thể wrap một function component với `React.memo` để 1 phép so sánh nông với prop của nó:

```js
const Button = React.memo((props) => {
  // component của bạn
});
```
Nó không phải là một Hook vì nó không được viết như Hook. `React.memo` tương tự như `PureComponent`, nhưng nó chỉ so sánh các prop. (Bạn có thể truyền vào một tham số thứ 2 để chỉ định một phép so sánh riêng với giá trị prop cũ và mới, nếu trả về `true`, việc update sẽ được bỏ qua)

`React.memo` sẽ không so sánh state bởi vì không có một state object để so sánh. Nhưng bạn cũng có thể cho một children pure, hoặc thậm chí tối ưu từng children với [`useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations)

### Làm sao để lưu trữ một tính toán? {#how-to-memoize-calculations}
Hook [`useMemo`](/docs/hooks-reference.html#usememo) cho phép bạn cache những tính toán tốn kém giữa các lần render bằng cách **ghi nhớ** lần tính toán trước:

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```
Code gọi `computeExpensiveValue(a, b)`. Nếu nếu các giá trị mà nó phụ thuộc `[a, b]` không thay đổi so với lần cuối, `useMemo` sẽ bỏ qua việc gọi lần thứ 2 và đơn giản dùng lại giá trị trả về với giá trị trước đó.

Nhớ rằng, hàm truyền cho `useMemo` chạy trong lúc đang render. Đừng làm những việc mà mà không làm trong lúc đang render. Ví dụ, side effect thuộc `useEffect`, không phải `useMemo`

**Bạn có thể trông cậy vào `useMemo` để nâng cao hiệu năng, nhưng chúng tôi không đảm bảo nó hoàn hảo**. Trong tương lai, React có thể lựa chọn **quên** một vài giá trị đã nhớ trước đó và tính lại trong lần render kế tiếp, ví dụ để làm sạch bộ nhớ cho các component không còn nằm trên màn hình. Viết code để nó có thể vẫn làm việc nếu không có `useMemo` - và sau đó thể vào để nâng cao hiệu năng. (Trong những tính huống ít gặp, khi một giá trị **không bao giờ** được tính toán lại, bạn có thể một ref [khởi tạo thủ động](#how-to-create-expensive-objects-lazily))

`useMemo` cho phép bạn bỏ qua những lần re-render của child quá tốn kém:

```js
function Parent({ a, b }) {
  // Chỉ re-rendered nếu `a` thay đổi:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Chỉ re-rendered nếu `b` thay đổi:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```
Lưu ý rằng cách này không làm việc trong vòng lặp vì Hook [không thể](/docs/hooks-rules.html) được đặt bên trong vòng lặp. Nhưng bạn có thể tách component cho một danh sách, và gọi `useMemo` ở đó.

### Làm thế nào để tạo object lớn một cách lazy? {#how-to-create-expensive-objects-lazily}

`useMemo` cho bạn [nhớ các tính toán quá phức tạp](#how-to-memoize-calculations) nếu giá trị phụ thuộc là như nhau. Tuy nhiên, nó chỉ dùng để **gợi ý**, không **đảm bảo** các tính toán này không được re-run. Nhưng đôi lúc bạn cần đảm bảo một object chỉ được tạo một lần.

**Tình huống thường thấy nhất là khi đang khởi tạo state có giá trị phức tạp**

```js
function Table(props) {
  // ⚠️ createRows() được gọi ở tất cả các lần render
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```
Để tránh tạo lại giá trị khởi tạo của state, chúng ta có thể truyền vào một **hàm** cho `useState`:

```js
function Table(props) {
  // ✅ createRows() chỉ được gọi 1 lần
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React sẽ chỉ gọi hàm này trong lần render đầu tiên. Xem [`useState` API reference](/docs/hooks-reference.html#usestate).

**Đôi khi bạn cũng có thể muốn tránh re-create giá trị khởi tạo `useRef()`**. Ví dụ, có thể bạn muốn đảm bảo một vài instance class chỉ được tạo một lần:

```js
function Image(props) {
  // ⚠️ IntersectionObserver được tạo trong tất cả các lần render
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` **không cho phép** một hàm đặc biệt overload như `useState`. Thay vào đó, bạn có thể viết một hàm riêng để tạo và set nó thụ động:

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver được tạo thụ động 1 lần
  function getObserver() {
    if (ref.current === null) {
      ref.current = new IntersectionObserver(onIntersect);
    }
    return ref.current;
  }

  // Khi bạn cần, gọi getObserver()
  // ...
}
```

Việc này tránh tạo các object tốn kém đến khi bạn thật sự cần nó lần đầu tiên. Nếu bạn sử dụng Flow hoặc TypeScript, bạn có thể đưa  `getObserver()` một kiểu non-nullable cho tiện.


### Có phải Hook chậm bởi vì tạo function trong render? {#are-hooks-slow-because-of-creating-functions-in-render}

Không. Các trình duyệt ngày nay, hiệu năng giữa closure và class không khác biệt nhiều trừ các trường hợp quá hiếm.

Thêm vào đó, hãy nghĩ thiết kế của Hook hiệu quả hơn trong nhiều trường hợp:

* Hook tránh rất nhiều tính huống overhead mà class yêu cầu, như chi phí bỏ ra cho việc tạo instance class và binding các hàm xử lý sự kiện trong constructor.

* **Code sử dụng Hook không cần các cây component xếp lồng vào nhau** thường thấy phổ biến trong các component higher-order, render prop, và context. Với cây component nhỏ hơn, React ít việc phải xử lý hơn.

Theo truyền thống, về vấn đề hiệu năng xung quanh inline function trong React thường liên quan tới cách truyền callback mới trên mỗi lần render làm   việc cải thiện `shouldComponentUpdate` bên trong child component không hoạt động. Hook tiếp cận với vấn đề này theo 3 các.

* Hook [`useCallback`](/docs/hooks-reference.html#usecallback) Hook cho phép bạn dữ cùng 1 callback giữa các lần re-render để  `shouldComponentUpdate` hoạt động bình thường:

    ```js{2}
    // Không thay đổi trừ khi `a` hoặc `b` thay đổi
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* Hook [`useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations) giúp kiểm soát update children dễ dàng hơn. Giảm sự phụ thuộc vào pure component.

* Cuối cùng, Hook [`useReducer`](/docs/hooks-reference.html#usereducer) giảm số lượng callback truyền xuống, bên dưới sẽ có giải thích.

### Làm thế nào để tránh truyền callback xuống? {#how-to-avoid-passing-callbacks-down}

Chúng tôi thấy là hầu hết mọi người không thích thú việc truyền callback xuống tất cả level của cây component một cách thủ công. Mặc dù một cách rõ ràng, cảm giác như "hệ thống ống nước".

Trong các cây component lớn, lựa chọn khác mà chúng tôi đề xuất là truyền xuống một hàm `dispatch` từ [`useReducer`](/docs/hooks-reference.html#usereducer) thông qua context:

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Lưu ý: `dispatch` không thay đổi giữa các lần re-render
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

Bất kỳ child bên trong cây `TodosApp` có thể sử dụng hàm `dispatch` để truyền các action lên `TodosApp`:

```js{2,3}
function DeepChild(props) {
  // Nếu chúng ta muốn thực hiện 1 action, chúng ta có thể lấy dispatch từ context.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

Không chỉ tiện lợi dưới góc độ maintenance (không cần lần theo callback), mà còn tránh các vấn đề callback liên kết với nhau. Truyền `dispatch` xuống như vậy là một pattern được khuyến khích cho việc update các level sâu bên dưới.

Lưu ý bạn có thể chọn giữa truyền *state* của ứng dụng xuống như prop (rõ ràng hơn) hoặc như context (tiện lợi hơn khi cần update các level sâu bên dưới). Nếu bạn sử dụng truyền context xuống state, sử dụng 2 context type khác nhau -- `dispatch` context không bao giờ thay đổi, vì vậy component đọc nó không re-render trừ khi nó cùng cần state của ứng dụng.

### Làm thế nào để đọc một giá trị thay đổi thường xuyên  từ `useCallback`? {#how-to-read-an-often-changing-value-from-usecallback}

>Lưu ý
>
>Chúng tôi đề xuất [truyền `dispatch` xuống các context](#how-to-avoid-passing-callbacks-down) thay vì các callback độc lập qua prop. Cách tiếp cận bên dưới chỉ đề cập ở đây để đầy đủ và như là một cách hatch.
>
>Cũng lưu ý rằng pattern này có thể gây ra vấn đề trong [chế độ concurrent ](/blog/2018/03/27/update-on-async-rendering.html). Chúng tôi có kế hoạch cung cấp một cách làm khác hữu hiệu trong tương lai, nhưng giải pháp an toàn nhất hiện nay là luôn luôn vô hiệu hóa callback nếu một vài giá trị phụ thuộc vào thay đổi.

Trong vài trường hợp các biệt, bạn cần nhớ 1 callback với   [`useCallback`](/docs/hooks-reference.html#usecallback) nhưng việc nhớ này không làm việc tốt bởi vì hàm bên trong bị re-create quá nhiều lần. Nếu hàm bạn nhớ là một hàm xử lý sự kiện và không được sử dụng trong quá trình render, bạn có thể sử dụng [ref như một biến instance](#is-there-something-like-instance-variables), và lưu giá trị lần commit sau cùng một cách thủ công:

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useEffect(() => {
    textRef.current = text; // Viết xuống ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // Đọc từ ref
    alert(currentText);
  }, [textRef]); // Đừng recreate handleSubmit như [text]

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

Đây là pattern rất phức tạp nhưng nó cho thấy bạn có thể dùng hatch để tối ưu nếu bạn cần. Nó dễ chấp nhận hơn nếu bạn tách nó ra thành custom Hook:

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // Sẽ nhớ ngay cả khi `text` thay đổi:
  const handleSubmit = useEventCallback(() => {
    alert(text);
  }, [text]);

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}

function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

Trong cả 2 trường hợp, chúng tôi **không đề xuất pattern này** và chỉ hiển thị ở đây cho đầy đủ. Thay vào đó, nên [tránh truyền callback xuống quá sâu](#how-to-avoid-passing-callbacks-down).


## Bên dưới là gì {#under-the-hood}

### Làm sao React liên kết được khi gọi Hook với component? {#how-does-react-associate-hook-calls-with-components}

React sẽ  theo dõi component đang được render. Nhờ vào [Nguyên tắc trong Hook](/docs/hooks-rules.html), chúng ta biết rằng Hook chỉ có thể gọi từ các component React (hoặc custom Hook -- cũng chỉ được gọi trong các component React)

Có một danh sách ngầm của “các vùng ghi nhớ” liên kết với từng component. Nó chỉ là các object JavaScript nơi chúng ta có thể chứa dữ liệu. Khi chúng ta gọi 1 Hook như `useState()`, nó đọc giá trị vùng nhớ hiện tại (hoặc khởi tạo nó trong quá trình render đầu tiên), và sau đó chuyển con trỏ sang nơi kế tiếp. Đây là cách các `useState()` gọi để lấy các giá trị state cục bộ độc lập.

### Hook được lấy ý tưởng từ người tiền nhiệm nào? {#what-is-the-prior-art-for-hooks}

Hook tổng hợp ý tưởng từ nhiều nguồn khác nhau:

* Trãi nghiệm trước đây của chúng tôi với APIs functional trong repo [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State).
* Kinh nghiệm từ cộng đồng sử dụng React với render prop APIs, gồm [Ryan Florence](https://github.com/ryanflorence)'s [Reactions Component](https://github.com/reactions/component).
* [Dominic Gannaway](https://github.com/trueadm)'s [`adopt` keyword](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067) đề xuất một syntax đẹp hơn cho render props.
* State variables và state cells trong [DisplayScript](http://displayscript.org/introduction.html).
* [Reducer components](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html) trong ReasonReact.
* [Subscriptions](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html) trong Rx.
* [Algebraic effects](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting) trong Multicore OCaml.

[Sebastian Markbåge](https://github.com/sebmarkbage) nghĩ ra thiết kế đầu tiên cho Hook, sau đó được chỉnh sửa bởi [Andrew Clark](https://github.com/acdlite), [Sophie Alpert](https://github.com/sophiebits), [Dominic Gannaway](https://github.com/trueadm), và các thành viên khác trong React team.
