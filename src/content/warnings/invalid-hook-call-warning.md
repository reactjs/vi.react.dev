---
title: Rules of Hooks
---

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
 Bạn có thể ở đây bởi vì bạn gặp những thông báo lỗi dưới đây:

 > Hooks chỉ có thể được gọi bên trong code của một function component.
=======
You are probably here because you got the following error message:

<ConsoleBlock level="error">

Hooks can only be called inside the body of a function component.

</ConsoleBlock>
>>>>>>> cdc9917863111daeddf9c3552f9adf49c245e425:src/content/warnings/invalid-hook-call-warning.md

Có ba nguyên nhân phổ biến bạn có thể thấy:
1. Có thể bạn đang dùng **phiên bản không trùng khớp** của React và React DOM.
2. Bạn có thể đang **vi phạm [Rules of Hooks](/docs/hooks-rules.html)**.
3. Bạn có thể đang có **một hoặc nhiều hơn bản React** trong cùng một ứng dụng.

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
Hãy nhìn vào từng trường hợp ở dưới đây.
=======
1. You might be **breaking the Rules of Hooks**.
2. You might have **mismatching versions** of React and React DOM.
3. You might have **more than one copy of React** in the same app.
>>>>>>> cdc9917863111daeddf9c3552f9adf49c245e425:src/content/warnings/invalid-hook-call-warning.md

## Phiên bản không trùng khớp của React và React DOM {#mismatching-versions-of-react-and-react-dom}

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
Bạn có thể đang sử dụng phiên bản `react-dom` (< 16.8.0) hoặc `react-native` (< 0.59) những phiên bản này chưa hỗ trợ Hooks. Bạn có thể chạy `npm ls react-dom` hoặc `npm ls react-native` trong thư mục ứng dụng của bạn để kiểm tra bạn đang sử dụng phiên bản nào. Nếu bạn thấy nhiều hơn một phiên bản, điều này sẽ gây ra những vấn đề (liệt kê bên dưới).

## Vi phạm những quy tắc của Hooks {#breaking-the-rules-of-hooks}

Bạn chỉ có thể gọi Hooks **trong khi React render một function component**:

* ✅ Gọi nó ở đầu, bên trong  một function component.
* ✅ Gọi nó ở đầu, bên trong một [custom Hook](/docs/hooks-custom.html).

**Tìm hiệu thêm về điều này ở [Rules of Hooks](/docs/hooks-rules.html).**
=======
## Breaking Rules of Hooks {/*breaking-rules-of-hooks*/}

Functions whose names start with `use` are called [*Hooks*](/reference/react) in React.

**Don’t call Hooks inside loops, conditions, or nested functions.** Instead, always use Hooks at the top level of your React function, before any early returns. You can only call Hooks while React is rendering a function component:

* ✅ Call them at the top level in the body of a [function component](/learn/your-first-component).
* ✅ Call them at the top level in the body of a [custom Hook](/learn/reusing-logic-with-custom-hooks).
>>>>>>> cdc9917863111daeddf9c3552f9adf49c245e425:src/content/warnings/invalid-hook-call-warning.md

```js{2-3,8-9}
function Counter() {
  // ✅ Good: top-level in a function component
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Good: top-level in a custom Hook
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
Để tránh nhầm lẫn , Nó **không** được hỗ trợ để gọi Hooks trong những trường hợp:

* 🔴 Đừng gọi Hooks trong class components.
* 🔴 Đừng gọi Hooks trong event handlers.
* 🔴 Đừng gọi Hooks bên trong các function được dùng trong `useMemo`, `useReducer`, hoặc `useEffect`.
=======
It’s **not** supported to call Hooks (functions starting with `use`) in any other cases, for example:

* 🔴 Do not call Hooks inside conditions or loops.
* 🔴 Do not call Hooks after a conditional `return` statement.
* 🔴 Do not call Hooks in event handlers.
* 🔴 Do not call Hooks in class components.
* 🔴 Do not call Hooks inside functions passed to `useMemo`, `useReducer`, or `useEffect`.
>>>>>>> cdc9917863111daeddf9c3552f9adf49c245e425:src/content/warnings/invalid-hook-call-warning.md

Nếu bạn vi phạm những quy tắc trên, bạn có thể thấy lỗi này.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Bad: inside a condition (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Bad: inside a loop (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Bad: after a conditional return (to fix, move it before the return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Bad: inside an event handler (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Bad: inside useMemo (to fix, move it outside!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Bad: inside a class component (to fix, write a function component instead of a class!)
    useEffect(() => {})
    // ...
  }
}
```

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
Bạn có thể sử dụng [`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) để bắt những lỗi này.

>Ghi chú
>
>[Custom Hooks](/docs/hooks-custom.html) *có thể* gọi những Hooks khác (hoàn toàn do mục đích của nó). Điều này hoàn toàn hữu hiệu bởi vì custom Hooks được hỗ trợ chỉ để được gọi khi một function component đang render.
=======
You can use the [`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) to catch these mistakes.

<Note>
>>>>>>> cdc9917863111daeddf9c3552f9adf49c245e425:src/content/warnings/invalid-hook-call-warning.md

[Custom Hooks](/learn/reusing-logic-with-custom-hooks) *may* call other Hooks (that's their whole purpose). This works because custom Hooks are also supposed to only be called while a function component is rendering.

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
## Trùng lặp React {#duplicate-react}
=======
</Note>

## Mismatching Versions of React and React DOM {/*mismatching-versions-of-react-and-react-dom*/}

You might be using a version of `react-dom` (< 16.8.0) or `react-native` (< 0.59) that doesn't yet support Hooks. You can run `npm ls react-dom` or `npm ls react-native` in your application folder to check which version you're using. If you find more than one of them, this might also create problems (more on that below).

## Duplicate React {/*duplicate-react*/}
>>>>>>> cdc9917863111daeddf9c3552f9adf49c245e425:src/content/warnings/invalid-hook-call-warning.md

Để Hooks hoạt động,  `react` được import từ mã ứng dụng cần được giải quyết giống như `react` được import từ package `react-dom`.

Nếu những `react` được nhập này giải quyết hai đối tượng xuất (export) khác nhau, bạn sẽ thấy cảnh báo. Điều có thể xảy ra nếu bạn **đột ngột kết thúc với hai phiên bản** của package `react`.

Nếu bạn sử dụng Node để quản lý package, bạn có thể kiểm tra nó bằng cách chạy câu lệnh này trong thư mục dự án của bạn:

<TerminalBlock>

npm ls react

</TerminalBlock>

Nếu bạn thấy nhiều hơn một React, bạn sẽ cần tìm hiểu tại sao nó lại xảy ra và sửa cây phụ thuộc(dependency tree). Ví dụ, có lẽ một thư viện bạn đang sử dụng mô tả sai `react` như là một dependency (hơn là một peer dependency). Cho đến khi thư viện đó được sửa, [Yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) có thể là một cách giải quyết .

Bạn có thể tìm lỗi gây ra vấn đề này bằng cách thêm vào những logs và khởi động lại máy chủ phát triển(development server):

```js
// Thêm cái này vào node_modules/react-dom/index.js
window.React1 = require('react');

// Thêm cái này vào component file
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

Nếu nó in ra `false` thì bạn có có hai  Reacts và cần tìm hiểu tại sao nó lại xảy ra. [This issue](https://github.com/facebook/react/issues/13991) bao gồm những nguyên nhân phổ biến được đưa ra bởi cộng đồng.

Vấn đề có thể xảy ra khi sử dụng `npm link` hoặc một cách tương đương nào đó. Trong trường hợp này, bundler của bạn có thể "thấy" hai Reacts — một trong thư mục ứng dụng và một trong thư mục thư viện. Giả sử `myapp` và `mylib` thư mục anh em (sibling folders), một cách có thể sửa là chạy  `npm link ../myapp/node_modules/react` từ `mylib`. Diều này sẽ làm cho thư viện sử dụng bản React của ứng dụng.

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
>Ghi chú
>
>Nhìn chung, React hỗ trợ sử dụng nhiều phiên bản độc lập trong một trang (ví dụ, nếu một ứng dụng và một ứng dụng nhỏ từ bên thứ ba cùng sử dụng nó). Nó chỉ không chạy khi `require('react')` giải quyết một cách khác nhau giữa component và`react-dom` phiên bản mà nó được xuất cùng với.

## Những nguyên nhân khác {#other-causes}
=======
<Note>

In general, React supports using multiple independent copies on one page (for example, if an app and a third-party widget both use it). It only breaks if `require('react')` resolves differently between the component and the `react-dom` copy it was rendered with.

</Note>

## Other Causes {/*other-causes*/}
>>>>>>> cdc9917863111daeddf9c3552f9adf49c245e425:src/content/warnings/invalid-hook-call-warning.md

Nếu khó cách nào giải quyết được, Vui lòng bình luận trong [this issue](https://github.com/facebook/react/issues/13991)và chúng tôi sẽ cố gắng hỗ trợ. Hãy cố gắng tạo một ví dụ tương tự — bạn có thể tìm ra được vấn đề mà bạn mắc phải .
