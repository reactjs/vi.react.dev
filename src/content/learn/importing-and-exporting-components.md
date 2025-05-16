---
title: Importing (nhập) và Exporting (Xuất) Components
---

<Intro>

Ưu điểm của components nằm ở việc bạn có thể tái sử dụng chúng. Bạn có thể tạo ra components mà chứa đựng các components khác. Nhưng nếu bạn muốn lồng ghép càng nhiều components vô lẫn nhau thì nên chia các components của bạn thành các files riêng lẻ. Điều này sẽ giúp bạn thuận tiện trong việc quản lí files để tái sử dụng components ở nhiều vị trí khác nhau.

</Intro>

<YouWillLearn>

* Khái niệm về file của root component (gốc)
* Cách để import và export một component
* Khi nào nên dùng default (mặc định) hoặc named (đặt tên) imports và exports
* Cách để import và export nhiều components từ một file
* Cách để chia nhiều components ra các files khác nhau

</YouWillLearn>

## File của root component {/*the-root-component-file*/}

Trong [Component đầu tiên của bạn](/learn/your-first-component), bạn đã tạo ra một component `Profile` và dùng một component `Gallery` khác để render nó:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Trong ví dụ trên, các components đang được đặt trong **file của root component,** với tên file là `App.js`. Tuy nhiên, tuỳ thuộc vào cách setup của bạn, root component cũng có thể được đặt trong một file khác. Nếu bạn sử dụng một framework theo cấu trúc file, như là Next.js, root component sẽ khác nhau cho mỗi trang khác nhau.

## Exporting và importing một component {/*exporting-and-importing-a-component*/}

Giả sử trong trường hợp bạn muốn thay đổi trang giao diện để hiển thị một danh sách về các loại sách khoa học? Hoặc bạn muốn đặt tất cả profiles ở vị trí khác? Phương thức hiệu quả là dời cả components `Gallery` và `Profile` ra khỏi file của root component. Cách này sẽ làm chúng dễ tái sử dụng hơn ở các files khác nhau. Bạn có thể dời một component với 3 bước như sau:

1. **Tạo ra** một file JS mới để chứa các components.
2. **Export** function component của bạn ra khỏi file mới tạo (bằng cách sử dụng [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) hoặc [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) exports).
3. **Import** component đó vào file mà bạn muốn dùng nó (sử dụng phương pháp import tương tự như cách bạn export ở trên với [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) hoặc [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module)).

Ví dụ ở dưới là cách bạn dời cả hai `Profile` và `Gallery` ra khỏi `App.js` và đặt chúng vào một file mới tên `Gallery.js`. Bây giờ bạn có thể thay đổi `App.js` để import `Gallery` từ `Gallery.js`:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Bây giờ, hãy để ý ở ví dụ trên đã chia ra thành hai files component khác nhau, bao gồm:

1. `Gallery.js`:
     - Thiết lập component `Profile` với mục đích sử dụng trong file và không được export ra ngoài.
     - Export component `Gallery` bằng cách **default export.**
2. `App.js`:
     - Import `Gallery` bằng cách **default import** từ file `Gallery.js`.
     - Export root component `App` bằng cách **default export.**


<Note>

Có những trường hợp mà files bỏ đi phần đuôi `.js` như ví dụ dưới đây:

```js 
import Gallery from './Gallery';
```

Cả `'./Gallery.js'` hoặc `'./Gallery'` đều đúng với React. Tuy nhiên, sử dụng `'./Gallery.js'` sẽ thuận với cách dùng của [native ES Modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) hơn.

</Note>

<DeepDive>

#### Default vs named exports {/*default-vs-named-exports*/}

Có hai cách chính để export giá trị bằng JavaScripts: default exports và named exports. Những ví dụ từ đầu tới giờ chỉ dùng default exports. Tuy nhiên bạn có thể sử dụng một hoặc cả hai cách trong cùng một file. **Hãy nhớ rằng mỗi file chỉ được có duy nhất một _default_ export, nhưng nó được phép có nhiều _named_ exports.**

![Default và named exports](/images/docs/illustrations/i_import-export.svg)

Cách bạn export một component sẽ quyết định cách bạn import nó. Bạn sẽ gặp lỗi nếu bạn import một default export theo cách mà bạn dùng cho named export! Bảng hướng dẫn dưới đây sẽ giúp bạn tránh lỗi này:

| Cú pháp           | Câu lệnh Export                           | Câu lệnh Import                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './Button.js';` |

Khi bạn dùng một _default_ import, bạn có thể dùng bất cứ tên gọi nào để đặt ở phía sau từ khoá `import`. Ví dụ như nếu bạn dùng `import Banana from './Button.js'` cho loại default export tương ứng thì bạn cũng sẽ đạt được kết quả tương tự. Tuy nhiên, với named imports, tên gọi phải đồng nhất ở cả hai phía export và import. Đó là lí do tại sao mà chúng được gọi là named imports!

**Thông thường, mọi người dùng default exports cho các file chỉ export một component, và dùng named exports cho các file export nhiều components và các giá trị khác nhau.** Dù cho bạn có dùng bất kể phương pháp nào, hãy nhớ là luôn luôn đặt tên mang tính gợi ý cho các component functions của bạn và cho các files của chúng. Không nên sử dụng components không tên, chẳng hạn như `export default () => {}`, vì chúng sẽ gây khó khăn trong việc sửa lỗi code.

</DeepDive>

## Exporting và importing nhiều components từ cùng một file {/*exporting-and-importing-multiple-components-from-the-same-file*/}

Giả sử bạn muốn hiển thị chỉ một `Profile` thay vì là cả một gallery? Bạn có thể export component `Profile`. Tuy nhiên, `Gallery.js` đã có dùng một *default* export rồi, và bạn không được dùng _hai_ default exports trong một file. Thế nên có hai cách làm như sau là (1) bạn có thể tạo ra một file mới rồi dùng default export, hoặc (2) bạn có thể dùng một *named* export cho component `Profile`. **Một file chỉ có thể dùng một default export, nhưng nó có thể dùng nhiều named exports!**
<Note>

Để giảm bớt việc lẫn lộn giữa default và named exports, một số teams chọn chỉ sử dụng một trong hai (default hoặc named), hoặc tránh việc dùng lẫn cả hai trong cùng một file. Hãy chọn cách hiệu quả nhất cho bạn!

</Note>

Bước đầu tiên, **export** `Profile` từ `Gallery.js` bằng named export (bỏ từ `default` ra):

```js
export function Profile() {
  // ...
}
```

Sau đó, **import** `Profile` từ `Gallery.js` vào `App.js` bằng named import (sử dụng cặp dấu ngoặc nhọn):

```js
import { Profile } from './Gallery.js';
```

Bước cuối cùng, **render** `<Profile />` từ component `App`:

```js
export default function App() {
  return <Profile />;
}
```

Sau khi hoàn thành các bước trên thì hiện tại `Gallery.js` chứa hai components: một default export `Gallery`, và một named export `Profile`. `App.js` import cả hai components trên. Ở ví dụ dưới đây, bạn hãy thử đổi `<Profile />` thành `<Gallery />`, và ngược lại.

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js src/Gallery.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Hiện tại, bạn đang sử dụng xen lẫn cả default và named exports:

* `Gallery.js`:
  - Export component `Profile` bằng cách **named export với tên `Profile`.**
  - Export component `Gallery` bằng cách **default export.**
* `App.js`:
  - Import `Profile` bằng cách **named import với tên `Profile`** từ `Gallery.js`.
  - Import `Gallery` bằng cách **default import** từ `Gallery.js`.
  - Export root component `App` bằng cách **default export.**

<Recap>

Trong chương này, bạn đã học được:

* Khái niệm về file của root component
* Cách để import và export một component
* Khi nào và làm sao để sử dụng default và named imports và exports
* Làm sao để export nhiều components từ cùng một file

</Recap>



<Challenges>

#### Tách riêng các components thêm hơn nữa {/*split-the-components-further*/}

Hiện tại, việc `Gallery.js` export cả hai components `Profile` và `Gallery` đôi khi có thể gây nhầm lẫn.

Ta có thể dời component `Profile` vào một file riêng khác với tên `Profile.js`, sau đó dùng component `App` để lần lượt render cả hai `<Profile />` và `<Gallery />`.

Bạn có thể sử dụng default hoặc named export cho `Profile`, tuy nhiên hãy nhớ sử dụng cú pháp import cho tương ứng trong cả hai file `App.js` và `Gallery.js`! Bạn có thể xem bảng hướng dẫn phía dưới cho cách sử dụng cú pháp chính xác:

| Cú pháp           | Câu lệnh Export                           | Câu lệnh Import                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './Button.js';` |

<Hint>

Đừng quên import components ở nơi mà chúng được dùng. Cân nhắc xem `Gallery` có dùng `Profile` hay không?

</Hint>

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js src/Gallery.js active
// Move me to Profile.js!
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Sau khi bạn thành công với một phương pháp export, hãy thử với phương pháp còn lại.

<Solution>

Dưới đây là đáp án mà sử dụng named exports:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import { Profile } from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Dưới đây là đáp án mà sử dụng default exports:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>
