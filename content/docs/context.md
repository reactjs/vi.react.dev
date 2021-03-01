---
id: context
title: Context
permalink: docs/context.html
---

Context cung cấp phương pháp truyền data xuyên suốt component tree mà không cần phải truyền props một cách thủ công qua từng level.

Thông thường với một ứng dụng React, data được truyền từ trên xuống (cha tới con) thông qua props, điều này có vẻ khá cồng kềnh đối với một số loại props (Ví dụ như locale preference, UI theme) chúng thường được sử dụng bởi rất nhiều component trong ứng dụng. Context cung cấp một cách làm cho phép chúng ta chia sẽ values giống như vậy giữa các components mà không cần truyền giá trị tới tất cả level trong component tree.

- [Khi nào nên dùng Context](#when-to-use-context)
- [Trước khi bạn sử dụng Context](#before-you-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Context.Provider](#contextprovider)
  - [Class.contextType](#classcontexttype)
  - [Context.Consumer](#contextconsumer)
  - [Context.displayName](#contextdisplayname)
- [Ví dụ](#examples)
  - [Dynamic Context](#dynamic-context)
  - [Cập nhật Context từ Nested Component](#updating-context-from-a-nested-component)
  - [Sử dụng Multiple Contexts](#consuming-multiple-contexts)
- [Caveats](#caveats)
- [Legacy API](#legacy-api)

## Khi nào nên dùng Context {#when-to-use-context}

Context được thiết kế để chia sẽ data khi chúng được xem là "global data" của toàn bộ ứng dụng React, chẳng hạn như thông tin về user hiện tại đang đăng nhập, theme, hoặc ngôn ngữ mà người dùng đã chọn. Ví dụ, ở đoạn code bên dưới, chúng ta truyền một "theme" prop để style một Button component:

`embed:context/motivation-problem.js`

Sử dụng context, chúng ta có thể tránh được việc truyền props qua các elements trung gian:

`embed:context/motivation-solution.js`

## Trước khi bạn sử dụng Context {#before-you-use-context}

Context chủ yếu được sử dụng khi một số data cần được truy cập bởi *nhiều* components ở nhiều tầng khác nhau. Sử dụng nó một cách cẩn thận bởi vì điều đó sẽ làm component trở nên khó tái sử dụng hơn.

**Nếu bạn chỉ muốn dùng context để tránh việc truyền một số props qua nhiều levels, , [component composition](/docs/composition-vs-inheritance.html) thường là một giải pháp đơn giản hơn so với context.**

Ví dụ, một `Page` component truyền `user` và `avataSize` prop đến một số levels hạ cấp để `Link` và `Avatar` components có thể đọc được:

```js
<Page user={user} avatarSize={avatarSize} />
// ... được renders ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... được renders ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... được renders ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

Bạn có thể cảm thấy dư thừa khi truyền `user` và `avatarSize` props thông qua nhiều levels nếu chỉ có `Avatar` component thật sự cần đến nó. Nó cũng khá phiền toái mỗi khi `Avatar` component cần thêm props từ tầng trên cùng, bạn phải thêm tất những props đó ở tất cả những tầng trung gian.

Một cách để khắc phục vấn đề này mà **không dùng context** là [tự truyền `Avatar` component](/docs/composition-vs-inheritance.html#containment) bằng cách này, các components trung gian không cần phải giữ `user` hay `avataSize` props:

```js
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// Now, we have:
<Page user={user} avatarSize={avatarSize} />
// ... được renders ...
<PageLayout userLink={...} />
// ... được renders ...
<NavigationBar userLink={...} />
// ... được renders ...
{props.userLink}
```

Với sự thay đổi này, chỉ có tầng trên cùng của Page component biết được `Link` và `Avatar` components sử dụng `user` và `avatarSize`.

Sự *đảo ngược quyền kiểm soát (inversion of control)* này có thể giúp code của bạn rõ ràng hơn ở nhiều trường hợp bằng cách giảm số lượng props cần phải truyền xuyên suốt ứng dụng của và cho phép sự kiểm soát đến root component. Tuy nhiên, đây không phải là một sự lựa chọn tốt cho mọi trường hợp, di chuyển độ phức tạp lên mức cao hơn trong component tree khiến những component ở cấp cao (higher-level components) trở nên phức tạp và buộc cho những component ở mức thấp hơn (lower-level components) trở nên quá linh động.

Bạn không bị gới hạn vào một child duy nhất cho mỗi component. Bạn có thể truyền nhiều children, hay thậm chí là nhiều "slots" tách biệt cho children, [Như tài liệu ở đây](/docs/composition-vs-inheritance.html#containment):

```js
function Page(props) {
  const user = props.user;
  const content = <Feed user={user} />;
  const topBar = (
    <NavigationBar>
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    </NavigationBar>
  );
  return (
    <PageLayout
      topBar={topBar}
      content={content}
    />
  );
}
```

Pattern này hoàn toàn hiệu quả cho nhiều trường hợp khi bạn cần tách một child component từ những partents component trung gian của nó. Bạn có thể tiến xa hơn nữa với [render props](/docs/render-props.html) nếu child component cần giao tiếp với parent component trước khi render.

Tuy nhiên, đôi khi có những data trùng lặp cần được truy cập bởi nhiều components trong component tree, và ở nhiều tầng khác nhau. Context cho phép bạn "Phát sóng (broadcast)" những data như vậy, và trao đổi nó đến tất cả những components bên dưới. Ví dụ như khi sử dụng context có thể sẽ đơn giãn hơn so với những lựa chọn thay thế bao gồm quản lý current locale, theme, hay data caching.

## API {#api}

### `React.createContext` {#reactcreatecontext}

```js
const MyContext = React.createContext(defaultValue);
```

Tạo một Context object. Khi React render một component mà nó subcribe đến Context object này, nó sẽ đọc giá trị hiện tại của context đó từ `Provider` gần nhất trên component tree.

Đối số `defaultValue` **chỉ** sử dụng khi một component không có Provider nào bên trên nó trong component tree. Điều này có thể hữu dụng cho việc kiểm thử component một cách cô lập mà không cần phải wrap chúng lại. Lưu ý: truyền `undefined` như một giá trị Provider sẽ không khiến consuming components sử dụng `defaultValue`.

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* some value */}>
```

Mỗi Context object đi cùng với một Provider React component cho phép consuming component theo dõi sự thay đổi của context đó.

Provider component nhận một `value` prop để truyền đến consuming components mà nó là con của Provider này. Một Provider có thể kết nối đến nhiều comsumers. Providers có thể lồng nhau để ghi đè giá trị sâu hơn trong component tree.

Tất cả consumers con của một Provider sẽ được re-rerender bất cứ khi nào `value` của Provider đó thay đổi. Sự lan truyền từ Provider đến consumer con của nó (bao gồm [`.contextType`](#classcontexttype) và [`useContext`](/docs/hooks-reference.html#usecontext)) không bị lệ thuộc vào `shouldComponentUpdate` method, vì vậy consumer được cập nhật ngay cả khi một component cha thoát ra khỏi sự cập nhật đó.

Những thay đổi được xác định bằng cách so sánh những giá trị mới và cũ sử dụng chung một thuật toán như [`Object.is`](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).

> Lưu ý
>
> Cách những thay đổi được xác định có thể gây nên một số vấn đề khi truyền object như một `value`: xem [Caveats](#caveats).

### `Class.contextType` {#classcontexttype}

```js
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* Thực hiện một side-effect tại mount sử dụng giá trị của MyContext */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* render thứ gì đó dựa vào giá trị của MyContext */
  }
}
MyClass.contextType = MyContext;
```

`contextType` property trong một class có thể được gán vào một Context object tạo bởi [`React.createContext()`](#reactcreatecontext). Điều này giúp bạn tiêu thụ giá trị gần nhất ở thời điểm hiện tại của loại Context đó sử dụng `this.context`. Bạn có thể tham khảo điều này trong mọi lifecycle methods bao gồm render function.

> Lưu ý:
>
>Bạn chỉ có thể subcribe tới một context duy nhất sử dụng API này. Nếu bạn muốn đọc nhiều hơn một context, tham khảo [Consuming Multiple Contexts](#consuming-multiple-contexts).
>
>Bạn có thể sử dụng chức năng thử nghiệm [public class fields syntax](https://babeljs.io/docs/plugins/transform-class-properties/), bạn có thể sử dụng **static** class field để khởi tạo `contextType` của mình.


```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* render gì đó dựa vào value */
  }
}
```

### `Context.Consumer` {#contextconsumer}

```js
<MyContext.Consumer>
  {value => /* render gì đó dựa vào context value */}
</MyContext.Consumer>
```

Khi một React component subcribe tới sự thay đổi của context. Điều này cho phép bạn subcribe tới một context trong một [function component](/docs/components-and-props.html#function-and-class-components).

Yêu cầu một [function as a child](/docs/render-props.html#using-props-other-than-render). Function nhận giá trị context hiện tại và trả về một React node. Tham số `value` truyền đến function sẽ bằng với `value` prop của Provider gần nhất trong context này trên tree component. Nếu không có Provider nào cho context này ở trên nó, tham số `value` sẽ bằng với `defaultValue` đã được truyền tới `createContext()`.

> Lưu ý
>
> Để biết thêm thông tin về 'function as a child' pattern, xem [render props](/docs/render-props.html).

### `Context.displayName` {#contextdisplayname}

Context object nhận một thuộc tính `displayName` kiểu chuỗi (string). React DevTools sử dụng chuỗi này để xác định cái sẽ hiển thị cho context.

Với ví dụ dưới đây, component sẽ hiển thị như MyDisplayName trong DevTools:

```js{2}
const MyContext = React.createContext(/* vài giá trị */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" in DevTools
<MyContext.Consumer> // "MyDisplayName.Consumer" in DevTools
```

## Examples {#examples}

### Dynamic Context {#dynamic-context}

Một ví dụ phức tạp hơn với dynamic values cho theme:

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### Cập nhật Context từ một Nested Component {#updating-context-from-a-nested-component}

Chúng ta thường cần cập nhật context từ một component đã được lồng ở nơi nào đó sâu trong component tree. Trong trường hợp này bạn có thể truyền một function xuống context để cho phép consumers cập nhật context đó:

**theme-context.js**
`embed:context/updating-nested-context-context.js`

**theme-toggler-button.js**
`embed:context/updating-nested-context-theme-toggler-button.js`

**app.js**
`embed:context/updating-nested-context-app.js`

### Consuming nhiều Contexts {#consuming-multiple-contexts}

Để giữ context re-rendering nhanh chóng, React cần làm cho mỗi context consumer tách rời nhau trong component tree.

`embed:context/multiple-contexts.js`

Nếu có hai hoặc nhiều context values được dùng cùng nhau, bạn có thể sẽ muốn sử tạo render prop component của chính mình.

## Caveats {#caveats}

Bởi vì context sử dụng reference identity để xác định khi nào nên re-render, có một số vấn đề nguy hiểm có thể kích hoạt render một cách vô tình trong consumers khi một provider cha re-render. Ví dụ, đoạn code bên dưới sẽ re-render tất cả consumer mỗi lần Provider re-render bởi vì một object mới sẽ luôn được tạo cho `value`:

`embed:context/reference-caveats-problem.js`


Để giải quyết vấn đề này, nâng giá trị đó lên state của cha:

`embed:context/reference-caveats-solution.js`

## Legacy API {#legacy-api}

> Lưu ý
>
> React vừa mang đến một context API thử nghiệm. API cũ sẽ hỗ trợ trong tất cả phiên bản 16.x, nhưng những ứng dụng sử dụng nó nên nâng cấp lên phiên bản mới hơn. API cũ sẽ bị xóa trong tương lại qua những lần cập nhật lớn của React. Tham khảo [legacy context docs here](/docs/legacy-context.html).
