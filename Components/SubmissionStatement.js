import { useUser } from '@auth0/nextjs-auth0';
import { Button } from 'react-bootstrap';
import { useRoot } from '../contexts/RootContext';
import { isAdmin } from '../lib/users';
import FormStatement from './FormStatement';

const SubmissionStatement = ({ submission, onSubmit }) => {
  const { user } = useUser();
  const { hideModal, openForm } = useRoot();

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: submission.statement }}></div>

      {(isAdmin(user) || (submission.userId === user.sub && !submission.submitted)) && <Button variant="primary" onClick={() => openForm('', <FormStatement submission={submission} onSubmit={onSubmit} hideModal={hideModal} />)}>Edit Statement of Interest</Button>}
    </>
  );
};

export default SubmissionStatement;