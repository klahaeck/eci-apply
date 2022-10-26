import { UserProvider } from '@auth0/nextjs-auth0';
import { QueryParamProvider } from '../contexts/QueryParamContext';
import { RootProvider } from '../contexts/RootContext';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <QueryParamProvider>
        <RootProvider>
          <Component {...pageProps} />
        </RootProvider>
      </QueryParamProvider>
    </UserProvider>
  );
}

export default MyApp;
