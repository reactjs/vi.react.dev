---
id: testing-environments
title: Testing Environments
permalink: docs/testing-environments.html
prev: testing-recipes.html
---

<!-- This document is intended for folks who are comfortable with JavaScript, and have probably written tests with it. It acts as a reference for the differences in testing environments for React components, and how those differences affect the tests that they write. This document also assumes a slant towards web-based react-dom components, but has notes for other renderers. -->

Tài liệu này sẽ cho bạn biết các yếu tố có thể ảnh hưởng đến môi trường của bạn và đưa ra các gợi ý cho một số trường hợp.

### Trình kiểm thử {#test-runners}

Trình kiểm thử (có thể hiểu là test runner) giống như [Jest](https://jestjs.io/), [mocha](https://mochajs.org/), [ava](https://github.com/avajs/ava) cho phép bạn viết các bộ test thử với JavaScript, và chạy chúng như một phần của quá trình bạn phát triển ứng dụng. Ngoài ra, test được chạy như một phần của "continuous integration" (được biết như CI/CD).

- Jest tương thích rộng rãi với các dự án React, hỗ trợ các tính năng "mocked" như [modules](#mocking-modules) và [timers](#mocking-timers), và hỗ trợ [`jsdom`](#mocking-a-rendering-surface). **Nếu bạn dùng Create React App, [Jest đã được bao gồm trong "box"](https://facebook.github.io/create-react-app/docs/running-tests) với các giá trị có lợi và mặc định.**
- Những thư viện như [mocha](https://mochajs.org/#running-mocha-in-the-browser) hoạt động tốt trong môi trường trình duyệt thực (có thể hiểu như là trình phiên dịch javascript của các trình duyệt như Chrome, Firefox, Edge,...), và có thể giúp ích cho các "test case" cần nó.
- Các test đầu cuối được sử dụng để kiểm tra các luồng dài (có thể hiểu là phức tạp) hơn trên nhiều trang, và yêu cầu một [cài đặt khác](#end-to-end-tests-aka-e2e-tests).

### "Mocking" một sự biểu diễn giao diện {#mocking-a-rendering-surface}

Các test thường chạy trong môi trường không có quyền truy cập vào trình "render" thực như trình duyệt. Đối với những môi trường này, chúng tôi khuyên bạn nên giả lập một browser với [`jsdom`](https://github.com/jsdom/jsdom), một browser được triển khai nhẹ chạy bên trong Node.js.

Trong hầu hết các trường hợp, jsdom hoạt động như một browser thông thường, nhưng không có các tính năng như [bố cục và điều hướng](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform). Điều này vẫn hữu ích cho hầu hết các component test dựa trên web, vì nó chạy nhanh hơn so với việc phải khởi động browser cho mỗi lần kiểm tra. Nó cũng chạy trong cùng một quy trình với các test của bạn, vì vậy bạn có thể viết code để kiểm tra và xác nhận trên DOM được hiển thị.

Giống như một browser thật, jsdom cho phép chúng ta lập mô hình tương tác của người dùng; test có thể gửi các sự kiện trên các nút(nodes) DOM, sau đó quan sát và khẳng định về tác dụng phụ của những hành động này [<small>(example)</small>](/docs/testing-recipes.html#events).

Một phần lớn UI test có thể được viết với cấu hình sau: sử dụng Jest như một "test runner", render tới jsdom, với các tương tác của người dùng được chỉ định dưới dạng chuỗi sự kiện của browser, được cung cấp bởi `act()` [<small>(example)</small>](/docs/testing-recipes.html). Ví dụ, rất nhiều test của riêng React được viết bằng sự kết hợp này.

Nếu bạn đang viết một thư viện kiểm tra hành vi chủ yếu của một browser cụ thể, và yêu cầu hành vi của trình duyệt gốc như bố cục hoặc đầu vào thực, bạn có thể sử dụng một framework như là [mocha.](https://mochajs.org/)

Trong một môi trường mà bạn _không thể_ giả lập một DOM (v.d. test React Native components trên Node.js), bạn có thể dùng [event simulation helpers](/docs/test-utils.html#simulate) để mô phỏng các tương tác với từng thành phần. Thay phiên lẫn nhau, bạn có thể dùng công cụ `fireEvent` từ [`@testing-library/react-native`](https://testing-library.com/docs/react-native-testing-library/intro).

Frameworks như là [Cypress](https://www.cypress.io/), [puppeteer](https://github.com/GoogleChrome/puppeteer) và [webdriver](https://www.seleniumhq.org/projects/webdriver/) hữu ích trong việc chạy [những test đầu cuối](#end-to-end-tests-aka-e2e-tests).

### Những hàm Mocking {#mocking-functions}

Khi viết test, chúng ta muốn mock ra các phần code của mình mà không có giống với bên trong môi trường test (v.d. kiểm tra trạng thái `navigator.onLine` bên trong Node.js). Tests cũng có thể thăm dò một số chức năng, và quan sát cách các phần khác của test tương tác với chúng. Sau đó, sẽ rất hữu ích khi có thể mô phỏng một cách chọn lọc các chức năng này với các phiên bản thân thiện với người dùng hơn so với bản thử nghiệm.

Điều này đặc biệt hữu ích cho việc "fetching" dữ liệu. Thông thường, bạn nên sử dụng dữ liệu "fake" cho các test để tránh sự chậm chạp và không ổn định do fetch từ các "endpoints" API thực [<small>(example)</small>](/docs/testing-recipes.html#data-fetching). Điều này giúp làm cho các test có thể dự đoán được. Các thư viện như là [Jest](https://jestjs.io/) và [sinon](https://sinonjs.org/), trong số những cái khác, hỗ trợ hàm mocked. Với các bài test cuối cùng (nghĩa là các bài test đầu ra, và quan trọng nhất), mạng lưới mocking có thể khó hơn nhiều, nhưng bạn cũng có thể muốn (hoặc cần) test các API endpoint thực trong nó.

### Các module Mocking {#mocking-modules}

Một số component dành sự phụ thuộc vào các module có thể không hoạt động trơn tru trong môi trường test, hoặc không cần thiết cho các test. Nó có thể hữu ích nếu chọn lọc mock những module ra với những thế thân phù hợp [<small>(example)</small>](/docs/testing-recipes.html#mocking-modules).

Trên Node.js, những "runner" như là Jest [hỗ trợ các module mocking](https://jestjs.io/docs/en/manual-mocks). Bạn cũng có thể sử dụng các thư viện như [`mock-require`](https://www.npmjs.com/package/mock-require).

### Bộ đếm Mocking {#mocking-timers}

Components có thể sẽ phải dùng những hàm liên quan đến đếm thời gian như `setTimeout`, `setInterval`, hoặc `Date.now`. Trong các môi trường test, nó hữu ích cho việc mock những hàm này ra với các thay thế cho phép bạn một cách thủ công "cải thiện" thời gian chạy. Điều này rất tốt để đảm bảo các test của bạn chạy nhanh! Các test phụ thuộc vào bộ đếm thời gian sẽ vẫn giải quyết theo thứ tự, và nhanh hơn ư [<small>(example)</small>](/docs/testing-recipes.html#timers). Phần lớn frameworks, bao gồm [Jest](https://jestjs.io/docs/en/timer-mocks), [sinon](https://sinonjs.org/releases/v7.3.2/fake-timers/) và [lolex](https://github.com/sinonjs/lolex), cho phép bạn mock thời gian trong các test.

Đôi khi, bạn có thể không muốn mock bộ đếm thời gian. Ví dụ như, có thể bạn đang test một animation, hoặc tương tác với một endpoint nhạy cảm với thời gian (như giới hạn rate của API). Các thư viện mà làm việc với mocks thời gian cho phép bạn có thể bật hay tắt nó trên từng nền tảng bài test/suite một, vì vậy bạn có thể chọn tùy ý cách các test này sẽ chạy.

### Bài tests đầu ra {#end-to-end-tests-aka-e2e-tests}

Những bài test đầu ra hữu ích để kiểm tra quy trình làm việc dài/lâu hơn, đặc biệt là khi chúng rất quan trọng đối với công việc của bạn (như là các thanh toán hoặc đăng nhập). Đối với những test này, bạn có thể muốn kiểm tra cách một trình duyệt thực tế hiển thị toàn bộ ứng dụng, fetche data từ các API endpoint thật, dùng các session và cookie, điều hướng giữa các link khác nhau. Bạn cũng có thể muốn đưa ra khẳng định không chỉ là trên DOM state, mà còn trên cả dữ liệu hỗ trợ cũng vậy (v.d. để xác minh xem các bản cập nhật có được lưu vào cơ sở dữ liệu hay không).

Trong cấu hình này, bạn sẽ muốn dùng một framework như là [Cypress](https://www.cypress.io/) hoặc thư viện như [puppeteer](https://github.com/GoogleChrome/puppeteer) thì bạn có thể đa điều hướng giữa nhiều "route" và khẳng định về các tác dụng phụ không chỉ trong trình duyệt, mà cũng còn có thể xảy ra phía "backend".
