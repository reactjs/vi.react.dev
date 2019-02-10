---
id: introducing-jsx
title: Introducing JSX
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

Xem xét khai báo biến dưới đây:

```js
const element = <h1>Hello, world!</h1>;
```

Cú pháp thẻ kì cục trên không phải là chuỗi cũng như HTML.

Nó được gọi là JSX, là một cú pháp mở rộng cho JavaScript. Chúng tôi khuyến khích sử dụng JSX với React để mô tả giao diện (UI). JSX có thể trông giống Ngôn ngữ Khuôn mẫu (Template language), nhưng JSX đi kèm với toàn bộ tính năng của Javascript.

JSX cho ra những "phần tử"(Element) React. Chúng ta sẽ khám phá việc chúng được đưa vào DOM như thế nào ở [phần tiếp theo](/docs/rendering-elements.html). Dưới đây là những điều cần thiết cơ bản của JSX để có thể bắt đầu.

### Tại sao lại là JSX? {#why-jsx}

React khuyến khích việc kết hợp lại của giao diện trình bày (UI) và những logic khác liên quan tới giao diện: Các sự kiện được xử lý thế nào, Trạng thái (state) thay đổi thế nào theo thời gian, và dữ liệu được chuẩn bị thế nào cho việc hiển thị.

Thay vì tách biệt các *công nghệ* một cách giả tạo bằng cách đưa định nghĩa giao diện và logic vào những tệp khác nhau, React [tách bạch *mối quan hệ*](https://en.wikipedia.org/wiki/Separation_of_concerns) bằng những đơn vị rời rạc gọi là "components" chứa cả hai cái trên. Chúng ta sẽ bàn về components trong một [phần khác](/docs/components-and-props.html), nếu bạn vẫn chưa cảm thấy thoải mái việc đưa các định nghĩa giao diện vào trong JS, [buổi nói chuyện này](https://www.youtube.com/watch?v=x7cQ3mrcKaY) có thể thuyết phục bạn.

React [Không bắt buộc](/docs/react-without-jsx.html) sử dụng JSX, nhưng phần lớn mọi người đều cho rằng nó hữu dụng khi làm việc với giao diện (UI) trong mã JavaScript. JSX cũng cho phép React hiển thị những lỗi cũng như những lưu ý bổ ích.

Vậy bắt đầu thôi!

### Nhúng Biểu thức trong JSX {#embedding-expressions-in-jsx}

Ở ví dụ dưới, chúng ta khai báo một biến tên là `name` và dùng bên trong JSX bằng cách bao trong cặp dấu ngoặc nhọn:

```js{1,2}
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

Bạn có thể nhúng bất kỳ [biểu thức Javascript hợp quy] nào(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) bên trong JSX bằng cặp dấu ngoặc nhọn. Ví dụ, `2 + 2`, `user.firstName`, hoặc `formatName(user)` đều là các biểu thức hợp quy của Javascript.

Ở ví dụ dưới, chúng ta nhúng kết quả của một hàm JavaScript, `formatName(user)`, vào bên trong phần tử `<h1>`.

```js{12}
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://introducing-jsx)

Chúng ta có thể tách JSX vào những tệp khác nhau cho dễ đọc. Việc đấy không bắt buộc, nhưng khi làm như vậy, chúng tôi cũng khuyến khích nhúng trong cặp dấu ngoặc để tránh rơi vào trường hợp JS Engines [tự thêm chấm phẩy](http://stackoverflow.com/q/2846283).

### JSX is cũng là một biểu thức {#jsx-is-an-expression-too}

Sau khi biên soạn (compile), biểu thức JSX là những gọi hàm bình thường của Javascript và thành những đối tượng Javascript sau khi được thực thi.

Điều này có nghĩa là bạn có thể dùng JSX bên trong mệnh đề `if` cũng như vòng lặp `for`, gán nó cho biến, dùng như đầu vào, và trả về JSX từ hàm.

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### Liệt kê thuộc tính của thẻ với JSX {#specifying-attributes-with-jsx}

Bạn có thể dùng dấu nháy để khai báo một chuỗi như là thuộc tính của thẻ:

```js
const element = <div tabIndex="0"></div>;
```

Bạn co thể dùng dấu ngặp ngoặc nhọn để nhúng một biểu thức Javascript vào trong thuộc tính:

```js
const element = <img src={user.avatarUrl}></img>;
```

Đừng để giấu nháy xung quanh ngoặc nhọn khi nhúng biểu thức Javascript vào trong một thuộc tính. Bạn có thể dùng dấu nháy (cho giá trị chuỗi) hoặc ngoặc nhọn (cho biểu thức), nhưng không được dùng cả hai cho cùng 1 thuộc tính.

>**CẢNH BÁO:**
>
>Vì JSX gần với Javascript hơn là so với HTML, React DOM sử dụng chuẩn quy tắc đặt tên `camelCase` cho thuộc tính thay vì dùng tên thuộc tính gốc của HTML.
>
>Ví dụ, `class` trở thành [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) trong JSX, và `tabindex` trở thành [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex).

### Specifying Children with JSX {#specifying-children-with-jsx}

If a tag is empty, you may close it immediately with `/>`, like XML:

```js
const element = <img src={user.avatarUrl} />;
```

JSX tags may contain children:

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

### JSX Prevents Injection Attacks {#jsx-prevents-injection-attacks}

It is safe to embed user input in JSX:

```js
const title = response.potentiallyMaliciousInput;
// This is safe:
const element = <h1>{title}</h1>;
```

By default, React DOM [escapes](http://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) any values embedded in JSX before rendering them. Thus it ensures that you can never inject anything that's not explicitly written in your application. Everything is converted to a string before being rendered. This helps prevent [XSS (cross-site-scripting)](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.

### JSX Represents Objects {#jsx-represents-objects}

Babel compiles JSX down to `React.createElement()` calls.

These two examples are identical:

```js
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

`React.createElement()` performs a few checks to help you write bug-free code but essentially it creates an object like this:

```js
// Note: this structure is simplified
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

These objects are called "React elements". You can think of them as descriptions of what you want to see on the screen. React reads these objects and uses them to construct the DOM and keep it up to date.

We will explore rendering React elements to the DOM in the next section.

>**Tip:**
>
>We recommend using the ["Babel" language definition](http://babeljs.io/docs/editors) for your editor of choice so that both ES6 and JSX code is properly highlighted. This website uses the [Oceanic Next](https://labs.voronianski.com/oceanic-next-color-scheme/) color scheme which is compatible with it.
