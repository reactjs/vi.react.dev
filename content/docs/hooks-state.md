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
      <p>Bạn đã bấm {count} lần</p>
      <button onClick={() => setCount(count + 1)}>
        Bấm vào tôi
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

**Hook là gì?** Hook là một hàm đặc biệt cho phép bạn sử dụng các tính năng của React (mà không cần phải tạo class). Ví dụ, `useState` là một hook cho phép bạn thêm React state vào function components. Chúng ta sẽ tìm hiểu các hook còn lại sau.

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

**What do we pass to `useState` as an argument?** The only argument to the `useState()` Hook is the initial state. Unlike with classes, the state doesn't have to be an object. We can keep a number or a string if that's all we need. In our example, we just want a number for how many times the user clicked, so pass `0` as initial state for our variable. (If we wanted to store two different values in state, we would call `useState()` twice.)
**What do we pass to `useState` as an argument?** The only argument to the `useState()` Hook is the initial state. Unlike with classes, the state doesn't have to be an object. We can keep a number or a string if that's all we need. In our example, we just want a number for how many times the user clicked, so pass `0` as initial state for our variable. (If we wanted to store two different values in state, we would call `useState()` twice.)

**What does `useState` return?** It returns a pair of values: the current state and a function that updates it. This is why we write `const [count, setCount] = useState()`. This is similar to `this.state.count` and `this.setState` in a class, except you get them in a pair. If you're not familiar with the syntax we used, we'll come back to it [at the bottom of this page](/docs/hooks-state.html#tip-what-do-square-brackets-mean).

Now that we know what the `useState` Hook does, our example should make more sense:

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
```

We declare a state variable called `count`, and set it to `0`. React will remember its current value between re-renders, and provide the most recent one to our function. If we want to update the current `count`, we can call `setCount`.

>Note
>
>You might be wondering: why is `useState` not named `createState` instead?
>
>"Create" wouldn't be quite accurate because the state is only created the first time our component renders. During the next renders, `useState` gives us the current state. Otherwise it wouldn't be "state" at all! There's also a reason why Hook names *always* start with `use`. We'll learn why later in the [Rules of Hooks](/docs/hooks-rules.html).

## Reading State {#reading-state}

When we want to display the current count in a class, we read `this.state.count`:

```js
  <p>You clicked {this.state.count} times</p>
```

In a function, we can use `count` directly:


```js
  <p>You clicked {count} times</p>
```

## Updating State {#updating-state}

In a class, we need to call `this.setState()` to update the `count` state:

```js{1}
  <button onClick={() => this.setState({ count: this.state.count + 1 })}>
    Click me
  </button>
```

In a function, we already have `setCount` and `count` as variables so we don't need `this`:

```js{1}
  <button onClick={() => setCount(count + 1)}>
    Click me
  </button>
```

## Recap {#recap}

Let's now **recap what we learned line by line** and check our understanding.

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
 8:        <p>You clicked {count} times</p>
 9:        <button onClick={() => setCount(count + 1)}>
10:         Click me
11:        </button>
12:      </div>
13:    );
14:  }
```

* **Line 1:** We import the `useState` Hook from React. It lets us keep local state in a function component.
* **Line 4:** Inside the `Example` component, we declare a new state variable by calling the `useState` Hook. It returns a pair of values, to which we give names. We're calling our variable `count` because it holds the number of button clicks. We initialize it to zero by passing `0` as the only `useState` argument. The second returned item is itself a function. It lets us update the `count` so we'll name it `setCount`.
* **Line 9:** When the user clicks, we call `setCount` with a new value. React will then re-render the `Example` component, passing the new `count` value to it.

This might seem like a lot to take in at first. Don't rush it! If you're lost in the explanation, look at the code above again and try to read it from top to bottom. We promise that once you try to "forget" how state works in classes, and look at this code with fresh eyes, it will make sense.

### Tip: What Do Square Brackets Mean? {#tip-what-do-square-brackets-mean}

You might have noticed the square brackets when we declare a state variable:

```js
  const [count, setCount] = useState(0);
```

The names on the left aren't a part of the React API. You can name your own state variables:

```js
  const [fruit, setFruit] = useState('banana');
```

This JavaScript syntax is called ["array destructuring"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring). It means that we're making two new variables `fruit` and `setFruit`, where `fruit` is set to the first value returned by `useState`, and `setFruit` is the second. It is equivalent to this code:

```js
  var fruitStateVariable = useState('banana'); // Returns a pair
  var fruit = fruitStateVariable[0]; // First item in a pair
  var setFruit = fruitStateVariable[1]; // Second item in a pair
```

When we declare a state variable with `useState`, it returns a pair — an array with two items. The first item is the current value, and the second is a function that lets us update it. Using `[0]` and `[1]` to access them is a bit confusing because they have a specific meaning. This is why we use array destructuring instead.

>Note
>
>You might be curious how React knows which component `useState` corresponds to since we're not passing anything like `this` back to React. We'll answer [this question](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components) and many others in the FAQ section.

### Tip: Using Multiple State Variables {#tip-using-multiple-state-variables}

Declaring state variables as a pair of `[something, setSomething]` is also handy because it lets us give *different* names to different state variables if we want to use more than one:

```js
function ExampleWithManyStates() {
  // Declare multiple state variables!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```

In the above component, we have `age`, `fruit`, and `todos` as local variables, and we can update them individually:

```js
  function handleOrangeClick() {
    // Similar to this.setState({ fruit: 'orange' })
    setFruit('orange');
  }
```

You **don't have to** use many state variables. State variables can hold objects and arrays just fine, so you can still group related data together. However, unlike `this.setState` in a class, updating a state variable always *replaces* it instead of merging it.

We provide more recommendations on splitting independent state variables [in the FAQ](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables).

## Next Steps {#next-steps}

On this page we've learned about one of the Hooks provided by React, called `useState`. We're also sometimes going to refer to it as the "State Hook". It lets us add local state to React function components -- which we did for the first time ever!

We also learned a little bit more about what Hooks are. Hooks are functions that let you "hook into" React features from function components. Their names always start with `use`, and there are more Hooks we haven't seen yet.

**Now let's continue by [learning the next Hook: `useEffect`.](/docs/hooks-effect.html)** It lets you perform side effects in components, and is similar to lifecycle methods in classes.
