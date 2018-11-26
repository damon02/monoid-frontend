import { AnyAction } from 'redux'
import { initialState } from '../../statics/reducers'
import { IAppProps } from '../../statics/types'

export function appReducer(state : IAppProps = initialState.app, action: AnyAction) {
  switch(action.type) {
    case 'SET_DATA':
      return Object.assign({}, state, { data: action.data })

    default:
      return state
  }
}