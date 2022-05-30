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
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f
