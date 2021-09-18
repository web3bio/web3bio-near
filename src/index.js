import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Switch, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import App from './App'
import './assets/scss/web3bio.scss'
import { initContract } from './util/utils'

const history = createBrowserHistory()

window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
      <Router history={history}>
        <App wallet={window.walletConnection} />
      </Router>,
      document.querySelector('#root')
    )
  })
  .catch(console.error)
