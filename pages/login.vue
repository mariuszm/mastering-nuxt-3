<template>
  <div class="w-full max-w-2xl prose h-9">
    <h1>Log in to {{ title }}</h1>
    <button
      class="px-4 py-2 font-bold text-white bg-blue-500 rounded"
      @click="login"
    >
      Log in with Github
    </button>
  </div>
</template>

<script setup lang="ts">
const { title } = useCourse();

const user = useSupabaseUser();
const supabase = useSupabaseClient();

// based on https://github.com/nuxt-modules/supabase/blob/main/demo/pages/index.vue
watchEffect(() => {
  if (user.value) {
    navigateTo('/');
  }
});

const login = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${useRuntimeConfig().public.baseUrl}/confirm`,
    },
  });

  if (error) {
    console.error(error);
  }
};
</script>
