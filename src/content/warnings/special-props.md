---
title: Cảnh báo về các Props đặc biệt
---

Hầu hết các props trên một phần tử JSX được chuyển cho component, tuy nhiên, có hai props đặc biệt (`ref` và `key`) được React sử dụng và do đó không được chuyển tiếp đến component.

Ví dụ: bạn không thể đọc `props.key` từ một component. Nếu bạn cần truy cập cùng một giá trị bên trong component con, bạn nên chuyển nó như một prop khác (ví dụ: `<ListItemWrapper key={result.id} id={result.id} />` và đọc `props.id`). Mặc dù điều này có vẻ dư thừa, nhưng điều quan trọng là phải tách biệt logic ứng dụng khỏi các gợi ý cho React.
