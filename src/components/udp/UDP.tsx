import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'

import { IRootProps } from '../../statics/types'

import './UDP.scss'

interface IUDPProps extends IRootProps, RouteComponentProps<any> {

}

interface IUDPState {
  loading: boolean
}

class UDP extends React.PureComponent<IUDPProps, IUDPState> {
  constructor(props: IUDPProps) {
    super(props)

    this.state = {
      loading: false
    }
  }

  public render() {
    return (
      <h1>UDP statistics</h1>
    )
  }
}

export default withRouter(connect(s => s)(UDP))