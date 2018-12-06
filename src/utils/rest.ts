import { BASE_URL } from '../statics/constants'
import { IGenericAPIResponse, ILoginResponse, IRegisterResponse } from '../statics/types'

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

  return fetch(`${BASE_URL}/authorize/request-token`,options)
    .then(r => formatResponseFromBackend<ILoginResponse>(r))
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