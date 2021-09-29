import React, { Component } from 'react'
import Clipboard from 'react-clipboard.js'
import SVG from 'react-inlinesvg'
import IconNear from '../assets/icons/crypto-near.svg'
import IconBtc from '../assets/icons/crypto-btc.svg'
import IconEth from '../assets/icons/crypto-eth.svg'
import IconDot from '../assets/icons/crypto-dot.svg'
import IconCopy from '../assets/icons/action-copy.svg'
import IconExplore from '../assets/icons/action-explore.svg'
import IconDonate from '../assets/icons/action-donate.svg'

import getConfig from '../config'
const nearConfig = getConfig(process.env.NODE_ENV || 'development')

class CryptoWidgets extends Component {
  constructor(props) {
    super(props);
    this.handleCopy = this.handleCopy.bind(this);
  }

  handleCopy() {
    console.log('Copied to clipboard')
  }

  render() {
    const { crypto, handleDonateOpen } = this.props

    return (
      <div className="profile-crypto profile-widget">
        { !!crypto.near? 
          <div className="profile-crypto-item near">
            <div className="profile-crypto-content">
              <SVG src={IconNear} className="profile-crypto-icon icon" alt="NEAR" />
              <div className="profile-crypto-main">
                <div className="profile-crypto-subtitle">NEAR</div>
                <div className="profile-crypto-title">{crypto.near}</div>
              </div>
            </div>
            <div className="profile-crypto-action">
              <Clipboard className="btn btn-sm btn-link tooltip mr-1" data-clipboard-text={crypto.near} onSuccess={this.handleCopy} title="Copy to clipboard">
                <SVG src={IconCopy} className="icon" />
              </Clipboard>
              <a href={`${nearConfig.explorerUrl}/accounts/${crypto.near}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-link tooltip ml-1 mr-1" title="Open in Explorer">
                <SVG src={IconExplore} className="icon" />
              </a>
              <button onClick={handleDonateOpen} className="btn ml-1">
                <SVG src={IconDonate} className="icon mr-2" /> Donate
              </button>
            </div>
          </div> : null
        }
        { !!crypto.btc? 
          <div className="profile-crypto-item btc">
            <div className="profile-crypto-content">
              <SVG src={IconBtc} className="profile-crypto-icon icon" alt="BTC" />
              <div className="profile-crypto-main">
                <div className="profile-crypto-subtitle">BTC</div>
                <div className="profile-crypto-title">{crypto.btc}</div>
              </div>
            </div>
            <div className="profile-crypto-action">
              <Clipboard className="btn btn-sm btn-link tooltip mr-1" data-clipboard-text={crypto.btc} onSuccess={this.handleCopy} title="Copy to clipboard">
                <SVG src={IconCopy} className="icon" />
              </Clipboard>
              <a href={`https://btc.com/btc/address/${crypto.btc}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-link tooltip ml-1" title="Open in Explorer">
                <SVG src={IconExplore} className="icon" />
              </a>
            </div>
          </div> : null
        }
        { !!crypto.eth? 
          <div className="profile-crypto-item eth">
            <div className="profile-crypto-content">
              <SVG src={IconEth} className="profile-crypto-icon icon" alt="ETH" />
              <div className="profile-crypto-main">
                <div className="profile-crypto-subtitle">ETH</div>
                <div className="profile-crypto-title">{crypto.eth}</div>
              </div>
            </div>
            <div className="profile-crypto-action">
              <Clipboard className="btn btn-sm btn-link tooltip mr-1" data-clipboard-text={crypto.eth} onSuccess={this.handleCopy} title="Copy to clipboard">
                <SVG src={IconCopy} className="icon" />
              </Clipboard>
              <a href={`https://etherscan.io/address/${crypto.eth}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-link tooltip ml-1" title="Open in Explorer">
                <SVG src={IconExplore} className="icon" />
              </a>
            </div>
          </div> : null
        }
        { !!crypto.dot? 
          <div className="profile-crypto-item dot">
            <div component="div" className="profile-crypto-content">
              <img src={IconDot} className="profile-crypto-icon icon" alt="DOT" />
              <div className="profile-crypto-main">
                <div className="profile-crypto-subtitle">DOT</div>
                <div className="profile-crypto-title">{crypto.dot}</div>
              </div>
            </div>
            <div className="profile-crypto-action">
              <Clipboard className="btn btn-sm btn-link tooltip mr-1" data-clipboard-text={crypto.dot} onSuccess={this.handleCopy} title="Copy to clipboard">
                <SVG src={IconCopy} className="icon" />
              </Clipboard>
              <a href={`https://polkadot.subscan.io/account/${crypto.dot}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-link tooltip ml-1" title="Open in Explorer">
                <SVG src={IconExplore} className="icon" />
              </a>
            </div>
          </div> : null
        }
      </div>
    )
  }
}

export default CryptoWidgets;
