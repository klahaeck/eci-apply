import Head from 'next/head';
import {
  Container
} from 'react-bootstrap';
import Main from '../layouts/Main';

const PageContact = () => {
  return (
    <Main>
      <Head>
        <title>VAF - Contact</title>
      </Head>

      <Container fluid>
        <h2>This is the contact page</h2>
      </Container>
    </Main>
  );
};

export default PageContact;