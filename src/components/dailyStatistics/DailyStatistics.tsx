import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'

import { IRootProps } from '../../statics/types'

import './DailyStatistics.scss'

interface IDailyStatisticsProps extends IRootProps, RouteComponentProps<any> {

}

interface IDailyStatisticsState {
  loading: boolean
}

class DailyStatistics extends React.PureComponent<IDailyStatisticsProps, IDailyStatisticsState> {
  constructor(props: IDailyStatisticsProps) {
    super(props)

    this.state = {
      loading: false
    }
  }

  public render() {
    return (
      <h1>Daily statistics</h1>
    )
  }
}

export default withRouter(connect(s => s)(DailyStatistics))