<template>
  <div>
    <div class="flex items-center justify-between w-full mb-4">
      <h1 class="text-3xl">
        <span class="font-medium">
          <span class="font-bold">{{ course.title }}</span>
        </span>
      </h1>
      <UserCard />
    </div>

    <div class="flex flex-row justify-center flex-grow">
      <div
        class="prose mr-4 p-8 bg-white rounded-md min-w-[20ch] max-w-[30ch] flex flex-col"
      >
        <h3>Chapters</h3>
        <div
          v-for="(chapter, chapterIndex) in course.chapters"
          :key="chapter.slug"
          class="flex flex-col mb-4 space-y-1"
        >
          <h4 class="flex items-center justify-between">
            {{ chapter.title }}
            <span
              v-if="percentageCompleted && user"
              class="text-sm text-emerald-500"
              >{{ percentageCompleted.chapters[chapterIndex] }}%</span
            >
          </h4>
          <NuxtLink
            v-for="(lesson, lessonIndex) in chapter.lessons"
            :key="lesson.slug"
            class="flex flex-row px-4 py-1 -mx-4 space-x-1 font-normal prose-sm no-underline"
            :to="lesson.path"
            :class="{
              'text-blue-500': lesson.path === $route.fullPath,
              'text-gray-600': lesson.path !== $route.fullPath,
            }"
          >
            <span class="text-gray-500">{{ lessonIndex + 1 }}.</span>
            <span>{{ lesson.title }}</span>
          </NuxtLink>
        </div>
        <div
          v-if="percentageCompleted"
          class="flex items-center justify-between mt-8 text-sm font-medium text-gray-500"
        >
          Course completion:
          <span>{{ percentageCompleted.course }}%</span>
        </div>
      </div>

      <div class="prose p-12 bg-white rounded-md w-[65ch]">
        <NuxtErrorBoundary>
          <NuxtPage />
          <template #error="{ error }">
            <p>
              Oh no, something went wrong with the lesson!
              <code>{{ error }}</code>
            </p>
            <p>
              <button
                class="px-3 py-1 font-bold text-white bg-gray-500 rounded hover:cursor-pointer"
                @click="resetError(error)"
              >
                Reset
              </button>
            </p>
          </template>
        </NuxtErrorBoundary>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';
import { useCourseProgress } from '~/store/courseProgress';

const user = useSupabaseUser();
const course = await useCourse();
const firstLesson = await useFirstLesson();

// get chapter completion percentages
const { percentageCompleted } = storeToRefs(useCourseProgress());

// NOTE: we're calling useCourse and useFirstLesson will immediately call
// useCourse itself. But because of the caching (provided by useAsyncData)
// we won't ever make multiple calls to an endpoint.

const resetError = async (
  error: Ref<NuxtError<unknown> | null | undefined>,
) => {
  await navigateTo(firstLesson.path);
  error.value = null;
};
</script>
