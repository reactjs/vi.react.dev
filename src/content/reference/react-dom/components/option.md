---
title: "<option>"
---

<Intro>

[`<option>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) tích hợp sẵn của trình duyệt cho phép bạn hiển thị một tùy chọn bên trong hộp [`<select>`](/reference/react-dom/components/select).

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

### `<option>` {/*option*/}

[`<option>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) tích hợp sẵn của trình duyệt cho phép bạn hiển thị một tùy chọn bên trong hộp [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<option>` hỗ trợ tất cả [các thuộc tính phần tử thông thường.](/reference/react-dom/components/common#props)

Ngoài ra, `<option>` hỗ trợ các thuộc tính sau:

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): Một giá trị boolean. Nếu `true`, tùy chọn sẽ không thể chọn và sẽ xuất hiện màu xám.
* [`label`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label): Một chuỗi. Chỉ định ý nghĩa của tùy chọn. Nếu không được chỉ định, văn bản bên trong tùy chọn sẽ được sử dụng.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#value): Giá trị được sử dụng [khi gửi `<select>` mẹ trong một biểu mẫu](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form) nếu tùy chọn này được chọn.

#### Lưu ý {/*caveats*/}

* React không hỗ trợ thuộc tính `selected` trên `<option>`. Thay vào đó, hãy truyền `value` của tùy chọn này cho [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) mẹ cho một hộp chọn không được kiểm soát hoặc [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) cho một lựa chọn được kiểm soát.

---

## Cách sử dụng {/*usage*/}

### Hiển thị hộp chọn với các tùy chọn {/*displaying-a-select-box-with-options*/}

Kết xuất một `<select>` với một danh sách các thành phần `<option>` bên trong để hiển thị một hộp chọn. Cung cấp cho mỗi `<option>` một `value` đại diện cho dữ liệu sẽ được gửi với biểu mẫu.

[Đọc thêm về hiển thị một `<select>` với một danh sách các thành phần `<option>`.](/reference/react-dom/components/select)

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
