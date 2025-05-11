---
title: createPortal
---

<Intro>

`createPortal` cho phép bạn hiển thị một số phần tử con vào một phần khác của DOM.

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

Để tạo một portal, hãy gọi `createPortal`, truyền một số JSX và DOM node nơi nó sẽ được hiển thị:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>Phần tử con này được đặt trong div cha.</p>
  {createPortal(
    <p>Phần tử con này được đặt trong document body.</p>,
    document.body
  )}
</div>
```

[Xem thêm các ví dụ bên dưới.](#usage)

Một portal chỉ thay đổi vị trí vật lý của DOM node. Về mọi mặt khác, JSX bạn hiển thị vào một portal hoạt động như một node con của React component hiển thị nó. Ví dụ: phần tử con có thể truy cập context được cung cấp bởi cây cha và các event nổi lên từ con đến cha theo cây React.

#### Tham số {/*parameters*/}

* `children`: Bất cứ thứ gì có thể được hiển thị bằng React, chẳng hạn như một đoạn JSX (ví dụ: `<div />` hoặc `<SomeComponent />`), một [Fragment](/reference/react/Fragment) (`<>...</>`), một chuỗi hoặc một số, hoặc một mảng các phần tử này.

* `domNode`: Một số DOM node, chẳng hạn như những node được trả về bởi `document.getElementById()`. Node này phải đã tồn tại. Việc truyền một DOM node khác trong quá trình cập nhật sẽ khiến nội dung portal được tạo lại.

* **optional** `key`: Một chuỗi hoặc số duy nhất được sử dụng làm [key](/learn/rendering-lists/#keeping-list-items-in-order-with-key) của portal.

#### Giá trị trả về {/*returns*/}

`createPortal` trả về một React node có thể được đưa vào JSX hoặc trả về từ một React component. Nếu React bắt gặp nó trong đầu ra hiển thị, nó sẽ đặt `children` đã cung cấp bên trong `domNode` đã cung cấp.

#### Lưu ý {/*caveats*/}

* Các event từ portal lan truyền theo cây React chứ không phải cây DOM. Ví dụ: nếu bạn nhấp vào bên trong một portal và portal được bao bọc trong `<div onClick>`, thì trình xử lý `onClick` đó sẽ kích hoạt. Nếu điều này gây ra sự cố, hãy dừng sự lan truyền event từ bên trong portal hoặc di chuyển chính portal lên trên trong cây React.

---

## Cách sử dụng {/*usage*/}

### Hiển thị đến một phần khác của DOM {/*rendering-to-a-different-part-of-the-dom*/}

*Portals* cho phép các component của bạn hiển thị một số phần tử con của chúng vào một vị trí khác trong DOM. Điều này cho phép một phần của component của bạn "thoát" khỏi bất kỳ container nào mà nó có thể ở trong đó. Ví dụ: một component có thể hiển thị một hộp thoại modal hoặc một tooltip xuất hiện phía trên và bên ngoài phần còn lại của trang.

Để tạo một portal, hãy hiển thị kết quả của `createPortal` với <CodeStep step={1}>một số JSX</CodeStep> và <CodeStep step={2}>DOM node nơi nó sẽ đi đến</CodeStep>:

```js [[1, 8, "<p>This child is placed in the document body.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Phần tử con này được đặt trong div cha.</p>
      {createPortal(
        <p>Phần tử con này được đặt trong document body.</p>,
        document.body
      )}
    </div>
  );
}
```

React sẽ đặt các DOM node cho <CodeStep step={1}>JSX bạn đã truyền</CodeStep> vào bên trong <CodeStep step={2}>DOM node bạn đã cung cấp</CodeStep>.

Nếu không có portal, `<p>` thứ hai sẽ được đặt bên trong `<div>` cha, nhưng portal đã "dịch chuyển" nó vào [`document.body`:](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Phần tử con này được đặt trong div cha.</p>
      {createPortal(
        <p>Phần tử con này được đặt trong document body.</p>,
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
        <p>Phần tử con này được đặt bên trong div cha.</p>
      </div>
    ...
  </div>
  <p>Phần tử con này được đặt trong document body.</p>
</body>
```

Một portal chỉ thay đổi vị trí vật lý của DOM node. Về mọi mặt khác, JSX bạn hiển thị vào một portal hoạt động như một node con của React component hiển thị nó. Ví dụ: phần tử con có thể truy cập context được cung cấp bởi cây cha và các event vẫn nổi lên từ con đến cha theo cây React.

---

### Hiển thị một hộp thoại modal bằng portal {/*rendering-a-modal-dialog-with-a-portal*/}

Bạn có thể sử dụng một portal để tạo một hộp thoại modal nổi phía trên phần còn lại của trang, ngay cả khi component triệu hồi hộp thoại nằm bên trong một container có `overflow: hidden` hoặc các style khác gây trở ngại cho hộp thoại.

Trong ví dụ này, hai container có các style làm gián đoạn hộp thoại modal, nhưng hộp thoại được hiển thị vào một portal không bị ảnh hưởng vì, trong DOM, modal không nằm trong các phần tử JSX cha.

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
        Hiển thị modal không có portal
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
        Hiển thị modal sử dụng portal
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
      <div>Tôi là một hộp thoại modal</div>
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

Điều quan trọng là đảm bảo rằng ứng dụng của bạn có thể truy cập được khi sử dụng portal. Ví dụ: bạn có thể cần quản lý focus bàn phím để người dùng có thể di chuyển focus vào và ra khỏi portal một cách tự nhiên.

Hãy tuân theo [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/#dialog_modal) khi tạo modal. Nếu bạn sử dụng một gói cộng đồng, hãy đảm bảo rằng nó có thể truy cập được và tuân theo các nguyên tắc này.

</Pitfall>

---

### Hiển thị các React component vào markup server không phải React {/*rendering-react-components-into-non-react-server-markup*/}

Portal có thể hữu ích nếu React root của bạn chỉ là một phần của một trang tĩnh hoặc được hiển thị trên server mà không được xây dựng bằng React. Ví dụ: nếu trang của bạn được xây dựng bằng một framework server như Rails, bạn có thể tạo các khu vực tương tác trong các khu vực tĩnh như sidebar. So với việc có [nhiều React root riêng biệt,](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) portal cho phép bạn coi ứng dụng như một cây React duy nhất với trạng thái được chia sẻ ngay cả khi các phần của nó hiển thị đến các phần khác nhau của DOM.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>Ứng dụng của tôi</title></head>
  <body>
    <h1>Chào mừng đến với ứng dụng hybrid của tôi</h1>
    <div class="parent">
      <div class="sidebar">
        Đây là markup không phải React của server
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
  return <p>Phần này được hiển thị bởi React</p>;
}

function SidebarContent() {
  return <p>Phần này cũng được hiển thị bởi React!</p>;
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

### Hiển thị các React component vào các DOM node không phải React {/*rendering-react-components-into-non-react-dom-nodes*/}

Bạn cũng có thể sử dụng một portal để quản lý nội dung của một DOM node được quản lý bên ngoài React. Ví dụ: giả sử bạn đang tích hợp với một widget bản đồ không phải React và bạn muốn hiển thị nội dung React bên trong một popup. Để thực hiện việc này, hãy khai báo một biến trạng thái `popupContainer` để lưu trữ DOM node mà bạn sẽ hiển thị vào:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

Khi bạn tạo widget của bên thứ ba, hãy lưu trữ DOM node được trả về bởi widget để bạn có thể hiển thị vào nó:

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

Điều này cho phép bạn sử dụng `createPortal` để hiển thị nội dung React vào `popupContainer` sau khi nó khả dụng:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Xin chào từ React!</p>,
      popupContainer
    )}
  </div>
);
```

Dưới đây là một ví dụ hoàn chỉnh mà bạn có thể dùng thử:

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
        <p>Xin chào từ React!</p>,
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
