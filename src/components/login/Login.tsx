import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'

import InputComponent from '../html/inputComponent/InputComponent'

import { I18n } from 'react-redux-i18n'
import { IRootProps } from '../../statics/types'

import './Login.scss'

interface ILoginComponentProps extends IRootProps, RouteComponentProps<any> {
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
      error: ''
    }
  }

  public componentDidMount() {
    if (this.props.login.auth.token) {
      this.props.history.push(`/`)
    }
  }

  public render() {
    return (
      <div className="login-wrapper">
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
          />
        </div>
      </div>
    )
  }

  public handleUsernameTouch = () => {
    this.setState({ utouched: true })
  }

  public handlePasswordTouch = () => {
    this.setState({ ptouched: true })
  }
}

export default withRouter(connect(state => state)(Login))