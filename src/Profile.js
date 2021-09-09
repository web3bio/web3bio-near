import 'regenerator-runtime/runtime'
import React, { Component } from 'react'
import getConfig from './config'
import SocialLinks from './components/SocialLinks'
const nearConfig = getConfig(process.env.NODE_ENV || 'development')

class Profile extends Component {
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
    let pageOwner = this.props.match.params.owner
    const pageBio = await this.getBio(pageOwner)
    this.setState({
      pageBio: pageBio
    })
    
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
    let newCrypto = new Object({
      btc: "xxx",
      eth: "xxx"
    })
    let newRecords = new Object({
        email: "testnet@near.org",
        settings: "royal",
        premium: true,
        name: "Yan Zhu",
        avatar: "https://z3.ax1x.com/2021/09/09/hLPcm4.png",
        description: "is creating products, code and jokes.",
        website: "website",
        location: "Shanghai",
        social: newSocial,
        crypto: newCrypto
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
    let crypto = new Object(pageBio.crypto)

    return (
      <div className="web3bio-container">
        { pageBio.settings ? 
          <div className={`web3bio-cover ${pageBio.settings}`}></div>
          :
          <div className="web3bio-cover"></div>
        }
        <div className="web3bio-header">
          <div className="container grid-lg">
            <div className="columns">
              <div className="column col-12">
                <a className="web3bio-logo" href="/" title={currentUser}>
                  <h1>WEB3<br/>BIO</h1>
                </a>
                <div className="web3bio-account">
                  { this.state.login ? 
                    <div>
                      <button className="btn mr-1" onClick={this.requestSignOut}>Log out</button>
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
        <div className="web3bio-content container grid-sm">
          <div className="web3bio-profile">
            { pageBio.avatar ? 
              <img src={pageBio.avatar} className="profile-avatar avatar avatar-xl" />
            :
              <div className="profile-avatar avatar avatar-xl" data-initial={pageBio.name}></div>
            }
            <h2 className="profile-name">{pageBio.name}</h2>
            <h3 className="profile-description">{pageBio.description}</h3>
            <SocialLinks social={social} />
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

export default Profile;
