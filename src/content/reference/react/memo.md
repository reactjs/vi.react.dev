---
title: memo
---

<Intro>

`memo` cho phép bạn bỏ qua việc kết xuất lại một thành phần khi các đạo cụ của nó không thay đổi.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

Bọc một thành phần trong `memo` để có được một phiên bản *ghi nhớ* của thành phần đó. Phiên bản ghi nhớ này của thành phần của bạn thường sẽ không được kết xuất lại khi thành phần cha của nó được kết xuất lại miễn là các đạo cụ của nó không thay đổi. Nhưng React vẫn có thể kết xuất lại nó: ghi nhớ là một tối ưu hóa hiệu suất, không phải là một sự đảm bảo.

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `Component`: Thành phần mà bạn muốn ghi nhớ. `memo` không sửa đổi thành phần này, nhưng thay vào đó trả về một thành phần mới, đã ghi nhớ. Bất kỳ thành phần React hợp lệ nào, bao gồm các hàm và các thành phần [`forwardRef`](/reference/react/forwardRef), đều được chấp nhận.

* **tùy chọn** `arePropsEqual`: Một hàm chấp nhận hai đối số: các đạo cụ trước đó của thành phần và các đạo cụ mới của nó. Nó sẽ trả về `true` nếu các đạo cụ cũ và mới bằng nhau: nghĩa là, nếu thành phần sẽ kết xuất cùng một đầu ra và hoạt động theo cùng một cách với các đạo cụ mới như với các đạo cụ cũ. Nếu không, nó sẽ trả về `false`. Thông thường, bạn sẽ không chỉ định hàm này. Theo mặc định, React sẽ so sánh từng đạo cụ với [`Object.is`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

#### Trả về {/*returns*/}

`memo` trả về một thành phần React mới. Nó hoạt động giống như thành phần được cung cấp cho `memo` ngoại trừ việc React sẽ không phải lúc nào cũng kết xuất lại nó khi thành phần cha của nó đang được kết xuất lại trừ khi các đạo cụ của nó đã thay đổi.

---

## Cách sử dụng {/*usage*/}

### Bỏ qua việc kết xuất lại khi các đạo cụ không thay đổi {/*skipping-re-rendering-when-props-are-unchanged*/}

React thường kết xuất lại một thành phần bất cứ khi nào thành phần cha của nó kết xuất lại. Với `memo`, bạn có thể tạo một thành phần mà React sẽ không kết xuất lại khi thành phần cha của nó kết xuất lại miễn là các đạo cụ mới của nó giống với các đạo cụ cũ. Một thành phần như vậy được gọi là *đã ghi nhớ*.

Để ghi nhớ một thành phần, hãy bọc nó trong `memo` và sử dụng giá trị mà nó trả về thay cho thành phần gốc của bạn:

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Xin chào, {name}!</h1>;
});

export default Greeting;
```

Một thành phần React phải luôn có [logic kết xuất thuần túy.](/learn/keeping-components-pure) Điều này có nghĩa là nó phải trả về cùng một đầu ra nếu các đạo cụ, trạng thái và ngữ cảnh của nó không thay đổi. Bằng cách sử dụng `memo`, bạn đang nói với React rằng thành phần của bạn tuân thủ yêu cầu này, vì vậy React không cần phải kết xuất lại miễn là các đạo cụ của nó không thay đổi. Ngay cả với `memo`, thành phần của bạn sẽ kết xuất lại nếu trạng thái riêng của nó thay đổi hoặc nếu một ngữ cảnh mà nó đang sử dụng thay đổi.

Trong ví dụ này, hãy lưu ý rằng thành phần `Greeting` kết xuất lại bất cứ khi nào `name` thay đổi (vì đó là một trong các đạo cụ của nó), nhưng không phải khi `address` thay đổi (vì nó không được truyền cho `Greeting` dưới dạng một đạo cụ):

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Tên{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Địa chỉ{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting đã được kết xuất vào lúc", new Date().toLocaleTimeString());
  return <h3>Xin chào{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**Bạn chỉ nên dựa vào `memo` như một tối ưu hóa hiệu suất.** Nếu mã của bạn không hoạt động nếu không có nó, hãy tìm vấn đề cơ bản và khắc phục nó trước. Sau đó, bạn có thể thêm `memo` để cải thiện hiệu suất.

</Note>

<DeepDive>

#### Bạn có nên thêm memo ở mọi nơi không? {/*should-you-add-memo-everywhere*/}

Nếu ứng dụng của bạn giống như trang web này và hầu hết các tương tác đều thô (như thay thế một trang hoặc toàn bộ một phần), thì việc ghi nhớ thường là không cần thiết. Mặt khác, nếu ứng dụng của bạn giống như một trình chỉnh sửa bản vẽ hơn và hầu hết các tương tác đều chi tiết (như di chuyển hình dạng), thì bạn có thể thấy việc ghi nhớ rất hữu ích.

Tối ưu hóa với `memo` chỉ có giá trị khi thành phần của bạn kết xuất lại thường xuyên với cùng một đạo cụ chính xác và logic kết xuất lại của nó tốn kém. Nếu không có độ trễ nhận thấy khi thành phần của bạn kết xuất lại, thì `memo` là không cần thiết. Hãy nhớ rằng `memo` hoàn toàn vô dụng nếu các đạo cụ được truyền cho thành phần của bạn *luôn khác nhau,* chẳng hạn như nếu bạn truyền một đối tượng hoặc một hàm thuần túy được xác định trong quá trình kết xuất. Đây là lý do tại sao bạn thường cần [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) và [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) cùng với `memo`.

Không có lợi ích gì khi bọc một thành phần trong `memo` trong các trường hợp khác. Cũng không có hại đáng kể nào khi làm điều đó, vì vậy một số nhóm chọn không nghĩ về các trường hợp riêng lẻ và ghi nhớ càng nhiều càng tốt. Nhược điểm của phương pháp này là mã trở nên khó đọc hơn. Ngoài ra, không phải tất cả các hoạt động ghi nhớ đều hiệu quả: một giá trị duy nhất "luôn mới" là đủ để phá vỡ hoạt động ghi nhớ cho toàn bộ một thành phần.

**Trong thực tế, bạn có thể làm cho rất nhiều hoạt động ghi nhớ trở nên không cần thiết bằng cách tuân theo một vài nguyên tắc:**

1. Khi một thành phần bao bọc trực quan các thành phần khác, hãy để nó [chấp nhận JSX làm con.](/learn/passing-props-to-a-component#passing-jsx-as-children) Bằng cách này, khi thành phần bao bọc cập nhật trạng thái của chính nó, React biết rằng các thành phần con của nó không cần phải kết xuất lại.
2. Ưu tiên trạng thái cục bộ và không [nâng trạng thái lên](/learn/sharing-state-between-components) xa hơn mức cần thiết. Ví dụ: không giữ trạng thái tạm thời như biểu mẫu và liệu một mục có được di chuột hay không ở đầu cây của bạn hoặc trong một thư viện trạng thái toàn cầu.
3. Giữ cho [logic kết xuất của bạn thuần túy.](/learn/keeping-components-pure) Nếu việc kết xuất lại một thành phần gây ra sự cố hoặc tạo ra một số tạo tác trực quan đáng chú ý, thì đó là một lỗi trong thành phần của bạn! Hãy sửa lỗi thay vì thêm hoạt động ghi nhớ.
4. Tránh [các Effect không cần thiết cập nhật trạng thái.](/learn/you-might-not-need-an-effect) Hầu hết các vấn đề về hiệu suất trong các ứng dụng React đều do chuỗi các bản cập nhật bắt nguồn từ các Effect khiến các thành phần của bạn kết xuất đi kết xuất lại.
5. Cố gắng [xóa các phụ thuộc không cần thiết khỏi các Effect của bạn.](/learn/removing-effect-dependencies) Ví dụ: thay vì ghi nhớ, thường đơn giản hơn là di chuyển một số đối tượng hoặc một hàm bên trong một Effect hoặc bên ngoài thành phần.

Nếu một tương tác cụ thể vẫn cảm thấy chậm trễ, hãy [sử dụng trình hồ sơ React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) để xem thành phần nào sẽ được hưởng lợi nhiều nhất từ việc ghi nhớ và thêm hoạt động ghi nhớ khi cần thiết. Các nguyên tắc này giúp các thành phần của bạn dễ gỡ lỗi và hiểu hơn, vì vậy tốt nhất là tuân theo chúng trong mọi trường hợp. Về lâu dài, chúng tôi đang nghiên cứu [tự động thực hiện hoạt động ghi nhớ chi tiết](https://www.youtube.com/watch?v=lGEMwh32soc) để giải quyết vấn đề này một lần và mãi mãi.

</DeepDive>

---

### Cập nhật một thành phần đã ghi nhớ bằng cách sử dụng trạng thái {/*updating-a-memoized-component-using-state*/}

Ngay cả khi một thành phần được ghi nhớ, nó vẫn sẽ kết xuất lại khi trạng thái riêng của nó thay đổi. Hoạt động ghi nhớ chỉ liên quan đến các đạo cụ được truyền cho thành phần từ thành phần cha của nó.

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Tên{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Địa chỉ{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting đã được kết xuất vào lúc', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Xin chào');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Xin chào'}
          onChange={e => onChange('Xin chào')}
        />
        Lời chào thông thường
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Xin chào và chào mừng'}
          onChange={e => onChange('Xin chào và chào mừng')}
        />
        Lời chào nhiệt tình
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Nếu bạn đặt một biến trạng thái thành giá trị hiện tại của nó, React sẽ bỏ qua việc kết xuất lại thành phần của bạn ngay cả khi không có `memo`. Bạn vẫn có thể thấy hàm thành phần của bạn được gọi thêm một lần, nhưng kết quả sẽ bị loại bỏ.

---

### Cập nhật một thành phần đã ghi nhớ bằng cách sử dụng một ngữ cảnh {/*updating-a-memoized-component-using-a-context*/}

Ngay cả khi một thành phần được ghi nhớ, nó vẫn sẽ kết xuất lại khi một ngữ cảnh mà nó đang sử dụng thay đổi. Hoạt động ghi nhớ chỉ liên quan đến các đạo cụ được truyền cho thành phần từ thành phần cha của nó.

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark'); 
  }

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={handleClick}>
        Chuyển đổi chủ đề
      </button>
      <Greeting name="Taylor" />
    </ThemeContext.Provider>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting đã được kết xuất vào lúc", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Xin chào, {name}!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

Để làm cho thành phần của bạn chỉ kết xuất lại khi một _phần_ của một số ngữ cảnh thay đổi, hãy chia thành phần của bạn thành hai. Đọc những gì bạn cần từ ngữ cảnh trong thành phần bên ngoài và truyền nó xuống một thành phần con đã ghi nhớ dưới dạng một đạo cụ.

---

### Giảm thiểu các thay đổi đạo cụ {/*minimizing-props-changes*/}

Khi bạn sử dụng `memo`, thành phần của bạn kết xuất lại bất cứ khi nào bất kỳ đạo cụ nào không *bằng nhau một cách nông cạn* với những gì nó đã có trước đó. Điều này có nghĩa là React so sánh mọi đạo cụ trong thành phần của bạn với giá trị trước đó của nó bằng cách sử dụng so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Lưu ý rằng `Object.is(3, 3)` là `true`, nhưng `Object.is({}, {})` là `false`.

Để tận dụng tối đa `memo`, hãy giảm thiểu số lần các đạo cụ thay đổi. Ví dụ: nếu đạo cụ là một đối tượng, hãy ngăn thành phần cha tạo lại đối tượng đó mỗi lần bằng cách sử dụng [`useMemo`:](/reference/react/useMemo)

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

Một cách tốt hơn để giảm thiểu các thay đổi đạo cụ là đảm bảo thành phần chấp nhận thông tin cần thiết tối thiểu trong các đạo cụ của nó. Ví dụ: nó có thể chấp nhận các giá trị riêng lẻ thay vì toàn bộ một đối tượng:

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

Ngay cả các giá trị riêng lẻ đôi khi có thể được chiếu thành các giá trị thay đổi ít thường xuyên hơn. Ví dụ: ở đây một thành phần chấp nhận một boolean cho biết sự hiện diện của một giá trị thay vì chính giá trị đó:

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

Khi bạn cần truyền một hàm cho thành phần đã ghi nhớ, hãy khai báo nó bên ngoài thành phần của bạn để nó không bao giờ thay đổi hoặc [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) để lưu trữ định nghĩa của nó giữa các lần kết xuất lại.

---

### Chỉ định một hàm so sánh tùy chỉnh {/*specifying-a-custom-comparison-function*/}

Trong một số trường hợp hiếm hoi, có thể không khả thi để giảm thiểu các thay đổi đạo cụ của một thành phần đã ghi nhớ. Trong trường hợp đó, bạn có thể cung cấp một hàm so sánh tùy chỉnh, mà React sẽ sử dụng để so sánh các đạo cụ cũ và mới thay vì sử dụng sự bằng nhau nông cạn. Hàm này được truyền dưới dạng đối số thứ hai cho `memo`. Nó sẽ trả về `true` chỉ khi các đạo cụ mới sẽ dẫn đến cùng một đầu ra như các đạo cụ cũ; nếu không, nó sẽ trả về `false`.

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

Nếu bạn làm điều này, hãy sử dụng bảng điều khiển Performance trong các công cụ dành cho nhà phát triển của trình duyệt của bạn để đảm bảo rằng hàm so sánh của bạn thực sự nhanh hơn việc kết xuất lại thành phần. Bạn có thể ngạc nhiên đấy.

Khi bạn thực hiện các phép đo hiệu suất, hãy đảm bảo rằng React đang chạy ở chế độ sản xuất.

<Pitfall>

Nếu bạn cung cấp một triển khai `arePropsEqual` tùy chỉnh, **bạn phải so sánh mọi đạo cụ, bao gồm cả các hàm.** Các hàm thường [đóng trên](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) các đạo cụ và trạng thái của các thành phần cha. Nếu bạn trả về `true` khi `oldProps.onClick !== newProps.onClick`, thành phần của bạn sẽ tiếp tục "nhìn thấy" các đạo cụ và trạng thái từ một lần kết xuất trước đó bên trong trình xử lý `onClick` của nó, dẫn đến các lỗi rất khó hiểu.

Tránh thực hiện các kiểm tra tính bằng nhau sâu bên trong `arePropsEqual` trừ khi bạn chắc chắn 100% rằng cấu trúc dữ liệu mà bạn đang làm việc có độ sâu giới hạn đã biết. **Các kiểm tra tính bằng nhau sâu có thể trở nên cực kỳ chậm** và có thể đóng băng ứng dụng của bạn trong nhiều giây nếu ai đó thay đổi cấu trúc dữ liệu sau này.

</Pitfall>

---

## Khắc phục sự cố {/*troubleshooting*/}
### Thành phần của tôi kết xuất lại khi một đạo cụ là một đối tượng, mảng hoặc hàm {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React so sánh các đạo cụ cũ và mới bằng tính bằng nhau nông cạn: nghĩa là, nó xem xét liệu mỗi đạo cụ mới có bằng tham chiếu với đạo cụ cũ hay không. Nếu bạn tạo một đối tượng hoặc mảng mới mỗi khi thành phần cha được kết xuất lại, ngay cả khi các phần tử riêng lẻ đều giống nhau, React vẫn sẽ coi nó là đã thay đổi. Tương tự, nếu bạn tạo một hàm mới khi kết xuất thành phần cha, React sẽ coi nó là đã thay đổi ngay cả khi hàm có cùng định nghĩa. Để tránh điều này, hãy [đơn giản hóa các đạo cụ hoặc ghi nhớ các đạo cụ trong thành phần cha](#minimizing-props-changes).
