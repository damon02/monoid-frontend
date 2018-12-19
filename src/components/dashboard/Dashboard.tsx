import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import BarChartComponent from './graphs/bar/BarChartComponent'
import PieChartComponent from './graphs/pie/PieChartComponent'
import TableComponent from './graphs/table/TableComponent'

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
        <div className="chart">
          <span className="title">Aantal debielen per capita</span>
          <div className="inner">
            <PieChartComponent dataSet={this.getDataSet()} responsive={{ width: '100%', height: 320 }} />
            <TableComponent dataSet={this.getDataSet()} rows={[{ key: 'name', txt: 'Name' }, { key: 'value', txt: 'Value'}]} showHeader direction={'vertical'} />
          </div>
        </div>
        <div className="chart">
          <span className="title">Aantal debielen per capita</span>
          <div className="inner">
            <BarChartComponent dataSet={this.getDataSet()} xkey={'name'} responsive={{ width: '100%', height: 320 }} />
            <TableComponent dataSet={this.getDataSet()} rows={[{ key: 'name', txt: 'Name' }, { key: 'value', txt: 'Value'}]} showHeader direction={'vertical'} />
          </div>
        </div>
      </div>
    )
  }

  private getDataSet = () : IGraphComponentData[] => {
    return [
      {
        color: '#FF0000',
        dataKey: 'value',
        nameKey: 'dingen',
        data: [{ name: 'ABC', value: 300 }, { name: 'DEF', value: 100 }, { name: 'GHI', value: 300 }],
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