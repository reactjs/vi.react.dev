---
title: "Các Hook React DOM Tích Hợp"
---

<Intro>

Gói `react-dom` chứa các Hook chỉ được hỗ trợ cho các ứng dụng web (chạy trong môi trường DOM của trình duyệt). Các Hook này không được hỗ trợ trong các môi trường không phải trình duyệt như ứng dụng iOS, Android hoặc Windows. Nếu bạn đang tìm kiếm các Hook được hỗ trợ trong trình duyệt web *và các môi trường khác*, hãy xem [trang React Hooks](/reference/react). Trang này liệt kê tất cả các Hook trong gói `react-dom`.

</Intro>

---

## Các Hook Biểu Mẫu {/*form-hooks*/}

*Biểu mẫu* cho phép bạn tạo các điều khiển tương tác để gửi thông tin. Để quản lý biểu mẫu trong các thành phần của bạn, hãy sử dụng một trong các Hook sau:

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) cho phép bạn thực hiện các cập nhật cho UI dựa trên trạng thái của biểu mẫu.

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useActionState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Count: {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      Submit
    </button>
  );
}
```
