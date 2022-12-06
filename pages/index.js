import Head from 'next/head';
import {
  Container,
} from 'react-bootstrap';
import Main from '../layouts/Main';

const Home = (props) => {
  return (
    <Main>
      <Head>
        <title>ECI Apply</title>
      </Head>

      <Container fluid></Container>
    </Main>
  )
}

export default Home;