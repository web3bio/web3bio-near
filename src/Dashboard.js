import 'regenerator-runtime/runtime'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import getConfig from './config'
import SocialLinks from './components/SocialLinks'
const nearConfig = getConfig(process.env.NODE_ENV || 'development')

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      currentUser: window.accountId,
      pageBio: new Object()
    }
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.setBio = this.setBio.bind(this);
  }

  async componentDidMount() {
    let loggedIn = this.props.wallet.isSignedIn()
    
    if (loggedIn) {
      this.signedInFlow();
    } else {
      this.signedOutFlow();
    }
  }

  async signedInFlow() {
    this.setState({
      login: true,
      currentUser: window.accountId
    })
    const accountId = await this.props.wallet.getAccountId()
    if (window.location.search.includes("account_id")) {
      window.location.replace(window.location.origin + window.location.pathname)
    }
  }

  async requestSignIn() {
    const appTitle = 'Web3.bio';
    await this.props.wallet.requestSignIn(
      nearConfig.contractName,
      appTitle
    )
  }

  async setBio() {
    let newSocial = new Object({
      twitter: "https://twitter.com/picturepan2",
      github: "https://github.com/picturepan2"
    })
    let newRecords = new Object({
        email: "testnet@near.org",
        settings: "settings",
        premium: true,
        name: "Yan Zhu",
        avatar: "https://z3.ax1x.com/2021/09/09/hLPcm4.png",
        description: "is creating products, code and jokes.",
        website: "website",
        location: "Shanghai",
        social: newSocial
      })
    try {
      // make an update call to the smart contract
      await window.contract.setRecordByOwner(newRecords)
    } catch (e) {
      console.log(
        'Something went wrong! '
      )
      throw e
    } finally {
      console.log("🚀")
    }
  }

  async getBio(pageOwner) {
    return await window.contract.getRecordByOwner({
      owner: pageOwner
    })
  }

  requestSignOut() {
    this.props.wallet.signOut();
    setTimeout(this.signedOutFlow, 500);
    console.log("after sign out", this.props.wallet.isSignedIn())
  }

  signedOutFlow() {
    if (window.location.search.includes("account_id")) {
      window.location.replace(window.location.origin + window.location.pathname)
    }
    this.setState({
      login: false,
      currentUser: null,
    })
  }

  render() {
    const { currentUser, pageBio } = this.state
    let social = new Object(pageBio.social)
    console.log()

    return (
      <div className="web3bio-container">
        <div className="web3bio-cover"></div>

        <div className="web3bio-header">
          <div className="container grid-lg">
            <div className="columns">
              <div className="column col-12">
                <Link to="/" className="web3bio-logo" title={currentUser}>
                  <h1>WEB3<br/>BIO</h1>
                </Link>
                <div className="web3bio-account">
                  {this.state.login ? 
                    <div>
                      <button className="btn mr-1" onClick={this.requestSignOut}>Logout</button>
                      <button className="btn ml-1" onClick={this.setBio}>Set Bio</button>
                    </div>
                    :
                    <button className="btn" onClick={this.requestSignIn}>Login with NEAR</button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="web3bio-hero">
          <div className="container grid-sm">
            <div className="columns">
              <div className="column col-12">
                <h1>One Link For Your<br/><strong>Web3</strong> Profile</h1>
                <h2>All your profile, social accounts, crypto addresses and NFT collections in one page.</h2>
                {this.state.login ? 
                  <div className="web3bio-hero-input input-group">
                    <span className="input-group-addon addon-lg text-bold">web3.bio/
                      <span className="text-dark">{currentUser}</span>
                    </span>
                    <Link to="/dashboard" className="btn btn-lg input-group-btn">Claim your page</Link>
                  </div>
                  :
                  <div className="web3bio-hero-input input-group c-hand" onClick={this.requestSignIn}>
                    <span className="input-group-addon addon-lg text-bold">web3.bio/
                      <span className="text-gray">name.near</span>
                    </span>
                    <button className="btn btn-lg input-group-btn">Login and Claim</button>
                  </div>
                }
                <div className="mt-2">Claim your page with <strong>NEAR account</strong> in seconds.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="web3bio-footer text-center">
          <div className="container grid-lg">
            <div className="columns">
              <div className="column col-12">
                <a className="btn btn-primary" href="/">Claim your <strong>Web3.bio</strong> page</a>
                <div className="mt-2 text-bold">Built with &hearts; &amp; <a href="https://near.org" target="_blank" rel="noopener noreferrer" className="text-dark">NEAR</a> </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }

}

export default Dashboard;
