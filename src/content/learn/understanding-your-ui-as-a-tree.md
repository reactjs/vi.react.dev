---
title: Hiểu giao diện người dùng theo cấu trúc cây
---

<Intro>

Ứng dụng React của bạn đang thành hình với nhiều component được lồng trong nhau. React theo dõi cấu trúc component của ứng dụng như thế nào?

React, và nhiều thư viện UI khác, mô hình hóa UI theo cấu trúc cây. Nghĩ về ứng dụng của bạn theo cấu trúc cây rất hữu ích để hiểu mối quan hệ giữa các component. Sự hiểu biết này sẽ giúp bạn debug các khái niệm trong tương lai như hiệu năng và quản lý state.

</Intro>

<YouWillLearn>

* React "nhìn" cấu trúc component như thế nào
* Render tree là gì và nó hữu ích cho việc gì
* Module dependency (phụ thuộc vào module) tree là gì và nó hữu ích cho việc gì

</YouWillLearn>

## Giao diện người dùng theo cấu trúc cây {/*your-ui-as-a-tree*/}

<<<<<<< HEAD
Cây là mô hình quan hệ giữa các mục và UI thường được biểu diễn bằng cấu trúc cây. Ví dụ, trình duyệt sử dụng cấu trúc cây để mô hình hóa HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) và CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). Các nền tảng di động cũng sử dụng cây để biểu diễn hệ thống phân cấp view của chúng.
=======
Trees are a relationship model between items. The UI is often represented using tree structures. For example, browsers use tree structures to model HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) and CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). Mobile platforms also use trees to represent their view hierarchy.
>>>>>>> e22544e68d6fffda33332771efe27034739f35a4

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Diagram with three sections arranged horizontally. In the first section, there are three rectangles stacked vertically, with labels 'Component A', 'Component B', and 'Component C'. Transitioning to the next pane is an arrow with the React logo on top labeled 'React'. The middle section contains a tree of components, with the root labeled 'A' and two children labeled 'B' and 'C'. The next section is again transitioned using an arrow with the React logo on top labeled 'React DOM'. The third and final section is a wireframe of a browser, containing a tree of 8 nodes, which has only a subset highlighted (indicating the subtree from the middle section).">

React tạo ra một cây UI từ các component của bạn. Trong ví dụ này, cây UI sau đó được sử dụng để render ra DOM.
</Diagram>

Giống như trình duyệt và nền tảng di động, React cũng sử dụng cấu trúc cây để quản lý và mô hình hóa mối quan hệ giữa các component trong ứng dụng React. Những cây này là công cụ hữu ích để hiểu cách dữ liệu chảy qua ứng dụng React và cách tối ưu hóa việc render và kích thước ứng dụng.

## Render Tree {/*the-render-tree*/}

Một tính năng chính của component là khả năng kết hợp component từ các component khác. Khi chúng ta [lồng component](/learn/your-first-component#nesting-and-organizing-components), chúng ta có khái niệm về component cha và component con, trong đó mỗi component cha có thể là con của component khác.

Khi chúng ta render một ứng dụng React, chúng ta có thể mô hình hóa mối quan hệ này trong một cây, được gọi là render tree.

Đây là một ứng dụng React render những câu trích dẫn truyền cảm hứng.

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

React tạo ra một *render tree*, một cây UI, được tạo thành từ các component đã render.

</Diagram>

Từ ứng dụng ví dụ, chúng ta có thể xây dựng render tree ở trên.

Cây được tạo thành từ các nút, mỗi nút đại diện cho một component. `App`, `FancyText`, `Copyright`, để kể tên một vài, tất cả đều là các nút trong cây của chúng ta.

Nút gốc trong render tree của React là [component gốc](/learn/importing-and-exporting-components#the-root-component-file) của ứng dụng. Trong trường hợp này, component gốc là `App` và nó là component đầu tiên mà React render. Mỗi mũi tên trong cây chỉ từ component cha đến component con.

<DeepDive>

#### Các thẻ HTML ở đâu trong render tree? {/*where-are-the-html-elements-in-the-render-tree*/}

Bạn sẽ nhận thấy trong render tree ở trên, không có đề cập đến các thẻ HTML mà mỗi component render. Điều này là do render tree chỉ được tạo thành từ các React [component](learn/your-first-component#components-ui-building-blocks).

React, với tư cách là một framework UI, là platform agnostic (không phụ thuộc vào nền tảng). Trên react.dev, chúng tôi trình bày các ví dụ render cho web, sử dụng HTML markup làm UI primitives. Nhưng một ứng dụng React cũng có thể render cho nền tảng di động hoặc desktop, có thể sử dụng các UI primitives khác như [UIView](https://developer.apple.com/documentation/uikit/uiview) hoặc [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0).

Các platform UI primitives này không phải là một phần của React. React render trees có thể cung cấp thông tin chi tiết cho ứng dụng React của chúng ta bất kể ứng dụng của bạn render cho nền tảng nào.

</DeepDive>

Một render tree đại diện cho một lần render duy nhất của ứng dụng React. Với [conditional rendering (render theo điều kiện)](/learn/conditional-rendering), một component cha có thể render các con khác nhau tùy thuộc vào dữ liệu được truyền.

Chúng ta có thể cập nhật ứng dụng để render có điều kiện hoặc một câu trích dẫn truyền cảm hứng hoặc màu sắc.

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

Với conditional rendering, qua các lần render khác nhau, render tree có thể render các component khác nhau.

</Diagram>

Trong ví dụ này, tùy thuộc vào `inspiration.type` là gì, chúng ta có thể render `<FancyText>` hoặc `<Color>`. Render tree có thể khác nhau cho mỗi lần render.

Mặc dù render trees có thể khác nhau qua các lần render, những cây này thường hữu ích để xác định các *component cấp cao* và *leaf component* trong ứng dụng React. Các component cấp cao là những component gần nhất với component gốc và ảnh hưởng đến hiệu suất render của tất cả các component bên dưới chúng và thường chứa độ phức tạp nhất. Các leaf component ở gần đáy của cây và không có component con và thường được re-render thường xuyên.

Xác định các loại component này rất hữu ích để hiểu data flow và hiệu suất của ứng dụng của bạn.

## Module Dependency Tree {/*the-module-dependency-tree*/}

Một mối quan hệ khác trong ứng dụng React có thể được mô hình hóa bằng cây là các module dependencies của ứng dụng. Khi chúng ta [chia nhỏ các component](/learn/importing-and-exporting-components#exporting-and-importing-a-component) và logic vào các file riêng biệt, chúng ta tạo ra các [JS modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) nơi chúng ta có thể export component, function, hoặc hằng số.

Mỗi nút trong module dependency tree là một module và mỗi nhánh đại diện cho một câu lệnh `import` trong module đó.

Nếu chúng ta lấy ứng dụng Inspirations trước đó, chúng ta có thể xây dựng một module dependency tree, hoặc dependency tree cho ngắn gọn.

<Diagram name="module_dependency_tree" height={250} width={658} alt="A tree graph with seven nodes. Each node is labelled with a module name. The top level node of the tree is labelled 'App.js'. There are three arrows pointing to the modules 'InspirationGenerator.js', 'FancyText.js' and 'Copyright.js' and the arrows are labelled with 'imports'. From the 'InspirationGenerator.js' node, there are three arrows that extend to three modules: 'FancyText.js', 'Color.js', and 'inspirations.js'. The arrows are labelled with 'imports'.">

Module dependency tree cho ứng dụng Inspirations.

</Diagram>

Nút gốc của cây là root module, còn được gọi là file mở đầu. Nó thường là module chứa component gốc.

So sánh với render tree của cùng ứng dụng, có những cấu trúc tương tự nhưng một số khác biệt đáng chú ý:

* Các nút tạo nên cây đại diện cho các module, không phải component.
* Các module không phải component, như `inspirations.js`, cũng được đại diện trong cây này. Render tree chỉ bao gồm các component.
* `Copyright.js` xuất hiện dưới `App.js` nhưng trong render tree, `Copyright`, component, xuất hiện như một con của `InspirationGenerator`. Điều này là do `InspirationGenerator` chấp nhận JSX như [children props](/learn/passing-props-to-a-component#passing-jsx-as-children), vì vậy nó render `Copyright` như một component con nhưng không import module.

Dependency trees rất hữu ích để xác định những module nào cần thiết để chạy ứng dụng React của bạn. Khi xây dựng ứng dụng React cho production, thường có một bước build sẽ bundle tất cả JavaScript cần thiết để gửi đến client. Công cụ chịu trách nhiệm cho việc này được gọi là [bundler](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem), và các bundler sẽ sử dụng dependency tree để xác định những module nào nên được bao gồm.

Khi ứng dụng của bạn phát triển, thường kích thước bundle cũng tăng theo. Kích thước bundle lớn rất tốn kém cho client để tải xuống và chạy. Kích thước bundle lớn có thể làm chậm thời gian để UI của bạn được vẽ. Hiểu được dependency tree của ứng dụng có thể giúp debug những vấn đề này.

[comment]: <> (perhaps we should also deep dive on conditional imports)

<Recap>

* Cây là cách phổ biến để biểu diễn mối quan hệ giữa các thực thể. Chúng thường được sử dụng để mô hình hóa UI.
* Render trees đại diện cho mối quan hệ lồng nhau giữa các React component qua một lần render duy nhất.
* Với conditional rendering, render tree có thể thay đổi qua các lần render khác nhau. Với các giá trị props khác nhau, component có thể render các component con khác nhau.
* Render trees giúp xác định những component cấp cao và leaf component. Các component cấp cao ảnh hưởng đến hiệu suất render của tất cả component bên dưới chúng và các leaf component thường được re-render thường xuyên. Xác định chúng rất hữu ích để hiểu và debug hiệu suất render.
* Dependency trees đại diện cho các module dependencies trong ứng dụng React.
* Dependency trees được sử dụng bởi các build tools để bundle mã cần thiết để ship ứng dụng.
* Dependency trees hữu ích để debug các bundle có kích thước lớn làm chậm thời gian hiện thị và giúp phát hiện cơ hội để tối ưu hóa mã code được bundle.

</Recap>

[TODO]: <> (Add challenges)
