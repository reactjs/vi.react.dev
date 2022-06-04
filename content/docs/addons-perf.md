---
id: perf
title: Performance Tools
permalink: docs/perf.html
layout: docs
category: Add-Ons
---

> Note:
>
> Kể từ React 16, `react-addons-perf` không được hỗ trợ nữa. Hãy sử
>
dụng [your browser's profiling tools](/docs/optimizing-performance.html#profiling-components-with-the-chrome-performance-tab)
> để có thông tin chi tiết từ các `components re-render`.

**Importing**

```javascript
import Perf from 'react-addons-perf'; // ES6
var Perf = require('react-addons-perf'); // ES5 with npm
```

## Tổng quan {#overview}

React thường diễn ra khá nhanh. Tuy nhiên, trong những tình huống bạn cần tận dụng từng chút hiệu suất của ứng dụng, nó
sẽ cung cấp phương pháp [shouldComponentUpdate()](docsreact-component.htmlshouldcomponentupdate) nơi bạn có thể thêm
các gợi ý tối ưu hóa cho thuật toán khác biệt của React.

Ngoài việc cung cấp cho bạn cái nhìn tổng quan về hiệu suất tổng thể của ứng dụng, `Perf` là một công cụ lập hồ sơ cho
bạn biết chính xác nơi bạn cần đặt các phương pháp này.

Xem các bài viết này để được giới thiệu về công cụ hiệu suất React:

- ["How to Benchmark React Components"](https://medium.com/code-life/how-to-benchmark-react-components-the-quick-and-dirty-guide-f595baf1014c)
- ["Performance Engineering with React"](https://benchling.engineering/performance-engineering-with-react-e03013e53285)
- ["A Deep Dive into React Perf Debugging"](https://benchling.engineering/a-deep-dive-into-react-perf-debugging-fd2063f5a667)

### Môi trường Development và môi trường Production Builds {#development-vs-production-builds}

Nếu bạn đang đo điểm chuẩn hoặc thấy các vấn đề về hiệu suất trong các ứng dụng React của mình, hãy đảm bảo rằng bạn
đang thử nghiệm với [bản dựng sản xuất thu nhỏ](download.html). Bản dựng phát triển bao gồm các cảnh báo bổ sung hữu
ích khi xây dựng ứng dụng của bạn, nhưng nó chậm hơn do có thêm sổ sách kế toán.

Tuy nhiên, các công cụ hoàn hảo được mô tả trên trang này chỉ hoạt động khi sử dụng bản dựng phát triển của React. Do
đó, trình mô tả chỉ dùng để chỉ ra các phần _relatively_ đắt tiền trong ứng dụng của bạn.

### Sử dụng Perf {#using-perf}

Đối tượng `Perf` chỉ có thể được sử dụng với React trong chế độ phát triển. Bạn không nên bao gồm gói này khi xây dựng
ứng dụng của mình để sản xuất.

#### Getting Measurements {#getting-measurements}

- [`start()`](#start)
- [`stop()`](#stop)
- [`getLastMeasurements()`](#getlastmeasurements)

#### Printing Results {#printing-results}

Các phương pháp sau sử dụng các phép đo được trả về bởi [`Perf.getLastMeasurements ()`](getlastmeasurements) để in kết
quả.

- [`printInclusive()`](#printinclusive)
- [`printExclusive()`](#printexclusive)
- [`printWasted()`](#printwasted)
- [`printOperations()`](#printoperations)
- [`printDOM()`](#printdom)

* * *

## Reference {#reference}

### `start()` {#start}

### `stop()` {#stop}

```javascript
Perf.start()
// ...
Perf.stop()
```

Start/stop đo lường. Các hoạt động React ở giữa được ghi lại cho các phân tích bên dưới. Các thao tác chiếm một lượng
thời gian không đáng kể sẽ bị bỏ qua.

Sau khi dừng, bạn sẽ cần [`Perf.getLastMeasurements()`](#getlastmeasurements) để lấy các phép đo.

* * *

### `getLastMeasurements()` {#getlastmeasurements}

```javascript
Perf.getLastMeasurements()
```

Nhận cấu trúc dữ liệu không rõ ràng mô tả các phép đo từ phiên khởi động cuối cùng. Bạn có thể lưu nó và chuyển nó cho
các phương pháp in khác trong [`Perf`](#printing-results) để phân tích các phép đo trong quá khứ.

> Ghi chú
>
> Đừng dựa vào định dạng chính xác của giá trị trả về vì nó có thể thay đổi trong các bản phát hành nhỏ. Chúng tôi sẽ
> cập nhật tài liệu
> nếu định dạng giá trị trả về trở thành một phần được hỗ trợ của API công khai.

* * *

### `printInclusive()` {#printinclusive}

```javascript
Perf.printInclusive(measurements)
```

In tổng thời gian đã thực hiện. Khi không có đối số nào được chuyển, `printInclusive` mặc định cho tất cả các phép đo từ
bản ghi cuối cùng. Thao tác này sẽ in ra một bảng được định dạng độc đáo trong bảng điều khiển, như sau:

![](../images/docs/perf-inclusive.png)

* * *

### `printExclusive()` {#printexclusive}

```javascript
Perf.printExclusive(measurements)
```

Thời gian "Exclusive" không bao gồm thời gian thực hiện để gắn kết các thành phần: xử lý đạo cụ,
gọi `componentWillMount`
và `componentDidMount`, v.v.

![](../images/docs/perf-exclusive.png)

* * *

### `printWasted()` {#printwasted}

```javascript
Perf.printWasted(measurements)
```

**The most useful part of the profiler**.

"Wasted" time is spent on components that didn't actually render anything, e.g. the render stayed the same, so the DOM
wasn't touched.

![](../images/docs/perf-wasted.png)

* * *

### `printOperations()` {#printoperations}

```javascript
Perf.printOperations(measurements)
```

In các thao tác DOM cơ bản, ví dụ: "set innerHTML" và "remove".

![](../images/docs/perf-dom.png)

* * *

### `printDOM()` {#printdom}

```javascript
Perf.printDOM(measurements)
```

Phương thức này đã được đổi tên thành [`printOperations()`](#printoperations). Hiện tại `printDOM()` vẫn tồn tại
dưới dạng bí danh
nhưng nó sẽ in một cảnh báo không dùng nữa và cuối cùng sẽ bị xóa.
