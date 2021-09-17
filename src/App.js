import 'regenerator-runtime/runtime'
import React, { Component } from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import getConfig from './config'
import Home from './Home'
import Profile from './Profile'
import Dashboard from './Dashboard'
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
        <Switch>
          <Route path="/" exact render={(props) => (
            <Home {...props} wallet={window.walletConnection} />
          )} />
          <Route path="/dashboard" exact render={(props) => (
            <Dashboard {...props} wallet={window.walletConnection} />
          )} />
          <Route path="/:owner" render={(props) => (
            <Profile {...props} wallet={window.walletConnection} />
          )} />
        </Switch>
        <Footer />
      </div>
    )
  }
}

export default App;
