---
title: Thêm tính tương tác
---

<Intro>

Một số thứ trên màn hình cập nhật để đáp ứng đầu vào của người dùng. Ví dụ: nhấp vào thư viện ảnh sẽ chuyển ảnh đang hoạt động. Trong React, dữ liệu thay đổi theo thời gian được gọi là *state (trạng thái).* Bạn có thể thêm trạng thái vào bất kỳ component nào và cập nhật nó khi cần. Trong chương này, bạn sẽ học cách viết các component xử lý tương tác, cập nhật trạng thái của chúng và hiển thị các đầu ra khác nhau theo thời gian.

</Intro>

<YouWillLearn isChapter={true}>

* [Cách xử lý các sự kiện do người dùng khởi tạo](/learn/responding-to-events)
* [Cách làm cho các component "ghi nhớ" thông tin bằng state](/learn/state-a-components-memory)
* [Cách React cập nhật UI theo hai giai đoạn](/learn/render-and-commit)
* [Tại sao state không cập nhật ngay sau khi bạn thay đổi nó](/learn/state-as-a-snapshot)
* [Cách xếp hàng đợi nhiều bản cập nhật state](/learn/queueing-a-series-of-state-updates)
* [Cách cập nhật một đối tượng trong state](/learn/updating-objects-in-state)
* [Cách cập nhật một mảng trong state](/learn/updating-arrays-in-state)

</YouWillLearn>

## Phản hồi các sự kiện {/*responding-to-events*/}

React cho phép bạn thêm *trình xử lý sự kiện* vào JSX của mình. Trình xử lý sự kiện là các hàm của riêng bạn sẽ được kích hoạt để đáp ứng các tương tác của người dùng như nhấp, di chuột, tập trung vào các đầu vào biểu mẫu, v.v.

Các component tích hợp sẵn như `<button>` chỉ hỗ trợ các sự kiện trình duyệt tích hợp sẵn như `onClick`. Tuy nhiên, bạn cũng có thể tạo các component của riêng mình và cung cấp cho các đạo cụ trình xử lý sự kiện của chúng bất kỳ tên dành riêng cho ứng dụng nào mà bạn thích.

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
        Tải ảnh lên
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

Đọc **[Phản hồi các sự kiện](/learn/responding-to-events)** để tìm hiểu cách thêm trình xử lý sự kiện.

</LearnMore>

## State: bộ nhớ của một component {/*state-a-components-memory*/}

Các component thường cần thay đổi những gì trên màn hình do kết quả của một tương tác. Nhập vào biểu mẫu sẽ cập nhật trường nhập liệu, nhấp vào "tiếp theo" trên băng chuyền hình ảnh sẽ thay đổi hình ảnh nào được hiển thị, nhấp vào "mua" sẽ đưa một sản phẩm vào giỏ hàng. Các component cần "ghi nhớ" mọi thứ: giá trị đầu vào hiện tại, hình ảnh hiện tại, giỏ hàng. Trong React, loại bộ nhớ dành riêng cho component này được gọi là *state.*

Bạn có thể thêm state vào một component bằng Hook [`useState`](/reference/react/useState). *Hook* là các hàm đặc biệt cho phép các component của bạn sử dụng các tính năng của React (state là một trong những tính năng đó). Hook `useState` cho phép bạn khai báo một biến state. Nó lấy state ban đầu và trả về một cặp giá trị: state hiện tại và một hàm setter state cho phép bạn cập nhật nó.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Đây là cách một thư viện ảnh sử dụng và cập nhật state khi nhấp:

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
        ({index + 1} trên {sculptureList.length})
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

Đọc **[State: Bộ nhớ của một component](/learn/state-a-components-memory)** để tìm hiểu cách ghi nhớ một giá trị và cập nhật nó khi tương tác.

</LearnMore>

## Render và commit {/*render-and-commit*/}

Trước khi các component của bạn được hiển thị trên màn hình, chúng phải được render bởi React. Hiểu các bước trong quy trình này sẽ giúp bạn suy nghĩ về cách mã của bạn thực thi và giải thích hành vi của nó.

Hãy tưởng tượng rằng các component của bạn là những đầu bếp trong bếp, lắp ráp các món ăn ngon từ các nguyên liệu. Trong kịch bản này, React là người phục vụ đưa các yêu cầu từ khách hàng và mang chúng đến cho họ. Quá trình yêu cầu và phục vụ UI này có ba bước:

1. **Kích hoạt** render (giao đơn đặt hàng của khách ăn tối cho nhà bếp)
2. **Rendering** component (chuẩn bị đơn hàng trong bếp)
3. **Committing** vào DOM (đặt hàng lên bàn)

<IllustrationBlock sequential>
  <Illustration caption="Kích hoạt" alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="The Card Chef gives React a fresh Card component." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React delivers the Card to the user at their table." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

Đọc **[Render và Commit](/learn/render-and-commit)** để tìm hiểu vòng đời của một bản cập nhật UI.

</LearnMore>

## State như một snapshot {/*state-as-a-snapshot*/}

Không giống như các biến JavaScript thông thường, state của React hoạt động giống như một snapshot hơn. Đặt nó không thay đổi biến state bạn đã có, mà thay vào đó kích hoạt một lần render lại. Điều này có thể gây ngạc nhiên lúc đầu!

```js
console.log(count);  // 0
setCount(count + 1); // Yêu cầu render lại với 1
console.log(count);  // Vẫn là 0!
```

Hành vi này giúp bạn tránh các lỗi tinh vi. Đây là một ứng dụng trò chuyện nhỏ. Hãy thử đoán điều gì xảy ra nếu bạn nhấn "Gửi" trước và *sau đó* thay đổi người nhận thành Bob. Tên của ai sẽ xuất hiện trong `alert` năm giây sau đó?

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

Đọc **[State như một Snapshot](/learn/state-as-a-snapshot)** để tìm hiểu lý do tại sao state xuất hiện "cố định" và không thay đổi bên trong các trình xử lý sự kiện.

</LearnMore>

## Xếp hàng đợi một loạt các bản cập nhật state {/*queueing-a-series-of-state-updates*/}

Component này bị lỗi: nhấp vào "+3" chỉ tăng điểm một lần.

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

[State như một Snapshot](/learn/state-as-a-snapshot) giải thích tại sao điều này xảy ra. Đặt state yêu cầu một lần render lại mới, nhưng không thay đổi nó trong mã đã chạy. Vì vậy, `score` tiếp tục là `0` ngay sau khi bạn gọi `setScore(score + 1)`.

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

Bạn có thể khắc phục điều này bằng cách truyền một *hàm cập nhật* khi đặt state. Lưu ý cách thay thế `setScore(score + 1)` bằng `setScore(s => s + 1)` sẽ sửa nút "+3". Điều này cho phép bạn xếp hàng đợi nhiều bản cập nhật state.

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

Đọc **[Xếp hàng đợi một loạt các bản cập nhật state](/learn/queueing-a-series-of-state-updates)** để tìm hiểu cách xếp hàng đợi một chuỗi các bản cập nhật state.

</LearnMore>

## Cập nhật các đối tượng trong state {/*updating-objects-in-state*/}

State có thể giữ bất kỳ loại giá trị JavaScript nào, bao gồm cả đối tượng. Nhưng bạn không nên thay đổi trực tiếp các đối tượng và mảng mà bạn giữ trong state của React. Thay vào đó, khi bạn muốn cập nhật một đối tượng và mảng, bạn cần tạo một đối tượng mới (hoặc tạo một bản sao của một đối tượng hiện có), sau đó cập nhật state để sử dụng bản sao đó.

Thông thường, bạn sẽ sử dụng cú pháp spread `...` để sao chép các đối tượng và mảng mà bạn muốn thay đổi. Ví dụ: cập nhật một đối tượng lồng nhau có thể trông như thế này:

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
        Hình ảnh:
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
        (tọa lạc tại {person.artwork.city})
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

Nếu việc sao chép các đối tượng trong mã trở nên tẻ nhạt, bạn có thể sử dụng một thư viện như [Immer](https://github.com/immerjs/use-immer) để giảm mã lặp đi lặp lại:

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
        Hình ảnh:
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
        (tọa lạc tại {person.artwork.city})
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

Đọc **[Cập nhật các đối tượng trong state](/learn/updating-objects-in-state)** để tìm hiểu cách cập nhật các đối tượng một cách chính xác.

</LearnMore>

## Cập nhật các mảng trong state {/*updating-arrays-in-state*/}

Mảng là một loại đối tượng JavaScript có thể thay đổi khác mà bạn có thể lưu trữ trong state và nên coi là chỉ đọc. Giống như với các đối tượng, khi bạn muốn cập nhật một mảng được lưu trữ trong state, bạn cần tạo một mảng mới (hoặc tạo một bản sao của một mảng hiện có), sau đó đặt state để sử dụng mảng mới:

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
      <h1>Danh sách việc nên làm nghệ thuật</h1>
      <h2>Danh sách nghệ thuật của tôi để xem:</h2>
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

Nếu việc sao chép các mảng trong mã trở nên tẻ nhạt, bạn có thể sử dụng một thư viện như [Immer](https://github.com/immerjs/use-immer) để giảm mã lặp đi lặp lại:

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
      <h1>Danh sách việc nên làm nghệ thuật</h1>
      <h2>Danh sách nghệ thuật của tôi để xem:</h2>
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

Đọc **[Cập nhật các mảng trong state](/learn/updating-arrays-in-state)** để tìm hiểu cách cập nhật các mảng một cách chính xác.

</LearnMore>

## Tiếp theo là gì? {/*whats-next*/}

Đi tới [Phản hồi các sự kiện](/learn/responding-to-events) để bắt đầu đọc trang chương này theo từng trang!

Hoặc, nếu bạn đã quen thuộc với các chủ đề này, tại sao không đọc về [Quản lý state](/learn/managing-state)?
