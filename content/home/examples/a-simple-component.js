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
>>>>>>> 47adefd30c46f486428d8231a68e639d62f02c9e
  }
}

root.render(<HelloMessage name="Taylor" />);
