import { useUser } from '@auth0/nextjs-auth0';
import { Button } from 'react-bootstrap';
import { useRoot } from '../contexts/RootContext';
import { isAdmin } from '../lib/users';
import FormResume from './FormResume';

const SubmissionResume = ({ submission, onSubmit }) => {
  const { user } = useUser();
  const { hideModal, openForm } = useRoot();

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: submission.resume }}></div>

      {(isAdmin(user) || (submission.userId === user.sub && !submission.submitted)) && <Button variant="primary" onClick={() => openForm('', <FormResume submission={submission} onSubmit={onSubmit} hideModal={hideModal} />)}>Edit Resume</Button>}
    </>
  );
};

export default SubmissionResume;