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
>>>>>>> b0ccb47f33e52315b0ec65edb9a49dc4910dd99c
  }
}

root.render(<HelloMessage name="Taylor" />);
