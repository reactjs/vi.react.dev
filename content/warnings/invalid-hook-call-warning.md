---
title: Invalid Hook Call Warning
layout: single
permalink: warnings/invalid-hook-call-warning.html
---

 Bạn có thể ở đây bởi vì bạn gặp những thông báo lỗi dưới đây:

 > Hooks chỉ có thể được gọi bên trong code của một function component.

Có ba nguyên nhân phổ biến bạn có thể thấy:
1. Có thể bạn đang dùng **phiên bản không trùng khớp** của React và React DOM.
2. Bạn có thể đang **vi phạm [Rules of Hooks](/docs/hooks-rules.html)**.
3. Bạn có thể đang có **một hoặc nhiều hơn bản React** trong cùng một ứng dụng.

Hãy nhìn vào từng trường hợp ở dưới đây.

## Phiên bản không trùng khớp của React và React DOM {#mismatching-versions-of-react-and-react-dom}

Bạn có thể đang sử dụng phiên bản `react-dom` (< 16.8.0) hoặc `react-native` (< 0.59) những phiên bản này chưa hỗ trợ Hooks. Bạn có thể chạy `npm ls react-dom` hoặc `npm ls react-native` trong thư mục ứng dụng của bạn để kiểm tra bạn đang sử dụng phiên bản nào. Nếu bạn thấy nhiều hơn một phiên bản, điều này sẽ gây ra những vấn đề (liệt kê bên dưới).

## Vi phạm những quy tắc của Hooks {#breaking-the-rules-of-hooks}

Bạn chỉ có thể gọi Hooks **trong khi React render một function component**:

* ✅ Gọi nó ở đầu, bên trong  một function component.
* ✅ Gọi nó ở đầu, bên trong một [custom Hook](/docs/hooks-custom.html).

**Tìm hiệu thêm về điều này ở [Rules of Hooks](/docs/hooks-rules.html).**

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

Để tránh nhầm lẫn , Nó **không** được hỗ trợ để gọi Hooks trong những trường hợp:

* 🔴 Đừng gọi Hooks trong class components.
* 🔴 Đừng gọi Hooks trong event handlers.
* 🔴 Đừng gọi Hooks bên trong các function được dùng trong `useMemo`, `useReducer`, hoặc `useEffect`.

Nếu bạn vi phạm những quy tắc trên, bạn có thể thấy lỗi này.

```js{3-4,11-12,20-21}
function Bad1() {
  function handleClick() {
    // 🔴 Bad: inside an event handler (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad2() {
  const style = useMemo(() => {
    // 🔴 Bad: inside useMemo (to fix, move it outside!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad3 extends React.Component {
  render() {
    // 🔴 Bad: inside a class component
    useEffect(() => {})
    // ...
  }
}
```

Bạn có thể sử dụng [`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) để bắt những lỗi này.

>Ghi chú
>
>[Custom Hooks](/docs/hooks-custom.html) *có thể* gọi những Hooks khác (hoàn toàn do mục đích của nó). Điều này hoàn toàn hữu hiệu bởi vì custom Hooks được hỗ trợ chỉ để được gọi khi một function component đang render.


## Trùng lặp React {#duplicate-react}

Để Hooks hoạt động,  `react` được import từ mã ứng dụng cần được giải quyết giống như `react` được import từ package `react-dom`.

Nếu những `react` được nhập này giải quyết hai đối tượng xuất (export) khác nhau, bạn sẽ thấy cảnh báo. Điều có thể xảy ra nếu bạn **đột ngột kết thúc với hai phiên bản** của package `react`.

Nếu bạn sử dụng Node để quản lý package, bạn có thể kiểm tra nó bằng cách chạy câu lệnh này trong thư mục dự án của bạn:

    npm ls react

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

>Ghi chú
>
>Nhìn chung, React hỗ trợ sử dụng nhiều phiên bản độc lập trong một trang (ví dụ, nếu một ứng dụng và một ứng dụng nhỏ từ bên thứ ba cùng sử dụng nó). Nó chỉ không chạy khi `require('react')` giải quyết một cách khác nhau giữa component và`react-dom` phiên bản mà nó được xuất cùng với.

## Những nguyên nhân khác {#other-causes}

Nếu khó cách nào giải quyết được, Vui lòng bình luận trong [this issue](https://github.com/facebook/react/issues/13991)và chúng tôi sẽ cố gắng hỗ trợ. Hãy cố gắng tạo một ví dụ tương tự — bạn có thể tìm ra được vấn đề mà bạn mắc phải .
