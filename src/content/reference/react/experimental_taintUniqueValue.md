---
title: experimental_taintUniqueValue
---

<Wip>

**API này là thử nghiệm và chưa có sẵn trong phiên bản ổn định của React.**

Bạn có thể thử nó bằng cách nâng cấp các gói React lên phiên bản thử nghiệm mới nhất:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Các phiên bản thử nghiệm của React có thể chứa lỗi. Không sử dụng chúng trong sản xuất.

API này chỉ khả dụng bên trong [React Server Components](/reference/rsc/use-client).

</Wip>

<Intro>

`taintUniqueValue` cho phép bạn ngăn các giá trị duy nhất được truyền đến Client Components như mật khẩu, khóa hoặc mã thông báo.

```js
taintUniqueValue(errMessage, lifetime, value)
```

Để ngăn việc truyền một đối tượng chứa dữ liệu nhạy cảm, hãy xem [`taintObjectReference`](/reference/react/experimental_taintObjectReference).

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `taintUniqueValue(message, lifetime, value)` {/*taintuniquevalue*/}

Gọi `taintUniqueValue` với mật khẩu, mã thông báo, khóa hoặc hàm băm để đăng ký nó với React như một thứ gì đó không được phép chuyển đến Client như hiện tại:

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Không chuyển khóa bí mật cho máy khách.',
  process,
  process.env.SECRET_KEY
);
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `message`: Thông báo bạn muốn hiển thị nếu `value` được chuyển đến Client Component. Thông báo này sẽ được hiển thị như một phần của Lỗi sẽ được đưa ra nếu `value` được chuyển đến Client Component.

* `lifetime`: Bất kỳ đối tượng nào cho biết thời gian `value` nên bị nhiễm độc. `value` sẽ bị chặn gửi đến bất kỳ Client Component nào khi đối tượng này vẫn tồn tại. Ví dụ: chuyển `globalThis` sẽ chặn giá trị trong suốt thời gian tồn tại của một ứng dụng. `lifetime` thường là một đối tượng có các thuộc tính chứa `value`.

* `value`: Một chuỗi, bigint hoặc TypedArray. `value` phải là một chuỗi các ký tự hoặc byte duy nhất có entropy cao, chẳng hạn như mã thông báo mật mã, khóa riêng, hàm băm hoặc mật khẩu dài. `value` sẽ bị chặn gửi đến bất kỳ Client Component nào.

#### Trả về {/*returns*/}

`experimental_taintUniqueValue` trả về `undefined`.

#### Lưu ý {/*caveats*/}

* Tạo các giá trị mới từ các giá trị bị nhiễm độc có thể làm tổn hại đến việc bảo vệ chống nhiễm độc. Các giá trị mới được tạo bằng cách viết hoa các giá trị bị nhiễm độc, nối các giá trị chuỗi bị nhiễm độc thành một chuỗi lớn hơn, chuyển đổi các giá trị bị nhiễm độc thành base64, lấy chuỗi con của các giá trị bị nhiễm độc và các chuyển đổi tương tự khác không bị nhiễm độc trừ khi bạn gọi rõ ràng `taintUniqueValue` trên các giá trị mới được tạo này.
* Không sử dụng `taintUniqueValue` để bảo vệ các giá trị entropy thấp như mã PIN hoặc số điện thoại. Nếu bất kỳ giá trị nào trong yêu cầu bị kẻ tấn công kiểm soát, chúng có thể suy ra giá trị nào bị nhiễm độc bằng cách liệt kê tất cả các giá trị có thể có của bí mật.

---

## Cách sử dụng {/*usage*/}

### Ngăn mã thông báo được chuyển đến Client Components {/*prevent-a-token-from-being-passed-to-client-components*/}

Để đảm bảo rằng thông tin nhạy cảm như mật khẩu, mã thông báo phiên hoặc các giá trị duy nhất khác không vô tình được chuyển đến Client Components, hàm `taintUniqueValue` cung cấp một lớp bảo vệ. Khi một giá trị bị nhiễm độc, bất kỳ nỗ lực nào để chuyển nó đến Client Component sẽ dẫn đến lỗi.

Đối số `lifetime` xác định khoảng thời gian giá trị vẫn bị nhiễm độc. Đối với các giá trị nên bị nhiễm độc vô thời hạn, các đối tượng như [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) hoặc `process` có thể đóng vai trò là đối số `lifetime`. Các đối tượng này có tuổi thọ kéo dài toàn bộ thời gian thực thi ứng dụng của bạn.

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Không chuyển mật khẩu người dùng cho máy khách.',
  globalThis,
  process.env.SECRET_KEY
);
```

Nếu tuổi thọ của giá trị bị nhiễm độc gắn liền với một đối tượng, thì `lifetime` phải là đối tượng bao bọc giá trị. Điều này đảm bảo giá trị bị nhiễm độc vẫn được bảo vệ trong suốt thời gian tồn tại của đối tượng bao bọc.

```js
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintUniqueValue(
    'Không chuyển mã thông báo phiên người dùng cho máy khách.',
    user,
    user.session.token
  );
  return user;
}
```

Trong ví dụ này, đối tượng `user` đóng vai trò là đối số `lifetime`. Nếu đối tượng này được lưu trữ trong bộ nhớ cache toàn cục hoặc có thể truy cập được bởi một yêu cầu khác, thì mã thông báo phiên vẫn bị nhiễm độc.

<Pitfall>

**Không chỉ dựa vào việc nhiễm độc để bảo mật.** Việc nhiễm độc một giá trị không chặn mọi giá trị phái sinh có thể có. Ví dụ: tạo một giá trị mới bằng cách viết hoa một chuỗi bị nhiễm độc sẽ không làm nhiễm độc giá trị mới.

```js
import {experimental_taintUniqueValue} from 'react';

const password = 'correct horse battery staple';

experimental_taintUniqueValue(
  'Không chuyển mật khẩu cho máy khách.',
  globalThis,
  password
);

const uppercasePassword = password.toUpperCase() // `uppercasePassword` không bị nhiễm độc
```

Trong ví dụ này, hằng số `password` bị nhiễm độc. Sau đó, `password` được sử dụng để tạo một giá trị mới `uppercasePassword` bằng cách gọi phương thức `toUpperCase` trên `password`. `uppercasePassword` mới được tạo không bị nhiễm độc.

Các cách tương tự khác để tạo các giá trị mới từ các giá trị bị nhiễm độc như nối nó vào một chuỗi lớn hơn, chuyển đổi nó thành base64 hoặc trả về một chuỗi con tạo ra các giá trị không bị nhiễm độc.

Việc nhiễm độc chỉ bảo vệ chống lại những sai lầm đơn giản như chuyển rõ ràng các giá trị bí mật cho máy khách. Những sai lầm khi gọi `taintUniqueValue` như sử dụng kho lưu trữ toàn cục bên ngoài React, mà không có đối tượng lifetime tương ứng, có thể khiến giá trị bị nhiễm độc trở nên không bị nhiễm độc. Việc nhiễm độc là một lớp bảo vệ; một ứng dụng an toàn sẽ có nhiều lớp bảo vệ, các API được thiết kế tốt và các mẫu cách ly.

</Pitfall>

<DeepDive>

#### Sử dụng `server-only` và `taintUniqueValue` để ngăn chặn rò rỉ bí mật {/*using-server-only-and-taintuniquevalue-to-prevent-leaking-secrets*/}

Nếu bạn đang chạy một môi trường Server Components có quyền truy cập vào các khóa riêng hoặc mật khẩu như mật khẩu cơ sở dữ liệu, bạn phải cẩn thận để không chuyển nó cho Client Component.

```js
export async function Dashboard(props) {
  // KHÔNG LÀM ĐIỀU NÀY
  return <Overview password={process.env.API_PASSWORD} />;
}
```

```js
"use client";

import {useEffect} from '...'

export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
  ...
}
```

Ví dụ này sẽ làm rò rỉ mã thông báo API bí mật cho máy khách. Nếu mã thông báo API này có thể được sử dụng để truy cập dữ liệu mà người dùng cụ thể này không được phép truy cập, nó có thể dẫn đến vi phạm dữ liệu.

[comment]: <> (TODO: Liên kết đến tài liệu `server-only` sau khi chúng được viết)

Lý tưởng nhất là các bí mật như thế này được trừu tượng hóa thành một tệp trợ giúp duy nhất chỉ có thể được nhập bởi các tiện ích dữ liệu đáng tin cậy trên máy chủ. Trình trợ giúp thậm chí có thể được gắn thẻ bằng [`server-only`](https://www.npmjs.com/package/server-only) để đảm bảo rằng tệp này không được nhập trên máy khách.

```js
import "server-only";

export function fetchAPI(url) {
  const headers = { Authorization: process.env.API_PASSWORD };
  return fetch(url, { headers });
}
```

Đôi khi những sai lầm xảy ra trong quá trình tái cấu trúc và không phải tất cả đồng nghiệp của bạn có thể biết về điều này.
Để bảo vệ chống lại những sai lầm này xảy ra sau này, chúng ta có thể "làm nhiễm độc" mật khẩu thực tế:

```js
import "server-only";
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Không chuyển mật khẩu mã thông báo API cho máy khách. ' +
    'Thay vào đó, hãy thực hiện tất cả các tìm nạp trên máy chủ.'
  process,
  process.env.API_PASSWORD
);
```

Bây giờ, bất cứ khi nào ai đó cố gắng chuyển mật khẩu này cho Client Component hoặc gửi mật khẩu cho Client Component bằng Server Function, một lỗi sẽ được đưa ra với thông báo bạn đã xác định khi bạn gọi `taintUniqueValue`.

</DeepDive>

---
