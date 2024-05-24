<template>
  <div class="w-full max-w-2xl prose h-9">
    <h1>Log in to {{ title }}</h1>
    <button class="px-4 py-2 font-bold text-white bg-blue-500 rounded">
      Log in with Github
    </button>
  </div>
</template>

<script setup lang="ts">
const { title } = useCourse();
</script>
