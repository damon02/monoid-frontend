import { AnyAction } from 'redux'
import { initialState } from '../../statics/reducers'
import { IAppProps } from '../../statics/types'
import { saveProperty } from '../../utils/cookies'

export function appReducer(state : IAppProps = initialState.app, action: AnyAction) {
  switch(action.type) {
    case 'SET_THEME':
      saveProperty('theme', action.theme)
      return Object.assign({}, state, { theme: action.theme })
      
    case 'SET_SETTINGS':
      return Object.assign({}, state, { settings: action.settings })
      
    case 'SET_PACKETS':
      return Object.assign({}, state, { packets: action.packets })
      
    case 'SET_RULES':
      return Object.assign({}, state, { rules: action.rules })
      
    case 'SET_DATES':
      saveProperty('startDate', action.times.startDate)
      saveProperty('endDate', action.times.endDate)
      return Object.assign({}, state, { times: action.times })

    case 'SET_NOTIFICATIONS':
      return Object.assign({}, state, { notifications: action.notifications })

    default:
      return state
  }
}