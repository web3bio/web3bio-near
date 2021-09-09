import 'regenerator-runtime/runtime'
import React, { Component } from 'react'
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
                <a className="web3bio-logo" href="/" title={currentUser}>
                  <h1>WEB3<br/>BIO</h1>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Dashboard;
