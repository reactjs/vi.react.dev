---
title: Hiểu Giao Diện Người Dùng của Bạn như một Cây
---

<Intro>

Ứng dụng React của bạn đang hình thành với nhiều component được lồng vào nhau. Làm thế nào React theo dõi cấu trúc component của ứng dụng của bạn?

React, và nhiều thư viện UI khác, mô hình hóa UI như một cây. Suy nghĩ về ứng dụng của bạn như một cây rất hữu ích để hiểu mối quan hệ giữa các component. Sự hiểu biết này sẽ giúp bạn gỡ lỗi các khái niệm trong tương lai như hiệu suất và quản lý trạng thái.

</Intro>

<YouWillLearn>

* Cách React "nhìn thấy" cấu trúc component
* Cây render là gì và nó hữu ích cho việc gì
* Cây phụ thuộc module là gì và nó hữu ích cho việc gì

</YouWillLearn>

## Giao Diện Người Dùng của Bạn như một Cây {/*your-ui-as-a-tree*/}

Cây là một mô hình quan hệ giữa các mục và UI thường được biểu diễn bằng cấu trúc cây. Ví dụ: trình duyệt sử dụng cấu trúc cây để mô hình hóa HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) và CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). Các nền tảng di động cũng sử dụng cây để biểu diễn hệ thống phân cấp chế độ xem của chúng.

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Diagram with three sections arranged horizontally. In the first section, there are three rectangles stacked vertically, with labels 'Component A', 'Component B', and 'Component C'. Transitioning to the next pane is an arrow with the React logo on top labeled 'React'. The middle section contains a tree of components, with the root labeled 'A' and two children labeled 'B' and 'C'. The next section is again transitioned using an arrow with the React logo on top labeled 'React DOM'. The third and final section is a wireframe of a browser, containing a tree of 8 nodes, which has only a subset highlighted (indicating the subtree from the middle section).">

React tạo một cây UI từ các component của bạn. Trong ví dụ này, cây UI sau đó được sử dụng để render ra DOM.
</Diagram>

Giống như trình duyệt và nền tảng di động, React cũng sử dụng cấu trúc cây để quản lý và mô hình hóa mối quan hệ giữa các component trong một ứng dụng React. Những cây này là công cụ hữu ích để hiểu cách dữ liệu chảy qua một ứng dụng React và cách tối ưu hóa việc render và kích thước ứng dụng.

## Cây Render {/*the-render-tree*/}

Một tính năng chính của component là khả năng kết hợp các component của các component khác. Khi chúng ta [lồng các component](/learn/your-first-component#nesting-and-organizing-components), chúng ta có khái niệm về component cha và component con, trong đó mỗi component cha có thể là một component con của một component khác.

Khi chúng ta render một ứng dụng React, chúng ta có thể mô hình hóa mối quan hệ này trong một cây, được gọi là cây render.

Đây là một ứng dụng React render các câu trích dẫn truyền cảm hứng.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/quotes.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
  ];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

<Diagram name="render_tree" height={250} width={500} alt="Tree graph with five nodes. Each node represents a component. The root of the tree is App, with two arrows extending from it to 'InspirationGenerator' and 'FancyText'. The arrows are labelled with the word 'renders'. 'InspirationGenerator' node also has two arrows pointing to nodes 'FancyText' and 'Copyright'.">

React tạo ra một *cây render*, một cây UI, bao gồm các component được render.

</Diagram>

Từ ứng dụng ví dụ, chúng ta có thể xây dựng cây render ở trên.

Cây bao gồm các node, mỗi node đại diện cho một component. `App`, `FancyText`, `Copyright`, là một vài node trong cây của chúng ta.

Node gốc trong một cây render React là [component gốc](/learn/importing-and-exporting-components#the-root-component-file) của ứng dụng. Trong trường hợp này, component gốc là `App` và nó là component đầu tiên React render. Mỗi mũi tên trong cây trỏ từ một component cha đến một component con.

<DeepDive>

#### Các thẻ HTML ở đâu trong cây render? {/*where-are-the-html-elements-in-the-render-tree*/}

Bạn sẽ nhận thấy trong cây render ở trên, không có đề cập đến các thẻ HTML mà mỗi component render. Điều này là do cây render chỉ bao gồm các [component](learn/your-first-component#components-ui-building-blocks) React.

React, với tư cách là một framework UI, không phụ thuộc vào nền tảng. Trên react.dev, chúng tôi giới thiệu các ví dụ render lên web, sử dụng đánh dấu HTML làm các primitive UI của nó. Nhưng một ứng dụng React cũng có thể render lên một nền tảng di động hoặc máy tính để bàn, có thể sử dụng các primitive UI khác nhau như [UIView](https://developer.apple.com/documentation/uikit/uiview) hoặc [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0).

Các primitive UI nền tảng này không phải là một phần của React. Cây render React có thể cung cấp cái nhìn sâu sắc về ứng dụng React của chúng ta bất kể ứng dụng của bạn render lên nền tảng nào.

</DeepDive>

Một cây render đại diện cho một lần render duy nhất của một ứng dụng React. Với [render có điều kiện](/learn/conditional-rendering), một component cha có thể render các component con khác nhau tùy thuộc vào dữ liệu được truyền vào.

Chúng ta có thể cập nhật ứng dụng để render có điều kiện một câu trích dẫn truyền cảm hứng hoặc màu sắc.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational {inspiration.type} is:</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  {type: 'quote', value: "Don’t let yesterday take up too much of today.” — Will Rogers"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "Ambition is putting a ladder against the sky."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "A joy that's shared is a joy made double."},
  {type: 'color', value: "#F9F2B4"},
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```
</Sandpack>

<Diagram name="conditional_render_tree" height={250} width={561} alt="Tree graph with six nodes. The top node of the tree is labelled 'App' with two arrows extending to nodes labelled 'InspirationGenerator' and 'FancyText'. The arrows are solid lines and are labelled with the word 'renders'. 'InspirationGenerator' node also has three arrows. The arrows to nodes 'FancyText' and 'Color' are dashed and labelled with 'renders?'. The last arrow points to the node labelled 'Copyright' and is solid and labelled with 'renders'.">

Với render có điều kiện, trên các lần render khác nhau, cây render có thể render các component khác nhau.

</Diagram>

Trong ví dụ này, tùy thuộc vào `inspiration.type` là gì, chúng ta có thể render `<FancyText>` hoặc `<Color>`. Cây render có thể khác nhau cho mỗi lần render.

Mặc dù cây render có thể khác nhau giữa các lần render, nhưng những cây này thường hữu ích để xác định *component cấp cao nhất* và *component lá* trong một ứng dụng React. Các component cấp cao nhất là các component gần component gốc nhất và ảnh hưởng đến hiệu suất render của tất cả các component bên dưới chúng và thường chứa độ phức tạp cao nhất. Các component lá nằm gần cuối cây và không có component con và thường được render lại thường xuyên.

Xác định các loại component này rất hữu ích để hiểu luồng dữ liệu và hiệu suất của ứng dụng của bạn.

## Cây Phụ Thuộc Module {/*the-module-dependency-tree*/}

Một mối quan hệ khác trong một ứng dụng React có thể được mô hình hóa bằng một cây là các phụ thuộc module của ứng dụng. Khi chúng ta [chia nhỏ các component](/learn/importing-and-exporting-components#exporting-and-importing-a-component) và logic của chúng ta thành các tệp riêng biệt, chúng ta tạo ra [module JS](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) nơi chúng ta có thể xuất các component, hàm hoặc hằng số.

Mỗi node trong một cây phụ thuộc module là một module và mỗi nhánh đại diện cho một câu lệnh `import` trong module đó.

Nếu chúng ta lấy ứng dụng Inspirations trước đó, chúng ta có thể xây dựng một cây phụ thuộc module, hoặc cây phụ thuộc cho ngắn gọn.

<Diagram name="module_dependency_tree" height={250} width={658} alt="A tree graph with seven nodes. Each node is labelled with a module name. The top level node of the tree is labelled 'App.js'. There are three arrows pointing to the modules 'InspirationGenerator.js', 'FancyText.js' and 'Copyright.js' and the arrows are labelled with 'imports'. From the 'InspirationGenerator.js' node, there are three arrows that extend to three modules: 'FancyText.js', 'Color.js', and 'inspirations.js'. The arrows are labelled with 'imports'.">

Cây phụ thuộc module cho ứng dụng Inspirations.

</Diagram>

Node gốc của cây là module gốc, còn được gọi là tệp điểm vào. Nó thường là module chứa component gốc.

So sánh với cây render của cùng một ứng dụng, có các cấu trúc tương tự nhưng một số khác biệt đáng chú ý:

* Các node tạo nên cây đại diện cho các module, không phải component.
* Các module không phải component, như `inspirations.js`, cũng được biểu diễn trong cây này. Cây render chỉ bao gồm các component.
* `Copyright.js` xuất hiện bên dưới `App.js` nhưng trong cây render, `Copyright`, component, xuất hiện như một component con của `InspirationGenerator`. Điều này là do `InspirationGenerator` chấp nhận JSX làm [children props](/learn/passing-props-to-a-component#passing-jsx-as-children), vì vậy nó render `Copyright` như một component con nhưng không import module.

Cây phụ thuộc rất hữu ích để xác định những module nào là cần thiết để chạy ứng dụng React của bạn. Khi xây dựng một ứng dụng React cho production, thường có một bước build sẽ gói tất cả JavaScript cần thiết để gửi đến client. Công cụ chịu trách nhiệm cho việc này được gọi là [bundler](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem), và bundler sẽ sử dụng cây phụ thuộc để xác định những module nào nên được bao gồm.

Khi ứng dụng của bạn phát triển, kích thước bundle thường cũng tăng lên. Kích thước bundle lớn tốn kém cho client để tải xuống và chạy. Kích thước bundle lớn có thể trì hoãn thời gian để UI của bạn được vẽ. Nhận biết về cây phụ thuộc của ứng dụng của bạn có thể giúp gỡ lỗi các vấn đề này.

[comment]: <> (perhaps we should also deep dive on conditional imports)

<Recap>

* Cây là một cách phổ biến để biểu diễn mối quan hệ giữa các thực thể. Chúng thường được sử dụng để mô hình hóa UI.
* Cây render biểu diễn mối quan hệ lồng nhau giữa các component React trên một lần render duy nhất.
* Với render có điều kiện, cây render có thể thay đổi trên các lần render khác nhau. Với các giá trị prop khác nhau, các component có thể render các component con khác nhau.
* Cây render giúp xác định component cấp cao nhất và component lá là gì. Các component cấp cao nhất ảnh hưởng đến hiệu suất render của tất cả các component bên dưới chúng và các component lá thường được render lại thường xuyên. Xác định chúng rất hữu ích để hiểu và gỡ lỗi hiệu suất render.
* Cây phụ thuộc biểu diễn các phụ thuộc module trong một ứng dụng React.
* Cây phụ thuộc được sử dụng bởi các công cụ build để gói mã cần thiết để gửi một ứng dụng.
* Cây phụ thuộc rất hữu ích để gỡ lỗi kích thước bundle lớn làm chậm thời gian vẽ và phơi bày các cơ hội để tối ưu hóa những gì mã được gói.

</Recap>

[TODO]: <> (Add challenges)
