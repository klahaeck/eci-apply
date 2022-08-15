import { useRoot } from '../contexts/RootContext';
import { useUser } from '@auth0/nextjs-auth0';
import { Accordion } from 'react-bootstrap';
import { isAdmin, isJuror } from '../lib/users';
import JuryTools from './JuryTools';
// import Alerts from './Alerts';
import SubmissionContactInfo from './SubmissionContactInfo';
import SubmissionSummary from './SubmissionSummary';
import SubmissionDetails from './SubmissionDetails';
import SubmissionBios from './SubmissionBios';
import SubmissionBudget from './SubmissionBudget';
import SubmissionAssets from './SubmissionAssets';
import FormAdmin from './FormAdmin';
import ToolbarSubmission from './ToolbarSubmission';

const Submission = ({ program, submission, mutate, isPanel = false }) => {
  const { user } = useUser();
  const { hideModal } = useRoot();

  const onSubmit = async data => {
    let updatedData = {
      _id: submission._id,
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
      <ToolbarSubmission program={program} submission={submission} isPanel={isPanel} />
      {(isJuror(user) || isAdmin(user)) && <JuryTools program={program} submission={submission} mutate={mutate} />}

      {/* <Alerts position="submission" dismissible={false} /> */}

      <Accordion defaultActiveKey={['0', '1', '6']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header><b>Contact info</b></Accordion.Header>
          <Accordion.Body>
            <SubmissionContactInfo submission={submission} onSubmit={onSubmit} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header><b>Project Summary</b></Accordion.Header>
          <Accordion.Body>
            <SubmissionSummary submission={submission} onSubmit={onSubmit} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header><b>Project Description</b></Accordion.Header>
          <Accordion.Body>
            <SubmissionDetails submission={submission} questions={program.questions} onSubmit={onSubmit} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header><b>Bios (Limit 5)</b></Accordion.Header>
          <Accordion.Body>
            <SubmissionBios submission={submission} onSubmit={onSubmit} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header><b>Budget</b></Accordion.Header>
          <Accordion.Body>
            <SubmissionBudget submission={submission} onSubmit={onSubmit} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header><b>Visual Support Materials (10 Required)</b></Accordion.Header>
          <Accordion.Body>
            <SubmissionAssets submission={submission} onSubmit={onSubmit} mutate={mutate} />
          </Accordion.Body>
        </Accordion.Item>

        {isAdmin(user) && <Accordion.Item eventKey="6">
          <Accordion.Header><b>Admin</b></Accordion.Header>
          <Accordion.Body>
            <FormAdmin submission={submission} onSubmit={onSubmit} />
          </Accordion.Body>
        </Accordion.Item>}
      </Accordion>
    </>
  );
};

export default Submission;