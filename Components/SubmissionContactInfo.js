import { useUser } from '@auth0/nextjs-auth0';
import { Table, Button } from 'react-bootstrap';
import { formatPhoneNumber } from 'react-phone-number-input';
import { useRoot } from '../contexts/RootContext';
import { isAdmin } from '../lib/users';
import FormContactInfo from './FormContactInfo';

const SubmissionContactInfo = ({ submission, onSubmit }) => {
  const { user } = useUser();
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
              <td>Street Address:</td>
              <td>{contact.address0}</td>
            </tr>
            <tr>
              <td>City:</td>
              <td>{contact.city}</td>
            </tr>
            <tr>
              <td>State:</td>
              <td>{contact.state.label}</td>
            </tr>
            <tr>
              <td>Zip:</td>
              <td>{contact.zip}</td>
            </tr>
          </tbody>
        </Table>
      ))}
      {(isAdmin(user) || (submission.userId === user.sub && !submission.submitted)) && <Button variant="primary" onClick={() => openForm('Lead Organizer', <FormContactInfo submission={submission} onSubmit={onSubmit} hideModal={hideModal} />)}>Edit Contact Info</Button>}
    </>
  );
};

export default SubmissionContactInfo;