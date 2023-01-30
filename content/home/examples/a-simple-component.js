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
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b
  }
}

root.render(<HelloMessage name="Taylor" />);
