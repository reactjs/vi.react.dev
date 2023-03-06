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
>>>>>>> ba290ad4e432f47a2a2f88d067dacaaa161b5200
  }
}

root.render(<HelloMessage name="Taylor" />);
