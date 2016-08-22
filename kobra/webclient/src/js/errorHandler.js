// This should be the only file aware that we use Opbeat for error reporting.
import 'opbeat-js'

const init = () => {
  window._opbeat('config', {
    orgId: window.kobraConstants.opbeatOrgId,
    appId: window.kobraConstants.opbeatAppId
  })
}

const capture = (err) => {
  window._opbeat('captureException', err)
}

export {
  init,
  capture
}
