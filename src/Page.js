import 'regenerator-runtime/runtime'
import React, { Component } from 'react'
import getConfig from './config'
const nearConfig = getConfig(process.env.NODE_ENV || 'development')

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      currentUser: window.accountId,
      pageOwner: null,
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
      pageOwner: this.props.match.params.owner,
      pageBio: pageBio
    })
    console.log(pageBio.name)
    
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
    // const newRecords = new Records(email, expiration, settings, premium, name, avatar, description, website, location);
    try {
      // make an update call to the smart contract
      await window.contract.setRecordByOwner({
        email: "testnet@google.org",
        expiration: 233,
        settings: "settings",
        premium: true,
        name: "Google",
        avatar: "avatar",
        description: "Search",
        website: "website",
        location: "location"
      })
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
    const {
      state
    } = this
    const {
      currentUser,
      pageOwner,
      pageBio
    } = state
    console.log(pageBio.email)

    return (
      <div className="App-header">
        <div className="image-wrapper">
          NEAR - {currentUser} - {pageOwner}
          <h2>{pageBio.email}</h2>
        </div>
        <div>
        </div>
        <div className="login">
          {this.state.login ? 
            <div>
              <button onClick={this.requestSignOut}>Log out</button>
              <button onClick={this.setBio}>Set Bio</button>
              {/* <button onClick={}>Get Bio</button> */}
            </div>
            : <button onClick={this.requestSignIn}>Log in with NEAR</button>}
        </div>
      </div>
    )
  }

}

export default Page;
