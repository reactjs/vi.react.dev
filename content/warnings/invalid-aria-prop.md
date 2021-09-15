---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

The invalid-aria-prop warning sẽ xuất hiện nếu bạn cố gắng xuất một DOM element với một aria-* prop cái mà không tồn tại trong Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA) [specification](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties).

1. Nếu bạn thấy bạn đang sử dụng đúng prop, kiểm tra chính tả một cách kỹ càng. `aria-labelledby` và `aria-activedescendant` thường được đánh vần sai.

2. React không nhận ra thuộc tính bạn mô tả. Vấn đề này có vẻ sẽ được sửa trong phiên bản tương lai của React. Tuy nhiên, React hiện tại loại bỏ tất cả thuộc tính không nhận diện được, vì thế mô tả chúng trong ứng dụng React của bạn sẽ khiến chúng không được xuất ra.