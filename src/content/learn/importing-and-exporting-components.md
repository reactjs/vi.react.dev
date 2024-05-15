---
title: Nhập (import) và xuất (export) các component
---

<Intro>

Sức mạnh của các component nằm ở khả năng tái sử dụng của chúng: bạn có thể tạo các component được tạo thành từ các component khác. Nhưng khi bạn lồng ghép nhiều component hơn, thường có ý nghĩa để bắt đầu chia component đó ra thành các file khác nhau. Điều này giúp bạn giữ cho các file của mình dễ quét và tái sử dụng các component ở nhiều nơi hơn.

</Intro>

<YouWillLearn>

* File component gốc là gì
* Làm thế nào để import và export một component
* Khi nào thì dùng default và name import và export
* Làm thế nào để import và export nhiều component từ một file
* Làm thế nào để chia các component vào nhiều file

</YouWillLearn>

## The root component file {/*the-root-component-file*/}

Trong [Component đầu tiên của bạn](/learn/your-first-component), bạn tạo một component `Profile` và một component `Gallery` như bên dưới:

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

Những thành phần trong ví dụ này này hiện tại có trong một **root component file,** tên là `App.js`. Phụ thuộc vào cách bạn cài đặt, component root của bạn có thể ở trong file khác. Nếu bạn sử dụng một framework với routing dựa trên file chẳng hạn như Next.js thì component root của bạn sẽ khác với những trang khác. 

## Export và import một component {/*exporting-and-importing-a-component*/}

What if you want to change the landing screen in the future and put a list of science books there? Or place all the profiles somewhere else? It makes sense to move `Gallery` and `Profile` out of the root component file. This will make them more modular and reusable in other files. You can move a component in three steps:
Nếu bạn muốn thay đổi màn hình chào đón trong tương lai và đặt một danh sách các sách khoa học ở đó? Hoặc đặt tất cả các hồ sơ một nơi khác? Việc di chuyển `Gallery` và `Profile` ra khỏi file component gốc là hợp lý. Điều này sẽ làm cho chúng trở nên linh hoạt hơn và có thể sử dụng lại trong các file khác. Bạn có thể di chuyển một component theo ba bước:

1. **Tạo** một file JS mới để chứa các component.
2. **Export** component của bạn từ file đó (sử dụng hoặc là [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) hoặc [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) exports).
3. **Import** nó trong file nơi mà bạn sẽ sử dụng component (sử dụng kĩ thuật tương ứng cho import [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) hoặc [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module) exports).

Đây là `Profile` và `Gallery` đã được bỏ ra khỏi `App.js` và đặt vào file mới tên là `Gallery.js`. Bây giờ bạn có thay đổi `App.js` để import `Gallery` từ `Gallery.js`:

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

Bây giờ để ý ví dụ này được chia nhỏ thành hai component file như thế nào:

1. `Gallery.js`:
     - Định nghĩa component `Profile` cái mà chỉ được dùng trong cùng file và không được export.
     - Export component `Gallery` như một **default export.**
2. `App.js`:
     - Import `Gallery` như **default import** từ `Gallery.js`.
     - Exports component gốc `App` như một **default export.**


<Note>

Bạn có thể gặp các file không có phần mở rộng `.js` như sau:

```js 
import Gallery from './Gallery';
```

Cả `'./Gallery.js'` và `'./Gallery'` đều hoạt động với React, tuy nhiên phần đầu tiên gần giống với cách [native ES Modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) hoạt động một cách tự nhiên hơn.

</Note>

<DeepDive>

#### Export default và export named {/*default-vs-named-exports*/}

Có hai cách chính để xuất giá trị trong JavaScript: xuất mặc định (default exports) và xuất có tên (named exports). Cho đến nay, các ví dụ của chúng ta chỉ sử dụng xuất mặc định (default exports). Tuy nhiên, bạn có thể sử dụng cả hai loại này trong cùng một file. **Một file có thể có không quá một _default_ export, nhưng có thể có bất kỳ _named_ exports nào bạn muốn.**

![Default và named exports](/images/docs/illustrations/i_import-export.svg)

Cách bạn xuất (export) component của mình sẽ quyết định cách bạn phải nhập (import) nó. Bạn sẽ nhận được một lỗi nếu bạn cố gắng nhập (import) một default export giống như cách bạn nhập (import) một named export! Bảng dưới đây có thể giúp bạn theo dõi:

| Cú pháp          | Lệnh Export                                | Lệnh Import                               |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './Button.js';` |

Khi bạn viết một _default_ import, bạn có thể đặt bất kỳ tên nào bạn muốn sau từ khoá `import`. Ví dụ, bạn có thể viết `import Banana from './Button.js'` và nó vẫn cung cấp cho bạn cùng một default export. Ngược lại, với các named imports, tên phải khớp nhau ở cả hai bên. Đó là lý do tại sao chúng được gọi là _named_ imports!

**Người ta thường sử dụng default exports nếu tệp (file) chỉ xuất ra một component, và sử dụng named exports nếu nó xuất ra nhiều component và giá trị.** Bất kể bạn ưa thích phong cách mã hóa nào, luôn đặt tên có ý nghĩa cho các hàm component của bạn và các tệp (file) chứa chúng. Các component không có tên, như `export default () => {}`, không được khuyến khích vì chúng làm cho việc gỡ lỗi (debug) trở nên khó khăn hơn.

</DeepDive>

## Export và import nhiều component từ cùng một file {/*exporting-and-importing-multiple-components-from-the-same-file*/}

Nếu bạn chỉ muốn hiển thị một `Profile` thay vì một gallery, bạn cũng có thể xuất (export) component `Profile`. Tuy nhiên, `Gallery.js` đã có một *default* export, và bạn không thể có _hai_ default exports. Bạn có thể tạo một file mới với một default export, hoặc bạn có thể thêm một *named* export cho `Profile`. **Một file chỉ có thể có một default export, nhưng có thể có nhiều named exports!**

<Note>

Để giảm sự nhầm lẫn giữa default và named exports, một số nhóm chọn chỉ sử dụng một phong cách (default hoặc named), hoặc tránh kết hợp chúng trong một tệp duy nhất. Hãy làm điều hoạt động tốt nhất cho bạn!

</Note>

Đầu tiên, **export** `Profile` từ `Gallery.js` sử dụng một named export (không có từ khóa `default`):

```js
export function Profile() {
  // ...
}
```

Sau đó, **import** `Profile` từ `Gallery.js` vào `App.js` sử dụng một named import (với cặp dấu ngoặc nhọn ({})):

```js
import { Profile } from './Gallery.js';
```

Cuối cùng, **render** `<Profile />` từ component `App`:

```js
export default function App() {
  return <Profile />;
}
```

Bây giờ `Gallery.js` chứa hai exports: một default export `Gallery`, và một named export `Profile`. `App.js` import cả hai component này. Thử thay đổi `<Profile />` thành `<Gallery />` và quay lại ví dụ này:

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

Bây giờ bạn đang sử dụng hỗn hợp của default và named exports:

* `Gallery.js`:
  - Export component `Profile` như một **named export được gọi là `Profile`.**
  - Export component `Gallery` component như một **default export.**
* `App.js`:
  - Import `Profile` như một **named import called `Profile`** từ `Gallery.js`.
  - Import `Gallery` như một **default import** từ `Gallery.js`.
  - Export component gốc `App` như một **default export.**

<Recap>

Ở trang này bạn đã học về:

* Một file component gốc là gì
* Làm thế nào để import và export một component
* Khi nào và làm thế nào để sử dụng default và named import và export
* Làm thế nào để export nhiều component từ cùng một file

</Recap>



<Challenges>

#### Chia nhỏ các component {/*split-the-components-further*/}

Hiện tại, `Gallery.js` export cả `Profile` và `Gallery`, cái này dễ gây ra sự nhầm lẫn.

Dịch chuyển component `Profile` vào file của chính nó `Profile.js`, và sau đó thay đổi component `App` để render cả `<Profile />` và `<Gallery />`.

Bạn có thể sử dụng một default hoặc một named export cho `Profile`, nhưng hãy đảm bảo rằng bạn sử dụng cú pháp nhập tương ứng trong cả `App.js` và `Gallery.js`! Bạn có thể tham khảo bảng từ phần tìm hiểu chi tiết ở trên:

| Cú pháp          | Lệnh Export                                | Lệnh Import                               |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './Button.js';` |

<Hint>

Đừng quên import các component của bạn vào nơi mà chúng được gọi. `Gallery` cũng sử dụng `Profile`, đúng không?

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

Sau khi bạn làm cho nó hoạt động với một loại export, hãy làm cho nó hoạt động với loại export khác.

<Solution>

Đây là giải pháp với named exports:

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

Đây là giải pháp với default exports:

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
