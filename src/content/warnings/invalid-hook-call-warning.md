---
title: Các quy tắc của Hook
---

Có thể bạn đang ở đây vì bạn gặp thông báo lỗi sau:

<ConsoleBlock level="error">

Hooks chỉ có thể được gọi bên trong phần thân của một component hàm.

</ConsoleBlock>

Có ba lý do phổ biến bạn có thể gặp phải lỗi này:

1. Bạn có thể đang **phá vỡ Các quy tắc của Hook**.
2. Bạn có thể có **các phiên bản không khớp** của React và React DOM.
3. Bạn có thể có **nhiều hơn một bản sao của React** trong cùng một ứng dụng.

Hãy xem xét từng trường hợp này.

## Phá vỡ các quy tắc của Hook {/*breaking-rules-of-hooks*/}

Các hàm có tên bắt đầu bằng `use` được gọi là [*Hook*](/reference/react) trong React.

**Không gọi Hook bên trong vòng lặp, điều kiện hoặc hàm lồng nhau.** Thay vào đó, luôn sử dụng Hook ở cấp cao nhất của hàm React, trước bất kỳ lệnh `return` sớm nào. Bạn chỉ có thể gọi Hook khi React đang render một component hàm:

* ✅ Gọi chúng ở cấp cao nhất trong phần thân của một [component hàm](/learn/your-first-component).
* ✅ Gọi chúng ở cấp cao nhất trong phần thân của một [Hook tùy chỉnh](/learn/reusing-logic-with-custom-hooks).

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

Không được hỗ trợ gọi Hook (các hàm bắt đầu bằng `use`) trong bất kỳ trường hợp nào khác, ví dụ:

* 🔴 Không gọi Hook bên trong điều kiện hoặc vòng lặp.
* 🔴 Không gọi Hook sau một câu lệnh `return` có điều kiện.
* 🔴 Không gọi Hook trong trình xử lý sự kiện.
* 🔴 Không gọi Hook trong component lớp.
* 🔴 Không gọi Hook bên trong các hàm được truyền cho `useMemo`, `useReducer` hoặc `useEffect`.

Nếu bạn phá vỡ các quy tắc này, bạn có thể thấy lỗi này.

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
  // 🔴 Sai: sau một return có điều kiện (để sửa, hãy di chuyển nó trước return!)
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
    // 🔴 Sai: bên trong một component lớp (để sửa, hãy viết một component hàm thay vì một lớp!)
    useEffect(() => {})
    // ...
  }
}
```

Bạn có thể sử dụng [`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) để bắt các lỗi này.

<Note>

[Hook tùy chỉnh](/learn/reusing-logic-with-custom-hooks) *có thể* gọi các Hook khác (đó là mục đích của chúng). Điều này hoạt động vì Hook tùy chỉnh cũng chỉ được gọi khi một component hàm đang render.

</Note>

## Các phiên bản không khớp của React và React DOM {/*mismatching-versions-of-react-and-react-dom*/}

Bạn có thể đang sử dụng một phiên bản của `react-dom` (< 16.8.0) hoặc `react-native` (< 0.59) chưa hỗ trợ Hook. Bạn có thể chạy `npm ls react-dom` hoặc `npm ls react-native` trong thư mục ứng dụng của bạn để kiểm tra phiên bản bạn đang sử dụng. Nếu bạn tìm thấy nhiều hơn một trong số chúng, điều này cũng có thể tạo ra vấn đề (thêm về điều đó bên dưới).

## React trùng lặp {/*duplicate-react*/}

Để Hook hoạt động, import `react` từ mã ứng dụng của bạn cần phân giải thành cùng một module với import `react` từ bên trong package `react-dom`.

Nếu các import `react` này phân giải thành hai đối tượng export khác nhau, bạn sẽ thấy cảnh báo này. Điều này có thể xảy ra nếu bạn **vô tình có hai bản sao** của package `react`.

Nếu bạn sử dụng Node để quản lý package, bạn có thể chạy kiểm tra này trong thư mục dự án của bạn:

<TerminalBlock>

npm ls react

</TerminalBlock>

Nếu bạn thấy nhiều hơn một React, bạn sẽ cần tìm ra lý do tại sao điều này xảy ra và sửa cây phụ thuộc của bạn. Ví dụ: có thể một thư viện bạn đang sử dụng chỉ định không chính xác `react` là một dependency (thay vì một peer dependency). Cho đến khi thư viện đó được sửa, [Yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) là một giải pháp thay thế khả thi.

Bạn cũng có thể thử gỡ lỗi vấn đề này bằng cách thêm một số log và khởi động lại máy chủ phát triển của bạn:

```js
// Thêm dòng này vào node_modules/react-dom/index.js
window.React1 = require('react');

// Thêm dòng này vào file component của bạn
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

Nếu nó in ra `false` thì bạn có thể có hai React và cần tìm ra lý do tại sao điều đó xảy ra. [Vấn đề này](https://github.com/facebook/react/issues/13991) bao gồm một số lý do phổ biến mà cộng đồng gặp phải.

Vấn đề này cũng có thể xảy ra khi bạn sử dụng `npm link` hoặc một lệnh tương đương. Trong trường hợp đó, trình đóng gói của bạn có thể "nhìn thấy" hai React — một trong thư mục ứng dụng và một trong thư mục thư viện của bạn. Giả sử `myapp` và `mylib` là các thư mục cùng cấp, một cách khắc phục có thể là chạy `npm link ../myapp/node_modules/react` từ `mylib`. Điều này sẽ làm cho thư viện sử dụng bản sao React của ứng dụng.

<Note>

Nói chung, React hỗ trợ sử dụng nhiều bản sao độc lập trên một trang (ví dụ: nếu một ứng dụng và một widget của bên thứ ba đều sử dụng nó). Nó chỉ bị hỏng nếu `require('react')` phân giải khác nhau giữa component và bản sao `react-dom` mà nó được render cùng.

</Note>

## Các nguyên nhân khác {/*other-causes*/}

Nếu không có cách nào trong số này hiệu quả, vui lòng bình luận trong [vấn đề này](https://github.com/facebook/react/issues/13991) và chúng tôi sẽ cố gắng trợ giúp. Hãy thử tạo một ví dụ tái hiện nhỏ — bạn có thể khám phá ra vấn đề khi bạn đang thực hiện nó.
