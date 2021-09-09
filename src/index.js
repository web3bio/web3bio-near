import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Switch, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import App from './App'
import Profile from './Profile'
import Dashboard from './Dashboard'
import './assets/scss/web3bio.scss'
import { initContract } from './util/utils'

const history = createBrowserHistory()

window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
      <Router history={history}>
        <Switch>
          <Route path="/" exact render={(props) => (
            <App {...props} wallet={window.walletConnection} contract={window.contract} />
          )} />
          <Route path="/dashboard" exact render={(props) => (
            <Dashboard {...props} wallet={window.walletConnection} contract={window.contract} />
          )} />
          <Route path="/:owner" render={(props) => (
            <Profile {...props} wallet={window.walletConnection} contract={window.contract} />
          )} />
        </Switch>
      </Router>,
      document.querySelector('#root')
    )
  })
  .catch(console.error)
