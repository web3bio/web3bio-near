import React, { Component } from 'react'
import Clipboard from 'react-clipboard.js'
import IconNear from '../assets/icons/crypto-near.svg'
import IconBtc from '../assets/icons/crypto-btc.svg'
import IconEth from '../assets/icons/crypto-eth.svg'
import IconDot from '../assets/icons/crypto-dot.svg'
import IconCopy from '../assets/icons/copy.svg'

class CryptoWidgets extends Component {
  constructor(props) {
    super(props);
    this.handleCopy = this.handleCopy.bind(this);
  }

  handleCopy() {
    console.log('Copied to clipboard')
  }

  render() {
    const { crypto } = this.props

    return (
      <div className="profile-crypto profile-widget">
        { crypto.near? 
          <div className="profile-crypto-item near">
            <Clipboard component="div" className="profile-crypto-content" data-clipboard-text={crypto.near}>
              <img src={IconNear} className="profile-crypto-icon icon" alt="NEAR" />
              <div className="profile-crypto-main">
                <div className="profile-crypto-subtitle">NEAR</div>
                <div className="profile-crypto-title">{crypto.near}</div>
              </div>
            </Clipboard>
          </div> : null
        }
        { crypto.btc? 
          <div className="profile-crypto-item btc">
            <Clipboard component="div" className="profile-crypto-content" data-clipboard-text={crypto.btc}>
              <img src={IconBtc} className="profile-crypto-icon icon" alt="BTC" />
              <div className="profile-crypto-main">
                <div className="profile-crypto-subtitle">BTC</div>
                <div className="profile-crypto-title">{crypto.btc}</div>
              </div>
            </Clipboard>
          </div> : null
        }
        { crypto.eth? 
          <div className="profile-crypto-item eth">
            <Clipboard component="div" className="profile-crypto-content" data-clipboard-text={crypto.eth}>
              <img src={IconEth} className="profile-crypto-icon icon" alt="ETH" />
              <div className="profile-crypto-main">
                <div className="profile-crypto-subtitle">ETH</div>
                <div className="profile-crypto-title">{crypto.eth}</div>
              </div>
            </Clipboard>
          </div> : null
        }
        { crypto.dot? 
          <div className="profile-crypto-item dot">
            <Clipboard component="div" className="profile-crypto-content" data-clipboard-text={crypto.dot}>
              <img src={IconDot} className="profile-crypto-icon icon" alt="DOT" />
              <div className="profile-crypto-main">
                <div className="profile-crypto-subtitle">DOT</div>
                <div className="profile-crypto-title">{crypto.dot}</div>
              </div>
            </Clipboard>
          </div> : null
        }
      </div>
    )
  }
}

export default CryptoWidgets;
