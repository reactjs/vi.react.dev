---
id: static-type-checking
title: Static Type Checking
permalink: docs/static-type-checking.html
---

Trình kiểm tra kiểu tĩnh(static) như [Flow](https://flow.org/) và [TypeScript](https://www.typescriptlang.org/) xác định một số loại vấn đề nhất định trước khi bạn chạy code của mình. Chúng cũng có thể cải thiện quy trình làm việc của nhà phát triển bằng cách thêm các tính năng như tự động hoàn thành(auto-completion). Do vậy, chúng tôi khuyên bạn nên sử dụng Flow hoặc TypeScript thay vì `PropTypes` khi bạn code một dự án lớn.

## Flow {#flow}

[Flow](https://flow.org/) là một trình kiểm tra kiểu tĩnh cho mã JavaScript của bạn. Nó được phát triển tại Facebook và thường được sử dụng với React. It lets you annotate the variables, functions, and React components with a special type syntax, and catch mistakes early. Bạn có thể đọc [introduction to Flow](https://flow.org/en/docs/getting-started/) để tìm hiểu những điều cơ bản.

Để dùng Flow, bạn cần chuẩn bị:

* Thêm Flow vào project của bạn với vai trò như yếu tố dependency.
* Đảm bảo rằng cú pháp Flow được loại bỏ khỏi mã đã biên dịch.
* Thêm chú thích loại và chạy Flow để kiểm tra chúng.

Chúng tôi sẽ giải thích chi tiết các bước này bên dưới.

### Thêm Flow vào Project {#adding-flow-to-a-project}

Đầu tiên, điều hướng project của bạn trong Terminal. Sau đó, bạn sẽ chạy các lệnh sau:

Nếu bạn dùng [Yarn](https://yarnpkg.com/):

```bash
yarn add --dev flow-bin
```

Nếu bạn dùng [npm](https://www.npmjs.com/):

```bash
npm install --save-dev flow-bin
```

Lệnh này cài đặt phiên bản Flow mới nhất vào project của bạn.

Bây giờ, thêm `flow` vào phần `"scripts"` trong `package.json` của bạn để có thể sử dụng nó trong Terminal:

```js{4}
{
  // ...
  "scripts": {
    "flow": "flow",
    // ...
  },
  // ...
}
```

Cuối cùng, chạy một trong các lệnh sau:

Nếu bạn dùng [Yarn](https://yarnpkg.com/):

```bash
yarn run flow init
```

Nếu bạn dùng [npm](https://www.npmjs.com/):

```bash
npm run flow init
```

Lệnh này sẽ tạo một tệp cấu hình Flow mà bạn sẽ cần phải commit.

### Tách Flow Syntax ra khỏi Compiled Code {#stripping-flow-syntax-from-the-compiled-code}

Flow mở rộng ngôn ngữ JavaScript với một cú pháp đặc biệt cho các kiểu chú thích(annotations). Tuy nhiên, các trình duyệt không biết cú pháp này,
vì vậy chúng tôi cần đảm bảo rằng nó không nằm trong gói JavaScript đã biên dịch được gửi đến trình duyệt.

Cách chính xác để làm điều này phụ thuộc vào các công cụ bạn sử dụng để biên dịch JavaScript.

#### Tạo React App {#create-react-app}

Nếu project của bạn được tạo bằng cách [Create React App](https://github.com/facebookincubator/create-react-app), chúc mừng! Chú thích(annotations ) của Flow đã bị loại bỏ theo mặc định, vì vậy bạn không cần phải làm bất kỳ điều gì khác trong bước này.

#### Babel {#babel}

>Lưu ý:
>
>Những hướng dẫn này *không* dành cho những người dùng Create React App. Mặc dù Create React App sử dụng Babel, nó đã được cấu hình để hiểu Flow. Chỉ làm theo bước này nếu bạn không sử dụng Create React App.

Nếu bạn định cấu hình Babel theo cách thủ công cho project mình, you will need to install a special preset for Flow.

Nếu bạn dùng Yarn:

```bash
yarn add --dev @babel/preset-flow
```

Nếu bạn dùng npm:

```bash
npm install --save-dev @babel/preset-flow
```

Sau đó thêm `flow` preset cho [Babel configuration](https://babeljs.io/docs/usage/babelrc/) của bạn. Ví dụ: nếu bạn định cấu hình Babel thông qua file `.babelrc`, nó có thể sẽ giống thế này:

```js{3}
{
  "presets": [
    "@babel/preset-flow",
    "react"
  ]
}
```

Điều này sẽ cho phép bạn sử dụng Flow Syntax trong code của mình.

>Lưu ý:
>
>Flow không yêu cầu `react` preset, nhưng chúng thường được sử dụng cùng nhau. Bản thân Flow hiểu cú pháp JSX.

#### Other Build Setups {#other-build-setups}

Nếu bạn không sử dụng Create React App hoặc Babel, bạn có thể sử dụng [flow-remove-types](https://github.com/flowtype/flow-remove-types) để loại bỏ các loại chú thích(the type annotations).

### Chạy Flow {#running-flow}

Nếu bạn đã làm theo các hướng dẫn ở trên, bạn sẽ chạy được Flow.

```bash
yarn flow
```

Nếu bạn dùng npm:

```bash
npm run flow
```

Bạn sẽ thấy một thông báo như sau:

```
No errors!
✨  Done in 0.17s.
```

### Thêm các loại chú thích Flow(Flow Type Annotations){#adding-flow-type-annotations}

Theo mặc định, Flow chỉ kiểm tra các tệp bao gồm chú thích(annotation) này:

```js
// @flow
```

Thông thường, nó được đặt ở đầu file. Hãy thử thêm nó vào một số tệp trong project của bạn và chạy `yarn flow` hoặc `npm run flow` để xem Flow đã tìm thấy bất kỳ vấn đề nào chưa.

Ngoài ra còn có [một tùy chọn](https://flow.org/en/docs/config/options/#toc-all-boolean) để buộc Flow kiểm tra *tất cả* các file bất kể chú thích(annotation) là gì. Điều này có thể sẽ hơi bất tiện đối với các project đang làm dở, nhưng hợp lý đối với các project mới nếu bạn muốn nhập đầy đủ nó bằng Flow.

Giờ tất cả mọi thứ đã sẵn sàng! Chúng tôi khuyên bạn nên đọc thêm các tài liệu để hiểu thêm về Flow:

* [Flow Documentation: Type Annotations](https://flow.org/en/docs/types/)
* [Flow Documentation: Editors](https://flow.org/en/docs/editors/)
* [Flow Documentation: React](https://flow.org/en/docs/react/)
* [Linting in Flow](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript {#typescript}

[TypeScript](https://www.typescriptlang.org/) là một ngôn ngữ lập trình được phát triển bởi Microsoft. Nó là một tập hợp siêu cú pháp nghiêm ngặt của JavaScript và thêm tính năng kiểu tĩnh tùy chọn vào ngôn ngữ.  Là một ngôn ngữ được đánh máy, TypeScript có thể bắt lỗi và lỗi tại thời điểm xây dựng, rất lâu trước khi ứng dụng của bạn hoạt động. Bạn có thể tìm hiểu thêm về cách sử dụng TypeScript với React tại [đây](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

Để dùng TypeScript, bạn cần chuẩn bị:
* Thêm TypeScript vào project của bạn với vai trò như yếu tố dependency.
* Cấu hình lại cấu hình TypeScript.
* Sử dụng thêm các extension phù hợp.
* Định nghĩa các thư viện mà bạn đang dùng.

Giờ chúng ta sẽ đi vào chi tiết.

### Sử dụng TypeScript với Create React App {#using-typescript-with-create-react-app}

Create React App sẽ hỗ trợ TypeScript.

Để tạo một **project mới** với sự hỗ trợ của TypeScript, ta dùng lệnh:

```bash
npx create-react-app my-app --template typescript
```

Bạn cũng có thể thêm nó vào một **Create React App project sẵn có**, [như trong tài liệu này](https://facebook.github.io/create-react-app/docs/adding-typescript).

>Lưu ý:
>
>Nếu bạn sử dụng Create React App, bạn có thể **bỏ qua phần còn lại của trang này**. Nó mô tả cách thiết lập thủ công không áp dụng cho Create React App.


### Thêm TypeScript vào một Project {#adding-typescript-to-a-project}
Tất cả bắt đầu bằng việc chạy một lệnh trong terminal.

Nếu bạn dùng [Yarn](https://yarnpkg.com/):

```bash
yarn add --dev typescript
```

Nếu bạn dùng [npm](https://www.npmjs.com/):

```bash
npm install --save-dev typescript
```

Chúc mừng! Bạn đã cài được phiên bản TypeScript mới nhất vào project của mình. Khi cài xong TypeScript chúng ta sẽ dùng được lệnh `tsc`. Trước khi cài đặt cấu hình, hãy thêm `tsc` vào phần "scripts" trong `package.json`:

```js{4}
{
  // ...
  "scripts": {
    "build": "tsc",
    // ...
  },
  // ...
}
```

### Cấu hình TypeScript {#configuring-the-typescript-compiler}
Trình biên dịch không giúp ích gì cho chúng ta cho đến khi chúng ta yêu cầu nó phải làm gì. Trong TypeScript, các quy tắc này được định nghĩa trong một tệp đặc biệt có tên là `tsconfig.json`. Để tạo tệp này, ta dùng một trong các lệnh sau:

Nếu bạn dùng [Yarn](https://yarnpkg.com/):

```bash
yarn run tsc --init
```

Nếu bạn dùng [npm](https://www.npmjs.com/):

```bash
npx tsc --init
```

Nhìn vào `tsconfig.json` đã được tạo xong, bạn có thể thấy rằng có nhiều tùy chọn bạn có thể sử dụng để cấu hình trình biên dịch. Để biết mô tả chi tiết về tất cả các tùy chọn, hãy kiểm tra tại [đây](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

Trong số nhiều tùy chọn, chúng ta sẽ xem xét `rootDir` và `outDir`. Theo đúng nghĩa của nó, trình biên dịch sẽ nhận các tệp typescript  và tạo ra các tệp javascript. Tuy nhiên, chúng tôi không muốn nhầm lẫn với các tệp nguồn(source file) và đầu ra được tạo.

Vấn đề này sẽ được  giải quyết trong hai bước:
* Đầu tiên, hãy sắp xếp cấu trúc dự án(project structure) của chúng ta như thế này. Chúng tôi sẽ đặt tất cả source code của chúng tôi trong thư mục `src`.

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* Tiếp theo, chúng ta sẽ cho trình biên dịch biết source code của chúng ta ở đâu và đầu ra sẽ đi đâu.

```js{6,7}
// tsconfig.json

{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"
    // ...
  },
}
```

Tuyệt vời! Bây giờ khi chúng ta chạy tập lệnh xây dựng của mình, trình biên dịch sẽ xuất javascript đã tạo vào thư mục `build` folder. [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/main/tsconfig.json) cung cấp `tsconfig.json` với một bộ quy tắc tốt để giúp bạn bắt đầu.

Để javascript đã tạo không nằm trong bộ điều khiển(source control), hãy thêm `.gitignore` để khắc phục điều này.

### Các file extension {#file-extensions}
Trong React, bạn có thể viết các component trong file `.js`. Trong TypeScript, chúng ta có 2 file extension:

`.ts` là file extension mặc định trong khi `.tsx` phần mở rộng đặc biệt được sử dụng cho các file có chứa `JSX`.

### Chạy TypeScript {#running-typescript}

Nếu bạn làm theo các hướng dẫn ở trên, bạn sẽ thấy TypeScript chạy thành công.

```bash
yarn build
```

If you use npm, run:

```bash
npm run build
```

Nếu bạn không thấy output, có nghĩa là nó đã thành công.


### Type Definitions {#type-definitions}
Để có thể hiển thị lỗi và gợi ý từ các package khác, trình biên dịch dựa vào các tệp khai báo. Tệp khai báo cung cấp tất cả các loại thông tin về một thư viện. Điều này cho phép chúng ta sử dụng các thư viện javascript như các thư viện trên npm trong project của chúng ta.

Có hai cách chính để lấy các khai báo cho một thư viện:

__Bundled__ - Thư viện đóng gói tệp khai báo của riêng nó. Điều này rất tốt cho chúng ta, vì tất cả những gì chúng ta cần làm là cài đặt thư viện và chúng ta có thể sử dụng nó ngay lập tức. Để kiểm tra xem một thư viện có các bundled type chưa, hãy tìm file `index.d.ts` trong project. Một số thư viện sẽ có nó sẵn ở trong file `package.json` dưới `typings` hoặc trường `types`.

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ - DefinitelyTyped là một kho lưu trữ khổng lồ các khai báo dành cho các thư viện không đóng gói tệp khai báo. Các khai báo có nguồn gốc từ cộng đồng
và được quản lý bởi Microsoft và những người đóng góp nguồn mở. Ví dụ: React không gói tệp khai báo của riêng nó.
Thay vào đó, chúng ta có thể lấy nó từ DefinitelyTyped. Để làm như vậy, hãy nhập lệnh này vào terminal của bạn.

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__Khai báo cục bộ__
Đôi khi package mà bạn muốn sử dụng không gói các khai báo cũng như không có sẵn trên DefinitelyTyped. Trong trường hợp đó,
chúng ta có thể có một tệp khai báo cục bộ. Để thực hiện việc này, hãy tạo tệp `declarations.d.ts` trong thư mục gốc(root) của thư
mục nguồn(source directory) của bạn. Một khai báo đơn giản có thể trông như thế này:

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

Giờ bạn hoàn toàn có thể bắt đầu code được rồi! Chúng tôi khuyên hãy đọc thêm các tài liệu sau để hiểu TypeScript hơn:

* [TypeScript Documentation: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
* [TypeScript Documentation: Migrating from JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [TypeScript Documentation: React and Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## ReScript {#rescript}

[ReScript](https://rescript-lang.org/) là một ngôn ngữ được đánh máy biên dịch sang JavaScript. Một số tính năng cốt lõi của nó được đảm bảo phạm vi phủ sóng 100%,
hỗ trợ JSX tốt nhất và [các ràng buộc React chuyên dụng](https://rescript-lang.org/docs/react/latest/introduction) để cho phép tích hợp trong các cơ sở mã JS / TS React hiện có.


Bạn có thể tìm thêm thông tin về cách tích hợp ReScript trong cơ sở mã JS / React hiện có của mình tại [đây](https://rescript-lang.org/docs/manual/latest/installation#integrate-into-an-existing-js-project).

## Kotlin {#kotlin}

[Kotlin](https://kotlinlang.org/) là một ngôn ngữ gõ tĩnh được phát triển bởi JetBrains. Các nền tảng mục tiêu của nó bao gồm JVM, Android, LLVM và [JavaScript](https://kotlinlang.org/docs/reference/js-overview.html). 

JetBrains phát triển và duy trì một số công cụ dành riêng cho cộng đồng React: [React bindings](https://github.com/JetBrains/kotlin-wrappers) cũng như [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app). Phần sau giúp bạn bắt đầu xây dựng ứng dụng React với Kotlin mà không cần cấu hình xây dựng.

## Các ngôn ngữ khác {#other-languages}

Lưu ý rằng có những ngôn ngữ được nhập tĩnh khác sẽ biên dịch sang JavaScript và do đó tương thích với React. Ví dụ, [F#/Fable](https://fable.io/) với [elmish-react](https://elmish.github.io/react). Kiểm tra các trang web tương ứng của họ để biết thêm thông tin và có thể tự do thêm các ngôn ngữ được nhập tĩnh khác hoạt động với React vào trang này!
