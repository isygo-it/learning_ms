import authConfig from '../../configs/auth'

export async function myFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  showSpinner()
  if (init == null) {
    init = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
  init.headers = new Headers(init.headers)
  const token = localStorage?.getItem(authConfig.accessToken)
  if (token) {
    init.headers.set('Authorization', 'Bearer ' + token)
  }
  const res = await fetch(input, init)

  if (!res.ok) {
    hideSpinner()
    console.log(await res.clone().text())
    throw new HttpError(res.status, await res.clone().text())
  }
  hideSpinner()

  return res
}

export class HttpError extends Error {
  public constructor(
    public code: number,
    message?: string
  ) {
    super(message)
  }
}

const showSpinner = () => {
  document.body.classList.add('loading-indicator')
}
const hideSpinner = () => {
  document.body.classList.remove('loading-indicator')
}
