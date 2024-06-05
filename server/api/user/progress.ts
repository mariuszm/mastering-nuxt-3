import { PrismaClient } from '@prisma/client';
import type { ChapterProgress, CourseProgress } from '@/types/course';
import type {
  ChapterOutline,
  LessonOutline,
} from '@/server/api/course/meta.get';

const prisma = new PrismaClient();

export default defineEventHandler(async event => {
  // throw a 401 if there is no user logged in
  protectRoute(event);

  // get user email from the supabase user if there is one
  const { email: userEmail } = event.context.user;

  // get the progress from the db
  const userProgress = await prisma.lessonProgress.findMany({
    where: {
      userEmail,
      // we only wanna get the progress for the first course right now
      Lesson: {
        Chapter: {
          Course: {
            id: 1,
          },
        },
      },
    },
    // grab the slugs for the lesson as well as the chapter
    select: {
      completed: true,
      Lesson: {
        select: {
          slug: true,
          Chapter: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  // get course outline from meta endpoint
  // NOTE: $fetch is isomorphic so can be used on the server side as well
  // Because of the Nuxt optimizations, instead of making an actual HTTP request
  // we can directly call this method (with $fetch).
  // So no need to go through all of those HTTP layers, and as an internal call
  // it is more efficient.
  const courseOutline = await $fetch('/api/course/meta');

  if (!courseOutline) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Course outline not found',
    });
  }

  // marry the data together to create full progress outline:
  // use the course outline and user progress to create a nested object
  // with the progress for each lesson
  const progress = courseOutline.chapters.reduce(
    (courseProgress: CourseProgress, chapter: ChapterOutline) => {
      // collect the progress for each chapter in the course
      courseProgress[chapter.slug] = chapter.lessons.reduce(
        (chapterProgress: ChapterProgress, lesson: LessonOutline) => {
          // collect the progress for each lesson in the chapter
          chapterProgress[lesson.slug] =
            userProgress.find(
              progress =>
                progress.Lesson.slug === lesson.slug &&
                progress.Lesson.Chapter.slug === chapter.slug,
            )?.completed || false;

          return chapterProgress;
        },
        {},
      );

      return courseProgress;
    },
    {},
  );

  return progress;
});
