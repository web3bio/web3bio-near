import 'regenerator-runtime/runtime'
import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import getConfig from './config'
import Toast from './components/Toast'
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
      formTheme: 'royal',
      pageToast: ''
    }
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.delProfile = this.delProfile.bind(this);
  }

  async componentDidMount() {
    document.title = "Manage your profile - Web3.bio"

    let isAuth = this.props.wallet.isSignedIn()
    let pageOwner = window.accountId

    let pageBio = await this.getProfile(pageOwner)
    if (!!pageBio) {
      this.setState({
        pageBio: pageBio,
        pageStatus: true,
        formAvatar: pageBio.avatar,
        formTheme: pageBio.theme
      })
    }
    console.log(pageBio)
    
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

  async getProfile(pageOwner) {
    try {
      return await window.contract.getRecordByOwner({
        owner: pageOwner
      })
    } catch (e) {
      this.setState({
        formLoading: false,
        pageToast: 'Something went wrong. Try again later.'
      })
      throw e
    } finally {
      this.setState({
        loading: false
      })
    }
  }

  async setProfile(newRecords) {
    try {
      await window.contract.setRecordByOwner(newRecords)
    } catch (e) {
      this.setState({
        formLoading: false,
        pageToast: 'Something went wrong. Try again later.'
      })
      throw e
    }
  }

  async delProfile() {
    if (!window.confirm(`Permanently delete your page and profile data for ${this.state.currentUser}?`)) {
      return
    }
    try {
      return await window.contract.delRecordByOwner({
        owner: this.state.currentUser
      })
    } catch (e) {
      this.setState({
        formLoading: false,
        pageToast: 'Something went wrong. Try again later.'
      })
      throw e
    } finally {
      // Go to home page
      window.location.replace(window.location.origin)
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

    switch (event.target.id) {
      case 'avatar':
        formAvatar = event.target.value
        break;
      case 'theme':
        formTheme = event.target.value
        break
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
      gitcoin: event.target.gitcoin.value,
      medium: event.target.medium.value,
      wechat: event.target.wechat.value,
      telegram: event.target.telegram.value,
      instagram: event.target.instagram.value,
      youtube: event.target.youtube.value,
      discord: event.target.discord.value,
      reddit: event.target.reddit.value,
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
      displayname: event.target.displayname.value,
      avatar: event.target.avatar.value,
      description: event.target.description.value,
      location: event.target.location.value,
      theme: event.target.theme.value,
      records: newSocial,
      crypto: newCrypto
    })
    console.log(newRecords)

    await this.setProfile(newRecords)

    let pageOwner = this.state.currentUser
    let pageBio = await this.getProfile(pageOwner)
    if (!!pageBio) {
      this.setState({
        pageBio: pageBio,
        pageStatus: true,
        formChanged: false,
        formLoading: false,
        formAvatar: pageBio.avatar,
        formTheme: pageBio.theme,
        pageToast: 'Profile updated.'
      })
    }
  }

  render() {
    const { 
      login,
      currentUser,
      loading,
      pageBio,
      pageStatus,
      formChanged,
      formLoading,
      formAvatar,
      formTheme,
      pageToast } = this.state
    let social = new Object(pageBio.records)
    let crypto = new Object(pageBio.crypto)
    let nameInitial = ''
    if (pageStatus) {
      nameInitial = String(pageBio.displayname).charAt(0).toUpperCase()
    } else {
      nameInitial = String(currentUser).charAt(0).toUpperCase()
    }

    if (!login && !currentUser) {
      return <Redirect to="/" />;
    }

    return (
      <>
        <Toast />
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
                      <Link to={`/${currentUser}`} className="btn mr-1" target="_blank"><span className="hide-lg"><span className="text-opacity">web3.bio/</span>{currentUser}</span><span className="show-lg">Preview</span></Link>
                      <button className="btn ml-1" onClick={this.requestSignOut}>Logout</button>
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
                  { !pageStatus ? 
                    <>
                      <div className="web3bio-content-title text-center mb-4">Hello, <strong>{currentUser}</strong>.</div>
                      <div className="web3bio-settings web3bio-placeholder">
                        <div className="h5 text-bold mb-4"><span className="mr-2">🌈</span> Claim your page</div>
                        <div className="h6 mb-2">
                          Complete your <a href="#profile" className="btn btn-sm ml-1 mr-1">basic info</a>, <a href="#social" className="btn btn-sm ml-1 mr-1">social links</a>, or <a href="#crypto" className="btn btn-sm ml-1 mr-1">crypto addresses</a> below to claim your page.
                        </div>
                        <div className="h6 mb-4">
                          Your page will be available at: <a href={`https://web3.bio/${currentUser}`} className="text-dark text-underline ml-1" target="_blank">web3.bio/{currentUser}</a>.
                        </div>
                      </div>
                    </>
                    :
                    <>
                      <div className="web3bio-content-title text-center mt-4 mb-4">Manage your profile</div>
                    </>
                  }
                  
                  <div className="web3bio-settings">
                    <ul className="tab tab-block">
                      <li className="tab-item">
                        <a href="#profile">Basic</a>
                      </li>
                      <li className="tab-item">
                        <a href="#social">Social</a>
                      </li>
                      <li className="tab-item">
                        <a href="#crypto">Crypto</a>
                      </li>
                    </ul>
                    <form onSubmit={this.handleSubmit} disabled={formLoading} autoComplete="off">
                      <fieldset id="profile">
                        <div className="h5 text-bold mb-2">Basic info</div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="displayname">Name</label>
                          <input className="form-input input-lg" type="text" id="displayname" placeholder="Name" defaultValue={pageBio.displayname} required onInput={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="description">Bio</label>
                          <textarea className="form-input input-lg" id="description" placeholder="Description" defaultValue={pageBio.description} maxLength="160" onInput={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="avatar">Avatar</label>
                          <div className="columns">
                            <div className="column">
                              <input className="form-input input-lg" type="url" id="avatar" placeholder="https://" defaultValue={pageBio.avatar} onInput={this.handleChange} />
                              <div className="form-input-hint">You may use free photo hostings like <a href="https://imgur.com/" target="_blank" rel="noopener noreferrer" className="text-dark">Imgur</a> or <a href="https://imgbb.com/" target="_blank" rel="noopener noreferrer" className="text-dark">IMGBB</a> for avatars.</div>
                            </div>
                            <div className="column col-auto">
                              { formAvatar ? 
                                <img src={formAvatar} className="profile-avatar avatar avatar-lg" />
                              :
                                <div className="profile-avatar avatar avatar-lg" data-initial={nameInitial}></div>
                              }
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="email">Email <small className="label">PUBLIC</small></label>
                          <input className="form-input input-lg" type="email" id="email" placeholder="Email" defaultValue={social.email} onInput={this.handleChange} />
                          <div className="form-input-hint">Leave it blank if you don't want to make your Email address public.</div>
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="website">Website</label>
                          <input className="form-input input-lg" type="url" id="website" placeholder="https://" defaultValue={social.website} onInput={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="location">Location</label>
                          <input className="form-input input-lg" type="text" id="location" placeholder="The Moon" defaultValue={pageBio.location} maxLength="30" onInput={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="theme">Theme</label>
                          <select className="form-select select-lg" id="theme" value={formTheme} onInput={this.handleChange}>
                            <option value="royal">Royal</option>
                            <option value="flax">Flax</option>
                            <option value="witchhaze">Witch Haze</option>
                            <option value="salmon">Salmon</option>
                            <option value="mauve">Mauve</option>
                            <option value="shalimar">Shalimar</option>
                            <option value="creamwhisper">Cream Whisper</option>
                            <option value="eggsour">Egg Sour</option>
                            <option value="flare">Flare</option>
                            <option value="snowymint">Snowy Mint</option>
                          </select>
                        </div>
                      </fieldset>

                      <fieldset id="social">
                        <div className="h5 text-bold mb-2">Social links</div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="twitter">Twitter</label>
                          <div className="input-group">
                            <span className="input-group-addon addon-lg">twitter.com<span className="ml-1">/</span></span>
                            <input className="form-input input-lg" type="text" id="twitter" placeholder="username" defaultValue={social.twitter} maxLength="120" onInput={this.handleChange} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="facebook">Facebook</label>
                          <div className="input-group">
                            <span className="input-group-addon addon-lg">facebook.com<span className="ml-1">/</span></span>
                            <input className="form-input input-lg" type="text" id="facebook" placeholder="username" defaultValue={social.facebook} maxLength="120" onInput={this.handleChange} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="linkedin">LinkedIn</label>
                          <input className="form-input input-lg" type="url" id="linkedin" placeholder="https://linkedin.com/" defaultValue={social.linkedin} maxLength="120" onInput={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="github">GitHub</label>
                          <div className="input-group">
                            <span className="input-group-addon addon-lg">github.com<span className="ml-1">/</span></span>
                            <input className="form-input input-lg" type="text" id="github" placeholder="username" defaultValue={social.github} maxLength="120" onInput={this.handleChange} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="gitcoin">Gitcoin</label>
                          <div className="input-group">
                            <span className="input-group-addon addon-lg">gitcoin.com<span className="ml-1">/</span></span>
                            <input className="form-input input-lg" type="text" id="gitcoin" placeholder="username" defaultValue={social.gitcoin} maxLength="120" onInput={this.handleChange} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="medium">Medium</label>
                          <input className="form-input input-lg" type="url" id="medium" placeholder="https://medium.com/" defaultValue={social.medium} maxLength="120" onInput={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="wechat">WeChat</label>
                          <input className="form-input input-lg" type="text" id="wechat" placeholder="WeChat ID" defaultValue={social.wechat} maxLength="120" onInput={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="telegram">Telegram</label>
                          <div className="input-group">
                            <span className="input-group-addon addon-lg">t.me<span className="ml-1">/</span></span>
                            <input className="form-input input-lg" type="text" id="telegram" placeholder="username" defaultValue={social.telegram} maxLength="120" onInput={this.handleChange} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="instagram">Instagram</label>
                          <div className="input-group">
                            <span className="input-group-addon addon-lg">instagram.com<span className="ml-1">/</span></span>
                            <input className="form-input input-lg" type="text" id="instagram" placeholder="username" defaultValue={social.instagram} maxLength="120" onInput={this.handleChange} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="youtube">YouTube</label>
                          <input className="form-input input-lg" type="url" id="youtube" placeholder="https://youtube.com/" defaultValue={social.youtube} maxLength="120" onInput={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="discord">Discord</label>
                          <input className="form-input input-lg" type="text" id="discord" placeholder="https://discord.com" defaultValue={social.discord} maxLength="120" onInput={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="reddit">Reddit</label>
                          <input className="form-input input-lg" type="url" id="reddit" placeholder="https://reddit.com/" defaultValue={social.reddit} maxLength="120" onInput={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="patreon">Patreon</label>
                          <div className="input-group">
                            <span className="input-group-addon addon-lg">patreon.com<span className="ml-1">/</span></span>
                            <input className="form-input input-lg" type="text" id="patreon" placeholder="username" defaultValue={social.patreon} maxLength="120" onInput={this.handleChange} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="paypal">PayPal</label>
                          <div className="input-group">
                            <span className="input-group-addon addon-lg">paypal.me<span className="ml-1">/</span></span>
                            <input className="form-input input-lg" type="text" id="paypal" placeholder="username" defaultValue={social.paypal} maxLength="120" onInput={this.handleChange} />
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="form-input-hint">
                            Request more social support? Please contact <Link to="/yanzhu.near" target="_blank" rel="noopener noreferrer">@yanzhu.near</Link>.
                          </div>
                        </div>
                      </fieldset>

                      <fieldset id="crypto">
                        <div className="h5 text-bold mb-2">Crypto addresses</div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="near">NEAR</label>
                          <input className="form-input input-lg" type="text" id="near" defaultValue={crypto.near ? crypto.near: currentUser} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="btc">Bitcoin</label>
                          <input className="form-input input-lg" type="text" id="btc" defaultValue={crypto.btc} onInput={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="eth">Ethereum</label>
                          <input className="form-input input-lg" type="text" id="eth" defaultValue={crypto.eth} onInput={this.handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="dot">Polkadot</label>
                          <input className="form-input input-lg" type="text" id="dot" defaultValue={crypto.dot} onInput={this.handleChange} />
                        </div>
                        <div className="web3bio-settings-placeholder">
                          <span className="text-bold">NFT Collection Widget - COMING SOON</span>
                        </div>
                        <div className="web3bio-settings-placeholder">
                          <span className="text-bold">Import ENS or DAS Records - COMING SOON</span>
                        </div>
                        <div className="form-group">
                          <div className="form-input-hint">
                            Request more crypto support? Please contact <Link to="/yanzhu.near" target="_blank" rel="noopener noreferrer">@yanzhu.near</Link>.<br/>
                          </div>
                        </div>
                      </fieldset>

                      <div className={`web3bio-settings-footer ${formChanged ? "active" : ""}`}>
                        <button className={`btn btn-lg btn-block ${formLoading ? "loading" : ""}`} disabled={!formChanged} type="submit">Update</button>
                      </div>
                    </form>
                  </div>

                  <div className="web3bio-settings" id="dangerzone">
                    <div className="h5 text-bold">Danger Zone</div>
                    <div className="form-group">
                      <label className="form-label mb-2">Permanently delete your page and profile data from <strong className="text-error">{currentUser}</strong>. This of course is not reversable.</label>
                      <button className="btn mb-2" onClick={this.delProfile}>Delete data</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            { !!pageToast ? <Toast content={pageToast} /> : null }
            
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

export default Dashboard;