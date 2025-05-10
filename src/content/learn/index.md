---
title: Bắt đầu nhanh
---

<Intro>

Chào mừng bạn đến với tài liệu React! Trang này sẽ cung cấp cho bạn phần giới thiệu về 80% các khái niệm React mà bạn sẽ sử dụng hàng ngày.

</Intro>

<YouWillLearn>

- Cách tạo và lồng các component
- Cách thêm markup và style
- Cách hiển thị dữ liệu
- Cách render điều kiện và danh sách
- Cách phản hồi sự kiện và cập nhật giao diện
- Cách chia sẻ dữ liệu giữa các component

</YouWillLearn>

## Tạo và lồng các component {/*components*/}

Ứng dụng React được xây dựng từ *component*. Một component là một phần của giao diện người dùng (UI) có logic và giao diện riêng. Một component có thể nhỏ như một nút bấm, hoặc lớn như cả một trang.

Các component trong React là các hàm JavaScript trả về markup:

```js
function MyButton() {
  return (
    <button>Tôi là một nút bấm</button>
  );
}
```

Các từ khóa `export default` chỉ định component chính trong tệp. Nếu bạn không quen với cú pháp JavaScript nào đó, [MDN](https://developer.mozilla.org/en-US/docs/Web/javascript/reference/statements/export) và [javascript.info](https://javascript.info/import-export) có các tài liệu tham khảo tuyệt vời.

## Viết markup với JSX {/*writing-markup-with-jsx*/}

Cú pháp markup bạn thấy ở trên được gọi là *JSX*. Nó là tùy chọn, nhưng hầu hết các dự án React sử dụng JSX vì sự tiện lợi của nó. Tất cả các [công cụ chúng tôi khuyên dùng để phát triển cục bộ](/learn/installation) đều hỗ trợ JSX ngay lập tức.

JSX chặt chẽ hơn HTML. Bạn phải đóng các thẻ như `<br />`. Component của bạn cũng không thể trả về nhiều thẻ JSX. Bạn phải bọc chúng trong một phần tử cha chung, như `<div>...</div>` hoặc một trình bao bọc `<>...</>` trống:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>Giới thiệu</h1>
      <p>Xin chào.<br />Bạn khỏe không?</p>
    </>
  );
}
```

Nếu bạn có nhiều HTML cần chuyển sang JSX, bạn có thể sử dụng [công cụ chuyển đổi trực tuyến.](https://transform.tools/html-to-jsx)

## Thêm kiểu dáng {/*adding-styles*/}

Trong React, bạn chỉ định một lớp CSS với `className`. Nó hoạt động theo cùng một cách như thuộc tính [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) HTML:

```js
<img className="avatar" />
```

Sau đó, bạn viết các quy tắc CSS cho nó trong một tệp CSS riêng:

```css
/* Trong CSS của bạn */
.avatar {
  border-radius: 50%;
}
```

React không quy định cách bạn thêm tệp CSS. Trong trường hợp đơn giản nhất, bạn sẽ thêm thẻ [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) vào HTML của bạn. Nếu bạn sử dụng một công cụ xây dựng hoặc một framework, hãy tham khảo tài liệu của nó để tìm hiểu cách thêm một tệp CSS vào dự án của bạn.

## Hiển thị dữ liệu {/*displaying-data*/}

JSX cho phép bạn đưa markup vào JavaScript. Dấu ngoặc nhọn cho phép bạn "thoát trở lại" JavaScript để bạn có thể nhúng một số biến từ mã của bạn và hiển thị nó cho người dùng. Ví dụ: điều này sẽ hiển thị `user.name`:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

Bạn cũng có thể "thoát vào JavaScript" từ các thuộc tính JSX, nhưng bạn phải sử dụng dấu ngoặc nhọn *thay vì* dấu ngoặc kép. Ví dụ: `className="avatar"` chuyển chuỗi `"avatar"` làm lớp CSS, nhưng `src={user.imageUrl}` đọc giá trị biến JavaScript `user.imageUrl` và sau đó chuyển giá trị đó làm thuộc tính `src`:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

Bạn cũng có thể đặt các biểu thức phức tạp hơn bên trong dấu ngoặc nhọn JSX, ví dụ: [nối chuỗi](https://javascript.info/operators#string-concatenation-with-binary):

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

Trong ví dụ trên, `style={{}}` không phải là một cú pháp đặc biệt, mà là một đối tượng `{}` thông thường bên trong dấu ngoặc nhọn JSX `style={ }`. Bạn có thể sử dụng thuộc tính `style` khi kiểu dáng của bạn phụ thuộc vào các biến JavaScript.

## Render có điều kiện {/*conditional-rendering*/}

Trong React, không có cú pháp đặc biệt để viết các điều kiện. Thay vào đó, bạn sẽ sử dụng các kỹ thuật tương tự như khi viết mã JavaScript thông thường. Ví dụ: bạn có thể sử dụng câu lệnh [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) để bao gồm JSX có điều kiện:

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

Nếu bạn thích mã ngắn gọn hơn, bạn có thể sử dụng [toán tử `?` có điều kiện.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) Không giống như `if`, nó hoạt động bên trong JSX:

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

Khi bạn không cần nhánh `else`, bạn cũng có thể sử dụng cú pháp [logic `&&` ngắn hơn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation):

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

Tất cả các phương pháp này cũng hoạt động để chỉ định các thuộc tính có điều kiện. Nếu bạn không quen thuộc với một số cú pháp JavaScript này, bạn có thể bắt đầu bằng cách luôn sử dụng `if...else`.

## Render danh sách {/*rendering-lists*/}

Bạn sẽ dựa vào các tính năng JavaScript như [`for` loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) và [array `map()` function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) để render danh sách các component.

Ví dụ: giả sử bạn có một mảng các sản phẩm:

```js
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

Bên trong component của bạn, hãy sử dụng hàm `map()` để chuyển đổi một mảng các sản phẩm thành một mảng các mục `<li>`:

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

Lưu ý cách `<li>` có thuộc tính `key`. Đối với mỗi mục trong danh sách, bạn nên chuyển một chuỗi hoặc một số xác định duy nhất mục đó giữa các mục cùng cấp của nó. Thông thường, một key sẽ đến từ dữ liệu của bạn, chẳng hạn như ID cơ sở dữ liệu. React sử dụng các key của bạn để biết điều gì đã xảy ra nếu sau này bạn chèn, xóa hoặc sắp xếp lại các mục.

<Sandpack>

```js
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## Phản hồi các sự kiện {/*responding-to-events*/}

Bạn có thể phản hồi các sự kiện bằng cách khai báo các hàm *xử lý sự kiện* bên trong các component của bạn:

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

Lưu ý cách `onClick={handleClick}` không có dấu ngoặc đơn ở cuối! Không _gọi_ hàm xử lý sự kiện: bạn chỉ cần *truyền nó xuống*. React sẽ gọi trình xử lý sự kiện của bạn khi người dùng nhấp vào nút.

## Cập nhật màn hình {/*updating-the-screen*/}

Thông thường, bạn sẽ muốn component của mình "ghi nhớ" một số thông tin và hiển thị nó. Ví dụ: có thể bạn muốn đếm số lần một nút được nhấp. Để thực hiện việc này, hãy thêm *state* vào component của bạn.

Đầu tiên, hãy nhập [`useState`](/reference/react/useState) từ React:

```js
import { useState } from 'react';
```

Bây giờ bạn có thể khai báo một *biến trạng thái* bên trong component của bạn:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

Bạn sẽ nhận được hai thứ từ `useState`: trạng thái hiện tại (`count`) và hàm cho phép bạn cập nhật nó (`setCount`). Bạn có thể đặt cho chúng bất kỳ tên nào, nhưng quy ước là viết `[something, setSomething]`.

Lần đầu tiên nút được hiển thị, `count` sẽ là `0` vì bạn đã chuyển `0` cho `useState()`. Khi bạn muốn thay đổi trạng thái, hãy gọi `setCount()` và chuyển giá trị mới cho nó. Nhấp vào nút này sẽ tăng bộ đếm:

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

React sẽ gọi lại hàm component của bạn. Lần này, `count` sẽ là `1`. Sau đó nó sẽ là `2`. Vân vân.

Nếu bạn render cùng một component nhiều lần, mỗi component sẽ có state riêng. Nhấp vào từng nút riêng biệt:

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

Lưu ý cách mỗi nút "ghi nhớ" trạng thái `count` riêng của nó và không ảnh hưởng đến các nút khác.

## Sử dụng Hooks {/*using-hooks*/}

Các hàm bắt đầu bằng `use` được gọi là *Hooks*. `useState` là một Hook tích hợp được cung cấp bởi React. Bạn có thể tìm thấy các Hook tích hợp khác trong [API reference.](/reference/react) Bạn cũng có thể viết Hooks của riêng mình bằng cách kết hợp các Hook hiện có.

Hooks có tính hạn chế hơn các hàm khác. Bạn chỉ có thể gọi Hooks *ở đầu* các component của bạn (hoặc các Hook khác). Nếu bạn muốn sử dụng `useState` trong một điều kiện hoặc một vòng lặp, hãy trích xuất một component mới và đặt nó ở đó.

## Chia sẻ dữ liệu giữa các component {/*sharing-data-between-components*/}

Trong ví dụ trước, mỗi `MyButton` có `count` độc lập của riêng nó và khi mỗi nút được nhấp, chỉ có `count` cho nút được nhấp thay đổi:

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. Both MyButton components contain a count with value zero.">

Ban đầu, trạng thái `count` của mỗi `MyButton` là `0`

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="The same diagram as the previous, with the count of the first child MyButton component highlighted indicating a click with the count value incremented to one. The second MyButton component still contains value zero." >

`MyButton` đầu tiên cập nhật `count` của nó thành `1`

</Diagram>

</DiagramGroup>

Tuy nhiên, thông thường bạn sẽ cần các component *chia sẻ dữ liệu và luôn cập nhật cùng nhau*.

Để làm cho cả hai component `MyButton` hiển thị cùng một `count` và cập nhật cùng nhau, bạn cần di chuyển trạng thái từ các nút riêng lẻ "lên trên" đến component gần nhất chứa tất cả chúng.

Trong ví dụ này, đó là `MyApp`:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. MyApp contains a count value of zero which is passed down to both of the MyButton components, which also show value zero." >

Ban đầu, trạng thái `count` của `MyApp` là `0` và được truyền xuống cho cả hai con

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="The same diagram as the previous, with the count of the parent MyApp component highlighted indicating a click with the value incremented to one. The flow to both of the children MyButton components is also highlighted, and the count value in each child is set to one indicating the value was passed down." >

Khi nhấp vào, `MyApp` cập nhật trạng thái `count` của nó thành `1` và truyền nó xuống cho cả hai con

</Diagram>

</DiagramGroup>

Bây giờ, khi bạn nhấp vào một trong hai nút, `count` trong `MyApp` sẽ thay đổi, điều này sẽ thay đổi cả hai `count` trong `MyButton`. Đây là cách bạn có thể thể hiện điều này trong mã.

Đầu tiên, *di chuyển trạng thái lên* từ `MyButton` vào `MyApp`:

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... we're moving code from here ...
}

```

Sau đó, *truyền trạng thái xuống* từ `MyApp` cho mỗi `MyButton`, cùng với trình xử lý nhấp được chia sẻ. Bạn có thể truyền thông tin đến `MyButton` bằng cách sử dụng dấu ngoặc nhọn JSX, giống như bạn đã làm trước đây với các thẻ tích hợp như `<img>`:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

Thông tin bạn truyền xuống như thế này được gọi là _props_. Bây giờ component `MyApp` chứa trạng thái `count` và trình xử lý sự kiện `handleClick` và *truyền cả hai xuống dưới dạng props* cho mỗi nút.

Cuối cùng, hãy thay đổi `MyButton` để *đọc* các props mà bạn đã truyền từ component mẹ của nó:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

Khi bạn nhấp vào nút, trình xử lý `onClick` sẽ kích hoạt. Prop `onClick` của mỗi nút được đặt thành hàm `handleClick` bên trong `MyApp`, vì vậy mã bên trong nó sẽ chạy. Mã đó gọi `setCount(count + 1)`, tăng biến trạng thái `count`. Giá trị `count` mới được truyền dưới dạng một prop cho mỗi nút, vì vậy tất cả chúng đều hiển thị giá trị mới. Điều này được gọi là "lifting state up". Bằng cách di chuyển trạng thái lên, bạn đã chia sẻ nó giữa các component.

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## Các bước tiếp theo {/*next-steps*/}

Đến bây giờ, bạn đã biết những điều cơ bản về cách viết mã React!

Hãy xem [Tutorial](/learn/tutorial-tic-tac-toe) để đưa chúng vào thực tế và xây dựng ứng dụng mini đầu tiên của bạn với React.
