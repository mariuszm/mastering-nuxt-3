export default defineNuxtRouteMiddleware(async to => {
  const user = useSupabaseUser();
  const { data: hasAccess } = await useFetch('/api/user/hasAccess', {
    headers: useRequestHeaders(['cookie']),
  });

  if (hasAccess.value || to.params.chapterSlug === '1-chapter-1') {
    return;
  }

  // prevent logging in with github if user has not purchased course
  if (user.value && !hasAccess.value) {
    const client = useSupabaseClient();
    await client.auth.signOut();
  }

  return navigateTo(`/login?redirectTo=${to.path}`);
});
