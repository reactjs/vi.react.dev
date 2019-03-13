---
id: hooks-intro
title: Giới thiệu về Hooks
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

*Hooks* mới được thêm ở phiên bản React 16.8. Cho phép bạn sử dụng state và các chức năng khác của React mà không cần tạo class.

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Khai báo 1 biến trạng thái mới đặt tên là "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Bận đã bấm {count} lần</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

Tính năng mới `useState` này là "Hook" đầu tiên chúng ta học, nhưng ví dụ này chỉ để giới thiệu. Đừng lo nếu nó chưa dễ hình dung!

**Bạn có thể bắt đầu học Hooks [ở trang tiếp theo](/docs/hooks-overview.html).** Tại trang này, chúng tôi tiếp tục giải thích tại sao thêm Hooks vào React và cách chúng giúp bạn viết ứng dụng tuyệt vời hơn.

>Chú ý
>
>React 16.8.0 là phiên bản đầu tiên hỗ trợ Hook. Khi nâng cấp, đừng quên cập nhật tất cả các gói, bao gồm cả React DOM. React Native sẽ hỗ trợ Hooks trong phiên bản ổn định tiếp theo.

## Video Giới Thiệu {#video-introduction}

Tại React Conf 2018, Sophie Alpert và Dan Abramov đã giới thiệu Hooks, tiếp theo Ryan Florence trình bày cách để tái cấu trúc một ứng dụng để sử dụng chúng. Xem video tại đây:

<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## Không Có Thay Đổi Phá Vỡ {#no-breaking-changes}

Trước khi chúng ta tiếp tục, chú ý rằng Hooks:

* **Hoàn toàn opt-in.** Bạn có thể dùng Hooks trong một vài thành phần mà không phải viết lại bất cứ đoạn code hiện tại nào. Bạn không buộc phải học hoặc sử dụng Hooks bây giờ nếu bạn không muốn.
* **100% tương thích phiên bản cũ.** Hooks không chứa bất kì thay đổi phá vỡ nào.
* **Đã ra mắt.** Hooks đã sẵn sàng với phiên bản v16.8.0.

**Không có kế hoạch xoá classes khỏi React.** Bạn có thể đọc thêm về chiến lược áp dụng dần dần cho Hook trong [phần dưới](#gradual-adoption-strategy) của trang này.

**Hooks không thay thế kiến thức của bạn về các khái niệm của React.** Thay vì thế Hooks cung cấp các API trực tiếp tới các khái niệm React mà bạn đã biết: props, state, context, refs, và vòng đời. Chúng tôi sẽ chỉ ra sau, Hooks cũng đưa ra 1 cách mới và mạnh mẽ để kết hợp chúng.

**Nếu bạn chỉ muốn tìm hiểu Hook, bạn có thể [xem luôn trang tiếp theo!](/docs/hooks-overview.html)** Bạn cũng có thể tiếp tục đọc để biết thêm tại sao chúng tôi thêm Hooks, và cách chúng tôi bắt đầu sử dụng mà không phải viết lại các ứng dụng của chúng tôi.

## Nguồn cảm hứng {#motivation}

Hooks giải quyết rộng và nhiều các vấn đề có vẻ không liên quan trong React mà chúng tôi gặp phải trong hơn 5 năm qua với việc viết và phát triển 10 nghìn thành phần giao diện. Kể cả bạn đang học React, sử dụng nó hàng ngày hoặc ngay cả bạn thích 1 thư viện khác tương tự với component model, bạn có thể nhận ra một số vấn đề.

### Khó để sử dụng lại logic có trạng thái giữa các components{#its-hard-to-reuse-stateful-logic-between-components}

React không đưa ra cách nào để "gắn" các thao thác sử dụng lại tới một component (ví dụ, kết nối với store). Nếu bạn đã làm việc với React một thời gian, bạn có thể thấy quen thuộc với patterns như [render props](/docs/render-props.html) và [higher-order components](/docs/higher-order-components.html) đã cố để xử lý vấn đề này. Nhưng các patterns đó yêu cầu bạn phải cấu trúc lại components của bạn khi sử dụng, có thể làm cho code dài dòng khó theo dõi. Nếu bạn xem cấu trúc của một ứng dụng React bằng React DevTools bạn sẽ thấy "wrapper hell" (lồng nhau nhiều lớp) của các components bọc bởi các lớp của providers, consumers, higher-order components, render props, và các abstractions khác. Trong khi chúng ta có thể [lọc chúng khỏi DevTools](https://github.com/facebook/react-devtools/pull/503), điều này chỉ ra một vấn đề sâu hơn nằm bên dưới: React cần một kiểu nguyên thuỷ tốt hơn để chia sẻ logic có trạng thái.

Với Hooks, bạn có thể tách logic có trạng thái từ component, nó có thể test độc lập và sử dụng lại. **Hooks cho phép sử dụng lại logic có trạng thái mà không phải thay đổi cấu trúc component.** Điều này cho phép chia sẻ Hooks qua nhiều components hoặc với cộng đồng.

Chúng tôi sẽ thảo luận về điều này nhiều hơn tại [Xây dựng Hooks của bạn](/docs/hooks-custom.html).

### Components phức tạp trở nên khó hiểu {#complex-components-become-hard-to-understand}

Chúng tôi thường phải làm những components mà bắt đầu đơn giản nhưng trở nên khó quản lý bừa bộn logic có trạng thái và side effects. Mỗi phương thức vòng đời chứa kết hợp những logic không liên quan. Ví dụ, components có thể thực hiện lấy dữ liệu trong `componentDidMount` và `componentDidUpdate`. Tuy nhiên, cùng phương thức `componentDidMount` có thể chứa vài logic không liên quan để cài đặt event listeners, và dọn dẹp trong `componentWillUnmount`. Những đoạn code liên quan và hỗ trợ lẫn nhau bị chia ra, và đoạn code không liên quan lại nằm trong cùng một phương thức. Điều này dễ dàng gây ra bugs và không nhất quán.

Trong nhiều trường hợp không thể chia nhỏ các components bởi vì logic có trạng thái dùng ở tất cả các chỗ. Khó để test. Đây là một trong những nguyên nhân nhiều người chọn kết hợp React với một thư viện quản lý trạng thái khác. Tuy nhiên nó thường bị quá nhiều trìu tượng và yêu cầu phải chuyển qua nhiều files khác nhau và khó sẻ dụng lại các components.

Để giải quyết vấn đề này, **Hooks cho phép bạn chia một component thành các hàm nhỏ hơn dựa trên các phần liên quan (chẳng hạn như cài đặt subscription hoặc lấy dữ liệu)**, hơn là buộc phải chia theo các phương thức vòng đời. Bạn cũng có thể quản lý trạng thái của component với reducer để dễ dự đoán hơn.

Chúng tôi sẽ thảo luận thêm tại [Sử dụng Hook hiệu quả](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns).

### Classes khiến cả con người và máy thấy bối rối {#classes-confuse-both-people-and-machines}

Không chỉ làm cho việc sử dụng lại và tổ chức code khó hơn, chúng tôi thấy rằng classes là rào cản lớn để học React. Bạn phải hiểu cách `this` hoạt động trong Javascript, cái mà rất khác về cách hoạt động trong đa số các ngôn ngữ khác. Bạn phải nhớ bind các event handlers. Nếu không sử dụng [cú pháp đề xuất](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/), code sẽ rất dài dòng. Mọi người có thể hiểu props, state, và luồng dữ liệu từ trên xuống tốt nhưng vẫn vật lộn với classes. Sự khác biết giữa hàm và class components trong React và khi nào sử dụng chúng dẫn đến sự bất đồng kể cả những người phát triển React có kinh nghiệm.

Hơn nữa, React đã ra mắt được khoảng 5 năm, và chúng tôi muốn đảm bảo nó vẫn liên quan trong 5 năm tới. [Svelte](https://svelte.technology/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/), và nhiều chỗ khác chỉ ra, [ahead-of-time compilation](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) của các components có rất nhiều tiềm năng tương lai. Đặc biệt nếu nó không giới hạn các mẫu. Gần đây chúng tôi đã thử nghiệm [component folding](https://github.com/facebook/react/issues/7323) sử dụng [Prepack](https://prepack.io/), và chúng tôi đã thấy nhiều kết quả hứa hẹn. Chúng tôi thấy rằng class components có thể khuyến khích các patterns không chủ ý nhưng làm cho các tối ưu chậm hơn. Classes cũng xuất nhiện nhiều vấn đề cho các công cụ hôm nay. Ví dụ class không giảm dung lượng tốt, và chúng làm cho hot reloading flaky và không tin cậy. Chúng tôi muốn giới thiệu một API mà vẫn tối ưu được.

Để xử lý các vấn đề, **Hooks cho phép bạn sử dụng nhiều tính năng của React mà không cần classes.** Về mặt khái niệm, React components luôn luôn gần như các hàm. Hooks áp dụng functions, nhưng không phải hi sinh tinh thần thực hành của React. Hooks cung cấp truy cập đến escape hatches nguyên thuỷ và không yêu cầu bạn phải học các kĩ thuật functional hoặc reactive programming.

>Ví dụ
>
>[Cái nhìn đầu tiên về Hooks](/docs/hooks-overview.html) là một nơi tốt để bắt đầu học Hooks.

## Chiến lược áp dụng dần dần {#gradual-adoption-strategy}

>**TLDR: Không có kế hoạch xoá classes khỏi React.**

Chúng tôi biết lập tình viên React tập trung vào phát triển sản phẩm và không có thời gian để xem tất cả các API mới đang được ra mắt. Hooks rất mới và có thể tốt hơn để chờ cho nhiều ví dụ và hướng dẫn trước khi cân nhắc học hoặc áp dụng chúng.

Chúng tôi cũng hiểu rằng cản trở cho việc thêm một điều nguyên thuỷ mới vào React là rất cao. Cho những người đọc tò mò, chúng tôi đã chuẩn bị một [RFC chi tiết](https://github.com/reactjs/rfcs/pull/68) cho nguồn cảm hứng với nhiều chi tiết hơn, và cung cấp thêm quan điểm về quyết định thiết kế và nghệ thuật nguyên thuỷ.

**Chủ yếu, Hooks hoạt động bên cạnh code hiện tại nên bạn có thể áp dụng dần dần.** Không quá mất thời gian để chuyển sang dùng Hooks. Chúng tôi gợi ý hạn chế bất kì việc "viết lại lớn" nào, đặc biệt cho những class component phức tạp. Nó cần một chút thay đổi tư duy để bắt đầu "suy nghĩ về Hooks". Theo kinh nghiệm của chúng tôi thì cách tốt nhất để sử dụng Hooks là ở trong các components mới và không quan trọng, và đảm bảo mọi người trong nhóm của bạn cảm thấy thoải mái với chúng. Sau khi bạn thử Hooks, hãy thoải mái [gửi phản hồi](https://github.com/facebook/react/issues/new), kể cả tích cực hay tiêu cực.

Chúng tôi dự định cho Hooks bao hàm tất cả các trường hợp dùng classes, nhưng **chúng tôi sẽ tiếp tục hỗ trợ class components cho tương lai thấy trước.** Tại Facebook, chúng tôi có hàng mười nghìn components viết dưới dạng classes, và chúng tôi tuyệt đối không có kế hoạch viết lại chúng. Thay vì thế, chúng tôi bắt đầu sử dụng Hooks cho code mới bên cạnh với classes.

## Các câu hỏi thường gặp {#frequently-asked-questions}

Chúng tôi đã chuẩn bị [câu hỏi thường gặp về Hooks](/docs/hooks-faq.html) để trả lời những câu hỏi phổ biến nhất về Hooks.

## Bước tiếp theo {#next-steps}

Cuối trang này, bạn phần nào có được ý tưởng mà Hooks đang giải quyết, nhưng nhiều chi tiết chắc chắn là chưa rõ ràng. Đừng lo! **Bắt đầu [trang tiếp theo](/docs/hooks-overview.html) để bắt đầu học Hooks qua những ví dụ**
