import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'

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

  render() {
    return (
      <div className="login-wrapper">
        hello world pls Login
        <button>xd</button>
      </div>
    )
  }
}

export default withRouter(connect(state => state)(Login))