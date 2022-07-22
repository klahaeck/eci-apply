import Head from 'next/head';
import useProgram from '../../../hooks/useProgram';
import { useRouter } from 'next/router';
import {
  Container,
} from 'react-bootstrap';
import Main from '../../../layouts/Main';
import ToolbarProgram from '../../../components/ToolbarProgram';
// import { meta } from '../../../data';

const Attributes = () => {
  const router = useRouter()
  const { campaign, slug, attribute } = router.query

  const { program, error } = useProgram({ campaign, slug });

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
    <Main>
      <Head>
        <title>VAF - {campaign?.toLowerCase() === 'vaf' ? slug : `${campaign} ${slug}`}</title>
      </Head>

      <Container fluid>
        {error && <div>Failed to load</div>}
        {!error && !program && <div>Loading...</div>}
        {!error && program && <>
          <ToolbarProgram program={program} />
          {getContent()}
        </>}
      </Container>
    </Main>
  );
};

export default Attributes;