import Head from 'next/head';
import useSWR from 'swr';
import fetcher from '../../../lib/fetcher';
import { useRouter } from 'next/router';
import {
  Container,
} from 'react-bootstrap';
import Layout from '../../../layouts/Main';
// import { meta } from '../../../data';

const Attributes = () => {
  const router = useRouter()
  const { campaign, slug, attribute } = router.query

  const { data: program, error } = useSWR(`/api/programs/${campaign}/${slug}`, fetcher);

  const getContent = () => {
    if (attribute === 'description') {
      return <div dangerouslySetInnerHTML={{ __html: program.description }}></div>;
    }
    if (attribute === 'guidelines') {
      return <div dangerouslySetInnerHTML={{ __html: program.guidelines }}></div>;
    }
    if (attribute === 'juror-info') {
      return <div dangerouslySetInnerHTML={{ __html: program.jurorInfo }}></div>;
    }
  }

  return (
    <Layout>
      <Head>
        <title>VAF - {campaign} {slug}</title>
      </Head>

      <Container fluid>
        {error && <div>Failed to load</div>}
        {!error && !program && <div>Loading...</div>}
        {!error && program && getContent()}
      </Container>
    </Layout>
  );
};

export default Attributes;