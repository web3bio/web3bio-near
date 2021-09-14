import React, { Component } from 'react'
import Clipboard from 'react-clipboard.js'
import MiddleEllipsis from 'react-middle-ellipsis'
import IconNear from '../assets/icons/near.svg'
import IconBtc from '../assets/icons/btc.svg'
import IconEth from '../assets/icons/eth.svg'
import IconDot from '../assets/icons/dot.svg'
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
        <div className="profile-widget-header">Crypto</div>
        { crypto.near? 
          <Clipboard component="div" className="profile-crypto-item near" data-clipboard-text={crypto.near}>
            <img src={IconNear} className="profile-crypto-icon icon" alt="NEAR" />
            <div className="profile-crypto-content text-ellipsis">
              <MiddleEllipsis>
                <span className="profile-crypto-title ellipseMe">{crypto.near}</span>
                <div className="profile-crypto-subtitle">NEAR</div>
              </MiddleEllipsis>
            </div>
          </Clipboard> : null
        }
        { crypto.btc? 
          <Clipboard component="div" className="profile-crypto-item btc" data-clipboard-text={crypto.btc}>
            <img src={IconBtc} className="profile-crypto-icon icon" alt="BTC" />
            <div className="profile-crypto-content text-ellipsis">
              <MiddleEllipsis>
                <span className="profile-crypto-title ellipseMe">{crypto.btc}</span>
                <div className="profile-crypto-subtitle">BTC</div>
              </MiddleEllipsis>
            </div>
          </Clipboard> : null
        }
        { crypto.eth? 
          <Clipboard component="div" className="profile-crypto-item eth" data-clipboard-text={crypto.eth}>
            <img src={IconEth} className="profile-crypto-icon icon" alt="ETH" />
            <div className="profile-crypto-content text-ellipsis">
              <MiddleEllipsis>
                <span className="profile-crypto-title ellipseMe">{crypto.eth}</span>
                <div className="profile-crypto-subtitle">ETH</div>
              </MiddleEllipsis>
            </div>
          </Clipboard> : null
        }
        { crypto.dot? 
          <Clipboard component="div" className="profile-crypto-item dot" data-clipboard-text={crypto.dot}>
            <img src={IconDot} className="profile-crypto-icon icon" alt="DOT" />
            <div className="profile-crypto-content text-ellipsis">
              <MiddleEllipsis>
                <span className="profile-crypto-title ellipseMe">{crypto.dot}</span>
                <div className="profile-crypto-subtitle">DOT</div>
              </MiddleEllipsis>
            </div>
          </Clipboard> : null
        }
      </div>
    )
  }
}

export default CryptoWidgets;
