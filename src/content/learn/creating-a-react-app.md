---
title: Tạo một ứng dụng React
---

<Intro>

Nếu bạn muốn xây dựng một ứng dụng hoặc trang web mới bằng React, chúng tôi khuyên bạn nên bắt đầu với một framework.

</Intro>

Nếu ứng dụng của bạn có những hạn chế mà các framework hiện có không đáp ứng được, bạn muốn tự xây dựng framework của riêng mình hoặc bạn chỉ muốn tìm hiểu những điều cơ bản của một ứng dụng React, bạn có thể [xây dựng một ứng dụng React từ đầu](/learn/build-a-react-app-from-scratch).

## Các framework full-stack {/*full-stack-frameworks*/}

Các framework được đề xuất này hỗ trợ tất cả các tính năng bạn cần để triển khai và mở rộng ứng dụng của mình trong môi trường production. Chúng đã tích hợp các tính năng React mới nhất và tận dụng kiến trúc của React.

<Note>

#### Các framework full-stack không yêu cầu máy chủ. {/*react-frameworks-do-not-require-a-server*/}

Tất cả các framework trên trang này đều hỗ trợ hiển thị phía máy khách ([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR)), ứng dụng một trang ([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)) và tạo trang web tĩnh ([SSG](https://developer.mozilla.org/en-US/docs/Glossary/SSG)). Các ứng dụng này có thể được triển khai lên [CDN](https://developer.mozilla.org/en-US/docs/Glossary/CDN) hoặc dịch vụ lưu trữ tĩnh mà không cần máy chủ. Ngoài ra, các framework này cho phép bạn thêm hiển thị phía máy chủ trên cơ sở từng route, khi nó có ý nghĩa đối với trường hợp sử dụng của bạn.

Điều này cho phép bạn bắt đầu với một ứng dụng chỉ dành cho máy khách và nếu nhu cầu của bạn thay đổi sau này, bạn có thể chọn sử dụng các tính năng của máy chủ trên các route riêng lẻ mà không cần viết lại ứng dụng của mình. Xem tài liệu của framework của bạn để biết cách định cấu hình chiến lược hiển thị.

</Note>

### Next.js (App Router) {/*nextjs-app-router*/}

**[App Router của Next.js](https://nextjs.org/docs) là một framework React tận dụng tối đa kiến trúc của React để cho phép các ứng dụng React full-stack.**

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.js được duy trì bởi [Vercel](https://vercel.com/). Bạn có thể [triển khai một ứng dụng Next.js](https://nextjs.org/docs/app/building-your-application/deploying) tới bất kỳ nhà cung cấp dịch vụ lưu trữ nào hỗ trợ Node.js hoặc Docker container, hoặc tới máy chủ của riêng bạn. Next.js cũng hỗ trợ [xuất tĩnh](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) mà không yêu cầu máy chủ.

### React Router (v7) {/*react-router-v7*/}

**[React Router](https://reactrouter.com/start/framework/installation) là thư viện định tuyến phổ biến nhất cho React và có thể được ghép nối với Vite để tạo ra một framework React full-stack**. Nó nhấn mạnh các API Web tiêu chuẩn và có một số [mẫu sẵn sàng để triển khai](https://github.com/remix-run/react-router-templates) cho các runtime và nền tảng JavaScript khác nhau.

Để tạo một dự án framework React Router mới, hãy chạy:

<TerminalBlock>
npx create-react-router@latest
</TerminalBlock>

React Router được duy trì bởi [Shopify](https://www.shopify.com).

### Expo (cho ứng dụng native) {/*expo*/}

**[Expo](https://expo.dev/) là một framework React cho phép bạn tạo các ứng dụng Android, iOS và web đa năng với giao diện người dùng native thực sự.** Nó cung cấp một SDK cho [React Native](https://reactnative.dev/) giúp các phần native dễ sử dụng hơn. Để tạo một dự án Expo mới, hãy chạy:

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

Nếu bạn mới làm quen với Expo, hãy xem [hướng dẫn Expo](https://docs.expo.dev/tutorial/introduction/).

Expo được duy trì bởi [Expo (công ty)](https://expo.dev/about). Xây dựng ứng dụng với Expo là miễn phí và bạn có thể gửi chúng lên các cửa hàng ứng dụng của Google và Apple mà không bị hạn chế. Expo cũng cung cấp các dịch vụ đám mây trả phí tùy chọn.

## Các framework khác {/*other-frameworks*/}

Có những framework mới nổi khác đang hướng tới tầm nhìn React full stack của chúng tôi:

- [TanStack Start (Beta)](https://tanstack.com/): TanStack Start là một framework React full-stack được cung cấp bởi TanStack Router. Nó cung cấp SSR toàn bộ tài liệu, streaming, các hàm server, bundling và hơn thế nữa bằng cách sử dụng các công cụ như Nitro và Vite.
- [RedwoodJS](https://redwoodjs.com/): Redwood là một framework React full stack với rất nhiều gói và cấu hình được cài đặt sẵn, giúp bạn dễ dàng xây dựng các ứng dụng web full-stack.

<DeepDive>

#### Những tính năng nào tạo nên tầm nhìn kiến trúc full-stack của nhóm React? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Trình đóng gói App Router của Next.js triển khai đầy đủ [đặc tả React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) chính thức. Điều này cho phép bạn kết hợp các thành phần build-time, chỉ dành cho server và tương tác trong một cây React duy nhất.

Ví dụ: bạn có thể viết một thành phần React chỉ dành cho server dưới dạng một hàm `async` đọc từ cơ sở dữ liệu hoặc từ một tệp. Sau đó, bạn có thể truyền dữ liệu từ đó xuống các thành phần tương tác của mình:

```js
// Thành phần này chỉ chạy trên server (hoặc trong quá trình build).
async function Talks({ confId }) {
  // 1. Bạn đang ở trên server, vì vậy bạn có thể nói chuyện với lớp dữ liệu của mình. Không yêu cầu API endpoint.
  const talks = await db.Talks.findAll({ confId });

  // 2. Thêm bất kỳ lượng logic hiển thị nào. Nó sẽ không làm cho bundle JavaScript của bạn lớn hơn.
  const videos = talks.map(talk => talk.video);

  // 3. Truyền dữ liệu xuống các thành phần sẽ chạy trong trình duyệt.
  return <SearchableVideoList videos={videos} />;
}
```

App Router của Next.js cũng tích hợp [tìm nạp dữ liệu với Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Điều này cho phép bạn chỉ định trạng thái tải (như một trình giữ chỗ skeleton) cho các phần khác nhau của giao diện người dùng của bạn trực tiếp trong cây React của bạn:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components và Suspense là các tính năng của React chứ không phải là các tính năng của Next.js. Tuy nhiên, việc áp dụng chúng ở cấp framework đòi hỏi sự chấp thuận và công việc triển khai không hề nhỏ. Hiện tại, Next.js App Router là triển khai hoàn chỉnh nhất. Nhóm React đang làm việc với các nhà phát triển trình đóng gói để giúp các tính năng này dễ triển khai hơn trong thế hệ framework tiếp theo.

</DeepDive>

## Bắt đầu từ đầu {/*start-from-scratch*/}

Nếu ứng dụng của bạn có những hạn chế mà các framework hiện có không đáp ứng được, bạn muốn tự xây dựng framework của riêng mình hoặc bạn chỉ muốn tìm hiểu những điều cơ bản của một ứng dụng React, thì có các tùy chọn khác để bắt đầu một dự án React từ đầu.

Bắt đầu từ đầu cho bạn sự linh hoạt hơn, nhưng đòi hỏi bạn phải đưa ra lựa chọn về công cụ nào sẽ sử dụng cho định tuyến, tìm nạp dữ liệu và các mẫu sử dụng phổ biến khác. Nó giống như việc xây dựng framework của riêng bạn hơn là sử dụng một framework đã tồn tại. Các [framework mà chúng tôi khuyên dùng](#full-stack-frameworks) có các giải pháp tích hợp cho những vấn đề này.

Nếu bạn muốn xây dựng các giải pháp của riêng mình, hãy xem hướng dẫn của chúng tôi về [xây dựng một ứng dụng React từ đầu](/learn/build-a-react-app-from-scratch) để biết hướng dẫn về cách thiết lập một dự án React mới bắt đầu với một công cụ build như [Vite](https://vite.dev/), [Parcel](https://parceljs.org/) hoặc [RSbuild](https://rsbuild.dev/).

-----

_Nếu bạn là tác giả của một framework và muốn được đưa vào trang này, [vui lòng cho chúng tôi biết](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)._
