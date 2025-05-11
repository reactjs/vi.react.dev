---
title: React gọi Components và Hooks
---

<Intro>
React chịu trách nhiệm hiển thị các component và Hook khi cần thiết để tối ưu hóa trải nghiệm người dùng. Nó mang tính khai báo: bạn cho React biết những gì cần hiển thị trong logic của component và React sẽ tìm ra cách tốt nhất để hiển thị nó cho người dùng của bạn.
</Intro>

<InlineToc />

---

## Không bao giờ gọi trực tiếp các hàm component {/*never-call-component-functions-directly*/}
Các component chỉ nên được sử dụng trong JSX. Không gọi chúng như các hàm thông thường. React nên gọi nó.

React phải quyết định khi nào hàm component của bạn được gọi [trong quá trình render](/reference/rules/components-and-hooks-must-be-pure#how-does-react-run-your-code). Trong React, bạn thực hiện điều này bằng JSX.

```js {2}
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ Tốt: Chỉ sử dụng component trong JSX
}
```

```js {2}
function BlogPost() {
  return <Layout>{Article()}</Layout>; // 🔴 Sai: Không bao giờ gọi chúng trực tiếp
}
```

Nếu một component chứa Hook, rất dễ vi phạm [Quy tắc của Hook](/reference/rules/rules-of-hooks) khi các component được gọi trực tiếp trong một vòng lặp hoặc có điều kiện.

Việc để React điều phối quá trình render cũng mang lại một số lợi ích:

* **Các component trở nên nhiều hơn là các hàm.** React có thể tăng cường chúng bằng các tính năng như _trạng thái cục bộ_ thông qua Hook được gắn với định danh của component trong cây.
* **Các loại component tham gia vào quá trình hòa giải.** Bằng cách cho phép React gọi các component của bạn, bạn cũng cho nó biết thêm về cấu trúc khái niệm của cây của bạn. Ví dụ: khi bạn chuyển từ hiển thị `<Feed>` sang trang `<Profile>`, React sẽ không cố gắng sử dụng lại chúng.
* **React có thể nâng cao trải nghiệm người dùng của bạn.** Ví dụ: nó có thể cho phép trình duyệt thực hiện một số công việc giữa các lệnh gọi component để việc render lại một cây component lớn không chặn luồng chính.
* **Câu chuyện gỡ lỗi tốt hơn.** Nếu các component là các phần tử hạng nhất mà thư viện nhận biết được, chúng ta có thể xây dựng các công cụ dành cho nhà phát triển phong phú để xem xét nội bộ trong quá trình phát triển.
* **Hòa giải hiệu quả hơn.** React có thể quyết định chính xác những component nào trong cây cần render lại và bỏ qua những component không cần. Điều đó làm cho ứng dụng của bạn nhanh hơn và nhạy hơn.

---

## Không bao giờ truyền Hook như các giá trị thông thường {/*never-pass-around-hooks-as-regular-values*/}

Hook chỉ nên được gọi bên trong các component hoặc Hook. Không bao giờ truyền nó như một giá trị thông thường.

Hook cho phép bạn tăng cường một component với các tính năng của React. Chúng phải luôn được gọi như một hàm và không bao giờ được truyền như một giá trị thông thường. Điều này cho phép _lý luận cục bộ_, hoặc khả năng các nhà phát triển hiểu mọi thứ mà một component có thể làm bằng cách xem xét component đó một cách riêng biệt.

Vi phạm quy tắc này sẽ khiến React không tự động tối ưu hóa component của bạn.

### Không thay đổi Hook một cách động {/*dont-dynamically-mutate-a-hook*/}

Hook phải "tĩnh" nhất có thể. Điều này có nghĩa là bạn không nên thay đổi chúng một cách động. Ví dụ: điều này có nghĩa là bạn không nên viết Hook bậc cao hơn:

```js {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 Sai: không viết Hook bậc cao hơn
  const data = useDataWithLogging();
}
```

Hook phải là bất biến và không được thay đổi. Thay vì thay đổi Hook một cách động, hãy tạo một phiên bản tĩnh của Hook với chức năng mong muốn.

```js {2,6}
function ChatInput() {
  const data = useDataWithLogging(); // ✅ Tốt: Tạo một phiên bản mới của Hook
}

function useDataWithLogging() {
  // ... Tạo một phiên bản mới của Hook và nội tuyến logic ở đây
}
```

### Không sử dụng Hook một cách động {/*dont-dynamically-use-hooks*/}

Hook cũng không nên được sử dụng một cách động: ví dụ: thay vì thực hiện dependency injection trong một component bằng cách truyền một Hook làm giá trị:

```js {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // 🔴 Sai: không truyền Hook làm đạo cụ
}
```

Bạn nên luôn nội tuyến lệnh gọi Hook vào component đó và xử lý mọi logic ở đó.

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging(); // ✅ Tốt: Sử dụng Hook trực tiếp
}

function useDataWithLogging() {
  // Nếu có bất kỳ logic có điều kiện nào để thay đổi hành vi của Hook, nó sẽ được nội tuyến vào
  // Hook
}
```

Bằng cách này, `<Button />` dễ hiểu và gỡ lỗi hơn nhiều. Khi Hook được sử dụng theo những cách động, nó làm tăng đáng kể độ phức tạp của ứng dụng của bạn và ức chế lý luận cục bộ, khiến nhóm của bạn kém năng suất hơn về lâu dài. Nó cũng giúp bạn dễ dàng vô tình phá vỡ [Quy tắc của Hook](/reference/rules/rules-of-hooks) rằng Hook không được gọi có điều kiện. Nếu bạn thấy mình cần mô phỏng các component để kiểm tra, tốt hơn là mô phỏng máy chủ thay vì phản hồi bằng dữ liệu đóng hộp. Nếu có thể, việc kiểm tra ứng dụng của bạn bằng các bài kiểm tra end-to-end thường hiệu quả hơn.
