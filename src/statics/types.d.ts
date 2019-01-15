// Higher level component types (i.e. redux)

export interface IRootProps {
  app: IAppProps
  login: ILoginProps
  i18n: II18nState
}

export interface IAppProps {
  packets: IPacketsResponse
  rules: IRulesResponse
  settings: {
    enabledNotifications: boolean
    notificationRecipients: string[]
  }
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
  data: Array<any>
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
export type ISettingsResponse = {
  enabledNotifications: boolean
  notificationRecipients: string[]
} | null


export type IRule = {
  DestIp: string[]
  DestPort: number[]
  Id?: string
  Log: boolean
  Message: string
  Notify: boolean
  Protocol: number
  Risk: number
  SourceIp: string[]
  SourcePort: number[]
}
export type IRulesResponse = IRule[] | null

export type IPacketsResponse = Array<{
  DestinationIp: null | string
  DestinationMacAddress: null | string
  DestinationPort: number
  DnsRequest: null | string
  HasAckFlag: boolean
  HasRstFlag: boolean
  HasSynFlag: boolean
  MainProtocol: 'TCP' | 'UDP' | 'Undefined' | 'ICMP'
  PacketSize: number
  Protocol: string
  Reason: null | string
  Risk: 'Information' | 'Low' | 'Medium' | 'High' | 'Critical'
  RuleApplied: boolean
  SourceIp: null | string
  SourceMacAddress: null | string
  SourcePort: number
}> | null
