export type ConfigTypes = {
  id: number
  domain: string
  host: string
  port: string
  username: string

  smtpAuth: string

  password: string
  transportProtocol: string
  smtpStarttlsEnable: boolean
  smtpStarttlsRequired: boolean
  debug: boolean

}
export type ConfigData = {
  id?: number,
  domain?: string,
  host?: string,
  port?: string,
  username?: string,
  smtpAuth?: string,
  password?: string,
  transportProtocol?: string,
  smtpStarttlsEnable?: boolean,
  smtpStarttlsRequired?: boolean,
  debug?: boolean,


}

