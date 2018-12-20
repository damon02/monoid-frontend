import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import DailyStatistics from '../dailyStatistics/DailyStatistics'
import Dashboard from '../dashboard/Dashboard'
import Header from '../header/Header'
import Settings from '../settings/Settings'
import TCP from '../tcp/TCP'
import UDP from '../udp/UDP'

import { IRootProps } from '../../statics/types'
import IPStatistics from '../ipStatistics/IPStatistics'
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
      return <Redirect to={'/login'} />
    }

    return (
      <div className={`app ${this.props.app.theme}`}>
        <Header />
        <div className="content">
          <Switch>
            <Route path="/settings" component={Settings} />
            <Route path="/daily" component={DailyStatistics} />
            <Route path="/udp" component={UDP} />
            <Route path="/tcp" component={TCP} />
            <Route path="/uip" component={IPStatistics} />
            <Route exact path="/" component={Dashboard} />
            <Redirect to="/" />
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