---
title: Bắt đầu nhanh
---

<Intro>

Chào mừng bạn đến với tài liệu React! Trang này sẽ giới thiệu cho bạn về 80% các khái niệm của React mà bạn sẽ sử dụng hàng ngày.

</Intro>

<YouWillLearn>

- Cách tạo và lồng ghép các thành phần (components)
- Cách thêm markup và styles
- Cách hiển thị dữ liệu
- Cách render điều kiện và danh sách
- Cách phản ứng với các sự kiện và cập nhật màn hình
- Cách chia sẻ dữ liệu giữa các thành phần

</YouWillLearn>

## Tạo và lồng ghép các thành phần (components) {/*components*/}

Ứng dụng React được tạo thành từ *các thành phần (components)*. Một thành phần là một phần của giao diện người dùng (UI) có logic và giao diện riêng. Một thành phần có thể nhỏ như một nút bấm hoặc lớn như một trang web hoàn chỉnh.

Các thành phần (components) React là các hàm JavaScript trả về markup:

```js
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}
```

Bây giờ bạn đã khai báo component `MyButton`, bạn có thể lồng nó vào một thành phần (component) khác:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

Lưu ý rằng `<MyButton />` bắt đầu bằng một chữ cái in hoa. Đó là cách bạn biết đó là một thành phần (component) React. Tên các thành phần (component) React luôn phải bắt đầu bằng một chữ cái in hoa, trong khi các thẻ HTML phải là chữ thường.

Hãy nhìn kết quả bên dưới:

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

Từ khóa `export default` chỉ thành phần (component) chính trong file. Nếu bạn không quen thuộc với vài cú pháp của Javascript thì [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) và [javascript.info](https://javascript.info/import-export) là một nguồn tham khảo tuyệt vời.

## Viết markup với JSX {/*writing-markup-with-jsx*/}

Cú pháp đánh dấu bạn đã thấy ở trên được gọi là *JSX*. Nó không bắt buộc, nhưng hầu hết các dự án React sử dụng JSX vì sự tiện lợi của nó. Tất cả [các công cụ chúng tôi giới thiệu cho việc phát triển cục bộ](/learn/installation) đều hỗ trợ JSX từ đầu.

JSX nghiêm ngặt hơn HTML. Bạn phải đóng thẻ như `<br />`. Thành phần (component) của bạn cũng không thể trả về nhiều thẻ JSX. Bạn phải bọc chúng vào một thẻ cha chung, như `<div>...</div>` hoặc một bọc rỗng `<>...</>`:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

Nếu bạn có nhiều HTML cần chuyển sang JSX, bạn có thể sử dụng một [trình chuyển đổi trực tuyến.](https://transform.tools/html-to-jsx)

## Thêm styles {/*adding-styles*/}

Trong React, bạn chỉ định một lớp CSS bằng `className`. Nó hoạt động giống như thuộc tính [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) của HTML:

```js
<img className="avatar" />
```

Sau đó, bạn viết các quy tắc CSS cho nó trong một tệp (file) CSS riêng biệt:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

React không quy định cách bạn thêm các tệp CSS. Trong trường hợp đơn giản nhất, bạn sẽ thêm một thẻ [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) vào HTML của bạn. Nếu bạn sử dụng một công cụ xây dựng hoặc một framework, hãy tham khảo tài liệu của nó để biết cách thêm một tệp CSS vào dự án của bạn.

## Hiển thị dữ liệu {/*displaying-data*/}

JSX cho phép bạn đặt cú pháp đánh dấu (markup) vào JavaScript. Dấu ngoặc nhọn cho phép bạn "trở lại" vào JavaScript để bạn có thể nhúng một biến từ mã của bạn và hiển thị nó cho người dùng. Ví dụ, điều này sẽ hiển thị `user.name`:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```


Bạn cũng có thể "trở lại JavaScript" từ các thuộc tính JSX, nhưng bạn phải sử dụng dấu ngoặc nhọn *thay vì* dấu ngoặc kép. Ví dụ, `className="avatar"` truyền chuỗi `"avatar"` làm lớp CSS, nhưng `src={user.imageUrl}` đọc giá trị biến JavaScript `user.imageUrl`, và sau đó truyền giá trị đó làm thuộc tính `src`:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

Bạn cũng có thể đặt các biểu thức phức tạp hơn bên trong các dấu ngoặc nhọn của JSX, ví dụ như [kết nối chuỗi](https://javascript.info/operators#string-concatenation-with-binary):

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

Trong ví dụ trên, `style={{}}` không phải là một cú pháp đặc biệt, mà là một đối tượng `{}` bình thường bên trong các dấu ngoặc nhọn `style={ }` của JSX. Bạn có thể sử dụng thuộc tính style khi các kiểu của bạn phụ thuộc vào biến JavaScript.

## Hiển thị có điều kiện {/*conditional-rendering*/}

Trong React, không có cú pháp đặc biệt cho việc viết các điều kiện. Thay vào đó, bạn sẽ sử dụng các kỹ thuật tương tự như khi viết mã JavaScript thông thường. Ví dụ, bạn có thể sử dụng một câu lệnh [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) để điều kiện bao gồm JSX:

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

Nếu bạn muốn mã gọn hơn, bạn có thể sử dụng [điều kiện `?` toán tử.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator). Khác với `if`, nó hoạt động bên trong JSX:

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

Khi bạn không cần nhánh `else`, bạn cũng có thể sử dụng cách ngắn hơn [điều kiện `&&` logic ngắn gọn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation):

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

Tất cả các cách tiếp cận này cũng hoạt động để chỉ định thuộc tính điều kiện. Nếu bạn không quen với một số cú pháp JavaScript này, bạn có thể bắt đầu bằng cách luôn sử dụng `if...else`.

## Rendering lists {/*rendering-lists*/}

Bạn sẽ dựa trên những tính năng của JavaScript như [vòng lặp `for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) và [hàm về chuỗi `map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) để hiển thị danh sách của các thành phần (components).

Ví dụ, giả sử bạn có một mảng các sản phẩm như bên dưới:

```js
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

Bên trong component của bạn, sử dụng hàm `map()` để chuyển đổi một mảng các sản phẩm thành một chuỗi danh sách các mục `<li>`:

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

Lưu ý cách `<li>` có một thuộc tính `key`. Đối với mỗi mục trong danh sách, bạn nên truyền một chuỗi hoặc một số độc nhất xác định mục đó trong số anh em của nó. Thông thường, một key nên được lấy từ dữ liệu của bạn, chẳng hạn như một ID trong cơ sở dữ liệu. React sử dụng các key của bạn để biết điều gì đã xảy ra nếu sau này bạn chèn, xóa hoặc sắp xếp lại các mục.

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

## Xử lý các sự kiện {/*responding-to-events*/}

Bạn có thể xử lý các sự kiện bằng cách khai báo các *hàm xử lý sự kiện* bên trong các component của bạn:

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

Lưu ý rằng `onClick={handleClick}` không có dấu ngoặc đơn ở cuối! _Đừng gọi_ hàm xử lý sự kiện: bạn chỉ cần *truyền nó xuống*. React sẽ gọi hàm xử lý sự kiện của bạn khi người dùng nhấp vào nút.

## Cập nhật màn hình {/*updating-the-screen*/}

Thường thì, bạn sẽ muốn component của mình "nhớ" một số thông tin và hiển thị nó. Ví dụ, có thể bạn muốn đếm số lần một nút được nhấp. Để làm điều này, thêm *trạng thái* vào component của bạn.

Trước tiên, nhập (import) [`useState`](/reference/react/useState) từ React:

```js
import { useState } from 'react';
```

Bây giờ bạn có thể khai báo một *biến trạng thái* trong component của bạn:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

Bạn sẽ nhận được hai thứ từ `useState`: trạng thái hiện tại (`count`), và hàm cho phép bạn cập nhật nó (`setCount`). Bạn có thể đặt tên cho chúng bất kỳ tên nào, nhưng quy ước là viết dạng `[cái_gì_đó, setCaiGiDo]`.

Lần đầu tiên nút được hiển thị, `count` sẽ là `0` vì bạn đã truyền `0` cho `useState()`. Khi bạn muốn thay đổi trạng thái, gọi `setCount()` và truyền giá trị mới cho nó. Nhấp vào nút này sẽ tăng biến đếm lên một:

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

React sẽ gọi lại hàm của thành phần của bạn. Lần này, `count` sẽ là `1`. Sau đó sẽ là `2`. Và tiếp tục như vậy.

Nếu bạn render cùng một thành phần nhiều lần, mỗi cái sẽ có trạng thái riêng của nó. Nhấp vào mỗi nút một cách riêng lẻ:

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

Lưu ý cách mỗi nút "nhớ" trạng thái `count` riêng của nó và không ảnh hưởng đến các nút khác.

## Sử dụng Hooks {/*using-hooks*/}

Các hàm bắt đầu bằng `use` được gọi là *Hooks*. `useState` là một Hook tích hợp sẵn do React cung cấp. Bạn có thể tìm thấy các Hook tích hợp khác trong [tài liệu tham khảo API.](/reference/react). Bạn cũng có thể viết các Hook riêng của mình bằng cách kết hợp các Hook hiện có.

Các Hook có các hạn chế hơn so với các hàm khác. Bạn chỉ có thể gọi các Hook *ở đầu* của các component của bạn (hoặc các Hook khác). Nếu bạn muốn sử dụng `useState` trong một điều kiện hoặc một vòng lặp, hãy trích xuất một component mới và đặt nó ở đó.

## Chia sẻ dữ liệu giữa các component {/*sharing-data-between-components*/}

Trong ví dụ trước đó, mỗi `MyButton` có một `count` độc lập riêng, và khi mỗi nút được nhấp vào, chỉ có `count` của nút đó mới thay đổi:

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. Both MyButton components contain a count with value zero.">

Ban đầu, trạng thái `count` của mỗi `MyButton` là `0`
</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="The same diagram as the previous, with the count of the first child MyButton component highlighted indicating a click with the count value incremented to one. The second MyButton component still contains value zero." >

Nút `MyButton` đầu tiên cập nhật trạng thái `count` của nó thành `1`
</Diagram>

</DiagramGroup>

Tuy nhiên, thường thì bạn sẽ cần các thành phần để *chia sẻ dữ liệu và luôn cập nhật cùng nhau*.

Để làm cho cả hai component `MyButton` hiển thị cùng một `count` và cập nhật cùng nhau, bạn cần di chuyển trạng thái từ các nút riêng lẻ "lên trên" đến component gần nhất chứa tất cả chúng.

Trong ví dụ này, đó là `MyApp`:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. MyApp contains a count value of zero which is passed down to both of the MyButton components, which also show value zero." >

Ban đầu, trạng thái `count` của `MyApp` là `0` và được truyền xuống cả hai children của component

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="The same diagram as the previous, with the count of the parent MyApp component highlighted indicating a click with the value incremented to one. The flow to both of the children MyButton components is also highlighted, and the count value in each child is set to one indicating the value was passed down." >

Khi được nhấp vào, `MyApp` cập nhật trạng thái `count` của nó thành `1` và truyền nó xuống cho cả hai thành phần con.  

</Diagram>

</DiagramGroup>

Bây giờ khi bạn nhấp vào bất kỳ nút nào, `count` trong `MyApp` sẽ thay đổi, điều này sẽ thay đổi cả hai `count` trong `MyButton`. Dưới đây là cách bạn có thể biểu diễn điều này trong mã (code).

Đầu tiên, *di chuyển trạng thái (state) lên* từ `MyButton` vào `MyApp`:

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

Sau đó, *truyền trạng thái (state) xuống* từ `MyApp` đến mỗi `MyButton`, cùng với trình xử lý click chung. Bạn có thể truyền thông tin cho `MyButton` bằng cách sử dụng dấu ngoặc nhọn JSX, giống như bạn đã làm trước đây với các thẻ tích hợp như `<img>`:

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

Thông tin bạn truyền xuống như vậy được gọi là _props_. Bây giờ, component `MyApp` chứa trạng thái `count` và trình xử lý sự kiện `handleClick`, và *truyền cả hai xuống như props* cho mỗi nút.

Cuối cùng, thay đổi `MyButton` thành *đọc* những props bạn đã truyền xuống từ component cha:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

Khi bạn nhấp vào nút, trình xử lý `onClick` sẽ được kích hoạt. Mỗi prop `onClick` của nút được đặt thành hàm `handleClick` bên trong `MyApp`, vì vậy mã bên trong nó chạy. Mã đó gọi `setCount(count + 1)`, tăng biến trạng thái `count`. Giá trị `count` mới được truyền như một prop cho mỗi nút, vì vậy chúng đều hiển thị giá trị mới. Điều này được gọi là "nâng cao trạng thái". Bằng cách di chuyển trạng thái lên, bạn đã chia sẻ nó giữa các thành phần.

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

## Các bước kế tiếp {/*next-steps*/}

Bây giờ, bạn đã biết cơ bản về cách viết code React!

Bạn có thể xem [Hướng dẫn](/learn/tutorial-tic-tac-toe) để áp dụng những kỹ năng React của bạn và xây dựng ứng dụng nhỏ đầu tiên của bạn.