import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import ErrorComponent from '../html/errorComponent/ErrorComponent'
import InputComponent from '../html/inputComponent/InputComponent'

import { IRootProps } from '../../statics/types'
import { setTheme } from '../app/actions'

import { getToken } from '../../utils/rest'
import './Settings.scss'

interface ISettingsState {
  error: string
  token: string
  safety: boolean
}

interface ISettingsProps extends IRootProps, RouteComponentProps<any> {
  setTheme: (theme : string) => void
}

class Settings extends React.PureComponent<ISettingsProps, ISettingsState> {
  constructor(props: ISettingsProps) {
    super(props)

    this.state = {
      error: '',
      token: '',
      safety: true
    }
  }

  public componentDidMount() {
    this.regenerateToken(false)
  }

  public render() {
    return (
      <div className="settings">
        <h1>{I18n.t('settings.title')}</h1>
        <ErrorComponent 
          message={this.state.error ? I18n.t(`error.${this.state.error}`) : ''}
          faIcon={'fas fa-times'}
          onClick={() => this.setState({ error: '' })}
        />
        <div className="options">
          <div className="dropdown-component">
            <div className="setting-label">{I18n.t('settings.theme')}</div>
            <select value={this.props.app.theme} onChange={(e) => this.props.setTheme(e.target.value)}>
              <option value="light">{I18n.t('settings.light')}</option>
              <option value="dark">{I18n.t('settings.dark')}</option>
            </select>
          </div>
          <div className="refreshToken">
            <div className="setting-label">{I18n.t('settings.refreshToken')}</div>
            <div className="frame">
              <InputComponent 
                label={I18n.t('settings.refreshToken')} 
                disabled={this.state.safety} 
                value={this.state.token} 
                type={'text'}
                onChange={() => ({})}
              />
              <button className={`lockbutton ${this.state.safety ? 'locked' : 'unlocked'}`} onClick={() => this.toggleSafety()}>
                <i className={`fas fa-${this.state.safety ? 'lock' : 'lock-open'}`}/>
              </button>
            </div>
          </div>
          {!this.state.safety && <div className="warning"><i className="fas fa-exclamation-triangle"/>{I18n.t('settings.safetyToken')}</div>}
          {!this.state.safety && <button className="refreshbutton" onClick={() => this.regenerateToken(true)}>{I18n.t('settings.refresh')}</button>}
        </div>
      </div>
    )
  }

  /**
   * Toggles a safety switch to refresh a token
   */
  private toggleSafety = () => {
    this.setState({ safety: !this.state.safety })
  }

  private regenerateToken = async (refresh: boolean) => {
    if (this.props.login.auth.token) {
      try {
        this.setState({ error: '', token: '' })
        const response = await getToken(this.props.login.auth.token, refresh)
        
        if (response) {
          this.setState({ token: response.token })
        } else {
          this.setState({ error: 'tokenFetchError' })
        }
      } catch (error) {
        console.error(error)
        this.setState({ error: 'tokenFetchError' })
      }
    }
  }
}

const mapStateToProps = (state : IRootProps, ownProps : {}) => state
const mapDispatchToProps = (dispatch : Dispatch) => {
  return {
    setTheme : (theme : string) => { dispatch(setTheme(theme)) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings))