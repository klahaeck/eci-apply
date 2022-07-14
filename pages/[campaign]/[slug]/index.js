import Head from 'next/head';
import useSWR from 'swr';
import fetcher from '../../../lib/fetcher';
import { useRouter } from 'next/router';
import {
  Container,
} from 'react-bootstrap';
import Layout from '../../../layouts/Main';
import ToolbarProgram from '../../../Components/ToolbarProgram';
// import { meta } from '../../../data';

const Slug = () => {
  const router = useRouter();
  const { campaign, slug } = router.query;

  const { data: program, error } = useSWR(`/api/programs/${campaign}/${slug}`, fetcher);

  return (
    <Layout>
      <Head>
        <title>VAF - {campaign} {slug}</title>
      </Head>

      <Container fluid>
        {error && <div>Failed to load</div>}
        {!error && !program && <div>Loading...</div>}
        {!error && program && <>
          <ToolbarProgram program={program} />
          <div dangerouslySetInnerHTML={{ __html: program.description }}></div>
        </>}
      </Container>
    </Layout>
  );
};

export default Slug;