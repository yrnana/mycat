import { useQuery, UseQueryOptions } from 'react-query';
import { GetEventsResponse } from '../@types';
import { getEvents } from '../helpers/api';

export default function useEventsQuery(
  options?: UseQueryOptions<GetEventsResponse>,
) {
  return useQuery<GetEventsResponse>('events', getEvents, {
    ...options,
    staleTime: 1000 * 60 * 3,
    cacheTime: Infinity,
  });
}
