---
title: Lựa chọn cấu trúc cho state
---

<Intro>

Cấu trúc state tốt có thể tạo ra sự khác biệt giữa một component dễ chỉnh sửa và debug và một component bị lỗi liên tục. Sau đây là một số mẹo bạn nên cân nhắc khi cấu trúc state.

</Intro>

<YouWillLearn>

* Khi nào nên sử dụng nhiều state hay một state duy nhất cho nhiều giá trị
* Những điều cần tránh khi tổ chức state
* Cách để fix những lỗi phổ biến khi cấu trúc state

</YouWillLearn>

## Nguyên tắc khi cấu trúc state {/*principles-for-structuring-state*/}

Khi bạn viết một component có chứa một vài state, bạn sẽ phải đưa ra quyết định về việc có bao nhiêu state cần sử dụng và cấu trúccủa chúng. Mặc dù có thể viết chương trình đúng ngay cả khi cấu trúc state không tối ưu, nhưng có một vài nguyên tắc có thể giúp bạn đưa ra những lựa chọn tốt hơn:

1. **Nhóm các state có liên quan.** Nếu bạn luôn phải cập nhật hai hoặc nhiều hơn state cùng một lúc, hãy nghĩ đến việc gộp chúng vào một state duy nhất.
2. **Tránh sự mâu thuẫn trong state.** Khi state được cấu trúc sao cho một số phần của state có thể mâu thuẫn và "không đồng ý" với nhau, bạn để lại cơ hội cho lỗi. Hãy cố gắng tránh điều này.
3. **Tránh dư thừa state.** Nếu bạn có thể tính toán một số thông tin từ props của component hoặc các state hiện tại của nó trong quá trình render, bạn không nên đặt thông tin đó vào state của component đó.
4. **Tránh trùng lặp trong state.** Khi cùng một data được lặp lại giữa nhiều state hoặc trong các object lồng nhau, rất khó để giữ cho chúng đồng bộ với nhau. Hạn chế sự trùng lặp này khi bạn có thể.
5. **Tránh lồng state quá sâu.** State có cấu trúc phân cấp sâu rất không thuận tiện để cập nhật. Khi có thể, hãy ưu tiên cấu trúc state theo cách phẳng.

Mục tiêu đằng sau các quy tắc này là *làm cho state dễ dàng cập nhật mà không gây ra lỗi*. Xoá data dư thừa và trùng lặp khỏi state giúp đảm bảo rằng tất cả các phần của nó luông đồng bộ. Điều này gần giống với cách một database engineer muốn ["chuẩn hoá" cấu trúc database](https://docs.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description) để giảm khả năng xảy ra lỗi. Để dùng lời của Albert Einstein, **"Hãy làm cho state của bạn đơn giản nhất có thể--nhưng không đơn giản hơn."**


Giờ hãy xem cách các nguyên tắc này được áp dụng trong thực tế.

## Nhóm các state liên quan {/*group-related-state*/}

Đôi khi bạn có thể không chắc chắn giữa việc sử dụng nhiều state hay một state duy nhất cho nhiều giá trị.

Bạn nên làm như thế này?

```js
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```

Hay như thế này?

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Về mặt kỹ thuật, bạn có thể sử dụng một trong hai cách trên. Nhưng **nếu hai state luôn thay đổi cùng nhau, việc gộp chúng lại với nhau có thể là một ý tưởng tốt.** Khi đó, bạn không cần phải lo lắng về việc giữ cho chúng đồng bộ, giống như trong ví dụ dưới đây khi di chuyển con trỏ sẽ cập nhật cả hai tọa độ của chấm đỏ:

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
  )
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

Một trường hợp khác là bạn sẽ nhóm data vào một object hoặc một mảng khi bạn không biết bạn sẽ cần bao nhiêu state. Ví dụ, nó rất hữu ích khi bạn có một form mà người dùng có thể thêm các trường tùy chỉnh.

<Pitfall>

Nếu state của bạn là một object, hãy nhớ rằng [bạn không thể chỉ cập nhật một trường của nó](/learn/updating-objects-in-state) mà không phải sao chép các trường khác. Ví dụ, bạn không thể gọi `setPosition({ x: 100 })` trong ví dụ trên vì nó sẽ không có trường `y` nào cả! Thay vào đó, nếu bạn muốn chỉ cập nhật `x`, bạn sẽ phải gọi `setPosition({ ...position, x: 100 })`, hoặc chia chúng thành hai state và gọi `setX(100)`.

</Pitfall>

## Tránh mâu thuẫn trong state {/*avoid-contradictions-in-state*/}

Đây là một form phản hồi của khách sạn với state `isSending` và `isSent`:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>Cảm ơn bạn đã phản hồi!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p></p>
      <p>Bạn thấy kỳ nghỉ của mình tại The Prancing Pony thế nào?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Gửi
      </button>
      {isSending && <p>Đang gửi...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

Trong khi đoạn code này hoạt động, nó để lại cơ hội cho các trạng thái "không thể xảy ra" xảy ra. Ví dụ, nếu bạn quên gọi `setIsSent` và `setIsSending` cùng một lúc, bạn có thể kết thúc trong tình huống mà cả `isSending` và `isSent` đều là `true` cùng một lúc. Component của bạn càng phức tạp, việc hiểu xem đã xảy ra điều gì càng khó khăn.

**Vì `isSending` và `isSent` không nên cùng `true` trong bất kỳ trường hợp nào, tốt hơn là nó nên được thay thế bởi một state được gọi là `status` và nó có thể mang một trong các giá trị sau:** `'typing'` (ban đầu), `'sending'`, và `'sent'`:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    await sendMessage(text);
    setStatus('sent');
  }

  const isSending = status === 'sending';
  const isSent = status === 'sent';

  if (isSent) {
    return <h1>Cảm ơn bạn đã phản hồi!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Bạn thấy kỳ nghỉ của mình tại The Prancing Pony như thế nào?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Gửi
      </button>
      {isSending && <p>Đang gửi...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

Bạn cũng có thể khai báo thêm một số hằng số để dễ đọc:

```js
const isSending = status === 'sending';
const isSent = status === 'sent';
```

Vì chúng không phải là state, nên bạn không cần phải lo lắng về việc chúng không đồng bộ với nhau.

## Tránh dư thừa state {/*avoid-redundant-state*/}

Nếu bạn có thể tính toán một số thông tin từ props của component hoặc các state hiện tại của nó trong quá trình render, bạn **không nên** đặt thông tin đó vào state của component đó.

Ví dụ, hãy xem form này. Nó hoạt động, nhưng bạn có thể tìm thấy bất kỳ state nào dư thừa không?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(lastName + ' ' + e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(e.target.value + ' ' + firstName);
  }

  return (
    <>
      <h2>Đăng ký thông tin</h2>
      <label>
        Họ:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Tên:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <p>
        Vé của bạn sẽ được cấp cho: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Form này có chứa ba state: `firstName`, `lastName` và `fullName`. Tuy nhiên, `fullName` là dư thừa. **Bạn luôn có thể tính được `fullName` từ `firstName` và `lastName` khi render, do đó hãy xoá nó khỏi state.**

Đây là cách bạn có thể làm điều đó:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = lastName + ' ' + firstName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Đăng ký thông tin</h2>
      <label>
        Họ:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Tên:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <p>
        Vé của bạn sẽ được cấp cho: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Giờ đây, `fullName` *không* là state. Thay vào đó, nó được tính toán trong quá trình render:

```js
const fullName = lastName + ' ' + firstName;
```

As a result, the change handlers don't need to do anything special to update it. When you call `setFirstName` or `setLastName`, you trigger a re-render, and then the next `fullName` will be calculated from the fresh data.

Do đó, các handler không cần phải làm bất cứ điều gì đặc biệt để cập nhật nó. Khi bạn gọi `setFirstName` hoặc `setLastName`, bạn kích hoạt một lần re-render, và sau đó `fullName` sẽ được tính toán từ dữ liệu mới.

<DeepDive>

#### Đừng sao chép props vào state {/*don-t-mirror-props-in-state*/}

Một ví dụ cho sự dư thừa state phổ biến là đoạn code như sau:

```js
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
```

Ở đây, `color` mang giá trị khỏi tạo là prop `messageColor`. Vấn đề là **nếu component cha truyền một giá trị khác của `messageColor` sau này (ví dụ, `'red'` thay vì `'blue'`), biến `color` *state variable* sẽ không được cập nhật!** State chỉ được khởi tạo trong lần render đầu tiên.

Đây là lý do tại sao sao chép một số prop vào một state có thể dẫn đến sự nhầm lẫn. Thay vào đó, hãy sử dụng prop `messageColor` trực tiếp trong code của bạn. Nếu bạn muốn đặt tên ngắn gọn hơn, hãy gán cho nó một hằng số:

```js
function Message({ messageColor }) {
  const color = messageColor;
```

Bằng cách này, nó sẽ đồng bộ với prop được truyền từ component cha.

Sao chép props vào state chỉ hợp lý khi bạn *muốn* bỏ qua tất cả các cập nhật cho một prop cụ thể. Theo quy ước, bắt đầu tên prop với `initial` hoặc `default` để làm rõ rằng các giá trị mới của nó bị bỏ qua:

```js
function Message({ initialColor }) {
  // State `color` mang giá trị *đầu tiên* của `initialColor`.
  // Các thay đổi sau này của prop `initialColor` sẽ bị bỏ qua.
  const [color, setColor] = useState(initialColor);
```

</DeepDive>

## Tránh trùng lặp trong state {/*avoid-duplication-in-state*/}

Component Menu này cho phép bạn chọn một món ăn từ danh sách và hiển thị món ăn đã chọn:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'phở', id: 0 },
  { title: 'bún chả', id: 1 },
  { title: 'bánh mì', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  return (
    <>
      <h2>Bạn muốn dùng món gì</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Chọn</button>
          </li>
        ))}
      </ul>
      <p>Bạn đã chọn {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

Hiện tại, nó lưu món ăn được chọn dưới dạng một object trong state `selectedItem`. Tuy nhiên, điều này là không tốt: **nội dung của `selectedItem` giống một object trong danh sách `items`.** Điều này có nghĩa là thông tin về món ăn đó được lặp lại ở hai nơi.

Tại sao điều này là một vấn đề? Hãy thử cho phép người dùng chỉnh sửa món ăn trong danh sách:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'phở', id: 0 },
  { title: 'bún chả', id: 1 },
  { title: 'bánh mì', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>Bạn muốn dùng món gì?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Chọn</button>
          </li>
        ))}
      </ul>
      <p>Bạn đã chọn {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

Hãy để ý là khi bạn nhấn "Chọn" một món ăn *sau đó* chỉnh sửa món đó, **ô input được cập nhật nhưng nhãn ở dưới không phản ánh những chỉnh sửa.** Điều này xảy ra vì bạn đã trùng lặp state, và bạn đã quên cập nhật `selectedItem`.

Mặc dù bạn cũng có thể cập nhật `selectedItem`, một cách fix dễ hơn là xoá bỏ sự trùng lặp. Trong ví dụ này, thay vì một object `selectedItem` (tạo ra sự trùng lặp với các object trong `items`), bạn giữ `selectedId` trong state, và *sau đó* lấy `selectedItem` bằng cách tìm kiếm mảng `items` để tìm một item với ID đó:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'phở', id: 0 },
  { title: 'bún chả', id: 1 },
  { title: 'bánh mì', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  const selectedItem = items.find(item =>
    item.id === selectedId
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>Bạn muốn dùng món gì?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedId(item.id);
            }}>Chọn</button>
          </li>
        ))}
      </ul>
      <p>Bạn đã chọn {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

State được sử dụng trước đây trông như thế này:

* `items = [{ id: 0, title: 'phở' }, ...]`
* `selectedItem = { id: 0, title: 'phở' }`

Nhưng sau khi thay đổi, nó trông như thế này:

* `items = [{ id: 0, title: 'phở'}, ...]`
* `selectedId = 0`

Sự trùng lặp đã biến mất, và bạn chỉ giữ lại state cần thiết!

Giờ nếu bạn chỉnh sửa món ăn *đã chọn*, nội dung tin nhắn bên dưới sẽ cập nhật ngay lập tức. Điều này xảy ra vì `setItems` kích hoạt một lần re-render, và `items.find(...)` sẽ tìm thấy món ăn với tiêu đề đã cập nhật. Bạn không cần giữ lại *món đã chọn* trong state, vì chỉ *ID đã chọn* mới là cần thiết. Phần còn lại có thể được tính toán trong quá trình render.

## Tránh sử dụng state lồng nhau quá sâu {/*avoid-deeply-nested-state*/}

Hãy tưởng tượng một kế hoạch du lịch bao gồm các hành tinh, châu lục và quốc gia. Bạn có thể muốn  cấu trúc state của nó bằng cách sử dụng các object và mảng lồng nhau, như trong ví dụ này:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ place }) {
  const childPlaces = place.childPlaces;
  return (
    <li>
      {place.title}
      {childPlaces.length > 0 && (
        <ol>
          {childPlaces.map(place => (
            <PlaceTree key={place.id} place={place} />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const planets = plan.childPlaces;
  return (
    <>
      <h2>Địa điểm tham quan</h2>
      <ol>
        {planets.map(place => (
          <PlaceTree key={place.id} place={place} />
        ))}
      </ol>
    </>
  );
}
```

```js src/places.js active
export const initialTravelPlan = {
  id: 0,
  title: '(Root)',
  childPlaces: [{
    id: 1,
    title: 'Trái Đất',
    childPlaces: [{
      id: 2,
      title: 'Châu Phi',
      childPlaces: [{
        id: 3,
        title: 'Botswana',
        childPlaces: []
      }, {
        id: 4,
        title: 'Egypt',
        childPlaces: []
      }, {
        id: 5,
        title: 'Kenya',
        childPlaces: []
      }, {
        id: 6,
        title: 'Madagascar',
        childPlaces: []
      }, {
        id: 7,
        title: 'Morocco',
        childPlaces: []
      }, {
        id: 8,
        title: 'Nigeria',
        childPlaces: []
      }, {
        id: 9,
        title: 'Nam Phi',
        childPlaces: []
      }]
    }, {
      id: 10,
      title: 'Châu Mỹ',
      childPlaces: [{
        id: 11,
        title: 'Argentina',
        childPlaces: []
      }, {
        id: 12,
        title: 'Brazil',
        childPlaces: []
      }, {
        id: 13,
        title: 'Barbados',
        childPlaces: []
      }, {
        id: 14,
        title: 'Canada',
        childPlaces: []
      }, {
        id: 15,
        title: 'Jamaica',
        childPlaces: []
      }, {
        id: 16,
        title: 'Mexico',
        childPlaces: []
      }, {
        id: 17,
        title: 'Trinidad and Tobago',
        childPlaces: []
      }, {
        id: 18,
        title: 'Venezuela',
        childPlaces: []
      }]
    }, {
      id: 19,
      title: 'Châu Á',
      childPlaces: [{
        id: 20,
        title: 'Trung Quốc',
        childPlaces: []
      }, {
        id: 21,
        title: 'Ấn Độ',
        childPlaces: []
      }, {
        id: 22,
        title: 'Singapore',
        childPlaces: []
      }, {
        id: 23,
        title: 'Hàn Quốc',
        childPlaces: []
      }, {
        id: 24,
        title: 'Thái Lan',
        childPlaces: []
      }, {
        id: 25,
        title: 'Việt Nam',
        childPlaces: []
      }]
    }, {
      id: 26,
      title: 'Châu Âu',
      childPlaces: [{
        id: 27,
        title: 'Croatia',
        childPlaces: [],
      }, {
        id: 28,
        title: 'Pháp',
        childPlaces: [],
      }, {
        id: 29,
        title: 'Đức',
        childPlaces: [],
      }, {
        id: 30,
        title: 'Italy',
        childPlaces: [],
      }, {
        id: 31,
        title: 'Portugal',
        childPlaces: [],
      }, {
        id: 32,
        title: 'Spain',
        childPlaces: [],
      }, {
        id: 33,
        title: 'Thổ Nhĩ Kỳ',
        childPlaces: [],
      }]
    }, {
      id: 34,
      title: 'Châu Đại Dương',
      childPlaces: [{
        id: 35,
        title: 'Úc',
        childPlaces: [],
      }, {
        id: 36,
        title: 'Bora Bora (French Polynesia)',
        childPlaces: [],
      }, {
        id: 37,
        title: 'Easter Island (Chile)',
        childPlaces: [],
      }, {
        id: 38,
        title: 'Fiji',
        childPlaces: [],
      }, {
        id: 39,
        title: 'Hawaii (the USA)',
        childPlaces: [],
      }, {
        id: 40,
        title: 'New Zealand',
        childPlaces: [],
      }, {
        id: 41,
        title: 'Vanuatu',
        childPlaces: [],
      }]
    }]
  }, {
    id: 42,
    title: 'Mặt Trăng',
    childPlaces: [{
      id: 43,
      title: 'Rheita',
      childPlaces: []
    }, {
      id: 44,
      title: 'Piccolomini',
      childPlaces: []
    }, {
      id: 45,
      title: 'Tycho',
      childPlaces: []
    }]
  }, {
    id: 46,
    title: 'Sao Hoả',
    childPlaces: [{
      id: 47,
      title: 'Corn Town',
      childPlaces: []
    }, {
      id: 48,
      title: 'Green Hill',
      childPlaces: []      
    }]
  }]
};
```

</Sandpack>

Giờ giả sử bạn muốn thêm một cái nút để xoá một địa điểm mà bạn đã ghé thăm. Bạn sẽ làm như thế nào? [Cập nhật state lồng nhau](/learn/updating-objects-in-state#updating-a-nested-object) liên quan đến việc sao chép các object từ phần đã thay đổi. Xoá một địa điểm sâu sẽ liên quan đến việc sao chép toàn bộ chuỗi cha của nó. Đoạn code như vậy có thể rất dài dòng.

**Nếu state quá lồng nhau để cập nhật dễ dàng, hãy xem xét làm cho nó "phẳng".** Dưới đây là một cách bạn có thể cấu trúc lại dữ liệu này. Thay vì một cấu trúc giống cây với mỗi `place` có một mảng *các địa điểm con của nó*, bạn có thể làm cho mỗi địa điểm giữ một mảng *các ID địa điểm con của nó*. Sau đó map từng ID đến địa điểm tương ứng.

Cấu trúc mới này có thể khiến bạn nhớ đến việc xem một bảng cơ sở dữ liệu:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ id, placesById }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      {childIds.length > 0 && (
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              placesById={placesById}
            />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Địa điểm tham quan</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            placesById={plan}
          />
        ))}
      </ol>
    </>
  );
}
```

```js src/places.js active
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Trái Đất',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Châu Phi',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypt',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'Morocco',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'Nam Phi',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Châu Mỹ',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brazil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexico',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad and Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Châu Á',
    childIds: [20, 21, 22, 23, 24, 25],   
  },
  20: {
    id: 20,
    title: 'Trung Quốc',
    childIds: []
  },
  21: {
    id: 21,
    title: 'Ấn Độ',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapore',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Hàn Quốc',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Thái Lan',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Việt Nam',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Châu Âu',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
    title: 'Croatia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'Pháp',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Đức',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Italy',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Thổ Nhĩ Kỳ',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Châu Đại Dương',
    childIds: [35, 36, 37, 38, 39, 40, 41],   
  },
  35: {
    id: 35,
    title: 'Úc',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Easter Island (Chile)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fiji',
    childIds: []
  },
  39: {
    id: 40,
    title: 'Hawaii (the USA)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'New Zealand',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Mặt Trăng',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Sao Hoả',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```

</Sandpack>

**Giờ khi state đã "phẳng" (còn được gọi là "chuẩn hoá"), việc cập nhật các mục lồng nhau trở nên dễ dàng hơn.**

Để xoá một địa điểm bây giờ, bạn chỉ cần thực hiện hai cập nhật state:

- Xoá ID của nó khỏi mảng `childIds` của địa điểm cha.
- Cập nhật object state gốc để nó không chứa địa điểm đó nữa.

Đây là một ví dụ về cách bạn có thể thực hiện điều đó:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleComplete(parentId, childId) {
    const parent = plan[parentId];
    // Tạo một phiên bản mới của địa điểm cha
    // mà không bao gồm ID con này.
    const nextParent = {
      ...parent,
      childIds: parent.childIds
        .filter(id => id !== childId)
    };
    // Cập nhật object state gốc...
    setPlan({
      ...plan,
      // ...để nó có cha đã cập nhật.
      [parentId]: nextParent
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Địa điểm tham quan</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        Hoàn thành
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```

```js src/places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Trái Đất',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Châu Phi',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypt',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'Morocco',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'Nam Phi',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Châu Mỹ',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brazil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexico',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad and Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Châu Á',
    childIds: [20, 21, 22, 23, 24, 25],   
  },
  20: {
    id: 20,
    title: 'Trung Quốc',
    childIds: []
  },
  21: {
    id: 21,
    title: 'Ấn Độ',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapore',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Hàn Quốc',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Thái Lan',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Việt Nam',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Châu Âu',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
    title: 'Croatia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'Pháp',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Đức',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Italy',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Thổ Nhĩ Kỳ',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Châu Đại Dương',
    childIds: [35, 36, 37, 38, 39, 40, 41],   
  },
  35: {
    id: 35,
    title: 'Úc',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Easter Island (Chile)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fiji',
    childIds: []
  },
  39: {
    id: 40,
    title: 'Hawaii (the USA)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'New Zealand',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Mặt Trăng',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Sao Hoả',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
```

</Sandpack>

Bạn có thể lồng state bao nhiêu cũng được, nhưng làm cho nó "phẳng" có thể giải quyết nhiều vấn đề. Nó giúp cập nhật state dễ dàng hơn, và đảm bảo bạn không có sự trùng lặp ở các phần khác nhau của một object lồng nhau.

<DeepDive>

#### Cải thiện việc sử dụng bộ nhớ {/*improving-memory-usage*/}

Một cách lý tưởng, bạn cũng nên xoá các mục đã xoá (và các mục con của chúng!) khỏi object "bảng" để cải thiện việc sử dụng bộ nhớ. Phiên bản này thực hiện điều đó. Nó cũng [sử dụng Immer](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) để làm cho logic cập nhật ngắn gọn hơn.

<Sandpack>

```js
import { useImmer } from 'use-immer';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, updatePlan] = useImmer(initialTravelPlan);

  function handleComplete(parentId, childId) {
    updatePlan(draft => {
      // Xoá khỏi mảng ID con của địa điểm cha.
      const parent = draft[parentId];
      parent.childIds = parent.childIds
        .filter(id => id !== childId);

      // Đệ quy để xoá tất cả các địa điểm con.
      deleteAllChildren(childId);
      function deleteAllChildren(id) {
        const place = draft[id];
        place.childIds.forEach(deleteAllChildren);
        delete draft[id];
      }
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Địa điểm tham quan</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        Hoàn thành
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```

```js src/places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Trái Đất',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Châu Phi',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypt',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'Morocco',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'Nam Phi',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Châu Mỹ',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brazil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexico',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad and Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Châu Á',
    childIds: [20, 21, 22, 23, 24, 25],   
  },
  20: {
    id: 20,
    title: 'Trung Quốc',
    childIds: []
  },
  21: {
    id: 21,
    title: 'Ấn Độ',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapore',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Hàn Quốc',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Thái Lan',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Việt Nam',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Châu Âu',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
    title: 'Croatia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'Pháp',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Đức',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Italy',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Thổ Nhĩ Kỳ',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Châu Đại Dương',
    childIds: [35, 36, 37, 38, 39, 40, 41],   
  },
  35: {
    id: 35,
    title: 'Úc',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Easter Island (Chile)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fiji',
    childIds: []
  },
  39: {
    id: 40,
    title: 'Hawaii (the USA)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'New Zealand',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Mặt Trăng',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Sao Hoả',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
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

</DeepDive>

Đôi khi, bạn cũng có thể giảm thiểu việc lồng state bằng cách di chuyển một số state lồng vào các component con. Điều này hoạt động tốt cho state UI tạm thời mà không cần lưu trữ, như việc kiểm tra một item có được hover hay không.

<Recap>

* Nếu hai state luôn luôn cập nhật cùng nhau, hãy xem xét việc gộp chúng thành một.
* Chọn cẩn thận các biến state của bạn để tránh tạo ra các trạng thái "không thể xảy ra".
* Cấu trúc state của bạn sao cho giảm khả năng bạn sẽ mắc lỗi khi cập nhật nó.
* Tránh state trùng lặp và dư thừa để bạn không cần phải đồng bộ chúng.
* Không đặt props *vào* state trừ khi bạn muốn ngăn cập nhật.
* Đối với UI như chọn lựa, giữ ID hoặc index trong state thay vì chính object đó.
* Nếu việc cập nhật state lồng nhau quá phức tạp, hãy thử làm phẳng nó.

</Recap>

<Challenges>

#### Fix một component không cập nhật {/*fix-a-component-thats-not-updating*/}

Component `Clock` này nhận vào hai props: `color` và `time`. Khi bạn chọn một màu khác trong hộp chọn, component `Clock` nhận một `color` khác từ component cha của nó. Tuy nhiên, vì một lý do nào đó, màu hiển thị không cập nhật. Tại sao? Hãy fix lỗi này.

<Sandpack>

```js src/Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  const [color, setColor] = useState(props.color);
  return (
    <h1 style={{ color: color }}>
      {props.time}
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

<Solution>

Vấn đề là component này có một state `color` được khởi tạo với giá trị ban đầu của prop `color`. Nhưng khi prop `color` thay đổi, điều này không ảnh hưởng đến biến state! Vì vậy chúng không đồng bộ. Để fix lỗi này, xoá biến state hoàn toàn, và sử dụng luôn prop `color`.

<Sandpack>

```js src/Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  return (
    <h1 style={{ color: props.color }}>
      {props.time}
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

Hoặc sử dụng cú pháp destructuring:

<Sandpack>

```js src/Clock.js active
import { useState } from 'react';

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

</Solution>

#### Fix một danh sách đóng hàng bị lỗi {/*fix-a-broken-packing-list*/}

Danh sách đóng hàng này có một footer hiển thị số lượng mục đã đóng, và tổng số mục. Có vẻ như lúc đầu nó hoạt động, nhưng nó bị lỗi. Ví dụ, nếu bạn đánh dấu một mục là đã đóng và sau đó xoá nó, số lượng sẽ không được cập nhật đúng. Sửa lỗi để nó luôn chính xác.

<Hint>

Có bất kỳ state nào trong ví dụ này là dư thừa không?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Tất ấm', packed: true },
  { id: 1, title: 'Nhật ký du lịch', packed: false },
  { id: 2, title: 'Màu nước', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(3);
  const [packed, setPacked] = useState(1);

  function handleAddItem(title) {
    setTotal(total + 1);
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    if (nextItem.packed) {
      setPacked(packed + 1);
    } else {
      setPacked(packed - 1);
    }
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setTotal(total - 1);
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>  
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>{packed} trên {total} đã được đóng gói!</b>
    </>
  );
}
```

```js src/AddItem.js hidden
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add item"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>Thêm</button>
    </>
  )
}
```

```js src/PackingList.js hidden
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            Xoá
          </button>
        </li>
      ))}
    </ul>
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

Mặc dù bạn có thể cẩn thận thay đổi từng handler sự kiện để cập nhật các biến `total` và `packed` đúng cách, vấn đề gốc là các biến state này tồn tại. Chúng là dư thừa vì bạn luôn có thể tính toán số lượng mục (đã đóng hoặc tổng cộng) từ mảng `items` chính nó. Xoá các state dư thừa để fix lỗi:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Tất ấm', packed: true },
  { id: 1, title: 'Nhật ký du lịch', packed: false },
  { id: 2, title: 'Màu nước', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);

  const total = items.length;
  const packed = items
    .filter(item => item.packed)
    .length;

  function handleAddItem(title) {
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>  
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>{packed} trên {total} đã được đóng gói!</b>
    </>
  );
}
```

```js src/AddItem.js hidden
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add item"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>Thêm</button>
    </>
  )
}
```

```js src/PackingList.js hidden
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            Xoá
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

Lưu ý cách các handler sự kiện chỉ quan tâm đến việc gọi `setItems` sau thay đổi này. Số lượng mục được tính toán trong lần render tiếp theo từ `items`, vì vậy chúng luôn được cập nhật.

</Solution>

#### Fix lỗi thấy lựa chọn {/*fix-the-disappearing-selection*/}

Đây là một state danh sách `letters`. Khi bạn hover hoặc focus một phần lá thư, nó sẽ được highlight. Phần lá thư hiện tại được highlight được lưu trong biến state `highlightedLetter`. Bạn có thể "star" và "unstar" từng phần lá thư, điều này cập nhật state `letters`.

Đoạn code này hoạt động, nhưng có một vấn đề về UI. Khi bạn "Star" hoặc "Unstar", phần lá thư không còn được highlight nữa trong một lát. Tuy nhiên, nó lại hoạt động lại sau khi bạn di chuyển chuột đến lá thư khác. Tại sao điều này lại xảy ra? Fix nó để highlight không bị mất sau khi nút được nhấn.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedLetter, setHighlightedLetter] = useState(null);

  function handleHover(letter) {
    setHighlightedLetter(letter);
  }

  function handleStar(starred) {
    setLetters(letters.map(letter => {
      if (letter.id === starred.id) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>Hộp thư</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter === highlightedLetter
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter);        
      }}
      onPointerMove={() => {
        onHover(letter);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter);
      }}>
        {letter.isStarred ? 'Unstar' : 'Star'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js src/data.js
export const initialLetters = [{
  id: 0,
  subject: 'Sẵn sàng phiêu lưu chưa?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Đã đến lúc check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Chỉ BẢY ngày nữa là lễ hội bắt đầu rồi!',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

<Solution>

Vấn đề là bạn đang giữ đối tượng lá thư trong `highlightedLetter`. Nhưng bạn cũng giữ cùng thông tin trong mảng `letters`. Vì vậy state của bạn có sự trùng lặp! Khi bạn cập nhật mảng `letters` sau khi nút được nhấn, bạn tạo một object `letter` mới khác với `highlightedLetter`. Điều này làm cho kiểm tra `highlightedLetter === letter` trở thành `false`, và highlight biến mất. Nó sẽ xuất hiện lại lần tiếp theo bạn gọi `setHighlightedLetter` khi con trỏ di chuyển.

Để fix lỗi, xoá sự trùng lặp từ state. Thay vì lưu *chính object lá thư* ở hai nơi, hãy lưu `highlightedId`. Sau đó bạn có thể kiểm tra `isHighlighted` cho mỗi lá thư với `letter.id === highlightedId`, điều này sẽ hoạt động ngay cả khi đối tượng `letter` đã thay đổi kể từ lần render trước.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedId, setHighlightedId ] = useState(null);

  function handleHover(letterId) {
    setHighlightedId(letterId);
  }

  function handleStar(starredId) {
    setLetters(letters.map(letter => {
      if (letter.id === starredId) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>Hộp thư</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter.id === highlightedId
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter.id);        
      }}
      onPointerMove={() => {
        onHover(letter.id);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter.id);
      }}>
        {letter.isStarred ? 'Unstar' : 'Star'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js src/data.js
export const initialLetters = [{
  id: 0,
  subject: 'Sẵn sàng phiêu lưu chưa?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Đã đến lúc check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Chỉ BẢY ngày nữa là lễ hội bắt đầu rồi!',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

</Solution>

#### Triển khai chọn nhiều mục {/*implement-multiple-selection*/}

Trong ví dụ này, mỗi `Letter` có một prop là `isSelected` và một prop là `onToggle` dùng để đánh dấu nó là đã chọn. Điều này hoạt động, nhưng state được lưu trữ dưới dạng `selectedId` (hoặc `null` hoặc một ID), vì vậy chỉ có một lá thư được chọn vào một thời điểm.

Thay đổi cấu trúc state để hỗ trợ chọn nhiều mục. (Bạn sẽ cấu trúc nó như thế nào? Hãy suy nghĩ về điều này trước khi viết code.) Mỗi checkbox nên trở nên độc lập với các checkbox khác. Khi bạn click vào một lá thư đã chọn, nó sẽ bỏ chọn. Cuối cùng, footer sẽ hiển thị số lượng mục đã chọn đúng.

<Hint>

Thay vì sử dụng một `selectedId` duy nhất, bạn có thể muốn sử dụng một mảng hoặc một [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) cho các ID đã chọn trong state.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedId, setSelectedId] = useState(null);

  // TODO: cho phép chọn nhiều mục
  const selectedCount = 1;

  function handleToggle(toggledId) {
    // TODO: cho phép chọn nhiều mục
    setSelectedId(toggledId);
  }

  return (
    <>
      <h2>Hộp thư</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              // TODO: cho phép chọn nhiều mục
              letter.id === selectedId
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            Bạn đã chọn {selectedCount} lá thư
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js src/data.js
export const letters = [{
  id: 0,
  subject: 'Sẵn sàng phiêu lưu chưa?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Đã đến lúc check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Chỉ BẢY ngày nữa là lễ hội bắt đầu rồi!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

<Solution>

Thay vì một `selectedId` duy nhất, giữ một mảng `selectedIds` trong state. Ví dụ, nếu bạn chọn chữ lá thư đầu tiên tiên và cuối cùng, nó sẽ chứa `[0, 2]`. Khi không có gì được chọn, nó sẽ là một mảng rỗng `[]`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState([]);

  const selectedCount = selectedIds.length;

  function handleToggle(toggledId) {
    // Nếu đã được chọn trước đó
    if (selectedIds.includes(toggledId)) {
      // Thì xoá ID này khỏi mảng.
      setSelectedIds(selectedIds.filter(id =>
        id !== toggledId
      ));
    } else {
      // Còn không thì thêm vào mảng.
      setSelectedIds([
        ...selectedIds,
        toggledId
      ]);
    }
  }

  return (
    <>
      <h2>Hộp thư</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.includes(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            Bạn đã chọn {selectedCount} lá thư
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js src/data.js
export const letters = [{
  id: 0,
  subject: 'Sẵn sàng phiêu lưu chưa?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Đã đến lúc check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Chỉ BẢY ngày nữa là lễ hội bắt đầu rồi!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

Một nhược điểm nhỏ của việc sử dụng một mảng là cho mỗi mục, bạn đang gọi `selectedIds.includes(letter.id)` để kiểm tra xem nó có được chọn hay không. Nếu mảng rất lớn, điều này có thể trở thành một vấn đề hiệu suất vì tìm kiếm mảng với [`includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) độ phức tạp tuyến tính - `O(n)`, và bạn đang thực hiện tìm kiếm này cho từng mục riêng lẻ.

Để fix lỗi này, bạn có thể sử dụng một [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) trong state thay vì một mảng, nó cung cấp phương thức [`has()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has) nhanh chóng:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState(
    new Set()
  );

  const selectedCount = selectedIds.size;

  function handleToggle(toggledId) {
    // Create a copy (to avoid mutation).
    const nextIds = new Set(selectedIds);
    if (nextIds.has(toggledId)) {
      nextIds.delete(toggledId);
    } else {
      nextIds.add(toggledId);
    }
    setSelectedIds(nextIds);
  }

  return (
    <>
      <h2>Hộp thư</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.has(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            Bạn đã chọn {selectedCount} lá thư
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js src/data.js
export const letters = [{
  id: 0,
  subject: 'Sẵn sàng phiêu lưu chưa?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Đã đến lúc check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Chỉ BẢY ngày nữa là lễ hội bắt đầu rồi!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

Giờ mỗi mục thực hiện kiểm tra `selectedIds.has(letter.id)`, điều này rất nhanh chóng.

Hãy lưu ý rằng bạn [không nên thay đổi các object trong state](/learn/updating-objects-in-state), và điều này bao gồm cả Set. Đó là lý do tại sao hàm `handleToggle` tạo một *bản sao* của Set trước, và sau đó cập nhật bản sao đó.

</Solution>

</Challenges>
