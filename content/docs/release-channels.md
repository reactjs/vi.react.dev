---
id: release-channels
title: Release Channels
permalink: docs/release-channels.html
layout: docs
category: installation
prev: cdn-links.html
next: hello-world.html
---

React dựa vào cộng đồng mã nguồn mở phát triển mạnh để gửi báo cáo lỗi, tạo pull requests và [submit RFCs](https://github.com/reactjs/rfcs). Để khuyến khích phản hồi, đôi khi chúng tôi chia sẻ các bản dựng đặc biệt của React bao gồm các tính năng chưa được phát hành.

> Tài liệu này sẽ phù hợp nhất với các nhà phát triển làm việc trên framework, thư viện hoặc công cụ dành cho nhà phát triển. Các nhà phát triển sử dụng React chủ yếu để xây dựng các ứng dụng hướng đến người dùng không cần phải lo lắng về các kênh phát hành trước của chúng tôi.

Mỗi kênh phát hành của React được thiết kế cho một trường hợp sử dụng riêng biệt:

- [**Mới nhất**](#latest-channel) dành cho các bản phát hành React ổn định. Đó là những gì bạn nhận được khi cài đặt React từ npm. Đây là kênh bạn đã sử dụng hôm nay. **Sử dụng các bản phát hành ổn định cho tất cả các ứng dụng React giao diện người dùng.**
- [**Tiếp theo**](#next-channel) theo dõi nhánh chính của kho mã nguồn React. Hãy coi đây là những ứng cử viên phát hành cho bản phát hành minor semver tiếp theo. Sử dụng kênh này để kiểm tra tích hợp giữa React và các dự án của bên thứ ba.
- [**Thử nghiệm**](#experimental-channel) bao gồm các API thử nghiệm và các tính năng không có trong các bản phát hành ổn định. Chúng cũng theo dõi nhánh chính, nhưng với các cờ tính năng bổ sung được bật. Sử dụng kênh này để thử các tính năng sắp tới trước khi chúng được phát hành.

Tất cả các bản phát hành đều được xuất bản lên npm, nhưng chỉ bản Mới nhất sử dụng [semantic versioning](/docs/faq-versioning.html). Bản phát hành trước (những bản trong kênh Tiếp theo và kênh Thử nghiệm) có các phiên bản được tạo từ hàm băm của nội dung và ngày commit, ví dụ: `0.0.0-68053d940-20210623` cho bản Tiếp theo và `0.0.0-experimental-68053d940-20210623` cho bản Thử nghiệm.

**Kênh phát hành chính thức duy nhất được hỗ trợ cho các ứng dụng hướng đến người dùng là kênh Mới nhất**. Các bản phát hành Tiếp theo và Thử nghiệm chỉ được cung cấp cho mục đích thử nghiệm và chúng tôi không đảm bảo rằng hành vi sẽ không thay đổi giữa các bản phát hành. Chúng không tuân theo giao thức semver mà chúng tôi sử dụng cho các bản phát hành từ bản Mới nhất.

Bằng cách phát hành các bản cơ sở trước lên cùng một registry mà chúng tôi sử dụng cho các bản phát hành ổn định, chúng tôi có thể tận dụng nhiều công cụ hỗ trợ quy trình làm việc npm, như [unpkg](https://unpkg.com) và [CodeSandbox](https://codesandbox.io).

### Kênh Mới nhất {#latest-channel}

Mới nhất là kênh được sử dụng cho các bản phát hành React ổn định. Nó tương ứng với thẻ `latest` trên npm. Đây là kênh được đề xuất cho tất cả các ứng dụng React được chuyển đến người dùng thực.

**Nếu bạn không chắc chắn bạn nên sử dụng kênh nào, thì đó là kênh Mới nhất.** Nếu bạn là một nhà phát triển React, đây là những gì bạn đã sử dụng.

Bạn có thể mong đợi các bản cập nhật mới nhất sẽ cực kỳ ổn định. Các phiên bản tuân theo sơ đồ semantic versioning. Tìm hiểu thêm về cam kết của chúng tôi đối với sự ổn định và di chuyển gia tăng trong [chính sách phiên bản](/docs/faq-versioning.html) của chúng tôi.

### Kênh Tiếp theo {#next-channel}

Kênh Tiếp theo là kênh phát hành trước theo dõi nhánh chính của kho lưu trữ React. Chúng tôi sử dụng các bản phát hành trước trong kênh Tiếp theo làm ứng cử viên phát hành cho kênh Mới nhất. Bạn có thể nghĩ về kênh Tiếp theo như một tập hợp các bản Mới nhất được cập nhật thường xuyên hơn.

Mức độ thay đổi giữa bản phát hành Tiếp theo gần đây nhất và bản phát hành Mới nhất gần đây nhất gần giống như bạn sẽ thấy giữa hai bản phát hành minor semver. Tuy nhiên, **kênh Tiếp theo không tuân theo semantic versioning.** Bạn nên mong đợi những thay đổi đột ngột giữa các bản phát hành kế tiếp trong kênh Tiếp theo.

**Không sử dụng các bản phát hành trước trong các ứng dụng giao diện người dùng.**

Các bản phát hành trong kênh Tiếp theo được xuất bản với thẻ `next` trên npm. Các phiên bản được tạo từ một hàm băm của nội dung của bản dựng và ngày commit, ví dụ: `0.0.0-68053d940-20210623`.

#### Sử dụng Kênh Tiếp theo cho Integration Testing {#using-the-next-channel-for-integration-testing}

Kênh Tiếp theo được thiết kế để hỗ trợ kiểm tra tích hợp giữa React và các dự án khác.

Tất cả các thay đổi đối với React đều trải qua quá trình thử nghiệm nội bộ rộng rãi trước khi chúng được phát hành ra công khai. Tuy nhiên, có vô số môi trường và cấu hình được sử dụng trong toàn bộ hệ sinh thái React và chúng tôi không thể kiểm tra từng môi trường và cấu hình.

Nếu bạn là tác giả của React framework, thư viện, công cụ dành cho nhà phát triển của bên thứ ba hoặc dự án kiểu cơ sở hạ tầng tương tự, bạn có thể giúp chúng tôi giữ React ổn định cho người dùng của bạn và toàn bộ cộng đồng React bằng cách chạy định kỳ bộ thử nghiệm của bạn so với những thay đổi. Nếu bạn quan tâm, hãy làm theo các bước sau:

- Thiết lập một cron job bằng cách sử dụng nền tảng continuous integration ưa thích của bạn. Cron job được hỗ trợ bởi cả [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) và [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
- Trong cron job, hãy cập nhật React packages của bạn lên bản phát hành React gần đây nhất trong kênh Next, sử dụng thẻ `next` trên npm. Sử dụng cli npm:

  ```
  npm update react@next react-dom@next
  ```

  Hoặc yarn:

  ```
  yarn upgrade react@next react-dom@next
  ```
- Chạy bộ thử nghiệm của bạn với các package đã cập nhật.
- Nếu mọi thứ đều pass, thật tuyệt! Bạn có thể mong đợi rằng dự án của mình sẽ hoạt động với bản phát hành minor React tiếp theo.
- Nếu có sự cố bất ngờ, vui lòng cho chúng tôi biết bằng cách [tạo một issue](https://github.com/facebook/react/issues).

Một dự án sử dụng quy trình làm việc này là Next.js. (Không có ý định chơi chữ! Nghiêm túc đấy!) Bạn có thể tham khảo [cấu hình CircleCI](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) của họ làm ví dụ.

### Kênh Thử nghiệm {#experimental-channel}

Giống như kênh Tiếp theo, kênh Thử nghiệm là kênh phát hành trước để theo dõi nhánh chính của kho lưu trữ React. Không giống như các bản tiếp theo, các bản phát hành thử nghiệm bao gồm các tính năng và API bổ sung chưa sẵn sàng để phát hành rộng rãi hơn.

Thông thường, bản cập nhật cho kênh Tiếp theo đi kèm với bản cập nhật tương ứng cho kênh Thử nghiệm. Chúng dựa trên cùng một bản sửa đổi nguồn, nhưng được xây dựng bằng cách sử dụng một bộ cờ tính năng khác nhau.

Các bản phát hành Thử nghiệm có thể khác đáng kể so với các bản phát hành Tiếp theo và Mới nhất. **Không sử dụng các bản phát hành Thử nghiệm trong các ứng dụng dành cho người dùng.** Bạn sẽ có những thay đổi thường xuyên giữa các bản phát hành trong kênh Thử nghiệm.

Các bản phát hành trong kênh Thử nghiệm được xuất bản với thẻ `experimental` vào npm. Các phiên bản được tạo từ một hàm băm của nội dung của bản dựng và ngày commit, ví dụ: `0.0.0-experimental-68053d940-20210623`.

#### Điều gì sẽ dẫn đến một bản phát hành thử nghiệm? {#what-goes-into-an-experimental-release}

Các tính năng thử nghiệm là những tính năng chưa sẵn sàng ra mắt công chúng và có thể thay đổi đáng kể trước khi chúng được hoàn thiện. Một số thử nghiệm có thể không bao giờ được hoàn thiện - lý do chúng tôi có các thử nghiệm là để kiểm tra khả năng tồn tại của những thay đổi được đề xuất.

Ví dụ, nếu kênh Thử nghiệm đã tồn tại khi chúng tôi công bố Hooks, chúng tôi sẽ phát hành Hooks đến kênh Thử nghiệm vài tuần trước khi chúng có sẵn trong kênh Mới nhất.

Bạn có thể thấy việc chạy integration tests dựa trên kênh Thử nghiệm có giá trị. Đây là tùy thuộc vào bạn. Tuy nhiên, hãy lưu ý rằng kênh Thử nghiệm thậm chí còn kém ổn định hơn kênh Tiếp theo. **Chúng tôi không đảm bảo bất kỳ sự ổn định nào giữa các bản phát hành Thử nghiệm.**

#### Làm cách nào để tôi có thể tìm hiểu thêm về các tính năng thử nghiệm? {#how-can-i-learn-more-about-experimental-features}

Các tính năng thử nghiệm có thể được viết tài liệu hoặc không. Thông thường, các thử nghiệm không được viết tài liệu cho đến khi chúng gần được đưa đến kênh Tiếp theo hay kênh Mới nhất.

Nếu một tính năng không được viết tài liệu, chúng có thể bởi một [RFC](https://github.com/reactjs/rfcs).

Chúng tôi sẽ đăng lên [React blog](/blog) khi chúng tôi đã sẵn sàng thông báo các thử nghiệm mới, nhưng không có nghĩa chúng tôi sẽ công khai mọi thử nghiệm.

Bạn luôn có thể tham khảo [lịch sử](https://github.com/facebook/react/commits/main) của kho lưu trữ GitHub công khai của chúng tôi để biết danh sách toàn diện về các thay đổi.
