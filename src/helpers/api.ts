import axios from 'axios';
import type {
  GetEventResponse,
  GetEventsResponse,
  KakaoPlace,
  PostEventsRequestBody,
  PostUploadsResponse,
} from '~/@types';
import { toCamelCase } from '~/helpers/utils';

export const instance = axios.create();

instance.interceptors.response.use((response) => {
  return {
    ...response,
    data: response.data ? toCamelCase(response.data) : undefined,
  };
});

export async function getPlaceByKeyword(keyword: string) {
  const { data } = await instance.get<KakaoPlace>(
    'https://dapi.kakao.com/v2/local/search/keyword.json',
    {
      params: {
        page: 1,
        size: 5,
        sort: 'accuracy',
        query: keyword,
      },
      headers: {
        Authorization: 'KakaoAK ae5a5c92402a7b1d64ac28ecd77b5f34',
      },
    },
  );
  return data;
}

export async function getEvents() {
  const { data } = await axios.get<GetEventsResponse>(
    `http://localhost:3000/api/events`,
  );
  return data;
}

export async function getEvent(eventId: string) {
  const { data } = await axios.get<GetEventResponse>(
    `http://localhost:3000/api/events/${eventId}`,
  );
  return data;
}

export async function postEvent(event: PostEventsRequestBody) {
  const { data } = await axios.post<GetEventResponse>('/api/events', event);
  return data;
}

export async function putEvent(event: PostEventsRequestBody) {
  const eventId = event.event.id!;
  const { data } = await axios.put<GetEventResponse>(
    `/api/events/${eventId}`,
    event,
  );
  return data;
}

export async function deleteEvent(eventId: string) {
  await axios.delete(`/api/events/${eventId}`);
}

export async function postUpload({
  name,
  files,
}: {
  name: string;
  files: FileList;
}) {
  const formData = new FormData();

  Array.from(files).forEach((file) => {
    formData.append(name, file);
  });

  const { data } = await axios.post<PostUploadsResponse>(
    '/api/uploads',
    formData,
    {
      headers: { 'content-type': 'multipart/form-data' },
    },
  );

  return data;
}
