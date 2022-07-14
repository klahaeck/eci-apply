import { useRoot } from '../contexts/RootContext';
import {
  ToastContainer,
  Toast,
} from 'react-bootstrap';

const Toasts = () => {
  const { toasts, removeToast } = useRoot();
  
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

export default Toasts;