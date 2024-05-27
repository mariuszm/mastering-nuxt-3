// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', "@nuxt/eslint", "@nuxtjs/supabase"],

  // based on https://github.com/nuxt-modules/supabase/blob/main/demo/nuxt.config.ts
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    },
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
    },
  },
});
