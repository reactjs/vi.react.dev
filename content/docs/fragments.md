---
id: fragments
title: Fragments
permalink: docs/fragments.html
---

Một trong những pattern phổ biến của React là trả về nhiều element trong một component. Fragment cho phép bạn nhóm một danh sách các childrent mà không cần thêm bất kì node dư thừa vào DOM tree.

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

React đồng thời cung cấp [cú pháp rút gọn](#short-syntax) để khai báo Fragment.

## Lí do {#motivation}

Một trong những pattern phổ biến là trả về một danh sách các childrent trong một component. Xem xét phân đoạn code React dưới đây:

```jsx
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```

`<Columns />` cần trả về nhiều phần tử <td> để có thể đáp ứng việc render ra HTML chính xác. Nếu parent là `div` được sử dụng bên trong hàm `render()` của `<Columns>`, kết quả HTML sau khi được render sẽ không chính xác.

```jsx
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    );
  }
}
```

Điều này kéo theo việc HTML được render của `<Table />` không chính xác:

```jsx
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```

Fragment giúp giải quyết vấn đề này.

## Sử dụng {#usage}

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}
```

làm cho kết quả HTML được render một cách chính xác của `<Table />`:

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### Cú pháp rút gọn {#short-syntax}

Fragment cung cấp một cú pháp mới, ngắn gọn hơn để khai báo. Trông nó sẽ giống 1 thẻ rỗng:

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```

Bạn có thể sử dung `<></>` giống như cách bạn sử dụng bất kì element nào khác ngoại trừ việc nó không hỡ trợ từ khóa (key) và các thuộc tính (attribute).

### Keyed Fragments {#keyed-fragments}

 Fragment đươc khai báo dưới dạng cú pháp rõ ràng `<React.Fragment>` có hỡ trợ khai báo từ khóa (key). Ví dụ dưới đây cho trường hợp này là việc ánh xạ một collection sang một mảng các fragment, để tạo nên một danh sách các mô tả chi tiết:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Without the `key`, React will fire a key warning
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key` là thuộc tính duy nhất có thể khai báo trong `Fragment`. Trong thời gian tới, chúng tôi có thể bổ sung thêm các thuộc tính, chẳng hạn xử lí sự kiện (event handler).

### Live Demo {#live-demo}

Bạn có thể trải nghiệm cú pháp JSX Fragment với [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000).
