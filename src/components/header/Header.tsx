import { cloneDeep } from 'lodash'
import * as React from 'react'
import DatePicker from 'react-datepicker'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'
import moment from 'moment'

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
            <div className="prefixDatePickers">
              <button className="prefixButton" onClick={() => this.handlePrefixDate('hour')}>{I18n.t('header.hour')}</button>
              <button className="prefixButton" onClick={() => this.handlePrefixDate('day')}>{I18n.t('header.day')}</button>
              <button className="prefixButton" onClick={() => this.handlePrefixDate('week')}>{I18n.t('header.week')}</button>
            </div>
            <div className="datepickers">
              <div className="item">  
                <span className="text">{I18n.t('from')}</span>
                <DatePicker
                  selected={this.props.app.times.startDate}
                  onChange={(d) => this.handleDateChange('start', d)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={10}
                  dateFormat="MMMM d, yyyy HH:mm"
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
                  timeIntervals={10}
                  minDate={new Date(this.props.app.times.startDate)}
                  maxDate={new Date()}
                  dateFormat="MMMM d, yyyy HH:mm"
                  timeCaption="time"
                />
              </div>
            </div>
            <div className="userThings">
              <div className="whois">{this.props.login.auth.username}</div>
              <div className="buttons">
                <button className={`alt${location === '/notifications' ? ' active' : ''}`} onClick={() => this.handleRouting('/notifications')}>
                  <span className="text"><i className="fas fa-bell"/></span>
                </button>
                <button className={`alt${location === '/settings' ? ' active' : ''}`} onClick={() => this.handleRouting('/settings')}>
                  <span className="text"><i className="fas fa-cog"/></span>
                </button>
                <button className="alt" onClick={() => this.props.clearAuth()}>
                  <span className="text"><i className="fas fa-sign-out-alt"/></span>
                </button>
              </div>
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
    const dates = this.props.app.times
    if (type === 'start') {
      dates.startDate = cloneDeep(time) || new Date(0)
    } else {
      dates.endDate = cloneDeep(time) || new Date()
    }
    this.props.setTimes(dates)

  }

  private handlePrefixDate = (type : 'hour' | 'day' | 'week') => {
    switch(type) {
      case 'hour':{
        this.props.setTimes({
          startDate: new Date(moment().subtract(1, 'hour').unix() * 1000),
          endDate: new Date()
        })
        break
      }

      case 'day':
        this.props.setTimes({
          startDate: new Date(moment().subtract(1, 'day').unix() * 1000),
          endDate: new Date()
        })
        break

      case 'week':
        this.props.setTimes({
          startDate: new Date(moment().subtract(1, 'week').unix() * 1000),
          endDate: new Date()
        })
        break
      default:
        break
    }
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