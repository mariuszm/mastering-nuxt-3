import { defineStore } from 'pinia';

export const useCourseProgress = defineStore('courseProgress', () => {
  // initialize progress from local storage
  const progress = useLocalStorage('progress', {});
  const initialized = ref(false);

  // The initialize() function is there because
  // we cannot have our setup here be async.
  // But we wanna use the async data (get it from endpoints later on)
  // so it has to be put into an async method as well - which is this
  // "initialize" action

  async function initialize() {
    // if the course has already been initialized, return
    if (initialized.value) return;
    initialized.value = true;

    // TODO: fetch user progress from endpoint
  }

  // toggle the progress of a lesson based on chapters slug and lesson slug
  const toggleComplete = async (chapter: string, lesson: string) => {
    // if there's no user we can't update the progress
    const user = useSupabaseUser();
    if (!user.value) return;

    // grab chapter and lesson slugs from the route if they're not provided
    if (!chapter || !lesson) {
      const {
        params: { chapterSlug, lessonSlug },
      } = useRoute();

      chapter = chapterSlug as string;
      lesson = lessonSlug as string;
    }

    // get the current progress for the lesson
    const currentProgress = progress.value[chapter]?.[lesson];

    // optimistically update the progress value in the UI
    progress.value[chapter] = {
      ...progress.value[chapter],
      [lesson]: !currentProgress,
    };

    // TODO: update in DB
  };

  return {
    initialize,
    progress,
    toggleComplete,
  };
});
