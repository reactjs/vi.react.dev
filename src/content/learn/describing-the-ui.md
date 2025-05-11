---
title: Mô tả giao diện người dùng
---

<Intro>

React là một thư viện JavaScript để hiển thị giao diện người dùng (UI). UI được xây dựng từ các đơn vị nhỏ như nút, văn bản và hình ảnh. React cho phép bạn kết hợp chúng thành các *component* có thể tái sử dụng và lồng vào nhau. Từ các trang web đến ứng dụng điện thoại, mọi thứ trên màn hình đều có thể được chia thành các component. Trong chương này, bạn sẽ học cách tạo, tùy chỉnh và hiển thị có điều kiện các component React.

</Intro>

<YouWillLearn isChapter={true}>

* [Cách viết component React đầu tiên của bạn](/learn/your-first-component)
* [Khi nào và làm thế nào để tạo các tệp nhiều component](/learn/importing-and-exporting-components)
* [Cách thêm markup vào JavaScript bằng JSX](/learn/writing-markup-with-jsx)
* [Cách sử dụng dấu ngoặc nhọn với JSX để truy cập chức năng JavaScript từ các component của bạn](/learn/javascript-in-jsx-with-curly-braces)
* [Cách định cấu hình component với props](/learn/passing-props-to-a-component)
* [Cách hiển thị có điều kiện các component](/learn/conditional-rendering)
* [Cách hiển thị nhiều component cùng một lúc](/learn/rendering-lists)
* [Cách tránh các lỗi khó hiểu bằng cách giữ cho các component thuần khiết](/learn/keeping-components-pure)
* [Tại sao việc hiểu UI của bạn dưới dạng cây lại hữu ích](/learn/understanding-your-ui-as-a-tree)

</YouWillLearn>

## Component đầu tiên của bạn {/*your-first-component*/}

Các ứng dụng React được xây dựng từ các phần UI riêng biệt được gọi là *component*. Một component React là một hàm JavaScript mà bạn có thể thêm markup vào. Các component có thể nhỏ như một nút hoặc lớn như toàn bộ trang. Dưới đây là một component `Gallery` hiển thị ba component `Profile`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Các nhà khoa học tuyệt vời</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/your-first-component">

Đọc **[Component Đầu Tiên Của Bạn](/learn/your-first-component)** để tìm hiểu cách khai báo và sử dụng các component React.

</LearnMore>

## Nhập và xuất component {/*importing-and-exporting-components*/}

Bạn có thể khai báo nhiều component trong một tệp, nhưng các tệp lớn có thể gây khó khăn cho việc điều hướng. Để giải quyết vấn đề này, bạn có thể *xuất* một component vào tệp riêng của nó, sau đó *nhập* component đó từ một tệp khác:

<Sandpack>

```js src/App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Các nhà khoa học tuyệt vời</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

Đọc **[Nhập và Xuất Component](/learn/importing-and-exporting-components)** để tìm hiểu cách chia các component thành các tệp riêng của chúng.

</LearnMore>

## Viết markup với JSX {/*writing-markup-with-jsx*/}

Mỗi component React là một hàm JavaScript có thể chứa một số markup mà React hiển thị trong trình duyệt. Các component React sử dụng một phần mở rộng cú pháp gọi là JSX để biểu diễn markup đó. JSX trông rất giống HTML, nhưng nó chặt chẽ hơn một chút và có thể hiển thị thông tin động.

Nếu chúng ta dán markup HTML hiện có vào một component React, nó sẽ không phải lúc nào cũng hoạt động:

<Sandpack>

```js
export default function TodoList() {
  return (
    // Điều này không hoàn toàn hoạt động!
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

Nếu bạn có HTML hiện có như thế này, bạn có thể sửa nó bằng [converter](https://transform.tools/html-to-jsx):

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

Đọc **[Viết Markup với JSX](/learn/writing-markup-with-jsx)** để tìm hiểu cách viết JSX hợp lệ.

</LearnMore>

## JavaScript trong JSX với dấu ngoặc nhọn {/*javascript-in-jsx-with-curly-braces*/}

JSX cho phép bạn viết markup giống HTML bên trong tệp JavaScript, giữ cho logic hiển thị và nội dung ở cùng một nơi. Đôi khi bạn sẽ muốn thêm một chút logic JavaScript hoặc tham chiếu một thuộc tính động bên trong markup đó. Trong tình huống này, bạn có thể sử dụng dấu ngoặc nhọn trong JSX của mình để "mở một cửa sổ" cho JavaScript:

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

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

Đọc **[JavaScript trong JSX với Dấu Ngoặc Nhọn](/learn/javascript-in-jsx-with-curly-braces)** để tìm hiểu cách truy cập dữ liệu JavaScript từ JSX.

</LearnMore>

## Truyền props cho một component {/*passing-props-to-a-component*/}

Các component React sử dụng *props* để giao tiếp với nhau. Mỗi component cha có thể truyền một số thông tin cho các component con của nó bằng cách cung cấp cho chúng các props. Props có thể nhắc bạn về các thuộc tính HTML, nhưng bạn có thể truyền bất kỳ giá trị JavaScript nào thông qua chúng, bao gồm các đối tượng, mảng, hàm và thậm chí cả JSX!

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

Đọc **[Truyền Props cho một Component](/learn/passing-props-to-a-component)** để tìm hiểu cách truyền và đọc props.

</LearnMore>

## Hiển thị có điều kiện {/*conditional-rendering*/}

Các component của bạn thường sẽ cần hiển thị những thứ khác nhau tùy thuộc vào các điều kiện khác nhau. Trong React, bạn có thể hiển thị JSX có điều kiện bằng cú pháp JavaScript như câu lệnh `if`, `&&` và toán tử `? :`.

Trong ví dụ này, toán tử `&&` của JavaScript được sử dụng để hiển thị có điều kiện một dấu kiểm:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Danh sách đóng gói của Sally Ride</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

Đọc **[Hiển Thị Có Điều Kiện](/learn/conditional-rendering)** để tìm hiểu các cách khác nhau để hiển thị nội dung có điều kiện.

</LearnMore>

## Hiển thị danh sách {/*rendering-lists*/}

Bạn thường sẽ muốn hiển thị nhiều component tương tự từ một tập hợp dữ liệu. Bạn có thể sử dụng `filter()` và `map()` của JavaScript với React để lọc và chuyển đổi mảng dữ liệu của bạn thành một mảng các component.

Đối với mỗi mục trong mảng, bạn sẽ cần chỉ định một `key`. Thông thường, bạn sẽ muốn sử dụng ID từ cơ sở dữ liệu làm `key`. Các key cho phép React theo dõi vị trí của từng mục trong danh sách ngay cả khi danh sách thay đổi.

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

Đọc **[Hiển Thị Danh Sách](/learn/rendering-lists)** để tìm hiểu cách hiển thị danh sách các component và cách chọn key.

</LearnMore>

## Giữ cho các component thuần khiết {/*keeping-components-pure*/}

Một số hàm JavaScript là *thuần khiết*. Một hàm thuần khiết:

* **Không can thiệp vào việc riêng.** Nó không thay đổi bất kỳ đối tượng hoặc biến nào đã tồn tại trước khi nó được gọi.
* **Đầu vào giống nhau, đầu ra giống nhau.** Với cùng một đầu vào, một hàm thuần khiết sẽ luôn trả về cùng một kết quả.

Bằng cách chỉ viết các component của bạn dưới dạng các hàm thuần khiết, bạn có thể tránh được toàn bộ một lớp các lỗi khó hiểu và hành vi khó lường khi cơ sở mã của bạn phát triển. Dưới đây là một ví dụ về một component không thuần khiết:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Bạn có thể làm cho component này thuần khiết bằng cách truyền một prop thay vì sửa đổi một biến đã tồn tại:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

Đọc **[Giữ Cho Các Component Thuần Khiết](/learn/keeping-components-pure)** để tìm hiểu cách viết các component dưới dạng các hàm thuần khiết, có thể dự đoán được.

</LearnMore>

## UI của bạn dưới dạng một cây {/*your-ui-as-a-tree*/}

React sử dụng cây để mô hình hóa các mối quan hệ giữa các component và module.

Một cây render React là một biểu diễn của mối quan hệ cha con giữa các component.

<Diagram name="generic_render_tree" height={250} width={500} alt="A tree graph with five nodes, with each node representing a component. The root node is located at the top the tree graph and is labelled 'Root Component'. It has two arrows extending down to two nodes labelled 'Component A' and 'Component C'. Each of the arrows is labelled with 'renders'. 'Component A' has a single 'renders' arrow to a node labelled 'Component B'. 'Component C' has a single 'renders' arrow to a node labelled 'Component D'.">

Một ví dụ về cây render React.

</Diagram>

Các component gần đầu cây, gần component gốc, được coi là các component cấp cao nhất. Các component không có component con là các component lá. Việc phân loại các component này rất hữu ích để hiểu luồng dữ liệu và hiệu suất hiển thị.

Mô hình hóa mối quan hệ giữa các module JavaScript là một cách hữu ích khác để hiểu ứng dụng của bạn. Chúng ta gọi nó là cây phụ thuộc module.

<Diagram name="generic_dependency_tree" height={250} width={500} alt="A tree graph with five nodes. Each node represents a JavaScript module. The top-most node is labelled 'RootModule.js'. It has three arrows extending to the nodes: 'ModuleA.js', 'ModuleB.js', and 'ModuleC.js'. Each arrow is labelled as 'imports'. 'ModuleC.js' node has a single 'imports' arrow that points to a node labelled 'ModuleD.js'.">

Một ví dụ về cây phụ thuộc module.

</Diagram>

Một cây phụ thuộc thường được sử dụng bởi các công cụ xây dựng để đóng gói tất cả mã JavaScript có liên quan để máy khách tải xuống và hiển thị. Kích thước bundle lớn làm giảm trải nghiệm người dùng cho các ứng dụng React. Hiểu cây phụ thuộc module là hữu ích để gỡ lỗi các vấn đề như vậy.

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

Đọc **[UI Của Bạn Dưới Dạng Một Cây](/learn/understanding-your-ui-as-a-tree)** để tìm hiểu cách tạo cây render và cây phụ thuộc module cho một ứng dụng React và cách chúng là các mô hình tinh thần hữu ích để cải thiện trải nghiệm và hiệu suất người dùng.

</LearnMore>

## Tiếp theo là gì? {/*whats-next*/}

Đi tới [Component Đầu Tiên Của Bạn](/learn/your-first-component) để bắt đầu đọc chương này từng trang một!

Hoặc, nếu bạn đã quen thuộc với các chủ đề này, tại sao không đọc về [Thêm Tương Tác](/learn/adding-interactivity)?
