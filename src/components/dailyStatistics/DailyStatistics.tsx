import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'

import { IRootProps } from '../../statics/types'

import './DailyStatistics.scss'

interface IDailyStatisticsProps extends IRootProps, RouteComponentProps<any> {

}

interface IDailyStatisticsState {
  loading: boolean
  error: string
}

class DailyStatistics extends React.PureComponent<IDailyStatisticsProps, IDailyStatisticsState> {
  constructor(props: IDailyStatisticsProps) {
    super(props)

    this.state = {
      loading: false,
      error: ''
    }
  }
  
  public render() {
    const data = this.props.app.packets
    if (data === null) {
      return <h2>{I18n.t('noData')}</h2>
    }
    
    return (
      <h1>Daily statistics</h1>
    )
  }
}

export default withRouter(connect(s => s)(DailyStatistics))