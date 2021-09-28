import 'regenerator-runtime/runtime'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as nearAPI from 'near-api-js'
import getConfig from './config'
const nearConfig = getConfig(process.env.NODE_ENV || 'development')

class ProfileDAS extends Component {
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
  }

  async componentDidMount() {
    let isAuth = this.props.wallet.isSignedIn()
    let pageOwner = this.props.match.params.owner

    const pageBio = await this.getProfile(pageOwner)
    if (!!pageBio) {
      document.title = `${pageBio.displayname} - Web3.bio`
      
      this.setState({
        pageBio: pageBio,
        pageStatus: true
      })
    }
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

    return (
      <>
        <div className="web3bio-content container grid-lg">
          <div className="web3bio-profile text-center">
            <h2 className="profile-name">{pageBio.displayname}</h2>
            <h3>DAS</h3>

          </div>
        </div>
      </>
    )
  }
}

export default ProfileDAS;
