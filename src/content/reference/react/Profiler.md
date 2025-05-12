---
title: <Profiler>
---

<Intro>

`<Profiler>` cho phép bạn đo lường hiệu suất hiển thị của một cây React một cách программно.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<Profiler>` {/*profiler*/}

Bọc một cây thành phần trong một `<Profiler>` để đo lường hiệu suất hiển thị của nó.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### Props {/*props*/}

* `id`: Một chuỗi xác định phần của UI bạn đang đo lường.
* `onRender`: Một [`onRender` callback](#onrender-callback) mà React gọi mỗi khi các thành phần trong cây được профилирование cập nhật. Nó nhận thông tin về những gì đã được hiển thị và mất bao nhiêu thời gian.

#### Lưu ý {/*caveats*/}

* Hồ sơ thêm một số chi phí bổ sung, vì vậy **nó bị tắt theo mặc định trong bản dựng sản xuất.** Để chọn tham gia lập hồ sơ sản xuất, bạn cần bật [bản dựng sản xuất đặc biệt với hồ sơ được bật.](https://fb.me/react-profiling)

---

### `onRender` callback {/*onrender-callback*/}

React sẽ gọi `onRender` callback của bạn với thông tin về những gì đã được hiển thị.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Aggregate or log render timings...
}
```

#### Tham số {/*onrender-parameters*/}

* `id`: Chuỗi `id` prop của cây `<Profiler>` vừa cam kết. Điều này cho phép bạn xác định phần nào của cây đã được cam kết nếu bạn đang sử dụng nhiều profiler.
* `phase`: `"mount"`, `"update"` hoặc `"nested-update"`. Điều này cho bạn biết liệu cây vừa được gắn kết lần đầu tiên hay được hiển thị lại do thay đổi trong props, state hoặc Hooks.
* `actualDuration`: Số mili giây đã dành để hiển thị `<Profiler>` và các hậu duệ của nó cho bản cập nhật hiện tại. Điều này cho biết mức độ sử dụng memoization của cây con (ví dụ: [`memo`](/reference/react/memo) và [`useMemo`](/reference/react/useMemo)). Lý tưởng nhất là giá trị này sẽ giảm đáng kể sau lần gắn kết ban đầu vì nhiều hậu duệ sẽ chỉ cần hiển thị lại nếu các props cụ thể của chúng thay đổi.
* `baseDuration`: Số mili giây ước tính thời gian cần thiết để hiển thị lại toàn bộ cây con `<Profiler>` mà không cần bất kỳ tối ưu hóa nào. Nó được tính bằng cách cộng tổng thời gian hiển thị gần đây nhất của mỗi thành phần trong cây. Giá trị này ước tính chi phí trường hợp xấu nhất của việc hiển thị (ví dụ: gắn kết ban đầu hoặc một cây không có memoization). So sánh `actualDuration` với nó để xem memoization có hoạt động không.
* `startTime`: Một dấu thời gian số cho thời điểm React bắt đầu hiển thị bản cập nhật hiện tại.
* `commitTime`: Một dấu thời gian số cho thời điểm React cam kết bản cập nhật hiện tại. Giá trị này được chia sẻ giữa tất cả các profiler trong một cam kết, cho phép chúng được nhóm lại nếu muốn.

---

## Cách sử dụng {/*usage*/}

### Đo lường hiệu suất hiển thị theo программно {/*measuring-rendering-performance-programmatically*/}

Bọc thành phần `<Profiler>` xung quanh một cây React để đo lường hiệu suất hiển thị của nó.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

Nó yêu cầu hai props: một `id` (chuỗi) và một `onRender` callback (hàm) mà React gọi bất cứ khi nào một thành phần trong cây "cam kết" một bản cập nhật.

<Pitfall>

Hồ sơ thêm một số chi phí bổ sung, vì vậy **nó bị tắt theo mặc định trong bản dựng sản xuất.** Để chọn tham gia lập hồ sơ sản xuất, bạn cần bật [bản dựng sản xuất đặc biệt với hồ sơ được bật.](https://fb.me/react-profiling)

</Pitfall>

<Note>

`<Profiler>` cho phép bạn thu thập các phép đo một cách программно. Nếu bạn đang tìm kiếm một profiler tương tác, hãy thử tab Profiler trong [React Developer Tools](/learn/react-developer-tools). Nó hiển thị chức năng tương tự như một tiện ích mở rộng trình duyệt.

</Note>

---

### Đo lường các phần khác nhau của ứng dụng {/*measuring-different-parts-of-the-application*/}

Bạn có thể sử dụng nhiều thành phần `<Profiler>` để đo lường các phần khác nhau của ứng dụng của bạn:

```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

Bạn cũng có thể lồng các thành phần `<Profiler>`:

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

Mặc dù `<Profiler>` là một thành phần nhẹ, nhưng nó chỉ nên được sử dụng khi cần thiết. Mỗi lần sử dụng sẽ thêm một số chi phí CPU và bộ nhớ cho ứng dụng.

---
