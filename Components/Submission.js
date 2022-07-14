import { useRoot } from '../contexts/RootContext';
import { useUser } from '@auth0/nextjs-auth0';
import { Accordion } from 'react-bootstrap';
import { isAdmin, isJuror } from '../lib/users';
import JurorTools from './JurorTools';
import Alerts from './Alerts';
import SubmissionContactInfo from './SubmissionContactInfo';
import SubmissionSummary from './SubmissionSummary';
import SubmissionDetails from './SubmissionDetails';
import SubmissionBios from './SubmissionBios';
import SubmissionBudget from './SubmissionBudget';
import SubmissionAssets from './SubmissionAssets';
import FormAdmin from './FormAdmin';
import ToolbarSubmission from './ToolbarSubmission';

const Submission = ({ program, submission, mutate }) => {
  const { user } = useUser();
  const { hideModal } = useRoot();

  const onSubmit = async data => {
    let updatedData = {
      _id: submission._id,
      userId: user.sub,
      ...data
    };

    mutate(async () => {
      const res = await fetch('/api/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const resData = await res.json();
      return resData;
    });
    hideModal();
  };

  return (
    <>
      <ToolbarSubmission program={program} submission={submission} />
      {isJuror(user) && <JurorTools program={program} submissionId={submission._id} />}

      <Alerts position="submission" dismissible={false} />

      <Accordion defaultActiveKey={['0', '1', '6']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Contact info</Accordion.Header>
          <Accordion.Body>
            <SubmissionContactInfo submission={submission} onSubmit={onSubmit} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Summary</Accordion.Header>
          <Accordion.Body>
            <SubmissionSummary submission={submission} onSubmit={onSubmit} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Details</Accordion.Header>
          <Accordion.Body>
            <SubmissionDetails submission={submission} questions={program.questions} onSubmit={onSubmit} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Bios</Accordion.Header>
          <Accordion.Body>
            <SubmissionBios submission={submission} onSubmit={onSubmit} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>Budget</Accordion.Header>
          <Accordion.Body>
            <SubmissionBudget submission={submission} onSubmit={onSubmit} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header>Visual Support Materials</Accordion.Header>
          <Accordion.Body>
            <SubmissionAssets submission={submission} onSubmit={onSubmit} mutate={mutate} />
          </Accordion.Body>
        </Accordion.Item>

        {isAdmin(user) && <Accordion.Item eventKey="6">
          <Accordion.Header>Admin</Accordion.Header>
          <Accordion.Body>
            <FormAdmin submission={submission} onSubmit={onSubmit} />
          </Accordion.Body>
        </Accordion.Item>}
      </Accordion>
    </>
  );
};

export default Submission;