<!-- based on https://github.com/nuxt-modules/supabase/blob/main/demo/pages/confirm.vue -->

<script setup lang="ts">
const user = useSupabaseUser();

watch(
  user,
  () => {
    if (user.value) {
      return navigateTo('/');
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
