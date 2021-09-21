---
id: profiler
title: Profiler API (Công cụ Phân tích)
layout: docs
category: Reference
permalink: docs/profiler.html
---

Công cụ `Profiler` (tạm gọi là `Công cụ Phân tích`) đánh giá xem ứng dụng React thực hiện việc render và "chi phí" để thực hiện nó. 
Mục đích của nó là để xác định xem phần nào của ứng dụng chạy chậm và có thể được hưởng lợi từ việc [tối ưu hóa như là ghi nhớ (memoization)](/docs/hooks-faq.html#how-to-memoize-calculations).

> Ghi chú:
>
> Việc Phân tích sẽ tốn thêm tài nguyên, vì vậy **nó sẽ bị vô hiệu hóa trên [môi trường Production](/docs/optimizing-performance.html#use-the-production-build)**.
>
> Nếu bạn muốn sử dụng nó trên môi trường Production, React có thể cung cấp một bản build đặc biệt đã bật chức năng này cho môi trường Production.
> Đọc thêm về cách sử dụng bản build đáy tại [fb.me/react-profiling](https://fb.me/react-profiling)

## Sử dụng {#usage}

`Công cụ Phân tích (Profiler)` có thể thêm vào bất kì đâu trong React tree để tính toán việc render ở nơi mà `Profiler` component được thêm vào.
Nó cần 2 props: một là `id` (string) và một là `onRender` (hàm callback) để React có thể gọi bất kỳ lúc nào khi component ở bên trong cây (tree) có sự thay đổi.

Ví dụ, để phân tích component `Navigation` và các component con (descendants) của nó:

```js{3}
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Main {...props} />
  </App>
);
```

Có thể sử dụng nhiều `Profiler` component để đánh giá nhiều nơi khác nhau trong ứng dụng:
```js{3,6}
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Profiler id="Main" onRender={callback}>
      <Main {...props} />
    </Profiler>
  </App>
);
```

`Profiler` component có thể sử dụng lồng nhau để phân tích các component khác nhau trong cùng một subtree:
```js{3,5,8}
render(
  <App>
    <Profiler id="Panel" onRender={callback}>
      <Panel {...props}>
        <Profiler id="Content" onRender={callback}>
          <Content {...props} />
        </Profiler>
        <Profiler id="PreviewPane" onRender={callback}>
          <PreviewPane {...props} />
        </Profiler>
      </Panel>
    </Profiler>
  </App>
);
```

> Ghi chú
>
> Mặc dù `Profiler` là một component nhẹ, nhưng bạn chỉ nên sử dụng khi cần thiết; mỗi lần sử dụng sẽ tốn thêm tài nguyên CPU và bộ nhớ RAM cho ứng dụng của bạn

## `onRender` Callback {#onrender-callback}

`Profiler` cần một hàm `onRender` giống như prop.
React sẽ gọi hàm này mỗi khi component được bọc bởi `Profiler` thực hiện một thay đổi.
Nó nhận thông tin mô tả những gì đã render và thời gian thực hiện.

```js
function onRenderCallback(
  id, // "id" của Profiler tree vừa thực hiện thay đổi
  phase, // một trong hai "mount" (nếu tree vừa được mounted) hoặc "update" (nếu nó re-rendered)
  actualDuration, // thời gian để rendering cập nhật mới
  baseDuration, //  thời gian ước tính để hiển thị toàn bộ subtree mà không cần ghi nhớ
  startTime, // khi React bắt đầu hiển thị bản cập nhật này
  commitTime, // khi React hoàn thành cập nhật
  interactions // tập hợp các tương tác thuộc về bản cập nhật
) {
  // Tổng hợp hoặc log thời gian render...
}
```

Xem kỹ hơn từng prop:

* **`id: string`** - 
"id" của Profiler tree vừa thực hiện thay đổi
Nó có thể dùng để xem thành phần nào của tree đã thay đổi nếu bạn sử dụng nhiều công cụ Phân tích (profilers).
* **`phase: "mount" | "update"`** -
Xác định xem tree được mounted lần đầu tiên hay do re-rendered vì props, state hay hooks.
* **`actualDuration: number`** -
Thời gian bỏ ra để rendering `Profiler` và các components con của nó.
Điều này cho biết bạn có nên sử dụng các công cụ memoization cho subtree hay không (ví dụ [`React.memo`](/docs/react-api.html#reactmemo), [`useMemo`](/docs/hooks-reference.html#usememo), [`shouldComponentUpdate`](/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate)).
Lý tưởng nhất là giá trị này nên giảm đáng kể sau lần mount đầu tiên vì nhiều component con chỉ cần re-render nếu prop cụ thể nào đó của nó thay đổi.
* **`baseDuration: number`** -
Khoảng thời gian `render` gần nhất cho từng component bên trong `Công cụ Phân tích (Profiler)`.
Giá trị này ước tính chi phí lãng phí cho trường hợp tệ nhất khi rendering (ví dụ: lần mount đầu tiên hoặc một tree không sử dụng memoization)
* **`startTime: number`** -
Thời gian chính xác khi React bắt đầu rendering sự thay đổi.
* **`commitTime: number`** -
Thời gian chính xác khi React hoàn thành rendering sự thay đổi.
Giá trì này được chia sẻ giữa các Công cụ Phân tích trong một commit, cho phép chúng được nhóm lại nếu muốn.
* **`interactions: Set`** -
Tập hợp các ["tương tác"](https://fb.me/react-interaction-tracing) đã được theo dõi khi cập nhật hoặc lên lịch (ví dụ: khi `render` hoặc `setState` được gọi).

> Ghi chú
>
> Các tương tác có thể được sử dụng để xác định nguồn của một cập nhật, mặc dù API để theo dõi chúng vẫn còn đang thử nghiệm.
>
> Xem thêm tại [fb.me/react-interaction-tracing](https://fb.me/react-interaction-tracing)
