import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import DailyStatistics from '../dailyStatistics/DailyStatistics'
import Dashboard from '../dashboard/Dashboard'
import Header from '../header/Header'
import ErrorComponent from '../html/errorComponent/ErrorComponent'
import IPStatistics from '../ipStatistics/IPStatistics'
import PacketBrowser from '../packetBrowser/PacketBrowser'
import Settings from '../settings/Settings'
import TCP from '../tcp/TCP'
import UDP from '../udp/UDP'

import { IRootProps } from '../../statics/types'
import { getPackets, getRules, getSettings } from '../../utils/rest'
import { clearAuth } from '../login/actions'
import { setPackets, setRules, setSettings } from './actions'
import './App.scss'

interface IAppProps extends IRootProps, RouteComponentProps<any> {
  clearAuth : () => void
  setSettings : (settings : IRootProps['app']['settings']) => void
  setRules : (rules : IRootProps['app']['rules']) => void
  setPackets : (packets: IRootProps['app']['packets']) => void
}

interface IAppState {
  error: string,
  loading: boolean
  initialized: boolean
}

class App extends React.PureComponent<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props)
    this.state = {
      error: '',
      loading: false,
      initialized: false,
    }
  }

  public async componentDidMount() {
    if (this.props.login.auth.token) {
      await this.fetchSettings()
      await this.handleRules()
      await this.handlePackets()
    }
  }

  public render() {
    if (!this.props.login.auth.token) {
      return <Redirect to={'/login'} />
    }

    if (!this.state.initialized && (this.props.app.rules === null || this.props.app.packets === null)) {
      return (
        <div className="loadingScreen">
          <i className="fas fa-sync fa-spin"/>
          <h2>{I18n.t('loading')}</h2>
        </div>
      )
    }

    return (
      <div className={`app ${this.props.app.theme}`}>
        <Header />
        <ErrorComponent message={this.state.error} onClick={() => this.setState({ error: '' })}/>
        <div className="content">
          <Switch>
            <Route path="/settings" component={Settings} />
            <Route path="/daily" component={DailyStatistics} />
            <Route path="/udp" component={UDP} />
            <Route path="/tcp" component={TCP} />
            <Route path="/uip" component={IPStatistics} />
            <Route path="/packets" component={PacketBrowser} />
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

  /**
   * Fetch packets from the backend
   */
  private handlePackets = async () => {
    if (this.props.login.auth.token) {
      try {
        this.setState({ loading: true, error: '' })
        const response = await getPackets(this.props.login.auth.token)
        
        if (response) {
          this.props.setPackets(response)
          this.setState({ loading: false, initialized: true })
        } else {
          this.setState({ loading: false, error: 'packetError', initialized: true })
          throw new Error('No data packets found')
        }
        
      } catch (error) {
        this.setState({ loading: false, error: 'packetError', initialized: true })
        console.error()
      }
    } else {
      this.props.clearAuth()
    }
  }

  /**
   * Fetch rules 
   */
  private handleRules = async () => {
    if (this.props.login.auth.token) {
      try {
        this.setState({ loading: true, error: '' })
        const response = await getRules(this.props.login.auth.token)
        this.setState({ loading: false })
        if (response) {
          this.props.setRules(response)
        } else {
          this.setState({error: 'rulesError'})
        }
        
      } catch (error) {
        this.setState({ loading: false, error: 'rulesError' })
        console.error()
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
    setSettings : (settings : IRootProps['app']['settings']) => { dispatch(setSettings(settings)) },
    setPackets : (packets : IRootProps['app']['packets']) => { dispatch(setPackets(packets)) },
    setRules : (rules : IRootProps['app']['rules']) => { dispatch(setRules(rules)) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))