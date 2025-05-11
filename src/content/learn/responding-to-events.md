---
title: Phản hồi sự kiện
---

<Intro>

React cho phép bạn thêm *trình xử lý sự kiện* vào JSX của mình. Trình xử lý sự kiện là các hàm của riêng bạn sẽ được kích hoạt để đáp ứng các tương tác như nhấp chuột, di chuột, tập trung vào các đầu vào biểu mẫu, v.v.

</Intro>

<YouWillLearn>

* Các cách khác nhau để viết một trình xử lý sự kiện
* Cách truyền logic xử lý sự kiện từ một component cha
* Cách các sự kiện lan truyền và cách ngăn chặn chúng

</YouWillLearn>

## Thêm trình xử lý sự kiện {/*adding-event-handlers*/}

Để thêm một trình xử lý sự kiện, trước tiên bạn sẽ định nghĩa một hàm và sau đó [truyền nó như một prop](/learn/passing-props-to-a-component) cho thẻ JSX thích hợp. Ví dụ: đây là một nút chưa làm gì cả:

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      Tôi không làm gì cả
    </button>
  );
}
```

</Sandpack>

Bạn có thể làm cho nó hiển thị một thông báo khi người dùng nhấp vào bằng cách làm theo ba bước sau:

1. Khai báo một hàm có tên là `handleClick` *bên trong* component `Button` của bạn.
2. Triển khai logic bên trong hàm đó (sử dụng `alert` để hiển thị thông báo).
3. Thêm `onClick={handleClick}` vào JSX `<button>`.

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('Bạn đã nhấp vào tôi!');
  }

  return (
    <button onClick={handleClick}>
      Nhấp vào tôi
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Bạn đã định nghĩa hàm `handleClick` và sau đó [truyền nó như một prop](/learn/passing-props-to-a-component) cho `<button>`. `handleClick` là một **trình xử lý sự kiện.** Các hàm xử lý sự kiện:

* Thường được định nghĩa *bên trong* các component của bạn.
* Có tên bắt đầu bằng `handle`, theo sau là tên của sự kiện.

Theo quy ước, người ta thường đặt tên cho các trình xử lý sự kiện là `handle` theo sau là tên sự kiện. Bạn sẽ thường thấy `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}`, v.v.

Ngoài ra, bạn có thể định nghĩa một trình xử lý sự kiện nội tuyến trong JSX:

```jsx
<button onClick={function handleClick() {
  alert('Bạn đã nhấp vào tôi!');
}}>
```

Hoặc, ngắn gọn hơn, sử dụng một hàm mũi tên:

```jsx
<button onClick={() => {
  alert('Bạn đã nhấp vào tôi!');
}}>
```

Tất cả các kiểu này là tương đương. Trình xử lý sự kiện nội tuyến rất tiện lợi cho các hàm ngắn.

<Pitfall>

Các hàm được truyền cho trình xử lý sự kiện phải được truyền, không được gọi. Ví dụ:

| truyền một hàm (chính xác)     | gọi một hàm (không chính xác)     |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

Sự khác biệt là rất nhỏ. Trong ví dụ đầu tiên, hàm `handleClick` được truyền như một trình xử lý sự kiện `onClick`. Điều này cho React biết để ghi nhớ nó và chỉ gọi hàm của bạn khi người dùng nhấp vào nút.

Trong ví dụ thứ hai, `()` ở cuối `handleClick()` kích hoạt hàm *ngay lập tức* trong quá trình [rendering](/learn/render-and-commit), mà không cần bất kỳ nhấp chuột nào. Điều này là do JavaScript bên trong [JSX `{` và `}`](/learn/javascript-in-jsx-with-curly-braces) thực thi ngay lập tức.

Khi bạn viết mã nội tuyến, cùng một cạm bẫy xuất hiện theo một cách khác:

| truyền một hàm (chính xác)            | gọi một hàm (không chính xác)    |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


Truyền mã nội tuyến như thế này sẽ không kích hoạt khi nhấp chuột—nó kích hoạt mỗi khi component render:

```jsx
// Cảnh báo này kích hoạt khi component render, không phải khi nhấp vào!
<button onClick={alert('Bạn đã nhấp vào tôi!')}>
```

Nếu bạn muốn định nghĩa trình xử lý sự kiện của mình nội tuyến, hãy bọc nó trong một hàm ẩn danh như sau:

```jsx
<button onClick={() => alert('Bạn đã nhấp vào tôi!')}>
```

Thay vì thực thi mã bên trong với mỗi lần render, điều này tạo ra một hàm sẽ được gọi sau.

Trong cả hai trường hợp, những gì bạn muốn truyền là một hàm:

* `<button onClick={handleClick}>` truyền hàm `handleClick`.
* `<button onClick={() => alert('...')}>` truyền hàm `() => alert('...')`.

[Đọc thêm về hàm mũi tên.](https://javascript.javascript.info/arrow-functions-basics)

</Pitfall>

### Đọc props trong trình xử lý sự kiện {/*reading-props-in-event-handlers*/}

Vì trình xử lý sự kiện được khai báo bên trong một component, chúng có quyền truy cập vào các props của component đó. Dưới đây là một nút, khi được nhấp vào, sẽ hiển thị một cảnh báo với prop `message` của nó:

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Đang phát!">
        Phát phim
      </AlertButton>
      <AlertButton message="Đang tải lên!">
        Tải lên ảnh
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Điều này cho phép hai nút này hiển thị các thông báo khác nhau. Hãy thử thay đổi các thông báo được truyền cho chúng.

### Truyền trình xử lý sự kiện như props {/*passing-event-handlers-as-props*/}

Thông thường, bạn sẽ muốn component cha chỉ định trình xử lý sự kiện của một component con. Hãy xem xét các nút: tùy thuộc vào nơi bạn đang sử dụng component `Button`, bạn có thể muốn thực thi một hàm khác—có lẽ một hàm phát một bộ phim và một hàm khác tải lên một hình ảnh.

Để thực hiện việc này, hãy truyền một prop mà component nhận được từ cha của nó làm trình xử lý sự kiện như sau:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Đang phát ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Phát "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Đang tải lên!')}>
      Tải lên ảnh
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Dịch vụ giao hàng của Kiki" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Ở đây, component `Toolbar` render một `PlayButton` và một `UploadButton`:

- `PlayButton` truyền `handlePlayClick` làm prop `onClick` cho `Button` bên trong.
- `UploadButton` truyền `() => alert('Đang tải lên!')` làm prop `onClick` cho `Button` bên trong.

Cuối cùng, component `Button` của bạn chấp nhận một prop có tên là `onClick`. Nó truyền prop đó trực tiếp đến trình duyệt tích hợp sẵn `<button>` với `onClick={onClick}`. Điều này cho React biết để gọi hàm được truyền khi nhấp vào.

Nếu bạn sử dụng [hệ thống thiết kế](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), thì các component như nút thường chứa kiểu dáng nhưng không chỉ định hành vi. Thay vào đó, các component như `PlayButton` và `UploadButton` sẽ truyền các trình xử lý sự kiện xuống.

### Đặt tên cho các props của trình xử lý sự kiện {/*naming-event-handler-props*/}

Các component tích hợp sẵn như `<button>` và `<div>` chỉ hỗ trợ [tên sự kiện của trình duyệt](/reference/react-dom/components/common#common-props) như `onClick`. Tuy nhiên, khi bạn đang xây dựng các component của riêng mình, bạn có thể đặt tên cho các props của trình xử lý sự kiện của chúng theo bất kỳ cách nào bạn muốn.

Theo quy ước, các props của trình xử lý sự kiện nên bắt đầu bằng `on`, theo sau là một chữ cái viết hoa.

Ví dụ: prop `onClick` của component `Button` có thể được gọi là `onSmash`:

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Đang phát!')}>
        Phát phim
      </Button>
      <Button onSmash={() => alert('Đang tải lên!')}>
        Tải lên ảnh
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Trong ví dụ này, `<button onClick={onSmash}>` cho thấy rằng trình duyệt `<button>` (chữ thường) vẫn cần một prop có tên là `onClick`, nhưng tên prop mà component `Button` tùy chỉnh của bạn nhận được là tùy thuộc vào bạn!

Khi component của bạn hỗ trợ nhiều tương tác, bạn có thể đặt tên cho các props của trình xử lý sự kiện cho các khái niệm dành riêng cho ứng dụng. Ví dụ: component `Toolbar` này nhận các trình xử lý sự kiện `onPlayMovie` và `onUploadImage`:

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Đang phát!')}
      onUploadImage={() => alert('Đang tải lên!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Phát phim
      </Button>
      <Button onClick={onUploadImage}>
        Tải lên ảnh
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Lưu ý cách component `App` không cần biết *những gì* `Toolbar` sẽ làm với `onPlayMovie` hoặc `onUploadImage`. Đó là một chi tiết triển khai của `Toolbar`. Ở đây, `Toolbar` truyền chúng xuống dưới dạng trình xử lý `onClick` cho `Button` của nó, nhưng sau này nó cũng có thể kích hoạt chúng trên một phím tắt. Đặt tên cho các props theo các tương tác dành riêng cho ứng dụng như `onPlayMovie` mang lại cho bạn sự linh hoạt để thay đổi cách chúng được sử dụng sau này.

<Note>

Hãy chắc chắn rằng bạn sử dụng các thẻ HTML thích hợp cho các trình xử lý sự kiện của bạn. Ví dụ: để xử lý các nhấp chuột, hãy sử dụng [`<button onClick={handleClick}>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) thay vì `<div onClick={handleClick}>`. Sử dụng một trình duyệt `<button>` thực cho phép các hành vi tích hợp sẵn của trình duyệt như điều hướng bằng bàn phím. Nếu bạn không thích kiểu trình duyệt mặc định của một nút và muốn làm cho nó trông giống một liên kết hoặc một phần tử UI khác, bạn có thể đạt được nó bằng CSS. [Tìm hiểu thêm về viết mã đánh dấu có thể truy cập.](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)

</Note>

## Sự kiện lan truyền {/*event-propagation*/}

Trình xử lý sự kiện cũng sẽ bắt các sự kiện từ bất kỳ component con nào mà component của bạn có thể có. Chúng ta nói rằng một sự kiện "nổi bọt" hoặc "lan truyền" lên cây: nó bắt đầu với nơi sự kiện xảy ra, và sau đó đi lên cây.

`<div>` này chứa hai nút. Cả `<div>` *và* mỗi nút đều có trình xử lý `onClick` riêng. Bạn nghĩ trình xử lý nào sẽ kích hoạt khi bạn nhấp vào một nút?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('Bạn đã nhấp vào thanh công cụ!');
    }}>
      <button onClick={() => alert('Đang phát!')}>
        Phát phim
      </button>
      <button onClick={() => alert('Đang tải lên!')}>
        Tải lên ảnh
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Nếu bạn nhấp vào một trong hai nút, `onClick` của nó sẽ chạy trước, sau đó là `onClick` của `<div>` cha. Vì vậy, hai thông báo sẽ xuất hiện. Nếu bạn nhấp vào chính thanh công cụ, chỉ `onClick` của `<div>` cha sẽ chạy.

<Pitfall>

Tất cả các sự kiện lan truyền trong React ngoại trừ `onScroll`, chỉ hoạt động trên thẻ JSX mà bạn gắn nó vào.

</Pitfall>

### Dừng lan truyền {/*stopping-propagation*/}

Trình xử lý sự kiện nhận một **đối tượng sự kiện** làm đối số duy nhất của chúng. Theo quy ước, nó thường được gọi là `e`, viết tắt của "event". Bạn có thể sử dụng đối tượng này để đọc thông tin về sự kiện.

Đối tượng sự kiện đó cũng cho phép bạn dừng lan truyền. Nếu bạn muốn ngăn một sự kiện tiếp cận các component cha, bạn cần gọi `e.stopPropagation()` như component `Button` này:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('Bạn đã nhấp vào thanh công cụ!');
    }}>
      <Button onClick={() => alert('Đang phát!')}>
        Phát phim
      </Button>
      <Button onClick={() => alert('Đang tải lên!')}>
        Tải lên ảnh
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Khi bạn nhấp vào một nút:

1. React gọi trình xử lý `onClick` được truyền cho `<button>`.
2. Trình xử lý đó, được định nghĩa trong `Button`, thực hiện như sau:
   * Gọi `e.stopPropagation()`, ngăn sự kiện nổi bọt thêm.
   * Gọi hàm `onClick`, là một prop được truyền từ component `Toolbar`.
3. Hàm đó, được định nghĩa trong component `Toolbar`, hiển thị cảnh báo riêng của nút.
4. Vì sự lan truyền đã bị dừng, trình xử lý `onClick` của `<div>` cha *không* chạy.

Do `e.stopPropagation()`, việc nhấp vào các nút bây giờ chỉ hiển thị một cảnh báo duy nhất (từ `<button>`) thay vì cả hai (từ `<button>` và thanh công cụ `<div>` cha). Nhấp vào một nút không giống như nhấp vào thanh công cụ xung quanh, vì vậy việc dừng lan truyền có ý nghĩa đối với UI này.

<DeepDive>

#### Sự kiện giai đoạn chụp {/*capture-phase-events*/}

Trong một số trường hợp hiếm hoi, bạn có thể cần bắt tất cả các sự kiện trên các phần tử con, *ngay cả khi chúng đã dừng lan truyền*. Ví dụ: có thể bạn muốn ghi lại mọi nhấp chuột vào phân tích, bất kể logic lan truyền. Bạn có thể làm điều này bằng cách thêm `Capture` vào cuối tên sự kiện:

```js
<div onClickCapture={() => { /* điều này chạy trước */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

Mỗi sự kiện lan truyền trong ba giai đoạn:

1. Nó di chuyển xuống, gọi tất cả các trình xử lý `onClickCapture`.
2. Nó chạy trình xử lý `onClick` của phần tử được nhấp.
3. Nó di chuyển lên trên, gọi tất cả các trình xử lý `onClick`.

Sự kiện chụp rất hữu ích cho mã như bộ định tuyến hoặc phân tích, nhưng bạn có thể sẽ không sử dụng chúng trong mã ứng dụng.

</DeepDive>

### Truyền trình xử lý như một giải pháp thay thế cho lan truyền {/*passing-handlers-as-alternative-to-propagation*/}

Lưu ý cách trình xử lý nhấp chuột này chạy một dòng mã _và sau đó_ gọi prop `onClick` được truyền bởi cha:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

Bạn cũng có thể thêm nhiều mã hơn vào trình xử lý này trước khi gọi trình xử lý sự kiện `onClick` của cha. Mẫu này cung cấp một *giải pháp thay thế* cho lan truyền. Nó cho phép component con xử lý sự kiện, đồng thời cho phép component cha chỉ định một số hành vi bổ sung. Không giống như lan truyền, nó không tự động. Nhưng lợi ích của mẫu này là bạn có thể theo dõi rõ ràng toàn bộ chuỗi mã thực thi do một số sự kiện gây ra.

Nếu bạn dựa vào lan truyền và khó theo dõi trình xử lý nào thực thi và tại sao, hãy thử phương pháp này thay thế.

### Ngăn chặn hành vi mặc định {/*preventing-default-behavior*/}

Một số sự kiện của trình duyệt có hành vi mặc định liên quan đến chúng. Ví dụ: một sự kiện gửi `<form>`, xảy ra khi một nút bên trong nó được nhấp vào, sẽ tải lại toàn bộ trang theo mặc định:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Đang gửi!')}>
      <input />
      <button>Gửi</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Bạn có thể gọi `e.preventDefault()` trên đối tượng sự kiện để ngăn điều này xảy ra:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Đang gửi!');
    }}>
      <input />
      <button>Gửi</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Đừng nhầm lẫn `e.stopPropagation()` và `e.preventDefault()`. Cả hai đều hữu ích, nhưng không liên quan:

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) ngăn các trình xử lý sự kiện được gắn vào các thẻ ở trên kích hoạt.
* [`e.preventDefault()` ](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) ngăn chặn hành vi mặc định của trình duyệt cho một số ít sự kiện có nó.

## Trình xử lý sự kiện có thể có tác dụng phụ không? {/*can-event-handlers-have-side-effects*/}

Chắc chắn rồi! Trình xử lý sự kiện là nơi tốt nhất cho các tác dụng phụ.

Không giống như các hàm render, trình xử lý sự kiện không cần phải [thuần khiết](/learn/keeping-components-pure), vì vậy đó là một nơi tuyệt vời để *thay đổi* một cái gì đó—ví dụ: thay đổi giá trị của một đầu vào để đáp ứng việc nhập, hoặc thay đổi một danh sách để đáp ứng một lần nhấn nút. Tuy nhiên, để thay đổi một số thông tin, trước tiên bạn cần một số cách để lưu trữ nó. Trong React, điều này được thực hiện bằng cách sử dụng [state, bộ nhớ của một component.](/learn/state-a-components-memory) Bạn sẽ tìm hiểu tất cả về nó trên trang tiếp theo.

<Recap>

* Bạn có thể xử lý các sự kiện bằng cách truyền một hàm làm prop cho một phần tử như `<button>`.
* Trình xử lý sự kiện phải được truyền, **không được gọi!** `onClick={handleClick}`, không phải `onClick={handleClick()}`.
* Bạn có thể định nghĩa một hàm xử lý sự kiện riêng biệt hoặc nội tuyến.
* Trình xử lý sự kiện được định nghĩa bên trong một component, vì vậy chúng có thể truy cập các props.
* Bạn có thể khai báo một trình xử lý sự kiện trong một component cha và truyền nó như một prop cho một component con.
* Bạn có thể xác định các props của trình xử lý sự kiện của riêng bạn với các tên dành riêng cho ứng dụng.
* Các sự kiện lan truyền lên trên. Gọi `e.stopPropagation()` trên đối số đầu tiên để ngăn chặn điều đó.
* Các sự kiện có thể có hành vi mặc định không mong muốn của trình duyệt. Gọi `e.preventDefault()` để ngăn chặn điều đó.
* Gọi rõ ràng một prop của trình xử lý sự kiện từ một trình xử lý con là một giải pháp thay thế tốt cho lan truyền.

</Recap>

<Challenges>

#### Sửa một trình xử lý sự kiện {/*fix-an-event-handler*/}

Việc nhấp vào nút này được cho là chuyển đổi nền trang giữa trắng và đen. Tuy nhiên, không có gì xảy ra khi bạn nhấp vào nó. Sửa vấn đề. (Đừng lo lắng về logic bên trong `handleClick`—phần đó vẫn ổn.)

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Bật tắt đèn
    </button>
  );
}
```

</Sandpack>

<Solution>

Vấn đề là `<button onClick={handleClick()}>` _gọi_ hàm `handleClick` trong khi render thay vì _truyền_ nó. Xóa lệnh gọi `()` để nó là `<button onClick={handleClick}>` sẽ khắc phục sự cố:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Bật tắt đèn
    </button>
  );
}
```

</Sandpack>

Ngoài ra, bạn có thể bọc lệnh gọi vào một hàm khác, như `<button onClick={() => handleClick()}>`:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Bật tắt đèn
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Kết nối các sự kiện {/*wire-up-the-events*/}

Component `ColorSwitch` này render một nút. Nó được cho là thay đổi màu trang. Kết nối nó với prop trình xử lý sự kiện `onChangeColor` mà nó nhận được từ cha để việc nhấp vào nút sẽ thay đổi màu.

Sau khi bạn làm điều này, hãy lưu ý rằng việc nhấp vào nút cũng làm tăng bộ đếm nhấp chuột của trang. Đồng nghiệp của bạn, người đã viết component cha, khẳng định rằng `onChangeColor` không tăng bất kỳ bộ đếm nào. Điều gì khác có thể xảy ra? Sửa nó để việc nhấp vào nút *chỉ* thay đổi màu và _không_ tăng bộ đếm.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Thay đổi màu
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Số lần nhấp trên trang: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

Đầu tiên, bạn cần thêm trình xử lý sự kiện, như `<button onClick={onChangeColor}>`.

Tuy nhiên, điều này giới thiệu vấn đề về bộ đếm tăng dần. Nếu `onChangeColor` không làm điều này, như đồng nghiệp của bạn khẳng định, thì vấn đề là sự kiện này lan truyền lên trên và một số trình xử lý ở trên thực hiện nó. Để giải quyết vấn đề này, bạn cần dừng lan truyền. Nhưng đừng quên rằng bạn vẫn nên gọi `onChangeColor`.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Thay đổi màu
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Số lần nhấp trên trang: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
