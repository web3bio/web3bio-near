import 'regenerator-runtime/runtime'
import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import getConfig from './config'
import Footer from './components/Footer'
import Clipboard from 'react-clipboard.js'
import IconCopy from './assets/icons/copy.svg'
const nearConfig = getConfig(process.env.NODE_ENV || 'development')

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      currentUser: window.accountId,
      loading: true,
      pageBio: new Object(),
      pageStatus: false,
      formChanged: false,
      formLoading: false,
      formAvatar: '',
      formTheme: ''
    }
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.delBio = this.delBio.bind(this);
  }

  async componentDidMount() {
    document.title = "Manage your profile - Web3.bio"

    let loggedIn = this.props.wallet.isSignedIn()
    let pageOwner = window.accountId

    let pageBio = await this.getBio(pageOwner)
    if (!!pageBio) {
      this.setState({
        pageBio: pageBio,
        pageStatus: true,
        formAvatar: pageBio.avatar,
        formTheme: pageBio.theme
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

  async setBio(newRecords) {
    try {
      await window.contract.setRecordByOwner(newRecords)
    } catch (e) {
      console.log(
        'Something went wrong! '
      )
      throw e
    }
  }

  async delBio() {
    if (!window.confirm(`Permanently delete your page and profile data for ${this.state.currentUser}?`)) {
      return
    }
    try {
      return await window.contract.delRecordByOwner({
        owner: this.state.currentUser
      })
    } catch (e) {
      console.log(
        'Something went wrong! '
      )
      throw e
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

  handleChange(event) {
    let formAvatar = this.state.formAvatar
    let formTheme = this.state.formTheme
    if (event.target.id == 'avatar') {
      formAvatar = event.target.value
    }
    if (event.target.id == 'theme') {
      formTheme = event.target.value
    }

    this.setState({
      formChanged: true,
      formAvatar: formAvatar,
      formTheme: formTheme
    })
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({
      formLoading: true
    })
    
    let newSocial = new Object({
      email: event.target.email.value,
      website: event.target.website.value,
      twitter: event.target.twitter.value,
      facebook: event.target.facebook.value,
      linkedin: event.target.linkedin.value,
      github: event.target.github.value,
      telegram: event.target.telegram.value,
      instagram: event.target.instagram.value,
      youtube: event.target.youtube.value,
      discord: event.target.discord.value,
      patreon: event.target.patreon.value,
      paypal: event.target.paypal.value
    })
    newSocial = Object.fromEntries(Object.entries(newSocial).filter(([_, v]) => v != "" && v != null));
    
    let newCrypto = new Object({
      btc: event.target.btc.value,
      eth: event.target.eth.value,
      dot: event.target.dot.value,
    })
    newCrypto = Object.fromEntries(Object.entries(newCrypto).filter(([_, v]) => v != "" && v != null));
    
    let newRecords = new Object({
      name: event.target.displayname.value,
      avatar: event.target.avatar.value,
      description: event.target.description.value,
      location: event.target.location.value,
      theme: event.target.theme.value,
      records: newSocial,
      crypto: newCrypto
    })
    console.log(newRecords)

    await this.setBio(newRecords)

    let pageOwner = this.state.currentUser
    let pageBio = await this.getBio(pageOwner)
    if (!!pageBio) {
      this.setState({
        pageBio: pageBio,
        pageStatus: true,
        formChanged: false,
        formLoading: false,
        formAvatar: pageBio.avatar,
        formTheme: pageBio.theme
      })
    }
  }

  render() {
    const { login, currentUser, loading, pageBio, pageStatus, formChanged, formLoading, formAvatar, formTheme } = this.state
    let social = new Object(pageBio.records)
    let crypto = new Object(pageBio.crypto)

    if (!login && !currentUser) {
      return <Redirect to="/" />;
    }

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
                    <>
                      <button className="btn" onClick={this.requestSignOut}>Logout</button>
                    </>
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
            <div className={`web3bio-cover ${formTheme}`}></div>
            <div className="web3bio-content container grid-sm">
              <div className="columns">
                <div className="column col-12">
                  <div className="web3bio-content-title text-center mb-4">Manage your profile</div>
                  <div className="text-center">
                    <div className="btn-group">
                        <Link to={`/${currentUser}`} className="btn" target="_blank"><span className="text-opacity">web3.bio/</span>{currentUser}</Link>
                        <Clipboard className="btn" data-clipboard-text={`https://web3.bio/${currentUser}`}>
                          <img src={IconCopy} className="profile-copy-icon icon" />
                        </Clipboard>
                      </div>
                  </div>
                  
                  <div className="web3bio-settings">
                    <form onSubmit={this.handleSubmit} autoComplete="off">
                      <fieldset id="profile">
                        <legend className="h5 text-bold">Profile</legend>
                        <div className="form-group">
                          <label className="form-label" htmlFor="displayname">Name</label>
                          <input className="form-input input-lg" type="text" id="displayname" placeholder="Name" defaultValue={pageBio.name} required onChange={this.handleChange} autoComplete="off" />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="description">Bio</label>
                          <textarea className="form-input input-lg" id="description" placeholder="Description" defaultValue={pageBio.description} maxLength="160" onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="avatar">Avatar</label>
                          { formAvatar ? 
                            <img src={formAvatar} className="profile-avatar avatar avatar-lg mb-4 mt-2" />
                          :
                            <div className="profile-avatar avatar avatar-lg mb-4 mt-2" data-initial=""></div>
                          }
                          <input className="form-input input-lg" type="text" id="avatar" placeholder="https://" defaultValue={pageBio.avatar} onChange={this.handleChange} />
                          <div className="form-input-hint">You may use free photo hostings like <a href="https://imgbb.com/" target="_blank" rel="noopener noreferrer" className="text-dark">IMGBB</a> for avatars.</div>
                          
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="email">Email <small className="label">PUBLIC</small></label>
                          <input className="form-input input-lg" type="text" id="email" placeholder="Email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,14}$" defaultValue={social.email} onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="website">Website</label>
                          <input className="form-input input-lg" type="text" id="website" placeholder="https://" defaultValue={social.website} onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="location">Location</label>
                          <input className="form-input input-lg" type="text" id="location" placeholder="The Moon" defaultValue={pageBio.location} maxLength="30" onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="theme">Theme</label>
                          <select className="form-select select-lg" id="theme" value={formTheme} onChange={this.handleChange}>
                            <option value="royal">Royal</option>
                            <option value="flax">Flax</option>
                            <option value="witchhaze">Witch Haze</option>
                            <option value="salmon">Salmon</option>
                            <option value="mauve">Mauve</option>
                            <option value="shalimar">Shalimar</option>
                          </select>
                        </div>
                      </fieldset>

                      <fieldset id="social">
                        <legend className="h5 text-bold">Social</legend>
                        <div className="form-group">
                          <label className="form-label" htmlFor="twitter">Twitter</label>
                          <input className="form-input input-lg" type="text" id="twitter" placeholder="https://twitter.com/" defaultValue={social.twitter} maxLength="120" onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="facebook">Facebook</label>
                          <input className="form-input input-lg" type="text" id="facebook" placeholder="https://facebook.com/" defaultValue={social.facebook} maxLength="120" onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="linkedin">LinkedIn</label>
                          <input className="form-input input-lg" type="text" id="linkedin" placeholder="https://linkedin.com/" defaultValue={social.linked} maxLength="120" onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="github">GitHub</label>
                          <input className="form-input input-lg" type="text" id="github" placeholder="https://github.com/" defaultValue={social.github} maxLength="120" onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="telegram">Telegram</label>
                          <input className="form-input input-lg" type="text" id="telegram" placeholder="https://t.me/" defaultValue={social.telegram} maxLength="120" onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="instagram">Instagram</label>
                          <input className="form-input input-lg" type="text" id="instagram" placeholder="https://instagram.com/" defaultValue={social.instagram} maxLength="120" onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="youtube">YouTube</label>
                          <input className="form-input input-lg" type="text" id="youtube" placeholder="https://youtube.com/" defaultValue={social.youtube} maxLength="120" onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="discord">Discord</label>
                          <input className="form-input input-lg" type="text" id="discord" placeholder="https://discord.com/" defaultValue={social.discord} maxLength="120" onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="patreon">Patreon</label>
                          <input className="form-input input-lg" type="text" id="patreon" placeholder="https://patreon.com/" defaultValue={social.patreon} maxLength="120" onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="paypal">PayPal</label>
                          <input className="form-input input-lg" type="text" id="paypal" placeholder="https://paypal.me/" defaultValue={social.paypal} maxLength="120" onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <div className="form-input-hint">
                            Request more social support? Please contact <a href="https://twitter.com/picturepan2" target="_blank" rel="noopener noreferrer">@picturepan2</a>.
                          </div>
                        </div>
                      </fieldset>

                      <fieldset id="crypto">
                        <legend className="h5 text-bold">Crypto addresses</legend>
                        <div className="form-group">
                          <label className="form-label" htmlFor="near">NEAR</label>
                          <input className="form-input input-lg" type="text" id="near" defaultValue={crypto.near} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="btc">Bitcoin</label>
                          <input className="form-input input-lg" type="text" id="btc" defaultValue={crypto.btc} onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="eth">Ethereum</label>
                          <input className="form-input input-lg" type="text" id="eth" defaultValue={crypto.eth} onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="dot">Polkadot</label>
                          <input className="form-input input-lg" type="text" id="dot" defaultValue={crypto.dot} onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <div className="form-input-hint">
                            Request more crypto support? Please contact <a href="https://twitter.com/picturepan2" target="_blank" rel="noopener noreferrer">@picturepan2</a>.<br/>
                            NFT collection widget is coming soon.
                          </div>
                        </div>
                      </fieldset>

                      <div className={`web3bio-settings-footer ${formChanged ? "active" : ""}`}>
                        <button className={`btn btn-lg btn-block ${formLoading ? "loading" : ""}`} disabled={!formChanged} type="submit">Update</button>
                      </div>
                    </form>
                  </div>

                  <div className="web3bio-settings">
                    <div className="h5 text-bold">Danger Zone</div>
                    <div className="form-group">
                      <label className="form-label mb-2">Permanently delete your page and profile data from <strong className="text-error">{currentUser}</strong>. This of course is not reversable.</label>
                      <button className="btn mb-2" onClick={this.delBio}>Delete data</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

export default Dashboard;