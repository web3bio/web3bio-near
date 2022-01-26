import 'regenerator-runtime/runtime'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import * as nearAPI from 'near-api-js'
import getConfig from './config'
import SocialLinks from './components/SocialLinks'
import CryptoWidgets from './components/CryptoWidgets'
import CryptoDonate from './components/CryptoDonate'
const nearConfig = getConfig(process.env.NODE_ENV || 'development')

class ProfileNEAR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      currentUser: window.accountId,
      loading: true,
      pageBio: new Object(),
      pageStatus: false,
      pageDonate: false
    }
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.handleDonateOpen = this.handleDonateOpen.bind(this);
    this.handleDonateClose = this.handleDonateClose.bind(this);
  }

  async componentDidMount() {
    let isAuth = this.props.wallet.isSignedIn()
    let pageOwner = this.props.match.params.owner + '.' + this.props.match.params[0]

    const pageBio = await this.getProfile(pageOwner)
    if (!!pageBio) {
      document.title = `${pageBio.displayname} - Web3.bio`
      
      this.setState({
        pageBio: pageBio,
        pageStatus: true
      })
    }
    
    if (isAuth) {
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

  async getProfile(pageOwner) {
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
      currentUser: null
    })
  }

  handleDonateOpen() {
    if (this.state.login) {
      this.setState({
        pageDonate: true
      })
    } else {
      this.requestSignIn()
    }
  }

  handleDonateClose() {
    this.setState({
      pageDonate: false
    })
  }

  render() {
    const { login, currentUser, loading, pageBio, pageStatus, pageDonate } = this.state
    const { wallet } = this.props
    let records = new Object(pageBio.records)
    let nameInitial = String(pageBio.displayname).charAt(0).toUpperCase()

    return (
      <>
        <div className="web3bio-header">
          <div className="container grid-lg">
            <div className="columns">
              <div className="column col-12">
                <Link to="/" className="web3bio-logo" title="Web3.bio">
                  <h1>WEB3<br/>BIO</h1>
                </Link>
                { pageBio.owner == currentUser ? 
                  <div className="web3bio-account">
                    { login ? 
                      <>
                        <Link className="btn mr-1" to="/dashboard">Manage</Link>
                        <button className="btn ml-1" onClick={this.requestSignOut}>Logout</button>
                      </>
                      :
                      <button className="btn" onClick={this.requestSignIn}>Login with NEAR</button>
                    }
                  </div>
                  :
                  null
                }
              </div>
            </div>
          </div>
        </div>
        
        { !loading ? 
          <>
            { pageStatus ? 
              <>
                <div className={`web3bio-cover ${pageBio.records.theme}`}></div>
                <div className="web3bio-content container grid-lg">
                  <div className="web3bio-profile text-center">
                    { !!pageBio.avatar ? 
                      <img src={pageBio.avatar} className="profile-avatar avatar avatar-xl" />
                      :
                      <div className="profile-avatar avatar avatar-xl" data-initial={nameInitial}></div>
                    }
                    <h2 className="profile-name">{pageBio.displayname}</h2>
                    { !!pageBio.description ?
                      <h3 className="profile-description">{pageBio.description}</h3>
                      :
                      <h3 className="profile-description">{pageBio.owner}</h3>
                    }
                    
                    <SocialLinks social={records} />
                    <CryptoWidgets crypto={records} handleDonateOpen={this.handleDonateOpen} />

                    { pageDonate ? 
                      <CryptoDonate
                        currentUser={currentUser}
                        displayname={pageBio.displayname}
                        receiver={pageBio.records.near}
                        wallet={wallet}
                        handleDonateClose={this.handleDonateClose}
                      /> : null
                    }
                  </div>
                </div>
              </>
              :
              <>
                <div className="web3bio-cover royal"></div>
                <div className="web3bio-hero container grid-sm">
                  <div className="container grid-sm">
                    <div className="columns">
                      <div className="column col-12">
                        <div className="h1">The page you’re looking for doesn’t exist.</div>
                        { login ? 
                          <div className="web3bio-hero-input input-group">
                            <Link to={`/${currentUser}`} className="input-group-addon addon-lg text-left text-dark">web3.bio/
                              <strong>{currentUser}</strong>
                            </Link>
                            <Link to="/dashboard" className="btn btn-lg input-group-btn">Claim your page</Link>
                          </div>
                          :
                          <div className="web3bio-hero-input input-group c-hand" onClick={this.requestSignIn}>
                            <span className="input-group-addon addon-lg text-left">web3.bio/
                              <strong className="text-gray">name.near</strong>
                            </span>
                            <button className="btn btn-lg input-group-btn">Login and Claim</button>
                          </div>
                        }
                        <div className="h6 mt-2">Claim your page with <strong>NEAR account</strong> in seconds.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
          </>
          :
          <>
            <div className="web3bio-cover royal"></div>
            <div className="web3bio-content container grid-sm">
              <div className="web3bio-profile">
                <div className="loading loading-lg loading-dark"></div>
              </div>
            </div>
          </>
        }
      </>
    )
  }
}

export default ProfileNEAR;
