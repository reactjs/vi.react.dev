---
title: Mô tả UI
---

<Intro>

React là một thư viện JavaScript để render giao diện người dùng (UI). UI được xây dựng từ những đơn vị nhỏ như nút bấm, văn bản và hình ảnh. React cho phép bạn kết hợp chúng thành những *component* có thể tái sử dụng và lồng ghép. Từ trang web đến ứng dụng điện thoại, mọi thứ trên màn hình đều có thể được chia nhỏ thành component. Trong chương này, bạn sẽ học cách tạo, tùy chỉnh và hiển thị React component theo điều kiện.

</Intro>

<YouWillLearn isChapter={true}>

* [Cách viết React component đầu tiên của bạn](/learn/your-first-component)
* [Khi nào và cách tạo file với nhiều component](/learn/importing-and-exporting-components)
* [Cách thêm markup vào JavaScript với JSX](/learn/writing-markup-with-jsx)
* [Cách sử dụng dấu ngoặc nhọn với JSX để truy cập chức năng JavaScript từ component của bạn](/learn/javascript-in-jsx-with-curly-braces)
* [Cách cấu hình component với props](/learn/passing-props-to-a-component)
* [Cách render component theo điều kiện](/learn/conditional-rendering)
* [Cách render nhiều component cùng lúc](/learn/rendering-lists)
* [Cách tránh bug khó hiểu bằng cách giữ component thuần khiết](/learn/keeping-components-pure)
* [Tại sao hiểu UI của bạn theo cấu trúc cây lại hữu ích](/learn/understanding-your-ui-as-a-tree)

</YouWillLearn>

## Component đầu tiên của bạn {/*your-first-component*/}

Ứng dụng React được xây dựng từ những phần UI độc lập gọi là *component*. Một React component là một JavaScript function mà bạn có thể thêm markup vào. Component có thể nhỏ như một nút bấm, hoặc lớn như toàn bộ trang. Đây là một component `Gallery` render ba component `Profile`:

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
      <h1>Amazing scientists</h1>
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

Đọc **[Component Đầu Tiên Của Bạn](/learn/your-first-component)** để học cách khai báo và sử dụng React component.

</LearnMore>

## Import và export component {/*importing-and-exporting-components*/}

Bạn có thể khai báo nhiều component trong một file, nhưng file quá nhiều component có thể khó sử dụng. Để giải quyết điều này, bạn có thể *export* một component vào file riêng của nó, và sau đó *import* component đó từ file khác:


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
      <h1>Amazing scientists</h1>
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

Đọc **[Import và Export Component](/learn/importing-and-exporting-components)** để học cách tách component vào file riêng của chúng.

</LearnMore>

## Viết markup với JSX {/*writing-markup-with-jsx*/}

Mỗi React component là một JavaScript function có thể chứa một số markup mà React render vào trình duyệt. React component sử dụng phần mở rộng cú pháp được gọi là JSX để hiển thị markup đó. JSX trông rất giống HTML, nhưng nó nghiêm ngặt hơn một chút và có thể hiển thị thông tin một cách linh động.

Nếu chúng ta dùng y hệt markup HTML vào một React component, nó chưa chắc sẽ hoạt động:

<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
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

Nếu bạn hiện có HTML như thế này, bạn có thể sửa nó bằng cách sử dụng [trình chuyển đổi](https://transform.tools/html-to-jsx):

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

Đọc **[Viết Markup với JSX](/learn/writing-markup-with-jsx)** để học cách viết JSX hợp lệ.

</LearnMore>

## JavaScript trong JSX với dấu ngoặc nhọn {/*javascript-in-jsx-with-curly-braces*/}

JSX cho phép bạn viết markup giống HTML bên trong file JavaScript, để giữ logic render và nội dung ở cùng một nơi. Đôi khi bạn sẽ muốn thêm một chút logic JavaScript hoặc tham chiếu đến một thuộc tính động bên trong markup đó. Trong tình huống này, bạn có thể sử dụng dấu ngoặc nhọn trong JSX để "mở cửa sổ" đến JavaScript:

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

Đọc **[JavaScript trong JSX với Dấu Ngoặc Nhọn](/learn/javascript-in-jsx-with-curly-braces)** để học cách truy cập dữ liệu JavaScript từ JSX.

</LearnMore>

## Truyền props cho component {/*passing-props-to-a-component*/}

React component sử dụng *props* để giao tiếp với nhau. Mọi component cha có thể truyền một số thông tin cho component con của nó bằng cách cung cấp props cho chúng. Props có thể khiến bạn nhớ đến thuộc tính HTML, nhưng bạn có thể truyền bất kỳ giá trị JavaScript nào qua chúng, bao gồm object, array, function và thậm chí cả JSX!

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

Đọc **[Truyền Props cho Component](/learn/passing-props-to-a-component)** để học cách truyền và đọc props.

</LearnMore>

## Render theo điều kiện {/*conditional-rendering*/}

Component của bạn thường sẽ cần hiển thị những thứ khác nhau tùy thuộc vào các điều kiện khác nhau. Trong React, bạn có thể render JSX theo điều kiện bằng cách sử dụng cú pháp JavaScript như câu lệnh `if`, toán tử `&&` và `? :`.

Trong ví dụ này, toán tử `&&` JavaScript được sử dụng để render dấu kiểm theo điều kiện:

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
      <h1>Sally Ride's Packing List</h1>
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

Đọc **[Render Theo Điều Kiện](/learn/conditional-rendering)** để học các cách khác nhau để render nội dung theo điều kiện.

</LearnMore>

## Render danh sách {/*rendering-lists*/}

Bạn sẽ thường muốn hiển thị nhiều component tương tự từ một tập hợp dữ liệu. Bạn có thể sử dụng `filter()` và `map()` của JavaScript với React để lọc và chuyển đổi mảng dữ liệu của bạn thành mảng component.

Đối với mỗi item trong mảng, bạn sẽ cần chỉ định một `key`. Thông thường, bạn sẽ muốn sử dụng ID từ cơ sở dữ liệu làm `key`. Key cho phép React xác định từng item trong danh sách ngay cả khi danh sách thay đổi.

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

Đọc **[Render Danh Sách](/learn/rendering-lists)** để học cách render danh sách component và cách chọn key.

</LearnMore>

## Giữ component thuần khiết {/*keeping-components-pure*/}

Một số JavaScript function là *thuần khiết.* Một function thuần khiết:

* **Chỉ quan tâm đến công việc của nó.** Nó không thay đổi bất kỳ object hoặc biến nào đã tồn tại trước khi nó được gọi.
* **Cùng đầu vào, cùng đầu ra.** Với cùng đầu vào, một function thuần khiết luôn trả về cùng kết quả.

Bằng cách chỉ viết component của bạn như các function thuần khiết một cách nghiêm ngặt, bạn có thể tránh được một loạt bug khó hiểu và hành vi khó đoán khi codebase của bạn ngày càng lớn. Đây là một ví dụ về component không thuần khiết:

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

Bạn có thể làm cho component này thuần khiết bằng cách truyền prop thay vì thay đổi biến đã tồn tại trước:

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

Đọc **[Giữ Component Thuần Khiết](/learn/keeping-components-pure)** để học cách viết component như những function thuần khiết, dễ dự đoán.

</LearnMore>

## UI của bạn theo cấu trúc cây {/*your-ui-as-a-tree*/}

React sử dụng cây để biểu diễn các mối quan hệ giữa component và module.

Một React render tree là sự biểu hiện của mối quan hệ cha và con giữa các component.

<Diagram name="generic_render_tree" height={250} width={500} alt="A tree graph with five nodes, with each node representing a component. The root node is located at the top the tree graph and is labelled 'Root Component'. It has two arrows extending down to two nodes labelled 'Component A' and 'Component C'. Each of the arrows is labelled with 'renders'. 'Component A' has a single 'renders' arrow to a node labelled 'Component B'. 'Component C' has a single 'renders' arrow to a node labelled 'Component D'.">

Một ví dụ về React render tree.

</Diagram>

Component gần đỉnh của cây, gần root component, được coi là component cấp cao nhất. Component không có component con là leaf (lá) component. Việc phân loại các component này hữu ích để hiểu luồng dữ liệu và hiệu suất render.

Biểu diễn mối quan hệ giữa các JavaScript module là một cách hữu ích khác để hiểu ứng dụng của bạn. Chúng ta gọi nó là module dependency tree.

<Diagram name="generic_dependency_tree" height={250} width={500} alt="Một đồ thị cây với năm node. Mỗi node đại diện cho một JavaScript module. Node cao nhất được gắn nhãn 'RootModule.js'. Nó có ba mũi tên kéo dài đến các node: 'ModuleA.js', 'ModuleB.js', và 'ModuleC.js'. Mỗi mũi tên được gắn nhãn 'imports'. Node 'ModuleC.js' có một mũi tên 'imports' duy nhất trỏ đến node được gắn nhãn 'ModuleD.js'.">

Một ví dụ về module dependency tree.

</Diagram>

Một dependency tree thường được sử dụng bởi các công cụ build để đóng gói tất cả code JavaScript liên quan cho client tải xuống và render. Bundle có kích thước lớn sẽ làm giảm trải nghiệm người dùng của ứng dụng React. Hiểu được module dependency tree sẽ giúp khắc phục những vấn đề như vậy.

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

Đọc **[UI Của Bạn Theo Cấu Trúc Cây](/learn/understanding-your-ui-as-a-tree)** để học cách tạo render tree và module dependency tree cho ứng dụng React và cách chúng là những mô hình tư duy hữu ích để cải thiện trải nghiệm người dùng và hiệu suất.

</LearnMore>


## Tiếp theo là gì? {/*whats-next*/}

Hãy chuyển đến [Component Đầu Tiên Của Bạn](/learn/your-first-component) để bắt đầu đọc chương này từng trang một!

Hoặc, nếu bạn đã quen thuộc với những chủ đề này, tại sao không đọc về [Thêm Tương Tác](/learn/adding-interactivity)?
