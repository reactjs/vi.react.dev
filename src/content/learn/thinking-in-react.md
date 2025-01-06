---
title: Tư Duy Trong React
---

<Intro>
 
React có thể thay đổi tư duy của bạn về cách thiết kế và xây dựng một ứng dụng. Khi bạn xây dựng giao diện người dùng với React, trước tiên bạn sẽ phân tách nó thành các phần gọi là *component*. Sau đó, bạn sẽ định nghĩa các trạng thái giao diện khác nhau cho mỗi thành phần của bạn. Cuối cùng, bạn sẽ kết nối các thành phần của mình với nhau để dữ liệu được truyền qua chúng. Qua hướng dẫn này, bạn sẽ được hướng dẫn để xây dựng một bảng dữ liệu sản phẩm cùng chức năng tìm kiếm bằng React.


</Intro>

## Bắt đầu với dữ liệu mẫu {/*start-with-the-mockup*/}

Tưỡng tượng bạn đã có sẵn một API dưới dạng JSON được chuẩn bị bỡi người thiết kế sản phẩm.

Dữ liệu từ API JSON có một số ví dụ sau:
```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
```

Bản thiết kế của sản phẩm như sau:

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

Để triển khai giao diện người dùng (UI) bằng React, thường bạn sẽ làm theo năm bước sau đây:

## Bước 1: Phân tách UI thành nhiều thành phần thứ cấp {/*step-1-break-the-ui-into-a-component-hierarchy*/}

Đầu tiên, hãy vẽ khung viền xung quanh mỗi thành phần chính và thành phần con trong bản phác thảo và đặt tên cho chúng. Nếu bạn làm việc với một nhà thiết kế, họ có thể đã đặt tên cho những thành phần này trong công cụ thiết kế của họ. Hãy hỏi họ!

Tùy thuộc vào nền tảng của bạn, bạn có thể nghĩ đến việc chia thiết kế thành các thành phần theo những cách khác nhau:

* **Programming**--sử dụng các kỹ thuật tương tự để quyết định liệu bạn có nên tạo một hàm hoặc đối tượng mới hay không. Một trong các kỹ thuật như vậy là [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle) (đơn nhiệm), có nghĩa là lý tưởng nhất mỗi thành phần nên chỉ đảm nhiệm một nhiệm vụ. Nếu nó ngày càng phát triển, nó nên được phân tách thành các thành phần con nhỏ hơn.

* **CSS**--xem xét bạn sẽ tạo các lựa chọn lớp cho điều gì. (Tuy nhiên, các thành phần ít chi tiết hơn một chút.)
* **Design**--xem xét cách bạn sẽ tổ chức các lớp thiết kế.

Nếu JSON của bạn có cấu trúc tốt, bạn sẽ thường thấy dữ liệu sẽ hòa hợp với cấu trúc thành phần giao diện người dùng của bạn. Điều đó bởi vì các mô hình UI và dữ liệu thường có cùng kiến ​​trúc thông tin - tức là cùng một hình dạng. Tách giao diện của bạn thành các thành phần, mà trong đó mỗi thành phần phù hợp với một phần của mô hình dữ liệu của bạn.


Trong ví dụ này thì màn hình được cấu thành từ 5 thành phần:

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable` (xám) chứa toàn bộ ứng dụng.
2. `SearchBar` (xanh biển) nhận dữ liệu từ người dùng.
3. `ProductTable` (tím) hiển thị và lọc danh sách sản phẩm theo đầu vào của người dùng.
4. `ProductCategoryRow` (xanh) hiển thị tiêu đề cho mỗi danh mục.
5. `ProductRow`	(vàng) hiển thị một hàng cho mỗi sản phẩm.

</CodeDiagram>

</FullWidth>

Nếu bạn nhìn vào `ProductTable` (màu oải hương), bạn sẽ thấy rằng phần tiêu đề (chứa nhãn "Name" và "Price") không phải là một thành phần riêng của nó. Điều này là vấn đề về sở thích, và bạn có thể chọn cách nào tùy ý. Đối với ví dụ này, nó là một phần của `ProductTable` vì nó xuất hiện bên trong danh sách của `ProductTable`. Tuy nhiên, nếu phần tiêu đề này trở nên phức tạp hơn (ví dụ: nếu bạn thêm chức năng sắp xếp), bạn có thể chuyển nó vào thành phần riêng của nó là `ProductTableHeader`.

Bây giờ bạn đã xác định các thành phần trong bản mô phỏng, hãy sắp xếp chúng thành một cấu trúc phân cấp. Các thành phần xuất hiện bên trong một thành phần khác trong bản mô phỏng nên xuất hiện dưới dạng một thành phần con trong cấu trúc phân cấp:

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## Bước 2: Xây dựng phiên bản tĩnh trong React {/*step-2-build-a-static-version-in-react*/}

Bây giờ bạn đã có cấu trúc phân cấp các thành phần của mình, đến lúc triển khai ứng dụng của bạn. Cách tiếp cận đơn giản nhất là xây dựng một phiên bản hiển thị giao diện người dùng từ mô hình dữ liệu của bạn mà không thêm bất kỳ tính tương tác nào... cho đến bây giờ! Thường thì việc xây dựng phiên bản tĩnh trước sẽ dễ dàng hơn và sau đó mới thêm sự tương tác. Xây dựng một phiên bản tĩnh đòi hỏi phải gõ rất nhiều và không cần suy nghĩ, nhưng thêm tính tương tác lại đòi hỏi phải suy nghĩ nhiều và không cần gõ.

Để xây dựng một phiên bản tĩnh của ứng dụng của bạn mà hiển thị dữ liệu của bạn, bạn sẽ cần xây dựng [các thành phần](/learn/your-first-component) mà sử dụng lại các thành phần khác và truyền dữ liệu bằng cách sử dụng [props.](/learn/passing-props-to-a-component) Props là một cách để truyền dữ liệu từ thành phần cha đến thành phần con. (Nếu bạn quen thuộc với khái niệm state, thì không sử dụng [state](/learn/state-a-components-memory) để xây dựng phiên bản tĩnh này. State chỉ được dành cho tính tương tác, tức là dữ liệu thay đổi theo thời gian. Vì đây là một phiên bản tĩnh của ứng dụng, bạn không cần nó.)


Bạn có thể xây dựng theo cách "từ trên xuống" bằng cách bắt đầu xây dựng các thành phần ở cấp cao hơn trong thứ tự ưu tiên (như `FilterableProductTable`) hoặc "từ dưới lên" bằng cách làm việc từ các thành phần ở cấp thấp hơn (như ProductRow). Trong các ví dụ đơn giản, thì việc theo hướng từ trên xuống thường dễ hơn, và trong các dự án lớn, việc theo hướng từ dưới lên sẽ dễ hơn.

<Sandpack>

```jsx src/App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

(Nếu bạn không quen với đoạn code trên, đi tới [Quick Start](/learn/) trước tiên)

Sau khi xây dựng các thành phần, bạn sẽ có một thư viện các thành phần có thể tái sử dụng để hiển thị mô hình dữ liệu. Bởi vì đây là một ứng dụng tĩnh, các thành phần sẽ chỉ trả về JSX. Thành phần ở đầu của thứ tự thành phần (`FilterableProductTable`) sẽ lấy mô hình dữ liệu của bạn như là một prop. Điều này được gọi là dòng dữ liệu một chiều vì dữ liệu chảy từ thành phần cấp cao nhất xuống các thành phần ở cuối của cây.

<Pitfall>

Ở bước này, bạn không nên sử dụng bất kỳ state nào. Điều đó để cho bước tiếp theo!

</Pitfall>

## Step 3: Tìm những state đại diện chính trong UI  {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

Để làm cho giao diện người dùng trở nên tương tác, bạn cần cho phép người dùng thay đổi mô hình dữ liệu cơ bản của bạn. Bạn sẽ sử dụng *state* cho việc này.

Hãy tưởng tượng state là tập hợp tối thiểu các dữ liệu thay đổi mà ứng dụng của bạn cần phải ghi nhớ. Nguyên tắc quan trọng nhất để cấu trúc state là giữ cho nó [DRY (Don't Repeat Yourself)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Hãy tìm ra đại diện tối thiểu hoàn chỉnh của trạng thái mà ứng dụng của bạn cần và tính toán tất cả các thứ khác khi có yêu cầu. Ví dụ, nếu bạn đang xây dựng một danh sách mua sắm, bạn có thể lưu trữ các mặt hàng dưới dạng một mảng trong state. Nếu bạn muốn hiển thị số lượng các mặt hàng trong danh sách, đừng lưu trữ số lượng mặt hàng như một giá trị state khác - thay vào đó, đọc độ dài của mảng của bạn.

Bây giờ hãy nghĩ về tất cả các phần dữ liệu trong ứng dụng ví dụ này:

1. Danh sách sản phẩm ban đầu
2. Văn bản tìm kiếm mà người dùng đã nhập
3. Giá trị của hộp kiểm
4. Danh sách sản phẩm đã lọc

Những phần sau đây là state? Hãy xác định những phần không phải state:

* **Có giữ nguyên không đổi** qua thời gian? Nếu vậy, thì đó không phải là state.
* **Được truyền từ cha** thông qua props? Nếu vậy, thì đó không phải là state.
* **Có thể tính toán được** dựa trên state hoặc props hiện tại trong component của bạn? Nếu vậy, thì nó *nhất định không phải* là state!

Những gì còn lại có thể là state.

Hãy đi qua từng phần một lần nữa:

1. Danh sách sản phẩm ban đầu được **truyền vào như là props, vì vậy nó không phải là state**.
2. Văn bản tìm kiếm dường như là state vì nó thay đổi theo thời gian và không thể tính toán từ bất cứ thứ gì.
3. Giá trị của hộp tìm kiếm dường như là state vì nó thay đổi theo thời gian và không thể tính toán từ bất cứ thứ gì.
4. Danh sách sản phẩm đã lọc **không phải là state vì nó có thể được tính toán** bằng cách lấy danh sách sản phẩm ban đầu và lọc nó theo văn bản tìm kiếm và giá trị của hộp tìm kiếm.

Điều này có nghĩa là chỉ có văn bản tìm kiếm và giá trị của hộp tìm kiếm là state! Làm rất tốt!



<DeepDive>

#### Props vs State {/*props-vs-state*/}


Trong React có hai loại dữ liệu "mô hình": props và state. Hai loại này rất khác nhau:

* [**Props** giống như các tham số bạn truyền](/learn/passing-props-to-a-component) cho một hàm. Chúng cho phép một thành phần cha chuyển dữ liệu cho một thành phần con và tùy chỉnh giao diện của nó. Ví dụ, một `Form` có thể truyền một prop `color` cho một `Button`.
* [**State** giống như bộ nhớ của một thành phần.](/learn/state-a-components-memory) Nó cho phép một thành phần theo dõi một số thông tin và thay đổi nó khi có tương tác. Ví dụ, một `Button` có thể theo dõi trạng thái `isHovered`.

Props và state khác nhau, nhưng chúng làm việc cùng nhau. Một thành phần cha thường sẽ giữ một số thông tin trong state (để có thể thay đổi nó), và *truyền nó xuống* cho các thành phần con dưới dạng props của chúng. Nếu trong lần đọc đầu tiên vẫn còn cảm thấy mơ hồ, không sao cả. Cần một chút thực hành để hiểu rõ hơn!


</DeepDive>

## Step 4: Xác định nơi lưu trữ state {/*step-4-identify-where-your-state-should-live*/}

Sau khi xác định được dữ liệu state cần thiết cho ứng dụng của bạn, bạn cần xác định thành phần nào sẽ chịu trách nhiệm thay đổi trạng thái này, hoặc *sở hữu* state. Hãy nhớ: React sử dụng luồng dữ liệu một chiều, truyền dữ liệu từ thành phần cha xuống thành phần con. Có thể không rõ ngay thành phần nào sẽ sở hữu trạng thái nào. Điều này có thể thách thức nếu bạn mới bắt đầu với khái niệm này, nhưng bạn có thể tìm hiểu bằng cách làm theo các bước sau!

Đối với mỗi phần state trong ứng dụng của bạn:

1. Xác định *mọi* thành phần hiển thị gì đó dựa trên trạng thái đó.
2. Tìm thành phần cha chung gần nhất của chúng - một thành phần ở trên tất cả trong thứ bậc thành phần.
3. Quyết định nơi lưu trữ state:
    1. Thường thì, bạn có thể đặt state trực tiếp vào thành phần cha chung của chúng.
    2. Bạn cũng có thể đặt state vào một thành phần nằm trên thành phần cha chung của chúng.
    3. Nếu bạn không thể tìm thấy thành phần nào phù hợp để sở hữu trạng thái, hãy tạo một thành phần mới chỉ để giữ trạng thái và thêm nó vào đâu đó trong thứ bậc trên thành phần cha chung.

Ở bước trước, bạn đã tìm thấy hai phần state trong ứng dụng này: văn bản đầu vào tìm kiếm và giá trị của hộp kiểm. Trong ví dụ này, chúng luôn xuất hiện cùng nhau, vì vậy hợp lý để đặt chúng vào cùng một nơi.


<<<<<<< HEAD
Bây giờ chúng ta hãy xem lại chiến lược của chúng ta cho state:
=======
1. **Identify components that use state:**
    * `ProductTable` needs to filter the product list based on that state (search text and checkbox value). 
    * `SearchBar` needs to display that state (search text and checkbox value).
2. **Find their common parent:** The first parent component both components share is `FilterableProductTable`.
3. **Decide where the state lives**: We'll keep the filter text and checked state values in `FilterableProductTable`.
>>>>>>> b1a249d597016c6584e4c186daa28b180cc9aafc

1. **Xác định các thành phần sử dụng trạng thái (state):**
    * `ProductTable` cần lọc danh sách sản phẩm dựa trên trạng thái đó (văn bản tìm kiếm và giá trị hộp kiểm).
    * `SearchBar` cần hiển thị trạng thái đó (văn bản tìm kiếm và giá trị hộp kiểm).
2. **Tìm kiếm cha chung của chúng:** Các thành phần cha đầu tiên mà cả hai thành phần đều chia sẻ là `FilterableProductTable`.
3. **Quyết định vị trí trạng thái:** Chúng tôi sẽ giữ các giá trị văn bản tìm kiếm và trạng thái kiểm tra trong `FilterableProductTable`.

Vì vậy, các giá trị trạng thái sẽ được lưu trong `FilterableProductTable`. 

Thêm trạng thái vào thành phần với [`useState()` Hook.](/reference/react/useState) Hooks là các hàm đặc biệt cho phép bạn "kết nối vào" React. Thêm hai biến trạng thái ở đầu `FilterableProductTable` và chỉ định trạng thái ban đầu của chúng:


```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);  
```

Sau đó, truyền `filterText` và `inStockOnly` tới `ProductTable` và `SearchBar` như là props:

```js
<div>
  <SearchBar 
    filterText={filterText} 
    inStockOnly={inStockOnly} />
  <ProductTable 
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

Bạn có thể bắt đầu xem cách ứng dụng của bạn sẽ hoạt động. Chỉnh sửa giá trị ban đầu của `filterText` từ `useState('')` thành `useState('fruit')` trong đoạn code sandbox dưới đây. Bạn sẽ thấy cả ô văn bản tìm kiếm và bảng được cập nhật:


<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} />
      <ProductTable 
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Lưu ý rằng chỉnh sửa biểu mẫu vẫn chưa hoạt động. Có một lỗi console trong sandbox ở trên để giải thích tại sao:


<ConsoleBlock level="error">

You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field.

</ConsoleBlock>


Trong môi trường sandbox phía trên, `ProductTable` và `SearchBar` đọc các thuộc tính `filterText` và `inStockOnly` để hiển thị bảng, input, và checkbox. Ví dụ, đây là cách `SearchBar` điền giá trị vào input:


```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
```

Tuy nhiên, bạn vẫn chưa thêm bất kì dòng code nào tương tác được với hành động như gõ phím. Đây sẽ bước cuối cùng của bạn.


## Step 5: Thêm dữ liệu nghịch đảo  {/*step-5-add-inverse-data-flow*/}

Hiện tại ứng dụng của bạn hiển thị đúng với dữ liệu props và state được truyền xuống theo thứ tự hướng xuống. Nhưng để thay đổi trạng thái theo đầu vào của người dùng, bạn cần hỗ trợ dữ liệu truyền ngược lại: các thành phần biểu mẫu sâu trong cấu trúc cần cập nhật trạng thái trong `FilterableProductTable`.

React làm cho luồng dữ liệu này rõ ràng, nhưng nó yêu cầu một chút việc gõ phím hơn so với ràng buộc dữ liệu hai chiều. Nếu bạn thử gõ hoặc chọn hộp kiểm trong ví dụ ở trên, bạn sẽ thấy rằng React bỏ qua đầu vào của bạn. Điều này là có chủ ý. Bằng cách viết `<input value={filterText} />`, bạn đã đặt thuộc tính `value` của `input` luôn bằng với `filterText` state được truyền vào từ `FilterableProductTable`. Vì `filterText` state không bao giờ được thiết lập, nên đầu vào không bao giờ thay đổi.

Bạn muốn làm cho trạng thái được cập nhật mỗi khi người dùng thay đổi đầu vào của biểu mẫu. Trạng thái được quản lý bởi `FilterableProductTable`, nên chỉ nó mới có thể gọi `setFilterText` và `setInStockOnly`. Để cho phép `SearchBar` cập nhật trạng thái của `FilterableProductTable`, bạn cần truyền các hàm này xuống `SearchBar`:

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

Bên trong `SearchBar`, bạn sẽ thêm quản lý sự kiện `onChange` và thiết lập trạng thái cha từ chúng:

```js {4,5,13,19}
function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
```

Giờ thì ứng dụng của bạn đã hoạt động!

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText} 
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} placeholder="Search..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>
Bạn có thể tìm hiểu về cách xử lý sự kiện và cập nhật trạng thái trong phần [Thêm tính tương tác](/learn/adding-interactivity).

## Tìm hiểu thêm {/*where-to-go-from-here*/}

Đây chỉ là một sự giới thiệu rất ngắn gọn về cách tư duy khi xây dựng các thành phần và ứng dụng với React. Bạn có thể [bắt đầu một dự án React](/learn/installation) ngay bây giờ hoặc [đào sâu hơn vào UI](/learn/describing-the-ui) được sử dụng trong hướng dẫn này.
