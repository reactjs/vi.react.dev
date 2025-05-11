---
title: experimental_useEffectEvent
---

<Wip>

**API này là thử nghiệm và chưa có sẵn trong phiên bản ổn định của React.**

Bạn có thể thử bằng cách nâng cấp các gói React lên phiên bản thử nghiệm mới nhất:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Các phiên bản thử nghiệm của React có thể chứa lỗi. Không sử dụng chúng trong môi trường production.

</Wip>

<Intro>

`useEffectEvent` là một React Hook cho phép bạn trích xuất logic không phản ứng vào một [Effect Event.](/learn/separating-events-from-effects#declaring-an-effect-event)

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />
