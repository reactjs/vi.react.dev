---
title: useSyncExternalStore
---

<Intro>

`useSyncExternalStore` là một React Hook cho phép bạn đăng ký vào một external store.

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

Gọi `useSyncExternalStore` ở cấp cao nhất của component của bạn để đọc một giá trị từ một cửa hàng dữ liệu bên ngoài.

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Nó trả về ảnh chụp(snapshot) của dữ liệu trong store. Bạn cần truyền hai hàm làm đối số:

1. Hàm `subscribe` nên đăng ký vào store và trả về một hàm có chức năng hủy đăng ký.
2. Hàm `getSnapshot` nên đọc một ảnh chụp(snapshot) dữ liệu từ cửa hàng.

[Xem thêm các ví dụ phía dưới.](#usage)

#### Các tham số(Parameters) {/*parameters*/}

<<<<<<< HEAD
* `subscribe`: Một hàm nhận một đối số `callback` duy nhất và đăng ký nó với store. Khi store thay đổi, nó nên gọi hàm `callback` được cung cấp. Điều này sẽ khiến cho component được render lại. Hàm `subscribe` nên trả về một hàm dùng để dọn dẹp đăng ký(subscription).
=======
* `subscribe`: A function that takes a single `callback` argument and subscribes it to the store. When the store changes, it should invoke the provided `callback`, which will cause React to re-call `getSnapshot` and (if needed) re-render the component. The `subscribe` function should return a function that cleans up the subscription.
>>>>>>> 9000e6e003854846c4ce5027703b5ce6f81aad80

* `getSnapshot`: Một hàm trả về ảnh chụp(snapshot) của dữ liệu trong store mà component cần. Trong khi store không thay đổi, các lời gọi lại tới `getSnapshot` phải trả về cùng một giá trị. Nếu store thay đổi và giá trị trả về khác nhau (được so sánh bởi [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), React sẽ render lại component.

* **tùy chọn** `getServerSnapshot`: Một hàm trả về ảnh chụp(snapshot) ban đầu của dữ liệu trong store. Nó chỉ được sử dụng trong quá trình render phía server và trong quá trình hydrate hóa nội dung được được render bởi server trên client. Ảnh chụp(snapshot) ở server phải giống nhau giữa client và server, và thường được tuần tự hóa và truyền từ server đến client. Nếu bạn bỏ qua đối số này, việc render component phía server sẽ báo lỗi.

#### Trả về {/*returns*/}

Ảnh chụp(snapshot) dữ liệu hiện tại của store mà bạn có thể sử dụng trong logic render của mình.

#### Cảnh báo {/*caveats*/}

* Ảnh chụp(snapshot) của store trả về bởi `getSnapshot` phải là bất biến(immutable). Nếu dữ liệu trong store cơ bản là mutable, trả về một snapshot mới không thể thay đổi(immutable) nếu dữ liệu đã thay đổi. Nếu không, trả về một bản chụp đã được lưu vào bộ nhớ cache.

* Nếu một hàm `subscribe` khác được truyền vào lúc re-render, React sẽ đăng ký lại với store hàm `subscribe` mới được truyền vào. Bạn có thể ngăn chặn điều này bằng cách khai báp hàm `subscribe` bên ngoài component.

* Nếu store bị thay đổi trong [non-blocking transition update](/reference/react/useTransition), React sẽ chuyển sang thực hiện cập nhật đó như một cập nhật chặn. Cụ thể, cho mỗi transition update, React sẽ gọi `getSnapshot` một lần nữa trước khi áp dụng các thay đổi vào DOM. Nếu nó trả về một giá trị khác so với khi nó được gọi ban đầu, React sẽ khởi động lại việc cập nhật từ đầu, lần này áp dụng nó như một cập nhật chặn, để đảm bảo rằng mọi thành phần trên màn hình đều phản ánh cùng một phiên bản của store.

* Không nên _suspend_ một render dựa trên giá trị của store được trả về bởi `useSyncExternalStore`. Lý do là các thay đổi với cửa hàng bên ngoài(external store) không được đánh dấu là [non-blocking transition updates](/reference/react/useTransition), vì vậy chúng sẽ kích hoạt [`Suspense` fallback](/reference/react/Suspense) gần nhất, thay thế nội dung đã được render trên màn hình bằng một loading spinner, điều này thường tạo ra một trả nghiệm người dùng không tốt.

  Ví dụ, những điều sau đây không được khuyến khích:

  ```js
  const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));

  function ShoppingApp() {
    const selectedProductId = useSyncExternalStore(...);

    // ❌ Gọi `use` với một Promise phụ thuộc vào `selectedProductId`
    const data = use(fetchItem(selectedProductId))

    // ❌ Render theo điều kiện một lazy component dựa vào `selectedProductId`
    return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;
  }
  ```

---

## Cách sử dụng {/*usage*/}

### Đăng ký vào một cửa hàng bên ngoài {/*subscribing-to-an-external-store*/}

Hầu hết các React component của bạn chỉ đọc dữ liệu từ  [props,](/learn/passing-props-to-a-component) [state,](/reference/react/useState) và [context.](/reference/react/useContext) Tuy nhiên, đôi khi một thành phần cần đọc một số dữ liệu từ một cửa hàng bên ngoài React mà thay đổi theo thời gian. Điều này bao gồm:

* Các thư viện quản lý trạng thái bên thứ ba lưu trữ tráng thái bên ngoài của React.
* Các API của trình duyệt(Browser APIs) cung cấp một giá trị có thể thay đổi và các sự kiện để đăng ký theo dõi sự thay đổi của nó.

Gọi `useSyncExternalStore` ở cấp độ cao nhất của component để đọc một giá trị từ một kho dữ liệu bên ngoài(external store).

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Nó trả về <CodeStep step={3}>snapshot</CodeStep> của dữ liệu trong store. Bạn cần truyền vào hai hàm làm đối số:

1. Hàm <CodeStep step={1}>`subscribe`</CodeStep> nên đăng ký(subscribe) với cửa hàng và trả về một hàm để hủy đăng ký(unsubscribes).
2. Hàm <CodeStep step={2}>`getSnapshot`</CodeStep> nên đọc một ảnh chụp nhanh(snapshot) của dữ liệu từ store.

React sẽ sử dụng các hàm này để giữ cho component của bạn được đăng ký với store và re-render nó khi có thay đổi.

Ví dụ, trong sandbox bên dưới, `todosStore` được triển khai như một external store chứa dữ liệu bên ngoài React. `TodosApp` component kết nối với external store bằng Hook `useSyncExternalStore`. 

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todoStore.js
// This is an example of a third-party store
// that you might need to integrate with React.

// If your app is fully built with React,
// we recommend using React state instead.

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

Khi có thể, chúng tôi khuyến nghị bạn sử dụng trạng thái được xây dựng sẵn trong React với [`useState`](/reference/react/useState) and [`useReducer`](/reference/react/useReducer) thay thế. API `useSyncExternalStore` chủ yếu hữu ích nếu bạn cần tích hợp với mã không phải React hiện có .

</Note>

---

### Đăng ký với một API trình duyệt {/*subscribing-to-a-browser-api*/}

Một lý do khác để bạn thêm `useSyncExternalStore` là khi bạn muốn đăng ký theo dõi một giá trị nào đó được trình duyệt cung cấp và thay đổi theo thời gian. Ví dụ, giả sử bạn muốn component của mình hiển thị liệu kết nối mạng có đang hoạt động không. Trình duyệt cung cấp thông tin này thông qua một thuộc tính có tên là [`navigator.onLine`.](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)

Giá trị này có thể thay đổi mà React biết, vì vật bạn nên đọc nó với  `useSyncExternalStore`.

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

Để triển khai hàm `getSnapshot`, đọc giá trị hiện tại từ API trình duyệt:

```js
function getSnapshot() {
  return navigator.onLine;
}
```

Tiếp theo, bạn cần triển khai hàm `subscribe`. Ví dụ, khi `navigator.onLine` thay đổi, trình duyệt sẽ kích hoạt các sự kiện [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) and [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) trên đối tượng `window`. Bạn cần đăng ký đối số `callback` vào các sự kiện tương ứng, và sau đó trả về một hàm để dọn dẹp các đăng ký:

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

Bây giờ React biết các đọc giá trị từ API `navigator.onLine` bên ngoài và cách đăng ký theo dõi dự thay đổi của nó. Ngắt kết nối thiết bị của bạn khỏi mạng và lưu ý răng component sẽ được render phải hồi lại:

<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Tách logic ra thành một custom Hook {/*extracting-the-logic-to-a-custom-hook*/}

Thông thường bạn sẽ không trực tiếp viết `useSyncExternalStore` trong các component của bạn. Thay vào đó, bạn sẽ gọi nó từ custom Hook của mình. Điều này sẽ cho phép bạn sử dụng cùng một external store từ các component khác nhau.

Ví dụ, custom `useOnlineStatus` Hook này theo dõi mạng có đang online hay không:

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

Giờ đây, các component có thể gọi `useOnlineStatus` mà không cần lặp lại các cài đặt cơ bản:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Thêm hỗ trợ cho việc render phía server {/*adding-support-for-server-rendering*/}

Nếu ứng dụng React của bạn sử dụng kỹ thuật [server rendering,](/reference/react-dom/server) các React components của bạn cũng sẽ được thực thi bên ngoài môi trường trình duyệt để tạo HTML ban đầu. Điều này tạo ra một vài thác thức khi kết nối với một external store:

- Nếu bạn đang kết nối với một API chỉ dùng cho trình duyệt, nó sẽ không hoạt động bởi ví nó không tồn tại trên server.
- Nếu bạn đang kết nối với một external store của bên thứ ba, bạn sẽ cần dữ liệu cảu nó phải khớp giữa server và client.

Để giải quyết những vấn đề này, truyền một hảm `getServerSnapshot` là một đối số thứ ba cho `useSyncExternalStore`:

```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Always show "Online" for server-generated HTML
}

function subscribe(callback) {
  // ...
}
```

Hàm `getServerSnapshot` tương tự như hàm `getSnapshot`, nhưng nó chỉ chạy trong hai tình huống:

- Nó chạy trên server khi tạo HTML.
- Nó chạy trên client trong quá trình [hydration](/reference/react-dom/client/hydrateRoot), tức là khi React nhận HTML từ server và làm cho nó trở nên tương tác.

Điều này cho phép bạn cung cấp giá trị snapshot ban đầu sẽ được sử dụng trước khi ứng dụng trở nên tương tác. Nếu không có giá trị bàn đầu có ý nghĩa cho việc render trên server, hãy bua đối số này để [force rendering on the client.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

<Note>

Hãy chắc chắn rằng `getServerSnapshot` trả về dữ liệu chính xác giống nhau trong lần render ban đầu phía client như nó đã trả về trên server. Ví dụ, nếu `getServerSnapshot` trả về một số nội dung của store được nạp trên server , bạn cần chuyển nội dung này sang máy khách. Một các để thực hiện điều này là phát ra một thẻ `<script>` trong quá trình render phía server đặt một biến toàn cục như `window.MY_STORE_DATA`, và đọc từ biến toàn cục này trên client trong `getServerSnapshot`. External store của bạn nên cung cấp hướng dẫn về cách thực hiện điều này.

</Note>

---

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi đang gặp lỗi: "The result of `getSnapshot` should be cached" {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

Lỗi này có nghĩa là hàm `getSnapshot` trả về một object mới mỗi lần nó được gọi, ví dụ:

```js {2-5}
function getSnapshot() {
  // 🔴 Không trả về các object luôn khác nhau mỗi lần từ getSnapshot
  return {
    todos: myStore.todos
  };
}
```

React sẽ re-render component nếu giá trị trả về của `getSnapshot` khác biệt với lần cuối. Đây là lý do vì sao, nếu bạn luôn trả về một giá trị khác nhau, bạn sẽ rơi vào vòng lặp vô hạn và nhận được lỗi này.

Your `getSnapshot` object should only return a different object if something has actually changed. If your store contains immutable data, you can return that data directly:

```js {2-3}
function getSnapshot() {
  // ✅ Bạn có thể trả về dữ liệu bất biến(immutable)
  return myStore.todos;
}
```

Nếu dữ liệu trong store của bạn là có thế thay đổi(mutable), hàm `getSnapshot` nên trả về một snapshot không thay đổi(immutable) của nó. Điều này có nghĩa là cần phải tạo các đối tượng mới, nhưng không nên làm điều này cho mỗi lần gọi. Thay vào đó, nó nên lưu lại bản snapshot cuối cùng được tính toán, và trả về cùng một snapshot như lần cuối nếu dữ liệu trong store không thay đổi. Cách bạn xác định dữ liệu có thể thay đổi đã có sự thay đổi hay không phụ thuộc vào cách thức hoạt động của store có thể thay đổi mà bạn đang sử dụng.

---

### Hàm `subscribe` của tôi được gọi sau mỗi lần re-render {/*my-subscribe-function-gets-called-after-every-re-render*/}

Hàm `subscribe` được định nghĩa *bên trong* một component nên nó khác nhau trên mỗi lần re-render:

```js {4-7}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // 🚩 Luôn luôn là hàm khác nhau, vì vậy React sẽ resubscribe trên mỗi lần re-render
  function subscribe() {
    // ...
  }

  // ...
}
```
  
React sẽ resubscribe với store của bạn nếu bạn truyền một hàm `subscribe` khác nhau giữa các lần re-renders. Nếu điều này gây ra vấn đề về hiệu suất và bạn muốn tránh việc resubscribing, hãy di chuyển hàm `subscribe` ra bên ngoài:

```js {6-9}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}

// ✅ Luôn luôn là một function, vì vậy React sẽ không cần resubscribe
function subscribe() {
  // ...
}
```

Hoặc có thể gói `subscribe` trong một [`useCallback`](/reference/react/useCallback) để chỉ resubscribe khi một tham số thay đổi:

```js {4-8}
function ChatIndicator({ userId }) {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // ✅ Cùng một function miễn là userId không thay đổi
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  // ...
}
```
