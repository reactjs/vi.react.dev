---
title: Cảnh báo ngừng sử dụng react-test-renderer
---

TODO: Cập nhật cho bản 19?

## Cảnh báo ReactTestRenderer.create() {/*reacttestrenderercreate-warning*/}

react-test-renderer đã bị ngừng sử dụng. Một cảnh báo sẽ xuất hiện bất cứ khi nào gọi ReactTestRenderer.create() hoặc ReactShallowRender.render(). Gói react-test-renderer sẽ vẫn có sẵn trên NPM nhưng sẽ không được bảo trì và có thể bị hỏng với các tính năng mới của React hoặc các thay đổi đối với các thành phần bên trong của React.

Nhóm React khuyên bạn nên di chuyển các thử nghiệm của mình sang [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) hoặc [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/start/intro/) để có trải nghiệm kiểm tra hiện đại và được hỗ trợ tốt.

## Cảnh báo new ShallowRenderer() {/*new-shallowrenderer-warning*/}

Gói react-test-renderer không còn xuất trình kết xuất nông tại `react-test-renderer/shallow`. Đây chỉ đơn giản là việc đóng gói lại một gói riêng biệt đã được trích xuất trước đó: `react-shallow-renderer`. Do đó, bạn có thể tiếp tục sử dụng trình kết xuất nông theo cách tương tự bằng cách cài đặt trực tiếp. Xem [Github](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer).
