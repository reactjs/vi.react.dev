---
title: Giữ Các Component Thuần Khiết
---

<Intro>

Một số hàm JavaScript là *thuần khiết.* Các hàm thuần khiết chỉ thực hiện một phép tính và không làm gì khác. Bằng cách chỉ viết các component của bạn như các hàm thuần khiết, bạn có thể tránh được cả một loạt các lỗi khó hiểu và hành vi không thể đoán trước khi codebase của bạn phát triển. Để có được những lợi ích này, bạn phải tuân theo một vài quy tắc.

</Intro>

<YouWillLearn>

* Tính thuần khiết là gì và nó giúp bạn tránh lỗi như thế nào
* Làm thế nào để giữ cho các component thuần khiết bằng cách giữ các thay đổi bên ngoài giai đoạn render
* Cách sử dụng Strict Mode để tìm lỗi trong các component của bạn

</YouWillLearn>

## Tính Thuần Khiết: Các Component Như Các Công Thức {/*purity-components-as-formulas*/}

Trong khoa học máy tính (và đặc biệt là thế giới của lập trình hàm), [một hàm thuần khiết](https://wikipedia.org/wiki/Pure_function) là một hàm có các đặc điểm sau:

* **Nó chỉ lo việc của nó.** Nó không thay đổi bất kỳ đối tượng hoặc biến nào đã tồn tại trước khi nó được gọi.
* **Đầu vào giống nhau, đầu ra giống nhau.** Với cùng một đầu vào, một hàm thuần khiết phải luôn trả về cùng một kết quả.

Bạn có thể đã quen thuộc với một ví dụ về các hàm thuần khiết: các công thức trong toán học.

Xem xét công thức toán học này: <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.

Nếu <Math><MathI>x</MathI> = 2</Math> thì <Math><MathI>y</MathI> = 4</Math>. Luôn luôn.

Nếu <Math><MathI>x</MathI> = 3</Math> thì <Math><MathI>y</MathI> = 6</Math>. Luôn luôn.

Nếu <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> sẽ không đôi khi là <Math>9</Math> hoặc <Math>–1</Math> hoặc <Math>2.5</Math> tùy thuộc vào thời gian trong ngày hoặc trạng thái của thị trường chứng khoán.

Nếu <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> và <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> sẽ _luôn luôn_ là <Math>6</Math>.

Nếu chúng ta biến điều này thành một hàm JavaScript, nó sẽ trông như thế này:

```js
function double(number) {
  return 2 * number;
}
```

Trong ví dụ trên, `double` là một **hàm thuần khiết.** Nếu bạn truyền cho nó `3`, nó sẽ trả về `6`. Luôn luôn.

React được thiết kế dựa trên khái niệm này. **React giả định rằng mọi component bạn viết là một hàm thuần khiết.** Điều này có nghĩa là các component React bạn viết phải luôn trả về cùng một JSX với cùng một đầu vào:

<Sandpack>

```js src/App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>Đun sôi {drinkers} cốc nước.</li>
      <li>Thêm {drinkers} thìa trà và {0.5 * drinkers} thìa gia vị.</li>
      <li>Thêm {0.5 * drinkers} cốc sữa vào đun sôi và đường tùy khẩu vị.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Công Thức Trà Chai Cay</h1>
      <h2>Cho hai người</h2>
      <Recipe drinkers={2} />
      <h2>Cho một buổi tụ tập</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

Khi bạn truyền `drinkers={2}` cho `Recipe`, nó sẽ trả về JSX chứa `2 cốc nước`. Luôn luôn.

Nếu bạn truyền `drinkers={4}`, nó sẽ trả về JSX chứa `4 cốc nước`. Luôn luôn.

Giống như một công thức toán học.

Bạn có thể nghĩ về các component của mình như các công thức nấu ăn: nếu bạn làm theo chúng và không đưa thêm nguyên liệu mới trong quá trình nấu, bạn sẽ nhận được món ăn giống nhau mỗi lần. "Món ăn" đó là JSX mà component phục vụ cho React để [render.](/learn/render-and-commit)

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="Một công thức trà cho x người: lấy x cốc nước, thêm x thìa trà và 0.5x thìa gia vị, và 0.5x cốc sữa" />

## Tác Dụng Phụ: Hậu Quả (Không) Mong Muốn {/*side-effects-unintended-consequences*/}

Quá trình render của React phải luôn thuần khiết. Các component chỉ nên *trả về* JSX của chúng, và không *thay đổi* bất kỳ đối tượng hoặc biến nào đã tồn tại trước khi render—điều đó sẽ làm cho chúng không thuần khiết!

Đây là một component vi phạm quy tắc này:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Sai: thay đổi một biến đã tồn tại!
  guest = guest + 1;
  return <h2>Cốc trà cho khách #{guest}</h2>;
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

Component này đang đọc và ghi một biến `guest` được khai báo bên ngoài nó. Điều này có nghĩa là **gọi component này nhiều lần sẽ tạo ra JSX khác nhau!** Và hơn thế nữa, nếu các component _khác_ đọc `guest`, chúng cũng sẽ tạo ra JSX khác nhau, tùy thuộc vào thời điểm chúng được render! Điều đó không thể đoán trước được.

Quay trở lại công thức của chúng ta <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>, bây giờ ngay cả khi <Math><MathI>x</MathI> = 2</Math>, chúng ta không thể tin rằng <Math><MathI>y</MathI> = 4</Math>. Các bài kiểm tra của chúng ta có thể thất bại, người dùng của chúng ta sẽ bối rối, máy bay sẽ rơi khỏi bầu trời—bạn có thể thấy điều này sẽ dẫn đến những lỗi khó hiểu như thế nào!

Bạn có thể sửa component này bằng cách [truyền `guest` như một prop](/learn/passing-props-to-a-component):

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Cốc trà cho khách #{guest}</h2>;
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

Bây giờ component của bạn là thuần khiết, vì JSX mà nó trả về chỉ phụ thuộc vào prop `guest`.

Nói chung, bạn không nên mong đợi các component của mình được render theo bất kỳ thứ tự cụ thể nào. Không quan trọng nếu bạn gọi <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> trước hay sau <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math>: cả hai công thức sẽ giải quyết độc lập với nhau. Tương tự, mỗi component chỉ nên "tự suy nghĩ cho bản thân", và không cố gắng phối hợp với hoặc phụ thuộc vào những người khác trong quá trình render. Render giống như một bài kiểm tra ở trường: mỗi component nên tự tính toán JSX!

<DeepDive>

#### Phát hiện các phép tính không thuần khiết với StrictMode {/*detecting-impure-calculations-with-strict-mode*/}

Mặc dù bạn có thể chưa sử dụng tất cả chúng, nhưng trong React có ba loại đầu vào mà bạn có thể đọc trong khi render: [props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), và [context.](/learn/passing-data-deeply-with-context) Bạn nên luôn coi các đầu vào này là chỉ đọc.

Khi bạn muốn *thay đổi* một cái gì đó để đáp ứng với đầu vào của người dùng, bạn nên [set state](/learn/state-a-components-memory) thay vì ghi vào một biến. Bạn không bao giờ nên thay đổi các biến hoặc đối tượng đã tồn tại trong khi component của bạn đang render.

React cung cấp một "Strict Mode" trong đó nó gọi hàm của mỗi component hai lần trong quá trình phát triển. **Bằng cách gọi các hàm component hai lần, Strict Mode giúp tìm các component vi phạm các quy tắc này.**

Lưu ý cách ví dụ ban đầu hiển thị "Khách #2", "Khách #4" và "Khách #6" thay vì "Khách #1", "Khách #2" và "Khách #3". Hàm ban đầu không thuần khiết, vì vậy gọi nó hai lần đã làm hỏng nó. Nhưng phiên bản thuần khiết đã sửa hoạt động ngay cả khi hàm được gọi hai lần mỗi lần. **Các hàm thuần khiết chỉ tính toán, vì vậy gọi chúng hai lần sẽ không thay đổi bất cứ điều gì**--giống như gọi `double(2)` hai lần không thay đổi những gì được trả về, và giải <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> hai lần không thay đổi <MathI>y</MathI> là gì. Đầu vào giống nhau, đầu ra giống nhau. Luôn luôn.

Strict Mode không có hiệu lực trong sản xuất, vì vậy nó sẽ không làm chậm ứng dụng cho người dùng của bạn. Để chọn tham gia Strict Mode, bạn có thể bọc component gốc của mình trong `<React.StrictMode>`. Một số framework thực hiện điều này theo mặc định.

</DeepDive>

### Thay Đổi Cục Bộ: Bí Mật Nhỏ Của Component Của Bạn {/*local-mutation-your-components-little-secret*/}

Trong ví dụ trên, vấn đề là component đã thay đổi một biến *đã tồn tại* trong khi render. Điều này thường được gọi là **"mutation"** để làm cho nó nghe có vẻ đáng sợ hơn một chút. Các hàm thuần khiết không mutate các biến bên ngoài phạm vi của hàm hoặc các đối tượng được tạo trước khi gọi—điều đó làm cho chúng không thuần khiết!

Tuy nhiên, **hoàn toàn ổn khi thay đổi các biến và đối tượng mà bạn *vừa* tạo trong khi render.** Trong ví dụ này, bạn tạo một mảng `[]`, gán nó cho một biến `cups`, và sau đó `push` một tá cốc vào nó:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Cốc trà cho khách #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

Nếu biến `cups` hoặc mảng `[]` được tạo bên ngoài hàm `TeaGathering`, đây sẽ là một vấn đề lớn! Bạn sẽ thay đổi một đối tượng *đã tồn tại* bằng cách đẩy các mục vào mảng đó.

Tuy nhiên, điều đó ổn vì bạn đã tạo chúng *trong cùng một lần render*, bên trong `TeaGathering`. Không có mã nào bên ngoài `TeaGathering` sẽ biết rằng điều này đã xảy ra. Điều này được gọi là **"local mutation"**—nó giống như bí mật nhỏ của component của bạn.

## Nơi Bạn _Có Thể_ Gây Ra Tác Dụng Phụ {/*where-you-_can_-cause-side-effects*/}

Mặc dù lập trình hàm dựa nhiều vào tính thuần khiết, nhưng tại một thời điểm nào đó, ở đâu đó, _một cái gì đó_ phải thay đổi. Đó là mục đích của lập trình! Những thay đổi này—cập nhật màn hình, bắt đầu hoạt ảnh, thay đổi dữ liệu—được gọi là **tác dụng phụ.** Chúng là những thứ xảy ra _"ở bên cạnh"_, không phải trong quá trình render.

Trong React, **tác dụng phụ thường thuộc về bên trong [trình xử lý sự kiện.](/learn/responding-to-events)** Trình xử lý sự kiện là các hàm mà React chạy khi bạn thực hiện một số hành động—ví dụ: khi bạn nhấp vào một nút. Mặc dù trình xử lý sự kiện được xác định *bên trong* component của bạn, nhưng chúng không chạy *trong* quá trình render! **Vì vậy, trình xử lý sự kiện không cần phải thuần khiết.**

Nếu bạn đã cạn kiệt tất cả các tùy chọn khác và không thể tìm thấy trình xử lý sự kiện phù hợp cho tác dụng phụ của mình, bạn vẫn có thể đính kèm nó vào JSX được trả về của mình bằng một lệnh gọi [`useEffect`](/reference/react/useEffect) trong component của bạn. Điều này cho React biết để thực thi nó sau đó, sau khi render, khi các tác dụng phụ được cho phép. **Tuy nhiên, cách tiếp cận này nên là phương sách cuối cùng của bạn.**

Khi có thể, hãy cố gắng thể hiện logic của bạn chỉ bằng cách render. Bạn sẽ ngạc nhiên về mức độ bạn có thể đạt được!

<DeepDive>

#### Tại Sao React Quan Tâm Đến Tính Thuần Khiết? {/*why-does-react-care-about-purity*/}

Viết các hàm thuần khiết cần một số thói quen và kỷ luật. Nhưng nó cũng mở ra những cơ hội tuyệt vời:

* Các component của bạn có thể chạy trong một môi trường khác—ví dụ: trên máy chủ! Vì chúng trả về cùng một kết quả cho cùng một đầu vào, một component có thể phục vụ nhiều yêu cầu của người dùng.
* Bạn có thể cải thiện hiệu suất bằng cách [bỏ qua việc render](/reference/react/memo) các component có đầu vào không thay đổi. Điều này an toàn vì các hàm thuần khiết luôn trả về cùng một kết quả, vì vậy chúng an toàn để lưu vào bộ nhớ cache.
* Nếu một số dữ liệu thay đổi ở giữa quá trình render một cây component sâu, React có thể khởi động lại quá trình render mà không lãng phí thời gian để hoàn thành quá trình render đã lỗi thời. Tính thuần khiết giúp bạn an toàn khi dừng tính toán bất cứ lúc nào.

Mọi tính năng React mới mà chúng tôi đang xây dựng đều tận dụng tính thuần khiết. Từ tìm nạp dữ liệu đến hoạt ảnh đến hiệu suất, việc giữ cho các component thuần khiết sẽ mở ra sức mạnh của mô hình React.

</DeepDive>

<Recap>

* Một component phải thuần khiết, có nghĩa là:
  * **Nó chỉ lo việc của nó.** Nó không nên thay đổi bất kỳ đối tượng hoặc biến nào đã tồn tại trước khi render.
  * **Đầu vào giống nhau, đầu ra giống nhau.** Với cùng một đầu vào, một component phải luôn trả về cùng một JSX.
* Quá trình render có thể xảy ra bất cứ lúc nào, vì vậy các component không nên phụ thuộc vào trình tự render của nhau.
* Bạn không nên mutate bất kỳ đầu vào nào mà các component của bạn sử dụng để render. Điều đó bao gồm props, state và context. Để cập nhật màn hình, hãy ["set" state](/learn/state-a-components-memory) thay vì mutate các đối tượng đã tồn tại.
* Cố gắng thể hiện logic của component của bạn trong JSX mà bạn trả về. Khi bạn cần "thay đổi mọi thứ", bạn thường sẽ muốn thực hiện nó trong một trình xử lý sự kiện. Là phương sách cuối cùng, bạn có thể sử dụng `useEffect`.
* Viết các hàm thuần khiết cần một chút luyện tập, nhưng nó sẽ mở ra sức mạnh của mô hình React.

</Recap>

<Challenges>

#### Sửa Một Chiếc Đồng Hồ Bị Hỏng {/*fix-a-broken-clock*/}

Component này cố gắng đặt CSS class của `<h1>` thành `"night"` trong khoảng thời gian từ nửa đêm đến sáu giờ sáng, và `"day"` vào tất cả các thời điểm khác. Tuy nhiên, nó không hoạt động. Bạn có thể sửa component này không?

Bạn có thể xác minh xem giải pháp của bạn có hoạt động hay không bằng cách tạm thời thay đổi múi giờ của máy tính. Khi thời gian hiện tại là từ nửa đêm đến sáu giờ sáng, đồng hồ sẽ có màu đảo ngược!

<Hint>

Render là một *phép tính*, nó không nên cố gắng "làm" mọi thứ. Bạn có thể thể hiện cùng một ý tưởng một cách khác không?

</Hint>

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
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
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

Bạn có thể sửa component này bằng cách tính toán `className` và bao gồm nó trong đầu ra render:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
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
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

Trong ví dụ này, tác dụng phụ (sửa đổi DOM) là không cần thiết. Bạn chỉ cần trả về JSX.

</Solution>

#### Sửa Một Hồ Sơ Bị Hỏng {/*fix-a-broken-profile*/}

Hai component `Profile` được render cạnh nhau với dữ liệu khác nhau. Nhấn "Collapse" trên hồ sơ đầu tiên, và sau đó "Expand" nó. Bạn sẽ nhận thấy rằng cả hai hồ sơ bây giờ hiển thị cùng một người. Đây là một lỗi.

Tìm nguyên nhân gây ra lỗi và sửa nó.

<Hint>

Mã bị lỗi nằm trong `Profile.js`. Hãy chắc chắn rằng bạn đọc tất cả từ trên xuống dưới!

</Hint>

<Sandpack>

```js src/Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js src/utils.js hidden
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
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

Vấn đề là component `Profile` ghi vào một biến đã tồn tại có tên là `currentPerson`, và các component `Header` và `Avatar` đọc từ nó. Điều này làm cho *cả ba* không thuần khiết và khó dự đoán.

Để sửa lỗi, hãy xóa biến `currentPerson`. Thay vào đó, hãy truyền tất cả thông tin từ `Profile` đến `Header` và `Avatar` thông qua props. Bạn sẽ cần thêm một prop `person` cho cả hai component và truyền nó xuống.

<Sandpack>

```js src/Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js src/utils.js hidden
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
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

Hãy nhớ rằng React không đảm bảo rằng các hàm component sẽ thực thi theo bất kỳ thứ tự cụ thể nào, vì vậy bạn không thể giao tiếp giữa chúng bằng cách đặt các biến. Tất cả giao tiếp phải diễn ra thông qua props.

</Solution>

#### Sửa Một Khay Story Bị Hỏng {/*fix-a-broken-story-tray*/}

CEO của công ty bạn đang yêu cầu bạn thêm "stories" vào ứng dụng đồng hồ trực tuyến của bạn, và bạn không thể từ chối. Bạn đã viết một component `StoryTray` chấp nhận một danh sách `stories`, theo sau là một trình giữ chỗ "Create Story".

Bạn đã triển khai trình giữ chỗ "Create Story" bằng cách đẩy thêm một story giả vào cuối mảng `stories` mà bạn nhận được dưới dạng prop. Nhưng vì một số lý do, "Create Story" xuất hiện nhiều lần. Sửa vấn đề.

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

Lưu ý rằng bất cứ khi nào đồng hồ cập nhật, "Create Story" được thêm vào *hai lần*. Điều này đóng vai trò là một gợi ý rằng chúng ta có một mutation trong quá trình render--Strict Mode gọi các component hai lần để làm cho những vấn đề này dễ nhận thấy hơn.

Hàm `StoryTray` không thuần khiết. Bằng cách gọi `push` trên mảng `stories` đã nhận (một prop!), nó đang mutate một đối tượng được tạo *trước khi* `StoryTray` bắt đầu render. Điều này làm cho nó bị lỗi và rất khó dự đoán.

Cách sửa đơn giản nhất là không chạm vào mảng và render "Create Story" riêng biệt:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Ngoài ra, bạn có thể tạo một mảng _mới_ (bằng cách sao chép mảng hiện có) trước khi bạn đẩy một mục vào nó:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  // Sao chép mảng!
  let storiesToDisplay = stories.slice();

  // Không ảnh hưởng đến mảng ban đầu:
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Điều này giữ cho mutation của bạn cục bộ và hàm render của bạn thuần khiết. Tuy nhiên, bạn vẫn cần phải cẩn thận: ví dụ: nếu bạn cố gắng thay đổi bất kỳ mục hiện có nào của mảng, bạn cũng sẽ phải clone những mục đó.

Điều hữu ích là ghi nhớ những thao tác nào trên mảng mutate chúng và những thao tác nào không. Ví dụ: `push`, `pop`, `reverse` và `sort` sẽ mutate mảng ban đầu, nhưng `slice`, `filter` và `map` sẽ tạo một mảng mới.

</Solution>

</Challenges>
