import { useMemo } from 'react';
import { format } from 'date-fns';
import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { dehydrate, QueryClient } from 'react-query';
import type { DehydratedState } from 'react-query';
import type { GetEventResponse } from '~/@types';
import Seo from '~/components/common/Seo';
import { getEvents } from '~/helpers/api';
import placeholderImg from '~/public/static/images/placeholder.jpg';
import useEventsQuery from '~/queries/useEventsQuery';

type Props = {
  dehydratedState: DehydratedState;
};

export default function Home() {
  const { data: events } = useEventsQuery();

  return (
    <>
      <Seo title="고양이 행사 : My Cat" description="고양이 행사 목록" />
      <ul className="my-4 mx-2 xs:mx-1 sm:mx-0 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-10 sm:gap-20 2xl:gap-24 transition-gap">
        {events?.map((event) => (
          <EventItem key={event.id} {...event} />
        ))}
      </ul>
    </>
  );
}

const EventItem = ({ id, image, name, place, dates }: GetEventResponse) => {
  const date = useMemo(() => {
    const formatStr = 'yyyy.MM.dd';
    const startDate = new Date(dates[0].startTime);
    const endDate = new Date(dates[dates.length - 1].endTime);
    return `${format(startDate, formatStr)} ~ ${format(endDate, formatStr)}`;
  }, [dates]);

  return (
    <li className="relative py-3">
      <Link href={`/events/${id}`}>
        <a>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-sky-500 shadow-md transform -rotate-4 sm:-rotate-6 rounded-3xl"></div>
          <div className="relative bg-white shadow-md overflow-hidden rounded-3xl transition-transform transform hover:scale-110">
            <div>
              <div className="relative transition-height duration-300 h-52 xs:h-60 sm:h-96">
                <Image
                  src={image || placeholderImg}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  quality={50}
                  priority
                />
              </div>
              <div className="m-5 sm:m-6">
                <h2 className="font-bold text-xl sm:text-2xl mb-1 sm:mb-2">
                  {name}
                </h2>
                <div className="text-gray-400 text-sm sm:text-base mb-1">
                  {date}
                </div>
                <div className="text-gray-600 text-sm sm:text-base">
                  {place.name}
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </li>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery('events', getEvents, {
    staleTime: 1000 * 60 * 5,
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
