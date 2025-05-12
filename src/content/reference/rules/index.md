---
title: Các quy tắc của React
---

<Intro>
Giống như các ngôn ngữ lập trình khác nhau có cách riêng để diễn đạt các khái niệm, React có các thành ngữ riêng — hay quy tắc — để diễn đạt các mẫu theo cách dễ hiểu và mang lại các ứng dụng chất lượng cao.
</Intro>

<InlineToc />

---

<Note>
Để tìm hiểu thêm về cách thể hiện giao diện người dùng với React, chúng tôi khuyên bạn nên đọc [Tư duy trong React](/learn/thinking-in-react).
</Note>

Phần này mô tả các quy tắc bạn cần tuân theo để viết mã React thành ngữ. Viết mã React thành ngữ có thể giúp bạn viết các ứng dụng được tổ chức tốt, an toàn và có khả năng kết hợp. Các thuộc tính này làm cho ứng dụng của bạn có khả năng phục hồi tốt hơn trước những thay đổi và giúp bạn dễ dàng làm việc với các nhà phát triển, thư viện và công cụ khác.

Các quy tắc này được gọi là **Các quy tắc của React**. Chúng là các quy tắc – chứ không chỉ là hướng dẫn – theo nghĩa là nếu chúng bị phá vỡ, ứng dụng của bạn có thể có lỗi. Mã của bạn cũng trở nên không thành ngữ và khó hiểu và suy luận hơn.

Chúng tôi đặc biệt khuyên bạn nên sử dụng [Chế độ nghiêm ngặt](/reference/react/StrictMode) cùng với [plugin ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks) của React để giúp cơ sở mã của bạn tuân theo Các quy tắc của React. Bằng cách tuân theo Các quy tắc của React, bạn sẽ có thể tìm và giải quyết các lỗi này và giữ cho ứng dụng của bạn có thể bảo trì được.

---

## Các thành phần và Hook phải thuần khiết {/*components-and-hooks-must-be-pure*/}

[Tính thuần khiết trong các thành phần và Hook](/reference/rules/components-and-hooks-must-be-pure) là một quy tắc quan trọng của React giúp ứng dụng của bạn dễ đoán, dễ gỡ lỗi và cho phép React tự động tối ưu hóa mã của bạn.

* [Các thành phần phải là idempotent](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent) – Các thành phần React được cho là luôn trả về cùng một đầu ra đối với các đầu vào của chúng – props, state và context.
* [Các side effect phải chạy bên ngoài render](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) – Các side effect không được chạy trong render, vì React có thể render các thành phần nhiều lần để tạo ra trải nghiệm người dùng tốt nhất có thể.
* [Props và state là bất biến](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) – Props và state của một thành phần là các ảnh chụp bất biến đối với một lần render duy nhất. Không bao giờ thay đổi chúng trực tiếp.
* [Giá trị trả về và đối số cho Hook là bất biến](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) – Sau khi các giá trị được truyền cho một Hook, bạn không nên sửa đổi chúng. Giống như props trong JSX, các giá trị trở nên bất biến khi được truyền cho một Hook.
* [Các giá trị là bất biến sau khi được truyền cho JSX](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) – Không thay đổi các giá trị sau khi chúng đã được sử dụng trong JSX. Di chuyển đột biến trước khi JSX được tạo.

---

## React gọi các thành phần và Hook {/*react-calls-components-and-hooks*/}

[React chịu trách nhiệm render các thành phần và hook khi cần thiết để tối ưu hóa trải nghiệm người dùng.](/reference/rules/react-calls-components-and-hooks) Nó mang tính khai báo: bạn cho React biết những gì cần render trong logic của thành phần của bạn và React sẽ tìm ra cách hiển thị nó cho người dùng của bạn tốt nhất.

* [Không bao giờ gọi trực tiếp các hàm thành phần](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) – Các thành phần chỉ nên được sử dụng trong JSX. Không gọi chúng như các hàm thông thường.
* [Không bao giờ truyền hook như các giá trị thông thường](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) – Hook chỉ nên được gọi bên trong các thành phần. Không bao giờ truyền nó như một giá trị thông thường.

---

## Các quy tắc của Hook {/*rules-of-hooks*/}

Hook được định nghĩa bằng các hàm JavaScript, nhưng chúng đại diện cho một loại logic UI có thể tái sử dụng đặc biệt với các hạn chế về nơi chúng có thể được gọi. Bạn cần tuân theo [Các quy tắc của Hook](/reference/rules/rules-of-hooks) khi sử dụng chúng.

* [Chỉ gọi Hook ở cấp cao nhất](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) – Không gọi Hook bên trong vòng lặp, điều kiện hoặc hàm lồng nhau. Thay vào đó, hãy luôn sử dụng Hook ở cấp cao nhất của hàm React của bạn, trước bất kỳ lệnh trả về sớm nào.
* [Chỉ gọi Hook từ các hàm React](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) – Không gọi Hook từ các hàm JavaScript thông thường.
