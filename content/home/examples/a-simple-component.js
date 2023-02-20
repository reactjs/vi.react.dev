class HelloMessage extends React.Component {
  render() {
<<<<<<< HEAD
    return (
      <div>
        Xin chào {this.props.name}
      </div>
    );
=======
    return <div>Hello {this.props.name}</div>;
>>>>>>> 63c77695a95902595b6c2cc084a5c3650b15210a
  }
}

root.render(<HelloMessage name="Taylor" />);
