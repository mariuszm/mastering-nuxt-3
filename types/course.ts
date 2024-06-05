import type { Lesson } from '@prisma/client';

export type LessonWithPath = Lesson & {
  path: string;
};

export type ChapterProgress = Record<string, boolean>;

export type CourseProgress = Record<string, ChapterProgress>;
