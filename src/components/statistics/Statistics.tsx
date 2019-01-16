import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'

import { IRootProps } from '../../statics/types'

import './Statistics.scss'

interface IStatisticsProps extends IRootProps, RouteComponentProps<any> {

}

interface IStatisticsState {
  loading: boolean
  error: string
}

class Statistics extends React.PureComponent<IStatisticsProps, IStatisticsState> {
  constructor(props: IStatisticsProps) {
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
      <h1>Statistics</h1>
    )
  }
}

export default withRouter(connect(s => s)(Statistics))