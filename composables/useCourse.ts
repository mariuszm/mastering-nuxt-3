import type { CourseOutline } from '@/server/api/course/meta.get';

// by the Meta endpoint
export default async () => useFetchWithCache<CourseOutline>('/api/course/meta');
