---
title: "Common components (e.g. <div>)"
---

<Intro>

Tất cả các thành phần trình duyệt tích hợp sẵn, chẳng hạn như [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div), đều hỗ trợ một số props và sự kiện chung.

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### Các thành phần chung (ví dụ: `<div>`) {/*common*/}

```js
<div className="wrapper">Một số nội dung</div>
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*common-props*/}

Các React props đặc biệt này được hỗ trợ cho tất cả các thành phần tích hợp sẵn:

* `children`: Một React node (một phần tử, một chuỗi, một số, [một portal,](/reference/react-dom/createPortal) một node trống như `null`, `undefined` và boolean, hoặc một mảng các React node khác). Chỉ định nội dung bên trong thành phần. Khi bạn sử dụng JSX, bạn thường chỉ định prop `children` một cách ngầm định bằng cách lồng các thẻ như `<div><span /></div>`.

* `dangerouslySetInnerHTML`: Một đối tượng có dạng `{ __html: '<p>some html</p>' }` với một chuỗi HTML thô bên trong. Ghi đè thuộc tính [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) của DOM node và hiển thị HTML đã truyền bên trong. Điều này nên được sử dụng hết sức thận trọng! Nếu HTML bên trong không đáng tin cậy (ví dụ: nếu nó dựa trên dữ liệu người dùng), bạn có nguy cơ đưa vào lỗ hổng [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). [Đọc thêm về cách sử dụng `dangerouslySetInnerHTML`.](#dangerously-setting-the-inner-html)

* `ref`: Một đối tượng ref từ [`useRef`](/reference/react/useRef) hoặc [`createRef`](/reference/react/createRef), hoặc một hàm callback [`ref`,](#ref-callback) hoặc một chuỗi cho [legacy refs.](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) Ref của bạn sẽ được điền vào DOM element cho node này. [Đọc thêm về thao tác DOM với ref.](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: Một boolean. Nếu `true`, sẽ ngăn chặn cảnh báo mà React hiển thị cho các phần tử vừa có `children` vừa có `contentEditable={true}` (thường không hoạt động cùng nhau). Sử dụng điều này nếu bạn đang xây dựng một thư viện nhập văn bản quản lý nội dung `contentEditable` theo cách thủ công.

* `suppressHydrationWarning`: Một boolean. Nếu bạn sử dụng [server rendering,](/reference/react-dom/server) thông thường sẽ có một cảnh báo khi server và client hiển thị nội dung khác nhau. Trong một số trường hợp hiếm hoi (như dấu thời gian), rất khó hoặc không thể đảm bảo sự khớp chính xác. Nếu bạn đặt `suppressHydrationWarning` thành `true`, React sẽ không cảnh báo bạn về sự không khớp trong các thuộc tính và nội dung của phần tử đó. Nó chỉ hoạt động ở một cấp độ sâu và được dự định sử dụng như một lối thoát hiểm. Không nên lạm dụng nó. [Đọc về cách ngăn chặn các lỗi không khớp hydration không thể tránh khỏi.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

* `style`: Một đối tượng với các kiểu CSS, ví dụ: `{ fontWeight: 'bold', margin: 20 }`. Tương tự như thuộc tính [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) của DOM, tên thuộc tính CSS cần được viết dưới dạng `camelCase`, ví dụ: `fontWeight` thay vì `font-weight`. Bạn có thể truyền chuỗi hoặc số làm giá trị. Nếu bạn truyền một số, như `width: 100`, React sẽ tự động thêm `px` ("pixel") vào giá trị trừ khi đó là một [unitless property.](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) Chúng tôi khuyên bạn chỉ nên sử dụng `style` cho các kiểu động, nơi bạn không biết trước các giá trị kiểu. Trong các trường hợp khác, việc áp dụng các lớp CSS đơn giản với `className` sẽ hiệu quả hơn. [Đọc thêm về `className` và `style`.](#applying-css-styles)

Các DOM props tiêu chuẩn này cũng được hỗ trợ cho tất cả các thành phần tích hợp sẵn:

* [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): Một chuỗi. Chỉ định một phím tắt cho phần tử. [Không được khuyến nghị chung.](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): Các thuộc tính ARIA cho phép bạn chỉ định thông tin cây trợ năng cho phần tử này. Xem [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) để có tài liệu tham khảo đầy đủ. Trong React, tất cả các tên thuộc tính ARIA đều giống hệt như trong HTML.
* [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): Một chuỗi. Chỉ định xem và cách nhập liệu của người dùng nên được viết hoa.
* [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): Một chuỗi. Chỉ định tên lớp CSS của phần tử. [Đọc thêm về cách áp dụng các kiểu CSS.](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): Một boolean. Nếu `true`, trình duyệt cho phép người dùng chỉnh sửa trực tiếp phần tử được hiển thị. Điều này được sử dụng để triển khai các thư viện nhập văn bản đa dạng thức như [Lexical.](https://lexical.dev/) React cảnh báo nếu bạn cố gắng truyền React children cho một phần tử có `contentEditable={true}` vì React sẽ không thể cập nhật nội dung của nó sau khi người dùng chỉnh sửa.
* [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): Các thuộc tính dữ liệu cho phép bạn đính kèm một số dữ liệu chuỗi vào phần tử, ví dụ: `data-fruit="banana"`. Trong React, chúng không được sử dụng phổ biến vì bạn thường sẽ đọc dữ liệu từ props hoặc state thay thế.
* [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): Hoặc `'ltr'` hoặc `'rtl'`. Chỉ định hướng văn bản của phần tử.
* [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): Một boolean. Chỉ định xem phần tử có thể kéo được hay không. Một phần của [HTML Drag and Drop API.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): Một chuỗi. Chỉ định hành động nào sẽ hiển thị cho phím enter trên bàn phím ảo.
* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): Một chuỗi. Đối với [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) và [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output), cho phép bạn [liên kết nhãn với một số điều khiển.](/reference/react-dom/components/input#providing-a-label-for-an-input) Tương tự như thuộc tính HTML [`for`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for). React sử dụng tên thuộc tính DOM tiêu chuẩn (`htmlFor`) thay vì tên thuộc tính HTML.
* [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): Một boolean hoặc một chuỗi. Chỉ định xem phần tử có nên bị ẩn hay không.
* [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): Một chuỗi. Chỉ định một mã định danh duy nhất cho phần tử này, có thể được sử dụng để tìm nó sau này hoặc kết nối nó với các phần tử khác. Tạo nó bằng [`useId`](/reference/react/useId) để tránh xung đột giữa nhiều phiên bản của cùng một thành phần.
* [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): Một chuỗi. Nếu được chỉ định, thành phần sẽ hoạt động như một [custom element.](/reference/react-dom/components#custom-html-elements)
* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): Một chuỗi. Chỉ định loại bàn phím nào sẽ hiển thị (ví dụ: văn bản, số hoặc điện thoại).
* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): Một chuỗi. Chỉ định thuộc tính nào phần tử đại diện cho trình thu thập dữ liệu có cấu trúc.
* [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): Một chuỗi. Chỉ định ngôn ngữ của phần tử.
* [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): Một hàm xử lý [`AnimationEvent`](#animationevent-handler). Kích hoạt khi một CSS animation hoàn thành.
* `onAnimationEndCapture`: Một phiên bản của `onAnimationEnd` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): Một hàm xử lý [`AnimationEvent`](#animationevent-handler). Kích hoạt khi một vòng lặp của CSS animation kết thúc và một vòng lặp khác bắt đầu.
* `onAnimationIterationCapture`: Một phiên bản của `onAnimationIteration` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): Một hàm xử lý [`AnimationEvent`](#animationevent-handler). Kích hoạt khi một CSS animation bắt đầu.
* `onAnimationStartCapture`: `onAnimationStart`, nhưng kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): Một hàm xử lý [`MouseEvent`](#mouseevent-handler). Kích hoạt khi một nút con trỏ không phải là nút chính được nhấp.
* `onAuxClickCapture`: Một phiên bản của `onAuxClick` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* `onBeforeInput`: Một hàm xử lý [`InputEvent`](#inputevent-handler). Kích hoạt trước khi giá trị của một phần tử có thể chỉnh sửa được sửa đổi. React *chưa* sử dụng sự kiện [`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event) gốc và thay vào đó cố gắng polyfill nó bằng các sự kiện khác.
* `onBeforeInputCapture`: Một phiên bản của `onBeforeInput` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* `onBlur`: Một hàm xử lý [`FocusEvent`](#focusevent-handler). Kích hoạt khi một phần tử mất focus. Không giống như sự kiện [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) của trình duyệt tích hợp, trong React, sự kiện `onBlur` nổi lên.
* `onBlurCapture`: Một phiên bản của `onBlur` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): Một hàm xử lý [`MouseEvent`](#mouseevent-handler). Kích hoạt khi nút chính được nhấp trên thiết bị trỏ.
* `onClickCapture`: Một phiên bản của `onClick` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): Một hàm xử lý [`CompositionEvent`](#compositionevent-handler). Kích hoạt khi một [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) bắt đầu một phiên soạn thảo mới.
* `onCompositionStartCapture`: Một phiên bản của `onCompositionStart` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): Một hàm xử lý [`CompositionEvent`](#compositionevent-handler). Kích hoạt khi một [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) hoàn thành hoặc hủy một phiên soạn thảo.
* `onCompositionEndCapture`: Một phiên bản của `onCompositionEnd` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): Một hàm xử lý [`CompositionEvent`](#compositionevent-handler). Kích hoạt khi một [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) nhận được một ký tự mới.
* `onCompositionUpdateCapture`: Một phiên bản của `onCompositionUpdate` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): Một hàm xử lý [`MouseEvent`](#mouseevent-handler). Kích hoạt khi người dùng cố gắng mở một context menu.
* `onContextMenuCapture`: Một phiên bản của `onContextMenu` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): Một hàm xử lý [`ClipboardEvent`](#clipboardevent-handler). Kích hoạt khi người dùng cố gắng sao chép một cái gì đó vào clipboard.
* `onCopyCapture`: Một phiên bản của `onCopy` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): Một hàm xử lý [`ClipboardEvent`](#clipboardevent-handler). Kích hoạt khi người dùng cố gắng cắt một cái gì đó vào clipboard.
* `onCutCapture`: Một phiên bản của `onCut` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* `onDoubleClick`: Một hàm xử lý [`MouseEvent`](#mouseevent-handler). Kích hoạt khi người dùng nhấp đúp. Tương ứng với sự kiện [`dblclick` của trình duyệt.](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event)
* `onDoubleClickCapture`: Một phiên bản của `onDoubleClick` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): Một hàm xử lý [`DragEvent`](#dragevent-handler). Kích hoạt khi người dùng đang kéo một cái gì đó.
* `onDragCapture`: Một phiên bản của `onDrag` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): Một hàm xử lý [`DragEvent`](#dragevent-handler). Kích hoạt khi người dùng ngừng kéo một cái gì đó.
* `onDragEndCapture`: Một phiên bản của `onDragEnd` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): Một hàm xử lý [`DragEvent`](#dragevent-handler). Kích hoạt khi nội dung được kéo vào một mục tiêu thả hợp lệ.
* `onDragEnterCapture`: Một phiên bản của `onDragEnter` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): Một hàm xử lý [`DragEvent`](#dragevent-handler). Kích hoạt trên một mục tiêu thả hợp lệ trong khi nội dung được kéo đang được kéo qua nó. Bạn phải gọi `e.preventDefault()` ở đây để cho phép thả.
* `onDragOverCapture`: Một phiên bản của `onDragOver` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): Một hàm xử lý [`DragEvent`](#dragevent-handler). Kích hoạt khi người dùng bắt đầu kéo một phần tử.
* `onDragStartCapture`: Một phiên bản của `onDragStart` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): Một hàm xử lý [`DragEvent`](#dragevent-handler). Kích hoạt khi một cái gì đó được thả trên một mục tiêu thả hợp lệ.
* `onDropCapture`: Một phiên bản của `onDrop` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* `onFocus`: Một hàm xử lý [`FocusEvent`](#focusevent-handler). Kích hoạt khi một phần tử nhận được focus. Không giống như sự kiện [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event) của trình duyệt tích hợp, trong React, sự kiện `onFocus` nổi lên.
* `onFocusCapture`: Một phiên bản của `onFocus` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): Một hàm xử lý [`PointerEvent`](#pointerevent-handler). Kích hoạt khi một phần tử chụp một con trỏ theo chương trình.
* `onGotPointerCaptureCapture`: Một phiên bản của `onGotPointerCapture` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): Một hàm xử lý [`KeyboardEvent`](#keyboardevent-handler). Kích hoạt khi một phím được nhấn.
* `onKeyDownCapture`: Một phiên bản của `onKeyDown` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): Một hàm xử lý [`KeyboardEvent`](#keyboardevent-handler). Đã không còn được dùng. Sử dụng `onKeyDown` hoặc `onBeforeInput` thay thế.
* `onKeyPressCapture`: Một phiên bản của `onKeyPress` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): Một hàm xử lý [`KeyboardEvent`](#keyboardevent-handler). Kích hoạt khi một phím được nhả ra.
* `onKeyUpCapture`: Một phiên bản của `onKeyUp` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): Một hàm xử lý [`PointerEvent`](#pointerevent-handler). Kích hoạt khi một phần tử ngừng chụp một con trỏ.
* `onLostPointerCaptureCapture`: Một phiên bản của `onLostPointerCapture` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): Một hàm xử lý [`MouseEvent`](#mouseevent-handler). Kích hoạt khi con trỏ được nhấn xuống.
* `onMouseDownCapture`: Một phiên bản của `onMouseDown` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): Một hàm xử lý [`MouseEvent`](#mouseevent-handler). Kích hoạt khi con trỏ di chuyển vào bên trong một phần tử. Không có giai đoạn capture. Thay vào đó, `onMouseLeave` và `onMouseEnter` lan truyền từ phần tử bị rời đi đến phần tử được nhập vào.
* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): Một hàm xử lý [`MouseEvent`](#mouseevent-handler). Kích hoạt khi con trỏ di chuyển ra bên ngoài một phần tử. Không có giai đoạn capture. Thay vào đó, `onMouseLeave` và `onMouseEnter` lan truyền từ phần tử bị rời đi đến phần tử được nhập vào.
* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): Một hàm xử lý [`MouseEvent`](#mouseevent-handler). Kích hoạt khi con trỏ thay đổi tọa độ.
* `onMouseMoveCapture`: Một phiên bản của `onMouseMove` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): Một hàm xử lý [`MouseEvent`](#mouseevent-handler). Kích hoạt khi con trỏ di chuyển ra bên ngoài một phần tử hoặc nếu nó di chuyển vào một phần tử con.
* `onMouseOutCapture`: Một phiên bản của `onMouseOut` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): Một hàm xử lý [`MouseEvent`](#mouseevent-handler). Kích hoạt khi con trỏ được nhả ra.
* `onMouseUpCapture`: Một phiên bản của `onMouseUp` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): Một hàm xử lý [`PointerEvent`](#pointerevent-handler). Kích hoạt khi trình duyệt hủy một tương tác con trỏ.
* `onPointerCancelCapture`: Một phiên bản của `onPointerCancel` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): Một hàm xử lý [`PointerEvent`](#pointerevent-handler). Kích hoạt khi một con trỏ trở nên hoạt động.
* `onPointerDownCapture`: Một phiên bản của `onPointerDown` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): Một hàm xử lý [`PointerEvent`](#pointerevent-handler). Kích hoạt khi một con trỏ di chuyển vào bên trong một phần tử. Không có giai đoạn capture. Thay vào đó, `onPointerLeave` và `onPointerEnter` lan truyền từ phần tử bị rời đi đến phần tử được nhập vào.
* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): Một hàm xử lý [`PointerEvent`](#pointerevent-handler). Kích hoạt khi một con trỏ di chuyển ra bên ngoài một phần tử. Không có giai đoạn capture. Thay vào đó, `onPointerLeave` và `onPointerEnter` lan truyền từ phần tử bị rời đi đến phần tử được nhập vào.
* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): Một hàm xử lý [`PointerEvent`](#pointerevent-handler). Kích hoạt khi một con trỏ thay đổi tọa độ.
* `onPointerMoveCapture`: Một phiên bản của `onPointerMove` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): Một hàm xử lý [`PointerEvent`](#pointerevent-handler). Kích hoạt khi một con trỏ di chuyển ra bên ngoài một phần tử, nếu tương tác con trỏ bị hủy và [một vài lý do khác.](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event)
* `onPointerOutCapture`: Một phiên bản của `onPointerOut` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): Một hàm xử lý [`PointerEvent`](#pointerevent-handler). Kích hoạt khi một con trỏ không còn hoạt động.
* `onPointerUpCapture`: Một phiên bản của `onPointerUp` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): Một hàm xử lý [`ClipboardEvent`](#clipboardevent-handler). Kích hoạt khi người dùng cố gắng dán một cái gì đó từ clipboard.
* `onPasteCapture`: Một phiên bản của `onPaste` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi một phần tử đã được cuộn. Sự kiện này không nổi lên.
* `onScrollCapture`: Một phiên bản của `onScroll` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt sau khi lựa chọn bên trong một phần tử có thể chỉnh sửa như một input thay đổi. React mở rộng sự kiện `onSelect` để hoạt động cho các phần tử `contentEditable={true}`. Ngoài ra, React mở rộng nó để kích hoạt cho lựa chọn trống và khi chỉnh sửa (có thể ảnh hưởng đến lựa chọn).
* `onSelectCapture`: Một phiên bản của `onSelect` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): Một hàm xử lý [`TouchEvent`](#touchevent-handler). Kích hoạt khi trình duyệt hủy một tương tác chạm.
* `onTouchCancelCapture`: Một phiên bản của `onTouchCancel` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): Một hàm xử lý [`TouchEvent`](#touchevent-handler). Kích hoạt khi một hoặc nhiều điểm chạm bị xóa.
* `onTouchEndCapture`: Một phiên bản của `onTouchEnd` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): Một hàm xử lý [`TouchEvent`](#touchevent-handler). Kích hoạt khi một hoặc nhiều điểm chạm được di chuyển.
* `onTouchMoveCapture`: Một phiên bản của `onTouchMove` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): Một hàm xử lý [`TouchEvent`](#touchevent-handler). Kích hoạt khi một hoặc nhiều điểm chạm được đặt.
* `onTouchStartCapture`: Một phiên bản của `onTouchStart` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): Một hàm xử lý [`TransitionEvent`](#transitionevent-handler). Kích hoạt khi một CSS transition hoàn thành.
* `onTransitionEndCapture`: Một phiên bản của `onTransitionEnd` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): Một hàm xử lý [`WheelEvent`](#wheelevent-handler). Kích hoạt khi người dùng xoay một nút bánh xe.
* `onWheelCapture`: Một phiên bản của `onWheel` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Một chuỗi. Chỉ định vai trò của phần tử một cách rõ ràng cho các công nghệ hỗ trợ.
* [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Một chuỗi. Chỉ định tên slot khi sử dụng shadow DOM. Trong React, một mẫu tương đương thường đạt được bằng cách truyền JSX làm props, ví dụ: `<Layout left={<Sidebar />} right={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): Một boolean hoặc null. Nếu được đặt rõ ràng thành `true` hoặc `false`, sẽ bật hoặc tắt kiểm tra chính tả.
* [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): Một số. Ghi đè hành vi nút Tab mặc định. [Tránh sử dụng các giá trị khác `-1` và `0`.](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): Một chuỗi. Chỉ định văn bản tooltip cho phần tử.
* [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): Hoặc `'yes'` hoặc `'no'`. Truyền `'no'` loại trừ nội dung phần tử khỏi việc được dịch.
Bạn cũng có thể truyền các thuộc tính tùy chỉnh dưới dạng props, ví dụ: `mycustomprop="someValue"`. Điều này có thể hữu ích khi tích hợp với các thư viện của bên thứ ba. Tên thuộc tính tùy chỉnh phải là chữ thường và không được bắt đầu bằng `on`. Giá trị sẽ được chuyển đổi thành một chuỗi. Nếu bạn truyền `null` hoặc `undefined`, thuộc tính tùy chỉnh sẽ bị xóa.

Các sự kiện này chỉ kích hoạt cho các phần tử [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form):

* [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi một biểu mẫu được đặt lại.
* `onResetCapture`: Một phiên bản của `onReset` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onSubmit`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi một biểu mẫu được gửi.
* `onSubmitCapture`: Một phiên bản của `onSubmit` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)

Các sự kiện này chỉ kích hoạt cho các phần tử [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog). Không giống như các sự kiện của trình duyệt, chúng nổi lên trong React:

* [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi người dùng cố gắng đóng hộp thoại.
* `onCancelCapture`: Một phiên bản của `onCancel` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi một hộp thoại đã được đóng.
* `onCloseCapture`: Một phiên bản của `onClose` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)

Các sự kiện này chỉ kích hoạt cho các phần tử [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details). Không giống như các sự kiện của trình duyệt, chúng nổi lên trong React:

* [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi người dùng bật tắt các chi tiết.
* `onToggleCapture`: Một phiên bản của `onToggle` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)

Các sự kiện này kích hoạt cho các phần tử [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) và SVG [`<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag). Không giống như các sự kiện của trình duyệt, chúng nổi lên trong React:

* `onLoad`: Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi tài nguyên đã tải.
* `onLoadCapture`: Một phiên bản của `onLoad` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi tài nguyên không thể tải.
* `onErrorCapture`: Một phiên bản của `onError` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)

Các sự kiện này kích hoạt cho các tài nguyên như [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) và [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). Không giống như các sự kiện của trình duyệt, chúng nổi lên trong React:

* [`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi tài nguyên chưa được tải đầy đủ, nhưng không phải do lỗi.
* `onAbortCapture`: Một phiên bản của `onAbort` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi có đủ dữ liệu để bắt đầu phát, nhưng không đủ để phát đến cuối mà không cần bộ đệm.
* `onCanPlayCapture`: Một phiên bản của `onCanPlay` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi có đủ dữ liệu để có thể bắt đầu phát mà không cần bộ đệm cho đến cuối.
* `onCanPlayThroughCapture`: Một phiên bản của `onCanPlayThrough` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi thời lượng phương tiện đã được cập nhật.
* `onDurationChangeCapture`: Một phiên bản của `onDurationChange` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi phương tiện đã trở nên trống.
* `onEmptiedCapture`: Một phiên bản của `onEmptied` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi trình duyệt gặp phương tiện được mã hóa.
* `onEncryptedCapture`: Một phiên bản của `onEncrypted` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi quá trình phát dừng vì không còn gì để phát.
* `onEndedCapture`: Một phiên bản của `onEnded` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi tài nguyên không thể tải.
* `onErrorCapture`: Một phiên bản của `onError` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi khung phát lại hiện tại đã tải.
* `onLoadedDataCapture`: Một phiên bản của `onLoadedData` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi siêu dữ liệu đã tải.
* `onLoadedMetadataCapture`: Một phiên bản của `onLoadedMetadata` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi trình duyệt bắt đầu tải tài nguyên.
* `onLoadStartCapture`: Một phiên bản của `onLoadStart` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi phương tiện bị tạm dừng.
* `onPauseCapture`: Một phiên bản của `onPause` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi phương tiện không còn bị tạm dừng.
* `onPlayCapture`: Một phiên bản của `onPlay` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi phương tiện bắt đầu hoặc khởi động lại phát.
* `onPlayingCapture`: Một phiên bản của `onPlaying` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt định kỳ trong khi tài nguyên đang tải.
* `onProgressCapture`: Một phiên bản của `onProgress` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi tốc độ phát lại thay đổi.
* `onRateChangeCapture`: Một phiên bản của `onRateChange` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* `onResize`: Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi video thay đổi kích thước.
* `onResizeCapture`: Một phiên bản của `onResize` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi một thao tác tìm kiếm hoàn tất.
* `onSeekedCapture`: Một phiên bản của `onSeeked` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi một thao tác tìm kiếm bắt đầu.
* `onSeekingCapture`: Một phiên bản của `onSeeking` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi trình duyệt đang chờ dữ liệu nhưng nó vẫn không tải.
* `onStalledCapture`: Một phiên bản của `onStalled` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi tải tài nguyên bị tạm dừng.
* `onSuspendCapture`: Một phiên bản của `onSuspend` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi thời gian phát lại hiện tại được cập nhật.
* `onTimeUpdateCapture`: Một phiên bản của `onTimeUpdate` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi âm lượng đã thay đổi.
* `onVolumeChangeCapture`: Một phiên bản của `onVolumeChange` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): Một hàm xử lý [`Event`](#event-handler). Kích hoạt khi quá trình phát dừng do tạm thời thiếu dữ liệu.
* `onWaitingCapture`: Một phiên bản của `onWaiting` kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)

#### Lưu ý {/*common-caveats*/}

- Bạn không thể truyền cả `children` và `dangerouslySetInnerHTML` cùng một lúc.
- Một số sự kiện (như `onAbort` và `onLoad`) không nổi lên trong trình duyệt, nhưng nổi lên trong React.

---

### Hàm callback `ref` {/*ref-callback*/}

Thay vì một đối tượng ref (như đối tượng được trả về bởi [`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref)), bạn có thể truyền một hàm cho thuộc tính `ref`.

```js
<div ref={(node) => {
  console.log('Đã gắn', node);

  return () => {
    console.log('Dọn dẹp', node)
  }
}}>
```

[Xem một ví dụ về cách sử dụng callback `ref`.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

Khi nút DOM `<div>` được thêm vào màn hình, React sẽ gọi callback `ref` của bạn với `node` DOM làm đối số. Khi nút DOM `<div>` đó bị xóa, React sẽ gọi hàm dọn dẹp được trả về từ callback của bạn.

React cũng sẽ gọi callback `ref` của bạn bất cứ khi nào bạn truyền một callback `ref` *khác*. Trong ví dụ trên, `(node) => { ... }` là một hàm khác nhau trên mỗi lần render. Khi thành phần của bạn render lại, hàm *trước đó* sẽ được gọi với `null` làm đối số và hàm *tiếp theo* sẽ được gọi với nút DOM.

#### Tham số {/*ref-callback-parameters*/}

* `node`: Một nút DOM. React sẽ truyền cho bạn nút DOM khi ref được gắn. Trừ khi bạn truyền cùng một tham chiếu hàm cho callback `ref` trên mỗi lần render, callback sẽ tạm thời được dọn dẹp và tạo lại trong mỗi lần render lại của thành phần.

<Note>

#### React 19 đã thêm các hàm dọn dẹp cho các callback `ref`. {/*react-19-added-cleanup-functions-for-ref-callbacks*/}

Để hỗ trợ khả năng tương thích ngược, nếu một hàm dọn dẹp không được trả về từ callback `ref`, `node` sẽ được gọi với `null` khi `ref` bị tách ra. Hành vi này sẽ bị xóa trong một phiên bản tương lai.

</Note>

#### Trả về {/*returns*/}

* **tùy chọn** `hàm dọn dẹp`: Khi `ref` bị tách ra, React sẽ gọi hàm dọn dẹp. Nếu một hàm không được trả về bởi callback `ref`, React sẽ gọi lại callback với `null` làm đối số khi `ref` bị tách ra. Hành vi này sẽ bị xóa trong một phiên bản tương lai.

#### Lưu ý {/*caveats*/}

* Khi Strict Mode được bật, React sẽ **chạy thêm một chu kỳ thiết lập + dọn dẹp chỉ dành cho phát triển** trước lần thiết lập thực tế đầu tiên. Đây là một bài kiểm tra căng thẳng để đảm bảo rằng logic dọn dẹp của bạn "phản ánh" logic thiết lập của bạn và nó dừng hoặc hoàn tác bất cứ điều gì mà thiết lập đang làm. Nếu điều này gây ra sự cố, hãy triển khai hàm dọn dẹp.
* Khi bạn truyền một callback `ref` *khác*, React sẽ gọi hàm dọn dẹp của callback *trước đó* nếu được cung cấp. Nếu không có hàm dọn dẹp nào được xác định, callback `ref` sẽ được gọi với `null` làm đối số. Hàm *tiếp theo* sẽ được gọi với nút DOM.

---

### Đối tượng sự kiện React {/*react-event-object*/}

Trình xử lý sự kiện của bạn sẽ nhận được một *đối tượng sự kiện React.* Nó còn được gọi là "sự kiện tổng hợp".

```js
<button onClick={e => {
  console.log(e); // Đối tượng sự kiện React
}} />
```

Nó tuân theo cùng một tiêu chuẩn như các sự kiện DOM cơ bản, nhưng khắc phục một số điểm không nhất quán của trình duyệt.

Một số sự kiện React không ánh xạ trực tiếp đến các sự kiện gốc của trình duyệt. Ví dụ: trong `onMouseLeave`, `e.nativeEvent` sẽ trỏ đến một sự kiện `mouseout`. Ánh xạ cụ thể không phải là một phần của API công khai và có thể thay đổi trong tương lai. Nếu bạn cần sự kiện trình duyệt cơ bản vì một lý do nào đó, hãy đọc nó từ `e.nativeEvent`.

#### Các thuộc tính {/*react-event-object-properties*/}

Các đối tượng sự kiện React triển khai một số thuộc tính [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) tiêu chuẩn:

* [`bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles): Một boolean. Trả về liệu sự kiện có nổi lên qua DOM hay không.
* [`cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable): Một boolean. Trả về liệu sự kiện có thể bị hủy hay không.
* [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): Một nút DOM. Trả về nút mà trình xử lý hiện tại được gắn vào trong cây React.
* [`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented): Một boolean. Trả về liệu `preventDefault` đã được gọi hay chưa.
* [`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): Một số. Trả về giai đoạn mà sự kiện hiện đang ở.
* [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): Một boolean. Trả về liệu sự kiện có được khởi tạo bởi người dùng hay không.
* [`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): Một nút DOM. Trả về nút mà sự kiện đã xảy ra trên đó (có thể là một phần tử con ở xa).
* [`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): Một số. Trả về thời gian khi sự kiện xảy ra.

Ngoài ra, các đối tượng sự kiện React cung cấp các thuộc tính sau:

* `nativeEvent`: Một [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) DOM. Đối tượng sự kiện trình duyệt gốc.

#### Các phương thức {/*react-event-object-methods*/}

Các đối tượng sự kiện React triển khai một số phương thức [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) tiêu chuẩn:

* [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault): Ngăn chặn hành động mặc định của trình duyệt cho sự kiện.
* [`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation): Dừng sự lan truyền sự kiện qua cây React.

Ngoài ra, các đối tượng sự kiện React cung cấp các phương thức sau:

* `isDefaultPrevented()`: Trả về một giá trị boolean cho biết liệu `preventDefault` đã được gọi hay chưa.
* `isPropagationStopped()`: Trả về một giá trị boolean cho biết liệu `stopPropagation` đã được gọi hay chưa.
* `persist()`: Không được sử dụng với React DOM. Với React Native, hãy gọi phương thức này để đọc các thuộc tính của sự kiện sau sự kiện.
* `isPersistent()`: Không được sử dụng với React DOM. Với React Native, trả về liệu `persist` đã được gọi hay chưa.

#### Lưu ý {/*react-event-object-caveats*/}

* Các giá trị của `currentTarget`, `eventPhase`, `target` và `type` phản ánh các giá trị mà mã React của bạn mong đợi. Dưới nền, React gắn các trình xử lý sự kiện ở gốc, nhưng điều này không được phản ánh trong các đối tượng sự kiện React. Ví dụ: `e.currentTarget` có thể không giống với `e.nativeEvent.currentTarget` cơ bản. Đối với các sự kiện được polyfill, `e.type` (loại sự kiện React) có thể khác với `e.nativeEvent.type` (loại cơ bản).

---

### Hàm xử lý `AnimationEvent` {/*animationevent-handler*/}

Một kiểu trình xử lý sự kiện cho các sự kiện [CSS animation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations).

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### Tham số {/*animationevent-handler-parameters*/}

* `e`: Một [đối tượng sự kiện React](#react-event-object) với các thuộc tính [`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent) bổ sung sau:
  * [`animationName`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### Hàm xử lý `ClipboardEvent` {/*clipboadevent-handler*/}

Một kiểu trình xử lý sự kiện cho các sự kiện [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### Tham số {/*clipboadevent-handler-parameters*/}

* `e`: Một [đối tượng sự kiện React](#react-event-object) với các thuộc tính [`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent) bổ sung sau:

  * [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)

---

### Hàm xử lý `CompositionEvent` {/*compositionevent-handler*/}

Một kiểu trình xử lý sự kiện cho các sự kiện [input method editor (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor).

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### Tham số {/*compositionevent-handler-parameters*/}

* `e`: Một [đối tượng sự kiện React](#react-event-object) với các thuộc tính [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent) bổ sung sau:
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### Hàm xử lý `DragEvent` {/*dragevent-handler*/}

Một kiểu trình xử lý sự kiện cho các sự kiện [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API).

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Drag source
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Drop target
  </div>
</>
```

#### Tham số {/*dragevent-handler-parameters*/}

* `e`: Một [đối tượng sự kiện React](#react-event-object) với các thuộc tính [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent) bổ sung sau:
  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

  Nó cũng bao gồm các thuộc tính [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) được kế thừa:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Nó cũng bao gồm các thuộc tính [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) được kế thừa:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Hàm xử lý `FocusEvent` {/*focusevent-handler*/}

Một kiểu trình xử lý sự kiện cho các sự kiện focus.

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[Xem một ví dụ.](#handling-focus-events)

#### Tham số {/*focusevent-handler-parameters*/}

* `e`: Một [đối tượng sự kiện React](#react-event-object) với các thuộc tính [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) bổ sung sau:
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

  Nó cũng bao gồm các thuộc tính [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) được kế thừa:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Hàm xử lý `Event` {/*event-handler*/}

Một kiểu trình xử lý sự kiện cho các sự kiện chung.

#### Tham số {/*event-handler-parameters*/}

* `e`: Một [đối tượng sự kiện React](#react-event-object) không có thuộc tính bổ sung.

---

### Hàm xử lý `InputEvent` {/*inputevent-handler*/}

Một kiểu trình xử lý sự kiện cho sự kiện `onBeforeInput`.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### Tham số {/*inputevent-handler-parameters*/}

* `e`: Một [đối tượng sự kiện React](#react-event-object) với các thuộc tính [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent) bổ sung sau:
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### Hàm xử lý `KeyboardEvent` {/*keyboardevent-handler*/}

Một kiểu trình xử lý sự kiện cho các sự kiện bàn phím.

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[Xem một ví dụ.](#handling-keyboard-events)

#### Tham số {/*keyboardevent-handler-parameters*/}

* `e`: Một [đối tượng sự kiện React](#react-event-object) với các thuộc tính [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) bổ sung sau:
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)

  Nó cũng bao gồm các thuộc tính [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) được kế thừa:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Hàm xử lý `MouseEvent` {/*mouseevent-handler*/}

Một kiểu trình xử lý sự kiện cho các sự kiện chuột.

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[Xem một ví dụ.](#handling-mouse-events)

#### Tham số {/*mouseevent-handler-parameters*/}

* `e`: Một [đối tượng sự kiện React](#react-event-object) với các thuộc tính [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) bổ sung sau:
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Nó cũng bao gồm các thuộc tính [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) được kế thừa:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Hàm xử lý `PointerEvent` {/*pointerevent-handler*/}

Một kiểu trình xử lý sự kiện cho [pointer events.](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[Xem một ví dụ.](#handling-pointer-events)

#### Tham số {/*pointerevent-handler-parameters*/}

* `e`: Một [đối tượng sự kiện React](#react-event-object) với các thuộc tính [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) bổ sung sau:
  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

  Nó cũng bao gồm các thuộc tính [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) được kế thừa:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Nó cũng bao gồm các thuộc tính [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) được kế thừa:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Hàm xử lý `TouchEvent` {/*touchevent-handler*/}

Một kiểu trình xử lý sự kiện cho [touch events.](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### Tham số {/*touchevent-handler-parameters*/}

* `e`: Một [đối tượng sự kiện React](#react-event-object) với các thuộc tính [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent) bổ sung sau:
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)
  
  Nó cũng bao gồm các thuộc tính [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) được kế thừa:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Hàm xử lý `TransitionEvent` {/*transitionevent-handler*/}

Một kiểu trình xử lý sự kiện cho các sự kiện CSS transition.

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### Tham số {/*transitionevent-handler-parameters*/}

* `e`: Một [đối tượng sự kiện React](#react-event-object) với các thuộc tính [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent) bổ sung sau:
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### Hàm xử lý `UIEvent` {/*uievent-handler*/}

Một kiểu trình xử lý sự kiện cho các sự kiện UI chung.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### Tham số {/*uievent-handler-parameters*/}

* `e`: Một [đối tượng sự kiện React](#react-event-object) với các thuộc tính [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) bổ sung sau:
  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Hàm xử lý `WheelEvent` {/*wheelevent-handler*/}

Một kiểu trình xử lý sự kiện cho sự kiện `onWheel`.

```js
<div
  onWheel={e => console.log('onWheel')}
/>
```

#### Tham số {/*wheelevent-handler-parameters*/}

* `e`: Một [đối tượng sự kiện React](#react-event-object) với các thuộc tính [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent) bổ sung sau:
  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)


  Nó cũng bao gồm các thuộc tính [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) được kế thừa:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Nó cũng bao gồm các thuộc tính [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) được kế thừa:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## Cách sử dụng {/*usage*/}

### Áp dụng các kiểu CSS {/*applying-css-styles*/}

Trong React, bạn chỉ định một lớp CSS với [`className`.](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) Nó hoạt động giống như thuộc tính `class` trong HTML:

```js
<img className="avatar" />
```
Sau đó, bạn viết các quy tắc CSS cho nó trong một tệp CSS riêng biệt:

```css
/* Trong CSS của bạn */
.avatar {
  border-radius: 50%;
}
```

React không quy định cách bạn thêm các tệp CSS. Trong trường hợp đơn giản nhất, bạn sẽ thêm thẻ [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) vào HTML của bạn. Nếu bạn sử dụng một công cụ xây dựng hoặc một framework, hãy tham khảo tài liệu của nó để tìm hiểu cách thêm một tệp CSS vào dự án của bạn.

Đôi khi, các giá trị kiểu phụ thuộc vào dữ liệu. Sử dụng thuộc tính `style` để truyền một số kiểu động:

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```


Trong ví dụ trên, `style={{}}` không phải là một cú pháp đặc biệt, mà là một đối tượng `{}` thông thường bên trong [dấu ngoặc nhọn JSX.](/learn/javascript-in-jsx-with-curly-braces) Chúng tôi khuyên bạn chỉ nên sử dụng thuộc tính `style` khi các kiểu của bạn phụ thuộc vào các biến JavaScript.

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js src/Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Ảnh của ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css src/styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### Làm thế nào để áp dụng nhiều lớp CSS một cách có điều kiện? {/*how-to-apply-multiple-css-classes-conditionally*/}

Để áp dụng các lớp CSS một cách có điều kiện, bạn cần tự tạo chuỗi `className` bằng JavaScript.

Ví dụ: `className={'row ' + (isSelected ? 'selected': '')}` sẽ tạo ra `className="row"` hoặc `className="row selected"` tùy thuộc vào việc `isSelected` có phải là `true` hay không.

Để làm cho điều này dễ đọc hơn, bạn có thể sử dụng một thư viện trợ giúp nhỏ như [`classnames`:](https://github.com/JedWatson/classnames)

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

Điều này đặc biệt thuận tiện nếu bạn có nhiều lớp có điều kiện:

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### Thao tác với một nút DOM bằng ref {/*manipulating-a-dom-node-with-a-ref*/}

Đôi khi, bạn sẽ cần lấy nút DOM của trình duyệt được liên kết với một thẻ trong JSX. Ví dụ: nếu bạn muốn tập trung vào một `<input>` khi một nút được nhấp, bạn cần gọi [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) trên nút DOM `<input>` của trình duyệt.

Để lấy nút DOM của trình duyệt cho một thẻ, [khai báo một ref](/reference/react/useRef) và truyền nó làm thuộc tính `ref` cho thẻ đó:

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

React sẽ đặt nút DOM vào `inputRef.current` sau khi nó được hiển thị trên màn hình.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus vào ô input
      </button>
    </>
  );
}
```

</Sandpack>

Đọc thêm về [thao tác DOM với ref](/learn/manipulating-the-dom-with-refs) và [xem thêm các ví dụ.](/reference/react/useRef#examples-dom)

Đối với các trường hợp sử dụng nâng cao hơn, thuộc tính `ref` cũng chấp nhận một [hàm callback.](#ref-callback)

---

### Thiết lập inner HTML một cách nguy hiểm {/*dangerously-setting-the-inner-html*/}

Bạn có thể truyền một chuỗi HTML thô cho một phần tử như sau:

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**Điều này rất nguy hiểm. Giống như thuộc tính [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) của DOM cơ bản, bạn phải hết sức thận trọng! Trừ khi markup đến từ một nguồn hoàn toàn đáng tin cậy, nếu không việc đưa vào lỗ hổng [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) là rất dễ dàng.**

Ví dụ: nếu bạn sử dụng một thư viện Markdown chuyển đổi Markdown thành HTML, bạn tin rằng trình phân tích cú pháp của nó không chứa lỗi và người dùng chỉ thấy đầu vào của riêng họ, bạn có thể hiển thị HTML kết quả như sau:

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Nhập một số markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // Điều này CHỈ an toàn vì HTML đầu ra
  // được hiển thị cho cùng một người dùng và vì bạn
  // tin tưởng trình phân tích cú pháp Markdown này không có lỗi.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}
```

```json package.json
{
  "dependencies": {
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

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

Đối tượng `{__html}` nên được tạo càng gần nơi HTML được tạo càng tốt, như ví dụ trên trong hàm `renderMarkdownToHTML`. Điều này đảm bảo rằng tất cả HTML thô được sử dụng trong mã của bạn được đánh dấu rõ ràng là như vậy và chỉ các biến mà bạn mong đợi chứa HTML mới được truyền cho `dangerouslySetInnerHTML`. Không nên tạo đối tượng nội tuyến như `<div dangerouslySetInnerHTML={{__html: markup}} />`.

Để xem tại sao việc hiển thị HTML tùy ý là nguy hiểm, hãy thay thế mã trên bằng mã này:

```js {1-4,7,8}
const post = {
  // Hãy tưởng tượng nội dung này được lưu trữ trong cơ sở dữ liệu.
  content: `<img src="" onerror='alert("bạn đã bị hack")'>`
};

export default function MarkdownPreview() {
  // 🔴 LỖ HỔNG BẢO MẬT: truyền đầu vào không đáng tin cậy cho dangerouslySetInnerHTML
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

Mã được nhúng trong HTML sẽ chạy. Một hacker có thể sử dụng lỗ hổng bảo mật này để đánh cắp thông tin người dùng hoặc thực hiện các hành động thay mặt họ. **Chỉ sử dụng `dangerouslySetInnerHTML` với dữ liệu đáng tin cậy và đã được làm sạch.**

---

### Xử lý các sự kiện chuột {/*handling-mouse-events*/}

Ví dụ này cho thấy một số [sự kiện chuột](#mouseevent-handler) phổ biến và khi chúng kích hoạt.

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (first button)')}
        onMouseDown={e => console.log('onMouseDown (first button)')}
        onMouseEnter={e => console.log('onMouseEnter (first button)')}
        onMouseLeave={e => console.log('onMouseLeave (first button)')}
        onMouseOver={e => console.log('onMouseOver (first button)')}
        onMouseUp={e => console.log('onMouseUp (first button)')}
      >
        Nút thứ nhất
      </button>
      <button
        onClick={e => console.log('onClick (second button)')}
        onMouseDown={e => console.log('onMouseDown (second button)')}
        onMouseEnter={e => console.log('onMouseEnter (second button)')}
        onMouseLeave={e => console.log('onMouseLeave (second button)')}
        onMouseOver={e => console.log('onMouseOver (second button)')}
        onMouseUp={e => console.log('onMouseUp (second button)')}
      >
        Nút thứ hai
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Xử lý các sự kiện con trỏ {/*handling-pointer-events*/}

Ví dụ này cho thấy một số [sự kiện con trỏ](#pointerevent-handler) phổ biến và khi chúng kích hoạt.

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (first child)')}
        onPointerEnter={e => console.log('onPointerEnter (first child)')}
        onPointerLeave={e => console.log('onPointerLeave (first child)')}
        onPointerMove={e => console.log('onPointerMove (first child)')}
        onPointerUp={e => console.log('onPointerUp (first child)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        Con thứ nhất
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (second child)')}
        onPointerEnter={e => console.log('onPointerEnter (second child)')}
        onPointerLeave={e => console.log('onPointerLeave (second child)')}
        onPointerMove={e => console.log('onPointerMove (second child)')}
        onPointerUp={e => console.log('onPointerUp (second child)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Con thứ hai
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Xử lý các sự kiện focus {/*handling-focus-events*/}

Trong React, [các sự kiện focus](#focusevent-handler) nổi lên. Bạn có thể sử dụng `currentTarget` và `relatedTarget` để phân biệt xem các sự kiện focus hoặc blur có bắt nguồn từ bên ngoài phần tử cha hay không. Ví dụ này cho thấy cách phát hiện focus vào một phần tử con, focus vào phần tử cha và cách phát hiện focus đi vào hoặc rời khỏi toàn bộ cây con.

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused parent');
        } else {
          console.log('focused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Không kích hoạt khi hoán đổi focus giữa các phần tử con
          console.log('focus entered parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused parent');
        } else {
          console.log('unfocused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Không kích hoạt khi hoán đổi focus giữa các phần tử con
          console.log('focus left parent');
        }
      }}
    >
      <label>
        Tên:
        <input name="firstName" />
      </label>
      <label>
        Họ:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Xử lý các sự kiện bàn phím {/*handling-keyboard-events*/}

Ví dụ này cho thấy một số [sự kiện bàn phím](#keyboardevent-handler) phổ biến và khi chúng kích hoạt.

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      Tên:
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>
