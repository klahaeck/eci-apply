import { Table, Button } from 'react-bootstrap';
import { useUser } from '@auth0/nextjs-auth0';
import NumberFormat from 'react-number-format';
import { useRoot } from '../contexts/RootContext';
import { isAdmin } from '../lib/users';
import FormBudget from './FormBudget';
import { getBudgetWithRequestedGrantValue, getBudgetTotal, getDifference } from '../lib/utils';

const SubmissionBudget = ({ submission, onSubmit }) => {
  const { user } = useUser();
  const { hideModal, openForm } = useRoot();

  const filteredIncome = getBudgetWithRequestedGrantValue(submission);
  const expensesTotal = getBudgetTotal(submission.budget.expenses);
  const incomeTotal = getBudgetTotal(filteredIncome);
  const budgetTotal = getDifference(incomeTotal, expensesTotal);

  return (
    <>
      <Table size="sm">
        <thead>
          <tr>
            <th>Expenses</th>
            <th className="text-end">Value</th>
          </tr>
        </thead>
        <tbody>
          {submission.budget.expenses.map((expense, index) => (
            <tr key={index}>
              <td>{expense.name}</td>
              <td className="text-end">
                <NumberFormat value={expense.value} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p className="h6 text-end">Expenses Total: <b><NumberFormat value={expensesTotal} displayType={'text'} thousandSeparator={true} prefix={'$'} /></b></p>

      <Table size="sm">
        <thead>
          <tr>
            <th>Income</th>
            <th className="text-end">Value</th>
          </tr>
        </thead>
        <tbody>
          {getBudgetWithRequestedGrantValue(submission).map((income, index) => (
            <tr key={index}>
              <td>{income.name}</td>
              <td className="text-end">
                <NumberFormat value={income.value} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p className="h6 text-end">Income Total: <b><NumberFormat value={incomeTotal} displayType={'text'} thousandSeparator={true} prefix={'$'} /></b></p>

      <p className={`h5 text-end ${budgetTotal === 0 ? 'text-success' : 'text-danger'}`}>Difference: <NumberFormat value={budgetTotal} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>

      {(isAdmin(user) || (submission.userId === user.sub && !submission.submitted)) && <Button variant="primary" onClick={() => openForm('Edit Budget', <FormBudget submission={submission} onSubmit={onSubmit} hideModal={hideModal} />, 'xl', true)}>Edit Budget</Button>}
    </>
  );
};

export default SubmissionBudget;