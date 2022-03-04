import Head from 'next/head';
import useSWR from 'swr';
import fetcher from '../../../lib/fetcher';
import { useRouter } from 'next/router';
import {
  Container,
  Table
} from 'react-bootstrap';
import Layout from '../../../layouts/Main';
// import { meta } from '../../../data';

const ProgramSubmissions = () => {
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
        {!error && program && <Table striped bordered hover>
          <thead>
            <tr>
              <th>_id</th>
            </tr>
          </thead>
          <tbody>
            {program.submissions.map((submission, index) => (
              <tr key={index}>
                <td>{submission._id}</td>
              </tr>
            ))}
          </tbody>
        </Table>}
      </Container>
    </Layout>
  );
};

export default ProgramSubmissions;