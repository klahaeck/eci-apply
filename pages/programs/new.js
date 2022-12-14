import Head from 'next/head';
import {
  Container,
} from 'react-bootstrap';
import Main from '../../layouts/Main';
// import { meta } from '../../data';
import FormProgram from '../../components/FormProgram';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { isAdmin } from '../../lib/users';

const ProgramNew = () => {
  return (
    <Main>
      <Head>
        <title>ECI Apply - New Program</title>
        {/* <meta property="og:url"             content={`${meta.url}/word/${word.slug}`} key="og:url" />
        <meta property="og:title"           content={`CryptoWords - ${startCase(word.name)}`} key="title" />
        <meta property="og:image"           content={word.imageShare} key="og:image" />
        <meta property="og:image:width"     content="1200" key="og:image:width" />
        <meta property="og:image:height"    content="628" key="og:image:height" />
        <meta name="twitter:title"          content={`CryptoWords - ${startCase(word.name)}`} key="twitter:title" />
        <meta name="twitter:image"          content={word.imageShare} key="twitter:image" /> */}
      </Head>

      <Container fluid>
        <FormProgram />
      </Container>
    </Main>
  );
};

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ({ req, res }) => {
    const { user } = getSession(req, res);
    if (!isAdmin(user)) {
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

export default ProgramNew;