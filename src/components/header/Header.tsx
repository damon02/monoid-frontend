import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { Dispatch } from 'redux'

import { IRootProps } from '../../statics/types'
import { clearAuth } from '../login/actions'

import './Header.scss'

interface IHeaderProps extends IRootProps {
  clearAuth: () => void
}

class Header extends React.PureComponent<IHeaderProps, {}> {
  constructor(props : IHeaderProps) {
    super(props)
  }

  public render() {
    return (
      <header className="header">
        <div className="logo">
          <div className="image"/>
          <div className="logotext">{I18n.t('title_short')}</div>
        </div>
        <div className="buttons">
          <button onClick={() => this.props.clearAuth()}>
            <span className="text"><i className="fas fa-sign-out-alt"/></span>
          </button>
        </div>
      </header>
    )
  }
}

const mapStateToProps = (state : IRootProps, ownProps : {}) => state
const mapDispatchToProps = (dispatch : Dispatch) => {
  return {
    clearAuth : () => { dispatch(clearAuth()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)