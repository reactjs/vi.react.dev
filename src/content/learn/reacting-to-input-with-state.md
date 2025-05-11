---
title: Phản hồi Đầu vào bằng State
---

<Intro>

React cung cấp một cách khai báo để thao tác UI. Thay vì thao tác trực tiếp các phần tử UI riêng lẻ, bạn mô tả các trạng thái khác nhau mà component của bạn có thể ở và chuyển đổi giữa chúng để phản hồi đầu vào của người dùng. Điều này tương tự như cách các nhà thiết kế nghĩ về UI.

</Intro>

<YouWillLearn>

* Sự khác biệt giữa lập trình UI khai báo và lập trình UI mệnh lệnh
* Cách liệt kê các trạng thái hiển thị khác nhau mà component của bạn có thể ở
* Cách kích hoạt các thay đổi giữa các trạng thái hiển thị khác nhau từ code

</YouWillLearn>

## So sánh UI khai báo với UI mệnh lệnh {/*how-declarative-ui-compares-to-imperative*/}

Khi bạn thiết kế các tương tác UI, bạn có thể nghĩ về cách UI *thay đổi* để phản hồi các hành động của người dùng. Hãy xem xét một biểu mẫu cho phép người dùng gửi câu trả lời:

* Khi bạn nhập nội dung gì đó vào biểu mẫu, nút "Gửi" **sẽ được bật.**
* Khi bạn nhấn "Gửi", cả biểu mẫu và nút **sẽ bị tắt,** và một spinner **xuất hiện.**
* Nếu yêu cầu mạng thành công, biểu mẫu **sẽ bị ẩn,** và thông báo "Cảm ơn" **xuất hiện.**
* Nếu yêu cầu mạng không thành công, một thông báo lỗi **xuất hiện,** và biểu mẫu **sẽ được bật** lại.

Trong **lập trình mệnh lệnh,** điều trên tương ứng trực tiếp với cách bạn triển khai tương tác. Bạn phải viết các hướng dẫn chính xác để thao tác UI tùy thuộc vào những gì vừa xảy ra. Đây là một cách khác để nghĩ về điều này: hãy tưởng tượng bạn đang đi cạnh ai đó trong xe hơi và chỉ cho họ từng ngã rẽ nơi cần đi.

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png" alt="Trong một chiếc xe hơi do một người trông lo lắng đại diện cho JavaScript lái, một hành khách ra lệnh cho người lái xe thực hiện một chuỗi điều hướng phức tạp từng ngã rẽ." />

Họ không biết bạn muốn đi đâu, họ chỉ làm theo lệnh của bạn. (Và nếu bạn chỉ sai đường, bạn sẽ đến nhầm chỗ!) Nó được gọi là *mệnh lệnh* vì bạn phải "ra lệnh" cho từng phần tử, từ spinner đến nút, cho máy tính biết *cách* cập nhật UI.

Trong ví dụ về lập trình UI mệnh lệnh này, biểu mẫu được xây dựng *không* có React. Nó chỉ sử dụng [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) của trình duyệt:

<Sandpack>

```js src/index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>City quiz</h2>
  <p>
    What city is located on two continents?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Submit</button>
  <p id="loading" style="display: none">Loading...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">That's right!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

Thao tác UI một cách mệnh lệnh hoạt động đủ tốt cho các ví dụ riêng lẻ, nhưng nó trở nên khó quản lý hơn theo cấp số nhân trong các hệ thống phức tạp hơn. Hãy tưởng tượng việc cập nhật một trang đầy các biểu mẫu khác nhau như thế này. Việc thêm một phần tử UI mới hoặc một tương tác mới sẽ yêu cầu kiểm tra cẩn thận tất cả code hiện có để đảm bảo bạn không gây ra lỗi (ví dụ: quên hiển thị hoặc ẩn nội dung gì đó).

React được xây dựng để giải quyết vấn đề này.

Trong React, bạn không thao tác trực tiếp UI--nghĩa là bạn không bật, tắt, hiển thị hoặc ẩn các component trực tiếp. Thay vào đó, bạn **khai báo những gì bạn muốn hiển thị,** và React sẽ tìm ra cách cập nhật UI. Hãy nghĩ đến việc bắt taxi và nói với tài xế nơi bạn muốn đến thay vì chỉ cho họ chính xác nơi cần rẽ. Công việc của tài xế là đưa bạn đến đó, và họ thậm chí có thể biết một số đường tắt mà bạn chưa xem xét!

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="Trong một chiếc xe hơi do React lái, một hành khách yêu cầu được đưa đến một địa điểm cụ thể trên bản đồ. React tìm ra cách thực hiện điều đó." />

## Tư duy về UI một cách khai báo {/*thinking-about-ui-declaratively*/}

Bạn đã thấy cách triển khai một biểu mẫu một cách mệnh lệnh ở trên. Để hiểu rõ hơn về cách tư duy trong React, bạn sẽ thực hiện lại UI này trong React bên dưới:

1. **Xác định** các trạng thái hiển thị khác nhau của component của bạn
2. **Xác định** điều gì kích hoạt những thay đổi trạng thái đó
3. **Biểu diễn** trạng thái trong bộ nhớ bằng `useState`
4. **Loại bỏ** bất kỳ biến trạng thái không cần thiết nào
5. **Kết nối** các trình xử lý sự kiện để đặt trạng thái

### Bước 1: Xác định các trạng thái hiển thị khác nhau của component của bạn {/*step-1-identify-your-components-different-visual-states*/}

Trong khoa học máy tính, bạn có thể nghe nói về một ["máy trạng thái"](https://en.wikipedia.org/wiki/Finite-state_machine) đang ở một trong số các "trạng thái". Nếu bạn làm việc với một nhà thiết kế, bạn có thể đã thấy các bản mô phỏng cho các "trạng thái hiển thị" khác nhau. React đứng ở giao điểm giữa thiết kế và khoa học máy tính, vì vậy cả hai ý tưởng này đều là nguồn cảm hứng.

Đầu tiên, bạn cần hình dung tất cả các "trạng thái" khác nhau của UI mà người dùng có thể thấy:

* **Trống**: Biểu mẫu có nút "Gửi" bị tắt.
* **Đang nhập**: Biểu mẫu có nút "Gửi" được bật.
* **Đang gửi**: Biểu mẫu hoàn toàn bị tắt. Spinner được hiển thị.
* **Thành công**: Thông báo "Cảm ơn" được hiển thị thay vì biểu mẫu.
* **Lỗi**: Giống như trạng thái Đang nhập, nhưng có thêm thông báo lỗi.

Giống như một nhà thiết kế, bạn sẽ muốn "mô phỏng" hoặc tạo "bản mô phỏng" cho các trạng thái khác nhau trước khi bạn thêm logic. Ví dụ: đây là bản mô phỏng chỉ cho phần hiển thị của biểu mẫu. Bản mô phỏng này được điều khiển bởi một prop có tên là `status` với giá trị mặc định là `'empty'`:

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Submit
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

Bạn có thể gọi prop đó là bất cứ điều gì bạn thích, việc đặt tên không quan trọng. Hãy thử chỉnh sửa `status = 'empty'` thành `status = 'success'` để thấy thông báo thành công xuất hiện. Mô phỏng cho phép bạn nhanh chóng lặp lại trên UI trước khi bạn kết nối bất kỳ logic nào. Dưới đây là một nguyên mẫu đầy đủ hơn của cùng một component, vẫn "được điều khiển" bởi prop `status`:

<Sandpack>

```js
export default function Form({
  // Try 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Submit
        </button>
        {status === 'error' &&
          <p className="Error">
            Good guess but a wrong answer. Try again!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### Hiển thị nhiều trạng thái hiển thị cùng một lúc {/*displaying-many-visual-states-at-once*/}

Nếu một component có nhiều trạng thái hiển thị, có thể thuận tiện để hiển thị tất cả chúng trên một trang:

<Sandpack>

```js src/App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js src/Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Good guess but a wrong answer. Try again!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

Các trang như thế này thường được gọi là "living styleguides" hoặc "storybooks".

</DeepDive>

### Bước 2: Xác định điều gì kích hoạt những thay đổi trạng thái đó {/*step-2-determine-what-triggers-those-state-changes*/}

Bạn có thể kích hoạt cập nhật trạng thái để phản hồi hai loại đầu vào:

* **Đầu vào của con người,** như nhấp vào nút, nhập vào một trường, điều hướng một liên kết.
* **Đầu vào của máy tính,** như phản hồi mạng đến, thời gian chờ hoàn thành, hình ảnh tải.

<IllustrationBlock>
  <Illustration caption="Human inputs" alt="A finger." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Computer inputs" alt="Ones and zeroes." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

Trong cả hai trường hợp, **bạn phải đặt [biến trạng thái](/learn/state-a-components-memory#anatomy-of-usestate) để cập nhật UI.** Đối với biểu mẫu bạn đang phát triển, bạn sẽ cần thay đổi trạng thái để phản hồi một vài đầu vào khác nhau:

* **Thay đổi đầu vào văn bản** (con người) sẽ chuyển nó từ trạng thái *Trống* sang trạng thái *Đang nhập* hoặc ngược lại, tùy thuộc vào việc hộp văn bản có trống hay không.
* **Nhấp vào nút Gửi** (con người) sẽ chuyển nó sang trạng thái *Đang gửi*.
* **Phản hồi mạng thành công** (máy tính) sẽ chuyển nó sang trạng thái *Thành công*.
* **Phản hồi mạng không thành công** (máy tính) sẽ chuyển nó sang trạng thái *Lỗi* với thông báo lỗi phù hợp.

<Note>

Lưu ý rằng đầu vào của con người thường yêu cầu [trình xử lý sự kiện](/learn/responding-to-events)!

</Note>

Để giúp hình dung luồng này, hãy thử vẽ từng trạng thái trên giấy dưới dạng một vòng tròn được gắn nhãn và mỗi thay đổi giữa hai trạng thái dưới dạng một mũi tên. Bạn có thể phác thảo nhiều luồng theo cách này và sắp xếp các lỗi trước khi triển khai.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Lưu đồ di chuyển từ trái sang phải với 5 nút. Nút đầu tiên có nhãn 'trống' có một cạnh có nhãn 'bắt đầu nhập' được kết nối với một nút có nhãn 'đang nhập'. Nút đó có một cạnh có nhãn 'nhấn gửi' được kết nối với một nút có nhãn 'đang gửi', nút này có hai cạnh. Cạnh bên trái có nhãn 'lỗi mạng' kết nối với một nút có nhãn 'lỗi'. Cạnh bên phải có nhãn 'mạng thành công' kết nối với một nút có nhãn 'thành công'." >

Trạng thái biểu mẫu

</Diagram>

</DiagramGroup>

### Bước 3: Biểu diễn trạng thái trong bộ nhớ bằng `useState` {/*step-3-represent-the-state-in-memory-with-usestate*/}

Tiếp theo, bạn sẽ cần biểu diễn các trạng thái hiển thị của component của bạn trong bộ nhớ bằng [`useState`.](/reference/react/useState) Sự đơn giản là chìa khóa: mỗi phần của trạng thái là một "mảnh ghép chuyển động" và **bạn muốn càng ít "mảnh ghép chuyển động" càng tốt.** Càng phức tạp thì càng có nhiều lỗi!

Bắt đầu với trạng thái *tuyệt đối phải* có ở đó. Ví dụ: bạn sẽ cần lưu trữ `answer` cho đầu vào và `error` (nếu có) để lưu trữ lỗi cuối cùng:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

Sau đó, bạn sẽ cần một biến trạng thái đại diện cho một trong các trạng thái hiển thị mà bạn muốn hiển thị. Thường có nhiều hơn một cách để biểu diễn điều đó trong bộ nhớ, vì vậy bạn sẽ cần thử nghiệm với nó.

Nếu bạn gặp khó khăn trong việc nghĩ ra cách tốt nhất ngay lập tức, hãy bắt đầu bằng cách thêm đủ trạng thái mà bạn *chắc chắn* rằng tất cả các trạng thái hiển thị có thể có đều được bao phủ:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

Ý tưởng đầu tiên của bạn có thể không phải là tốt nhất, nhưng điều đó không sao--tái cấu trúc trạng thái là một phần của quy trình!

### Bước 4: Loại bỏ bất kỳ biến trạng thái không cần thiết nào {/*step-4-remove-any-non-essential-state-variables*/}

Bạn muốn tránh trùng lặp trong nội dung trạng thái để bạn chỉ theo dõi những gì cần thiết. Dành một chút thời gian để tái cấu trúc cấu trúc trạng thái của bạn sẽ giúp các component của bạn dễ hiểu hơn, giảm trùng lặp và tránh các ý nghĩa không mong muốn. Mục tiêu của bạn là **ngăn chặn các trường hợp trạng thái trong bộ nhớ không đại diện cho bất kỳ UI hợp lệ nào mà bạn muốn người dùng thấy.** (Ví dụ: bạn không bao giờ muốn hiển thị thông báo lỗi và tắt đầu vào cùng một lúc, nếu không người dùng sẽ không thể sửa lỗi!)

Dưới đây là một số câu hỏi bạn có thể hỏi về các biến trạng thái của mình:

* **Trạng thái này có gây ra nghịch lý không?** Ví dụ: `isTyping` và `isSubmitting` không thể đồng thời là `true`. Một nghịch lý thường có nghĩa là trạng thái không đủ ràng buộc. Có bốn tổ hợp có thể có của hai boolean, nhưng chỉ ba tổ hợp tương ứng với các trạng thái hợp lệ. Để loại bỏ trạng thái "không thể", bạn có thể kết hợp chúng thành một `status` phải là một trong ba giá trị: `'typing'`, `'submitting'` hoặc `'success'`.
* **Thông tin tương tự đã có trong một biến trạng thái khác chưa?** Một nghịch lý khác: `isEmpty` và `isTyping` không thể đồng thời là `true`. Bằng cách tạo chúng thành các biến trạng thái riêng biệt, bạn có nguy cơ chúng không đồng bộ và gây ra lỗi. May mắn thay, bạn có thể loại bỏ `isEmpty` và thay vào đó kiểm tra `answer.length === 0`.
* **Bạn có thể nhận được thông tin tương tự từ nghịch đảo của một biến trạng thái khác không?** Không cần `isError` vì bạn có thể kiểm tra `error !== null` thay thế.

Sau khi dọn dẹp này, bạn còn lại 3 (giảm từ 7!) biến trạng thái *cần thiết*:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

Bạn biết chúng là cần thiết, vì bạn không thể loại bỏ bất kỳ biến nào trong số chúng mà không làm hỏng chức năng.

<DeepDive>

#### Loại bỏ các trạng thái “không thể” bằng một reducer {/*eliminating-impossible-states-with-a-reducer*/}

Ba biến này là một biểu diễn đủ tốt về trạng thái của biểu mẫu này. Tuy nhiên, vẫn còn một số trạng thái trung gian không hoàn toàn có ý nghĩa. Ví dụ: `error` khác null không có ý nghĩa khi `status` là `'success'`. Để mô hình hóa trạng thái chính xác hơn, bạn có thể [trích xuất nó vào một reducer.](/learn/extracting-state-logic-into-a-reducer) Reducer cho phép bạn hợp nhất nhiều biến trạng thái thành một đối tượng duy nhất và hợp nhất tất cả logic liên quan!

</DeepDive>

### Bước 5: Kết nối các trình xử lý sự kiện để đặt trạng thái {/*step-5-connect-the-event-handlers-to-set-state*/}

Cuối cùng, tạo các trình xử lý sự kiện để cập nhật trạng thái. Dưới đây là biểu mẫu cuối cùng, với tất cả các trình xử lý sự kiện được kết nối:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

Mặc dù code này dài hơn ví dụ mệnh lệnh ban đầu, nhưng nó ít bị lỗi hơn nhiều. Việc thể hiện tất cả các tương tác như là các thay đổi trạng thái cho phép bạn giới thiệu các trạng thái hiển thị mới mà không làm hỏng các trạng thái hiện có. Nó cũng cho phép bạn thay đổi những gì sẽ được hiển thị trong mỗi trạng thái mà không thay đổi logic của chính tương tác đó.

<Recap>

* Lập trình khai báo có nghĩa là mô tả giao diện người dùng cho mỗi trạng thái hiển thị thay vì quản lý chi tiết giao diện người dùng (mệnh lệnh).
* Khi phát triển một component:
  1. Xác định tất cả các trạng thái hiển thị của nó.
  2. Xác định các tác nhân kích hoạt thay đổi trạng thái từ con người và máy tính.
  3. Mô hình hóa trạng thái bằng `useState`.
  4. Loại bỏ trạng thái không cần thiết để tránh lỗi và nghịch lý.
  5. Kết nối các trình xử lý sự kiện để đặt trạng thái.

</Recap>

<Challenges>

#### Thêm và xóa một lớp CSS {/*add-and-remove-a-css-class*/}

Làm cho việc nhấp vào hình ảnh *xóa* lớp CSS `background--active` khỏi `<div>` bên ngoài, nhưng *thêm* lớp `picture--active` vào `<img>`. Nhấp lại vào nền sẽ khôi phục các lớp CSS ban đầu.

Về mặt hình ảnh, bạn nên mong đợi rằng việc nhấp vào hình ảnh sẽ loại bỏ nền màu tím và làm nổi bật đường viền của hình ảnh. Nhấp vào bên ngoài hình ảnh sẽ làm nổi bật nền, nhưng loại bỏ điểm nổi bật của đường viền hình ảnh.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

Component này có hai trạng thái hiển thị: khi hình ảnh hoạt động và khi hình ảnh không hoạt động:

* Khi hình ảnh hoạt động, các lớp CSS là `background` và `picture picture--active`.
* Khi hình ảnh không hoạt động, các lớp CSS là `background background--active` và `picture`.

Một biến trạng thái boolean duy nhất là đủ để ghi nhớ xem hình ảnh có hoạt động hay không. Nhiệm vụ ban đầu là xóa hoặc thêm các lớp CSS. Tuy nhiên, trong React, bạn cần *mô tả* những gì bạn muốn thấy thay vì *thao tác* các phần tử giao diện người dùng. Vì vậy, bạn cần tính toán cả hai lớp CSS dựa trên trạng thái hiện tại. Bạn cũng cần [ngăn chặn sự lan truyền](/learn/responding-to-events#stopping-propagation) để việc nhấp vào hình ảnh không được đăng ký là một cú nhấp vào nền.

Xác minh rằng phiên bản này hoạt động bằng cách nhấp vào hình ảnh và sau đó bên ngoài nó:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Ngoài ra, bạn có thể trả về hai đoạn JSX riêng biệt:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Hãy nhớ rằng nếu hai đoạn JSX khác nhau mô tả cùng một cây, thì sự lồng nhau của chúng (thẻ `<div>` đầu tiên → thẻ `<img>` đầu tiên) phải thẳng hàng. Nếu không, việc chuyển đổi `isActive` sẽ tạo lại toàn bộ cây bên dưới và [đặt lại trạng thái của nó.](/learn/preserving-and-resetting-state) Đây là lý do tại sao, nếu một cây JSX tương tự được trả về trong cả hai trường hợp, thì tốt hơn là viết chúng dưới dạng một đoạn JSX duy nhất.

</Solution>

#### Trình chỉnh sửa hồ sơ {/*profile-editor*/}

Đây là một biểu mẫu nhỏ được triển khai bằng JavaScript và DOM thuần túy. Hãy chơi với nó để hiểu hành vi của nó:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Biểu mẫu này chuyển đổi giữa hai chế độ: ở chế độ chỉnh sửa, bạn thấy các trường nhập liệu và ở chế độ xem, bạn chỉ thấy kết quả. Nhãn nút thay đổi giữa "Chỉnh sửa" và "Lưu" tùy thuộc vào chế độ bạn đang ở. Khi bạn thay đổi các trường nhập liệu, thông báo chào mừng ở phía dưới sẽ cập nhật theo thời gian thực.

Nhiệm vụ của bạn là triển khai lại nó trong React trong sandbox bên dưới. Để thuận tiện cho bạn, đánh dấu đã được chuyển đổi sang JSX, nhưng bạn sẽ cần làm cho nó hiển thị và ẩn các trường nhập liệu như bản gốc.

Đảm bảo rằng nó cũng cập nhật văn bản ở phía dưới!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        First name:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Last name:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Edit Profile
      </button>
      <p><i>Hello, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

Bạn sẽ cần hai biến trạng thái để giữ các giá trị đầu vào: `firstName` và `lastName`. Bạn cũng sẽ cần một biến trạng thái `isEditing` để biết có hiển thị các trường nhập liệu hay không. Bạn _không_ nên cần một biến `fullName` vì tên đầy đủ luôn có thể được tính từ `firstName` và `lastName`.

Cuối cùng, bạn nên sử dụng [kết xuất có điều kiện](/learn/conditional-rendering) để hiển thị hoặc ẩn các trường nhập liệu tùy thuộc vào `isEditing`.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        First name:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Last name:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

So sánh giải pháp này với mã mệnh lệnh ban đầu. Chúng khác nhau như thế nào?

</Solution>

#### Tái cấu trúc giải pháp mệnh lệnh mà không cần React {/*refactor-the-imperative-solution-without-react*/}

Đây là sandbox ban đầu từ thử thách trước, được viết theo kiểu mệnh lệnh mà không cần React:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Hãy tưởng tượng React không tồn tại. Bạn có thể tái cấu trúc mã này theo cách làm cho logic ít bị lỗi hơn và tương tự như phiên bản React hơn không? Nó sẽ trông như thế nào nếu trạng thái là rõ ràng, giống như trong React?

Nếu bạn đang gặp khó khăn trong việc suy nghĩ về nơi bắt đầu, thì đoạn mã dưới đây đã có hầu hết cấu trúc tại chỗ. Nếu bạn bắt đầu từ đây, hãy điền vào logic còn thiếu trong hàm `updateDOM`. (Tham khảo mã gốc khi cần.)

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    // TODO: show inputs, hide content
  } else {
    editButton.textContent = 'Edit Profile';
    // TODO: hide inputs, show content
  }
  // TODO: update text labels
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

The missing logic included toggling the display of inputs and content, and updating the labels:

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>
Hàm `updateDOM` mà bạn đã viết cho thấy những gì React thực hiện bên dưới khi bạn đặt trạng thái. (Tuy nhiên, React cũng tránh chạm vào DOM đối với các thuộc tính không thay đổi kể từ lần cuối cùng chúng được đặt.)

</Solution>

</Challenges>
