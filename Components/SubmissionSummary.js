import { Table, Button } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import { useRoot } from '../contexts/RootContext';
import FormSummary from './FormSummary';
// import { getBudgetWithRequestedGrantValue, getBudgetTotal } from '../lib/utils';

const SubmissionSummary = ({ submission, onSubmit }) => {
  const { hideModal, openForm } = useRoot();
  // const filteredIncome = getBudgetWithRequestedGrantValue(submission);
  // const expensesTotal = getBudgetTotal(submission.budget.expenses);
  // const incomeTotal = getBudgetTotal(filteredIncome);
  // const budgetTotal = getDifference(incomeTotal, expensesTotal);

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
            <td>{new Date(submission.startDate).toLocaleString('en-US',  {weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</td>
          </tr>
          <tr>
            <td>Completion Date:</td>
            <td>{new Date(submission.completionDate).toLocaleString('en-US',  {weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</td>
          </tr>
          <tr>
            <td>Project Summary:</td>
            <td style={{whiteSpace: 'pre-line'}}>{submission.summary}</td>
          </tr>
        </tbody>
      </Table>
      <Button variant="primary" onClick={() => openForm('Edit Summary', <FormSummary submission={submission} onSubmit={onSubmit} hideModal={hideModal} />)}>Edit Summary</Button>
    </>
  );
};

export default SubmissionSummary;