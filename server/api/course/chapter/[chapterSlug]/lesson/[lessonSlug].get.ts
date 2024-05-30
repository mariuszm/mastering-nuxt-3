import course from '@/server/courseData';
import type { Course, LessonWithPath } from "@/types/course";

export default defineEventHandler((event): LessonWithPath => {
  // TODO: investigate why Hoppscotch doesn't return 405 error (response in JSON)
  // when using POST method on .get.ts file.
  // As a workaround, you can remove the metod from .get.ts filename and
  // throw an error like this:
  //   if (event.method !== 'GET') {
  //     throw createError({
  //       statusCode: 405,
  //       statusMessage: 'You requested in the wrong neighborhood',
  //     });
  //   }
  // More about the bug: https://github.com/nuxt/nuxt/issues/26073

  const { chapterSlug, lessonSlug } = event.context.params ?? {};

  const chapter = (course as Course).chapters.find(chapter => chapter.slug === chapterSlug);

  if (!chapter) {
    throw createError({
      statusCode: 404,
      message: 'Chapter not found',
    });
  }

  const lesson = chapter.lessons.find(lesson => lesson.slug === lessonSlug);

  if (!lesson) {
    throw createError({
      statusCode: 404,
      message: 'Lesson not found',
    });
  }

  return {
    ...lesson,
    path: `/course/chapter/${chapterSlug}/lesson/${lessonSlug}`,
  };
});
