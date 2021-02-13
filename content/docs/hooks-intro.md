---
id: hooks-intro
title: Giới thiệu về Hook
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

*Hooks* mới được thêm ở phiên bản React 16.8.  Với Hooks, bạn có sử dụng state và các chức năng khác của một React class component mà không cần phải viết một class.

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Khai báo 1 biến trạng thái mới đặt tên là "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Bạn đã bấm {count} lần</p>
      <button onClick={() => setCount(count + 1)}>
        Bấm vào tôi
      </button>
    </div>
  );
}
```

`useState` này là "Hook" đầu tiên chúng ta học, và ví dụ này chỉ để giới thiệu bạn với một Hook thôi. Vì vậy, nếu bạn chưa hiểu thì đừng vội lo lắng!

**Bạn có thể bắt đầu học Hook [ở trang tiếp theo](/docs/hooks-overview.html).** Còn ở đây, chúng tôi sẽ giải thích tại sao chúng tôi thêm Hook vào React và những Hook sẽ giúp bạn giải quyết những vấn đề gì.

>Chú ý
>React 16.8.0 là phiên bản đầu tiên hỗ trợ Hook. Khi nâng cấp, đừng quên cập nhật tất cả các package bao gồm React DOM.
>React Native hỗ trợ Hooks từ [phiên bản 0.59 của React Native](https://facebook.github.io/react-native/blog/2019/03/12/releasing-react-native-059).

## Video Giới Thiệu {#video-introduction}

Tại React Conf 2018, Sophie Alpert và Dan Abramov đã giới thiệu Hook, và Ryan Florence trình bày cách để tái cấu trúc một ứng dụng để sử dụng chúng. Xem video tại đây:

<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## Thay đổi này không ảnh hưởng đến phiên bản trước{#no-breaking-changes}

Trước khi chúng ta tiếp tục, lưu ý rằng Hook:

* **Hoàn toàn không bắt buộc.** Bạn có thể dùng Hook trong một vài component mà không phải viết lại bất cứ đoạn code hiện tại nào. Bạn không buộc phải học hoặc sử dụng Hook bây giờ nếu bạn không muốn.
* **100% tương thích phiên bản cũ.** Hook không chứa bất kỳ thay đổi nào ảnh hưởng phiên bản trước đó.
* **Đã chính thức được công bố.** Hook đã sẵn sàng với phiên bản v16.8.0.

**Không có kế hoạch xóa class component khỏi React.** Bạn có thể đọc thêm về chiến lược áp dụng Hook dần dần trong [phần dưới](#gradual-adoption-strategy) của trang này.

**Hooks không thay đổi kiến thức của bạn về các khái niệm của React.** Thay vì thế, Hook cung cấp các API trực tiếp tới các khái niệm React mà bạn đã biết như prop, state, context, refs, và lifecycle. Sau này, chúng tôi cũng sẽ cho bạn thấy rằng các Hook sẽ cho bạn một cách mới và hữu dụng để kết hợp chúng.

**Nếu bạn chỉ muốn tìm hiểu Hook, bạn có thể [xem luôn trang tiếp theo!](/docs/hooks-overview.html)** Bạn cũng có thể tiếp tục đọc để biết thêm tại sao chúng tôi thêm Hook, và cách chúng tôi bắt đầu sử dụng mà không phải viết lại các ứng dụng.

## Động lực {#motivation}

Hook giải quyết nhiều vấn đề có vẻ không liên quan trong React mà chúng tôi gặp phải trong hơn 5 năm qua với việc viết và phát triển 10 nghìn component giao diện. Kể cả nếu bạn đang học React, sử dụng nó hàng ngày hoặc ngay cả bạn thích 1 thư viện khác với component model gần giống, bạn có thể nhận ra một số vấn đề.

### Khó để sử dụng lại logic giữa các component{#its-hard-to-reuse-stateful-logic-between-components}

React không đưa ra cách nào để "gắn" các thao tác hay sử dụng lại với một component (ví dụ, kết nối với store). Nếu đã làm việc với React một thời gian, bạn có thể thấy quen thuộc với những pattern như [render prop](/docs/render-props.html) và [higher-order component](/docs/higher-order-components.html) để xử lý vấn đề này. Nhưng các pattern đó yêu cầu bạn phải cấu trúc lại component khi sử dụng, và chúng có thể khiến cho code của bạn dài dòng và khó theo dõi. Nếu bạn xem cấu trúc của một ứng dụng React bằng React DevTools, bạn sẽ thấy "wrapper hell" (lồng nhau nhiều lớp) của các component bọc bởi các lớp của provider, consumer, higher-order component, render prop, và các abstraction khác. Trong khi chúng ta có thể [lọc chúng khỏi DevTools](https://github.com/facebook/react-devtools/pull/503), điều này chỉ ra một vấn đề sâu hơn nằm bên dưới: React cần một kiểu nguyên thuỷ tốt hơn để chia sẻ logic.

Với Hook, bạn có thể tách logic từ component, và bạn có thể test độc lập và sử dụng lại những logic này. **Hook cho phép sử dụng lại logic mà không phải thay đổi cấu trúc component.** Điều này cho phép bạn chia sẻ Hook qua nhiều component hoặc với cộng đồng.

Chúng tôi sẽ thảo luận về điều này nhiều hơn tại [Xây dựng Hook của riêng bạn](/docs/hooks-custom.html).

### Component phức tạp và trở nên khó hiểu {#complex-components-become-hard-to-understand}

Chúng ta thường phải làm những component đầu tiên đơn giản, nhưng trở nên khó quản lý và bừa bộn các logic và side effect. Mỗi phương thức lifecycle kết hợp những logic không liên quan. Ví dụ, component có thể thực hiện lấy dữ liệu trong `componentDidMount` và `componentDidUpdate`. Tuy nhiên, cùng phương thức `componentDidMount` có thể chứa vài logic không liên quan để cài đặt event listener, và dọn dẹp trong `componentWillUnmount`. Những đoạn code liên quan và hỗ trợ lẫn nhau bị chia ra, và đoạn code không liên quan lại nằm trong cùng một phương thức. Điều này dễ dàng gây ra bug và không nhất quán.

Trong nhiều trường hợp không thể chia nhỏ các component bởi vì logic  dùng ở tất cả các chỗ. Khó để test. Đây là một trong những nguyên nhân nhiều người chọn kết hợp React với một thư viện quản lý state khác. Tuy nhiên nó thường quá trừu tượng và yêu cầu phải chuyển qua nhiều file khác nhau và khó sử dụng lại các component.

Để giải quyết vấn đề này, **Hook cho phép bạn chia một component thành các hàm nhỏ hơn dựa trên các phần liên quan (chẳng hạn như cài đặt subscription hoặc lấy dữ liệu)**, hơn là buộc phải chia theo các phương thức lifecycle. Bạn cũng có thể quản lý trạng thái của component với reducer để dễ dự đoán hơn.

Chúng tôi sẽ thảo luận thêm tại [Sử dụng nhiều effect Hook độc lập](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns).

### Class khiến cả con người và máy thấy bối rối {#classes-confuse-both-people-and-machines}

Không chỉ làm cho việc sử dụng lại và tổ chức code khó hơn, chúng tôi thấy rằng class là rào cản lớn để học React. Bạn phải hiểu cách `this` hoạt động trong Javascript, cái mà rất khác về cách hoạt động trong đa số các ngôn ngữ khác. Bạn phải nhớ bind các event handler. Nếu không sử dụng [cú pháp đề xuất](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/), code sẽ rất dài dòng. Mọi người có thể hiểu prop, state, và luồng dữ liệu từ trên xuống tốt nhưng vẫn vật lộn với class. Sự khác biệt giữa hàm và class component trong React và khi nào sử dụng chúng dẫn đến sự bất đồng kể cả những người phát triển React có kinh nghiệm.

Hơn nữa, React đã ra mắt được khoảng 5 năm, và chúng tôi muốn đảm bảo nó vẫn mạnh mẽ trong 5 năm tới. [Svelte](https://svelte.dev/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/), và nhiều chỗ khác chỉ ra, [ahead-of-time compilation](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) của các components có rất nhiều tiềm năng tương lai. Đặc biệt nếu nó không giới hạn các mẫu. Gần đây chúng tôi đã thử nghiệm [component folding](https://github.com/facebook/react/issues/7323) sử dụng [Prepack](https://prepack.io/), và chúng tôi đã thấy nhiều kết quả hứa hẹn. Chúng tôi thấy rằng class component có thể khuyến khích các pattern không chủ ý nhưng làm cho việc tối ưu chậm hơn. Class cũng xuất hiện nhiều vấn đề hôm nay. Ví dụ class không giảm dung lượng tốt, và chúng làm cho hot reloading flaky và không tin cậy. Chúng tôi muốn giới thiệu một API mà vẫn tối ưu được.

Để xử lý các vấn đề, **Hook cho phép bạn sử dụng nhiều tính năng của React mà không cần class.** Về mặt khái niệm, React component luôn luôn gần như các hàm. Hook áp dụng function, nhưng không phải hi sinh tinh thần của React. Hook cung cấp truy cập đến escape hatches nguyên thuỷ và không yêu cầu bạn phải học các kĩ thuật functional hoặc reactive programming.

>Ví dụ
>
>[Cái nhìn đầu tiên về Hooks](/docs/hooks-overview.html) là một nơi tốt để bắt đầu học Hook.

## Chiến lược áp dụng dần dần {#gradual-adoption-strategy}

>**TLDR: Không có kế hoạch xóa class khỏi React.**

Chúng tôi biết lập trình viên React tập trung vào phát triển sản phẩm và không có thời gian để xem tất cả các API mới đang được ra mắt. Hook rất mới và tốt hơn nên chờ khi có nhiều ví dụ và hướng dẫn trước khi cân nhắc học hoặc áp dụng chúng.

Chúng tôi cũng hiểu rằng việc thêm một điều mới hoàn toàn vào React là rất khó khăn. Cho những người đọc tò mò, chúng tôi đã chuẩn bị một [RFC chi tiết](https://github.com/reactjs/rfcs/pull/68) giải thích động lực chi tiết hơn, và cung cấp thêm quan điểm về quyết định thiết kế.
**Chủ yếu, Hook hoạt động bên cạnh code hiện tại nên bạn có thể áp dụng dần dần.** Không quá mất thời gian để chuyển sang dùng Hook. Chúng tôi thiết nghĩ hạn chế việc "viết lại toàn bộ" bằng Hook, đặc biệt cho những class component phức tạp. Nó cần một chút thay đổi tư duy để bắt đầu "suy nghĩ về Hook". Theo kinh nghiệm của chúng tôi thì cách tốt nhất để sử dụng Hook là ở trong các component mới và không quan trọng, và đảm bảo mọi người trong nhóm của bạn cảm thấy thoải mái với chúng. Sau khi bạn thử Hook, hãy thoải mái [gửi phản hồi](https://github.com/facebook/react/issues/new), kể cả tích cực hay tiêu cực.

Chúng tôi dự định cho Hook bao gồm tất cả các trường hợp dùng class, nhưng **chúng tôi sẽ tiếp tục hỗ trợ class component cho tương lai.** Tại Facebook, chúng tôi có hàng nghìn component viết dưới dạng class, và chúng tôi tuyệt đối không có kế hoạch viết lại chúng. Thay vì thế, chúng tôi bắt đầu sử dụng Hook cho code mới bên cạnh với class.

## Các câu hỏi thường gặp {#frequently-asked-questions}

Chúng tôi đã chuẩn bị [câu hỏi thường gặp về Hook](/docs/hooks-faq.html) để trả lời những câu hỏi phổ biến nhất về Hook.

## Bước tiếp theo {#next-steps}

Cuối trang này, bạn phần nào có được ý tưởng mà Hook đang giải quyết, nhưng nhiều chi tiết chắc chắn là chưa rõ ràng. Đừng lo! **Bắt đầu [trang tiếp theo](/docs/hooks-overview.html) để bắt đầu học Hook qua những ví dụ**


