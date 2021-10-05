---
id: design-principles
title: Nguyên tắc thiết kế
layout: contributing
permalink: docs/design-principles.html
prev: implementation-notes.html
redirect_from:
  - "contributing/design-principles.html"
---

Chúng tôi viết tài liệu này để bạn có ý tưởng tốt hơn về cách chúng tôi quyết định những gì React làm được và những gì React không làm được cũng như triết lý phát triển của chúng tôi như thế nào. Mặc dù chúng tôi rất vui khi nhận được nhiều sự đóng góp của cộng đồng, nhưng chúng tôi không thể chọn định hướng vi phạm một hoặc nhiều nguyên tắc này.

>**Lưu ý:**
>
>Tài liệu này giả định rằng bạn đã hiểu rõ về React. Nó mô tả các nguyên tắc thiết kế của * bản thân React*, không phải các thành phần của React hay các ứng dụng của nó.
>
>Để xem giới thiệu về React, hãy xem [Tư duy trong React](/docs/thinking-in-react.html) instead.

### Kết hợp - Composition {#composition}

Đặc điểm chính của React là sự kết hợp của các component. Các component được viết bởi những người khác nhau nên hoạt động ăn khớp với nhau. Điều quan trọng đối với chúng tôi là bạn có thể thêm chức năng vào một component mà không gây ra những thay đổi ảnh hưởng cho cả codebase.

Ví dụ, có thể đưa thêm một vài state vào một component mà không cần phải thay đổi bất kỳ component nào đang sử dụng nó. Tương tự như vậy, có thể thêm một một số code khởi tạo hoặc hủy bỏ vào bất kỳ component nào khi cần thiết.

Không có gì "xấu" khi sử dụng các state và lifecycle method trong các component. Giống như bất kỳ tính năng mạnh mẽ nào, chúng nên được sử dụng ở mức độ vừa phải, nhưng chúng tôi không có ý định loại bỏ chúng. Ngược lại, chúng tôi nghĩ rằng chúng là một phần không thể thiếu làm cho React trở nên hữu ích. Chúng tôi có thể kích hoạt [nhiều mẫu chức năng hơn](https://github.com/reactjs/react-future/tree/main/07%20-%20Returning%20State) trong tương lai, nhưng cả local state và lifecycle method sẽ là một phần của mô hình đó.

Các component thường được mô tả như "chỉ là những function", nhưng theo quan điểm của chúng tôi chúng cần phải có nhiều hơn thế để trở nên hữu ích. Trong React, các component mô tả bất kỳ behavior có thể kết hợp nào và điều này bao gồm rendering, lifecycle và state. Một số thư viện bên ngoài như các component tăng cường [Relay](https://facebook.github.io/relay/) với các trách nhiệm khác như mô tả các phụ thuộc dữ liệu. Có thể các ý tưởng đó sẽ quay trở lại React ở một số hình thức.

### Common Abstraction {#common-abstraction}

Nói chung, chúng tôi [chống lại việc thêm các tính năng](https://www.youtube.com/watch?v=4anAwXYqLG8) có thể được triển khai trong môi trường của người dùng. Chúng tôi không muốn lấp đầy ứng dụng của bạn bằng những mã thư viện vô dụng. Tuy nhiên, có những ngoại lệ cho điều này.

Ví dụ, nếu React không cung cấp hỗ trợ cho các phương thức vòng đời hoặc các state cục bộ, mọi người sẽ tự tùy chỉnh các abstraction cho chúng. Khi có nhiều abstraction cạnh tranh, React không thể thực thi hoặc tận dụng các thuộc tính của một trong số chúng. Nó phải làm việc với "mẫu chung thấp nhất".

Đây là lý do tại so đôi khi chúng tôi thêm các tính năng vào chính React. Nếu chúng tôi nhận thấy rằng nhiều component triển khai một tính năng nhất định theo những cách không tương tích hoặc không hiệu quả với nhau, chúng tôi có thể thích đưa nó vào React. Chúng tôi không làm điều đó một cách nhẹ nhàng. Khi chúng tôi làm điều đó, đó là vì chúng tôi tự tin rằng việc nâng cao mức độ abstraction sẽ mang lại lợi ích cho toàn bộ hệ sinh thái. State, các phương thức vòng đời, chuẩn hóa sự kiện trên nhiều trình duyệt là những ví dụ điển hình về điều này. 

Chúng tôi luôn thảo luận về các đề xuất cải tiến như vậy với cộng đồng. Bạn có thể tìm thấy một số cuộc thảo luận đó theo nhãn ["big picture"](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"Type:+Big+Picture") trên trình theo dõi issue của React.

### Escape Hatches {#escape-hatches}

React là thực dụng. Nó được thúc đẩy bởi nhu cầu của các sản phẩm được viết tại Facebook. Mặc dù nó bị ảnh hưởng bởi một số mô hình chưa hoàn toàn chính thống như lập trình chức năng, việc duy trì khả năng tiếp cận của nhiều nhà phát triển với các kỹ năng và cấp độ kinh nghiệm khác nhau là mục tiêu rõ ràng của dự án.

Nếu chúng tôi muốn ngừng sử dụng một mẫu mà chúng tôi không thích, chúng tôi có trách nhiệm xem xét tất cả các trường hợp sử dụng hiện có cho nó và [hướng dẫn cộng đồng về các lựa chọn thay thế](/blog/2016/07/13/mixins-considered-harmful.html) trước khi chúng tôi không dùng nữa. Nếu một số mẫu hữu ích cho việc xây dựng ứng dụng khó diễn đạt theo cách khai báo, chúng tôi sẽ [cung cấp một API bắt buộc](/docs/more-about-refs.html) cho nó. Nếu chúng tôi không thể tìm ra một API hoàn hảo cho thứ gì đó mà chúng tôi thấy cần thiết trong nhiều ứng dụng, chúng tôi sẽ [cung cấp một API làm việc phụ tạm thời](/docs/legacy-context.html) miễn là có thể loại bỏ nó sau này và nó mở ra cánh cửa cho những cải tiến trong tương lai.

### Sự ổn định - Stability {#stability}

Chúng tôi coi trọng sự ổn định của API. Tại Facebook, chúng tôi có hơn 50 nghìn component sử dụng React. Nhiều công ty khác, bao gồm [Twitter](https://twitter.com/) và [Airbnb](https://www.airbnb.com/), cũng là những người dùng sử dụng nhiều React. Đây là lý do tại sao chúng tôi thường miễn cưỡng thay đổi các API hoặc hành vi công khai.

Tuy nhiên, chúng tôi nghĩ rằng sự ổn định theo nghĩa “không có gì thay đổi” được đánh giá quá cao. Nó nhanh chóng biến thành sự trì trệ. Thay vào đó, chúng tôi thích sự ổn định theo nghĩa "Nó được sử dụng nhiều trong sản xuất và khi có điều gì đó thay đổi, sẽ có một lộ trình di chuyển rõ ràng (và tốt nhất là tự động)."

Khi ngừng sử dụng một mẫu, chúng tôi sẽ nghiên cứu việc sử dụng nó nội bộ tại Facebook và thêm các cảnh báo không dùng nữa. Họ cho chúng tôi đánh giá tác động của sự thay đổi. Đôi khi chúng tôi rút lui nếu thấy rằng còn quá sớm và chúng tôi cần suy nghĩ chiến lược hơn về việc đưa các codebase đến thời điểm chúng sẵn sàng cho sự thay đổi này.

Nếu chúng tôi tin rằng thay đổi không quá gián đoạn và chiến lược di chuyển khả thi cho tất cả các trường hợp sử dụng, chúng tôi đưa ra cảnh báo không dùng nữa cho cộng đồng mã nguồn mở. Chúng tôi liên hệ chặt chẽ với nhiều người dùng React bên ngoài Facebook và chúng tôi giám sát các dự án mã nguồn mở phổ biến và hướng dẫn họ khắc phục những lỗi "không còn được dùng nữa".

Với quy mô tuyệt đối của cơ sở mã Facebook React, việc di chuyển nội bộ thành công thường là một dấu hiệu tốt cho thấy các công ty khác cũng sẽ không gặp vấn đề. Tuy nhiên, đôi khi mọi người chỉ ra các trường hợp sử dụng bổ sung mà chúng tôi chưa nghĩ đến và chúng tôi thêm các lối thoát hiểm cho họ hoặc suy nghĩ lại cách tiếp cận của mình.

Chúng tôi không loại bỏ bất cứ điều gì mà không có lý do chính đáng. Chúng tôi nhận thấy rằng đôi khi các cảnh báo về việc không dùng nữa gây ra sự thất vọng nhưng chúng tôi thêm chúng vào vì việc không dùng nữa sẽ dọn đường cho các cải tiến và tính năng mới mà chúng tôi và nhiều người trong cộng đồng cho là có giá trị.

Ví dụ: chúng tôi đã thêm [cảnh báo về unknown DOM props](/warnings/unknown-prop.html) trong React 15.2.0. Nhiều dự án đã bị ảnh hưởng bởi điều này. Tuy nhiên, việc khắc phục cảnh báo này là rất quan trọng để chúng tôi có thể giới thiệu hỗ trợ các thuộc tính tùy chỉnh cho React. Có một lý do như thế này đằng sau mọi sự không sử dụng mà chúng tôi thêm vào.

Khi chúng tôi thêm cảnh báo không dùng nữa, chúng tôi sẽ giữ nó trong phần còn lại của phiên bản chính hiện tại và [thay đổi hành vi trong phiên bản chính tiếp theo](/blog/2016/02/19/new-versioning-scheme.html). Nếu có nhiều công việc thủ công lặp đi lặp lại liên quan, chúng tôi phát hành một tập lệnh [codemod](https://www.youtube.com/watch?v=d0pOgY8__JM) để tự động hóa hầu hết các thay đổi. Codemods cho phép chúng tôi tiến về phía trước mà không bị trì trệ trong một cơ sở mã khổng lồ và chúng tôi cũng khuyến khích bạn sử dụng chúng.

Bạn có thể tìm thấy các codemod mà chúng tôi đã phát hành trong kho lưu trữ [react-codemod](https://github.com/reactjs/react-codemod).

### Khả năng tương tác - Interoperability {#interoperability}

Chúng tôi đặt giá trị cao về khả năng tương tác với các hệ thống hiện có và áp dụng dần dần. Facebook có một kho mã không phải React khổng lồ. Trang web của nó sử dụng sự kết hợp của một hệ thống thành phần phía máy chủ được gọi là XHP, các thư viện giao diện người dùng nội bộ có trước React và chính React. Điều quan trọng đối với chúng tôi là bất kỳ nhóm sản phẩm nào cũng có thể [bắt đầu sử dụng React cho một tính năng nhỏ](https://www.youtube.com/watch?v=BF58ZJ1ZQxY) thay vì viết lại mã của họ để đặt cược vào nó.

Đây là lý do tại sao React cung cấp các cửa sổ thoát - escape hatches để hoạt động với các mô hình có thể thay đổi và cố gắng hoạt động tốt cùng với các thư viện giao diện người dùng khác. Bạn có thể bao bọc giao diện người dùng bắt buộc hiện có thành một declarative component và ngược lại. Điều này là rất quan trọng để áp dụng dần dần.

### Lập lịch trình - Scheduling {#scheduling}

Ngay cả khi các component của bạn được mô tả dưới dạng các function, khi sử dụng React, bạn không gọi chúng trực tiếp. Mọi component trả về một [mô tả về những gì cần được hiển thị](/blog/2015/12/18/react-components-elements-and-instances.html#elements-describe-the-tree) và mô tả đó có thể bao gồm cả các component do người dùng viết như `<LikeButton>` và các component dành riêng cho nền tảng như `<div>`. Tùy thuộc vào việc React “giải nén” `<LikeButton>` vào một thời điểm nào đó trong tương lai và thực sự áp dụng các thay đổi cho UI tree theo kết quả hiển thị của các component một cách đệ quy.

Đây là một sự khác biệt nhỏ nhưng là một sự khác biệt mạnh mẽ. Vì bạn không gọi component function đó mà để React gọi nó, điều đó có nghĩa là React có quyền trì hoãn việc gọi nó nếu cần. Trong phần triển khai hiện tại của nó, React sẽ duyệt cây một cách đệ quy và gọi các hàm render của toàn bộ cây được cập nhật trong một lần đánh dấu. Tuy nhiên trong tương lai, nó có thể bắt đầu [trì hoãn một số bản cập nhật để tránh giảm khung hình](https://github.com/facebook/react/issues/6170).

Đây là một chủ đề phổ biến trong thiết kế React. Một số thư viện phổ biến thực hiện phương pháp tiếp cận “push” trong đó các phép tính được thực hiện khi có dữ liệu mới. Tuy nhiên, React tuân theo phương pháp “pull”, nơi các phép tính có thể bị trì hoãn cho đến khi cần thiết.

React không phải là một thư viện xử lý dữ liệu chung. Nó là một thư viện để xây dựng giao diện người dùng. Chúng tôi nghĩ rằng nó chỉ được định vị trong một ứng dụng để biết những tính toán nào phù hợp ngay bây giờ và những tính toán nào không.

Nếu một cái gì đó nằm ngoài màn hình, chúng tôi có thể trì hoãn bất kỳ logic nào liên quan đến nó. Nếu dữ liệu đến nhanh hơn tốc độ khung hình, chúng tôi có thể liên kết và cập nhật hàng loạt. Chúng tôi có thể ưu tiên công việc đến từ các tương tác của người dùng (chẳng hạn như hoạt ảnh do nhấp vào nút) hơn công việc nền ít quan trọng hơn (chẳng hạn như hiển thị nội dung mới vừa tải từ mạng) để tránh giảm khung hình.

Để rõ ràng, chúng tôi không tận dụng điều này ngay bây giờ. Tuy nhiên, quyền tự do để làm những điều như thế này là lý do tại sao chúng tôi muốn có quyền kiểm soát việc lập lịch, và tại sao `setState()` là không đồng bộ. Về mặt khái niệm, chúng tôi coi nó như là “scheduling an update”.

Chúng tôi sẽ khó kiểm soát việc lập lịch hơn nếu chúng tôi để người dùng trực tiếp soạn các chế độ xem với mô hình dựa trên “push” phổ biến trong một số biến thể của Lập trình phản ứng chức năng - [Functional Reactive Programming](https://en.wikipedia.org/wiki/Functional_reactive_programming). Chúng tôi muốn sở hữu mã "glue".

Mục tiêu chính của React là số lượng mã người dùng thực thi trước khi quay trở lại React là tối thiểu. Điều này đảm bảo rằng React vẫn giữ được khả năng lên lịch và chia nhỏ công việc theo những gì nó biết về giao diện người dùng.

Có một trò đùa nội bộ trong nhóm rằng React lẽ ra phải được gọi là "Schedule" bởi vì React không muốn hoàn toàn là "reactive".

### Kinh nghiệm của nhà phát triển - Developer Experience {#developer-experience}

Cung cấp trải nghiệm tốt cho nhà phát triển là điều quan trọng đối với chúng tôi.

Ví dụ: chúng tôi duy trì [React DevTools](https://github.com/facebook/react/tree/main/packages/react-devtools) cho phép bạn kiểm tra React component tree trong Chrome và Firefox. Chúng tôi đã thấy rằng nó mang lại sự thúc đẩy năng suất lớn cho cả các kỹ sư Facebook và cộng đồng.

Chúng tôi cũng cố gắng đi thêm một quãng đường nữa để đưa ra các cảnh báo hữu ích dành cho nhà phát triển. Ví dụ: React cảnh báo bạn trong quá trình phát triển nếu bạn lồng các thẻ theo cách mà trình duyệt không hiểu hoặc nếu bạn mắc lỗi đánh máy phổ biến trong API. Cảnh báo của nhà phát triển và các kiểm tra liên quan là lý do chính khiến phiên bản development của React chậm hơn phiên bản production.

Các mô hình sử dụng mà chúng tôi thấy trong nội bộ Facebook giúp chúng tôi hiểu những lỗi thường gặp là gì và cách phòng tránh sớm. Khi chúng tôi thêm các tính năng mới, chúng tôi cố gắng lường trước những lỗi thường gặp và cảnh báo về chúng.

Chúng tôi luôn tìm cách cải thiện trải nghiệm của nhà phát triển. Chúng tôi luôn muốn nghe các đề xuất của bạn và chấp nhận đóng góp của bạn để làm cho nó tốt hơn nữa.

### Gỡ lỗi - Debugging {#debugging}

Khi có sự cố xảy ra, điều quan trọng là bạn phải có breadcrumbs để theo dõi lỗi với nguồn của nó trong codebase. Trong React, props và state là những đường dẫn - breadcrumbs đó.

Nếu bạn thấy điều gì đó không ổn trên màn hình, bạn có thể mở React DevTools, tìm component chịu trách nhiệm hiển thị, sau đó xem liệu các prop và state có chính xác hay không. Nếu đúng như vậy, bạn biết rằng vấn đề nằm ở hàm `render()` của component hoặc một số hàm được gọi bởi `render()`. Vấn đề được cô lập.

Nếu state sai, bạn biết rằng sự cố là do một trong các lệnh gọi `setState()` trong file này gây ra. Điều này cũng tương đối đơn giản để xác định vị trí và sửa chữa vì thường chỉ có một vài lệnh gọi `setState()` trong một file duy nhất.

Nếu prop sai, bạn có thể duyệt qua tree trong inspector, tìm kiếm component đầu tiên “poisoned the well” bằng cách chuyển prop xấu xuống.

Khả năng theo dõi bất kỳ giao diện người dùng nào đến dữ liệu đã tạo ra nó dưới dạng các prop và state hiện tại là rất quan trọng đối với React. Mục tiêu thiết kế rõ ràng là state không bị “mắc kẹt” trong các closures và combinators, và có sẵn cho React trực tiếp.

Mặc dù giao diện người dùng là động, chúng tôi tin rằng các hàm `render()` đồng bộ của các prop và state biến việc gỡ lỗi từ phỏng đoán thành một thủ tục nhàm chán nhưng hữu hạn. Chúng tôi muốn giữ lại ràng buộc này trong React mặc dù nó làm cho một số trường hợp sử dụng, như hoạt ảnh phức tạp, khó hơn.

### Cấu hình - Configuration {#configuration}

Chúng tôi nhận thấy các tùy chọn cấu hình thời gian chạy toàn cầu có vấn đề.

Ví dụ: thỉnh thoảng chúng tôi được yêu cầu triển khai một hàm như `React.configure(options)` hoặc `React.register(component)`. Tuy nhiên, điều này đặt ra nhiều vấn đề và chúng tôi không biết giải pháp tốt cho chúng.

Điều gì sẽ xảy ra nếu ai đó gọi một hàm như vậy từ thư viện component của bên thứ ba? Điều gì sẽ xảy ra nếu một ứng dụng React nhúng một ứng dụng React khác và cấu hình mong muốn của chúng không tương thích? Làm cách nào để một component của bên thứ ba có thể chỉ định rằng nó yêu cầu một cấu hình cụ thể? Chúng tôi cho rằng cấu hình toàn cầu không hoạt động tốt với bố cục. Vì component là trung tâm của React, chúng tôi không cung cấp cấu hình toàn cầu trong mã.

Tuy nhiên, chúng tôi cung cấp một số cấu hình toàn cầu ở cấp độ xây dựng. Ví dụ: chúng tôi cung cấp các bản dựng development và production riêng biệt. Chúng tôi cũng có thể [thêm một bản dựng profiling](https://github.com/facebook/react/issues/6627) trong tương lai và chúng tôi sẵn sàng xem xét các cờ bản dựng khác.

### Beyond the DOM {#beyond-the-dom}

Chúng tôi thấy giá trị của React trong cách nó cho phép chúng tôi viết các component có ít lỗi hơn và soạn thảo cùng nhau tốt. DOM là mục tiêu hiển thị ban đầu cho React nhưng [React Native](https://reactnative.dev/) cũng quan trọng đối với cả Facebook và cộng đồng.

Khả năng renderer-agnostic là một hạn chế thiết kế quan trọng của React. Nó thêm một số chi phí trong các đại diện nội bộ. Mặt khác, bất kỳ cải tiến nào đối với cốt lõi đều dịch qua các nền tảng.

Việc có một mô hình lập trình duy nhất cho phép chúng tôi hình thành các nhóm kỹ thuật xoay quanh các sản phẩm thay vì các nền tảng. Cho đến nay sự đánh đổi là xứng đáng đối với chúng tôi.

### Triển khai - Implementation {#implementation}

Chúng tôi cố gắng cung cấp các API "thanh lịch" nếu có thể. Chúng tôi ít quan tâm hơn đến việc triển khai có thanh lịch hay không. Thế giới thực còn lâu mới hoàn hảo, và ở một mức độ hợp lý, chúng tôi muốn đưa đoạn mã xấu xí vào thư viện nếu điều đó có nghĩa là người dùng không phải viết nó. Khi chúng tôi đánh giá mã mới, chúng tôi đang tìm kiếm một triển khai chính xác, hiệu quả và mang lại trải nghiệm tốt cho nhà phát triển. Sự "thanh lịch" là thứ yếu.

Chúng tôi thích mã nhàm chán hơn mã thông minh. Mã dùng một lần và thường xuyên thay đổi. Vì vậy, điều quan trọng là nó [không giới thiệu những nội dung trừu tượng mới trừ khi thực sự cần thiết](https://youtu.be/4anAwXYqLG8?t=13m9s). Mã dài dòng dễ di chuyển, thay đổi và loại bỏ được ưu tiên hơn mã thanh lịch được tóm tắt quá sớm và khó thay đổi.

### Tối ưu hóa Công cụ - Optimized for Tooling {#optimized-for-tooling}

Một số API thường được sử dụng có tên dài dòng. Ví dụ: chúng tôi sử dụng `componentDidMount()` thay vì `didMount()` hoặc `onMount()`. Đây là [cố ý](https://github.com/reactjs/react-future/issues/40#issuecomment-142442124). Mục đích là làm cho các điểm tương tác với thư viện có thể nhìn thấy được.

Trong một cơ sở mã khổng lồ như Facebook, việc có thể tìm kiếm cách sử dụng các API cụ thể là rất quan trọng. Chúng tôi đánh giá cao các tên dài dòng riêng biệt và đặc biệt là các tính năng nên được sử dụng một cách tiết kiệm. Ví dụ, `dangerouslySetInnerHTML` rất khó để bỏ lỡ trong một lần review code.

Tối ưu hóa cho tìm kiếm cũng rất quan trọng vì chúng tôi phụ thuộc vào [codemods](https://www.youtube.com/watch?v=d0pOgY8__JM) để thực hiện các thay đổi đột phá. Chúng tôi muốn việc áp dụng các thay đổi tự động rộng lớn trên cơ sở mã trở nên dễ dàng và an toàn và các tên dài dòng duy nhất giúp chúng tôi đạt được điều này. Tương tự như vậy, các tên riêng biệt giúp bạn dễ dàng viết các quy tắc [lint rules](https://github.com/yannickcr/eslint-plugin-react) tùy chỉnh về cách sử dụng React mà không phải lo lắng về khả năng sai sót.

[JSX](/docs/introducing-jsx.html) đóng một vai trò tương tự. Mặc dù nó không bắt buộc với React, nhưng chúng tôi sử dụng nó rộng rãi trên Facebook cả vì lý do thẩm mỹ và thực dụng.

Trong codebase của chúng tôi, JSX cung cấp một gợi ý rõ ràng cho các công cụ mà chúng đang xử lý với React element tree. Điều này giúp bạn có thể thêm các tính năng tối ưu hóa thời gian xây dựng như [hoisting constant elements](https://babeljs.io/docs/en/babel-plugin-transform-react-constant-elements/), sử dụng thành phần nội bộ codemod và lint an toàn, đồng thời đưa [vị trí source JSX](https://github.com/facebook/react/pull/6771) vào các cảnh báo.

### Dogfooding {#dogfooding}

Chúng tôi cố gắng hết sức để giải quyết các vấn đề do cộng đồng nêu ra. Tuy nhiên, chúng tôi có khả năng ưu tiên các vấn đề mà mọi người *cũng* đang gặp phải trong nội bộ Facebook. Có lẽ theo trực giác, chúng tôi nghĩ rằng đây là lý do chính tại sao cộng đồng có thể đặt cược vào React.

Việc sử dụng nội bộ nhiều mang lại cho chúng tôi niềm tin rằng React sẽ không biến mất vào ngày mai. React được tạo ra tại Facebook để giải quyết các vấn đề của nó. Nó mang lại giá trị kinh doanh hữu hình cho công ty và được sử dụng trong nhiều sản phẩm của công ty. [Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) nó có nghĩa là tầm nhìn của chúng tôi luôn nhạy bén và chúng tôi có hướng tập trung trong tương lai.

Điều này không có nghĩa là chúng tôi phớt lờ các vấn đề mà cộng đồng đưa ra. Ví dụ: chúng tôi đã thêm hỗ trợ cho các [web components](/docs/webcomponents.html) và [SVG](https://github.com/facebook/react/pull/6243) cho React mặc dù chúng tôi không dựa vào một trong hai thành phần nội bộ. Chúng tôi đang tích cực [lắng nghe những điểm khó khăn của bạn](https://github.com/facebook/react/issues/2686) and [address them](/blog/2016/07/11/introducing-reacts-error-code-system.html) và giải quyết chúng trong khả năng tốt nhất của chúng tôi. Cộng đồng là điều làm cho React trở nên đặc biệt đối với chúng tôi và chúng tôi rất vinh dự được đóng góp lại.

Sau khi phát hành nhiều dự án mã nguồn mở tại Facebook, chúng tôi đã học được rằng cố gắng làm cho mọi người hài lòng đồng thời đã tạo ra các dự án có trọng tâm kém và không phát triển tốt. Thay vào đó, chúng tôi nhận thấy rằng việc chọn một lượng nhỏ khán giả và tập trung vào việc làm cho họ hài lòng sẽ mang lại hiệu ứng tích cực. Đó chính xác là những gì chúng tôi đã làm với React và cho đến nay việc giải quyết các vấn đề mà các nhóm sản phẩm của Facebook gặp phải đã được chuyển sang cộng đồng nguồn mở.

Nhược điểm của phương pháp này là đôi khi chúng tôi không tập trung đủ vào những thứ mà nhóm Facebook không phải giải quyết, chẳng hạn như trải nghiệm "getting started". Chúng tôi nhận thức sâu sắc về điều này và chúng tôi đang nghĩ cách cải tiến theo cách có lợi cho mọi người trong cộng đồng mà không mắc phải những sai lầm như chúng tôi đã làm với các dự án mã nguồn mở trước đây.
