/**
 * Handle the datadogInit -- allowing sent performance data to the dashboard.
 * @function datadogInit
 * @return {void}
 */

import { datadogRum } from '@datadog/browser-rum'
import { init } from '../../legacy-app/lib/clientEnv'

const clientEnv = init(window.appInsights)

const DATADOG_RUM_ENABLED = clientEnv.getVar(clientEnv.DATADOG_RUM_ENABLED)
const DATADOG_RUM_CLIENT_TOKEN = clientEnv.getVar(clientEnv.DATADOG_RUM_CLIENT_TOKEN)
const DATADOG_RUM_APPLICATION_ID = clientEnv.getVar(clientEnv.DATADOG_RUM_APPLICATION_ID)
const DATADOG_RUM_SAMPLE_RATE = clientEnv.getVar(clientEnv.DATADOG_RUM_SAMPLE_RATE)
const APP_VERSION = clientEnv.getVar(clientEnv.APP_VERSION)
const RUN_ENV = clientEnv.getVar(clientEnv.RUN_ENV)

export function datadogInit() {
  if (DATADOG_RUM_ENABLED === 'true') {
    datadogRum.init({
      clientToken: DATADOG_RUM_CLIENT_TOKEN,
      applicationId: DATADOG_RUM_APPLICATION_ID,
      site: 'datadoghq.com',
      service: 'gopuff-mixcart',
      env: RUN_ENV,
      version: APP_VERSION,
      sampleRate: parseInt(DATADOG_RUM_SAMPLE_RATE),
      trackInteractions: false,
    })
  }
}

export function addActionToDD(name, properties) {
  datadogRum.addAction(name, properties)
}

export function addErrorToDD(error, properties) {
  datadogRum.addError(error, properties)
}
