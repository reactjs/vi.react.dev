---
title: Special Props Warning
layout: single
permalink: warnings/special-props.html
---

Hầu hết các props trên một JSX element được truyền vào component, tuy nhiên, có hai loại props đặc biệt (`ref` và `key`) cái mà được sử dụng bởi React, và do đó không được chuyển tiếp đến component. 

Ví dụ, việc cố gắng truy cập `this.props.key` từ một component (i.e., the render function hoặc [propTypes](/docs/typechecking-with-proptypes.html#proptypes)) không được định nghĩa. Nếu bạn cần truy cập cùng một giá trị trong cùng một component con(child component), bạn nên truyền nó như một prop khác (ex: `<ListItemWrapper key={result.id} id={result.id} />`). Trong khi việc này có vẻ như dư thừa, thật quan trọng khi tách biệt phần app logic ra khỏi những manh mối đối chiếu.
