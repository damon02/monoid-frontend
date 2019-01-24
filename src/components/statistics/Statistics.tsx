import moment from 'moment'
import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'

import { IRootProps } from '../../statics/types'
import { getTrafficCountIP, getTrafficProtocol, getTrafficSizeIP, getTrafficTLS } from '../../utils/rest'

import { toast } from 'react-toastify'
import { invkeysrt, keysrt } from '../../utils/general'
import BarChartComponent from '../dashboard/graphs/bar/BarChartComponent'
import PieChartComponent from '../dashboard/graphs/pie/PieChartComponent'
import TableComponent from '../dashboard/graphs/table/TableComponent'
import './Statistics.scss'

interface IStatisticsProps extends IRootProps, RouteComponentProps<any> {

}

interface IStatisticsState {
  loading: boolean
  error: string
  dateFetched: [number, number]
  protocolCount: Array<{ Protocol: string, Count: number }>
  tlsCount: Array<{ TlsVersion: string, Count: number }>
  trafficCountIP: Array<{ UniqueIp: string, Count: number }>
  trafficSizeIP: any
}

class Statistics extends React.PureComponent<IStatisticsProps, IStatisticsState> {
  constructor(props: IStatisticsProps) {
    super(props)

    this.state = {
      loading: false,
      error: '',
      dateFetched: [0,0],
      protocolCount: [],
      tlsCount: [],
      trafficCountIP: [],
      trafficSizeIP: [],
    }
  }

  public async componentDidMount() {
    // Initializing data
    await this.fetchTrafficByProtocol()
    await this.fetchTrafficByTLSVersion()
    await this.fetchTrafficCountIP()
    await this.fetchTrafficSizeIP()

    this.setState({ dateFetched: [this.props.app.times.startDate.getTime(), this.props.app.times.endDate.getTime()] })
  }
  
  public async componentDidUpdate() {
    if (this.state.dateFetched[0] !== 0 && this.state.dateFetched[1] !== 0) {
      // Has been fetched before
      // Check if the datetime in props is different than the state
      if (
        this.props.app.times.startDate.getTime() !== this.state.dateFetched[0]
        || this.props.app.times.endDate.getTime() !== this.state.dateFetched[1]
      ) {
        // Either starttime is different or enddate
        toast.info(I18n.t('notifications.changeDate'), { position: toast.POSITION.BOTTOM_LEFT })
        this.setState({ dateFetched: [this.props.app.times.startDate.getTime(), this.props.app.times.endDate.getTime()] })
        await this.fetchTrafficByProtocol()
        await this.fetchTrafficByTLSVersion()
        await this.fetchTrafficCountIP()
        await this.fetchTrafficSizeIP()
      }
    }
  }
  
  public render() {   
    return (
      <div className="statistics">
        <div className="title-bar">
          <h1>Statistics</h1>
          <button className="refreshButton" onClick={() => this.componentDidMount()}>
            <i className={`fas fa-sync ${this.state.loading ? 'fa-spin' : ''}`}/>
          </button>
        </div>
        <div className="main">
          <div className="left">
            <div className="chart">
              <span className="title">{I18n.t('dashboard.graphs.protocolCounts')}</span>
              <div className="inner">
                {this.state.protocolCount.length === 0
                  ? <span>{I18n.t('noDataForDate')}</span>
                  : <React.Fragment>
                    <PieChartComponent dataSet={this.getProtocolCounts()} responsive={{ width: 306, height: '100%' }} />
                    <TableComponent dataSet={this.getProtocolCounts()} rows={[{ key: 'Protocol', txt: 'Protocol' }, { key: 'Count', txt: 'Count'}]} showHeader direction={'vertical'} />
                  </React.Fragment>
                }
              </div>
            </div>
            <div className="chart">
              <span className="title">{I18n.t('dashboard.graphs.tlsVersions')}</span>
              <div className="inner">
                {this.state.protocolCount.length === 0
                  ? <span>{I18n.t('noDataForDate')}</span>
                  : <React.Fragment>
                    <PieChartComponent dataSet={this.getTLSCounts()} responsive={{ width: 306, height: '100%' }} />
                    <TableComponent dataSet={this.getTLSCounts()} rows={[{ key: 'TlsVersion', txt: 'TLS Version' }, { key: 'Count', txt: 'Count'}]} showHeader direction={'vertical'} />
                  </React.Fragment>
                }
              </div>
            </div>
          </div>
          <div className="right">
            <div className="chart">
              <span className="title">{I18n.t('dashboard.graphs.trafficCountIP')}</span>
              <div className="inner">
                <BarChartComponent 
                  dataSet={this.getTrafficIPCounts()} 
                  xkey="UniqueIp" 
                  responsive={{ width: '100%', height: 320 }} 
                />
              </div>
            </div>
            <div className="chart">
              <span className="title">{I18n.t('dashboard.graphs.trafficSizeIP')}</span>
              <div className="inner">
                <BarChartComponent 
                  dataSet={this.getTrafficIPSizes()} 
                  valueFormatter={this.convertBytesToSize} 
                  xkey="UniqueIp" 
                  responsive={{ width: '100%', height: 400 }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  private getTrafficIPSizes = () => {
    const tlsData = this.state.trafficSizeIP
      .sort(invkeysrt('Size'))
      .map((obj : { UniqueIp : string, Size: number }) => {
        return { UniqueIp: obj.UniqueIp, Size: obj.Size }
      })

    return [
      {
        color: '#32b4f1',
        dataKey: 'Size',
        nameKey: 'UniqueIp',
        data: tlsData,
        label: true
      }
    ]
  }

  private convertBytesToSize = (bytes: number) => {
    if (bytes === 0) { return '0 Bytes' }

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  private fetchTrafficSizeIP = async () => {
    if (this.props.login.auth.token) {
      try {
        this.setState({ loading: true })
        const trafficSizeIP = await getTrafficSizeIP(
          this.props.login.auth.token,
          moment(this.props.app.times.startDate).toISOString(), 
          moment(this.props.app.times.endDate).toISOString()
        )

        if (trafficSizeIP) {
          this.setState({ loading: false, trafficSizeIP })
        } else {
          this.setState({ loading: false })
        }
        
      } catch (error) {
        this.setState({ loading: false })
        toast.error(I18n.t('error.trafficSizeError'), { position: toast.POSITION.BOTTOM_LEFT })
      }
    }
  }

  private getTrafficIPCounts = () => {
    const tlsData = this.state.trafficCountIP.sort(invkeysrt('Count'))

    return [
      {
        color: '#32b4f1',
        dataKey: 'Count',
        nameKey: 'UniqueIp',
        data: tlsData,
        label: true
      }
    ]
  }

  private fetchTrafficCountIP = async () => {
    if (this.props.login.auth.token) {
      try {
        this.setState({ loading: true })
        const trafficCountIP = await getTrafficCountIP(
          this.props.login.auth.token,
          moment(this.props.app.times.startDate).toISOString(), 
          moment(this.props.app.times.endDate).toISOString()
        )

        if (trafficCountIP) {
          this.setState({ loading: false, trafficCountIP })
        } else {
          this.setState({ loading: false })
        }
        
      } catch (error) {
        this.setState({ loading: false })
        toast.error(I18n.t('error.trafficCountError'), { position: toast.POSITION.BOTTOM_LEFT })
      }
    }
  }
  
  private getTLSCounts = () => {
    const tlsData = this.state.tlsCount.sort(keysrt('Count'))

    return [
      {
        color: '#32b4f1',
        dataKey: 'Count',
        nameKey: 'TlsVersion',
        data: tlsData,
        label: true
      }
    ]
  }

  private fetchTrafficByTLSVersion = async () => {
    if (this.props.login.auth.token) {
      try {
        this.setState({ loading: true })
        const tlscounts = await getTrafficTLS(
          this.props.login.auth.token,
          moment(this.props.app.times.startDate).toISOString(), 
          moment(this.props.app.times.endDate).toISOString()
        )

        if (tlscounts) {
          this.setState({ loading: false, tlsCount: tlscounts })
        } else {
          this.setState({ loading: false })
        }
      } catch (error) {
        this.setState({ loading: false })
        toast.error(I18n.t('error.tlsVersionCount'), { position: toast.POSITION.BOTTOM_LEFT })
      }
    }
  }

  private getProtocolCounts = () => {
    const protocolData = this.state.protocolCount.sort(keysrt('Count'))

    return [
      {
        color: '#32b4f1',
        dataKey: 'Count',
        nameKey: 'Protocol',
        data: protocolData,
        label: true
      }
    ]
  }

  private fetchTrafficByProtocol = async () => {
    if (this.props.login.auth.token) {
      try {
        this.setState({ loading: true })
        const protocols = await getTrafficProtocol(
          this.props.login.auth.token, 
          moment(this.props.app.times.startDate).toISOString(), 
          moment(this.props.app.times.endDate).toISOString()
        )

        if (protocols) {
          this.setState({ loading: false, protocolCount: protocols })
        } else {
          // EMPTY DATA
          this.setState({ loading: false })
        }
      } catch (error) {
        this.setState({ loading: false })
        toast.error(I18n.t('error.protocolCountError'), { position: toast.POSITION.BOTTOM_LEFT })
      }
    }
  }
}

export default withRouter(connect(s => s)(Statistics))