---
id: create-a-new-react-app
title: Tạo mới một ứng dụng bằng React
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

Sử dụng chuỗi công cụ tích hợp để có trải nghiệm tốt nhất cho người dùng và nhà phát triển.

Trang này mô tả một số công cụ React phổ biến giúp thực hiện các tác vụ như:

* Mở rộng quy mô cho nhiều tệp và components.
* Sử dụng thư viện của bên thứ ba từ npm.
* Phát hiện sớm những lỗi thường mắc phải.
* Chỉnh sửa trực tiếp CSS và JS khi đang phát triển.
* Tối ưu hóa cho môi trường production.

Chuỗi công cụ giới thiệu ở trang này **không cần phải cấu hình trước khi bắt đầu**.

## Bạn có thể Không Cần một Công Cụ {#you-might-not-need-a-toolchain}

Nếu bạn không gặp phải vấn đề được mô tả bên trên hoặc chưa thấy thoải mái khi sử dụng các công cụ JavaScript, hãy cân nhắc [thêm React với thẻ `<script>` trên một trang HTML](/docs/add-react-to-a-website.html), tùy chọn [với JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx).

Đây cũng là **cách dễ nhất để tích hợp React vào một website đang hoạt động.** Bạn lúc nào cũng có thể thêm một công cụ mạnh hơn nếu bạn thấy nó có ích!

## Các Công Cụ khuyến nghị {#recommended-toolchains}

Đội ngũ React chủ yếu khuyến nghị các giải pháp sau:

- Nếu bạn **đang học React** hoặc **tạo mới một [single-page](/docs/glossary.html#single-page-application) app,** hãy sử dụng [Create React App](#create-react-app).
- Nếu bạn đang xây dựng một **trang web server-rendered bằng Node.js,** thử [Next.js](#nextjs).
- Nếu bạn đang xây dựng một **trang web tĩnh hướng nội dung,** thử [Gatsby](#gatsby).
- Nếu bạn đang xây dựng một **thư viện component** hoặc **tích hợp với bộ code của bạn**, thử [Các loại công cụ linh hoạt](#more-flexible-toolchains).

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app) là môi trường thoải mái để **học React**, và là cách tốt nhất để xây dựng **một ứng dụng [single-page](/docs/glossary.html#single-page-application) ** với React.

Nó cài đặt môi trường phát triển của bạn để sử dụng các tính năng mới nhất của JavaScript, cung cấp trải nghiệp tốt cho nhà phát triển, và tối ưu ứng dụng của bạn trên môi trường production. Bạn sẽ cần [Node >= 8.10 and npm >= 5.6](https://nodejs.org/en/) trên máy của bạn. Để tạo mới dự án, chạy:

```bash
npx create-react-app my-app
cd my-app
npm start
```

>Ghi chú
>
>`npx` ở dòng đầu tiên không phải là lỗi đánh máy -- nó là một [công cụ đóng gói đi kèm với npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Create React App không xử lý backend logic hoặc cơ sở dữ liệu; nó chỉ tạo ra một công cụ xây dựng ứng dụng frontend, vì thế bạn có thể sử dụng nó với mọi loại backend mà bạn muốn. Ngoài ra, nó dùng [Babel](https://babeljs.io/) và [webpack](https://webpack.js.org/), nhưng bạn không cần phải biết mọi thứ về chúng.

Khi bạn sẵ sàng để triển khai lên môi trường production, chạy lệnh `npm run build` sẽ tạo ra một bản đã được tối ưu hóa ở thư mục `build`. Bạn có thể xem thêm về Create React App [từ README của nó](https://github.com/facebookincubator/create-react-app#create-react-app--) và [Hướng dẫn sử dụng](https://facebook.github.io/create-react-app/).

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) là một framework phổ biến và nhẹ cho phát triển **ứng dụng tĩnh và ứng dụng server-rendered** được làm bởi React. Nó tích hợp sẵn **giải pháp cho giao diện và điều hướng**, và giả định rằng bạn đang sử dụng [Node.js](https://nodejs.org/) giống với môi trường hệ thống.

Xem thêm Next.js ở [trang chủ của nó](https://nextjs.org/learn/).

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) cách tốt nhất để tạo **trang web tĩnh** bằng React. Nó cho phép bạn sử dụng React components, nhưng kết quả sẽ được tạo sẵn dưới dạng HTML và CSS để đảm bảo thời gian tải nhanh nhất.

Xem thêm Gatsby ở [trang chủ của nó](https://www.gatsbyjs.org/docs/) và [thư viện để bắt đầu](https://www.gatsbyjs.org/docs/gatsby-starters/).

### Các loại công cụ linh hoạt {#more-flexible-toolchains}

Các công cụ sau cung cấp nhiều sự lựa chọn và linh hoạt hơn. Chúng tôi giới thiệu chúng cho những người dùng có kinh nghiệm hơn:

- **[Neutrino](https://neutrinojs.org/)** kết hợp sức mạnh của [webpack](https://webpack.js.org/) với sự đơn giản của các cài đặt sẵn có, và bao gồm một cài đặt có sẵn cho [ứng dụng React](https://neutrinojs.org/packages/react/) và [React components](https://neutrinojs.org/packages/react-components/).

- **[Nx](https://nx.dev/react)** là một công cụ cho phát triển full-stack monorepo, đã tích hợp sẵn để hỗ trợ React, Next.js, [Express](https://expressjs.com/), và nhiều thứ khác.

- **[Parcel](https://parceljs.org/)** là một gói ứng dụng web nhanh, không cần cấu hình và [hoạt động với React](https://parceljs.org/recipes.html#react).

- **[Razzle](https://github.com/jaredpalmer/razzle)** là một framework hỗ trợ server-rendering không cần cấu hình, nhưng cung cấp sự linh hoạt hơn Next.js.

## Tạo mới chuỗi công cụ từ đầu {#creating-a-toolchain-from-scratch}

Chuỗi công cụ xây dựng JavaScript thường bao gồm: 

* Một **package manager**, ví dụ [Yarn](https://yarnpkg.com/) hoặc [npm](https://www.npmjs.com/). Nó cho phép bạn tận dụng hệ sinh thái rộng lớn của các gói bên thứ ba và dễ dàng cài đặt hoặc cập nhật chúng.

* Một **bundler**, ví dụ [webpack](https://webpack.js.org/) hoặc [Parcel](https://parceljs.org/). Nó cho phép bạn viết mã theo module và gói nó lại với nhau thành các gói nhỏ để tối ưu hóa thời gian tải.

* Một **compiler**, ví dụ [Babel](https://babeljs.io/). Nó cho phép bạn viết mã JavaScript hiện đại vẫn hoạt động trong các trình duyệt cũ hơn.

Nếu bạn muốn thiết lập chuỗi công cụ JavaScript của riêng mình từ đầu, [xem thử hướng dẫn](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) tái tạo lại một số chức năng của thư viện Create React App.

Đừng quên đảm bảo chuỗi công cụ của bận được [thiết đặt chính xác cho môi trường production](/docs/optimizing-performance.html#use-the-production-build).
