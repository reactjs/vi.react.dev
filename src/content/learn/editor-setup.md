---
title: Cài đặt trình soạn thảo văn bản
---

<Intro>

Một trình soạn thảo văn bản được cấu hình đúng cách có thể làm cho mã nguồn dễ đọc hơn và tốc độ viết code nhanh hơn. Nó còn có thể giúp bạn phát hiện lỗi khi bạn đang viết code! Nếu đây là lần đầu tiên bạn cài đặt một trình soạn thảo văn bản hoặc bạn đang muốn tinh chỉnh trình soạn thảo văn bản hiện tại của mình, chúng tôi có vài đề xuất.

</Intro>

<YouWillLearn>

* Các trình soạn thảo phổ biến nhất
* Làm sao để định dạng code một cách tự động

</YouWillLearn>

## Trình soạn thảo văn bản của bạn {/*trình-soạn-thảo-văn-bản-của-bạn*/}

[VS Code](https://code.visualstudio.com/) là một trong những trình soạn thảo phổ biến nhất hiện nay. VS Code có một cửa hàng ứng dụng mở rộng khổng lồ và tích hợp tốt với các dịch vụ phổ biến như GitHub. Hầu hết các tính năng được liệt kê dưới đây có thể được thêm vào VS Code dưới dạng các tiện ích mở rộng, làm cho nó có khả năng tùy chỉnh cao!

Các trình soạn thảo phổ biến khác được sử dụng trong cộng đồng React bao gồm:

* [WebStorm](https://www.jetbrains.com/webstorm/) là một môi trường phát triển tích hợp được thiết kế đặc biệt cho JavaScript.
* [Sublime Text](https://www.sublimetext.com/) có hỗ trợ cho JSX và TypeScript, [làm nổi bật cú pháp](https://stackoverflow.com/a/70960574/458193) và tự động hoàn thiện code được tích hợp sẵn.
* [Vim](https://www.vim.org/) là một trình soạn thảo có khả năng tùy chỉnh cao, được xây dựng để tạo và thay đổi bất kỳ loại văn bản nào một cách hiệu quả. Nó được bao gồm dưới dạng "vi" với hầu hết các hệ thống UNIX và trên Apple OS X.

## Những tính năng của trình soạn thảo văn bản được đề xuất {/*những-tính-năng-của-trình-soạn-thảo-văn-bản-được-đề-xuất*/}

Một số trình soạn thảo đi kèm với các tính năng này được tích hợp sẵn, nhưng một số khác có thể yêu cầu thêm tiện ích mở rộng. Để chắc chắn thì hãy kiểm tra xem trình soạn thảo của bạn có hỗ trợ chúng không!

### Linting {/*linting*/}

Các trình kiểm tra lỗi code (linters) giúp phát hiện các vấn đề trong code của bạn khi bạn viết nó, giúp bạn sửa chúng sớm. [ESLint](https://eslint.org/) là một linter mã nguồn mở rất phổ biến.

* [Cài đặt ESLint với cấu hình khuyến nghị cho React](https://www.npmjs.com/package/eslint-config-react-app) (hãy chắc chắn bạn đã [cài đặt Node!](https://nodejs.org/en/download/current/))
* [Tích hợp ESLint vào VSCode với tiện ích mở rộng chính thức](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**Hãy đảm bảo rằng bạn đã kích hoạt tất cả các quy tắc của  [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) cho dự án của mình.** Vì chúng là cực kỳ quan trọng và giúp phát hiện các lỗi nghiêm trọng nhất sớm nhất có thể. Bộ cài đặt mặc định [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) đã bao gồm chúng.

### Định dạng code {/*định-dạng-code*/}

<<<<<<< HEAD
Điều cuối cùng mà bạn muốn làm khi chia sẻ code của mình cho người khác chính là tranh cãi với họ về việc sử dụng [tabs và spaces](https://www.google.com/search?q=tabs+vs+spaces)! May mắn thay, [Prettier](https://prettier.io/) sẽ giúp bạn làm sạch code của mình bằng cách định dạng lại theo các quy tắc được thiết lập sẵn và có thể cấu hình được. Chạy Prettier và tất cả các tab của bạn sẽ được chuyển đổi thành dấu cách - và các thụt đầu dòng, dấu ngoặc kép, v.v. cũng sẽ được thay đổi để phù hợp với cấu hình. Trong cài đặt lý tưởng, Prettier sẽ chạy khi bạn lưu tệp của mình, nhanh chóng thực hiện các chỉnh sửa này cho bạn.
=======
The last thing you want to do when sharing your code with another contributor is get into a discussion about [tabs vs spaces](https://www.google.com/search?q=tabs+vs+spaces)! Fortunately, [Prettier](https://prettier.io/) will clean up your code by reformatting it to conform to preset, configurable rules. Run Prettier, and all your tabs will be converted to spaces—and your indentation, quotes, etc will also all be changed to conform to the configuration. In the ideal setup, Prettier will run when you save your file, quickly making these edits for you.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

Bạn có thể cài đặt [tiện ích Prettier trong VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) bằng những bước sau đây:

1. Mở VS Code
2. Sử dụng Quick Open (bấm Ctrl/Cmd+P)
3. Dán dòng chữ `ext install esbenp.prettier-vscode`
4. Bấm Enter

#### Định dạng code khi lưu {/*định-dạng-code-khi-lưu*/}

Lý tưởng hơn, bạn muốn định dạng code của bạn mỗi khi lưu chúng. VS Code đã có các thiết lập sẵn cho điều này!

1. Trong VS Code, bấm `CTRL/CMD + SHIFT + P`.
2. Gõ "settings"
3. Bấm Enter
4. Trong thanh tìm kiếm, gõ "format on save"
5. Hãy chắc chắn rằng lựa chọn "format on save" đã được chọn!

> Nếu bộ cấu hình ESLint của bạn có các quy tắc định dạng, chúng có thể xung đột với Prettier. Chúng tôi khuyến khích bạn tắt tất cả các quy tắc định dạng trong bộ cấu hình ESLint của mình bằng cách sử dụng [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) để ESLint *chỉ có thể* được sử dụng để bắt các lỗi về logic. Nếu bạn muốn bắt buộc các tệp phải được định dạng trước khi thực hiện hợp nhất một pull request, hãy sử dụng [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) cho CI của bạn ( CI - Continuous Integration - Tích hợp liên tục ).
