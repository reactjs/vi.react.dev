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
>>>>>>> 07dbd86ca421c262157af673a2584a40fd3b2450
  }
}

root.render(<HelloMessage name="Taylor" />);
