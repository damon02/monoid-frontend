// Higher level component types (i.e. redux)

export interface IRootProps {
  app: IAppProps
  login: ILoginProps
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