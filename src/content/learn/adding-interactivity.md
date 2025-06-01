---
title: Thêm Tính Tương Tác
---

<Intro>

Một số thứ trên màn hình cập nhật để phản hồi lại input của người dùng. Ví dụ, click vào thư viện ảnh sẽ chuyển đổi ảnh đang hoạt động. Trong React, data thay đổi theo thời gian được gọi là *state.* Bạn có thể thêm state cho bất kỳ Component nào, và cập nhật nó khi cần thiết. Trong chương này, bạn sẽ học cách viết các Component xử lý tương tác, cập nhật state của chúng, và hiển thị output khác nhau theo thời gian.

</Intro>

<YouWillLearn isChapter={true}>

* [Cách xử lý sự kiện do người dùng khởi tạo](/learn/responding-to-events)
* [Cách làm cho Component "nhớ" thông tin với state](/learn/state-a-components-memory)
* [Cách React cập nhật UI trong hai giai đoạn](/learn/render-and-commit)
* [Tại sao state không cập nhật ngay sau khi bạn thay đổi nó](/learn/state-as-a-snapshot)
* [Cách xếp hàng đợi nhiều lần cập nhật state](/learn/queueing-a-series-of-state-updates)
* [Cách cập nhật một object trong state](/learn/updating-objects-in-state)
* [Cách cập nhật một array trong state](/learn/updating-arrays-in-state)

</YouWillLearn>

# Thêm Tính Tương Tác {/*thêm-tính-tương-tác*/}

Trong phần này, bạn sẽ học cách làm cho Ứng dụng React của mình trở nên tương tác hơn bằng cách bắt sự kiện và cập nhật state.

## Bắt Sự Kiện {/*bắt-sự-kiện*/}

React cho phép bạn bắt các sự kiện như click chuột, nhập liệu bàn phím, và nhiều hơn nữa bằng cách thêm thuộc tính sự kiện vào những Element. Ví dụ:

```jsx
function MyButton() {
  function handleClick() {
    alert('Bạn đã click vào tôi!');
  }

  return (
    <button onClick={handleClick}>
      Click vào tôi
    </button>
  );
}
```

Ở đây, thuộc tính `onClick` được sử dụng để bắt sự kiện click chuột trên button. Khi button được click, hàm `handleClick` sẽ được gọi.

## Cập Nhật State {/*cập-nhật-state*/}

Để làm cho UI thay đổi dựa trên hành động của người dùng, bạn cần cập nhật state. React cung cấp hook `useState` để quản lý state trong Functional Components.

```jsx
import { useState } from 'react';

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Đã click {count} lần
    </button>
  );
}
```

Ở ví dụ trên, mỗi lần button được click, state `count` sẽ tăng lên 1 và giao diện sẽ được render lại để hiển thị giá trị mới.

## Kết Hợp Bắt Sự Kiện và State {/*kết-hợp-bắt-sự-kiện-và-state*/}

Bạn có thể kết hợp nhiều sự kiện và state để xây dựng những Ứng dụng phức tạp hơn. Ví dụ, một form nhập liệu:

```jsx
import { useState } from 'react';

function MyForm() {
  const [name, setName] = useState('');

  function handleChange(e) {
    setName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert(`Xin chào, ${name}!`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={handleChange} />
      <button type="submit">Gửi</button>
    </form>
  );
}
```

Ở đây, thuộc tính `onChange` được sử dụng để cập nhật state `name` mỗi khi người dùng nhập liệu, và `onSubmit` để xử lý khi form được gửi.

## Lưu Ý {/*lưu-ý*/}

- Những thuộc tính sự kiện trong React được viết theo camelCase, ví dụ: `onClick`, `onChange`.
- Bạn nên tránh cập nhật state trực tiếp mà hãy luôn sử dụng hàm cập nhật state như `setCount`, `setName`.
- Khi state thay đổi, React sẽ tự động render lại những Element liên quan.

## Tổng Kết {/*tổng-kết*/}

- Sử dụng thuộc tính sự kiện để bắt sự kiện người dùng.
- Quản lý state với hook `useState`.
- Kết hợp bắt sự kiện và state để xây dựng Ứng dụng tương tác.

Bạn đã sẵn sàng để xây dựng những Ứng dụng React tương tác hơn!

## Phản hồi sự kiện {/*responding-to-events*/}

React cho phép bạn thêm *event handler* vào JSX của mình. Event handler là những Function của riêng bạn sẽ được kích hoạt để phản hồi lại tương tác của người dùng như click, hover, focus vào các input của form, và nhiều hơn nữa.

Các Component tích hợp sẵn như `<button>` chỉ hỗ trợ các sự kiện tích hợp sẵn của trình duyệt như `onClick`. Tuy nhiên, bạn cũng có thể tạo Component của riêng mình, và đặt tên cho các event handler Props của chúng theo bất kỳ tên cụ thể cho Ứng dụng nào mà bạn thích.

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
        Phát Phim
      </Button>
      <Button onClick={onUploadImage}>
        Tải Lên Ảnh
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

<LearnMore path="/learn/responding-to-events">

Đọc **[Phản Hồi Sự Kiện](/learn/responding-to-events)** để học cách thêm event handler.

</LearnMore>

## State: bộ nhớ của Component {/*state-a-components-memory*/}

Component thường cần thay đổi những gì hiển thị trên màn hình kết quả của một tương tác. Nhập vào form phải cập nhật trường input, click "tiếp theo" trên carousel ảnh phải thay đổi ảnh nào được hiển thị, click "mua" đặt sản phẩm vào giỏ hàng. Component cần "nhớ" những thứ: giá trị input hiện tại, ảnh hiện tại, giỏ hàng. Trong React, loại bộ nhớ cụ thể của Component này được gọi là *state.*

Bạn có thể thêm state cho một Component với Hook [`useState`](/reference/react/useState). *Hook* là những Function đặc biệt cho phép Component của bạn sử dụng các tính năng của React (state là một trong những tính năng đó). Hook `useState` cho phép bạn khai báo một biến state. Nó nhận state ban đầu và trả về một cặp giá trị: state hiện tại, và một Function setter state cho phép bạn cập nhật nó.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Đây là cách một thư viện ảnh sử dụng và cập nhật state khi click:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Tiếp theo
      </button>
      <h2>
        <i>{sculpture.name} </i>
        bởi {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} của {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Ẩn' : 'Hiện'} chi tiết
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

Đọc **[State: Bộ Nhớ Của Component](/learn/state-a-components-memory)** để học cách nhớ một giá trị và cập nhật nó khi có tương tác.

</LearnMore>

## Render và commit {/*render-and-commit*/}

Trước khi Component của bạn được hiển thị trên màn hình, chúng phải được render bởi React. Hiểu các bước trong quy trình này sẽ giúp bạn suy nghĩ về cách code của bạn thực thi và giải thích hành vi của nó.

Hãy tưởng tượng rằng Component của bạn là những đầu bếp trong bếp, lắp ráp những món ăn ngon từ các nguyên liệu. Trong kịch bản này, React là người phục vụ nhận yêu cầu từ khách hàng và mang đến cho họ đơn hàng. Quy trình yêu cầu và phục vụ UI này có ba bước:

1. **Kích hoạt** một render (giao đơn hàng của khách đến bếp)
2. **Rendering** Component (chuẩn bị đơn hàng trong bếp)
3. **Commit** đến DOM (đặt đơn hàng lên bàn)

<IllustrationBlock sequential>
  <Illustration caption="Kích hoạt" alt="React như một server trong nhà hàng, lấy đơn hàng từ người dùng và giao chúng đến Component Kitchen." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="Card Chef đưa cho React một Component Card mới." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React giao Card đến người dùng tại bàn của họ." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

Đọc **[Render và Commit](/learn/render-and-commit)** để học về vòng đời của một bản cập nhật UI.

</LearnMore>

## State như một snapshot {/*state-as-a-snapshot*/}

Không giống như các biến JavaScript thông thường, React state hoạt động giống như một snapshot hơn. Thiết lập nó không thay đổi biến state mà bạn đã có, mà thay vào đó kích hoạt một re-render. Điều này có thể đáng ngạc nhiên lúc đầu!

```js
console.log(count);  // 0
setCount(count + 1); // Yêu cầu một re-render với 1
console.log(count);  // Vẫn là 0!
```

Hành vi này giúp bạn tránh những bug tinh vi. Đây là một Ứng dụng chat nhỏ. Hãy thử đoán xem điều gì sẽ xảy ra nếu bạn nhấn "Gửi" trước và *sau đó* thay đổi người nhận thành Bob. Tên của ai sẽ xuất hiện trong `alert` sau năm giây?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`Bạn đã nói ${message} với ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Đến:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Tin nhắn"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Gửi</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>


<LearnMore path="/learn/state-as-a-snapshot">

Đọc **[State Như Một Snapshot](/learn/state-as-a-snapshot)** để học tại sao state xuất hiện "cố định" và không thay đổi bên trong event handler.

</LearnMore>

## Xếp hàng đợi một chuỗi cập nhật state {/*queueing-a-series-of-state-updates*/}

Component này có bug: click "+3" chỉ tăng điểm một lần.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Điểm: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[State Như Một Snapshot](/learn/state-as-a-snapshot) giải thích tại sao điều này xảy ra. Thiết lập state yêu cầu một re-render mới, nhưng không thay đổi nó trong code đang chạy. Vì vậy `score` tiếp tục là `0` ngay sau khi bạn gọi `setScore(score + 1)`.

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

Bạn có thể sửa điều này bằng cách truyền một *Function cập nhật* khi thiết lập state. Chú ý cách thay thế `setScore(score + 1)` bằng `setScore(s => s + 1)` sửa button "+3". Điều này cho phép bạn xếp hàng đợi nhiều lần cập nhật state.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Điểm: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

Đọc **[Xếp Hàng Đợi Một Chuỗi Cập Nhật State](/learn/queueing-a-series-of-state-updates)** để học cách xếp hàng đợi một chuỗi cập nhật state.

</LearnMore>

## Cập nhật object trong state {/*updating-objects-in-state*/}

State có thể chứa bất kỳ loại giá trị JavaScript nào, bao gồm cả object. Nhưng bạn không nên thay đổi trực tiếp object và array mà bạn lưu giữ trong React state. Thay vào đó, khi bạn muốn cập nhật một object và array, bạn cần tạo mới một cái (hoặc tạo bản sao của cái hiện có), và sau đó cập nhật state để sử dụng bản sao đó.

Thường thì, bạn sẽ sử dụng cú pháp spread `...` để sao chép object và array mà bạn muốn thay đổi. Ví dụ, cập nhật một object lồng nhau có thể trông như thế này:

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
        Tên:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Tiêu đề:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Thành phố:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Ảnh:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' bởi '}
        {person.name}
        <br />
        (nằm ở {person.artwork.city})
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

Nếu việc sao chép object trong code trở nên tẻ nhạt, bạn có thể sử dụng một thư viện như [Immer](https://github.com/immerjs/use-immer) để giảm code lặp lại:

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
        Tên:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Tiêu đề:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Thành phố:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Ảnh:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' bởi '}
        {person.name}
        <br />
        (nằm ở {person.artwork.city})
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

<LearnMore path="/learn/updating-objects-in-state">

Đọc **[Cập Nhật Object Trong State](/learn/updating-objects-in-state)** để học cách cập nhật object một cách chính xác.

</LearnMore>

## Cập nhật array trong state {/*updating-arrays-in-state*/}

Array là một loại object JavaScript khả biến khác mà bạn có thể lưu trữ trong state và nên đối xử như chỉ đọc. Giống như với object, khi bạn muốn cập nhật một array được lưu trữ trong state, bạn cần tạo mới một cái (hoặc tạo bản sao của cái hiện có), và sau đó đặt state để sử dụng array mới:

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, setList] = useState(
    initialList
  );

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Danh Sách Nghệ Thuật Yêu Thích</h1>
      <h2>Danh sách nghệ thuật tôi muốn xem:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Nếu việc sao chép array trong code trở nên tẻ nhạt, bạn có thể sử dụng một thư viện như [Immer](https://github.com/immerjs/use-immer) để giảm code lặp lại:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Danh Sách Nghệ Thuật Yêu Thích</h1>
      <h2>Danh sách nghệ thuật tôi muốn xem:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
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

</Sandpack>

<LearnMore path="/learn/updating-arrays-in-state">

Đọc **[Cập Nhật Array Trong State](/learn/updating-arrays-in-state)** để học cách cập nhật array một cách chính xác.

</LearnMore>

## Tiếp theo là gì? {/*whats-next*/}

Hãy chuyển đến [Phản Hồi Sự Kiện](/learn/responding-to-events) để bắt đầu đọc chương này từng trang một!

Hoặc, nếu bạn đã quen thuộc với những chủ đề này, tại sao không đọc về [Quản Lý State](/learn/managing-state)?
