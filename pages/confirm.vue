<script setup lang="ts">
const user = useSupabaseUser();
const { query } = useRoute();

/**
 * Based on:
 * https://github.com/nuxt-modules/supabase/blob/main/demo/pages/confirm.vue
 * https://github.com/nuxt-modules/supabase/blob/main/demo/pages/index.vue
 *
 * Watch if the user switches from logged out to logged in.
 * This watchEffect is needed because when Supabase redirects us back,
 * the middleware doesn't yet know that we're logged in so it kicks us back
 * into the login page again.
 */
watch(
  user,
  async () => {
    if (user.value) {
      return await navigateTo((query.redirectTo as string) ?? '/', {
        replace: true,
      });
    }
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <p class="u-text-black">Redirecting...</p>
  </div>
</template>
