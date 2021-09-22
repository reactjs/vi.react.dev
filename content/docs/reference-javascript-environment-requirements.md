---
id: javascript-environment-requirements
title: JavaScript Environment Requirements
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 16 phụ thuộc vào một tập types [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) và [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). Nếu bạn cần hỗ trợ những browsers hay thiết bị cũ mà chúng chưa được cung cấp sẵn (như IE < 11) hoặc chúng chưa được tuân thủ cách triển khai (e.g. IE 11), đừng quên thêm global polyfill vào ứng dụng của bạn, như [core-js](https://github.com/zloirock/core-js).

Một môi trường đã polyfilled cho React 16 sử core-js để hỗ trợ các browsers cũ có thể trông giống thế này:

```js
import 'core-js/es/map';
import 'core-js/es/set';

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
