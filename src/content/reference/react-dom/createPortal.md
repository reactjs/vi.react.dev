---
title: createPortal
---

<Intro>

`createPortal` cho phép bạn kết xuất một số children vào một phần khác của DOM.

```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

Để tạo một portal, hãy gọi `createPortal`, truyền một số JSX và nút DOM nơi nó sẽ được kết xuất:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>Child này được đặt trong div cha.</p>
  {createPortal(
    <p>Child này được đặt trong phần body của tài liệu.</p>,
    document.body
  )}
</div>
```

[Xem thêm các ví dụ bên dưới.](#usage)

Một portal chỉ thay đổi vị trí vật lý của nút DOM. Về mọi mặt khác, JSX bạn kết xuất vào một portal hoạt động như một nút con của thành phần React kết xuất nó. Ví dụ: child có thể truy cập ngữ cảnh được cung cấp bởi cây cha và các sự kiện nổi lên từ children lên cha theo cây React.

#### Tham số {/*parameters*/}

* `children`: Bất cứ thứ gì có thể được kết xuất bằng React, chẳng hạn như một đoạn JSX (ví dụ: `<div />` hoặc `<SomeComponent />`), một [Fragment](/reference/react/Fragment) (`<>...</>`), một chuỗi hoặc một số, hoặc một mảng các phần tử này.

* `domNode`: Một số nút DOM, chẳng hạn như những nút được trả về bởi `document.getElementById()`. Nút phải đã tồn tại. Truyền một nút DOM khác trong quá trình cập nhật sẽ khiến nội dung cổng được tạo lại.

* **tùy chọn** `key`: Một chuỗi hoặc số duy nhất được sử dụng làm [key của portal.](/learn/rendering-lists/#keeping-list-items-in-order-with-key)

#### Trả về {/*returns*/}

`createPortal` trả về một nút React có thể được đưa vào JSX hoặc được trả về từ một thành phần React. Nếu React gặp nó trong đầu ra kết xuất, nó sẽ đặt `children` đã cung cấp bên trong `domNode` đã cung cấp.

#### Lưu ý {/*caveats*/}

* Các sự kiện từ cổng lan truyền theo cây React chứ không phải cây DOM. Ví dụ: nếu bạn nhấp vào bên trong một cổng và cổng được bao bọc trong `<div onClick>`, trình xử lý `onClick` đó sẽ kích hoạt. Nếu điều này gây ra sự cố, hãy dừng lan truyền sự kiện từ bên trong cổng hoặc di chuyển chính cổng đó lên trên cây React.

---

## Cách sử dụng {/*usage*/}

### Kết xuất đến một phần khác của DOM {/*rendering-to-a-different-part-of-the-dom*/}

*Portals* cho phép các thành phần của bạn kết xuất một số children của chúng vào một vị trí khác trong DOM. Điều này cho phép một phần của thành phần của bạn "thoát" khỏi bất kỳ vùng chứa nào mà nó có thể ở trong đó. Ví dụ: một thành phần có thể hiển thị một hộp thoại phương thức hoặc một chú giải công cụ xuất hiện phía trên và bên ngoài phần còn lại của trang.

Để tạo một portal, hãy kết xuất kết quả của `createPortal` với <CodeStep step={1}>một số JSX</CodeStep> và <CodeStep step={2}>nút DOM nơi nó sẽ đi</CodeStep>:

```js [[1, 8, "<p>Child này được đặt trong phần body của tài liệu.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Child này được đặt trong div cha.</p>
      {createPortal(
        <p>Child này được đặt trong phần body của tài liệu.</p>,
        document.body
      )}
    </div>
  );
}
```

React sẽ đặt các nút DOM cho <CodeStep step={1}>JSX bạn đã truyền</CodeStep> bên trong <CodeStep step={2}>nút DOM bạn đã cung cấp</CodeStep>.

Nếu không có portal, `<p>` thứ hai sẽ được đặt bên trong `<div>` cha, nhưng portal đã "dịch chuyển" nó vào [`document.body`:](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Child này được đặt trong div cha.</p>
      {createPortal(
        <p>Child này được đặt trong phần body của tài liệu.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

Lưu ý cách đoạn văn thứ hai xuất hiện trực quan bên ngoài `<div>` cha có đường viền. Nếu bạn kiểm tra cấu trúc DOM bằng các công cụ dành cho nhà phát triển, bạn sẽ thấy rằng `<p>` thứ hai đã được đặt trực tiếp vào `<body>`:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>Child này được đặt bên trong div cha.</p>
      </div>
    ...
  </div>
  <p>Child này được đặt trong phần body của tài liệu.</p>
</body>
```

Một portal chỉ thay đổi vị trí vật lý của nút DOM. Về mọi mặt khác, JSX bạn kết xuất vào một portal hoạt động như một nút con của thành phần React kết xuất nó. Ví dụ: child có thể truy cập ngữ cảnh được cung cấp bởi cây cha và các sự kiện vẫn nổi lên từ children lên cha theo cây React.

---

### Kết xuất hộp thoại phương thức bằng portal {/*rendering-a-modal-dialog-with-a-portal*/}

Bạn có thể sử dụng một portal để tạo một hộp thoại phương thức nổi phía trên phần còn lại của trang, ngay cả khi thành phần triệu hồi hộp thoại nằm bên trong một vùng chứa có `overflow: hidden` hoặc các kiểu khác gây trở ngại cho hộp thoại.

Trong ví dụ này, hai vùng chứa có các kiểu làm gián đoạn hộp thoại phương thức, nhưng vùng chứa được kết xuất vào một portal không bị ảnh hưởng vì, trong DOM, phương thức không nằm trong các phần tử JSX cha.

<Sandpack>

```js src/App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js src/NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Hiển thị phương thức mà không cần portal
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js src/PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Hiển thị phương thức bằng portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js src/ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>Tôi là một hộp thoại phương thức</div>
      <button onClick={onClose}>Đóng</button>
    </div>
  );
}
```


```css src/styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

Điều quan trọng là đảm bảo rằng ứng dụng của bạn có thể truy cập được khi sử dụng cổng. Ví dụ: bạn có thể cần quản lý tiêu điểm bàn phím để người dùng có thể di chuyển tiêu điểm vào và ra khỏi cổng một cách tự nhiên.

Hãy tuân theo [Các phương pháp tạo phương thức WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/#dialog_modal) khi tạo phương thức. Nếu bạn sử dụng một gói cộng đồng, hãy đảm bảo rằng nó có thể truy cập được và tuân theo các nguyên tắc này.

</Pitfall>

---

### Kết xuất các thành phần React vào mã đánh dấu máy chủ không phải React {/*rendering-react-components-into-non-react-server-markup*/}

Portals có thể hữu ích nếu gốc React của bạn chỉ là một phần của trang tĩnh hoặc được kết xuất trên máy chủ không được xây dựng bằng React. Ví dụ: nếu trang của bạn được xây dựng bằng một framework máy chủ như Rails, bạn có thể tạo các khu vực tương tác trong các khu vực tĩnh như thanh bên. So với việc có [nhiều gốc React riêng biệt,](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) portals cho phép bạn coi ứng dụng như một cây React duy nhất với trạng thái được chia sẻ ngay cả khi các phần của nó kết xuất đến các phần khác nhau của DOM.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <h1>Welcome to my hybrid app</h1>
    <div class="parent">
      <div class="sidebar">
        This is server non-React markup
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>This part is rendered by React</p>;
}

function SidebarContent() {
  return <p>This part is also rendered by React!</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### Kết xuất các thành phần React vào các nút DOM không phải React {/*rendering-react-components-into-non-react-dom-nodes*/}

Bạn cũng có thể sử dụng cổng để quản lý nội dung của một nút DOM được quản lý bên ngoài React. Ví dụ: giả sử bạn đang tích hợp với một tiện ích bản đồ không phải React và bạn muốn kết xuất nội dung React bên trong một cửa sổ bật lên. Để thực hiện việc này, hãy khai báo một biến trạng thái `popupContainer` để lưu trữ nút DOM mà bạn sẽ kết xuất vào:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

Khi bạn tạo tiện ích của bên thứ ba, hãy lưu trữ nút DOM được trả về bởi tiện ích để bạn có thể kết xuất vào nó:

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

Điều này cho phép bạn sử dụng `createPortal` để kết xuất nội dung React vào `popupContainer` sau khi nó khả dụng:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Hello from React!</p>,
      popupContainer
    )}
  </div>
);
```

Dưới đây là một ví dụ hoàn chỉnh mà bạn có thể thử:


<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Hello from React!</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>
