import { UserProvider } from '@auth0/nextjs-auth0';
import { RootProvider } from '../contexts/RootContext';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <RootProvider>
        <Component {...pageProps} />
      </RootProvider>
    </UserProvider>
  );
}

export default MyApp;
