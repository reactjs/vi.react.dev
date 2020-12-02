---
id: dom-elements
title: DOM Elements
layout: docs
category: Reference
permalink: docs/dom-elements.html
redirect_from:
  - "docs/tags-and-attributes.html"
  - "docs/dom-differences.html"
  - "docs/special-non-dom-attributes.html"
  - "docs/class-name-manipulation.html"
  - "tips/inline-styles.html"
  - "tips/style-props-value-px.html"
  - "tips/dangerously-set-inner-html.html"
---

React áp dụng hệ thống DOM không phụ thuộc vào trình duyệt để tăng hiệu suất và độ tương thích với nhiều trình duyệt khác nhau. Nhân dịp này, chúng tôi đã loại bỏ một số khía cạnh chưa hoàn chỉnh trong cách triển khai DOM trên trình duyệt.

Trong React, tất cả các thuộc tính của DOM (bao gồm xử lí sự kiện) phải được viết theo camelCase. Ví dụ như attribute `tabindex`, thì trong React là `tabIndex`. Có những ngoại lệ là thuộc tính `aria-*` và `data-*` phải được viết chữ thường. Ví dụ `aria-label` vẫn là `aria-label`.

## Sự khác biệt trong các thuộc tính {#differences-in-attributes}

Có một vài thuộc tính hoạt động khác biệt giữa React và HTML:

### checked {#checked}

Thuộc tính `checked` được hỗ trợ bởi các component `<input>` với kiểu `checkbox` hoặc `radio`. Bạn có thể dùng nó để thiết lập cho component có được checked hay chưa. Điều này hữu ích khi xây dựng những Component Kiểm Soát. `defaultChecked` là giá trị không kiểm soát, nó sẽ quyết định component có được chọn hay không khi nó được mount lần đầu tiên.

### className {#classname}

Để đặt class css, sử dụng thuộc tính className. Nó được sử dụng cho tất cả các phần tử DOM và SVG như `div`, `a` và những thuộc tính khác.

Nếu bạn sử dụng React với Web Components (trường hợp không phổ biến), thì vẫn dùng `class`.

### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}

`dangerouslySetInnerHTML` tương đương với `innerHTML` trong DOM. Nhìn chung, việc thay đổi DOM từ Javascript khá rủi ro do nó có thể vô tình để lộ người dùng [cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting). Vì vậy, React có thể tạo HTML trực tiếp, nhưng bạn phải sử dụng `dangerouslySetInnerHTML` và truyền một object với key là `_html` để nhăc bạn nhớ rằng điều này không an toàn. Ví dụ:

```js
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor {#htmlfor}

Do `for` là một từ khoá trong Javascript, React dùng `htmlFor`.

### onChange {#onchange}

Sự kiện `onChange` hoạt động đúng như tên gọi của nó: khi một giá trị của trường mẫu bị thay đổi, sự kiện này được phát ra. Chúng tôi cố tình không sử dụng hành vi của trình duyệt bởi vì `onChange` được hiểu sai bởi chính hành vi của nó và React dựa vào sự kiện này để xử lý đầu vào của người dùng trong thời gian thực.

### selected {#selected}

Thuộc tính `selected` được sử dụng trong `<option>` để đánh dấu option nào được chọn trong một `<select>`. Điều này hữu ích khi tạo ra các Component Kiểm Soát.
Nếu bạn muốn đánh dấu một `<option>` đã được select, tham chiếu giá trị của option đó bằng `value` của `<select>`. Tham khảo tại chi tiết tại ["Thẻ select [The select Tag]"](/docs/forms.html#the-select-tag).

### style {#style}

>Lưu ý
>
>Một vài ví dụ trong tài liệu này sử dụng `style` cho tiện, thực tế **sử dụng thuộc tính `style` trực tiếp không được khuyến khích .** Trong đa số các trường hợp, [`className`](#classname) nên được dùng cùng với một file CSS rời để style. Thuộc tính `style` thường được dùng trong React để trỏ tới những class được định nghiã ở stylesheet css bên ngoài. Xem thêm [FAQ: Styling and CSS](/docs/faq-styling.html).

Thuộc tính `style` nhận vào một object với các thuộc tính CSS ở dạng camelCase thay vì một chuỗi CSS. Nó sẽ nhất quán với thuộc tính `style` của Javascript trên DOM, hiệu quả hơn và đề phòng những lỗ hỗng bảo mật XSS. Ví dụ:

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

Nhớ rằng styles không tự động thêm tiền tố. Để tương thích với các trình duyệt nên bạn phải tự thêm tiền tố vào. Ví dụ:

```js
const divStyle = {
  WebkitTransition: 'all', // nhớ là chữ 'W' được viết hoa
  msTransition: 'all' // 'ms' là tiền tố duy nhất được viết thường
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```

Các từ khoá style được viết theo dạng camelCase để đồng nhất với việc truy cập các thuộc tính trên DOM từ Javascript, ví dụ `node.style.backgroundImage`. Các tiền tố [ngoài `ms`](https://www.andismith.com/blogs/2012/02/modernizr-prefixed/) phải được bắt đầu bằng một chữ hoa ví dụ như `WebkitTransition`.

React sẽ tự động thêm hậu tố "px" vào sau một vài kiểu thuộc tính số inline nhất định. Nếu bạn muốn sử dụng đơn vị khác ngoài 'px', hãy thêm đơn vị mong muốn dưới dạng chuỗi, ví dụ:

```js
// Result style: '10px'
<div style={{ height: 10 }}>
  Hello World!
</div>

// Result style: '10%'
<div style={{ height: '10%' }}>
  Hello World!
</div>
```

Không phải thuộc tính nào cũng được thêm hậu tố "px" vào sau. Các thuộc tính không có đơn vị sẽ được giữ nguyên, ví dụ như `zoom`, `order`, `flex`. Danh sách tất cả các thuộc tính không có đơn vị có thể được tìm thấy [ở đây](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59).

### suppressContentEditableWarning {#suppresscontenteditablewarning}

Một component có component con được đánh dấu là `contentEditable` sẽ không hoạt động và sẽ được cảnh báo. Thuộc tính này sẽ bỏ đi cảnh báo, nhưng các bạn không cần thiết phải dùng nó trừ khi bạn đang xây dựng một thư viện làm việc trực tiếp với `contentEditable` như [Draft.js](https://facebook.github.io/draft-js/).

### suppressHydrationWarning {#suppresshydrationwarning}

Nếu bạn sử dụng server-side rendering, thông thường sẽ có một cảnh báo khi nội dung được render trên server khác với client. Tuy nhiên, trong một vài trường hợp, rất khó để đảm báo server và client trùng khớp với nhau ví dụ như render timestamp.

Nếu bạn để `suppressHydrationWarning` là `true`, React sẽ không cảnh báo về những sự không trùng khớp trong những thuộc tính và nội dung của element đó. Nó chỉ hoạt động một cấp, và được dự định sử dụng như một lối thoát. Đừng lạm dụng nó. Bạn có thể xem thêm về hydration tại [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate).

### value {#value}

Thuộc tính `value` được hỗ trợ bởi những component `<input>`, `select` và `<textarea>`. Ban có thể sử dụng nó để đặt giá trị của component. Điều này là cần thiết để tạo Component Kiểm Soát. `defaultValue` là thuộc tính tương đương trong Component Không Kiểm Soát, nó đặt giá trị cho Component khi nó được mount lần đầu tiên.

## Tất cả thuộc tính HTML được hỗ trợ {#all-supported-html-attributes}

Trong React 16, [tất cả](/blog/2017/09/08/dom-attributes-in-react-16.html) thuộc tính DOM đều được hỗ trợ.

React luôn cung cấp một API với trọng tâm là javascript cho DOM. Bời vì những React component thường nhận những props được tuỳ chỉnh hoặc có liên quan tới DOM, React sử dụng quy ước `camelCase` như là các DOM APIs. Ví dụ như:

```js
<div tabIndex={-1} />      // Just like node.tabIndex DOM API
<div className="Button" /> // Just like node.className DOM API
<input readOnly={true} />  // Just like node.readOnly DOM API
```

Những thuộc tính này hoạt động tương tự với thuộc tính HTML, với những ngoại lệ liệt kê ở trên.

Một vài thuộc tính DOM được React hỗ trợ như:

```
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

Tượng tự, tất cả thuộc tính SVG hoàn toàn được hỗ trợ:

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
```

Bạn có thể sử dụng thuộc tính tự tạo nhưng phải được viết bằng chữ thường.
