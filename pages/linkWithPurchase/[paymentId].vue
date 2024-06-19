<script setup>
const user = useSupabaseUser();

watchEffect(async () => {
  if (!user.value) return;

  const route = useRoute();
  await useFetch(`/api/user/linkWithPurchase/${route.params.paymentId}`, {
    headers: useRequestHeaders(['cookie']), // pass along the request headers to keep the session
  });

  await navigateTo('/', {
    replace: true, // instead of back to this page, the user will be back to the landing page
  });
});

const render = () => {};
</script>
