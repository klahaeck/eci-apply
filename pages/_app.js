import { UserProvider } from '@auth0/nextjs-auth0';
import { wrapper } from '../store';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default wrapper.withRedux(MyApp);
