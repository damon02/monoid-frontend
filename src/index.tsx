import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { syncTranslationWithStore } from 'react-redux-i18n'
import { Route, RouteComponentProps, Switch } from 'react-router'
import { HashRouter } from 'react-router-dom'
import { AnyAction, createStore, Store } from 'redux'

import App from './components/app/App'
import Login from './components/login/Login'
import Register from './components/register/Register'

import { combinedReducers, initialState } from './statics/reducers'
import { IRootProps } from './statics/types'

import './fontawesome/css/fontawesome-all.css'
import './index.css'

const store : Store<IRootProps & RouteComponentProps<any>, AnyAction> = createStore(combinedReducers, initialState)
syncTranslationWithStore(store)

ReactDOM.render(
  <Provider store={store}>
    <HashRouter basename={'/'}>
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/" component={App} />
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
)