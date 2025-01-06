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
<<<<<<< HEAD
Công cụ phát triển React có thể được sử dụng để kiểm tra các ứng dụng được xây dựng bằng [React Native](https://reactnative.dev/) as well.

Cách đơn giản nhất để sử dụng công cụ phát triển React là cài đặt nó toàn cục trên hệ thống của bạn:
```bash
# Yarn
yarn global add react-devtools
=======

To inspect apps built with [React Native](https://reactnative.dev/), you can use [React Native DevTools](https://reactnative.dev/docs/react-native-devtools), the built-in debugger that deeply integrates React Developer Tools. All features work identically to the browser extension, including native element highlighting and selection.
>>>>>>> b1a249d597016c6584e4c186daa28b180cc9aafc

[Learn more about debugging in React Native.](https://reactnative.dev/docs/debugging)

<<<<<<< HEAD
Sau đó mở công cụ phát triển từ terminal.
```bash
react-devtools
```

Nó sẽ kết nối với bất kỳ ứng dụng React Native nào đang chạy trên cùng một máy tính.

> Hãy thử tải lại ứng dụng nếu công cụ phát triển không kết nối sau vài giây.

[Tìm hiểu thêm về debugging với React Native.](https://reactnative.dev/docs/debugging)
=======
> For versions of React Native earlier than 0.76, please use the standalone build of React DevTools by following the [Safari and other browsers](#safari-and-other-browsers) guide above.
>>>>>>> b1a249d597016c6584e4c186daa28b180cc9aafc
