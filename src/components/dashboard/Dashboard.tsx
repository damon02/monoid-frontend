// import { isEqual } from 'lodash'
import moment from 'moment'
import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Dispatch } from 'redux'

// import BarChartComponent from './graphs/bar/BarChartComponent'
// import PieChartComponent from './graphs/pie/PieChartComponent'
// import TableComponent from './graphs/table/TableComponent'
import ErrorComponent from '../html/errorComponent/ErrorComponent'
import PieChartComponent from './graphs/pie/PieChartComponent'
import TableComponent from './graphs/table/TableComponent'

import { IGraphComponentData, IRootProps } from '../../statics/types'
import { getCounters, getPacketsOverTime } from '../../utils/rest'

import { keysrt } from '../../utils/general'
import './Dashboard.scss'

interface IDashboardComponentProps extends IRootProps, RouteComponentProps<any> {
}

interface IDashboardState {
  error: string
  loading: boolean
  counters: {
    LowRisks: null | number
    MediumRisks: null | number
    HighRisks: null | number
    CriticalRisks: null | number
    Packets: null | number
    Rules: null | number
    UniqueProtocols: null | number
  },
  lineGraphStuff: Array<{ DateTime: string, Count: number }>

  dateFetched: [number, number]
}

class Dashboard extends React.PureComponent<IDashboardComponentProps, IDashboardState> {
  constructor(props : IDashboardComponentProps) {
    super(props)

    this.state = { 
      error: '',
      loading: false,
      counters: {
        LowRisks: null,
        MediumRisks: null,
        HighRisks: null,
        CriticalRisks: null,
        Packets: null,
        Rules: null,
        UniqueProtocols: null,
      },
      lineGraphStuff: [],

      dateFetched: [0,0]
    }
  }

  public async componentDidMount() {
    await this.getAllCounters()
    await this.getLineGraph()
  }
  
  public async componentDidUpdate(prevProps: IDashboardComponentProps) {
    if (this.state.dateFetched[0] !== 0 && this.state.dateFetched[1] !== 0) {
      // Has been fetched before
      // Check if the datetime in props is different than the state
      if (
        this.props.app.times.startDate.getTime() !== this.state.dateFetched[0]
        || this.props.app.times.endDate.getTime() !== this.state.dateFetched[1]
      ) {
        // Either starttime is different or enddate
        await this.getLineGraph()
      }
    }
  }

  public render() {  
    return (
      <React.Fragment>
        <ErrorComponent message={this.state.error} onClick={() => this.setState({ error: '' })} />
        <div className={'dashboard-wrapper'}>
          <div className="left">
            <div className="chart">
              <span className="title">{I18n.t('dashboard.graphs.risks')}</span>
              <div className="inner">
                <PieChartComponent dataSet={this.getRisksObjects()} responsive={{ width: 306, height: '100%' }} />
                <TableComponent dataSet={this.getRisksObjects()} rows={[{ key: 'risk', txt: 'Risk' }, { key: 'amount', txt: 'Amount'}]} showHeader direction={'vertical'} />
              </div>
            </div>
            <div className="chart number">
              <span className="title">{I18n.t('dashboard.graphs.uniqueProtocols')}</span>
              <div className="inner">
                <h1>{this.state.counters.UniqueProtocols || 0}</h1>
              </div>
            </div>
            <div className="chart number">
              <span className="title">{I18n.t('dashboard.graphs.packets')}</span>
              <div className="inner">
                <h1>{this.state.counters.Packets || 0}</h1>
              </div>
            </div>
            <div className="chart number">
              <span className="title">{I18n.t('dashboard.graphs.rulesAmount')}</span>
              <div className="inner">
                <h1>{this.state.counters.Rules || 0}</h1>
              </div>
            </div>
          </div>
          <div className="chart">
            <span className="title">{I18n.t('dashboard.graphs.packetsTime')}</span>
            <div className="inner">
              <ResponsiveContainer minHeight={200} minWidth={250} width={'100%'} height={600}>
                <LineChart data={this.state.lineGraphStuff}>
                  <XAxis dataKey={'DateTime'} tickFormatter={(ti) => moment(ti).format('DD-MM HH:mm')} />
                  <YAxis />
                  <Tooltip                   
                    labelFormatter={(date) => `${moment(date).format('DD MMMM YYYY HH:mm')} (${moment(date).fromNow()})`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Count" stroke="#8884d8" activeDot={{r: 8}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  private getLineGraph = async () => {
    if (this.props.login.auth.token) {
      try {
        this.setState({ loading: true })
        const lineGraphData = await getPacketsOverTime(
          this.props.login.auth.token, 
          moment(this.props.app.times.startDate.getTime()).toISOString(),
          moment(this.props.app.times.endDate.getTime()).toISOString(),
        )

        const unixData : Array<{ DateTime: number, Count: number }> = lineGraphData.map((obj : { DateTime: string, Count: number }) => (
          { DateTime: moment(obj.DateTime).unix() * 1000, Count: obj.Count }
        )).sort(keysrt('DateTime'))

        const fixedArray : any[] = []
        const coeff = 1000 * 60 * 10
        let tempTime : Date = new Date(Math.round(this.props.app.times.startDate.getTime() / coeff) * coeff)
        for (let index = 0; tempTime.getTime() < this.props.app.times.endDate.getTime(); index++) {
          const filtered = unixData.filter(x => x.DateTime === tempTime.getTime())

          if (filtered.length > 0) {
            fixedArray.push({ DateTime: tempTime.getTime(), Count: filtered[0].Count })
          } else {
            fixedArray.push({ DateTime: tempTime.getTime(), Count: 0 })
          }


          // Set the temptime to be 10min ahead
          tempTime = new Date(tempTime.getTime() + 600000)
        }


        this.setState({ lineGraphStuff: fixedArray, dateFetched: [this.props.app.times.startDate.getTime(), this.props.app.times.endDate.getTime()] })
      } catch (error) {
        console.error(error)
        this.setState({ error: 'lineGraphError' })
      }
    }
  }

  private getAllCounters = async () => {
    if (this.props.login.auth.token) {
      try {
        this.setState({ loading: true })
        const counters = await getCounters(this.props.login.auth.token)
        if (counters) {
          this.setState({ counters, loading: false })
        }
      } catch (error) {
        this.setState({ loading: false })
        console.error(error)
      }
    }
  }

  private getRisksObjects = () : IGraphComponentData[] => {
    const riskData = [
      { risk: 'Low', amount: this.state.counters.LowRisks },
      { risk: 'Medium', amount: this.state.counters.MediumRisks },
      { risk: 'High', amount: this.state.counters.HighRisks },
      { risk: 'Critical', amount: this.state.counters.CriticalRisks },
    ] 

    return [
      {
        color: '#32b4f1',
        dataKey: 'amount',
        nameKey: 'risk',
        data: riskData,
        label: true
      }
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