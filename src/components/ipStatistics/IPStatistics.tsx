import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'

import { IRootProps } from '../../statics/types'

import { I18n } from 'react-redux-i18n'
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
    const data = this.props.app.packets
    if (data === null) {
      return <h2>{I18n.t('noData')}</h2>
    }
    
    return (
      <h1>IP statistics</h1>
    )
  }
}

export default withRouter(connect(s => s)(IPStatistics))