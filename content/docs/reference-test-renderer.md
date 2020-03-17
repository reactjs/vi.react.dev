---
id: test-renderer
title: Test Renderer
permalink: docs/test-renderer.html
layout: docs
category: Reference
---

**Importing**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // ES5 với npm
```

## Sơ lược {#overview}

Gói này cung cấp một React Renderer để sử dụng cho việc render những React component thành những Javascript object, mà không cần dựa trên DOM hay một môi trường native mobile nào.

Về bản chất, gói này giúp cho việc chụp một bức tranh toàn cảnh của cấu trúc view (tương tự như cây DOM) được render bởi một component React DOM hay React Native mà không cần tới một trình duyệt hay [jsdom](https://github.com/tmpvar/jsdom).

Ví dụ:

```javascript
import TestRenderer from 'react-test-renderer';

function Link(props) {
  return <a href={props.page}>{props.children}</a>;
}

const testRenderer = TestRenderer.create(
  <Link page="https://www.facebook.com/">Facebook</Link>
);

console.log(testRenderer.toJSON());
// { type: 'a',
//   props: { href: 'https://www.facebook.com/' },
//   children: [ 'Facebook' ] }
```

Bạn có thể sử dụng chức năng chụp snapshot của Jest để tự động lưu một bản sao của cây JSON vào 1 tập tin và kiểm tra trong những bản thử của bạn rằng nó không thay đổi: [Xem thêm về nó](https://jestjs.io/docs/en/snapshot-testing).

Bạn cũng có thể đi qua đầu ra để tìm những node nhất định và kiểm tra độ chính xác của chúng.

```javascript
import TestRenderer from 'react-test-renderer';

function MyComponent() {
  return (
    <div>
      <SubComponent foo="bar" />
      <p className="my">Hello</p>
    </div>
  )
}

function SubComponent() {
  return (
    <p className="sub">Sub</p>
  );
}

const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;

expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
expect(testInstance.findByProps({className: "sub"}).children).toEqual(['Sub']);
```

### TestRenderer {#testrenderer}

* [`TestRenderer.create()`](#testrenderercreate)
* [`TestRenderer.act()`](#testrendereract)

### TestRenderer instance {#testrenderer-instance}

* [`testRenderer.toJSON()`](#testrenderertojson)
* [`testRenderer.toTree()`](#testrenderertotree)
* [`testRenderer.update()`](#testrendererupdate)
* [`testRenderer.unmount()`](#testrendererunmount)
* [`testRenderer.getInstance()`](#testrenderergetinstance)
* [`testRenderer.root`](#testrendererroot)

### TestInstance {#testinstance}

* [`testInstance.find()`](#testinstancefind)
* [`testInstance.findByType()`](#testinstancefindbytype)
* [`testInstance.findByProps()`](#testinstancefindbyprops)
* [`testInstance.findAll()`](#testinstancefindall)
* [`testInstance.findAllByType()`](#testinstancefindallbytype)
* [`testInstance.findAllByProps()`](#testinstancefindallbyprops)
* [`testInstance.instance`](#testinstanceinstance)
* [`testInstance.type`](#testinstancetype)
* [`testInstance.props`](#testinstanceprops)
* [`testInstance.parent`](#testinstanceparent)
* [`testInstance.children`](#testinstancechildren)

## Tài liệu tham khảo {#reference}

### `TestRenderer.create()` {#testrenderercreate}

```javascript
TestRenderer.create(element, options);
```

Tạo một instance `TestRenderer` với một element React trong tham số. No không sử dụng DOM thật, nhưng nó vẫn render cây component một cách đầy đủ vào trong bộ nhớ để bạn có thể kiểm định. Trả về một [TestRenderer instance](#testrenderer-instance)..

### `TestRenderer.act()` {#testrendereract}

```javascript
TestRenderer.act(callback);
```

Similar to the [`act()` helper from `react-dom/test-utils`](/docs/test-utils.html#act), `TestRenderer.act` prepares a component for assertions. Use this version of `act()` to wrap calls to `TestRenderer.create` and `testRenderer.update`.

```javascript
import {create, act} from 'react-test-renderer';
import App from './app.js'; // The component being tested

// render the component
let root; 
act(() => {
  root = create(<App value={1}/>)
});

// make assertions on root 
expect(root.toJSON()).toMatchSnapshot();

// update with some different props
act(() => {
  root.update(<App value={2}/>);
})

// make assertions on root 
expect(root.toJSON()).toMatchSnapshot();
```

### `testRenderer.toJSON()` {#testrenderertojson}

```javascript
testRenderer.toJSON()
```

Trả về một object thể hiện cậy được render. Cây này chỉ bao gồm các node riêng cho các nền tảng như `<div>` hay `<View>` và thuộc tính (prop) của chúng, nhưng không bao gồm bất kỳ component do người dùng viết. Việc này tiện cho [thử snapshot](https://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest).

### `testRenderer.toTree()` {#testrenderertotree}

```javascript
testRenderer.toTree()
```

Trả về một object thể hiện cậy được render. Không như `toJSON()`, sự thể hiện này chi tiết hơn kết quả được cung cấp bởi `toJSON()`, và nó bao gồm cả những component do người dùng viết. Bạn cỏ thể không cần hàm này trừ khi bạn đang viết thư viện kiểm định trên test renderer.

### `testRenderer.update()` {#testrendererupdate}

```javascript
testRenderer.update(element)
```

Render lại cây trong bộ nhớ với một element gốc mới. Việc này giả lập một sự cập nhật của React tại gốc. Nếu element mới có cùng loại (type) và key (khoá) với element trước, cây sẽ được cập nhật; nếu không, nó sẽ mount lại một cây mới.

### `testRenderer.unmount()` {#testrendererunmount}

```javascript
testRenderer.unmount()
```

Gỡ (unmount) cây trong bộ nhớ, phát ra các sự kiện vòng đời (lifecycle events) tương ứng.

### `testRenderer.getInstance()` {#testrenderergetinstance}

```javascript
testRenderer.getInstance()
```

Trả về một instance tương ứng với element gốc, nếu có. Việc này sẽ không hoạt động nếu element gốc là một function component vì nó không có intance.

### `testRenderer.root` {#testrendererroot}

```javascript
testRenderer.root
```

Trả về object "test instance" gốc hữu dụng cho việc kiểm định những node nhất định trong cây. Bạn có thể dùng nó để tìm những test instance" khác sâu bên dưới.

### `testInstance.find()` {#testinstancefind}

```javascript
testInstance.find(test)
```

Tìm một test instance ngay bên dưới khi `test(testInstance)` trả về `true`. Nếu `test(testInstance)` không trả về `true` cho đúng một test instance, một lỗi sẽ được ném ra.

### `testInstance.findByType()` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

Tìm một test instance ngay bên dưới với `type` được cung cấp. Nếu không có chính xác một test instance với `type` được cung cấp, nó sẽ ném ra một lỗi.

### `testInstance.findByProps()` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

Tìm một test instance ngay bên dưới với `props` được cung cấp. Nếu không có chính xác một test instance với `props` được cung cấp, nó sẽ ném ra một lỗi.

### `testInstance.findAll()` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

Tìm tất cả test instance ngay bên dưới khi `test(testInstance)` trả về `true`.

### `testInstance.findAllByType()` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

Tìm tất cả test instance với `type` được cung cấp.

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```

Tìm tất cả test instance với `props` được cung cấp.

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

Component instance tương ứng với test instance này. Nó chỉ khả dụng cho những class component, vì những function component không có instance. Nó tương đương với giá trị của `this` trong component.

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

Loại compoennt tương ứng với test instance này. Vi dụ, một component `<Button />` có loại là `Button`.

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

Thuộc tính (props) tương ứng với test instance này. Ví dụ, một component `<Button size="small" />` thì có props là `{size: 'small'}`

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

Test instance cha của test instance này.

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

Những test instance con của test instance này.

## Ý tưởng {#ideas}

Bạn có thể truyền hàm `createNodeMock` vào `TestRenderer.create` như một tuỳ chọn, nó cho phép tuỳ chỉnh mock refs.
`createNodeMock` nhận vào element hiện tại và sẽ trả về mốt object mock ref.
Việc này hữu dụng cho việc thử một component phụ thuộc vào refs.

```javascript
import TestRenderer from 'react-test-renderer';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    return <input type="text" ref={el => this.input = el} />
  }
}

let focused = false;
TestRenderer.create(
  <MyComponent />,
  {
    createNodeMock: (element) => {
      if (element.type === 'input') {
        // mock a focus function
        return {
          focus: () => {
            focused = true;
          }
        };
      }
      return null;
    }
  }
);
expect(focused).toBe(true);
```
