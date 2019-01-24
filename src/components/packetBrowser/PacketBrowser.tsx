import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'
import ReactTable from 'react-table'
import { toast } from 'react-toastify'
import { Dispatch } from 'redux'

import ErrorComponent from '../html/errorComponent/ErrorComponent'

import { IPacketsResponse, IRootProps } from '../../statics/types'
import { getPackets } from '../../utils/rest'
import { setPackets } from '../app/actions'
import { clearAuth } from '../login/actions'

import 'react-table/react-table.css'
import './PacketBrowser.scss'

interface IPacketBrowserProps extends IRootProps, RouteComponentProps<any> {
  clearAuth: () => void
  setPackets: (packets: IPacketsResponse) => void
}

interface IPacketBrowserState {
  error: string
  loading: boolean
}

class PacketBrowser extends React.PureComponent<IPacketBrowserProps, IPacketBrowserState> {
  constructor(props : IPacketBrowserProps) {
    super(props)
    this.state = {
      error: '',
      loading: false
    }
  }

  public componentDidMount() {
    this.fetchPackets()
  }

  public render() {
    const data = this.props.app.packets || []
    return (
      <div className="packetBrowser">
        <ErrorComponent message={this.state.error ? I18n.t(`error.${this.state.error}`) : ''} onClick={() => this.setState({ error: '' })} />
        <div className="filters">
          <div className="title-bar">
            <h1>{I18n.t('packetBrowser.title')}</h1>
            <button className="refreshButton" onClick={() => this.fetchPackets()}>
              <i className={`fas fa-sync ${this.state.loading ? 'fa-spin' : ''}`}/>
            </button>
          </div>
        </div>
        <ReactTable 
          data={data}
          filterable
          defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
          columns={this.getTableColumns()}
          className="-striped"
          defaultPageSize={5}
        />
      </div>
    )
  }

  private getTableColumns () {
    return [
      {
        Header: I18n.t('packetBrowser.destIP'),
        accessor: 'DestinationIp',
      },
      {
        Header: I18n.t('packetBrowser.destMAC'),
        accessor: 'DestinationMacAddress',
      },
      {
        Header: I18n.t('packetBrowser.destPORT'),
        accessor: 'DestinationPort',
      },
      {
        Header: I18n.t('packetBrowser.dnsRequest'),
        accessor: 'DnsRequest',
        filterMethod: (filter : any, row : any) => {
          if (filter.value === 'all') {
            return true
          } else {
            return row[filter.id] === filter.value
          }
        },
        Filter: ({ filter, onChange } : { filter: any, onChange: any }) => {
          return (
            <select
              onChange={event => onChange(event.target.value)}
              style={{ width: '100%' }}
              value={filter ? filter.value : 'all'}
            >
              <option value="all">All</option>
              {this.props.app.packets && this.props.app.packets
                .map(item => item.DnsRequest)
                .filter((item, i, s) => s.lastIndexOf(item) === i)
                .map((v, i) => <option key={i} value={v || 'null'}>{v}</option>)
              }
            </select>
        )},
      },
      {
        Header: I18n.t('packetBrowser.ack'),
        accessor: 'HasAckFlag',
        Cell: (value : any) => {
          return <i className={`fas fa-${value.value ? 'check' : 'times'}`}/>
        },
        filterMethod: (filter : any, row : any) => {
          if (filter.value === 'true') {
            return row[filter.id] === true
          } else if (filter.value === 'false') {
            return row[filter.id] === false
          } else {
            return true
          }
        },
        Filter: ({ filter, onChange } : { filter: any, onChange: any }) => {
          return (
            <select
              onChange={event => onChange(event.target.value)}
              style={{ width: '100%' }}
              value={filter ? filter.value : 'all'}
            >
              <option value="all">All</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
        )},
        maxWidth: 75
      },
      {
        Header: I18n.t('packetBrowser.rst'),
        accessor: 'HasRstFlag',
        Cell: (value : any) => {
          return <i className={`fas fa-${value.value ? 'check' : 'times'}`}/>
        },
        filterMethod: (filter : any, row : any) => {
          if (filter.value === 'true') {
            return row[filter.id] === true
          } else if (filter.value === 'false') {
            return row[filter.id] === false
          } else {
            return true
          }
        },
        Filter: ({ filter, onChange } : { filter: any, onChange: any }) => {
          return (
            <select
              onChange={event => onChange(event.target.value)}
              style={{ width: '100%' }}
              value={filter ? filter.value : 'all'}
            >
              <option value="all">All</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
        )},
        maxWidth: 75
      },
      {
        Header: I18n.t('packetBrowser.syn'),
        accessor: 'HasSynFlag',
        Cell: (value : any) => {
          return <i className={`fas fa-${value.value ? 'check' : 'times'}`}/>
        },
        filterMethod: (filter : any, row : any) => {
          if (filter.value === 'true') {
            return row[filter.id] === true
          } else if (filter.value === 'false') {
            return row[filter.id] === false
          } else {
            return true
          }
        },
        Filter: ({ filter, onChange } : { filter: any, onChange: any }) => {
          return (
            <select
              onChange={event => onChange(event.target.value)}
              style={{ width: '100%' }}
              value={filter ? filter.value : 'all'}
            >
              <option value="all">All</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
        )},
        maxWidth: 75
      },
      {
        Header: I18n.t('packetBrowser.mainProtocol'),
        accessor: 'MainProtocol',
        filterMethod: (filter : any, row : any) => {
          if (filter.value === 'all') {
            return true
          } else {
            return row[filter.id] === filter.value
          }
        },
        Filter: ({ filter, onChange } : { filter: any, onChange: any }) => {
          return (
            <select
              onChange={event => onChange(event.target.value)}
              style={{ width: '100%' }}
              value={filter ? filter.value : 'all'}
            >
              <option value="all">All</option>
              <option value="ICMP">ICMP</option>
              <option value="TCP">TCP</option>
              <option value="UDP">UDP</option>
              <option value="Undefined">Undefined</option>
            </select>
        )},
      },
      {
        Header: I18n.t('packetBrowser.packetSize'),
        accessor: 'PacketSize',
      },
      {
        Header: I18n.t('packetBrowser.protocol'),
        accessor: 'Protocol',
        filterMethod: (filter : any, row : any) => {
          if (filter.value === 'all') {
            return true
          } else {
            return row[filter.id] === filter.value
          }
        },
        Filter: ({ filter, onChange } : { filter: any, onChange: any }) => {
          return (
            <select
              onChange={event => onChange(event.target.value)}
              style={{ width: '100%' }}
              value={filter ? filter.value : 'all'}
            >
              <option value="all">All</option>
              {this.props.app.packets && this.props.app.packets
                .map(item => item.Protocol)
                .filter((item, i, s) => s.lastIndexOf(item) === i)
                .map((v, i) => <option key={i} value={v || 'null'}>{v}</option>)
              }
            </select>
        )},
      },
      {
        Header: I18n.t('packetBrowser.reason'),
        accessor: 'Reason',
      },
      {
        Header: I18n.t('packetBrowser.risk'),
        accessor: 'Risk',
        filterMethod: (filter : any, row : any) => {
          if (filter.value === 'all') {
            return true
          } else {
            return row[filter.id] === filter.value
          }
        },
        Filter: ({ filter, onChange } : { filter: any, onChange: any }) => {
          return (
            <select
              onChange={event => onChange(event.target.value)}
              style={{ width: '100%' }}
              value={filter ? filter.value : 'all'}
            >
              <option value="all">All</option>
              <option value="Information">Information</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
        )},
      },
      {
        Header: I18n.t('packetBrowser.ruleApplied'),
        accessor: 'RuleApplied',
        Cell: (value : any) => {
          return <i className={`fas fa-${value.value ? 'check' : 'times'}`}/>
        },
        filterMethod: (filter : any, row : any) => {
          if (filter.value === 'true') {
            return row[filter.id] === true
          } else if (filter.value === 'false') {
            return row[filter.id] === false
          } else {
            return true
          }
        },
        Filter: ({ filter, onChange } : { filter: any, onChange: any }) => {
          return (
            <select
              onChange={event => onChange(event.target.value)}
              style={{ width: '100%' }}
              value={filter ? filter.value : 'all'}
            >
              <option value="all">All</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
        )},
      },
      {
        Header: I18n.t('packetBrowser.srcIP'),
        accessor: 'SourceIp',
      },
      {
        Header: I18n.t('packetBrowser.srcMAC'),
        accessor: 'SourceMacAddress',
      },
      {
        Header: I18n.t('packetBrowser.srcPORT'),
        accessor: 'SourcePort',
      },
    ]
  }

  /**
   * Fetch packets from the backend
   */
  private fetchPackets = async () => {
    if (this.props.login.auth.token) {
      try {
        this.setState({ loading: true, error: '' })
        const response = await getPackets(this.props.login.auth.token)
        
        if (response) {
          this.props.setPackets(response)
          this.setState({ loading: false })
        }
        
      } catch (error) {
        if (error.toString().indexOf('No data found') !== -1) {
          this.setState({ loading: false })
          toast.error(I18n.t('error.noPackets'), { position: toast.POSITION.BOTTOM_LEFT })
        } else {
          this.setState({ loading: false })
          toast.error(I18n.t('error.packetError'), { position: toast.POSITION.BOTTOM_LEFT })
        }
      }
    } else {
      this.props.clearAuth()
    }
  }
}

const mapStateToProps = (state : IRootProps, ownProps : {}) => state
const mapDispatchToProps = (dispatch : Dispatch) => {
  return {
    clearAuth : () => { dispatch(clearAuth()) },
    setPackets : (packets : IRootProps['app']['packets']) => { dispatch(setPackets(packets)) },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PacketBrowser))