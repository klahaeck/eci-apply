import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  removeToast,
} from '../store/overlays/reducer';
import {
  ToastContainer,
  Toast,
} from 'react-bootstrap';

const Toasts = ({ toasts, removeToast }) => {
  return (
    <>
      {toasts.length > 0 && <ToastContainer className="position-fixed top-0 end-0 p-3" position="top-end" style={{zIndex: 50}}>
        {toasts.map((toast, index) => (
          <Toast key={index} bg={toast.bg} onClose={() => removeToast(index)} delay={5000} autohide>
            <Toast.Header>
              <strong className="me-auto">{toast.header}</strong>
              {/* <small className="text-muted">just now</small> */}
            </Toast.Header>
            <Toast.Body>{toast.body}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>}
    </>
  );
};

const mapStateToProps = (state) => ({
  toasts: state.overlays.toasts,
});
const mapDispatchToProps = (dispatch) => ({
  removeToast: bindActionCreators(removeToast, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Toasts);