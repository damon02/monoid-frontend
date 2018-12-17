import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import PieChartComponent, { IPieComponentData } from './graphs/pie/PieChartComponent'

import { IRootProps } from '../../statics/types'
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
            <PieChartComponent dataSet={this.getDataSet()} responsive={{ width: 200, height: '100%' }} />
          </div>
        </div>
      </div>
    )
  }

  private getDataSet = () : IPieComponentData[] => {
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