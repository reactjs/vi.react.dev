---
title: "<input>"
---

<Intro>

[Component `<input>` tích hợp sẵn của trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) cho phép bạn render các loại input form khác nhau.

```js
<input />
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<input>` {/*input*/}

Để hiển thị một input, render component `<input>` tích hợp sẵn của trình duyệt.

```js
<input name="myInput" />
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<input>` hỗ trợ tất cả [các props phần tử thông thường.](/reference/react-dom/components/common#props)

- [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): Một chuỗi hoặc một hàm. Ghi đè `<form action>` của phần tử cha cho `type="submit"` và `type="image"`. Khi một URL được truyền cho `action`, form sẽ hoạt động như một form HTML tiêu chuẩn. Khi một hàm được truyền cho `formAction`, hàm đó sẽ xử lý việc gửi form. Xem [`<form action>`](/reference/react-dom/components/form#props).

Bạn có thể [làm cho một input được kiểm soát](#controlling-an-input-with-a-state-variable) bằng cách truyền một trong các props sau:

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): Một boolean. Đối với một input checkbox hoặc một radio button, kiểm soát xem nó có được chọn hay không.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): Một chuỗi. Đối với một input văn bản, kiểm soát văn bản của nó. (Đối với một radio button, chỉ định dữ liệu form của nó.)

Khi bạn truyền một trong hai prop này, bạn cũng phải truyền một trình xử lý `onChange` để cập nhật giá trị đã truyền.

Các props `<input>` này chỉ liên quan đến các input không được kiểm soát:

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): Một boolean. Chỉ định [giá trị ban đầu](#providing-an-initial-value-for-an-input) cho các input `type="checkbox"` và `type="radio"`.
* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): Một chuỗi. Chỉ định [giá trị ban đầu](#providing-an-initial-value-for-an-input) cho một input văn bản.

Các props `<input>` này có liên quan đến cả input được kiểm soát và không được kiểm soát:

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): Một chuỗi. Chỉ định loại file nào được chấp nhận bởi một input `type="file"`.
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): Một chuỗi. Chỉ định văn bản thay thế hình ảnh cho một input `type="image"`.
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): Một chuỗi. Chỉ định phương tiện (microphone, video hoặc camera) được chụp bởi một input `type="file"`.
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): Một chuỗi. Chỉ định một trong các [hành vi autocomplete có thể.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): Một boolean. Nếu `true`, React sẽ focus phần tử khi mount.
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): Một chuỗi. Chỉ định tên trường form cho hướng của phần tử.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): Một boolean. Nếu `true`, input sẽ không tương tác được và sẽ xuất hiện màu xám.
* `children`: `<input>` không chấp nhận children.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): Một chuỗi. Chỉ định `id` của `<form>` mà input này thuộc về. Nếu bị bỏ qua, nó là form cha gần nhất.
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): Một chuỗi. Ghi đè `<form action>` của phần tử cha cho `type="submit"` và `type="image"`.
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): Một chuỗi. Ghi đè `<form enctype>` của phần tử cha cho `type="submit"` và `type="image"`.
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): Một chuỗi. Ghi đè `<form method>` của phần tử cha cho `type="submit"` và `type="image"`.
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): Một chuỗi. Ghi đè `<form noValidate>` của phần tử cha cho `type="submit"` và `type="image"`.
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): Một chuỗi. Ghi đè `<form target>` của phần tử cha cho `type="submit"` và `type="image"`.
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): Một chuỗi. Chỉ định chiều cao hình ảnh cho `type="image"`.
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): Một chuỗi. Chỉ định `id` của `<datalist>` với các tùy chọn autocomplete.
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): Một số. Chỉ định giá trị tối đa của các input số và ngày giờ.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): Một số. Chỉ định độ dài tối đa của văn bản và các input khác.
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): Một số. Chỉ định giá trị tối thiểu của các input số và ngày giờ.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): Một số. Chỉ định độ dài tối thiểu của văn bản và các input khác.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): Một boolean. Chỉ định xem nhiều giá trị có được phép cho `<type="file"` và `type="email"` hay không.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): Một chuỗi. Chỉ định tên cho input này được [gửi cùng với form.](#reading-the-input-values-when-submitting-a-form)
* `onChange`: Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Bắt buộc đối với [các input được kiểm soát.](#controlling-an-input-with-a-state-variable) Kích hoạt ngay lập tức khi giá trị của input bị thay đổi bởi người dùng (ví dụ: nó kích hoạt trên mỗi lần gõ phím). Hoạt động giống như sự kiện [`input` của trình duyệt.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Một phiên bản của `onChange` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Kích hoạt ngay lập tức khi giá trị bị thay đổi bởi người dùng. Vì lý do lịch sử, trong React, thành ngữ là sử dụng `onChange` thay thế, hoạt động tương tự.
* `onInputCapture`: Một phiên bản của `onInput` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Kích hoạt nếu một input không vượt qua xác thực khi gửi form. Không giống như sự kiện `invalid` tích hợp, sự kiện `onInvalid` của React nổi bọt.
* `onInvalidCapture`: Một phiên bản của `onInvalid` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Kích hoạt sau khi lựa chọn bên trong `<input>` thay đổi. React mở rộng sự kiện `onSelect` để cũng kích hoạt cho lựa chọn trống và khi chỉnh sửa (có thể ảnh hưởng đến lựa chọn).
* `onSelectCapture`: Một phiên bản của `onSelect` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): Một chuỗi. Chỉ định pattern mà `value` phải khớp.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): Một chuỗi. Được hiển thị bằng màu mờ khi giá trị input trống.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): Một boolean. Nếu `true`, input không thể chỉnh sửa được bởi người dùng.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): Một boolean. Nếu `true`, giá trị phải được cung cấp để form được gửi.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): Một số. Tương tự như cài đặt width, nhưng đơn vị phụ thuộc vào control.
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): Một chuỗi. Chỉ định nguồn hình ảnh cho một input `type="image"`.
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): Một số dương hoặc một chuỗi `'any'`. Chỉ định khoảng cách giữa các giá trị hợp lệ.
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): Một chuỗi. Một trong các [loại input.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width):  Một chuỗi. Chỉ định chiều rộng hình ảnh cho một input `type="image"`.

#### Lưu ý {/*caveats*/}

- Checkbox cần `checked` (hoặc `defaultChecked`), không phải `value` (hoặc `defaultValue`).
- Nếu một input văn bản nhận được một prop `value` kiểu chuỗi, nó sẽ được [xử lý như được kiểm soát.](#controlling-an-input-with-a-state-variable)
- Nếu một checkbox hoặc một radio button nhận được một prop `checked` kiểu boolean, nó sẽ được [xử lý như được kiểm soát.](#controlling-an-input-with-a-state-variable)
- Một input không thể vừa được kiểm soát vừa không được kiểm soát cùng một lúc.
- Một input không thể chuyển đổi giữa việc được kiểm soát hoặc không được kiểm soát trong suốt vòng đời của nó.
- Mọi input được kiểm soát cần một trình xử lý sự kiện `onChange` để đồng bộ cập nhật giá trị backing của nó.

---

## Cách sử dụng {/*usage*/}

### Hiển thị các input thuộc các loại khác nhau {/*displaying-inputs-of-different-types*/}

Để hiển thị một input, render một component `<input>`. Theo mặc định, nó sẽ là một input văn bản. Bạn có thể truyền `type="checkbox"` cho một checkbox, `type="radio"` cho một radio button, [hoặc một trong các loại input khác.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Cung cấp một label cho một input {/*providing-a-label-for-an-input*/}

Thông thường, bạn sẽ đặt mọi `<input>` bên trong một thẻ [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). Điều này cho trình duyệt biết rằng label này được liên kết với input đó. Khi người dùng nhấp vào label, trình duyệt sẽ tự động focus vào input. Nó cũng rất cần thiết cho khả năng truy cập: một trình đọc màn hình sẽ thông báo caption của label khi người dùng focus vào input được liên kết.

Nếu bạn không thể lồng `<input>` vào một `<label>`, hãy liên kết chúng bằng cách truyền cùng một ID cho `<input id>` và [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Để tránh xung đột giữa nhiều instance của một component, hãy tạo một ID như vậy bằng [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Your first name:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Your age:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Cung cấp một giá trị ban đầu cho một input {/*providing-an-initial-value-for-an-input*/}

Bạn có thể tùy chọn chỉ định giá trị ban đầu cho bất kỳ input nào. Truyền nó dưới dạng chuỗi `defaultValue` cho các input văn bản. Checkbox và radio button nên chỉ định giá trị ban đầu bằng boolean `defaultChecked` thay thế.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true} 
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Đọc các giá trị input khi gửi form {/*reading-the-input-values-when-submitting-a-form*/}

Thêm một [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) xung quanh các input của bạn với một [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) bên trong. Nó sẽ gọi trình xử lý sự kiện `<form onSubmit>` của bạn. Theo mặc định, trình duyệt sẽ gửi dữ liệu form đến URL hiện tại và làm mới trang. Bạn có thể ghi đè hành vi đó bằng cách gọi `e.preventDefault()`. Đọc dữ liệu form bằng [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function MyForm() {
  function handleSubmit(e) {
    // Ngăn trình duyệt tải lại trang
    e.preventDefault();

    // Đọc dữ liệu form
    const form = e.target;
    const formData = new FormData(form);

    // Bạn có thể truyền formData làm body fetch trực tiếp:
    fetch('/some-api', { method: form.method, body: formData });

    // Hoặc bạn có thể làm việc với nó như một đối tượng thuần túy:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Option 3</label>
      </p>
      <hr />
      <button type="reset">Reset form</button>
      <button type="submit">Submit form</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

Đặt một `name` cho mỗi `<input>`, ví dụ: `<input name="firstName" defaultValue="Taylor" />`. `name` bạn đã chỉ định sẽ được sử dụng làm key trong dữ liệu form, ví dụ: `{ firstName: "Taylor" }`.

</Note>

<Pitfall>

Theo mặc định, một `<button>` bên trong một `<form>` mà không có thuộc tính `type` sẽ gửi nó. Điều này có thể gây ngạc nhiên! Nếu bạn có component React `Button` tùy chỉnh của riêng mình, hãy cân nhắc sử dụng [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) thay vì `<button>` (không có type). Sau đó, để rõ ràng, hãy sử dụng `<button type="submit">` cho các button *có* nhiệm vụ gửi form.

</Pitfall>

---

### Kiểm soát một input bằng một biến trạng thái {/*controlling-an-input-with-a-state-variable*/}

Một input như `<input />` là *không được kiểm soát.* Ngay cả khi bạn [truyền một giá trị ban đầu](#providing-an-initial-value-for-an-input) như `<input defaultValue="Initial text" />`, JSX của bạn chỉ chỉ định giá trị ban đầu. Nó không kiểm soát giá trị nên là gì ngay bây giờ.

**Để render một input _được kiểm soát_, hãy truyền prop `value` cho nó (hoặc `checked` cho checkbox và radio).** React sẽ buộc input luôn có `value` mà bạn đã truyền. Thông thường, bạn sẽ làm điều này bằng cách khai báo một [biến trạng thái:](/reference/react/useState)

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // Khai báo một biến trạng thái...
  // ...
  return (
    <input
      value={firstName} // ...buộc giá trị của input khớp với biến trạng thái...
      onChange={e => setFirstName(e.target.value)} // ...và cập nhật biến trạng thái trên mọi chỉnh sửa!
    />
  );
}
```

Một input được kiểm soát có ý nghĩa nếu bạn cần trạng thái anyway--ví dụ: để re-render UI của bạn trên mọi chỉnh sửa:

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Your name is {firstName}.</p>}
      ...
```

Nó cũng hữu ích nếu bạn muốn cung cấp nhiều cách để điều chỉnh trạng thái input (ví dụ: bằng cách nhấp vào một button):

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
```

`value` bạn truyền cho các component được kiểm soát không được là `undefined` hoặc `null`. Nếu bạn cần giá trị ban đầu là trống (chẳng hạn như với trường `firstName` bên dưới), hãy khởi tạo biến trạng thái của bạn thành một chuỗi trống (`''`).

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        First name:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
      </label>
      {firstName !== '' &&
        <p>Your name is {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Your age is {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**Nếu bạn truyền `value` mà không có `onChange`, sẽ không thể nhập vào input.** Khi bạn kiểm soát một input bằng cách truyền một số `value` cho nó, bạn *buộc* nó luôn có giá trị bạn đã truyền. Vì vậy, nếu bạn truyền một biến trạng thái làm `value` nhưng quên cập nhật biến trạng thái đó một cách đồng bộ trong trình xử lý sự kiện `onChange`, React sẽ hoàn nguyên input sau mỗi lần gõ phím trở lại `value` mà bạn đã chỉ định.

</Pitfall>

---

### Tối ưu hóa re-rendering trên mỗi lần gõ phím {/*optimizing-re-rendering-on-every-keystroke*/}

Khi bạn sử dụng một input được kiểm soát, bạn đặt trạng thái trên mỗi lần gõ phím. Nếu component chứa trạng thái của bạn re-render một cây lớn, điều này có thể trở nên chậm. Có một vài cách bạn có thể tối ưu hóa hiệu suất re-rendering.

Ví dụ: giả sử bạn bắt đầu với một form re-render tất cả nội dung trang trên mỗi lần gõ phím:

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

Vì `<PageContent />` không dựa vào trạng thái input, bạn có thể di chuyển trạng thái input vào component riêng của nó:

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

Điều này cải thiện đáng kể hiệu suất vì bây giờ chỉ `SignupForm` re-render trên mỗi lần gõ phím.

Nếu không có cách nào để tránh re-rendering (ví dụ: nếu `PageContent` phụ thuộc vào giá trị của input tìm kiếm), [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) cho phép bạn giữ cho input được kiểm soát phản hồi ngay cả ở giữa một re-render lớn.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Input văn bản của tôi không cập nhật khi tôi nhập vào nó {/*my-text-input-doesnt-update-when-i-type-into-it*/}

Nếu bạn render một input với `value` nhưng không có `onChange`, bạn sẽ thấy một lỗi trong console:

```js
// 🔴 Lỗi: input văn bản được kiểm soát không có trình xử lý onChange
<input value={something} />
```

<ConsoleBlock level="error">

Bạn đã cung cấp một prop `value` cho một trường form mà không có trình xử lý `onChange`. Điều này sẽ render một trường chỉ đọc. Nếu trường nên có thể thay đổi, hãy sử dụng `defaultValue`. Nếu không, hãy đặt `onChange` hoặc `readOnly`.

</ConsoleBlock>

Như thông báo lỗi gợi ý, nếu bạn chỉ muốn [chỉ định giá trị *ban đầu*,](#providing-an-initial-value-for-an-input) hãy truyền `defaultValue` thay thế:

```js
// ✅ Tốt: input không được kiểm soát với một giá trị ban đầu
<input defaultValue={something} />
```

Nếu bạn muốn [kiểm soát input này bằng một biến trạng thái,](#controlling-an-input-with-a-state-variable) hãy chỉ định một trình xử lý `onChange`:

```js
// ✅ Tốt: input được kiểm soát với onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

Nếu giá trị cố ý chỉ đọc, hãy thêm một prop `readOnly` để ngăn chặn lỗi:

```js
// ✅ Tốt: input được kiểm soát chỉ đọc không có on change
<input value={something} readOnly={true} />
```

---

### Checkbox của tôi không cập nhật khi tôi nhấp vào nó {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

Nếu bạn render một checkbox với `checked` nhưng không có `onChange`, bạn sẽ thấy một lỗi trong console:

```js
// 🔴 Lỗi: checkbox được kiểm soát không có trình xử lý onChange
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

Bạn đã cung cấp một prop `checked` cho một trường form mà không có trình xử lý `onChange`. Điều này sẽ render một trường chỉ đọc. Nếu trường nên có thể thay đổi, hãy sử dụng `defaultChecked`. Nếu không, hãy đặt `onChange` hoặc `readOnly`.

</ConsoleBlock>

Như thông báo lỗi gợi ý, nếu bạn chỉ muốn [chỉ định giá trị *ban đầu*,](#providing-an-initial-value-for-an-input) hãy truyền `defaultChecked` thay thế:

```js
// ✅ Tốt: checkbox không được kiểm soát với một giá trị ban đầu
<input type="checkbox" defaultChecked={something} />
```

Nếu bạn muốn [kiểm soát checkbox này bằng một biến trạng thái,](#controlling-an-input-with-a-state-variable) hãy chỉ định một trình xử lý `onChange`:

```js
// ✅ Tốt: checkbox được kiểm soát với onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

Bạn cần đọc `e.target.checked` thay vì `e.target.value` cho checkbox.

</Pitfall>

Nếu checkbox cố ý chỉ đọc, hãy thêm một prop `readOnly` để ngăn chặn lỗi:

```js
// ✅ Tốt: input được kiểm soát chỉ đọc không có on change
<input type="checkbox" checked={something} readOnly={true} />
```

---

### Caret input của tôi nhảy về đầu trên mỗi lần gõ phím {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

Nếu bạn [kiểm soát một input,](#controlling-an-input-with-a-state-variable) bạn phải cập nhật biến trạng thái của nó thành giá trị của input từ DOM trong `onChange`.

Bạn không thể cập nhật nó thành một thứ khác ngoài `e.target.value` (hoặc `e.target.checked` cho checkbox):

```js
function handleChange(e) {
  // 🔴 Lỗi: cập nhật một input thành một thứ khác ngoài e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Bạn cũng không thể cập nhật nó một cách không đồng bộ:

```js
function handleChange(e) {
  // 🔴 Lỗi: cập nhật một input một cách không đồng bộ
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Để sửa mã của bạn, hãy cập nhật nó một cách đồng bộ thành `e.target.value`:

```js
function handleChange(e) {
  // ✅ Cập nhật một input được kiểm soát thành e.target.value một cách đồng bộ
  setFirstName(e.target.value);
}
```

Nếu điều này không khắc phục được sự cố, có thể input bị xóa và thêm lại từ DOM trên mỗi lần gõ phím. Điều này có thể xảy ra nếu bạn vô tình [đặt lại trạng thái](/learn/preserving-and-resetting-state) trên mỗi lần re-render, ví dụ: nếu input hoặc một trong các phần tử cha của nó luôn nhận một thuộc tính `key` khác nhau, hoặc nếu bạn lồng các định nghĩa hàm component (điều này không được hỗ trợ và khiến component "bên trong" luôn được coi là một cây khác).

---

### Tôi đang gặp lỗi: "Một component đang thay đổi một input không được kiểm soát thành được kiểm soát" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Nếu bạn cung cấp một `value` cho component, nó phải duy trì là một chuỗi trong suốt vòng đời của nó.

Bạn không thể truyền `value={undefined}` trước và sau đó truyền `value="some string"` vì React sẽ không biết bạn muốn component không được kiểm soát hay được kiểm soát. Một component được kiểm soát phải luôn nhận một `value` kiểu chuỗi, không phải `null` hoặc `undefined`.

Nếu `value` của bạn đến từ một API hoặc một biến trạng thái, nó có thể được khởi tạo thành `null` hoặc `undefined`. Trong trường hợp đó, hãy đặt nó thành một chuỗi trống (`''`) ban đầu, hoặc truyền `value={someValue ?? ''}` để đảm bảo `value` là một chuỗi.

Tương tự, nếu bạn truyền `checked` cho một checkbox, hãy đảm bảo nó luôn là một boolean.
