---
title: startTransition
---

<Intro>

`startTransition` cho phép bạn hiển thị một phần của UI ở chế độ nền.

```js
startTransition(action)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `startTransition(action)` {/*starttransition*/}

Hàm `startTransition` cho phép bạn đánh dấu một cập nhật trạng thái là một Transition.

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `action`: Một hàm cập nhật một số trạng thái bằng cách gọi một hoặc nhiều hàm [`set`](/reference/react/useState#setstate). React gọi `action` ngay lập tức mà không có tham số và đánh dấu tất cả các cập nhật trạng thái được lên lịch đồng bộ trong quá trình gọi hàm `action` là Transitions. Bất kỳ lệnh gọi không đồng bộ nào được đợi trong `action` sẽ được bao gồm trong quá trình chuyển đổi, nhưng hiện tại yêu cầu gói bất kỳ hàm `set` nào sau `await` trong một `startTransition` bổ sung (xem [Khắc phục sự cố](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)). Các cập nhật trạng thái được đánh dấu là Transitions sẽ [không chặn](#marking-a-state-update-as-a-non-blocking-transition) và [sẽ không hiển thị các chỉ báo tải không mong muốn.](/reference/react/useTransition#preventing-unwanted-loading-indicators).

#### Kết quả trả về {/*returns*/}

`startTransition` không trả về bất cứ điều gì.

#### Lưu ý {/*caveats*/}

* `startTransition` không cung cấp cách nào để theo dõi xem Transition có đang chờ xử lý hay không. Để hiển thị chỉ báo đang chờ xử lý trong khi Transition đang diễn ra, bạn cần [`useTransition`](/reference/react/useTransition) thay thế.

* Bạn chỉ có thể gói một bản cập nhật vào Transition nếu bạn có quyền truy cập vào hàm `set` của trạng thái đó. Nếu bạn muốn bắt đầu Transition để đáp ứng một số đạo cụ hoặc giá trị trả về Hook tùy chỉnh, hãy thử [`useDeferredValue`](/reference/react/useDeferredValue) thay thế.

* Hàm bạn chuyển cho `startTransition` được gọi ngay lập tức, đánh dấu tất cả các cập nhật trạng thái xảy ra trong khi nó thực thi là Transitions. Ví dụ: nếu bạn cố gắng thực hiện cập nhật trạng thái trong `setTimeout`, chúng sẽ không được đánh dấu là Transitions.

* Bạn phải gói bất kỳ cập nhật trạng thái nào sau bất kỳ yêu cầu không đồng bộ nào trong một `startTransition` khác để đánh dấu chúng là Transitions. Đây là một hạn chế đã biết mà chúng tôi sẽ khắc phục trong tương lai (xem [Khắc phục sự cố](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* Một cập nhật trạng thái được đánh dấu là Transition sẽ bị gián đoạn bởi các cập nhật trạng thái khác. Ví dụ: nếu bạn cập nhật một thành phần biểu đồ bên trong Transition, nhưng sau đó bắt đầu nhập vào một đầu vào trong khi biểu đồ đang trong quá trình kết xuất lại, React sẽ khởi động lại công việc kết xuất trên thành phần biểu đồ sau khi xử lý cập nhật trạng thái đầu vào.

* Không thể sử dụng cập nhật Transition để điều khiển đầu vào văn bản.

* Nếu có nhiều Transitions đang diễn ra, React hiện đang gộp chúng lại với nhau. Đây là một hạn chế có thể được loại bỏ trong một bản phát hành trong tương lai.

---

## Cách sử dụng {/*usage*/}

### Đánh dấu một cập nhật trạng thái là một Transition không chặn {/*marking-a-state-update-as-a-non-blocking-transition*/}

Bạn có thể đánh dấu một bản cập nhật trạng thái là *Transition* bằng cách gói nó trong một lệnh gọi `startTransition`:

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Transitions cho phép bạn giữ cho giao diện người dùng luôn phản hồi ngay cả trên các thiết bị chậm.

Với Transition, UI của bạn vẫn phản hồi trong quá trình kết xuất lại. Ví dụ: nếu người dùng nhấp vào một tab nhưng sau đó đổi ý và nhấp vào một tab khác, họ có thể thực hiện việc đó mà không cần chờ quá trình kết xuất lại đầu tiên hoàn tất.

<Note>

`startTransition` rất giống với [`useTransition`](/reference/react/useTransition), ngoại trừ việc nó không cung cấp cờ `isPending` để theo dõi xem Transition có đang diễn ra hay không. Bạn có thể gọi `startTransition` khi `useTransition` không khả dụng. Ví dụ: `startTransition` hoạt động bên ngoài các thành phần, chẳng hạn như từ một thư viện dữ liệu.

[Tìm hiểu về Transitions và xem các ví dụ trên trang `useTransition`.](/reference/react/useTransition)

</Note>
