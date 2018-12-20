import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'

import { IRootProps } from '../../statics/types'

import './TCP.scss'

interface ITCPProps extends IRootProps, RouteComponentProps<any> {

}

interface ITCPState {
  loading: boolean
}

class TCP extends React.PureComponent<ITCPProps, ITCPState> {
  constructor(props: ITCPProps) {
    super(props)

    this.state = {
      loading: false
    }
  }

  public render() {
    return (
      <h1>TCP statistics</h1>
    )
  }
}

export default withRouter(connect(s => s)(TCP))