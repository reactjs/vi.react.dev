---
id: accessibility
title: Accessibility
permalink: docs/accessibility.html
---

## Tại sao là Accessibility? {#why-accessibility}

Web accessibility (cũng được đề cập ở đây [**a11y**](https://en.wiktionary.org/wiki/a11y)) là sự thiết kế và tạo dựng website sao cho tất cả mọi người đều có thể sử dụng được. Sự hỗ trợ của Accessibility cho phép các công nghệ hỗ trợ có thể sử dụng trong các trang web.

React hỗ trợ đầy đủ để bạn thực hiện được điều này, bằng cách sử dụng các kỹ thuật HTML chuẩn.

## Tiêu chuẩn và Hướng dẫn {#standards-and-guidelines}

### WCAG {#wcag}

[Hướng dẫn Web Content Accessibility](https://www.w3.org/WAI/intro/wcag) cung cấp hướng dẫn để bạn tạo được những trang web có khả năng truy cập.

Danh sách WCAG sau đây cho bạn một cái nhìn tổng quan:

- [Danh sách WCAG từ Wuhcag](https://www.wuhcag.com/wcag-checklist/)
- [Danh sách WCAG từ WebAIM](http://webaim.org/standards/wcag/checklist)
- [Danh sách từ dự án A11Y](http://a11yproject.com/checklist.html)

### WAI-ARIA {#wai-aria}

[Sáng kiến Web Accessibility - Truy cập trang web giàu ứng dụng](https://www.w3.org/WAI/intro/aria) tài liệu có chứa nhiều kỹ thuật để bạn có thể xây dựng các JavaScript widgets có thể truy cập.

Chú ý rằng tất cả thuộc tính HTML `aria-*` đều được hỗ trợ đầy đủ trong JSX. Trong khi hầu hết DOM properties và thuộc tính trong React là
camelCased, những thuộc tính đó nên được gạch-nối (hay còn gọi là kebab-case, lisp-case, etc) giống như trong HTML thuần:

```javascript{3,4}
<input
  type="text"
  aria-label={labelText}
  aria-required="true"
  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## Tính ngữ nghĩa của HTML {#semantic-html}
Tính ngữ nghĩa của HTML là nền tảng của accessibility trong một ứng dụng web. Sử dụng một số HTML elements để gia cố thêm về mặt ý nghĩa của thông tin trong những websites của chúng ta sẽ thường mang lại accessibility miễn phí.

- [Tham khảo về HTML elements từ MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

Đôi khi chúng ta phá vỡ tính ngữ nghĩa của HTML khi thêm thẻ `<div>` vào JSX để giúp nó hoạt động, đặc biệt khi làm việc với lists (`<ol>`, `<ul>` và `<dl>`) và HTML `<table>`.
Trong những tình huống đó chúng ta nên sử dụng [React Fragments](/docs/fragments.html) để nhóm nhiều elements lại với nhau

Ví dụ,

```javascript{1,5,8}
import React, { Fragment } from 'react';

function ListItem({ item }) {
  return (
    <Fragment>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </Fragment>
  );
}

function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        <ListItem item={item} key={item.id} />
      ))}
    </dl>
  );
}
```

Bạn có thể map một items collection vào một mảng fragments array như cách bạn làm với bất kỳ loại element nào khác:

```javascript{6,9}
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Fragments should also have a `key` prop when mapping collections
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

Khi bạn không cần bất kỳ props nào trong thẻ Fragment, bạn có thể sử dụng [cú pháp rút gọn](/docs/fragments.html#short-syntax), nếu công cụ của bạn có hỗ trợ:

```javascript{3,6}
function ListItem({ item }) {
  return (
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  );
}
```

Tham khảo thêm, truy cập [Tài liệu về Fragments](/docs/fragments.html).

## Accessible Forms {#accessible-forms}

### Labeling {#labeling}
Mỗi HTML form control, như `<input>` và `<textarea>`, cần được dán nhãn accessibly. Chúng ta cần cung cấp những labels có tính mô tả, nó sẽ giúp tiếp cận tốt hơn đến người đọc.

Những nguồn sau đây cho chúng ta thấy cách thực hiện điều đó:

- [W3C hướng dẫn cách label elements](https://www.w3.org/WAI/tutorials/forms/labels/)
- [WebAIM hướng dẫn cách label elements](http://webaim.org/techniques/forms/controls)
- [The Paciello Group giải thích accessible names](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

Mặc dù HTML tiêu chuẩn có thể sử dụng được trong React, tuy nhiên chú ý rằng thuộc tính `for` phải được viết thành `htmlFor` trong JSX:

```javascript{1}
<label htmlFor="namedInput">Name:</label>
<input id="namedInput" type="text" name="name"/>
```

### Thông báo lỗi đến người dùng  {#notifying-the-user-of-errors}

User luôn cần được cung cấp thông tin về các tình huống lỗi. Đường dẫn sau đây cho chúng ta thấy cách đưa text error đến người dùng:

- [W3C giải thích user notifications](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [WebAIM phân tích form validation](http://webaim.org/techniques/formvalidation/)

## Focus Control {#focus-control}

Hãy chắc chắn rằng ứng dụng web của bạn có thể hoạt động tốt khi chỉ cần sử dụng bàn phím:

- [WebAIM nói về tính accesibility của bàn phím](http://webaim.org/techniques/keyboard/)

### Keyboard focus and focus outline {#keyboard-focus-and-focus-outline}

Keyboard focus là việc hiển thị element hiện tại trong DOM đang được select bằng cách sử dụng bàn phím. Chúng ta thấy chúng ở mọi nơi ví dụ như hình dưới đây:

<img src="../images/docs/keyboard-focus.png" alt="Blue keyboard focus outline around a selected link." />

Chỉ khi sử dụng CSS mới có thể remove outline này, ví dụ như chỉnh `outline: 0`,nếu bạn muốn thay thế nó với một focus outline khác.

### Cơ chế skip đến nội dung mong muốn {#mechanisms-to-skip-to-desired-content}

Bạn nên cung cấp một cơ chế nào đó cho phép users bỏ qua điều hướng trước đó trong ứng dụng của bạn, cũng là để tăng tốc điều hướng từ bàn phím.

Skiplinks hay Skip Navigation Links là những link điều hướng ẩn chỉ hiển thị khi bàn phím của người dùng tương tác đến trang web. Chúng rất dễ implement với internal page anchors và một ít styling:

- [WebAIM - Skip Navigation Links](http://webaim.org/techniques/skipnav/)

Cũng sử dụng landmark elements và roles, như `<main>` và `<aside>`, để phân vùng trang web như công nghệ hỗ trợ cho phép người dùng điều hướng những sections đó một cách nhanh chóng.

Đọc thêm về cách sử dụng những elements đó để tăng cường accessibility ở đây:

- [Accessible Landmarks](http://www.scottohara.me/blog/2018/03/03/landmarks.html)

### Quản lý focus theo kế hoạch {#programmatically-managing-focus}

Ứng dụng React của chúng ta liên tục điều chỉnh HTML DOM trong runtime, vì vậy đôi khi bàn phím khiến chúng ta mất focus hay bị set vào một element không ngờ tới. Để khắc phục vấn đề này, chúng ta cần lập trình để focus bằng bàn phím đúng hướng. Ví dụ, bằng cách reset keyboard focus vào một button đã mở một cửa sổ modal sau khi cửa sổ modal đó đã được đóng.

Tài liệu từ trang web MDN phân tích và mô tả cách chúng ta xây dưng [keyboard-navigable JavaScript widgets](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets).

Để set focus trong React, chúng ta có thể sử dụng [Refs to DOM elements](/docs/refs-and-the-dom.html).

Sử dụng nó, chúng ta đầu tiên tạo một ref đến một element trong JSX của một component class:

```javascript{4-5,8-9,13}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // Tạo một ref để lưu textInput của DOM element
    this.textInput = React.createRef();
  }
  render() {
  // Sử dụng `ref` callback để lưu một reference đến text input trong DOM
  // element trong một instance field (ví dụ, this.textInput).
    return (
      <input
        type="text"
        ref={this.textInput}
      />
    );
  }
}
```

Sau đó chúng ta có thể focus nó ở nơi khác trong component khi cần:

 ```javascript
 focus() {
   // Focus đoạn tẽt input một cách rõ ràng bằng cách sử dụng DOM API nguyên bản
   // Note: chúng ta đang truy cập "current" để lấy the DOM node
   this.textInput.current.focus();
 }
 ```

Đôi khi một component cha cần được set focus vào một element trong component con. Chúng ta có thể thực hiện bằng cách [exposing DOM refs to parent components](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components)
thông qua một prop đặc biệt ở component con để chuyển tiếp ref của component cha đến DOM node của component con.

```javascript{4,12,16}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <CustomTextInput inputRef={this.inputElement} />
    );
  }
}

// Bây giờ bạn có thể set focus khi cần thiết.
this.inputElement.current.focus();
```

Khi sử dụng HOC để mở rộng components, [chuyển tiếp ref](/docs/forwarding-refs.html) được khuyên dùng để bao bọc component sử dụng `forwardRef` function của React. Nếu một third party HOC không implement ref forwarding, pattern bên trên vẫn có thể sử dụng như một fallback.

Một ví dụ về cách quản lý focus tốt là [react-aria-modal](https://github.com/davidtheclark/react-aria-modal). Đây là một ví dụ tương đối hiếm hoi nói về một cửa sổ modal có thể truy cập hoàn toàn. Nó không chỉ set focus ban đầu vào nút cancel (ngăn chặn người dùng không vô tình dùng bàn phím kích hoạt success action) và khóa focus từ bàn phím vào bên trong modal, nó cũng reset focus về lại element đã kích hoạt modal đó lúc ban đầu.

>Chú ý:
>
>Đây là một accessibility feature rất quan trọng, nó cũng là một kỹ thuật nên được sử dụng một cách không ngoan. Dùng nó để sửa chữa keyboard focus flow khi bị xáo trộn, không nên cố gắng dự đoán cách người dùng sử dụng ứng dụng.

## Sự kiện Chuột và con trỏ {#mouse-and-pointer-events}

Hãy chắc chắn rằng tất cả chức năng được sử dụng thông qua con trỏ chuột hoặc pointer event cũng có thể cũng được truy cập chỉ bằng cách sử dụng bàn phím. Chỉ dựa vào thiết bị pointer sẽ dấn đến nhiều trường hợp mà bàn phím của người dùng không thể sử dụng ứng dụng của bạn.

Để minh họa vấn đề này, hãy nhìn vào một ví dụ liên quan đến việc accessibility bị vỡ do click events. Bên ngoài click pattern, nơi một user có thể vô hiệu hóa một popover đã đươc mở bằng cách click bên ngoài element.

<img src="../images/docs/outerclick-with-mouse.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with a mouse showing that the close action works." />

Đây là một cách implement thường thấy bằng cách gán một sự kiện `click` vào `windows` object mà nó dùng để đóng popover:

```javascript{12-14,26-30}
class OuterClickExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.toggleContainer = React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  onClickOutsideHandler(event) {
    if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <div ref={this.toggleContainer}>
        <button onClick={this.onClickHandler}>Select an option</button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

Điều này có thể hoạt động tốt cho người dùng với những thiết bị pointer, như chuột, nhưng thao tác nó với chỉ bàn phím sẽ khiến chức năng bị hư hỏng khi tab sang element tiếp theo `window` object không bao giờ nhận một sự kiện `click`.. Điều này có thể dẫn tới chức năng bị vô nghĩa khiến user không thể sử dụng ứng dụng của bạn.

<img src="../images/docs/outerclick-with-keyboard.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with the keyboard showing the popover not being closed on blur and it obscuring other screen elements." />

Chúng ta cũng có thể đạt được chức năng tương tự bằng cách sử dụng những event handlers thích hợp, như `onBlur` và `onFocus`:

```javascript{19-29,31-34,37-38,40-41}
class BlurExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.timeOutId = null;

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
    this.onFocusHandler = this.onFocusHandler.bind(this);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  // Chúng ta đóng popover trong tick tiếp theo bằng setTimeout.
  // Điều này là cần thiết bởi vì chúng ta cần kiểm tra trước xem nếu
  // con của element khác có nhận được focus như
  // blur event kích hoạt trước focus event mới.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // Nếu một component con nhận được focus, không được đóng popover.
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // React hỗ trợ chúng ta bằng cách bubbling blur và
    // những sự kiện focus vào component cha.
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Select an option
        </button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

Đoạn code cho thấy chức năng của cả con trỏ và bàn phím của người dùng. Cũng lưu ý rằng thêm thuộc tính `aria-*` vào để hỗ trợ người dùng. Đơn giãn hơn là để sự kiện bàn phím cho phép `arrow key` tương tác với tùy chọn popover chưa được implement.

<img src="../images/docs/blur-popover-close.gif" alt="A popover list correctly closing for both mouse and keyboard users." />

Đây là một ví dụ điển hình khi chỉ phụ thuộc vào con trỏ và sự kiện từ chuột sẽ làm hỏng chức năng cho người dùng bàn phím. Luôn luôn test với bàn phím sẽ ngay lập tức phát hiện được những khu vực có vấn đề, sau đó có thể sửa bằng cách dùng những handler để nhận input từ bàn phím.

## Những Widgets phức tạp hơn {#more-complex-widgets}

Trải nghiệm người dùng phức tạp không nên khiến mức độ accessibilty bị giảm đi. Trong khi đó accessibility dễ đạt được nhất bằng cách code sát với HTML nhất có thể, ngay cả với widget phức tạp nhất.

Ở đây chúng ta cần kiến thức từ [ARIA Roles](https://www.w3.org/TR/wai-aria/#roles) cũng như [ARIA States and Properties](https://www.w3.org/TR/wai-aria/#states_and_properties).
Đây là những công cụ có sẵn những thuộc tính HTML đã được hỗ trợ đầy đủ trong JSX và cho phép chúng ta xây dựng một trang web accessibility đầy đủ, những React component có chức năng cao cấp.

Môi loại widget có một design pattern riêng và đáp ứng chức năng nhất định bởi người dùng như:

- [WAI-ARIA Authoring Practices - Design Patterns and Widgets](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [Heydon Pickering - ARIA Examples](https://heydonworks.com/article/practical-aria-examples/)
- [Inclusive Components](https://inclusive-components.design/)

## Những điểm khác cần lưu ý {#other-points-for-consideration}

### Cài đặt ngôn ngữ {#setting-the-language}

Biểu thị ngôn ngữ của những đoạn văn bản giúp phần mềm cài đặt đúng loại voice:

- [WebAIM - Document Language](http://webaim.org/techniques/screenreader/#language)

### Cài đặt title cho document {#setting-the-document-title}

Set `<title>` cho đoạn văn bản để mô tả nội dung của trang hiện tại, điều này giúp chắc chắn rằng người dùng nắm được nội dung mà họ đang đọc:

- [WCAG - Understanding the Document Title Requirement](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

Chúng ta có thể set nó trong React bằng cách sử dụng [React Document Title Component](https://github.com/gaearon/react-document-title).

### Độ tương phản màu sắc {#color-contrast}

Hãy chắc chắn rằng tất cả đoạn text trong website của bạn có đủ độ tương phản màu sắc nhằm duy trì tối đa khả năng đọc của người dùng trong điều kiện thị lực kém:

- [WCAG - Hiểu yêu cầu của độ tương phản màu sắc](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [Tất cả mọi thứ về độ tương phản màu sắc và tại sao chúng ta phải suy nghĩ lại về nó](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [A11yProject - Độ tương phản màu sắc là gì](http://a11yproject.com/posts/what-is-color-contrast/)

Thật tẻ nhạt khi phải tính toán màu sắc thủ công cho tất cả trường hợp trong website của bạn, thay vào đó, bạn có thể [tính toán tất cả màu sắc bằng Colorable](https://jxnblk.com/colorable/).

Cả 2 công cụ aXe và WAVE được đề cập bên dưới đều bao gồm bộ tests kiểm tra độ tương phản màu sắc, chúng sẽ báo cáo những lỗi liên quan.

Nếu bạn muốn mở rộng khả năng kiểm tra độ tương phản, bạn có thể sử dụng những công cụ dưới đây:

- [WebAIM - Kiểm tra độ tương phản màu sắc](http://webaim.org/resources/contrastchecker/)
- [The Paciello Group - Phân tích độ tương phản màu sắc](https://www.paciellogroup.com/resources/contrastanalyser/)

## Các công cụ để phát triển và kiểm tra {#development-and-testing-tools}

Có rất nhiều công cụ chúng ta có thể sử dụng để hỗ trợ trong việc tạo dựng accessibility của ứng dụng web.

### Bàn phím {#the-keyboard}

Cho đến thời điểm hiện tại, cách dễ nhất và cũng là một trong những điều quan trọng nhất là kiểm tra toàn bộ trang web của bạn có thể tương tác và sử dụng được chỉ bằng bàn phím hay không. Chúng ta thực hiện điều này bằng cách:

1. Tháo chuột của bạn ra khỏi máy tính.
2. Sử dụng `Tab` và `Shift+Tab` để duyệt web.
3. Sử dụng `Enter` để tương tác với những phần tử trong trang web.
4. Ở những nơi yêu cầu, sử dụng phím mũi tên để tương tác với một số phần tử, như menu và dropdown.

### Sự hỗ trợ phát triển {#development-assistance}

Chúng ta có thể kiểm tra một số chức năng accessibility trực tiếp trong code JSX. Thường thì bộ kiểm tra intellisense sẽ được cung cấp sẵn trong IDE cho những vai trò ARIA, states và properties. Chúng ta cũng có thể truy cập bằng những công cụ dưới đây:

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

[eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) plugin cho ESLint cung cấp AST phản hồi AST về những vấn đề liên quan đến accessibility trong JSX của bạn. Nhiều IDE's cho phép bạn tích hợp trực tiếp vào code analysis và source code windows.

[Create React App](https://github.com/facebookincubator/create-react-app) plugin này với một tập hợp về những quy tắc kích hoạt. Nếu bạn muốn cho phép quy tắc accessibility hơn nữa, bạn có thể tạo một `.eslintrc` file trong root của project bằng nội dung sau đây:

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### Kiểm tra accessibility trong trình duyệt {#testing-accessibility-in-the-browser}

Một số công cụ có thể chạy audit accessibility tren trang web trong trình duyệt của bạn. Hãy dùng chúng phối hợp với những công cụ kiểm tra đã được nhắc tới ở đây, bởi vì chúng chỉ có thể kiểm tra accessibility về mặt kỹ thuật.

#### aXe, aXe-core và react-axe {#axe-axe-core-and-react-axe}

Hệ thống Deque cho phép [aXe-core](https://github.com/dequelabs/axe-core) tự động kiểm tra end-to-end ứng dụng của bạn. Module này bao gồm những sự tích hợp cho Selenium.

[The Accessibility Engine](https://www.deque.com/products/axe/) hoặc aXe, là một extension accessibility inspector tích hợp sẵn trong `aXe-core`.

Bạn cũng có thể sử dụng [react-axe](https://github.com/dylanb/react-axe) module để report những phát hiện về accessibility trực tiếp khi đang develope và debug.

#### WebAIM WAVE {#webaim-wave}

[Web Accessibility Evaluation Tool](http://wave.webaim.org/extension/) là một extension khác.

#### Accessibility inspectors và the Accessibility Tree {#accessibility-inspectors-and-the-accessibility-tree}

[The Accessibility Tree](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) là một tập hợp DOM trê có chứa những accessible object cho từng DOM element mà chúng nên được cung cấp cho công nghệ hiện đại như screen readers.

Ở một số trình duyệt, chúng ta có thể dễ dàng xem thông tin về accessibility cho từng element trong accessibility tree:

- [Việc sử dụng Accessibility Inspector trong Firefox](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [Việc sử dụng Accessibility Inspector trong Chrome](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference#pane)
- [Việc sử dụng Accessibility Inspector trong OS X Safari](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### Screen readers {#screen-readers}

Testing với một screen reader nên được xem như một phần của quá trình kiểm tra accessibility.

Vui lòng lưu ý rằng sự kết hợp browser / screen reader là quan trọng. Bạn nên test ứng dụng của mình bằng trình duyệt phù hợp nhất cho screen reader của bạn.

### Các Screen Readers thông dụng {#commonly-used-screen-readers}

#### NVDA trong Firefox {#nvda-in-firefox}

[NonVisual Desktop Access](https://www.nvaccess.org/) hoặc NVDA là một Windows screen reader mã nguồn mở được sử dụng rộng rãi.

Xem hướng dẫn bên dưới để biết cách dùng NVDA hiệu quả nhất:

- [WebAIM - Sử dụng NVDA để đánh giá Web Accessibility](http://webaim.org/articles/nvda/)
- [Deque - Các phím tắt của bàn phím NVDA](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### VoiceOver trong Safari {#voiceover-in-safari}

VoiceOver là một screen reader được tích hợp sẵn trong những thiết bị của Apple.

Xem hướng dẫn sau đây để biết cách kích hoạt và sử dụng VoiceOver:

- [WebAIM - Sử dụng VoiceOver để đánh giá Web Accessibility](http://webaim.org/articles/voiceover/)
- [Deque - VoiceOver cho OS X Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque - VoiceOver cho iOS Shortcuts](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### JAWS trong Internet Explorer {#jaws-in-internet-explorer}

[Job Access With Speech](http://www.freedomscientific.com/Products/Blindness/JAWS) hoặc JAWS, là một screen reader được dùng hiệu quả trên Windows.

Xem hướng dẫn bên dưới để biết cách dùng JAWS hiệu quả nhất:

- [WebAIM - Sử dụng JAWS để đánh giá Web Accessibility](http://webaim.org/articles/jaws/)
- [Deque - JAWS Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### Screen Readers khác {#other-screen-readers}

#### ChromeVox trong Google Chrome {#chromevox-in-google-chrome}

[ChromeVox](http://www.chromevox.com/) ilà một screen reader được tích hợp sẵn trên Chromebooks và được xem [như một extension](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) cho Google Chrome.

Xem hướng dẫn bên dưới để biết cách dùng ChromeVox hiệu quả nhất:

- [Google Chromebook Help - Sử dụng Built-in Screen Reader](https://support.google.com/chromebook/answer/7031755?hl=en)
- [ChromeVox Classic Keyboard Shortcuts Reference](http://www.chromevox.com/keyboard_shortcuts.html)
