import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async event => {
  const user = await serverSupabaseUser(event);
  event.context.user = user; // add user onto an event
});
