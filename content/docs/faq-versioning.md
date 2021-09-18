---
id: faq-versioning
title: Versioning Policy
permalink: docs/faq-versioning.html
layout: docs
category: FAQ
---

React tuân theo nguyên tắc [semantic versioning (semver)](https://semver.org/).

Điều đó có nghĩa là với một số version **x.y.z**:

* Khi phát hành **các bản sửa lỗi quan trọng**, chúng tôi tạo một bản **vá** bằng cách thay đổi số **z** (Ví dụ: 15.6.2 thành 15.6.3).
* Khi phát hành **các tính năng mới** hoặc **các bản sửa lỗi không quan trọng**, chúng tôi tạo một bản **phát hành nhỏ** bằng cách thay đổi số **y** (ví dụ: 15.6.2 thành 15.7.0).
* Khi phát hành **thay đổi đột phá**, chúng tôi tạo một bản **phát hành chính** bằng cách thay đổi số **x** (ví dụ: 15.6.2 thành 16.0.0).

Các bản phát hành chính cũng có thể chứa các tính năng mới, và bất kỳ bản phát hành nào cũng có thể bao gồm các bản sửa lỗi.

Bản phát hành nhỏ là loại hay gặp nhất.

> Chính sách phát hành phiên bản này không áp dụng cho các bản prerelease trong các channel Tiếp Theo hoặc Thử nghiệm. [ Tìm hiểu thêm về predeceases.](/docs/release-channels.html)

### Các Thay Đổi Đột Phá {#breaking-changes}

Breaking changes gây bất tiện cho mọi người, vì vậy chúng tôi cố gắng giảm thiểu số lượng bản phát hành chính – ví dụ, React 15 được phát hành vào tháng 4 năm 2016, React 16 được phát hành vào tháng 9 năm 2017 và React 17 được phát hành vào tháng 10 năm 2020.

Thay vào đó, chúng tôi phát hành các tính năng mới trong các phiên bản nhỏ. Điều đó có nghĩa là các bản phát hành nhỏ thường thú vị và hấp dẫn hơn so với các bản chính, mặc dù tên của nó khá khiêm tốn.

### Cam Kết Về Sự Ổn Định {#commitment-to-stability}

Khi chúng tôi thay đổi React theo thời gian, chúng tôi cố gắng giảm thiểu yêu cầu cần thiết để tận dụng các tính năng mới. Khi có thể, chúng tôi sẽ giữ một API cũ hơn hoạt động, ngay cả khi điều đó có nghĩa là đặt nó trong một package riêng biệt. Ví dụ, [mixins đã không được hỗ trợ trong nhiều năm](/blog/2016/07/13/mixins-considered-harmful.html) nhưng chúng được hỗ trợ cho tới ngày nay [bởi create-react-class](/docs/react-without-es6.html#mixins) và nhiều codebase tiếp tục sử dụng chúng ổn định, legacy code.

Hơn một triệu nhà phát triển sử dụng React, bảo trì hàng triệu các component. Chỉ riêng codebase Facebook đã có hơn 50,000 component React. Điều đó có nghĩa là chúng ta cần làm cho việc nâng cấp lên các phiên bản React mới hơn càng dễ dàng càng tốt; Nếu chúng tôi thực hiện các thay đổi lớn mà không có một migration path, mọi người sẽ bị mắc kẹt với các phiên bản cũ. Chúng tôi kiểm tra các upgrade paths này trên chính Facebook – nếu nhóm của chúng tôi dưới 10 người có thể cập nhật hơn 50,000 component một mình, chúng tôi hy vọng việc nâng cấp có thể quản lý được với bất kỳ ai sử dụng React. Trong nhiều trường hợp, chúng tôi viết [các script tự động](https://github.com/reactjs/react-codemod) để nâng cấp cú pháp component, mà sau đó chúng tôi đưa vào bản phát hành open-source để mọi người sử dụng.

### Nâng Cấp Dần Dần Thông Qua Cảnh Báo {#gradual-upgrades-via-warnings}

Các bản dựng Development của React chứa nhiều cảnh báo hữu ích. Bất cứ khi nào có thể, chúng tôi sẽ thêm các cảnh báo để chuẩn bị cho những thay đổi đột phá trong tương lai. Bằng cách đó, nếu ứng dụng của bạn không có cảnh báo về bản phát hành mới nhất, thì ứng dụng đó sẽ tương thích với bản phát hành chính tiếp theo. Điều này cho phép bạn nâng cấp từng component trong ứng dụng của mình.

Cảnh báo Development sẽ không ảnh hưởng đến hoạt động chạy của ứng dụng của bạn. Bằng cách đó, bạn có thể cảm thấy tự tin rằng ứng dụng của mình sẽ hoạt động theo cùng một cách giữa các bản dựng development và production -- sự khác biệt duy nhất là phiên bản production sẽ không ghi lại các cảnh báo và nó hiệu quả hơn. (Nếu bạn nhận thấy có vấn đề, vui lòng gửi một issue.)

### Điều gì được coi là một Thay Đổi Đột Phá? {#what-counts-as-a-breaking-change}

Nói chung, chúng tôi *không* tăng số phiên bản chính cho các thay đổi đối với:

* **Cảnh báo Development.** Vì những điều này không ảnh hưởng đến hoạt động production, chúng tôi có thể thêm các cảnh báo mới hoặc sửa đổi các cảnh báo hiện có giữa các phiên bản chính. Trên thực tế, nó cho phép chúng tôi cảnh báo một cách đáng tin cậy về những thay đổi lớn sắp tới.
* **Các API bắt đầu bằng `unstable_`.** Chúng được cung cấp dưới dạng các tính năng thử nghiệm có API mà chúng tôi chưa tin tưởng. Bằng cách phát hành nó với tiền tố `unstable_`, chúng tôi có thể iterate nhanh hơn và có được một API ổn định sớm hơn.
* **Các phiên bản Alpha và Canary của React.** Chúng tôi cung cấp phiên bản alpha của React như một cách để sớm thử nghiệm các tính năng mới, nhưng chúng tôi cần sự linh hoạt để thực hiện các thay đổi dựa trên những gì chúng tôi học được trong giai đoạn alpha. Nếu bạn sử dụng các phiên bản này, hãy lưu ý rằng các API có thể thay đổi trước bản phát hành ổn định.
* **Các API không có tài liệu và cấu trúc dữ liệu nội bộ.** Nếu bạn truy cập các property nội bộ có tên như `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` hoặc `__reactInternalInstance$uk43rzhitjg`, nó không đảm bảo. Bạn sẽ phải tự thân.

Chính sách này được thiết kế để thực tế: chắc chắn, chúng tôi không muốn làm bạn đau đầu. Nếu chúng tôi chọn phiên bản chính cho tất cả những thay đổi này, chúng tôi sẽ kết thúc việc phát hành nhiều phiên bản chính hơn và cuối cùng gây ra nhiều vấn đề về phiên bản hơn cho cộng đồng. Điều đó cũng có nghĩa là chúng tôi không thể đạt được bước tiến trong việc cải thiện React nhanh như mong muốn.

Điều đó nói lên rằng, nếu chúng tôi kỳ vọng một thay đổi trong danh sách này sẽ gây ra nhiều vấn đề cho cộng đồng, chúng tôi vẫn sẽ cố gắng hết sức để cung cấp một migration path thay đổi dần dần.

### Nếu một bản Phát Hành Nhỏ Không Chứa Các Tính Năng Mới, tại sao Nó Không Phải là một Bản Vá? {#minors-versus-patches}

Có thể một bản phát hành nhỏ sẽ không bao gồm các tính năng mới. [Điều này được phép bởi semver](https://semver.org/#spec-item-7), trong đó nêu rõ **"[một phiên bản nhỏ] CÓ THỂ được tăng lên nếu chức năng hoặc cải tiến mới đáng kể được giới thiệu trong private code. Nó CÓ THỂ bao gồm các thay đổi cấp độ bản vá."**

Tuy nhiên, nó đặt ra câu hỏi tại sao những bản phát hành này không được tạo phiên bản dưới dạng các bản vá.

Câu trả lời là bất kỳ thay đổi nào đối với React (hoặc phần mềm khác) đều có nguy cơ bị phá hỏng theo những cách không mong muốn. Hãy tưởng tượng một tình huống trong đó một bản vá lỗi sửa một lỗi nhưng vô tình gây ra một lỗi khác. Điều này không chỉ gây khó chịu cho các developer mà còn làm tổn hại đến niềm tin của họ vào các bản vá lỗi trong tương lai. Đặc biệt sẽ rất đáng tiếc nếu bản sửa lỗi ban đầu dành cho một lỗi hiếm khi gặp phải trong thực tế.

Chúng tôi có một hồ sơ theo dõi khá tốt về việc giữ cho các bản phát hành React không có lỗi, nhưng các bản vá lỗi thậm chí còn có độ tin cậy cao hơn vì hầu hết các nhà phát triển đều cho rằng chúng có thể được áp dụng mà không có bất kì vấn đề gì.

Vì những lý do này, chúng tôi chỉ để dành các bản vá cho các lỗi và lỗ hổng bảo mật quan trọng nhất.

Nếu bản phát hành bao gồm các thay đổi không cần thiết — chẳng hạn như internal refactors, thay đổi các chi tiết implementation, cải tiến hiệu xuất, hoặc các lỗi nhỏ — chúng tôi sẽ nâng phiên bản nhỏ ngay cả khi không có tính năng mới.
