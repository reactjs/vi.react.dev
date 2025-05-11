---
title: useInsertionEffect
---

<Pitfall>

`useInsertionEffect` dành cho các tác giả thư viện CSS-in-JS. Trừ khi bạn đang làm việc trên một thư viện CSS-in-JS và cần một nơi để chèn các kiểu, bạn có thể muốn sử dụng [`useEffect`](/reference/react/useEffect) hoặc [`useLayoutEffect`](/reference/react/useLayoutEffect) thay thế.

</Pitfall>

<Intro>

`useInsertionEffect` cho phép chèn các phần tử vào DOM trước khi bất kỳ Effect bố cục nào được kích hoạt.

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Gọi `useInsertionEffect` để chèn các kiểu trước khi bất kỳ Effect nào cần đọc bố cục được kích hoạt:

```js
import { useInsertionEffect } from 'react';

// Bên trong thư viện CSS-in-JS của bạn
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... chèn các thẻ <style> ở đây ...
  });
  return rule;
}
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `setup`: Hàm chứa logic Effect của bạn. Hàm thiết lập của bạn cũng có thể trả về một hàm *dọn dẹp* tùy chọn. Khi component của bạn được thêm vào DOM, nhưng trước khi bất kỳ Effect bố cục nào được kích hoạt, React sẽ chạy hàm thiết lập của bạn. Sau mỗi lần render lại với các dependency đã thay đổi, React sẽ chạy trước hàm dọn dẹp (nếu bạn đã cung cấp) với các giá trị cũ, và sau đó chạy hàm thiết lập của bạn với các giá trị mới. Khi component của bạn bị xóa khỏi DOM, React sẽ chạy hàm dọn dẹp của bạn.

* **tùy chọn** `dependencies`: Danh sách tất cả các giá trị phản ứng được tham chiếu bên trong code `setup`. Các giá trị phản ứng bao gồm props, state và tất cả các biến và hàm được khai báo trực tiếp bên trong phần thân component của bạn. Nếu trình lint của bạn được [cấu hình cho React](/learn/editor-setup#linting), nó sẽ xác minh rằng mọi giá trị phản ứng được chỉ định chính xác là một dependency. Danh sách các dependency phải có một số lượng mục không đổi và được viết nội dòng như `[dep1, dep2, dep3]`. React sẽ so sánh từng dependency với giá trị trước đó của nó bằng cách sử dụng thuật toán so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Nếu bạn không chỉ định các dependency nào cả, Effect của bạn sẽ chạy lại sau mỗi lần render lại của component.

#### Giá trị trả về {/*returns*/}

`useInsertionEffect` trả về `undefined`.

#### Lưu ý {/*caveats*/}

* Các Effect chỉ chạy trên máy khách. Chúng không chạy trong quá trình render trên máy chủ.
* Bạn không thể cập nhật state từ bên trong `useInsertionEffect`.
* Vào thời điểm `useInsertionEffect` chạy, các ref chưa được đính kèm.
* `useInsertionEffect` có thể chạy trước hoặc sau khi DOM đã được cập nhật. Bạn không nên dựa vào việc DOM được cập nhật vào một thời điểm cụ thể nào.
* Không giống như các loại Effect khác, loại mà kích hoạt dọn dẹp cho mỗi Effect và sau đó thiết lập cho mỗi Effect, `useInsertionEffect` sẽ kích hoạt cả dọn dẹp và thiết lập một component tại một thời điểm. Điều này dẫn đến sự "xen kẽ" của các hàm dọn dẹp và thiết lập.

---

## Cách sử dụng {/*usage*/}

### Chèn các kiểu động từ các thư viện CSS-in-JS {/*injecting-dynamic-styles-from-css-in-js-libraries*/}

Theo truyền thống, bạn sẽ tạo kiểu cho các component React bằng CSS thuần túy.

```js
// Trong file JS của bạn:
<button className="success" />

// Trong file CSS của bạn:
.success { color: green; }
```

Một số nhóm thích tạo kiểu trực tiếp trong code JavaScript thay vì viết các file CSS. Điều này thường đòi hỏi việc sử dụng một thư viện CSS-in-JS hoặc một công cụ. Có ba cách tiếp cận phổ biến đối với CSS-in-JS:

1. Trích xuất tĩnh sang các file CSS bằng trình biên dịch
2. Các kiểu nội dòng, ví dụ: `<div style={{ opacity: 1 }}>`
3. Chèn thẻ `<style>` lúc chạy

Nếu bạn sử dụng CSS-in-JS, chúng tôi khuyên bạn nên kết hợp hai cách tiếp cận đầu tiên (các file CSS cho các kiểu tĩnh, các kiểu nội dòng cho các kiểu động). **Chúng tôi không khuyến nghị chèn thẻ `<style>` lúc chạy vì hai lý do:**

1. Chèn lúc chạy buộc trình duyệt phải tính toán lại các kiểu thường xuyên hơn rất nhiều.
2. Chèn lúc chạy có thể rất chậm nếu nó xảy ra vào sai thời điểm trong vòng đời React.

Vấn đề đầu tiên là không thể giải quyết được, nhưng `useInsertionEffect` giúp bạn giải quyết vấn đề thứ hai.

Gọi `useInsertionEffect` để chèn các kiểu trước khi bất kỳ Effect bố cục nào được kích hoạt:

```js {4-11}
// Bên trong thư viện CSS-in-JS của bạn
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // Như đã giải thích trước đó, chúng tôi không khuyến nghị chèn thẻ <style> lúc chạy.
    // Nhưng nếu bạn phải làm điều đó, thì điều quan trọng là phải làm trong useInsertionEffect.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

Tương tự như `useEffect`, `useInsertionEffect` không chạy trên máy chủ. Nếu bạn cần thu thập các quy tắc CSS nào đã được sử dụng trên máy chủ, bạn có thể thực hiện việc đó trong quá trình render:

```js {1,4-6}
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

[Đọc thêm về việc nâng cấp các thư viện CSS-in-JS với việc chèn lúc chạy lên `useInsertionEffect`.](https://github.com/reactwg/react-18/discussions/110)

<DeepDive>

#### Làm thế nào điều này tốt hơn so với việc chèn các kiểu trong quá trình render hoặc useLayoutEffect? {/*how-is-this-better-than-injecting-styles-during-rendering-or-uselayouteffect*/}

Nếu bạn chèn các kiểu trong quá trình render và React đang xử lý một [bản cập nhật không chặn,](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) trình duyệt sẽ tính toán lại các kiểu mỗi khung hình trong khi render một cây component, điều này có thể **cực kỳ chậm.**

`useInsertionEffect` tốt hơn so với việc chèn các kiểu trong [`useLayoutEffect`](/reference/react/useLayoutEffect) hoặc [`useEffect`](/reference/react/useEffect) vì nó đảm bảo rằng vào thời điểm các Effect khác chạy trong các component của bạn, các thẻ `<style>` đã được chèn. Nếu không, các tính toán bố cục trong các Effect thông thường sẽ bị sai do các kiểu đã lỗi thời.

</DeepDive>
