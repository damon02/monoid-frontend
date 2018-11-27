import { cloneDeep } from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'

import { I18n } from 'react-redux-i18n'
import { IRootProps } from '../../statics/types'

import './Login.scss'

interface ILoginProps extends IRootProps, RouteComponentProps<any> {

}

interface ILoginState {
  username: string
  password: string
  loading: boolean
  history: IHistoryItem[]
  inputValue: string
  loginStep: 0 | 1 | 2
}

interface IHistoryItem {
  isCommand: boolean
  prefix: string
  value: string
}

class Login extends React.PureComponent<ILoginProps, ILoginState> {
  public me: string

  constructor(props : ILoginProps) {
    super(props)
    this.state = {
      username: '',
      password: '',
      loading: false,
      history: [],
      inputValue: '',
      loginStep: 0,
    }
    this.me = `null@${I18n.t('code')}`
  }

  public render() {
    return (
      <div className="terminal dark">
        {this.state.history.map((item, key) => this.renderHistory(item, key))}
        {this.state.loginStep === 0 
          ? <form onSubmit={(e) => this.handleSubmit(e)}>
            <span>{this.me}:~$ </span>
            <input
              value={this.state.inputValue}
              className="terminal-input"
              autoComplete="off"
              onChange={(e) => this.setState({ inputValue: e.target.value })}
            />
          </form>
          : this.state.loginStep === 1 
            ? <form onSubmit={() => this.handleLoginStep()}>
              <span>Username: </span>
              <input
                value={this.state.username}
                className="terminal-input"
                autoComplete="off"
                onChange={(e) => this.setState({ username: e.target.value })}
              />
            </form>
            : <form onSubmit={() => this.handleLoginStep()}>
            <span>Password: </span>
            <input
              value={this.state.password}
              className="terminal-input"
              autoComplete="off"
              type={'password'}
              onChange={(e) => this.setState({ password: e.target.value })}
            />
          </form>
        }

      </div>
    )
  }

  public handleLoginStep = () => {
    const history = cloneDeep(this.state.history)
    const isPassword = this.state.loginStep === 2
    const value = isPassword
      ? new Array(this.state.password.length + 1).join('•')
      : this.state.username

    history.push({
      isCommand: false,
      prefix: '',
      value: `${isPassword ? 'Password: ' : 'Username: '}${value}`
    })
    
    if (value.length >= 1) {
      this.setState({ loginStep: isPassword ? 0 : 2, history })    
      if (isPassword) {
        this.handleLogin()
      }
    } else {
      this.setState({ history })
    }
  }

  public handleLogin = async () => {
    try {
      const x = await fetch(``)
      const history = cloneDeep(this.state.history)
      history.push({
        isCommand: false,
        prefix: '',
        value: `${x.status} ${x.statusText}`
      })
      
      this.setState({ history, username: '', password: '' })
    } catch (error) {
      const history = cloneDeep(this.state.history)
      history.push({
        isCommand: false,
        prefix: '',
        value: `${error}`
      })

      this.setState({ history, username: '', password: '' })
      console.error(error)
    }
  }

  public renderHistory (item : IHistoryItem, key : number) {
    const prefix = item.isCommand
      ? <span className="prefix">{item.prefix}:~$ </span>
      : undefined
    return <div key={key}>{prefix}{item.value}</div>
  }

  public handleSubmit = (event : React.FormEvent) => {
    event.preventDefault()

    const input = event.target[0].value
    const newState = this.handleCommand(input, this.state)

    this.setState(newState)
  } 

  public handleCommand = (command : string, state: ILoginState) : ILoginState => {
    const commandList = ['login', 'clear', 'help'].sort()

    const ns = cloneDeep(state)
    const user = cloneDeep(this.me)
    ns.history.push({ isCommand: true, prefix: user, value: command })
    ns.inputValue = ''

    switch(command) {
      case 'clear':
        ns.history = []
        break

      case 'sudo su': {
        this.me = `root@${I18n.t('code')}`
        break
      }

      case 'help': {
        ns.history.push({
          isCommand: false,
          prefix: '',
          value: commandList.join(' ')
        })
        break
      }

      case 'login': {
        ns.loginStep = 1
        break
      }

      case '': {
        break
      }

      default: {
        ns.history.push({ isCommand: false, prefix: user, value: `-bash: ${command}: command not found`})
      }
    }


    return ns
  }
}

export default withRouter(connect(state => state)(Login))