---
title: Unknown Prop Warning
layout: single
permalink: warnings/unknown-prop.html
---

Cảnh báo unknown-prop sẽ xuất hiện nếu bạn đang cố gắng để render một DOM element với một prop không được React công nhận như một thuộc tính(attribute/property) DOM
hợp pháp.Bạn nên đảm bảo rằng các DOM elements của bạn không có các props giả mạo trôi nổi xung quanh.

Có một số lý do có thể khiến cho cảnh báo này xuất hiện: 

1. Bạn có đang sử dụng `{...this.props}` hoặc `cloneElement(element, this.props)` không? Component của bạn đang chuyển các props của chính nó sang một element con 
(ví dụ: [transferring props](/docs/transferring-props.html)). Khi chuyển các props sang một component con, bạn nên đảm bảo rằng bạn không vô tình chuyển tiếp các props
được component cha dự định thông dịch.


2. Bạn đang sử dụng một thuộc tính DOM không tiêu chuẩn trên một DOM node gốc, có lẽ là đại diện cho một data tùy chỉnh. Nếu bạn đang cố gắng đính kèm data tùy chỉnh
vào một DOM element tiêu chuẩn, bạn có thể xem xét sử dụng thuộc tính data tùy chỉnh như đã được mô tả trên [MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes).

3. React chưa thể nhận ra thuộc tính mà bạn đã chỉ định. Điều này có thể được khắc phục trong một phiên bản React mới trong tương lai. Tuy nhiên, React hiện tại sẽ 
loại bỏ tất cả các thuộc tính không được xác định, vì vậy việc bạn chỉ định chúng trong ứng dụng React của bạn sẽ khiến chúng không được render.

4. Bạn đang sử dụng một React component mà không có chữ hoa. React sẽ hiểu nó như một thẻ DOM bởi vì [React JSX Transform sử dụng quy ước chữ hoa và chữ thường để phân biệt giữa các components do người dùng tự định nghĩa và các thẻ DOM](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

---

Để khắc phục điều này, các composite components nên "sử dụng hết" bất kỳ prop nào dành cho composite component và không dành cho component con. Ví dụ:

**Tệ:** Prop `layout` không mong muốn đã được chuyển tiếp đến thẻ `div`.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // TỆ! Bởi vì bạn biết chắc chắn rằng "layout" không phải là một prop mà thẻ <div> có thể hiểu được. 
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // TỆ! Bởi vì bạn biết chắc chắn rằng "layout" không phải là một prop mà thẻ <div> có thể hiểu được. 
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**Tốt:** Toán tử spread có thể được sử dụng để lấy ra các biến trong props ra và đặt lại các props còn lại vào một biến.

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

**Tốt:** Bạn có thể gán các props cho một object mới và xóa các keys mà bạn đang sử dụng ra khỏi object mới. Đảm bảo rằng bạn không xóa các props ra khỏi object `this.props` ban đầu, vì object đó sẽ được coi là bất biến/không thể thay đổi (immutable)

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
