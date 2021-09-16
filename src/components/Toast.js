import React, { Component } from 'react'

class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toastState: true
    };
  }

  componentDidMount() {
    this.timer = setTimeout(
      () => this.tick(),
      4000
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  tick() {
    this.setState({
      toastState: false
    });
  }

  render() {
    const { toastState } = this.state
    const { content } = this.props

    return (
      <>
        { toastState && !!content ? 
          <div className="web3bio-toast">
            <div className="toast">{content}</div>
          </div> : null
        }
      </>
    )
  }
}

export default Toast;
