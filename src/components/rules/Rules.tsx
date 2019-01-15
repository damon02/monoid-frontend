import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import { I18n } from 'react-redux-i18n'
import ReactTable from 'react-table'
import { IRootProps, IRule } from '../../statics/types'

import InputComponent from '../html/inputComponent/InputComponent'

import { addRule } from '../../utils/rest'
import ErrorComponent from '../html/errorComponent/ErrorComponent'
import './Rules.scss'

interface IRulesProps extends IRootProps, RouteComponentProps<any> {

}

interface IRulesState {
  error: string
  
  DestIP: string[]
  DestPort: number[]
  RuleId: string | undefined
  Log: boolean | undefined
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

      DestIP: [],
      DestPort: [],
      RuleId: undefined,
      Log: false,
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
        <ErrorComponent message={this.state.error} onClick={() => this.setState({ error: '' })} />
        <h1>{I18n.t('rules.title')}</h1>
        <div className="add-rule">
          <div className="row">
            <h2>{I18n.t('rules.addRule')}</h2>
          </div>
          <div className="row">
            <select
              onChange={(e) => this.setState({ Protocol: parseInt(e.target.value, 10) })}
              value={this.state.Protocol}
              className="inputComponent field"
              placeholder={'Protocol'}
            >
              <option value={0}>{I18n.t('rules.Undefined')}</option>
              <option value={1}>{I18n.t('rules.ICMP')}</option>
              <option value={6}>{I18n.t('rules.TCP')}</option>
              <option value={17}>{I18n.t('rules.UDP')}</option>
            </select>
            <select
              onChange={(e) => this.setState({ Log: e.target.value === 'true' ? true : false })}
              value={this.state.Log === true ? 'true' : 'false'}
              className="inputComponent field"
              placeholder={'Log'}
            >
              <option value={'true'}>{I18n.t('rules.true')}</option>
              <option value={'false'}>{I18n.t('rules.false')}</option>
            </select>
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

          <div className="row">
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
    if (this.props.login.auth.token && (this.state.Protocol && this.state.Notify && this.state.Log && this.state.Message && this.state.Risk)) {
      try {
        const rule : IRule = {
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
        
      } catch (error) {
        console.error(error)
      }
    } else {
      console.log(this.state.Protocol, this.state.Notify, this.state.Log, this.state.Message, this.state.Risk)
      this.setState({ error: 'Invalid rule' })
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
      },
      {
        Header: I18n.t('rules.log'),
        accessor: 'Log',
        Cell: (value : any) => {
          return <i className={`fas fa-${value.value ? 'check' : 'times'}`}/>
        },
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
      },
      {
        Header: I18n.t('rules.protocol'),
        accessor: 'Protocol',
      },
      {
        Header: I18n.t('rules.risk'),
        accessor: 'Risk',
      },
      {
        Header: I18n.t('rules.sourceIP'),
        accessor: 'SourceIp',
      },
      {
        Header: I18n.t('rules.sourcePort'),
        accessor: 'SourcePort',
      },
    ]
  }
}

export default connect(s => s)(Rules)