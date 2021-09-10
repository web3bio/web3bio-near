import 'regenerator-runtime/runtime'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import getConfig from './config'
const nearConfig = getConfig(process.env.NODE_ENV || 'development')

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      currentUser: window.accountId,
      loading: true,
      pageBio: new Object(),
      pageStatus: false
    }
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.setBio = this.setBio.bind(this);
  }

  async componentDidMount() {
    let loggedIn = this.props.wallet.isSignedIn()
    let pageOwner = window.accountId

    const pageBio = await this.getBio(pageOwner)
    if (pageBio) {
      this.setState({
        pageBio: pageBio,
        pageStatus: true
      })
    }
    
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
    try {
      // make an update call to the smart contract
      return await window.contract.getRecordByOwner({
        owner: pageOwner
      })
    } catch (e) {
      console.log(
        'Something went wrong! '
      )
      throw e
    } finally {
      this.setState({
        loading: false
      })
    }
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
    const { login, currentUser, loading, pageBio, pageStatus } = this.state
    let social = new Object(pageBio.social)
    let crypto = new Object(pageBio.crypto)

    return (
      <div className="web3bio-container">

        <div className="web3bio-header">
          <div className="container grid-lg">
            <div className="columns">
              <div className="column col-12">
                <Link to="/" className="web3bio-logo" title={currentUser}>
                  <h1>WEB3<br/>BIO</h1>
                </Link>
                <div className="web3bio-account">
                  { login ? 
                    <button className="btn" onClick={this.requestSignOut}>Logout</button>
                    :
                    <button className="btn" onClick={this.requestSignIn}>Login with NEAR</button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        { !loading ? 
          <>
            <div className="web3bio-cover"></div>
            <div className="web3bio-content container grid-sm">
              <div className="columns">
                <div className="column col-12">
                  <div className="web3bio-content-title text-center mb-2">Manage your Web3.bio</div>
                  <div className="text-center">
                    <Link to={`/${currentUser}`} className="btn" target="_blank"><span className="text-gray">web3.bio/</span>{currentUser}</Link>
                  </div>
                  <div className="web3bio-settings">
                    <form>
                      <fieldset>
                        <legend className="h5 text-bold">Profile</legend>
                        <div className="form-group">
                          <label className="form-label" for="name">Name</label>
                          <input className="form-input input-lg" type="text" id="name" placeholder="Name" defaultValue={pageBio.name} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label" for="description">Bio</label>
                          <textarea className="form-input input-lg" id="description" placeholder="Description" defaultValue={pageBio.description} maxlength="160" />
                        </div>
                        <div className="form-group">
                          <label className="form-label" for="avatar">Avatar</label>
                          <input className="form-input input-lg" type="text" id="avatar" placeholder="Avatar URL" defaultValue={pageBio.avatar} />
                          <div class="form-input-hint">NFT avatars support is coming soon.</div>
                        </div>
                        <div className="form-group">
                          <label className="form-label" for="email">Email</label>
                          <input className="form-input input-lg" type="text" id="email" placeholder="Email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,14}$" defaultValue={pageBio.email} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" for="website">Website</label>
                          <input className="form-input input-lg" type="text" id="website" placeholder="https://" defaultValue={pageBio.website} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" for="location">Location</label>
                          <input className="form-input input-lg" type="text" id="location" placeholder="The Moon" defaultValue={pageBio.location} maxlength="30" />
                        </div>
                        <div className="form-group form-group-action">
                          <button className="btn btn-lg btn-block">Update</button>
                        </div>
                      </fieldset>
                    </form>
                    
                  </div>
                </div>
              </div>
            </div>
          </>
          :
          <div className="web3bio-content container grid-sm">
            <div className="web3bio-profile">
              <div className="loading loading-lg"></div>
            </div>
          </div>
        }
        
        <div className="web3bio-footer text-center">
          <div className="container grid-lg">
            <div className="columns">
              <div className="column col-12">
                <Link className="btn btn-primary" to="/">Claim your <strong>Web3.bio</strong> page</Link>
                <div className="mt-2 text-bold">Built with &hearts; <span className="text-gray">&amp;</span> <a href="https://near.org" target="_blank" rel="noopener noreferrer" className="text-dark">NEAR</a> </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }

}

export default Dashboard;