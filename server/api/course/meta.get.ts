import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// generate the object (inside the select query is used)
const lessonSelect = Prisma.validator<Prisma.LessonArgs>()({
  select: {
    title: true,
    slug: true,
    number: true,
  },
});

// get the type out of that object
export type LessonOutline = Prisma.LessonGetPayload<typeof lessonSelect> & {
  path: string;
};

const chapterSelect = Prisma.validator<Prisma.ChapterArgs>()({
  select: {
    title: true,
    slug: true,
    number: true,
    lessons: lessonSelect,
  },
});

export type ChapterOutline = Omit<
  Prisma.ChapterGetPayload<typeof chapterSelect>,
  'lessons'
> & { lessons: LessonOutline[] };

const courseSelect = Prisma.validator<Prisma.CourseArgs>()({
  select: {
    title: true,
    chapters: chapterSelect,
  },
});

export type CourseOutline = Omit<
  Prisma.CourseGetPayload<typeof courseSelect>,
  'chapters'
> & { chapters: ChapterOutline[] };

export default defineEventHandler(async (): Promise<CourseOutline> => {
  const outline = await prisma.course.findFirst(courseSelect);

  // error if there's no course
  if (!outline) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Course not found',
    });
  }

  // map the outline so we can add a path to each lesson
  const chapters = outline.chapters.map(chapter => ({
    ...chapter,
    lessons: chapter.lessons.map(lesson => ({
      ...lesson,
      path: `/course/chapter/${chapter.slug}/lesson/${lesson.slug}`,
    })),
  }));

  return {
    ...outline,
    chapters,
  };
});
