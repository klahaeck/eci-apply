import Head from 'next/head';
import useSWR from 'swr';
import fetcher from '../lib/fetcher';
import {
  Container
} from 'react-bootstrap';
import Main from '../layouts/Main';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import ProfileForm from '../components/ProfileForm';

const PageProfile = withPageAuthRequired(({ user }) => {
  const { data: user_metadata, error } = useSWR(user ? `/api/users/${user.sub}` : null, fetcher);

  return (
    <Main>
      <Head>
        <title>ECI Apply - Profile</title>
      </Head>

      <Container fluid>
        {/* <h2>This is the profile page</h2> */}
        {error && <div>Failed to load</div>}
        {!error && !user_metadata && <div>Loading...</div>}
        {user_metadata && <ProfileForm user={user_metadata} />}
      </Container>
    </Main>
  );
});

export default PageProfile;