---
title: Don't Call PropTypes Warning
layout: single
permalink: warnings/dont-call-proptypes.html
---

> Chú ý:
>
> `React.PropTypes` đã chuyển sang một gói khác kể từ React v15.5. Vui lòng sử dụng [thư viện `prop-types` thay thế](https://www.npmjs.com/package/prop-types).
>
>Chúng tôi cung cấp [tập lệnh codemod](/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) để tự động chuyển đổi.

Trong một bản phát hành chính trong tương lai của React, code thực hiện các chức năng xác thực PropType sẽ bị loại bỏ trong quá trình sản xuất. Khi điều này xảy ra, bất kỳ code nào gọi các chức năng này theo cách thủ công (không bị loại bỏ trong quá trình sản xuất) sẽ gây ra lỗi.

### Khai báo PropTypes vẫn ổn {#declaring-proptypes-is-still-fine}

Việc sử dụng bình thường PropTypes vẫn được hỗ trợ:

```javascript
Button.propTypes = {
  highlighted: PropTypes.bool
};
```

Không có gì thay đổi ở đây.

### Không gọi trực tiếp PropTypes {#dont-call-proptypes-directly}

Sử dụng PropTypes theo bất kỳ cách nào khác ngoài việc chú thích các React component với chúng không còn được hỗ trợ:

```javascript
var apiShape = PropTypes.shape({
  body: PropTypes.object,
  statusCode: PropTypes.number.isRequired
}).isRequired;

// Không được hỗ trợ!
var error = apiShape(json, 'response');
```

Nếu bạn phụ thuộc vào việc sử dụng PropTypes như thế này, chúng tôi khuyến khích bạn sử dụng hoặc tạo một nhánh của PropTypes (chẳng hạn như 2 gói này [aackerman/PropTypes](https://github.com/aackerman/PropTypes) [developit/proptypes](https://github.com/developit/proptypes)).

Nếu bạn không khắc phục cảnh báo, code này sẽ gặp sự cố trong quá trình sản xuất với React 16.

### Nếu bạn không gọi trực tiếp cho PropTypes nhưng vẫn nhận được cảnh báo {#if-you-dont-call-proptypes-directly-but-still-get-the-warning}

Kiểm tra stack trace được tạo ra bởi cảnh báo. Bạn sẽ thấy định nghĩa component chịu trách nhiệm cho cuộc gọi trực tiếp PropTypes. Rất có thể, vấn đề là do PropTypes của bên thứ ba bao bọc React’s PropTypes, ví dụ:

```js
Button.propTypes = {
  highlighted: ThirdPartyPropTypes.deprecated(
    PropTypes.bool,
    'Use `active` prop instead'
  )
}
```

Trong trường hợp này, `ThirdPartyPropTypes.deprecated` là một trình bao bọc gọi `PropTypes.bool`. Bản thân mô hình này là tốt, nhưng kích hoạt false positive vì React cho rằng bạn đang gọi trực tiếp PropTypes. Phần tiếp theo giải thích cách khắc phục sự cố này cho một thư viện triển khai thứ gì đó như `ThirdPartyPropTypes`. Nếu đó không phải là thư viện bạn đã viết, bạn có thể gửi vấn đề về thư viện đó.

### Sửa lỗi false positive trong PropTypes của bên thứ ba {#fixing-the-false-positive-in-third-party-proptypes}

Nếu bạn là tác giả của thư viện PropTypes của bên thứ ba và bạn để người tiêu dùng bọc các React PropTypes hiện có, họ có thể bắt đầu thấy cảnh báo này đến từ thư viện của bạn. Điều này xảy ra vì React không thấy đối số cuối cùng "bí mật" mà [nó chuyển qua](https://github.com/facebook/react/pull/7132) để phát hiện các lệnh gọi PropTypes thủ công.

Đây là cách để sửa chữa nó. Chúng tôi sẽ sử dụng `deprecated` từ [react-bootstrap/react-prop-type](https://github.com/react-bootstrap/react-prop-types/blob/0d1cd3a49a93e513325e3258b28a82ce7d38e690/src/deprecated.js) làm ví dụ. Việc triển khai hiện tại chỉ chuyển xuống các đối số `props`, `propName` và `componentName`:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName) {
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName);
  };
}
```

Để sửa lỗi false positive, hãy đảm bảo rằng bạn chuyển **tất cả** các đối số xuống PropType được bao bọc. Điều này rất dễ thực hiện với ký hiệu `...rest` của ES6:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName, ...rest) { // Chú ý ...rest ở đây
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName, ...rest); // và ở đây
  };
}
```

Điều này sẽ giúp xoá warning ở console.
