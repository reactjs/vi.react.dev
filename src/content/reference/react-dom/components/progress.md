---
title: "<progress>"
---

<Intro>

[Built-in browser `<progress>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) cho phép bạn hiển thị một chỉ báo tiến trình.

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<progress>` {/*progress*/}

Để hiển thị một chỉ báo tiến trình, render [built-in browser `<progress>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) component.

```js
<progress value={0.5} />
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<progress>` hỗ trợ tất cả [common element props.](/reference/react-dom/components/common#props)

Ngoài ra, `<progress>` hỗ trợ các props sau:

* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#max): Một số. Chỉ định giá trị `value` tối đa. Mặc định là `1`.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#value): Một số giữa `0` và `max`, hoặc `null` cho tiến trình không xác định. Chỉ định mức độ hoàn thành.

---

## Cách sử dụng {/*usage*/}

### Điều khiển một chỉ báo tiến trình {/*controlling-a-progress-indicator*/}

Để hiển thị một chỉ báo tiến trình, render một `<progress>` component. Bạn có thể truyền một số `value` giữa `0` và giá trị `max` mà bạn chỉ định. Nếu bạn không truyền giá trị `max`, nó sẽ được mặc định là `1`.

Nếu thao tác không diễn ra liên tục, hãy truyền `value={null}` để đưa chỉ báo tiến trình vào trạng thái không xác định.

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>
