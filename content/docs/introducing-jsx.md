---
id: introducing-jsx
title: Giới thiệu JSX
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

Xem xét khai báo biến dưới đây:

```js
const element = <h1>Hello, world!</h1>;
```

Cú pháp thẻ này không phải là một chuỗi kí tự cũng không phải là một thẻ HTML

Nó được gọi là JSX, là một cú pháp mở rộng cho JavaScript. Chúng tôi khuyến khích sử dụng JSX với React để mô tả giao diện (UI). JSX có thể trông giống Ngôn ngữ Khuôn mẫu (Template language), nhưng JSX đi kèm với toàn bộ tính năng của JavaScript.

JSX cho ra những "phần tử"(Element) React. Chúng ta sẽ khám phá việc chúng được render vào DOM như thế nào ở [phần tiếp theo](/docs/rendering-elements.html). Dưới đây là những kiến thức cần thiết cơ bản của JSX để có thể bắt đầu.

### Tại sao lại là JSX? {#why-jsx}

React khuyến khích một thực tế là logic của render được kết hợp một cách tự nhiên với những logic khác liên quan tới UI: Các sự kiện được xử lý như thế nào, state thay đổi như thế nào theo thời gian và dữ liệu được chuẩn bị như thế nào cho việc hiển thị.

Thay vì tách biệt các *công nghệ* một cách giả tạo bằng cách đưa định nghĩa giao diện và logic vào những tệp khác nhau, React [tách bạch *mối quan hệ*](https://en.wikipedia.org/wiki/Separation_of_concerns) bằng những đơn vị rời rạc gọi là "components" chứa cả hai cái trên. Chúng ta sẽ bàn về components trong một [phần khác](/docs/components-and-props.html), nếu bạn vẫn chưa cảm thấy thoải mái việc đưa các định nghĩa giao diện vào trong JS, [buổi nói chuyện này](https://www.youtube.com/watch?v=x7cQ3mrcKaY) có thể thuyết phục bạn.

React [Không bắt buộc](/docs/react-without-jsx.html) sử dụng JSX, nhưng phần lớn mọi người đều cho rằng nó hữu dụng khi làm việc với giao diện (UI) trong mã JavaScript. JSX cũng cho phép React hiển thị những thông báo lỗi và "lời cảnh báo" (warning) hữu ích hơn.

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

Bạn có thể nhúng bất kỳ [biểu thức JavaScript hợp lệ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) bên trong JSX bằng cặp dấu ngoặc nhọn. Ví dụ, `2 + 2`, `user.firstName`, hoặc `formatName(user)` đều là các biểu thức hợp lệ của JavaScript.

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

Chúng ta có thể tách JSX vào những tệp khác nhau cho dễ đọc. Việc này không bắt buộc, nhưng khi làm như vậy, chúng tôi cũng khuyến khích nhúng trong cặp dấu ngoặc để tránh rơi vào trường hợp JS Engines [tự thêm chấm phẩy](https://stackoverflow.com/q/2846283).

### JSX cũng là một biểu thức {#jsx-is-an-expression-too}

Sau khi biên dịch (compile), biểu thức JSX là những gọi hàm bình thường của JavaScript và thành những đối tượng JavaScript sau khi được gọi.

Điều này có nghĩa là bạn có thể dùng JSX bên trong câu lệnh `if` cũng như vòng lặp `for`, gán nó cho biến, dùng như tham số hàm, và trả về JSX từ hàm.

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### Xác định thuộc tính của thẻ với JSX {#specifying-attributes-with-jsx}

Bạn có thể dùng dấu nháy để khai báo một chuỗi như là thuộc tính của thẻ:

```js
const element = <div tabIndex="0"></div>;
```

Bạn có thể dùng dấu ngoặc nhọn để nhúng một biểu thức Javascript vào trong thuộc tính:

```js
const element = <img src={user.avatarUrl}></img>;
```

Đừng để dấu nháy xung quanh ngoặc nhọn khi nhúng biểu thức JavaScript vào trong một thuộc tính. Bạn có thể dùng dấu nháy (cho giá trị chuỗi) hoặc ngoặc nhọn (cho biểu thức), nhưng không được dùng cả hai cho cùng 1 thuộc tính.

>**CẢNH BÁO:**
>
>Vì JSX gần với JavaScript hơn là so với HTML, React DOM sử dụng chuẩn quy tắc đặt tên `camelCase` cho thuộc tính thay vì dùng tên thuộc tính gốc của HTML.
>
>Ví dụ, `class` trở thành [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) trong JSX, và `tabindex` trở thành [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex).

### Dùng thẻ con trong JSX {#specifying-children-with-jsx}

Nếu tag rỗng (không có thẻ con), bạn có thể đóng nó ngay lập tức với `/>`, giống XML:

```js
const element = <img src={user.avatarUrl} />;
```

Thẻ JSX có thể chứa thẻ con:

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

### JSX chống tấn công kiểu Injection {#jsx-prevents-injection-attacks}

Việc nhúng đầu vào của người dùng trong JSX là an toàn:

```js
const title = response.potentiallyMaliciousInput;
// Việc này an toàn:
const element = <h1>{title}</h1>;
```

Mặc định, React DOM [loại bỏ những kí tự đặc biệt](https://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) ở bên trong bất kì giá trị nào được nhúng vào JSX trước khi render chúng. Việc này đảm bảo không có giá trị xấu nào được vô tình được đưa vào ứng dụng. Mọi thứ đều được chuyển thành chuỗi trước khi được render. Việc này giúp ngăn chặn phương thức [tấn công XSS (cross-site-scripting)](https://en.wikipedia.org/wiki/Cross-site_scripting).

### JSX là đối tượng {#jsx-represents-objects}

Babel biên dịch JSX thành những câu gọi hàm `React.createElement()`.

Hai ví dụ dưới đây là tương tự:

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

`React.createElement()` thực hiện một số kiểm tra để giúp bạn viết mã không bị lỗi nhưng cơ bản nó tạo một đối tượng giống thế này:

```js
// Lưu ý: cấu trúc nãy đã được đơn giản hoá
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

Những đối tượng này được gọi là "Những phần tử React" (React elements). Bạn có thể xem chúng như là mô tả những gì bạn muốn thấy trên màn hình. React đọc những đối tượng này và dùng chúng để xây dựng DOM và cập nhật nó.

Chúng ta sẽ khám phá cách các React Element được render vào DOM thế nào trong [phần kế tiếp](/docs/rendering-elements.html)..

>**Gợi ý:**
>
>Chúng tôi khuyến khích sử dụng [Định nghĩa ngôn ngữ "Babel"](https://babeljs.io/docs/en/next/editors) cho trình soạn thảo của bạn như vậy cả mã ES6 và JSX đều có thể được tô sáng rõ ràng.
