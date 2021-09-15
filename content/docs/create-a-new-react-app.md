---
id: create-a-new-react-app
title: Tạo mới một ứng dụng React.
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

Sử dụng một chuỗi công cụ tích hợp để cho trải nghiệm của người dùng và nhà phát triển tốt nhất.

Trang này mô tả một số công cụ React phổ biến giúp thực hiện các tác vụ như sau:

* Mở rộng quy mô cho nhiều file và component.
* Sử dụng thư viện của bên thứ ba từ npm.
* Phát hiện sớm các lỗi thường gặp
* Chỉnh sử trực tiếp CSS và JS đang được phát triển.
* Tối ưu hóa đầu ra cho sản phẩm.

Các công cụ được đề xuất trên trang này **không yêu cầu bắt buộc cấu hình để bắt đầu**.

## Bạn có thể không cần chuỗi công cụ này {#you-might-not-need-a-toolchain}

Nếu bạn không gặp phải các vấn đề được mô tả ở trên hoặc chưa cảm thấy thoải mái khi sử dụng JavaScript tools, hãy xem xét [thêm React dưới dạng thẻ `<script>` thuần túy trên trang HTML](/docs/add-react-to-a-website.html), tùy chọn [với JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx).

Đây cũng là **cách dễ nhất để tích hợp React vào một trang web hiện có.** Bạn luôn có thể thêm một chuỗi công cụ lớn hơn nếu bạn thấy nó hữu ích!

## Các loại công cụ được đề xuất {#recommended-toolchains}

Nhóm React chủ yếu đề xuất các giải pháp này:

- Nếu bạn **đang học React** hoặc **tạo một ứng dụng [single-page](/docs/glossary.html#single-page-application) mới,** hãy sử dụng [Tạo Ứng Dụng React](#create-react-app).
- Nếu bạn đang xây dựng một **server-rendered website với Node.js,** hãy thử [Next.js](#nextjs).
- Nếu bạn đang xây dựng một **static content-oriented website,** hãy thử [Gatsby](#gatsby).
- Nếu bạn đang xây dựng một **component library** hoặc **tích hợp với một codebase hiện có**, hãy thử [Các Loại Công Cụ Linh Hoạt Hơn](#more-flexible-toolchains).

### Tạo Ứng Dụng React {#create-react-app}

[Tạo Ứng Dụng React](https://github.com/facebookincubator/create-react-app) là một môi trường thoải mái để **học React**, và là cách tốt nhất để bắt đầu xây dựng **một ứng dụng [single-page](/docs/glossary.html#single-page-application) mới** trong React.

Nó thiết lập môi trường phát triển của bạn để bạn có thể sử dụng các tính năng JavaScript mới nhất, cung cấp trải nghiệm tốt cho nhà phát triển và tối ưu hóa ứng dụng của bạn để sản xuất. Bạn sẽ cần có [Node> = 10.16 và npm> = 5.6](https://nodejs.org/en/) trên máy của mình. Để tạo một dự án, hãy chạy:

```bash
npx create-react-app my-app
cd my-app
npm start
```

>Ghi chú
>
>`npx` trên dòng đầu tiên không phải là lỗi đánh máy -- nó là một [công cụ chạy package đi kèm với npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Tạo Ứng Dụng React không xử lý logic backend hay databases; nó chỉ tạo ra một đường dẫn xây dựng frontend, vì vậy bạn có thể sử dụng nó với bất cứ backend nào bạn muốn. Lớp bên dưới, nó sử dụng [Babel](https://babeljs.io/) và [webpack](https://webpack.js.org/), nhưng bạn không cần bất biết bất cứ thứ gì về chúng.

Khi bạn sẵn sàng để deploy lên production, hãy chạy `npm run build` sẽ tạo ra một bản ứng dụng của bạn đã được tối ưu hóa trong thư mục `build`. Bạn có thể học thêm về Tạo Ứng Dụng React [từ chính README](https://github.com/facebookincubator/create-react-app#create-react-app--) và [Hướng Dẫn Sử Dụng](https://facebook.github.io/create-react-app/).

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) là một thư viện phổ biến và nhẹ cho **static and server‑rendered applications** được xây dựng bằng React. Nó bao gồm **styling và routing solutions** out of the box, và giả sử rằng bạn đang sử dụng [Node.js](https://nodejs.org/) như là môi trường máy chủ.

Học Next.js từ [hướng dẫn chính thức của nó](https://nextjs.org/learn/).

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) là cách tốt nhất để tạo **static websites** với React. Nó cho phép bạn sử dụng React components, nhưng xuất ra HTML và CSS được kết xuất trước để đảm bảo thời gian tải nhanh nhất.

Học Gatsby từ [hướng dẫn chính thức của nó](https://www.gatsbyjs.org/docs/) và [gallery of starter kits](https://www.gatsbyjs.org/docs/gatsby-starters/).

### Các loại công cụ linh hoạt hơn {#more-flexible-toolchains}

Các công cụ sau cung cấp nhiều sự lựa chọn và linh hoạt hơn. Chúng tôi giới thiệu chúng cho những người dùng có kinh nghiệm hơn:

- **[Neutrino](https://neutrinojs.org/)** kết hợp sức mạnh của [webpack](https://webpack.js.org/) với sự đơn giản của các cài đặt trước và bao gồm một cài đặt trước cho [React apps](https://neutrinojs.org/packages/react/) và [React components](https://neutrinojs.org/packages/react-components/).

- **[Nx](https://nx.dev/react)** là một bộ công cụ để phát triển full-stack monorepo, với hỗ trợ tích hợp cho React, Next.js, [Express](https://expressjs.com/), và hơn thế nữa.

- **[Parcel](https://parceljs.org/)** là một gói ứng dụng web nhanh, không cấu hình [hoạt động với React](https://parceljs.org/recipes.html#react).

- **[Razzle](https://github.com/jaredpalmer/razzle)** là một server-rendering framework không yêu cầu bất kỳ cấu hình nào, nhưng nó cung cấp tính linh hoạt hơn Next.js.

## Tạo một chuỗi công cụ từ đầu {#creating-a-toolchain-from-scratch}

Một chuỗi công cụ xây dựng JavaScript thường bao gồm:

* Một **package manager**, như là [Yarn](https://yarnpkg.com/) hoặc [npm](https://www.npmjs.com/). Nó cho phép bạn tận dụng hệ sinh thái rộng lớn của các gói bên thứ ba và dễ dàng cài đặt hoặc cập nhật chúng.

* Một **bundler**, như là [webpack](https://webpack.js.org/) hoặc [Parcel](https://parceljs.org/). Nó cho phép bạn viết modular code và bundle nó lại với nhau thành các package nhỏ để tối ưu hóa thời gian tải.

* Một **compiler** như là [Babel](https://babeljs.io/). Nó cho phép bạn viết code JavaScript hiện đại vẫn hoạt động trong các trình duyệt cũ hơn.

Nếu bạn muốn thiết lập chuỗi công cụ JavaScript của riêng mình từ đầu, [hãy xem hướng dẫn này](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) tái tạo một số chức năng Tạo Ứng Dụng React.

Đừng quên đảm bảo chuỗi công cụ tùy chỉnh của bạn [được thiết lập chính xác cho production](/docs/optimizing-performance.html#use-the-production-build).
