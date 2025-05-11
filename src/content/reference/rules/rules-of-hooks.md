---
title: Các quy tắc của Hook
---

<Intro>
Hook được định nghĩa bằng các hàm JavaScript, nhưng chúng đại diện cho một loại logic UI có thể tái sử dụng đặc biệt với các hạn chế về nơi chúng có thể được gọi.
</Intro>

<InlineToc />

---

## Chỉ gọi Hook ở cấp cao nhất {/*only-call-hooks-at-the-top-level*/}

Các hàm có tên bắt đầu bằng `use` được gọi là [*Hook*](/reference/react) trong React.

**Không gọi Hook bên trong vòng lặp, điều kiện, hàm lồng nhau hoặc khối `try`/`catch`/`finally`.** Thay vào đó, luôn sử dụng Hook ở cấp cao nhất của hàm React, trước bất kỳ lệnh trả về sớm nào. Bạn chỉ có thể gọi Hook khi React đang hiển thị một component hàm:

* ✅ Gọi chúng ở cấp cao nhất trong phần thân của [component hàm](/learn/your-first-component).
* ✅ Gọi chúng ở cấp cao nhất trong phần thân của [Hook tùy chỉnh](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ Tốt: cấp cao nhất trong một component hàm
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Tốt: cấp cao nhất trong một Hook tùy chỉnh
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

Không được hỗ trợ việc gọi Hook (các hàm bắt đầu bằng `use`) trong bất kỳ trường hợp nào khác, ví dụ:

* 🔴 Không gọi Hook bên trong điều kiện hoặc vòng lặp.
* 🔴 Không gọi Hook sau câu lệnh `return` có điều kiện.
* 🔴 Không gọi Hook trong trình xử lý sự kiện.
* 🔴 Không gọi Hook trong component class.
* 🔴 Không gọi Hook bên trong các hàm được truyền cho `useMemo`, `useReducer` hoặc `useEffect`.
* 🔴 Không gọi Hook bên trong khối `try`/`catch`/`finally`.

Nếu bạn vi phạm các quy tắc này, bạn có thể thấy lỗi này.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Sai: bên trong một điều kiện (để sửa, hãy di chuyển nó ra ngoài!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Sai: bên trong một vòng lặp (để sửa, hãy di chuyển nó ra ngoài!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Sai: sau một lệnh return có điều kiện (để sửa, hãy di chuyển nó trước lệnh return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Sai: bên trong một trình xử lý sự kiện (để sửa, hãy di chuyển nó ra ngoài!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Sai: bên trong useMemo (để sửa, hãy di chuyển nó ra ngoài!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Sai: bên trong một component class (để sửa, hãy viết một component hàm thay vì một class!)
    useEffect(() => {})
    // ...
  }
}

function Bad() {
  try {
    // 🔴 Sai: bên trong khối try/catch/finally (để sửa, hãy di chuyển nó ra ngoài!)
    const [x, setX] = useState(0);
  } catch {
    const [x, setX] = useState(1);
  }
}
```

Bạn có thể sử dụng [`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) để bắt các lỗi này.

<Note>

[Hook tùy chỉnh](/learn/reusing-logic-with-custom-hooks) *có thể* gọi các Hook khác (đó là toàn bộ mục đích của chúng). Điều này hoạt động vì Hook tùy chỉnh cũng chỉ được gọi khi một component hàm đang hiển thị.

</Note>

---

## Chỉ gọi Hook từ các hàm React {/*only-call-hooks-from-react-functions*/}

Không gọi Hook từ các hàm JavaScript thông thường. Thay vào đó, bạn có thể:

✅ Gọi Hook từ các component hàm React.
✅ Gọi Hook từ [Hook tùy chỉnh](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component).

Bằng cách tuân theo quy tắc này, bạn đảm bảo rằng tất cả logic có trạng thái trong một component đều hiển thị rõ ràng từ mã nguồn của nó.

```js {2,5}
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() { // ❌ Không phải là một component hoặc Hook tùy chỉnh!
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
```
