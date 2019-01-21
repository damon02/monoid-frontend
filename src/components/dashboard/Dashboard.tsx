import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

// import BarChartComponent from './graphs/bar/BarChartComponent'
// import PieChartComponent from './graphs/pie/PieChartComponent'
// import TableComponent from './graphs/table/TableComponent'

import { IRootProps } from '../../statics/types'
import { getCounters } from '../../utils/rest'

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

  public componentDidMount() {
    this.getAllCounters()
  }

  public render() {  
    return (
      <div className={'dashboard-wrapper'}>
        <div className="left">
          <div className="chart number">
            <div className="inner">
              <h1>0</h1>
            </div>
            <span className="title">{I18n.t('dashboard.graphs.uniqueDestinationIP')}</span>
          </div>
          <div className="chart number">
            <div className="inner">
              <h1>1</h1>
            </div>
            <span className="title">{I18n.t('dashboard.graphs.dataLength')}</span>
          </div>
          <div className="chart number">
            <div className="inner">
              <h1>2</h1>
            </div>
            <span className="title">{I18n.t('dashboard.graphs.uniqueDestinationMAC')}</span>
          </div>
        </div>

      </div>
    )
  }

  private getAllCounters = async () => {
    if (this.props.login.auth.token) {
      try {
        const counters = await getCounters(this.props.login.auth.token)

        console.log(counters)
      } catch (error) {
        console.error(error)
      }
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