import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { getPackets } from '../../utils/rest'

import { IRootProps } from '../../statics/types'

import './DailyStatistics.scss'

interface IDailyStatisticsProps extends IRootProps, RouteComponentProps<any> {

}

interface IDailyStatisticsState {
  loading: boolean
  error: string
}

class DailyStatistics extends React.PureComponent<IDailyStatisticsProps, IDailyStatisticsState> {
  constructor(props: IDailyStatisticsProps) {
    super(props)

    this.state = {
      loading: false,
      error: ''
    }
  }

  public render() {
    return (
      <h1>Daily statistics</h1>
    )
  }

  public componentDidMount() {
    this.handlePackets()
  }

  public componentDidUpdate() {

  }

  public handlePackets = async () => {
    try {
      this.setState({ loading: true, error: '' })
      const response = await getPackets(this.props.login.auth.token)
      this.setState({ loading: false })
      
      if(response) {
        //ToDO
        console.log(response)
      } else {
          this.setState({error: 'dataError'})
          throw new Error('No data packets found')
      }
      
    } catch (error) {
      this.setState({ loading: false, error: 'loginError' })
      console.error()
    }
  }
}

export default withRouter(connect(s => s)(DailyStatistics))