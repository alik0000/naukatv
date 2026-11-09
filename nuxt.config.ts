// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true
  },
  css: ['~/assets/styles/main.less'],
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          additionalData:
            '@import (reference) "~/assets/styles/breakpoints.less";\n',
        },
      },
    },
  },
})
