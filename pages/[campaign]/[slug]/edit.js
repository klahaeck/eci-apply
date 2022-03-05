import useSWR from 'swr';
import fetcher from '../../../lib/fetcher';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Container,
} from 'react-bootstrap';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { isAdmin } from '../../../lib/utils';
import Layout from '../../../layouts/Main';
// import { meta } from '../../data';
import ProgramForm from '../../../components/ProgramForm';
import ProgramToolbar from '../../../Components/ProgramToolbar';

const ProgramEdit = () => {
  const router = useRouter()
  const { campaign, slug } = router.query

  const { data: program, error } = useSWR(`/api/programs/${campaign}/${slug}`, fetcher);

  return (
    <Layout>
      <Head>
        <title>VAF - {campaign} {slug}</title>
      </Head>

      <Container fluid>
        {error && <div>Failed to load</div>}
        {!error && !program && <div>Loading...</div>}
        {!error && program && <>
          <ProgramToolbar program={program} />
          <ProgramForm program={program} />
        </>}
      </Container>
    </Layout>
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

export default ProgramEdit;