import useSWR from 'swr';
import fetcher from '../../../lib/fetcher';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Container,
} from 'react-bootstrap';
import Layout from '../../../layouts/Main';
// import { meta } from '../../data';
import ProgramForm from '../../../components/ProgramForm';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const ProgramEdit = withPageAuthRequired(() => {
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
        {!error && program && <ProgramForm program={program} />}
      </Container>
    </Layout>
  );
});

export default ProgramEdit;