---
title: <Suspense>
---

<Intro>

`<Suspense>` cho phép bạn hiển thị một fallback cho đến khi các thành phần con của nó đã tải xong.


```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<Suspense>` {/*suspense*/}

#### Props {/*props*/}
* `children`: Giao diện người dùng thực tế mà bạn định hiển thị. Nếu `children` tạm ngưng trong khi hiển thị, ranh giới Suspense sẽ chuyển sang hiển thị `fallback`.
* `fallback`: Một giao diện người dùng thay thế để hiển thị thay cho giao diện người dùng thực tế nếu nó chưa tải xong. Bất kỳ nút React hợp lệ nào đều được chấp nhận, mặc dù trên thực tế, fallback là một chế độ xem giữ chỗ nhẹ, chẳng hạn như trình quay tải hoặc bộ xương. Suspense sẽ tự động chuyển sang `fallback` khi `children` tạm ngưng và quay lại `children` khi dữ liệu đã sẵn sàng. Nếu `fallback` tạm ngưng trong khi hiển thị, nó sẽ kích hoạt ranh giới Suspense cha gần nhất.

#### Lưu ý {/*caveats*/}

- React không giữ lại bất kỳ trạng thái nào cho các lần hiển thị bị tạm ngưng trước khi chúng có thể gắn kết lần đầu tiên. Khi thành phần đã tải, React sẽ thử lại hiển thị cây bị tạm ngưng từ đầu.
- Nếu Suspense đang hiển thị nội dung cho cây, nhưng sau đó nó lại bị tạm ngưng, thì `fallback` sẽ được hiển thị lại trừ khi bản cập nhật gây ra nó được gây ra bởi [`startTransition`](/reference/react/startTransition) hoặc [`useDeferredValue`](/reference/react/useDeferredValue).
- Nếu React cần ẩn nội dung đã hiển thị vì nó bị tạm ngưng lại, nó sẽ dọn dẹp [layout Effects](/reference/react/useLayoutEffect) trong cây nội dung. Khi nội dung đã sẵn sàng để hiển thị lại, React sẽ kích hoạt lại layout Effects. Điều này đảm bảo rằng Effects đo bố cục DOM không cố gắng thực hiện điều này trong khi nội dung bị ẩn.
- React bao gồm các tối ưu hóa ẩn bên dưới như *Kết xuất máy chủ phát trực tuyến* và *Hydrat hóa có chọn lọc* được tích hợp với Suspense. Đọc [tổng quan về kiến trúc](https://github.com/reactwg/react-18/discussions/37) và xem [bài nói chuyện kỹ thuật](https://www.youtube.com/watch?v=pj5N-Khihgc) để tìm hiểu thêm.

---

## Cách sử dụng {/*usage*/}

### Hiển thị fallback trong khi nội dung đang tải {/*displaying-a-fallback-while-content-is-loading*/}

Bạn có thể bọc bất kỳ phần nào của ứng dụng của bạn bằng một ranh giới Suspense:

```js [[1, 1, "<Loading />"], [2, 2, "<Albums />"]]
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

React sẽ hiển thị <CodeStep step={1}>fallback tải</CodeStep> của bạn cho đến khi tất cả code và dữ liệu cần thiết bởi <CodeStep step={2}>các thành phần con</CodeStep> đã được tải xong.

Trong ví dụ dưới đây, thành phần `Albums` *tạm ngưng* trong khi tìm nạp danh sách album. Cho đến khi nó sẵn sàng hiển thị, React chuyển ranh giới Suspense gần nhất bên trên để hiển thị fallback -- thành phần `Loading` của bạn. Sau đó, khi dữ liệu được tải, React ẩn fallback `Loading` và hiển thị thành phần `Albums` với dữ liệu.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

</Sandpack>

<Note>

**Chỉ các nguồn dữ liệu hỗ trợ Suspense mới kích hoạt thành phần Suspense.** Chúng bao gồm:

- Tìm nạp dữ liệu với các framework hỗ trợ Suspense như [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) và [Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)
- Tải code component một cách lazy với [`lazy`](/reference/react/lazy)
- Đọc giá trị của một Promise đã được cache với [`use`](/reference/react/use)

Suspense **không** phát hiện khi dữ liệu được tìm nạp bên trong một Effect hoặc trình xử lý sự kiện.

Cách chính xác để bạn tải dữ liệu trong component `Albums` ở trên phụ thuộc vào framework của bạn. Nếu bạn sử dụng một framework hỗ trợ Suspense, bạn sẽ tìm thấy chi tiết trong tài liệu tìm nạp dữ liệu của nó.

Việc tìm nạp dữ liệu hỗ trợ Suspense mà không sử dụng framework theo ý kiến riêng vẫn chưa được hỗ trợ. Các yêu cầu để triển khai một nguồn dữ liệu hỗ trợ Suspense là không ổn định và không được ghi lại. Một API chính thức để tích hợp các nguồn dữ liệu với Suspense sẽ được phát hành trong một phiên bản React trong tương lai.

</Note>

---

### Tiết lộ nội dung cùng nhau đồng thời {/*revealing-content-together-at-once*/}

Theo mặc định, toàn bộ cây bên trong Suspense được coi là một đơn vị duy nhất. Ví dụ: ngay cả khi *chỉ một* trong số các component này tạm ngưng để chờ một số dữ liệu, thì *tất cả* chúng cùng nhau sẽ được thay thế bằng chỉ báo tải:


```js {2-5}
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```
Sau đó, sau khi tất cả chúng đã sẵn sàng để hiển thị, chúng sẽ xuất hiện cùng nhau ngay lập tức.

Trong ví dụ dưới đây, cả `Biography` và `Albums` đều tìm nạp một số dữ liệu. Tuy nhiên, vì chúng được nhóm dưới một ranh giới Suspense duy nhất, các thành phần này luôn "hiện ra" cùng nhau đồng thời.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Biography artistId={artist.id} />
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
```

</Sandpack>

Các component tải dữ liệu không cần phải là con trực tiếp của ranh giới Suspense. Ví dụ: bạn có thể di chuyển `Biography` và `Albums` vào một component `Details` mới. Điều này không thay đổi hành vi. `Biography` và `Albums` dùng chung ranh giới Suspense cha gần nhất, vì vậy việc hiển thị của chúng được phối hợp cùng nhau.

```js {2,8-11}
<Suspense fallback={<Loading />}>
  <Details artistId={artist.id} />
</Suspense>

function Details({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Panel>
        <Albums artistId={artistId} />
      </Panel>
    </>
  );
}
```

```js {2,8-11}
<Suspense fallback={<Loading />}>
  <Details artistId={artist.id} />
</Suspense>

function Details({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Panel>
        <Albums artistId={artistId} />
      </Panel>
    </>
  );
}
```

---
### Tiết lộ nội dung lồng nhau khi nó tải {/*revealing-nested-content-as-it-loads*/}

Khi một thành phần tạm ngưng, thành phần Suspense cha gần nhất sẽ hiển thị fallback. Điều này cho phép bạn lồng nhiều thành phần Suspense để tạo ra một chuỗi tải. Fallback của mỗi ranh giới Suspense sẽ được điền vào khi cấp nội dung tiếp theo có sẵn. Ví dụ: bạn có thể cung cấp cho danh sách album fallback riêng:

```js {3,7}
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

Với thay đổi này, việc hiển thị `Biography` không cần phải "chờ" `Albums` tải.

Trình tự sẽ là:

1. Nếu `Biography` chưa tải xong, `BigSpinner` sẽ được hiển thị thay cho toàn bộ vùng nội dung.
2. Khi `Biography` tải xong, `BigSpinner` được thay thế bằng nội dung.
3. Nếu `Albums` chưa tải xong, `AlbumsGlimmer` sẽ được hiển thị thay cho `Albums` và `Panel` cha của nó.
4. Cuối cùng, khi `Albums` tải xong, nó sẽ thay thế `AlbumsGlimmer`.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Các ranh giới Suspense cho phép bạn điều phối những phần nào của giao diện người dùng của bạn sẽ luôn "hiển thị" cùng nhau đồng thời và những phần nào sẽ dần dần tiết lộ thêm nội dung theo một chuỗi các trạng thái tải. Bạn có thể thêm, di chuyển hoặc xóa các ranh giới Suspense ở bất kỳ đâu trong cây mà không ảnh hưởng đến hành vi của phần còn lại của ứng dụng của bạn.

Đừng đặt một ranh giới Suspense xung quanh mọi thành phần. Các ranh giới Suspense không nên chi tiết hơn trình tự tải mà bạn muốn người dùng trải nghiệm. Nếu bạn làm việc với một nhà thiết kế, hãy hỏi họ nơi đặt các trạng thái tải--có khả năng là họ đã đưa chúng vào wireframe thiết kế của họ.

```js {3,7}
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

Với thay đổi này, việc hiển thị `Biography` không cần phải "chờ" `Albums` tải.

Trình tự sẽ là:

1. Nếu `Biography` chưa tải xong, `BigSpinner` sẽ được hiển thị thay cho toàn bộ vùng nội dung.
2. Khi `Biography` tải xong, `BigSpinner` được thay thế bằng nội dung.
3. Nếu `Albums` chưa tải xong, `AlbumsGlimmer` sẽ được hiển thị thay cho `Albums` và `Panel` cha của nó.
4. Cuối cùng, khi `Albums` tải xong, nó sẽ thay thế `AlbumsGlimmer`.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Các ranh giới Suspense cho phép bạn điều phối những phần nào của giao diện người dùng của bạn sẽ luôn "hiển thị" cùng nhau đồng thời và những phần nào sẽ dần dần tiết lộ thêm nội dung theo một chuỗi các trạng thái tải. Bạn có thể thêm, di chuyển hoặc xóa các ranh giới Suspense ở bất kỳ đâu trong cây mà không ảnh hưởng đến hành vi của phần còn lại của ứng dụng của bạn.

Đừng đặt một ranh giới Suspense xung quanh mọi thành phần. Các ranh giới Suspense không nên chi tiết hơn trình tự tải mà bạn muốn người dùng trải nghiệm. Nếu bạn làm việc với một nhà thiết kế, hãy hỏi họ nơi đặt các trạng thái tải--có khả năng là họ đã đưa chúng vào wireframe thiết kế của họ.

---

### Hiển thị nội dung cũ trong khi nội dung mới đang tải {/*showing-stale-content-while-fresh-content-is-loading*/}

Trong ví dụ này, thành phần `SearchResults` tạm ngưng trong khi tìm nạp kết quả tìm kiếm. Nhập `"a"`, đợi kết quả và sau đó chỉnh sửa thành `"ab"`. Các kết quả cho `"a"` sẽ được thay thế bằng fallback tải.

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

Một mẫu giao diện người dùng thay thế phổ biến là *hoãn lại* việc cập nhật danh sách và tiếp tục hiển thị các kết quả trước đó cho đến khi các kết quả mới sẵn sàng. Hook [`useDeferredValue`](/reference/react/useDeferredValue) cho phép bạn chuyển một phiên bản hoãn lại của truy vấn xuống:

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```
`query` sẽ cập nhật ngay lập tức, vì vậy đầu vào sẽ hiển thị giá trị mới. Tuy nhiên, `deferredQuery` sẽ giữ giá trị trước đó cho đến khi dữ liệu được tải, vì vậy `SearchResults` sẽ hiển thị kết quả cũ trong một khoảng thời gian.

Để làm cho nó rõ ràng hơn với người dùng, bạn có thể thêm một chỉ báo trực quan khi danh sách kết quả cũ được hiển thị:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1 
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Nhập `"a"` trong ví dụ bên dưới, đợi kết quả tải và sau đó chỉnh sửa đầu vào thành `"ab"`. Lưu ý rằng thay vì fallback của Suspense, bây giờ bạn thấy danh sách kết quả cũ bị làm mờ cho đến khi các kết quả mới được tải:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1 
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Nhập `"a"` trong ví dụ bên dưới, đợi kết quả tải và sau đó chỉnh sửa đầu vào thành `"ab"`. Lưu ý rằng thay vì fallback của Suspense, bây giờ bạn thấy danh sách kết quả cũ bị làm mờ cho đến khi các kết quả mới được tải:


<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Lưu ý: cách bạn thực hiện tìm nạp dữ liệu phụ thuộc vào
// framework mà bạn sử dụng cùng với Suspense.
// Thông thường, logic bộ nhớ đệm sẽ nằm bên trong một framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<Note>

Cả giá trị được hoãn lại và [Transitions](#preventing-already-revealed-content-from-hiding) cho phép bạn tránh hiển thị fallback của Suspense để ủng hộ các chỉ báo nội tuyến. Transitions đánh dấu toàn bộ bản cập nhật là không khẩn cấp, vì vậy chúng thường được sử dụng bởi các framework và thư viện bộ định tuyến để điều hướng. Mặt khác, các giá trị được hoãn lại chủ yếu hữu ích trong mã ứng dụng, nơi bạn muốn đánh dấu một phần của giao diện người dùng là không khẩn cấp và để nó "tụt lại phía sau" so với phần còn lại của giao diện người dùng.

</Note>

---
### Ngăn chặn việc ẩn nội dung đã hiển thị {/*preventing-already-revealed-content-from-hiding*/}

Khi một thành phần tạm ngưng, ranh giới Suspense gần nhất sẽ chuyển sang hiển thị fallback. Điều này có thể dẫn đến trải nghiệm người dùng khó chịu nếu nó đã hiển thị một số nội dung. Hãy thử nhấn nút này:

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    setPage(url);
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>
Khi bạn nhấn nút, thành phần `Router` đã kết xuất `ArtistPage` thay vì `IndexPage`. Một thành phần bên trong `ArtistPage` tạm ngưng, vì vậy ranh giới Suspense gần nhất bắt đầu hiển thị fallback. Ranh giới Suspense gần nhất ở gần gốc, vì vậy toàn bộ bố cục trang web đã được thay thế bằng `BigSpinner`.

Để ngăn điều này, bạn có thể đánh dấu bản cập nhật trạng thái điều hướng là một *Transition* với [`startTransition`:](/reference/react/startTransition)

```js {5,7}
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);      
    });
  }
  // ...
```

Điều này cho React biết rằng quá trình chuyển đổi trạng thái không khẩn cấp và tốt hơn là tiếp tục hiển thị trang trước thay vì ẩn bất kỳ nội dung nào đã hiển thị. Bây giờ, việc nhấp vào nút sẽ "chờ" `Biography` tải:

<Sandpack>

```js src/App.js
import { Suspense, startTransition, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Một Transition không đợi *tất cả* nội dung tải. Nó chỉ đợi đủ lâu để tránh ẩn nội dung đã hiển thị. Ví dụ: `Layout` của trang web đã được hiển thị, vì vậy sẽ rất tệ nếu ẩn nó sau một spinner tải. Tuy nhiên, ranh giới `Suspense` lồng nhau xung quanh `Albums` là mới, vì vậy Transition không đợi nó.

<Note>

Các bộ định tuyến hỗ trợ Suspense được mong đợi sẽ tự động gói các bản cập nhật điều hướng vào Transitions theo mặc định.

</Note>

---
### Cho biết rằng một Transition đang diễn ra {/*indicating-that-a-transition-is-happening*/}

Trong ví dụ trên, khi bạn nhấp vào nút, không có dấu hiệu trực quan nào cho thấy một điều hướng đang được tiến hành. Để thêm một chỉ báo, bạn có thể thay thế [`startTransition`](/reference/react/startTransition) bằng [`useTransition`](/reference/react/useTransition), cái mà cung cấp cho bạn một giá trị boolean `isPending`. Trong ví dụ dưới đây, nó được sử dụng để thay đổi kiểu tiêu đề trang web trong khi một Transition đang diễn ra:


<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

---

### Đặt lại ranh giới Suspense khi điều hướng {/*resetting-suspense-boundaries-on-navigation*/}

Trong quá trình Transition, React sẽ tránh ẩn nội dung đã hiển thị. Tuy nhiên, nếu bạn điều hướng đến một tuyến đường có các tham số khác nhau, bạn có thể muốn cho React biết đó là nội dung *khác*. Bạn có thể thể hiện điều này bằng một `key`:

```js
<ProfilePage key={queryParams.id} />
```

Hãy tưởng tượng bạn đang điều hướng trong trang hồ sơ của người dùng và một cái gì đó tạm ngưng. Nếu bản cập nhật đó được gói trong một Transition, nó sẽ không kích hoạt fallback cho nội dung đã hiển thị. Đó là hành vi mong đợi.

Tuy nhiên, bây giờ hãy tưởng tượng bạn đang điều hướng giữa hai hồ sơ người dùng khác nhau. Trong trường hợp đó, việc hiển thị fallback sẽ có ý nghĩa. Ví dụ: dòng thời gian của một người dùng *là nội dung khác* so với dòng thời gian của một người dùng khác. Bằng cách chỉ định một `key`, bạn đảm bảo rằng React coi hồ sơ của những người dùng khác nhau là các thành phần khác nhau và đặt lại các ranh giới Suspense trong quá trình điều hướng. Các bộ định tuyến tích hợp Suspense sẽ tự động thực hiện điều này.

---

### Cung cấp fallback cho các lỗi máy chủ và nội dung chỉ dành cho máy khách {/*providing-a-fallback-for-server-errors-and-client-only-content*/}

Nếu bạn sử dụng một trong các [API kết xuất máy chủ phát trực tuyến](/reference/react-dom/server) (hoặc một framework dựa trên chúng), React cũng sẽ sử dụng các ranh giới `<Suspense>` của bạn để xử lý các lỗi trên máy chủ. Nếu một thành phần đưa ra lỗi trên máy chủ, React sẽ không hủy bỏ quá trình kết xuất máy chủ. Thay vào đó, nó sẽ tìm thành phần `<Suspense>` gần nhất ở trên nó và bao gồm fallback của nó (chẳng hạn như một spinner) vào HTML máy chủ đã tạo. Người dùng sẽ thấy một spinner lúc đầu.

Trên máy khách, React sẽ cố gắng kết xuất lại thành phần tương tự. Nếu nó cũng gây ra lỗi trên máy khách, React sẽ đưa ra lỗi và hiển thị [ranh giới lỗi](/reference/react/Component#static-getderivedstatefromerror) gần nhất. Tuy nhiên, nếu nó không gây ra lỗi trên máy khách, React sẽ không hiển thị lỗi cho người dùng vì nội dung cuối cùng đã được hiển thị thành công.

Bạn có thể sử dụng điều này để chọn không kết xuất một số thành phần trên máy chủ. Để thực hiện việc này, hãy đưa ra một lỗi trong môi trường máy chủ và sau đó gói chúng trong một ranh giới `<Suspense>` để thay thế HTML của chúng bằng các fallback:

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Chat should only render on the client.');
  }
  // ...
}
```

HTML máy chủ sẽ bao gồm chỉ báo tải. Nó sẽ được thay thế bằng thành phần `Chat` trên máy khách.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Làm cách nào để ngăn giao diện người dùng bị thay thế bằng fallback trong quá trình cập nhật? {/*preventing-unwanted-fallbacks*/}

Việc thay thế giao diện người dùng hiển thị bằng fallback tạo ra trải nghiệm người dùng khó chịu. Điều này có thể xảy ra khi một bản cập nhật khiến một thành phần tạm ngưng và ranh giới Suspense gần nhất đã hiển thị nội dung cho người dùng.

Để ngăn điều này xảy ra, [hãy đánh dấu bản cập nhật là không khẩn cấp bằng cách sử dụng `startTransition`](#preventing-already-revealed-content-from-hiding). Trong quá trình Transition, React sẽ đợi cho đến khi đủ dữ liệu được tải để ngăn chặn fallback không mong muốn xuất hiện:

```js {2-3,5}
function handleNextPageClick() {
  // Nếu bản cập nhật này tạm ngưng, đừng ẩn nội dung đã hiển thị
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```
Điều này sẽ tránh việc ẩn nội dung hiện có. Tuy nhiên, bất kỳ ranh giới `Suspense` mới được hiển thị nào vẫn sẽ hiển thị ngay lập tức các fallback để tránh chặn giao diện người dùng và cho phép người dùng xem nội dung khi nó có sẵn.

**React sẽ chỉ ngăn chặn các fallback không mong muốn trong quá trình cập nhật không khẩn cấp**. Nó sẽ không trì hoãn việc hiển thị nếu đó là kết quả của một bản cập nhật khẩn cấp. Bạn phải chọn tham gia bằng một API như [`startTransition`](/reference/react/startTransition) hoặc [`useDeferredValue`](/reference/react/useDeferredValue).

Nếu bộ định tuyến của bạn được tích hợp với Suspense, nó sẽ tự động gói các bản cập nhật của nó vào [`startTransition`](/reference/react/startTransition).

```js {2-3,5}
function handleNextPageClick() {
  // If this update suspends, don't hide the already displayed content
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```
Điều này sẽ tránh việc ẩn nội dung hiện có. Tuy nhiên, bất kỳ ranh giới `Suspense` mới được hiển thị nào vẫn sẽ hiển thị ngay lập tức các fallback để tránh chặn giao diện người dùng và cho phép người dùng xem nội dung khi nó có sẵn.

**React sẽ chỉ ngăn chặn các fallback không mong muốn trong quá trình cập nhật không khẩn cấp**. Nó sẽ không trì hoãn việc hiển thị nếu đó là kết quả của một bản cập nhật khẩn cấp. Bạn phải chọn tham gia bằng một API như [`startTransition`](/reference/react/startTransition) hoặc [`useDeferredValue`](/reference/react/useDeferredValue).

Nếu bộ định tuyến của bạn được tích hợp với Suspense, nó sẽ tự động gói các bản cập nhật của nó vào [`startTransition`](/reference/react/startTransition).

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Chat should only render on the client.');
  }
  // ...
}
```
HTML máy chủ sẽ bao gồm chỉ báo tải. Nó sẽ được thay thế bằng thành phần `Chat` trên máy khách.
---

```js {2-3,5}
function handleNextPageClick() {
  // If this update suspends, don't hide the already displayed content
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```
Điều này sẽ tránh việc ẩn nội dung hiện có. Tuy nhiên, bất kỳ ranh giới `Suspense` mới được hiển thị nào vẫn sẽ hiển thị ngay lập tức các fallback để tránh chặn giao diện người dùng và cho phép người dùng xem nội dung khi nó có sẵn.

**React sẽ chỉ ngăn chặn các fallback không mong muốn trong quá trình cập nhật không khẩn cấp**. Nó sẽ không trì hoãn việc hiển thị nếu đó là kết quả của một bản cập nhật khẩn cấp. Bạn phải chọn tham gia bằng một API như [`startTransition`](/reference/react/startTransition) hoặc [`useDeferredValue`](/reference/react/useDeferredValue).

Nếu bộ định tuyến của bạn được tích hợp với Suspense, nó sẽ tự động gói các bản cập nhật của nó vào [`startTransition`](/reference/react/startTransition).
