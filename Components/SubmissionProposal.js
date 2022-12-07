import { useUser } from '@auth0/nextjs-auth0';
import { Button } from 'react-bootstrap';
import { useRoot } from '../contexts/RootContext';
import { isAdmin } from '../lib/users';
import FormProposal from './FormProposal';

const SubmissionProposal = ({ submission, onSubmit }) => {
  const { user } = useUser();
  const { hideModal, openForm } = useRoot();

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: submission.proposal }}></div>

      {(isAdmin(user) || (submission.userId === user.sub && !submission.submitted)) && <Button variant="primary" onClick={() => openForm('', <FormProposal submission={submission} onSubmit={onSubmit} hideModal={hideModal} />)}>Edit Proposal</Button>}
    </>
  );
};

export default SubmissionProposal;