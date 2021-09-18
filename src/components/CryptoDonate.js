import React, { Component } from 'react'
import * as nearAPI from 'near-api-js'
import SVG from 'react-inlinesvg'
import IconDonate from '../assets/icons/action-donate.svg'
import getConfig from '../config'
const nearConfig = getConfig(process.env.NODE_ENV || 'development')

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBalance: 0
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    let currentBalance = await this.props.wallet.account().getAccountBalance().available
    this.setState({
      currentBalance: currentBalance
    })
    console.log(this.state.currentBalance)
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    let donateAmount = event.target.amount.value
        donateAmount = nearAPI.utils.format.parseNearAmount(donateAmount)
    const donateReceiver = this.props.receiver
    const donateSender = this.props.currentUser
    
    try {
      console.log(`Sending ${donateAmount} NEAR from ${donateSender} to ${donateReceiver}.`);
      // send those tokens! :)
      const result = await this.props.wallet.account().sendMoney(donateReceiver, donateAmount);
      // console results
      console.log('Transaction Results: ', result.transaction);
      console.log('--------------------------------------------------------------------------------------------');
      console.log('OPEN LINK BELOW to see transaction in NEAR Explorer!');
      console.log(`${nearConfig.explorerUrl}/transactions/${result.transaction.hash}`);
      console.log('--------------------------------------------------------------------------------------------');
    } catch(error) {
      console.log(error);
    }
  }

  render() {
    let { currentBalance } = this.state
    let { displayname, handleDonateClose } = this.props
    let amountInNEAR = nearAPI.utils.format.formatNearAmount(currentBalance)
        amountInNEAR = Math.floor(amountInNEAR * 10000) / 10000

    return (
      <div className="web3bio-modal">
        <div className="modal-overlay" onClick={handleDonateClose}></div>
        <div className="modal-container text-left">
          <div className="modal-header">
            <button onClick={handleDonateClose} className="btn btn-sm btn-link float-right" aria-label="Close">✗</button>
            <div className="modal-title h6 text-bold">Donate {displayname}</div>
          </div>
          <div className="modal-body">
            <form onSubmit={this.handleSubmit} autoComplete="off">
              <div className="h1 text-center">🎁</div>
              <div className="h6 mb-4">Your balance: {amountInNEAR} NEAR</div>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon addon-lg">NEAR</span>
                  <input className="form-input input-lg" type="number" id="amount" placeholder="Donation amount" defaultValue="5" max={amountInNEAR} step="0.01" required />
                </div>
              </div>
              <div className="form-group">
                <button className="btn btn-block btn-lg" type="submit"><SVG src={IconDonate} className="icon mr-2" />Donate</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

}

export default Modal;