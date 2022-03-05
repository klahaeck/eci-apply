import Head from 'next/head';
import useSWR from 'swr';
import fetcher from '../../../lib/fetcher';
import { useRouter } from 'next/router';
import {
  Container,
  Table
} from 'react-bootstrap';
import Layout from '../../../layouts/Main';
import ProgramToolbar from '../../../Components/ProgramToolbar';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { isAdmin, isJuror } from '../../../lib/utils';
// import { meta } from '../../../data';

const ProgramSubmissions = () => {
  const router = useRouter()
  const { campaign, slug } = router.query

  const { data: program, error: errorProgram } = useSWR(`/api/programs/${campaign}/${slug}`, fetcher);
  const { data: submissions, error: errorSubmissions } = useSWR(program ? `/api/submissions?programId=${program._id}` : null, fetcher);

  return (
    <Layout>
      <Head>
        <title>VAF - {campaign} {slug}</title>
      </Head>

      <Container fluid>
        {errorSubmissions && <div>Failed to load</div>}
        {!errorSubmissions && !submissions && <div>Loading...</div>}
        {!errorSubmissions && submissions && <>
          <ProgramToolbar program={program} />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>_id</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={index}>
                  <td>{submission._id}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>}
      </Container>
    </Layout>
  );
};

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ({ req, res }) => {
    const { user } = getSession(req, res);
    if (!user || (!isAdmin(user) && !isJuror(user))) {
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

export default ProgramSubmissions;