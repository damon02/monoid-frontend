import { combineReducers } from 'redux'

import { appReducer } from '../components/app/reducer'
import { loginReducer } from '../components/login/reducer'

import { loadProperty } from '../utils/cookies'
import { IAuthObject, IRootProps } from './types'

const emptyAuthObject : IAuthObject = {
  username: null,
  token: null,
  timestamp: null
}

const auth : IAuthObject = loadProperty('auth', emptyAuthObject)

export const initialState : IRootProps = {
  app: {
    data: []
  },
  login: {
    auth
  }
}

export const combinedReducers = combineReducers({
  app: appReducer,
  login: loginReducer
})