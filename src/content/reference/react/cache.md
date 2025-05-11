---
title: cache
canary: true
---

<RSC>

`cache` chỉ được sử dụng với [React Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).

</RSC>

<Intro>

`cache` cho phép bạn lưu trữ kết quả của một lần tìm nạp dữ liệu hoặc tính toán.

```js
const cachedFn = cache(fn);
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `cache(fn)` {/*cache*/}

Gọi `cache` bên ngoài bất kỳ component nào để tạo ra một phiên bản của hàm có bộ nhớ đệm.

```js {4,7}
import {cache} from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

Khi `getMetrics` được gọi lần đầu tiên với `data`, `getMetrics` sẽ gọi `calculateMetrics(data)` và lưu trữ kết quả vào bộ nhớ đệm. Nếu `getMetrics` được gọi lại với cùng một `data`, nó sẽ trả về kết quả đã lưu trong bộ nhớ đệm thay vì gọi lại `calculateMetrics(data)`.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

- `fn`: Hàm bạn muốn lưu kết quả vào bộ nhớ đệm. `fn` có thể nhận bất kỳ đối số nào và trả về bất kỳ giá trị nào.

#### Trả về {/*returns*/}

`cache` trả về một phiên bản đã được lưu trong bộ nhớ đệm của `fn` với cùng một kiểu chữ ký. Nó không gọi `fn` trong quá trình này.

Khi gọi `cachedFn` với các đối số đã cho, nó sẽ kiểm tra trước xem có kết quả đã lưu trong bộ nhớ đệm hay không. Nếu có kết quả đã lưu trong bộ nhớ đệm, nó sẽ trả về kết quả đó. Nếu không, nó sẽ gọi `fn` với các đối số, lưu trữ kết quả vào bộ nhớ đệm và trả về kết quả. `fn` chỉ được gọi khi có một cache miss.

<Note>

Việc tối ưu hóa các giá trị trả về dựa trên đầu vào được gọi là [_memoization_](https://en.wikipedia.org/wiki/Memoization). Chúng ta gọi hàm được trả về từ `cache` là một hàm đã được ghi nhớ.

</Note>

#### Lưu ý {/*caveats*/}

[//]: # 'TODO: add links to Server/Client Component reference once https://github.com/reactjs/react.dev/pull/6177 is merged'

- React sẽ làm mất hiệu lực bộ nhớ đệm cho tất cả các hàm đã được ghi nhớ cho mỗi yêu cầu máy chủ.
- Mỗi lần gọi `cache` sẽ tạo ra một hàm mới. Điều này có nghĩa là việc gọi `cache` với cùng một hàm nhiều lần sẽ trả về các hàm đã được ghi nhớ khác nhau, không dùng chung cùng một bộ nhớ đệm.
- `cachedFn` cũng sẽ lưu trữ các lỗi. Nếu `fn` đưa ra một lỗi cho các đối số nhất định, nó sẽ được lưu vào bộ nhớ đệm và cùng một lỗi sẽ được đưa ra lại khi `cachedFn` được gọi với các đối số tương tự.
- `cache` chỉ được sử dụng trong [Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).

---

## Cách sử dụng {/*usage*/}

### Lưu vào bộ nhớ đệm một phép tính tốn kém {/*cache-expensive-computation*/}

Sử dụng `cache` để bỏ qua công việc trùng lặp.

```js [[1, 7, "getUserMetrics(user)"],[2, 13, "getUserMetrics(user)"]]
import {cache} from 'react';
import calculateUserMetrics from 'lib/user';

const getUserMetrics = cache(calculateUserMetrics);

function Profile({user}) {
  const metrics = getUserMetrics(user);
  // ...
}

function TeamReport({users}) {
  for (let user in users) {
    const metrics = getUserMetrics(user);
    // ...
  }
  // ...
}
```

Nếu cùng một đối tượng `user` được hiển thị trong cả `Profile` và `TeamReport`, hai component có thể chia sẻ công việc và chỉ gọi `calculateUserMetrics` một lần cho `user` đó.

Giả sử `Profile` được hiển thị trước. Nó sẽ gọi <CodeStep step={1}>`getUserMetrics`</CodeStep>, và kiểm tra xem có kết quả đã lưu trong bộ nhớ đệm hay không. Vì đây là lần đầu tiên `getUserMetrics` được gọi với `user` đó, sẽ có một cache miss. `getUserMetrics` sau đó sẽ gọi `calculateUserMetrics` với `user` đó và ghi kết quả vào bộ nhớ đệm.

Khi `TeamReport` hiển thị danh sách `users` của nó và đạt đến cùng một đối tượng `user`, nó sẽ gọi <CodeStep step={2}>`getUserMetrics`</CodeStep> và đọc kết quả từ bộ nhớ đệm.

<Pitfall>

##### Gọi các hàm đã ghi nhớ khác nhau sẽ đọc từ các bộ nhớ đệm khác nhau. {/*pitfall-different-memoized-functions*/}

Để truy cập cùng một bộ nhớ đệm, các component phải gọi cùng một hàm đã ghi nhớ.

```js [[1, 7, "getWeekReport"], [1, 7, "cache(calculateWeekReport)"], [1, 8, "getWeekReport"]]
// Temperature.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export function Temperature({cityData}) {
  // 🚩 Sai: Gọi `cache` trong component tạo ra `getWeekReport` mới cho mỗi lần hiển thị
  const getWeekReport = cache(calculateWeekReport);
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[2, 6, "getWeekReport"], [2, 6, "cache(calculateWeekReport)"], [2, 9, "getWeekReport"]]
// Precipitation.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

// 🚩 Sai: `getWeekReport` chỉ có thể truy cập được cho component `Precipitation`.
const getWeekReport = cache(calculateWeekReport);

export function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

Trong ví dụ trên, <CodeStep step={2}>`Precipitation`</CodeStep> và <CodeStep step={1}>`Temperature`</CodeStep> mỗi component gọi `cache` để tạo một hàm đã ghi nhớ mới với bộ nhớ đệm riêng của chúng. Nếu cả hai component hiển thị cho cùng một `cityData`, chúng sẽ thực hiện công việc trùng lặp để gọi `calculateWeekReport`.

Ngoài ra, `Temperature` tạo ra một <CodeStep step={1}>hàm đã ghi nhớ mới</CodeStep> mỗi khi component được hiển thị, điều này không cho phép chia sẻ bộ nhớ đệm.

Để tối đa hóa số lần truy cập bộ nhớ đệm và giảm công việc, hai component nên gọi cùng một hàm đã ghi nhớ để truy cập cùng một bộ nhớ đệm. Thay vào đó, hãy xác định hàm đã ghi nhớ trong một module chuyên dụng có thể được [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) trên các component.

```js [[3, 5, "export default cache(calculateWeekReport)"]]
// getWeekReport.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export default cache(calculateWeekReport);
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Temperature.js
import getWeekReport from './getWeekReport';

export default function Temperature({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Precipitation.js
import getWeekReport from './getWeekReport';

export default function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```
Ở đây, cả hai component gọi <CodeStep step={3}>cùng một hàm đã ghi nhớ</CodeStep> được xuất từ `./getWeekReport.js` để đọc và ghi vào cùng một bộ nhớ đệm.
</Pitfall>

### Chia sẻ ảnh chụp nhanh dữ liệu {/*take-and-share-snapshot-of-data*/}

Để chia sẻ ảnh chụp nhanh dữ liệu giữa các component, hãy gọi `cache` với một hàm tìm nạp dữ liệu như `fetch`. Khi nhiều component thực hiện cùng một lần tìm nạp dữ liệu, chỉ một yêu cầu được thực hiện và dữ liệu trả về được lưu vào bộ nhớ đệm và chia sẻ giữa các component. Tất cả các component tham chiếu đến cùng một ảnh chụp nhanh dữ liệu trên toàn bộ quá trình hiển thị máy chủ.

```js [[1, 4, "city"], [1, 5, "fetchTemperature(city)"], [2, 4, "getTemperature"], [2, 9, "getTemperature"], [1, 9, "city"], [2, 14, "getTemperature"], [1, 14, "city"]]
import {cache} from 'react';
import {fetchTemperature} from './api.js';

const getTemperature = cache(async (city) => {
  return await fetchTemperature(city);
});

async function AnimatedWeatherCard({city}) {
  const temperature = await getTemperature(city);
  // ...
}

async function MinimalWeatherCard({city}) {
  const temperature = await getTemperature(city);
  // ...
}
```

Nếu `AnimatedWeatherCard` và `MinimalWeatherCard` cả hai đều hiển thị cho cùng một <CodeStep step={1}>city</CodeStep>, chúng sẽ nhận được cùng một ảnh chụp nhanh dữ liệu từ <CodeStep step={2}>hàm đã ghi nhớ</CodeStep>.

Nếu `AnimatedWeatherCard` và `MinimalWeatherCard` cung cấp các đối số <CodeStep step={1}>city</CodeStep> khác nhau cho <CodeStep step={2}>`getTemperature`</CodeStep>, thì `fetchTemperature` sẽ được gọi hai lần và mỗi vị trí gọi sẽ nhận được dữ liệu khác nhau.

<CodeStep step={1}>city</CodeStep> đóng vai trò là một khóa bộ nhớ đệm.

<Note>

[//]: # 'TODO: add links to Server Components when merged.'

<CodeStep step={3}>Hiển thị không đồng bộ</CodeStep> chỉ được hỗ trợ cho Server Components.

```js [[3, 1, "async"], [3, 2, "await"]]
async function AnimatedWeatherCard({city}) {
  const temperature = await getTemperature(city);
  // ...
}
```
[//]: # 'TODO: add link and mention to use documentation when merged'
[//]: # 'To render components that use asynchronous data in Client Components, see `use` documentation.'

</Note>

### Tải trước dữ liệu {/*preload-data*/}

Bằng cách lưu vào bộ nhớ đệm một lần tìm nạp dữ liệu chạy dài, bạn có thể bắt đầu công việc không đồng bộ trước khi hiển thị component.

```jsx [[2, 6, "await getUser(id)"], [1, 17, "getUser(id)"]]
const getUser = cache(async (id) => {
  return await db.user.query(id);
});

async function Profile({id}) {
  const user = await getUser(id);
  return (
    <section>
      <img src={user.profilePic} />
      <h2>{user.name}</h2>
    </section>
  );
}

function Page({id}) {
  // ✅ Tốt: bắt đầu tìm nạp dữ liệu người dùng
  getUser(id);
  // ... một số công việc tính toán
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

Khi hiển thị `Page`, component gọi <CodeStep step={1}>`getUser`</CodeStep> nhưng lưu ý rằng nó không sử dụng dữ liệu trả về. Lời gọi <CodeStep step={1}>`getUser`</CodeStep> sớm này bắt đầu truy vấn cơ sở dữ liệu không đồng bộ xảy ra trong khi `Page` đang thực hiện các công việc tính toán khác và hiển thị các component con.

Khi hiển thị `Profile`, chúng ta gọi lại <CodeStep step={2}>`getUser`</CodeStep>. Nếu lời gọi <CodeStep step={1}>`getUser`</CodeStep> ban đầu đã trả về và lưu dữ liệu người dùng vào bộ nhớ đệm, khi `Profile` <CodeStep step={2}>yêu cầu và chờ đợi dữ liệu này</CodeStep>, nó có thể chỉ cần đọc từ bộ nhớ đệm mà không yêu cầu một lệnh gọi thủ tục từ xa khác. Nếu <CodeStep step={1}>yêu cầu dữ liệu ban đầu</CodeStep> chưa hoàn thành, việc tải trước dữ liệu theo mẫu này sẽ giảm độ trễ trong việc tìm nạp dữ liệu.

<DeepDive>

#### Lưu vào bộ nhớ đệm công việc không đồng bộ {/*caching-asynchronous-work*/}

Khi đánh giá một [hàm không đồng bộ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), bạn sẽ nhận được một [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) cho công việc đó. Promise giữ trạng thái của công việc đó (_pending_, _fulfilled_, _failed_) và kết quả cuối cùng đã được giải quyết của nó.

Trong ví dụ này, hàm không đồng bộ <CodeStep step={1}>`fetchData`</CodeStep> trả về một promise đang chờ `fetch`.

```js [[1, 1, "fetchData()"], [2, 8, "getData()"], [3, 10, "getData()"]]
async function fetchData() {
  return await fetch(`https://...`);
}

const getData = cache(fetchData);

async function MyComponent() {
  getData();
  // ... một số công việc tính toán  
  await getData();
  // ...
}
```

Khi gọi <CodeStep step={2}>`getData`</CodeStep> lần đầu tiên, promise được trả về từ <CodeStep step={1}>`fetchData`</CodeStep> được lưu vào bộ nhớ đệm. Các lần tra cứu tiếp theo sau đó sẽ trả về cùng một promise.

Lưu ý rằng lời gọi <CodeStep step={2}>`getData`</CodeStep> đầu tiên không có `await` trong khi <CodeStep step={3}>lần thứ hai</CodeStep> thì có. [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) là một toán tử JavaScript sẽ chờ và trả về kết quả đã được giải quyết của promise. Lời gọi <CodeStep step={2}>`getData`</CodeStep> đầu tiên chỉ đơn giản là bắt đầu `fetch` để lưu promise vào bộ nhớ đệm cho <CodeStep step={3}>`getData`</CodeStep> thứ hai tra cứu.

Nếu đến <CodeStep step={3}>lần gọi thứ hai</CodeStep> promise vẫn đang ở trạng thái _pending_, thì `await` sẽ tạm dừng để chờ kết quả. Tối ưu hóa là trong khi chúng ta chờ `fetch`, React có thể tiếp tục với công việc tính toán, do đó giảm thời gian chờ cho <CodeStep step={3}>lần gọi thứ hai</CodeStep>.

Nếu promise đã được giải quyết, cho dù là một lỗi hay kết quả _fulfilled_, `await` sẽ trả về giá trị đó ngay lập tức. Trong cả hai kết quả, đều có một lợi ích về hiệu suất.
</DeepDive>

<Pitfall>

##### Gọi một hàm đã ghi nhớ bên ngoài một component sẽ không sử dụng bộ nhớ đệm. {/*pitfall-memoized-call-outside-component*/}

```jsx [[1, 3, "getUser"]]
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 🚩 Sai: Gọi hàm đã ghi nhớ bên ngoài component sẽ không ghi nhớ.
getUser('demo-id');

async function DemoProfile() {
  // ✅ Tốt: `getUser` sẽ ghi nhớ.
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

React chỉ cung cấp quyền truy cập bộ nhớ đệm cho hàm đã ghi nhớ trong một component. Khi gọi <CodeStep step={1}>`getUser`</CodeStep> bên ngoài một component, nó vẫn sẽ đánh giá hàm nhưng không đọc hoặc cập nhật bộ nhớ đệm.

Điều này là do quyền truy cập bộ nhớ đệm được cung cấp thông qua một [context](/learn/passing-data-deeply-with-context) chỉ có thể truy cập được từ một component.

</Pitfall>

<DeepDive>

#### Khi nào tôi nên sử dụng `cache`, [`memo`](/reference/react/memo) hoặc [`useMemo`](/reference/react/useMemo)? {/*cache-memo-usememo*/}

Tất cả các API được đề cập đều cung cấp khả năng ghi nhớ, nhưng sự khác biệt là những gì chúng dự định ghi nhớ, ai có thể truy cập bộ nhớ đệm và khi nào bộ nhớ đệm của chúng bị vô hiệu.

#### `useMemo` {/*deep-dive-use-memo*/}

Nói chung, bạn nên sử dụng [`useMemo`](/reference/react/useMemo) để lưu vào bộ nhớ đệm một phép tính tốn kém trong một Client Component trên các lần hiển thị. Ví dụ: để ghi nhớ một phép biến đổi dữ liệu trong một component.

```jsx {4}
'use client';

function WeatherReport({record}) {
  const avgTemp = useMemo(() => calculateAvg(record), record);
  // ...
}

function App() {
  const record = getRecord();
  return (
    <>
      <WeatherReport record={record} />
      <WeatherReport record={record} />
    </>
  );
}
```
Trong ví dụ này, `App` hiển thị hai `WeatherReport` với cùng một bản ghi. Mặc dù cả hai component đều thực hiện cùng một công việc, nhưng chúng không thể chia sẻ công việc. Bộ nhớ đệm của `useMemo` chỉ cục bộ cho component.

Tuy nhiên, `useMemo` đảm bảo rằng nếu `App` hiển thị lại và đối tượng `record` không thay đổi, mỗi phiên bản component sẽ bỏ qua công việc và sử dụng giá trị đã ghi nhớ của `avgTemp`. `useMemo` sẽ chỉ lưu vào bộ nhớ đệm phép tính cuối cùng của `avgTemp` với các dependency đã cho.

#### `cache` {/*deep-dive-cache*/}

Nói chung, bạn nên sử dụng `cache` trong Server Components để ghi nhớ công việc có thể được chia sẻ giữa các component.

```js [[1, 12, "<WeatherReport city={city} />"], [3, 13, "<WeatherReport city={city} />"], [2, 1, "cache(fetchReport)"]]
const cachedFetchReport = cache(fetchReport);

function WeatherReport({city}) {
  const report = cachedFetchReport(city);
  // ...
}

function App() {
  const city = "Los Angeles";
  return (
    <>
      <WeatherReport city={city} />
      <WeatherReport city={city} />
    </>
  );
}
```
Viết lại ví dụ trước để sử dụng `cache`, trong trường hợp này, <CodeStep step={3}>phiên bản thứ hai của `WeatherReport`</CodeStep> sẽ có thể bỏ qua công việc trùng lặp và đọc từ cùng một bộ nhớ đệm như <CodeStep step={1}>`WeatherReport` đầu tiên</CodeStep>. Một điểm khác biệt nữa so với ví dụ trước là `cache` cũng được khuyến nghị cho <CodeStep step={2}>ghi nhớ các lần tìm nạp dữ liệu</CodeStep>, không giống như `useMemo` chỉ nên được sử dụng cho các phép tính.

Tại thời điểm này, `cache` chỉ nên được sử dụng trong Server Components và bộ nhớ đệm sẽ bị vô hiệu trên các yêu cầu máy chủ.

#### `memo` {/*deep-dive-memo*/}

Bạn nên sử dụng [`memo`](reference/react/memo) để ngăn một component hiển thị lại nếu các prop của nó không thay đổi.

```js
'use client';

function WeatherReport({record}) {
  const avgTemp = calculateAvg(record); 
  // ...
}

const MemoWeatherReport = memo(WeatherReport);

function App() {
  const record = getRecord();
  return (
    <>
      <MemoWeatherReport record={record} />
      <MemoWeatherReport record={record} />
    </>
  );
}
```

Trong ví dụ này, cả hai component `MemoWeatherReport` sẽ gọi `calculateAvg` khi được hiển thị lần đầu tiên. Tuy nhiên, nếu `App` hiển thị lại, mà không có thay đổi nào đối với `record`, không có prop nào thay đổi và `MemoWeatherReport` sẽ không hiển thị lại.

So với `useMemo`, `memo` ghi nhớ quá trình hiển thị component dựa trên các prop so với các phép tính cụ thể. Tương tự như `useMemo`, component đã ghi nhớ chỉ lưu vào bộ nhớ đệm lần hiển thị cuối cùng với các giá trị prop cuối cùng. Khi các prop thay đổi, bộ nhớ đệm sẽ bị vô hiệu và component hiển thị lại.

</DeepDive>

---

## Khắc phục sự cố {/*troubleshooting*/}

### Hàm đã ghi nhớ của tôi vẫn chạy mặc dù tôi đã gọi nó với cùng các đối số {/*memoized-function-still-runs*/}

Xem các cạm bẫy đã đề cập trước đó
* [Gọi các hàm đã ghi nhớ khác nhau sẽ đọc từ các bộ nhớ đệm khác nhau.](#pitfall-different-memoized-functions)
* [Gọi một hàm đã ghi nhớ bên ngoài một component sẽ không sử dụng bộ nhớ đệm.](#pitfall-memoized-call-outside-component)

Nếu không có điều nào ở trên áp dụng, thì có thể có vấn đề với cách React kiểm tra xem một cái gì đó có tồn tại trong bộ nhớ đệm hay không.

Nếu các đối số của bạn không phải là [kiểu nguyên thủy](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) (ví dụ: đối tượng, hàm, mảng), hãy đảm bảo bạn đang truyền cùng một tham chiếu đối tượng.

Khi gọi một hàm đã ghi nhớ, React sẽ tra cứu các đối số đầu vào để xem kết quả đã được lưu vào bộ nhớ đệm hay chưa. React sẽ sử dụng so sánh nông của các đối số để xác định xem có cache hit hay không.

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // 🚩 Sai: props là một đối tượng thay đổi mỗi lần hiển thị.
  const length = calculateNorm(props);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

Trong trường hợp này, hai `MapMarker` trông như thể chúng đang thực hiện cùng một công việc và gọi `calculateNorm` với cùng một giá trị của `{x: 10, y: 10, z:10}`. Mặc dù các đối tượng chứa cùng các giá trị, nhưng chúng không phải là cùng một tham chiếu đối tượng vì mỗi component tạo đối tượng `props` riêng của nó.

React sẽ gọi [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) trên đầu vào để xác minh xem có cache hit hay không.

```js {3,9}
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
  // ...
});

function MapMarker(props) {
  // ✅ Tốt: Truyền các kiểu nguyên thủy cho hàm đã ghi nhớ
  const length = calculateNorm(props.x, props.y, props.z);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

Một cách để giải quyết vấn đề này có thể là truyền các chiều của vector cho `calculateNorm`. Điều này hoạt động vì bản thân các chiều là các kiểu nguyên thủy.

Một giải pháp khác có thể là truyền chính đối tượng vector làm một prop cho component. Chúng ta sẽ cần truyền cùng một đối tượng cho cả hai phiên bản component.

```js {3,9,14}
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ Tốt: Truyền cùng một đối tượng `vector`
  const length = calculateNorm(props.vector);
  // ...
}

function App() {
  const vector = [10, 10, 10];
  return (
    <>
      <MapMarker vector={vector} />
      <MapMarker vector={vector} />
    </>
  );
}
```
