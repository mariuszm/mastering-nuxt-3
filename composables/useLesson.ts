export const useLesson = async (chapterSlug: string, lessonSlug: string) => {
  // const { data, error } = await useFetch(
  //   `/api/course/chapter/${chapterSlug}/lesson/${lessonSlug}`,
  // );
  const { data, error } = await useAsyncData(() =>
    $fetch(`/api/course/chapter/${chapterSlug}/lesson/${lessonSlug}`),
  );

  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not fetch ${lessonSlug} in chapter ${chapterSlug}`,
    });
  }

  return data;
};
