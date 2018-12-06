// Higher level component types (i.e. redux)

export interface IRootProps {
  app: IAppProps
  login: ILoginProps
  i18n: II18nState
}

export interface IAppProps {
  data: any
}

export interface ILoginProps {
  auth: IAuthObject
}

// Props for misc things

export interface IAuthObject {
  username: string | null
  token: string | null
  timestamp: number | null
}

/**
 * react-redux-I18n 
 */

type SubTranslationObject = string | { [key: string]: SubTranslationObject };

interface ITranslationObjects { [lang: string]: SubTranslationObject }

export interface II18nState {
  translations: ITranslationObjects
  locale: string
}


// REST types

export interface IGenericAPIResponse<T> {
  success: boolean
  message: string | null
  data: T | null
}

export type IRegisterResponse = { userName: string, emailAddress: string } | null
export type ILoginResponse = { userName: string, token: string } | null
