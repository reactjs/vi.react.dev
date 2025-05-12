---
title: Rendering Lists
---

<Intro>
Bạn thường muốn hiển thị nhiều component tương tự từ một tập hợp dữ liệu. Bạn có thể sử dụng [các phương thức mảng JavaScript](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#) để thao tác với một mảng dữ liệu. Trên trang này, bạn sẽ sử dụng [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) và [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) với React để lọc và chuyển đổi mảng dữ liệu của bạn thành một mảng các component.

</Intro>

<YouWillLearn>

* Cách hiển thị các component từ một mảng bằng cách sử dụng `map()` của JavaScript
* Cách chỉ hiển thị các component cụ thể bằng cách sử dụng `filter()` của JavaScript
* Khi nào và tại sao nên sử dụng các key của React

</YouWillLearn>

## Hiển thị dữ liệu từ mảng {/*rendering-data-from-arrays*/}

Giả sử bạn có một danh sách nội dung.

```js
<ul>
  <li>Creola Katherine Johnson: nhà toán học</li>
  <li>Mario José Molina-Pasquel Henríquez: nhà hóa học</li>
  <li>Mohammad Abdus Salam: nhà vật lý</li>
  <li>Percy Lavon Julian: nhà hóa học</li>
  <li>Subrahmanyan Chandrasekhar: nhà vật lý thiên văn</li>
</ul>
```

Sự khác biệt duy nhất giữa các mục danh sách đó là nội dung của chúng, dữ liệu của chúng. Bạn thường cần hiển thị một số phiên bản của cùng một component bằng cách sử dụng dữ liệu khác nhau khi xây dựng giao diện: từ danh sách các bình luận đến thư viện ảnh hồ sơ. Trong những tình huống này, bạn có thể lưu trữ dữ liệu đó trong các đối tượng và mảng JavaScript và sử dụng các phương thức như [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) và [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) để hiển thị danh sách các component từ chúng.

Dưới đây là một ví dụ ngắn gọn về cách tạo danh sách các mục từ một mảng:

1. **Di chuyển** dữ liệu vào một mảng:

```js
const people = [
  'Creola Katherine Johnson: nhà toán học',
  'Mario José Molina-Pasquel Henríquez: nhà hóa học',
  'Mohammad Abdus Salam: nhà vật lý',
  'Percy Lavon Julian: nhà hóa học',
  'Subrahmanyan Chandrasekhar: nhà vật lý thiên văn'
];
```

2. **Ánh xạ** các thành viên `people` vào một mảng mới các nút JSX, `listItems`:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. **Trả về** `listItems` từ component của bạn được bao bọc trong một thẻ `<ul>`:

```js
return <ul>{listItems}</ul>;
```

Đây là kết quả:

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson: nhà toán học',
  'Mario José Molina-Pasquel Henríquez: nhà hóa học',
  'Mohammad Abdus Salam: nhà vật lý',
  'Percy Lavon Julian: nhà hóa học',
  'Subrahmanyan Chandrasekhar: nhà vật lý thiên văn'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

Lưu ý sandbox ở trên hiển thị một lỗi trong bảng điều khiển:

<ConsoleBlock level="error">

Warning: Mỗi phần tử con trong một danh sách nên có một prop "key" duy nhất.

</ConsoleBlock>

Bạn sẽ học cách sửa lỗi này sau trên trang này. Trước khi chúng ta đi đến đó, hãy thêm một số cấu trúc vào dữ liệu của bạn.

## Lọc mảng các mục {/*filtering-arrays-of-items*/}

Dữ liệu này có thể được cấu trúc hơn nữa.

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',  
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

Giả sử bạn muốn một cách để chỉ hiển thị những người có nghề nghiệp là `'chemist'`. Bạn có thể sử dụng phương thức `filter()` của JavaScript để chỉ trả về những người đó. Phương thức này lấy một mảng các mục, chuyển chúng qua một "bài kiểm tra" (một hàm trả về `true` hoặc `false`) và trả về một mảng mới chỉ gồm những mục đã vượt qua bài kiểm tra (trả về `true`).

Bạn chỉ muốn các mục mà `profession` là `'chemist'`. Hàm "kiểm tra" cho việc này trông giống như `(person) => person.profession === 'chemist'`. Đây là cách để kết hợp nó:

1. **Tạo** một mảng mới chỉ gồm những người là "chemist", `chemists`, bằng cách gọi `filter()` trên `people` lọc theo `person.profession === 'chemist'`:

```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

2. Bây giờ **ánh xạ** trên `chemists`:

```js {1,13}
const listItems = chemists.map(person =>
  <li>
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
```

3. Cuối cùng, **trả về** `listItems` từ component của bạn:

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
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
  return <ul>{listItems}</ul>;
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

Các hàm mũi tên trả về biểu thức ngay sau `=>` một cách ngầm định, vì vậy bạn không cần câu lệnh `return`:

```js
const listItems = chemists.map(person =>
  <li>...</li> // Trả về ngầm định!
);
```

Tuy nhiên, **bạn phải viết `return` một cách rõ ràng nếu `=>` của bạn theo sau bởi dấu ngoặc nhọn `{`!**

```js
const listItems = chemists.map(person => { // Dấu ngoặc nhọn
  return <li>...</li>;
});
```

Các hàm mũi tên chứa `=> {` được cho là có ["thân khối".](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body) Chúng cho phép bạn viết nhiều hơn một dòng mã, nhưng bạn *phải* tự viết câu lệnh `return`. Nếu bạn quên nó, sẽ không có gì được trả về!

</Pitfall>

## Giữ các mục danh sách theo thứ tự với `key` {/*keeping-list-items-in-order-with-key*/}

Lưu ý rằng tất cả các sandbox ở trên đều hiển thị một lỗi trong bảng điều khiển:

<ConsoleBlock level="error">

Warning: Mỗi phần tử con trong một danh sách nên có một prop "key" duy nhất.

</ConsoleBlock>

Bạn cần cung cấp cho mỗi mục trong mảng một `key` -- một chuỗi hoặc một số nhận dạng duy nhất nó giữa các mục khác trong mảng đó:

```js
<li key={person.id}>...</li>
```

<Note>

Các phần tử JSX trực tiếp bên trong một lệnh gọi `map()` luôn cần các key!

</Note>

Các key cho React biết mục mảng nào mà mỗi component tương ứng, để nó có thể khớp chúng sau này. Điều này trở nên quan trọng nếu các mục trong mảng của bạn có thể di chuyển (ví dụ: do sắp xếp), được chèn hoặc bị xóa. Một `key` được chọn tốt sẽ giúp React suy ra chính xác những gì đã xảy ra và thực hiện các cập nhật chính xác cho cây DOM.

Thay vì tạo các key một cách nhanh chóng, bạn nên đưa chúng vào dữ liệu của mình:

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
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js src/data.js active
export const people = [{
  id: 0, // Được sử dụng trong JSX làm key
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // Được sử dụng trong JSX làm key
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // Được sử dụng trong JSX làm key
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // Được sử dụng trong JSX làm key
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // Được sử dụng trong JSX làm key
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### Hiển thị một số nút DOM cho mỗi mục danh sách {/*displaying-several-dom-nodes-for-each-list-item*/}

Bạn làm gì khi mỗi mục cần hiển thị không phải một, mà là một số nút DOM?

Cú pháp [`<>...</>` Fragment](/reference/react/Fragment) ngắn gọn sẽ không cho phép bạn truyền một key, vì vậy bạn cần nhóm chúng thành một `<div>` duy nhất hoặc sử dụng cú pháp `<Fragment>` dài hơn và [rõ ràng hơn:](/reference/react/Fragment#rendering-a-list-of-fragments)

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Các Fragment biến mất khỏi DOM, vì vậy điều này sẽ tạo ra một danh sách phẳng gồm `<h1>`, `<p>`, `<h1>`, `<p>`, v.v.

</DeepDive>

### Nơi để lấy `key` của bạn {/*where-to-get-your-key*/}

Các nguồn dữ liệu khác nhau cung cấp các nguồn key khác nhau:

* **Dữ liệu từ cơ sở dữ liệu:** Nếu dữ liệu của bạn đến từ cơ sở dữ liệu, bạn có thể sử dụng các key/ID của cơ sở dữ liệu, vốn dĩ là duy nhất.
* **Dữ liệu được tạo cục bộ:** Nếu dữ liệu của bạn được tạo và lưu trữ cục bộ (ví dụ: ghi chú trong một ứng dụng ghi chú), hãy sử dụng một bộ đếm tăng dần, [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) hoặc một gói như [`uuid`](https://www.npmjs.com/package/uuid) khi tạo các mục.

### Các quy tắc của key {/*rules-of-keys*/}

* **Các key phải là duy nhất giữa các anh chị em.** Tuy nhiên, bạn có thể sử dụng cùng một key cho các nút JSX trong các mảng _khác nhau_.
* **Các key không được thay đổi** nếu không điều đó sẽ phá vỡ mục đích của chúng! Không tạo chúng trong khi hiển thị.

### Tại sao React cần các key? {/*why-does-react-need-keys*/}

Hãy tưởng tượng rằng các tệp trên màn hình của bạn không có tên. Thay vào đó, bạn sẽ tham khảo chúng theo thứ tự của chúng -- tệp đầu tiên, tệp thứ hai, v.v. Bạn có thể làm quen với nó, nhưng một khi bạn xóa một tệp, nó sẽ trở nên khó hiểu. Tệp thứ hai sẽ trở thành tệp đầu tiên, tệp thứ ba sẽ là tệp thứ hai, v.v.

Tên tệp trong một thư mục và các key JSX trong một mảng phục vụ một mục đích tương tự. Chúng cho phép chúng ta xác định duy nhất một mục giữa các anh chị em của nó. Một key được chọn tốt cung cấp nhiều thông tin hơn vị trí trong mảng. Ngay cả khi _vị trí_ thay đổi do sắp xếp lại, `key` cho phép React xác định mục trong suốt vòng đời của nó.

<Pitfall>

Bạn có thể bị cám dỗ sử dụng chỉ mục của một mục trong mảng làm key của nó. Trên thực tế, đó là những gì React sẽ sử dụng nếu bạn không chỉ định `key` nào cả. Nhưng thứ tự mà bạn hiển thị các mục sẽ thay đổi theo thời gian nếu một mục được chèn, xóa hoặc nếu mảng được sắp xếp lại. Chỉ mục làm key thường dẫn đến các lỗi tinh vi và khó hiểu.

Tương tự, không tạo các key một cách nhanh chóng, ví dụ: với `key={Math.random()}`. Điều này sẽ khiến các key không bao giờ khớp giữa các lần hiển thị, dẫn đến tất cả các component và DOM của bạn được tạo lại mỗi lần. Điều này không chỉ chậm mà còn làm mất mọi dữ liệu đầu vào của người dùng bên trong các mục danh sách. Thay vào đó, hãy sử dụng một ID ổn định dựa trên dữ liệu.

Lưu ý rằng các component của bạn sẽ không nhận được `key` làm một prop. Nó chỉ được sử dụng như một gợi ý bởi chính React. Nếu component của bạn cần một ID, bạn phải chuyển nó như một prop riêng biệt: `<Profile key={id} userId={id} />`.

</Pitfall>

<Recap>

Trên trang này, bạn đã học:

* Cách di chuyển dữ liệu ra khỏi các component và vào các cấu trúc dữ liệu như mảng và đối tượng.
* Cách tạo các tập hợp các component tương tự với `map()` của JavaScript.
* Cách tạo các mảng các mục được lọc với `filter()` của JavaScript.
* Tại sao và cách đặt `key` trên mỗi component trong một tập hợp để React có thể theo dõi từng component ngay cả khi vị trí hoặc dữ liệu của chúng thay đổi.

</Recap>



<Challenges>

#### Chia một danh sách thành hai {/*splitting-a-list-in-two*/}

Ví dụ này hiển thị một danh sách tất cả mọi người.

Thay đổi nó để hiển thị hai danh sách riêng biệt liên tiếp: **Các nhà hóa học** và **Mọi người khác.** Giống như trước đây, bạn có thể xác định xem một người có phải là nhà hóa học hay không bằng cách kiểm tra xem `person.profession === 'chemist'`.

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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Bạn có thể sử dụng `filter()` hai lần, tạo hai mảng riêng biệt, sau đó `map` trên cả hai:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
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
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
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
        )}
      </ul>
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

Trong giải pháp này, các lệnh gọi `map` được đặt trực tiếp vào các phần tử `<ul>` cha, nhưng bạn có thể giới thiệu các biến cho chúng nếu bạn thấy điều đó dễ đọc hơn.

Vẫn còn một chút trùng lặp giữa các danh sách được hiển thị. Bạn có thể tiến xa hơn và trích xuất các phần lặp đi lặp lại vào một component `<ListSection>`:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
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
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>
Một người đọc rất kỹ có thể nhận thấy rằng với hai lệnh gọi `filter`, chúng ta kiểm tra nghề nghiệp của mỗi người hai lần. Kiểm tra một thuộc tính rất nhanh, vì vậy trong ví dụ này thì ổn. Nếu logic của bạn tốn kém hơn thế, bạn có thể thay thế các lệnh gọi `filter` bằng một vòng lặp tự xây dựng các mảng và kiểm tra mỗi người một lần.

Trên thực tế, nếu `people` không bao giờ thay đổi, bạn có thể di chuyển đoạn mã này ra khỏi component của mình. Theo quan điểm của React, tất cả những gì quan trọng là bạn cung cấp cho nó một mảng các nút JSX ở cuối. Nó không quan tâm bạn tạo ra mảng đó như thế nào:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
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
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### Danh sách lồng nhau trong một component {/*nested-lists-in-one-component*/}

Tạo một danh sách các công thức từ mảng này! Đối với mỗi công thức trong mảng, hiển thị tên của nó dưới dạng `<h2>` và liệt kê các thành phần của nó trong một `<ul>`.

<Hint>

Điều này sẽ yêu cầu lồng hai lệnh gọi `map` khác nhau.

</Hint>

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Đây là một cách bạn có thể thực hiện:

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Mỗi `recipes` đã bao gồm một trường `id`, vì vậy đó là những gì vòng lặp bên ngoài sử dụng cho `key` của nó. Không có ID nào bạn có thể sử dụng để lặp lại các thành phần. Tuy nhiên, có lý do để cho rằng cùng một thành phần sẽ không được liệt kê hai lần trong cùng một công thức, vì vậy tên của nó có thể đóng vai trò là `key`. Ngoài ra, bạn có thể thay đổi cấu trúc dữ liệu để thêm ID hoặc sử dụng chỉ mục làm `key` (với cảnh báo rằng bạn không thể sắp xếp lại các thành phần một cách an toàn).

</Solution>

#### Trích xuất một component mục danh sách {/*extracting-a-list-item-component*/}

Component `RecipeList` này chứa hai lệnh gọi `map` lồng nhau. Để đơn giản hóa nó, hãy trích xuất một component `Recipe` từ nó, component này sẽ chấp nhận các props `id`, `name` và `ingredients`. Bạn đặt `key` bên ngoài ở đâu và tại sao?

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Bạn có thể sao chép-dán JSX từ `map` bên ngoài vào một component `Recipe` mới và trả về JSX đó. Sau đó, bạn có thể thay đổi `recipe.name` thành `name`, `recipe.id` thành `id`, v.v. và chuyển chúng làm props cho `Recipe`:

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Ở đây, `<Recipe {...recipe} key={recipe.id} />` là một cú pháp tắt cho biết "truyền tất cả các thuộc tính của đối tượng `recipe` làm props cho component `Recipe`". Bạn cũng có thể viết rõ ràng từng prop: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**Lưu ý rằng `key` được chỉ định trên chính `<Recipe>` chứ không phải trên `<div>` gốc được trả về từ `Recipe`.** Điều này là do `key` này cần thiết trực tiếp trong ngữ cảnh của mảng xung quanh. Trước đây, bạn có một mảng các `<div>` nên mỗi `<div>` cần một `key`, nhưng bây giờ bạn có một mảng các `<Recipe>`. Nói cách khác, khi bạn trích xuất một component, đừng quên để `key` bên ngoài JSX bạn sao chép và dán.

</Solution>

#### Danh sách với dấu phân cách {/*list-with-a-separator*/}

Ví dụ này hiển thị một bài haiku nổi tiếng của Tachibana Hokushi, với mỗi dòng được bao bọc trong một thẻ `<p>`. Nhiệm vụ của bạn là chèn một dấu phân cách `<hr />` giữa mỗi đoạn văn. Cấu trúc kết quả của bạn sẽ như thế này:

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

Một bài haiku chỉ chứa ba dòng, nhưng giải pháp của bạn phải hoạt động với bất kỳ số lượng dòng nào. Lưu ý rằng các phần tử `<hr />` chỉ xuất hiện *giữa* các phần tử `<p>`, không phải ở đầu hoặc cuối!

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(Đây là một trường hợp hiếm hoi mà chỉ mục làm key là chấp nhận được vì các dòng của một bài thơ sẽ không bao giờ được sắp xếp lại.)

<Hint>

Bạn sẽ cần chuyển đổi `map` thành một vòng lặp thủ công hoặc sử dụng Fragment.

</Hint>

<Solution>

Bạn có thể viết một vòng lặp thủ công, chèn `<hr />` và `<p>...</p>` vào mảng đầu ra khi bạn thực hiện:

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // Fill the output array
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Remove the first <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Sử dụng chỉ mục dòng ban đầu làm `key` không còn hoạt động nữa vì mỗi dấu phân cách và đoạn văn hiện nằm trong cùng một mảng. Tuy nhiên, bạn có thể cung cấp cho mỗi phần tử một key riêng biệt bằng cách sử dụng một hậu tố, ví dụ: `key={i + '-text'}`.

Ngoài ra, bạn có thể hiển thị một tập hợp các Fragment chứa `<hr />` và `<p>...</p>`. Tuy nhiên, cú pháp viết tắt `<>...</>` không hỗ trợ truyền key, vì vậy bạn sẽ phải viết `<Fragment>` một cách rõ ràng:

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Hãy nhớ rằng, Fragments (thường được viết là `<> </>`) cho phép bạn nhóm các nút JSX mà không cần thêm `<div>` bổ sung!

</Solution>

</Challenges>
