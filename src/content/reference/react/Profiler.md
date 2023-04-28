---
title: <Profiler>
---

<Intro>

`<Profiler>` cho phép bạn đo lường hiệu suất render của một React tree bằng cách lập trình

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

Bọc một component tree trong `<Profiler>` để đo lường hiệu suất.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### Props {/*props*/}

* `id`: Một chuỗi ký tự để xác định phần giao diện bạn muốn đo lường.
* `onRender`: Một [callback `onRender`](#onrender-callback) mà React gọi mỗi khi các thành phần bên trong tree cập nhật. Nó nhận thông tin về những gì được render và mất bao nhiêu thời gian để render.

#### Những điều cần chú ý {/*caveats*/}

* Việc đo lường sẽ làm giảm hiệu suất, vì vậy **mặc định nó sẽ luôn được vô hiệu hoá trong bản build production.** Để đo lường ở production, bạn cần kích hoạt [tính năng đo lường trong một bản build production đặc biệt.](https://fb.me/react-profiling)

---

### `onRender` callback {/*onrender-callback*/}

React sẽ gọi call `onRender` callback với thông tin về những gì được render.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Aggregate or log render timings...
}
```

#### Các tham số {/*onrender-parameters*/}

* `id`: Chuỗi `id` là prop của `<Profiler>` tree được thực thi. Điều này cho phép bạn xác định phần nào của tree đã được thực thi nếu bạn đang sử dụng nhiều trình đo hiệu năng.
* `phase`: `"mount"`, `"update"` hoặc `"nested-update"`. Chúng giúp bạn biết liệu tree đã được render lần đầu tiên hay đã được vẽ lại do thay đổi trong props, state hoặc hooks.
* `actualDuration`: Số mili giây dành cho việc render `<Profiler>` và các phần tử con phục vụ cho cập nhật hiện tại. Nó giúp cho thấy subtree tận dụng tốt việc ghi nhớ (memorization) (ví dụ như [`memo`](/reference/react/memo) và [`useMemo`](/reference/react/useMemo)). Lý tưởng nhất là giá trị này sẽ giảm đáng kể sau lần render ban đầu vì nhiều thành phần con chỉ cần được render lại nếu props cụ thể của chúng thay đổi.
* `baseDuration`: Số mili giây ước tính cho thời gian cần để render lại toàn bộ subtree của `<Profiler>` mà không cần sự tối ưu hoá nào. Giá trị này được tính bằng cách tính tổng thời gian render gần đây nhất của các thành phần trong tree. Giá trị này sẽ giúp ước tính được thời gian chậm nhất (ví dụ lần render ban đầu hay một tree mà không có sự ghi nhớ nào). Hãy so sánh `actualDuration` với nó để xem việc ghi nhớ có hoạt động chính xác hay không.
* `startTime`: Mốc thời gian mà React bắt đầu thực hiện việc render cho cập nhật hiện tại.
* `endTime`: Mốc thời gian React thực hiện xong cập nhật hiện tại. Giá trị này được chia sẻ giữa tất cả các profiler trong một lần thực thi, cho phép nhóm chúng lại nếu cần thiết.

---

## Cách sử dụng {/*usage*/}

### Đo hiệu suất render bằng cách lập trình {/*measuring-rendering-performance-programmatically*/}

Bọc `<Profiler>` vào một React tree để đo lường hiệu suất render.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

Nó yêu cầu 2 props: một chuỗi `id` và một `onRender` mà React gọi bất cứ khi nào một component trong tree cập nhật.

<Pitfall>

Việc đo lường sẽ làm giảm hiệu suất, vì vậy **mặc định nó sẽ luôn được vô hiệu hoá trong bản build production.** Để đo lường ở production, bạn cần kích hoạt [tính năng đo lường trong một bản build production đặc biệt.](https://fb.me/react-profiling)

</Pitfall>

<Note>

`<Profiler>` giúp bạn đo lường hiệu suất bằng cách lập trình thủ công. Nếu bạn muốn tìm một phương pháp đo lường có thể tương tác tốt hơn, hãy thử tab Profiler ở trong [công cụ phát triển React](/learn/react-developer-tools). Nó là một tiện ích trình duyệt với các tính năng tương tự.

</Note>

---

### Đo lường các phần khác nhau của ứng dụng {/*measuring-different-parts-of-the-application*/}

Bạn có thể sử dụng nhiều `<Profiler>` để đo lường nhiều phần khác nhau của ứng dụng:

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

Bạn cũng có thể lồng nhiều `<Profiler>` vào với nhau:

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

Mặc dù `<Profiler>` là một component rất nhẹ, nó chỉ nên được dùng khi cần thiết. Mỗi lần sử dụng sẽ đều tiêu hao CPU và bộ nhớ thêm cho ứng dụng.

---
