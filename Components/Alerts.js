import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  removeAlert,
} from '../store/overlays/reducer';
import {
  Alert,
} from 'react-bootstrap';

const Alerts = (props) => {
  const { alerts, removeAlert, position, dismissible = true } = props;
  const thisAlerts = alerts.filter(alert => alert.position === position);

  return (
    <>
      {thisAlerts.length > 0 && <div className="position-fixed top-0 start-0 w-100 p-3" style={{zIndex: 200}}>
        {thisAlerts.map((alert, index) => <Alert key={index} variant={alert.color} onClose={() => removeAlert(index)} dismissible={dismissible}>{alert.msg}</Alert>)}
      </div>}
    </>
  );
};

const mapStateToProps = (state) => ({
  alerts: state.overlays.alerts,
});
const mapDispatchToProps = (dispatch) => ({
  removeAlert: bindActionCreators(removeAlert, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);