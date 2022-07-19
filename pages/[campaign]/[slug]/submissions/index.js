import { useState } from 'react';
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
import { isAdmin, isJuror } from '../../../../lib/users';
// import { meta } from '../../../data';

const ProgramSubmissions = ({ user }) => {
  const router = useRouter();
  const { campaign, slug } = router.query;
  const [ sortBy, setSortBy ] = useState('createdAt');
  const [ sortOrder, setSortOrder ] = useState(-1);

  const { data: program, error: errorProgram } = useSWR(`/api/programs/${campaign}/${slug}`, fetcher);
  const { data: submissions, error: errorSubmissions, mutate } = useSWR(program ? `/api/submissions?programId=${program._id}` : null, fetcher);

  const removeSubmission = async (id) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
      mutate();
    }
  };

  const setSort = (key) => {
    setSortBy(key);
    if (key === sortBy) {
      setSortOrder(sortOrder * -1);
    }
    
    const thisKey = sortBy === 'myRating' ? 'myRating.rate' : sortBy;

    const sortedSubmissions = [...submissions].sort((a, b) => {
      if (a[thisKey] < b[thisKey]) return sortOrder;
      if (a[thisKey] > b[thisKey]) return -sortOrder;
      return 0;
    });
    mutate(sortedSubmissions, false);
  };

  return (
    <Layout>
      <Head>
        <title>VAF - {campaign} {slug}</title>
      </Head>

      <Container fluid>
        
        {(errorProgram || errorSubmissions) && <div>Failed to load</div>}
        {(!program || !submissions) && <div>Loading...</div>}
        {program && submissions?.length > 0 && <>
          <ToolbarProgram program={program} showSearch={true} />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>User</th>
                <th>Title</th>
                <th>Work Samples</th>
                {isJuror(user) && <th onClick={() => setSort('myRating')}>My Rating</th>}
                {isAdmin(user) && <th onClick={() => setSort('avgRating')}>Avg. Rating</th>}
                {isAdmin(user) && <th>Eligible</th>}
                <th className="text-end">Tools</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={index}>
                  <td>{submission.contacts.map(contact => contact.name).join(', ')}</td>
                  <td>{submission.title}</td>
                  <td>{submission.assetsCount}</td>
                  {isJuror(user) && <td>{submission.myRating?.rate}</td>}
                  {isAdmin(user) && <td>{submission.avgRating}</td>}
                  {isAdmin(user) && <td className={!submission.eligible ? 'text-danger' : 'text-success'}>{submission.eligible.toString()}</td>}
                  <td className="text-end">
                    <Link href={`/${program.campaign}/${program.slug}/submissions/${submission._id}`} passHref>
                      <Button variant="info" size="sm">Show</Button>
                    </Link>

                    {isAdmin(user) && <Button variant="danger" size="sm" className="ms-1" onClick={() => removeSubmission(submission._id)}>Destroy</Button>}
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