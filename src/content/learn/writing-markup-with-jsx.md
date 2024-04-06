---
title: Viết Giao Diện Với JSX
---

<Intro>

*JSX* là cú pháp mở rộng cho JavaScript cho phép bạn viết giao diện giống HTML bên trong JavaScript file. Mặc dù có nhiều cách khác để viết components, nhưng hầu hết các nhà phát triển React đều thích sự đơn giản của JSX và hầu hết các codebases đều sử dụng JSX.

</Intro>

<YouWillLearn>

* Tại sao React kết hợp giao diện với rendering logic
* JSX khác HTML như thế nào
* Hiển thị thông tin với JSX như thế nào

</YouWillLearn>

## JSX: Đưa giao diện vào JavaScript {/*jsx-putting-markup-into-javascript*/}

Web đã được xây dựng dựa trên HTML, CSS và JavaScript. Trong nhiều năm, các nhà phát triển web tạo dung bằng HTML, thiết kế bằng CSS và viết logic bằng JavaScript, thường ở các tệp riêng biệt! Nội dung được soạn bên trong HTML trong khi logic của trang tồn tại riêng biệt trong JavaScript:

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="Giao diện HTML có nền màu tím và một div có hai thẻ con: p và form.">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Ba trình xử lý JavaScript có nền màu vàng: onSubmit, onLogin và onClick.">

JavaScript

</Diagram>

</DiagramGroup>

Nhưng khi Web có thể tương tác nhiều hơn, logic ngày càng quyết định nội dung của trang web. JavaScript chịu trách nhiệm render HTML! Đây là lý do tại sao **trong React, logic hiển thị và giao diện tồn tại cùng nhau ở cùng một nơi—components.**

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="React component with HTML and JavaScript from previous examples mixed. Function name is Sidebar which calls the function isLoggedIn, highlighted in yellow. Nested inside the function highlighted in purple is the p tag from before, and a Form tag referencing the component shown in the next diagram.">

`Sidebar.js` React component

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="React component with HTML and JavaScript from previous examples mixed. Function name is Form containing two handlers onClick and onSubmit highlighted in yellow. Following the handlers is HTML highlighted in purple. The HTML contains a form element with a nested input element, each with an onClick prop.">

`Form.js` React component

</Diagram>

</DiagramGroup>

Việc giữ logic hiển thị và giao diện của một button cùng nhau đảm bảo rằng chúng luôn đồng bộ trong mỗi lần chỉnh sửa. Ngược lại, các thành phần không liên quan, chẳng hạn như giao diện của button và giao diện của sidebar, được tách biệt với nhau, giúp việc tự thay đổi một trong hai trở nên an toàn hơn.

Mỗi React component là một hàm JavaScript có thể chứa một số giao diện mà React hiển thị trên trình duyệt. Các React component sử dụng cú pháp mở rộng JSX để biểu đạt giao diện đó. JSX trông rất giống HTML, nhưng nó chặt chẽ hơn một chút và có thể hiển thị thông tin động. Cách tốt nhất để hiểu hơn về JSX là chuyển một số giao diện HTML thành giao diện JSX.

<Note>

JSX và React là hai thứ riêng biệt. Chúng thường được sử dụng cùng nhau, nhưng bạn *có thể* [sử dụng chúng một cách độc lập](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform).JSX là một cú pháp mở rộng, trong khi React là thư viện JavaScript.

</Note>

## Chuyển HTML thành JSX {/*converting-html-to-jsx*/}

Giả sử bạn có một đoạn HTML (hoàn toàn hợp lệ):

```html
<h1>Hedy Lamarr's Todos</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  class="photo"
>
<ul>
    <li>Invent new traffic lights
    <li>Rehearse a movie scene
    <li>Improve the spectrum technology
</ul>
```

Và bạn muốn đặt nó vào component:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

Nếu bạn sao chép dùng như vậy, nó sẽ không hoạt động:


<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr's Todos</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Hedy Lamarr" 
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve the spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

Điều này xảy ra do JSX chặt chẽ hơn và có nhiều quy tắc hơn HTML! Nếu bạn đọc các thông báo lỗi ở trên, nó sẽ hướng dẫn bạn sửa lỗi giao diện hoặc bạn có thể làm theo hướng dẫn bên dưới.

<Note>

Trong hầu hết các trường hợp, thông báo lỗi trên màn hình của React sẽ giúp bạn tìm ra vấn đề ở chỗ nào. Hãy đọc chúng nếu bạn gặp khó khăn!

</Note>

## Các quy tắc JSX {/*the-rules-of-jsx*/}

### 1. Trả về một root element {/*1-return-a-single-root-element*/}

Trả về nhiều elements từ một component, **wrap them with a single parent tag.**

Ví dụ, bạn có thể sử dụng `<div>`:

```js {1,11}
<div>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```


Nếu bạn không muốn thêm một thẻ `<div>` vào giao diện, bạn có thể viết `<>` và `</>` để thay thế:

```js {1,11}
<>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

Thẻ trống này được gọi là *[Fragment.](/reference/react/Fragment)* Fragments giúp bạn nhóm các elements mà không để lại bất kỳ dấu vết nào trong cây HTML của trình duyệt.

<DeepDive>

#### Tại sao nhiều thẻ JSX cần được bọc {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX trông giống như HTML, nhưng bên dưới nó được chuyển đổi thành các đối tượng JavaScript đơn giản. Bạn không thể trả về hai đối tượng từ một hàm mà không để chúng vào một mảng. Điều này giải thích tại sao bạn cũng không thể trả về hai thẻ JSX mà không để chúng vào một thẻ khác hoặc một Fragment.

</DeepDive>

### 2. Đóng tất cả các thẻ {/*2-close-all-the-tags*/}

JSX yêu cầu các thẻ phải được đóng rõ ràng: các thẻ tự đóng như `<img>` phải trở thành `<img />` và các thẻ bọc như `<li>oranges` phải được viết là `<li>oranges</li> `.

Image và danh sách các mục của Hedy Lamarr trông như sau:

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
   />
  <ul>
    <li>Invent new traffic lights</li>
    <li>Rehearse a movie scene</li>
    <li>Improve the spectrum technology</li>
  </ul>
</>
```

### 3. camelCase <s>tất cả</s> hầu hết mọi thứ! {/*3-camelcase-salls-most-of-the-things*/}

JSX chuyển thành JavaScript và các thuộc tính được viết bằng JSX trở thành khóa của các đối tượng JavaScript. Trong components của mình, bạn thường muốn đưa các thuộc tính đó thành các biến. Nhưng JavaScript có những hạn chế về tên biến. Ví dụ: tên của chúng không được chứa dấu gạch ngang hoặc các từ dành riêng như `class`.

Đây là lý do tại sao trong React, nhiều thuộc tính HTML và SVG được viết bằng CamelCase. Ví dụ: thay vì `stroke-width` bạn sử dụng `strokeWidth`. Vì `class` là một từ dành riêng, nên trong React bạn viết `className`, được đặt tên theo [thuộc tính DOM tương ứng](https://developer.mozilla.org/en-US/docs/Web/API/Element/className):

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```

You can [find all these attributes in the list of DOM component props.](/reference/react-dom/components/common) If you get one wrong, don't worry—React will print a message with a possible correction to the [browser console.](https://developer.mozilla.org/docs/Tools/Browser_Console)
Bạn có thể [tìm tất cả các thuộc tính này trong danh sách các DOM component props.](/reference/react-dom/comComponents/common) Nếu bạn có một thuộc tính sai, đừng lo lắng—React sẽ đưa ra một thông báo có thể sửa lỗi trên [console của trình duyệt.](https://developer.mozilla.org/docs/Tools/Browser_Console)

<Pitfall>

Vì lý do lịch sử, [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) và [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) được viết dưới dạng HTML với dấu gạch ngang.

</Pitfall>

### Pro-tip: Sử dụng Trình chuyển đổi JSX {/*pro-tip-use-a-jsx-converter*/}

Việc chuyển đổi tất cả các thuộc tính này trong giao diện hiện tại có thể rất tẻ nhạt! Chúng tôi khuyên bạn nên sử dụng [trình chuyển đổi](https://transform.tools/html-to-jsx) để dịch HTML và SVG hiện có sang JSX. Các trình chuyển đổi rất hữu ích trong thực tế, nhưng vẫn đáng để hiểu những gì đang diễn ra khi đó bạn có thể viết JSX một cách thoải mái nhất.

Đây là kết quả cuối cùng:​

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="Hedy Lamarr" 
        className="photo" 
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve the spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

* Nhóm React components rendering logic cùng với giao diện vì chúng có liên quan với nhau.
* JSX tương tự như HTML, có một số điểm khác biệt. Bạn có thể sử dụng [bộ chuyển đổi](https://transform.tools/html-to-jsx) nếu cần.
* Thông báo lỗi thường sẽ chỉ cho bạn hướng đi đúng để sửa giao diện của mình.
</Recap>



<Challenges>

#### Chuyển đổi một số HTML sang JSX {/*convert-some-html-to-jsx*/}

HTML này đã được dán vào một component nhưng nó không phải là JSX hợp lệ. Sửa nó:

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
      <br><br>
      <b>And <i>pictures</b></i> of scientists!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

Việc thực hiện bằng tay hay sử dụng công cụ chuyển đổi là tùy thuộc vào bạn!

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br /><br />
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>
