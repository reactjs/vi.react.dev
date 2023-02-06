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
>>>>>>> d4e42ab21f0cc7d8b79d1a619654e27c79e10af6
  }
}

root.render(<HelloMessage name="Taylor" />);
