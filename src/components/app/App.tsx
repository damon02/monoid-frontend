import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import Header from '../header/Header'

import { IRootProps } from '../../statics/types'
import { clearAuth } from '../login/actions'
import './App.scss'

interface IAppProps extends IRootProps, RouteComponentProps<any> {
  clearAuth : () => void
}

interface IAppState {
  loading: boolean
}

class App extends React.PureComponent<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props)
    this.state = {
      loading: false
    }
  }

  public render() {
    if (!this.props.login.auth.token) {
      return <Redirect to={'login'} />
    }

    return (
      <div className="app">
        <Header />
        <div className="content">
          <h2>Hello</h2>
          <Switch>
            <Route path="/" />
          </Switch>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state : IRootProps, ownProps : {}) => state
const mapDispatchToProps = (dispatch : Dispatch) => {
  return {
    clearAuth : () => { dispatch(clearAuth()) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))