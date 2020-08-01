const onsenAuth = require('../dist')

const email = ''
const password = ''

;(async () => {
  const authorizationCode = await onsenAuth.getAuthorizationCode(
    email,
    password
  )

  const accessToken = await onsenAuth.getAccessToken(authorizationCode)

  console.log(accessToken)
})()
