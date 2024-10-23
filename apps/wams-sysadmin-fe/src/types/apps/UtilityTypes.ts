export const URL_PATTERN = /^http|https|ftps|ftp:\/\/\w+(\.\w+)*(:[0-9]+)?\/?$/

export type Task = {
  id: number
  name: string
  imagePath: string
  description: string
  status: string
  dashboardId: number
}
