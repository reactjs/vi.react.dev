---
id: create-a-new-react-app
title: Tạo một App React mới
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

Sử dụng chuỗi công cụ tích hợp để có trải nghiệm tốt nhất cho người dùng và nhà phát triển.

Trang này mô tả một số công cụ React phổ biến giúp thực hiện các tác vụ như:

* Mở rộng quy mô cho nhiều file và component.
* Sử dụng thư viện của bên thứ ba từ npm.
* Phát hiện sớm các lỗi thường gặp.
* Chỉnh sửa trực tiếp CSS và JS đang được phát triển.
* Tối ưu hóa đầu ra cho production.

Các công cụ được đề xuất trên trang này **không yêu cầu cấu hình để bắt đầu**.

## Bạn Có Thể Không Cần một Chuỗi Công Cụ {#you-might-not-need-a-toolchain}

Nếu bạn không gặp phải các vấn đề được mô tả ở trên hoặc chưa cảm thấy thoải mái khi sử dụng các công cụ JavaScript, xem xét [thêm React dưới dạng thẻ `<script>` thuần túy trên trang HTML](/docs/add-react-to-a-website.html), tùy chỉnh [với JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx).

Đây cũng là **cách dễ nhất để tích hợp React vào một trang web hiện có.** Bạn luôn có thể thêm một công cụ lớn hơn nếu bạn thấy nó hữu ích!

## Đề xuất Công Cụ {#recommended-toolchains}

Nhóm React chủ yếu đề xuất các giải pháp sau:

- Nếu bạn **đang học React** hoặc **tạo một app [single-page](/docs/glossary.html#single-page-application) mới,** sử dụng [Tạo App React](#create-react-app).
- Nếu bạn đang xây dựng một **website kết xuất máy chủ (server-rendered) với Node.js,** hãy thử [Next.js](#nextjs).
- Nếu bạn đang xây dựng một **website tĩnh định hướng nội dung (content-oriented),** hãy thử [Gatsby](#gatsby).
- Nếu bạn đang xây dựng một **thư viện component** hoặc **tích hợp với codebase hiện có**, hãy thử [Nhiều Công Cụ Linh Hoạt Hơn](#more-flexible-toolchains).

### Tạo App React {#create-react-app}

[Tạo App React](https://github.com/facebookincubator/create-react-app) là một môi trường thoải mái để **học React**, và là cách tốt nhất để bắt đầu xây dựng **một ứng dụng [single-page](/docs/glossary.html#single-page-application) mới** trong React.

Nó thiết lập môi trường phát triển của bạn để bạn có thể sử dụng các tính năng JavaScript mới nhất, cung cấp trải nghiệm tốt cho nhà phát triển và tối ưu hóa ứng dụng của bạn cho sản xuất. Bạn sẽ cần phải có [Node >= 10.16 và npm >= 5.6](https://nodejs.org/en/) trên máy của bạn. Để tạo một dự án, hãy chạy:

```bash
npx create-react-app my-app
cd my-app
npm start
```

>Ghi chú
>
>`npx` trên dòng đầu tiên không phải là lỗi đánh máy -- Nó là một [công cụ chạy package đi kèm với npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Tạo App React không xử lý logic backend hoặc databases; Nó chỉ tạo một đường dẫn để xây dựng frontend, vì vậy bạn có thể sử dụng nó với bất kì backend nào bạn muốn. Ẩn sâu, nó sử dụng [Babel](https://babeljs.io/) và [webpack](https://webpack.js.org/), những bạn không cần biết bất cứ điều gì về chúng.

Khi bạn đã sẵn sàng triển khai sang phiên bản production, hãy chạy `npm run build` sẽ tạo ra một bản dựng ứng dụng của bạn được tối ưu hóa trong thư mục `build`. Bạn có thể tìm hiểu thêm về Tạo App React [README của nó](https://github.com/facebookincubator/create-react-app#create-react-app--) và [Hướng Dẫn Sử Dụng](https://facebook.github.io/create-react-app/).

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) là một framework phổ biến và nhẹ cho **ứng dụng static và server‑rendered** được xây dựng bằng React. Nó bao gồm **giarp pháp tạo kiểu và định tuyến** ra khỏi hộp và giả định rằng bạn đang sử dụng [Node.js](https://nodejs.org/) làm môi trường máy chủ.

Tìm hiểu Next.js từ [hướng dẫn chính thức của nó](https://nextjs.org/learn/).

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) là cách tốt nhất để tạo **các website tĩnh** với React. Nó cho phép bạn sử dụng các component của React, nhưng xuất ra HTML và CSS được render trước để đảm bảo thời gian tải nhanh nhất.

Tìm hiểu Gatsby [từ hướng dẫn chính thức của nó](https://www.gatsbyjs.org/docs/) và một [bộ sưu tập các công cụ dành cho người mới bắt đầu](https://www.gatsbyjs.org/docs/gatsby-starters/).

### Thêm Nhiều Các Công Cụ Linh Hoạt {#more-flexible-toolchains}

Các công cụ sau cung cấp nhiều sự lựa chọn và linh hoạt hơn. Chúng tôi giới thiệu chúng cho những người dùng có kinh nghiệm hơn:

- **[Neutrino](https://neutrinojs.org/)** kết sức mạnh của [webpack](https://webpack.js.org/) với sự đơn giản của các cài đặt trước và bao gồm cài đặt trước cho [các ứng dụng React](https://neutrinojs.org/packages/react/) và [các component React](https://neutrinojs.org/packages/react-components/).

- **[Nx](https://nx.dev/react)** là một bộ công cụ để phát triển full-stack monorepo, với hỗ trợ tích hợp cho React, Next.js, [Express](https://expressjs.com/), và nhiều hơn nữa.

- **[Parcel](https://parceljs.org/)** là một gói ứng dụng web nhanh, không cấu hình [hoạt động với React](https://parceljs.org/recipes.html#react).

- **[Razzle](https://github.com/jaredpalmer/razzle)** là một framework kết xuất máy chủ không yêu cầu bất kỳ cấu hình nào, nhưng cung cấp tính linh hoạt hơn Next.js.

## Tạo một Chuỗi Công Cụ từ Scratch {#creating-a-toolchain-from-scratch}

Chuỗi công cụ xây dựng JavaScript thường bao gồm:

* Một **trình quản lý package**, chẳng hạn như [Yarn](https://yarnpkg.com/) hoặc [npm](https://www.npmjs.com/). Nó cho phép bạn tận dụng hệ sinh thái rộng lớn của các package bên thứ ba và dễ dàng cài đặt hoặc cập nhật chúng.

* Một **bundler**, chẳng hạn như [webpack](https://webpack.js.org/) hoặc [Parcel](https://parceljs.org/). Nó cho phép bạn viết code mô-đun và gói nó lại với nhau thành các gói nhỏ để tối ưu hóa thời gian tải.

* Một **compiler** chẳng hạn như [Babel](https://babeljs.io/). Nó cho phép bạn viết mã JavaScript hiện đại vẫn hoạt động trong các trình duyệt cũ hơn.

Nếu bạn muốn thiết lập chuỗi công cụ JavaScript của riêng mình từ đầu, [Kiểm tra hướng dẫn này](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) để tạo lại một số chức năng Tạo App React.

Đừng quên đảm bảo chuỗi công cụ tùy chỉnh của bạn [được thiết lập chính xác cho production](/docs/optimizing-performance.html#use-the-production-build).
