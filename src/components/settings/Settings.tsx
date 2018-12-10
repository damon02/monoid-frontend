import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import { IRootProps } from '../../statics/types'
import { setTheme } from '../app/actions'

import '../html/dropdownComponent/DropdownComponent.scss'

interface ISettingsProps extends IRootProps, RouteComponentProps<any> {
  setTheme: (theme : string) => void
}

class Settings extends React.PureComponent<ISettingsProps, {}> {
  constructor(props: ISettingsProps) {
    super(props)
  }

  public render() {
    return (
      <div className="settings">
        <h1>{I18n.t('settings.title')}</h1>
        <div className="options">
          <div className="dropdown-component">
            <div className="label">{I18n.t('settings.theme')}</div>
            <select value={this.props.app.theme} onChange={(e) => this.props.setTheme(e.target.value)}>
              <option value="light">{I18n.t('settings.light')}</option>
              <option value="dark">{I18n.t('settings.dark')}</option>
              <option value="lsd">{I18n.t('settings.lsd')}</option>
            </select>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state : IRootProps, ownProps : {}) => state
const mapDispatchToProps = (dispatch : Dispatch) => {
  return {
    setTheme : (theme : string) => { dispatch(setTheme(theme)) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings))