---
title: Cập nhật đối tượng trong State
---

<Intro>

State có thể chứa bất kỳ một giá trị nào có trong Javascript, bao gồm objects. Tuy nhiên, bạn không nên thay đổi những objects mà bạn đang giữ trong React state **một cách trực tiếp**. Thay vì vậy, khi muốn update một object, bạn cần phải tạo ra một object mới (hoặc một bản copy của object hiện có), và sau đó update state để sử dụng bản copy đó.

</Intro>

<YouWillLearn>

- Cách update object một cách chính xác trong React state
- Cách update nested object (đối tượng lồng ghép nhau) mà không thay đổi nó
- Immutability là gì, và cách không phá vỡ nó
- Cách sao chép object ít lặp lại hơn với Immer

</YouWillLearn>

## Mutation (biến đổi) là gì? {/*whats-a-mutation*/}

Bạn có thể lưu trữ bất kỳ một giá trị Javascript nào trong một state.

```js
const [x, setX] = useState(0);
```

Đến nay, bạn đã làm việc với numbers, strings và booleans. Những loại giá trị JavaScript này là "immutable", có nghĩa là không thể thay đổi hoặc "chỉ đọc" (read-only). Bạn có thể kích hoạt một lần re-render để _thay thế_ một giá trị:

```js
setX(5);
```

State `x` đã thay đổi từ `0` thành `5`, nhưng _số 0 bản thân nó_  không thay đổi. Trong Javascript, chúng ta không thể thay đổi những giá trị nguyên thuỷ (primitive) như numbers, strings, và booleans.

Bây giờ, hãy xem xét một object trong state:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Về mặt kỹ thuật, chúng ta có thể thay đổi nội dung của _bản thân một đối tượng_ một cách trực tiếp. **Đây được gọi là biến đổi (mutation)**

```js
position.x = 5;
```

Tuy nhiên, mặc dù về mặt kỹ thuật, những đối tượng trong React state có thể biến đổi (mutable), bạn vẫn nên **giả định** chúng là không biến đổi (immutable) giống như numbers, booleans và strings. Thay vì biến đổi chúng, bạn nên thay thế chúng.

## Xem state như là chỉ đọc (read-only) {/*treat-state-as-read-only*/}

Nói cách khác, bạn nên **xem xét bất kỳ đối tượng Javascript nào mà bạn đặt vào state như là chỉ đọc (read-only).**

Trong ví dụ này, một đối tượng được lưu trữ trong state để thể hiện vị trí hiện tại của con trỏ chuột. Điểm màu đỏ đáng lẽ ra sẽ di chuyển khi bạn chạm hoặc di chuyển con trỏ qua khu vực preview. Nhưng thay vì vậy, điểm màu đỏ vẫn nằm ở vị trí ban đầu của nó. 

<Sandpack>

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

Vấn đề nằm ở đoạn code này:

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

Đoạn code này đang sửa đổi (mutate) đối tượng được gán cho biến `position` từ lần [render trước đó.](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) Nhưng không sử dụng hàm state setting function, nên React không biết rằng object đó đã thay đổi. Do đó, React không làm gì cả để phản ứng với sự thay đổi này. Điều đó giống như cố thay đổi order sau khi bạn đã ăn xong bữa ăn. Mặc dù việc biến đổi state có thể hoạt động trong một số trường hợp, nhưng chúng tôi không khuyến khích việc này. Bạn nên xem xét giá trị state mà bạn có quyền truy cập trong một lần render là chỉ đọc (read-only).

Để thực sự [kích hoạt một lần re-render](/learn/state-as-a-snapshot#setting-state-triggers-renders) trong trường hợp này, **hãy tạo một object mới và truyền nó vào trong hàm state setting function.**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

Với `setPosition`, bạn đang nói với React rằng:

* Thay thế `position` với đối tượng mới này
* Và re-render component này

Hãy để ý cách mà điểm màu đó đi theo con trỏ chuột của bạn khi bạn chạm hoặc di chuyển qua vùng preview:

<Sandpack>

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### Local mutation là hoàn toàn bình thường {/*local-mutation-is-fine*/}

Đoạn code như thế này là một vấn đề bởi vì nó thay đổi một đối tượng "hiện có" trong state một cách trực tiếp:

```js
position.x = e.clientX;
position.y = e.clientY;
```

Nhưng đoạn code này thì *hoàn toàn bình thường* bởi vì bạn đang biến đổi một đối tượng hoàn toàn mới mà bạn **vừa tạo ra**:

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

Thực ra thì, nó hoàn toàn giống với việc viết đoạn mã này:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

Biến đổi (mutation) chỉ là vấn đề khi bạn thay đổi những đối tượng **hiện có** bên trong state. Biến đổi một đối tượng bạn vừa tạo ra thì okay bởi vì **không đoạn code nào tham chiếu tới nó cả.** Thay đổi nó sẽ không ảnh hưởng tới thứ mà đang phụ thuộc vào nó. Đây được gọi là một "local mutation" hay biến đổi cục bộ. Bạn thậm chí có thể thực hiện "local mutation" [trong khi rendering.](/learn/keeping-components-pure#local-mutation-your-components-little-secret) Rất tiện lợi và hoàn toàn bình thường!

</DeepDive>  

## Sao chép những đối tượng với cú pháp spread {/*copying-objects-with-the-spread-syntax*/}

Trong ví dụ trước, đối tượng `position` luôn được tạo mới từ vị trí hiện tại của con trỏ chuột. Nhưng thường thì, bạn sẽ muốn kèm theo dữ liệu **hiện có** như một phần của đối tượng mới mà bạn đang tạo ra. Ví dụ, bạn có lẽ muốn update **chỉ một** field trong một form, nhưng giữ những giá trị trước đó cho tất cả các field còn lại.

Những field input này không hoạt động bởi vì những hàm xử lý `onChange` biến đổi trực tiếp state này:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Ví dụ, dòng này biến đổi state từ lần render trước đó:

```js
person.firstName = e.target.value;
```

Cách đáng tin cậy để đạt được behavior bạn muốn đó là tạo ra một đối tượng mới và truyền nó vào trong hàm `setPerson`. Nhưng ở đây, bạn cũng muốn **sao chép dữ liệu hiện có vào nó** bởi vì chỉ một trong các fields đã thay đổi:

```js
setPerson({
  firstName: e.target.value, // Giá trị first name mới từ input
  lastName: person.lastName,
  email: person.email
});
```

Bạn có thể sử dụng cú pháp `...` [phân tán đối tượng](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) để bạn không phải sao chép mọi thuộc tính của đối tượng một cách riêng rẽ.

```js
setPerson({
  ...person, // sao chép những trường input cũ
  firstName: e.target.value // Nhưng ghi đè trường này
});
```

Bây giờ thì form này hoạt động! 

Hãy để ý cách bạn không khai báo một biến state riêng rẽ cho mỗi trường input. Đối với những form lớn, việc gộp tất cả dữ liệu trong một đối tượng là rất thuận tiện--miễn là bạn update nó một cách chính xác.



<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Hãy chú ý rằng cú pháp phân tán (spread) `...` là "nông"--nó chỉ sao chép sâu một level. Điều này giúp cho việc sao chép diễn ra nhanh chóng, nhưng đồng nghĩa với việc nếu bạn muốn update một thuộc tính được lồng ghép (nested), bạn sẽ phải sử dụng nó hơn một lần.

<DeepDive>

#### Sử dụng một hàm sử lý sự kiện duy nhất cho nhiều fields khác nhau {/*using-a-single-event-handler-for-multiple-fields*/}

<<<<<<< HEAD
Bạn cũng có thể sử dụng các ký hiệu `[` và `]` bên trong định nghĩa đối tượng của bạn để chỉ định một thuộc tính có tên động (dynamic name). Dưới đây là cùng một ví dụ, nhưng chỉ với một hàm xử lý sự kiện duy nhất thay vì ba hàm sử lý khác nhau: 
=======
You can also use the `[` and `]` braces inside your object definition to specify a property with a dynamic name. Here is the same example, but with a single event handler instead of three different ones:
>>>>>>> 2859efa07357dfc2927517ce9765515acf903c7c

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Ở đây, `e.target.name` tham chiếu tới thuộc tính `name` được đưa vào `input` element trong DOM.

</DeepDive>

## Update một đối tượng lồng ghép (nested object) {/*updating-a-nested-object*/}

Xem xét một cấu trúc đối tượng lồng ghép nhau như sau:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

Nếu bạn muốn update `person.artwork.city`, thật rõ ràng cách làm nó với biến đổi (mutation):

```js
person.artwork.city = 'New Delhi';
```

Nhưng trong React, bạn xem xét state là immutable! Để thay đổi `city`, bạn cần trước tiên tạo ra đối tượng artwork mới (được điền trước bằng dữ liệu từ đối tượng trước đó), và sau đó tạo ra đối tượng `person` mới trỏ đến `artwork` mới vừa tạo:

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

Hoặc được viết như việc gọi một hàm duy nhất:

```js
setPerson({
  ...person, // sao chép những trường khác
  artwork: { // nhưng thay thế thuộc tính artwork
    ...person.artwork, // với artwork trước đó
    city: 'New Delhi' // nhưng ở New Delhi
  }
});
```

Đoạn code trên hơi dài dòng, nhưng nó hoạt động tốt cho nhiều trường hợp:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<DeepDive>

#### Những đối tượng không thực sự lồng nhau {/*objects-are-not-really-nested*/}


Một đối tượng như thế này xuất hiện "nested" trong code:

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

Tuy nhiên, "nesting" là một cách không chính xác để nghĩ về cách những đối tượng behave. Khi đoạn mã chạy, không có gì được xem như "nested" object. Bạn đang thực sự nhìn vào hai đối tượng hoàn toàn khác nhau.

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

Đối tượng `obj1` đang không ở trong `obj2`. Ví dụ, `obj3` cũng có thể trỏ tới `obj1`:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

Nếu bạn biến đổi `obj3.artwork.city`, thì nó sẽ ảnh hưởng tới cả `obj2.artwork.city` và `obj1.city`. Điều này bởi vì `obj3.artwork`, `obj2.artwork`, và `obj1` là cùng một đối tượng. Điều này khó để nhận thấy khi bạn nghĩ về objects như việc nested. Thay vì vậy, chúng là những đối tượng tách biệt cùng trỏ vào nhau nhờ vào các thuộc tính.

</DeepDive>  

### Viết ngắn gọn logic của việc update state với Immer {/*write-concise-update-logic-with-immer*/}

Nếu state của bạn có cấu trúc lồng ghép sâu, bạn có lẽ muốn xem xét việc [làm phẳng nó.](/learn/choosing-the-state-structure#avoid-deeply-nested-state) Tuy nhiên, nếu bạn không muốn thay đổi cấu trúc state của mình, bạn có lẽ sẽ ưa thích một cách viết rút gọn, hơn là nested spreads. [Immer](https://github.com/immerjs/use-immer) là một thư viện phổ biến không những cho phép bạn viết bằng cú pháp thuận tiện nhưng biến đổi mà còn chịu trách nhiệm tạo ra các bản sao cho bạn. Với Immer, code bạn viết trông giống như bạn đang "phá vỡ các quy tắc" và biến đổi một đối tượng:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

Nhưng không giống với một mutation thông thường, nó không ghi đè state trước đó!

<DeepDive>

#### Cách mà Immer hoạt động? {/*how-does-immer-work*/}

`draft` được cung cấp bởi Immer là một loại đặc biệt của object, được gọi là [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), "ghi lại" những gì bạn làm với nó. Đây là lý do tại sao bạn có thể mutate nó tự do một cách thoải mái! Dưới bề mặt, Immer xác định những phần nào của draft đã được thay đổi và tạo ra một đối tượng hoàn toàn mới chứa các chỉnh sửa của bạn.

</DeepDive>

Để thử nghiệm Immer:

1. Chạy `npm install use-immer` để thêm Immer vào như một dependency
2. Sau đó thay thế `import { useState } from 'react` với `import { useImmer } from 'use-immer'`

Dưới đây là ví dụ ở trên được chuyển sang Immer:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

Hãy chú ý, việc viết những hàm xử lý sự kiện trở nên ngắn gọn hơn nhiều. Bạn có thể pha trộn `useState` và `useImmer` trong cùng một component một cách thoải mái. Immer là một cách tuyệt vời để giữ các hàm xử lý update ngắn gọn, đặc biệt là nếu có sự lồng ghép nhau trong state của bạn, và việc sao chép các đối tượng dẫn đến code lặp đi lặp lại.

<DeepDive>

#### Tại sao state mutation không được khuyến khích trong React? {/*why-is-mutating-state-not-recommended-in-react*/}

Có một vài lý do sau:

* **Tìm sửa lỗi:** Nếu bạn sử dụng `console.log` và không biến đổi state, những logs trước của bạn sẽ không bị ghi đè bởi những thay đổi state gần đây. Vì vậy bạn có thể thấy rõ cách state đã thay đổi giữa các renders.
* **Tối ưu:** [Các chiến lược tối ưu hóa](/reference/react/memo) thông thường của React dựa trên việc bỏ qua công việc nếu các props hoặc state trước đó giống như các props hoặc state tiếp theo. Nếu bạn không bao giờ biến đổi state, việc kiểm tra xem có bất kỳ thay đổi nào hay không sẽ diễn ra rất nhanh chóng. Nếu `prevObj === obj`, bạn có thể chắc chắn rằng không có gì thay đổi bên trong nó.
* **Tính Năng Mới**: Các tính năng React mới mà chúng tôi đang xây dựng đòi hỏi state được xử lý [như một bản chụp](/learn/state-as-a-snapshot) (snapshot). Nếu bạn biến đổi các phiên bản state trước đó, điều đó có thể ngăn bạn sử dụng các tính năng mới.
* **Thay Đổi Yêu Cầu**: Một số tính năng ứng dụng, như thực hiện "Undo/Redo", hiển thị lịch sử các thay đổi, hoặc cho phép người dùng reset một form về các giá trị trước đó, sẽ dễ dàng hơn khi không có gì bị biến đổi. Điều này là do bạn có thể giữ các bản sao state trước đó trong bộ nhớ và sử dụng lại chúng khi cần thiết. Nếu bạn bắt đầu với một cách tiếp cận biến đổi, các tính năng như vậy có thể khó thêm vào sau này.
* **Thực Hiện Đơn Giản Hơn**: Bởi vì React không phụ thuộc vào mutation, nó không cần làm bất kỳ điều gì đặc biệt với các đối tượng của bạn. Nó không cần chiếm đoạt các thuộc tính của chúng, luôn luôn gói chúng vào trong Proxies, hoặc thực hiện công việc khác trong quá trình khởi tạo như nhiều giải pháp "reactive" khác làm. Điều này cũng là lý do tại sao React cho phép bạn đặt bất kỳ đối tượng nào vào trong state - bất kể kích thước của nó có lớn đến đâu - mà không gặp các vấn đề về hiệu suất hoặc đúng đắn.

Trong thực tế, bạn thường có thể "qua mặt" bằng cách mutate state trong React, nhưng chúng tôi mạnh dạn khuyến khích bạn không nên làm như vậy để bạn có thể sử dụng các tính năng React mới được phát triển với cách tiếp cận này trong đầu. Các nhà đóng góp trong tương lai và có thể thậm chí là chính bạn trong tương lai sẽ cảm ơn bạn!

</DeepDive>

<Recap>

* Xem xét tất cả state trong React như là không thay đổi.
* Khi bạn lưu trữ các đối tượng trong state, việc biến đổi chúng sẽ không kích hoạt các lần renders và thay đổi state trong các "bản chụp" renders trước đó.
* Thay vì biến đổi một đối tượng, hãy tạo một phiên bản mới của nó và kích hoạt một lần re-render bằng cách update state cho nó.
* Bạn có thể sử dụng cú pháp phân tán đối tượng (spread object)`{...obj, something: 'newValue'}` để tạo bản sao của các đối tượng.
* Cú pháp phân tán chỉ sao chép một cấp nông: nó chỉ sao chép một cấp bên trong.
* Để update một nested object, bạn cần tạo những bản sao từ dưới lên trên từ vị trí mà bạn đang update.
* Để giảm code copy đối tượng một cách lặp đi lặp lại, hãy sử dụng Immer.

</Recap>



<Challenges>

#### Sửa những update không chính xác {/*fix-incorrect-state-updates*/}

Form này có một vài lỗi. Nhấp vào nút tăng điểm một vài lần. Chú ý rằng điểm số không tăng lên. Sau đó, chỉnh sửa first name và chú ý rằng điểm số đột nhiên "bắt kịp" với các thay đổi của bạn. Cuối cùng, chỉnh sửa last name và chú ý rằng điểm số đã biến mất hoàn toàn.

Nhiệm vụ của bạn là sửa tất cả các lỗi này. Khi bạn sửa chúng, hãy giải thích tại sao mỗi lỗi xảy ra.


<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Dưới đây là phiên bản đã sửa cả hai lỗi:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Vấn đề của `handlePlusClick` là nó đã mutate đối tượng `player`. Kết quả là, React không biết lý do để re-render và không update điểm số trên màn hình. Đây là lý do khi bạn chỉnh sửa first name, state được update, kích hoạt một lần re-render cùng với việc update điểm số trên màn hình.

Vấn đề của `handleLastNameChange` là nó không sao chép các fields `...player` hiện có vào đối tượng mới. Đây là lý do tại sao điểm số bị mất sau khi bạn chỉnh sửa last name.

</Solution>

#### Tìm và sửa lỗi mutation {/*find-and-fix-the-mutation*/}

Có một hộp có thể kéo được trên một background tĩnh. Bạn có thể thay đổi màu của hộp bằng cách sử dụng select input.

Nhưng có một lỗi. Nếu bạn di chuyển hộp trước, sau đó thay đổi màu sắc của nó, background (không nên di chuyển!) sẽ "nhảy" đến vị trí của hộp. Nhưng điều này không nên xảy ra: `position` của `background` được đặt là `initialPosition`, tức là `{ x: 0, y: 0 }`. Tại sao background lại di chuyển sau khi thay đổi màu sắc?

Tìm lỗi và sửa chúng.

<Hint>

Nếu có điều gì đó thay đổi một cách không mong đợi, có thể có một sự biến đổi. Tìm sự biến đổi trong `App.js` và sửa nó.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Vấn đề nằm ở việc biến đổi bên trong `handleMove`. Nó đã biến đổi `shape.position`, nhưng đó là cùng một đối tượng mà `initialPosition` trỏ đến. Đây là lý do tại sao cả shape và background đều di chuyển. (Đó là một sự biến đổi, vì vậy sự thay đổi không phản ánh trên màn hình cho đến khi một update không liên quan - thay đổi màu sắc - kích hoạt một lần re-render.)

Cách khắc phục là loại bỏ sự biến đổi khỏi `handleMove` và sử dụng cú pháp phân tán (spread) để copy shape. Lưu ý rằng += là một sự biến đổi, vì vậy bạn cần viết lại nó để sử dụng một phép toán + thông thường.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### update một đối tượng với Immer {/*update-an-object-with-immer*/}

Đây là cùng một ví dụ có lỗi như trong challenge trước đó. Lần này, hãy sửa lỗi biến đổi bằng cách sử dụng Immer. Để tiện lợi cho bạn, useImmer đã được import, vì vậy bạn cần thay đổi biến `shape` state để sử dụng nó.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution>

Đây là giải pháp được viết lại với Immer. Chú ý cách những hàm sử lý sự kiện được viết dưới phong cách biến đổi, nhưng lỗi không xảy ra. Điều này bởi vì ở dưới bề mặt, Immer không bao giờ biến đổi những đối tượng hiện có.

<Sandpack>

```js src/App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

</Solution>

</Challenges>
