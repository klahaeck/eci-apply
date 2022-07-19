import { useRoot } from '../contexts/RootContext';
import {
  Alert,
} from 'react-bootstrap';

const Alerts = ({ position, dismissible = true }) => {
  const { alerts, removeAlert } = useRoot();
  const thisAlerts = alerts.filter(alert => alert.position === position);

  return (
    <>
      {thisAlerts.length > 0 && <div className="w-100" style={{zIndex: 200}}>
        {thisAlerts.map((alert, index) => <Alert key={index} className="my-2" variant={alert.color} onClose={() => removeAlert(index)} dismissible={dismissible}>
          {alert.heading && <Alert.Heading>{alert.heading}</Alert.Heading>}
          <div dangerouslySetInnerHTML={{__html: alert.msg}} />
        </Alert>)}
      </div>}
    </>
  );
};

export default Alerts;