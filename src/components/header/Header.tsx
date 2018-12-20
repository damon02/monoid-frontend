import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import { IRootProps } from '../../statics/types'
import { clearAuth } from '../login/actions'

import './Header.scss'

interface IHeaderProps extends IRootProps, RouteComponentProps<any> {
  clearAuth: () => void
}

class Header extends React.PureComponent<IHeaderProps, {}> {
  constructor(props : IHeaderProps) {
    super(props)
  }

  public render() {
    const location = this.props.location.pathname

    return (
      <header className="header">
        <div className="top">
          <div className="logo">
            <div className="image"/>
            <div className="logotext">{I18n.t('title_short')}</div>
          </div>
          <div className="right">
            <div className="whois">{this.props.login.auth.username}</div>
            <div className="buttons">
              <button className={`alt${location === '/settings' ? ' active' : ''}`} onClick={() => this.handleRouting('/settings')}>
                <span className="text"><i className="fas fa-cog"/></span>
              </button>
              <button className="alt" onClick={() => this.props.clearAuth()}>
                <span className="text"><i className="fas fa-sign-out-alt"/></span>
              </button>
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="links">
            <button className={`linkbutton${location === '/' ? ' active' : ''}`} onClick={() => this.handleRouting('/')}>{I18n.t('header.home')}</button>
            <button className={`linkbutton${location === '/daily' ? ' active' : ''}`} onClick={() => this.handleRouting('/daily')}>{I18n.t('header.daily')}</button>
            <button className={`linkbutton${location === '/udp' ? ' active' : ''}`} onClick={() => this.handleRouting('/udp')}>{I18n.t('header.udp')}</button>
            <button className={`linkbutton${location === '/tcp' ? ' active' : ''}`} onClick={() => this.handleRouting('/tcp')}>{I18n.t('header.tcp')}</button>
            <button className={`linkbutton${location === '/uip' ? ' active' : ''}`} onClick={() => this.handleRouting('/uip')}>{I18n.t('header.uip')}</button>
          </div>
        </div>
      </header>
    )
  }

  private handleRouting = (url : string) => {
    if (this.props.location.pathname !== url) {
      this.props.history.push(url)
    }
  }
}

const mapStateToProps = (state : IRootProps, ownProps : {}) => state
const mapDispatchToProps = (dispatch : Dispatch) => {
  return {
    clearAuth : () => { dispatch(clearAuth()) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))