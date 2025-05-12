---
title: Công cụ phát triển React
---

<Intro>

Sử dụng Công cụ Phát triển React để kiểm tra các [thành phần](/learn/your-first-component), chỉnh sửa [props](/learn/passing-props-to-a-component) và [state](/learn/state-a-components-memory), và xác định các vấn đề hiệu suất.

</Intro>

<YouWillLearn>

* Cách cài đặt công cụ phát triển React

</YouWillLearn>

## Tiện ích mở rộng trên trình duyệt {/*tiện-ích-mở-rộng-trên-trình-duyệt*/}

Cách dễ nhất để sửa lỗi các trang web được xây dựng bằng React là cài đặt tiện ích mở rộng trình duyệt React Developer Tools. Nó có sẵn cho một số trình duyệt phổ biến:

* [Cài đặt cho **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [Cài đặt cho **Firefox**](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [Cài đặt cho **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

Bây giờ nếu bạn truy cập website **được xây dựng bằng React,** bạn sẽ thấy các bảng điều khiển _Components_ và _Profiler_.

![Công cụ phát triển React trên tiện ích trình duyệt](/images/docs/react-devtools-extension.png)

### Safari và các trình duyệt khác {/*safari-và-các-trình-duyệt-khác*/}
Với các trình duyệt khác (ví dụ như, Safari), hãy cài đặt [`react-devtools`](https://www.npmjs.com/package/react-devtools) npm package:
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Sau đó hãy mở công cụ phát triển React từ Terminal:
```bash
react-devtools
```

Rồi kết nối với trang web của bạn bằng cách thêm thẻ `<script>` sau đây lên trên đầu thẻ `<head>` ủa trang web:
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Hãy tải lại trang web của bạn ngay để có thể nhìn thấy nó với công cụ phát triển.

![Công cụ phát triển React độc lập](/images/docs/react-devtools-standalone.png)

## Mobile (React Native) {/*mobile-react-native*/}

Để kiểm tra các ứng dụng được xây dựng bằng [React Native](https://reactnative.dev/), bạn có thể sử dụng [React Native DevTools](https://reactnative.dev/docs/react-native-devtools), trình gỡ lỗi tích hợp sẵn với sự liên kết sâu với React Developer Tools. Tất cả các tính năng hoạt động tương tự như tiện ích mở rộng trên trình duyệt, bao gồm cả việc làm nổi bật và chọn các phần tử gốc (native).

[Tìm hiểu thêm về cách debug trong React Native.](https://reactnative.dev/docs/debugging)

> Đối với các phiên bản React Native trước 0.76, vui lòng sử dụng bản dựng độc lập của React DevTools bằng cách làm theo hướng dẫn [Safari và các trình duyệt khác](#safari-and-other-browsers) ở trên.
