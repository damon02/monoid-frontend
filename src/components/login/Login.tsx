import { cloneDeep, get } from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'

import { IRootProps } from '../../statics/types'
import Directories from './directories'

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
  directories: []
  activeDir: string[]
}

interface IHistoryItem {
  isCommand: boolean
  user: string
  dir: string
  value: string
}

class Login extends React.PureComponent<ILoginProps, ILoginState> {
  public me: string
  public myInp: React.RefObject<HTMLInputElement>

  constructor(props : ILoginProps) {
    super(props)
    this.state = {
      username: '',
      password: '',
      loading: false,
      history: [],
      inputValue: '',
      loginStep: 0,
      directories: Directories,
      activeDir: []
    }
    this.me = `null`
    this.myInp = React.createRef()
  }

  public componentDidUpdate() {
    if (this.myInp && this.myInp.current) {
      this.myInp.current.scrollIntoView()
    }
  }

  public render() {
    return (
      <div className="terminal dark" onClick={() => this.myInp.current && this.myInp.current.focus()}>
        {this.state.history.map((item, key) => this.renderHistory(item, key))}
        {this.state.loginStep === 0 
          ? <form onSubmit={(e) => this.handleSubmit(e)}>
            <span>{this.me}@{I18n.t('code')}:~{this.state.activeDir.join('/')} $ </span>
            <input
              value={this.state.inputValue}
              className="terminal-input"
              autoComplete="off"
              onChange={(e) => this.setState({ inputValue: e.target.value })}
              ref={this.myInp}
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
                ref={this.myInp}
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
              ref={this.myInp}
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
      user: '',
      dir: '',
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
        dir: '',
        user: '',
        value: `${x.status} ${x.statusText}`
      })
      
      this.setState({ history, username: '', password: '' })
    } catch (error) {
      const history = cloneDeep(this.state.history)
      history.push({
        isCommand: false,
        dir: '',
        user: '',
        value: `${error}`
      })

      this.setState({ history, username: '', password: '' })
      console.error(error)
    }
  }

  public renderHistory (item : IHistoryItem, key : number) {
    const prefix = item.isCommand
      ? <span className="prefix">{item.user}@{I18n.t('code')}:~{item.dir} $ </span>
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
    const commandList = ['login', 'clear', 'help', 'ls', 'cd'].sort()
    const cmdArray = command.split(' ')

    const isSudo = cmdArray[0] === 'sudo'
    const mainCommand = isSudo ? cmdArray[1] : cmdArray[0]
    const subCommands =  cmdArray.slice(isSudo ? 2 : 1, cmdArray.length)

    const ns = cloneDeep(state)
    const user = cloneDeep(this.me)
    ns.history.push({ isCommand: true, user, value: command, dir: this.state.activeDir.join('/') })
    ns.inputValue = ''

    switch(mainCommand) {
      case 'clear':
        ns.history = []
        break

      case 'su': {
        if (isSudo) {
          this.me = `root`
        } else {
          ns.history.push({ isCommand: false, user, dir: this.state.activeDir.join('/'), value: `${user} is not allowed to run sudo su` })
        }
        break
      }

      case 'help': {
        ns.history.push({
          isCommand: false,
          dir: this.state.activeDir.join('/'),
          user,
          value: commandList.join(' ')
        })
        break
      }

      case 'login': {
        ns.loginStep = 1
        break
      }

      case 'cd': {
        const activeDir = cloneDeep(this.state.activeDir)
        // const nestingLevel = activeDir.length - 1
        const dirTo = subCommands[0]
        
        if ((dirTo.indexOf('../') !== -1 || dirTo.indexOf('..') !== -1) && activeDir && activeDir.length >= 1) {
          // Back traversal
          const backAmount = dirTo.split('/').length - 2
          ns.activeDir = activeDir.slice(0, activeDir.length - backAmount - 1)

          ns.history.push({
            isCommand: false,
            dir: this.state.activeDir.join('/'),
            user,
            value: `${activeDir.join('/')}`
          })

        } else if (!dirTo || dirTo.length === 0) {
          // Invalid

          ns.history.push({
            isCommand: false,
            dir: this.state.activeDir.join('/'),
            user,
            value: `${activeDir.join('/')}`
          })
        } else {
          // Forward traversal
          // Check if dir of subcommand is inside subdir
          const prefix = this.state.activeDir.join('/').replace(/\//g, '.')
          const dir = get(this.state.directories, `start${prefix.length > 1 ? `.${prefix}.` : '.'}${dirTo.replace(/\//g, '.')}`)
          
          if (dir) {
            ns.activeDir = this.state.activeDir.concat(dirTo)
            ns.history.push({
              isCommand: false,
              dir: this.state.activeDir.join('/'),
              user,
              value: `Going to ${dirTo}`
            })
          } else {
            ns.history.push({
              isCommand: false,
              dir: this.state.activeDir.join('/'),
              user,
              value: `directory ${dirTo} does not exist`
            })
          }

        }
        break
      }

      case 'pwd': {
        const directory = this.state.activeDir.length > 0 ? this.state.activeDir.join('/') : '/'
        console.log(this.state.activeDir)
        ns.history.push({
          isCommand: false,
          dir: this.state.activeDir.join('/'),
          user,
          value: directory
        })
        break
      }

      case '': {
        break
      }

      default: {
        ns.history.push({ 
          isCommand: false, 
          dir: this.state.activeDir.join('/'),
          user,
          value: `-bash: ${command}: command not found`
        })
      }
    }


    return ns
  }
}

export default withRouter(connect(state => state)(Login))