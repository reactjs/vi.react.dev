---
title: experimental_taintObjectReference
---

<Wip>

**API này đang trong giai đoạn thử nghiệm và chưa có sẵn trong phiên bản ổn định của React.**

Bạn có thể thử nó bằng cách nâng cấp các gói React lên phiên bản thử nghiệm mới nhất:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Các phiên bản thử nghiệm của React có thể chứa lỗi. Không sử dụng chúng trong môi trường production.

API này chỉ khả dụng bên trong React Server Components.

</Wip>

<Intro>

`taintObjectReference` cho phép bạn ngăn chặn một thể hiện đối tượng cụ thể được truyền đến một Client Component, chẳng hạn như đối tượng `user`.

```js
experimental_taintObjectReference(message, object);
```

Để ngăn chặn việc truyền một key, hash hoặc token, hãy xem [`taintUniqueValue`](/reference/react/experimental_taintUniqueValue).

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `taintObjectReference(message, object)` {/*taintobjectreference*/}

Gọi `taintObjectReference` với một đối tượng để đăng ký nó với React như một thứ không nên được phép truyền đến Client Component như hiện tại:

```js
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
  'Không truyền TẤT CẢ các biến môi trường cho client.',
  process.env
);
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `message`: Thông báo bạn muốn hiển thị nếu đối tượng được truyền đến một Client Component. Thông báo này sẽ được hiển thị như một phần của Lỗi sẽ được đưa ra nếu đối tượng được truyền đến một Client Component.

* `object`: Đối tượng cần được đánh dấu. Các hàm và thể hiện lớp có thể được truyền cho `taintObjectReference` dưới dạng `object`. Các hàm và lớp đã bị chặn truyền đến Client Components nhưng thông báo lỗi mặc định của React sẽ được thay thế bằng những gì bạn đã xác định trong `message`. Khi một thể hiện cụ thể của Typed Array được truyền cho `taintObjectReference` dưới dạng `object`, bất kỳ bản sao nào khác của Typed Array sẽ không bị đánh dấu.

#### Trả về {/*returns*/}

`experimental_taintObjectReference` trả về `undefined`.

#### Lưu ý {/*caveats*/}

- Việc tạo lại hoặc sao chép một đối tượng bị đánh dấu sẽ tạo ra một đối tượng không bị đánh dấu mới có thể chứa dữ liệu nhạy cảm. Ví dụ: nếu bạn có một đối tượng `user` bị đánh dấu, `const userInfo = {name: user.name, ssn: user.ssn}` hoặc `{...user}` sẽ tạo ra các đối tượng mới không bị đánh dấu. `taintObjectReference` chỉ bảo vệ chống lại những sai lầm đơn giản khi đối tượng được truyền đến một Client Component mà không thay đổi.

<Pitfall>

**Không chỉ dựa vào việc đánh dấu để bảo mật.** Việc đánh dấu một đối tượng không ngăn chặn việc rò rỉ mọi giá trị phái sinh có thể. Ví dụ: bản sao của một đối tượng bị đánh dấu sẽ tạo ra một đối tượng không bị đánh dấu mới. Sử dụng dữ liệu từ một đối tượng bị đánh dấu (ví dụ: `{secret: taintedObj.secret}`) sẽ tạo ra một giá trị hoặc đối tượng mới không bị đánh dấu. Đánh dấu là một lớp bảo vệ; một ứng dụng an toàn sẽ có nhiều lớp bảo vệ, các API được thiết kế tốt và các mẫu cách ly.

</Pitfall>

---

## Cách sử dụng {/*usage*/}

### Ngăn dữ liệu người dùng vô tình đến client {/*prevent-user-data-from-unintentionally-reaching-the-client*/}

Một Client Component không bao giờ nên chấp nhận các đối tượng mang dữ liệu nhạy cảm. Lý tưởng nhất là các hàm tìm nạp dữ liệu không nên hiển thị dữ liệu mà người dùng hiện tại không được phép truy cập. Đôi khi sai lầm xảy ra trong quá trình tái cấu trúc. Để bảo vệ chống lại những sai lầm này xảy ra sau này, chúng ta có thể "đánh dấu" đối tượng người dùng trong API dữ liệu của chúng ta.

```js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Không truyền toàn bộ đối tượng người dùng cho client. ' +
      'Thay vào đó, hãy chọn các thuộc tính cụ thể bạn cần cho trường hợp sử dụng này.',
    user,
  );
  return user;
}
```

Bây giờ, bất cứ khi nào ai đó cố gắng truyền đối tượng này cho một Client Component, một lỗi sẽ được đưa ra với thông báo lỗi đã truyền vào.

<DeepDive>

#### Bảo vệ chống lại rò rỉ trong quá trình tìm nạp dữ liệu {/*protecting-against-leaks-in-data-fetching*/}

Nếu bạn đang chạy một môi trường Server Components có quyền truy cập vào dữ liệu nhạy cảm, bạn phải cẩn thận không truyền trực tiếp các đối tượng:

```js
// api.js
export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
```

```js
import { getUser } from 'api.js';
import { InfoCard } from 'components.js';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // KHÔNG LÀM ĐIỀU NÀY
  return <InfoCard user={user} />;
}
```

```js
// components.js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
}
```

Lý tưởng nhất là `getUser` không nên hiển thị dữ liệu mà người dùng hiện tại không được phép truy cập. Để ngăn chặn việc truyền đối tượng `user` cho một Client Component sau này, chúng ta có thể "đánh dấu" đối tượng người dùng:

```js
// api.js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Không truyền toàn bộ đối tượng người dùng cho client. ' +
      'Thay vào đó, hãy chọn các thuộc tính cụ thể bạn cần cho trường hợp sử dụng này.',
    user,
  );
  return user;
}
```

Bây giờ, nếu ai đó cố gắng truyền đối tượng `user` cho một Client Component, một lỗi sẽ được đưa ra với thông báo lỗi đã truyền vào.

</DeepDive>
