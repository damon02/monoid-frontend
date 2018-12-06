import { values } from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'

import ErrorComponent from '../html/errorComponent/ErrorComponent'
import InputComponent from '../html/inputComponent/InputComponent'

import { IRootProps } from '../../statics/types'
import { registerUser } from '../../utils/rest'
import './Register.scss'

interface IRegisterProps extends IRootProps, RouteComponentProps<any> {

}

interface IRegisterState {
  username: string
  email: string
  password: string
  password2: string
  error: string
  loading: boolean
  success: boolean
  validation: {
    uppercase: boolean
    lowercase: boolean
    digits: boolean
    symbols: boolean
    len: boolean
  }
}

class Register extends React.PureComponent<IRegisterProps, IRegisterState> {
  private minLength = 10
  
  constructor(props : IRegisterProps) {
    super(props)
    this.state = {
      username: '',
      email: '',
      password: '',
      password2: '',
      error: '',
      loading: false,
      success: false,
      validation: {
        uppercase: false,
        lowercase: false,
        digits: false,
        symbols: false,
        len: false
      }
    }
  }
  
  public componentDidMount() {
    if (this.props.login.auth.token) {
      this.props.history.push(`/`)
    }
  }

  public render () {
    return (
      <div className="register-wrapper">
        <div className="back-wrap">
          <div className="background-img"/>
        </div>
        <ErrorComponent 
          message={this.state.error ? I18n.t(`error.${this.state.error}`) : ''}
          faIcon={'fas fa-times'}
          onClick={() => this.setState({ error: '' })}
        />
        {this.state.success
          ? <div className="register-floaty">
            <h2>{I18n.t('register.success')}</h2>
            <button className="button" onClick={() => this.props.history.push('/login')}>
              <span className="text">
                {I18n.t('register.backLogin')}
              </span>
            </button>
          </div>
          : [<div className="register-floaty" key={1}>
          <h1>{I18n.t('register.title')}</h1>
          <button className="hyperlink" onClick={() => this.props.history.push('/login')}>{I18n.t('register.backLogin')}</button>
          <InputComponent
            label={I18n.t('register.username')}
            type={'email'}
            value={this.state.username}
            onChange={(username) => this.setState({ username })}
            isValid={this.state.username.length !== 0}
          />
          <InputComponent
            label={I18n.t('register.email')}
            type={'email'}
            value={this.state.email}
            onChange={(email) => this.setState({ email })}
            isValid={this.state.error !== 'emailInvalid' || this.state.email.length !== 0}
          />
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

          <button className="button" onClick={() => this.handleRegistration()}>
            <span className="text">
              {this.state.loading 
                  ? <i className="fas fa-circle-notch"/>
                  : I18n.t('register.submit')
              }
            </span>
          </button>
        </div>,
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
        </div>]
        }
        <div className="monoid-logo"/>
      </div>
    )
  }

  private onPasswordChange = (password : string) => {
    const validation = this.getPasswordStrength(password)
    this.setState({ password, validation })
  }

  private getPasswordStrength = (password: string) : IRegisterState['validation'] => {
    return {
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digits: /[0-9]/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password),
      len: password.length >= this.minLength,
    }
  }

  private handleRegistration = async () => {
    const username = this.state.username
    const email = this.state.email
    const password = this.state.password
    const repeatedPassword = this.state.password2

    const validated = values(this.state.validation).filter(x => x === false)
    console.log(validated)

    if (this.state.username.length === 0) {
      this.setState({ error: 'emailInvalid' })
    } else if (validated.length >= 1) {
      this.setState({ error: 'passNotStrong' })
    } else if (password !== repeatedPassword) {
      this.setState({ error: 'passMatch' })
    } else {
      // SUCCESS HANDLING
      try {
        this.setState({ loading: true, error: '' })
        // TODO: registration handling
        // 1. POST to API with username, pass
        // 2. Retrieve 200 OK
        // 3. Set success to true
        // 4. Let user redirect itself to login

        const response = await registerUser(username, email, password) 
        console.log(response)

        this.setState({ loading: false, error: '', success: true })
      } catch (error) {
        console.error(error)
        this.setState({ loading: false, error: 'registrationFail' })
      }
    }
  }
}

export default withRouter(connect(state => state)(Register))