---
title: act
---

<Intro>

`act` là một helper kiểm thử để áp dụng các cập nhật React đang chờ xử lý trước khi đưa ra các khẳng định.

```js
await act(async actFn)
```

</Intro>

Để chuẩn bị một component cho các khẳng định, hãy bọc code hiển thị nó và thực hiện các cập nhật bên trong một lệnh gọi `await act()`. Điều này làm cho quá trình kiểm thử của bạn chạy gần hơn với cách React hoạt động trong trình duyệt.

<Note>
Bạn có thể thấy việc sử dụng trực tiếp `act()` hơi dài dòng. Để tránh một số boilerplate, bạn có thể sử dụng một thư viện như [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), có các helper được bọc bằng `act()`.
</Note>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `await act(async actFn)` {/*await-act-async-actfn*/}

Khi viết các bài kiểm tra UI, các tác vụ như hiển thị, các sự kiện người dùng hoặc tìm nạp dữ liệu có thể được coi là "các đơn vị" tương tác với giao diện người dùng. React cung cấp một helper gọi là `act()` để đảm bảo rằng tất cả các cập nhật liên quan đến các "đơn vị" này đã được xử lý và áp dụng cho DOM trước khi bạn đưa ra bất kỳ khẳng định nào.

Tên `act` xuất phát từ mẫu [Arrange-Act-Assert](https://wiki.c2.com/?ArrangeActAssert).

```js {2,4}
it ('renders with button disabled', async () => {
  await act(async () => {
    root.render(<TestComponent />)
  });
  expect(container.querySelector('button')).toBeDisabled();
});
```

<Note>

Chúng tôi khuyên bạn nên sử dụng `act` với `await` và một hàm `async`. Mặc dù phiên bản đồng bộ hoạt động trong nhiều trường hợp, nhưng nó không hoạt động trong tất cả các trường hợp và do cách React lên lịch các cập nhật bên trong, rất khó để dự đoán khi nào bạn có thể sử dụng phiên bản đồng bộ.

Chúng tôi sẽ ngừng sử dụng và xóa phiên bản đồng bộ trong tương lai.

</Note>

#### Tham số {/*parameters*/}

* `async actFn`: Một hàm async bao bọc các lần hiển thị hoặc tương tác cho các component đang được kiểm tra. Bất kỳ cập nhật nào được kích hoạt trong `actFn`, sẽ được thêm vào hàng đợi act nội bộ, sau đó được làm mới cùng nhau để xử lý và áp dụng bất kỳ thay đổi nào đối với DOM. Vì nó là async, React cũng sẽ chạy bất kỳ code nào vượt qua ranh giới async và làm mới mọi cập nhật đã lên lịch.

#### Trả về {/*returns*/}

`act` không trả về bất cứ thứ gì.

## Cách sử dụng {/*usage*/}

Khi kiểm tra một component, bạn có thể sử dụng `act` để đưa ra các khẳng định về đầu ra của nó.

Ví dụ: giả sử chúng ta có component `Counter` này, các ví dụ sử dụng bên dưới cho thấy cách kiểm tra nó:

```js
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(prev => prev + 1);
  }

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>
        Click me
      </button>
    </div>
  )
}
```

### Hiển thị component trong kiểm thử {/*rendering-components-in-tests*/}

Để kiểm tra đầu ra hiển thị của một component, hãy bọc quá trình hiển thị bên trong `act()`:

```js  {10,12}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it('can render and update a counter', async () => {
  container = document.createElement('div');
  document.body.appendChild(container);
  
  // ✅ Render component bên trong act().
  await act(() => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });
  
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');
});
```

Ở đây, chúng ta tạo một container, thêm nó vào document và hiển thị component `Counter` bên trong `act()`. Điều này đảm bảo rằng component được hiển thị và các effect của nó được áp dụng trước khi đưa ra các khẳng định.

Sử dụng `act` đảm bảo rằng tất cả các cập nhật đã được áp dụng trước khi chúng ta đưa ra các khẳng định.

### Dispatch các event trong kiểm thử {/*dispatching-events-in-tests*/}

Để kiểm tra các event, hãy bọc quá trình dispatch event bên trong `act()`:

```js {14,16}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it.only('can render and update a counter', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  await act( async () => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });
  
  // ✅ Dispatch event bên trong act().
  await act(async () => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

Ở đây, chúng ta hiển thị component với `act`, và sau đó dispatch event bên trong một `act()` khác. Điều này đảm bảo rằng tất cả các cập nhật từ event được áp dụng trước khi đưa ra các khẳng định.

<Pitfall>

Đừng quên rằng việc dispatch các event DOM chỉ hoạt động khi DOM container được thêm vào document. Bạn có thể sử dụng một thư viện như [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) để giảm code boilerplate.

</Pitfall>

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi gặp lỗi: "The current testing environment is not configured to support act"(...)" {/*error-the-current-testing-environment-is-not-configured-to-support-act*/}

Sử dụng `act` yêu cầu thiết lập `global.IS_REACT_ACT_ENVIRONMENT=true` trong môi trường kiểm thử của bạn. Điều này là để đảm bảo rằng `act` chỉ được sử dụng trong môi trường chính xác.

Nếu bạn không đặt global, bạn sẽ thấy một lỗi như sau:

<ConsoleBlock level="error">

Warning: The current testing environment is not configured to support act(...)

</ConsoleBlock>

Để sửa lỗi, hãy thêm dòng này vào file thiết lập global cho các bài kiểm tra React:

```js
global.IS_REACT_ACT_ENVIRONMENT=true
```

<Note>

Trong các framework kiểm thử như [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), `IS_REACT_ACT_ENVIRONMENT` đã được thiết lập cho bạn.

</Note>
