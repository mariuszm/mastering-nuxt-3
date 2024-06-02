import type {
  Chapter,
  CourseMeta,
  OutlineChapter,
  OutlineLesson,
} from '@/types/course';
import course from '@/server/courseData';

// 1. provide the course title
// 2. provide an outline of all of the different lessons (not all data is necessary).
// We could pick "course" but there's no need to send it all over to the browser.
// eslint-disable-next-line
export default defineEventHandler((event): CourseMeta => {
  const outline: OutlineChapter[] = course.chapters.reduce(
    (prev: OutlineChapter[], next: Chapter) => {
      const lessons: OutlineLesson[] = next.lessons.map(lesson => ({
        title: lesson.title,
        slug: lesson.slug,
        number: lesson.number,
        path: `/course/chapter/${next.slug}/lesson/${lesson.slug}`,
      }));

      const chapter: OutlineChapter = {
        title: next.title,
        slug: next.slug,
        number: next.number,
        lessons,
      };

      return [...prev, chapter];
    },
    [],
  );

  return {
    title: course.title,
    chapters: outline,
  };
});
