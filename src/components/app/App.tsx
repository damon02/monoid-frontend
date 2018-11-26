import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import { IRootProps } from '../../statics/types'
import { setData } from './actions'
import './App.css'

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
      <div className="App">
        memes
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