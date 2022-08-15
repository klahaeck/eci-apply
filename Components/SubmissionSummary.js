import { useUser } from '@auth0/nextjs-auth0';
import { Table, Button } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import { useRoot } from '../contexts/RootContext';
import { isAdmin } from '../lib/users';
import FormSummary from './FormSummary';

const SubmissionSummary = ({ submission, onSubmit }) => {
  const { user } = useUser();
  const { hideModal, openForm } = useRoot();

  const formatDate = date => date.toLocaleString('en-US',  {weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      <Table size="sm">
        <tbody>
          <tr>
            <td>Project Title:</td>
            <td>{submission.title}</td>
          </tr>
          {/* <tr>
            <td>Total Budget:</td>
            <td><NumberFormat value={incomeTotal} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
          </tr> */}
          <tr>
            <td>Amount Requested:</td>
            <td><NumberFormat value={submission.budgetRequested} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
          </tr>
          <tr>
            <td>Start Date:</td>
            <td>{!submission.startDate ? formatDate(new Date()) : formatDate(new Date(submission.startDate))}</td>
          </tr>
          <tr>
            <td>Completion Date:</td>
            <td>{!submission.completionDate ? formatDate(new Date()) : formatDate(new Date(submission.completionDate))}</td>
          </tr>
          <tr>
            <td>Project Summary:</td>
            <td style={{whiteSpace: 'pre-line'}}>{submission.summary}</td>
          </tr>
        </tbody>
      </Table>
      {(isAdmin(user) || (submission.userId === user.sub && !submission.submitted)) && <Button variant="primary" onClick={() => openForm('', <FormSummary submission={submission} onSubmit={onSubmit} hideModal={hideModal} />)}>Edit Project Summary</Button>}
    </>
  );
};

export default SubmissionSummary;