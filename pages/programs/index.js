import Head from 'next/head';
import useSWR from 'swr';
import fetcher from '../../lib/fetcher';
import {
  Container
} from 'react-bootstrap';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import Main from '../../layouts/Main';
import ProgramList from '../../components/ProgramList';
import { isAdmin } from '../../lib/users';
// import { meta } from '../../data';

const Programs = () => {
  const { data: programs, error } = useSWR('/api/programs', fetcher);
  
  return (
    <Main>
      <Head>
        <title>ECI Apply - Programs</title>
      </Head>

      <Container fluid>
        {error && <div>Failed to load</div>}
        {!error && !programs && <div>Loading...</div>}
        {programs?.length && <ProgramList programs={programs} />}
      </Container>
    </Main>
  );
};

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ({ req, res }) => {
    const { user } = getSession(req, res);
    if (!user || !isAdmin(user)) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    return {
      props: {}
    };
  },
});

export default Programs;