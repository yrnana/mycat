import { useMemo } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import type { GetEventResponse } from '~/@types';

type Props = {
  event: GetEventResponse;
};

type Params = {
  id: string;
};

export default function EventDetail({ event }: Props) {
  const { image, dates, name, place, placeDetail, homepage } = event;

  const date = useMemo(() => {
    const startDate = new Date(dates[0].startTime);
    const endDate = new Date(dates[dates.length - 1].endTime);
    const startStr = format(startDate, 'yyyy년 MM월 dd일(iii)', {
      locale: ko,
    });
    const endStr = format(endDate, 'MM월 dd일(iii)', {
      locale: ko,
    });
    return `${startStr} ~ ${endStr}`;
  }, [dates]);

  const times = useMemo(() => {
    const isAllEqual = dates.every(
      (d) =>
        String(dates[0].startTime).substring(11) ===
          String(d.startTime).substring(11) &&
        String(dates[0].endTime).substring(11) ===
          String(d.endTime).substring(11) &&
        String(dates[0].closingTime).substring(11) ===
          String(d.closingTime).substring(11),
    );
    if (isAllEqual) {
      const startTime = format(new Date(dates[0].startTime), 'HH:mm', {
        locale: ko,
      });
      const endTime = format(new Date(dates[0].endTime), 'HH:mm');
      let time = `${startTime} ~ ${endTime}`;
      if (dates[0].closingTime) {
        time += ` (입장마감 ${format(
          new Date(dates[0].closingTime),
          'HH:mm',
        )})`;
      }
      return time;
    }

    return dates.map((date) => {
      const startTime = format(new Date(date.startTime), 'iii : HH:mm', {
        locale: ko,
      });
      const endTime = format(new Date(date.endTime), 'HH:mm');
      let time = `${startTime} ~ ${endTime}`;
      if (date.closingTime) {
        time += ` (입장마감 ${format(new Date(date.closingTime), 'HH:mm')})`;
      }
      return time;
    });
  }, [dates]);

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-10">
      <div className="relative transition-height duration-300 unset-img lg:w-2/5 lg:flex-shrink-0">
        <Image
          src={image || ''}
          alt=""
          layout="fill"
          objectFit="contain"
          quality={50}
          priority
        />
      </div>
      <div className="mt-6 lg:mt-0 lg:flex-grow">
        <h2 className="font-bold text-2xl sm:text-3xl mb-6">{name}</h2>
        <div className="grid grid-cols-table gap-x-4 gap-y-2 text-lg">
          {homepage && (
            <>
              <div className="font-bold">홈페이지</div>
              <div>
                <a href={homepage} className="text-sky-400 hover:text-sky-500">
                  {homepage}
                </a>
              </div>
            </>
          )}
          <div className="font-bold">장소</div>
          <div>
            {place.name}
            {placeDetail ? ` ${placeDetail}` : ''}
          </div>
          <div className="font-bold">기간</div>
          <div>{date}</div>
          <div className="font-bold">시간</div>
          <div className="whitespace-pre-line">
            {typeof times === 'string' ? times : times.join(`\n`)}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({
  params,
}) => {
  const eventId = params?.id;

  if (!eventId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    const { data: event } = await axios.get<GetEventResponse>(
      `http://localhost:3000/api/events/${eventId}`,
    );
    return {
      props: {
        event,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};