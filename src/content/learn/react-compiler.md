---
title: React Compiler
---

<Intro>
Trang này sẽ cung cấp cho bạn phần giới thiệu về React Compiler và cách dùng thử thành công.
</Intro>

<Wip>
Tài liệu này vẫn đang trong quá trình hoàn thiện. Bạn có thể tìm thêm tài liệu trong [React Compiler Working Group repo](https://github.com/reactwg/react-compiler/discussions) và sẽ được đưa vào tài liệu này khi chúng ổn định hơn.
</Wip>

<YouWillLearn>

* Bắt đầu với trình biên dịch
* Cài đặt trình biên dịch và plugin ESLint
* Khắc phục sự cố

</YouWillLearn>

<Note>
React Compiler là một trình biên dịch mới hiện đang ở giai đoạn Beta, chúng tôi đã mở mã nguồn để nhận phản hồi sớm từ cộng đồng. Mặc dù nó đã được sử dụng trong sản xuất tại các công ty như Meta, nhưng việc triển khai trình biên dịch vào sản xuất cho ứng dụng của bạn sẽ phụ thuộc vào tình trạng của codebase và mức độ tuân thủ [Rules of React](/reference/rules).

Bạn có thể tìm thấy bản phát hành Beta mới nhất với tag `@beta` và các bản phát hành thử nghiệm hàng ngày với `@experimental`.
</Note>

React Compiler là một trình biên dịch mới mà chúng tôi đã mở mã nguồn để nhận phản hồi sớm từ cộng đồng. Nó là một công cụ chỉ chạy trong thời gian build và tự động tối ưu hóa ứng dụng React của bạn. Nó hoạt động với JavaScript thuần túy và hiểu [Rules of React](/reference/rules), vì vậy bạn không cần phải viết lại bất kỳ mã nào để sử dụng nó.

Trình biên dịch cũng bao gồm một [ESLint plugin](#installing-eslint-plugin-react-compiler) hiển thị các phân tích từ trình biên dịch ngay trong trình soạn thảo của bạn. **Chúng tôi đặc biệt khuyên mọi người nên sử dụng linter ngay hôm nay.** Linter không yêu cầu bạn phải cài đặt trình biên dịch, vì vậy bạn có thể sử dụng nó ngay cả khi bạn chưa sẵn sàng dùng thử trình biên dịch.

Trình biên dịch hiện được phát hành dưới dạng `beta` và có sẵn để dùng thử trên các ứng dụng và thư viện React 17+. Để cài đặt Beta:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

Hoặc, nếu bạn đang sử dụng Yarn:

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

Nếu bạn chưa sử dụng React 19, vui lòng xem [phần bên dưới](#using-react-compiler-with-react-17-or-18) để biết thêm hướng dẫn.

### Trình biên dịch làm gì? {/*what-does-the-compiler-do*/}

Để tối ưu hóa ứng dụng, React Compiler tự động memoize code của bạn. Bạn có thể đã quen thuộc với memoization thông qua các API như `useMemo`, `useCallback` và `React.memo`. Với các API này, bạn có thể cho React biết rằng một số phần nhất định của ứng dụng không cần tính toán lại nếu đầu vào của chúng không thay đổi, giảm tải công việc khi cập nhật. Mặc dù mạnh mẽ, nhưng rất dễ quên áp dụng memoization hoặc áp dụng chúng không chính xác. Điều này có thể dẫn đến các bản cập nhật không hiệu quả vì React phải kiểm tra các phần của UI không có bất kỳ thay đổi _ý nghĩa_ nào.

Trình biên dịch sử dụng kiến thức về JavaScript và các quy tắc của React để tự động memoize các giá trị hoặc nhóm giá trị trong các component và hook của bạn. Nếu nó phát hiện ra các vi phạm quy tắc, nó sẽ tự động bỏ qua các component hoặc hook đó và tiếp tục biên dịch an toàn các code khác.

<Note>
React Compiler có thể phát hiện tĩnh khi Rules of React bị vi phạm và tự động chọn không tối ưu hóa chỉ các component hoặc hook bị ảnh hưởng. Không cần thiết để trình biên dịch tối ưu hóa 100% codebase của bạn.
</Note>

Nếu codebase của bạn đã được memoize rất tốt, bạn có thể không thấy những cải thiện lớn về hiệu suất với trình biên dịch. Tuy nhiên, trong thực tế, việc memoize các dependency chính xác gây ra các vấn đề về hiệu suất là rất khó để thực hiện bằng tay.

<DeepDive>
#### Loại memoization nào mà React Compiler thêm vào? {/*what-kind-of-memoization-does-react-compiler-add*/}

Bản phát hành ban đầu của React Compiler chủ yếu tập trung vào **cải thiện hiệu suất cập nhật** (re-rendering các component hiện có), vì vậy nó tập trung vào hai trường hợp sử dụng sau:

1. **Bỏ qua re-rendering theo tầng của các component**
  * Re-rendering `<Parent />` khiến nhiều component trong cây component của nó re-render, mặc dù chỉ có `<Parent />` thay đổi
2. **Bỏ qua các tính toán tốn kém từ bên ngoài React**
  * Ví dụ: gọi `expensivelyProcessAReallyLargeArrayOfObjects()` bên trong component hoặc hook của bạn cần dữ liệu đó

#### Tối ưu hóa Re-renders {/*optimizing-re-renders*/}

React cho phép bạn thể hiện UI của mình như một hàm của trạng thái hiện tại của chúng (cụ thể hơn: props, state và context của chúng). Trong implementation hiện tại, khi state của một component thay đổi, React sẽ re-render component đó _và tất cả các component con của nó_ — trừ khi bạn đã áp dụng một số hình thức memoization thủ công với `useMemo()`, `useCallback()` hoặc `React.memo()`. Ví dụ: trong ví dụ sau, `<MessageButton>` sẽ re-render bất cứ khi nào state của `<FriendList>` thay đổi:

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
  return <NoFriends />;
  }
  return (
  <div>
    <span>{onlineCount} online</span>
    {friends.map((friend) => (
    <FriendListCard key={friend.id} friend={friend} />
    ))}
    <MessageButton />
  </div>
  );
}
```
[_Xem ví dụ này trong React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

React Compiler tự động áp dụng tương đương với memoization thủ công, đảm bảo rằng chỉ các phần liên quan của ứng dụng re-render khi state thay đổi, đôi khi được gọi là "fine-grained reactivity". Trong ví dụ trên, React Compiler xác định rằng giá trị trả về của `<FriendListCard />` có thể được sử dụng lại ngay cả khi `friends` thay đổi và có thể tránh tạo lại JSX này _và_ tránh re-rendering `<MessageButton>` khi số lượng thay đổi.

#### Các tính toán tốn kém cũng được memoize {/*expensive-calculations-also-get-memoized*/}

Trình biên dịch cũng có thể tự động memoize cho các tính toán tốn kém được sử dụng trong quá trình rendering:

```js
// **Không** được memoize bởi React Compiler, vì đây không phải là component hoặc hook
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Được memoize bởi React Compiler vì đây là một component
function TableContainer({ items }) {
  // Lệnh gọi hàm này sẽ được memoize:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[_Xem ví dụ này trong React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

Tuy nhiên, nếu `expensivelyProcessAReallyLargeArrayOfObjects` thực sự là một hàm tốn kém, bạn có thể muốn xem xét việc triển khai memoization của riêng nó bên ngoài React, vì:

- React Compiler chỉ memoize các React component và hook, không phải mọi hàm
- Memoization của React Compiler không được chia sẻ giữa nhiều component hoặc hook

Vì vậy, nếu `expensivelyProcessAReallyLargeArrayOfObjects` được sử dụng trong nhiều component khác nhau, ngay cả khi các item giống hệt nhau được truyền xuống, thì tính toán tốn kém đó sẽ được chạy lặp đi lặp lại. Chúng tôi khuyên bạn nên [profiling](https://react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) trước để xem nó có thực sự tốn kém hay không trước khi làm cho code trở nên phức tạp hơn.
</DeepDive>

### Tôi có nên dùng thử trình biên dịch không? {/*should-i-try-out-the-compiler*/}

Xin lưu ý rằng trình biên dịch vẫn đang ở giai đoạn Beta và có nhiều điểm chưa hoàn thiện. Mặc dù nó đã được sử dụng trong sản xuất tại các công ty như Meta, nhưng việc triển khai trình biên dịch vào sản xuất cho ứng dụng của bạn sẽ phụ thuộc vào tình trạng của codebase và mức độ tuân thủ [Rules of React](/reference/rules).

**Bạn không cần phải vội vàng sử dụng trình biên dịch ngay bây giờ. Bạn có thể đợi cho đến khi nó đạt đến bản phát hành ổn định trước khi áp dụng nó.** Tuy nhiên, chúng tôi đánh giá cao việc bạn dùng thử nó trong các thử nghiệm nhỏ trong ứng dụng của mình để bạn có thể [cung cấp phản hồi](#reporting-issues) cho chúng tôi để giúp trình biên dịch tốt hơn.

## Bắt đầu {/*getting-started*/}

Ngoài các tài liệu này, chúng tôi khuyên bạn nên kiểm tra [React Compiler Working Group](https://github.com/reactwg/react-compiler) để biết thêm thông tin và thảo luận về trình biên dịch.

### Cài đặt eslint-plugin-react-compiler {/*installing-eslint-plugin-react-compiler*/}

React Compiler cũng cung cấp một ESLint plugin. ESLint plugin có thể được sử dụng **độc lập** với trình biên dịch, có nghĩa là bạn có thể sử dụng ESLint plugin ngay cả khi bạn không sử dụng trình biên dịch.

<TerminalBlock>
npm install -D eslint-plugin-react-compiler@beta
</TerminalBlock>

Sau đó, thêm nó vào cấu hình ESLint của bạn:

```js
import reactCompiler from 'eslint-plugin-react-compiler'

export default [
  {
  plugins: {
    'react-compiler': reactCompiler,
  },
  rules: {
    'react-compiler/react-compiler': 'error',
  },
  },
]
```

Hoặc, trong định dạng cấu hình eslintrc không được dùng nữa:

```js
module.exports = {
  plugins: [
  'eslint-plugin-react-compiler',
  ],
  rules: {
  'react-compiler/react-compiler': 'error',
  },
}
```

ESLint plugin sẽ hiển thị bất kỳ vi phạm nào đối với các quy tắc của React trong trình soạn thảo của bạn. Khi nó làm điều này, điều đó có nghĩa là trình biên dịch đã bỏ qua việc tối ưu hóa component hoặc hook đó. Điều này hoàn toàn ổn và trình biên dịch có thể khôi phục và tiếp tục tối ưu hóa các component khác trong codebase của bạn.

<Note>
**Bạn không cần phải sửa tất cả các vi phạm ESLint ngay lập tức.** Bạn có thể giải quyết chúng theo tốc độ của riêng bạn để tăng số lượng component và hook được tối ưu hóa, nhưng không bắt buộc phải sửa mọi thứ trước khi bạn có thể sử dụng trình biên dịch.
</Note>

### Triển khai trình biên dịch cho codebase của bạn {/*using-the-compiler-effectively*/}

#### Các dự án hiện có {/*existing-projects*/}
Trình biên dịch được thiết kế để biên dịch các functional component và hook tuân theo [Rules of React](/reference/rules). Nó cũng có thể xử lý code vi phạm các quy tắc đó bằng cách bỏ qua (skipping over) các component hoặc hook đó. Tuy nhiên, do tính chất linh hoạt của JavaScript, trình biên dịch không thể bắt mọi vi phạm có thể xảy ra và có thể biên dịch với false negative: nghĩa là, trình biên dịch có thể vô tình biên dịch một component/hook vi phạm Rules of React, điều này có thể dẫn đến hành vi không xác định.

Vì lý do này, để áp dụng trình biên dịch thành công trên các dự án hiện có, chúng tôi khuyên bạn nên chạy nó trên một thư mục nhỏ trong product code của bạn trước. Bạn có thể thực hiện việc này bằng cách định cấu hình trình biên dịch chỉ chạy trên một tập hợp các thư mục cụ thể:

```js {3}
const ReactCompilerConfig = {
  sources: (filename) => {
  return filename.indexOf('src/path/to/dir') !== -1;
  },
};
```

Khi bạn tự tin hơn với việc triển khai trình biên dịch, bạn có thể mở rộng phạm vi phủ sóng sang các thư mục khác và từ từ triển khai nó cho toàn bộ ứng dụng của bạn.

#### Các dự án mới {/*new-projects*/}

Nếu bạn đang bắt đầu một dự án mới, bạn có thể bật trình biên dịch trên toàn bộ codebase của mình, đây là hành vi mặc định.

### Sử dụng React Compiler với React 17 hoặc 18 {/*using-react-compiler-with-react-17-or-18*/}

React Compiler hoạt động tốt nhất với React 19 RC. Nếu bạn không thể nâng cấp, bạn có thể cài đặt gói `react-compiler-runtime` bổ sung, gói này sẽ cho phép code đã biên dịch chạy trên các phiên bản trước 19. Tuy nhiên, lưu ý rằng phiên bản được hỗ trợ tối thiểu là 17.

<TerminalBlock>
npm install react-compiler-runtime@beta
</TerminalBlock>

Bạn cũng nên thêm `target` chính xác vào cấu hình trình biên dịch của mình, trong đó `target` là phiên bản chính của React mà bạn đang nhắm mục tiêu:

```js {3}
// babel.config.js
const ReactCompilerConfig = {
  target: '18' // '17' | '18' | '19'
};

module.exports = function () {
  return {
  plugins: [
    ['babel-plugin-react-compiler', ReactCompilerConfig],
  ],
  };
};
```

### Sử dụng trình biên dịch trên các thư viện {/*using-the-compiler-on-libraries*/}

React Compiler cũng có thể được sử dụng để biên dịch các thư viện. Vì React Compiler cần chạy trên source code gốc trước bất kỳ chuyển đổi code nào, nên không thể để pipeline build của ứng dụng biên dịch các thư viện mà chúng sử dụng. Do đó, chúng tôi khuyên các người duy trì thư viện nên độc lập biên dịch và kiểm tra thư viện của họ bằng trình biên dịch và chuyển code đã biên dịch lên npm.

Vì code của bạn được biên dịch trước, người dùng thư viện của bạn sẽ không cần bật trình biên dịch để hưởng lợi từ memoization tự động được áp dụng cho thư viện của bạn. Nếu thư viện của bạn nhắm mục tiêu đến các ứng dụng chưa có trên React 19, hãy chỉ định [`target` tối thiểu và thêm `react-compiler-runtime` làm dependency trực tiếp](#using-react-compiler-with-react-17-or-18). Gói runtime sẽ sử dụng implementation chính xác của các API tùy thuộc vào phiên bản của ứng dụng và polyfill các API bị thiếu nếu cần thiết.

Code thư viện thường có thể yêu cầu các pattern phức tạp hơn và sử dụng các escape hatch. Vì lý do này, chúng tôi khuyên bạn nên đảm bảo rằng bạn có đủ thử nghiệm để xác định bất kỳ vấn đề nào có thể phát sinh từ việc sử dụng trình biên dịch trên thư viện của bạn. Nếu bạn xác định bất kỳ vấn đề nào, bạn luôn có thể chọn không sử dụng các component hoặc hook cụ thể bằng directive [`'use no memo'`](#something-is-not-working-after-compilation).

Tương tự như các ứng dụng, không cần thiết phải biên dịch hoàn toàn 100% component hoặc hook của bạn để thấy lợi ích trong thư viện của bạn. Một điểm khởi đầu tốt có thể là xác định các phần nhạy cảm nhất về hiệu suất của thư viện của bạn và đảm bảo rằng chúng không vi phạm [Rules of React](/reference/rules), bạn có thể sử dụng `eslint-plugin-react-compiler` để xác định.

## Cách sử dụng {/*installation*/}

### Babel {/*usage-with-babel*/}

<TerminalBlock>
npm install babel-plugin-react-compiler@beta
</TerminalBlock>

Trình biên dịch bao gồm một Babel plugin mà bạn có thể sử dụng trong pipeline build của mình để chạy trình biên dịch.

Sau khi cài đặt, hãy thêm nó vào cấu hình Babel của bạn. Xin lưu ý rằng điều quan trọng là trình biên dịch phải chạy **đầu tiên** trong pipeline:

```js {7}
// babel.config.js
const ReactCompilerConfig = { /* ... */ };

module.exports = function () {
  return {
  plugins: [
    ['babel-plugin-react-compiler', ReactCompilerConfig], // must run first!
    // ...
  ],
  };
};
```

`babel-plugin-react-compiler` phải chạy trước các Babel plugin khác vì trình biên dịch yêu cầu thông tin source đầu vào để phân tích âm thanh.

### Vite {/*usage-with-vite*/}

Nếu bạn sử dụng Vite, bạn có thể thêm plugin vào vite-plugin-react:

```js {10}
// vite.config.js
const ReactCompilerConfig = { /* ... */ };

export default defineConfig(() => {
  return {
  plugins: [
    react({
    babel: {
      plugins: [
      ["babel-plugin-react-compiler", ReactCompilerConfig],
      ],
    },
    }),
  ],
  // ...
  };
});
```

### Next.js {/*usage-with-nextjs*/}

Vui lòng tham khảo [tài liệu Next.js](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) để biết thêm thông tin.

### Remix {/*usage-with-remix*/}
Cài đặt `vite-plugin-babel` và thêm Babel plugin của trình biên dịch vào nó:

<TerminalBlock>
npm install vite-plugin-babel
</TerminalBlock>

```js {2,14}
// vite.config.js
import babel from "vite-plugin-babel";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
  remix({ /* ... */}),
  babel({
    filter: /\.[jt]sx?$/,
    babelConfig: {
    presets: ["@babel/preset-typescript"], // if you use TypeScript
    plugins: [
      ["babel-plugin-react-compiler", ReactCompilerConfig],
    ],
    },
  }),
  ],
});
```

### Webpack {/*usage-with-webpack*/}

Một webpack loader cộng đồng [hiện có tại đây](https://github.com/SukkaW/react-compiler-webpack).

### Expo {/*usage-with-expo*/}

Vui lòng tham khảo [tài liệu của Expo](https://docs.expo.dev/guides/react-compiler/) để bật và sử dụng React Compiler trong các ứng dụng Expo.

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native sử dụng Babel thông qua Metro, vì vậy hãy tham khảo phần [Cách sử dụng với Babel](#usage-with-babel) để biết hướng dẫn cài đặt.

### Rspack {/*usage-with-rspack*/}

Vui lòng tham khảo [tài liệu của Rspack](https://rspack.dev/guide/tech/react#react-compiler) để bật và sử dụng React Compiler trong các ứng dụng Rspack.

### Rsbuild {/*usage-with-rsbuild*/}

Vui lòng tham khảo [tài liệu của Rsbuild](https://rsbuild.dev/guide/framework/react#react-compiler) để bật và sử dụng React Compiler trong các ứng dụng Rsbuild.

## Khắc phục sự cố {/*troubleshooting*/}

Để báo cáo sự cố, trước tiên hãy tạo một bản repro tối thiểu trên [React Compiler Playground](https://playground.react.dev/) và đưa nó vào báo cáo lỗi của bạn. Bạn có thể mở các issue trong repo [facebook/react](https://github.com/facebook/react/issues).

Bạn cũng có thể cung cấp phản hồi trong React Compiler Working Group bằng cách đăng ký làm thành viên. Vui lòng xem [README để biết thêm chi tiết về cách tham gia](https://github.com/reactwg/react-compiler).

### Trình biên dịch giả định điều gì? {/*what-does-the-compiler-assume*/}

React Compiler giả định rằng code của bạn:

1. Là JavaScript hợp lệ, ngữ nghĩa.
2. Kiểm tra xem các giá trị và thuộc tính nullable/optional có được xác định trước khi truy cập chúng hay không (ví dụ: bằng cách bật [`strictNullChecks`](https://www.typescriptlang.org/tsconfig/#strictNullChecks) nếu sử dụng TypeScript), tức là `if (object.nullableProperty) { object.nullableProperty.foo }` hoặc với optional-chaining `object.nullableProperty?.foo`.
3. Tuân theo [Rules of React](https://react.dev/reference/rules).

React Compiler có thể xác minh nhiều Rules of React một cách tĩnh và sẽ bỏ qua quá trình biên dịch một cách an toàn khi phát hiện lỗi. Để xem các lỗi, chúng tôi khuyên bạn cũng nên cài đặt [eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler).

### Làm cách nào để biết các component của tôi đã được tối ưu hóa? {/*how-do-i-know-my-components-have-been-optimized*/}

[React DevTools](/learn/react-developer-tools) (v5.0+) và [React Native DevTools](https://reactnative.dev/docs/react-native-devtools) có hỗ trợ tích hợp cho React Compiler và sẽ hiển thị huy hiệu "Memo ✨" bên cạnh các component đã được tối ưu hóa bởi trình biên dịch.

### Có gì đó không hoạt động sau khi biên dịch {/*something-is-not-working-after-compilation*/}
Nếu bạn đã cài đặt eslint-plugin-react-compiler, trình biên dịch sẽ hiển thị bất kỳ vi phạm nào đối với các quy tắc của React trong trình soạn thảo của bạn. Khi nó làm điều này, điều đó có nghĩa là trình biên dịch đã bỏ qua việc tối ưu hóa component hoặc hook đó. Điều này hoàn toàn ổn và trình biên dịch có thể khôi phục và tiếp tục tối ưu hóa các component khác trong codebase của bạn. **Bạn không cần phải sửa tất cả các vi phạm ESLint ngay lập tức.** Bạn có thể giải quyết chúng theo tốc độ của riêng bạn để tăng số lượng component và hook được tối ưu hóa.

Tuy nhiên, do tính chất linh hoạt và động của JavaScript, không thể phát hiện toàn diện tất cả các trường hợp. Các lỗi và hành vi không xác định như vòng lặp vô hạn có thể xảy ra trong những trường hợp đó.

Nếu ứng dụng của bạn không hoạt động bình thường sau khi biên dịch và bạn không thấy bất kỳ lỗi ESLint nào, thì trình biên dịch có thể đang biên dịch code của bạn không chính xác. Để xác nhận điều này, hãy thử làm cho sự cố biến mất bằng cách chủ động chọn không sử dụng bất kỳ component hoặc hook nào bạn cho là có liên quan thông qua directive [`"use no memo"`](#opt-out-of-the-compiler-for-a-component).

```js {2}
function SuspiciousComponent() {
  "use no memo"; // opts out this component from being compiled by React Compiler
  // ...
}
```

<Note>
#### `"use no memo"` {/*use-no-memo*/}

`"use no memo"` là một escape hatch _tạm thời_ cho phép bạn chọn không biên dịch các component và hook bởi React Compiler. Directive này không có nghĩa là tồn tại lâu dài giống như [`"use client"`](/reference/rsc/use-client).

Không nên sử dụng directive này trừ khi thực sự cần thiết. Khi bạn chọn không sử dụng một component hoặc hook, nó sẽ bị chọn không sử dụng vĩnh viễn cho đến khi directive bị xóa. Điều này có nghĩa là ngay cả khi bạn sửa code, trình biên dịch vẫn sẽ bỏ qua việc biên dịch nó trừ khi bạn xóa directive.
</Note>

Khi bạn làm cho lỗi biến mất, hãy xác nhận rằng việc xóa directive chọn không sử dụng sẽ khiến sự cố quay trở lại. Sau đó, hãy chia sẻ báo cáo lỗi với chúng tôi (bạn có thể thử giảm nó xuống một bản repro nhỏ hoặc nếu đó là code nguồn mở, bạn cũng có thể chỉ cần dán toàn bộ source) bằng [React Compiler Playground](https://playground.react.dev) để chúng tôi có thể xác định và giúp khắc phục sự cố.

### Các vấn đề khác {/*other-issues*/}

Vui lòng xem https://github.com/reactwg/react-compiler/discussions/7.
