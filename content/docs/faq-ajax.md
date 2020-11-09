---
id: faq-ajax
title: AJAX và APIs
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### Làm như nào để gọi AJAX ? {#how-can-i-make-an-ajax-call}

Bạn có thể sử dụng bất kỳ thư viện AJAX nào bạn thích với React. Một số thư viện phổ biến như [Axios](https://github.com/axios/axios), [jQuery AJAX](https://api.jquery.com/jQuery.ajax/), và trình duyệt tích hợp sẵn [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

### Nên gọi AJAX ở đâu trong vòng đời component ? {#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

Bạn nên gọi AJAX ở componentDidMount của các phương thức vòng đời [`componentDidMount`](/docs/react-component.html#mounting). Điều này để bạn có thể sử dụng `setState` để cập nhật component khi có dữ liệu được lấy.
<!-- ### Ví dụ: Using AJAX results to set local state {#example-using-ajax-results-to-set-local-state} -->
### Ví dụ: Sử dụng dữ liệu của AJAX xét vào state   {#example-using-ajax-results-to-set-local-state}

Component dưới đây thể hiện cách thực hiện gọi AJAX trong `componentDidMount` để xét dữ liệu vào state. 

Ví dụ API trả về một object JSON như sau:

```
{
  "items": [
    { "id": 1, "name": "Apples",  "price": "$2" },
    { "id": 2, "name": "Peaches", "price": "$5" }
  ] 
}
```

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              {item.name} {item.price}
            </li>
          ))}
        </ul>
      );
    }
  }
}
```

Here is the equivalent with [Hooks](https://reactjs.org/docs/hooks-intro.html): 

```js
function MyComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} {item.price}
          </li>
        ))}
      </ul>
    );
  }
}
```
