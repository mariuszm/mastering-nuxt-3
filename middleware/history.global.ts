export default defineNuxtRouteMiddleware(to => {
   const navigationHistory = useLocalStorage<string[]>('history', []);
   navigationHistory.value.push(to.path);
})
