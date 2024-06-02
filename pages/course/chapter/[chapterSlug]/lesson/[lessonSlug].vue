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
      :model-value="isLessonComplete"
      @update:model-value="throw createError('Could not update');"
    />
  </div>
</template>

<script setup lang="ts">
const course = await useCourse();
const route = useRoute();
const { chapterSlug, lessonSlug } = route.params;

// Instead of passing in a generic string ref, we pass in the slugs
// so the composable itself will calculate what that URL should be.
// The structure of the URL is encapsulated nicely within the composable.
const lesson = await useLesson(chapterSlug as string, lessonSlug as string);

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

// track the state of LessonCompleteButton
const progress = useLocalStorage<boolean[][]>('progress', []);

// grab the state that we're looking for from our progress state
const isLessonComplete = computed(() => {
  if (!lesson.value) return false;

  return (
    progress.value[chapter.value.number - 1]?.[lesson.value.number - 1] ?? false
  );
});

// update progress state
// eslint-disable-next-line
const toggleComplete = () => {
  if (!lesson.value) return;

  // create a chapter array if it doesn't exist
  if (!progress.value[chapter.value.number - 1]) {
    progress.value[chapter.value.number - 1] = [];
  }

  // set the value (toggling it)
  progress.value[chapter.value.number - 1][lesson.value.number - 1] =
    !isLessonComplete.value;
};
</script>
