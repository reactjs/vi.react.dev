---
title: Truyền Props vào một Component
---

<Intro>

Các component trong React sử dụng *props* để giao tiếp với nhau. Mỗi component cha có thể truyền một số thông tin cho các component con của nó bằng cách cung cấp các props. Props có thể khiến bạn liên tưởng đến các thuộc tính trong HTML, nhưng bạn có thể truyền bất kỳ giá trị JavaScript nào thông qua chúng, bao gồm cả đối tượng (objects), mảng (arrays) và hàm (functions).

</Intro>

<YouWillLearn>

* Làm thế nào để truyền props vào một component
* Làm thế nào để đọc props từ một component
* Làm thế nào để đặt giá trị mặc định cho props
* Làm thế nào để truyền JSX cho một component
* Props thay đổi như thế nào theo thời gian

</YouWillLearn>

## Những props thường gặp {/*familiar-props*/}

Props là thông tin mà bạn truyền vào một thẻ JSX. Ví dụ như, `className`, `src`, `alt`, `width`, và `height` là một vài props mà bạn có thể truyền vào thẻ `<img>`:

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Các props mà bạn có thể truyền vào thẻ `<img>` đã được định nghĩa sẵn (ReactDOM tuân theo [tiêu chuẩn HTML](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)). Nhưng bạn có thể truyền bất kỳ props nào vào *component do bạn tự tạo ra*, chẳng hạn như `<Avatar>`, để tùy chỉnh chúng. Sau đây là cách thực hiện!

## Truyền props vào một component {/*passing-props-to-a-component*/}

Trong đoạn code này, component `Profile` không truyền bất cứ props nào đến component con của nó, `Avatar`:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

Bạn có thể cung cấp vài props cho component `Avatar` qua hai bước.

### Bước 1: Truyền props đến component con {/*step-1-pass-props-to-the-child-component*/}

Đầu tiên, truyền vài props đến component `Avatar`. Ví dụ, hãy truyền hai props: `person` (một đối tượng - object), và `size` (một con số - number):

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

Nếu bạn thấy dấu ngoặc nhọn đôi sau `person=` gây nhầm lẫn, hãy nhớ rằng [chúng chỉ đơn giản là một đối tượng - object](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx) bên trong dấu ngoặc nhọn của JSX.

</Note>

Bây giờ bạn có thể đọc những props này bên trong component `Avatar`.

### Bước 2: Đọc props trong component con {/*step-2-read-props-inside-the-child-component*/}

Bạn có thể đọc các props này bằng cách liệt kê tên của chúng là `person, size` cách nhau bằng dấu phẩy, bên trong `({` và `})` ngay sau `function Avatar`. Cách này cho phép bạn sử dụng chúng bên trong code của `Avatar`, giống như bạn sử dụng các biến thông thường.

```js
function Avatar({ person, size }) {
  // person và size có sẵn ở đây
}
```

Thêm một số logic vào `Avatar` sử dụng các props `person` và `size` để hiển thị, và bạn hoàn tất.

Bây giờ bạn có thể cấu hình `Avatar` để hiển thị theo nhiều cách khác nhau với các props khác nhau. Hãy thử thay đổi các giá trị nhé!

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

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

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
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
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

Props giúp bạn suy nghĩ về components cha và con một cách độc lập. Ví dụ, bạn có thể thay đổi các props `person` hoặc `size` bên trong component `Profile` mà không phải suy nghĩ về cách component `Avatar` sử dụng chúng. Tương tự, bạn có thể thay đổi cách component `Avatar` sử dụng những props này mà không cần phải xem xét về component `Profile`.

Bạn có thể nghĩ về props như những "núm điều chỉnh" mà bạn có thể tùy chỉnh. Chúng có vai trò giống như các đối số (arguments) của hàm — thực ra, props _chính là_ đối số duy nhất của component của bạn! Các hàm component React nhận một đối số duy nhất, đó là một đối tượng (object) `props`:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

Thông thường, bạn không cần toàn bộ đối tượng (object) `props`, vì vậy bạn sẽ dùng kỹ thuật destructuring để lấy riêng từng prop.

<Pitfall>

**Đừng bỏ sót cặp dấu ngoặc nhọn `{` và `}`** bên trong dấu ngoặc đơn `(` và `)` khi khai báo props:

```js
function Avatar({ person, size }) {
  // ...
}
```

Cú pháp này được gọi là ["destructuring"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) và tương đương với việc đọc các thuộc tính từ một tham số của hàm (function):

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## Chỉ định một giá trị mặc định cho một prop {/*specifying-a-default-value-for-a-prop*/}

Nếu bạn muốn gán cho một prop một giá trị mặc định để sử dụng khi không có giá trị được chỉ định, bạn có thể làm điều đó bằng cách sử dụng destructuring và đặt dấu `=` cùng với giá trị mặc định ngay sau tham số:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

Bây giờ, nếu `<Avatar person={...} />` được hiển thị mà không có prop `size`, thì `size` sẽ được gán giá trị là `100`.

Giá trị mặc định chỉ được dùng nếu prop `size` bị bỏ qua hoặc nếu bạn truyền `size={undefined}`. Nhưng nếu bạn truyền `size={null}` hoặc `size={0}` thì giá trị mặc định sẽ **không** được dùng.

## Chuyển props bằng cú pháp spread của JSX {/*forwarding-props-with-the-jsx-spread-syntax*/}

Đôi khi, việc truyền props trở nên rất lặp đi lặp lại:

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

Việc viết code lặp lại không có gì sai—thậm chí còn giúp dễ đọc hơn. Tuy nhiên, đôi khi bạn có thể ưu tiên sự ngắn gọn. Một số component chuyển tiếp toàn bộ props của chúng đến các component con, giống như `Profile` chuyển tiếp cho `Avatar`. Vì những component này không sử dụng trực tiếp bất kỳ prop nào, nên việc sử dụng cú pháp "spread" ngắn gọn sẽ hợp lý hơn:

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

Dòng này sẽ chuyển tiếp tất cả các props của `Profile` sang `Avatar` mà không cần liệt kê từng tên prop một.

**Hãy sử dụng cú pháp spread một cách cẩn trọng.** Nếu bạn dùng nó trong hầu hết các component, có thể đang có vấn đề trong cách thiết kế. Thường thì điều đó cho thấy bạn nên tách nhỏ các component và truyền nội dung con dưới dạng JSX. Phần tiếp theo sẽ nói rõ hơn về điều này!

## Truyền JSX dưới hình thức con (children) {/*passing-jsx-as-children*/}

Việc lồng các thẻ trình duyệt có sẵn (built-in browser tags) là điều rất phổ biến:

```js
<div>
  <img />
</div>
```

Đôi khi, bạn cũng sẽ muốn lồng các component do chính bạn tạo ra theo cách tương tự:

```js
<Card>
  <Avatar />
</Card>
```

Khi bạn lồng nội dung bên trong một thẻ JSX, component cha sẽ nhận nội dung đó thông qua một prop có tên là `children`. Ví dụ, component `Card` dưới đây sẽ nhận prop `children` là `<Avatar />` và hiển thị nó bên trong một thẻ div bao ngoài:

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

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
```

```js src/Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
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

Hãy thử thay thế `<Avatar>` bên trong `<Card>` bằng một đoạn văn bản để thấy cách component `Card` có thể bao bọc bất kỳ nội dung lồng nào. Nó không cần phải "biết" chính xác thứ gì đang được hiển thị bên trong. Bạn sẽ thấy mẫu thiết kế linh hoạt này được sử dụng rất phổ biến ở nhiều nơi.

Bạn có thể hình dung một component có prop `children` giống như một "chỗ trống" mà các component cha có thể "lấp đầy" bằng bất kỳ JSX nào. Bạn sẽ thường sử dụng prop `children` cho các thành phần bao bọc giao diện, chẳng hạn như: bảng (panel), lưới (grid), v.v.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='A puzzle-like Card tile with a slot for "children" pieces like text and Avatar' />

## Props thay đổi như thế nào theo thời gian {/*how-props-change-over-time*/}

Component `Clock` dưới đây nhận hai props từ component cha của nó: `color` và `time`. (Code của component cha được lược bỏ vì nó sử dụng [state](/learn/state-a-components-memory), phần mà chúng ta chưa đi sâu vào lúc này.)

Hãy thử thay đổi màu trong hộp chọn bên dưới:

<Sandpack>

```js src/Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

Ví dụ này minh họa rằng **một component có thể nhận các props khác nhau theo thời gian**. Props không phải lúc nào cũng tĩnh! Ở đây, prop `time` thay đổi mỗi giây, và prop `color` thay đổi khi bạn chọn một màu khác. Props phản ánh dữ liệu của component tại bất kỳ thời điểm nào, chứ không chỉ ở lúc khởi đầu.

Tuy nhiên, props là [bất biến (immutable)](https://en.wikipedia.org/wiki/Immutable_object) — một thuật ngữ trong khoa học máy tính có nghĩa là "không thể thay đổi". Khi một component cần thay đổi props của nó (ví dụ, phản ứng với tương tác người dùng hoặc dữ liệu mới), nó sẽ phải "yêu cầu" component cha truyền cho nó _props khác_ — một đối tượng (object) mới! Các props cũ sẽ bị bỏ qua, và cuối cùng trình thông dịch JavaScript sẽ giải phóng bộ nhớ mà chúng chiếm dụng.

**Đừng cố "thay đổi props"**. Khi bạn cần phản hồi tương tác của người dùng (chẳng hạn như thay đổi màu được chọn), bạn sẽ cần phải "đặt state" (set state), phần mà bạn có thể tìm hiểu trong [State: Một bộ nhớ của Component.](/learn/state-a-components-memory)

<Recap>

* Để truyền props, bạn chỉ cần thêm chúng vào JSX, giống như cách bạn sử dụng các thuộc tính trong HTML.
* Để đọc props, hãy sử dụng cú pháp destructuring `function Avatar({ person, size })`.
* Bạn có thể chỉ định giá trị mặc định như `size = 100`, giá trị này sẽ được dùng khi prop bị thiếu hoặc có giá trị `undefined`.
* Bạn có thể chuyển tiếp tất cả props bằng cú pháp JSX spread `<Avatar {...props} />`, nhưng đừng lạm dụng nó!
* JSX lồng nhau như `<Card><Avatar /></Card>` sẽ xuất hiện dưới dạng prop `children` của component `Card`.
* Props là các ảnh chụp (snapshot) chỉ đọc theo thời gian: mỗi lần render sẽ nhận một phiên bản mới của props.
* Bạn không thể thay đổi props. Khi bạn cần tương tác với nó, bạn phải sử dụng set state.

</Recap>



<Challenges>

#### Tách một component {/*extract-a-component*/}

Component `Gallery` này chứa một số đoạn mã rất giống nhau cho hai profile. Hãy tách một component `Profile` ra khỏi nó để giảm sự trùng lặp. Bạn sẽ cần quyết định các props nào sẽ truyền cho component đó.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            physicist and chemist
          </li>
          <li>
            <b>Awards: 4 </b> 
            (Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)
          </li>
          <li>
            <b>Discovered: </b>
            polonium (chemical element)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            geochemist
          </li>
          <li>
            <b>Awards: 2 </b> 
            (Miyake Prize for geochemistry, Tanaka Prize)
          </li>
          <li>
            <b>Discovered: </b>
            a method for measuring carbon dioxide in seawater
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

Bắt đầu bằng cách tách phần mã (markup) cho một trong các nhà khoa học ra. Sau đó, tìm những phần khác biệt trong ví dụ thứ hai và làm cho chúng có thể tùy chỉnh được thông qua props.

</Hint>

<Solution>

Với giải pháp này, component `Profile` nhận nhiều props: `imageId` (một chuỗi - string), `name` (một chuỗi - string), `profession` (một chuỗi - string), `awards` (một mảng chuỗi - array của strings), `discovery` (một chuỗi - string), và `imageSize` (một con số - number).

Chú ý rằng prop `imageSize` có một giá trị mặc định, cái mà chúng ta không truyền nó đến component.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Profession:</b> {profession}</li>
        <li>
          <b>Awards: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="physicist and chemist"
        discovery="polonium (chemical element)"
        awards={[
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='geochemist'
        discovery="a method for measuring carbon dioxide in seawater"
        awards={[
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ]}
      />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Lưu ý rằng bạn không cần một prop riêng biệt `awardCount` nếu `awards` là một mảng (array). Khi đó, bạn có thể dùng `awards.length` để đếm số lượng giải thưởng. Hãy nhớ rằng props có thể nhận bất kỳ giá trị nào, bao gồm cả mảng (array)!

Một giải pháp khác, tương tự hơn với các ví dụ trước trên trang này, là gom tất cả thông tin về một người thành một đối tượng duy nhất (a single object), rồi truyền đối tượng đó dưới dạng một prop:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Profession:</b> {person.profession}
        </li>
        <li>
          <b>Awards: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'physicist and chemist',
        discovery: 'polonium (chemical element)',
        awards: [
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'geochemist',
        discovery: 'a method for measuring carbon dioxide in seawater',
        awards: [
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ],
      }} />
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
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Mặc dù cú pháp trông hơi khác vì bạn đang mô tả các thuộc tính của một đối tượng JavaScript thay vì một tập hợp các thuộc tính JSX, nhưng các ví dụ này về cơ bản là tương đương, và bạn có thể chọn theo cách nào cũng được.

</Solution>

#### Thay đổi kích thước của image dựa trên một prop {/*adjust-the-image-size-based-on-a-prop*/}

Trong ví dụ này, component `Avatar` nhận một prop số `size` dùng để xác định chiều rộng và chiều cao của thẻ `<img>`. Prop `size` được đặt là `40` trong ví dụ này. Tuy nhiên, nếu bạn mở hình ảnh trong tab mới, bạn sẽ nhận thấy ảnh gốc có kích thước lớn hơn (`160` pixel). Kích thước thực tế của ảnh được quyết định bởi kích thước ảnh thu nhỏ (thumbnail) mà bạn yêu cầu.

Hãy thay đổi component `Avatar` để yêu cầu kích thước ảnh gần nhất dựa trên prop `size`. Cụ thể, nếu `size` nhỏ hơn `90`, hãy truyền `'s'` (tức "small" - nhỏ) thay vì `'b'` ("big" - lớn) cho hàm `getImageUrl`. Kiểm tra xem thay đổi của bạn có hoạt động bằng cách render các avatar với các giá trị `size` khác nhau và mở ảnh trong tab mới.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{ 
        name: 'Gregorio Y. Zara', 
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Đây là cách bạn có thể thực hiện:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Bạn cũng có thể hiển thị hình ảnh sắc nét hơn trên màn hình có mật độ điểm ảnh cao bằng cách tính đến [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio):

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Props cho phép bạn đóng gói logic như thế này bên trong component `Avatar` (và thay đổi sau nếu cần), để ai cũng có thể sử dụng component `<Avatar>` mà không phải lo lắng về cách hình ảnh được yêu cầu và thay đổi kích thước.

</Solution>

#### Truyền JSX vào một prop `children` {/*passing-jsx-in-a-children-prop*/}

Hãy tách một component `Card` từ đoạn mã bên dưới, và sử dụng prop `children` để truyền các JSX khác nhau vào nó:

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Photo</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>About</h1>
          <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

Bất kỳ JSX nào bạn đặt bên trong thẻ của một component sẽ được truyền vào component đó thông qua prop `children`.

</Hint>

<Solution>

Đây là cách bạn có thể sử dụng component `Card` ở cả hai chỗ:

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>About</h1>
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

Bạn cũng có thể làm `title` thành một prop riêng nếu bạn muốn mỗi `Card` luôn có một tiêu đề:

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Photo">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="About">
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>
