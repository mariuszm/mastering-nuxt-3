<template>
  <div>
    <p class="mt-0 mb-1 font-bold uppercase text-slate-400">
      Lesson {{ chapter.number }} - {{ lesson.number }}
    </p>
    <h2 class="my-0">{{ lesson.title }}</h2>
    <div class="flex mt-2 mb-8 space-x-4">
      <a
        v-if="lesson.sourceUrl"
        class="font-normal text-gray-500 text-md"
        :href="lesson.sourceUrl"
      >
        Download Source Code
      </a>
      <a
        v-if="lesson.downloadUrl"
        class="font-normal text-gray-500 text-md"
        :href="lesson.downloadUrl"
      >
        Download Video
      </a>
    </div>
    <VideoPlayer v-if="lesson.videoId" :video-id="lesson.videoId" />
    <p>{{ lesson.text }}</p>
  </div>
</template>

<script setup>
const course = useCourse();
const route = useRoute();

const chapter = computed(() => {
  return course.chapters.find(chapter => chapter.slug === route.params.chapterSlug);
});

const lesson = computed(() => {
  return chapter.value.lessons.find(lesson => lesson.slug === route.params.lessonSlug);
});
</script>
