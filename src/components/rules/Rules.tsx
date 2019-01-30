import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'
import ReactTable from 'react-table'
import { toast } from 'react-toastify'
import { Dispatch } from 'redux'

import ErrorComponent from '../html/errorComponent/ErrorComponent'
import InputComponent from '../html/inputComponent/InputComponent'

import { IRootProps, IRule } from '../../statics/types'
import { addRule, deleteRule, getRules } from '../../utils/rest'
import { setRules } from '../app/actions'
import { clearAuth } from '../login/actions'

import './Rules.scss'

interface IRulesProps extends IRootProps, RouteComponentProps<any> {
  clearAuth : () => void
  setRules : (rules : IRootProps['app']['rules']) => void
}

interface IRulesState {
  error: string
  loading: boolean
  
  DestIP: string[]
  DestPort: number[]
  RuleId: string | undefined
  Log: boolean | undefined
  MainProtocol: number | undefined
  Message: string
  Notify: boolean | undefined
  Protocol: number | undefined
  Risk: number | undefined
  SourceIp: string[]
  SourcePort: number[]
}

class Rules extends React.PureComponent<IRulesProps, IRulesState> {
  constructor(props : IRulesProps) {
    super(props)

    this.state = {
      error: '',
      loading: false,

      DestIP: [],
      DestPort: [],
      RuleId: undefined,
      Log: false,
      MainProtocol: undefined,
      Message: '',
      Notify: false,
      Protocol: undefined,
      Risk: 1,
      SourceIp: [],
      SourcePort: [],
    }
  }

  public render() {
    const ruleset = this.props.app.rules || []

    return (
      <div className="rules">
        <ErrorComponent message={this.state.error ? I18n.t(`error.${this.state.error}`) : ''} onClick={() => this.setState({ error: '' })} />
        <div className="title-bar">
          <h1>{I18n.t('rules.title')}</h1>
          <button className="refreshButton" onClick={() => this.fetchRules()}>
            <i className={`fas fa-sync ${this.state.loading ? 'fa-spin' : ''}`}/>
          </button>
        </div>
        <div className="add-rule">
          <div className="row">
            <h2>{I18n.t('rules.addRule')}</h2>
          </div>
          <div className="row toggleRow">
            <div className="select-wrap">
              <span>{I18n.t('rules.MainProtocol')}</span>
              <select
                onChange={(e) => this.handleMainProtocolChange(parseInt(e.target.value, 10))}
                value={this.state.MainProtocol}
                className="inputComponent field"
                placeholder={'MainProtocol'}
              >
                <option value={0}>{I18n.t('rules.IP')}</option>
                <option value={1}>{I18n.t('rules.ICMP')}</option>
                <option value={6}>{I18n.t('rules.TCP')}</option>
                <option value={17}>{I18n.t('rules.UDP')}</option>
              </select>
            </div>
            <div className="select-wrap">
              <span>{I18n.t('rules.Protocol')}</span>
              <select
                onChange={(e) => this.setState({ Protocol: parseInt(e.target.value, 10) })}
                value={this.state.Protocol}
                className="inputComponent field"
                placeholder={'Protocol'}
              >
                <option value={0}>{I18n.t('rules.Undefined')}</option>
                <option disabled={this.getIfProtocolIsDisabled(1)} value={1}>{I18n.t('rules.SSH')}</option>
                <option disabled={this.getIfProtocolIsDisabled(2)} value={2}>{I18n.t('rules.Telnet')}</option>
                <option disabled={this.getIfProtocolIsDisabled(3)} value={3}>{I18n.t('rules.Finger')}</option>
                <option disabled={this.getIfProtocolIsDisabled(4)} value={4}>{I18n.t('rules.TFTP')}</option>
                <option disabled={this.getIfProtocolIsDisabled(5)} value={5}>{I18n.t('rules.SNMP')}</option>
                <option disabled={this.getIfProtocolIsDisabled(6)} value={6}>{I18n.t('rules.FTP')}</option>
                <option disabled={this.getIfProtocolIsDisabled(7)} value={7}>{I18n.t('rules.SMB')}</option>
                <option disabled={this.getIfProtocolIsDisabled(8)} value={8}>{I18n.t('rules.ARP')}</option>
                <option disabled={this.getIfProtocolIsDisabled(9)} value={9}>{I18n.t('rules.DNS')}</option>
                <option disabled={this.getIfProtocolIsDisabled(10)} value={10}>{I18n.t('rules.LLC')}</option>
                <option disabled={this.getIfProtocolIsDisabled(11)} value={11}>{I18n.t('rules.STP')}</option>
                <option disabled={this.getIfProtocolIsDisabled(12)} value={12}>{I18n.t('rules.HTTP')}</option>
                <option disabled={this.getIfProtocolIsDisabled(13)} value={13}>{I18n.t('rules.TCP')}</option>
                <option disabled={this.getIfProtocolIsDisabled(14)} value={14}>{I18n.t('rules.NBNS')}</option>
                <option disabled={this.getIfProtocolIsDisabled(15)} value={15}>{I18n.t('rules.LLMNR')}</option>
                <option disabled={this.getIfProtocolIsDisabled(16)} value={16}>{I18n.t('rules.SSDP')}</option>
                <option disabled={this.getIfProtocolIsDisabled(17)} value={17}>{I18n.t('rules.ICMP')}</option>
                <option disabled={this.getIfProtocolIsDisabled(18)} value={18}>{I18n.t('rules.TLSV1')}</option>
                <option disabled={this.getIfProtocolIsDisabled(19)} value={19}>{I18n.t('rules.TLSV11')}</option>
                <option disabled={this.getIfProtocolIsDisabled(20)} value={20}>{I18n.t('rules.TLSV12')}</option>
                <option disabled={this.getIfProtocolIsDisabled(21)} value={21}>{I18n.t('rules.UDP')}</option>
              </select>
            </div>
            <div className="select-wrap">
              <span>{I18n.t('rules.Log')}</span>
              <select
                onChange={(e) => this.setState({ Log: e.target.value === 'true' ? true : false })}
                value={this.state.Log === true ? 'true' : 'false'}
                className="inputComponent field"
                placeholder={'Log'}
              >
                <option value={'true'}>{I18n.t('rules.true')}</option>
                <option value={'false'}>{I18n.t('rules.false')}</option>
              </select>
            </div>
            <div className="select-wrap">
              <span>{I18n.t('rules.Notify')}</span>
              <select
                onChange={(e) => this.setState({ Notify: e.target.value === 'true' ? true : false })}
                value={this.state.Notify === true ? 'true' : 'false'}
                className="inputComponent field"
                placeholder={'Notify'}
              >
                <option value={'true'}>{I18n.t('rules.true')}</option>
                <option value={'false'}>{I18n.t('rules.false')}</option>
              </select>
            </div>
          </div>

          <div className="row ipRow">
            <InputComponent 
              label={I18n.t('rules.sourceIP')}
              value={this.state.SourceIp[0]}
              type={'text'}
              onChange={(value) => this.setState({ SourceIp: [value] })}
            />
            <InputComponent 
              label={I18n.t('rules.sourcePORT')}
              value={this.state.SourcePort[0]}
              type={'number'}
              onChange={(value) => this.setState({ SourcePort: [parseInt(value, 10)] })}
              numberLimits={[0,65565]}
            />
            <i className="fas fa-arrow-right"/>
            <InputComponent 
              label={I18n.t('rules.destIP')}
              value={this.state.DestIP[0]}
              type={'text'}
              onChange={(value) => this.setState({ DestIP: [value] })}
            />
            <InputComponent 
              label={I18n.t('rules.destPort')}
              value={this.state.DestPort[0]}
              type={'number'}
              onChange={(value) => this.setState({ DestPort: [parseInt(value, 10)] })}
              numberLimits={[0,65565]}
            />
          </div>
          <div className="column">
            <InputComponent 
              label={I18n.t('rules.message')}
              value={this.state.Message}
              type={'text'}
              onChange={(value) => this.setState({ Message: value })}
            />
            <div className="allowed-vars column">
              <span>{I18n.t('rules.allowedVars')}</span>
              <span>{I18n.t('rules.vars')}</span>
            </div>
          </div>
          <div className="row">
            <InputComponent 
              label={I18n.t('rules.risk')}
              value={this.state.Risk || 1}
              type={'number'}
              onChange={(value) => this.setState({ Risk: parseInt(value, 10) })}
              numberLimits={[1,3]}
            />
          </div>

          <div className="column">
            <button className="button" onClick={() => this.addNewRule()}>
              <span>{I18n.t('rules.addRule')}</span>
            </button>        
          </div>
        </div>
        <div className="existing-rules">
          <ReactTable 
            data={ruleset}
            columns={this.getTableColumns()}
          />
        </div>
      </div>
    )
  }

  private async addNewRule() {
    if (this.props.login.auth.token 
      && (
        this.state.Protocol 
        && this.state.Protocol !== 0
        && this.state.MainProtocol 
        && this.state.Notify 
        && this.state.Log 
        && this.state.Message 
        && this.state.Risk
    )) {
      try {
        const rule : IRule = {
          MainProtocol: this.state.MainProtocol,
          Protocol: this.state.Protocol,
          DestIp: this.state.DestIP,
          DestPort: this.state.DestPort,
          SourceIp: this.state.SourceIp,
          SourcePort: this.state.SourcePort,
          Notify: this.state.Notify,
          Log: this.state.Log,
          Message: this.state.Message,
          Risk: this.state.Risk,
        }

        await addRule(this.props.login.auth.token, rule)
        await this.fetchRules()
        
      } catch (error) {
        toast.error(I18n.t('error.ruleAddError'), { position: toast.POSITION.BOTTOM_LEFT })
      }
    } else {
      this.setState({ error: 'Invalid rule' })
    }
  }

  /**
   * Fetch rules 
   */
  private fetchRules = async () => {
    if (this.props.login.auth.token) {
      try {
        this.setState({ error: '', loading: true })
        const response = await getRules(this.props.login.auth.token)
        if (response) {
          this.props.setRules(response)
          this.setState({ loading: false })
        } else {
          this.setState({ loading: false })
          toast.error(I18n.t('error.rulesError'), { position: toast.POSITION.BOTTOM_LEFT })
        }
        
      } catch (error) {
        this.setState({ loading: false })
        toast.error(I18n.t('error.rulesError'), { position: toast.POSITION.BOTTOM_LEFT })
      }
    } else {
      this.props.clearAuth()
    }
  }

  private deleteRule = async (rule: string) => {
    if (this.props.login.auth.token) {
      try {
        await deleteRule(this.props.login.auth.token, rule)
        this.fetchRules()
        toast.warn(I18n.t('notifications.ruleDeleted'), { position: toast.POSITION.BOTTOM_LEFT })
      } catch (error) {
        toast.error(I18n.t('error.ruleDeleteError'), { position: toast.POSITION.BOTTOM_LEFT })
      }
    }
  }

  private getTableColumns () {
    return [
      {
        Header: I18n.t('rules.destIP'),
        accessor: 'DestIp',
      },
      {
        Header: I18n.t('rules.destPort'),
        accessor: 'DestPort',
        maxWidth: 100,
      },
      {
        Header: I18n.t('rules.log'),
        accessor: 'Log',
        Cell: (value : any) => {
          return <i className={`fas fa-${value.value ? 'check' : 'times'}`}/>
        },
        maxWidth: 64,
      },
      {
        Header: I18n.t('rules.message'),
        accessor: 'Message',
      },
      {
        Header: I18n.t('rules.notify'),
        accessor: 'Notify',
        Cell: (value : any) => {
          return <i className={`fas fa-${value.value ? 'check' : 'times'}`}/>
        },
        maxWidth: 64,
      },
      {
        Header: I18n.t('rules.MainProtocol'),
        accessor: 'MainProtocol',
        maxWidth: 64,
        Cell: (value : any) => {
          return `${this.translateNumberToMainProtocol(value.value)}`
        },
      },
      {
        Header: I18n.t('rules.protocol'),
        accessor: 'Protocol',
        maxWidth: 64,
        Cell: (value : any) => {
          return `${this.translateNumberToProtocol(value.value)}`
        },
      },
      {
        Header: I18n.t('rules.risk'),
        accessor: 'Risk',
        maxWidth: 64,
      },
      {
        Header: I18n.t('rules.sourceIP'),
        accessor: 'SourceIp',
      },
      {
        Header: I18n.t('rules.sourcePort'),
        accessor: 'SourcePort',
        maxWidth: 64,
      },
      {
        Header: I18n.t('rules.delete'),
        Cell: (value: any) => {
          return (
            <button className="button red" onClick={() => this.deleteRule(value.original.Id)}>
              <i className="fas fa-times"/>{I18n.t('rules.deleteRule')}
            </button>
          )
        },
        minWidth: 210
      },
    ]
  }

  private translateNumberToMainProtocol = (protocol : number) => {
    const protocols = ['IP', 'ICMP', 'TCP', 'UDP']
    return protocols[protocol] || 'Unknown'
  }

  private translateNumberToProtocol = (protocol : number) => {
    const protocols = ['Undefined', 'SSH', 'Telnet', 'Finger', 'TFTP', 'SNMP', 'FTP', 'SMB', 'ARP', 'DNS', 'LLC', 'STP', 'HTTP', 'TCP', 'NBMS', 'LLMNR', 'SSDP', 'ICMP', 'TLSV1', 'TLSV11', 'TLSV12', 'UDP']
    return protocols[protocol] || 'Unknown'
  }

  private getIfProtocolIsDisabled = (protocol : number, mainProtocol? : number) : boolean =>  {
    const currentMainProtocol = mainProtocol || this.state.MainProtocol
    const convertedProtocol = this.translateNumberToProtocol(protocol)

    switch(currentMainProtocol) {
      case 0:
        const IPprotocols = ['STP', 'TCP', 'ICMP', 'UDP', 'ARP']
        return IPprotocols.filter(v => v === convertedProtocol).length === 0
      case 1:
        const ICMPprotocols : string[] = []
        return ICMPprotocols.filter(v => v === convertedProtocol).length === 0
      case 6:
        const TCPprotocols = ['SSH', 'Telnet', 'Finger', 'FTP', 'SMB', 'DNS', 'LLC', 'HTTP', 'NBNS', 'LLMNR', 'TLSV1', 'TLSV11', 'TLSV12']
        return TCPprotocols.filter(v => v === convertedProtocol).length === 0
      case 17:
        const UDPprotocols = ['TFTP', 'SNMP', 'DNS', 'NBNS', 'LLMNR', 'SSDP']
        return UDPprotocols.filter(v => v === convertedProtocol).length === 0
      default:
        return true
    }
  }

  private handleMainProtocolChange = (MainProtocol: number) => {
    const currentProtocol = this.state.Protocol || -1
    const isChangeAllowed = !this.getIfProtocolIsDisabled(currentProtocol, MainProtocol)

    if (isChangeAllowed) {
      this.setState({ MainProtocol })
    } else {
      this.setState({ MainProtocol, Protocol: 0 })
    }
  }
}

const mapStateToProps = (state : IRootProps, ownProps : {}) => state
const mapDispatchToProps = (dispatch : Dispatch) => {
  return {
    clearAuth : () => { dispatch(clearAuth()) },
    setRules : (rules : IRootProps['app']['rules']) => { dispatch(setRules(rules)) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Rules))