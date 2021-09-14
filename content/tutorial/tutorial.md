---
id: tutorial
title: "Hướng dẫn: Giới thiệu về React"
layout: tutorial
sectionid: tutorial
permalink: tutorial/tutorial.html
redirect_from:
  - "docs/tutorial.html"
  - "docs/why-react.html"
  - "docs/tutorial-ja-JP.html"
  - "docs/tutorial-ko-KR.html"
  - "docs/tutorial-zh-CN.html"
---

Bài viết này không có bất kỳ giả định gì về kiến thức React hiện tại.

## Trước khi bắt đầu {#before-we-start-the-tutorial}

Trong bài hướng dẫn này, chúng ta sẽ xây dựng một trò chơi đơn giản. **Bạn có thể không muốn đọc tiếp vì bạn không làm game -- Đừng làm vậy nhé! Hãy kiên nhẫn một chút.** Kiến thức trong bài này chính là lý thuyết cơ bản để xây dựng một ứng dụng React, master nó sẽ giúp bạn hiểu sâu hơn về React.

>Mẹo
>
>Hướng dẫn này được thiết kế cho những ai có xu hướng **Học thông qua thực hành**. Nếu bạn là người thích học từ những lý thuyết cơ bản, vui lòng tham khảo [Hướng dẫn step-by-step](/docs/hello-world.html). Bạn có thể tham khảo cả hai để bổ sung cho nhau.

Hướng dẫn này bao gồm 4 phần chính như sau:

* [Cài đặt môi trường](#setup-for-the-tutorial) sẽ giúp bạn chọn ra **điểm xuất phát** phù hợp để bắt đầu.
* [Tổng quan](#overview) sẽ giới thiệu cho bạn các **khái niệm cơ bản** của React: components, props, và state.
* [Hoàn thành trò chơi](#completing-the-game) sẽ giúp bạn hiều được **những kỹ thuật cơ bản nhất** trong quá trình xây dựng một ứng dụng bằng React.
* [Thêm lịch sử bước đi](#adding-time-travel) sẽ cho bạn **một cái nhìn sâu sắc hơn** về những điểm mạnh độc đáo của React.

Bạn không cần phải hoàn thành toàn bộ các phần trên trong một lần để có được kiến thức mà nó mang lại. Tuy nhiên, hãy cố gắng hoàn thành càng nhiều phần càng tốt -- kể cả là một hay hai phần

### Chúng ta sẽ làm gì? {#what-are-we-building}

Trong bài hướng dẫn này, Chúng ta sẽ xây dựng một trò chơi tương tác có tên là tic-tac-toe bằng React.

Bạn có thể tìm thấy phiên bản hoàn thiện mà chúng ta sẽ xây dựng tại **[đây](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**. Nếu bạn không hiểu cú pháp hoặc ý nghĩa của đoạn code đó, đừng lo lắng! Mục tiêu của bài hướng dẫn này là giúp bạn hiểu được React cũng như cú pháp trong React

Chúng tôi khuyến khích bạn tìm hiểu trò tic-tac-toe trước khi tiếp tục. Một trong những tính năng của trò chơi mà bạn cần chú ý đó là danh sách bên phải của bàn cờ. Danh sách đó chính là lịch sử của tất cả các bước đi trong một ván chơi.

Nếu bạn đã làm quen với trò chơi tic-tac-toe, chúng ta sẽ bắt đầu với một phiên bản đơn giản của nó trong bài hướng dẫn này. Bước tiếp theo sẽ giúp bạn cài đặt những thứ cần thiết để bạn có thể bắt đầu.

### Kiến thức cơ bản cần có{#prerequisites}

Chúng tối giả định rằng bạn đã có kiến thức cơ bản về HTML và JavaScript, tuy nhiên, bạn vẫn có thể tiếp tục nếu như bạn đã làm quen với một ngôn ngữ lập trình khác. Chúng tôi cũng giả định rằng bạn đã quen thuộc với những khái niệm hàm (functions), đối tượng (objects), mảng (arrays) và một chút khái niệm về kế thừa (extend) và lớp (classes).

Nếu bạn cần tìm hiểu về JavaScript, chúng tôi khuyến khích bạn đọc [hướng dẫn này](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript). Chú ý rằng trong bài viết này có sử dụng một vài tính năng của ES6 -- một phiên bản gần đây của JavaScript. Trong bài hướng dẫn này có sử dụng các khái niệm [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions),  [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), và [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const). Bạn có thể sử dụng [Babel REPL](babel://es5-syntax-example) để kiểm tra xem cú pháp ES6 được biên dịch thành gì tương ứng.

## Cài đặt môi trường {#setup-for-the-tutorial}

Có hai cách để hoàn thành bài hướng dẫn này: Viết code trực tiếp trên trình duyệt hoặc cài đặt môi trường trên máy cá nhân của bạn

### Tuỳ chọn 1: Viết code trên trình duyệt {#setup-option-1-write-code-in-the-browser}

Đây là cách nhanh nhất để bắt đầu!

Đầu tiên, mở **[đoạn Code khởi đầu này](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** trong trang mới. Bạn sẽ thấy một bàn cờ tic-tac-toe trống và code React tương ứng. Chúng ta sẽ sửa đoạn code đó trong bài hướng dẫn này.

Bạn có thể bỏ qua tùy chọn cài đặt thứ hai và tiếp tục chuyển đến phần [Tổng quan](#overview) để có cái nhìn tổng quan về React.

### Tùy chọn 2: Môi trường trên máy cá nhân {#setup-option-2-local-development-environment}

Đây là tùy chọn không bắt buộc cho bài hướng dẫn này!

<br>

<details>

<summary><b>Tùy chọn: Hướng dẫn cài đặt trên máy cá nhân với trình soạn thảo văn bản tùy thích</b></summary>

Các bước cài đặt dưới đây sẽ mất nhiều thời gian hơn nhưng nó cho phép bạn hoàn thành bài hướng dẫn này bằng trình soạn thỏa ưa thích của mình. Các bước cần làm:

1. Cài đặt [Node.js](https://nodejs.org/en/).
2. Làm theo [Hướng dẫn Create React App](/docs/create-a-new-react-app.html#create-react-app) để tạo một project mới.

```bash
npx create-react-app my-app
```

3. Xóa toàn bộ tệp tin trong thư mực `src/`

> Chú ý:
>
>**Đừng xóa thư mục `src`, chỉ xóa các tệp tin bên trong nó.** Chúng ta sẽ thay thế các tệp tin đó bằng các tệp tin mẫu trong bước tiếp theo

```bash
cd my-app
cd src

# If you're using a Mac or Linux:
rm -f *

# Or, if you're on Windows:
del *

# Then, switch back to the project folder
cd ..
```

4. Tạo một tệp tin với tên `index.css` trong thư mục `src/` với [đoạn code CSS này](https://codepen.io/gaearon/pen/oWWQNa?editors=0100).

5. Tạo một tệp tin với tên `index.js` trong thư mục `src/` với [đoạn code JS này](https://codepen.io/gaearon/pen/oWWQNa?editors=0010).

6. Thêm 3 dòng code sau vào đầu tệp `index.js` trong thư mục `src/`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
```

Tiếp theo, chạy lệnh `npm start` trong thư mục project và mở đường dẫn `http://localhost:3000` trên trình duyệt, bạn sẽ nhìn thấy bàn cờ tic-tac-toe trống.

Chúng tôi khuyến khích bạn làm theo [hướng dẫn này](https://babeljs.io/docs/editors/) để cấu hình việc làm nổi bật cú pháp cho trình soạn thảo của bạn.

</details>

### Cứu, Tôi đang bị kẹt! {#help-im-stuck}

Nếu bạn bị kẹt tại một bước nào đó, hãy ghé thăm [cộng đồng hỗ trợ](/community/support.html). Trong tình uống cụ thể, [Kênh chat Reactiflux](https://discord.gg/reactiflux) là một cách hiệu quả để giúp bạn vượt qua khó khăn. Nếu bạn không nhận được câu trả lời từ ai hoặc bạn vẫn gặp khó khăn, vui lòng gửi vấn đề  đó cho chúng tôi và chúng tôi sẽ giúp bạn.

## Tổng quan {#overview}

Mọi thứ đã sẵn sàng, cùng tìm hiểu tổng quan về React nào!

### React là gì? {#what-is-react}

React là một thư viện JavaScript declarative, hiệu quả và linh hoạt cho việc xây dựng giao diện người dùng. React cho phép bạn tạo những giao diện (UI) phức tạp từ những đoạn code nhỏ và độc lập. Những đoạn code này được gọi là "components".

React có một vài loại components, tuy nhiên chúng ta sẽ bắt đầu với `React.Component`:

```javascript
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// Example usage: <ShoppingList name="Mark" />
```

Chúng ta sẽ sớm tìm hiểu sự thú vị của thẻ XML sau. Chúng ta sử dụng components để nói cho React biết ta muốn hiển thị gì trên màn hình. Khi dữ liệu thay đổi, React sẽ cập nhật và render lại các component một cách hiệu quả.

Ở ví dụ trên, ShoppingList là một **React component class**, hoặc **React component type**. Một component nhận vào các tham số, được gọi là `props` (viết tắt của "properties"), và trả về một hệ thống cấp bậc các view để hiển thị thông qua phương thức `render`.

Phương thức `render` trả về  *mô tả* của những gì bạn muốn nhìn thấy trên màn hình. React nhận mô tả và hiển thị ra kết quả. Cụ thể, phương thức `render` trả về một **React element**, một bản mô tả gọn nhẹ của những gì được render. Hầu hết lập trình viên React sử dụng một cú pháp đặc biệt được gọi là "JSX" để viết những cấu trúc này dễ dàng hơn. Khi biên dịch, thẻ `<div />` sẽ được chuyển thành `React.createElement('div')`. Ví dụ trên sẽ tương đương với:

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

[Xem phiên bản đầy đủ.](babel://tutorial-expanded-version)

Nếu bạn hiếu kỳ, `createElement()` được mô tả chi tiết hơn tại [tài liệu API](/docs/react-api.html#createelement), tuy nhiên, chúng ta không sử dụng nó trong bài hướng dẫn này. Thay vào đó, chúng ta sẽ sử dụng cú pháp JSX.

JSX đi kèm với toàn bộ sức mạnh của JavaScript. Trong JSX, bạn có thể viết *bất kỳ* biểu thức JavaScript nào trong dấu ngoặc. Mỗi React element là một đối tượng JavaScript, bạn có thể lưu trữ hoặc truyền qua lại trong chương trình của bạn.

Component `ShoppingList` ở trên chỉ render những DOM component có sẵn như `<div />` và `<li />`. Tuy nhiên bạn cũng có thể tạo ra và render những React component tùy biến. Ví dụ, chúng ta có thể chỉ định đến danh sách các cửa hàng bằng cách viết `<ShoppingList />`. Mỗi React component được đóng gói và có thể hoạt động độc lập; việc này cho phép bạn xây dựng những UI phức tạp từ các component đơn giản.

### Xem xét đoạn code khởi đầu {#inspecting-the-starter-code}

Nếu bạn code trên trình duyệt, mở đường dẫn này trong trang mới: **[Code khởi đầu](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**. Nếu bạn code trên **máy cá nhân,** mở tệp `src/index.js` trong thư mục project (bạn đã tạo tệp này trong mục [cài đặt](#setup-option-2-local-development-environment))

Đoạn code khởi đầu này là cơ sở cho những gì chúng ta sẽ xây dựng. Chúng tôi đã cung cấp sẵn CSS, vì vậy bạn chỉ cần tập trung vào việc sử dụng React để tạo ra trò chơi tic-tac-toe.

Bằng việc xem xét đoạn code, bạn sẽ thấy đang có ba React component:

* Square
* Board
* Game

Square component sẽ render một `<button>` và Board sẽ render 9 ô vuông (9 Square component). Game component render một bàn cờ (Board component) với các ô giá trị sẽ được sửa đổi ngay sau đây. Hiện tại bạn chưa thể tương tác với component nào.

### Truyền dữ liệu thông qua Props {#passing-data-through-props}

Để hiểu phần này, hãy thử truyền một vài dữ liệu từ Board component xuống Square component.

Chúng tôi đặc biệt khuyến nghị bạn gõ code trực tiếp thay vì việc copy/paste code từ bài hướng dẫn. Điều này sẽ giúp bạn ghi nhớ và hiểu sâu sắc hơn.

Trong phương thức `renderSquare` của Board component, thay đổi code để  truyền props `value` xuống Square component:

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
}
```

Thay đổi phương thức `render` của Square component để hiển thị giá trị được truyền vào bằng cách thay `{/* TODO */}` bằng `{this.props.value}`:

```js{5}
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
```

Trước:

![React Devtools](../images/tutorial/tictac-empty.png)

Sau: Bạn sẽ nhìn thấy số thứ tự tương ứng trên mỗi ô vuông trong kết quả được render ra

![React Devtools](../images/tutorial/tictac-numbers.png)

**[Xem code chi tiết tại bước này](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

Chúc mừng! Bạn vừa "truyền một prop" từ component cha xuống component con (từ Board xuống Square). Truyền props là cách truyền thông tin trong một ứng dụng React, từ cha xuống con.

### Tạo ra một component có thể tương tác được {#making-an-interactive-component}

Hãy điền giá trị "X" vào Square component khi ta bấm vào nó.
Đầu tiên, thay đổi thẻ button trong hàm `render()` của Square component như sau:

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() { console.log('click'); }}>
        {this.props.value}
      </button>
    );
  }
}
```

Nếu bạn bấm vào một ô Square, bạn sẽ nhìn thấy một cảnh báo hiện ra trên trình duyệt

>Chú ý
>
>Để tránh xảy ra [lỗi mập mờ của từ khóa `this`](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/), Chúng ta sẽ sử dụng [cú pháp arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) cho việc xử lý sự kiện như sau:
>
>```javascript{4}
>class Square extends React.Component {
>  render() {
>    return (
>      <button className="square" onClick={() => console.log('click')}>
>        {this.props.value}
>      </button>
>    );
>  }
>}
>```
>
>Để ý thấy rằng bằng cách viết `onClick={() => alert('click')}`, ta đã truyền *một hàm (function)* thông qua prop `onClick`. React sẽ chỉ thực hiện hàm này khi Square component được bấm. Quên không viết `() =>` mà chỉ viết `onClick={alert('click')}` là một lỗi cơ bản trong react, khi viết như thế, cảnh báo (alert) sẽ được hiện mỗi khi component render lại.

Ở bước tiếp theo, chúng ta muốn Square component "ghi nhớ" rằng nó đã được bấm, và hiện giá trị "X" trên nó. Để "ghi nhớ" mọi thứ, các component sử dụng **state**.

Các React component có thể có state bằng cách thiết lập `this.state` trong hàm khởi tạo của nó. `this.sate` nên được cân nhắc là riêng tư đối với mỗi React component mà nó được định nghĩa. Bây giờ, hãy lưu giá trị hiện tại của Square trong `this.state` và thay đổi nó khi Square được bấm.

Đầu tiên, hãy thêm hàm khởi tạo để khởi tạo giá trị của state:

```javascript{2-7}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={() => console.log('click')}>
        {this.props.value}
      </button>
    );
  }
}
```

>Chú ý
>
>Trong [JavaScript classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), bạn luôn luôn cần gọi hàm `super` khi định nghĩa hàm khởi tạo của một lớp con (subclass). Tất cả các React component dạng class nếu có hàm khởi tạo `constructor` nên bắt đầu với việc gọi hàm `super(props)`.

Bây giờ, chúng ta sẽ thay đổi phương thức `render` của component Square để hiển thị giá trị state khi nó được bấm:

* Thay thế `this.props.value` bằng `this.state.value` trong thẻ `<button>`.
* Thay thế hàm xử lý sự kiện `onClick={...}` bằng `onClick={() => this.setState({value: 'X'})}`.
* Để  2 props `className` và `onClick` trên 2 dòng khác nhau để việc đọc code dễ dàng hơn.

Sau những thay đổi trên, thẻ `<button>` trong phương thức `render` của Square component sẽ như sau:

```javascript{12-13,15}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.setState({value: 'X'})}
      >
        {this.state.value}
      </button>
    );
  }
}
```

Bằng việc gọi hàm `this.setState` từ hàm xử lý `onClick` trong phương thức `render` của Square component, chúng ta đã thông báo cho React render lại Square component khi thẻ `<button>` được bấm. Sau khi cập nhật, giá trị của `this.state.value` trong Square component sẽ là `'X'`, vì vậy, ta sẽ nhìn thấy `X` trên bàn cờ. Khi bạn bấm vào bất kỳ một ô Square nào, giá trị X sẽ được hiển thị trên nó.

Khi bạn gọi hàm `setState` trong một component, React sẽ tự động cập nhật chính component đó và các component con của nó.

**[Xem code chi tiết tại bước này](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### Công cụ cho nhà phát triển {#developer-tools}

Ứng dụng mở rộng React Devtools trên [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) và [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) cho phép bạn kiểm tra một cây React component với công cụ dành cho nhà phát triển trên trình duyệt.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

React DevTools cho phép bạn kiểm tra props và state hiện tại của các React component.

Sau khi cài đặt React DevTools, bạn có thể nhấp chuột phải vào bất kì phần tử nào trên trang, chọn "Kiểm tra phần tử" ("Inspect") để mở công cụ dành cho nhà phát triển, React tabs ("⚛️ Components" và "⚛️ Profiler") sẽ xuất hiện ở tabs cuối cùng bên phải. Sử dụng "⚛️ Components" để kiểm tra cây component.

**Tuy nhiên, cần thêm một vài bước để kiểm tra cây component nếu bạn code trên trình duyệt với CodePen:**

1. Đăng nhập hoặc đăng ký và xác thực email (bắt buộc để tránh spam).
2. Bấm nút "Fork".
3. Bấm "Change View" và sau đó chọn "Debug mode".
4. Trong trang mới được mở ra, devtools sẽ hiển thị một tab React.

## Hoàn thành trò chơi {#completing-the-game}

Hiện tại, chúng ta đã có khối cơ bản để có thể tạo nên trò tic-tac-toe. Để có một trò chơi hoàn chỉnh, ta cần đặt xen kẽ "X" và "O" trên bàn cờ và xác định xem ai là người chiến thắng.

### Tách state lên component cha {#lifting-state-up}

Hiện tại, mỗi Square component đang giữ state của chính nó. Và để biết ai là người thắng cuộc, ta cần biết giá trị của cả 9 ô vuông.

Đến đây, bạn có thể sẽ nghĩ để biết trạng thái của cả 9 ô thì Board component sẽ hỏi mỗi Square component xem giá trị state hiện tại của nó là gì. Mặc dù ta hoàn toàn có thể làm như vậy trong React, nhưng chúng tôi không khuyến khích làm như vậy bởi vì khi làm thế , sẽ rất khó để đọc hiểu code, debug cũng như là tái cấu trúc code. Hướng tiếp cận tốt nhất ở đây là hãy lưu state của cả 9 Square component (component con) ở Board component (component cha). Board component sẽ truyền dữ liệu xuống Square component để nó biết phải hiện thị gì thông qua prop, [giống như cách mà ta đã truyền số thứ tự xuống mỗi Square component](#passing-data-through-props).

**Để thu thập dữ liệu từ nhiều component con hay để hai component con giao tiếp được với nhau, bạn cần khai báo state chung trong component cha của các component đó. Component cha có thể truyền state xuống các component con thông qua props; việc này giúp các component con đồng bộ với nhau và đồng bộ với component cha của nó.**

Tách state lên component cha là khá phổ biến trong React khi các component được tái cấu trúc (refactor) -- Hãy áp dụng trong trường hợp này nào.

Thêm vào Board component hàm khởi tạo constructor và khởi tạo giá trị state là một mảng 9 phần tử null tương ứng với 9 ô vuông:

```javascript{2-7}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i) {
    return <Square value={i} />;
  }
```

Khi chúng ta tương tác (bấm vào các Square) trên bàn cờ, mảng `this.state.squares` sẽ có thể giống như thế này:

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

Phương thức `renderSquare` của Board component hiện tại:

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

Ở trên, chúng ta đã [truyền prop `value`](#passing-data-through-props) từ Board component để hiển thị các giá trị từ 0 đến 8 ở mỗi Square component. Ở một bước khác, chúng ta đã thay thế các số này bằng giá trị "X" để [xác định state của Square component](#making-an-interactive-component). Đây là lý do tại sao Square component hiện tại không sử dụng đến prop `value` được truyền từ Board component xuống.

Bây giờ chúng ta sẽ sử dụng cơ chế truyền prop một lần nữa. Ta sẽ sửa đổi Board component để Square có thể hiển thị giá trị hiện tại của nó (`'X'`, `'O'` hoặc `null`). Ta đã có mảng `squares` trong hàm constructor của Board component, bây giờ ta sẽ sửa đổi hàm `renderSquare` một chút để nó có thể đọc được mảng squares:

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[Xem code chi tiết tại thời điểm này](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

Mỗi Square component bây giờ đã nhận prop `value` với giá trị là `'X'`, `'O'` hoặc `null` (ô trống).

Tiếp theo, ta cần thay đổi một chút để biết cần làm gì ra khi Square được bấm. Hiện tại, Board component đã biết ô nào đã được bấm. Giờ ta sẽ cần cập nhật lại state của Board component khi Square component được bấm. Như đã nói thì state là riêng tư đối với từng component mà nó được nắm giữ, vì vậy chúng ta sẽ không thể cập nhật trực tiếp state của Board component từ Square component.

Thay vào đó, ta sẽ truyền một hàm từ Board xuống Square và từ Square component ta sẽ gọi hàm đó khi nó được bấm. Lúc này phương thức `renderSquare` sẽ được thay đổi như sau:

```javascript{5}
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
```

>Chú ý
>
>Chúng ta viết lại phần tử được trả ra trên nhiều dòng để dễ đọc hơn, và thêm một ngoặc tròn sau return để tránh bị lỗi tự thêm dấu chấm phẩy sau `return` của JavaScript.

Bây giờ, ta sẽ truyền hai props từ Board xuống Square: `value` và `onClick`. Prop `onClick` là một hàm mà Square component có thể gọi khi nó được bấm. Chúng ta sẽ thay đổi code của Square component như sau:

* Thay thế  `this.state.value` bằng `this.props.value` trong phương thức `render` của Square component
* Thay thế `this.setState()` bằng `this.props.onClick()` trong phương thức `render` của Square component
* Xóa hàm khởi tạo `constructor` trong Square component vì Square component bây giờ không còn nắm giữ state nào nữa

Sau những thay đổi trên, Square component sẽ như sau:

```javascript{1,2,6,8}
class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
```

Khi một Square được bấm, hàm `onClick` cung cấp bởi Board sẽ được gọi. Dưới đây là tổng kết lại những gì ta đã đạt được đến thời điểm này:

1. Prop `onClick` trong DOM có sẵn `button` component cho phép React lắng nghe sự kiện nhấp chuột.
2. Khi button được bấm, React sẽ gọi hàm `onClick` được định nghĩa trong phương thức `render` của Square component.
3. Hàm xử lý sự kiện này sẽ gọi hàm `this.props.onClick()`. Prop `onClick` của Square component được chỉ định bởi Board component.
4. Khi Board componet truyền prop `onClick={() => this.handleClick(i)}` xuống Square component, Square sẽ gọi hàm `this.handleClick(i)` khi nó được bấm.
5. Chúng ta chưa hề định nghĩa phương thức `handleClick()` vì vậy code của chúng ta sẽ không chạy được ở thời điểm hiện tại. Khi bấm vào một Square, bạn sẽ thấy lỗi được trả ra trên màn hình dạng như "this.handleClick is not a function".

>Chú ý
>
>Thuộc tính (props) `onClick` của thẻ DOM `<button>` có một ý nghĩa đặc biệt đối với React vì nó là component có sẵn. Đối với những component tự định nghĩa như Square component thì việc đặt tên prop này là tùy ý. Chúng ta có thể đặt tên tùy ý cho prop `onClick` của Square component hay hàm `handleClick` của Board component mà code vẫn chạy với cùng một kết quả. Trong React, ta thường hay sử dụng `on[Event]` cho những prop thể hiện cho sự kiện và `handle[Event]` cho những phương thức xử lý sự kiện.

Khi thử bấm vào một Square component, chúng ta sẽ nhận được lỗi vì hàm `handleClick` chưa được định nghĩa. Bây giờ, ta sẽ thêm hàm `handleClick` vào Board component như sau:

```javascript{9-13}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[Xem code chi tiết tại bước](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)**

Sau những thay đổi trên, chúng ta đã có thể bấm vào các ô Square component để  điền giá trị 'X' vào nó. Và state bây giờ được nắm giữ bởi Board component thay vì trong từng Square component. Khi state của Board component thay đổi, các Square component sẽ được render lại một cách tự động. Giữ state của tất cả các ô vuông trong Board component sẽ giúp ta có thể xác định ai sẽ là người thắng cuộc ở bước tiếp theo.

Khi các Square component không còn nắm giữ state nữa, Square component nhận vào giá trị từ Board component và thông báo cho Board component khi nó được bấm. Trong thuật ngữ của React, các Square component là những **controlled component**. Board component có toàn quyền kiểm soát chúng.

Chú ý rằng trong hàm `handleClick`, chúng ta sử dụng `.slice()` để tạo ra một bản sao của mảng `squares` và sửa đổi trên bản sao đó chứ không thay đổi trực tiếp mảng squares. Chúng tôi sẽ giải thích kỹ hơn vì sao cần tạo ra một bản sao của `squares` trong phần tiếp theo.

### Tại sao tính bất biến là quan trọng {#why-immutability-is-important}

Trong phần code ví dụ trước, ta đã sử dụng hàm `.slice()` để tạo ra bản sao của mảng `squares` thay vì sửa trực tiếp nó. Giờ ta sẽ thảo luận về tính bất biến và vì sao tính bất biến lại quan trọng.

Thông thường, ta có 2 hướng tiếp cận đối với việc thay đổi dữ liệu. Hướng tiếp cận đầu tiên đó là *thay đổi (mutate)* trực tiếp giá trị của dữ liệu. Hướng tiếp cận thứ hai đó là thay dữ liệu hiện có bằng một bản sao của nó và sửa đổi trên bản sao đó.

#### Sửa đổi dữ liệu trực tiếp {#data-change-with-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Now player is {score: 2, name: 'Jeff'}
```

#### Sửa đổi dữ liệu gián tiếp {#data-change-without-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// Now player is unchanged, but newPlayer is {score: 2, name: 'Jeff'}

// Or if you are using object spread syntax proposal, you can write:
// var newPlayer = {...player, score: 2};
```

Kết quả cuối cùng mà ta thu được là như nhau, tuy nhiên với việc thay đổi dữ liệu gián tiếp, ta sẽ thu được một vài lợi ích như sau.

#### Đơn giản hóa các tính năng phức tạp {#complex-features-become-simple}

Tính bất biến giúp các tính năng phức tập dễ để triển khai hơn. Ở cuối bài hướng dẫn này, chúng ta sẽ triển khai tính năng "quay về bước trước đó (time travel)" cho phép nhìn lại toàn bộ những bước đi trong khi chơi tic-tac-toe và "nhảy về" một bước bất kỳ trước đó. Tính năng này không chỉ có trong trò chơi này mà undo/redo còn là yêu cầu cơ bản và xuất hiện ở rất nhiều ứng dụng. Việc trách sửa đổi trực tiếp dữ liệu cho phép chúng ta lưu lại được giá trị trước đó của nó và có thể tái sử dụng chúng khi cần thiết.

#### Phát hiện thay đổi {#detecting-changes}

Việc phát hiện thay đổi trên mutable object là rất khó vì nó đã được sửa đổi trực tiếp. Việc phát hiện này đòi hỏi so sánh mutable object với bản copy của nó trước khi được sửa đổi trong khi ta không hề lưu trữ nó.

Việc phát hiện thay đổi trên immutable object là dễ dàng hơn khá nhiều. Nếu tham chiếu của immutable object hoàn toàn khác với chính nó trước đó thì nó này đã được thay đổi.

#### Xác định khi nào component render lại trong React {#determining-when-to-re-render-in-react}

Lợi ích chính của tính bất biến là giúp chúng ta xây dựng các _pure component_ trong React. Những dữ liệu bất biến có thể dễ dàng xác định khi nào nó thay đổi, từ đó giúp ta xác định được khi nào một component cần phải render lại.

Bạn có thể đọc thêm về `shouldComponentUpdate()` và làm sao để xây dựng các *pure component* qua bài viết [Tối ưu Hiệu năng](/docs/optimizing-performance.html#examples)

### Function Components {#function-components}

Bây giờ ta sẽ sửa đổi Square component để nó trở thành một **functional component**.

Trong React, **function components** là một cách đơn giản để viết các component chỉ chứa phương thức `render` và không chứa bất kỳ state nào. Thay vì phải định nghĩa một lớp kế thừa `React.Component`, chúng ta có thể viết một hàm nhận vào các prop để hiển thị ra giao diện. Các Functional component thường sẽ ít tẻ nhạt hơn class component, và khá nhiều component có thể viết dưới dạng này.

Chuyển class Square thành dạng function:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

Ta đổi `this.props` thành `props` trong toàn bộ component.

**[Xem code chi tiết tại bước này](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Chú ý
>
>Khi chuyển Square component thành dạng function component, chúng ta đã đổi `onClick={() => this.props.onClick()}` thành dạng gọn hơn `onClick={props.onClick}` (bỏ ngoặc đơn ở cả hơn vế).

### Lượt chơi {#taking-turns}

Bây giờ, Ta đang có một thiếu xót quan trọng: Các ký tự "O" chưa thể được đánh dấu trên bàn cờ.

Chúng ta sẽ đặt mặc định bước đi đầu tiên sẽ thuộc về "X". Và để làm điều đó, ta có thể sửa lại giá trị khởi tạo của state trong Board constructor như sau:

```javascript{6}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
```

Sau mỗi bước đi, `xIsNext` (một giá trị đúng sai (boolean)) sẽ được đảo ngược để xác định xem người chơi nào sẽ đi tiếp và state của trò chơi sẽ thay đổi và được lưu lại. Ta sẽ cập nhật lại hàm `handleClick` để đảo ngược giá trị của `xIsNext`:

```javascript{3,6}
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Với thay đổi này, "X" và "0" đã có thể có lượt đi của mình.

Tiếp theo, hãy cùng thay đổi dòng "trạng thái" trong phương thức `render` của Board component để hiển thị lượt chơi tiếp theo thuộc về ai:

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // the rest has not changed
```

Sau những thay đổi trên, bạn sẽ có một Board component như sau:

```javascript{6,11-16,29}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[Xem code chi tiết tại bước này](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### Xác định người thắng cuộc {#declaring-a-winner}

Hiện tại, ta đã hiển thị được lượt chơi tiếp theo thuộc về ai, ta cũng cần phải hiện ai là người thắng cuộc và trò chơi kết thúc. Bạn hãy sao chép đoạn code dưới đây và dán vào cuối file:

```javascript
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

Hàm trên sẽ nhận vào một mảng ứng với 9 ô vuông để sẽ kiểm tra xem ai là người thắng cuộc. Hàm này sẽ trả ra `'X'`, `'O'` hoặc `null` nếu chưa ai thắng.

Chúng ta sẽ gọi hàm `calculateWinner(squares)` trong phương thức `render` của Board để kiểm tra xem có người chơi thắng cuộc hay chưa. Nếu một người chơi chiến thắng, ta sẽ hiển thị "Winner: X" hoặc "Winner O". Ta sẽ thay thế dòng `trạng thái` được định nghĩa trong phương thức `render` của Board component bằng đoạn code dưới đây:

```javascript{2-8}
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      // the rest has not changed
```

Bây giờ ta sẽ thay đổi phương thức `handleClick` để bỏ qua việc xử lý click khi có một người chiến thắng hoặc ô đó đã có giá trị được điền:

```javascript{3-5}
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

**[Xem code chi tiết tại bước này](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

Xin chúc mừng! Bạn đã xây dựng thành công trò chơi tic-tac-toe. Và bạn cũng vừa học được lý thuyết cơ bản của React. Vì thế bạn đã trở thành một người thắng cuộc thực sự ở đây rồi đó. ^^

## Thêm lịch sử bước đi {#adding-time-travel}

Như một bài tập cuối, hãy làm trò chơi có thể "quay lại các bước trước đó" ("go back in time").

### Lưu lại lịch sử các bước đi {#storing-a-history-of-moves}

Nếu chúng ta thay đổi trực tiếp mảng `squares`, việc quay về bước trước sẽ là rất khó.

Tuy nhiên, chúng ta đã sử dụng hàm `slice()` để tạo một mảng mới được sao chép từ mảng `squares` sau mỗi bước đi và [đối xử nó như là bất biến](#why-immutability-is-important). Việc này sẽ cho phép ta lưu lại lịch sử các thay đổi của mảng `squares`, từ đó quay lại một trong các bước đi đã xảy ra.

Ta sẽ lưu lại lịch sử thay đổi của mảng `squares` bằng mảng `history`. Mảng `history` sẽ chứa toàn bộ các trạng thái của bàn cờ, từ bước đi đầu tiên cho đến bước cuối cùng, và nó sẽ có dạng:

```javascript
history = [
  // Before first move
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // After first move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // After second move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, 'O',
    ]
  },
  // ...
]
```

Bây giờ, ta cần xác định xem component nào sẽ thích hợp để lưu state `history`

### Đưa state lên component cha một lần nữa {#lifting-state-up-again}

Chúng ta sẽ muốn component ở mức độ cao nhất -- Game component, sẽ hiển thị lịch sử các bước đi. Nó sẽ cần đọc `history` để làm điều đó, vì vậy ta sẽ đặt state `history` ở Game component.

Đặt state `history` ở Game component sẽ cho phép chúng ta xóa state `squares` từ component con của nó là Board component. Như chúng ta đã thực hiện ở phần ["đưa state lên component cha"](#lifting-state-up) -- từ Square component lên Board component, giờ ta sẽ đưa state từ Board lên Game component. Điều này sẽ khiến cho Game component có toàn quyền xử lý dữ liệu của Board component và giúp nó có thể báo cho Board component biết khi nào cần render bước đi trước đó từ mảng `history`

Đầu tiên, ta sẽ khởi tạo state ban đầu của Game component trong phương thức constructor của nó:`

```javascript{2-10}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
```

Tiếp theo, chúng ta sẽ có Board component nhận vào các prop `squares` và `onClick` từ Game component. Do chúng ta có một hàm xử lý sự kiện click duy nhất ở Board cho rất nhiều Squares nên ta sẽ cần truyền vị trí của mỗi Square trong hàm `onClick` để chỉ định ô nào được bấm. Dưới đây là các bước cần thiết để sửa đổi Board component:

* Xoá hàm `constructor` trong Board component.
* Thay thế `this.state.squares[i]` thành `this.props.squares[i]` trong phương thức `renderSquare` của Board component.
* Thay thế `this.handleClick(i)` bằng `this.props.onClick(i)` trong phương thức render của Board component.

Giờ đây Board component sẽ như sau:

```javascript{17,18}
class Board extends React.Component {
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

Bây giờ ta sẽ cập nhật lại hàm `render` của Game component để sử dụng lịch sử gần nhất để xác định và hiển thị trạng thái hiện tại của trò chơi:

```javascript{2-11,16-19,22}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
```

Do Game component hiện tại đang hiển thị trạng thái của trò chơi, vì thế ta có thể xóa đoạn code tương tự trong phương thức `render` của Board component. Sau khi tái cấu trúc, phương thức `render` của Board component sẽ như sau:

```js{1-4}
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
```

Cuối cùng, chúng ta cần chuyển hàm `handleClick` từ Board component lên Game component. Chúng ta cũng cần sửa lại hàm `handleClick` vì cấu trúc state của Game component khác với của Board component trước đó. Trong phương thức `handleClick`, ta sẽ nối thêm vào `history` một lịch sử mới.

```javascript{2-4,10-12}
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
```

>Chú ý
>
>Không giống như phương thức `push()` (bạn sẽ thấy nó khá tương đồng), phương thức `concat()` không thêm trực tiếp vào mảng dữ liệu gốc, vì vậy chúng ta sẽ dùng nó.

Tại bước này, Board component chỉ cần hai phương thức `renderSquare` và `render`. State của trò chơi và phương thức `handleClick` sẽ nằm ở Game component.

**[Xem code chi tiết tại bước này](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Hiển thị lịch sử các bước đi {#showing-the-past-moves}

Giờ ta đã có lịch sử các bước đi của trò chơi tic-tac-toe, tiếp theo ta sẽ cần hiển thị nó.

Như đã nói ở trên thì các React element là các đối tượng của các lớp trong JavaScript (first-class JavaScript object); và chúng ta cần truyền nó qua lại trong ứng dụng của chúng ta. Để render nhiều item trong React, ta có thể sử dụng một mảng các React element.

Trong JavaScript, [`phương thức map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) là cách rất phổ biến để biến đổi dữ liệu thành một mảng dữ liệu khác, ví dụ:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
```

Sử dụng phương thức `map`, ta có thể biến lịch sử các bước đi thành các React element biểu diễn bằng các nút bấm (button) trên màn hình, khi bấm vào những button này sẽ "nhảy" về một bước trước đó.

Hãy `map` mảng `history` trong phương thức `render` của Game component:

```javascript{6-15,34}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

**[Xem code chi tiết tại bước này](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

Với mỗi lịch sử bước đi trong game tic-tac-toe, ta tạo ra một danh sách các `<li>` chứa một `<button>`. Button sẽ có một hàm xử lý `onClick`, hàm này sẽ gọi phương thức `this.jumpTo()`. Hiện tại ta chưa có hàm `jumpTo()`. Đến bước này, bạn sẽ thấy một danh sách các bước đi được hiển thị trên màn hình và cảnh báo trong console của công cụ cho nhà phát triển với thông điệp như sau:

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

Cùng thảo luận xem dòng cảnh báo trên có nghĩa là gì nhé.

### Chọn một khóa (key) {#picking-a-key}

Khi render một danh sách, React lưu lại một vài thông tin về mỗi phần tử được render. Khi cập nhật lại danh sách, React cần xác định xem thay đổi là gì, nó có thể là thêm, xóa, sắp xếp lại hoặc sửa lại danh sách các phần tử.

Ví dụ thay đổi từ

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

thành

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

Ngoài cập nhật về số lượng task, một người đọc những thay đổi trên sẽ có thể phát biểu rằng thứ tự của Alexa và Ben được đổi chỗ cho nhau và Claudia được thêm vào giữa Alexa và Ben. Tuy nhiên, React là một chương trình máy tính và nó sẽ không thể hiểu được ý của chúng ta. Vì React không thể biết ý định của chúng là gì, nên ta cần phải chỉ định một *khóa* (key) cho từng phần tử để phân biệt nó với các phần tử còn lại. Một lựa chọn về khóa cho ví dụ trên có thể là string `alexa`, `ben`, `claudia`. Nếu ta hiển thị dữ liệu từ cơ sở dữ liệu thì ID của Alexa, Ben và Claudia có thể được sử dụng để làm khóa

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

Khi một danh sách được render lại, React sẽ lấy mỗi khóa của phần tử , tìm kiếm trong danh sách các phần từ trước đó. Nếu danh sách hiện tại có chứa một khóa không thuộc danh sách trước đó, React sẽ tạo thêm một component. Nếu danh sách hiện tại không chứa khóa tồn tại trong danh sách trước đó, React sẽ xóa component đó. Nếu khóa tồn tại trong cả hai danh sách, React sẽ cập nhật lại component đó. Các Khóa giúp React định danh được mỗi component và từ đó duy trì được state và props giữa các lần render. Nếu khóa của component thay đổi, component sẽ được xóa đi và tạo lại với giá trị state mới.

`key` (khóa) là từ thuộc tính (prop) đặc biệt và reserved trong React (cùng với `ref`, một tính năng nâng cao). Khi một phần tử được tạo ra, React sẽ tách prop `key` từ `this.props.key`. React tự động sử dụng `key` để quyết định xem component nào sẽ được cập nhật. Một component không thể điều tra (inquire) và `key` của nó.

**Chúng tôi đặc biệt khuyến khích bạn thêm props key khi xây dựng các danh sách động.** Nếu bạn không có khóa phù hợp, hãy cân nhắc việc tái cấu trúc dữ liệu của bạn.

Nếu không có khóa nào được chỉ định, React sẽ hiện một cảnh báo và sử dụng chỉ số của mảng để làm khóa. Sử dụng chỉ số của mảng để làm khóa sẽ có thể xảy ra một lỗi khi sắp sếp lại thứ tự hoặc thêm/xóa phần tử. Chỉ định `key={i}` có thể giúp không hiện cảnh báo nhưng vẫn sẽ xảy ra lỗi tương tự và nó không được khuyến khích sử dụng trong hầu hết các trường hợp.

Các khóa không cần phải là duy nhất trong toàn ứng dụng; nó chỉ cần là duy nhất giữa các component cùng cấp.


### Triển khai tính năng nhảy lùi bước đi {#implementing-time-travel}

Trong lịch sử các bước đi của trò chơi tic-tac-toe, mỗi bước đi có một ID gắn liền với nó: Số thứ tự của bước đi. Các bước đi không bao giờ được sắp xếp lại, xóa hay thêm vào giữa, vì vậy ta có thể sử dụng chỉ số mảng để làm khóa trong trường hợp này.

Trong phương thức `render` của Game component, ta có thể thêm khóa `<li key={move}>` và cảnh báo của react về khóa sẽ biến mất:

```js{6}
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
```

**[Xem code chi tiết tại bước này](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

Bấm vào bất kỳ một button nào trên danh sách các bước đi sẽ xảy ra lỗi bởi vì hàm `jumTo` chưa được định nghĩa. Trước khi viết hàm `jumpTo`, ta sẽ thêm `stepNumber` vào state của Game component để biết bước đi nào đang được hiển thị.

Đầu tiên, thêm `stepNumber: 0` vào state ban đầu trong hàm `constructor` của Game component:

```js{8}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
```

Tiếp theo, chúng ta sẽ định nghĩa hàm `jumpTo` trong Game component để cập nhật `stepNumber`. Chúng ta cũng cần đặt `xIsNextStep` là true nếu state tiếp theo của `stepNumber` là chẵn:

```javascript{5-10}
  handleClick(i) {
    // this method has not changed
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // this method has not changed
  }
```

Bây giờ ta sẽ cần thay đổi hàm `handleClick` của Game component một chút.

State `stepNumber` mà chúng ta vừa thêm phản ánh bước đi hiện tại của người chơi. Sau khi một bước đi diễn ra, ta cần cập nhật lại `stepNumber` như sau `stepNumber: history.length`. Việc này đảm bảo chúng ta sẽ không bị hiển thị cùng một bước đi sau khi một bước đi mới được tạo ra.

Ta cũng sẽ thay thế `this.state.history` bằng `this.state.history.slice(0, this.state.stepNumber + 1)`. Việc này đảm bảo nếu ta "quay về một bước đi trước đó" và sau khi ta đi một bước mới từ điểm đó, mảng history "tương lai" sẽ không bị sai.

```javascript{2,13}
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Cuối cùng, ta sẽ sửa lại phương thức `render` của Game component, thay vì luôn render bước đi cuối cùng thì giờ sẽ render bước đi được chọn từ `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // the rest has not changed
```

Nếu bạn bấm vào bất kỳ bước đi nào trong lịch sử các bước đi, bàn giờ sẽ ngay lập tức cập nhật và hiển thị đúng như trước khi bước đi đó diễn ra.

**[Xem code chi tiết tại bước này](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Tổng kết {#wrapping-up}

Chúc mừng! Bạn vừa tạo thành công trò chơi tic-tac-toe với các tính năng:

* Chơi game tic-tac-toe,
* Tìm ra người chơi thắng cuộc,
* Lưu trữ lịch sử các bước đi,
* Cho phép người chơi xem lại các bước đi.

Làm tốt lắm! Chúng tôi hy vọng bây giờ bạn cảm thấy bạn đã có một hiểu biết đáng kể về cách thức hoạt động của React.

Xem lại phiên bản cuối cùng tại đây: **[Final Result](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

Nếu có thời gian hoặc muốn thực hành nhiều hơn nữa, dưới đây là một số ý tưởng (độ khó tăng dần) để bạn cải thiện trò chơi tic-tac-toe:

1. Hiển thị vị trí của mỗi bước đi dưới dạng (cột, dòng) trong lịch sử các bước đi.
2. In đậm bước hiện tại trong danh sách các bước đi.
3. Viết lại Board sử dụng hai vòng lặp để tạo ra Square thay vì hardcode như hiện nay.
4. Thêm toogle button cho phép sắp sếp các bước đi theo thứ tự tăng hoặc giảm.
5. Khi một người chơi thắng cuộc, highlight ba ô vuông dẫn đến chiến thắng.
6. Khi không ai thắng cuộc, hiển thị thông báo kết quả hòa.

Xuyên suốt bài hướng dẫn này, chúng tôi đã đề cập các khái niệm trong React bao gồm elements, components, props và state. Để tìm hiểu chi tiết hơn về từng khái niệm, bạn có thể xem [phần còn lại của tài liệu](/docs/hello-world.html). Để tìm hiểu sâu hơn về định nghĩa components, hãy ghé thăm [`React.Component` API reference](/docs/react-component.html).
