import { cloneDeep, get } from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import { IAuthObject, IRootProps } from '../../statics/types'
import { loginUser } from '../../utils/rest'
import Directories from './directories'

import { clearAuth, setAuth } from '../login/actions'

import './Terminal.scss'

interface ITerminalProps extends IRootProps, RouteComponentProps<any> {
  clearAuth: () => void
  setAuth: (auth: IAuthObject) => void
}

interface ITerminalState {
  username: string
  password: string
  loading: boolean
  history: IHistoryItem[]
  inputValue: string
  loginStep: 0 | 1 | 2
  directories: any
  activeDir: string[]
}

interface IHistoryItem {
  isCommand: boolean
  user: string
  dir: string
  value: string
}

class Terminal extends React.PureComponent<ITerminalProps, ITerminalState> {
  public me: string
  public myInp: React.RefObject<HTMLInputElement>

  constructor(props : ITerminalProps) {
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
    this.me = `guest`
    this.myInp = React.createRef()
  }

  public componentDidMount() {
    if (this.props.login.auth.username) {
      this.me = this.props.login.auth.username
    }
  }

  public componentDidUpdate(prevProps: ITerminalProps) {
    if (this.myInp && this.myInp.current) {
      this.myInp.current.scrollIntoView()
    }

    if (this.props.login.auth.username && this.props.login.auth.username !== prevProps.login.auth.username) {
      this.me = this.props.login.auth.username
    } else if (!this.props.login.auth.username) {
      this.me = 'guest'
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

    if (!this.props.login.auth.token) {
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
  }

  public handleLogin = async () => {
    try {
      const response = await loginUser(this.state.username, this.state.password)
      const history = cloneDeep(this.state.history)
      
      if (response) {      
        this.props.setAuth({ username: response.user.userName, token: response.user.token, timestamp: Date.now() })
        history.push({
          isCommand: false,
          dir: '',
          user: '',
          value: I18n.t('terminal.loginSuccess', { user: response.user.userName })
        })
      } else {
        history.push({
          isCommand: false,
          dir: '',
          user: '',
          value: I18n.t('terminal.loginError')
        })
      }
      
      this.setState({ history, username: '', password: '' })
    } catch (error) {
      const history = cloneDeep(this.state.history)
      history.push({
        isCommand: false,
        dir: '',
        user: '',
        value: I18n.t('terminal.loginError')
      })

      this.setState({ history, username: '', password: '' })
      console.error(error)
    }
  }

  public renderHistory (item : IHistoryItem, key : number) {
    const prefix = item.isCommand
      ? <span className="prefix">{item.user}@{I18n.t('code')}:~{item.dir} $ </span>
      : null
    return <div key={key}>{prefix}{item.value}</div>
  }

  public handleSubmit = (event : React.FormEvent) => {
    event.preventDefault()

    const input = event.target[0].value
    const newState = this.handleCommand(input, this.state)

    this.setState(newState)
  } 

  public handleCommand = (command : string, state: ITerminalState) : ITerminalState => {
    const commandList = ['login', 'logout', 'clear', 'help', 'ls', 'cd'].sort()
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
          ns.history.push({ 
            isCommand: false, 
            user, 
            dir: this.state.activeDir.join('/'), 
            value: `${user} is not allowed to run sudo su` 
          })
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
        if (this.props.login.auth.token) {
          ns.history.push({
            isCommand: false,
            dir: '',
            user: '',
            value: I18n.t('terminal.alreadyLoggedIn')
          })
        } else {
          ns.loginStep = 1
        }
        break
      }

      case 'logout': {
        if (this.props.login.auth.token) {
          this.props.clearAuth()
          ns.history.push({
            isCommand: false,
            dir: '',
            user: '',
            value: I18n.t('terminal.loggedOut')
          })
        } else {
          ns.history.push({
            isCommand: false,
            dir: '',
            user: '',
            value: I18n.t('terminal.notLoggedIn')
          })
        }
        break
      }

      case 'cd': {
        const activeDir = cloneDeep(this.state.activeDir)
        // const nestingLevel = activeDir.length - 1
        const dirTo = subCommands[0]
        
        if ((dirTo.indexOf('../') !== -1 || dirTo.indexOf('..') !== -1) && activeDir && activeDir.length >= 1) {
          // Back traversal
          const backAmount = dirTo.indexOf('../') !== -1 ? dirTo.split('/').length - 2 : 2
          ns.activeDir = activeDir.slice(0, activeDir.length - backAmount - 1)
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

      case 'ls': {
        const prefix = this.state.activeDir.join('/').replace(/\//g, '.')
        const dir = this.state.activeDir.length > 0 
          ? get(this.state.directories, `start.${prefix.length > 1 ? `${prefix}` : '.'}`)
          : get(this.state.directories, 'start')

        if (dir && Object.keys(dir).length > 0) {
          ns.history.push({
            isCommand: false,
            dir: this.state.activeDir.join('/'),
            user,
            value: Object.keys(dir).join(' ')
          })
        } else {
          ns.history.push({
            isCommand: false,
            dir: this.state.activeDir.join('/'),
            user,
            value: `This directory is empty`
          })
        }
        break
      }

      case 'pwd': {
        const directory = this.state.activeDir.length > 0 ? this.state.activeDir.join('/') : '/'
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

const mapStateToProps = (state : IRootProps, ownProps : {}) => state
const mapDispatchToProps = (dispatch : Dispatch) => {
  return {
    setAuth : (auth : IAuthObject) => { dispatch(setAuth(auth)) },
    clearAuth: () => { dispatch(clearAuth()) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Terminal))