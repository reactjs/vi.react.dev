class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }

  tick() {
    this.setState(state => ({
      seconds: state.seconds + 1
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        Giây: {this.state.seconds}
      </div>
    );
  }
}

<<<<<<< HEAD
ReactDOM.render(
  <Timer />,
  document.getElementById('timer-example')
);
=======
root.render(<Timer />);
>>>>>>> 822330c3dfa686dbb3424886abce116f20ed20e6
