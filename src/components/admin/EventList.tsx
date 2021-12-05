import cx from 'classnames';
import { useRecoilState } from 'recoil';
import { eventIdState } from '~/helpers/store';
import useEventsQuery from '~/queries/useEventsQuery';

export default function EventList() {
  const [eventId, setEventId] = useRecoilState(eventIdState);
  const { data: events } = useEventsQuery();

  return (
    <ul className="mb-8 list-outside list-disc ml-4">
      {events?.map((event) => (
        <li key={event.id}>
          <button
            className={cx(eventId === event.id && 'text-sky-500')}
            onClick={() => setEventId(event.id)}
          >
            {event.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
