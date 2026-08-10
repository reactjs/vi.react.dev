---
title: Component đầu tiên của bạn
---

<Intro>

*Component* là một trong những khái niệm cơ bản của React. Chúng là nền tảng bạn dựa vào để xây dựng giao diện (UI) và điều đó khiến chúng là một khởi đầu hoàn hảo để bắt đầu hành trình React của bạn!

</Intro>

<YouWillLearn>

* Một component là gì
* Vai trò của component trong một ứng dụng React
* Cách để viết React component đầu tiên của bạn

</YouWillLearn>

## Component: Những viên gạch để xây dựng UI {/*components-ui-building-blocks*/}

Ở Web, HTML cho chúng ta tạo ra các tài liệu với cấu trúc phong phú sử dụng các thẻ có sẵn như `<h1>` và `<li>`:

```html
<article>
  <h1>My First Component</h1>
  <ol>
    <li>Components: UI Building Blocks</li>
    <li>Defining a Component</li>
    <li>Using a Component</li>
  </ol>
</article>
```

Phần markup này bao gồm bài viết này `<article>`, tiêu đề của nó `<h1>`, và một bảng mục lục (tóm tắt) được biểu diễn bằng một danh sách có thứ tự `<ol>`. Markup như thế này, kết hợp với CSS để thêm các styles, và JavaScript để tạo tính tương tác, nằm phía sau sidebar, ảnh đại diện (avatar), modal, dropdown — mỗi phần của UI bạn thấy trên Web.

React cho phép bạn kết hợp markup, CSS, và JavaScript để tạo nên các "component" tự làm, **những phần tử UI có thể tái sử dụng cho ứng dụng của bạn.** Bảng mục lục bạn thấy ở trên có thể được chuyển thành một component `<TableOfContents />` mà bạn có thể render trên mọi trang. Phía sau cánh gà, nó vẫn sử dụng các thẻ HTML như `<article>`, `<h1>`, v.v.

Giống như với các thẻ HTML, bạn có thể tạo, sắp xếp và lồng các component để thiết kế nên các trang hoàn chỉnh. Ví dụ, trang tài liệu bạn đang đọc được tạo từ các React component như:

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

Khi mà dự án của bạn phát triển, bạn sẽ nhận thấy rất nhiều các thiết kế của bạn có thể được xây dựng bằng cách tái sử dụng các component bạn đã viết, từ đó đẩy nhanh tốc độ phát triển. Mục lục của chúng tôi ở trên có thể được thêm vào bất cứ màn hình nào với `<TableOfContents />`! Bạn thậm chí còn có thể bắt đầu dự án của mình với hàng ngàn các component được chia sẻ bởi cộng đồng mã nguồn mở React như [Chakra UI](https://chakra-ui.com/) và [Material UI.](https://material-ui.com/)

## Định nghĩa một component {/*defining-a-component*/}

Theo truyền thống, khi tạo ra các trang web, các nhà phát triển web markup nội dung của họ và sau đó thêm khả năng tương tác bằng cách sử dụng thêm JavaScript. Cách này hoạt động tốt khi các tương tác vẫn còn là một thứ "có thì tốt" ở web. Bây giờ thì điều đó được kỳ vọng là sẵn có ở rất nhiều trang và mọi ứng dụng. React đặt tính tương tác lên đầu trong khi vẫn sử dụng các công nghệ tương tự: **một React component là một hàm JavaScript mà bạn có thể _dùng markup_.** Đây là một ví dụ (bạn có thể chỉnh sửa ví dụ bên dưới):

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

Và đây là cách để xây dựng một component:

### Bước 1: Xuất (Export) component {/*step-1-export-the-component*/}

Tiền tố `export default` là một [cú pháp JavaScript tiêu chuẩn](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) (không cụ thể cho React). Nó cho phép bạn đánh dấu hàm chính của một file để bạn có thể nhập (import) nó từ những file khác. (Thêm thông tin về importing ở trong [Import và Export các component](/learn/importing-and-exporting-components)!)

### Bước 2: Định nghĩa hàm {/*step-2-define-the-function*/}

Với `function Profile() { }` bạn định nghĩa một hàm JavaScript với tên là `Profile`.

<Pitfall>

React component là những hàm JavaScript bình thường, tuy nhiên **tên của chúng phải bắt đầu bằng một chữ cái in hoa**. Nếu không, chúng sẽ không hoạt động!

</Pitfall>

### Bước 3: Thêm markup {/*step-3-add-markup*/}

Component trả về một thẻ `<img />` với thuộc tính `src` và `alt`. `<img />` được viết như HTML, nhưng chúng thật ra là JavaScript ở phía sau hậu trường! Cú pháp này được gọi là [JSX](/learn/writing-markup-with-jsx), và nó cho phép bạn nhúng markup vào trong JavaScript.

Câu lệnh return có thể được viết hết ở trong một dòng, như trong component này:

```js
return <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

Nhưng nếu markup của bạn không ở cùng một dòng với từ khóa `return`, bạn sẽ phải bao nó ở trong một cặp dấu ngoặc:

```js
return (
  <div>
    <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Pitfall>

Nếu không có cặp ngoặc, bất kỳ code nào ở sau `return` [sẽ bị bỏ qua](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Pitfall>

## Sử dụng một component {/*using-a-component*/}

Giờ thì bạn đã định nghĩa component `Profile`, bạn có thể lồng nó bên trong các component khác. Ví dụ, bạn có thể export một component `Gallery` sử dụng nhiều component `Profile` bên trong nó:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/MK3eW3As.jpg"
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

### Những gì mà trình duyệt nhìn thấy {/*what-the-browser-sees*/}

Chú ý đến sự khác biệt về chữ hoa/chữ thường:

* `<section>` viết thường, vì vậy React biết rằng chúng ta đang nói đến một thẻ HTML.
* `<Profile />` bắt đầu bằng chữ hoa, vì vậy React biết rằng chúng ta muốn sử dụng một component của chúng ta có tên là `Profile`.

Và `Profile` thì lại chứa nhiều HTML hơn nữa: `<img />`. Cuối cùng, đây là những gì mà trình duyệt nhìn thấy:

```html
<section>
  <h1>Amazing scientists</h1>
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### Lồng và sắp xếp các component {/*nesting-and-organizing-components*/}

Component là các hàm JavaScript bình thường, nên bạn có thể có nhiều component ở trong cùng một file. Điều này tiện lợi khi các component vẫn còn nhỏ và liên quan đến nhau một cách chặt chẽ. Nếu file này càng ngày càng lớn, bạn luôn có thể dời `Profile` ra một file riêng. Bạn sẽ học cách làm điều này trong [Import và Export các component](/learn/importing-and-exporting-components)

Bởi vì các component `Profile` được render bên trong `Gallery`—thậm chí nhiều lần!—chúng ta có thể nói rằng `Gallery` là một **component cha (parent component),** render mỗi `Profile` như một "con" (child). Đây là phần kỳ diệu của React: bạn có thể định nghĩa component một lần và sử dụng nó ở khắp các nơi và với số lần tùy thích.

<Pitfall>

Component có thể render các component khác, nhưng **bạn không bao giờ được lồng các định nghĩa của chúng:**

```js {2-5}
export default function Gallery() {
  // 🔴 Never define a component inside another component!
  function Profile() {
    // ...
  }
  // ...
}
```

Phần code ở trên [chạy rất chậm và gây ra bug](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) Thay vào đó, hãy định nghĩa component ở đầu file:

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Declare components at the top level
function Profile() {
  // ...
}
```

Khi mà một component con cần dữ liệu từ cha, [hãy truyền nó qua props](/learn/passing-props-to-a-component) thay vì lồng các định nghĩa.

</Pitfall>

<DeepDive>

#### Sử dụng Component từ đầu đến cuối {/*components-all-the-way-down*/}

Ứng dụng React của bạn bắt đầu từ một component "gốc" (root). Thường thì component này được tạo ra tự động khi mà bạn bắt đầu một dự án mới. Ví dụ, nếu bạn dùng [CodeSandbox](https://codesandbox.io/) hay nếu bạn sử dụng framework [Next.js](https://nextjs.org/), component gốc sẽ được định nghĩa ở `pages/index.js`. Trong những ví dụ này, bạn đã export các component gốc.

Hầu hết các ứng dụng React đều sử dụng component từ đầu đến cuối. Điều này có nghĩa là bạn không chỉ sử dụng component cho những phần có thể tái sử dụng như các nút (button) mà còn cho các phần lớn hơn như sidebar, các danh sách và đích đến cuối, các trang hoàn chỉnh! Component là một cách tiện lợi để tổ chức code UI và markup, ngay cả khi một số chúng chỉ được sử dụng một lần.

<<<<<<< HEAD
[Các framwork React](/learn/start-a-new-react-project) nâng điều này lên một tầm cao mới. Thay vì chỉ sử dụng một trang HTML rỗng và để React "điều khiển" việc quản lý trang với JavaScript, chúng *cũng* tạo ra HTML tự động từ các React component của bạn. Điều này khiến cho ứng dụng của bạn có thể hiển thị một số nội dung trước khi code JavaScript chạy.
=======
[React-based frameworks](/learn/creating-a-react-app) take this a step further. Instead of using an empty HTML file and letting React "take over" managing the page with JavaScript, they *also* generate the HTML automatically from your React components. This allows your app to show some content before the JavaScript code loads.
>>>>>>> c7d6b700038c63d1aaf2c649af1aefe01ebbacac

Tuy vậy, rất nhiều website chỉ dùng React để [thêm tương tác cho các trang HTML đã có sẵn](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page). Họ có rất nhiều các root component thay vì một cái cho cả trang. Bạn có thể dùng nhiều hoặc ít React tùy thích.

</DeepDive>

<Recap>

Bạn vừa có được một cái nhìn đầu tiên về React! Hãy tóm tắt lại một số điểm quan trọng.

* React cho bạn tạo ra các component, **các thành phần UI có thể tái sử dụng cho ứng dụng của bạn.**
* Ở trong ứng dụng React, mỗi phần của UI là một component.
* React component là các hàm JavaScript ngoại trừ việc:

  1. Tên của chúng luôn bắt đầu bằng chữ cái viết hoa.
  2. Chúng trả về JSX markup.

</Recap>



<Challenges>

#### Export component {/*export-the-component*/}

Phần sandbox này không chạy vì root component chưa được export:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Hãy thử tự mình sửa code trước khi tham khảo lời giải!

<Solution>

Thêm `export default` trước định nghĩa hàm như sau:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Bạn có thể tự hỏi tại sao viết `export` một mình là không đủ để sửa ví dụ này. Bạn có thể tìm hiểu sự khác biệt giữa `export` và `export default` ở trong phần [Import và Export các component.](/learn/importing-and-exporting-components)

</Solution>

#### Sửa câu lệnh return {/*fix-the-return-statement*/}

Có điều gì đó không đúng về câu lệnh `return` này. Bạn có thể sửa nó không?

<Hint>

Bạn có thể gặp lỗi "Unexpected token" khi đang cố sửa lỗi này. Trong trường hợp đó, kiểm tra dấu chấm phẩy xuất hiện *sau* dấu đóng ngoặc. Để lại dấu chấm phẩy trong `return ( )` sẽ gây ra lỗi.

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

Bạn có thể sửa component này bằng cách di chuyển câu lệnh `return` như sau:

<Sandpack>

```js
export default function Profile() {
  return <img src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

Hoặc bằng cách bao JSX markup ở trong ngoặc đơn với mở ngoặc đơn xuất hiện ngay sau `return`:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg"
      alt="Katsuko Saruhashi"
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### Phát hiện lỗi sai {/*spot-the-mistake*/}

Có gì đó không đúng với cách khai báo và sử dụng component `Profile`. Bạn có thể phát hiện ra lỗi sai không? (Hãy nhớ lại cách React phân biệt các component với các thẻ HTML thông thường!)

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

Tên React component phải bắt đầu bằng một chữ cái in hoa.

Thay đổi `function profile()` thành `function Profile()`, và sau đó thay đổi mọi chỗ dùng `<profile />` thành `<Profile />`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
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
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### Component của riêng bạn {/*your-own-component*/}

Viết một component từ đầu. Bạn có thể cho nó bất cứ tên nào và trả về bất kỳ markup nào. Nếu bạn bí ý tưởng, bạn có thể viết một component `Congratulations` hiển thị `<h1>Good job!</h1>`. Đừng quên export nó!

<Sandpack>

```js
// Write your component below!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Good job!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
