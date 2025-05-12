---
title: Xây dựng một ứng dụng React từ đầu
---

<Intro>

Nếu ứng dụng của bạn có những ràng buộc mà các framework hiện có không đáp ứng được, bạn thích tự xây dựng framework của riêng mình hoặc bạn chỉ muốn tìm hiểu những điều cơ bản của một ứng dụng React, bạn có thể xây dựng một ứng dụng React từ đầu.

</Intro>

<DeepDive>

#### Cân nhắc sử dụng một framework {/*consider-using-a-framework*/}

Bắt đầu từ đầu là một cách dễ dàng để bắt đầu sử dụng React, nhưng một nhược điểm lớn cần lưu ý là đi theo con đường này thường giống như xây dựng framework adhoc của riêng bạn. Khi các yêu cầu của bạn phát triển, bạn có thể cần giải quyết nhiều vấn đề giống như framework mà các framework được đề xuất của chúng tôi đã có các giải pháp được phát triển và hỗ trợ tốt.

Ví dụ: nếu trong tương lai ứng dụng của bạn cần hỗ trợ hiển thị phía máy chủ (SSR), tạo trang web tĩnh (SSG) và/hoặc React Server Components (RSC), bạn sẽ phải tự triển khai chúng. Tương tự, các tính năng React trong tương lai yêu cầu tích hợp ở cấp framework sẽ phải được triển khai bởi bạn nếu bạn muốn sử dụng chúng.

Các framework được đề xuất của chúng tôi cũng giúp bạn xây dựng các ứng dụng hoạt động tốt hơn. Ví dụ: giảm hoặc loại bỏ các thác nước từ các yêu cầu mạng giúp cải thiện trải nghiệm người dùng. Điều này có thể không phải là ưu tiên hàng đầu khi bạn đang xây dựng một dự án đồ chơi, nhưng nếu ứng dụng của bạn có được người dùng, bạn có thể muốn cải thiện hiệu suất của nó.

Đi theo con đường này cũng gây khó khăn hơn trong việc nhận được hỗ trợ, vì cách bạn phát triển định tuyến, tìm nạp dữ liệu và các tính năng khác sẽ là duy nhất cho tình huống của bạn. Bạn chỉ nên chọn tùy chọn này nếu bạn cảm thấy thoải mái khi tự mình giải quyết những vấn đề này hoặc nếu bạn tự tin rằng bạn sẽ không bao giờ cần những tính năng này.

Để có danh sách các framework được đề xuất, hãy xem [Tạo một ứng dụng React](/learn/creating-a-react-app).

</DeepDive>

## Bước 1: Cài đặt một công cụ xây dựng {/*step-1-install-a-build-tool*/}

Bước đầu tiên là cài đặt một công cụ xây dựng như `vite`, `parcel` hoặc `rsbuild`. Các công cụ xây dựng này cung cấp các tính năng để đóng gói và chạy mã nguồn, cung cấp một máy chủ phát triển để phát triển cục bộ và một lệnh xây dựng để triển khai ứng dụng của bạn lên một máy chủ sản xuất.

### Vite {/*vite*/}

[Vite](https://vite.dev/) là một công cụ xây dựng nhằm mục đích cung cấp trải nghiệm phát triển nhanh hơn và tinh gọn hơn cho các dự án web hiện đại.

<TerminalBlock>
{`npm create vite@latest my-app -- --template react`}
</TerminalBlock>

Vite có ý kiến riêng và đi kèm với các mặc định hợp lý ngay lập tức. Vite có một hệ sinh thái plugin phong phú để hỗ trợ làm mới nhanh, JSX, Babel/SWC và các tính năng phổ biến khác. Xem [plugin React](https://vite.dev/plugins/#vitejs-plugin-react) hoặc [plugin React SWC](https://vite.dev/plugins/#vitejs-plugin-react-swc) và [dự án ví dụ React SSR](https://vite.dev/guide/ssr.html#example-projects) của Vite để bắt đầu.

Vite đã được sử dụng làm công cụ xây dựng trong một trong các [framework được đề xuất](/learn/creating-a-react-app) của chúng tôi: [React Router](https://reactrouter.com/start/framework/installation).

### Parcel {/*parcel*/}

[Parcel](https://parceljs.org/) kết hợp trải nghiệm phát triển tuyệt vời ngay lập tức với một kiến trúc có thể mở rộng, có thể đưa dự án của bạn từ việc chỉ mới bắt đầu đến các ứng dụng sản xuất lớn.

<TerminalBlock>
{`npm install --save-dev parcel`}
</TerminalBlock>

Parcel hỗ trợ làm mới nhanh, JSX, TypeScript, Flow và tạo kiểu ngay lập tức. Xem [công thức React của Parcel](https://parceljs.org/recipes/react/#getting-started) để bắt đầu.

### Rsbuild {/*rsbuild*/}

[Rsbuild](https://rsbuild.dev/) là một công cụ xây dựng được hỗ trợ bởi Rspack, cung cấp trải nghiệm phát triển liền mạch cho các ứng dụng React. Nó đi kèm với các mặc định được điều chỉnh cẩn thận và các tối ưu hóa hiệu suất sẵn sàng để sử dụng.

<TerminalBlock>
{`npx create-rsbuild --template react`}
</TerminalBlock>

Rsbuild bao gồm hỗ trợ tích hợp cho các tính năng React như làm mới nhanh, JSX, TypeScript và tạo kiểu. Xem [hướng dẫn React của Rsbuild](https://rsbuild.dev/guide/framework/react) để bắt đầu.

<Note>

#### Metro cho React Native {/*react-native*/}

Nếu bạn bắt đầu từ đầu với React Native, bạn sẽ cần sử dụng [Metro](https://metrobundler.dev/), trình đóng gói JavaScript cho React Native. Metro hỗ trợ đóng gói cho các nền tảng như iOS và Android, nhưng thiếu nhiều tính năng so với các công cụ ở đây. Chúng tôi khuyên bạn nên bắt đầu với Vite, Parcel hoặc Rsbuild trừ khi dự án của bạn yêu cầu hỗ trợ React Native.

</Note>

## Bước 2: Xây dựng các mẫu ứng dụng phổ biến {/*step-2-build-common-application-patterns*/}

Các công cụ xây dựng được liệt kê ở trên bắt đầu với một ứng dụng một trang (SPA) chỉ dành cho máy khách, nhưng không bao gồm bất kỳ giải pháp nào khác cho các chức năng phổ biến như định tuyến, tìm nạp dữ liệu hoặc tạo kiểu.

Hệ sinh thái React bao gồm nhiều công cụ cho những vấn đề này. Chúng tôi đã liệt kê một vài công cụ được sử dụng rộng rãi làm điểm khởi đầu, nhưng bạn có thể tự do chọn các công cụ khác nếu chúng phù hợp hơn với bạn.

### Định tuyến {/*routing*/}

Định tuyến xác định nội dung hoặc trang nào sẽ hiển thị khi người dùng truy cập một URL cụ thể. Bạn cần thiết lập một bộ định tuyến để ánh xạ các URL đến các phần khác nhau của ứng dụng của bạn. Bạn cũng sẽ cần xử lý các tuyến lồng nhau, các tham số tuyến và các tham số truy vấn. Bộ định tuyến có thể được định cấu hình trong mã của bạn hoặc được xác định dựa trên cấu trúc thư mục và tệp thành phần của bạn.

Bộ định tuyến là một phần cốt lõi của các ứng dụng hiện đại và thường được tích hợp với tìm nạp dữ liệu (bao gồm tìm nạp trước dữ liệu cho toàn bộ trang để tải nhanh hơn), phân chia mã (để giảm thiểu kích thước gói máy khách) và các phương pháp hiển thị trang (để quyết định cách tạo từng trang).

Chúng tôi khuyên bạn nên sử dụng:

- [React Router](https://reactrouter.com/start/data/custom)
- [Tanstack Router](https://tanstack.com/router/latest)

### Tìm nạp dữ liệu {/*data-fetching*/}

Tìm nạp dữ liệu từ máy chủ hoặc nguồn dữ liệu khác là một phần quan trọng của hầu hết các ứng dụng. Thực hiện việc này đúng cách đòi hỏi phải xử lý các trạng thái tải, trạng thái lỗi và lưu vào bộ nhớ cache dữ liệu đã tìm nạp, điều này có thể phức tạp.

Các thư viện tìm nạp dữ liệu chuyên dụng thực hiện công việc khó khăn là tìm nạp và lưu vào bộ nhớ cache dữ liệu cho bạn, cho phép bạn tập trung vào dữ liệu mà ứng dụng của bạn cần và cách hiển thị nó. Các thư viện này thường được sử dụng trực tiếp trong các thành phần của bạn, nhưng cũng có thể được tích hợp vào bộ tải định tuyến để tìm nạp trước nhanh hơn và hiệu suất tốt hơn, cũng như trong hiển thị phía máy chủ.

Lưu ý rằng việc tìm nạp dữ liệu trực tiếp trong các thành phần có thể dẫn đến thời gian tải chậm hơn do thác nước yêu cầu mạng, vì vậy chúng tôi khuyên bạn nên tìm nạp trước dữ liệu trong bộ tải định tuyến hoặc trên máy chủ càng nhiều càng tốt! Điều này cho phép dữ liệu của một trang được tìm nạp tất cả cùng một lúc khi trang đang được hiển thị.

Nếu bạn đang tìm nạp dữ liệu từ hầu hết các backend hoặc API kiểu REST, chúng tôi khuyên bạn nên sử dụng:

- [React Query](https://react-query.tanstack.com/)
- [SWR](https://swr.vercel.app/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

Nếu bạn đang tìm nạp dữ liệu từ API GraphQL, chúng tôi khuyên bạn nên sử dụng:

- [Apollo](https://www.apollographql.com/docs/react)
- [Relay](https://relay.dev/)

### Phân chia mã {/*code-splitting*/}

Phân chia mã là quá trình chia ứng dụng của bạn thành các gói nhỏ hơn có thể được tải theo yêu cầu. Kích thước mã của một ứng dụng tăng lên với mỗi tính năng mới và phụ thuộc bổ sung. Các ứng dụng có thể trở nên chậm tải vì tất cả mã cho toàn bộ ứng dụng cần được gửi trước khi nó có thể được sử dụng. Lưu vào bộ nhớ cache, giảm các tính năng/phụ thuộc và di chuyển một số mã để chạy trên máy chủ có thể giúp giảm tải chậm nhưng là các giải pháp không đầy đủ có thể hy sinh chức năng nếu lạm dụng.

Tương tự, nếu bạn dựa vào các ứng dụng sử dụng framework của bạn để phân chia mã, bạn có thể gặp phải các tình huống mà việc tải trở nên chậm hơn so với khi không có phân chia mã nào xảy ra. Ví dụ: [tải một cách lười biếng](/reference/react/lazy) một biểu đồ sẽ trì hoãn việc gửi mã cần thiết để hiển thị biểu đồ, tách mã biểu đồ khỏi phần còn lại của ứng dụng. [Parcel hỗ trợ phân chia mã với React.lazy](https://parceljs.org/recipes/react/#code-splitting). Tuy nhiên, nếu biểu đồ tải dữ liệu của nó *sau khi* nó đã được hiển thị ban đầu, bạn sẽ phải đợi hai lần. Đây là một thác nước: thay vì tìm nạp dữ liệu cho biểu đồ và gửi mã để hiển thị nó đồng thời, bạn phải đợi từng bước hoàn thành lần lượt.

Việc phân chia mã theo tuyến, khi được tích hợp với đóng gói và tìm nạp dữ liệu, có thể giảm thời gian tải ban đầu của ứng dụng của bạn và thời gian cần thiết để hiển thị nội dung hiển thị lớn nhất của ứng dụng ([Largest Contentful Paint](https://web.dev/articles/lcp)).

Để biết hướng dẫn phân chia mã, hãy xem tài liệu công cụ xây dựng của bạn:
- [Tối ưu hóa bản dựng Vite](https://v3.vitejs.dev/guide/features.html#build-optimizations)
- [Phân chia mã Parcel](https://parceljs.org/features/code-splitting/)
- [Phân chia mã Rsbuild](https://rsbuild.dev/guide/optimization/code-splitting)

### Cải thiện hiệu suất ứng dụng {/*improving-application-performance*/}

Vì công cụ xây dựng bạn chọn chỉ hỗ trợ các ứng dụng một trang (SPA), bạn sẽ cần triển khai các [mẫu hiển thị](https://www.patterns.dev/vanilla/rendering-patterns) khác như hiển thị phía máy chủ (SSR), tạo trang web tĩnh (SSG) và/hoặc React Server Components (RSC). Ngay cả khi bạn không cần những tính năng này ngay từ đầu, trong tương lai có thể có một số tuyến sẽ được hưởng lợi từ SSR, SSG hoặc RSC.

* **Ứng dụng một trang (SPA)** tải một trang HTML duy nhất và cập nhật trang một cách động khi người dùng tương tác với ứng dụng. SPA dễ bắt đầu hơn, nhưng chúng có thể có thời gian tải ban đầu chậm hơn. SPA là kiến trúc mặc định cho hầu hết các công cụ xây dựng.

* **Hiển thị phía máy chủ (SSR)** hiển thị một trang trên máy chủ và gửi trang được hiển thị đầy đủ đến máy khách. SSR có thể cải thiện hiệu suất, nhưng nó có thể phức tạp hơn để thiết lập và duy trì so với một ứng dụng một trang. Với việc bổ sung tính năng phát trực tuyến, SSR có thể rất phức tạp để thiết lập và duy trì. Xem [hướng dẫn SSR của Vite](https://vite.dev/guide/ssr).

* **Tạo trang web tĩnh (SSG)** tạo các tệp HTML tĩnh cho ứng dụng của bạn tại thời điểm xây dựng. SSG có thể cải thiện hiệu suất, nhưng nó có thể phức tạp hơn để thiết lập và duy trì so với hiển thị phía máy chủ. Xem [hướng dẫn SSG của Vite](https://vite.dev/guide/ssr.html#pre-rendering-ssg).

* **React Server Components (RSC)** cho phép bạn kết hợp các thành phần chỉ dành cho máy chủ, thời gian xây dựng và tương tác trong một cây React duy nhất. RSC có thể cải thiện hiệu suất, nhưng hiện tại nó đòi hỏi chuyên môn sâu để thiết lập và duy trì. Xem [ví dụ RSC của Parcel](https://github.com/parcel-bundler/rsc-examples).

Các chiến lược hiển thị của bạn cần tích hợp với bộ định tuyến của bạn để các ứng dụng được xây dựng bằng framework của bạn có thể chọn chiến lược hiển thị trên cơ sở mỗi tuyến. Điều này sẽ cho phép các chiến lược hiển thị khác nhau mà không cần phải viết lại toàn bộ ứng dụng của bạn. Ví dụ: trang đích cho ứng dụng của bạn có thể được hưởng lợi từ việc được tạo tĩnh (SSG), trong khi một trang có nguồn cấp nội dung có thể hoạt động tốt nhất với hiển thị phía máy chủ.

Sử dụng đúng chiến lược hiển thị cho đúng tuyến có thể giảm thời gian cần thiết để tải byte nội dung đầu tiên ([Time to First Byte](https://web.dev/articles/ttfb)), phần nội dung đầu tiên được hiển thị ([First Contentful Paint](https://web.dev/articles/fcp)) và nội dung hiển thị lớn nhất của ứng dụng được hiển thị ([Largest Contentful Paint](https://web.dev/articles/lcp)).

### Và hơn thế nữa... {/*and-more*/}

Đây chỉ là một vài ví dụ về các tính năng mà một ứng dụng mới sẽ cần xem xét khi xây dựng từ đầu. Nhiều hạn chế bạn sẽ gặp phải có thể khó giải quyết vì mỗi vấn đề được kết nối với những vấn đề khác và có thể yêu cầu chuyên môn sâu trong các lĩnh vực vấn đề mà bạn có thể không quen thuộc.

Nếu bạn không muốn tự mình giải quyết những vấn đề này, bạn có thể [bắt đầu với một framework](/learn/creating-a-react-app) cung cấp các tính năng này ngay lập tức.
