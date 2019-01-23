import * as React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { RouteComponentProps, withRouter } from 'react-router'
import ReactTable from 'react-table'
import { Dispatch } from 'redux'
import moment from 'moment'

import ErrorComponent from '../html/errorComponent/ErrorComponent'

import { IRootProps } from '../../statics/types'
import { getNotifications } from '../../utils/rest'
import { setNotifications } from '../app/actions'
import { clearAuth } from '../login/actions'

import 'react-table/react-table.css'
import { toast } from 'react-toastify';

interface INotificationsProps extends IRootProps, RouteComponentProps<any> {
  clearAuth: () => void
  setNotifications: (notifications: IRootProps['app']['notifications']) => void
}

interface INotificationsState {
  error: string
  loading: boolean
}

class Notifications extends React.PureComponent<INotificationsProps, INotificationsState> {
  constructor(props: INotificationsProps) {
    super(props)
    this.state = {
      error: '',
      loading: false
    }
  }

  public componentDidMount() {
    this.fetchNotifications()
  }

  public render() {
    const data = this.props.app.notifications || []
    return (
      <div className="notifications">
        <ErrorComponent message={this.state.error ? I18n.t(`error.${this.state.error}`) : ''} onClick={() => this.setState({ error: '' })} />
        <div className="filters">
          <h1>{I18n.t('notifications.title')}</h1>
        </div>
        <ReactTable
          data={data}
          defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
          defaultSorted={[
            {
              id: "TimeStamp",
              desc: true
            }
          ]}
          columns={this.getTableColumns()}
          className="-striped"
          defaultPageSize={10}
        />
      </div>
    )
  }

  private getTableColumns() {
    return [
      {
        Header: I18n.t('notifications.Timestamp'),
        accessor: 'TimeStamp',
        Cell: (value: any) => {
          return moment(value.value).format('YYYY-MM-DD HH:mm:ss')
        },
        maxWidth: 160,
      },
      {
        Header: I18n.t('notifications.Risk'),
        accessor: 'Risk',
        maxWidth: 100,
      },
      {
        Header: I18n.t('notifications.Message'),
        accessor: 'Message',
      },
    ]
  }

  /**
   * Fetch packets from the backend
   */
  private fetchNotifications = async () => {
    if (this.props.login.auth.token) {
      try {
        this.setState({ error: '' })
        const response = await getNotifications(this.props.login.auth.token)

        if (response) {
          this.props.setNotifications(response)
          this.setState({ loading: false })
        } else {
          toast.info(I18n.t('notifications.noNotifications'), { position: toast.POSITION.BOTTOM_LEFT })
        }
        
      } catch (error) {
        this.setState({ loading: false })
        toast.error(I18n.t('error.notificationsError'), { position: toast.POSITION.BOTTOM_LEFT })
      }
    } else {
      this.props.clearAuth()
    }
  }
}

const mapStateToProps = (state: IRootProps, ownProps: {}) => state
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    clearAuth: () => { dispatch(clearAuth()) },
    setNotifications: (notifications: IRootProps['app']['notifications']) => { dispatch(setNotifications(notifications)) },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Notifications))