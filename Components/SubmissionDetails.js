import { Button } from 'react-bootstrap';
import { useRoot } from '../contexts/RootContext';
import FormDetails from './FormDetails';

const SubmissionDetails = ({ questions, submission, onSubmit }) => {
  const { hideModal, openForm } = useRoot();

  return (
    <>
      <div className="mb-4">
        {!submission.details && questions.map((q, index) => (
          <div key={index} className="mb-4">
            <p className="h5 border-bottom">{q.question}</p>
            <p style={{whiteSpace: 'pre-line'}}>Your answer here.</p>
          </div>
        ))}
        {submission.details && submission.details.map((detail, index) => (
          <div key={index} className="mb-4">
            <p className="h5 border-bottom">{detail.question}</p>
            <p style={{whiteSpace: 'pre-line'}}>{detail.answer}</p>
          </div>
        ))}
      </div>
      <Button variant="primary" onClick={() => openForm('Edit Details', <FormDetails submission={submission} questions={questions} onSubmit={onSubmit} hideModal={hideModal} />)}>Edit Details</Button>
    </>
  );
};

export default SubmissionDetails;