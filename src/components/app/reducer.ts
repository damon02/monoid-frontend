import { AnyAction } from 'redux'
import { initialState } from '../../statics/reducers'
import { IAppProps } from '../../statics/types'
import { saveProperty } from '../../utils/cookies'

export function appReducer(state : IAppProps = initialState.app, action: AnyAction) {
  switch(action.type) {
    case 'SET_THEME':
      saveProperty('theme', action.theme)
      return Object.assign({}, state, { theme: action.theme })

    default:
      return state
  }
}