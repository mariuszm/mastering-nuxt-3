import type { LessonWithPath } from '@/types/course';

export const useLesson = async (chapterSlug: string, lessonSlug: string) =>
  useFetchWithCache<LessonWithPath>(
    `/api/course/chapter/${chapterSlug}/lesson/${lessonSlug}`,
  );
