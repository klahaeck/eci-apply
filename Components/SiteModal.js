import { useRoot } from '../contexts/RootContext';
import {
  Modal
} from 'react-bootstrap';

const SiteModal = ({ className }) => {
  const { modal, hideModal } = useRoot();
  return (
    <Modal show={modal.body} onHide={hideModal} size={modal.size || 'lg'} fullscreen={modal.fullscreen || false} className={modal.className || className}>
      {modal.header && <Modal.Header closeButton>
        <Modal.Title>{modal.header}</Modal.Title>
      </Modal.Header>}
      <Modal.Body className={modal.className}>{modal.body}</Modal.Body>
      {modal.footer && <Modal.Footer>{modal.footer}</Modal.Footer>}
    </Modal>
  );
};

export default SiteModal;