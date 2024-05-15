---
title: Bắt đầu một Dự án React mới
---

<Intro>

Nếu bạn muốn xây dựng một ứng dụng hoặc trang web mới hoàn toàn bằng React, chúng tôi khuyên bạn nên chọn một trong những framework được cộng đồng ưa chuộng dùng React.

</Intro>


Bạn có thể sử dụng React mà không cần framework, tuy nhiên chúng tôi đã thấy hầu hết các ứng dụng và trang web cuối cùng đều xây dựng các giải pháp cho những vấn đề phổ biến như code-splitting, routing, data fetching và tạo HTML. Những vấn đề này là phổ biến đối với tất cả các thư viện UI, không chỉ riêng React.

Bắt đầu với một framework, bạn có thể nhanh chóng bắt đầu với React và tránh việc cần phải xây dựng một framework riêng của mình sau này.

<DeepDive>

#### Liệu tôi có thể sử dụng React mà không cần một framework không? {/*can-i-use-react-without-a-framework*/}

Bạn hoàn toàn có thể sử dụng React mà không cần một framework - đó là cách bạn sẽ [sử dụng React cho một phần của trang của mình](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page). **Tuy nhiên, nếu bạn đang xây dựng một ứng dụng hoặc trang web mới hoàn toàn bằng React, chúng tôi khuyên bạn nên sử dụng một framework.**

Đây là lí do tại sao.

Dù bạn có không cần routing hoặc data fetching ban đầu, bạn có thể muốn thêm một số thư viện cho chúng sau này. Khi gói JavaScript của bạn mở rộng với mỗi tính năng mới, bạn có thể cần phải chia mã cho mỗi route một cách riêng biệt. Khi nhu cầu data fetching của bạn trở nên phức tạp hơn, bạn có thể gặp phải những đợt trì hoãn mạng giữa máy chủ và máy khách (server-client) làm cho ứng dụng của bạn trở nên rất chậm. Bên cạnh đó, khi đối tượng người dùng của bạn bao gồm nhiều người dùng có điều kiện mạng kém và thiết bị có cấu hình thấp, bạn có thể cần tạo ra mã HTML từ các thành phần của mình để hiển thị nội dung sớm hơn -- hoặc là ở trên máy chủ (server) hoặc là trong quá trình xây dựng (build). Thay đổi cấu hình để chạy một phần mã của bạn trên máy chủ hoặc trong quá trình xây dựng có thể rất phức tạp.

**Các vấn đề này không đặc trưng cho React. Đó là lý do tại sao Svelte có SvelteKit, Vue có Nuxt, và các ví dụ khác như vậy.** Để giải quyết những vấn đề này tự mình, bạn sẽ cần tích hợp trình bundler của mình với router và thư viện data fetching của bạn. Không khó để có một thiết lập ban đầu hoạt động, nhưng có rất nhiều chi tiết tinh tế liên quan đến việc tạo ra một ứng dụng mà tải nhanh ngay cả khi nó phát triển theo thời gian. Bạn sẽ muốn gửi xuống một lượng mã ứng dụng tối thiểu nhưng làm điều này trong một vòng chuyển dữ liệu đơn từ máy khách đến máy chủ, song song với bất kỳ dữ liệu nào cần cho trang. Bạn có thể muốn trang của mình có thể tương tác trước khi mã JavaScript của bạn chạy, để hỗ trợ tính nâng cấp dần dần. Bạn có thể muốn tạo ra một thư mục chứa các file HTML tĩnh hoàn chỉnh cho các trang marketing của mình có thể được đặt ở bất kỳ đâu và vẫn hoạt động khi JavaScript bị tắt. Xây dựng những khả năng này tự mình đòi hỏi sự nỗ lực thực sự.

**Các framework React trên trang này giải quyết các vấn đề như vậy mặc định, mà không cần bất kỳ công việc thêm nào từ phía bạn.** Chúng cho phép bạn bắt đầu một cách nhẹ nhàng và sau đó mở rộng ứng dụng của bạn theo nhu cầu của bạn. Mỗi framework React có một cộng đồng riêng, vì vậy việc tìm kiếm câu trả lời cho các câu hỏi và nâng cấp công cụ là dễ dàng hơn. Các framework cũng mang lại cấu trúc cho code của bạn, giúp bạn và người khác giữ lại ngữ cảnh và kỹ năng giữa các dự án khác nhau. Ngược lại, với một cài đặt tùy chỉnh, việc bị kẹt lại trên các phiên bản phụ thuộc không được hỗ trợ là dễ dàng, và thực tế bạn sẽ cuối cùng tạo ra một framework của riêng mình - tuy nhiên không có cộng đồng hoặc con đường nâng cấp (và nếu nó giống như những cái chúng tôi đã tạo trong quá khứ, nó được thiết kế một cách lung tung hơn).

Nếu ứng dụng của bạn có các ràng buộc không thông thường không được đáp ứng tốt bởi các framework này, hoặc bạn muốn tự giải quyết những vấn đề này, bạn có thể tự tạo một cài đặt tùy chỉnh của riêng mình với React. Lấy `react` và `react-dom` từ npm, thiết lập quá trình xây dựng tùy chỉnh của bạn với một công cụ bundler như [Vite](https://vitejs.dev/) hoặc [Parcel](https://parceljs.org/), và thêm các công cụ khác khi bạn cần chúng cho routing, tạo ra các trang tĩnh hoặc render trên máy chủ, và nhiều hơn thế nữa.

</DeepDive>

## Các framework React phù hợp cho môi trường production. {/*production-grade-react-frameworks*/}

Các framework React hỗ trợ tất cả các tính năng bạn cần để triển khai và mở rộng ứng dụng của bạn trong môi trường production và đang làm việc để hỗ trợ [tầm nhìn kiến trúc full-stack](#which-features-make-up-the-react-teams-full-stack-architecture-vision) của nhóm React. Tất cả các framework mà chúng tôi đề xuất đều là mã nguồn mở với cộng đồng hoạt động để hỗ trợ, và có thể triển khai trên máy chủ của bạn hoặc một nhà cung cấp hosting. Nếu bạn là tác giả framework quan tâm đến việc được bao gồm trong danh sách này, [hãy cho chúng tôi biết](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+).

### Next.js {/*nextjs-pages-router*/}

**[Trình định tuyến (Router) trang của Next.js](https://nextjs.org/) là một full-stack React framework.** Nó linh hoạt và cho phép bạn tạo các ứng dụng React của mọi kích thước -- từ một blog tĩnh chủ yếu đến một ứng dụng động phức tạp. Để tạo một dự án Next.js mới, hãy chạy trong terminal của bạn:

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Nếu bạn mới làm quen với Next.js, hãy xem hướng dẫn này [khóa học Next.js.](https://nextjs.org/learn)

Next.js được duy trì bởi [Vercel](https://vercel.com/). Bạn có thể [triển khai một ứng dụng Next.js](https://nextjs.org/docs/app/building-your-application/deploying) lên bất kỳ hosting Node.js hoặc serverless nào, hoặc lên máy chủ của riêng bạn. Next.js cũng hỗ trợ [static export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) mà không yêu cầu một máy chủ.

### Remix {/*remix*/}

**[Remix](https://remix.run/) là một full-stack React framework với định tuyến (routing) lòng ghép nhau.** Đó cho phép bạn chia ứng dụng của mình thành các phần lồng nhau có thể tải dữ liệu song song và làm mới phản hồi các hành động của người dùng. Để tạo một dự án Remix mới, chạy lệnh:

<TerminalBlock>
npx create-remix
</TerminalBlock>

Nếu bạn mới làm quen với Remix, xem hướng dẫn Remix tại [blog hướng dẫn](https://remix.run/docs/en/main/tutorials/blog) (ngắn) và [hướng dẫn app](https://remix.run/docs/en/main/tutorials/jokes) (dài).

Remix được duy trì bởi [Shopify](https://www.shopify.com/). Khi bạn tạo một dự án Remix, bạn cần chọn [mục tiêu triển khai](https://remix.run/docs/en/main/guides/deployment). Bạn có thể triển khai một ứng dụng Remix lên bất kỳ hosting Node.js hoặc serverless nào bằng cách sử dụng hoặc viết một [adapter](https://remix.run/docs/en/main/other-api/adapter)..

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) là một framework React cho các trang web được hỗ trợ bởi CMS chạy nhanh.** Hệ sinh thái plugin phong phú và lớp dữ liệu GraphQL của nó giúp đơn giản hóa việc tích hợp nội dung, API và dịch vụ vào một trang web. Để tạo một dự án Gatsby mới, chạy lệnh:

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

Nếu bạn mới làm quen với Gatsby, xem tại đây [Tài liệu hướng dẫn Gatsby.](https://www.gatsbyjs.com/docs/tutorial/)

Gatsby được duy trì bởi [Netlify](https://www.netlify.com/). Bạn có thể [triển khai một trang Gatsby hoàn toàn tĩnh](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) lên bất kỳ hosting tĩnh nào. Nếu bạn chọn sử dụng các tính năng chỉ chạy trên máy chủ, hãy đảm bảo rằng nhà cung cấp hosting của bạn hỗ trợ chúng cho Gatsby.

### Expo (dành cho ứng dụng di động) {/*expo*/}

**[Expo](https://expo.dev/) là một framework React cho phép bạn tạo ứng dụng Android, iOS và web đa nền tảng với giao diện người dùng thực sự native.** Nó cung cấp một SDK cho [React Native](https://reactnative.dev/) để việc sử dụng các phần native trở nên dễ dàng hơn. Để tạo một dự án Expo mới, chạy lệnh:

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

Nếu bạn mới làm quen với Expo, xem tại đây [Tài liệu hướng dẫn Expo](https://docs.expo.dev/tutorial/introduction/).

Expo được duy trì bởi [Expo (the company)](https://expo.dev/about). Xây dựng ứng dụng với Expo là miễn phí, và bạn có thể submit chúng lên cửa hàng ứng dụng Google và Apple mà không có hạn chế. Ngoài ra, Expo cung cấp các dịch vụ đám mây có phí mà bạn có thể chọn sử dụng.

## Những framework React tiên tiến nhất {/*bleeding-edge-react-frameworks*/}

Khi chúng tôi đã khám phá cách tiếp tục cải thiện React, chúng tôi nhận ra rằng việc tích hợp React gần hơn với các framework (cụ thể là với routing, bundling và các công nghệ máy chủ) là cơ hội lớn nhất của chúng tôi để giúp người dùng React xây dựng ứng dụng tốt hơn. Nhóm Next.js đã đồng ý hợp tác với chúng tôi trong việc nghiên cứu, phát triển, tích hợp và kiểm thử các tính năng tiên tiến của React không phụ thuộc vào framework như [React Server Components.](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).

Các tính năng này đang ngày càng gần hơn với việc sẵn sàng cho sản xuất mỗi ngày, và chúng tôi đã thảo luận với các nhà phát triển bundler và framework khác về việc tích hợp chúng. Hi vọng của chúng tôi là trong một hoặc hai năm tới, tất cả các framework được liệt kê trên trang này sẽ có sự hỗ trợ đầy đủ cho những tính năng này. (Nếu bạn là tác giả framework quan tâm đến việc hợp tác với chúng tôi để thử nghiệm những tính năng này, hãy cho chúng tôi biết!)

### Next.js (App Router) {/*nextjs-app-router*/}

**[Bộ định tuyến (Router) Ứng dụng của Next.js](https://nextjs.org/docs) là một thiết kế lại các API của Next.js nhằm mục tiêu thực hiện tầm nhìn kiến trúc full-stack của nhóm React.** Nó cho phép bạn tải dữ liệu trong các component bất đồng bộ chạy trên máy chủ hoặc thậm chí trong quá trình build.

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/app/building-your-application/deploying) to any Node.js or serverless hosting, or to your own server. Next.js also supports [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) which doesn't require a server.
Next.js được duy trì bởi [Vercel](https://vercel.com/). Bạn có thể [triển khai một ứng dụng Next.js](https://nextjs.org/docs/app/building-your-application/deploying) lên bất kỳ hosting Node.js hoặc serverless nào, hoặc trên máy chủ của riêng bạn. Next.js cũng hỗ trợ [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) mà không cần một máy chủ.

<DeepDive>

#### Tầm nhìn kiến trúc full-stack của nhóm React bao gồm các tính năng gì? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Bundler của Next.js's App Router triển khai hoàn toàn đặc điểm chính thức của [React Server Components specification](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). Điều này cho phép bạn kết hợp các thành phần tại thời gian build, chỉ chạy trên máy chủ, và tương tác các component trong một cây React duy nhất.

Ví dụ, bạn có thể viết một component React chỉ chạy trên máy chủ như một hàm `async` đọc dữ liệu từ cơ sở dữ liệu hoặc từ một tập tin. Sau đó, bạn có thể truyền dữ liệu từ nó xuống các component tương tác của mình:

```js
// Component này *chỉ* chạy trên máy chủ (hoặc trong quá trình build).
async function Talks({ confId }) {
  // 1. Bạn đang ở trên máy chủ (server), vì vậy bạn có thể tương tác đến lớp dữ liệu (data). Không cần API endpoint.
  const talks = await db.Talks.findAll({ confId });

  // 2. Thêm bất kỳ lượng logic render nào bạn muốn. Điều này sẽ không làm cho gói (bundler) JavaScript của bạn trở nên lớn hơn.
  const videos = talks.map(talk => talk.video);

  // 3. Truyền dữ liệu xuống component cái mà sẽ chạy ở trình duyệt.
  return <SearchableVideoList videos={videos} />;
}
```

Bộ định tuyến Ứng dụng của Next.js cũng tích hợp [data fetching với Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Điều này cho phép bạn xác định trạng thái tải (như một nơi chứa tạm thời) cho các phần khác nhau của giao diện người dùng trực tiếp trong cây React của bạn:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Bạn đúng rằng Server Components và Suspense là tính năng của React chứ không phải của Next.js. Tuy nhiên, việc áp dụng chúng ở mức độ framework yêu cầu sự ủng hộ và công việc triển khai không đơn giản. Hiện tại, Next.js App Router là bản triển khai hoàn chỉnh nhất. Nhóm React đang làm việc cùng các nhà phát triển bundler để làm cho việc triển khai những tính năng này dễ dàng hơn trong thế hệ framework tiếp theo.

</DeepDive>
