<template>
  <div>
    <p class="mt-0 mb-1 font-bold uppercase text-slate-400">
      Lesson {{ chapter.number }} - {{ lesson?.number }}
    </p>
    <h2 class="my-0">{{ lesson?.title }}</h2>
    <div class="flex mt-2 mb-8 space-x-4">
      <NuxtLink
        v-if="lesson?.sourceUrl"
        class="font-normal text-gray-500 text-md"
        :to="lesson?.sourceUrl"
      >
        Download Source Code
      </NuxtLink>
      <NuxtLink
        v-if="lesson?.downloadUrl"
        class="font-normal text-gray-500 text-md"
        :to="lesson?.downloadUrl"
      >
        Download Video
      </NuxtLink>
    </div>
    <VideoPlayer v-if="lesson?.videoId" :video-id="lesson?.videoId" />
    <p>{{ lesson?.text }}</p>
    <LessonCompleteButton
      v-if="user"
      :model-value="isCompleted"
      @update:model-value="toggleComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { useCourseProgress } from '@/store/courseProgress';

const user = useSupabaseUser();
const course = await useCourse();
const route = useRoute();
const { chapterSlug, lessonSlug } = route.params;

// Instead of passing in a generic string ref, we pass in the slugs
// so the composable itself will calculate what that URL should be.
// The structure of the URL is encapsulated nicely within the composable.
const lesson = await useLesson(chapterSlug as string, lessonSlug as string);

const store = useCourseProgress();
const { initialize, toggleComplete } = store;

initialize();

definePageMeta({
  middleware: [
    // eslint-disable-next-line
    async function ({ params }, from) {
      const course = await useCourse();

      const chapter = course.value.chapters.find(
        chapter => chapter.slug === params.chapterSlug,
      );

      if (!chapter) {
        return abortNavigation(
          createError({
            statusCode: 404,
            message: 'Chapter not found',
          }),
        );
      }

      const lesson = chapter.lessons.find(
        lesson => lesson.slug === params.lessonSlug,
      );

      if (!lesson) {
        return abortNavigation(
          createError({
            statusCode: 404,
            message: 'Lesson not found',
          }),
        );
      }
    },

    // adding second middleware
    'auth',
  ],
});

// TEST: simulate an error when opening 3rd lesson
// if (route.params.lessonSlug === '3-typing-component-events') {
//   console.log(
//     route.params.paramthatdoesnotexistwhoops.capitalizeIsNotAMethod(),
//   );
// }

// check if the current lesson is completed
const isCompleted = computed(() => {
  return store.progress?.[chapterSlug as string]?.[lessonSlug as string] || 0;
});

const chapter = computed(() => {
  return course.value.chapters.find(
    chapter => chapter.slug === route.params.chapterSlug,
  )!;
});

const title = computed(() => {
  if (!lesson.value) return '';
  return `${lesson.value.title} - ${course.value.title}`;
});

useHead({ title });
</script>
