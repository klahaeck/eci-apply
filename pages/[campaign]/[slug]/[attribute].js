// import { useEffect } from 'react';
import Head from 'next/head';
import useProgram from '../../../hooks/useProgram';
// import { useRoot } from '../../../contexts/RootContext';
import { useRouter } from 'next/router';
import {
  Container,
} from 'react-bootstrap';
import Main from '../../../layouts/Main';
import ToolbarProgram from '../../../components/ToolbarProgram';
import Alerts from '../../../components/Alerts';
import startCase from 'lodash/startCase';
// import { meta } from '../../../data';

const Attributes = () => {
  const router = useRouter()
  const { campaign, slug, attribute } = router.query;

  // const { addAlert, clearAlerts } = useRoot();

  const { program, error } = useProgram({ campaign, slug });

  // useEffect(() => {
  //   clearAlerts('notify');
  //   addAlert({
  //     position: 'notify',
  //     heading: '',
  //     color: 'info',
  //     msg: 'Please create an account using the \‘Signup\' button located at the top right corner of this page. If you have applied to the VAF in the past, you will still need to create a new account this year as we have updated our application portal. Thank you for your understanding!'
  //   });
  // }, []);

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
        <title>ECI Apply - {campaign?.toLowerCase() === 'fellowship' ? slug : `${campaign} ${slug}`}</title>
      </Head>

      <Container fluid>
        {error && <div>Failed to load</div>}
        {!error && !program && <div>Loading...</div>}
        {!error && program && <>
          <ToolbarProgram program={program} />
          <Alerts position="notify" />

          <div className="pt-3">
            <h1 className="fw-bold fs-2">{startCase(attribute)}</h1>
            {getContent()}
          </div>
        </>}
      </Container>
    </Main>
  );
};

export default Attributes;