import Head from 'next/head';
import { useRouter } from 'next/router';
import useProgram from '../../../../hooks/useProgram';
import useSubmission from '../../../../hooks/useSubmission';
import {
  Container,
} from 'react-bootstrap';
import Main from '../../../../layouts/Main';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Submission from '../../../../components/Submission';

const SubmissionById = withPageAuthRequired(() => {
  const router = useRouter();
  const { campaign, slug, submissionId } = router.query;

  const { program, error: errorProgram } = useProgram({ campaign, slug });
  const { mutate, submission, error: errorSubmission } = useSubmission({ submissionId });
  
  return (
    <Main>
      <Head>
        <title>ECI Apply - {campaign?.toLowerCase() === 'fellowship' ? slug : `${campaign} ${slug}`}</title>
      </Head>

      <Container fluid>
        {(errorProgram || errorSubmission) && <div>Failed to load</div>}
        {!errorProgram && !errorSubmission && !program && !submission && <div>Loading...</div>}
        {program && submission && <>
          {/* <ProgramToolbar program={program} /> */}
          <Submission program={program} submission={submission} mutate={mutate} />
        </>}
      </Container>
    </Main>
  );
});

export default SubmissionById;