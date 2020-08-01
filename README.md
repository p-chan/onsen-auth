# onsen-auth

> Onsen Auth Libarary

## Install

```shell
$ npm install onsen-auth
```

## Usage

```js
import { getAuthorizationCode, getAccessToken } from 'onsen-auth'

const authorizationCode = await onsenAuth.getAuthorizationCode(
  'hi@example.com',
  'password'
)
const accessToken = await onsenAuth.getAccessToken(authorizationCode)

console.log(accessToken)
```
