import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import { IRootProps, IRulesResponse } from '../../statics/types'

interface IRulesProps extends IRootProps, RouteComponentProps<any> {

}

interface IRulesState {
  rules: IRulesResponse
  hasChanged: boolean
}

class Rules extends React.PureComponent<IRulesProps, IRulesState> {
  constructor(props : IRulesProps) {
    super(props)

    this.state = {
      rules: null,
      hasChanged: false
    }
  }

  public render() {
    return (
      <div className="rules">
        <h1>Rules</h1>
      </div>
    )
  }
}

export default connect(s => s)(Rules)