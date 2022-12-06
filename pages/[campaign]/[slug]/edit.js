import useProgram from '../../../hooks/useProgram';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Container,
} from 'react-bootstrap';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { isAdmin } from '../../../lib/users';
import Main from '../../../layouts/Main';
// import { meta } from '../../data';
// import Alerts from '../../../components/Alerts';
import FormProgram from '../../../components/FormProgram';
import ToolbarProgram from '../../../components/ToolbarProgram';

const ProgramEdit = () => {
  const router = useRouter()
  const { campaign, slug } = router.query

  const { program, error } = useProgram({ campaign, slug });

  return (
    <Main>
      <Head>
        <title>ECI Apply - {campaign?.toLowerCase() === 'fellowship' ? slug : `${campaign} ${slug}`}</title>
      </Head>

      <Container fluid>
        {error && <div>Failed to load</div>}
        {!error && !program && <div>Loading...</div>}
        {!error && program && <>
          <ToolbarProgram program={program} />
          {/* <Alerts position="program" /> */}
          <FormProgram program={program} />
        </>}
      </Container>
    </Main>
  );
};

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ({ req, res }) => {
    const { user } = getSession(req, res);
    if (!user || !isAdmin(user)) {
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

export default ProgramEdit;