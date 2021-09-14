import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Footer extends Component {
  render() {
    return (
      <div className="web3bio-footer text-center">
        <div className="container grid-lg">
          <div className="columns">
            <div className="column col-12">
              <Link className="btn btn-primary" to="/">Claim your <strong className="ml-1 mr-1">Web3.bio</strong> page</Link>
              <div className="mt-4 mb-2"><strong>&copy; 2021 <a href="https://web3.bio" className="text-dark">Web3.bio</a> · Proudly Built with <a href="https://near.org" target="_blank" rel="noopener noreferrer" className="text-dark">NEAR</a> <span className="text-primary">&hearts;</span></strong></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Footer;
