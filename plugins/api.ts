import ApproachModule from '~/repository/modules/approach';
import JmssPortalModule from '~/repository/modules/jmssPortal';

interface ApiInstance {
    approach: ApproachModule;
    jmssPortal: JmssPortalModule;
}

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const modules: ApiInstance = {
        approach: new ApproachModule(config.public.baseURL),
        jmssPortal: new JmssPortalModule(config.public.jmssPortalbaseURL, config.public.baseURL),
    }
    return {
      provide: {
        api: modules
      }
    };
  });