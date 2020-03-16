---
id: lifting-state-up
title: Chuyển state lên trên
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

Thông thường, khi một dữ liệu thay đổi nó sẽ ảnh hưởng tới nhiều component cùng lúc. State được khuyến khích chia sẻ ở component cha của chúng. Hãy cùng xem nó được ứng dụng trong thực tế như thế nào.

Chúng ta sẽ xây dựng một ứng dụng tính nhiệt độ. Nó sẽ cho người dùng biết nước có sôi ở nhiệt độ cho trước hay không.

Chúng ta sẽ bắt đầu với một component `BoilingVerdict`. Nhiệt độ `celsius` được truyền vào component này như là một prop, nó cũng sẽ hiển thị thông báo nếu như nhiệt độ đủ làm sôi nước hay không:

```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}
```

Tiếp theo, chúng ta sẽ tạo ra một component khác là `Calculator`. Nó sẽ có một `<input>` để người dùng nhập dữ liệu, và giữ giá trị đó trong `this.state.temperature`.

Thêm vào đó, nó sẽ tạo ra component `BoilingVerdict` với giá trị hiện tại của input.

```js{5,9,13,17-21}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>Enter temperature in Celsius:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </fieldset>
    );
  }
}
```

[**Xem trên CodePen**](https://codepen.io/gaearon/pen/ZXeOBm?editors=0010)

## Thêm Input thứ hai {#adding-a-second-input}

Yêu cầu mới là bên cạnh input cho Celsius, chúng ta cần cung cấp thêm một input cho Fahrenheit, và chúng phải đồng bộ hoá.

Chúng ta có thể bắt đầu bằng việc tách một component `TemperatureInput` ra từ `Calculator`. Nó sẽ được truyền vào một prop mới tên là `scale` mang một trong hai giá trị là `"c"` hoặc `"f"`:

```js{1-4,19,22}
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Bây giờ chúng ta có thể thay đổi để `Calculator` có thể tạo ra hai input riêng biệt cho nhiệt độ:

```js{5,6}
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

[**Xem thêm trên CodePen**](https://codepen.io/gaearon/pen/jGBryx?editors=0010)

Bây giờ, chúng ta đã có hai input, nhưng khi bạn nhập giá trị nhiệt độ vào một trong hai input, input còn lại không được cập nhật. Điều này chưa thoả mãn yêu cầu là hai input đồng bộ hoá.

Chúng ta cũng chưa thể hiển thị `BoilingVerdict` từ `Calculator`. `Calculator` không biết giá trị nhiệt độ hiện thời bởi vì nó bị ẩn đi bên trong component `TemperatureInput`.

## Viết các hàm để chuyển đổi {#writing-conversion-functions}

Đầu tiên chúng ta sẽ viết hai hàm để chuyển đổi từ Celsius sang Fahrenheit và ngược lại:

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

Có hai hàm để chuyển đổi nhiệt độ. Chúng ta sẽ viết thêm một hàm khác nhận các tham số truyền vào là một chuỗi `temperature` và một hàm chuyển đổi, sau đó nó sẽ trả lại một chuỗi. Chúng ta sẽ sử dụng nó để tính toán giá của của một input dựa trên input còn lại.

Nó sẽ trả lại một chuỗi rỗng nếu như tham số `temperature` không hợp lệ, và nó sẽ làm tròn kết quả với ba chữ số thập phân.

```js
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

Trong ví dụ, `tryConvert('abc', toCelsius)` trả về một chuỗi rỗng, và `tryConvert('10.22', toFahrenheit)` cho kết quả là `'50.396'`

## Chuyển state lên trên {#lifting-state-up}

Hiện tại, hai component `TemperatureInput` lưu trữ giá trị của chúng một cách riêng rẽ trong state cục bộ:

```js{5,9,13}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    // ...  
```

Tuy nhiên, chúng ta muốn hai input này được đồng bộ hoá. Khi chúng ta cập nhật nhiệt độ cho Celsius input, Fahrenheit input cũng phải được cập nhật nhiệt độ sau khi đã chuyển đổi và ngược lại.

Trong React, chia sẻ state được thực hiện bằng cách chuyển nó lên component cha gần nhất cần state này. Việc này được gọi là "chuyển state lên trên". Chúng ta sẽ xoá state cục bộ từ  `TemperatureInput` và chuyển nó tới `Calculator`.

Nếu `Calculator` nắm giữ state chia sẻ, nó sẽ trở thành "nguồn dữ liệu tin cậy" về nhiệt độ hiện tại cho cả hai input. Nó có thể cung cấp cho cả hai những giá trị phù hợp cho chúng. Vì các prop của cả hai component `TemperatureInput` đều đến từ cùng một component cha `Calculator`, nên chúng luôn luôn được đồng bộ hoá.

Hãy xem nó hoạt động thế nào qua từng bước.

Đầu tiên, chúng ta sẽ thay thế `this.state.temperature` với `this.props.temperature` trong component `TemperatureInput`. Hiện thời, hãy giả định rằng `this.props.temperature` đã tồn tại, mặc dù sau này nó sẽ truyền xuống từ component `Calculator`.

```js{3}
  render() {
    // Before: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

Chúng ta biết rằng [props không thể thay đổi](/docs/components-and-props.html#props-are-read-only). Lúc trước, khi `temperature` ở trong state cục bộ, component `TemperatureInput` chỉ cần gọi `this.setState()` để thay đổi nó. Tuy nhiên, khi `temperature` được truyền vào từ component cha như là một prop, thì `TemperatureInput` không có quyền kiểm soát nó nữa.

Trong React, điều này được giải quyết bằng cách tạo ra một component "kiểm soát". Cũng tương tự như DOM `<input>` chấp nhận thuộc tính `value` và `onChange`, thì tuỳ chỉnh `TemperatureInput` có thể chấp nhận cả `temperature` và `onTemperatureChange` props từ component cha `Calculator`.

Bây giờ, khi `TemperatureInput` muốn cập nhật nhiệt độ, nó gọi `this.props.onTemperatureChange`: 

```js{3}
  handleChange(e) {
    // Before: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```
>Chú ý:
>
>Tên của `temperature` hoặc `onTemperatureChange` prop không mang một ý nghĩa đặc biệt nào trong những component tuỳ chỉnh này. Chúng ta có thể gọi chúng bằng những cái tên khác, theo một cách phổ biến hơn, như đặt tên chúng là `value` và `onChange`.

Prop `onTemperatureChange` sẽ được truyền vào cùng với prop `temperature` bởi component cha `Calculator`. Khi prop thay đổi, nó sẽ sửa lại chính state cục bộ của nó, vì thế sẽ tạo lại cả hai input với các giá trị mới. Chúng ta sẽ cùng xem component `Calculator` được triển khai lại sau đây.

Trước khi tìm hiểu những thay đổi trong `Calculator`, hãy cùng điểm lại những thay đổi trong component `TemperatureInput`. Chúng ta đã xoá đi state cục bộ, và sử dụng `this.props.temperature` thay vì `this.state.temperature`. Khi chúng ta muốn thay đổi, việc gọi hàm `this.setState()` được thay bằng hàm `this.props.onTemperatureChange()` từ component cha `Calculator`:

```js{8,12}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```
Bây giờ hãy cùng chuyển sang component `Calculator`.

Chúng ta sẽ lưu trữ giá trị hiện thời của `temperature` và `scale` từ input vào trong state cục bộ của nó. Đây là state mà chúng ta muốn chuyển lên từ những input, và nó sẽ được sử dụng như là "nguồn dữ liệu tin cậy" cho cả hai. Nó là đại diện tối thiểu cho tất cả những dữ liệu chúng ta cần biết để tạo ra cả hai input.

Ví dụ, nếu chúng ta nhập 37 vào trong Celsius input, state của component `Calculator` sẽ là:

```js
{
  temperature: '37',
  scale: 'c'
}
```

Nếu chúng ta nhập 212 cho Fahrenheit, state của component `Calculator` sẽ là:

```js
{
  temperature: '212',
  scale: 'f'
}
```

Chúng ta có thể lưu trữ giá trị của cả hai input nhưng điều này là không cần thiết. Chúng ta chỉ cần lưu lại giá trị của input được thay đổi gần nhất, và đơn vị của nó. Chúng ta có thể tính ra giá trị của input còn lại dựa trên giá trị của `temperature` và `scale` hiện tại.

Các giá trị input sẽ được đồng bộ hoá bởi nó được tính toán từ cùng một state:

```js{6,10,14,18-21,27-28,31-32,34}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

[**làm thử trên CodePen**](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)

Bây giờ, bạn có thể thay đổi bất kì input nào, thì `this.state.temperature` và `this.state.scale` trong component `Calculator` sẽ được cập nhật. Giá trị của một input sẽ được giữ nguyên, như giá trị người dùng đã nhập vào, và giá trị của input còn lại sẽ được tính toán dựa trên giá trị đó.

Hãy cùng điểm lại điều gì sẽ xảy ra khi bạn thay đổi giá trị của một input:

<<<<<<< HEAD
* React sẽ gọi hàm `onChange` tương ứng trên DOM `<input>`. trong trường hợp này, đây là hàm `handleChange` trong component `TemperatureInput`.
* Hàm `handleChange` trong component `TemperatureInput` được gọi `this.props.onTemperatureChange()` và truyền vào một giá trị mới. Các props của nó, bao gồm `onTemperatureChange`, sẽ được component cha `Calculator` cung cấp.
* Trước đây, khi nó được tạo ra, component `Calculator` đã được lập trình rằng `onTemperatureChange` của Celsius `TemperatureInput` là hàm `handleCelsiusChange` của component `Calculator`, và `onTemperatureChange` của Fahrenheit `TemperatureInput` là hàm `handleFahrenheitChange` từ component `Calculator`. Vì thế nên một trong hai hàm của `Calculator` sẽ được gọi dựa trên input nào bị thay đổi.
* Bên trong các hàm này, component `Calculator` sẽ yêu cầu React để tạo lại chính nó bằng cách gọi `this.setState()` với giá trị mới từ input và đơn vị hiện tại của input bị thay đổi.
* React gọi hàm `render` từ component `Calculator` để xem giao diện người dùng trông như thế nào. Giá trị của cả hai input sẽ được tính toán lại dựa trên nhiệt độ hiện thời và đơn vị đo đang được sử dụng. Nhiệt độ được chuyển đổi tại đây.
* React gọi hàm `render` của mỗi component `TemperatureInput` riêng với giá trị mới của props được truyền từ `Calculator`. Nó sẽ hiểu được giao diện người dùng như thế nào.
* React gọi hàm `render` từ component `BoilingVerdict`, truyền nhiệt độ bằng Celsius như là một props của nó.
* React DOM cập nhật DOM với nhiệt độ sôi và để phù hợp với những giá trị mong muốn của input. Input chúng ta vừa thay đổi sẽ nhận giá trị hiện thời, và những input khác được cập nhật với nhiệt độ sau khi chuyển đổi.
=======
* React calls the function specified as `onChange` on the DOM `<input>`. In our case, this is the `handleChange` method in the `TemperatureInput` component.
* The `handleChange` method in the `TemperatureInput` component calls `this.props.onTemperatureChange()` with the new desired value. Its props, including `onTemperatureChange`, were provided by its parent component, the `Calculator`.
* When it previously rendered, the `Calculator` had specified that `onTemperatureChange` of the Celsius `TemperatureInput` is the `Calculator`'s `handleCelsiusChange` method, and `onTemperatureChange` of the Fahrenheit `TemperatureInput` is the `Calculator`'s `handleFahrenheitChange` method. So either of these two `Calculator` methods gets called depending on which input we edited.
* Inside these methods, the `Calculator` component asks React to re-render itself by calling `this.setState()` with the new input value and the current scale of the input we just edited.
* React calls the `Calculator` component's `render` method to learn what the UI should look like. The values of both inputs are recomputed based on the current temperature and the active scale. The temperature conversion is performed here.
* React calls the `render` methods of the individual `TemperatureInput` components with their new props specified by the `Calculator`. It learns what their UI should look like.
* React calls the `render` method of the `BoilingVerdict` component, passing the temperature in Celsius as its props.
* React DOM updates the DOM with the boiling verdict and to match the desired input values. The input we just edited receives its current value, and the other input is updated to the temperature after conversion.
>>>>>>> 2ef0ee1e4fc4ce620dce1f3e0530471195dc64d1

Tất cả những cập nhật đi qua cùng một lộ trình nên các input sẽ luôn được đồng bộ hoá.

## Bài học rút ra {#lessons-learned}

Cần có một nguồn "dữ liệu đáng tin cậy" cho bất kì một dữ liệu nào cần thay đổi trong ứng dụng React. Thường thì, state là cái đầu tiên mà component cần thêm vào để có thể tạo ra. Vì thế, nếu các component khác cũng cần nó, bạn có thể chuyển nó lên component cha gần nhất. Thay vì thử đồng bộ hoá state giữa những component khác nhau, bạn nên dựa trên [luồng dữ liệu từ trên xuống dưới](/docs/state-and-lifecycle.html#the-data-flows-down)

Chuyển state liên quan tới thêm vào nhiều code "chuẩn" hơn là phương pháp ràng buộc 2 chiều, nhưng nó có một ích là việc tìm và cô lập các lỗi sẽ dễ dàng hơn. Bởi vì bất kì một state "tồn tại" trong một vài component và chỉ mình component đó có thể thay đổi nó, phạm vi tìm kiếm lỗi sẽ giảm đi một cách đáng kể. Thêm vào đó, bạn có thể thêm vào bất kì tuỳ chỉnh logic nhằm từ chối hoặc chuyển đổi giá trị người dùng nhập vào.

Nếu một vài thứ có thể bắt nguồn từ props hoặc state, nó có thể không nên là state. Ví dụ, thay vì lưu trữ cả `celsiusValue` và `fahrenheitValue`, chúng ta sẽ lưu trữ giá trị được thay đổi gần nhất của `temperature` và `scale` của nó. Giá trị của input khác có thể được tính toán từ chúng trong hàm `render()`. Nó sẽ cho phép chúng ta dọn dẹp hoặc áp dụng để làm tròn giá trị của trường khác mà không làm mất đi tính chính xác của giá trị người dùng nhập vào.

<<<<<<< HEAD
Khi bạn thấy giao diện người dùng không chính xác, bạn có thể dùng [Công cụ phát triển React](https://github.com/facebook/react-devtools) để kiểm tra props và di chuyển lên theo cây component cho tới khi bạn có thể tìm thấy component chịu trách nhiệm cho việc cập nhật state. Nó sẽ giúp bạn theo dõi nguồn gốc của các lỗi:
=======
When you see something wrong in the UI, you can use [React Developer Tools](https://github.com/facebook/react/tree/master/packages/react-devtools) to inspect the props and move up the tree until you find the component responsible for updating the state. This lets you trace the bugs to their source:
>>>>>>> 81124465ac68335b2e3fdf21952a51265de6877f

<img src="../images/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" max-width="100%" height="100%">

