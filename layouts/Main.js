import MetaTags from '../components/MetaTags';
import { meta } from '../data';
// import Alerts from '../components/Alerts';
import Menubar from '../components/Menubar';
import Toasts from '../components/Toasts';
import SiteModal from '../components/SiteModal';
import Footer from '../components/Footer';

const Main = ({ className, children }) => {
  return (
    <div className={className}>
      <MetaTags meta={meta} />
      <Menubar />
      <Toasts />
      {/* <Alerts position="global" /> */}

      { children }
      <Footer />
      <SiteModal />
    </div>
  );
};

export default Main;