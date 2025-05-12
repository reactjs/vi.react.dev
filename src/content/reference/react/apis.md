---
title: "Các API React Tích Hợp"
---

<Intro>

Ngoài [Hooks](/reference/react) và [Components](/reference/react/components), gói `react` xuất ra một vài API khác hữu ích cho việc định nghĩa các component. Trang này liệt kê tất cả các API React hiện đại còn lại.

</Intro>

---

* [`createContext`](/reference/react/createContext) cho phép bạn định nghĩa và cung cấp context cho các component con. Được sử dụng với [`useContext`.](/reference/react/useContext)
* [`forwardRef`](/reference/react/forwardRef) cho phép component của bạn hiển thị một DOM node như một ref cho component cha. Được sử dụng với [`useRef`.](/reference/react/useRef)
* [`lazy`](/reference/react/lazy) cho phép bạn trì hoãn việc tải code của một component cho đến khi nó được render lần đầu tiên.
* [`memo`](/reference/react/memo) cho phép component của bạn bỏ qua việc re-render khi props không thay đổi. Được sử dụng với [`useMemo`](/reference/react/useMemo) và [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) cho phép bạn đánh dấu một cập nhật trạng thái là không khẩn cấp. Tương tự như [`useTransition`.](/reference/react/useTransition)
* [`act`](/reference/react/act) cho phép bạn bao bọc các lần render và tương tác trong các bài kiểm tra để đảm bảo các cập nhật đã được xử lý trước khi đưa ra các khẳng định.

---

## Resource APIs {/*resource-apis*/}

*Resources* có thể được truy cập bởi một component mà không cần chúng là một phần của state của component đó. Ví dụ: một component có thể đọc một tin nhắn từ một Promise hoặc đọc thông tin kiểu dáng từ một context.

Để đọc một giá trị từ một resource, hãy sử dụng API này:

* [`use`](/reference/react/use) cho phép bạn đọc giá trị của một resource như một [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) hoặc [context](/learn/passing-data-deeply-with-context).
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```
