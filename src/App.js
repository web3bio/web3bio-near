import 'regenerator-runtime/runtime'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import getConfig from './config'
import Footer from './components/Footer'
const nearConfig = getConfig(process.env.NODE_ENV || 'development')

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      currentUser: window.accountId
    }
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
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
    const { login, currentUser } = this.state
    console.log()

    return (
      <div className="web3bio-container">
        <div className="web3bio-cover royal"></div>

        <div className="web3bio-header">
          <div className="container grid-lg">
            <div className="columns">
              <div className="column col-12">
                <Link to="/" className="web3bio-logo" title="Web3.bio">
                  <h1>WEB3<br/>BIO</h1>
                </Link>
                <div className="web3bio-account">
                  {this.state.login ? 
                    <div>
                      <Link className="btn mr-1" to="/dashboard">Manage</Link>
                      <button className="btn ml-1" onClick={this.requestSignOut}>Logout</button>
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
                <h1>One Link For Your <strong>Web3</strong> Profile</h1>
                <h2>All your profile, social accounts, crypto addresses and NFT collections in one page.</h2>
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
                
                <div className="web3bio-actionbar">
                  <a href="#help" className="web3bio-action mx-auto"><span className="action-icon">⌅</span></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="web3bio-hero">
          <div className="container grid-sm">
            <div className="columns">
              <div className="column col-12">
                <div className="h1">Your Profile<br/>Decentralized<br/>On NEAR</div>
              </div>
            </div>
          </div>
          <div className="container grid-lg">
            <div className="columns">
              <div className="column col-12">
                <div className="h5 text-bold mt-4">Trusted by</div>
                <div className="emoji">👩‍🎓 👩‍🔧 👩‍🎨 👩‍🏭 🐳 👨‍💻 👩‍🏫 👮‍♂️ 🧑‍🔬 🧑‍🚀 🦸‍♂️ 🦍 🕵️‍♂️ 👨‍🍳 👨‍🌾 🦄 🧝‍♂️ 🦹‍♀️ 🧙‍♂️ 🧛🏼‍♂️ 🥷</div>
                <div className="h5 mt-4">&#10132; See how the maker
                  <Link to="/yanzhu.near" className="btn btn-sm btn-primary ml-1 mr-1">Yan Zhu</Link> 
                  is using Web3.bio.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="web3bio-hero web3bio-data">
          <div className="container grid-md">
            <div className="columns">
              <div className="column col-12 text-left">
                <span className="h2 text-bold text-title mr-2">Data Policy.</span>
                <span className="h2 text-bold text-subtitle mr-2">You control your data. You can delete profile data from your account anytime. Web3.bio has no ads. Web3.bio will not sell your data. Your data is securely stored on NEAR blockchain.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="web3bio-hero" id="help">
          <div className="container grid-lg">
            <div className="columns">
              <div className="column col-12">
                <div className="h1 text-bold">OK, I’m Ready.</div>
                <div className="h5">Claim your page with NEAR account in seconds.</div>
              </div>
            </div>
            <div className="columns">
              <div className="column col-4 col-md-12">
                <div className="card">
                  <div className="web3bio-actionbar">
                    <div className="web3bio-action mx-auto text-bold">1</div>
                  </div>
                  <div className="h5 text-bold mt-2">Login with NEAR account</div>
                  <div className="h6 mt-2">Your Web3.bio page will be claimed with your NEAR ID (example.near).</div>
                </div>
              </div>
              <div className="column col-4 col-md-12">
                <div className="card">
                  <div className="web3bio-actionbar">
                    <div className="web3bio-action mx-auto text-bold">2</div>
                  </div>
                  <div className="h5 text-bold mt-2">Customize your profile</div>
                  <div className="h6 mt-2">Complete your profile with your basic info, social links, crypto addresses, and others.</div>
                </div>
              </div>
              <div className="column col-4 col-md-12">
                <div className="card">
                  <div className="web3bio-actionbar">
                    <div className="web3bio-action mx-auto text-bold">3</div>
                    </div>
                  <div className="h5 text-bold mt-2">Spread the link</div>
                  <div className="h6 mt-2">Use your Web3.bio link on the Twitter bio, emails, and groups, or even business cards.</div>
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column col-12">
                { login ? 
                  <Link className="btn btn-primary btn-lg" to="/dashboard">Claim your <strong className="ml-1 mr-1">Web3.bio</strong> page</Link>
                  :
                  <button className="btn btn-primary btn-lg" onClick={this.requestSignIn}>Login and claim <strong className="ml-1 mr-1">Web3.bio</strong> page</button>
                }
                <div className="h6 mt-4">New to NEAR Protocol? <a href="https://near.org" target="_blank" rel="noopener noreferrer" className="text-dark"><u>Learn more at NEAR.org</u></a></div>
              </div>
            </div>
          </div>
        </div>

        <div className="web3bio-hero" id="features">
          <div className="container grid-sm">
            <div className="columns">
              <div className="column col-12">
                <div className="h1 text-bold">What's Next?</div>
                <div className="h5 mt-4 mb-4">We're helping Web3-native adopters, buidlers, NFT collectors, and teams better control their universal Web3 identities online.</div>
                <div className="h4 text-bold mt-4 mb-4">Features Request</div>
                <div className="h5 mt-4 mb-4">We're gradually making updates to Web3.bio. You may expect new features like
                  <span className="label label-feature ml-1 mr-1">Emoji fun</span>, 
                  <span className="label label-feature ml-1 mr-1">Tips and funding</span>,
                  <span className="label label-feature ml-1 mr-1">NFT collection showcase</span>,
                  <span className="label label-feature ml-1 mr-1">Premium tier</span>,
                  <span className="label label-feature ml-1 mr-1">Cryptocurrency transactions</span>,
                  <span className="label label-feature ml-1 mr-1">More social links</span>, 
                  <span className="label label-feature ml-1 mr-1">Widgets for creators</span>, 
                  <span className="label label-feature ml-1 mr-1">More crypto supports</span>,
                  <span className="label label-feature ml-1 mr-1">Naming service support</span>,
                  <span className="label label-feature ml-1 mr-1">SDK for wallets and DApps</span>, etc.
                </div>
                <div className="h5 mt-4">We’d love to know what you think. Please reach out to <Link to="/yanzhu.near" className="btn btn-sm ml-1 mr-1">Yan Zhu</Link>.</div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }
}

export default App;
