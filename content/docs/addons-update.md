---
id: update
title: Immutability Helpers
permalink: docs/update.html
layout: docs
category: Add-Ons
---

> Note:
>
> `update` is a legacy add-on. Use [`immutability-helper`](https://github.com/kolodny/immutability-helper) instead.

**Importing**

```javascript
import update from 'react-addons-update'; // ES6
var update = require('react-addons-update'); // ES5 with npm
```

## Overview {#overview}

React cho phép bạn sử dụng bất kỳ kiểu quản lý dữ liệu nào bạn muốn, bao gồm cả đột biến. Tuy nhiên, nếu bạn có thể sử
dụng dữ liệu không thay đổi trong các phần quan trọng về hiệu suất của ứng dụng, bạn có thể dễ dàng triển khai phương
thức [`shouldComponentUpdate()'](/docs/react-component.html#shouldcomponentupdate) nhanh chóng để tăng tốc đáng kể ứng
dụng của bạn.

<<<<<<< HEAD
Xử lý dữ liệu bất biến trong JavaScript khó hơn so với các ngôn ngữ được thiết kế cho nó,
như [Clojure](https://clojure.org/). Tuy nhiên, chúng tôi đã cung cấp một trình trợ giúp bất biến đơn giản, `update () '
, giúp xử lý loại dữ
liệu này dễ dàng hơn nhiều mà không làm thay đổi cơ bản cách dữ liệu của bạn được thể hiện. Bạn cũng có thể xem
qua [Immutable-js](https://facebook.github.io/immutable-js/docs/) và
phần [Advanced Performance](/docs/advanced-performance.html) để biết thêm chi tiết về Immutable-js.
=======
Dealing with immutable data in JavaScript is more difficult than in languages designed for it, like [Clojure](https://clojure.org/). However, we've provided a simple immutability helper, `update()`, that makes dealing with this type of data much easier, *without* fundamentally changing how your data is represented. You can also take a look at Facebook's [Immutable-js](https://immutable-js.com/docs/latest@main/) and the [Advanced Performance](/docs/advanced-performance.html) section for more detail on Immutable-js.
>>>>>>> 38bf76a4a7bec6072d086ce8efdeef9ebb7af227

### The Main Idea {#the-main-idea}

Nếu bạn thay đổi dữ liệu như thế này:

```js
myData.x.y.z = 7;
// or...
myData.a.b.push(9);
```

Bạn không có cách nào xác định dữ liệu nào đã thay đổi kể từ khi bản sao trước đó đã bị ghi đè. Thay vào đó, bạn cần tạo
một bản sao mới của `myData` và chỉ thay đổi những phần cần thay đổi của nó. Sau đó, bạn có thể so sánh bản sao cũ
của `myData` với bản sao mới trong` shouldComponentUpdate()`bằng cách sử dụng triple-equals:

```js
const newData = deepCopy(myData);
newData.x.y.z = 7;
newData.a.b.push(9);
```

Thật không may, các bản sao sâu rất đắt, và đôi khi là không thể. Bạn có thể giảm bớt điều này bằng cách chỉ sao chép
các đối tượng cần thay đổi và sử dụng lại các đối tượng chưa thay đổi. Thật không may, trong JavaScript ngày nay, điều
này có thể phức tạp:

```js
const newData = extend(myData, {
  x: extend(myData.x, {
    y: extend(myData.x.y, {z: 7}),
  }),
  a: extend(myData.a, {b: myData.a.b.concat(9)})
});
```

Mặc dù điều này khá hiệu quả (vì nó chỉ tạo một bản sao nông của các đối tượng `log n` và sử dụng lại phần còn lại),
nhưng đó là một vấn đề lớn khi viết. Nhìn vào tất cả các sự lặp lại! Điều này không chỉ gây khó chịu mà còn cung cấp một
diện tích bề mặt lớn cho các lỗi.

## `update()` {#update}

`update()` cung cấp đường cú pháp đơn giản xung quanh mẫu này để giúp việc viết mã này dễ dàng hơn. Mã này trở thành:

```js
import update from 'react-addons-update';

const newData = update(myData, {
  s
  x: {y: {z: {$set: 7}}},
  a: {b: {$push: [9]}}
});
```

Mặc dù cú pháp phải mất một chút thời gian để làm quen (mặc dù nó được lấy cảm hứng
từ [MongoDB's query language](https://docs.mongodb.com/manual/crud/#query) không có sự dư thừa, nó có thể phân tích tĩnh
và không phải gõ nhiều hơn phiên bản đột biến.

Các khóa `$` -prefixed được gọi là *commands*. Cấu trúc dữ liệu mà chúng đang "mutating" được gọi là *target*.

## Available Commands {#available-commands}

* `{push: array}` `push ()` tất cả các mục trong `mảng` trên đích.
* `{unshift: array}` `unshift ()` tất cả các mục trong `mảng` trên đích.
* `{splice: mảng của mảng}` cho mỗi mục trong `mảng` gọi` splice () `trên đích với các tham số được cung cấp bởi mục.
* `{set: any}` thay thế hoàn toàn mục tiêu.
* `{merge: object}` hợp nhất các khóa của `object` với đích.
* `{apply: function}` chuyển giá trị hiện tại vào hàm và cập nhật nó với giá trị trả về mới.

## Examples {#examples}

### Simple push {#simple-push}

```js
const initialArray = [1, 2, 3];
const newArray = update(initialArray, {$push: [4]}); // => [1, 2, 3, 4]
```

`initialArray` vẫn còn `[1, 2, 3]`.

### Nested collections {#nested-collections}

```js
const collection = [1, 2, {a: [12, 17, 15]}];
const newCollection = update(collection, {2: {a: {$splice: [[1, 1, 13, 14]]}}});
// => [1, 2, {a: [12, 13, 14, 15]}]
```

Thao tác này truy cập chỉ mục `2`, khóa` a` của `bộ sưu tập` và thực hiện ghép nối một mục bắt đầu từ chỉ mục` 1` (để
loại bỏ `17`) trong khi chèn` 13` và `14`.

### Updating a value based on its current one {#updating-a-value-based-on-its-current-one}

```js
const obj = {a: 5, b: 3};
const newObj = update(obj, {
  b: {
    $apply: function(x) {
      return x * 2;
    }
  }
});
// => {a: 5, b: 6}
// This is equivalent, but gets verbose for deeply nested collections:
const newObj2 = update(obj, {b: {$set: obj.b * 2}});
```

### (Shallow) Merge {#shallow-merge}

```js
const obj = {a: 5, b: 3};
const newObj = update(obj, {$merge: {b: 6, c: 7}}); // => {a: 5, b: 6, c: 7}
```
