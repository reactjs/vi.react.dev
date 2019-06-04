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

React áp dụng hệ thống DOM không phụ thuộc vào trình duyệt để tăng hiệu suất và độ tương thích với nhiều trình duyệt khác nhau. Nhân dịp này, chúng tôi đã chỉnh sửa một vài điểm không tương đồng trong cách làm việc với DOM của các trình duyệt.

Trong React, thuộc tính DOM va các sự kiện (properties và attributes, vd như id, class, value, data-attr, onclick, ...) phải được viết theo camelCase. Ví dụ như attribute `tabindex`, thì trong React là `tabIndex`. Có những ngoại lệ là thuộc tính `aria-*` và `data-*` phải được viết chữ thường. Ví dụ `aria-label` vẫn là `aria-label`.

## Sự khác biệt trong các thuộc tính {#differences-in-attributes}

Có một số sự khác biệt trong cách thuộc tính hoạt động trong React so với HTML:

### checked {#checked}

Thuộc tính `checked` trong các `<input>` có type là `checkbox` và `radio` được dùng để tạo controlled components, xem mục Controlled Components để biết thêm. `defaultChecked` được dùng để đặt giá trị ban đầu của input, được dùng để tạo Uncontrolled Components.

### className {#classname}

Để đặt CSS class cho các thẻ DOM hay SVG như `div`, `a`, ..., chúng ta sử dụng `className` thay vì `class` như thường lệ do bị đụng với từ khoá của ES6 class.

Nếu bạn sử dụng Web Components (trường hợp không phổ biến), thì vẫn dùng `class`.

### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}

`dangerouslySetInnerHTML` tương đương với `innerHTML` trong DOM. Nhìn chung, việc thay đổi DOM từ Javascript nguy hiểm do mình có thể vô tình để người dùng vô tình bị tấn công bởi [cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting). Vì vậy, trong React, bạn phải sử dụng `dangerouslySetInnerHTML` và truyền một object với key là `_html` để đề phòng. Ví dụ:

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

Sự kiện `onChange` hoạt động đúng như tên gọi của nó, được phát ra khi giá trị của `<input>` thay đổi. React dựa vào sự kiện này để xử lý đầu vào từ người dùng ở thời gian thực.

### selected {#selected}

The `selected` attribute is supported by `<option>` components. You can use it to set whether the component is selected. This is useful for building controlled components.

Thuộc tính `selected` được sử dụng trong `<option>` để đánh dấu option nào được chọn trong một `<select>` cho Controlled component.

### style {#style}

>Ghi chú
>
>Một vài ví dụ trong tài liệu này sử dụng `style` cho tiện, thực tế **sử dụng thuộc tính `style` tại chỗ không được khuyến khích .** Trong đa phần các trường hợp, [`className`](#classname) nên được dùng cùng với một file CSS rời để style. Thuộc tính `style` thường được dùng trong React để style động ví dụ như người dùng thay đổi màu hoặc font-size bằng một input. Xem thêm [FAQ: Styling and CSS](/docs/faq-styling.html).

Thuộc tính `style` nhận vào một object với các thuộc tính CSS ở dạng camelCase. Viết bằng camelCase để tích hợp với key của object trong Javascript, đồng thời mang lại sự nhất quán và chống tấn công XSS. Ví dụ:

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

Nhớ rắng styles không có tự động tương thích với các trình duyệt nên bạn phải tự thêm tiếp đầu ngữ vào. Ví dụ:

```js
const divStyle = {
  WebkitTransition: 'all', // nhớ là chữ 'W' được viết hoa
  msTransition: 'all' // 'ms' là tiếp đầu ngữ duy nhất được viết thường
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```

Các thuộc tính css được camelCase để đồng nhất với Javascript, vd `node.style.backgroundImage`. Các tiếp đầu ngữ [ngoài `ms`](https://www.andismith.com/blogs/2012/02/modernizr-prefixed/) phải được bắt đầu bằng một chữ hoa vd như `WebkitTransition`.

React sẽ tự động thêm "px" vào sau các giá trị số. Nếu bạn muốn sử dụng đơn vị khác, hãy dùng kiểu string thay vì number, vd:

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

Không phải thuộc tính nào cũng được thêm "px" vào sau. Các thuộc tính không có đơn vị sẽ được giữ nguyên, vd như `zoom`, `order`, `flex`. Tất cả các thuộc tính không có đơn vị có thể được tìm thấy [ở đây](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59).

### suppressContentEditableWarning {#suppresscontenteditablewarning}

Một component có component con được đánh dấu là `contentEditable` sẽ không hoạt động và sẽ được cảnh báo. Thuộc tính này sẽ bỏ đi cảnh báo, nhưng các bạn không cần thiết phải dùng nó trừ khi bạn đang xây dựng một thư viện làm việc trực tiếp với `contentEditable` như [Draft.js](https://facebook.github.io/draft-js/).

### suppressHydrationWarning {#suppresshydrationwarning}

Nếu bạn sử dụng server-side rendering, thông thường sẽ có một cảnh báo khi nội dung được render trên server khác với client. Tuy nhiên, trong một vài trường hợp, rất khó để đảm báo server và client trùng khớp với nhau vd như render timestamp.

Bằng cách đặt `suppressHydrationWarning` là `true`, React sẽ không cảnh báo khi nội dung của client và server không khớp nhau. Tuy nhiên `suppressHydrationWarning` chỉ được áp dụng cho một lớp component và chỉ nên sử dụng trong trường hợp bất khả kháng, không nên lạm dụng nó. Xem thêm về Hydration tại [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate).

### value {#value}

Thuộc tính `value` được dùng cho `<input>` và `<textarea>`. Bạn có thể dùng `value` để tạo nên Controlled components. Dùng `defaultValue` nếu muốn Uncontrolled components.

## Tất cả thuộc tính HTML được hỗ trợ {#all-supported-html-attributes}

As of React 16, any standard [or custom](/blog/2017/09/08/dom-attributes-in-react-16.html) DOM attributes are fully supported.

Trong React 16, [tất cả](/blog/2017/09/08/dom-attributes-in-react-16.html) thuộc tính DOM đều được hỗ trợ.

React đã luôn được viết với Javascript làm trọng tâm nên hầu hết các thuộc tính DOM đều được viết ở dạng `camelCase` tương tự như DOM API. Ví dụ như:

```js
<div tabIndex="-1" />      // tương tự node.tabIndex DOM API
<div className="Button" /> // tương tự node.className DOM API
<input readOnly={true} />  // tương tự node.readOnly DOM API
```

Những thuộc tính này gần giống với thuộc tính HTML, với những ngoại lệ liệt kê ở trên.

Một vài thuộc tính DOM dc React hỗ trợ như:

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

Bạn có thể sử dụng thuộc tính tự định ra nhưng phải được viết bằng chữ thường.
