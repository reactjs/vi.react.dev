---
id: hooks-state
title: Sử dụng State Hook
permalink: docs/hooks-state.html
next: hooks-effect.html
prev: hooks-overview.html
---

*Hooks* mới được thêm vào trong React 16.8. Chúng cho phép sử dụng state và những tính năng khác của React mà không cần phải dùng tới class.

Trang [Giới thiệu về Hook](/docs/hooks-intro.html) sử dụng ví dụ này để làm quen với Hooks:

```js{4-5}
import React, { useState } from 'react';

function Example() {
  // Khai báo 1 biến trạng thái mới đặt tên là "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Bạn đã click {count} lần</p>
      <button onClick={() => setCount(count + 1)}>
        Click vào tôi
      </button>
    </div>
  );
}
```

Chúng ta sẽ bắt đầu tìm hiểu thêm về Hooks bằng cách so sánh đoạn code này với một ví dụ tương tự dùng class.

## Ví dụ tương tự dùng class {#equivalent-class-example}

Nếu bạn đã dùng class trong React trước đây, bạn có thể hiểu được đoạn code này:

```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>Bạn đã bấm {this.state.count} lần</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Bấm vào tôi
        </button>
      </div>
    );
  }
}
```

State ban đầu là `{ count: 0 }`, và chúng ta gia tăng `state.count` khi người dùng bấm vào nút bằng cách gọi hàm `this.setState()`. chúng ta sẽ sử dụng đoạn code mẫu này xuyên suốt bài viết.

>Lưu ý
>
>Bạn có thể thắc mắc tại sao chúng ta sử dụng một ví dụ về bộ đếm thay vì một ví dụ thực tế hơn. Bởi vì chúng ta đang tập trung vào API trong bước đầu làm quen với Hooks.

## Hooks và Function Components {#hooks-and-function-components}

Nhắc nhẹ lại, function components trong React trông giống như thế này:

```js
const Example = (props) => {
  // Bạn có thể sử dụng hooks tại đây!
  return <div />;
}
```

hoặc là:

```js
function Example(props) {
  // Bạn có thể sử dụng hooks tại đây!
  return <div />;
}
```

Bạn có thể đã biết ở trên gọi là "stateless components". Chúng ta sẽ thử sử dụng state trong những component này , vì vậy chúng tôi khuyến khích gọi chúng là "function components".

Hooks **không** hoạt động bên trong các class. Nhưng bạn có thể sử dụng hooks thay vì dùng class.

## Hook là gì? {#whats-a-hook}

Trong ví dụ mới này chúng ta import `useState` Hook từ React:

```js{1}
import React, { useState } from 'react';

function Example() {
  // ...
}
```

**Hook là gì?** Hook là một hàm đặc biệt cho phép bạn sử dụng các tính năng của React (mà không cần phải tạo class). Ví dụ, `useState` là một hook cho phép bạn thêm React state vào function components. Chúng ta sẽ tìm hiểu các hook còn lại trong các chương kế tiếp.

**Khi nào tôi nên dùng hook?** Nếu bạn viết một function component và nhận ra bạn cần thêm một số state vào chúng, trước đây bạn cần phải chuyển nó thành một class. Bây giờ bạn có thể sử dụng hook bên trong function component đã sẵn có. Chúng ta sẽ làm đều đó ngay bây giờ!

>Lưu ý:
>
>Có một số nguyên tắc đặc biệt về việc bạn có thể dùng hoặc không thể dùng hook trong component. Chúng ta sẽ xem qua chúng trong [Nguyên tắc sử dụng Hook](/docs/hooks-rules.html).

## Khai báo một biến state {#declaring-a-state-variable}

Trong một class, chúng ta khởi tạo `count` state về `0` bằng cách cài đặt `this.state` về `{ count: 0 }` bên trong constructor:

```js{4-6}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

Bên trong một function component, chúng ta không có `this`, cho nên chúng ta không thể cài đặt hoặc đọc `this.state`. Thay vào đó, chúng ta gọi `useState` Hook trực tiếp bên trong component:

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Khai báo một biến state mới, gọi nó là "count"
  const [count, setCount] = useState(0);
```

**Hàm `useState` làm gì khi được gọi?** Nó khai báo một "state variable" (biến state). Biến này gọi là `count` nhưng ta có thể gọi nó với bất kì tên nào, ví dụ gọi là `banana`. Đây là cách để "lưu giữ" các giá trị giữa các lần gọi hàm — `useState` là một cách mới để sử dụng như là cách `this.state` được dùng trong class. Thông thường, các biến này "biến mất" khi hàm kết thúc nhưng các biến state này được React giữ lại.

**Hàm `useState` nhận tham số gì?** Tham số duy nhất được truyền vào hook `useState()` là state ban đầu. Không giống như khai báo với Class, state không cần thiết phải là object mà có thể là số hoặc chuỗi. Với ví dụ trên, ta chỉ cần biết người dùng click bao nhiêu lần, vì vậy ta truyền vào giá trị khởi tạo là `0`. (Nếu ta muốn lưu hai giá trị khác nhau, ta sẽ gọi `useState()` hai lần.)

**`useState` trả về gì?** Nó trả về một cặp giá trị dưới dạng mảng: state hiện tại và một hàm để update nó. Đây là lý do chúng ta viết `const [count, setCount] = useState()`. Cặp này tương tự như `this.state.count` và `this.setState` trong class, khác là ta dùng chúng theo cặp. Nếu bạn không quen với cách dùng này, chúng ta sẽ quay trở lại thêm [ở cuối trang](/docs/hooks-state.html#tip-what-do-square-brackets-mean).

Vậy chúng ta đã biết `useState` Hook để làm gì, việc đó giúp ví dụ dưới đây dễ hiểu hơn:

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Khai báo một biến state mới, gọi nó là "count"
  const [count, setCount] = useState(0);
```

Ví dụ trên khai báo một biến state gọi là `count` và set nó về `0`. React sẽ nhớ giá trị hiện tại của nó và cung cấp cho hàm của chúng ta giá trị mới nhất giữa những lần re-render. Nếu chúng ta muốn cập nhật giá trị `count` hiện tại, có thể gọi hàm `setCount`.

>Lưu ý
>
>Có thể bạn thắc mắc: tại sao đặt tên hàm là `useState` mà không phải là `createState`?
>
>"Create" không được chính xác lắm bởi vì "state" chỉ được "create" lần đầu tiên khi component render. Trong những lần render tiếp theo, `useState` trả về state hiện tại. Nếu không thì nó không thể là nào gọi là "state"! Còn một lý do khác tại sao Hook luôn bắt đầu với `use`. Chúng ta sẽ tìm hiểu sau trong phần [Nguyên tắc sử dụng Hook](/docs/hooks-rules.html).

## Đọc State {#reading-state}

Khi muốn hiển thị giá trị hiện tại của state `count` trong class, chúng ta đọc từ `this.state.count`:

```js
  <p>Bạn đã click{this.state.count} lần</p>
```

Trong hàm (sử dụng với hooks), chúng ta dùng trực tiếp biến `count`:


```js
  <p>Bạn đã click{count} lần</p>
```

## Updating State {#updating-state}

Trong class, chúng ta cần gọi `this.setState()` để update state `count`:

```js{1}
  <button onClick={() => this.setState({ count: this.state.count + 1 })}>
    Click vào 
  </button>
```

Trong hàm (sử dụng với hooks), chúng ta đã có biến `setCount` và `count` cho nên không cần `this`:

```js{1}
  <button onClick={() => setCount(count + 1)}>
    Click vào 
  </button>
```

## Tóm tắt {#recap}

Cùng **xem lại từng dòng một** và kiểm tra xem chúng ta đã học được những gì.

<!--
  I'm not proud of this line markup. Please somebody fix this.
  But if GitHub got away with it for years we can cheat.
-->
```js{1,4,9}
 1:  import React, { useState } from 'react';
 2:
 3:  function Example() {
 4:    const [count, setCount] = useState(0);
 5:
 6:    return (
 7:      <div>
 8:        <p>Bạn đã click {count} lần</p>
 9:        <button onClick={() => setCount(count + 1)}>
10:         Click vào tôi
11:        </button>
12:      </div>
13:    );
14:  }
```

* **Line 1:** Chúng ta import hook `useState` từ React. Nó cho phép chúng ta lưu trữ state cục bộ trong function component.
* **Line 4:** bên trong `Example` component, chúng ta khai báo một biến state mới bằng cách gọi hook `useState`. Nó trả về môt cặp giá trị và chúng ta đặt tên chúng là `count` và `setCount`. Giá trị đầu tiên chúng ta đặt là `count` bởi vì biến `count` lưu trữ số lần buttion được click, ta khởi tạo giá trị là `0` bằng cách truyền `0` khi gọi hàm `useState`, tham số giá trị khởi tạo cũng là tham số duy nhất của hàm `useState`. Giá trị thứ hai trả về một hàm, cho phép cập nhật giá trị của `count`, vì vậy chúng ta gọi nó là `setCount`.
* **Line 9:** Khi người dùng click button, ta gọi hàm `setCount` với giá trị mới. React sẽ re-render component `Example`, và truyền giá trị của `count` vào nó.

Có thể đây là quá nhiều đối với bạn. Nhưng đừng lo lắng, nếu bạn vẫn không hiểu, hãy cố gắng nhìn lại đoạn code ở trên một lần nữa và đọc từ đầu tới cuối. Tôi hứa nếu bạn cố "quên" đi cách state hoạt động trong class, và xem nó như một cái mới, sẽ dễ hiểu hơn!

### Mẹo: Cặp ngoặc vuông nghĩa là gì? {#tip-what-do-square-brackets-mean}

Có thể bạn để ý chúng ta dùng cặp ngoặc vuông khi khai báo biến state:

```js
  const [count, setCount] = useState(0);
```

Tên của các biến bên trái `=` không phải là một phần của React API. Bạn có thể đặt tên biến state bất kì:

```js
  const [fruit, setFruit] = useState('banana');
```

Cú pháp Javascript này được gọi là ["array destructuring"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring). Nó nghĩa là bạn đang tạo hai biến mới `fruit` và `setFruit`. Trong đó, `fruit` là giá trị đầu tiên trả về bởi `useState`, và `setFruit` là giá trị thứ hai. Tương ứng với đoạn code:

```js
  var fruitStateVariable = useState('banana'); // Trả về một cặp (mảng 2 phần tử)
  var fruit = fruitStateVariable[0]; // Phần tử đầu tiên
  var setFruit = fruitStateVariable[1]; // Phần tử thứ hai
```

Khi chúng ta khai báo một biến state với `useState`. Nó trả về một cặp - mảng có 2 phần tử. Phần tử đầu tiên là giá trị hiện tại, phần tử thứ hai là hàm cập nhật giá trị đó. Sử dụng `[0]` and `[1]` để truy cập chúng thì dễ gây hoang mang bởi vậy chúng có ý nghĩa nhất định. Đây là lý do chúng ta dùng array destructuring.

>Lưu ý
>
>Bạn có thể tò mò làm thế nào React biết đuợc component nào dùng `useState` khi mà chúng ta không truyền bất kì thứ gì giống như `this` vào React. Câu hỏi này sẽ được giải thích [trong Một số câu hỏi thường gặp với Hook](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components) cùng với các câu hỏi khác.

### Mẹo: dùng nhiều biến state {#tip-using-multiple-state-variables}

Khai báo biến state dưới dạng một cặp giá trị `[something, setSomething]` thì tiện lợi bởi vì chúng cho phép chúng ta đặt tên biến state khác nhau nếu chúng ta muốn dùng nhiều hơn 1 state:

```js
function ExampleWithManyStates() {
  // Declare multiple state variables!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```

Trong component ở trên, chúng ta có các biến/state cục bộ `age`, `fruit`, và `todos`. Và chúng ta có thể cập nhật chúng riêng rẽ:

```js
  function handleOrangeClick() {
    // Similar to this.setState({ fruit: 'orange' })
    setFruit('orange');
  }
```

Bạn **không cần thiết phải** sử dụng nhiều biến state. Biến state có thể chứ dữ liệu dạng đối tượng và mảng. Vì vậy bạn có thể nhóm các dữ liệu liên quan với nhau vào cùng một biến. Tuy nhiên, không giống như `this.setState` trong class, cập nhật biến state luôn luôn **thay thế** mà không trộn chúng lại (giống như `setState`).


Chúng tôi có đề cập một số khuyến nghị về việc chia tách các biến state [trong phần Một số câu hỏi thường gặp với Hook](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables).

## Bước kế tiếp {#next-steps}

Ở chương này chúng ta đã tìm hiểu về một trong các hook cung cấp bởi React, gọi là `useState`. Thỉnh thoảng chúng ta gọi chúng là `State Hook`. Nó cho phép thêm state cục bộ vào React function component -- lần đầu làm chuyện ấy!

Chúng ta cũng tìm hiểu một chút về các hook. Hook là các hàm cho phép bạn "móc" các tính năng của React vào function components. Tên của chúng luôn bắt đầu với `use`, có nhiều hook mà chúng ta chưa khám phá.

**Bây giờ hãy bắt đầu [tìm hiểu Hoook kế tiếp: `useEffect`.](/docs/hooks-effect.html)** Nó cho phép bạn thực hiện side effects bên trong components, nó tưong tự như các phương thức lifecycle bên trong class.
