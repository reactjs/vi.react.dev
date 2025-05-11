---
title: useLayoutEffect
---

<Pitfall>

`useLayoutEffect` có thể làm giảm hiệu năng. Ưu tiên sử dụng [`useEffect`](/reference/react/useEffect) khi có thể.

</Pitfall>

<Intro>

`useLayoutEffect` là một phiên bản của [`useEffect`](/reference/react/useEffect) được thực thi trước khi trình duyệt vẽ lại màn hình.

```js
useLayoutEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useLayoutEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Gọi `useLayoutEffect` để thực hiện các phép đo bố cục trước khi trình duyệt vẽ lại màn hình:

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `setup`: Hàm chứa logic Effect của bạn. Hàm setup của bạn cũng có thể trả về một hàm *cleanup* (dọn dẹp) tùy chọn. Trước khi component của bạn được thêm vào DOM, React sẽ chạy hàm setup của bạn. Sau mỗi lần re-render với các dependencies đã thay đổi, React sẽ chạy hàm cleanup (nếu bạn cung cấp) với các giá trị cũ, và sau đó chạy hàm setup của bạn với các giá trị mới. Trước khi component của bạn bị xóa khỏi DOM, React sẽ chạy hàm cleanup của bạn.

* **optional** `dependencies`: Danh sách tất cả các giá trị reactive được tham chiếu bên trong code `setup`. Các giá trị reactive bao gồm props, state, và tất cả các biến và hàm được khai báo trực tiếp bên trong phần thân component của bạn. Nếu trình lint của bạn được [cấu hình cho React](/learn/editor-setup#linting), nó sẽ xác minh rằng mọi giá trị reactive được chỉ định chính xác là một dependency. Danh sách các dependencies phải có một số lượng mục không đổi và được viết inline như `[dep1, dep2, dep3]`. React sẽ so sánh mỗi dependency với giá trị trước đó của nó bằng cách sử dụng phép so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Nếu bạn bỏ qua đối số này, Effect của bạn sẽ chạy lại sau mỗi lần re-render của component.

#### Giá trị trả về {/*returns*/}

`useLayoutEffect` trả về `undefined`.

#### Lưu ý {/*caveats*/}

* `useLayoutEffect` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất của component** hoặc các Hook của riêng bạn. Bạn không thể gọi nó bên trong các vòng lặp hoặc điều kiện. Nếu bạn cần điều đó, hãy trích xuất một component và di chuyển Effect đến đó.

* Khi Strict Mode được bật, React sẽ **chạy thêm một chu kỳ setup+cleanup chỉ dành cho development** trước setup thực tế đầu tiên. Đây là một bài kiểm tra áp lực để đảm bảo rằng logic cleanup của bạn "phản ánh" logic setup của bạn và nó dừng hoặc hoàn tác bất cứ điều gì setup đang làm. Nếu điều này gây ra sự cố, [hãy triển khai hàm cleanup.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Nếu một số dependencies của bạn là các đối tượng hoặc hàm được xác định bên trong component, có một rủi ro là chúng sẽ **khiến Effect chạy lại thường xuyên hơn mức cần thiết.** Để khắc phục điều này, hãy loại bỏ các dependency [đối tượng](/reference/react/useEffect#removing-unnecessary-object-dependencies) và [hàm](/reference/react/useEffect#removing-unnecessary-function-dependencies) không cần thiết. Bạn cũng có thể [trích xuất các cập nhật state](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect) và [logic non-reactive](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect) ra khỏi Effect của bạn.

* Các Effect **chỉ chạy trên client.** Chúng không chạy trong quá trình server rendering.

* Code bên trong `useLayoutEffect` và tất cả các cập nhật state được lên lịch từ nó **ngăn trình duyệt vẽ lại màn hình.** Khi được sử dụng quá mức, điều này làm cho ứng dụng của bạn chậm. Khi có thể, hãy ưu tiên [`useEffect`.](/reference/react/useEffect)

* Nếu bạn kích hoạt một cập nhật state bên trong `useLayoutEffect`, React sẽ thực thi tất cả các Effect còn lại ngay lập tức bao gồm cả `useEffect`.

---

## Cách sử dụng {/*usage*/}

### Đo lường bố cục trước khi trình duyệt vẽ lại màn hình {/*measuring-layout-before-the-browser-repaints-the-screen*/}

Hầu hết các component không cần biết vị trí và kích thước của chúng trên màn hình để quyết định những gì cần render. Chúng chỉ trả về một số JSX. Sau đó, trình duyệt tính toán *layout* (vị trí và kích thước) của chúng và vẽ lại màn hình.

Đôi khi, điều đó là không đủ. Hãy tưởng tượng một tooltip xuất hiện bên cạnh một số phần tử khi di chuột qua. Nếu có đủ không gian, tooltip sẽ xuất hiện phía trên phần tử, nhưng nếu không vừa, nó sẽ xuất hiện bên dưới. Để render tooltip ở đúng vị trí cuối cùng, bạn cần biết chiều cao của nó (tức là nó có vừa ở trên cùng hay không).

Để làm điều này, bạn cần render trong hai lượt:

1. Render tooltip ở bất kỳ đâu (ngay cả với vị trí sai).
2. Đo chiều cao của nó và quyết định nơi đặt tooltip.
3. Render tooltip *lại* ở đúng vị trí.

**Tất cả những điều này cần phải xảy ra trước khi trình duyệt vẽ lại màn hình.** Bạn không muốn người dùng nhìn thấy tooltip di chuyển. Gọi `useLayoutEffect` để thực hiện các phép đo bố cục trước khi trình duyệt vẽ lại màn hình:

```js {5-8}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // Bạn chưa biết chiều cao thực

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Re-render bây giờ bạn đã biết chiều cao thực
  }, []);

  // ...sử dụng tooltipHeight trong logic rendering bên dưới...
}
```

Đây là cách nó hoạt động từng bước:

1. `Tooltip` render với `tooltipHeight` ban đầu là `0` (vì vậy tooltip có thể được định vị sai).
2. React đặt nó vào DOM và chạy code trong `useLayoutEffect`.
3. `useLayoutEffect` của bạn [đo chiều cao](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) của nội dung tooltip và kích hoạt re-render ngay lập tức.
4. `Tooltip` render lại với `tooltipHeight` thực (vì vậy tooltip được định vị chính xác).
5. React cập nhật nó trong DOM và trình duyệt cuối cùng hiển thị tooltip.

Di chuột qua các nút bên dưới và xem cách tooltip điều chỉnh vị trí của nó tùy thuộc vào việc nó có vừa hay không:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Tooltip này không vừa phía trên nút.
            <br />
            Đây là lý do tại sao nó được hiển thị bên dưới!
          </div>
        }
      >
        Di chuột qua tôi (tooltip phía trên)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Tooltip này vừa phía trên nút</div>
        }
      >
        Di chuột qua tôi (tooltip phía dưới)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Tooltip này vừa phía trên nút</div>
        }
      >
        Di chuột qua tôi (tooltip phía dưới)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Measured tooltip height: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Nó không vừa phía trên, vì vậy hãy đặt bên dưới.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Lưu ý rằng mặc dù component `Tooltip` phải render trong hai lượt (đầu tiên, với `tooltipHeight` được khởi tạo thành `0` và sau đó với chiều cao đo được thực tế), bạn chỉ thấy kết quả cuối cùng. Đây là lý do tại sao bạn cần `useLayoutEffect` thay vì [`useEffect`](/reference/react/useEffect) cho ví dụ này. Hãy xem sự khác biệt chi tiết bên dưới.

<Recipes titleText="useLayoutEffect vs useEffect" titleId="examples">

#### `useLayoutEffect` ngăn trình duyệt vẽ lại {/*uselayouteffect-blocks-the-browser-from-repainting*/}

React đảm bảo rằng code bên trong `useLayoutEffect` và bất kỳ cập nhật state nào được lên lịch bên trong nó sẽ được xử lý **trước khi trình duyệt vẽ lại màn hình.** Điều này cho phép bạn render tooltip, đo nó và re-render tooltip lại mà người dùng không nhận thấy lần render thêm đầu tiên. Nói cách khác, `useLayoutEffect` ngăn trình duyệt vẽ.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Tooltip này không vừa phía trên nút.
            <br />
            Đây là lý do tại sao nó được hiển thị bên dưới!
          </div>
        }
      >
        Di chuột qua tôi (tooltip phía trên)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Tooltip này vừa phía trên nút</div>
        }
      >
        Di chuột qua tôi (tooltip phía dưới)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Tooltip này vừa phía trên nút</div>
        }
      >
        Di chuột qua tôi (tooltip phía dưới)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Nó không vừa phía trên, vì vậy hãy đặt bên dưới.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

<Solution />

#### `useEffect` không ngăn trình duyệt {/*useeffect-does-not-block-the-browser*/}

Đây là cùng một ví dụ, nhưng với [`useEffect`](/reference/react/useEffect) thay vì `useLayoutEffect`. Nếu bạn đang sử dụng một thiết bị chậm hơn, bạn có thể nhận thấy rằng đôi khi tooltip "nhấp nháy" và bạn thấy vị trí ban đầu của nó trong thời gian ngắn trước vị trí đã sửa.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Tooltip này không vừa phía trên nút.
            <br />
            Đây là lý do tại sao nó được hiển thị bên dưới!
          </div>
        }
      >
        Di chuột qua tôi (tooltip phía trên)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Tooltip này vừa phía trên nút</div>
        }
      >
        Di chuột qua tôi (tooltip phía dưới)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Tooltip này vừa phía trên nút</div>
        }
      >
        Di chuột qua tôi (tooltip phía dưới)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Nó không vừa phía trên, vì vậy hãy đặt bên dưới.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Để giúp việc tái tạo lỗi dễ dàng hơn, phiên bản này thêm một độ trễ nhân tạo trong quá trình rendering. React sẽ cho phép trình duyệt vẽ màn hình trước khi nó xử lý cập nhật state bên trong `useEffect`. Do đó, tooltip nhấp nháy:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Tooltip này không vừa phía trên nút.
            <br />
            Đây là lý do tại sao nó được hiển thị bên dưới!
          </div>
        }
      >
        Di chuột qua tôi (tooltip phía trên)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Tooltip này vừa phía trên nút</div>
        }
      >
        Di chuột qua tôi (tooltip phía dưới)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Tooltip này vừa phía trên nút</div>
        }
      >
        Di chuột qua tôi (tooltip phía dưới)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // Điều này làm chậm quá trình rendering một cách nhân tạo
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Không làm gì cả trong một khoảng thời gian...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Nó không vừa phía trên, vì vậy hãy đặt bên dưới.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Chỉnh sửa ví dụ này thành `useLayoutEffect` và quan sát rằng nó ngăn chặn việc vẽ ngay cả khi quá trình rendering bị chậm lại.

<Solution />

</Recipes>

<Note>

Rendering trong hai lượt và ngăn trình duyệt gây ảnh hưởng đến hiệu năng. Cố gắng tránh điều này khi bạn có thể.

</Note>

---

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi gặp lỗi: "`useLayoutEffect` không làm gì trên server" {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

Mục đích của `useLayoutEffect` là cho phép component của bạn [sử dụng thông tin bố cục để rendering:](#measuring-layout-before-the-browser-repaints-the-screen)

1. Render nội dung ban đầu.
2. Đo bố cục *trước khi trình duyệt vẽ lại màn hình.*
3. Render nội dung cuối cùng bằng cách sử dụng thông tin bố cục bạn đã đọc.

Khi bạn hoặc framework của bạn sử dụng [server rendering](/reference/react-dom/server), ứng dụng React của bạn render thành HTML trên server cho lần render ban đầu. Điều này cho phép bạn hiển thị HTML ban đầu trước khi code JavaScript tải.

Vấn đề là trên server, không có thông tin bố cục.

Trong [ví dụ trước](#measuring-layout-before-the-browser-repaints-the-screen), lệnh gọi `useLayoutEffect` trong component `Tooltip` cho phép nó tự định vị chính xác (hoặc phía trên hoặc phía dưới nội dung) tùy thuộc vào chiều cao nội dung. Nếu bạn cố gắng render `Tooltip` như một phần của HTML server ban đầu, điều này sẽ không thể xác định được. Trên server, chưa có bố cục! Vì vậy, ngay cả khi bạn render nó trên server, vị trí của nó sẽ "nhảy" trên client sau khi JavaScript tải và chạy.

Thông thường, các component dựa vào thông tin bố cục không cần render trên server. Ví dụ: có lẽ không có ý nghĩa gì khi hiển thị `Tooltip` trong quá trình render ban đầu. Nó được kích hoạt bởi một tương tác của client.

Tuy nhiên, nếu bạn đang gặp phải vấn đề này, bạn có một vài tùy chọn khác nhau:

- Thay thế `useLayoutEffect` bằng [`useEffect`.](/reference/react/useEffect) Điều này cho React biết rằng có thể hiển thị kết quả render ban đầu mà không cần chặn việc vẽ (vì HTML ban đầu sẽ hiển thị trước khi Effect của bạn chạy).

- Ngoài ra, [đánh dấu component của bạn là chỉ dành cho client.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content) Điều này cho React biết thay thế nội dung của nó cho đến ranh giới [`<Suspense>`](/reference/react/Suspense) gần nhất bằng một fallback tải (ví dụ: một spinner hoặc một glimmer) trong quá trình server rendering.

- Ngoài ra, bạn có thể render một component với `useLayoutEffect` chỉ sau khi hydration. Giữ một state boolean `isMounted` được khởi tạo thành `false` và đặt nó thành `true` bên trong một lệnh gọi `useEffect`. Logic rendering của bạn sau đó có thể giống như `return isMounted ? <RealContent /> : <FallbackContent />`. Trên server và trong quá trình hydration, người dùng sẽ thấy `FallbackContent` không nên gọi `useLayoutEffect`. Sau đó, React sẽ thay thế nó bằng `RealContent` chỉ chạy trên client và có thể bao gồm các lệnh gọi `useLayoutEffect`.

- Nếu bạn đồng bộ hóa component của mình với một kho dữ liệu bên ngoài và dựa vào `useLayoutEffect` vì những lý do khác với đo lường bố cục, hãy cân nhắc [`useSyncExternalStore`](/reference/react/useSyncExternalStore) thay thế, [hỗ trợ server rendering.](/reference/react/useSyncExternalStore#adding-support-for-server-rendering)
