import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import BarChartComponent from './graphs/bar/BarChartComponent'
import PieChartComponent from './graphs/pie/PieChartComponent'
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
    return (
      <div className={'dashboard-wrapper'}>
        <div className="chart tiny">
          <span className="title">{I18n.t('dashboard.graphs.httpMethods')}</span>
          <div className="inner">
            <PieChartComponent dataSet={this.getHTTPMethods()} responsive={{ width: 250, height: '100%' }} />
            <TableComponent dataSet={this.getHTTPMethods()} rows={[{ key: 'name', txt: 'Name' }, { key: 'value', txt: 'Value'}]} showHeader direction={'vertical'} />
          </div>
        </div>
        <div className="chart">
          <span className="title">{I18n.t('dashboard.graphs.uniqueIPAmount')}</span>
          <div className="inner">
            <BarChartComponent dataSet={this.getUniqueIP()} xkey={'name'} responsive={{ width: '100%', height: 320 }} />
            <TableComponent dataSet={this.getUniqueIP()} rows={[{ key: 'name', txt: 'Name' }, { key: 'value', txt: 'Value'}]} showHeader direction={'vertical'} />
          </div>
        </div>
      </div>
    )
  }

  private getHTTPMethods = () : IGraphComponentData[] => {
    return [
      {
        color: '#32b4f1',
        dataKey: 'value',
        nameKey: 'name',
        data: [{ name: 'POST', value: 78 }, { name: 'GET', value: 271 }],
        label: true
      }
    ]
  }

  private getUniqueIP = () : IGraphComponentData[] => {
    return [
      {
        color: '#FF0000',
        dataKey: 'value',
        nameKey: 'name',
        data: [{ name: '172.217.19.196', value: 201 }, { name: '140.82.118.4', value: 304 }, { name: '151.101.36.133', value: 97 }, { name: '217.121.244.1', value: 12 }],
        label: true
      },
    ]
  }
}

const mapStateToProps = (state : IRootProps, ownProps : {}) => state
const mapDispatchToProps = (dispatch : Dispatch) => {
  return {
    clearAuth : () => { console.log('hello world') }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))