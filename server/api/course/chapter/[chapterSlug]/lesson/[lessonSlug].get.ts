import course from '@/server/courseData';
import type { Course, LessonWithPath } from "@/types/course";

export default defineEventHandler((event): LessonWithPath => {
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
