---
id: optimizing-performance
title: Tối ưu hóa hiệu suất
permalink: docs/optimizing-performance.html
redirect_from:
  - "docs/advanced-performance.html"
---

Về bản chất bên trong, React sử dụng một số kỹ thuật thông minh để giảm thiểu tối đa các tác động tới DOM một cách không cần thiết để cập nhật UI (Giao diện người dùng). Đối với nhiều ứng dụng, việc sử dụng React sẽ giúp UI hiển thị nhanh mà không cần phải thực hiện nhiều công việc để tối ưu hóa hiệu suất một cách cụ thể. Tuy nhiên, có một số cách để bạn có thể tăng tốc ứng dụng React của mình.

## Sử dụng bản Production Build {#use-the-production-build}

Nếu bạn đang đo điểm chuẩn hoặc gặp sự cố về hiệu suất trong các ứng dụng React của mình, hãy đảm bảo rằng bạn đang thử nghiệm với bản minified production build.

Theo mặc định, React sẽ bao gồm nhiều cảnh báo hữu ích. Những cảnh báo này rất hữu ích trong quá trình development. Tuy nhiên, chúng làm cho React lớn hơn và chậm hơn, vì vậy bạn nên chắc chắn rằng mình đã sử dụng phiên bản production khi deploy ứng dụng.

Nếu bạn không chắc liệu quá trình build của mình có được thiết lập chính xác hay không, bạn có thể kiểm tra bằng cách cài đặt [React Developer Tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi). Nếu bạn truy cập một trang web có sử dụng React ở chế độ production, biểu tượng sẽ có nền tối:

<img src="../images/docs/devtools-prod.png" style="max-width:100%" alt="React DevTools on a website with production version of React">

Nếu bạn truy cập một trang web có React ở chế độ development, biểu tượng này sẽ có nền màu đỏ:

<img src="../images/docs/devtools-dev.png" style="max-width:100%" alt="React DevTools on a website with development version of React">

Bạn phải sử dụng chế độ development khi làm việc trên ứng dụng của mình và chế độ production khi deploying ứng dụng của bạn cho người dùng sử dụng.

Bạn có thể tìm thấy hướng dẫn build ứng dụng của mình cho production bên dưới.

### Create React App {#create-react-app}

Nếu dự án của bạn đã được build bằng [Create React App](https://github.com/facebookincubator/create-react-app), hãy chạy:

```
npm run build
```

Điều này sẽ tạo ra một bản production cho ứng dụng của bạn trong thư mục `build/` của dự án của bạn.

Hãy nhớ rằng điều này chỉ cần thiết trước khi deploy lên production. Để development bình thường, hãy sử dụng `npm start`.

### Single-File Builds {#single-file-builds}

Chúng tôi cung cấp các phiên bản production-ready của React và React DOM dưới dạng các single file:

```html
<script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
```

Hãy nhớ rằng chỉ các file React kết thúc bằng `.production.min.js` mới phù hợp cho production.

### Brunch {#brunch}

Để có bản Brunch production build hiệu quả nhất, hãy cài đặt thêm plugin [`terser-brunch`](https://github.com/brunch/terser-brunch):

```
# If you use npm
npm install --save-dev terser-brunch

# If you use Yarn
yarn add --dev terser-brunch
```

Sau đó, để tạo một bản production build, hãy flag (cờ) `-p` vào command (lệnh) `build` như bên dưới:

```
brunch build -p
```

Hãy nhớ rằng bạn chỉ cần làm điều này cho các bản production build. Bạn không nên dùng flag `-p` hoặc áp dụng plugin này trong quá trình development, vì nó sẽ ẩn các cảnh báo React hữu ích và làm cho quá trình xây dựng và phát triển chậm đi nhiều.

### Browserify {#browserify}

Để có bản Browserify production build hiệu quả nhất, hãy cài đặt một số plugin sau:

```
# If you use npm
npm install --save-dev envify terser uglifyify

# If you use Yarn
yarn add --dev envify terser uglifyify
```

Để tạo bản production build, hãy đảm bảo rằng bạn thêm các chuyển đổi này **(the order matters)**:

* Plugin [`envify`](https://github.com/hughsk/envify) sẽ giúp đảm bảo rằng môi trường build sẽ được thiết lập một cách phù hợp. Làm cho nó trở nên global (`-g`).
* Plugin [`uglifyify`](https://github.com/hughsk/uglifyify) có tác dụng chuyển đổi và loại bỏ đi các development import không cần thiết. Cũng làm cho nó global (`-g`).
* Cuối cùng, gói kết quả sẽ được đưa đến [`terser`](https://github.com/terser-js/terser) để xử lý ([đọc lý do](https://github.com/hughsk/uglifyify#motivationusage)).

Ví dụ:

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  | terser --compress --mangle > ./bundle.js
```

Hãy nhớ rằng bạn chỉ cần làm điều này cho các bản production build. Bạn không nên áp dụng các plugin này trong quá trình development vì chúng sẽ ẩn các cảnh báo React hữu ích và làm cho quá trình xây dựng và phát triển chậm đi nhiều.

### Rollup {#rollup}

Để có bản Rollup production build hiệu quả nhất, hãy cài đặt một số plugin:

```bash
# If you use npm
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser

# If you use Yarn
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser
```

Để tạo bản production build, hãy đảm bảo rằng bạn thêm các plugin này **(the order matters)**:

* Plugin [`replace`](https://github.com/rollup/rollup-plugin-replace) sẽ giúp đảm bảo rằng môi trường build sẽ được thiết lập một cách phù hợp.
* Plugin [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) cung cấp và hỗ trợ cho CommonJS trong Rollup.
* Plugin [`terser`](https://github.com/TrySound/rollup-plugin-terser) sẽ nén và xử lý gói cuối cùng.

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-terser')(),
  // ...
]
```

Để biết ví dụ về cách thiết lập hoàn chỉnh, [hãy xem gist này](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0)

Hãy nhớ rằng bạn chỉ cần làm điều này cho các bản production build. Bạn không nên áp dụng plugin `terser` hoặc plugin `replace` với value `'production'` trong quá trình development vì chúng sẽ ẩn các cảnh báo React hữu ích và làm cho quá trình xây dựng và phát triển chậm đi nhiều.

### webpack {#webpack}

>**Ghi chú:**
>
>Nếu bạn đang sử dụng Create React App, vui lòng làm theo [hướng dẫn ở trên](#create-react-app). <br>
>Phần này chỉ có cần thiết nếu bạn định cấu hình webpack trực tiếp.

Webpack v4 + sẽ minify code của bạn một cách mặc định ở chế độ production.

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin({ /* additional options here */ })],
  },
};
```

Bạn có thể tìm hiểu thêm về điều này trong [webpack documentation](https://webpack.js.org/guides/production/).

Hãy nhớ rằng bạn chỉ cần làm điều này cho các bản production build. Bạn không nên áp dụng `TerserPlugin` trong quá trình development vì nó sẽ ẩn các cảnh báo React hữu ích và làm cho quá trình xây dựng và phát triển chậm đi nhiều.

## Profiling Components with the DevTools Profiler {#profiling-components-with-the-devtools-profiler}

`react-dom` 16.5+ và `react-native` 0.57+ cung cấp khả năng tạo profiling capabilities trong chế độ DEV với React DevTools Profiler.
Để hiểu tổng quan hơn về Profiler, bạn có thể đọc và tìm hiểu trong blog post này ["Introducing the React Profiler"](/blog/2018/09/10/introducing-the-react-profiler.html).
Và một video hướng dẫn về profiler cũng đã [có sẵn ở trên YouTube](https://www.youtube.com/watch?v=nySib7ipZdk).

Nếu bạn chưa cài đặt React DevTools, bạn có thể tìm thấy chúng tại đây:

- [Chrome Browser Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Firefox Browser Extension](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [Standalone Node Package](https://www.npmjs.com/package/react-devtools)

> Ghi chú
>
> Một gói production profiling của `react-dom` cũng có sẵn dưới dạng `react-dom/profiling`.
> Đọc thêm về cách sử dụng gói này tại [fb.me/react-profiling](https://fb.me/react-profiling)

> Ghi chú
>
> Trước phiên bản React 17, chúng tôi sử dụng [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) để cấu hình các component với chrome performance tab.
> Để được hướng dẫn chi tiết hơn, hãy xem [bài viết này của Ben Schwarz](https://calibreapp.com/blog/react-performance-profiling-optimization).

## Virtualize Long Lists {#virtualize-long-lists}

Nếu ứng dụng của bạn render (hiển thị) danh sách các dữ liệu dài và nhiều (hàng trăm hoặc hàng nghìn hàng), chúng tôi khuyên bạn nên sử dụng kỹ thuật được gọi là "windowing". Kỹ thuật này chỉ hiển thị một tập hợp các hàng dữ liệu cần thiết trong từng thời điểm và nó sẽ giúp giảm đáng kể thời gian hiển thị lại các component cũng như số lượng các DOM node được tạo.

[react-window](https://react-window.now.sh/) và [react-virtualized](https://bvaughn.github.io/react-virtualized/) là các thư viện windowing phổ biến. Chúng cung cấp một số component có thể tái sử dụng để hiển thị dưới dạng danh sách, lưới và dữ liệu dạng bảng. Bạn cũng có thể tạo windowing component của riêng mình, giống như [Twitter đã làm](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3), nếu bạn muốn thứ gì đó phù hợp hơn với từng trường hợp cụ thể trong ứng dụng của bạn.

## Avoid Reconciliation {#avoid-reconciliation}

React xây dựng và duy trì internal representation để rendered UI. Nó bao gồm các React element mà bạn trả về từ các component. Cách biểu diễn này cho phép React tránh việc tạo các DOM node và truy cập các node hiện có vượt quá mức cần thiết, vì điều đó có thể chậm hơn các operation trên các JavaScript object. Đôi khi nó được gọi là "DOM ảo", cách nó hoạt động tương tự như cách hoạt động trên React Native.

Khi các prop hoặc state của một component thay đổi, React sẽ xem xét quyết định liệu bản cập nhật DOM có thực sự cần thiết hay không hoặc không bằng cách so sánh các phần tử mới được trả về với các phần tử đã được hiển thị trước đó. Khi chúng không giống nhau, React sẽ cập nhật lại DOM.

Mặc dù React chỉ cập nhật các DOM node đã thay đổi, thì việc re-rendering (hiển thị lại) vẫn sẽ mất một khoảng thời gian. Tuy nhiên trong nhiều trường hợp, đó không phải là vấn đề, nhưng nếu việc bị chậm đi này thực sự đáng chú ý, bạn có thể xem xét tăng tốc độ chúng bằng cách ghi đè với lifecycle function `shouldComponentUpdate`, nó được kích hoạt trước khi quá trình re-rendering bắt đầu. Việc triển khai của hàm này mặc định sẽ trả về `true`, nhằm để báo cho React thực hiện việc cập nhật:

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

Nếu bạn biết chắc rằng trong một số trường hợp, component của bạn không cần cập nhật, bạn có thể trả về `false` từ `shouldComponentUpdate` để bỏ qua toàn bộ quá trình render, bao gồm cả việc gọi `render()` trên component hiện tại và cả bên dưới.

Trong hầu hết các trường hợp, thay vì viết `shouldComponentUpdate()` bằng tay, bạn có thể kế thừa từ [`React.PureComponent`](/docs/react-api.html#reactpurecomponent). Nó tương đương với việc triển khai `shouldComponentUpdate()` sẽ shallow comparison giữa các prop và state hiện tại và trước đó.

## shouldComponentUpdate In Action {#shouldcomponentupdate-in-action}

Đây là một subtree của các component. Đối với mỗi `SCU` sẽ báo cho `shouldComponentUpdate` biết là trả về cái gì và `vDOMEq` cho biết liệu các phần tử React được render có tương đương hay không. Cuối cùng, màu của vòng tròn sẽ cho biết liệu component có được reconciled hay không.

<figure><img src="../images/docs/should-component-update.png" style="max-width:100%" /></figure>

Vì `shouldComponentUpdate` trả về `false` cho subtree bắt nguồn từ C2, React đã không cố render C2 và do đó thậm chí không phải gọi đến `shouldComponentUpdate` trên C4 và C5.

Đối với C1 và C3, `shouldComponentUpdate` trả về `true`, vì vậy React phải đi xuống các nhánh và kiểm tra chúng. Đối với C6 `shouldComponentUpdate` trả về `true` và vì các element được render không giống nhau nên React phải cập nhật lại DOM.

Trường hợp thú vị cuối cùng là C8. React phải render component này, nhưng vì các phần tử React trả về bằng với các phần tử đã được render đó, nên nó không phải cập nhật lại DOM.

Lưu ý rằng React chỉ phải thực hiện các DOM mutation cho C6, điều này là không thể tránh khỏi. Đối với C8, nó đã so sánh các phần tử React đã được render và đối với subtree của C2 và C7, nó thậm chí không phải so sánh các phần tử trên `shouldComponentUpdate` và `render` đã không được gọi.

## Examples {#examples}

Nếu cách duy nhất để component của bạn thay đổi là khi biến `props.color` hoặc `state.count` thay đổi, bạn nên thực hiện kiểm tra `shouldComponentUpdate` như bên dưới:

```javascript
class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

Trong đoạn mã này, `shouldComponentUpdate` chỉ kiểm tra xem có bất kỳ thay đổi nào trong `props.color` hoặc `state.count` hay không. Nếu những giá trị đó không thay đổi, component sẽ không cập nhật. Nếu component của bạn phức tạp hơn nữa, bạn có thể sử dụng một mô hình tương tự để thực hiện "shallow comparison" (so sánh) giữa tất cả các `props` và `state` để xác định xem component có nên được cập nhật lại hay không. Với mô hình phổ biến này đủ để React cung cấp một trình trợ giúp cho việc sử dụng logic này - bằng cách chỉ cần kế thừa từ `React.PureComponent`. Vì vậy, đoạn code này là một cách đơn giản hơn để đạt được điều tương tự:

```js
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

Hầu hết các trường hợp, bạn có thể sử dụng `React.PureComponent` thay vì phải viết `shouldComponentUpdate` của riêng bạn. Nó chỉ thực hiện một shallow comparison, vì vậy bạn không thể sử dụng nó nếu các prop hoặc state có thể đã bị thay đổi theo cách mà một phép shallow comparison sẽ có thể bỏ qua.

Đây có thể là một vấn đề với các cấu trúc dữ liệu phức tạp hơn. Ví dụ: giả sử bạn muốn component `ListOfWords` render danh sách các từ và được phân tách bằng dấu phẩy, với component `WordAdder` parent cho phép bạn click vào button để thêm một từ vào danh sách. Đoạn code này sẽ *không* hoạt động chính xác:

```javascript
class ListOfWords extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
}

class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ['marklar']
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This section is bad style and causes a bug
    const words = this.state.words;
    words.push('marklar');
    this.setState({words: words});
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}
```

Vấn đề là `PureComponent` sẽ thực hiện một phép so sánh đơn giản giữa các giá trị cũ và mới của `this.props.words`. Vì code này thay đổi array `words` trong method `handleClick` của `WordAdder`, các giá trị cũ và mới của `this.props.words` sẽ so sánh bằng nhau, mặc dù các word (từ) thực tế trong array đã được thay đổi. Do đó, `ListOfWords` sẽ không cập nhật mặc dù nó có các từ mới cần được render.

## The Power Of Not Mutating Data {#the-power-of-not-mutating-data}

Cách đơn giản nhất để tránh gặp vấn đề này là tránh thay đổi các giá trị mà bạn đang sử dụng như prop hoặc state. Ví dụ: method `handleClick` ở trên có thể được viết lại bằng cách sử dụng `concat` như sau:

```javascript
handleClick() {
  this.setState(state => ({
    words: state.words.concat(['marklar'])
  }));
}
```

ES6 hỗ trợ một [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) cho phép các array có thể làm việc này một cách dễ dàng hơn. Nếu bạn đang sử dụng Create React App, thì cú pháp này đã có sẵn theo mặc định rồi.

```js
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'marklar'],
  }));
};
```

Bạn cũng có thể viết lại những đoạn code mutate object để tránh mutation, theo một cách tương tự. Ví dụ: giả sử chúng ta có một object tên là `colormap` và chúng ta muốn viết một function cho phép thay đổi `colormap.right` thành `'blue'`. Chúng ta có thể viết:

```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

Để viết điều này mà không làm thay đổi object ban đầu, chúng ta có thể sử dụng method [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign):

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

`updateColorMap` bây giờ đã trả về một object mới, thay vì thay đổi object cũ. `Object.assign` nằm trong ES6 và yêu cầu một polyfill.

[Object spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) giúp cập nhật các object dễ dàng hơn mà không phải thay đổi chúng:

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

Tính năng này đã được thêm vào JavaScript trong phiên bản ES2018

Nếu bạn đang sử dụng Create React App, thì cả `Object.assign` và object spread syntax đều đã có sẵn đi theo mặc định rồi.

Khi bạn xử lý các đối tượng lồng nhau rất sâu, thì việc cập nhật chúng theo cách immutable có thể khiến bạn cảm thấy phức tạp. Nếu bạn gặp sự cố này, hãy xem [Immer](https://github.com/mweststrate/immer) hoặc [immutability-helper](https://github.com/kolodny/immutability-helper). Các thư viện này cho phép bạn viết code dễ đọc mà không làm mất đi lợi ích của immutability.
