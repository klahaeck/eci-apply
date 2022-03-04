import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  removeAlert,
} from '../store/overlays/reducer';
import {
  Container,
  Alert,
} from 'react-bootstrap';

const Alerts = (props) => {
  const { alerts, removeAlert, position, dismissible = true } = props;

  return (
    <Container className="position-absolute w-100 t-0 s-0">
      {alerts.filter(alert => alert.position === position).map((alert, index) => <Alert key={index} variant={alert.color} onClose={() => removeAlert(index)} dismissible={dismissible}>{alert.msg}</Alert>)}
    </Container>
  );
};

const mapStateToProps = (state) => ({
  alerts: state.overlays.alerts,
});
const mapDispatchToProps = (dispatch) => ({
  removeAlert: bindActionCreators(removeAlert, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);