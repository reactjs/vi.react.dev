---
title: createContext
---

<Intro>

`createContext` cho phép bạn tạo một [context](/learn/passing-data-deeply-with-context) mà các component có thể cung cấp hoặc đọc.

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

Gọi `createContext` bên ngoài bất kỳ component nào để tạo một context.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `defaultValue`: Giá trị mà bạn muốn context có khi không có context provider phù hợp nào trong cây phía trên component đọc context. Nếu bạn không có bất kỳ giá trị mặc định có ý nghĩa nào, hãy chỉ định `null`. Giá trị mặc định được dùng như một phương sách cuối cùng. Nó là tĩnh và không bao giờ thay đổi theo thời gian.

#### Giá trị trả về {/*returns*/}

`createContext` trả về một đối tượng context.

**Bản thân đối tượng context không chứa bất kỳ thông tin nào.** Nó đại diện cho _context nào_ mà các component khác đọc hoặc cung cấp. Thông thường, bạn sẽ sử dụng [`SomeContext.Provider`](#provider) trong các component phía trên để chỉ định giá trị context và gọi [`useContext(SomeContext)`](/reference/react/useContext) trong các component phía dưới để đọc nó. Đối tượng context có một vài thuộc tính:

* `SomeContext.Provider` cho phép bạn cung cấp giá trị context cho các component.
* `SomeContext.Consumer` là một cách thay thế và hiếm khi được sử dụng để đọc giá trị context.

---

### `SomeContext.Provider` {/*provider*/}

Bọc các component của bạn vào một context provider để chỉ định giá trị của context này cho tất cả các component bên trong:

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

#### Props {/*provider-props*/}

* `value`: Giá trị mà bạn muốn truyền cho tất cả các component đọc context này bên trong provider này, bất kể độ sâu. Giá trị context có thể thuộc bất kỳ loại nào. Một component gọi [`useContext(SomeContext)`](/reference/react/useContext) bên trong provider sẽ nhận được `value` của context provider tương ứng gần nhất phía trên nó.

---

### `SomeContext.Consumer` {/*consumer*/}

Trước khi `useContext` tồn tại, có một cách cũ hơn để đọc context:

```js
function Button() {
  // 🟡 Cách cũ (không được khuyến nghị)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

Mặc dù cách cũ này vẫn hoạt động, **code mới nên đọc context bằng [`useContext()`](/reference/react/useContext) thay thế:**

```js
function Button() {
  // ✅ Cách được khuyến nghị
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Props {/*consumer-props*/}

* `children`: Một function. React sẽ gọi function bạn truyền vào với giá trị context hiện tại được xác định bởi cùng một thuật toán như [`useContext()`](/reference/react/useContext), và render kết quả bạn trả về từ function này. React cũng sẽ chạy lại function này và cập nhật UI bất cứ khi nào context từ các component cha thay đổi.

---

## Cách sử dụng {/*usage*/}

### Tạo context {/*creating-context*/}

Context cho phép các component [truyền thông tin xuống sâu](/learn/passing-data-deeply-with-context) mà không cần truyền props một cách rõ ràng.

Gọi `createContext` bên ngoài bất kỳ component nào để tạo một hoặc nhiều context.

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` trả về một <CodeStep step={1}>đối tượng context</CodeStep>. Các component có thể đọc context bằng cách truyền nó cho [`useContext()`](/reference/react/useContext):

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

Theo mặc định, các giá trị chúng nhận được sẽ là các <CodeStep step={3}>giá trị mặc định</CodeStep> mà bạn đã chỉ định khi tạo context. Tuy nhiên, bản thân điều này không hữu ích vì các giá trị mặc định không bao giờ thay đổi.

Context rất hữu ích vì bạn có thể **cung cấp các giá trị động khác từ các component của bạn:**

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

Bây giờ component `Page` và bất kỳ component nào bên trong nó, bất kể độ sâu, sẽ "nhìn thấy" các giá trị context được truyền. Nếu các giá trị context được truyền thay đổi, React cũng sẽ render lại các component đọc context.

[Đọc thêm về đọc và cung cấp context và xem các ví dụ.](/reference/react/useContext)

---

### Nhập và xuất context từ một file {/*importing-and-exporting-context-from-a-file*/}

Thông thường, các component trong các file khác nhau sẽ cần truy cập vào cùng một context. Đây là lý do tại sao việc khai báo context trong một file riêng là phổ biến. Sau đó, bạn có thể sử dụng câu lệnh [`export`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) để cung cấp context cho các file khác:

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

Các component được khai báo trong các file khác sau đó có thể sử dụng câu lệnh [`import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) để đọc hoặc cung cấp context này:

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

Điều này hoạt động tương tự như [nhập và xuất các component.](/learn/importing-and-exporting-components)

---

## Gỡ rối {/*troubleshooting*/}

### Tôi không thể tìm thấy cách để thay đổi giá trị context {/*i-cant-find-a-way-to-change-the-context-value*/}

Code như thế này chỉ định giá trị context *mặc định*:

```js
const ThemeContext = createContext('light');
```

Giá trị này không bao giờ thay đổi. React chỉ sử dụng giá trị này như một fallback nếu nó không thể tìm thấy một provider phù hợp ở trên.

Để làm cho context thay đổi theo thời gian, [thêm state và bọc các component trong một context provider.](/reference/react/useContext#updating-data-passed-via-context)
