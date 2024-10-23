export type ConfigpasswordType = {
  id: number
  code: string
  domain: string
  pattern: string
  charSetType: string
  initialPassword: string
  minLenght: number
  maxLenth: number
  lifeDays: number
}


export type ConfigpasswordData = {
  domain: string
  pattern: string
  charSetType: string
  initialPassword: string

}
export type ConfigpasswordTypes = {
  domain: string
  pattern: string

  initialPassword: string

}
