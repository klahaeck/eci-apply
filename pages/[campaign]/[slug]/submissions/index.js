import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import fetcher from '../../../../lib/fetcher';
import { useRouter } from 'next/router';
import {
  Container,
  Table,
  Button
} from 'react-bootstrap';
import Layout from '../../../../layouts/Main';
import ToolbarProgram from '../../../../Components/ToolbarProgram';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { isAdmin, isJuror } from '../../../../lib/utils';
// import { meta } from '../../../data';

const ProgramSubmissions = () => {
  const router = useRouter()
  const { campaign, slug } = router.query

  const { data: program, error: errorProgram } = useSWR(`/api/programs/${campaign}/${slug}`, fetcher);
  const { data: submissions, error: errorSubmissions, mutate } = useSWR(program ? `/api/submissions?programId=${program._id}` : null, fetcher);

  const removeSubmission = async (id) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
      mutate();
    }
  };

  return (
    <Layout>
      <Head>
        <title>VAF - {campaign} {slug}</title>
      </Head>

      <Container fluid>
        {(errorProgram || errorSubmissions) && <div>Failed to load</div>}
        {!submissions && <div>Loading...</div>}
        {submissions && <>
          <ToolbarProgram program={program} />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>User</th>
                <th>Title</th>
                <th>Work Samples</th>
                <th>My Rating</th>
                <th>Avg. Rating</th>
                <th>Eligible</th>
                <th className="text-end">Tools</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={index}>
                  <td>{submission.user.name}</td>
                  <td>{submission.title}</td>
                  <td>{submission.assetsCount}</td>
                  <td>{submission.myRating}</td>
                  <td>{submission.avgRating}</td>
                  <td>{submission.eligible.toString()}</td>
                  <td className="text-end">
                    <Link href={`/${program.campaign}/${program.slug}/submissions/${submission._id}`} passHref>
                      <Button variant="info" size="sm">Show</Button>
                    </Link>

                    <Button variant="danger" size="sm" className="ms-1" onClick={() => removeSubmission(submission._id)}>Destroy</Button>
                  </td>
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