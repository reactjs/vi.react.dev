---
title: "'use client'"
titleForTitleTag: "Chỉ thị `'use client'`"
---

<RSC>

`'use client'` dùng để sử dụng với [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).

</RSC>

<Intro>

`'use client'` cho phép bạn đánh dấu đoạn code nào chạy trên máy khách.

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `'use client'` {/*use-client*/}

Thêm `'use client'` ở đầu tệp để đánh dấu mô-đun và các phụ thuộc bắc cầu của nó là mã máy khách.

```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

Khi một tệp được đánh dấu bằng `'use client'` được nhập từ một Server Component, [các trình đóng gói tương thích](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) sẽ coi việc nhập mô-đun như một ranh giới giữa mã chạy trên máy chủ và mã chạy trên máy khách.

Là các phụ thuộc của `RichTextEditor`, `formatDate` và `Button` cũng sẽ được đánh giá trên máy khách bất kể các mô-đun của chúng có chứa chỉ thị `'use client'` hay không. Lưu ý rằng một mô-đun duy nhất có thể được đánh giá trên máy chủ khi được nhập từ mã máy chủ và trên máy khách khi được nhập từ mã máy khách.

#### Lưu ý {/*caveats*/}

* `'use client'` phải ở ngay đầu tệp, phía trên mọi nhập hoặc mã khác (nhận xét thì OK). Chúng phải được viết bằng dấu nháy đơn hoặc dấu nháy kép, nhưng không phải dấu backtick.
* Khi một mô-đun `'use client'` được nhập từ một mô-đun được hiển thị phía máy khách khác, chỉ thị này không có hiệu lực.
* Khi một mô-đun thành phần chứa chỉ thị `'use client'`, mọi cách sử dụng thành phần đó đều được đảm bảo là một Client Component. Tuy nhiên, một thành phần vẫn có thể được đánh giá trên máy khách ngay cả khi nó không có chỉ thị `'use client'`.
  * Một cách sử dụng thành phần được coi là một Client Component nếu nó được định nghĩa trong mô-đun có chỉ thị `'use client'` hoặc khi nó là một phụ thuộc bắc cầu của một mô-đun có chứa chỉ thị `'use client'`. Nếu không, nó là một Server Component.
* Mã được đánh dấu để đánh giá phía máy khách không giới hạn ở các thành phần. Tất cả mã là một phần của cây con mô-đun Client được gửi đến và chạy bởi máy khách.
* Khi một mô-đun được đánh giá trên máy chủ nhập các giá trị từ một mô-đun `'use client'`, các giá trị phải là một thành phần React hoặc [các giá trị prop tuần tự hóa được hỗ trợ](#passing-props-from-server-to-client-components) để được chuyển đến một Client Component. Bất kỳ trường hợp sử dụng nào khác sẽ gây ra một ngoại lệ.

### Cách `'use client'` đánh dấu mã máy khách {/*how-use-client-marks-client-code*/}

Trong một ứng dụng React, các thành phần thường được chia thành các tệp riêng biệt, hoặc [mô-đun](/learn/importing-and-exporting-components#exporting-and-importing-a-component).

Đối với các ứng dụng sử dụng React Server Components, ứng dụng được hiển thị phía máy chủ theo mặc định. `'use client'` giới thiệu một ranh giới máy chủ-máy khách trong [cây phụ thuộc mô-đun](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree), tạo ra một cây con các mô-đun Client một cách hiệu quả.

Để minh họa rõ hơn điều này, hãy xem xét ứng dụng React Server Components sau.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

Trong cây phụ thuộc mô-đun của ứng dụng ví dụ này, chỉ thị `'use client'` trong `InspirationGenerator.js` đánh dấu mô-đun đó và tất cả các phụ thuộc bắc cầu của nó là các mô-đun Client. Cây con bắt đầu từ `InspirationGenerator.js` hiện được đánh dấu là các mô-đun Client.

<Diagram name="use_client_module_dependency" height={250} width={545} alt="Một biểu đồ cây với nút trên cùng đại diện cho mô-đun 'App.js'. 'App.js' có ba con: 'Copyright.js', 'FancyText.js' và 'InspirationGenerator.js'. 'InspirationGenerator.js' có hai con: 'FancyText.js' và 'inspirations.js'. Các nút bên dưới và bao gồm 'InspirationGenerator.js' có màu nền vàng để biểu thị rằng đồ thị con này được hiển thị phía máy khách do chỉ thị 'use client' trong 'InspirationGenerator.js'.">
`'use client'` phân đoạn cây phụ thuộc mô-đun của ứng dụng React Server Components, đánh dấu `InspirationGenerator.js` và tất cả các phụ thuộc của nó là được hiển thị phía máy khách.
</Diagram>

Trong quá trình hiển thị, framework sẽ hiển thị phía máy chủ thành phần gốc và tiếp tục thông qua [cây hiển thị](/learn/understanding-your-ui-as-a-tree#the-render-tree), chọn không đánh giá bất kỳ mã nào được nhập từ mã được đánh dấu là máy khách.

Phần được hiển thị phía máy chủ của cây hiển thị sau đó được gửi đến máy khách. Máy khách, với mã máy khách đã tải xuống, sau đó hoàn thành việc hiển thị phần còn lại của cây.

<Diagram name="use_client_render_tree" height={250} width={500} alt="Một biểu đồ cây trong đó mỗi nút đại diện cho một thành phần và các con của nó là các thành phần con. Nút cấp cao nhất được gắn nhãn 'App' và nó có hai thành phần con 'InspirationGenerator' và 'FancyText'. 'InspirationGenerator' có hai thành phần con, 'FancyText' và 'Copyright'. Cả 'InspirationGenerator' và thành phần con của nó 'FancyText' đều được đánh dấu để được hiển thị phía máy khách.">
Cây hiển thị cho ứng dụng React Server Components. `InspirationGenerator` và thành phần con của nó `FancyText` là các thành phần được xuất từ mã được đánh dấu là máy khách và được coi là Client Components.
</Diagram>

Chúng tôi giới thiệu các định nghĩa sau:

* **Client Components** là các thành phần trong một cây hiển thị được hiển thị trên máy khách.
* **Server Components** là các thành phần trong một cây hiển thị được hiển thị trên máy chủ.

Làm việc thông qua ứng dụng ví dụ, `App`, `FancyText` và `Copyright` đều được hiển thị phía máy chủ và được coi là Server Components. Vì `InspirationGenerator.js` và các phụ thuộc bắc cầu của nó được đánh dấu là mã máy khách, thành phần `InspirationGenerator` và thành phần con của nó `FancyText` là Client Components.

<DeepDive>
#### Làm thế nào `FancyText` vừa là Server Component vừa là Client Component? {/*how-is-fancytext-both-a-server-and-a-client-component*/}

Theo các định nghĩa trên, thành phần `FancyText` vừa là Server Component vừa là Client Component, làm thế nào có thể như vậy?

Đầu tiên, hãy làm rõ rằng thuật ngữ "thành phần" không chính xác lắm. Dưới đây chỉ là hai cách "thành phần" có thể được hiểu:

1. Một "thành phần" có thể đề cập đến một **định nghĩa thành phần**. Trong hầu hết các trường hợp, đây sẽ là một hàm.

```js
// Đây là một định nghĩa của một thành phần
function MyComponent() {
  return <p>My Component</p>
}
```

2. Một "thành phần" cũng có thể đề cập đến một **cách sử dụng thành phần** của định nghĩa của nó.
```js
import MyComponent from './MyComponent';

function App() {
  // Đây là một cách sử dụng của một thành phần
  return <MyComponent />;
}
```

Thông thường, sự không chính xác không quan trọng khi giải thích các khái niệm, nhưng trong trường hợp này thì có.

Khi chúng ta nói về Server hoặc Client Components, chúng ta đang đề cập đến cách sử dụng thành phần.

* Nếu thành phần được định nghĩa trong một mô-đun có chỉ thị `'use client'`, hoặc thành phần được nhập và gọi trong một Client Component, thì cách sử dụng thành phần là một Client Component.
* Nếu không, cách sử dụng thành phần là một Server Component.

<Diagram name="use_client_render_tree" height={150} width={450} alt="Một biểu đồ cây trong đó mỗi nút đại diện cho một thành phần và các con của nó là các thành phần con. Nút cấp cao nhất được gắn nhãn 'App' và nó có hai thành phần con 'InspirationGenerator' và 'FancyText'. 'InspirationGenerator' có hai thành phần con, 'FancyText' và 'Copyright'. Cả 'InspirationGenerator' và thành phần con của nó 'FancyText' đều được đánh dấu để được hiển thị phía máy khách.">Một cây hiển thị minh họa cách sử dụng thành phần.</Diagram>

Quay lại câu hỏi về `FancyText`, chúng ta thấy rằng định nghĩa thành phần _không_ có chỉ thị `'use client'` và nó có hai cách sử dụng.

Cách sử dụng `FancyText` như một con của `App`, đánh dấu cách sử dụng đó là một Server Component. Khi `FancyText` được nhập và gọi dưới `InspirationGenerator`, cách sử dụng `FancyText` đó là một Client Component vì `InspirationGenerator` chứa một chỉ thị `'use client'`.

Điều này có nghĩa là định nghĩa thành phần cho `FancyText` sẽ vừa được đánh giá trên máy chủ vừa được máy khách tải xuống để hiển thị cách sử dụng Client Component của nó.

</DeepDive>

<DeepDive>

#### Tại sao `Copyright` là một Server Component? {/*why-is-copyright-a-server-component*/}

Vì `Copyright` được hiển thị như một con của Client Component `InspirationGenerator`, bạn có thể ngạc nhiên khi nó là một Server Component.

Hãy nhớ lại rằng `'use client'` xác định ranh giới giữa mã máy chủ và mã máy khách trên _cây phụ thuộc mô-đun_, không phải cây hiển thị.

<Diagram name="use_client_module_dependency" height={200} width={500} alt="Một biểu đồ cây với nút trên cùng đại diện cho mô-đun 'App.js'. 'App.js' có ba con: 'Copyright.js', 'FancyText.js' và 'InspirationGenerator.js'. 'InspirationGenerator.js' có hai con: 'FancyText.js' và 'inspirations.js'. Các nút bên dưới và bao gồm 'InspirationGenerator.js' có màu nền vàng để biểu thị rằng đồ thị con này được hiển thị phía máy khách do chỉ thị 'use client' trong 'InspirationGenerator.js'.">
`'use client'` xác định ranh giới giữa mã máy chủ và mã máy khách trên cây phụ thuộc mô-đun.
</Diagram>

Trong cây phụ thuộc mô-đun, chúng ta thấy rằng `App.js` nhập và gọi `Copyright` từ mô-đun `Copyright.js`. Vì `Copyright.js` không chứa chỉ thị `'use client'`, cách sử dụng thành phần được hiển thị trên máy chủ. `App` được hiển thị trên máy chủ vì nó là thành phần gốc.

Client Components có thể hiển thị Server Components vì bạn có thể chuyển JSX làm props. Trong trường hợp này, `InspirationGenerator` nhận `Copyright` làm [children](/learn/passing-props-to-a-component#passing-jsx-as-children). Tuy nhiên, mô-đun `InspirationGenerator` không bao giờ nhập trực tiếp mô-đun `Copyright` cũng như gọi thành phần, tất cả những điều đó được thực hiện bởi `App`. Trên thực tế, thành phần `Copyright` được thực thi đầy đủ trước khi `InspirationGenerator` bắt đầu hiển thị.

Điều quan trọng là mối quan hệ hiển thị cha-con giữa các thành phần không đảm bảo cùng một môi trường hiển thị.

</DeepDive>

### Khi nào nên sử dụng `'use client'` {/*when-to-use-use-client*/}

Với `'use client'`, bạn có thể xác định khi nào các thành phần là Client Components. Vì Server Components là mặc định, đây là một tổng quan ngắn gọn về những ưu điểm và hạn chế của Server Components để xác định khi nào bạn cần đánh dấu một cái gì đó là được hiển thị phía máy khách.

Để đơn giản, chúng ta nói về Server Components, nhưng các nguyên tắc tương tự áp dụng cho tất cả mã trong ứng dụng của bạn chạy trên máy chủ.

#### Ưu điểm của Server Components {/*advantages*/}
* Server Components có thể giảm lượng mã được gửi và chạy bởi máy khách. Chỉ các mô-đun Client được đóng gói và đánh giá bởi máy khách.
* Server Components được hưởng lợi từ việc chạy trên máy chủ. Chúng có thể truy cập hệ thống tệp cục bộ và có thể trải nghiệm độ trễ thấp cho các tìm nạp dữ liệu và yêu cầu mạng.

#### Hạn chế của Server Components {/*limitations*/}
* Server Components không thể hỗ trợ tương tác vì các trình xử lý sự kiện phải được đăng ký và kích hoạt bởi một máy khách.
  * Ví dụ: các trình xử lý sự kiện như `onClick` chỉ có thể được xác định trong Client Components.
* Server Components không thể sử dụng hầu hết các Hook.
  * Khi Server Components được hiển thị, đầu ra của chúng về cơ bản là một danh sách các thành phần để máy khách hiển thị. Server Components không tồn tại trong bộ nhớ sau khi hiển thị và không thể có trạng thái riêng của chúng.

### Các kiểu tuần tự hóa được trả về bởi Server Components {/*serializable-types*/}

Như trong bất kỳ ứng dụng React nào, các thành phần cha chuyển dữ liệu cho các thành phần con. Vì chúng được hiển thị trong các môi trường khác nhau, việc chuyển dữ liệu từ một Server Component sang một Client Component đòi hỏi phải xem xét thêm.

Các giá trị prop được chuyển từ một Server Component sang Client Component phải có thể tuần tự hóa.

Các prop có thể tuần tự hóa bao gồm:
* Các kiểu nguyên thủy
  * [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
  * [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
  * [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
  * [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
  * [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
  * [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
  * [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), chỉ các symbol được đăng ký trong sổ đăng ký Symbol toàn cục thông qua [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Các iterable chứa các giá trị có thể tuần tự hóa
  * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
  * [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
  * [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
  * [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
  * [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) và [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* Các [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) thuần túy: những object được tạo bằng [trình khởi tạo object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), với các thuộc tính có thể tuần tự hóa
* Các hàm là [Server Functions](/reference/rsc/server-functions)
* Các phần tử Client hoặc Server Component (JSX)
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Đáng chú ý, những điều này không được hỗ trợ:
* [Các hàm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) không được xuất từ các mô-đun được đánh dấu là máy khách hoặc được đánh dấu bằng [`'use server'`](/reference/rsc/use-server)
* [Các lớp](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Các object là các thể hiện của bất kỳ lớp nào (ngoài các lớp dựng sẵn đã đề cập) hoặc các object có [prototype null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Các symbol không được đăng ký trên toàn cục, ví dụ: `Symbol('my new symbol')`

## Cách sử dụng {/*usage*/}

### Xây dựng với tính tương tác và trạng thái {/*building-with-interactivity-and-state*/}

<Sandpack>

```js src/App.js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Count Value: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

</Sandpack>

Vì `Counter` yêu cầu cả Hook `useState` và các trình xử lý sự kiện để tăng hoặc giảm giá trị, thành phần này phải là một Client Component và sẽ yêu cầu chỉ thị `'use client'` ở trên cùng.

Ngược lại, một thành phần hiển thị UI mà không cần tương tác sẽ không cần phải là một Client Component.

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

Ví dụ: thành phần cha của `Counter`, `CounterContainer`, không yêu cầu `'use client'` vì nó không tương tác và không sử dụng trạng thái. Ngoài ra, `CounterContainer` phải là một Server Component vì nó đọc từ hệ thống tệp cục bộ trên máy chủ, điều này chỉ có thể thực hiện được trong một Server Component.

Ngoài ra còn có các thành phần không sử dụng bất kỳ tính năng chỉ dành cho máy chủ hoặc máy khách nào và có thể không quan trọng nơi chúng hiển thị. Trong ví dụ trước của chúng ta, `FancyText` là một thành phần như vậy.

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

Trong trường hợp này, chúng ta không thêm chỉ thị `'use client'`, dẫn đến _đầu ra_ của `FancyText` (chứ không phải mã nguồn của nó) được gửi đến trình duyệt khi được tham chiếu từ một Server Component. Như đã trình bày trong ví dụ ứng dụng Inspirations trước đó, `FancyText` được sử dụng làm cả Server hoặc Client Component, tùy thuộc vào nơi nó được nhập và sử dụng.

Nhưng nếu đầu ra HTML của `FancyText` lớn so với mã nguồn của nó (bao gồm cả các phụ thuộc), có thể hiệu quả hơn nếu buộc nó luôn là một Client Component. Các thành phần trả về một chuỗi đường dẫn SVG dài là một trường hợp mà có thể hiệu quả hơn nếu buộc một thành phần phải là một Client Component.

### Sử dụng API máy khách {/*using-client-apis*/}

Ứng dụng React của bạn có thể sử dụng các API dành riêng cho máy khách, chẳng hạn như API của trình duyệt để lưu trữ web, thao tác âm thanh và video và phần cứng thiết bị, cùng với [những API khác](https://developer.mozilla.org/en-US/docs/Web/API).

Trong ví dụ này, thành phần sử dụng [DOM API](https://developer.mozilla.org/en-US/docs/Glossary/DOM) để thao tác một phần tử [`canvas`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas). Vì các API đó chỉ khả dụng trong trình duyệt, nó phải được đánh dấu là một Client Component.

```js
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### Sử dụng thư viện của bên thứ ba {/*using-third-party-libraries*/}

Thông thường trong một ứng dụng React, bạn sẽ tận dụng các thư viện của bên thứ ba để xử lý các mẫu hoặc logic UI phổ biến.

Các thư viện này có thể dựa vào các Hook thành phần hoặc API máy khách. Các thành phần của bên thứ ba sử dụng bất kỳ API React nào sau đây phải chạy trên máy khách:
* [createContext](/reference/react/createContext)
* Các Hook [`react`](/reference/react/hooks) và [`react-dom`](/reference/react-dom/hooks), ngoại trừ [`use`](/reference/react/use) và [`useId`](/reference/react/useId)
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* Nếu chúng sử dụng API máy khách, ví dụ: chèn DOM hoặc chế độ xem nền tảng gốc

Nếu các thư viện này đã được cập nhật để tương thích với React Server Components, thì chúng sẽ bao gồm các dấu hiệu `'use client'` của riêng chúng, cho phép bạn sử dụng chúng trực tiếp từ Server Components của mình. Nếu một thư viện chưa được cập nhật hoặc nếu một thành phần cần các prop như trình xử lý sự kiện chỉ có thể được chỉ định trên máy khách, bạn có thể cần thêm tệp Client Component của riêng mình ở giữa Client Component của bên thứ ba và Server Component của bạn nơi bạn muốn sử dụng nó.

[TODO]: <> (Khắc phục sự cố - cần các trường hợp sử dụng)
