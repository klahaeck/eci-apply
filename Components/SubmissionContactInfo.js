import { Table, Button } from 'react-bootstrap';
import { formatPhoneNumber } from 'react-phone-number-input';
import { useRoot } from '../contexts/RootContext';
import FormContactInfo from './FormContactInfo';

const SubmissionContactInfo = ({ submission, onSubmit }) => {
  const { hideModal, openForm } = useRoot();

  return (
    <>
      {submission.contacts && submission.contacts.map((contact, index) => (
        <Table key={index}size="sm">
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{contact.name}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{contact.email}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>{formatPhoneNumber(contact.phone_number)}</td>
            </tr>
            <tr>
              <td>Address 1:</td>
              <td>{contact.address0}</td>
            </tr>
            <tr>
              <td>Address 2:</td>
              <td>{contact.address1}</td>
            </tr>
            <tr>
              <td>County:</td>
              <td>{contact.county}</td>
            </tr>
            <tr>
              <td>Identifies As:</td>
              <td style={{whiteSpace: 'pre-line'}}>{contact.identifyAs}</td>
            </tr>
          </tbody>
        </Table>
      ))}
      <Button variant="primary" onClick={() => openForm('Edit Contact Info', <FormContactInfo submission={submission} onSubmit={onSubmit} hideModal={hideModal} />)}>Edit Contact Info</Button>
    </>
  );
};

export default SubmissionContactInfo;