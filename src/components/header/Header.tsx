import * as React from 'react'
import DatePicker from 'react-datepicker'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import { IAppProps, IRootProps } from '../../statics/types'
import { setTimes } from '../app/actions'
import { clearAuth } from '../login/actions'

import 'react-datepicker/dist/react-datepicker.css'
import './Header.scss'

interface IHeaderProps extends IRootProps, RouteComponentProps<any> {
  clearAuth: () => void
  setTimes: (times: IAppProps['times']) => void
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
            <div className="datepickers">
              <div className="item">  
                <span className="text">{I18n.t('from')}</span>
                <DatePicker
                  selected={this.props.app.times.startDate}
                  onChange={(d) => this.handleDateChange('start', d)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy hh:mm"
                  timeCaption="time"
                  maxDate={this.props.app.times.endDate}
                />
              </div>
              <div className="between">
                <i className="fas fa-arrow-right"/>
              </div>
              <div className="item">
                <span className="text">{I18n.t('end')}</span>
                <DatePicker
                  selected={this.props.app.times.endDate}
                  onChange={(d) => this.handleDateChange('end', d)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  minDate={new Date(this.props.app.times.startDate)}
                  dateFormat="MMMM d, yyyy hh:mm"
                  timeCaption="time"
                />
              </div>
            </div>
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

  private handleDateChange = (type: 'start' | 'end', time: Date | null) => {
    console.log(time && time.getTime())
    const dates = this.props.app.times
    if (type === 'start') {
      dates.startDate = time || new Date(0)
    } else {
      dates.endDate = time || new Date
    }
    this.props.setTimes(dates)

  }
}

const mapStateToProps = (state : IRootProps, ownProps : {}) => state
const mapDispatchToProps = (dispatch : Dispatch) => {
  return {
    clearAuth : () => { dispatch(clearAuth()) },
    setTimes: (times : IAppProps['times']) => { dispatch(setTimes(times)) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))