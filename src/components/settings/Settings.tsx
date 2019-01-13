import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import ErrorComponent from '../html/errorComponent/ErrorComponent'
import InputComponent from '../html/inputComponent/InputComponent'

import { IRootProps, ISettingsResponse } from '../../statics/types'
import { setTheme } from '../app/actions'
import { setAuth } from '../login/actions'

import { cloneDeep } from 'lodash'
import { getSettings, getToken, saveSettings } from '../../utils/rest'
import './Settings.scss'

interface ISettingsState {
  error: string
  token: string
  safety: boolean
  loading: boolean

  enabledNotifications: boolean
  notificationRecipients: string[]
  changedNR: boolean
}

interface ISettingsProps extends IRootProps, RouteComponentProps<any> {
  setTheme: (theme : string) => void
  logout: () => void
}

class Settings extends React.PureComponent<ISettingsProps, ISettingsState> {
  constructor(props: ISettingsProps) {
    super(props)

    this.state = {
      error: '',
      token: '',
      loading: true,
      safety: true,
      enabledNotifications: false,
      notificationRecipients: [],
      changedNR: false,
    }
  }

  public componentDidMount() {
    this.regenerateToken(false)
    this.fetchSettings()
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
          <div className="dropdown-component">
            <div className="setting-label">{I18n.t('settings.enabledNotifications')}</div>
            <select value={this.state.enabledNotifications.toString()} onChange={(e) => this.setNotifications(e.target.value)}>
              <option value="true">{I18n.t('settings.enabled')}</option>
              <option value="false">{I18n.t('settings.disabled')}</option>
            </select>
          </div>
          <div className="recipients">
            <div className="setting-label">{I18n.t('settings.recipients')}</div>
            <div className="list-thing">
              <div className="list">
                {this.state.notificationRecipients.map((v, i) => 
                  <div className="inputitem" key={i}>
                    <InputComponent label={''} value={v} type={'text'} onChange={(value) => {
                      const recipients = cloneDeep(this.state.notificationRecipients)
                      recipients[i] = value

                      this.setState({ notificationRecipients: recipients, changedNR: true })
                    }} />
                    <button className="danger" onClick={() => this.deleteRecipient(i)}>
                      <i className="fas fa-times"/>
                    </button>
                  </div>
                )}
              </div>
              <button className="button" onClick={() => this.addRecipient()}><span>{I18n.t('settings.addRecipient')}</span></button>
              {this.state.changedNR && <button className="button"><span>{I18n.t('settings.saveChanges')}</span></button>}
            </div>
          </div>
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
        if (error.message === '401') {
          this.props.logout()
        } else {
          this.setState({ error: 'tokenFetchError' })
        }
      }
    }
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
          this.setState({
            notificationRecipients: response.notificationRecipients, 
            enabledNotifications: response.enabledNotifications
          })
        } else {
          this.setState({ error: 'getSettingsError', loading: false })
        }
      } catch (error) {
        if (error.message === '401') {
          this.props.logout()
        } else {
          this.setState({ error: 'getSettingsError', loading: false })
        }
      }
    } else {
      this.props.logout()
    }
  }

  private setNotifications = async (value: string) => {
    const normalizedValue : boolean = value === 'true' ? true : value === 'false' ? false : false
    const settingsObject : ISettingsResponse = {
      notificationRecipients: this.state.notificationRecipients,
      enabledNotifications: normalizedValue
    }

    this.applySettings(settingsObject)
  }

  // private setNotificationRecipients = async (value: string[]) => {
  //   const settingsObject : ISettingsResponse = {
  //     notificationRecipients: value,
  //     enabledNotifications: this.state.enabledNotifications
  //   }

  //   this.applySettings(settingsObject)
  // }

  /**
   * Add a recipient to the list of notificationrecipients
   */
  private addRecipient = () => {
    const recipients = cloneDeep(this.state.notificationRecipients)
    recipients.push('')

    this.setState({ notificationRecipients: recipients, changedNR: true })
  }

  private deleteRecipient = (index: number) => {
    const recipients = cloneDeep(this.state.notificationRecipients)
    recipients.splice(index, 1)

    this.setState({ notificationRecipients: recipients, changedNR: true })
  }

  private applySettings = async (settings: ISettingsResponse) => {
    if (this.props.login.auth.token) {
      try {
        const response = await saveSettings(this.props.login.auth.token, settings)
        console.log(response)

        this.saveSettingsInState(settings)

      } catch (error) {
        console.error(error)
      }
    } else {
      this.props.logout()
    }
  }

  private saveSettingsInState = (settings : ISettingsResponse) => {
    if (settings) {
      this.setState({
        notificationRecipients: settings.notificationRecipients, 
        enabledNotifications: settings.enabledNotifications
      })
    }
  }
}

const mapStateToProps = (state : IRootProps, ownProps : {}) => state
const mapDispatchToProps = (dispatch : Dispatch) => {
  return {
    setTheme : (theme : string) => { dispatch(setTheme(theme)) },
    logout : () => { dispatch(setAuth({ username: null, token: null, timestamp: null })) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings))