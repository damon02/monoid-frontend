import moment from 'moment'
import { i18nReducer } from 'react-redux-i18n'
import { combineReducers } from 'redux'

import { appReducer } from '../components/app/reducer'
import { loginReducer } from '../components/login/reducer'

import en_EN from '../translations/en_EN'
import { loadProperty } from '../utils/cookies'
import { IAuthObject, II18nState, IRootProps } from './types'

const emptyAuthObject : IAuthObject = {
  username: null,
  token: null,
  timestamp: null
}

/**
 * Initial redux state upon first boot
 */
export const initialState : IRootProps = {
  app: {
    notifications: null,
    rules: null,
    packets: null,
    settings: {
      enabledNotifications: false,
      notificationRecipients: [],
    },
    theme: loadProperty('theme', 'light'),
    times: {
      startDate: new Date(loadProperty('startDate', moment().subtract(1, 'hour').unix() * 1000)),
      endDate: new Date(loadProperty('endDate', moment().unix() * 1000)),
    }
  },
  login: {
    auth: loadProperty('auth', emptyAuthObject)
  },
  i18n: {
    translations: { en: en_EN },
    locale: 'en'
  } as II18nState,
}

export const combinedReducers = combineReducers({
  app: appReducer,
  login: loginReducer,
  i18n: i18nReducer
})