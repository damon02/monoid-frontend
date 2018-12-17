import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'

import { IRootProps } from '../../statics/types'
import { activateAccountFirstTime } from '../../utils/rest'
import './ActivateAccount.scss'

interface IActivateAccountParams { token: string }
interface IActivateAccountState {
  loading: boolean
  error: string
  success: string
}

interface IActivateAccountProps extends IRootProps, RouteComponentProps<IActivateAccountParams> {

}

class ActivateAccount extends React.PureComponent<IActivateAccountProps, IActivateAccountState> {
  constructor(props : IActivateAccountProps) {
    super(props)

    this.state = {
      loading: false,
      error: '',
      success: ''
    }
  }

  public componentDidMount() {
    if (this.props.match.params.token) {
      this.activateAccount(this.props.match.params.token)
    } else {
      this.props.history.push('/')
    }
  }

  public render() {
    const statusString = I18n.t(this.state.success 
      ? 'activateAccount.activated'
      : this.state.error
        ? 'activateAccount.failedToActivate'
        : 'activateAccount.activating'
    )
    
    return (
      <div className="activate-account">
        <div className={`back-wrap${this.state.loading ? ' loading' : ''}`}>
          <div className="background-img"/>
        </div>
        <div className="floaty">
          <h1>{I18n.t('activateAccount.title')}</h1>
          <div className="status">{statusString}</div>
          {!this.state.error && <div className={`icon ${this.state.success ? 'success' : 'unknown'}`}>
            <i className={`fas fa-${this.state.success ? 'check' : 'circle-notch fa-spin'}`}/>
          </div>}
          {this.state.success && <button className="hyperlink" onClick={() => this.props.history.push(`/login`)}>{I18n.t('recover.backToLogin')}</button>}
        </div>
      </div>
    )
  }
  

  private activateAccount = async (token : string) => {
    try {
      this.setState({ loading: true, error: '', success: '' })
      const activationResponse = await activateAccountFirstTime(token)
      console.log(activationResponse)

      this.setState({ loading: false, success: 'accountActivated' })
    } catch (error) {
      this.setState({ loading: false, error: 'activationError' })
      console.error(error)
    }

  }
}

export default withRouter(connect(s => s)(ActivateAccount))