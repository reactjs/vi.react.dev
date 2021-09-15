---
id: create-fragment
title: Keyed Fragments
permalink: docs/create-fragment.html
layout: docs
category: Add-Ons
---

> Chú ý:
>
> `React.addons` entry point không được dùng kể từ React v15.5. Hiện đã có hỗ trợ tốt nhất, bạn có thể đọc thêm tại  [đây](/docs/fragments.html).

## Tiến hành triển khai {#importing}

```javascript
import createFragment from 'react-addons-create-fragment'; // ES6
var createFragment = require('react-addons-create-fragment'); // ES5 with npm
```

## Overview {#overview}

Trong hầu hết các trường hợp, bạn sẽ sử dụng `key` để hỗ trợ chỉ định các khóa trên các phần từ mà bạn đang trả về sau khi `render`. Tuy nhiên, điều này phá phỡ một trường hợp: nếu bạn có hai nhóm con cần sắp xếp lại, ta sẽ không có cách nào để đặt một khóa trên mỗi tập hợp mà không thêm một wrapper element.

Nếu bạn có một component như sau:

```js
function Swapper(props) {
  let children;
  if (props.swapped) {
    children = [props.rightChildren, props.leftChildren];
  } else {
    children = [props.leftChildren, props.rightChildren];
  }
  return <div>{children}</div>;
}
```

Các nhóm con sẽ ngắt kết nối và liên kết lại khi bạn thay đổi `swapped` vì không có bất kỳ khóa nào được đánh dấu trên hai nhóm con.

Để giải quyết vấn đề này, bạn có thể sử dụng `createFragment` để bổ sung khóa cho các nhóm con.

#### `Array<ReactNode> createFragment(object children)` {#arrayreactnode-createfragmentobject-children}

Thay vì tạo mảng, chúng ta sẽ làm như sau:

```javascript
import createFragment from 'react-addons-create-fragment';

function Swapper(props) {
  let children;
  if (props.swapped) {
    children = createFragment({
      right: props.rightChildren,
      left: props.leftChildren
    });
  } else {
    children = createFragment({
      left: props.leftChildren,
      right: props.rightChildren
    });
  }
  return <div>{children}</div>;
}
```

Các khóa sẽ được truyền vào đối tượng (đấy là `left` và `right`) được sử dụng để làm chìa khóa cho các nhóm con, và thứ tự các khóa của đối tượng được sử dụng để xác định thứ tự của các nhóm con được hiển thị. Với thay đổi này, hai nhóm con sẽ được sắp xếp lại đúng thứ tự trong DOM mà không cần ngắt kết nối.

Giá trị trả về của `createFragment` nên được coi là một đối tượng mờ đục; bạn có thể dùng [`React.Children`](/docs/react-api.html#react.children) để lặp qua một đoạn nhưng không nên truy cập trực tiếp vào nó. Chú ý rằng chúng ta đang dùng Javascript để bảo toàn thứ tự các đối tượng được liệt kê, thứ tự này không được đảm bảo bởi thông số kỹ thuật nhưng được triển khai bởi tất cả các trình duyệt và máy ảo cho các đối tượng có khóa không phải là số.
