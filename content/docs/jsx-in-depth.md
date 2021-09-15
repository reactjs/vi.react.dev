---
id: jsx-in-depth
title: JSX Chuyên Sâu
permalink: docs/jsx-in-depth.html
redirect_from:
  - "docs/jsx-spread.html"
  - "docs/jsx-gotchas.html"
  - "tips/if-else-in-JSX.html"
  - "tips/self-closing-tag.html"
  - "tips/maximum-number-of-jsx-root-nodes.html"
  - "tips/children-props-type.html"
  - "docs/jsx-in-depth-zh-CN.html"
  - "docs/jsx-in-depth-ko-KR.html"
---

Về cơ bản, JSX chỉ cung cấp cú pháp đặc biệt cho hàm `React.createElement(component, props, ...children)`. Đoạn mã JSX:

```js
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```

được biên dịch thành:

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```

Bạn cũng có thể sử dụng dạng thẻ tự đóng(self-closing) nếu không có children. Do vậy:

```js
<div className="sidebar" />
```

được biên dịch thành:

```js
React.createElement(
  'div',
  {className: 'sidebar'}
)
```

Nếu bạn muốn kiểm tra xem cách mà JSX được chuyển đổi sang JavaScript, bạn có thể thử [the online Babel compiler](babel://jsx-simple-example).

## Chỉ Định Kiểu React Element {#specifying-the-react-element-type}

Phần đầu tiên của một thẻ JSX xác định kiểu của React element.

Các kiểu viết hoa thể hiện rằng thẻ JSX đang ám chỉ tới một React component. Những thẻ này được biên dịch thành một tham chiếu trực tiếp đến biến được đặt tên, do vậy nếu bạn sử dụng biểu thức JSX `<Foo />`, `Foo` phải nằm trong scope.

### React Phải Nằm trong Scope {#react-must-be-in-scope}

Vì JSX đuợc biên dịch thành lời gọi tới `React.createElement`, nên thư viện `React` phải luôn nằm trong scope mã JSX của bạn.

Ví dụ, cả hai import đều cần thiết trong đoạn mã này, mặc dù `React` và `CustomButton` không được tham chiếu trực tiếp từ JavaScript:

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

Nếu bạn không sử dụng một trình đóng gói JavaScript(JavaScript bundler) và tải React từ một thẻ  `<script>`, thì `React` đã có sẵn trong scope toàn cục(global).

### Sử Dụng Ký Hiệu Chấm cho JSX Type {#using-dot-notation-for-jsx-type}

Bạn cũng có thể tham chiếu đến một React component sử dụng ký hiệu chấm từ JSX. Điều này rất tiện lợi nếu bạn có một module export nhiều React component. Ví dụ, nếu `MyComponents.DatePicker` là một component, bạn có thể sử dụng nó trực tiếp từ JSX với:

```js{10}
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### Component Người Dùng Tự Định Nghĩa Phải Được Viết Hoa {#user-defined-components-must-be-capitalized}

Khi một kiểu element bắt đầu với chữ cái thường, nó đang ám chỉ đến một built-in component như `<div>` hay `<span>` và kết quả là một chuỗi `'div'` hay `'span'` được truyền tới `React.createElement`. Các kiểu bắt đầu với chữ cái viết hoa như `<Foo />` được biên dịch thành `React.createElement(Foo)` và tương ứng với một component đã được định nghĩa hoặc đã được import vào tệp JavaScript của bạn.

Chúng tôi khuyến khích đặt tên cho các component với chữ cái đầu viết hoa. Nếu bạn có một component bắt đầu với chữ cái viết thường, gán nó cho một biến được viết hoa trước khi sử dụng nó trong JSX.

Ví dụ, đoạn mã bên dưới sẽ không chạy như mong đợi:

```js{3,4,10,11}
import React from 'react';

// Sai! Đây là một component và nên được viết hoa:
function hello(props) {
  // Chính xác! Sử dụng <div> là hợp lệ vì div là một thẻ HTML:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Sai! React nghĩ <hello /> là một thẻ HTML vì nó không được viết hoa chữ cái đầu:
  return <hello toWhat="World" />;
}
```

Để khắc phục vấn đề này, chúng tôi sẽ đổi tên `hello` thành `Hello` và sử dụng `<Hello />` khi tham chiếu đến nó:

```js{3,4,10,11}
import React from 'react';

// Chính xác! Đây là một component và nên được viết hoa:
function Hello(props) {
  // Chính xác! Sử dụng <div> là hợp lệ vì div là một thẻ HTML:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Chính xác! React biết <Hello /> là một component vì nó được viết hoa.
  return <Hello toWhat="World" />;
}
```

### Chọn Kiểu tại Thời Điểm Thực Thi {#choosing-the-type-at-runtime}

Bạn không thể sử dụng một biểu thức tổng hợp để làm một kiểu React element. Nếu bạn muốn sử dụng một biểu thức tổng hợp để thể hiện kiểu của element, chỉ cần gán nó cho một biến được viết hoa trước. Vấn đề này thường xuất hiện khi bạn muốn render một component khác dựa trên một prop:

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Sai! JSX type không thể là một biểu thức.
  return <components[props.storyType] story={props.story} />;
}
```

Để khắc phục vấn đề này, chúng tôi sẽ gán kiểu cho một biến được viết hoa trước:

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Chính xác! JSX type có thể là một biến được viết hoa.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## Props trong JSX {#props-in-jsx}

Có vài cách khác nhau để chỉ định props trong JSX.

### Biểu thức JavaScript làm Props {#javascript-expressions-as-props}

Bạn có thể truyền bất kỳ biểu thức JavaScript nào làm prop, bằng cách bao quanh nó với  `{}`. Ví dụ, trong đoạn mã JSX bên dưới:

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

Đối với `MyComponent`, giá trị của `props.foo` sẽ là `10` vì biểu thức `1 + 2 + 3 + 4` đã được tính toán.

Câu lệnh `if` và vòng lặp `for` không phải là biểu thức trong JavaScript, do vậy chúng không thể được sử dụng trong JSX một cách trực tiếp. Thay vào đó, bạn có thể đặt chúng ở đoạn mã xung quanh. Ví dụ:

```js{3-7}
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>odd</i>;
  }
  return <div>{props.number} is an {description} number</div>;
}
```

Bạn có thể tìm hiểu thêm về [render có điều kiện](/docs/conditional-rendering.html) vầ [vòng lặp](/docs/lists-and-keys.html) ở những mục tương ứng.

### String Literals {#string-literals}

Bạn có thể truyền một string literal làm một prop. Hai biểu thức JSX bên dưới là tương đương:

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

Khi bạn truyền một string literal, giá trị của nó là HTML-unescaped. Do vậy hai biểu thức JSX bên dưới là tương đương:

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

Hành vi này thường không phù hợp. Nó chỉ được đề cập ở đây cho đầy đủ.

### Props Mặc Định là "True" {#props-default-to-true}

Nếu bạn không truyền giá trị cho một prop, nó sẽ được mặc định là `true`. Hai biểu thức JSX bên dưới là tương đương:

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

Nhìn chung, chúng tôi không khuyến khích việc *không* truyền giá trị cho một prop, vì nó có thể gây nhầm lẫn với [ES6 object shorthand](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) `{foo}` là viết tắt của `{foo: foo}` thay vì `{foo: true}`. Hành vi này tồn tại để phù hợp với hành vi của HTML.

### Spread Attributes {#spread-attributes}

Nếu bạn đã có một `props` là một object, và bạn muốn truyền nó trong JSX, bạn có thể sử dụng `...` như một toán tử "spread" để truyền toàn bộ props object. Hai component bên dưới là tương đương:

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

Bạn cũng có thể chọn một vài props mà component của bạn sẽ sử dụng trong khi truyền toàn bộ những props còn lại sử dụng toán tử spread.

```js{2}
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        Hello World!
      </Button>
    </div>
  );
};
```

Ở ví dụ bên trên, `kind` prop được sử dụng một cách an toàn và *không* bị truyền tới `<button>` element trong DOM. Tất cả props còn lại được truyền thông qua `...other` object làm cho component này thực sự linh hoạt. Bạn có thể thấy rằng nó truyền `onClick` và `children` props.

Spread attributes có thể hữu dụng nhưng chúng cũng dễ dàng khiển bạn truyền những props không cần thiết tới những component mà không quan tâm tới những props đó hoặc truyền những HTML attribute không hợp lệ tới DOM. Chúng tôi khuyến khích sử dụng cú pháp này một cách hạn chế. 

## Children trong JSX {#children-in-jsx}

Trong biểu thức JSX mà chứa cả thẻ mở và thẻ đóng, nội dung nằm giữa hai thẻ được truyền như một prop đặc biệt: `props.children`. Có vài cách khác nhau để truyền children:

### String Literals {#string-literals-1}

Bạn có thể đặt một chuỗi ký tự giữa thẻ đóng và thẻ mở và `props.children` sẽ là chuỗi ký tự đó. Điều này rất hữu ích cho nhiều built-in HTML elements. Ví dụ:

```js
<MyComponent>Hello world!</MyComponent>
```

Đây là một JSX hợp lệ, và `props.children` trong `MyComponent` sẽ là chuỗi ký tự `"Hello world!"`. HTML là unescaped, do vậy bạn có thể viết JSX giống như cách mà bạn viết HTML:

```html
<div>This is valid HTML &amp; JSX at the same time.</div>
```

JSX loại bỏ khoẳng trắng ở đầu và cuối của một dòng. Nó cũng loại bỏ dòng trống. Dòng mới liền kề với các thẻ sẽ bị loại bỏ; dòng mới ở giữa của string literals được thay thế bằng một khoảng trắng. Do vậy tất cả được render ra kết quả giống nhau:

```js
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

### JSX Children {#jsx-children}

Bạn có thể cung cấp nhiều JSX elements làm children. Điều này rất hữu ích để hiển thị các component lồng nhau:

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

Bạn có thể kết hợp nhiều kiểu children, do vậy bạn có thể sử dụng string literals cùng với JSX children. Đây là một cách khác mà JSX tương tự như HTML, cả hai đều là JSX hợp lệ và HTML hợp lệ:

```html
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

Một React component cũng có thể trả về một mảng các element:

```js
render() {
  // Không cần bao list items trong một element khác!
  return [
    // Đừng có mà quên key đấy :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### Biểu Thức JavaScript làm Children {#javascript-expressions-as-children}

Bạn có thể truyền biểu thức JavaScript bất kỳ làm children, bằng cách bao quanh nó với `{}`. Ví dụ, những biểu thức bên dưới là tương đương:

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

Điều này khá hữu ích khi render một danh sách các biểu thức JSX với độ dài bất kỳ. Ví dụ, đoạn mã render một danh sách HTML:

```js{2,9}
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

Các biểu thức JavaScript có thể được kết hợp với những loại children khác. Điều này khá hữu ích thay cho string templates:

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### Hàm làm Children {#functions-as-children}

Thông thường, các biểu thức JavaScript khi chèn vào trong JSX sẽ được coi như là một chuỗi, một hoặc một danh sách các React element. Tuy nhiên, `props.children` hoạt động tương tự như những prop khác ở chỗ là nó có thể truyền bất kỳ loại dữ liệu nào, không phải chỉ là những loại dữ liệu mà React biết cách để render. Ví dụ, nếu bạn có một component tùy chỉnh, bạn có thể để nó nhận một callback làm `props.children`:

```js{4,13}
// Gọi children callback numTimes để tạo ra một component lặp
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

Children truyền cho một component tùy chỉnh có thể là bất cứ thứ gì, miễn là component đó biến đổi chúng thành thứ mà React có thể hiểu được trước khi render. Cách sử dụng này không phổ biến, nhưng nó vẫn hoạt động nếu bạn muốn mở rộng khả năng của JSX.

### Booleans, Null, và Undefined Được Bỏ Qua {#booleans-null-and-undefined-are-ignored}

`false`, `null`, `undefined`, và `true` đều là children hợp lệ. Chúng đơn giản là không được render. Những biểu thức JSX này đều sẽ được render ra kết quả giống nhau:

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

Điều này có thể hữu ích để render có điều kiện các React element. Đoạn mã JSX bên dưới render `<Header />` component chỉ khi `showHeader` là `true`:

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

Có một lưu ý là một vài [giá trị "falsy"](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), như số `0`, thì vẫn được render bởi React. Ví dụ, đoạn mã bên dưới sẽ không hoạt động như bạn mong muốn vì `0` sẽ được in ra khi `props.messages` là một mảng rỗng:

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

Để xử lý vấn đề này, hãy đảm bảo rằng những biểu thức nằm trước `&&` luôn là boolean:

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

Ngược lại, nếu bạn muốn một giá trị như `false`, `true`, `null`, hoặc `undefined` xuất hiện ở đầu ra, bạn phải [chuyển đổi nó thành một chuỗi ký tự](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion) trước:

```js{2}
<div>
  My JavaScript variable is {String(myVariable)}.
</div>
```
