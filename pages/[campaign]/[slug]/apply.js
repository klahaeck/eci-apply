import Head from 'next/head';
import { useRouter } from 'next/router';
import useProgram from '../../../hooks/useProgram';
import useSubmission from '../../../hooks/useSubmission';
import {
  Container,
} from 'react-bootstrap';
import Main from '../../../layouts/Main';
// import ProgramToolbar from '../../../Components/ProgramToolbar';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Submission from '../../../components/Submission';
import { useEffect } from 'react';
// import { meta } from '../../../data';

const ProgramApply = withPageAuthRequired(() => {
  const router = useRouter();
  const { campaign, slug } = router.query;

  const { program, error: errorProgram } = useProgram({ campaign, slug });
  const { mutate, submission, error: errorSubmission } = useSubmission({ programId: program?._id });
  
  return (
    <Main>
      <Head>
        <title>VAF - {campaign?.toLowerCase() === 'vaf' ? slug : `${campaign} ${slug}`}</title>
      </Head>

      <Container fluid>
        {(errorProgram || errorSubmission) && <div>Failed to load</div>}
        {!errorProgram && !errorSubmission && !program && !submission && <div>Loading...</div>}
        {/* {JSON.stringify(submission)} */}
        {program && submission && <>
          {/* <ProgramToolbar program={program} /> */}
          <Submission program={program} submission={submission} mutate={mutate} />
        </>}
      </Container>
    </Main>
  );
});

export default ProgramApply;