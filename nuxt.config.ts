// https://v3.nuxtjs.org/api/configuration/nuxt.config

const removeDigits = () => {
    return {
      name: 'remove-digits',
      apply: 'serve',
      configureServer(server) {
        // rewrite digits as ""
        server.middlewares.use('/', (req, _, next) => {
          if (req.url.match(/\d+$/)) {
            req.url = req.url.replace(/\d+$/, '')
          }
          next()
        })
      },
    }
  }

export default defineNuxtConfig({
  runtimeConfig: {
      public: {
          baseURL:process.env.BASE_URL,
          jmssPortalBaseURL:process.env.JMSS_PORTAL_BASE_URL,
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
      plugins: [
        removeDigits(),
      ]
  },

  ssr: false,
  plugins: ['~/plugins/vuetify.ts', '~/plugins/api.ts'],
});
