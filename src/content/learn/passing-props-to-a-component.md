---
title: Truyền props vào 1 Component
---

<Intro>
Các component React sử dụng *props* để giao tiếp với nhau. Mỗi component cha có thể truyền một số thông tin cho các component con của nó bằng cách cung cấp cho chúng các props. Props có thể làm bạn nhớ đến các thuộc tính HTML, nhưng bạn có thể truyền bất kỳ giá trị JavaScript nào thông qua chúng, bao gồm cả đối tượng, mảng và hàm.

</Intro>

<YouWillLearn>

* Cách truyền props cho một component
* Cách đọc props từ một component
* Cách chỉ định các giá trị mặc định cho props
* Cách truyền một số JSX cho một component
* Cách props thay đổi theo thời gian

</YouWillLearn>

## Các props quen thuộc {/*familiar-props*/}

Props là thông tin mà bạn truyền cho một thẻ JSX. Ví dụ: `className`, `src`, `alt`, `width` và `height` là một số props bạn có thể truyền cho một `<img>`:

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

Các props bạn có thể truyền cho một thẻ `<img>` được xác định trước (ReactDOM tuân theo [tiêu chuẩn HTML](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)). Nhưng bạn có thể truyền bất kỳ props nào cho các component *của riêng bạn*, chẳng hạn như `<Avatar>`, để tùy chỉnh chúng. Đây là cách thực hiện!

## Truyền props cho một component {/*passing-props-to-a-component*/}

Trong đoạn code này, component `Profile` không truyền bất kỳ props nào cho component con của nó, `Avatar`:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

Bạn có thể cung cấp cho `Avatar` một số props trong hai bước.

### Bước 1: Truyền props cho component con {/*step-1-pass-props-to-the-child-component*/}

Đầu tiên, hãy truyền một số props cho `Avatar`. Ví dụ: hãy truyền hai props: `person` (một đối tượng) và `size` (một số):

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

Nếu dấu ngoặc nhọn kép sau `person=` làm bạn bối rối, hãy nhớ lại [chúng chỉ là một đối tượng](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx) bên trong dấu ngoặc nhọn JSX.

</Note>

Bây giờ bạn có thể đọc các props này bên trong component `Avatar`.

### Bước 2: Đọc props bên trong component con {/*step-2-read-props-inside-the-child-component*/}

Bạn có thể đọc các props này bằng cách liệt kê tên của chúng `person, size` được phân tách bằng dấu phẩy bên trong `({` và `})` ngay sau `function Avatar`. Điều này cho phép bạn sử dụng chúng bên trong code `Avatar`, giống như bạn làm với một biến.

```js
function Avatar({ person, size }) {
  // person và size có sẵn ở đây
}
```

Thêm một số logic vào `Avatar` sử dụng các props `person` và `size` để hiển thị, và bạn đã hoàn thành.

Bây giờ bạn có thể định cấu hình `Avatar` để hiển thị theo nhiều cách khác nhau với các props khác nhau. Hãy thử điều chỉnh các giá trị!

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

Props cho phép bạn suy nghĩ về các component cha và con một cách độc lập. Ví dụ: bạn có thể thay đổi các props `person` hoặc `size` bên trong `Profile` mà không cần phải suy nghĩ về cách `Avatar` sử dụng chúng. Tương tự, bạn có thể thay đổi cách `Avatar` sử dụng các props này mà không cần nhìn vào `Profile`.

Bạn có thể coi props như "các núm" mà bạn có thể điều chỉnh. Chúng đóng vai trò tương tự như các đối số cho các hàm—thực tế, props _là_ đối số duy nhất cho component của bạn! Các hàm component React chấp nhận một đối số duy nhất, một đối tượng `props`:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

Thông thường, bạn không cần toàn bộ đối tượng `props` mà chỉ cần tách nó thành các props riêng lẻ.

<Pitfall>

**Đừng bỏ lỡ cặp dấu ngoặc nhọn `{` và `}`** bên trong `(` và `)` khi khai báo props:

```js
function Avatar({ person, size }) {
  // ...
}
```

Cú pháp này được gọi là ["destructuring"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) và tương đương với việc đọc các thuộc tính từ một tham số hàm:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## Chỉ định một giá trị mặc định cho một prop {/*specifying-a-default-value-for-a-prop*/}

Nếu bạn muốn cung cấp cho một prop một giá trị mặc định để dự phòng khi không có giá trị nào được chỉ định, bạn có thể thực hiện việc đó bằng cách destructuring bằng cách đặt `=` và giá trị mặc định ngay sau tham số:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

Bây giờ, nếu `<Avatar person={...} />` được hiển thị mà không có prop `size`, thì `size` sẽ được đặt thành `100`.

Giá trị mặc định chỉ được sử dụng nếu prop `size` bị thiếu hoặc nếu bạn truyền `size={undefined}`. Nhưng nếu bạn truyền `size={null}` hoặc `size={0}`, giá trị mặc định sẽ **không** được sử dụng.

## Chuyển tiếp props với cú pháp spread JSX {/*forwarding-props-with-the-jsx-spread-syntax*/}

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

Không có gì sai với code lặp đi lặp lại—nó có thể dễ đọc hơn. Nhưng đôi khi bạn có thể coi trọng sự ngắn gọn. Một số component chuyển tiếp tất cả các props của chúng cho các component con của chúng, giống như cách `Profile` này làm với `Avatar`. Vì chúng không sử dụng bất kỳ props nào của chúng trực tiếp, nên có thể hợp lý khi sử dụng cú pháp "spread" ngắn gọn hơn:

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

Điều này chuyển tiếp tất cả các props của `Profile` cho `Avatar` mà không cần liệt kê từng tên của chúng.

**Sử dụng cú pháp spread một cách hạn chế.** Nếu bạn đang sử dụng nó trong mọi component khác, thì có điều gì đó không ổn. Thông thường, nó chỉ ra rằng bạn nên chia các component của mình và truyền các children dưới dạng JSX. Thêm về điều đó tiếp theo!

## Truyền JSX dưới dạng children {/*passing-jsx-as-children*/}

Việc lồng các thẻ trình duyệt tích hợp sẵn là điều phổ biến:

```js
<div>
  <img />
</div>
```

Đôi khi bạn sẽ muốn lồng các component của riêng bạn theo cùng một cách:

```js
<Card>
  <Avatar />
</Card>
```

Khi bạn lồng nội dung bên trong một thẻ JSX, component cha sẽ nhận nội dung đó trong một prop có tên là `children`. Ví dụ: component `Card` bên dưới sẽ nhận một prop `children` được đặt thành `<Avatar />` và hiển thị nó trong một div bao bọc:

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

Hãy thử thay thế `<Avatar>` bên trong `<Card>` bằng một số văn bản để xem component `Card` có thể bao bọc bất kỳ nội dung lồng nhau nào. Nó không cần phải "biết" những gì đang được hiển thị bên trong nó. Bạn sẽ thấy mẫu linh hoạt này ở nhiều nơi.

Bạn có thể coi một component có prop `children` như có một "lỗ" có thể được "lấp đầy" bởi các component cha của nó bằng JSX tùy ý. Bạn sẽ thường sử dụng prop `children` cho các trình bao bọc trực quan: bảng điều khiển, lưới, v.v.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='Một ô Card giống như một câu đố với một khe cắm cho các mảnh "children" như văn bản và Avatar' />

## Cách props thay đổi theo thời gian {/*how-props-change-over-time*/}

Component `Clock` bên dưới nhận hai props từ component cha của nó: `color` và `time`. (Code của component cha bị bỏ qua vì nó sử dụng [state](/learn/state-a-components-memory), mà chúng ta sẽ không đi sâu vào ngay bây giờ.)

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
        Chọn một màu:{' '}
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

Ví dụ này minh họa rằng **một component có thể nhận các props khác nhau theo thời gian.** Props không phải lúc nào cũng tĩnh! Ở đây, prop `time` thay đổi mỗi giây và prop `color` thay đổi khi bạn chọn một màu khác. Props phản ánh dữ liệu của một component tại bất kỳ thời điểm nào, thay vì chỉ trong lúc ban đầu.

Tuy nhiên, props là [bất biến](https://en.wikipedia.org/wiki/Immutable_object)—một thuật ngữ từ khoa học máy tính có nghĩa là "không thể thay đổi". Khi một component cần thay đổi các props của nó (ví dụ: để đáp ứng tương tác của người dùng hoặc dữ liệu mới), nó sẽ phải "yêu cầu" component cha của nó truyền cho nó _các props khác nhau_—một đối tượng mới! Các props cũ của nó sau đó sẽ bị loại bỏ và cuối cùng công cụ JavaScript sẽ thu hồi bộ nhớ mà chúng chiếm giữ.

**Đừng cố gắng "thay đổi props".** Khi bạn cần phản hồi đầu vào của người dùng (như thay đổi màu đã chọn), bạn sẽ cần "đặt state", bạn có thể tìm hiểu về điều đó trong [State: Bộ nhớ của Component.](/learn/state-a-components-memory)

<Recap>

* Để truyền props, hãy thêm chúng vào JSX, giống như bạn làm với các thuộc tính HTML.
* Để đọc props, hãy sử dụng cú pháp destructuring `function Avatar({ person, size })`.
* Bạn có thể chỉ định một giá trị mặc định như `size = 100`, được sử dụng cho các props bị thiếu và `undefined`.
* Bạn có thể chuyển tiếp tất cả các props bằng cú pháp spread JSX `<Avatar {...props} />`, nhưng đừng lạm dụng nó!
* JSX lồng nhau như `<Card><Avatar /></Card>` sẽ xuất hiện dưới dạng prop `children` của component `Card`.
* Props là các ảnh chụp chỉ đọc tại một thời điểm: mỗi lần hiển thị nhận được một phiên bản props mới.
* Bạn không thể thay đổi props. Khi bạn cần tương tác, bạn sẽ cần đặt state.

</Recap>

<Challenges>

#### Trích xuất một component {/*extract-a-component*/}

Component `Gallery` này chứa một số đánh dấu rất giống nhau cho hai profile. Hãy trích xuất một component `Profile` ra khỏi nó để giảm sự trùng lặp. Bạn sẽ cần chọn những props nào để truyền cho nó.

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
Bắt đầu bằng cách trích xuất đánh dấu cho một trong những nhà khoa học. Sau đó, tìm những phần không khớp với nó trong ví dụ thứ hai và làm cho chúng có thể định cấu hình bằng các đạo cụ.

</Hint>

<Solution>

Trong giải pháp này, thành phần `Profile` chấp nhận nhiều đạo cụ: `imageId` (một chuỗi), `name` (một chuỗi), `profession` (một chuỗi), `awards` (một mảng các chuỗi), `discovery` (một chuỗi) và `imageSize` (một số).

Lưu ý rằng đạo cụ `imageSize` có một giá trị mặc định, đó là lý do tại sao chúng ta không chuyển nó cho thành phần.

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

Lưu ý rằng bạn không cần một đạo cụ `awardCount` riêng biệt nếu `awards` là một mảng. Sau đó, bạn có thể sử dụng `awards.length` để đếm số lượng giải thưởng. Hãy nhớ rằng các đạo cụ có thể nhận bất kỳ giá trị nào và điều đó bao gồm cả mảng!

Một giải pháp khác, tương tự hơn với các ví dụ trước đó trên trang này, là nhóm tất cả thông tin về một người trong một đối tượng duy nhất và chuyển đối tượng đó làm một đạo cụ:

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

Mặc dù cú pháp trông hơi khác một chút vì bạn đang mô tả các thuộc tính của một đối tượng JavaScript hơn là một tập hợp các thuộc tính JSX, nhưng các ví dụ này hầu như tương đương nhau và bạn có thể chọn một trong hai cách tiếp cận.

</Solution>

#### Điều chỉnh kích thước hình ảnh dựa trên một đạo cụ {/*adjust-the-image-size-based-on-a-prop*/}

Trong ví dụ này, `Avatar` nhận một đạo cụ số `size` xác định chiều rộng và chiều cao của `<img>`. Đạo cụ `size` được đặt thành `40` trong ví dụ này. Tuy nhiên, nếu bạn mở hình ảnh trong một tab mới, bạn sẽ nhận thấy rằng bản thân hình ảnh lớn hơn (`160` pixel). Kích thước hình ảnh thực tế được xác định bởi kích thước hình thu nhỏ bạn đang yêu cầu.

Thay đổi thành phần `Avatar` để yêu cầu kích thước hình ảnh gần nhất dựa trên đạo cụ `size`. Cụ thể, nếu `size` nhỏ hơn `90`, hãy chuyển `'s'` ("nhỏ") thay vì `'b'` ("lớn") cho hàm `getImageUrl`. Xác minh rằng các thay đổi của bạn hoạt động bằng cách hiển thị hình đại diện với các giá trị khác nhau của đạo cụ `size` và mở hình ảnh trong một tab mới.

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

Bạn cũng có thể hiển thị hình ảnh sắc nét hơn cho màn hình DPI cao bằng cách tính đến [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio):

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

Đạo cụ cho phép bạn đóng gói logic như thế này bên trong thành phần `Avatar` (và thay đổi nó sau này nếu cần) để mọi người có thể sử dụng thành phần `<Avatar>` mà không cần suy nghĩ về cách hình ảnh được yêu cầu và thay đổi kích thước.

</Solution>

#### Chuyển JSX trong một đạo cụ `children` {/*passing-jsx-in-a-children-prop*/}

Trích xuất một thành phần `Card` từ đánh dấu bên dưới và sử dụng đạo cụ `children` để chuyển các JSX khác nhau cho nó:

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

Bất kỳ JSX nào bạn đặt bên trong thẻ của một thành phần sẽ được chuyển dưới dạng đạo cụ `children` cho thành phần đó.

</Hint>

<Solution>

Đây là cách bạn có thể sử dụng thành phần `Card` ở cả hai nơi:

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

Bạn cũng có thể tạo `title` một đạo cụ riêng biệt nếu bạn muốn mọi `Card` luôn có tiêu đề:

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
