import { IAuthObject } from "../../statics/types"

export function setAuth(auth : IAuthObject) {
  return {
    type: 'SET_AUTH',
    auth
  }
}

export function clearAuth() {
  return {
    type: 'CLEAR_AUTH'
  }
}