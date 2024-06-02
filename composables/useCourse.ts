// we can get rid of all the stuff because all the stuff (like data retrieval,
// mapping it and adding different path to it, adding types) is now done

import type { CourseMeta } from '@/types/course';

// by the Meta endpoint
export default async () => useFetchWithCache<CourseMeta>('/api/course/meta');
