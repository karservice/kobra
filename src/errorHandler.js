// This should be the only file aware that we use Opbeat for error reporting.
import 'opbeat-js'

import {opbeatAppId, opbeatOrgId} from './settings'

const init = () => {
  window._opbeat('config', {
    orgId: opbeatOrgId,
    appId: opbeatAppId
  })
}

const capture = (err) => {
  window._opbeat('captureException', err)
}

const setUserContext = ({id, email}) => {
  window._opbeat('setUserContext', {
    is_authenticated: !!id,
    id: id,
    email: email,
    username: email
  })
}

export {
  init,
  capture,
  setUserContext
}
