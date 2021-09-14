---
id: thinking-in-react
title: Tư duy trong React
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

Theo ý kiến cá nhân, React là cách tốt nhất để xây dựng những ứng dụng Web lớn một cách nhanh chóng. Nó được sử dụng rộng rãi cho Facebook và Instagram.

Một trong những điểm tuyệt vời của React là nó giúp bạn phát triển lối tư duy về cách xây dựng các ứng dụng. Trong tài liệu này, chúng tôi sẽ hướng dẫn bạn quy trình xây dựng một bảng dữ liệu tìm kiếm sản phẩm bằng React.

## Bắt đầu với Mock {#start-with-a-mock}

Tưởng tượng rằng chúng ta có một JSON API và một bản mock từ người thiết kế. Bản mock trông như sau:

![Mockup](../images/blog/thinking-in-react-mock.png)

Dữ liệu trả về từ JSON API như sau:

```
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## Bước 1: Chia giao diện người dùng thành các component {#step-1-break-the-ui-into-a-component-hierarchy}

Điều đầu tiên cần làm là khoanh tròn và đặt tên cho tất cả các component (và cả component con) trong bản mock. Thảo luận với người thiết kế, họ có thể đã đặt tên cho chúng. Tên của các layer trong bản vẽ photoshop có thể thành tên các react component của bạn!

Nhưng làm thế nào để chia nhỏ giao diện thành những component? Hãy sử dụng những kỹ thuật khi quyết định nên viết thêm một hàm hay tạo ra một object mới. Một trong những kỹ thuật đó là [nguyên tắc đơn nhiệm](https://en.wikipedia.org/wiki/Single_responsibility_principle)

Vì mô hình dữ liệu thường hiển thị dưới dạng chuỗi JSON, nếu mô hình của bạn được thực hiện đúng, giao diện người dùng (và vì thế cấu trúc component) sẽ hoàn toàn tương thích. Đó là bởi vì giao diện người dùng và mô hình dữ liệu thường có xu hướng tuân thủ cùng một kiểu *thông tin kiến trúc*, có nghĩa rằng bạn sẽ không phải dành nhiều thời gian cho việc chia nhỏ giao diện người dùng. Mỗi component sẽ tượng trưng cho một phần mô hình dữ liệu.

![Sơ đồ Component](../images/blog/thinking-in-react-components.png)

Trong ứng dụng dưới đây, bạn sẽ thấy chúng ta có 5 component, dữ liệu mà mỗi component hiển thị sẽ được in nghiêng
  1. **`FilterableProductTable` (orange):** chứa toàn bộ cả ứng dụng
  2. **`SearchBar` (blue):** nơi *người dùng nhập từ khoá tìm kiếm*
  3. **`ProductTable` (green):** lọc và hiển thị *kết quả* dựa trên *từ khoá tìm kiếm*
  4. **`ProductCategoryRow` (turquoise):** hiển thị trương mục theo *thể loại*
  5. **`ProductRow` (red):** hiển thị *sản phẩm* theo từng dòng

Nếu nhìn vào `ProductTable`, bạn sẽ thấy rằng tiêu đề cuả bảng (bao gồm những tiêu đề như "Name" và "Price") không được chia nhỏ thành các component. Đây là một tuỳ chọn mang tính cá nhân, đã có những cuộc thảo luận về vấn đề này. Trong ví dụ, chúng ta để nó như là một phần của `ProductTable` bởi vì nó là một phần khi hiển thị *bảng dữ liệu* thuộc về `ProductTable`. Tuy nhiên, nếu như phần tiêu đề trở nên phức tạp (ví dụ nếu chúng ta thêm chức năng sắp xếp phân loại), thì tất nhiên sẽ hơp lí hơn khi có component `ProductTableHeader` cho phần tiêu đề.

Bây giờ khi xác định các component trong bản mock, hãy sắp xếp nó theo một hệ thống phân chia cấp bậc. Những component cùng nằm bên trong một component trong bản mock thì nó nên là component con trong hệ thống cấp bậc:

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## Bước 2: Xây dựng một bản tĩnh trong React {#step-2-build-a-static-version-in-react}

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">Xem Pen <a href="https://codepen.io/gaearon/pen/BwWzwm">Tư duy trong React: bước 2</a> trên <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Bây giờ bạn đã có hệ thống cấp bậc cho component của bạn, đã đến lúc hoàn thiện ứng dụng. Cách dễ nhất là xây dựng một phiên bản để hiển thị mô hình dữ liệu và giao diện người dùng của bạn mà không tương tác với nhau. Đây là cách tốt nhất để phân chia các tiến trình này bởi vì xây dựng một phiên bản tĩnh yêu cầu rất nhiều công sức để đánh máy thủ công mà không cần suy nghĩ. Nhưng khi thêm chức năng tương tác thì nó lại yêu cầu ra theo hướng ngược lại, chúng ta sẽ xem xét tại sao lại như vậy.

Để xây dựng một phiên bản tĩnh của ứng dụng để hiển thị mô hình dữ liệu, bạn nên tạo ra các component tái sử dụng và truyền dữ liệu vào bằng *props*. *props* là cách để truyền dữ liệu từ component cha sang component con. Nếu như bạn đã làm quen với khái niệm của *state*, **đừng sử dụng state** để xây dựng một phiên bản tĩnh. State được sử dụng trong trường hợp cần tương tác, khi dữ liệu thay đổi theo thời gian. Bởi vì đây là phiên bản tĩnh của ứng dụng nên bạn sẽ không cần nó.

Bạn có thể tạo ra theo chiều từ trên xuống dưới hoặc ngược lại. Điều đó có nghĩa, bạn có thể bắt đầu với những component ở phía trên của hệ thống phân chia cấp bậc (ví dụ bắt đầu với `FilterableProductTable`) hoặc với những component con của nó (`ProductRow`). Trong những ví dụ đơn giản, thường thì nó sẽ đi theo chiều từ trên xuống dưới, và trong những dự án lớn thường sẽ dễ dàng hơn nếu làm theo hướng ngược lại và song song là viết test cho nó.

Sau khi kết thúc, bạn sẽ có những thư viện có thể tái sử dụng để hiển thị mô hình dữ liệu. Những component sẽ chỉ có hàm `render()` vì đây là phiên bản tĩnh. Component ở phía trên của hệ thống phân chia cấp bậc (`FilterableProductTable`) sẽ nhận kiểu dữ liệu bằng prop. Nếu dữ liệu được thay đổi và hàm `ReactDOM.render()` được gọi lại, thì giao diện người dùng sẽ được cập nhật. Điều này sẽ giúp cho ta hiểu làm thế nào giao diện người dùng được cập nhật dễ dàng hơn và dữ liệu bị thay đổi ở đâu bởi vì nó không bị phức tạp hoá. React **luồng dữ liệu một chiều** (hay còn gọi *ràng buộc một chiều*) giữ cho mọi thứ được phân chia theo module và nhanh gọn.

Tham khảo [tài liệu React](/docs/) nếu như bạn cần trợ giúp để thực hiện bước này.

### Bản tóm tắt ngắn gọn: Props và State {#a-brief-interlude-props-vs-state}

Có 2 kiểu "mô hình" dữ liệu trong React: props và state. Hiểu ra sự khác biệt giữa prop và state là điều rất quan trọng; Tham khảo [Những tài liệu từ React](/docs/state-and-lifecycle.html) nếu bạn thực sự không hiểu ra sự khác biệt đó. Xem thêm phần [FAQ: Sự khác nhau giữa prop và state là gì?](/docs/faq-state.html#what-is-the-difference-between-state-and-props)

## Bước 3: Xác định các trạng thái hoàn chỉnh nhỏ nhất của giao diện người dùng {#step-3-identify-the-minimal-but-complete-representation-of-ui-state}

Để làm cho giao diện người dùng tương tác, bạn cần có khả năng để kích hoạt những thay đổi đối với mô hình dữ liệu cơ bản. React làm điều đó một cách dễ dàng bằng **state**.

Để xây dựng ứng dụng của bạn một cách chuẩn xác, đầu tiên cần suy nghĩ về một tập hợp tối thiểu các state có khả năng thay đổi trong ứng dựng. Trọng điểm là [DRY: *Không lập lại*](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) Xác định tập hợp này và tính toán những yêu cầu khác. Ví dụ, bạn tạo ra một danh sách TODO, không nên dùng state để đếm phần tử của mảng TODO. Thay vào đó khi in ra số lượng TODO, chỉ cần tính độ dài của mảng TODO.

Suy tính về các thành phần dữ liệu trong ví dụ ứng dựng, nó bao gồm:

  * Danh sách gốc các sản phẩm
  * Từ khoá tìm kiếm từ phía người dùng
  * Giá trị của checkbox
  * Danh sách sản phẩm sau khi phân loại

Hãy cùng tìm hiểu xem thành phần nào là trạng thái bằng cách đặt ra 3 câu hổi cho mỗi phần:

  1. Có phải nó được truyền từ component cha qua props không? Nếu có thì nó có thể không phải là state.
  2. Dữ liệu có thay đổi không? nếu không thì nó không phải là state.
  3. Bạn có thể tính toán nó từ các state hay props khác trong component cuả bạn không? nếu có thì nó không phải là state.

Danh sách gốc của sản phẩm được truyền vào thông qua props, vậy nó không phải state. Từ khoá tìm kiếm và checkbox có vẻ là state bởi vì chúng sẽ bị thay đổi và không thể tính toán dựa trên phần còn lại. Cuối cùng, danh sách phân loại sản phẩm không phải là state bởi vì nó có thể được tìm ra dựa vào danh sách gốc với từ khoá tìm kiếm và giá trị của checkbox.

Cuối cùng, state của chúng ta là:

  * Từ khoá tìm kiếm người dùng nhập vào
  * Giá trị của checkbox

## Bước 4: Xác định state của bạn ở đâu {#step-4-identify-where-your-state-should-live}

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">Xem ví dụ Pen <a href="https://codepen.io/gaearon/pen/qPrNQZ">Tư duy trong React: Bước 4</a> on <a href="https://codepen.io">CodePen</a>.</p>

Chúng ta đã xác định được tập hợp tối thiểu các state của ứng dụng . Tiếp theo chúng ta cần suy nghĩ component nào sẽ thay đổi, hoặc sở hữu, state này.

Lưu ý: React truyền dữ liệu một chiều xuống trong hệ thống phân chia cấp bậc component. Nó có thể không rõ ràng ngay lập tức rằng component nào nên có state của riêng nó. **Đây thường là phần thử thách nhất cho những người mới bắt đầu để hiểu,** hãy theo những bước sau để tìm hiểu:

Cho mỗi phần của state trong ứng dụng của bạn:

  * Xác định tất cả các component sẽ hiển thị dựa trên state.
  * Tìm ra một component cha ( component ở phía trên các component cần state ở trong hệ thống phân chia cấp bậc).
  * Hoặc là component cha hay component khác ở phía trên nên giữ state.¨
  * Nếu bạn không thể tìm ra component hợp lí, thì hãy tạo ra một component mới nắm giữ state và thêm nó vào trong hệ thông phân chia cấp bậc ở phía trên component cha.

Hãy cùng điểm lại kế hoạch cho ứng dụng của chúng ta:

  * `ProductTable` cần lọc danh sách các sản phẩm dựa trên state và `SearchBar` cần hiển thị từ khoá tìm kiếm và state đã được lựa chọn.
  * Component cha là `FilterableProductTable`.
  * Theo lí thuyết thì từ khoá tìm kiếm và giá trị lưạ chọn nên nằm trong `FilterableProductTable`.

Vậy chúng ta đã quyết định rằng state của chúng ta sẽ nằm trong `FilterableProductTable`. Đầu tiên, thêm một thuộc tính của instance `this.state = {filterText: '', inStockOnly: false}` vào hàm khởi tạo của `FilterableProductTable` để khai báo trạng thái ban đầu của ứng dụng. Sau đó, truyền các tham số `filterText` và `inStockOnly` tới `ProductTable` và `SearchBar` như là một prop. Cuối cùng, sử dụng những props này để lọc những hàng ở trong `ProductTable` và gán những giá trị vào các trường của form trong `SearchBar`.

Bạn có thể bắt đầu thấy ứng dụng của bạn hoạt động ra sao: gán `"ball"` vào `filterText` và refresh lại ứng dụng. Bạn sẽ thấy rằng các dữ liệu của bảng được cập nhật chính xác.

## Bước 5: Cập nhật dữ liệu theo chiều ngược lại {#step-5-add-inverse-data-flow}

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen">Xem Pen <a href="https://codepen.io/gaearon/pen/LzWZvb">Tư duy trong React: Bước 5</a> tại <a href="https://codepen.io">CodePen</a>.</p>

Cho đến giờ, chúng ta đã xây dựng một ứng dụng để hiển thị chính xác các giá trị của props và state từ trên xuống dưới trong hệ thống phân chia cấp bậc. Giờ là lúc để làm cho luồng dữ liệu có thể vận chuyển theo hướng ngược lại: những component form ở phía dưới cần cập nhật trạng thái cho `FilterableProductTable`.

React làm cho luồng dữ liệu trở nên rõ ràng và dễ hiểu hơn chương trình của bạn hoạt động ra sao, nhưng nó cũng yêu cầu gõ nhiều hơn so với kiểu binding dữ liệu hai chiều truyền thống.

Nếu bạn thử gõ hoặc lựa chọn giá trị trong ví dụ hiện thời, bạn sẽ thấy rằng React bỏ qua những giá trị đầu vào này. Điều này sảy ra có chủ ý, vì chúng ta gán `value` prop của `input` luôn luôn bằng với `state` truyền từ `FilterableProductTable`.

Hãy nghĩ xem chúng ta muốn thực hiện điều gì. Chúng ta muốn chắc chắn rằng khi nào người dùng thay đổi form, chúng ta cập nhật state dựa trên dữ liệu đầu vào. Vì những component chỉ nên cập nhật state cuả chúng, `FilterableProductTable` sẽ truyền vào callbacks tới `SearchBar` để kích hoạt mỗi khi dữ liệu cần cập nhật. Chúng ta có thể sử dụng sự kiện `onChange` trong input để nhận được thông báo. Callbacks truyền xuống bởi `FilterableProductTable` sẽ gọi hàm `setState()`, và ứng dụng sẽ được cập nhật.

Mặc dù nó nghe phức tạp, nhưng thật ra chỉ cần vài dòng lệnh. Và nó chỉ ra rất rõ ràng luồng dữ liệu được truyền đi trong ứng dụng như thế nào.

## Và kết thúc {#and-thats-it}

Hy vọng rằng nó sẽ cho bạn một ý tưởng về cách tư duy khi tạo ra những component và ứng dụng với React. Trong khi nó yêu cầu phải gõ nhiều hơn bạn từng làm, nhưng code này rất rõ ràng và dễ đọc. Khi bạn bắt đầu xây dựng những thư viện component lớn, bạn sẽ thấy sự hữu dụng khi đọc những code module hoá và rõ ràng, thêm nữa số lượng code sẽ giảm xuống khi code được tái sử dụng .
