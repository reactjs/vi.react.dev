---
title: JavaScript trong JSX với dấu ngoặc nhọn
---

<Intro>

JSX cho phép bạn viết mã đánh dấu giống như HTML bên trong một tệp JavaScript, giúp giữ logic hiển thị và nội dung ở cùng một nơi. Đôi khi, bạn sẽ muốn thêm một chút logic JavaScript hoặc tham chiếu đến một thuộc tính động bên trong đoạn mã đánh dấu đó. Trong trường hợp này, bạn có thể sử dụng dấu ngoặc nhọn trong JSX để mở ra một “cửa sổ” tới JavaScript.

</Intro>

<YouWillLearn>

* Cách truyền chuỗi với dấu ngoặc kép hoặc dấu nháy
* Cách tham chiếu biến JavaScript bên trong JSX bằng dấu ngoặc nhọn
* Cách gọi hàm JavaScript bên trong JSX bằng dấu ngoặc nhọn
* Cách sử dụng đối tượng JavaScript bên trong JSX bằng dấu ngoặc nhọn

</YouWillLearn>

## Truyền chuỗi với dấu ngoặc kép hoặc dấu nháy {/*passing-strings-with-quotes*/}

Khi bạn muốn truyền một thuộc tính chuỗi vào JSX, bạn đặt nó trong dấu nháy đơn hoặc dấu nháy kép:

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Ở đây, `"https://i.imgur.com/7vQD0fPs.jpg"` và `"Gregorio Y. Zara"` đang được truyền như các chuỗi.

Nhưng nếu bạn muốn chỉ định thuộc tính `src` hoặc văn bản `alt` một cách linh động thì sao? Bạn có thể **sử dụng một giá trị từ JavaScript bằng cách thay thế `"` và `"` bằng dấu `{` và `}`**:

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Chú ý sự khác biệt giữa `className="avatar"`, chỉ định tên lớp CSS `"avatar"` để làm tròn hình ảnh, và `src={avatar}` đọc giá trị của biến JavaScript có tên là `avatar`. Đó là vì dấu ngoặc nhọn cho phép bạn làm việc với JavaScript ngay trong mã đánh dấu của mình!

## Sử dụng dấu ngoặc nhọn: Một cửa sổ vào thế giới JavaScript {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX là một cách đặc biệt để viết JavaScript. Điều đó có nghĩa là bạn có thể sử dụng JavaScript bên trong nó—với dấu ngoặc nhọn `{ }`. Ví dụ dưới đây đầu tiên khai báo một tên cho nhà khoa học, `name`, sau đó nhúng nó vào bên trong dấu ngoặc nhọn trong thẻ `<h1>`:

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

</Sandpack>

Thử thay đổi giá trị của biến `name` từ `'Gregorio Y. Zara'` thành `'Hedy Lamarr'`. Hãy xem cách tiêu đề danh sách thay đổi?

Bất kỳ biểu thức JavaScript nào cũng sẽ hoạt động giữa dấu ngoặc nhọn, bao gồm cả các lời gọi hàm như `formatDate()`:

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### Nơi để sử dụng dấu ngoặc nhọn {/*where-to-use-curly-braces*/}

Bạn chỉ có thể sử dụng dấu ngoặc nhọn theo hai cách trong JSX:

1. **Dưới dạng văn bản** trực tiếp bên trong một thẻ JSX: `<h1>{name}'s To Do List</h1>` hoạt động, nhưng `<{tag}>Gregorio Y. Zara's To Do List</{tag}>` sẽ không hoạt động.
2. **Dưới dạng các thuộc tính** ngay sau dấu `=`: `src={avatar}` sẽ đọc giá trị của biến `avatar`, nhưng `src="{avatar}"` sẽ truyền chuỗi `"{avatar}"`.

## Sử dụng "hai dấu ngoặc nhọn": CSS và các đối tượng khác trong JSX {/*using-double-curlies-css-and-other-objects-in-jsx*/}

Ngoài chuỗi, số và các biểu thức JavaScript khác, bạn thậm chí có thể truyền các đối tượng trong JSX. Các đối tượng cũng được biểu thị bằng dấu ngoặc nhọn, như `{ name: "Hedy Lamarr", inventions: 5 }`. Do đó, để truyền một đối tượng JavaScript trong JSX, bạn phải bao đối tượng đó trong một cặp dấu ngoặc nhọn khác: `person={{ name: "Hedy Lamarr", inventions: 5 }}`.

Bạn có thể thấy điều này khi sử dụng kiểu CSS nội tuyến (inline) trong JSX. React không bắt buộc bạn phải sử dụng kiểu nội tuyến (các lớp CSS hoạt động rất tốt trong hầu hết các trường hợp). Nhưng khi bạn cần kiểu nội tuyến, bạn truyền một đối tượng vào thuộc tính `style`:

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

Thử thay đổi giá trị của `backgroundColor` và `color`.

Bạn có thể thật sự thấy đối tượng JavaScript bên trong dấu ngoặc nhọn khi bạn viết nó như thế này:

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

Lần kế tiếp bạn thấy `{{` và `}}` trong JSX, hãy biết rằng đó chỉ đơn giản là một đối tượng bên trong dấu ngoặc nhọn của JSX!

<Pitfall>

Các thuộc tính `style` nội tuyến (inline) được viết theo kiểu camelCase. Ví dụ, HTML `<ul style="background-color: black">` sẽ được viết là `<ul style={{ backgroundColor: 'black' }}>`  trong component của bạn.

</Pitfall>

## Thêm nhiều điều thú vị với các đối tượng JavaScript và dấu ngoặc nhọn {/*more-fun-with-javascript-objects-and-curly-braces*/}

Bạn có thể gom nhiều biểu thức vào một đối tượng và tham chiếu chúng trong JSX bằng dấu ngoặc nhọn:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Trong ví dụ này, đối tượng JavaScript `person` chứa một chuỗi `name` và một đối tượng (object) `theme`:

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

Component có thể sử dụng những giá trị này từ `person` như sau:

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX là một ngôn ngữ mẫu (templating language) rất tối giản vì nó cho phép bạn tổ chức dữ liệu và logic bằng JavaScript.

<Recap>

Bây giờ bạn đã biết gần như mọi thứ về JSX:

* Các thuộc tính JSX đặt trong dấu ngoặc kép sẽ được truyền dưới dạng chuỗi.
* Dấu ngoặc nhọn cho phép bạn đưa logic JavaScript và các biến vào trong mã đánh dấu của mình.
* Chúng hoạt động bên trong nội dung thẻ JSX hoặc ngay sau dấu `=` trong các thuộc tính.
* Dấu `{{` và `}}` không phải là cú pháp đặc biệt: Đó là một đối tượng JavaScript được đặt bên trong dấu ngoặc nhọn JSX.

</Recap>

<Challenges>

#### Sửa lỗi {/*fix-the-mistake*/}

Mã này gặp sự cố với lỗi nói rằng `Objects are not valid as a React child` (Đối tượng không hợp lệ khi làm con của React.):

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Bạn có thể tìm ra vấn đề?

<Hint>Hãy nhìn vào những gì bên trong dấu ngoặc nhọn. Chúng ta có đang đặt đúng thứ vào đó không?</Hint>

<Solution>

Điều này xảy ra vì ví dụ này đang cố gắng render *toàn bộ đối tượng (object)* vào trong mã đánh dấu thay vì một chuỗi: `<h1>{person}'s Todos</h1>` đang cố gắng render toàn bộ đối tượng `person`! Việc đưa các đối tượng thô vào nội dung văn bản sẽ gây ra lỗi vì React không biết bạn muốn hiển thị chúng như thế nào.

Để sửa nó, hãy thay thế `<h1>{person}'s Todos</h1>` với `<h1>{person.name}'s Todos</h1>`:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Trích xuất thông tin vào một đối tượng {/*extract-information-into-an-object*/}

Trích xuất URL hình ảnh vào đối tượng `person`.

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<Solution>

Di chuyển URL hình ảnh vào một thuộc tính gọi là `person.imageUrl` và đọc nó từ thẻ `<img>` sử dụng dấu ngoặc nhọn:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Viết một biểu thức trong dấu ngoặc nhọn JSX {/*write-an-expression-inside-jsx-curly-braces*/}

Trong đối tượng dưới đây, URL hình ảnh đầy đủ được chia thành bốn phần: URL cơ sở, `imageId`, `imageSize`, và phần mở rộng tệp (file).

Chúng ta muốn URL hình ảnh kết hợp các thuộc tính này lại với nhau: URL cơ sở (luôn luôn là `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`), và phần mở rộng tệp (file) (luôn luôn là `'.jpg'`). Có gì đó sai với cách thẻ `<img>` xác định thuộc tính `src` của nó.

Bạn có thể sửa nó?

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Để kiểm tra phần bạn sửa có hoạt động không, thử thay đổi giá trị của `imageSize` thành `'b'`. Hình ảnh nên thay đổi kích thước sau khi bạn chỉnh sửa.

<Solution>

Bạn có thể viết nó dạng `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` mở biểu thức JavaScript
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` cung cấp chuỗi URL chính xác
3. `}` đóng biểu thức JavaScript

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Bạn cũng có thể di chuyển biểu thức này vào một hàm `getImageUrl` tách biệt như bên dưới:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Biến và hàm có thể giúp bạn giữ mã đánh dấu đơn giản!

</Solution>

</Challenges>
