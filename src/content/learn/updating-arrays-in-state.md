---
title: Cập nhật mảng trong State
---

<Intro>

Array (mảng) là các cấu trúc dữ liệu có thể biến đổi (mutable) trong JavaScript, tuy nhiên bạn nên xem chúng như là không thể biến đổi (immutable) khi lưu trữ chúng trong state. Giống như objects, khi bạn muốn cập nhật một array được lưu trữ trong state, bạn cần tạo mới (hoặc tạo một bản sao của array sẵn có), và sau đó cập nhật state để sử dụng array mới.

</Intro>

<YouWillLearn>

- Cách thêm, sửa và xoá items trong một array trong React state
- Cách để update một object bên trong một array
- Cách để tạo ra bản sao của array ít lặp lại code với Immer

</YouWillLearn>

## Cập nhật arrays mà không thay đổi chúng {/*updating-arrays-without-mutation*/}

Trong Javascript, array chỉ là một loại khác của object. [Giống như objects](/learn/updating-objects-in-state), **Bạn nên xem array trong React state như là chỉ đọc (read-only).** Điều này có nghĩa là bạn không nên gán lại items bên trong một array như là `arr[0] = 'bird'`, và bạn cũng không nên sử dụng những methods làm thay đổi array, giống như `push()` và `pop()`.

Thay vì vậy, mỗi lần bạn muốn cập nhật một array, bạn sẽ muốn truyền một array **mới** tới hàm đặt state. Để làm điều này, bạn có thể tạo một array mới từ array ban đầu trong state của bạn bằng cách gọi những methods không làm thay đổi array như `filter()` và `map()`. Sau đó bạn có thể cập nhật state của bạn với array mới đó.

Dưới đây là một bảng tham khảo tới những hoạt động xử lý array thông thường. Khi làm việc với array bên trong React state, bạn sẽ cần phải tránh những methods ở cột bên trái, và hãy sử dụng những methods ở cột bên phải:

|           | Tránh (thay đổi array)           | Ưa chuộng (trả về array mới)                                        |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| Thêm    | `push`, `unshift`                   | `concat`, `[...arr]` cú pháp spread ([Ví dụ](#adding-to-an-array)) |
| Xoá  | `pop`, `shift`, `splice`            | `filter`, `slice` ([Ví dụ](#removing-from-an-array))              |
| Thay thế | `splice`, `arr[i] = ...` Gán giá trị | `map` ([Ví dụ](#replacing-items-in-an-array))                     |
| Sắp xếp   | `reverse`, `sort`                   | Sao chép array trước ([Ví dụ](#making-other-changes-to-an-array)) |

Bạn cũng có thể [sử dụng Immer](#write-concise-update-logic-with-immer) - thư viện cho phép bạn sử dụng những methods từ cả hai cột.

<Pitfall>

Thật không may, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) và [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) có tên khá giống nhau nhưng chúng hoàn toàn khác nhau:

* `slice` cho phép bạn **sao chép** array hoặc một phần của nó.
* `splice` **thay đổi** array (dùng để thêm hoặc xoá items).

Trong React, bạn có lẽ sẽ thường sử dụng `slice` (không phải `splice`!) rất nhiều bởi vì bạn không muốn thay đổi object hoặc array bên trong state. [Cập nhật object](/learn/updating-objects-in-state) giải thích mutation là gì và tại sao nó lại không được khuyến khích cho state.

</Pitfall>

### Thêm item vào một array {/*adding-to-an-array*/}

`push()` sẽ thay đổi một array, điều mà bạn sẽ không mong muốn:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Thay vì vậy, hãy tạo một array mới chứa những items sẵn có **và** một item mới ở cuối. Có khá nhiều cách để thực hiện điều này, nhưng cách dễ nhất là sử dụng cú pháp `...` [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals):

```js
setArtists( // Thay thế state
  [ // với một array mới
    ...artists, // array đó chứa tất cả các items cũ
    { id: nextId++, name: name } // và một item mới ở phía cuối
  ]
);
```

Bây giờ thì nó hoạt động đúng:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Cú pháp array spread cũng cho phép bạn chèn một item vào array bằng cách đặt nó **trước** array ban đầu `...artists`:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Đặt những item cũ ở đằng sau
]);
```

Theo cách này, spread có thể làm công việc của cả `push()` bằng cách thêm vào phía cuối của một array và `unshift()` bằng cách thêm vào phía đầu của một array. Hãy thử nó ở code sandbox phía trên!

### Xoá item khỏi một array {/*removing-from-an-array*/}

Cách dễ nhất để xoá một item khỏi một array là *sàng lọc nó ra*. Nói cách khác, bạn sẽ tạo ra một array mới không chứa item đó. Để thực hiện điều này, hãy sử dụng phương thức `filter`, ví dụ:

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Click vào "Delete" button một vài lần, và nhìn vào hàm xử lý click của nó.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Ở đây, `artists.filter(a => a.id !== artist.id)` có nghĩa là "tạo một array chứa những `artists` mà IDs của họ khác với `artist.id`". Nói cách khác, "Delete" button của mỗi artist sẽ lọc artist **đó** ra khỏi array, và sau đó yêu cầu một lần re-render với array vừa mới tạo. Chú ý rằng `filter` không thay đổi array ban đầu.

### Biến đổi một array {/*transforming-an-array*/}

Nếu bạn muốn thay đổi một vài hoặc tất cả các items bên trong array, bạn có thể sử dụng `map()` để tạo một array **mới**. Hàm callback bạn truyền vào `map` sẽ quyết định làm gì với từng item, dựa vào data hoặc index của nó (hoặc cả hai).

Trong ví dụ này, một array giữ toạ độ của hai hình tròn và một hình vuông. Khi bạn nhấn vào button, nó chỉ di chuyển những hình tròn xuống dưới khoảng cách 50px. Nó làm vậy bằng cách tạo một array mới với `map()`:

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // Không thay đổi
        return shape;
      } else {
        // Trả về một hình tròn mới ở phía dưới hình tròn cũ 50px
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Re-render với array mới
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Move circles down!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### Thay thế items trong một array {/*replacing-items-in-an-array*/}

Đây là một việc làm phổ biến khi bạn muốn thay thế một hoặc nhiều item trong array. Cách gán như `arr[0] = 'bird'` sẽ thay đổi array gốc, vì vậy bạn nên sử dụng `map` để thực hiện điều này.

Để thay thế một item, hãy tạo một array mới với `map`. Bên trong việc gọi hàm `map` của bạn, bạn sẽ nhận được index của item như là đối số thứ hai. Sử dụng nó để quyết định liệu bạn sẽ trả lại item gốc (đối số đầu tiên) hay một cái gì khác:

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Tăng giá trị của counter khi được click vào
        return c + 1;
      } else {
        // Phần còn lại không thay đổi
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### Chèn một item vào trong một array {/*inserting-into-an-array*/}

Đôi khi, bạn muốn chèn một item vào một vị trí cụ thể, không phải ở đầu array hay cuối array. Để thực hiện điều này, bạn có thể sử dụng cú pháp `...` array spread kết hợp với phương thức `slice()`. Phương thức `slice()` cho phép bạn cắt một "miếng" trong array. Để chèn một item, bạn sẽ tạo ra một array bằng cách sử dụng phần cắt từ đầu đến trước vị trí chèn, sau đó tới item mới, rồi tiếp đến là phần còn lại của array gốc.

Trong ví dụ này, `Insert` button luôn chèn item mới ở index `1`

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Có thể là bất kỳ index nào
    const nextArtists = [
      // Những items trước điểm chèn
      ...artists.slice(0, insertAt),
      // Item mới
      { id: nextId++, name: name },
      // Những items sau điểm chèn
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insert
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### Thực hiện những thay đổi khác tới một array {/*making-other-changes-to-an-array*/}

Có một số thao tác bạn không thể thực hiện chỉ với cú pháp spread và các phương thức không làm thay đổi array như `map()` và `filter()`. Ví dụ, bạn có thể muốn đảo ngược hoặc sắp xếp một array. Phương thức `reverse()` và `sort()` trong JavaScript làm thay đổi array gốc, vì vậy bạn không thể sử dụng chúng trực tiếp.

**Tuy nhiên, bạn có thể sao chép array trước tiên, sau đó thực hiện các thay đổi trên array sao chép đó.**
Ví dụ:

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Reverse
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Ở đây, việc đầu tiên là bạn sử dụng cú pháp `[...list]` để tạo một bản sao của array ban đầu. Bây giờ bạn đã có một bản sao, bạn có thể sử dụng các phương thức làm thay đổi array như `nextList.reverse()` hoặc `nextList.sort()`, hoặc thậm chí gán các items riêng lẻ với `nextList[0] = "something"`.

Tuy nhiên, **ngay cả khi bạn sao chép một array, bạn không thể thay đổi trực tiếp các items hiện có bên trong nó**. Điều này là do sao chép là nông - array mới sẽ chứa các items giống như array ban đầu. Vì vậy, nếu bạn sửa đổi một đối tượng bên trong array đã sao chép, bạn đang thay đổi state hiện tại. Ví dụ, mã như thế này gây ra vấn đề.

```js
const nextList = [...list];
nextList[0].seen = true; // Vấn đề: thay đổi list[0]
setList(nextList);
```

Mặc dù `nextList` và `list` là hai array khác nhau, `nextList[0]` và `list[0]` trỏ vào cùng một đối tượng. Do đó, bằng việc thay đổi `nextList[0].seen`, bạn cũng đang thay đổi `list[0].seen`. Điều này là một sự biến đổi state, mà bạn nên tránh! Bạn có thể giải quyết vấn đề này một cách tương tự như [cập nhật một nested object trong JavaScript](/learn/updating-objects-in-state#updating-a-nested-object)--bằng cách sao chép các items riêng lẻ mà bạn muốn thay đổi thay vì biến đổi chúng. Dưới đây là cách làm.

## Cập nhật objects bên trong array {/*updating-objects-inside-arrays*/}

Các đối tượng _thực sự_ không được đặt "bên trong" các array. Chúng có thể xuất hiện là "bên trong" trong code, nhưng mỗi đối tượng trong một array là một giá trị riêng biệt, mà array "trỏ" đến. Đây là lý do tại sao bạn cần phải cẩn thận khi thay đổi các nested fields như `list[0]`. Danh sách artwork của một người khác có thể trỏ vào cùng một phần tử của array!

**Khi cập nhật nested state, bạn cần tạo bản sao từ điểm bạn muốn cập nhật, và cho đến top level**. Hãy xem cách điều này hoạt động.

Trong ví dụ này, hai danh sách artwork riêng biệt có cùng state ban đầu. Chúng được xem như là tách biệt, nhưng do một sự biến đổi, state của chúng được chia sẻ một cách tình cờ, và việc check vào một ô trong một list ảnh hưởng đến list khác:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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

Đây là vấn đề trong đoạn code:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Vấn đề: biến đổi item hiện có
setMyList(myNextList);
```

Mặc dù `myNextList` là array mới, **các items trong nó** vẫn giống như trong array `myList` ban đầu. Vì vậy, việc thay đổi `artwork.seen` thay đổi item artwork **gốc**. Mục artwork đó cũng có trong `yourList`, điều này gây ra lỗi. Các lỗi như thế này có thể khó nghĩ tới, nhưng may mắn là chúng biến mất nếu bạn tránh biến đổi state.

**Bạn có thể sử dụng `map` để thay thế một item cũ bằng phiên bản đã được cập nhật mà không làm biến đổi.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Tạo ra một object mới với những thay đổi
    return { ...artwork, seen: nextSeen };
  } else {
    // Không có sự thay đổi
    return artwork;
  }
}));
```

Ở đây, `...` là cú pháp object spread được sử dụng để [tạo ra bản sao của một object.](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)

Với phương pháp này, không có state items hiện có nào bị biến đổi, và lỗi đã được sửa:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Tạo một object mới cùng với những thay đổi
        return { ...artwork, seen: nextSeen };
      } else {
        // không có sự thay đổi
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Tạo một object mới cùng với những thay đổi
        return { ...artwork, seen: nextSeen };
      } else {
        // không có sự thay đổi
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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

Nhìn chung, **bạn chỉ nên biến đổi các object mà bạn vừa tạo mới.** Nếu bạn đang chèn một artwork mới, bạn có thể biến đổi nó, nhưng nếu bạn đang xử lý cái gì đó đã có trong state, bạn cần tạo một bản sao.

### Viết logic cập nhật gọn gàng với Immer {/*write-concise-update-logic-with-immer*/}

Cập nhật các array lồng nhau mà không làm thay đổi có thể trở nên hơi lặp đi lặp lại. [Giống như với objects](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- Nói chung, bạn không nên cần phải cập nhật state sâu hơn một hoặc hai cấp độ. Nếu các state object của bạn lồng ghép sâu, bạn có lẽ muốn [tái cấu trúc chúng khác đi](/learn/choosing-the-state-structure#avoid-deeply-nested-state) để chúng trở nên phẳng hơn.
- Nếu bạn không muốn thay đổi cấu trúc state của mình, bạn có thể sử dụng [Immer](https://github.com/immerjs/use-immer), thư viện cho phép bạn viết bằng cú pháp thuận tiện nhưng có biến đổi và chịu trách nhiệm về việc tạo bản sao cho bạn.

Dưới đây là ví dụ về Art Bucket List được viết lại bằng Immer:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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

Lưu ý rằng với Immer, **biến đổi như `artwork.seen = nextSeen` hiện đã được chấp nhận:**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

Điều này bởi vì bạn không biến đổi state **gốc**, mà bạn đang biến đổi một object `draft` đặc biệt được cung cấp bởi Immer. Tương tự, bạn cũng có thể áp dụng các phương thức biến đổi như `push()` và `pop()` vào nội dung của `draft`.

Đằng sau hậu trường, Immer luôn xây dựng state tiếp theo từ ban đầu, dựa trên các thay đổi mà bạn đã thực hiện với `draft`. Điều này giữ cho các hàm xử lý sự kiện của bạn rất gọn gàng mà không bao giờ biến đổi state.

<Recap>

- Bạn có thể đặt các array vào state, nhưng bạn không thể thay đổi chúng.
- Thay vì biến đổi một array trực tiếp, hãy tạo một bản sao **mới** của nó và cập nhật state thành nó.
- Bạn có thể sử dụng cú pháp array spread `[...arr, newItem]` để tạo arrays với các items mới.
- Bạn có thể sử dụng `filter()` và `map()` để tạo các arrays mới với các items đã được lọc hoặc biến đổi.
- Bạn có thể sử dụng Immer để giữ code của bạn gọn gàng.

</Recap>



<Challenges>

#### Cập nhật một item trong giỏ mua hàng {/*update-an-item-in-the-shopping-cart*/}

Hoàn thành `handleIncreaseClick` logic để khi nhấn "+", số tương ứng tăng lên:
<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Bạn có thể sử dụng hàm `map` để tạo một array, và sau đó sử dụng cú pháp object spread `...` để tạo một bản sao của object đã thay đổi cho array mới

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Xoá một item từ giỏ mua hàng {/*remove-an-item-from-the-shopping-cart*/}

Giỏ hàng này có một nút "+" hoạt động, nhưng nút "–" không làm gì cả. Bạn cần thêm một hàm xử lý sự kiện vào đó để khi nhấn vào, nó giảm `count` của sản phẩm tương ứng. Nếu bạn nhấn "–" khi count bằng 1, sản phẩm sẽ tự động bị xóa khỏi giỏ hàng. Đảm bảo rằng nó không bao giờ hiển thị 0.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Đầu tiên, bạn có thể sử dụng `map` để tạo một array mới, sau đó sử dụng `filter` để loại bỏ các sản phẩm có `count` bằng `0`:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Sửa những lỗi biến đổi sử dụng các phương thức không làm biến đổi {/*fix-the-mutations-using-non-mutative-methods*/}

Trong ví dụ này, tất cả các bộ xử lý sự kiện trong `App.js` đều sử dụng biến đổi trực tiếp. Kết quả là, việc chỉnh sửa và xóa các nhiệm vụ không hoạt động. Hãy viết lại `handleAddTodo`, `handleChangeTodo`, và `handleDeleteTodo` để sử dụng các phương thức không biến đổi:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

Trong `handleAddTodo`, bạn có thể sử dụng cú array spread. Trong `handleChangeTodo`, bạn có thể tạo một array mới với `map`. Trong `handleDeleteTodo`, bạn có thể tạo một array mới với `filter`. Bây giờ danh sách hoạt động đúng:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### Sửa lỗi biến đổi sử dụng Immer {/*fix-the-mutations-using-immer*/}

Đây là cùng một ví dụ như trong thử thách trước. Lần này, hãy sửa các biến đổi bằng cách sử dụng Immer. Để thuận tiện cho bạn, `useImmer` đã được import, vì vậy bạn cần thay đổi biến state `todos` để sử dụng nó.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

Với Immer, bạn có thể viết mã theo phong cách biến đổi, miễn là bạn chỉ biến đổi các phần của `draft` mà Immer cung cấp cho bạn. Ở đây, tất cả các biến đổi được thực hiện trên `draft` nên mã hoạt động:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

Bạn cũng có thể kết hợp cả hai cách tiếp cận biến đổi và không biến đổi với Immer.

Ví dụ, trong phiên bản này, `handleAddTodo` được thực hiện bằng cách biến đổi `draft` của Immer, trong khi `handleChangeTodo` và `handleDeleteTodo` sử dụng các phương thức không biến đổi `map` và `filter`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

Với Immer, bạn có thể chọn phong cách mà cảm thấy tự nhiên nhất cho mỗi trường hợp cụ thể.

</Solution>

</Challenges>
