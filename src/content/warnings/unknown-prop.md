---
title: Unknown Prop Warning
---
<<<<<<< HEAD:content/warnings/unknown-prop.md
=======

The unknown-prop warning will fire if you attempt to render a DOM element with a prop that is not recognized by React as a legal DOM attribute/property. You should ensure that your DOM elements do not have spurious props floating around.
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/warnings/unknown-prop.md

Cảnh báo unknown-prop sẽ xuất hiện nếu bạn đang cố gắng để render một DOM element với một prop không được React công nhận như một thuộc tính(attribute/property) DOM
hợp pháp.Bạn nên đảm bảo rằng các DOM elements của bạn không có các props giả mạo trôi nổi xung quanh.

<<<<<<< HEAD:content/warnings/unknown-prop.md
Có một số lý do có thể khiến cho cảnh báo này xuất hiện: 
=======
1. Are you using `{...props}` or `cloneElement(element, props)`? When copying props to a child component, you should ensure that you are not accidentally forwarding props that were intended only for the parent component. See common fixes for this problem below.
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/warnings/unknown-prop.md

1. Bạn có đang sử dụng `{...this.props}` hoặc `cloneElement(element, this.props)` không? Component của bạn đang chuyển các props của chính nó sang một element con 
(ví dụ: [transferring props](/docs/transferring-props.html)). Khi chuyển các props sang một component con, bạn nên đảm bảo rằng bạn không vô tình chuyển tiếp các props
được component cha dự định thông dịch.

<<<<<<< HEAD:content/warnings/unknown-prop.md

2. Bạn đang sử dụng một thuộc tính DOM không tiêu chuẩn trên một DOM node gốc, có lẽ là đại diện cho một data tùy chỉnh. Nếu bạn đang cố gắng đính kèm data tùy chỉnh
vào một DOM element tiêu chuẩn, bạn có thể xem xét sử dụng thuộc tính data tùy chỉnh như đã được mô tả trên [MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes).

3. React chưa thể nhận ra thuộc tính mà bạn đã chỉ định. Điều này có thể được khắc phục trong một phiên bản React mới trong tương lai. Tuy nhiên, React hiện tại sẽ 
loại bỏ tất cả các thuộc tính không được xác định, vì vậy việc bạn chỉ định chúng trong ứng dụng React của bạn sẽ khiến chúng không được render.

4. Bạn đang sử dụng một React component mà không có chữ hoa. React sẽ hiểu nó như một thẻ DOM bởi vì [React JSX Transform sử dụng quy ước chữ hoa và chữ thường để phân biệt giữa các components do người dùng tự định nghĩa và các thẻ DOM](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

---

Để khắc phục điều này, các composite components nên "sử dụng hết" bất kỳ prop nào dành cho composite component và không dành cho component con. Ví dụ:
=======
3. React does not yet recognize the attribute you specified. This will likely be fixed in a future version of React. React will allow you to pass it without a warning if you write the attribute name lowercase.

4. You are using a React component without an upper case, for example `<myButton />`. React interprets it as a DOM tag because React JSX transform uses the upper vs. lower case convention to distinguish between user-defined components and DOM tags. For your own React components, use PascalCase. For example, write `<MyButton />` instead of `<myButton />`.

---

If you get this warning because you pass props like `{...props}`, your parent component needs to "consume" any prop that is intended for the parent component and not intended for the child component. Example:
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/warnings/unknown-prop.md

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

<<<<<<< HEAD:content/warnings/unknown-prop.md
**Tốt:** Toán tử spread có thể được sử dụng để lấy ra các biến trong props ra và đặt lại các props còn lại vào một biến.
=======
**Good:** The spread syntax can be used to pull variables off props, and put the remaining props into a variable.
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/warnings/unknown-prop.md

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
