import Head from 'next/head';
import useSWR from 'swr';
import fetcher from '../../../../lib/fetcher';
import { useRouter } from 'next/router';
import {
  Container,
} from 'react-bootstrap';
import Main from '../../../../layouts/Main';
import ToolbarProgram from '../../../../components/ToolbarProgram';
import SubmissionIndex from '../../../../components/SubmissionIndex';
import PaginationSubmissions from '../../../../components/PaginationSubmissions';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { isAdmin, isJuror } from '../../../../lib/users';
import useQueryParams from '../../../../hooks/useQueryParams';

const ProgramSubmissions = ({ user }) => {
  const router = useRouter();
  const { campaign, slug } = router.query;
  const { queryParams } = useQueryParams();
  const { sortBy, sortOrder, s: searchQuery, perPage, pageNumber } = queryParams;

  const { data: program, error: errorProgram } = useSWR(`/api/programs/${campaign}/${slug}`, fetcher);
  const { data: submissions, error: errorSubmissions, mutate } = useSWR(program ? ['/api/submissions', { programId: program._id, s: searchQuery, sortBy, sortOrder, perPage, pageNumber, filterFinalists: program.filterFinalists }] : null, fetcher);

  return (
    <Main>
      <Head>
        <title>VAF - {campaign?.toLowerCase() === 'vaf' ? slug : `${campaign} ${slug}`}</title>
      </Head>

      <Container fluid>
        
        {(errorProgram || errorSubmissions) && <div>Failed to load</div>}
        {(!program || !submissions) && <div>Loading...</div>}
        {program && submissions && <>
          <ToolbarProgram program={program} showSearch={true} />
          <SubmissionIndex user={user} program={program} submissions={submissions} mutate={mutate} filterFinalists={program.filterFinalists} />

          {submissions.totalPages > 1 && <PaginationSubmissions totalPages={submissions.totalPages} />}
        </>}
      </Container>
    </Main>
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