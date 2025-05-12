---
title: Cảnh báo Prop Không Xác Định
---

Cảnh báo unknown-prop sẽ xuất hiện nếu bạn cố gắng render một phần tử DOM với một prop mà React không nhận ra là một thuộc tính/property DOM hợp lệ. Bạn nên đảm bảo rằng các phần tử DOM của bạn không có các prop giả mạo xung quanh.

Có một vài lý do có thể khiến cảnh báo này xuất hiện:

1. Bạn có đang sử dụng `{...props}` hoặc `cloneElement(element, props)` không? Khi sao chép các prop cho một component con, bạn nên đảm bảo rằng bạn không vô tình chuyển tiếp các prop chỉ dành cho component cha. Xem các cách khắc phục phổ biến cho vấn đề này bên dưới.

2. Bạn đang sử dụng một thuộc tính DOM không chuẩn trên một nút DOM gốc, có thể để biểu diễn dữ liệu tùy chỉnh. Nếu bạn đang cố gắng đính kèm dữ liệu tùy chỉnh vào một phần tử DOM tiêu chuẩn, hãy cân nhắc sử dụng thuộc tính data tùy chỉnh như được mô tả [trên MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes).

3. React chưa nhận ra thuộc tính bạn đã chỉ định. Điều này có thể sẽ được khắc phục trong một phiên bản React trong tương lai. React sẽ cho phép bạn chuyển nó mà không có cảnh báo nếu bạn viết tên thuộc tính ở dạng chữ thường.

4. Bạn đang sử dụng một component React mà không có chữ hoa, ví dụ: `<myButton />`. React hiểu nó là một thẻ DOM vì chuyển đổi React JSX sử dụng quy ước chữ hoa so với chữ thường để phân biệt giữa các component do người dùng định nghĩa và các thẻ DOM. Đối với các component React của riêng bạn, hãy sử dụng PascalCase. Ví dụ: viết `<MyButton />` thay vì `<myButton />`.

---

Nếu bạn nhận được cảnh báo này vì bạn truyền các prop như `{...props}`, component cha của bạn cần "tiêu thụ" bất kỳ prop nào dành cho component cha và không dành cho component con. Ví dụ:

**Tệ:** Prop `layout` không mong muốn được chuyển tiếp đến thẻ `div`.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // TỆ! Vì bạn chắc chắn "layout" không phải là một prop mà <div> hiểu.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // TỆ! Vì bạn chắc chắn "layout" không phải là một prop mà <div> hiểu.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**Tốt:** Cú pháp spread có thể được sử dụng để kéo các biến ra khỏi props và đặt các prop còn lại vào một biến.

```js
function MyDiv(props) {
  const { layout, ...rest } = props
  if (layout === 'horizontal') {
    return <div {...rest} style={getHorizontalStyle()} />
  } else {
    return <div {...rest} style={getVerticalStyle()} />
  }
}
```

**Tốt:** Bạn cũng có thể gán các prop cho một đối tượng mới và xóa các khóa mà bạn đang sử dụng khỏi đối tượng mới. Hãy nhớ không xóa các prop khỏi đối tượng `this.props` ban đầu, vì đối tượng đó nên được coi là bất biến.

```js
function MyDiv(props) {
  const divProps = Object.assign({}, props);
  delete divProps.layout;

  if (props.layout === 'horizontal') {
    return <div {...divProps} style={getHorizontalStyle()} />
  } else {
    return <div {...divProps} style={getVerticalStyle()} />
  }
}
```
