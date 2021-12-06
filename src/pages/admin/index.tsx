import { Fragment } from 'react';
import { Tab } from '@headlessui/react';
import { Role } from '@prisma/client';
import cx from 'classnames';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { dehydrate, QueryClient } from 'react-query';
import EventForm from '~/components/admin/EventForm';
import EventList from '~/components/admin/EventList';
import Seo from '~/components/common/Seo';
import { getEvents } from '~/helpers/api';

const tabs = ['행사 등록', '행사 수정'];

export default function Admin() {
  return (
    <>
      <Seo description="My Cat 관리자 페이지" />
      <Tab.Group>
        <Tab.List className="inline-flex p-1 space-x-1 bg-gray-300 rounded-xl mb-8">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                cx(
                  'py-2 px-4 font-medium rounded-lg focus:outline-none',
                  selected ? 'bg-white shadow' : 'text-white',
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels as={Fragment}>
          <Tab.Panel className="outline-none">
            <EventForm />
          </Tab.Panel>
          <Tab.Panel className="outline-none">
            <EventList />
            <EventForm edit />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (session?.role !== Role.ADMIN) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery('events', getEvents);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
