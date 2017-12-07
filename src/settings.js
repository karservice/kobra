export const getBackendEnv = () => {
  const backendEnvElementContent = document.getElementById('BACKEND_INJECTED_ENV').textContent

  let backendEnv
  try {
    backendEnv = JSON.parse(backendEnvElementContent)
  } catch (e) {
    console.warn(
      `Backend injected environment could not be parsed. This is
      normal when running in development mode (yarn start).`
    )
  }
  return backendEnv
}

const env = Object.assign(
  {},
  {
    // These will be replaced with values at build!
    API_ROOT: process.env.REACT_APP_API_ROOT,
    LIU_ADFS_CLIENT_ID: process.env.REACT_APP_LIU_ADFS_CLIENT_ID,
    LIU_ADFS_HOST: process.env.REACT_APP_LIU_ADFS_HOST,
    OPBEAT_APP_ID: process.env.REACT_APP_OPBEAT_APP_ID,
    OPBEAT_ORG_ID: process.env.REACT_APP_OPBEAT_ORG_ID,
  },
  // Injected settings have precedence
  getBackendEnv() || {}
)

console.log('Using settings:', env)

// API root, with trailing slash
const apiRoot = env.API_ROOT || '/api/v1/'
const liuAdfsClientId = env.LIU_ADFS_CLIENT_ID || ''
const liuAdfsHost = env.LIU_ADFS_HOST || 'fs.liu.se'
// The localStorage key used to store JWT
const localJwtKey = 'jwt'
// Number of milliseconds before JWT expiry to issue a refresh
const jwtRefreshMargin = 120 * 1000

const opbeatAppId = env.OPBEAT_APP_ID || ''
const opbeatOrgId = env.OPBEAT_ORG_ID || ''

export {
  apiRoot,
  jwtRefreshMargin,
  liuAdfsClientId,
  liuAdfsHost,
  localJwtKey,
  opbeatAppId,
  opbeatOrgId,
}
