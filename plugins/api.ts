import ApproachModule from '~/repository/modules/approach';
import JmssPortalModule from '~/repository/modules/jmssPortal';

interface ApiInstance {
    approach: ApproachModule;
    jmssPortal: JmssPortalModule;
}

// TODO 環境変数から取れるようにする
// const config = useRuntimeConfig();

export default defineNuxtPlugin((nuxtApp) => {
    const modules: ApiInstance = {
        approach: new ApproachModule('http://localhost:8000'),
        jmssPortal: new JmssPortalModule('', ''),
    }
    return {
      provide: {
        api: modules
      }
    };
  });