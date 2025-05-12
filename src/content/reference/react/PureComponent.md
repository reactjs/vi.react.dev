---
title: PureComponent
---

<Pitfall>

Chúng tôi khuyên bạn nên định nghĩa các component dưới dạng function thay vì class. [Xem cách migrate.](#alternatives)

</Pitfall>

<Intro>

`PureComponent` tương tự như [`Component`](/reference/react/Component) nhưng nó bỏ qua việc re-render khi props và state giống nhau. Các component class vẫn được React hỗ trợ, nhưng chúng tôi khuyên bạn không nên sử dụng chúng trong code mới.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Xin chào, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `PureComponent` {/*purecomponent*/}

Để bỏ qua việc re-render một class component khi props và state giống nhau, hãy kế thừa `PureComponent` thay vì [`Component`:](/reference/react/Component)

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Xin chào, {this.props.name}!</h1>;
  }
}
```

`PureComponent` là một lớp con của `Component` và hỗ trợ [tất cả các API của `Component`.](/reference/react/Component#reference) Kế thừa `PureComponent` tương đương với việc định nghĩa một phương thức [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) tùy chỉnh để so sánh nông props và state.

[Xem thêm các ví dụ bên dưới.](#usage)

---

## Cách sử dụng {/*usage*/}

### Bỏ qua các re-render không cần thiết cho class component {/*skipping-unnecessary-re-renders-for-class-components*/}

React thường re-render một component bất cứ khi nào parent của nó re-render. Để tối ưu hóa, bạn có thể tạo một component mà React sẽ không re-render khi parent của nó re-render, miễn là các props và state mới của nó giống với các props và state cũ. [Class component](/reference/react/Component) có thể chọn tham gia hành vi này bằng cách kế thừa `PureComponent`:

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Xin chào, {this.props.name}!</h1>;
  }
}
```

Một React component phải luôn có [logic render thuần túy.](/learn/keeping-components-pure) Điều này có nghĩa là nó phải trả về cùng một đầu ra nếu props, state và context của nó không thay đổi. Bằng cách sử dụng `PureComponent`, bạn đang nói với React rằng component của bạn tuân thủ yêu cầu này, vì vậy React không cần phải re-render miễn là props và state của nó không thay đổi. Tuy nhiên, component của bạn vẫn sẽ re-render nếu một context mà nó đang sử dụng thay đổi.

Trong ví dụ này, hãy để ý rằng component `Greeting` re-render bất cứ khi nào `name` thay đổi (vì đó là một trong các props của nó), nhưng không re-render khi `address` thay đổi (vì nó không được truyền cho `Greeting` dưới dạng một prop):

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Xin chào{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Tên{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Địa chỉ{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

Chúng tôi khuyên bạn nên định nghĩa các component dưới dạng function thay vì class. [Xem cách migrate.](#alternatives)

</Pitfall>

---

## Các lựa chọn thay thế {/*alternatives*/}

### Migrate từ một class component `PureComponent` sang một function {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

Chúng tôi khuyên bạn nên sử dụng function component thay vì [class component](/reference/react/Component) trong code mới. Nếu bạn có một số class component hiện có đang sử dụng `PureComponent`, đây là cách bạn có thể chuyển đổi chúng. Đây là code gốc:

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Xin chào{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Tên{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Địa chỉ{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Khi bạn [chuyển đổi component này từ một class sang một function,](/reference/react/Component#alternatives) hãy bọc nó trong [`memo`:](/reference/react/memo)

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Xin chào{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Tên{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Địa chỉ{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

Không giống như `PureComponent`, [`memo`](/reference/react/memo) không so sánh state mới và state cũ. Trong function component, việc gọi function [`set`](/reference/react/useState#setstate) với cùng một state [đã ngăn chặn việc re-render theo mặc định,](/reference/react/memo#updating-a-memoized-component-using-state) ngay cả khi không có `memo`.

</Note>
