import { AnyAction } from 'redux'
import { initialState } from '../../statics/reducers'
import { IAuthObject, ILoginProps } from '../../statics/types'
import { removeProperty, saveProperty } from '../../utils/cookies'

export function loginReducer(state : ILoginProps = initialState.login, action: AnyAction) {
  switch(action.type) {
    case 'SET_AUTH':
      saveProperty('auth', action.auth)
      return Object.assign({}, state, { auth: action.auth })

    case 'CLEAR_AUTH':
      removeProperty('auth')
      const emptyAuth : IAuthObject = {
        username: null,
        token: null,
        timestamp: null,
      }
      return Object.assign({}, state, { auth: emptyAuth })

    default:
      return state
  }
}