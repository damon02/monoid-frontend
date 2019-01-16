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
            <button className={`linkbutton${location === '/statistics' ? ' active' : ''}`} onClick={() => this.handleRouting('/statistics')}>{I18n.t('header.statistics')}</button>
            <button className={`linkbutton${location === '/packets' ? ' active' : ''}`} onClick={() => this.handleRouting('/packets')}>{I18n.t('header.packets')}</button>
            <button className={`linkbutton${location === '/rules' ? ' active' : ''}`} onClick={() => this.handleRouting('/rules')}>{I18n.t('header.rules')}</button>
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