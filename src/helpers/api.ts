import axios from 'axios';
import type {
  GetEventResponse,
  GetEventsResponse,
  KakaoPlace,
  PostEventsRequestBody,
  PostUploadsResponse,
} from '~/@types';
import {
  NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_KAKAO_CLIENT_ID,
} from '~/helpers/constants';
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
        Authorization: `KakaoAK ${NEXT_PUBLIC_KAKAO_CLIENT_ID}`,
      },
    },
  );
  return data;
}

export async function getEvents() {
  const { data } = await axios.get<GetEventsResponse>(
    `${NEXT_PUBLIC_BASE_URL}/api/events`,
  );
  return data;
}

export async function getEvent(eventId: string) {
  const { data } = await axios.get<GetEventResponse>(
    `${NEXT_PUBLIC_BASE_URL}/api/events/${eventId}`,
  );
  return data;
}

export async function postEvent(event: PostEventsRequestBody) {
  const { data } = await axios.post<GetEventResponse>(
    `${NEXT_PUBLIC_BASE_URL}/api/events`,
    event,
  );
  return data;
}

export async function putEvent(event: PostEventsRequestBody) {
  const eventId = event.event.id!;
  const { data } = await axios.put<GetEventResponse>(
    `${NEXT_PUBLIC_BASE_URL}/api/events/${eventId}`,
    event,
  );
  return data;
}

export async function deleteEvent(eventId: string) {
  await axios.delete(`${NEXT_PUBLIC_BASE_URL}/api/events/${eventId}`);
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
    `${NEXT_PUBLIC_BASE_URL}/api/uploads`,
    formData,
    {
      headers: { 'content-type': 'multipart/form-data' },
    },
  );

  return data;
}
