---
title: 'Hướng dẫn: Tic-Tac-Toe'
---

<Intro>

Trong hướng dẫn này, bạn sẽ xây dựng một trò chơi tic-tac-toe nhỏ. Hướng dẫn này không yêu cầu kiến thức React sẵn có. Các kỹ thuật bạn sẽ học trong hướng dẫn là nền tảng để xây dựng bất kỳ ứng dụng React nào, và việc hiểu đầy đủ nó sẽ giúp bạn có hiểu biết sâu sắc về React.

</Intro>

<Note>

Hướng dẫn này được thiết kế cho những người thích **học qua thực hành** và muốn nhanh chóng thử làm một cái gì đó cụ thể. Nếu bạn thích học từng khái niệm từng bước một, hãy bắt đầu với [Mô tả UI.](/learn/describing-the-ui)

</Note>

Hướng dẫn được chia thành nhiều phần:

- [Thiết lập cho hướng dẫn](#setup-for-the-tutorial) sẽ cung cấp cho bạn **điểm bắt đầu** để theo dõi hướng dẫn.
- [Tổng quan](#overview) sẽ dạy bạn **những điều cơ bản** của React: components, props, và state.
- [Hoàn thiện trò chơi](#completing-the-game) sẽ dạy bạn **các kỹ thuật phổ biến nhất** trong phát triển React.
- [Thêm tính năng du hành thời gian](#adding-time-travel) sẽ cho bạn **cái nhìn sâu sắc hơn** về những điểm mạnh độc đáo của React.

### Bạn sẽ xây dựng gì? {/*what-are-you-building*/}

Trong hướng dẫn này, bạn sẽ xây dựng một trò chơi tic-tac-toe tương tác với React.

Bạn có thể xem trò chơi sẽ trông như thế nào khi hoàn thành ở đây:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Nếu mã code chưa có ý nghĩa với bạn, hoặc nếu bạn chưa quen với cú pháp của code, đừng lo lắng! Mục tiêu của hướng dẫn này là giúp bạn hiểu React và cú pháp của nó.

Chúng tôi khuyên bạn nên xem qua trò chơi tic-tac-toe ở trên trước khi tiếp tục với hướng dẫn. Một trong những tính năng mà bạn sẽ nhận thấy là có một danh sách đánh số ở bên phải bảng chơi. Danh sách này cung cấp lịch sử tất cả các nước đi đã xảy ra trong trò chơi, và nó được cập nhật khi trò chơi diễn ra.

Sau khi bạn đã chơi thử với trò chơi tic-tac-toe đã hoàn thành, hãy tiếp tục cuộn xuống. Bạn sẽ bắt đầu với một template đơn giản hơn trong hướng dẫn này. Bước tiếp theo của chúng tôi là thiết lập để bạn có thể bắt đầu xây dựng trò chơi.

## Thiết lập cho hướng dẫn {/*setup-for-the-tutorial*/}

Trong trình soạn thảo code trực tiếp bên dưới, nhấp vào **Fork** ở góc trên bên phải để mở trình soạn thảo trong tab mới sử dụng trang web CodeSandbox. CodeSandbox cho phép bạn viết code trong trình duyệt và xem trước cách người dùng sẽ thấy ứng dụng mà bạn đã tạo. Tab mới sẽ hiển thị một ô vuông trống và mã code khởi đầu cho hướng dẫn này.

<Sandpack>

```js src/App.js
export default function Square() {
  return <button className="square">X</button>;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

Bạn cũng có thể theo dõi hướng dẫn này bằng cách sử dụng môi trường phát triển local của mình. Để làm điều này, bạn cần:

1. Cài đặt [Node.js](https://nodejs.org/en/)
1. Trong tab CodeSandbox mà bạn đã mở trước đó, nhấn nút ở góc trên bên trái để mở menu, sau đó chọn **Download Sandbox** trong menu đó để tải xuống một file nén của các file về máy local
1. Giải nén file đó, sau đó mở terminal và `cd` vào thư mục bạn đã giải nén
1. Cài đặt các dependencies bằng `npm install`
1. Chạy `npm start` để khởi động server local và làm theo các hướng dẫn để xem code chạy trong trình duyệt

Nếu bạn gặp khó khăn, đừng để điều này làm bạn dừng lại! Thay vào đó, hãy tiếp tục theo dõi trực tuyến và thử thiết lập local lại sau.

</Note>

## Tổng quan {/*overview*/}

Bây giờ bạn đã thiết lập xong, hãy tìm hiểu tổng quan về React!

### Kiểm tra mã code khởi đầu {/*inspecting-the-starter-code*/}

Trong CodeSandbox, bạn sẽ thấy ba phần chính:

![CodeSandbox with starter code](../images/tutorial/react-starter-code-codesandbox.png)

1. Phần _Files_ với danh sách các file như `App.js`, `index.js`, `styles.css` và một thư mục có tên `public`
1. Trình _soạn thảo code_ nơi bạn sẽ thấy mã nguồn của file bạn đã chọn
1. Phần _browser_ nơi bạn sẽ thấy cách code bạn đã viết sẽ được hiển thị

File `App.js` nên được chọn trong phần _Files_. Nội dung của file đó trong trình _soạn thảo code_ sẽ là:

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

Phần _browser_ nên hiển thị một ô vuông có chữ X bên trong như sau:

![x-filled square](../images/tutorial/x-filled-square.png)

Bây giờ hãy xem các file trong mã code khởi đầu.

#### `App.js` {/*appjs*/}

Mã code trong `App.js` tạo ra một _component_. Trong React, một component là một đoạn code có thể tái sử dụng đại diện cho một phần của giao diện người dùng. Components được sử dụng để render, quản lý và cập nhật các phần tử UI trong ứng dụng của bạn. Hãy xem component từng dòng một để hiểu điều gì đang xảy ra:

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

Dòng đầu tiên định nghĩa một function có tên `Square`. Từ khóa JavaScript `export` làm cho function này có thể truy cập được từ bên ngoài file này. Từ khóa `default` cho các file khác sử dụng code của bạn biết rằng đây là function chính trong file của bạn.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

Dòng thứ hai trả về một button. Từ khóa JavaScript `return` có nghĩa là bất cứ thứ gì đi sau nó sẽ được trả về như một giá trị cho người gọi function. `<button>` là một *phần tử JSX*. Một phần tử JSX là sự kết hợp giữa mã JavaScript và các thẻ HTML mô tả những gì bạn muốn hiển thị. `className="square"` là một thuộc tính button hoặc *prop* cho CSS biết cách tạo kiểu cho button. `X` là văn bản được hiển thị bên trong button và `</button>` đóng phần tử JSX để chỉ ra rằng bất kỳ nội dung nào sau đó không nên được đặt bên trong button.

#### `styles.css` {/*stylescss*/}

Nhấp vào file có nhãn `styles.css` trong phần _Files_ của CodeSandbox. File này định nghĩa các kiểu cho ứng dụng React của bạn. Hai _bộ chọn CSS_ đầu tiên (`*` và `body`) định nghĩa kiểu cho các phần lớn của ứng dụng của bạn trong khi bộ chọn `.square` định nghĩa kiểu cho bất kỳ component nào có thuộc tính `className` được đặt thành `square`. Trong code của bạn, điều đó sẽ khớp với button từ component Square của bạn trong file `App.js`.

#### `index.js` {/*indexjs*/}

Nhấp vào file có nhãn `index.js` trong phần _Files_ của CodeSandbox. Bạn sẽ không chỉnh sửa file này trong suốt hướng dẫn nhưng nó là cầu nối giữa component bạn đã tạo trong file `App.js` và trình duyệt web.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

Các dòng 1-5 tập hợp tất cả các phần cần thiết lại với nhau: 

* React
* Thư viện React để giao tiếp với trình duyệt web (React DOM)
* các kiểu cho components của bạn
* component bạn đã tạo trong `App.js`.

Phần còn lại của file tập hợp tất cả các phần lại với nhau và chèn sản phẩm cuối cùng vào `index.html` trong thư mục `public`.

### Xây dựng bảng chơi {/*building-the-board*/}

Hãy quay lại `App.js`. Đây là nơi bạn sẽ dành phần còn lại của hướng dẫn.

Hiện tại bảng chơi chỉ có một ô vuông, nhưng bạn cần chín ô! Nếu bạn chỉ thử và sao chép dán ô vuông của mình để tạo hai ô vuông như thế này:

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

Bạn sẽ gặp lỗi này:

<ConsoleBlock level="error">

/src/App.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX Fragment `<>...</>`?

</ConsoleBlock>

React components cần trả về một phần tử JSX duy nhất và không phải nhiều phần tử JSX liền kề như hai button. Để sửa lỗi này, bạn có thể sử dụng *Fragments* (`<>` và `</>`) để bọc nhiều phần tử JSX liền kề như sau:

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

Bây giờ bạn sẽ thấy:

![two x-filled squares](../images/tutorial/two-x-filled-squares.png)

Tuyệt vời! Bây giờ bạn chỉ cần sao chép-dán vài lần để thêm chín ô vuông và...

![nine x-filled squares in a line](../images/tutorial/nine-x-filled-squares.png)

Ồ không! Các ô vuông đều nằm trên một dòng duy nhất, không phải trong một lưới như bạn cần cho bảng chơi. Để sửa lỗi này, bạn cần nhóm các ô vuông của mình thành các hàng bằng `div`s và thêm một số lớp CSS. Trong khi làm điều đó, bạn sẽ đặt cho mỗi ô vuông một số để đảm bảo bạn biết mỗi ô vuông được hiển thị ở đâu.

Trong file `App.js`, cập nhật component `Square` để trông như thế này:

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

CSS được định nghĩa trong `styles.css` tạo kiểu cho các divs có `className` là `board-row`. Bây giờ bạn đã nhóm các component của mình thành các hàng với các `div`s đã được tạo kiểu, bạn đã có bảng chơi tic-tac-toe của mình:

![tic-tac-toe board filled with numbers 1 through 9](../images/tutorial/number-filled-board.png)

Nhưng bây giờ bạn có một vấn đề. Component của bạn có tên `Square`, thực sự không còn là một ô vuông nữa. Hãy sửa điều đó bằng cách đổi tên thành `Board`:

```js {1}
export default function Board() {
  //...
}
```

Ở thời điểm này, code của bạn nên trông giống như thế này:

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

Psssst... Đó là rất nhiều để gõ! Không sao nếu bạn sao chép và dán code từ trang này. Tuy nhiên, nếu bạn muốn một chút thử thách, chúng tôi khuyên bạn chỉ sao chép code mà bạn đã tự tay gõ ít nhất một lần.

</Note>

### Truyền dữ liệu qua props {/*passing-data-through-props*/}

Tiếp theo, bạn sẽ muốn thay đổi giá trị của một ô vuông từ trống sang "X" khi người dùng nhấp vào ô vuông đó. Với cách bạn đã xây dựng bảng chơi cho đến nay, bạn sẽ cần sao chép-dán code cập nhật ô vuông chín lần (một lần cho mỗi ô vuông bạn có)! Thay vì sao chép-dán, kiến trúc component của React cho phép bạn tạo một component có thể tái sử dụng để tránh code lộn xộn, trùng lặp.

Đầu tiên, bạn sẽ sao chép dòng định nghĩa ô vuông đầu tiên của bạn (`<button className="square">1</button>`) từ component `Board` của bạn vào một component `Square` mới:

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

Sau đó bạn sẽ cập nhật component Board để render component `Square` đó bằng cú pháp JSX:

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Lưu ý rằng không giống như các `div`s của trình duyệt, các component của riêng bạn `Board` và `Square` phải bắt đầu bằng chữ cái viết hoa. 

Hãy xem:

![one-filled board](../images/tutorial/board-filled-with-ones.png)

Ồ không! Bạn đã mất các ô vuông có số mà bạn đã có trước đó. Bây giờ mỗi ô vuông đều hiển thị "1". Để sửa lỗi này, bạn sẽ sử dụng *props* để truyền giá trị mà mỗi ô vuông nên có từ component cha (`Board`) đến component con của nó (`Square`).

Cập nhật component `Square` để đọc prop `value` mà bạn sẽ truyền từ `Board`:

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` cho biết component Square có thể được truyền một prop có tên `value`.

Bây giờ bạn muốn hiển thị `value` đó thay vì `1` bên trong mỗi ô vuông. Hãy thử làm như thế này:

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

Ồ, đây không phải là điều bạn muốn:

![value-filled board](../images/tutorial/board-filled-with-value.png)

Bạn muốn render biến JavaScript có tên `value` từ component của mình, không phải từ "value". Để "thoát vào JavaScript" từ JSX, bạn cần dấu ngoặc nhọn. Thêm dấu ngoặc nhọn xung quanh `value` trong JSX như sau:

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

Hiện tại, bạn sẽ thấy một bảng trống:

![empty board](../images/tutorial/empty-board.png)

Điều này là do component `Board` chưa truyền prop `value` cho mỗi component `Square` mà nó render. Để sửa lỗi này, bạn sẽ thêm prop `value` vào mỗi component `Square` được render bởi component `Board`:

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

Bây giờ bạn sẽ lại thấy một lưới số:

![tic-tac-toe board filled with numbers 1 through 9](../images/tutorial/number-filled-board.png)

Code đã cập nhật của bạn nên trông như thế này:

<Sandpack>

```js src/App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Tạo một component tương tác {/*making-an-interactive-component*/}

Hãy điền component `Square` với một `X` khi bạn nhấp vào nó. Khai báo một function có tên `handleClick` bên trong `Square`. Sau đó, thêm `onClick` vào props của phần tử JSX button được trả về từ `Square`:

```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('clicked!');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

Nếu bạn nhấp vào một ô vuông bây giờ, bạn sẽ thấy một log nói `"clicked!"` trong tab _Console_ ở cuối phần _Browser_ trong CodeSandbox. Nhấp vào ô vuông nhiều hơn một lần sẽ log `"clicked!"` lại. Các console log lặp lại với cùng một thông báo sẽ không tạo thêm dòng trong console. Thay vào đó, bạn sẽ thấy một bộ đếm tăng dần bên cạnh log `"clicked!"` đầu tiên của bạn.

<Note>

Nếu bạn đang theo dõi hướng dẫn này bằng cách sử dụng môi trường phát triển local của mình, bạn cần mở Console của trình duyệt. Ví dụ, nếu bạn sử dụng trình duyệt Chrome, bạn có thể xem Console bằng phím tắt **Shift + Ctrl + J** (trên Windows/Linux) hoặc **Option + ⌘ + J** (trên macOS).

</Note>

Như một bước tiếp theo, bạn muốn component Square "nhớ" rằng nó đã được nhấp, và điền nó bằng dấu "X". Để "nhớ" mọi thứ, components sử dụng *state*.

React cung cấp một function đặc biệt có tên `useState` mà bạn có thể gọi từ component của mình để cho phép nó "nhớ" mọi thứ. Hãy lưu trữ giá trị hiện tại của `Square` trong state, và thay đổi nó khi `Square` được nhấp.

Import `useState` ở đầu file. Xóa prop `value` khỏi component `Square`. Thay vào đó, thêm một dòng mới ở đầu `Square` gọi `useState`. Cho nó trả về một biến state có tên `value`:

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` lưu trữ giá trị và `setValue` là một function có thể được sử dụng để thay đổi giá trị. `null` được truyền vào `useState` được sử dụng làm giá trị ban đầu cho biến state này, vì vậy `value` ở đây bắt đầu bằng `null`.

Vì component `Square` không còn nhận props nữa, bạn sẽ xóa prop `value` khỏi tất cả chín component Square được tạo bởi component Board:

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Bây giờ bạn sẽ thay đổi `Square` để hiển thị một "X" khi được nhấp. Thay thế event handler `console.log("clicked!");` bằng `setValue('X');`. Bây giờ component `Square` của bạn trông như thế này:

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

Bằng cách gọi function `set` này từ một handler `onClick`, bạn đang báo cho React biết để re-render `Square` đó bất cứ khi nào `<button>` của nó được nhấp. Sau khi cập nhật, `value` của `Square` sẽ là `'X'`, vì vậy bạn sẽ thấy "X" trên bảng chơi. Nhấp vào bất kỳ Square nào, và "X" sẽ xuất hiện:

![adding xes to board](../images/tutorial/tictac-adding-x-s.gif)

Mỗi Square có state riêng của nó: `value` được lưu trữ trong mỗi Square hoàn toàn độc lập với các Square khác. Khi bạn gọi một function `set` trong một component, React tự động cập nhật các component con bên trong cũng vậy.

Sau khi bạn đã thực hiện các thay đổi ở trên, code của bạn sẽ trông như thế này:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### React Developer Tools {/*react-developer-tools*/}

React DevTools cho phép bạn kiểm tra props và state của các React components của bạn. Bạn có thể tìm thấy tab React DevTools ở cuối phần _browser_ trong CodeSandbox:

![React DevTools in CodeSandbox](../images/tutorial/codesandbox-devtools.png)

Để kiểm tra một component cụ thể trên màn hình, sử dụng nút ở góc trên bên trái của React DevTools:

![Selecting components on the page with React DevTools](../images/tutorial/devtools-select.gif)

<Note>

Đối với phát triển local, React DevTools có sẵn dưới dạng extension trình duyệt [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/), và [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil). Cài đặt nó, và tab *Components* sẽ xuất hiện trong Developer Tools của trình duyệt của bạn cho các trang web sử dụng React.

</Note>

## Hoàn thiện trò chơi {/*completing-the-game*/}

Đến thời điểm này, bạn đã có tất cả các khối xây dựng cơ bản cho trò chơi tic-tac-toe của mình. Để có một trò chơi hoàn chỉnh, bây giờ bạn cần luân phiên đặt "X" và "O" trên bảng, và bạn cần một cách để xác định người thắng.

### Nâng state lên {/*lifting-state-up*/}

Hiện tại, mỗi component `Square` duy trì một phần state của trò chơi. Để kiểm tra người thắng trong trò chơi tic-tac-toe, `Board` sẽ cần bằng cách nào đó biết state của mỗi trong số 9 component `Square`.

Bạn sẽ tiếp cận điều đó như thế nào? Lúc đầu, bạn có thể đoán rằng `Board` cần "hỏi" mỗi `Square` về state của `Square` đó. Mặc dù cách tiếp cận này về mặt kỹ thuật có thể thực hiện được trong React, chúng tôi không khuyến khích vì code trở nên khó hiểu, dễ bị lỗi, và khó refactor. Thay vào đó, cách tiếp cận tốt nhất là lưu trữ state của trò chơi trong component cha `Board` thay vì trong mỗi `Square`. Component `Board` có thể cho mỗi `Square` biết cần hiển thị gì bằng cách truyền một prop, giống như bạn đã làm khi truyền một số cho mỗi Square.

**Để thu thập dữ liệu từ nhiều component con, hoặc để có hai component con giao tiếp với nhau, hãy khai báo state dùng chung trong component cha của chúng. Component cha có thể truyền state đó xuống các component con thông qua props. Điều này giữ cho các component con đồng bộ với nhau và với component cha của chúng.**

Nâng state lên component cha là điều phổ biến khi các React components được refactor.

Hãy tận dụng cơ hội này để thử nó. Chỉnh sửa component `Board` để nó khai báo một biến state có tên `squares` mặc định là một mảng gồm 9 null tương ứng với 9 ô vuông:

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)` tạo một mảng với chín phần tử và đặt mỗi phần tử thành `null`. Lời gọi `useState()` xung quanh nó khai báo một biến state `squares` ban đầu được đặt thành mảng đó. Mỗi mục trong mảng tương ứng với giá trị của một ô vuông. Khi bạn điền bảng sau này, mảng `squares` sẽ trông như thế này:

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

Bây giờ component `Board` của bạn cần truyền prop `value` xuống mỗi `Square` mà nó render:

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

Tiếp theo, bạn sẽ chỉnh sửa component `Square` để nhận prop `value` từ component Board. Điều này sẽ yêu cầu xóa việc theo dõi state của `value` trong component Square và prop `onClick` của button:

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

Ở thời điểm này bạn sẽ thấy một bảng chơi tic-tac-toe trống:

![empty board](../images/tutorial/empty-board.png)

Và code của bạn nên trông như thế này:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Mỗi Square bây giờ sẽ nhận một prop `value` sẽ là `'X'`, `'O'`, hoặc `null` cho các ô vuông trống.

Tiếp theo, bạn cần thay đổi điều gì xảy ra khi một `Square` được nhấp. Component `Board` bây giờ duy trì các ô vuông nào đã được điền. Bạn sẽ cần tạo một cách để `Square` cập nhật state của `Board`. Vì state là riêng tư đối với component định nghĩa nó, bạn không thể cập nhật state của `Board` trực tiếp từ `Square`.

Thay vào đó, bạn sẽ truyền một function từ component `Board` xuống component `Square`, và bạn sẽ có `Square` gọi function đó khi một ô vuông được nhấp. Bạn sẽ bắt đầu với function mà component `Square` sẽ gọi khi nó được nhấp. Bạn sẽ gọi function đó là `onSquareClick`:

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Tiếp theo, bạn sẽ thêm function `onSquareClick` vào props của component `Square`:

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Bây giờ bạn sẽ kết nối prop `onSquareClick` với một function trong component `Board` mà bạn sẽ đặt tên là `handleClick`. Để kết nối `onSquareClick` với `handleClick`, bạn sẽ truyền một function vào prop `onSquareClick` của component `Square` đầu tiên: 

```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

Cuối cùng, bạn sẽ định nghĩa function `handleClick` bên trong component Board để cập nhật mảng `squares` chứa state của bảng chơi:

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick() {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

Function `handleClick` tạo một bản sao của mảng `squares` (`nextSquares`) bằng phương thức Array `slice()` của JavaScript. Sau đó, `handleClick` cập nhật mảng `nextSquares` để thêm `X` vào ô vuông đầu tiên (index `[0]`).

Gọi function `setSquares` cho React biết state của component đã thay đổi. Điều này sẽ kích hoạt re-render của các components sử dụng state `squares` (`Board`) cũng như các component con của nó (các component `Square` tạo nên bảng chơi).

<Note>

JavaScript hỗ trợ [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) có nghĩa là một function bên trong (ví dụ: `handleClick`) có quyền truy cập vào các biến và functions được định nghĩa trong một function bên ngoài (ví dụ: `Board`). Function `handleClick` có thể đọc state `squares` và gọi phương thức `setSquares` vì cả hai đều được định nghĩa bên trong function `Board`.

</Note>

Bây giờ bạn có thể thêm X vào bảng... nhưng chỉ vào ô vuông trên bên trái. Function `handleClick` của bạn được hardcode để cập nhật index cho ô vuông trên bên trái (`0`). Hãy cập nhật `handleClick` để có thể cập nhật bất kỳ ô vuông nào. Thêm một đối số `i` vào function `handleClick` nhận index của ô vuông cần cập nhật:

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

Tiếp theo, bạn sẽ cần truyền `i` đó vào `handleClick`. Bạn có thể thử đặt prop `onSquareClick` của square thành `handleClick(0)` trực tiếp trong JSX như thế này, nhưng nó sẽ không hoạt động:

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

Đây là lý do tại sao điều này không hoạt động. Lời gọi `handleClick(0)` sẽ là một phần của việc render component board. Vì `handleClick(0)` thay đổi state của component board bằng cách gọi `setSquares`, toàn bộ component board của bạn sẽ được re-render lại. Nhưng điều này lại chạy `handleClick(0)` một lần nữa, dẫn đến một vòng lặp vô hạn:

<ConsoleBlock level="error">

Too many re-renders. React limits the number of renders to prevent an infinite loop.

</ConsoleBlock>

Tại sao vấn đề này không xảy ra trước đó?

Khi bạn truyền `onSquareClick={handleClick}`, bạn đang truyền function `handleClick` xuống như một prop. Bạn không gọi nó! Nhưng bây giờ bạn đang *gọi* function đó ngay lập tức--chú ý dấu ngoặc đơn trong `handleClick(0)`--và đó là lý do tại sao nó chạy quá sớm. Bạn không *muốn* gọi `handleClick` cho đến khi người dùng nhấp!

Bạn có thể sửa lỗi này bằng cách tạo một function như `handleFirstSquareClick` gọi `handleClick(0)`, một function như `handleSecondSquareClick` gọi `handleClick(1)`, và cứ như vậy. Bạn sẽ truyền (thay vì gọi) các functions này xuống như props như `onSquareClick={handleFirstSquareClick}`. Điều này sẽ giải quyết vòng lặp vô hạn.

Tuy nhiên, định nghĩa chín functions khác nhau và đặt tên cho mỗi function là quá dài dòng. Thay vào đó, hãy làm như sau:

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

Chú ý cú pháp mới `() =>`. Ở đây, `() => handleClick(0)` là một *arrow function,* đây là cách ngắn gọn hơn để định nghĩa functions. Khi ô vuông được nhấp, code sau dấu "mũi tên" `=>` sẽ chạy, gọi `handleClick(0)`.

Bây giờ bạn cần cập nhật tám ô vuông còn lại để gọi `handleClick` từ các arrow functions bạn truyền. Đảm bảo rằng đối số cho mỗi lần gọi `handleClick` tương ứng với index của ô vuông đúng:

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
};
```

Bây giờ bạn có thể lại thêm X vào bất kỳ ô vuông nào trên bảng bằng cách nhấp vào chúng:

![filling the board with X](../images/tutorial/tictac-adding-x-s.gif)

Nhưng lần này tất cả việc quản lý state được xử lý bởi component `Board`!

Đây là cách code của bạn nên trông như thế:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Bây giờ việc xử lý state của bạn đã ở trong component `Board`, component cha `Board` truyền props xuống các component con `Square` để chúng có thể được hiển thị đúng. Khi nhấp vào một `Square`, component con `Square` bây giờ yêu cầu component cha `Board` cập nhật state của bảng. Khi state của `Board` thay đổi, cả component `Board` và mọi component con `Square` đều tự động re-render. Giữ state của tất cả các ô vuông trong component `Board` sẽ cho phép nó xác định người thắng trong tương lai.

Hãy tóm tắt lại những gì xảy ra khi người dùng nhấp vào ô vuông trên bên trái trên bảng của bạn để thêm một `X` vào đó:

1. Nhấp vào ô vuông trên bên trái chạy function mà `button` nhận được như prop `onClick` của nó từ `Square`. Component `Square` nhận được function đó như prop `onSquareClick` của nó từ `Board`. Component `Board` đã định nghĩa function đó trực tiếp trong JSX. Nó gọi `handleClick` với đối số là `0`.
1. `handleClick` sử dụng đối số (`0`) để cập nhật phần tử đầu tiên của mảng `squares` từ `null` thành `X`.
1. State `squares` của component `Board` đã được cập nhật, vì vậy `Board` và tất cả các component con của nó re-render. Điều này làm cho prop `value` của component `Square` với index `0` thay đổi từ `null` thành `X`.

Cuối cùng người dùng thấy rằng ô vuông trên bên trái đã thay đổi từ trống thành có `X` sau khi nhấp vào nó.

<Note>

Thuộc tính `onClick` của phần tử DOM `<button>` có ý nghĩa đặc biệt đối với React vì nó là một component tích hợp sẵn. Đối với các component tùy chỉnh như Square, việc đặt tên là tùy bạn. Bạn có thể đặt bất kỳ tên nào cho prop `onSquareClick` của `Square` hoặc function `handleClick` của `Board`, và code sẽ hoạt động giống nhau. Trong React, quy ước là sử dụng tên `onSomething` cho props đại diện cho events và `handleSomething` cho các định nghĩa function xử lý các events đó.

</Note>

### Tại sao tính bất biến lại quan trọng {/*why-immutability-is-important*/}

Chú ý cách trong `handleClick`, bạn gọi `.slice()` để tạo một bản sao của mảng `squares` thay vì sửa đổi mảng hiện có. Để giải thích tại sao, chúng ta cần thảo luận về tính bất biến và tại sao tính bất biến lại quan trọng để học.

Nhìn chung có hai cách tiếp cận để thay đổi dữ liệu. Cách tiếp cận đầu tiên là _mutate_ (đột biến) dữ liệu bằng cách trực tiếp thay đổi các giá trị của dữ liệu. Cách tiếp cận thứ hai là thay thế dữ liệu bằng một bản sao mới có các thay đổi mong muốn. Đây là cách nó sẽ trông như thế nào nếu bạn mutate mảng `squares`:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Bây giờ `squares` là ["X", null, null, null, null, null, null, null, null];
```

Và đây là cách nó sẽ trông như thế nào nếu bạn thay đổi dữ liệu mà không mutate mảng `squares`:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// Bây giờ `squares` không thay đổi, nhưng phần tử đầu tiên của `nextSquares` là 'X' thay vì `null`
```

Kết quả là giống nhau nhưng bằng cách không mutate (thay đổi dữ liệu cơ bản) trực tiếp, bạn có được một số lợi ích.

Tính bất biến làm cho các tính năng phức tạp dễ triển khai hơn nhiều. Sau này trong hướng dẫn này, bạn sẽ triển khai tính năng "du hành thời gian" cho phép bạn xem lại lịch sử trò chơi và "nhảy ngược" về các nước đi trước đó. Chức năng này không chỉ dành riêng cho trò chơi--khả năng undo và redo các hành động nhất định là yêu cầu phổ biến cho các ứng dụng. Tránh đột biến dữ liệu trực tiếp cho phép bạn giữ nguyên các phiên bản trước đó của dữ liệu và sử dụng lại chúng sau này.

Cũng có một lợi ích khác của tính bất biến. Theo mặc định, tất cả các component con tự động re-render khi state của component cha thay đổi. Điều này bao gồm cả các component con không bị ảnh hưởng bởi thay đổi. Mặc dù re-rendering tự nó không đáng chú ý đối với người dùng (bạn không nên cố gắng tránh nó!), bạn có thể muốn bỏ qua re-rendering một phần của cây rõ ràng không bị ảnh hưởng bởi nó vì lý do hiệu suất. Tính bất biến làm cho việc so sánh xem dữ liệu của components đã thay đổi hay chưa trở nên rất rẻ. Bạn có thể tìm hiểu thêm về cách React chọn khi nào để re-render một component trong [tham chiếu API `memo`](/reference/react/memo).

### Luân phiên lượt chơi {/*taking-turns*/}

Bây giờ đã đến lúc sửa một lỗi lớn trong trò chơi tic-tac-toe này: các "O" không thể được đánh dấu trên bảng.

Bạn sẽ đặt nước đi đầu tiên là "X" theo mặc định. Hãy theo dõi điều này bằng cách thêm một phần state khác vào component Board:

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

Mỗi khi người chơi di chuyển, `xIsNext` (một boolean) sẽ được đảo ngược để xác định người chơi nào đi tiếp theo và state của trò chơi sẽ được lưu. Bạn sẽ cập nhật function `handleClick` của `Board` để đảo ngược giá trị của `xIsNext`:

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

Bây giờ, khi bạn nhấp vào các ô vuông khác nhau, chúng sẽ luân phiên giữa `X` và `O`, như chúng nên!

Nhưng đợi đã, có một vấn đề. Hãy thử nhấp vào cùng một ô vuông nhiều lần:

![O overwriting an X](../images/tutorial/o-replaces-x.gif)

`X` bị ghi đè bởi một `O`! Mặc dù điều này sẽ thêm một biến thể rất thú vị cho trò chơi, chúng ta sẽ tuân theo các quy tắc gốc cho bây giờ.

Khi bạn đánh dấu một ô vuông bằng `X` hoặc `O`, bạn không kiểm tra trước xem ô vuông đó đã có giá trị `X` hoặc `O` chưa. Bạn có thể sửa lỗi này bằng cách *return sớm*. Bạn sẽ kiểm tra xem ô vuông đã có `X` hoặc `O` chưa. Nếu ô vuông đã được điền, bạn sẽ `return` trong function `handleClick` sớm--trước khi nó cố gắng cập nhật state của bảng.

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Bây giờ bạn chỉ có thể thêm `X` hoặc `O` vào các ô vuông trống! Đây là cách code của bạn nên trông như ở thời điểm này:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Khai báo người thắng {/*declaring-a-winner*/}

Bây giờ người chơi có thể luân phiên, bạn sẽ muốn hiển thị khi trò chơi đã thắng và không còn nước đi nào để thực hiện. Để làm điều này, bạn sẽ thêm một helper function có tên `calculateWinner` nhận một mảng gồm 9 ô vuông, kiểm tra người thắng và trả về `'X'`, `'O'`, hoặc `null` tùy theo trường hợp. Đừng lo lắng quá nhiều về function `calculateWinner`; nó không đặc biệt dành cho React:

```js src/App.js
export default function Board() {
  //...
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

<Note>

Không quan trọng việc bạn định nghĩa `calculateWinner` trước hay sau `Board`. Hãy đặt nó ở cuối để bạn không phải cuộn qua nó mỗi lần chỉnh sửa components của mình.

</Note>

Bạn sẽ gọi `calculateWinner(squares)` trong function `handleClick` của component `Board` để kiểm tra xem người chơi đã thắng chưa. Bạn có thể thực hiện kiểm tra này cùng lúc với việc kiểm tra xem người dùng đã nhấp vào một ô vuông đã có `X` hoặc `O` chưa. Chúng ta muốn return sớm trong cả hai trường hợp:

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Để cho người chơi biết khi trò chơi kết thúc, bạn có thể hiển thị văn bản như "Winner: X" hoặc "Winner: O". Để làm điều đó, bạn sẽ thêm một phần `status` vào component `Board`. Status sẽ hiển thị người thắng nếu trò chơi đã kết thúc và nếu trò chơi đang diễn ra, bạn sẽ hiển thị lượt chơi tiếp theo của người chơi nào:

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

Chúc mừng! Bây giờ bạn đã có một trò chơi tic-tac-toe hoạt động. Và bạn cũng vừa học được những điều cơ bản của React. Vì vậy _bạn_ là người thắng thực sự ở đây. Đây là cách code của bạn nên trông như thế:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

## Thêm tính năng du hành thời gian {/*adding-time-travel*/}

Như một bài tập cuối cùng, hãy làm cho việc "quay ngược thời gian" về các nước đi trước đó trong trò chơi trở nên có thể.

### Lưu trữ lịch sử các nước đi {/*storing-a-history-of-moves*/}

Nếu bạn mutate mảng `squares`, việc triển khai tính năng du hành thời gian sẽ rất khó khăn.

Tuy nhiên, bạn đã sử dụng `slice()` để tạo một bản sao mới của mảng `squares` sau mỗi nước đi, và xử lý nó như bất biến. Điều này sẽ cho phép bạn lưu trữ mọi phiên bản trước đó của mảng `squares`, và điều hướng giữa các lượt đã xảy ra.

Bạn sẽ lưu trữ các mảng `squares` trước đó trong một mảng khác có tên `history`, mà bạn sẽ lưu trữ như một biến state mới. Mảng `history` đại diện cho tất cả các trạng thái bảng, từ nước đi đầu tiên đến nước đi cuối cùng, và có hình dạng như thế này:

```jsx
[
  // Before first move
  [null, null, null, null, null, null, null, null, null],
  // After first move
  [null, null, null, null, 'X', null, null, null, null],
  // After second move
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### Nâng state lên, một lần nữa {/*lifting-state-up-again*/}

Bây giờ bạn sẽ viết một component cấp cao mới có tên `Game` để hiển thị danh sách các nước đi trước đó. Đó là nơi bạn sẽ đặt state `history` chứa toàn bộ lịch sử trò chơi.

Đặt state `history` vào component `Game` sẽ cho phép bạn xóa state `squares` khỏi component con `Board` của nó. Giống như bạn đã "nâng state lên" từ component `Square` vào component `Board`, bây giờ bạn sẽ nâng nó lên từ `Board` vào component cấp cao `Game`. Điều này cho component `Game` toàn quyền kiểm soát dữ liệu của `Board` và cho phép nó hướng dẫn `Board` render các lượt trước đó từ `history`.

Đầu tiên, thêm một component `Game` với `export default`. Cho nó render component `Board` và một số markup:

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}
```

Lưu ý rằng bạn đang xóa các từ khóa `export default` trước khai báo `function Board() {` và thêm chúng trước khai báo `function Game() {`. Điều này cho file `index.js` của bạn biết sử dụng component `Game` như component cấp cao thay vì component `Board` của bạn. Các `div`s bổ sung được trả về bởi component `Game` đang tạo chỗ cho thông tin trò chơi mà bạn sẽ thêm vào bảng sau này.

Thêm một số state vào component `Game` để theo dõi người chơi nào đi tiếp theo và lịch sử các nước đi:

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

Chú ý cách `[Array(9).fill(null)]` là một mảng với một mục duy nhất, bản thân nó là một mảng gồm 9 `null`.

Để render các ô vuông cho nước đi hiện tại, bạn sẽ muốn đọc mảng squares cuối cùng từ `history`. Bạn không cần `useState` cho việc này--bạn đã có đủ thông tin để tính toán nó trong quá trình render:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

Tiếp theo, tạo một function `handlePlay` bên trong component `Game` sẽ được gọi bởi component `Board` để cập nhật trò chơi. Truyền `xIsNext`, `currentSquares` và `handlePlay` như props cho component `Board`:

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

Hãy làm cho component `Board` hoàn toàn được điều khiển bởi các props mà nó nhận được. Thay đổi component `Board` để nhận ba props: `xIsNext`, `squares`, và một function `onPlay` mới mà `Board` có thể gọi với mảng squares đã cập nhật khi người chơi thực hiện một nước đi. Tiếp theo, xóa hai dòng đầu tiên của function `Board` gọi `useState`:

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

Bây giờ thay thế các lời gọi `setSquares` và `setXIsNext` trong `handleClick` trong component `Board` bằng một lời gọi duy nhất đến function `onPlay` mới của bạn để component `Game` có thể cập nhật `Board` khi người dùng nhấp vào một ô vuông:

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```

Component `Board` hoàn toàn được điều khiển bởi các props được truyền cho nó bởi component `Game`. Bạn cần triển khai function `handlePlay` trong component `Game` để trò chơi hoạt động lại.

`handlePlay` nên làm gì khi được gọi? Hãy nhớ rằng Board trước đây gọi `setSquares` với một mảng đã cập nhật; bây giờ nó truyền mảng `squares` đã cập nhật cho `onPlay`.

Function `handlePlay` cần cập nhật state của `Game` để kích hoạt re-render, nhưng bạn không còn có function `setSquares` để gọi nữa--bây giờ bạn đang sử dụng biến state `history` để lưu trữ thông tin này. Bạn sẽ muốn cập nhật `history` bằng cách thêm mảng `squares` đã cập nhật như một mục lịch sử mới. Bạn cũng muốn đảo ngược `xIsNext`, giống như Board đã từng làm:

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

Ở đây, `[...history, nextSquares]` tạo một mảng mới chứa tất cả các mục trong `history`, theo sau bởi `nextSquares`. (Bạn có thể đọc `...history` [*spread syntax*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) như "liệt kê tất cả các mục trong `history`".)

Ví dụ, nếu `history` là `[[null,null,null], ["X",null,null]]` và `nextSquares` là `["X",null,"O"]`, thì mảng `[...history, nextSquares]` mới sẽ là `[[null,null,null], ["X",null,null], ["X",null,"O"]]`.

Ở thời điểm này, bạn đã di chuyển state để sống trong component `Game`, và UI sẽ hoạt động đầy đủ, giống như trước khi refactor. Đây là cách code của bạn nên trông như ở thời điểm này:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Hiển thị các nước đi trước đó {/*showing-the-past-moves*/}

Vì bạn đang ghi lại lịch sử trò chơi tic-tac-toe, bạn có thể hiển thị danh sách các nước đi trước đó cho người chơi.

Các phần tử React như `<button>` là các đối tượng JavaScript thông thường; bạn có thể truyền chúng xung quanh trong ứng dụng của mình. Để render nhiều mục trong React, bạn có thể sử dụng một mảng các phần tử React.

Bạn đã có một mảng các nước đi `history` trong state, vì vậy bây giờ bạn cần biến đổi nó thành một mảng các phần tử React. Trong JavaScript, để biến đổi một mảng thành mảng khác, bạn có thể sử dụng [phương thức `map` của mảng:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

Bạn sẽ sử dụng `map` để biến đổi `history` các nước đi của bạn thành các phần tử React đại diện cho các button trên màn hình, và hiển thị một danh sách các button để "nhảy" đến các nước đi trước đó. Hãy `map` qua `history` trong component Game:

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
```

Bạn có thể xem code của bạn nên trông như thế nào bên dưới. Lưu ý rằng bạn sẽ thấy một lỗi trong console của developer tools nói rằng:

<ConsoleBlock level="warning">
Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of &#96;Game&#96;.
</ConsoleBlock>
  
Bạn sẽ sửa lỗi này trong phần tiếp theo.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Khi bạn lặp qua mảng `history` bên trong function bạn đã truyền cho `map`, đối số `squares` đi qua từng phần tử của `history`, và đối số `move` đi qua từng chỉ số mảng: `0`, `1`, `2`, …. (Trong hầu hết các trường hợp, bạn sẽ cần các phần tử mảng thực tế, nhưng để render danh sách các nước đi, bạn sẽ chỉ cần các chỉ số.)

Đối với mỗi nước đi trong lịch sử trò chơi tic-tac-toe, bạn tạo một mục danh sách `<li>` chứa một button `<button>`. Button có một handler `onClick` gọi một function có tên `jumpTo` (mà bạn chưa triển khai).

Bây giờ, bạn sẽ thấy một danh sách các nước đi đã xảy ra trong trò chơi và một lỗi trong console của developer tools. Hãy thảo luận về ý nghĩa của lỗi "key".

### Chọn một key {/*picking-a-key*/}

Khi bạn render một danh sách, React lưu trữ một số thông tin về mỗi mục danh sách đã render. Khi bạn cập nhật một danh sách, React cần xác định những gì đã thay đổi. Bạn có thể đã thêm, xóa, sắp xếp lại, hoặc cập nhật các mục của danh sách.

Hãy tưởng tượng chuyển đổi từ

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

sang

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

Ngoài các số đếm đã cập nhật, một người đọc điều này có thể sẽ nói rằng bạn đã đổi thứ tự của Alexa và Ben và chèn Claudia vào giữa Alexa và Ben. Tuy nhiên, React là một chương trình máy tính và không biết bạn muốn làm gì, vì vậy bạn cần chỉ định một thuộc tính _key_ cho mỗi mục danh sách để phân biệt mỗi mục danh sách với các mục anh em của nó. Nếu dữ liệu của bạn đến từ cơ sở dữ liệu, các ID cơ sở dữ liệu của Alexa, Ben, và Claudia có thể được sử dụng làm keys.

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

Khi một danh sách được re-render, React lấy key của mỗi mục danh sách và tìm kiếm các mục của danh sách trước đó để tìm một key khớp. Nếu danh sách hiện tại có một key không tồn tại trước đó, React tạo một component. Nếu danh sách hiện tại thiếu một key đã tồn tại trong danh sách trước đó, React hủy component trước đó. Nếu hai keys khớp, component tương ứng được di chuyển.

Keys cho React biết về danh tính của mỗi component, điều này cho phép React duy trì state giữa các lần re-render. Nếu key của một component thay đổi, component sẽ bị hủy và được tạo lại với một state mới.

`key` là một thuộc tính đặc biệt và được bảo lưu trong React. Khi một phần tử được tạo, React trích xuất thuộc tính `key` và lưu key trực tiếp trên phần tử được trả về. Mặc dù `key` có thể trông như nó được truyền như props, React tự động sử dụng `key` để quyết định component nào cần cập nhật. Không có cách nào để một component hỏi `key` mà component cha của nó đã chỉ định.

**Được khuyến nghị mạnh mẽ rằng bạn gán keys phù hợp bất cứ khi nào bạn xây dựng danh sách động.** Nếu bạn không có một key phù hợp, bạn có thể muốn xem xét cấu trúc lại dữ liệu của mình để có.

Nếu không có key nào được chỉ định, React sẽ báo lỗi và sử dụng chỉ số mảng làm key theo mặc định. Sử dụng chỉ số mảng làm key có vấn đề khi cố gắng sắp xếp lại các mục của danh sách hoặc chèn/xóa các mục danh sách. Truyền rõ ràng `key={i}` làm im lặng lỗi nhưng có cùng vấn đề như chỉ số mảng và không được khuyến nghị trong hầu hết các trường hợp.

Keys không cần phải duy nhất toàn cục; chúng chỉ cần duy nhất giữa các component và các anh em của chúng.

### Triển khai tính năng du hành thời gian {/*implementing-time-travel*/}

Trong lịch sử trò chơi tic-tac-toe, mỗi nước đi trước đó có một ID duy nhất liên quan đến nó: đó là số thứ tự tuần tự của nước đi. Các nước đi sẽ không bao giờ được sắp xếp lại, xóa, hoặc chèn vào giữa, vì vậy an toàn khi sử dụng chỉ số nước đi làm key.

Trong function `Game`, bạn có thể thêm key như `<li key={move}>`, và nếu bạn tải lại trò chơi đã render, lỗi "key" của React sẽ biến mất:

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Trước khi bạn có thể triển khai `jumpTo`, bạn cần component `Game` theo dõi bước nào người dùng đang xem. Để làm điều này, định nghĩa một biến state mới có tên `currentMove`, mặc định là `0`:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

Tiếp theo, cập nhật function `jumpTo` bên trong `Game` để cập nhật `currentMove` đó. Bạn cũng sẽ đặt `xIsNext` thành `true` nếu số mà bạn đang thay đổi `currentMove` thành là số chẵn.

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

Bây giờ bạn sẽ thực hiện hai thay đổi cho function `handlePlay` của `Game` được gọi khi bạn nhấp vào một ô vuông.

- Nếu bạn "quay ngược thời gian" và sau đó thực hiện một nước đi mới từ điểm đó, bạn chỉ muốn giữ lại lịch sử đến điểm đó. Thay vì thêm `nextSquares` sau tất cả các mục (cú pháp `...` spread) trong `history`, bạn sẽ thêm nó sau tất cả các mục trong `history.slice(0, currentMove + 1)` để bạn chỉ giữ lại phần đó của lịch sử cũ.
- Mỗi khi một nước đi được thực hiện, bạn cần cập nhật `currentMove` để trỏ đến mục lịch sử mới nhất.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

Cuối cùng, bạn sẽ sửa đổi component `Game` để render nước đi hiện tại được chọn, thay vì luôn render nước đi cuối cùng:

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

Nếu bạn nhấp vào bất kỳ bước nào trong lịch sử trò chơi, bảng chơi tic-tac-toe sẽ ngay lập tức cập nhật để hiển thị bảng chơi trông như thế nào sau khi bước đó xảy ra.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Dọn dẹp cuối cùng {/*final-cleanup*/}

Nếu bạn nhìn code rất kỹ, bạn có thể nhận thấy rằng `xIsNext === true` khi `currentMove` là số chẵn và `xIsNext === false` khi `currentMove` là số lẻ. Nói cách khác, nếu bạn biết giá trị của `currentMove`, thì bạn luôn có thể tính ra `xIsNext` nên là gì.

Không có lý do gì để bạn lưu trữ cả hai trong state. Trên thực tế, luôn cố gắng tránh state dư thừa. Đơn giản hóa những gì bạn lưu trữ trong state giảm lỗi và làm cho code của bạn dễ hiểu hơn. Thay đổi `Game` để nó không lưu trữ `xIsNext` như một biến state riêng biệt và thay vào đó tính toán nó dựa trên `currentMove`:

```js {4,11,15}
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  // ...
}
```

Bạn không còn cần khai báo state `xIsNext` hoặc các lời gọi đến `setXIsNext`. Bây giờ, không có khả năng `xIsNext` bị mất đồng bộ với `currentMove`, ngay cả khi bạn mắc lỗi khi code các components.

### Tổng kết {/*wrapping-up*/}

Chúc mừng! Bạn đã tạo một trò chơi tic-tac-toe mà:

- Cho phép bạn chơi tic-tac-toe,
- Cho biết khi nào một người chơi đã thắng trò chơi,
- Lưu trữ lịch sử trò chơi khi trò chơi diễn ra,
- Cho phép người chơi xem lại lịch sử trò chơi và xem các phiên bản trước đó của bảng chơi.

Làm tốt lắm! Chúng tôi hy vọng bây giờ bạn cảm thấy như bạn đã nắm được cách React hoạt động.

Xem kết quả cuối cùng ở đây:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Nếu bạn có thời gian rảnh hoặc muốn luyện tập các kỹ năng React mới của mình, đây là một số ý tưởng cải tiến mà bạn có thể thực hiện cho trò chơi tic-tac-toe, được liệt kê theo thứ tự độ khó tăng dần:

1. Chỉ cho nước đi hiện tại, hiển thị "Bạn đang ở nước đi #..." thay vì một button.
1. Viết lại `Board` để sử dụng hai vòng lặp để tạo các ô vuông thay vì hardcode chúng.
1. Thêm một toggle button cho phép bạn sắp xếp các nước đi theo thứ tự tăng dần hoặc giảm dần.
1. Khi ai đó thắng, làm nổi bật ba ô vuông gây ra chiến thắng (và khi không ai thắng, hiển thị một thông báo về kết quả là hòa).
1. Hiển thị vị trí cho mỗi nước đi theo định dạng (row, col) trong danh sách lịch sử nước đi.

Trong suốt hướng dẫn này, bạn đã tiếp xúc với các khái niệm React bao gồm elements, components, props, và state. Bây giờ bạn đã thấy cách các khái niệm này hoạt động khi xây dựng một trò chơi, hãy xem [Tư duy trong React](/learn/thinking-in-react) để xem cách các khái niệm React tương tự hoạt động khi xây dựng UI của một ứng dụng.
