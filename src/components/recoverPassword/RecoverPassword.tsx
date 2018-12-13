import { cloneDeep } from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'

import ErrorComponent from '../html/errorComponent/ErrorComponent'
import InputComponent from '../html/inputComponent/InputComponent'

import { IRootProps } from '../../statics/types'
import { requestPasswordRecoveryEmail } from '../../utils/rest'

import './RecoverPassword.scss'

interface IRecoverPasswordToken {
  token: string
}
interface IRecoverPasswordProps extends IRootProps, RouteComponentProps<IRecoverPasswordToken> {}
interface IRecoverPasswordState {
  email: string
  token: string
  loading: boolean
  error: string
  success: string
  password: string
  password2: string
  validation: {
    uppercase: boolean
    lowercase: boolean
    digits: boolean
    symbols: boolean
    len: boolean
  }
}

class RecoverPassword extends React.PureComponent<IRecoverPasswordProps, IRecoverPasswordState> {
  private minLength = 10

  constructor(props: IRecoverPasswordProps) {
    super(props)

    this.state = {
      email: '',
      token: '',
      loading: false,
      error: '',
      success: '',
      password: '',
      password2: '',
      validation: {
        uppercase: false,
        lowercase: false,
        digits: false,
        symbols: false,
        len: false
      }
    }
  }

  public render() {
    return (
      <div className="recover-password">
        <div className={`back-wrap${this.state.loading ? ' loading' : ''}`}>
          <div className="background-img"/>
        </div>
        <ErrorComponent 
          message={this.state.error ? I18n.t(`error.${this.state.error}`) : ''}
          faIcon={'fas fa-times'}
          onClick={() => this.setState({ error: '' })}
        />
        <div className="floaty">
          {!this.props.match.params.token && !this.state.success &&
            <React.Fragment>
              <h1>{I18n.t('recover.sendMail')}</h1>
              <InputComponent
                label={I18n.t('recover.email')}
                type={'email'}
                value={this.state.email}
                onChange={(email) => this.setState({ email })}
                isValid={this.state.error !== 'emailInvalid' || this.state.email.length !== 0}
              />
              <button className="button" onClick={() => this.handleRegistration()}>
                <span className="text">{I18n.t('recover.send')}</span>
              </button>
            </React.Fragment>
          }
          {!this.props.match.params.token && this.state.success === 'mailSuccess' &&
            <React.Fragment>
              <h1>{I18n.t('recover.mailSuccess')}</h1>
              <p>{I18n.t('recover.checkMail')}</p>
            </React.Fragment>
          }
          {this.props.match.params.token && !this.state.success &&
            <React.Fragment>
              <InputComponent
                label={I18n.t('register.password')}
                type={'password'}
                value={this.state.password}
                onChange={(password) => this.onPasswordChange(password)}
              />
              <InputComponent
                label={I18n.t('register.repeatpassword')}
                type={'password'}
                value={this.state.password2}
                onChange={(password2) => this.setState({ password2 })}
              />

              <button className="button" onClick={() => this.handlePasswordChange()}>
                <span className="text">
                  {this.state.loading 
                      ? <i className="fas fa-circle-notch"/>
                      : I18n.t('register.submit')
                  }
                </span>
              </button>
              <div className="validation" key={2}>
                <div className={`validate-object ${this.state.validation.uppercase ? 'valid' : 'invalid'}`}>
                  <i className={`${this.state.validation.uppercase ? 'far fa-check-circle' : 'far fa-circle'}`} />
                  <div className="message">{I18n.t('register.uppercase')}</div>
                </div>
                <div className={`validate-object ${this.state.validation.lowercase ? 'valid' : 'invalid'}`}>
                  <i className={`${this.state.validation.lowercase ? 'far fa-check-circle' : 'far fa-circle'}`} />
                  <div className="message">{I18n.t('register.lowercase')}</div>
                </div>
                <div className={`validate-object ${this.state.validation.digits ? 'valid' : 'invalid'}`}>
                  <i className={`${this.state.validation.digits ? 'far fa-check-circle' : 'far fa-circle'}`} />
                  <div className="message">{I18n.t('register.digits')}</div>
                </div>
                <div className={`validate-object ${this.state.validation.symbols ? 'valid' : 'invalid'}`}>
                  <i className={`${this.state.validation.symbols ? 'far fa-check-circle' : 'far fa-circle'}`} />
                  <div className="message">{I18n.t('register.symbols')}</div>
                </div>
                <div className={`validate-object ${this.state.validation.len ? 'valid' : 'invalid'}`}>
                  <i className={`${this.state.validation.len ? 'far fa-check-circle' : 'far fa-circle'}`} />
                  <div className="message">{I18n.t('register.length')}</div>
                </div>
              </div>
            </React.Fragment>
          }
          {this.state.success === 'resetSuccess' && this.props.match.params.token &&
            <React.Fragment>
              <h1>{I18n.t('recover.mailSuccess')}</h1>
              <p>{I18n.t('recover.checkMail')}</p>
            </React.Fragment>
          }
          <button className="hyperlink" onClick={() => this.props.history.push(`/login`)}>{I18n.t('recover.backToLogin')}</button>
        </div>
      </div>
    )
  }

  /**
   * Sends out an email to the email inputted for password recovery
   */
  private handleRegistration = async () => {
    const email = cloneDeep(this.state.email)
    if (email) {
      try {
        // Send recovery request
        this.setState({ error: '', success: '' })
        const response = await requestPasswordRecoveryEmail(email)
        console.log(response)

        if (response.success) {
          this.setState({ success: 'mailSuccess' })
        } else {
          this.setState({ error: 'mailError' })
        }

      } catch (err) {
        console.error(err)
        this.setState({ error: 'mailError' })
      }
    } else {
      this.setState({ error: 'localMailError' })
    }
  }

  private handlePasswordChange = async () => {
    const password = this.state.password
    const password2 = this.state.password2

    if (password === password2) {
      try {
        this.setState({ error: '', success: '', loading: true })



        this.setState({ error: '', success: 'resetSuccess', loading: false })        
      } catch (error) {
        console.error(error)
        this.setState({ loading: false, error: 'resetError' })
      }
    } else {
      this.setState({ error: 'passMatch' })
    }
  }
  
  private onPasswordChange = (password : string) => {
    const validation = this.getPasswordStrength(password)
    this.setState({ password, validation })
  }

  private getPasswordStrength = (password: string) : IRecoverPasswordState['validation'] => {
    return {
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digits: /[0-9]/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password),
      len: password.length >= this.minLength,
    }
  }
}

export default withRouter(connect(s => s)(RecoverPassword))