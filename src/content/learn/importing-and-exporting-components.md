---
title: Nhập và Xuất Component
---

<Intro>

Điều kỳ diệu của component nằm ở khả năng tái sử dụng của chúng: bạn có thể tạo các component được cấu thành từ các component khác. Nhưng khi bạn lồng ngày càng nhiều component, việc bắt đầu chia chúng thành các file khác nhau thường có ý nghĩa. Điều này cho phép bạn giữ cho các file của mình dễ quét và tái sử dụng các component ở nhiều nơi hơn.

</Intro>

<YouWillLearn>

* File component gốc là gì
* Cách nhập và xuất một component
* Khi nào nên sử dụng nhập và xuất mặc định và có tên
* Cách nhập và xuất nhiều component từ một file
* Cách chia component thành nhiều file

</YouWillLearn>

## File component gốc {/*the-root-component-file*/}

Trong [Component Đầu Tiên Của Bạn](/learn/your-first-component), bạn đã tạo một component `Profile` và một component `Gallery` hiển thị nó:

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
      <h1>Các nhà khoa học tuyệt vời</h1>
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

Chúng hiện đang nằm trong một **file component gốc,** có tên là `App.js` trong ví dụ này. Tuy nhiên, tùy thuộc vào thiết lập của bạn, component gốc của bạn có thể nằm trong một file khác. Nếu bạn sử dụng một framework có định tuyến dựa trên file, chẳng hạn như Next.js, component gốc của bạn sẽ khác nhau đối với mỗi trang.

## Xuất và nhập một component {/*exporting-and-importing-a-component*/}

Điều gì sẽ xảy ra nếu bạn muốn thay đổi màn hình đích trong tương lai và đặt một danh sách các cuốn sách khoa học ở đó? Hoặc đặt tất cả các hồ sơ ở một nơi khác? Việc di chuyển `Gallery` và `Profile` ra khỏi file component gốc có ý nghĩa. Điều này sẽ làm cho chúng trở nên mô-đun hơn và có thể tái sử dụng ở các file khác. Bạn có thể di chuyển một component trong ba bước:

1. **Tạo** một file JS mới để đặt các component vào.
2. **Xuất** function component của bạn từ file đó (sử dụng [xuất mặc định](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) hoặc [xuất có tên](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports)).
3. **Nhập** nó trong file nơi bạn sẽ sử dụng component (sử dụng kỹ thuật tương ứng để nhập [mặc định](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) hoặc [có tên](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module)).

Ở đây cả `Profile` và `Gallery` đã được di chuyển ra khỏi `App.js` vào một file mới có tên là `Gallery.js`. Bây giờ bạn có thể thay đổi `App.js` để nhập `Gallery` từ `Gallery.js`:

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
      <h1>Các nhà khoa học tuyệt vời</h1>
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

Lưu ý cách ví dụ này được chia thành hai file component bây giờ:

1. `Gallery.js`:
     - Định nghĩa component `Profile` chỉ được sử dụng trong cùng một file và không được xuất.
     - Xuất component `Gallery` dưới dạng **xuất mặc định.**
2. `App.js`:
     - Nhập `Gallery` dưới dạng **nhập mặc định** từ `Gallery.js`.
     - Xuất component `App` gốc dưới dạng **xuất mặc định.**


<Note>

Bạn có thể gặp các file bỏ qua phần mở rộng file `.js` như sau:

```js 
import Gallery from './Gallery';
```

`'./Gallery.js'` hoặc `'./Gallery'` sẽ hoạt động với React, mặc dù cách đầu tiên gần hơn với cách [ES Modules gốc](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) hoạt động.

</Note>

<DeepDive>

#### Xuất mặc định so với xuất có tên {/*default-vs-named-exports*/}

Có hai cách chính để xuất các giá trị bằng JavaScript: xuất mặc định và xuất có tên. Cho đến nay, các ví dụ của chúng ta chỉ sử dụng xuất mặc định. Nhưng bạn có thể sử dụng một hoặc cả hai trong cùng một file. **Một file không thể có nhiều hơn một xuất _mặc định_, nhưng nó có thể có bao nhiêu xuất _có tên_ tùy thích.**

![Xuất mặc định và có tên](/images/docs/illustrations/i_import-export.svg)

Cách bạn xuất component của mình sẽ quyết định cách bạn phải nhập nó. Bạn sẽ gặp lỗi nếu bạn cố gắng nhập một xuất mặc định giống như cách bạn nhập một xuất có tên! Biểu đồ này có thể giúp bạn theo dõi:

| Cú pháp           | Câu lệnh xuất                           | Câu lệnh nhập                          |
| -----------      | -----------                                | -----------                               |
| Mặc định  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Có tên    | `export function Button() {}`         | `import { Button } from './Button.js';` |

Khi bạn viết một nhập _mặc định_, bạn có thể đặt bất kỳ tên nào bạn muốn sau `import`. Ví dụ: bạn có thể viết `import Banana from './Button.js'` và nó vẫn sẽ cung cấp cho bạn cùng một xuất mặc định. Ngược lại, với nhập có tên, tên phải khớp ở cả hai phía. Đó là lý do tại sao chúng được gọi là nhập _có tên_!

**Mọi người thường sử dụng xuất mặc định nếu file chỉ xuất một component và sử dụng xuất có tên nếu nó xuất nhiều component và giá trị.** Bất kể bạn thích kiểu mã hóa nào, hãy luôn đặt tên có ý nghĩa cho các function component của bạn và các file chứa chúng. Các component không có tên, như `export default () => {}`, không được khuyến khích vì chúng gây khó khăn hơn cho việc gỡ lỗi.

</DeepDive>

## Xuất và nhập nhiều component từ cùng một file {/*exporting-and-importing-multiple-components-from-the-same-file*/}

Điều gì sẽ xảy ra nếu bạn muốn hiển thị chỉ một `Profile` thay vì một gallery? Bạn cũng có thể xuất component `Profile`. Nhưng `Gallery.js` đã có một xuất *mặc định* và bạn không thể có _hai_ xuất mặc định. Bạn có thể tạo một file mới với một xuất mặc định hoặc bạn có thể thêm một xuất *có tên* cho `Profile`. **Một file chỉ có thể có một xuất mặc định, nhưng nó có thể có nhiều xuất có tên!**

<Note>

Để giảm sự nhầm lẫn tiềm ẩn giữa xuất mặc định và có tên, một số nhóm chọn chỉ tuân theo một kiểu (mặc định hoặc có tên) hoặc tránh trộn chúng trong một file. Hãy làm những gì phù hợp nhất với bạn!

</Note>

Đầu tiên, **xuất** `Profile` từ `Gallery.js` bằng cách sử dụng xuất có tên (không có từ khóa `default`):

```js
export function Profile() {
  // ...
}
```

Sau đó, **nhập** `Profile` từ `Gallery.js` vào `App.js` bằng cách sử dụng nhập có tên (với dấu ngoặc nhọn):

```js
import { Profile } from './Gallery.js';
```

Cuối cùng, **hiển thị** `<Profile />` từ component `App`:

```js
export default function App() {
  return <Profile />;
}
```

Bây giờ `Gallery.js` chứa hai xuất: một xuất `Gallery` mặc định và một xuất `Profile` có tên. `App.js` nhập cả hai. Hãy thử chỉnh sửa `<Profile />` thành `<Gallery />` và ngược lại trong ví dụ này:

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
      <h1>Các nhà khoa học tuyệt vời</h1>
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

Bây giờ bạn đang sử dụng kết hợp xuất mặc định và có tên:

* `Gallery.js`:
  - Xuất component `Profile` dưới dạng **xuất có tên có tên là `Profile`.**
  - Xuất component `Gallery` dưới dạng **xuất mặc định.**
* `App.js`:
  - Nhập `Profile` dưới dạng **nhập có tên có tên là `Profile`** từ `Gallery.js`.
  - Nhập `Gallery` dưới dạng **nhập mặc định** từ `Gallery.js`.
  - Xuất component `App` gốc dưới dạng **xuất mặc định.**

<Recap>

Trên trang này, bạn đã học:

* File component gốc là gì
* Cách nhập và xuất một component
* Khi nào và cách sử dụng nhập và xuất mặc định và có tên
* Cách xuất nhiều component từ cùng một file

</Recap>



<Challenges>

#### Chia nhỏ các component hơn nữa {/*split-the-components-further*/}

Hiện tại, `Gallery.js` xuất cả `Profile` và `Gallery`, điều này hơi khó hiểu.

Di chuyển component `Profile` sang `Profile.js` riêng của nó, sau đó thay đổi component `App` để hiển thị cả `<Profile />` và `<Gallery />` liên tiếp.

Bạn có thể sử dụng xuất mặc định hoặc xuất có tên cho `Profile`, nhưng hãy đảm bảo rằng bạn sử dụng cú pháp nhập tương ứng trong cả `App.js` và `Gallery.js`! Bạn có thể tham khảo bảng từ phần tìm hiểu sâu ở trên:

| Cú pháp           | Câu lệnh xuất                           | Câu lệnh nhập                          |
| -----------      | -----------                                | -----------                               |
| Mặc định  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Có tên    | `export function Button() {}`         | `import { Button } from './Button.js';` |

<Hint>

Đừng quên nhập các component của bạn nơi chúng được gọi. `Gallery` không sử dụng `Profile` sao?

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
      <h1>Các nhà khoa học tuyệt vời</h1>
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

Sau khi bạn làm cho nó hoạt động với một loại xuất, hãy làm cho nó hoạt động với loại còn lại.

<Solution>

Đây là giải pháp với xuất có tên:

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
      <h1>Các nhà khoa học tuyệt vời</h1>
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

Đây là giải pháp với xuất mặc định:

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
      <h1>Các nhà khoa học tuyệt vời</h1>
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
