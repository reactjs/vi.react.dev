---
id: hooks-rules
title: Nguyên tắc sử dụng Hook
permalink: docs/hooks-rules.html
next: hooks-custom.html
prev: hooks-effect.html
---

*Hook* là một tính năng mới từ React 16.8. Nó cho phép sử dụng state và các tính năng khác của React mà không cần viết dạng class

Hook là các function JavaScript, có những quy luật bạn cần phải tuân theo khi sử dụng. Chúng tôi có [một plugin linter](https://www.npmjs.com/package/eslint-plugin-react-hooks) để đảm bảo các luật này luôn luôn được áp dụng đúng:

### Chỉ gọi Hook ở trên cùng {#only-call-hooks-at-the-top-level}

**Không gọi hook bên trong loop, câu điều kiện, hay các function lồng với nhau.** Thay vì đó, luôn sử dụng Hook ở phần trên cùng của React function, trước bất cứ việc trả về (return) nào. Với cách này, bạn đảm bảo các Hook được gọi theo đúng thứ tự trong các lần render. Nó cho phép React có được đúng state giữa nhiều lần gọi `useState` và `useEffect`. (Nếu bạn có thắc mắc, chúng tôi sẽ giải thích trong phần giải thích cụ thể hơn [bên dưới](#explanation).)

### Chỉ gọi Hook từ React Function {#only-call-hooks-from-react-functions}

**Không gọi Hook từ mà function JavaScript.** Thay vì đó, bạn có thể:

* ✅ Gọi Hook từ React function components.
* ✅ Gọi Hook từ custom Hook (Chúng ta sẽ học [ở trang sau](/docs/hooks-custom.html)).

Khi tuân theo quy luật này, chúng ta đảm bảo tất cả logic trong 1 component rõ ràng nhất.

## ESLint Plugin {#eslint-plugin}

Chúng tôi có cung cấp plugin ESLint tên là [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) đảm bảo 2 luật này luôn được áp dụng. Nếu thích bạn có thể thêm vào project:

Plugin có mặc định trong [Create React App](/docs/create-a-new-react-app.html#create-react-app).

```bash
npm install eslint-plugin-react-hooks --save-dev
```

```js
// cài đặt ESLint
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error", // Kiểm tra rule của Hook
    "react-hooks/exhaustive-deps": "warn" // Kiểm tra effect dependency
  }
}
```

**Bạn có thể bỏ qua và đọc tiếp trang chỉ dẫn [tạo custom Hook](/docs/hooks-custom.html) ngay bây giờ.** Ở đây, chúng ta sẽ tiếp tục giải thích lý do đằng sau những quy luật này.

## Giải thích {#explanation}

Như chúng ta [đã học trước đây](/docs/hooks-state.html#tip-using-multiple-state-variables), chúng ta có thể sử dụng nhiều state hoặc nhiều effect trên một component

```js
function Form() {
  // 1. Sử dụng state tên name
  const [name, setName] = useState('Mary');

  // 2. Sử dụng một effect lưu giá trị trên form
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. Sử dụng state tên surname
  const [surname, setSurname] = useState('Poppins');

  // 4. Sử dụng 1 effect cập nhập title
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```

Vậy làm sao React biết được state nào ứng với lúc gọi `useState` ? Câu trả lời là **React dựa trên thứ tự Hook được gọi**. Trong ví dụ trên, vì thứ tự Hook được gọi đúng theo lúc khai báo trong khi render:

```js
// ------------
// Lần đầu render
// ------------
useState('Mary')           // 1. Khởi tạo  biết name với giá trị 'Mary'
useEffect(persistForm)     // 2. Thêm một effect
useState('Poppins')        // 3. KHởi tạo biến surname với giá trị 'Poppins'
useEffect(updateTitle)     // 4. Thêm một effect cập nhập title

// -------------
// Lần gọi render thứ 2
// -------------
useState('Mary')           // 1. Đọc giá trị biến name
useEffect(persistForm)     // 2. Thay thế effect cũ
useState('Poppins')        // 3. Đọc giá trị biến surname
useEffect(updateTitle)     // 4. Thay thế effect cập nhập title

// ...
```

Miễn là thứ tự của Hook gọi đúng theo thứ tự giữa các lần render, React có thể liên kết local state với nhau. Chuyện gì sẽ xảy ra nếu chúng ta đặt câu gọi Hook (ví dụ như `persistForm` bên trong trong câu điều kiện?
```js
  // 🔴 Chúng ta vi phạm nguyên tắc không đặt trong câu điều kiện
  if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
```

Trong lần đầu render, mệnh đề điều kiện `name !== ''` trả về `true`, Hook sẽ được gọi. Tuy nhiên, trong lần gọi tiếp theo, user có thể xóa giá trị trong form, việc này làm cho mệnh đề điều kiện trả về `false`, chúng ta bỏ qua câu gọi effect, thứ tự gọi Hook cũng thay đổi theo:

```js
useState('Mary')           // 1. Đọc giá trị name
// useEffect(persistForm)  // 🔴 Hook bị bỏ qua!
useState('Poppins')        // 🔴 2 (thật ra là 3). Không đọc được giá trị surname
useEffect(updateTitle)     // 🔴 3 (thật ra là 4).  Không thể thay thế effect
```

React không biết được trả về gì cho `useState` ở lần 2. React tưởng là Hook thứ 2 trong component tương ứng với effect `persistForm`, cũng giống như lần render trước, tuy nhiên không còn đúng nữa. Kể từ lúc đó, tất cả những lần gọi Hook sau đều bỏ qua một bước, dẫn đến bug.

**Đó là lý do tại sao phải gọi Hook ở trên cùng của component**. Nếu chúng ta muốn chạy effect theo điều kiện, chúng ta có thể đặt điều kiện *bên trong* Hook:

```js
  useEffect(function persistForm() {
    // 👍 Không phá vỡ nguyên tắc nữa
    if (name !== '') {
      localStorage.setItem('formData', name);
    }
  });
```

**Lưu ý, bạn không cần lo lắng về vấn đề này nếu dùng [ lint](https://www.npmjs.com/package/eslint-plugin-react-hooks).** Giờ bạn cũng hiểu được *tại sao* Hook làm việc như vậy, và tại sao chúng ta lại có những nguyên tắc này.

## Tiếp theo {#next-steps}

Cuối cùng thì chúng ta cũng đã sẵn sàng học [cách viết custom  Hooks](/docs/hooks-custom.html)! Custom Hook cho phép chúng ta kết hợp các Hook được cung cấp bởi React với những gì bạn muốn, tái sử dụng những logic giữa các component.
