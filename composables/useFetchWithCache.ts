import { StorageSerializers } from '@vueuse/core';

export const useFetchWithCache = async <T>(url: string) => {
  // use sessionStorage to cache the data
  const cached = useSessionStorage<T>(
    url, // use url as the key
    null,
    {
      // by passing null as default it can't automatically
      // determine which serializer to use
      serializer: StorageSerializers.object,
    },
  );

  // "cached" has a RemovableRef<T>,
  // where T is the type that the sessionStorage returns back.
  // If this value already exists, then "cached" will be the data
  // that we've already got. But if we haven't yet fetched from that,
  // then it will be null.

  // check if we've hit the cache - if not then fetch that data
  if (!cached.value) {
    const { data, error } = await useFetch<T>(
      url,
      // By default, SSR context doesn't have access to cookies.
      // When on the server-side, take the headers from the incoming request
      // (which is causing the render to happen in the first place),
      // grab the cookie from it and pass along on our isometric fetch.
      // So fetching on the client-side we have access to these cookies
      // (by default the browser will always pass these cookies along).
      // But on the server-side Nuxt will just call that method directly.
      // When we do that, the cookie is not present (it's just a method call),
      // so we need to make sure that Nuxt knows that we wanna pass these headers along.
      // NOTE: In latest version of Nuxt this is probably not needed anymore.
      { headers: useRequestHeaders(['cookie']) },
    );

    if (error.value) {
      throw createError({
        ...error.value,
        statusMessage: `Could not fetch data from ${url}`,
      });
    }

    // put this data into cache after it's fetched
    cached.value = data.value as T;
  } else {
    console.log(`Getting valur from cache for ${url}`);
  }

  return cached;
};
