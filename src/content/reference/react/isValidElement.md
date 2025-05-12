---
title: isValidElement
---

<Intro>

`isValidElement` kiểm tra xem một giá trị có phải là một React element hay không.

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

Gọi `isValidElement(value)` để kiểm tra xem `value` có phải là một React element hay không.

```js
import { isValidElement, createElement } from 'react';

// ✅ React elements
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ Không phải React elements
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `value`: Giá trị bạn muốn kiểm tra. Nó có thể là bất kỳ giá trị nào thuộc bất kỳ kiểu dữ liệu nào.

#### Giá trị trả về {/*returns*/}

`isValidElement` trả về `true` nếu `value` là một React element. Ngược lại, nó trả về `false`.

#### Lưu ý {/*caveats*/}

* **Chỉ [thẻ JSX](/learn/writing-markup-with-jsx) và các đối tượng được trả về bởi [`createElement`](/reference/react/createElement) được coi là React elements.** Ví dụ: mặc dù một số như `42` là một React *node* hợp lệ (và có thể được trả về từ một component), nhưng nó không phải là một React element hợp lệ. Mảng và portals được tạo bằng [`createPortal`](/reference/react-dom/createPortal) cũng *không* được coi là React elements.

---

## Cách sử dụng {/*usage*/}

### Kiểm tra xem một thứ có phải là một React element hay không {/*checking-if-something-is-a-react-element*/}

Gọi `isValidElement` để kiểm tra xem một giá trị nào đó có phải là một *React element* hay không.

React elements là:

- Các giá trị được tạo ra bằng cách viết một [thẻ JSX](/learn/writing-markup-with-jsx)
- Các giá trị được tạo ra bằng cách gọi [`createElement`](/reference/react/createElement)

Đối với React elements, `isValidElement` trả về `true`:

```js
import { isValidElement, createElement } from 'react';

// ✅ Thẻ JSX là React elements
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ Các giá trị được trả về bởi createElement là React elements
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

Bất kỳ giá trị nào khác, chẳng hạn như chuỗi, số hoặc các đối tượng và mảng tùy ý, không phải là React elements.

Đối với chúng, `isValidElement` trả về `false`:

```js
// ❌ Đây *không phải* là React elements
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

Rất hiếm khi cần đến `isValidElement`. Nó chủ yếu hữu ích nếu bạn đang gọi một API khác *chỉ* chấp nhận các elements (như [`cloneElement`](/reference/react/cloneElement) chẳng hạn) và bạn muốn tránh lỗi khi đối số của bạn không phải là một React element.

Trừ khi bạn có một lý do rất cụ thể để thêm một kiểm tra `isValidElement`, có lẽ bạn không cần nó.

<DeepDive>

#### React elements so với React nodes {/*react-elements-vs-react-nodes*/}

Khi bạn viết một component, bạn có thể trả về bất kỳ loại *React node* nào từ nó:

```js
function MyComponent() {
  // ... bạn có thể trả về bất kỳ React node nào ...
}
```

Một React node có thể là:

- Một React element được tạo như `<div />` hoặc `createElement('div')`
- Một portal được tạo bằng [`createPortal`](/reference/react-dom/createPortal)
- Một chuỗi
- Một số
- `true`, `false`, `null` hoặc `undefined` (không được hiển thị)
- Một mảng các React nodes khác

**Lưu ý `isValidElement` kiểm tra xem đối số có phải là một *React element* hay không, chứ không phải là một React node.** Ví dụ: `42` không phải là một React element hợp lệ. Tuy nhiên, nó là một React node hoàn toàn hợp lệ:

```js
function MyComponent() {
  return 42; // Bạn có thể trả về một số từ component
}
```

Đây là lý do tại sao bạn không nên sử dụng `isValidElement` như một cách để kiểm tra xem một thứ gì đó có thể được render hay không.

</DeepDive>
