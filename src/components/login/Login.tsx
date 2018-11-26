import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'

import { I18n } from 'react-redux-i18n'
import { IRootProps } from '../../statics/types'

interface ILoginProps extends IRootProps, RouteComponentProps<any> {

}

interface ILoginState {
  username: string
  password: string
  loading: boolean
}

class Login extends React.PureComponent<ILoginProps, ILoginState> {
  constructor(props : ILoginProps) {
    super(props)
    this.state = {
      username: '',
      password: '',
      loading: false,
    }
  }

  public render() {
    return (
      <div className="login-wrapper">
        <div className="login-floaty">
          <div className="title">{I18n.t('title')}</div>
          <div className="forms">
            -
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(connect(state => state)(Login))