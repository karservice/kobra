export const apiRoot = (!!window.kobraConstants.apiRoot) ? window.kobraConstants.apiRoot : '/api/v1/'

export const liuAdfsClientId = window.kobraConstants.liuAdfsClientId
export const liuAdfsHost = window.kobraConstants.liuAdfsHost
export const localJwtKey = 'jwt'

// Number of milliseconds before JWT expiry the token should be refreshed
export const jwtRefreshMargin = 60000
