---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

The invalid-aria-prop warning sẽ xuất hiện nếu bạn cố gắng render một DOM element với một aria-* prop, nó không tồn tại trong Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA) [specification](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties).

1. Nếu thấy rằng mình đang sử dụng đúng prop, kiểm tra lỗi chính tả một cách kỹ càng. `aria-labelledby` và `aria-activedescendant` thường bị viết sai .

<<<<<<< HEAD
2. React không nhận ra thuộc tính bạn mô tả. Vấn đề này có vẻ sẽ được sửa trong phiên bản tương lai của React. Tuy nhiên, React hiện tại loại bỏ tất cả thuộc tính không nhận diện được, vì thế mô tả chúng trong ứng dụng React của bạn sẽ khiến chúng không được render.
=======
2. If you wrote `aria-role`, you may have meant `role`.

3. Otherwise, if you're on the latest version of React DOM and verified that you're using a valid property name listed in the ARIA specification, please [report a bug](https://github.com/facebook/react/issues/new/choose).
>>>>>>> 4b68508440a985598571f78f60637b6dccdd5a1a
