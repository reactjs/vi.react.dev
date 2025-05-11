---
title: "<select>"
---

<Intro>

[Thành phần `<select>` dựng sẵn của trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) cho phép bạn hiển thị một hộp chọn với các tùy chọn.

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<select>` {/*select*/}

Để hiển thị hộp chọn, hãy hiển thị thành phần [`<select>` dựng sẵn của trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<select>` hỗ trợ tất cả [các props phần tử thông thường.](/reference/react-dom/components/common#props)

Bạn có thể [tạo một hộp chọn được kiểm soát](#controlling-a-select-box-with-a-state-variable) bằng cách truyền một prop `value`:

* `value`: Một chuỗi (hoặc một mảng các chuỗi cho [`multiple={true}`](#enabling-multiple-selection)). Kiểm soát tùy chọn nào được chọn. Mỗi chuỗi giá trị phải khớp với `value` của một số `<option>` được lồng bên trong `<select>`.

Khi bạn truyền `value`, bạn cũng phải truyền một trình xử lý `onChange` để cập nhật giá trị đã truyền.

Nếu `<select>` của bạn không được kiểm soát, bạn có thể truyền prop `defaultValue` thay thế:

* `defaultValue`: Một chuỗi (hoặc một mảng các chuỗi cho [`multiple={true}`](#enabling-multiple-selection)). Chỉ định [tùy chọn được chọn ban đầu.](#providing-an-initially-selected-option)

Các prop `<select>` này có liên quan cho cả hộp chọn được kiểm soát và không được kiểm soát:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autocomplete): Một chuỗi. Chỉ định một trong các [hành vi tự động hoàn thành có thể.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autofocus): Một boolean. Nếu `true`, React sẽ tập trung vào phần tử khi mount.
* `children`: `<select>` chấp nhận các thành phần [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option), [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup) và [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) làm children. Bạn cũng có thể truyền các thành phần của riêng bạn miễn là cuối cùng chúng hiển thị một trong các thành phần được phép. Nếu bạn truyền các thành phần của riêng bạn mà cuối cùng hiển thị các thẻ `<option>`, mỗi `<option>` bạn hiển thị phải có một `value`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#disabled): Một boolean. Nếu `true`, hộp chọn sẽ không tương tác được và sẽ xuất hiện màu xám.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#form): Một chuỗi. Chỉ định `id` của `<form>` mà hộp chọn này thuộc về. Nếu bỏ qua, nó là form cha gần nhất.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#multiple): Một boolean. Nếu `true`, trình duyệt cho phép [chọn nhiều tùy chọn.](#enabling-multiple-selection)
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#name): Một chuỗi. Chỉ định tên cho hộp chọn này được [gửi cùng với form.](#reading-the-select-box-value-when-submitting-a-form)
* `onChange`: Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Bắt buộc đối với [các hộp chọn được kiểm soát.](#controlling-a-select-box-with-a-state-variable) Kích hoạt ngay lập tức khi người dùng chọn một tùy chọn khác. Hoạt động giống như sự kiện [`input` của trình duyệt.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Một phiên bản của `onChange` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Kích hoạt ngay lập tức khi giá trị được thay đổi bởi người dùng. Vì lý do lịch sử, trong React, thành ngữ là sử dụng `onChange` thay thế, hoạt động tương tự.
* `onInputCapture`: Một phiên bản của `onInput` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Kích hoạt nếu một input không vượt qua xác thực khi gửi form. Không giống như sự kiện `invalid` dựng sẵn, sự kiện `onInvalid` của React nổi bọt.
* `onInvalidCapture`: Một phiên bản của `onInvalid` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#required): Một boolean. Nếu `true`, giá trị phải được cung cấp để form được gửi.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#size): Một số. Đối với các select có `multiple={true}`, chỉ định số lượng mục hiển thị ban đầu ưu tiên.

#### Lưu ý {/*caveats*/}

- Không giống như trong HTML, việc truyền một thuộc tính `selected` cho `<option>` không được hỗ trợ. Thay vào đó, hãy sử dụng [`<select defaultValue>`](#providing-an-initially-selected-option) cho các hộp chọn không được kiểm soát và [`<select value>`](#controlling-a-select-box-with-a-state-variable) cho các hộp chọn được kiểm soát.
- Nếu một hộp chọn nhận được một prop `value`, nó sẽ được [xử lý như được kiểm soát.](#controlling-a-select-box-with-a-state-variable)
- Một hộp chọn không thể vừa được kiểm soát vừa không được kiểm soát cùng một lúc.
- Một hộp chọn không thể chuyển đổi giữa việc được kiểm soát hoặc không được kiểm soát trong suốt thời gian tồn tại của nó.
- Mọi hộp chọn được kiểm soát cần một trình xử lý sự kiện `onChange` để đồng bộ cập nhật giá trị backing của nó.

---

## Cách sử dụng {/*usage*/}

### Hiển thị hộp chọn với các tùy chọn {/*displaying-a-select-box-with-options*/}

Hiển thị một `<select>` với một danh sách các thành phần `<option>` bên trong để hiển thị một hộp chọn. Cung cấp cho mỗi `<option>` một `value` đại diện cho dữ liệu sẽ được gửi cùng với form.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Chọn một loại trái cây:
      <select name="selectedFruit">
        <option value="apple">Táo</option>
        <option value="banana">Chuối</option>
        <option value="orange">Cam</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>

---

### Cung cấp nhãn cho hộp chọn {/*providing-a-label-for-a-select-box*/}

Thông thường, bạn sẽ đặt mọi `<select>` bên trong một thẻ [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). Điều này cho trình duyệt biết rằng nhãn này được liên kết với hộp chọn đó. Khi người dùng nhấp vào nhãn, trình duyệt sẽ tự động tập trung vào hộp chọn. Nó cũng rất cần thiết cho khả năng truy cập: trình đọc màn hình sẽ thông báo chú thích nhãn khi người dùng tập trung vào hộp chọn.

Nếu bạn không thể lồng `<select>` vào một `<label>`, hãy liên kết chúng bằng cách truyền cùng một ID cho `<select id>` và [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Để tránh xung đột giữa nhiều phiên bản của một thành phần, hãy tạo một ID như vậy bằng [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Chọn một loại trái cây:
        <select name="selectedFruit">
          <option value="apple">Táo</option>
          <option value="banana">Chuối</option>
          <option value="orange">Cam</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Chọn một loại rau:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Dưa chuột</option>
        <option value="corn">Ngô</option>
        <option value="tomato">Cà chua</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>

---

### Cung cấp tùy chọn được chọn ban đầu {/*providing-an-initially-selected-option*/}

Theo mặc định, trình duyệt sẽ chọn `<option>` đầu tiên trong danh sách. Để chọn một tùy chọn khác theo mặc định, hãy truyền `value` của `<option>` đó làm `defaultValue` cho phần tử `<select>`.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Chọn một loại trái cây:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">Táo</option>
        <option value="banana">Chuối</option>
        <option value="orange">Cam</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>

<Pitfall>

Không giống như trong HTML, việc truyền một thuộc tính `selected` cho một `<option>` riêng lẻ không được hỗ trợ.

</Pitfall>

---

### Cho phép chọn nhiều tùy chọn {/*enabling-multiple-selection*/}

Truyền `multiple={true}` cho `<select>` để cho phép người dùng chọn nhiều tùy chọn. Trong trường hợp đó, nếu bạn cũng chỉ định `defaultValue` để chọn các tùy chọn được chọn ban đầu, nó phải là một mảng.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Chọn một vài loại trái cây:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Táo</option>
        <option value="banana">Chuối</option>
        <option value="orange">Cam</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### Đọc giá trị hộp chọn khi gửi form {/*reading-the-select-box-value-when-submitting-a-form*/}

Thêm một [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) xung quanh hộp chọn của bạn với một [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) bên trong. Nó sẽ gọi trình xử lý sự kiện `<form onSubmit>` của bạn. Theo mặc định, trình duyệt sẽ gửi dữ liệu form đến URL hiện tại và làm mới trang. Bạn có thể ghi đè hành vi đó bằng cách gọi `e.preventDefault()`. Đọc dữ liệu form bằng [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Ngăn trình duyệt tải lại trang
    e.preventDefault();
    // Đọc dữ liệu form
    const form = e.target;
    const formData = new FormData(form);
    // Bạn có thể truyền formData làm một fetch body trực tiếp:
    fetch('/some-api', { method: form.method, body: formData });
    // Bạn có thể tạo một URL từ nó, như trình duyệt làm theo mặc định:
    console.log(new URLSearchParams(formData).toString());
    // Bạn có thể làm việc với nó như một đối tượng thuần túy.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) Điều này không bao gồm các giá trị select nhiều
    // Hoặc bạn có thể nhận được một mảng các cặp tên-giá trị.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Chọn loại trái cây yêu thích của bạn:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Táo</option>
          <option value="banana">Chuối</option>
          <option value="orange">Cam</option>
        </select>
      </label>
      <label>
        Chọn tất cả các loại rau yêu thích của bạn:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Dưa chuột</option>
          <option value="corn">Ngô</option>
          <option value="tomato">Cà chua</option>
        </select>
      </label>
      <hr />
      <button type="reset">Đặt lại</button>
      <button type="submit">Gửi</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

Cung cấp một `name` cho `<select>` của bạn, ví dụ: `<select name="selectedFruit" />`. `name` bạn đã chỉ định sẽ được sử dụng làm khóa trong dữ liệu form, ví dụ: `{ selectedFruit: "orange" }`.

Nếu bạn sử dụng `<select multiple={true}>`, [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) bạn sẽ đọc từ form sẽ bao gồm mỗi giá trị được chọn như một cặp tên-giá trị riêng biệt. Xem kỹ các bản ghi console trong ví dụ trên.

</Note>

<Pitfall>

Theo mặc định, *bất kỳ* `<button>` nào bên trong một `<form>` sẽ gửi nó. Điều này có thể gây ngạc nhiên! Nếu bạn có thành phần React `Button` tùy chỉnh của riêng mình, hãy cân nhắc trả về [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) thay vì `<button>`. Sau đó, để rõ ràng, hãy sử dụng `<button type="submit">` cho các nút *được* cho là để gửi form.

</Pitfall>

---

### Kiểm soát hộp chọn bằng một biến trạng thái {/*controlling-a-select-box-with-a-state-variable*/}

Một hộp chọn như `<select />` là *không được kiểm soát*. Ngay cả khi bạn [truyền một giá trị được chọn ban đầu](#providing-an-initially-selected-option) như `<select defaultValue="orange" />`, JSX của bạn chỉ định giá trị ban đầu, không phải giá trị ngay bây giờ.

**Để hiển thị một hộp chọn _được kiểm soát_, hãy truyền prop `value` cho nó.** React sẽ buộc hộp chọn luôn có `value` bạn đã truyền. Thông thường, bạn sẽ kiểm soát một hộp chọn bằng cách khai báo một [biến trạng thái:](/reference/react/useState)

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // Khai báo một biến trạng thái...
  // ...
  return (
    <select
      value={selectedFruit} // ...buộc giá trị của select khớp với biến trạng thái...
      onChange={e => setSelectedFruit(e.target.value)} // ...và cập nhật biến trạng thái khi có bất kỳ thay đổi nào!
    >
      <option value="apple">Táo</option>
      <option value="banana">Chuối</option>
      <option value="orange">Cam</option>
    </select>
  );
}
```

Điều này hữu ích nếu bạn muốn hiển thị lại một số phần của UI để đáp ứng với mọi lựa chọn.

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Chọn một loại trái cây:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Táo</option>
          <option value="banana">Chuối</option>
          <option value="orange">Cam</option>
        </select>
      </label>
      <hr />
      <label>
        Chọn tất cả các loại rau yêu thích của bạn:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Dưa chuột</option>
          <option value="corn">Ngô</option>
          <option value="tomato">Cà chua</option>
        </select>
      </label>
      <hr />
      <p>Loại trái cây yêu thích của bạn: {selectedFruit}</p>
      <p>Các loại rau yêu thích của bạn: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**Nếu bạn truyền `value` mà không có `onChange`, bạn sẽ không thể chọn một tùy chọn.** Khi bạn kiểm soát một hộp chọn bằng cách truyền một số `value` cho nó, bạn *buộc* nó luôn có giá trị bạn đã truyền. Vì vậy, nếu bạn truyền một biến trạng thái làm `value` nhưng quên cập nhật biến trạng thái đó một cách đồng bộ trong trình xử lý sự kiện `onChange`, React sẽ hoàn nguyên hộp chọn sau mỗi lần nhấn phím trở lại `value` mà bạn đã chỉ định.

Không giống như trong HTML, việc truyền một thuộc tính `selected` cho một `<option>` riêng lẻ không được hỗ trợ.

</Pitfall>
