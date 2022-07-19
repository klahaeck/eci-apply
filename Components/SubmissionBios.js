import { useUser } from '@auth0/nextjs-auth0';
import { Table, Button } from 'react-bootstrap';
import { useRoot } from '../contexts/RootContext';
import { isAdmin } from '../lib/users';
import FormBios from './FormBios';

const SubmissionBios = ({ submission, onSubmit }) => {
  const { user } = useUser();
  const { hideModal, openForm } = useRoot();

  return (
    <>
      {submission.bios && <Table size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Bio</th>
          </tr>
        </thead>
        <tbody>
          {submission.bios.map((bio, index) => (
            <tr key={index}>
              <td>{bio.name}</td>
              <td style={{whiteSpace: 'pre-line'}}>{bio.bio}</td>
            </tr>
          ))}
        </tbody>
      </Table>}
      {(isAdmin(user) || (submission.userId === user.sub && !submission.submitted)) && <Button variant="primary" onClick={() => openForm('Edit Bios', <FormBios submission={submission} onSubmit={onSubmit} hideModal={hideModal} />)}>Edit Bios</Button>}
    </>
  );
};

export default SubmissionBios;