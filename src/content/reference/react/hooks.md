---
title: "Các React Hook tích hợp sẵn"
---

<Intro>

*Hook* cho phép bạn sử dụng các tính năng khác nhau của React từ các component của bạn. Bạn có thể sử dụng các Hook tích hợp sẵn hoặc kết hợp chúng để xây dựng Hook của riêng bạn. Trang này liệt kê tất cả các Hook tích hợp sẵn trong React.

</Intro>

---

## State Hooks {/*state-hooks*/}

*State* cho phép một component ["ghi nhớ" thông tin như đầu vào của người dùng.](/learn/state-a-components-memory) Ví dụ: một component form có thể sử dụng state để lưu trữ giá trị đầu vào, trong khi một component thư viện ảnh có thể sử dụng state để lưu trữ chỉ mục ảnh đã chọn.

Để thêm state vào một component, hãy sử dụng một trong các Hook sau:

* [`useState`](/reference/react/useState) khai báo một biến state mà bạn có thể cập nhật trực tiếp.
* [`useReducer`](/reference/react/useReducer) khai báo một biến state với logic cập nhật bên trong một [hàm reducer.](/learn/extracting-state-logic-into-a-reducer)

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Context Hooks {/*context-hooks*/}

*Context* cho phép một component [nhận thông tin từ các component cha ở xa mà không cần truyền nó dưới dạng props.](/learn/passing-props-to-a-component) Ví dụ: component cấp cao nhất của ứng dụng của bạn có thể truyền theme UI hiện tại cho tất cả các component bên dưới, bất kể độ sâu.

* [`useContext`](/reference/react/useContext) đọc và đăng ký một context.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Ref Hooks {/*ref-hooks*/}

*Refs* cho phép một component [giữ một số thông tin không được sử dụng để hiển thị,](/learn/referencing-values-with-refs) như một DOM node hoặc một ID timeout. Không giống như state, việc cập nhật một ref không làm component của bạn render lại. Refs là một "cửa thoát hiểm" khỏi mô hình React. Chúng hữu ích khi bạn cần làm việc với các hệ thống không phải React, chẳng hạn như các API trình duyệt tích hợp sẵn.

* [`useRef`](/reference/react/useRef) khai báo một ref. Bạn có thể giữ bất kỳ giá trị nào trong đó, nhưng thường được sử dụng để giữ một DOM node.
* [`useImperativeHandle`](/reference/react/useImperativeHandle) cho phép bạn tùy chỉnh ref được hiển thị bởi component của bạn. Điều này hiếm khi được sử dụng.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Effect Hooks {/*effect-hooks*/}

*Effects* cho phép một component [kết nối và đồng bộ hóa với các hệ thống bên ngoài.](/learn/synchronizing-with-effects) Điều này bao gồm việc xử lý mạng, DOM của trình duyệt, hoạt ảnh, các widget được viết bằng một thư viện UI khác và các code không phải React khác.

* [`useEffect`](/reference/react/useEffect) kết nối một component với một hệ thống bên ngoài.

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

Effects là một "cửa thoát hiểm" khỏi mô hình React. Không sử dụng Effects để điều phối luồng dữ liệu của ứng dụng của bạn. Nếu bạn không tương tác với một hệ thống bên ngoài, [bạn có thể không cần Effect.](/learn/you-might-not-need-an-effect)

Có hai biến thể hiếm khi được sử dụng của `useEffect` với sự khác biệt về thời gian:

* [`useLayoutEffect`](/reference/react/useLayoutEffect) kích hoạt trước khi trình duyệt vẽ lại màn hình. Bạn có thể đo layout ở đây.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) kích hoạt trước khi React thực hiện các thay đổi đối với DOM. Các thư viện có thể chèn CSS động ở đây.

---

## Performance Hooks {/*performance-hooks*/}

Một cách phổ biến để tối ưu hóa hiệu suất render lại là bỏ qua các công việc không cần thiết. Ví dụ: bạn có thể yêu cầu React sử dụng lại một phép tính đã được lưu trong bộ nhớ cache hoặc bỏ qua việc render lại nếu dữ liệu không thay đổi kể từ lần render trước.

Để bỏ qua các phép tính và render lại không cần thiết, hãy sử dụng một trong các Hook sau:

- [`useMemo`](/reference/react/useMemo) cho phép bạn lưu vào bộ nhớ cache kết quả của một phép tính tốn kém.
- [`useCallback`](/reference/react/useCallback) cho phép bạn lưu vào bộ nhớ cache một định nghĩa hàm trước khi truyền nó xuống một component đã được tối ưu hóa.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Đôi khi, bạn không thể bỏ qua việc render lại vì màn hình thực sự cần được cập nhật. Trong trường hợp đó, bạn có thể cải thiện hiệu suất bằng cách tách các cập nhật chặn phải đồng bộ (như nhập vào một input) khỏi các cập nhật không chặn không cần chặn giao diện người dùng (như cập nhật biểu đồ).

Để ưu tiên render, hãy sử dụng một trong các Hook sau:

- [`useTransition`](/reference/react/useTransition) cho phép bạn đánh dấu một chuyển đổi state là không chặn và cho phép các cập nhật khác làm gián đoạn nó.
- [`useDeferredValue`](/reference/react/useDeferredValue) cho phép bạn trì hoãn việc cập nhật một phần không quan trọng của UI và cho phép các phần khác cập nhật trước.

---

## Other Hooks {/*other-hooks*/}

Các Hook này chủ yếu hữu ích cho các tác giả thư viện và không được sử dụng phổ biến trong code ứng dụng.

- [`useDebugValue`](/reference/react/useDebugValue) cho phép bạn tùy chỉnh nhãn mà React DevTools hiển thị cho Hook tùy chỉnh của bạn.
- [`useId`](/reference/react/useId) cho phép một component liên kết một ID duy nhất với chính nó. Thường được sử dụng với các API hỗ trợ tiếp cận.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) cho phép một component đăng ký một kho bên ngoài.
* [`useActionState`](/reference/react/useActionState) cho phép bạn quản lý trạng thái của các hành động.

---

## Your own Hooks {/*your-own-hooks*/}

Bạn cũng có thể [xác định các Hook tùy chỉnh của riêng bạn](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) dưới dạng các hàm JavaScript.
