import puppeteer from 'puppeteer'
import qs from 'query-string'
import fetch from 'isomorphic-unfetch'

const onsenBaseURI = 'https://app.onsen.ag/'
const onsenClientId =
  'b3d68e56145a5d085f6b0ecc6e1ad4a83345ff4ce97d3e16ace95208ad2f1d2f'
const onsenClientSecret =
  '291ba633343212ad706abbb4dae8cda6aa96ae53ed6597298121e63db491a089'
const onsenRedirectURI = 'ag.onsen.app://oauth2callback'
const onsenResponseType = 'code'
const onsenScope = 'private'

const onsenAuthorizeURI = new URL(
  `/oauth/authorize?${qs.stringify({
    client_id: onsenClientId,
    redirect_uri: onsenRedirectURI,
    response_type: onsenResponseType,
    scope: onsenScope,
  })}`,
  onsenBaseURI
).toString()

const onsenAuthenticateURI = new URL('/oauth/token', onsenBaseURI).toString()

export const getAuthorizationCode = async (email: string, password: string) => {
  try {
    if (email == undefined || password == undefined)
      throw 'Require email and password'

    let authorizationCode = ''

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    page.on('request', (request) => {
      const requestProtocol = new URL(request.url()).protocol

      if (requestProtocol === 'ag.onsen.app:') {
        authorizationCode = request
          .url()
          .replace(`${onsenRedirectURI}?code=`, '')
      }
    })

    await page.goto(onsenAuthorizeURI, {
      waitUntil: 'networkidle2',
    })

    // ログイン情報を入力する
    await page.type('#user_email', email)
    await page.type('#user_password', password)

    // ログインを実行する
    await page.click('input[type="submit"]')

    await browser.close()

    if (authorizationCode === '') throw 'Authorization Code is not found'

    return authorizationCode
  } catch (error) {
    console.error(error)
  }
}

export const getAccessToken = async (authorizationCode: string) => {
  try {
    if (authorizationCode == undefined) throw 'Require authorizationCode'

    const response = await fetch(onsenAuthenticateURI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify({
        client_id: onsenClientId,
        client_secret: onsenClientSecret,
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: onsenRedirectURI,
      }),
    })

    if (!response.ok) throw 'Failed request'

    const accessToken = await response.json().then((json) => {
      return json.access_token
    })

    return accessToken
  } catch (error) {
    console.error(error)
  }
}
