---
id: testing
title: Testing Overview
permalink: docs/testing.html
redirect_from:
  - "community/testing.html"
next: testing-recipes.html
---

Bạn có thể test các React components tương tự như việc test những code Javascript khác.

Có một số cách để testing các React component. Nói chung, chúng được chia thành 2 loại như sau:

* **Rendering những cây component** trong một môi trường test được đơn giản hóa và khẳng định trên kết quả đầu ra của chúng.
* **Chạy một ứng dụng hoàn chỉnh** trong một môi trường trình duyệt thực tế (hay còn được gọi là “end-to-end” tests).

Phần tài liệu này tập trung vào chiến lược testing cho trường hợp đầu tiên. Mặc dù các end-to-end tests đầy đủ có thể rất hữu ích để ngăn ngừa sự hồi quy
đối với những luồng làm việc quan trọng, nhưng các tests đó không liên quan đến các React component nói chung, và nằm ngoài phạm vi của phần này.

### Những đánh đổi {#tradeoffs}


Khi lựa chọn những công cụ kiểm tra, cần cân nhắc một số đánh đổi sau:

* **Tốc độ lặp lại so với với môi trường thực tế:** Một số công cụ cung cấp một vòng lặp phản hồi rất nhanh giữa việc thực hiện một thay đổi và xem xét kết quả,
nhưng không mô hình hóa chính xác hành vi của trình duyệt. Các công cụ khác có thể sử dụng một môi trường trình duyệt thực tế, nhưng lại giảm tốc độ lặp lại và dễ
bị phá vỡ hơn trên một máy chủ tích hợp liên tục.
* **Mô phỏng bao nhiêu:** Với các components, sự khác biệt giữa một "đơn vị" test và "tập hợp" test có thể bị lu mờ. Nếu bạn đang thử nghiệm trên một 
form, liệu việc kiểm tra nó có nên kiểm tra luôn các button bên trong nó hay không? Hoặc một button component có nên có cho nó một bộ test riêng hay không? Liệu việc 
tái cấu trúc một button có làm phá vỡ form test?

Những câu trả lời khác nhau có thể phù hợp cho những team và những sản phẩm khác nhau.

### Những công cụ được đề xuất {#tools}

**[Jest](https://facebook.github.io/jest/)** là một trình chạy thử nghiệm cho phép bạn truy cập vào DOM thông qua [`jsdom`](/docs/testing-environments.html#mocking-a-rendering-surface). Trong đó jsdom chỉ là một ước tính về cách mà trình duyệt hoạt động, nó thường đủ tốt để kiểm tra React components. Jest cung cấp
một tốc độ lặp lại tuyệt vời kết hợp với các tính năng mạnh mẽ như [modules](/docs/testing-environments.html#mocking-modules) mô phỏng (mocking) và một [timers](/docs/testing-environments.html#mocking-timers) cho phép bạn có thể kiểm soát nhiều hơn cách mà một mã code được thực thi. 

**[React Testing Library](https://testing-library.com/react)** là tập hợp các trình trợ giúp cho phép bạn test React components mà không cần dựa vào các chi tiết triển 
khai của họ. Cách tiếp cận này giúp cho việc tái cấu trúc trở nên một cách dễ dàng và cũng thúc đẩy bạn hướng tới các phương pháp tiếp cận hay nhất về khả năng
truy cập. Mặc dù nó không cung câp một cách "shallowly" (nông cạn - đối lập với deep) đối với render một component mà không có thành phần con của nó, một test thử nghiệm
như Jest cho phép bạn làm điều này thông qua [mocking](/docs/testing-recipes.html#mocking-modules)(mô phỏng).

### Tìm hiểu thêm {#learn-more}

Phần này được chia làm hai trang:

- [Recipes](/docs/testing-recipes.html): Các patterns thường gặp khi viết các tests cho React components.
- [Environments](/docs/testing-environments.html): Những điều cần cân nhắc khi thiết lập môi trường testing cho React components.
