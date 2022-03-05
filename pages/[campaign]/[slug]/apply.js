import Head from 'next/head';
import useSWR from 'swr';
import fetcher from '../../../lib/fetcher';
import { useRouter } from 'next/router';
import {
  Container,
} from 'react-bootstrap';
import Layout from '../../../layouts/Main';
import ProgramToolbar from '../../../Components/ProgramToolbar';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Submission from '../../../Components/Submission';
import { useEffect } from 'react';
// import { meta } from '../../../data';

const ProgramApply = withPageAuthRequired(({ user }) => {
  const router = useRouter();
  const { campaign, slug } = router.query;

  const { data: program, error: errorProgram } = useSWR(`/api/programs/${campaign}/${slug}`, fetcher);
  const { data: submission, error: errorSubmission } = useSWR(program && user ? `/api/submissions?programId=${program._id}&userId=${user.sub}` : null, fetcher);
  
  return (
    <Layout>
      <Head>
        <title>VAF - {campaign} {slug}</title>
      </Head>

      <Container fluid>
        {(errorProgram || errorSubmission) && <div>Failed to load</div>}
        {!program && !submission && <div>Loading...</div>}
        {submission && <>
          {/* <ProgramToolbar program={program} /> */}
          <Submission user={user} program={program} submission={submission} />
        </>}
      </Container>
    </Layout>
  );
});

export default ProgramApply;