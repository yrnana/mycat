import { useCallback, useEffect, useState } from 'react';
import { PlusIcon, SearchIcon, XIcon } from '@heroicons/react/solid';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { formatISO, set } from 'date-fns';
import { useFieldArray, useForm, UseFormSetValue } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { z } from 'zod';
import type { KakaoPlaceDocument, PostEventsRequestBody } from '~/@types';
import Button from '~/components/common/Button';
import Input, { FormControl, Label } from '~/components/common/Input';
import {
  deleteEvent,
  getEvent,
  getPlaceByKeyword,
  postEvent,
  postUpload,
  putEvent,
} from '~/helpers/api';
import { eventIdState } from '~/helpers/store';
import DateTimeInput from '../common/DateTimeInput';

type FormValues = {
  name: string;
  homepage: string;
  place: {
    id: number;
    name: string;
    lat: number;
    lng: number;
    detail?: string;
  };
  dates: {
    startTime: Date;
    endTime: Date;
    closingTime?: Date;
  }[];
  images?: FileList;
};

const schema: z.ZodSchema<FormValues> = z.object({
  name: z.string(),
  homepage: z.string().url(),
  place: z.object({
    id: z.number(),
    name: z.string(),
    lat: z.number(),
    lng: z.number(),
    detail: z.string().optional(),
  }),
  dates: z
    .array(
      z.object({
        startTime: z.date(),
        endTime: z.date(),
        closingTime: z.date().optional(),
      }),
    )
    .nonempty(),
  images: z.any().optional(),
});

type EventFormProps = {
  edit?: boolean;
};

export default function EventForm({ edit }: EventFormProps) {
  const queryClient = useQueryClient();

  const { control, register, handleSubmit, getValues, setValue, reset } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      shouldUseNativeValidation: true,
    });

  const { fields, append, remove } = useFieldArray({
    name: 'dates',
    control,
  });

  const [eventId, setEventId] = useRecoilState(eventIdState);
  const { data } = useQuery(
    ['event', eventId],
    ({ queryKey: [, eventId] }) => getEvent(eventId || ''),
    {
      enabled: !!eventId,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 3,
    },
  );

  const onReset = useCallback(() => {
    remove();
    reset();
  }, [remove, reset]);

  useEffect(() => {
    if (data) {
      const { name, homepage, place, placeDetail, dates } = data;
      setValue('name', name);
      setValue('homepage', homepage);
      setValue('place.name', place.name);
      setValue('place.lat', place.lat);
      setValue('place.lng', place.lng);
      setValue('place.id', place.id);
      placeDetail && setValue('place.detail', placeDetail);
      setValue(
        'dates',
        dates.map(({ startTime, endTime, closingTime }) => ({
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          closingTime: closingTime ? new Date(closingTime) : undefined,
        })),
      );
      setValue('images', undefined);
    }
  }, [data, reset, setValue]);

  useEffect(() => {
    return () => {
      onReset();
      setEventId(undefined);
    };
  }, [onReset, setEventId]);

  const { mutateAsync: uploadFiles } = useMutation(postUpload);

  const { mutateAsync: addEvent } = useMutation(postEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries('events');
      toast.success('등록 성공');
      onReset();
    },
  });

  const { mutateAsync: editEvent } = useMutation(putEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries('events');
      toast.success('수정 성공');
    },
  });

  const { mutateAsync: removeEvent } = useMutation(deleteEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries('events');
      toast.success('삭제 성공');
      setEventId(undefined);
    },
  });

  const onSubmit = async ({
    name,
    homepage,
    dates,
    place: { detail, ...place },
    images,
  }: FormValues) => {
    let image: string | null = null;
    if (edit && data?.image) {
      image = data?.image;
    }
    if (images && images.length > 0) {
      const { files } = await uploadFiles({
        name: 'files',
        files: images,
      });
      if (files.length > 0) {
        image = files[0].path.replace(/^public/, '');
      }
    }

    const values: PostEventsRequestBody = {
      event: {
        id: eventId,
        name,
        homepage,
        image,
        placeDetail: detail || null,
      },
      place,
      dates: dates.map(({ closingTime, endTime, startTime }) => ({
        startTime: formatISO(startTime),
        endTime: formatISO(endTime),
        closingTime: closingTime ? formatISO(closingTime) : null,
      })),
    };

    if (eventId) {
      await editEvent(values);
    } else {
      await addEvent(values);
    }
  };

  const [placeDocs, setPlaceDocs] = useState<
    KakaoPlaceDocument[] | undefined
  >();

  if (edit && !eventId) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-8">행사 {edit ? '수정' : '등록'}</h2>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <Label required htmlFor="name">
              행사명
            </Label>
            <Input
              type="text"
              className="w-96"
              placeholder="행사명"
              autoComplete="off"
              {...register('name', {
                required: '이름을 입력하세요.',
              })}
            />
          </FormControl>
          <FormControl>
            <Label required htmlFor="homepage">
              홈페이지
            </Label>
            <Input
              type="url"
              className="w-96"
              placeholder="https://example.com"
              autoComplete="off"
              {...register('homepage', {
                required: 'URL을 입력하세요.',
              })}
            />
          </FormControl>
          <FormControl>
            <Label required>장소</Label>
            <div className="relative max-w-full">
              <Input
                type="text"
                className="w-96"
                placeholder="장소 검색"
                {...register('place.name', {
                  required: '장소를 입력하세요.',
                })}
                icon={<SearchIcon className="w-5 h-5" />}
                onClickIcon={async () => {
                  const placeName = getValues('place.name');
                  if (!placeName) {
                    // TODO: setError
                    toast.error('장소를 입력하세요');
                    return;
                  }
                  const { documents } = await getPlaceByKeyword(placeName);
                  setPlaceDocs(documents);
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const placeName = getValues('place.name');
                    const { documents } = await getPlaceByKeyword(placeName);
                    setPlaceDocs(documents);
                  }
                }}
              />
              {placeDocs && (
                <SearchList
                  placeDocs={placeDocs}
                  setPlaceDocs={setPlaceDocs}
                  setValue={setValue}
                />
              )}
            </div>
            <div className="mt-2 flex flex-col space-y-2 max-w-full">
              <Input
                type="text"
                className="w-96"
                placeholder="추가 장소 정보 (옵션)"
                {...register('place.detail')}
              />
              <Input
                type="text"
                className="w-96"
                placeholder="위도"
                readOnly
                {...register('place.lat', {
                  required: '장소를 선택하세요.',
                })}
              />
              <Input
                type="text"
                className="w-96"
                readOnly
                placeholder="경도"
                {...register('place.lng', {
                  required: '장소를 선택하세요.',
                })}
              />
              <Input
                type="text"
                className="w-96"
                readOnly
                placeholder="장소 ID"
                {...register('place.id', {
                  required: '장소를 선택하세요.',
                })}
              />
            </div>
          </FormControl>
          <FormControl>
            <Label required>날짜 및 시간</Label>
            {fields.map((field, fieldIdx) => (
              <div
                key={field.id}
                className="flex flex-wrap flex-col lg:flex-row items-start lg:space-x-4 mt-2 mb-4 lg:mt-0 lg:mb-0"
              >
                <FormControl nested>
                  <Label required htmlFor={`dates.${fieldIdx}.startTime`}>
                    시작 시간
                  </Label>
                  <DateTimeInput
                    name={`dates.${fieldIdx}.startTime`}
                    control={control}
                  />
                </FormControl>
                <FormControl nested>
                  <Label required htmlFor={`dates.${fieldIdx}.endTime`}>
                    끝나는 시간
                  </Label>
                  <DateTimeInput
                    name={`dates.${fieldIdx}.endTime`}
                    control={control}
                  />
                </FormControl>
                <FormControl nested>
                  <Label htmlFor={`dates.${fieldIdx}.closingTime`}>
                    입장마감 시간
                  </Label>
                  <DateTimeInput
                    name={`dates.${fieldIdx}.closingTime`}
                    control={control}
                  />
                </FormControl>
                <Button
                  type="button"
                  className="!min-w-0 w-10 lg:mt-10"
                  onClick={() => remove(fieldIdx)}
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => {
                const startTime = set(new Date(), {
                  hours: 10,
                  minutes: 0,
                  seconds: 0,
                });
                append({
                  startTime,
                  endTime: set(startTime, {
                    hours: 17,
                  }),
                  closingTime: undefined,
                });
              }}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              <span>추가</span>
            </Button>
          </FormControl>
          <FormControl>
            <Label>이미지</Label>
            <FileInput type="file" accept="image/*" {...register('images')} />
          </FormControl>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <Button type="submit">{edit ? '수정' : '등록'}</Button>
            <Button type="button" color="secondary" onClick={onReset}>
              초기화
            </Button>
            {edit && eventId && (
              <Button type="button" onClick={() => removeEvent(eventId)}>
                삭제
              </Button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

interface SearchListProps {
  placeDocs: KakaoPlaceDocument[];
  setPlaceDocs: (placeDocs: KakaoPlaceDocument[] | undefined) => void;
  setValue: UseFormSetValue<FormValues>;
}

function SearchList({ placeDocs, setPlaceDocs, setValue }: SearchListProps) {
  // click away listener
  useEffect(() => {
    const hide = () => setPlaceDocs(undefined);
    window.addEventListener('click', hide);
    return () => window.removeEventListener('click', hide);
  }, [setPlaceDocs]);

  return (
    <ul
      className="absolute max-w-full z-20 bg-white rounded-md w-96 shadow divide-y divide-gray-100 divide-solid"
      style={{ inset: '61px 0 auto 0' }}
    >
      {placeDocs.length > 1 ? (
        placeDocs.map((doc) => (
          <li key={doc.id}>
            <button
              type="button"
              className="flex flex-col py-2 px-4 w-full"
              onClick={() => {
                setValue('place.name', doc.placeName);
                setValue('place.lat', Number(doc.y));
                setValue('place.lng', Number(doc.x));
                setValue('place.id', Number(doc.id));
              }}
            >
              <div>{doc.placeName}</div>
              <div className="text-sm text-gray-500">{doc.addressName}</div>
            </button>
          </li>
        ))
      ) : (
        <li className="py-4 px-4">검색결과 없음</li>
      )}
    </ul>
  );
}

const FileInput = styled.input`
  cursor: pointer;
  max-width: 100%;
  &::-webkit-file-upload-button {
    visibility: hidden;
    width: 0px;
  }
  &::before {
    content: '이미지 선택';
    text-align: center;
    appearance: none;
    outline: none;
    white-space: nowrap;
    display: inline-block;
    border: 0;
    border-radius: 0.375rem;
    min-width: 7rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    font-weight: 600;
    --tw-text-opacity: 1;
    color: rgba(255, 255, 255, var(--tw-text-opacity));
    --tw-bg-opacity: 1;
    background-color: rgba(56, 189, 248, var(--tw-bg-opacity));
  }
  &:hover::before {
    --tw-bg-opacity: 1;
    background-color: rgba(14, 165, 233, var(--tw-bg-opacity));
  }
  &:active::before {
    --tw-bg-opacity: 1;
    background-color: rgba(14, 165, 233, var(--tw-bg-opacity));
  }
`;
