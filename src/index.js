import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Switch, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import Home from './Home'
import Profile from './Profile'
import ProfileDAS from './ProfileDAS'
import Dashboard from './Dashboard'
import Footer from './components/Footer'
import './assets/scss/web3bio.scss'
import { initContract } from './util/utils'

const history = createBrowserHistory()

window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
        <Router history={history}>
          <div className="web3bio-container">
            <Switch>
              <Route path="/" exact render={(props) => (
                <Home {...props} wallet={window.walletConnection} />
              )} />
              <Route path="/dashboard" exact render={(props) => (
                <Dashboard {...props} wallet={window.walletConnection} />
              )} />
              <Route path="/:owner.(near|testnet)" render={(props) => (
                <Profile {...props} wallet={window.walletConnection} />
              )} />
              <Route path="/:owner.bit" render={(props) => (
                <ProfileDAS {...props} />
              )} />
            </Switch>
            <Footer />
          </div>
        </Router>,
      document.querySelector('#root')
    )
  })
  .catch(console.error)
