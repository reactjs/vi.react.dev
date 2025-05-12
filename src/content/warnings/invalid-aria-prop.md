---
title: Cảnh báo thuộc tính ARIA không hợp lệ
---

Cảnh báo này sẽ xuất hiện nếu bạn cố gắng hiển thị một phần tử DOM với một thuộc tính `aria-*` không tồn tại trong [đặc tả](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) của Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA).

1. Nếu bạn cảm thấy rằng bạn đang sử dụng một thuộc tính hợp lệ, hãy kiểm tra cẩn thận chính tả. `aria-labelledby` và `aria-activedescendant` thường bị viết sai chính tả.

2. Nếu bạn viết `aria-role`, có thể bạn muốn viết `role`.

3. Nếu không, nếu bạn đang sử dụng phiên bản React DOM mới nhất và đã xác minh rằng bạn đang sử dụng một tên thuộc tính hợp lệ được liệt kê trong đặc tả ARIA, vui lòng [báo cáo lỗi](https://github.com/facebook/react/issues/new/choose).
