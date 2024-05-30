import type { Chapter } from '@/types/course';
import course from '@/server/courseData';

// title / number - needed to display on the page for chapters / lessons
// slug - needed to construct the path correctly
type OutlineBase = {
  title: string;
  slug: string;
  number: number;
}

type OutlineChapter = OutlineBase & {
  lessons: OutlineLesson[];
}

type OutlineLesson = OutlineBase & {
  path: string;
}

type CourseMeta = {
  title: string;
  chapters: OutlineChapter[];
}

// 1. provide the course title
// 2. provide an outline of all of the different lessons (not all data is necessary).
// We could pick "course" but there's no need to send it all over to the browser.

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
  }, []);

  return {
    title: course.title,
    chapters: outline,
  }
});
