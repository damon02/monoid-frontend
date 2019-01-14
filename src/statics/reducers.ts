import { i18nReducer } from 'react-redux-i18n'
import { combineReducers } from 'redux'

import { appReducer } from '../components/app/reducer'
import { loginReducer } from '../components/login/reducer'

import en_EN from '../translations/en_EN'
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
    rules: null,
    packets: null,
    settings: {
      enabledNotifications: false,
      notificationRecipients: [],
    },
    theme: loadProperty('theme', 'light'),
  },
  login: {
    auth: loadProperty('auth', emptyAuthObject)
  },
  i18n: {
    translations: { nl: nl_NL, en: en_EN },
    locale: 'en'
  } as II18nState,
}

export const combinedReducers = combineReducers({
  app: appReducer,
  login: loginReducer,
  i18n: i18nReducer
})