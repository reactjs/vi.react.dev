---
id: typechecking-with-proptypes
title: Kiểm Tra Type Với PropTypes
permalink: docs/typechecking-with-proptypes.html
redirect_from:
  - "docs/react-api.html#typechecking-with-proptypes"
---

> Ghi chú:
>
> `React.PropTypes` đã được chuyển qua một package khác kể từ React v15.5. Hãy sử dụng [thư viện `prop-types` để thay thế](https://www.npmjs.com/package/prop-types).
>
>Chúng tôi cung cấp [tập lệnh codemod](/blog/2017/04/07/react-v15.5.0.html#migrating-from-reactproptypes) để thực hiện việc tự động chuyển đổi.

Khi ứng dụng của bạn phát phiển, bạn sẽ có thể bắt gặp rất nhiều bug với việc kiểm tra type (kiểu). Đối với một với ứng dụng, bạn có thể sử dụng các JavaScript extension như [Flow](https://flow.org/) hoặc [TypeScript](https://www.typescriptlang.org/) để kiểm tra type cho toàn bộ ứng dụng của bạn. Nhưng ngay cả khi bạn không sử dụng chúng, React vẫn có xây dựng sẵn một vài kiểu kiểm tra type. Để chạy kiểm tra type trên prop cho một component, bạn có thể assign một property là `propTypes`:

```javascript
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

Trong ví dụ này, chúng ta đang sử dụng một class component, nhưng nó cũng có thể áp tương tự với function component, hoặc component được tạo bởi [`React.memo`](/docs/react-api.html#reactmemo) hay [`React.forwardRef`](/docs/react-api.html#reactforwardref).

`PropTypes` sẽ export một loạt các validator nhằm đảm bảo rằng data (dữ liệu) được nhận vào là valid (hợp lệ). Trong ví dụ này, chúng ta sử dụng `PropTypes.string`. Khi một giá trị invalid (không hợp lệ) được cung cấp cho một prop, thì sẽ có một warning (cảnh báo) sẽ hiện lên bên trong JavaScript console. Vì lý do nhằm đảm bảo performance (hiệu suất), thì `propTypes` sẽ chỉ được kiểm tra trong quá môi trường development mode

### PropTypes {#proptypes}

Đây là một ví dụ về các validator (trình xác thực) khác mà đã được React cung cấp:

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // You can declare that a prop is a specific JS type. By default, these
  // are all optional.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  optionalNode: PropTypes.node,

  // A React element.
  optionalElement: PropTypes.element,

  // A React element type (ie. MyComponent).
  optionalElementType: PropTypes.elementType,

  // You can also declare that a prop is an instance of a class. This uses
  // JS's instanceof operator.
  optionalMessage: PropTypes.instanceOf(Message),

  // You can ensure that your prop is limited to specific values by treating
  // it as an enum.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // An object that could be one of many types
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // An array of a certain type
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // An object with property values of a certain type
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // An object taking on a particular shape
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // An object with warnings on extra properties
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number
  }),   

  // You can chain any of the above with `isRequired` to make sure a warning
  // is shown if the prop isn't provided.
  requiredFunc: PropTypes.func.isRequired,

  // A required value of any data type
  requiredAny: PropTypes.any.isRequired,

  // You can also specify a custom validator. It should return an Error
  // object if the validation fails. Don't `console.warn` or throw, as this
  // won't work inside `oneOfType`.
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // You can also supply a custom validator to `arrayOf` and `objectOf`.
  // It should return an Error object if the validation fails. The validator
  // will be called for each key in the array or object. The first two
  // arguments of the validator are the array or object itself, and the
  // current item's key.
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```

### Requiring Single Child {#requiring-single-child}

Với `PropTypes.element` bạn có thể chỉ định rằng chỉ có duy nhất một child có thể chuyển đến một component là children.

```javascript
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // This must be exactly one element or it will warn.
    const children = this.props.children;
    return (
      <div>
        {children}
      </div>
    );
  }
}

MyComponent.propTypes = {
  children: PropTypes.element.isRequired
};
```

### Default Prop Values {#default-prop-values}

Bạn có thể định nghĩa giá trị mặc định cho `props` của bạn bằng cách gán chúng cho một property là `defaultProps`:

```javascript
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// Specifies the default values for props:
Greeting.defaultProps = {
  name: 'Stranger'
};

// Renders "Hello, Stranger":
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

Nếu bạn đang sử dụng Babel transform như là [plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties/) (previously _plugin-transform-class-properties_), bạn cũng có thể khai báo `defaultProps` dưới dạng static property trong một React component class. Mặc dù vậy, cú pháp này vẫn chưa được hoàn thiện và sẽ yêu cầu qua một bước biên dịch để có thể hoạt động trên trình duyệt. Để biết thêm thông tin, hãy xem [class fields proposal](https://github.com/tc39/proposal-class-fields).

```javascript
class Greeting extends React.Component {
  static defaultProps = {
    name: 'stranger'
  }

  render() {
    return (
      <div>Hello, {this.props.name}</div>
    )
  }
}
```

Việc sử dụng `defaultProps` nhằm đảm bảo rằng `this.props.name` sẽ có một giá trị mặc định nếu nó không được chỉ định truyền vào bởi component cha. Việc kiểm tra type `propTypes` sẽ xảy ra sau khi `defaultProps` giải quyết xong, vậy nên việc kiểm tra type cũng sẽ áp dụng cho `defaultProps`.

### Function Components {#function-components}

Nếu bạn đang sử dụng các function component trong quá trình phát triển thông thường của mình, bạn có thể muốn thực hiện một số thay đổi nhỏ để cho phép PropTypes được áp dụng đúng cách.

Giả sử bạn có một component như sau:

```javascript
export default function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}
```

Để thêm PropTypes, bạn có thể khai báo component trong một hàm riêng trước khi export, như sau:

```javascript
function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}

export default HelloWorldComponent
```

Sau đó, bạn có thể thêm PropTypes trực tiếp vào `HelloWorldComponent`:

```javascript
import PropTypes from 'prop-types'

function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}

HelloWorldComponent.propTypes = {
  name: PropTypes.string
}

export default HelloWorldComponent
```
