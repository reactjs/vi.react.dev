class HelloMessage extends React.Component {
  render() {
    return <div>Xin chào {this.props.name}</div>;
  }
}

root.render(<HelloMessage name="Taylor" />);
