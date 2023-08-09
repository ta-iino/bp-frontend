// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
      public: {
          approachBaseURL:process.env.APPROACH_BASE_URL,
          jmssPortalbaseURL:process.env.JMSS_PORTAL_BASE_URL,
      }
  },
  app: {
      head: {
          title: 'DMマッチングシステム',
          htmlAttrs: {
              lang: 'ja',
          },
          meta: [
              { charset: 'utf-8' },
              { hid: 'description', name: 'description', content: '' },
            ],
          link: [{ rel: 'icon', type: 'image/x-icon', href: 'public/favicon.ico' }],
      },
  },
  css: [
      "vuetify/lib/styles/main.sass"
  ],
  build: {
      transpile: ["vuetify"]
  },
  vite: {
      define: {
          "process.env.DEBUG": false
      },
      // for HMR
      server: {
          watch: {
              usePolling: true
          }
      },
  },
  ssr: false,
  plugins: ['~/plugins/vuetify.ts', '~/plugins/api.ts'],
});