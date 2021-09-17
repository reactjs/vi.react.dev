---
id: reconciliation
title: Reconciliation
permalink: docs/reconciliation.html
---

React cung cấp một API tự động xác định những nơi bị thay đổi sau những lần cập nhật. Điều này làm cho việc viết ứng dụng trở nên dễ dàng hơn rất nhiều, nhưng có thể bạn muốn tìm hiểu thêm về cách React xác định những thay đổi trong DOM như thế nào. Bài viết này sẽ giải thích cách mà React đã thực hiện trong thuật toán "diffing" để đưa ra quyết định cập nhật components của bạn một cách có kiểm soát và đảm bảo performance (hiệu năng) của ứng dụng.

## Motivation {#motivation}

Khi bạn sử dụng React, tại một thời điểm nào đó, bạn có nhận ra function (hàm) `render()` giống như việc tạo một tree (cây) các React element. Trong lần cập nhật state hoặc props tiếp theo, function `render()` đó sẽ trả về một tree các React element khác. Sau đó, React cần tìm ra cách cập nhật UI (giao diện người dùng) một cách hiệu quả để phù hợp với tree gần đây nhất.

Có một số giải pháp chung cho vấn đề algorithmic (thuật toán) này là tạo ra số lượng phép toán tối thiểu để biến đổi một tree này thành một tree khác. Tuy nhiên, [state of the art algorithms (các thuật toán hiện đại)](https://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf) có độ phức tạp theo thứ tự là O(n<sup>3</sup>) trong đó n là số phần tử trong tree.

Nếu chúng tôi sử dụng điều này trong React, việc hiển thị 1000 phần tử sẽ yêu cầu cần phải chạy lên đến một tỷ phép so sánh. Đó quả là một sự trả giá quá đắt. Thay vào đó, React triển khai thuật toán heuristic O(n) dựa trên hai giả định:

1. Hai element khác loại nhau sẽ tạo ra các tree khác nhau.
2. Developer có thể gợi ý tại các child element để có thể ổn định trên các hiển thị khác nhau bằng một `key` prop.

Trong thực tế, những giả định này có giá trị đối với hầu hết các trường hợp sử dụng thực tế.

## The Diffing Algorithm {#the-diffing-algorithm}

Khi hai tree khác nhau, React đầu tiên sẽ so sánh hai root element. Hành vi khác nhau tùy thuộc vào loại của các root element.

### Elements Of Different Types (Khác loại) {#elements-of-different-types}

Bất cứ khi nào các root element có nhiều loại khác nhau, React sẽ phá bỏ tree cũ và xây dựng tree mới từ đầu. Đi từ `<a>` đến `<img>`, hoặc từ `<Article>` đến `<Comment>`, hoặc từ `<Button>` đến `<div>` - bất kỳ điều gì trong số đó sẽ dẫn đến việc xây dựng lại toàn bộ.

Khi phá bỏ một tree, các DOM node cũ sẽ bị destroy (phá hủy). Component instances nhận `componentWillUnmount()`. Khi xây dựng một tree mới, các DOM node mới sẽ được chèn vào DOM. Component instances nhận `UNSAFE_componentWillMount()` và sau đó là `componentDidMount()`. Bất kỳ state nào gắn với tree cũ đều sẽ bị mất đi.

Bất kỳ component nào bên dưới root cũng sẽ bị unmounted (ngắt kết nối) và state của chúng sẽ bị destroy. Ví dụ, khi diffing:

```xml
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

Thao tác này sẽ destroy `Counter` cũ và remount (gắn lại) một `Counter` mới.

>Ghi chú:
>
>Các method này được coi là legacy (đã lỗi thời) và bạn nên [tránh chúng](/blog/2018/03/27/update-on-async-rendering.html) trong code mới:
>
>- `UNSAFE_componentWillMount()`

### DOM Elements Of The Same Type (Cùng loại) {#dom-elements-of-the-same-type}

Khi so sánh hai React DOM element cùng loại, React sẽ xem xét các attribute (thuộc tính) của cả hai, giữ cùng một DOM node cơ bản và chỉ cập nhật các attribute đã thay đổi. Ví dụ:

```xml
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

Bằng cách so sánh hai element này, React biết chỉ sửa đổi `className` trên DOM node bên dưới.

Khi cập nhật `style`, React cũng chỉ cập nhật các property (thuộc tính) đã thay đổi. Ví dụ:

```xml
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}} />
```

Khi chuyển đổi giữa hai element này, React biết chỉ sửa đổi `color` màu chứ không phải `fontWeight`.

Sau khi xử lý DOM node, React sau đó sẽ lặp lại trên các children (phần tử con).

### Component Elements Of The Same Type {#component-elements-of-the-same-type}

Khi một component được cập nhật, trường hợp vẫn như cũ, thì state đó được duy trì qua các lần render (hiển thị). React cập nhật các prop của các component instance bên dưới để khớp với element mới và gọi `UNSAFE_componentWillReceiveProps()`, `UNSAFE_componentWillUpdate()` và `componentDidUpdate()` trên cá thể bên dưới.

Tiếp theo, `render()` method được gọi và thuật toán diff lặp lại trên kết quả trước đó và kết quả mới.

>Ghi chú:
>
>Các method này được coi là legacy (đã lỗi thời) và bạn nên [tránh chúng](/blog/2018/03/27/update-on-async-rendering.html) trong code mới:
>
>- `UNSAFE_componentWillUpdate()`
>- `UNSAFE_componentWillReceiveProps()`

### Recursing On Children {#recursing-on-children}

Theo mặc định, khi recursing (đệ quy) trên các children của một DOM node, React chỉ lặp lại trên cả hai danh sách children cùng một lúc và tạo ra một sự biến đổi bất cứ khi nào thấy sự khác biệt.

Ví dụ: khi thêm một element vào cuối phần tử children, việc chuyển đổi giữa hai tree này hoạt động tốt:

```xml
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

React sẽ so sánh và thấy khớp giữa hai tree `<li>first</li>`, tương tự hai tree `<li>second</li>` và sau đó chèn tree `<li>third</li>`.

Nếu bạn triển khai nó một cách ngây thơ, đơn thuần thì việc chèn một element vào đầu sẽ có thể gây ra hiệu suất kém hơn. Ví dụ: chuyển đổi giữa hai tree này đang hoạt động kém:

```xml
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

React sẽ thay đổi mọi child thay vì nhận ra rằng nó có thể giữ nguyên các subtree `<li>Duke</li>` và `<li>Villanova</li>`. Sự kém hiệu quả này có thể là một vấn đề.

### Keys {#keys}

Để giải quyết vấn đề này, React hỗ trợ một `key` attribute. Khi children có key, React sử dụng key để ghép những children ở tree ban đầu với những children ở tree tiếp theo. Ví dụ: thêm một `key` vào từ ví dụ kém hiệu quả của chúng tôi ở trên có thể làm cho việc chuyển đổi tree trở nên có hiệu quả hơn:

```xml
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

Bây giờ React biết rằng element có key `'2014'` là element mới và các element có key `'2015'` và `'2016'` vừa mới di chuyển.

Trong thực tế, việc tìm một key thường không khó. Element bạn sắp hiển thị có thể đã có một ID duy nhất, vì vậy, key có thể đến từ data (dữ liệu) của bạn:

```js
<li key={item.id}>{item.name}</li>
```

Khi không phải như vậy, bạn có thể thêm property ID mới vào model của mình hoặc dùng cách băm một số phần nội dung để tạo key. Key phải là duy nhất trong số các element đồng cấp của nó, tuy nhiên nó không yêu cầu phải là duy nhất trên global.

Phương án cuối cùng, bạn có dùng index của một item trong array (mảng) làm key. Điều này có thể hoạt động tốt nếu các mục không bao giờ được sắp xếp lại, nhưng nếu phải sắp xếp lại thì sẽ rất chậm.

Việc sắp xếp lại cũng có thể gây ra sự cố với component state khi các index được sử dụng làm key. Các component instance được cập nhật và sử dụng lại dựa trên key của chúng. Nếu key là một index, việc di chuyển một item sẽ thay đổi nó. Do đó, component state cho những thứ như input không được kiểm soát có thể bị trộn lẫn và cập nhật theo những cách không mong muốn.

Dưới đây là [ví dụ về các sự cố có thể gây ra khi sử dụng index làm key](codepen://reconciliation/index-used-as-key) trên CodePen và đây là [phiên bản cập nhật của cùng một ví dụ cho thấy cách không sử dụng index làm key sẽ khắc phục các vấn đề reordering, sorting và prepending](codepen://reconciliation/no-index-used-as-key).

## Tradeoffs {#tradeoffs}

Điều quan trọng cần nhớ là reconciliation algorithm là một implementation detail. React có thể rerender toàn bộ ứng dụng trên mọi action; kết quả cuối cùng sẽ giống nhau. Nói dễ hiểu hơn, rerender trong ngữ cảnh này có nghĩa là gọi `render` cho tất cả các component, nó không có nghĩa là React sẽ unmount (ngắt kết nối) và remount (gắn kết lại) chúng. Nó sẽ chỉ áp dụng những điểm khác biệt theo các quy tắc đã nêu trong các phần trước.

Chúng tôi thường xuyên tinh chỉnh phương pháp phỏng đoán để làm cho các trường hợp sử dụng phổ biến nhanh hơn. Trong triển khai hiện tại, trên thực tế bạn có thể thấy rằng một subtree đã được di chuyển giữa các anh chị em của nó, nhưng bạn không thể nói rằng nó đã di chuyển đến một nơi khác. Thuật toán sẽ rerender đầy đủ subtree đó.

Bởi vì React dựa trên heuristics, nếu các giả định đằng sau chúng không được đáp ứng, hiệu suất sẽ bị ảnh hưởng.

1. Algorithm sẽ không cố gắng so khớp các subtree của các loại component khác nhau. Nếu bạn thấy mình xen kẽ giữa hai loại component có output rất giống nhau, bạn có thể muốn đặt nó cùng một loại. Trong thực tế, chúng tôi không thấy đây là một vấn đề.

2. Các key phải ổn định, dễ đoán và duy nhất. Các key không ổn định (như key được tạo bởi `Math.random()`) sẽ khiến nhiều phiên bản component và DOM node được tạo lại một cách không cần thiết, điều này có thể gây suy giảm hiệu suất và mất state bên trong các child component.
