---
id: faq-structure
title: Cấu trúc dự án
permalink: docs/faq-structure.html
layout: docs
category: FAQ
---

### Có cách nào được khuyên dùng để sắp xếp các dự án React? {#is-there-a-recommended-way-to-structure-react-projects}

React không có ý kiến về cách bạn sắp xếp các files trong các thư mục. Tuy nhiên, có một số cách tiếp cận thông dụng mà các bạn nên cân nhắc.

#### Phân nhóm theo tính năng hoặc đường dẫn {#grouping-by-features-or-routes}

Một cách thông thường để hệ thống hoá dự án là nhóm các file CSS, JS, và tests chung một thư mục và phân các thư mục này theo tính năng hoặc đường dẫn.

```
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

Định nghĩa của "tính năng" tuỳ thuộc vào cách các bạn định nghĩa, không có khái niệm chung ở đây. Nếu bạn không thể nghĩ ra một danh sách các thư mục top-level, bạn có thể hỏi những người dùng đâu là các thành phần thiết yếu của sản phẩm, và dùng các thành phần này để định hình cách sắp xếp cho dự án. 

#### Nhóm các file theo phân loại{#grouping-by-file-type}

Một cách phổ biến khác để sắp xếp dự án chính là nhóm các file giống nhau lại chung với nhau, ví dụ:

```
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

Một vài người sẽ muốn tối ưu hơn, và sắp xếp các components vào những thư mục tuỳ vào nhiệm vụ của chúng trong ứng dụng. Ví dụ, [Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/) là một phương pháp thiết kế được xây dựng dựa trên nguyên tắc này. Hãy nhớ rằng đôi lúc nên sử dụng các phương pháp này như những ví dụ thay vì xem chúng như những quy luật cần phải tuân thủ.

#### Tránh đan xen quá nhiều {#avoid-too-much-nesting}

Nhiều niềm đau khổ xuất phát từ các thư mục JavaScript bị đan xen quá nhiều trong các dự án. Nó trở nên quá khó khăn để viết các lệnh import giữa chúng, hoặc để cập nhật các import khi các file bị di chuyển. Trừ khi bạn có một lý do khá thuyết phục để dùng một cấu trúc thư mục chằn chịt, hãy hạn chế bản thân bạn ở 3 đến 4 lớp thư mục trong 1 dự án. Đương nhiên, đây chỉ là một lời khuyên, và nó có thề sẽ không phù hợp với dự án của bạn.

#### Đừng suy nghĩ phức tạp {#dont-overthink-it}

Nếu bạn vừa bắt đầu một dự án, [đừng tốn quá 5 phút](https://en.wikipedia.org/wiki/Analysis_paralysis) cho việc lựa chọn một cấu trúc file. Hãy chọn bất kỳ cách tiếp cận được nêu trên (hoặc hãy tự nghĩ ra cách của bạn) và bắt đầu viết code! Khả năng cao là bạn sẽ phải suy nghĩ lại về cách sắp xếp sau khi bạn bắt đầu viết code thực sự.

Nếu bạn cảm thấy hoàn toàn bế tắc, hãy bắt đầu bằng cách để hết tất cả các file vào chỉ duy nhất 1 thư mục. Dần dần thư mục này sẽ đủ lớn để bạn bắt đầu cảm thấy phải tách một số file khỏi các file còn lại. Tới khi đó bạn sẽ có đủ am tường để nhận ra các file nào bạn thường xuyên phải chỉnh sửa chung với nhau. Nhìn chung, bạn nên giữ các file bạn thường xuyên chỉnh sửa chung cùng một thư mục. Nguyên tắc này được gọi là "colocation".

Một khi các dự án trở nên lớn hơn chúng sẽ dùng kết hợp của 2 cách tiếp cận trên. Vì vậy việc lựa chọn "đúng" cách tiếp cận khi đang bắt đầu dự án là việc không quan trọng.