import Head from 'next/head';
import { useRouter } from 'next/router';
import useProgram from '../../../../hooks/useProgram';
import useSubmission from '../../../../hooks/useSubmission';
import {
  Container,
} from 'react-bootstrap';
import Layout from '../../../../layouts/Main';
// import ProgramToolbar from '../../../Components/ProgramToolbar';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Submission from '../../../../Components/Submission';
// import { meta } from '../../../data';

const SubmissionById = withPageAuthRequired(() => {
  const router = useRouter();
  const { campaign, slug, submissionId } = router.query;

  const { program, error: errorProgram } = useProgram({ campaign, slug });
  const { mutate, submission, error: errorSubmission } = useSubmission({ submissionId });
  
  return (
    <Layout>
      <Head>
        <title>VAF - {campaign} {slug}</title>
      </Head>

      <Container fluid>
        {(errorProgram || errorSubmission) && <div>Failed to load</div>}
        {!errorProgram && !errorSubmission && !program && !submission && <div>Loading...</div>}
        {program && submission && <>
          {/* <ProgramToolbar program={program} /> */}
          <Submission program={program} submission={submission} mutate={mutate} />
        </>}
      </Container>
    </Layout>
  );
});

export default SubmissionById;