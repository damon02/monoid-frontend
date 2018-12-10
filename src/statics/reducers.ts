import { i18nReducer } from 'react-redux-i18n'
import { combineReducers } from 'redux'

import { appReducer } from '../components/app/reducer'
import { loginReducer } from '../components/login/reducer'

import nl_NL from '../translations/nl_NL'
import { loadProperty } from '../utils/cookies'
import { IAuthObject, II18nState, IRootProps } from './types'

const emptyAuthObject : IAuthObject = {
  username: null,
  token: null,
  timestamp: null
}


export const initialState : IRootProps = {
  app: {
    theme: loadProperty('theme', 'light'),
  },
  login: {
    auth: loadProperty('auth', emptyAuthObject)
  },
  i18n: {
    translations: { nl: nl_NL },
    locale: 'nl'
  } as II18nState,
}

export const combinedReducers = combineReducers({
  app: appReducer,
  login: loginReducer,
  i18n: i18nReducer
})