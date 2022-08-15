import { useUser } from '@auth0/nextjs-auth0';
import { Button } from 'react-bootstrap';
import { useRoot } from '../contexts/RootContext';
import { isAdmin } from '../lib/users';
import FormDetails from './FormDetails';

const SubmissionDetails = ({ questions, submission, onSubmit }) => {
  const { user } = useUser();
  const { hideModal, openForm } = useRoot();

  return (
    <>
      <div className="mb-4">
        {!submission.details.length && questions.map((q, index) => (
          <div key={index} className="mb-4">
            <p className="h5 border-bottom">{q.question}</p>
            <p style={{whiteSpace: 'pre-line'}}>Your answer here.</p>
          </div>
        ))}
        {submission.details.length > 0 && submission.details.map((detail, index) => (
          <div key={index} className="mb-4">
            <p className="h5 border-bottom">{detail.question}</p>
            <p style={{whiteSpace: 'pre-line'}}>{detail.answer}</p>
          </div>
        ))}
      </div>
      {(isAdmin(user) || (submission.userId === user.sub && !submission.submitted)) && <Button variant="primary" onClick={() => openForm('Describe your project', <FormDetails submission={submission} questions={questions} onSubmit={onSubmit} hideModal={hideModal} />)}>Edit Project Description</Button>}
    </>
  );
};

export default SubmissionDetails;