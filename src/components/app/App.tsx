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
import { setSettings } from './actions';
import { getSettings } from '../../utils/rest';
import ErrorComponent from '../html/errorComponent/ErrorComponent';

interface IAppProps extends IRootProps, RouteComponentProps<any> {
  clearAuth : () => void
  setSettings : (settings : IRootProps['app']['settings']) => void
}

interface IAppState {
  error: string,
  loading: boolean
}

class App extends React.PureComponent<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props)
    this.state = {
      error: '',
      loading: false,
    }
  }

  public componentDidMount() {
    if (this.props.login.auth.token) {
      this.fetchSettings()
    }
  }

  public render() {
    if (!this.props.login.auth.token) {
      return <Redirect to={'/login'} />
    }

    return (
      <div className={`app ${this.props.app.theme}`}>
        <Header />
        <ErrorComponent message={this.state.error}/>
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

  /**
   * Fetch user settings from the backend
   */
  private fetchSettings = async () => {
    if (this.props.login.auth.token) {
      try {
        this.setState({ error: '', loading: true })
        const response = await getSettings(this.props.login.auth.token)
        if (response) {
          this.props.setSettings(response)
        } else {
          this.setState({ error: 'getSettingsError', loading: false })
        }
      } catch (error) {
        if (error.message === '401') {
          this.props.clearAuth()
        } else {
          this.setState({ error: 'getSettingsError', loading: false })
        }
      }
    } else {
      this.props.clearAuth()
    }
  }
}

const mapStateToProps = (state : IRootProps, ownProps : {}) => state
const mapDispatchToProps = (dispatch : Dispatch) => {
  return {
    clearAuth : () => { dispatch(clearAuth()) },
    setSettings : (settings : IRootProps['app']['settings']) => { dispatch(setSettings(settings)) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))