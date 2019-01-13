import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'
import { cloneDeep, isEqual } from 'lodash'

import ErrorComponent from '../html/errorComponent/ErrorComponent'
import InputComponent from '../html/inputComponent/InputComponent'

import { IRootProps, ISettingsResponse } from '../../statics/types'
import { setTheme, setSettings } from '../app/actions'
import { setAuth } from '../login/actions'
import { getToken, saveSettings } from '../../utils/rest'

import './Settings.scss'

interface ISettingsState {
  error: string
  token: string
  safety: boolean
  loading: boolean

  enabledNotifications: boolean
  notificationRecipients: string[]
  hasChanged: boolean
}

interface ISettingsProps extends IRootProps, RouteComponentProps<any> {
  setTheme: (theme: string) => void
  setSettings: (settings: IRootProps['app']['settings']) => void
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
      hasChanged: false,
    }
  }

  public componentDidMount() {
    this.regenerateToken(false)
    
    // Initialize local settings values to be edited
    this.setState({
      enabledNotifications: this.props.app.settings.enabledNotifications,
      notificationRecipients: this.props.app.settings.notificationRecipients,
    })
  }

  public componentDidUpdate(prevProps : ISettingsProps, prevState : ISettingsState) {
    const localSettings = { 
      enabledNotifications: this.state.enabledNotifications, 
      notificationRecipients: this.state.notificationRecipients 
    }

    console.log(localSettings, this.props.app.settings, this.state.hasChanged)

    // Make sure that the save button only appears when the settings have been changed
    if (!isEqual(localSettings, this.props.app.settings)) {
      this.setState({ hasChanged: true })
    } else {
      this.setState({ hasChanged: false })
    }

    // If the overhead settings props change, apply the changes inside the component
    if (!isEqual(prevProps.app.settings, this.props.app.settings)) {
      this.setState({
        enabledNotifications: this.props.app.settings.enabledNotifications,
        notificationRecipients: this.props.app.settings.notificationRecipients,
        hasChanged: false
      })
    }
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
                value={this.state.token || ''}
                type={'text'}
                onChange={() => ({})}
              />
              <button className={`lockbutton ${this.state.safety ? 'locked' : 'unlocked'}`} onClick={() => this.toggleSafety()}>
                <i className={`fas fa-${this.state.safety ? 'lock' : 'lock-open'}`} />
              </button>
            </div>
          </div>
          {!this.state.safety && <div className="warning"><i className="fas fa-exclamation-triangle" />{I18n.t('settings.safetyToken')}</div>}
          {!this.state.safety && <button className="refreshbutton" onClick={() => this.regenerateToken(true)}>{I18n.t('settings.refresh')}</button>}
          
          <div className="dropdown-component">
            <div className="setting-label">{I18n.t('settings.enabledNotifications')}</div>
            <select 
              value={this.state.enabledNotifications.toString()} 
              onChange={(e) => this.setState({
                enabledNotifications: e.target.value === 'true' ? true : e.target.value === 'false' ? false : false
              })}
            >
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

                      this.setState({ notificationRecipients: recipients })
                    }} />
                    <button className="danger" onClick={() => this.deleteRecipient(i)}>
                      <i className="fas fa-times" />
                    </button>
                  </div>
                )}
              </div>
              <button className="button" onClick={() => this.addRecipient()}><span>{I18n.t('settings.addRecipient')}</span></button>
            </div>
          </div>

          {this.state.hasChanged &&
            <button className="saveButton" onClick={() => this.applySettings()}>
              <i className="fas fa-save"/>
              <span>{I18n.t('settings.saveChanges')}</span>
            </button>
          }
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

  /**
   * Regenerates a personal token to be used externally for the raspberry pi
   */
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
   * Add a recipient to the list of notificationrecipients
   */
  private addRecipient = () => {
    const recipients = cloneDeep(this.state.notificationRecipients)
    recipients.push('')

    this.setState({ notificationRecipients: recipients })
  }

  private deleteRecipient = (index: number) => {
    const recipients = cloneDeep(this.state.notificationRecipients)
    recipients.splice(index, 1)

    this.setState({ notificationRecipients: recipients })
  }

  /**
   * Saves the settings inside of the database
   * Also applies the settings to the overhead props
   */
  private applySettings = async () => {
    const settings : ISettingsResponse = {
      enabledNotifications: this.state.enabledNotifications,
      notificationRecipients: this.state.notificationRecipients
    }

    if (this.props.login.auth.token && settings) {
      this.setState({ error: '', loading: true })
      try {
        await saveSettings(this.props.login.auth.token, settings)
        this.props.setSettings(settings)

        this.setState({ loading: false })
      } catch (error) {
        this.setState({ error: error, loading: false })
        console.error(error)
      }
    } else {
      this.props.logout()
    }
  }
}

const mapStateToProps = (state: IRootProps, ownProps: {}) => state
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setTheme: (theme: string) => { dispatch(setTheme(theme)) },
    setSettings: (settings: IRootProps['app']['settings']) => { dispatch(setSettings(settings)) },
    logout: () => { dispatch(setAuth({ username: null, token: null, timestamp: null })) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings))