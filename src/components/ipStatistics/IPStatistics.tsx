import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'

import { IRootProps } from '../../statics/types'

import './IPStatistics.scss'

interface IIPStatisticsProps extends IRootProps, RouteComponentProps<any> {

}

interface IIPStatisticsState {
  loading: boolean
}

class IPStatistics extends React.PureComponent<IIPStatisticsProps, IIPStatisticsState> {
  constructor(props: IIPStatisticsProps) {
    super(props)

    this.state = {
      loading: false
    }
  }

  public render() {
    return (
      <h1>IP statistics</h1>
    )
  }
}

export default withRouter(connect(s => s)(IPStatistics))