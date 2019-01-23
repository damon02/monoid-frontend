import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import ErrorComponent from '../html/errorComponent/ErrorComponent'
import InputComponent from '../html/inputComponent/InputComponent'

import { IAuthObject, IRootProps } from '../../statics/types'
import { loginUser } from '../../utils/rest'
import { setAuth } from './actions'

import './Login.scss'

interface ILoginComponentProps extends IRootProps, RouteComponentProps<any> {
  setAuth: (auth: IAuthObject) => void
}

interface ILoginState {
  username: string
  utouched: boolean
  password: string
  ptouched: boolean
  loading: boolean
  error: string
}

class Login extends React.PureComponent<ILoginComponentProps, ILoginState> {
  constructor(props: ILoginComponentProps) {
    super(props)
    this.state = {
      username: '',
      utouched: false,
      password: '',
      ptouched: false,
      loading: false,
      error: '',
    }
  }

  public componentDidMount() {
    if (this.props.login.auth.token) {
      this.props.history.push(`/`)
    }
  }

  public componentDidUpdate() {
    if (this.props.login.auth.token) {
      this.props.history.push(`/`)
    }
  }

  public render() {
    return (
      <div className="login-wrapper">
        <div className={`back-wrap${this.state.loading ? ' loading' : ''}`}>
          <div className="background-img"/>
        </div>
        <ErrorComponent 
          message={this.state.error ? I18n.t(`error.${this.state.error}`) : ''}
          faIcon={'fas fa-times'}
          onClick={() => this.setState({ error: '' })}
        />
        <div className="login-floaty">
          <h1>{I18n.t('login.title')}</h1>
          <InputComponent 
            label={I18n.t('login.username')}
            type={'text'}
            value={this.state.username}
            onChange={(username : string) => this.setState({ username })}
            onFocus={() => this.handleUsernameTouch()}
            touched={this.state.utouched}
            autoComplete={'off'}
          />
          <InputComponent 
            label={I18n.t('login.password')}
            type={'password'}
            value={this.state.password}
            onChange={(password : string) => this.setState({ password })}
            onFocus={() => this.handlePasswordTouch()}
            touched={this.state.ptouched}
            autoComplete={'off'}
            onEnter={() => this.handleLogin()}
          />
          <div className="buttons">
            <button className="button" onClick={() => this.handleLogin()}>
              <span className="text">
                {this.state.loading 
                  ? <i className="fas fa-circle-notch fa-spin"/>
                  : I18n.t('login.submit')
                }
              </span>
            </button>
            <button className="button" onClick={() => this.props.history.push(`/register`)}>
              <span className="text">{I18n.t('login.register')}</span>
            </button>
          </div>
          <button className="hyperlink" onClick={() => this.props.history.push(`/recovery/`)}>{I18n.t('login.forgot')}</button>
          {/* {this.state.passwordForgot
            ? <div className="forgotpass">
              <InputComponent
                label={I18n.t('login.username')} 
                type={'email'}
                value={this.state.passwordForgotValue} 
              />
            </div>
            : null
          } */}
        </div>
        <div className="monoid-logo"/>
      </div>
    )
  }

  public handleUsernameTouch = () => {
    this.setState({ utouched: true })
  }

  public handlePasswordTouch = () => {
    this.setState({ ptouched: true })
  }

  public handleLogin = async () => {
    try {
      this.setState({ loading: true, error: '' })
      const response = await loginUser(this.state.username, this.state.password)
      this.setState({ loading: false })
      
      if (response) {      
        this.props.setAuth({ username: response.user.userName, token: response.user.token, timestamp: Date.now() })
      } else {
        this.setState({ error: 'loginError' })
        throw new Error('No data returned from backend')
      }
      
    } catch (error) {
      this.setState({ loading: false, error: 'loginError' })
      console.error(error)
    }
  }
}

const mapStateToProps = (state : IRootProps, ownProps : {}) => state
const mapDispatchToProps = (dispatch : Dispatch) => {
  return {
    setAuth : (auth : IAuthObject) => { dispatch(setAuth(auth)) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))