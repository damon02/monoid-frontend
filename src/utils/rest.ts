import { BASE_URL } from '../statics/constants'
import { IGenericAPIResponse, ILoginResponse, IRegisterResponse } from '../statics/types'

/**
 * Registers a user inside the backend
 * @param {String} userName
 * @param {String} emailAddress
 * @param {String} password
 */
export function registerUser(userName : string, emailAddress : string, password: string) : Promise<IRegisterResponse> {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userName,
      emailAddress,
      password
    })
  }

  return fetch(`${BASE_URL}/authorize/register-user`, options)
    .then(r => formatResponseFromBackend<IRegisterResponse>(r))
}

/**
 * Requests a token from the backend to use with API calls
 * @param {String} userName
 * @param {String} password
 */
export function loginUser(userName : string, password : string) : Promise<ILoginResponse> {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userName,
      password
    })
  }

  return fetch(`${BASE_URL}/authorize/request-token`, options)
    .then(r => formatResponseFromBackend<ILoginResponse>(r))
}


/**
 * Requests a password recovery email
 * @param {String} emailAddress
 */
export function requestPasswordRecoveryEmail(emailAddress: string) : Promise<IGenericAPIResponse<any>> {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      emailAddress
    })
  }

  return fetch(`${BASE_URL}/user/request-password-recovery`, options)
    .then(r => handleGenericRestResponse<any>(r))
}

/**
 * Resets a password inside the database
 * @param {String} token
 * @param {String} password
 */
export function resetPassword(token: string, password: string) : Promise<any> {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token,
      password
    })
  }

  return fetch(`${BASE_URL}/user/password-recovery`, options)
    .then(r => formatResponseFromBackend<any>(r))
}

/**
 * Gets a token for the Raspberry Pi systems
 */
export function getToken(token: string) : Promise<string | null> {
  const options = {
    method: 'GET',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    }
  }

  return fetch(`${BASE_URL}/authorize/get-token`, options)
    .then(r => formatResponseFromBackend<string>(r))
}


/**
 * Function which strips down a HTTP request from the server to the bare data needed for the frontend
 * @type T
 * @param response 
 * @returns Promise<T[]>
 */
async function formatResponseFromBackend<T>(response : Response) : Promise<T | null> {
  const intermediateResponse = await handleGenericRestResponse<Promise<IGenericAPIResponse<T>>>(response)
  if (!intermediateResponse.success) {
    throw new Error(intermediateResponse.message || 'An unknown error has occurred without any message.')
  } else {
    return intermediateResponse.data
  }
}

/**
 * Strongly typed generic response handler for HTTP requests
 * @param response 
 */
function handleGenericRestResponse<T>(response : Response) : Promise<T> {
  if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response.json())
  } else {
      return Promise.resolve(response.json())
        .then(message => {
            const err : Error = new Error(`${message.message} (code ${message.statusCode})`)
            throw err
        })
  }
}