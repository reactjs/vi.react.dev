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
>>>>>>> 19aa5b4852c3905757edb16dd62f7e7506231210
  }
}

root.render(<HelloMessage name="Taylor" />);
