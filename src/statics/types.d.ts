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
  timestamp: string | null
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
