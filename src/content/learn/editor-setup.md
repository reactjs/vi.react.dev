---
title: Thiết Lập Editor
---

<Intro>

Một trình soạn thảo (editor) được cấu hình đúng cách có thể giúp code dễ đọc và viết nhanh hơn. Nó thậm chí có thể giúp bạn bắt lỗi ngay khi bạn viết! Nếu đây là lần đầu tiên bạn thiết lập một trình soạn thảo hoặc bạn đang muốn tinh chỉnh trình soạn thảo hiện tại của mình, chúng tôi có một vài đề xuất.

</Intro>

<YouWillLearn>

* Các trình soạn thảo phổ biến nhất là gì
* Cách tự động định dạng code của bạn

</YouWillLearn>

## Trình soạn thảo của bạn {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) là một trong những trình soạn thảo phổ biến nhất hiện nay. Nó có một marketplace lớn các extension và tích hợp tốt với các dịch vụ phổ biến như GitHub. Hầu hết các tính năng được liệt kê bên dưới cũng có thể được thêm vào VS Code dưới dạng extension, làm cho nó có khả năng tùy biến cao!

Các trình soạn thảo văn bản phổ biến khác được sử dụng trong cộng đồng React bao gồm:

* [WebStorm](https://www.jetbrains.com/webstorm/) là một môi trường phát triển tích hợp được thiết kế đặc biệt cho JavaScript.
* [Sublime Text](https://www.sublimetext.com/) có hỗ trợ JSX và TypeScript, [syntax highlighting](https://stackoverflow.com/a/70960574/458193) và tự động hoàn thành được tích hợp sẵn.
* [Vim](https://www.vim.org/) là một trình soạn thảo văn bản có khả năng tùy biến cao được xây dựng để tạo và thay đổi bất kỳ loại văn bản nào một cách hiệu quả. Nó được bao gồm dưới dạng "vi" với hầu hết các hệ thống UNIX và với Apple OS X.

## Các tính năng trình soạn thảo văn bản được đề xuất {/*recommended-text-editor-features*/}

Một số trình soạn thảo đi kèm với các tính năng này được tích hợp sẵn, nhưng những trình soạn thảo khác có thể yêu cầu thêm một extension. Hãy kiểm tra xem trình soạn thảo bạn chọn cung cấp hỗ trợ gì để chắc chắn!

### Linting {/*linting*/}

Công cụ lint code tìm các vấn đề trong code của bạn khi bạn viết, giúp bạn sửa chúng sớm. [ESLint](https://eslint.org/) là một công cụ lint mã nguồn mở phổ biến cho JavaScript.

* [Cài đặt ESLint với cấu hình được đề xuất cho React](https://www.npmjs.com/package/eslint-config-react-app) (hãy chắc chắn rằng bạn đã [cài đặt Node!](https://nodejs.org/en/download/current/))
* [Tích hợp ESLint trong VSCode với extension chính thức](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**Đảm bảo rằng bạn đã bật tất cả các rule [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) cho dự án của mình.** Chúng rất cần thiết và bắt các lỗi nghiêm trọng nhất sớm. Preset [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) được đề xuất đã bao gồm chúng.

### Formatting {/*formatting*/}

Điều cuối cùng bạn muốn làm khi chia sẻ code của mình với một cộng tác viên khác là tham gia vào một cuộc thảo luận về [tabs vs spaces](https://www.google.com/search?q=tabs+vs+spaces)! May mắn thay, [Prettier](https://prettier.io/) sẽ dọn dẹp code của bạn bằng cách định dạng lại nó để tuân theo các rule được đặt trước, có thể định cấu hình. Chạy Prettier và tất cả các tab của bạn sẽ được chuyển đổi thành dấu cách—và thụt lề, dấu ngoặc kép, v.v. cũng sẽ được thay đổi để tuân theo cấu hình. Trong thiết lập lý tưởng, Prettier sẽ chạy khi bạn lưu tệp của mình, nhanh chóng thực hiện các chỉnh sửa này cho bạn.

Bạn có thể cài đặt [extension Prettier trong VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) bằng cách làm theo các bước sau:

1. Khởi chạy VS Code
2. Sử dụng Quick Open (nhấn Ctrl/Cmd+P)
3. Dán vào `ext install esbenp.prettier-vscode`
4. Nhấn Enter

#### Formatting khi lưu {/*formatting-on-save*/}

Lý tưởng nhất là bạn nên định dạng code của mình mỗi khi lưu. VS Code có các cài đặt cho việc này!

1. Trong VS Code, nhấn `CTRL/CMD + SHIFT + P`.
2. Gõ "settings"
3. Nhấn Enter
4. Trong thanh tìm kiếm, gõ "format on save"
5. Đảm bảo tùy chọn "format on save" được đánh dấu!

> Nếu preset ESLint của bạn có các rule định dạng, chúng có thể xung đột với Prettier. Chúng tôi khuyên bạn nên tắt tất cả các rule định dạng trong preset ESLint của bạn bằng cách sử dụng [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) để ESLint *chỉ* được sử dụng để bắt các lỗi logic. Nếu bạn muốn thực thi rằng các tệp được định dạng trước khi một pull request được hợp nhất, hãy sử dụng [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) cho tích hợp liên tục của bạn.
