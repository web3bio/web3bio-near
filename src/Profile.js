import 'regenerator-runtime/runtime'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import getConfig from './config'
import SocialLinks from './components/SocialLinks'
import Footer from './components/Footer'
const nearConfig = getConfig(process.env.NODE_ENV || 'development')

class Profile extends Component {
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
  }

  async componentDidMount() {
    let loggedIn = this.props.wallet.isSignedIn()
    let pageOwner = this.props.match.params.owner

    const pageBio = await this.getBio(pageOwner)
    if (!!pageBio) {
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
    let social = new Object(pageBio.records)
    let crypto = new Object(pageBio.crypto)

    return (
      <div className="web3bio-container">

        <div className="web3bio-header">
          <div className="container grid-lg">
            <div className="columns">
              <div className="column col-12">
                <Link to="/" className="web3bio-logo" title="Web3.bio">
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
            { pageStatus ? 
              <>
                <div className={`web3bio-cover ${pageBio.theme}`}></div>
                <div className="web3bio-content container grid-sm">
                  <div className="web3bio-profile">
                    { pageBio.avatar ? 
                      <img src={pageBio.avatar} className="profile-avatar avatar avatar-xl" />
                    :
                      <div className="profile-avatar avatar avatar-xl" data-initial=""></div>
                    }
                    <h2 className="profile-name">{pageBio.name}</h2>
                    <h3 className="profile-description">{pageBio.description}</h3>
                    <SocialLinks social={social} />
                  </div>
                </div>
              </>
              :
              <>
                <div className="web3bio-cover"></div>
                <div className="web3bio-hero container grid-sm">
                  <div className="container grid-sm">
                    <div className="columns">
                      <div className="column col-12">
                        <h1>The page you’re looking for doesn’t exist.</h1>
                        <div className="mt-2">Claim your page with <strong>NEAR account</strong> in seconds.</div>
                        { login ? 
                          <div className="web3bio-hero-input input-group">
                            <span className="input-group-addon addon-lg text-left">web3.bio/
                              <strong className="text-dark">{currentUser}</strong>
                            </span>
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
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
          </>
          :
          <>
            <div className="web3bio-cover"></div>
            <div className="web3bio-content container grid-sm">
              <div className="web3bio-profile">
                <div className="loading loading-lg"></div>
              </div>
            </div>
          </>
        }
        
        <Footer />
      </div>
    )
  }

}

export default Profile;
