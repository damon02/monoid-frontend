import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import Terminal from '../terminal/Terminal'

import { IRootProps } from '../../statics/types'
import { setData } from './actions'
import './App.scss'

interface IAppProps extends IRootProps, RouteComponentProps<any> {
  setData : (data: any) => void
}

interface IAppState {
  loading: boolean
}

class App extends React.PureComponent<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props)
    this.state = {
      loading: false
    }
  }

  public render() {
    if (!this.props.login.auth.token) {
      return <Redirect to={'login'} />
    }

    return (
      <div className="app">
        <Switch>
          <Route path="/terminal" component={Terminal} />
          <Route path="/" component={() => <h2>Hello</h2>} />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state : IRootProps, ownProps : {}) => state
const mapDispatchToProps = (dispatch : Dispatch) => {
  return {
    setData : (data : any) => { dispatch(setData(data)) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))