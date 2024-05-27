// eslint-disable-next-line
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();
  const isLoggedIn = user.value;

  if (isLoggedIn || to.params.chapterSlug === '1-chapter-1') {
    return;
  }
  return navigateTo(`/login?redirectTo=${to.path}`);
});
