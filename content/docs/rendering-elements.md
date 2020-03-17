---
id: rendering-elements
title: Việc render các element
permalink: docs/rendering-elements.html
redirect_from:
  - "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

Element là những mảnh ghép nhỏ nhất của các ứng dụng React.

Một element mô tả những gì bạn muốn nhìn thấy trên màn hình:

```js
const element = <h1>Hello, world</h1>;
```

Không giống như những element DOM của trình duyệt, React element là những "đối tượng đơn giản" (plain object) và rất dễ để tạo ra. React DOM giữ vai trò cập nhật DOM để phù hợp với các React element.

>**Ghi chú:**
>
>Người ta có thể nhầm lẫn các element với một khái niệm được biết rộng hơn về các "component". Chúng tôi sẽ giới thiệu các "component" trong [phần tới](/docs/components-and-props.html). Các element là những gì mà các component được "làm từ", và chúng tôi khuyến khích bạn đọc phần này trước khi đi đến phần kế tiếp.

## Việc render một element vào trong DOM {#rendering-an-element-into-the-dom}

Hãy hình dung có một thẻ `<div>` ở đâu đó trong "tệp" (file) HTML:

```html
<div id="root"></div>
```

Chúng tôi gọi cái này là một nốt (node) DOM gốc "root" bởi về mọi thứ bên trong nó sẽ được quản lý bởi React DOM.

Các ứng dụng đã xây dựng với React thường có duy nhất một nốt (node) DOM "gốc" (root). Nếu bạn kết hợp React vào trong một ứng dụng đã tồn tại, bạn có thể có nhiều "nốt" (node) DOM gốc "bị cô lập" (isolated) như bạn muốn.

Để render một React element vào bên trong một "nốt" (node) DOM gốc, truyền tất cả vào [`ReactDOM.render()`](/docs/react-dom.html#render):

`embed:rendering-elements/render-an-element.js`

[](codepen://rendering-elements/render-an-element)

Ví dụ trên hiển thị dòng chữ "Hello, world" trên trang web.

## Việc cập nhật element đã được render {#updating-the-rendered-element}

Các React element là [bất biến](https://vi.wikipedia.org/wiki/%C4%90%E1%BB%91i_t%C6%B0%E1%BB%A3ng_b%E1%BA%A5t_bi%E1%BA%BFn). Một khi bạn tạo ra một element, bạn không thể thay đổi các "con" (children) hoặc các "thuộc tính" (attribute) của nó. Một element giống như một khung hình duy nhất trong một bộ phim: nó đại diện cho "giao diện" (UI) tại một thời điểm nhất định.

Với sự hiểu biết của chúng tôi cho đến thời điểm này, thì chỉ có một cách duy nhất để cập nhật "giao diện" (UI) đó là tạo ra một element mới và truyền nó vào [`ReactDOM.render()`](/docs/react-dom.html#render).

Hãy xem xét ví dụ đồng hồ "đánh dấu" (tick) này:

`embed:rendering-elements/update-rendered-element.js`

[](codepen://rendering-elements/update-rendered-element)

Nó gọi [`ReactDOM.render()`](/docs/react-dom.html#render) mỗi giây từ một "lời gọi lại" (callback) [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval).

>**Ghi chú:**
>
>Trong thực tế, hầu hết các ứng dụng React chỉ gọi [`ReactDOM.render()`](/docs/react-dom.html#render) một lần duy nhất. Trong những phần tiếp theo, chúng ta sẽ tìm hiểu làm thế nào để "mã" (code) được đóng gói vào ["những component có trạng thái" (stateful components)](/docs/state-and-lifecycle.html).
>
>Chúng tôi khuyên bạn đừng bỏ qua các "chủ đề" (topic) vì chúng có tính xây dựng lẫn nhau.

## React Chỉ Cập Nhật Những Gì Cần Thiết {#react-only-updates-whats-necessary}

React DOM so sánh element và các thành phần con của nó với cái trước đó, và chỉ áp dụng những cập nhật DOM cần thiết để đưa DOM đến trạng thái được mong muốn.

Bạn có thể xác minh điều trên bằng cách kiểm tra [ví dụ cuối](codepen://rendering-elements/update-rendered-element) với các công cụ của trình duyệt:

![DOM inspector showing granular updates](../images/docs/granular-dom-updates.gif)
!["thanh kiểm tra" (inspector) DOM chỉ ra những cập nhật cần thiết](../images/docs/granular-dom-updates.gif)

Mặc dù chúng ta tạo ra một element miêu tả toàn bộ cây "giao diện" (UI) trên mỗi "đánh dấu" (tick), chỉ những "nốt văn bản" (text node) có nội dung thay đổi mới nhận sự cập nhật bởi React DOM.

Với kinh nghiệm của chúng tôi thì chúng ta nên suy nghĩ về cách "giao diện" (UI) nên trông như thế nào tại mọi thời điểm hơn là suy nghĩ làm thế nào để thay đổi "giao diện" (UI) theo thời gian, điều này sẽ loại bỏ được rất nhiều "lỗi" (bug).
