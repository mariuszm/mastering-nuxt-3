import type { LessonWithPath } from '@/types/course';
import { StorageSerializers } from '@vueuse/core';

export const useLesson = async (chapterSlug: string, lessonSlug: string) => {
  // use sessionStorage to cache the lesson data
  const url = `/api/course/chapter/${chapterSlug}/lesson/${lessonSlug}`;
  const lesson = useSessionStorage<LessonWithPath>(
    url, // use url as the key
    null,
    {
      // by passing null as default it can't automatically
      // determine which serializer to use
      serializer: StorageSerializers.object,
    },
  );

  // lesson has a RemovableRef<T>,
  // where T is the type that the sessionStorage returns back.
  // If this value already exists, then lesson will be the lesson
  // that we've already got. But if we haven't yet fetched from that,
  // then it will be null.

  // check if we've hit the cache - if not then fetch that data
  if (!lesson.value) {
    const { data, error } = await useFetch<LessonWithPath>(url);

    if (error.value) {
      throw createError({
        ...error.value,
        statusMessage: `Could not fetch ${lessonSlug} in chapter ${chapterSlug}`,
      });
    }

    // put this data into cache after it's fetched
    lesson.value = data.value;
  } else {
    console.log(
      `Getting lesson ${lessonSlug} in chapter ${chapterSlug} from cache`,
    );
  }

  return lesson;
};
