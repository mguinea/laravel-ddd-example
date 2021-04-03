export default {
  // Server config: https://nuxtjs.org/docs/2.x/features/configuration
  server: {
    host: 'localhost', // default: localhost
    port: 9000 // default: 3000
  },

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'front',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // The modules dir: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-modulesdir
  modulesDir: [
    '../node_modules'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  // Env variables: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-env
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:8180/api/v1/'
  }
}
