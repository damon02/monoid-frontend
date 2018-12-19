// Higher level component types (i.e. redux)

export interface IRootProps {
  app: IAppProps
  login: ILoginProps
  i18n: II18nState
}

export interface IAppProps {
  theme: 'light' | 'dark' | 'lsd'
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

export interface IGraphComponentData {
  color: string
  data: Array<{ name: string, value: number }>
  dataKey: string
  nameKey: string
  label: boolean
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
export type ILoginResponse = { 
  user: { 
    userName: string
    token: string 
  }
  settings: {
    enabledNotifications: boolean
    notificationRecipients: string[]
  } 
} | null
export type ITokenResponse = { token: string } | null