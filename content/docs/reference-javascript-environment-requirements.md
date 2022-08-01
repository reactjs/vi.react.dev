---
id: javascript-environment-requirements
title: JavaScript Environment Requirements
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
React 16 phụ thuộc vào một tập types [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) và [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). Nếu bạn cần hỗ trợ những browsers hay thiết bị cũ mà chúng chưa được cung cấp sẵn (như IE < 11) hoặc chúng chưa được tuân thủ cách triển khai (e.g. IE 11), đừng quên thêm global polyfill vào ứng dụng của bạn, như [core-js](https://github.com/zloirock/core-js).

Một môi trường đã polyfilled cho React 16 sử core-js để hỗ trợ các browsers cũ có thể trông giống thế này:
=======
React 18 supports all modern browsers (Edge, Firefox, Chrome, Safari, etc).

If you support older browsers and devices such as Internet Explorer which do not provide modern browser features natively or have non-compliant implementations, consider including a global polyfill in your bundled application.
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb

Here is a list of the modern features React 18 uses:
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

React cũng phụ thuộc vào `requestAnimationFrame` (ngay cả trên test environments).  
Bạn có thể sử dụng [raf](https://www.npmjs.com/package/raf) package để chèn vào `requestAnimationFrame`:

```js
import 'raf/polyfill';
```
=======
The correct polyfill for these features depend on your environment. For many users, you can configure your [Browserlist](https://github.com/browserslist/browserslist) settings. For others, you may need to import polyfills like [`core-js`](https://github.com/zloirock/core-js) directly.
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb
