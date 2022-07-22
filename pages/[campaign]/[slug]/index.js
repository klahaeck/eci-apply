import Head from 'next/head';
import useProgram from '../../../hooks/useProgram';
import { useRouter } from 'next/router';
import {
  Container,
} from 'react-bootstrap';
import Main from '../../../layouts/Main';
import ToolbarProgram from '../../../components/ToolbarProgram';
// import { meta } from '../../../data';

const Slug = () => {
  const router = useRouter();
  const { campaign, slug } = router.query;

  const { program, error } = useProgram({ campaign, slug });

  return (
    <Main>
      <Head>
        <title>VAF - {campaign?.toLowerCase() === 'vaf' ? slug : `${campaign} ${slug}`}</title>
      </Head>

      <Container fluid>
        {error && <div>Failed to load</div>}
        {!error && !program && <div>Loading...</div>}
        {!error && program && <>
          <ToolbarProgram program={program} />
          <div dangerouslySetInnerHTML={{ __html: program.description }}></div>
        </>}
      </Container>
    </Main>
  );
};

export default Slug;