import ApproachModule from '~/repository/modules/approach'
import JmssPortalModule from '~/repository/modules/jmssPortal'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  const approach: ApproachModule = new ApproachModule(config.public.baseURL)
  const jmssPortal: JmssPortalModule = new JmssPortalModule(
    config.public.jmssPortalBaseURL, await approach.getJmssPortalAccessToken()
  )
  return {
    provide: {
      approach: approach,
      jmssPortal: jmssPortal
    }
  }
})