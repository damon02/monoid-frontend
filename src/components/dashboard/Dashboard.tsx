import { countBy } from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import BarChartComponent from './graphs/bar/BarChartComponent'
// import PieChartComponent from './graphs/pie/PieChartComponent'
import TableComponent from './graphs/table/TableComponent'

import { I18n } from 'react-redux-i18n'
import { IGraphComponentData, IRootProps } from '../../statics/types'
import './Dashboard.scss'

interface IDashboardComponentProps extends IRootProps, RouteComponentProps<any> {
}

interface IDashboardState {
  loading: boolean
}

class Dashboard extends React.PureComponent<IDashboardComponentProps, IDashboardState> {
  constructor(props : IDashboardComponentProps) {
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

    const uniqueDestinationIP = countBy(data.map(p => p.DestinationIp))
    const uniqueDestinations = Object.keys(uniqueDestinationIP).sort().map(key => ({ IP: key, amount: uniqueDestinationIP[key] }))
    const uniqueDestinationMAC = countBy(data.map(p => p.DestinationMacAddress))
    const uniqueMACDestinations = Object.keys(uniqueDestinationMAC).sort().map(key => ({ MAC: key, amount: uniqueDestinationMAC[key] }))
  
    return (
      <div className={'dashboard-wrapper'}>
        <div className="left">
          <div className="chart number">
            <div className="inner">
              <h1>{uniqueDestinations.length}</h1>
            </div>
            <span className="title">{I18n.t('dashboard.graphs.uniqueDestinationIP')}</span>
          </div>
          <div className="chart number">
            <div className="inner">
              <h1>{data.length}</h1>
            </div>
            <span className="title">{I18n.t('dashboard.graphs.dataLength')}</span>
          </div>
          <div className="chart number">
            <div className="inner">
              <h1>{uniqueMACDestinations.length}</h1>
            </div>
            <span className="title">{I18n.t('dashboard.graphs.uniqueDestinationMAC')}</span>
          </div>
        </div>
        <div className="chart">
          <span className="title">{I18n.t('dashboard.graphs.uniqueDestinationIPamount')}</span>
          <div className="inner">
            <BarChartComponent dataSet={this.getUniqueDestinationIP()} xkey={'amount'} responsive={{ width: '100%', height: 320 }} />
            <TableComponent dataSet={this.getUniqueDestinationIP()} rows={[{ key: 'IP', txt: 'IP Address' }, { key: 'amount', txt: 'Amount of packets'}]} showHeader direction={'vertical'} />
          </div>
        </div>
      </div>
    )
  }

  private getUniqueDestinationIP = () : IGraphComponentData[] => {
    if (this.props.app.packets) {
      const uniqueIPDict = countBy(this.props.app.packets.map(p => p.DestinationIp))
      const uniqueArray = Object.keys(uniqueIPDict).sort().map(key => ({ IP: key, amount: uniqueIPDict[key] }))
      
      return [
        {
          color: '#FF0000',
          dataKey: 'amount',
          nameKey: 'IP',
          data: uniqueArray,
          label: true
        }
      ]
    } else {
      return []
    }
  }
}

const mapStateToProps = (state : IRootProps, ownProps : {}) => state
const mapDispatchToProps = (dispatch : Dispatch) => {
  return {
    clearAuth : () => { console.log('hello world') }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))