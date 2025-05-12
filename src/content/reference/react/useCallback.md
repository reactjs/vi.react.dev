---
title: useCallback
---

<Intro>

`useCallback` là một React Hook cho phép bạn lưu trữ định nghĩa hàm giữa các lần render lại.

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

Gọi `useCallback` ở cấp cao nhất của component để lưu trữ định nghĩa hàm giữa các lần render lại:

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

*   `fn`: Giá trị hàm bạn muốn lưu trữ. Nó có thể nhận bất kỳ đối số nào và trả về bất kỳ giá trị nào. React sẽ trả về (không gọi!) hàm của bạn trong lần render ban đầu. Trong các lần render tiếp theo, React sẽ cung cấp lại cho bạn cùng một hàm nếu `dependencies` không thay đổi kể từ lần render cuối cùng. Nếu không, nó sẽ cung cấp cho bạn hàm mà bạn đã truyền trong lần render hiện tại và lưu trữ nó trong trường hợp nó có thể được sử dụng lại sau này. React sẽ không gọi hàm của bạn. Hàm được trả lại cho bạn để bạn có thể quyết định khi nào và có nên gọi nó hay không.
*   `dependencies`: Danh sách tất cả các giá trị phản ứng được tham chiếu bên trong mã `fn`. Các giá trị phản ứng bao gồm props, state và tất cả các biến và hàm được khai báo trực tiếp bên trong phần thân component của bạn. Nếu trình kiểm tra lỗi của bạn được [cấu hình cho React](/learn/editor-setup#linting), nó sẽ xác minh rằng mọi giá trị phản ứng được chỉ định chính xác là một dependency. Danh sách các dependency phải có một số lượng mục không đổi và được viết nội tuyến như `[dep1, dep2, dep3]`. React sẽ so sánh từng dependency với giá trị trước đó của nó bằng cách sử dụng thuật toán so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Giá trị trả về {/*returns*/}

Trong lần render ban đầu, `useCallback` trả về hàm `fn` mà bạn đã truyền.

Trong các lần render tiếp theo, nó sẽ trả về một hàm `fn` đã được lưu trữ từ lần render cuối cùng (nếu các dependency không thay đổi) hoặc trả về hàm `fn` mà bạn đã truyền trong lần render này.

#### Lưu ý {/*caveats*/}

*   `useCallback` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất của component** hoặc Hook của riêng bạn. Bạn không thể gọi nó bên trong vòng lặp hoặc điều kiện. Nếu bạn cần điều đó, hãy trích xuất một component mới và di chuyển state vào đó.
*   React **sẽ không loại bỏ hàm đã lưu trữ trừ khi có một lý do cụ thể để làm điều đó.** Ví dụ: trong quá trình phát triển, React sẽ loại bỏ bộ nhớ cache khi bạn chỉnh sửa tệp của component. Cả trong quá trình phát triển và sản xuất, React sẽ loại bỏ bộ nhớ cache nếu component của bạn tạm ngưng trong quá trình mount ban đầu. Trong tương lai, React có thể thêm nhiều tính năng hơn tận dụng việc loại bỏ bộ nhớ cache--ví dụ: nếu React thêm hỗ trợ tích hợp cho danh sách ảo hóa trong tương lai, thì việc loại bỏ bộ nhớ cache cho các mục cuộn ra khỏi khung nhìn của bảng ảo hóa sẽ hợp lý. Điều này sẽ phù hợp với mong đợi của bạn nếu bạn dựa vào `useCallback` như một tối ưu hóa hiệu suất. Nếu không, một [biến state](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) hoặc một [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) có thể phù hợp hơn.

---

## Cách sử dụng {/*usage*/}

### Bỏ qua việc render lại các component {/*skipping-re-rendering-of-components*/}

Khi bạn tối ưu hóa hiệu suất render, đôi khi bạn sẽ cần lưu trữ các hàm mà bạn truyền cho các component con. Trước tiên, hãy xem cú pháp để làm điều này như thế nào, và sau đó xem trong những trường hợp nào nó hữu ích.

Để lưu trữ một hàm giữa các lần render lại của component, hãy bọc định nghĩa của nó vào Hook `useCallback`:

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

Bạn cần truyền hai thứ cho `useCallback`:

1.  Một định nghĩa hàm mà bạn muốn lưu trữ giữa các lần render lại.
2.  Một <CodeStep step={2}>danh sách các dependency</CodeStep> bao gồm mọi giá trị bên trong component của bạn được sử dụng bên trong hàm của bạn.

Trong lần render ban đầu, <CodeStep step={3}>hàm được trả về</CodeStep> mà bạn sẽ nhận được từ `useCallback` sẽ là hàm bạn đã truyền.

Trong các lần render tiếp theo, React sẽ so sánh <CodeStep step={2}>các dependency</CodeStep> với các dependency bạn đã truyền trong lần render trước. Nếu không có dependency nào thay đổi (so sánh với [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useCallback` sẽ trả về cùng một hàm như trước. Nếu không, `useCallback` sẽ trả về hàm bạn đã truyền trong lần render *này*.

Nói cách khác, `useCallback` lưu trữ một hàm giữa các lần render lại cho đến khi các dependency của nó thay đổi.

**Hãy xem qua một ví dụ để xem khi nào điều này hữu ích.**

Giả sử bạn đang truyền một hàm `handleSubmit` từ `ProductPage` xuống component `ShippingForm`:

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

Bạn nhận thấy rằng việc chuyển đổi prop `theme` làm đóng băng ứng dụng trong một khoảnh khắc, nhưng nếu bạn xóa `<ShippingForm />` khỏi JSX của mình, nó sẽ cảm thấy nhanh. Điều này cho bạn biết rằng bạn nên thử tối ưu hóa component `ShippingForm`.

**Theo mặc định, khi một component render lại, React sẽ render lại tất cả các component con của nó một cách đệ quy.** Đây là lý do tại sao, khi `ProductPage` render lại với một `theme` khác, component `ShippingForm` *cũng* render lại. Điều này là tốt cho các component không yêu cầu nhiều tính toán để render lại. Nhưng nếu bạn đã xác minh rằng việc render lại chậm, bạn có thể yêu cầu `ShippingForm` bỏ qua việc render lại khi các props của nó giống như trong lần render cuối cùng bằng cách bọc nó trong [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**Với thay đổi này, `ShippingForm` sẽ bỏ qua việc render lại nếu tất cả các props của nó *giống* như trong lần render cuối cùng.** Đây là khi việc lưu trữ một hàm trở nên quan trọng! Giả sử bạn đã định nghĩa `handleSubmit` mà không có `useCallback`:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Mỗi khi theme thay đổi, đây sẽ là một hàm khác...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }
  
  return (
    <div className={theme}>
      {/* ... vì vậy các props của ShippingForm sẽ không bao giờ giống nhau và nó sẽ render lại mỗi lần */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**Trong JavaScript, một `function () {}` hoặc `() => {}` luôn tạo ra một hàm _khác_,** tương tự như cách literal đối tượng `{}` luôn tạo ra một đối tượng mới. Thông thường, điều này sẽ không phải là một vấn đề, nhưng nó có nghĩa là các props của `ShippingForm` sẽ không bao giờ giống nhau và tối ưu hóa [`memo`](/reference/react/memo) của bạn sẽ không hoạt động. Đây là nơi `useCallback` sẽ hữu ích:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Yêu cầu React lưu trữ hàm của bạn giữa các lần render lại...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...miễn là các dependency này không thay đổi...

  return (
    <div className={theme}>
      {/* ...ShippingForm sẽ nhận được các props giống nhau và có thể bỏ qua việc render lại */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**Bằng cách bọc `handleSubmit` trong `useCallback`, bạn đảm bảo rằng nó là hàm *giống nhau* giữa các lần render lại** (cho đến khi các dependency thay đổi). Bạn không *phải* bọc một hàm trong `useCallback` trừ khi bạn làm điều đó vì một lý do cụ thể nào đó. Trong ví dụ này, lý do là bạn truyền nó cho một component được bọc trong [`memo`,](/reference/react/memo) và điều này cho phép nó bỏ qua việc render lại. Có những lý do khác bạn có thể cần `useCallback` được mô tả thêm trên trang này.

<Note>

**Bạn chỉ nên dựa vào `useCallback` như một tối ưu hóa hiệu suất.** Nếu mã của bạn không hoạt động nếu không có nó, hãy tìm vấn đề cơ bản và khắc phục nó trước. Sau đó, bạn có thể thêm lại `useCallback`.

</Note>

<DeepDive>

#### useCallback liên quan đến useMemo như thế nào? {/*how-is-usecallback-related-to-usememo*/}

Bạn sẽ thường thấy [`useMemo`](/reference/react/useMemo) cùng với `useCallback`. Cả hai đều hữu ích khi bạn đang cố gắng tối ưu hóa một component con. Chúng cho phép bạn [ghi nhớ](https://en.wikipedia.org/wiki/Memoization) (hay nói cách khác, lưu trữ) một cái gì đó bạn đang truyền xuống:

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // Gọi hàm của bạn và lưu trữ kết quả của nó
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // Lưu trữ chính hàm của bạn
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

Sự khác biệt là ở *những gì* chúng cho phép bạn lưu trữ:

*   **[`useMemo`](/reference/react/useMemo) lưu trữ *kết quả* của việc gọi hàm của bạn.** Trong ví dụ này, nó lưu trữ kết quả của việc gọi `computeRequirements(product)` để nó không thay đổi trừ khi `product` đã thay đổi. Điều này cho phép bạn truyền đối tượng `requirements` xuống mà không cần render lại `ShippingForm` một cách không cần thiết. Khi cần thiết, React sẽ gọi hàm bạn đã truyền trong quá trình render để tính toán kết quả.
*   **`useCallback` lưu trữ *chính hàm*.** Không giống như `useMemo`, nó không gọi hàm bạn cung cấp. Thay vào đó, nó lưu trữ hàm bạn đã cung cấp để bản thân `handleSubmit` không thay đổi trừ khi `productId` hoặc `referrer` đã thay đổi. Điều này cho phép bạn truyền hàm `handleSubmit` xuống mà không cần render lại `ShippingForm` một cách không cần thiết. Mã của bạn sẽ không chạy cho đến khi người dùng gửi biểu mẫu.

Nếu bạn đã quen thuộc với [`useMemo`,](/reference/react/useMemo) bạn có thể thấy hữu ích khi nghĩ về `useCallback` như sau:

```js
// Triển khai đơn giản hóa (bên trong React)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[Đọc thêm về sự khác biệt giữa `useMemo` và `useCallback`.](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### Bạn có nên thêm useCallback ở mọi nơi không? {/*should-you-add-usecallback-everywhere*/}

Nếu ứng dụng của bạn giống như trang web này và hầu hết các tương tác đều thô (như thay thế một trang hoặc toàn bộ một phần), thì việc ghi nhớ thường là không cần thiết. Mặt khác, nếu ứng dụng của bạn giống một trình chỉnh sửa bản vẽ hơn và hầu hết các tương tác đều chi tiết (như di chuyển hình dạng), thì bạn có thể thấy việc ghi nhớ rất hữu ích.

Việc lưu trữ một hàm bằng `useCallback` chỉ có giá trị trong một vài trường hợp:

*   Bạn truyền nó như một prop cho một component được bọc trong [`memo`.](/reference/react/memo) Bạn muốn bỏ qua việc render lại nếu giá trị không thay đổi. Việc ghi nhớ cho phép component của bạn chỉ render lại nếu các dependency thay đổi.
*   Hàm bạn đang truyền sau này được sử dụng làm dependency của một số Hook. Ví dụ: một hàm khác được bọc trong `useCallback` phụ thuộc vào nó hoặc bạn phụ thuộc vào hàm này từ [`useEffect.`](/reference/react/useEffect)

Không có lợi ích gì khi bọc một hàm trong `useCallback` trong các trường hợp khác. Cũng không có hại đáng kể nào khi làm điều đó, vì vậy một số nhóm chọn không nghĩ về các trường hợp riêng lẻ và ghi nhớ càng nhiều càng tốt. Nhược điểm là mã trở nên khó đọc hơn. Ngoài ra, không phải tất cả các ghi nhớ đều hiệu quả: một giá trị duy nhất "luôn mới" là đủ để phá vỡ việc ghi nhớ cho toàn bộ component.

Lưu ý rằng `useCallback` không ngăn chặn việc *tạo* hàm. Bạn luôn tạo một hàm (và điều đó là tốt!), nhưng React bỏ qua nó và trả lại cho bạn một hàm đã lưu trữ nếu không có gì thay đổi.

**Trong thực tế, bạn có thể làm cho rất nhiều ghi nhớ trở nên không cần thiết bằng cách tuân theo một vài nguyên tắc:**

1.  Khi một component bao bọc trực quan các component khác, hãy để nó [chấp nhận JSX làm children.](/learn/passing-props-to-a-component#passing-jsx-as-children) Sau đó, nếu component bao bọc cập nhật state của chính nó, React biết rằng các component con của nó không cần render lại.
2.  Ưu tiên state cục bộ và không [nâng state lên](/learn/sharing-state-between-components) xa hơn mức cần thiết. Không giữ state tạm thời như biểu mẫu và việc một mục có được di chuột hay không ở đầu cây của bạn hoặc trong một thư viện state toàn cục.
3.  Giữ cho [logic render của bạn thuần túy.](/learn/keeping-components-pure) Nếu việc render lại một component gây ra sự cố hoặc tạo ra một tạo tác trực quan đáng chú ý nào đó, thì đó là một lỗi trong component của bạn! Sửa lỗi thay vì thêm ghi nhớ.
4.  Tránh [các Effect không cần thiết cập nhật state.](/learn/you-might-not-need-an-effect) Hầu hết các vấn đề về hiệu suất trong các ứng dụng React là do chuỗi các bản cập nhật bắt nguồn từ các Effect khiến các component của bạn render đi render lại.
5.  Cố gắng [xóa các dependency không cần thiết khỏi Effect của bạn.](/learn/removing-effect-dependencies) Ví dụ: thay vì ghi nhớ, thường đơn giản hơn là di chuyển một số đối tượng hoặc một hàm bên trong một Effect hoặc bên ngoài component.

Nếu một tương tác cụ thể vẫn cảm thấy chậm, [hãy sử dụng trình cấu hình React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) để xem những component nào được hưởng lợi nhiều nhất từ việc ghi nhớ và thêm ghi nhớ khi cần thiết. Các nguyên tắc này giúp các component của bạn dễ gỡ lỗi và hiểu hơn, vì vậy tốt nhất là tuân theo chúng trong mọi trường hợp. Về lâu dài, chúng tôi đang nghiên cứu [thực hiện ghi nhớ tự động](https://www.youtube.com/watch?v=lGEMwh32soc) để giải quyết vấn đề này một lần và mãi mãi.

</DeepDive>

<Recipes titleText="Sự khác biệt giữa useCallback và khai báo trực tiếp một hàm" titleId="examples-rerendering">

#### Bỏ qua việc render lại với `useCallback` và `memo` {/*skipping-re-rendering-with-usecallback-and-memo*/}

Trong ví dụ này, component `ShippingForm` bị **làm chậm một cách giả tạo** để bạn có thể thấy điều gì xảy ra khi một component React mà bạn đang render thực sự chậm. Hãy thử tăng bộ đếm và chuyển đổi chủ đề.

Việc tăng bộ đếm có cảm giác chậm vì nó buộc `ShippingForm` bị làm chậm phải render lại. Điều đó được mong đợi vì bộ đếm đã thay đổi và do đó bạn cần phản ánh lựa chọn mới của người dùng trên màn hình.

Tiếp theo, hãy thử chuyển đổi chủ đề. **Nhờ `useCallback` cùng với [`memo`](/reference/react/memo), nó nhanh chóng mặc dù bị làm chậm một cách giả tạo!** `ShippingForm` đã bỏ qua việc render lại vì hàm `handleSubmit` không thay đổi. Hàm `handleSubmit` không thay đổi vì cả `productId` và `referrer` (các dependency `useCallback` của bạn) đều không thay đổi kể từ lần render cuối cùng.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Luôn luôn render lại một component {/*always-re-rendering-a-component*/}

Trong ví dụ này, việc triển khai `ShippingForm` cũng bị **làm chậm một cách giả tạo** để bạn có thể thấy điều gì xảy ra khi một component React mà bạn đang render thực sự chậm. Hãy thử tăng bộ đếm và chuyển đổi chủ đề.

Không giống như trong ví dụ trước, việc chuyển đổi chủ đề bây giờ cũng chậm! Điều này là do **không có lệnh gọi `useCallback` trong phiên bản này,** vì vậy `handleSubmit` luôn là một hàm mới và component `ShippingForm` bị chậm không thể bỏ qua việc render lại.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Chế độ tối
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Hãy tưởng tượng điều này gửi một yêu cầu...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[CHẬM MỘT CÁCH GIẢ TẠO] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Không làm gì trong 500 ms để mô phỏng mã cực kỳ chậm
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Lưu ý: <code>ShippingForm</code> bị làm chậm một cách giả tạo!</b></p>
      <label>
        Số lượng sản phẩm:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Đường:
        <input name="street" />
      </label>
      <label>
        Thành phố:
        <input name="city" />
      </label>
      <label>
        Mã bưu điện:
        <input name="zipCode" />
      </label>
      <button type="submit">Gửi</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


Tuy nhiên, đây là cùng một mã **với độ chậm nhân tạo đã được loại bỏ.** Việc thiếu `useCallback` có cảm thấy đáng chú ý hay không?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Chế độ tối
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Hãy tưởng tượng điều này gửi một yêu cầu...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Rendering <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Số lượng sản phẩm:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Đường:
        <input name="street" />
      </label>
      <label>
        Thành phố:
        <input name="city" />
      </label>
      <label>
        Mã bưu điện:
        <input name="zipCode" />
      </label>
      <button type="submit">Gửi</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


Thông thường, mã không có memoization vẫn hoạt động tốt. Nếu các tương tác của bạn đủ nhanh, bạn không cần memoization.

Hãy nhớ rằng bạn cần chạy React ở chế độ production, tắt [React Developer Tools](/learn/react-developer-tools) và sử dụng các thiết bị tương tự như những thiết bị mà người dùng ứng dụng của bạn có để có được cảm giác thực tế về những gì thực sự làm chậm ứng dụng của bạn.

<Solution />

</Recipes>

---

### Cập nhật state từ một callback đã memo {/*updating-state-from-a-memoized-callback*/}

Đôi khi, bạn có thể cần cập nhật state dựa trên state trước đó từ một callback đã memo.

Hàm `handleAddTodo` này chỉ định `todos` làm dependency vì nó tính toán các todos tiếp theo từ nó:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

Bạn thường muốn các hàm đã memo có càng ít dependency càng tốt. Khi bạn chỉ đọc một số state để tính toán state tiếp theo, bạn có thể loại bỏ dependency đó bằng cách truyền một [hàm cập nhật](/reference/react/useState#updating-state-based-on-the-previous-state) thay thế:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ Không cần dependency todos
  // ...
```

Ở đây, thay vì biến `todos` thành một dependency và đọc nó bên trong, bạn truyền một hướng dẫn về *cách* cập nhật state (`todos => [...todos, newTodo]`) cho React. [Đọc thêm về các hàm cập nhật.](/reference/react/useState#updating-state-based-on-the-previous-state)

---

### Ngăn chặn một Effect kích hoạt quá thường xuyên {/*preventing-an-effect-from-firing-too-often*/}

Đôi khi, bạn có thể muốn gọi một hàm từ bên trong một [Effect:](/learn/synchronizing-with-effects)

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Điều này tạo ra một vấn đề. [Mọi giá trị phản ứng phải được khai báo là một dependency của Effect của bạn.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Tuy nhiên, nếu bạn khai báo `createOptions` là một dependency, nó sẽ khiến Effect của bạn liên tục kết nối lại với phòng chat:


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Vấn đề: Dependency này thay đổi trên mỗi lần render
  // ...
```

Để giải quyết vấn đề này, bạn có thể bọc hàm bạn cần gọi từ một Effect vào `useCallback`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Chỉ thay đổi khi roomId thay đổi

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Chỉ thay đổi khi createOptions thay đổi
  // ...
```

Điều này đảm bảo rằng hàm `createOptions` là giống nhau giữa các lần render lại nếu `roomId` là giống nhau. **Tuy nhiên, tốt hơn nữa là loại bỏ sự cần thiết của một dependency hàm.** Di chuyển hàm của bạn *vào bên trong* Effect:

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ Không cần useCallback hoặc dependency hàm!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Chỉ thay đổi khi roomId thay đổi
  // ...
```

Bây giờ mã của bạn đơn giản hơn và không cần `useCallback`. [Tìm hiểu thêm về cách loại bỏ dependency Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### Tối ưu hóa một Hook tùy chỉnh {/*optimizing-a-custom-hook*/}

Nếu bạn đang viết một [Hook tùy chỉnh,](/learn/reusing-logic-with-custom-hooks) bạn nên bọc bất kỳ hàm nào mà nó trả về vào `useCallback`:

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

Điều này đảm bảo rằng người dùng Hook của bạn có thể tối ưu hóa mã của riêng họ khi cần.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Mỗi khi component của tôi render, `useCallback` trả về một hàm khác {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

Hãy chắc chắn rằng bạn đã chỉ định mảng dependency làm đối số thứ hai!

Nếu bạn quên mảng dependency, `useCallback` sẽ trả về một hàm mới mỗi lần:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Trả về một hàm mới mỗi lần: không có mảng dependency
  // ...
```

Đây là phiên bản đã sửa truyền mảng dependency làm đối số thứ hai:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Không trả về một hàm mới một cách không cần thiết
  // ...
```

Nếu điều này không giúp ích, thì vấn đề là ít nhất một trong các dependency của bạn khác với lần render trước. Bạn có thể gỡ lỗi vấn đề này bằng cách ghi thủ công các dependency của bạn vào console:

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

Sau đó, bạn có thể nhấp chuột phải vào các mảng từ các lần render lại khác nhau trong console và chọn "Store as a global variable" cho cả hai. Giả sử cái đầu tiên được lưu là `temp1` và cái thứ hai được lưu là `temp2`, sau đó bạn có thể sử dụng console của trình duyệt để kiểm tra xem mỗi dependency trong cả hai mảng có giống nhau hay không:

```js
Object.is(temp1[0], temp2[0]); // Dependency đầu tiên có giống nhau giữa các mảng không?
Object.is(temp1[1], temp2[1]); // Dependency thứ hai có giống nhau giữa các mảng không?
Object.is(temp1[2], temp2[2]); // ... và cứ thế cho mọi dependency ...
```

Khi bạn tìm thấy dependency nào đang phá vỡ memoization, hãy tìm cách loại bỏ nó hoặc [memoize nó luôn.](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)

---

### Tôi cần gọi `useCallback` cho mỗi mục danh sách trong một vòng lặp, nhưng nó không được phép {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Giả sử component `Chart` được bọc trong [`memo`](/reference/react/memo). Bạn muốn bỏ qua việc render lại mọi `Chart` trong danh sách khi component `ReportList` render lại. Tuy nhiên, bạn không thể gọi `useCallback` trong một vòng lặp:

```js {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 Bạn không thể gọi useCallback trong một vòng lặp như thế này:
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

Thay vào đó, hãy trích xuất một component cho một mục riêng lẻ và đặt `useCallback` ở đó:

```js {5,12-21}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Gọi useCallback ở cấp cao nhất:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

Ngoài ra, bạn có thể loại bỏ `useCallback` trong đoạn mã cuối cùng và thay vào đó bọc chính `Report` trong [`memo`.](/reference/react/memo) Nếu prop `item` không thay đổi, `Report` sẽ bỏ qua việc render lại, vì vậy `Chart` cũng sẽ bỏ qua việc render lại:

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
