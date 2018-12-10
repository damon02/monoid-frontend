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
              <button className="alt" onClick={() => this.handleRouting('/settings')}>
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
            <button className={`linkbutton${location === '/terminal' ? ' active' : ''}`} onClick={() => this.handleRouting('/terminal')}>{I18n.t('header.terminal')}</button>
            <button className={`linkbutton${location === '/link1' ? ' active' : ''}`} onClick={() => this.handleRouting('/link1')}>{I18n.t('header.link1')}</button>
            <button className={`linkbutton${location === '/link2' ? ' active' : ''}`} onClick={() => this.handleRouting('/link2')}>{I18n.t('header.link2')}</button>
            <button className={`linkbutton${location === '/link3' ? ' active' : ''}`} onClick={() => this.handleRouting('/link3')}>{I18n.t('header.link3')}</button>
            <button className={`linkbutton${location === '/link4' ? ' active' : ''}`} onClick={() => this.handleRouting('/link4')}>{I18n.t('header.link4')}</button>
            <button className={`linkbutton${location === '/link5' ? ' active' : ''}`} onClick={() => this.handleRouting('/link5')}>{I18n.t('header.link5')}</button>
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