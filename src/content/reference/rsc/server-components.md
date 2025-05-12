---
title: Server Components
---

<RSC>

Server Components (Thành phần máy chủ) được sử dụng trong [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).

</RSC>

<Intro>

Server Components là một loại Component mới, được hiển thị trước, trước khi đóng gói, trong một môi trường tách biệt với ứng dụng client hoặc máy chủ SSR của bạn.

</Intro>

Môi trường riêng biệt này là "máy chủ" trong React Server Components. Server Components có thể chạy một lần tại thời điểm xây dựng trên máy chủ CI của bạn, hoặc chúng có thể được chạy cho mỗi yêu cầu bằng cách sử dụng một máy chủ web.

<InlineToc />

<Note>

#### Làm cách nào để xây dựng hỗ trợ cho Server Components? {/*how-do-i-build-support-for-server-components*/}

Mặc dù React Server Components trong React 19 ổn định và sẽ không bị hỏng giữa các phiên bản nhỏ, nhưng các API cơ bản được sử dụng để triển khai trình đóng gói hoặc framework React Server Components không tuân theo semver và có thể bị hỏng giữa các phiên bản nhỏ trong React 19.x.

Để hỗ trợ React Server Components như một trình đóng gói hoặc framework, chúng tôi khuyên bạn nên ghim vào một phiên bản React cụ thể hoặc sử dụng bản phát hành Canary. Chúng tôi sẽ tiếp tục làm việc với các trình đóng gói và framework để ổn định các API được sử dụng để triển khai React Server Components trong tương lai.

</Note>

### Server Components không cần máy chủ {/*server-components-without-a-server*/}
Server components có thể chạy tại thời điểm xây dựng để đọc từ hệ thống tệp hoặc tìm nạp nội dung tĩnh, vì vậy không cần máy chủ web. Ví dụ: bạn có thể muốn đọc dữ liệu tĩnh từ hệ thống quản lý nội dung.

Nếu không có Server Components, thông thường bạn sẽ tìm nạp dữ liệu tĩnh trên máy khách bằng Effect:
```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // NOTE: loads *after* first page render.
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);
  
  return <div>{sanitizeHtml(marked(content))}</div>;
}
```
```js
// api.js
app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

Mô hình này có nghĩa là người dùng cần tải xuống và phân tích cú pháp thêm 75K (đã nén gzip) thư viện và đợi yêu cầu thứ hai để tìm nạp dữ liệu sau khi trang tải, chỉ để hiển thị nội dung tĩnh sẽ không thay đổi trong suốt thời gian tồn tại của trang.

Với Server Components, bạn có thể hiển thị các component này một lần tại thời điểm xây dựng:

```js
import marked from 'marked'; // Không được bao gồm trong bundle
import sanitizeHtml from 'sanitize-html'; // Không được bao gồm trong bundle

async function Page({page}) {
  // NOTE: loads *during* render, when the app is built.
  const content = await file.readFile(`${page}.md`);
  
  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

Đầu ra được hiển thị sau đó có thể được hiển thị phía máy chủ (SSR) thành HTML và tải lên CDN. Khi ứng dụng tải, máy khách sẽ không thấy component `Page` ban đầu hoặc các thư viện tốn kém để hiển thị markdown. Máy khách sẽ chỉ thấy đầu ra được hiển thị:

```js
<div>{/* html for markdown */}</div>
```

Điều này có nghĩa là nội dung hiển thị trong lần tải trang đầu tiên và bundle không bao gồm các thư viện tốn kém cần thiết để hiển thị nội dung tĩnh.

<Note>

Bạn có thể nhận thấy rằng Server Component ở trên là một hàm async:

```js
async function Page({page}) {
  //...
}
```

Async Components là một tính năng mới của Server Components cho phép bạn `await` trong quá trình render.

Xem [Async components with Server Components](#async-components-with-server-components) bên dưới.

</Note>

### Server Components với máy chủ {/*server-components-with-a-server*/}
Server Components cũng có thể chạy trên máy chủ web trong quá trình yêu cầu một trang, cho phép bạn truy cập lớp dữ liệu của mình mà không cần xây dựng API. Chúng được hiển thị trước khi ứng dụng của bạn được đóng gói và có thể chuyển dữ liệu và JSX làm đạo cụ cho Client Components.

Nếu không có Server Components, thông thường bạn sẽ tìm nạp dữ liệu động trên máy khách trong Effect:

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // NOTE: loads *after* first render.
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);
  
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
  // NOTE: loads *after* Note renders.
  // Causing an expensive client-server waterfall.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>By: {author.name}</span>;
}
```
```js
// api
import db from './database';

app.get(`/api/notes/:id`, async (req, res) => {
  const note = await db.notes.get(id);
  res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
  const author = await db.authors.get(id);
  res.send({author});
});
```

Với Server Components, bạn có thể đọc dữ liệu và hiển thị nó trong component:

```js
import db from './database';

async function Note({id}) {
  // NOTE: loads *during* render.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // NOTE: loads *after* Note,
  // but is fast if data is co-located.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

Sau đó, trình đóng gói kết hợp dữ liệu, Server Components được hiển thị và Client Components động thành một bundle. Tùy chọn, bundle đó sau đó có thể được hiển thị phía máy chủ (SSR) để tạo HTML ban đầu cho trang. Khi trang tải, trình duyệt không thấy các component `Note` và `Author` ban đầu; chỉ đầu ra được hiển thị được gửi đến máy khách:

```js
<div>
  <span>By: The React Team</span>
  <p>React 19 is...</p>
</div>
```

Server Components có thể được tạo động bằng cách tìm nạp lại chúng từ máy chủ, nơi chúng có thể truy cập dữ liệu và hiển thị lại. Kiến trúc ứng dụng mới này kết hợp mô hình tinh thần "yêu cầu/phản hồi" đơn giản của các Ứng dụng nhiều trang tập trung vào máy chủ với tính tương tác liền mạch của các Ứng dụng một trang tập trung vào máy khách, mang đến cho bạn những điều tốt nhất của cả hai thế giới.

### Thêm tính tương tác vào Server Components {/*adding-interactivity-to-server-components*/}

Server Components không được gửi đến trình duyệt, vì vậy chúng không thể sử dụng các API tương tác như `useState`. Để thêm tính tương tác vào Server Components, bạn có thể kết hợp chúng với Client Component bằng chỉ thị `"use client"`.

<Note>

#### Không có chỉ thị cho Server Components. {/*there-is-no-directive-for-server-components*/}

Một sự hiểu lầm phổ biến là Server Components được biểu thị bằng `"use server"`, nhưng không có chỉ thị nào cho Server Components. Chỉ thị `"use server"` được sử dụng cho Server Functions.

Để biết thêm thông tin, hãy xem tài liệu về [Directives](/reference/rsc/directives).

</Note>


Trong ví dụ sau, Server Component `Notes` nhập một Client Component `Expandable` sử dụng trạng thái để chuyển đổi trạng thái `expanded` của nó:
```js
// Server Component
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```
```js
// Client Component
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Toggle
      </button>
      {expanded && children}
    </div>
  )
}
```

Điều này hoạt động bằng cách hiển thị `Notes` dưới dạng Server Component trước, sau đó hướng dẫn trình đóng gói tạo một bundle cho Client Component `Expandable`. Trong trình duyệt, Client Components sẽ thấy đầu ra của Server Components được chuyển dưới dạng đạo cụ:

```js
<head>
  {/* the bundle for Client Components */}
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable key={1}>
      <p>this is the first note</p>
    </Expandable>
    <Expandable key={2}>
      <p>this is the second note</p>
    </Expandable>
    {/*...*/}
  </div> 
</body>
```

### Async components với Server Components {/*async-components-with-server-components*/}

Server Components giới thiệu một cách mới để viết Components bằng async/await. Khi bạn `await` trong một component async, React sẽ tạm dừng và đợi promise được giải quyết trước khi tiếp tục hiển thị. Điều này hoạt động trên các ranh giới máy chủ/máy khách với hỗ trợ phát trực tuyến cho Suspense.

Bạn thậm chí có thể tạo một promise trên máy chủ và đợi nó trên máy khách:

```js
// Server Component
import db from './database';

async function Page({id}) {
  // Will suspend the Server Component.
  const note = await db.notes.get(id);
  
  // NOTE: not awaited, will start here and await on the client. 
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

```js
// Client Component
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // NOTE: this will resume the promise from the server.
  // It will suspend until the data is available.
  const comments = use(commentsPromise);
  return comments.map(commment => <p>{comment}</p>);
}
```

Nội dung `note` là dữ liệu quan trọng để trang hiển thị, vì vậy chúng tôi `await` nó trên máy chủ. Các comment nằm bên dưới phần hiển thị đầu tiên và có mức độ ưu tiên thấp hơn, vì vậy chúng tôi bắt đầu promise trên máy chủ và đợi nó trên máy khách bằng API `use`. Điều này sẽ tạm dừng trên máy khách mà không chặn nội dung `note` hiển thị.

Vì các component async không được hỗ trợ trên máy khách, chúng tôi đợi promise bằng `use`.
