import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Row,
  Col,
  Form,
  Table,
  Stack,
  Button,
} from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import { getBudgetWithRequestedGrantValue, getBudgetTotal, getDifference } from '../lib/utils';

const FormBudget = ({ submission, onSubmit, hideModal }) => {
  const { handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      ...submission,
      budget: {
        ...submission.budget,
        income: getBudgetWithRequestedGrantValue(submission)
      }
    },
  });

  const { fields: fieldsIncome, append: appendIncome, remove: removeIncome } = useFieldArray({
    control,
    name: 'budget.income'
  });

  const { fields: fieldsExpenses, append: appendExpense, remove: removeExpense } = useFieldArray({
    control,
    name: 'budget.expenses'
  });

  const [ watchExpenses, watchIncome ] = watch(['budget.expenses', 'budget.income']);

  const expenseTotal = getBudgetTotal(watchExpenses);
  const incomeTotal = getBudgetTotal(watchIncome);
  const budgetTotal = getDifference(incomeTotal, expenseTotal);

  const thisOnSubmit = (data) => {
    const expenses = data.budget.expenses.map(expense => ({...expense, value: parseInt(expense.value)}));
    const income = data.budget.income.map(income => ({...income, value: parseInt(income.value)}));
    onSubmit({ budget: {
      ...data.budget,
      income,
      expenses
    }});
  };

  return (
    <Form onSubmit={handleSubmit(thisOnSubmit)} className="mt-3">
      <Table size="sm">
        <thead>
          <tr>
            <td></td>
            <td>Expense</td>
            <td>Value</td>
          </tr>
        </thead>
        <tbody>
          {fieldsExpenses.map((field, index) => (
            <tr key={field.id}>
              <td valign="middle">
                <Button variant="danger" size="sm" onClick={() => removeExpense(index)}>Remove</Button>
              </td>
              <td>
                <Form.Group>
                  <Form.Label className="visually-hidden">Name</Form.Label>
                  <Controller
                    name={`budget.expenses.${index}.name`}
                    control={control}
                    rules={{
                      required: true,
                    }}
                    defaultValue={''}
                    render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter a name for the expense" />}
                  />            
                  {errors.budget?.expenses && errors.budget?.expenses[index] && errors.budget?.expenses[index].name?.type === 'required' && <Form.Text className="text-danger">A name is required</Form.Text>}
                </Form.Group>
              </td>
              <td width="20%">
                <Form.Group>
                  <Form.Label className="visually-hidden">Value</Form.Label>
                  <Controller
                    name={`budget.expenses.${index}.value`}
                    control={control}
                    rules={{
                      required: true,
                      min: 0
                    }}
                    defaultValue={0}
                    render={({ field }) => <Form.Control {...field} type="number" placeholder="Value" />}
                  />            
                  {/* <Form.Text>(50 words max.)</Form.Text> */}
                  {errors.budget?.expenses && errors.budget?.expenses[index] && errors.budget?.expenses[index].value?.type === 'required' && <Form.Text className="text-danger"><br/>A value is required</Form.Text>}
                  {errors.budget?.expenses && errors.budget?.expenses[index] && errors.budget?.expenses[index].value?.type === 'min' && <Form.Text className="text-danger"><br/>Must be a valid number</Form.Text>}
                </Form.Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Row>
        <Col>
          <Button variant="primary" onClick={() => appendExpense()}>Add Expense</Button>
        </Col>
        <Col className="text-end">
          <p className="h6">Expenses Total: <b><NumberFormat value={expenseTotal} displayType={'text'} thousandSeparator={true} prefix={'$'} /></b></p>
        </Col>
      </Row>

      <Table size="sm">
        <thead>
          <tr>
            <td></td>
            <td>Income</td>
            <td>Value</td>
          </tr>
        </thead>
        <tbody>
          {fieldsIncome.map((field, index) => (
            <tr key={field.id}>
              <td valign="middle">
                <Button variant="danger" size="sm" onClick={() => removeIncome(index)} disabled={index === 0}>Remove</Button>
              </td>
              <td>
                <Form.Group>
                  <Form.Label className="visually-hidden">Name</Form.Label>
                  <Controller
                    name={`budget.income.${index}.name`}
                    control={control}
                    rules={{
                      required: true
                    }}
                    defaultValue={''}
                    render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter a name for the income" disabled={index === 0} />}
                  />            
                  {errors.budget?.income && errors.budget?.income[index] && errors.budget?.income[index].name?.type === 'required' && <Form.Text className="text-danger">A name is required</Form.Text>}
                </Form.Group>
              </td>
              <td width="20%">
                <Form.Group>
                  <Form.Label className="visually-hidden">Value</Form.Label>
                  <Controller
                    name={`budget.income.${index}.value`}
                    control={control}
                    rules={{
                      required: true,
                      min: 0
                    }}
                    defaultValue={0}
                    render={({ field }) => <Form.Control {...field} type="number" placeholder="Value" disabled={index === 0} />}
                  />            
                  {/* <Form.Text>(50 words max.)</Form.Text> */}
                  {errors.budget?.income && errors.budget?.income[index] && errors.budget?.income[index].value?.type === 'required' && <Form.Text className="text-danger"><br/>A value is required</Form.Text>}
                  {errors.budget?.income && errors.budget?.income[index] && errors.budget?.income[index].value?.type === 'min' && <Form.Text className="text-danger"><br/>Must be a valid number</Form.Text>}
                </Form.Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Row>
        <Col>
          <Button variant="primary" onClick={() => appendIncome()}>Add Income</Button>
        </Col>
        <Col className="text-end">
          <p className="h6">Income Total: <b><NumberFormat value={incomeTotal} displayType={'text'} thousandSeparator={true} prefix={'$'} /></b></p>
        </Col>
      </Row>
      
      <Row>
        <Col className="text-end">
          <p className={`h5 ${budgetTotal === 0 ? 'text-success' : 'text-danger'}`}>
            Difference: <b><NumberFormat value={budgetTotal} displayType={'text'} thousandSeparator={true} prefix={'$'} /></b>
          </p>
        </Col>
      </Row>

      <Stack direction="horizontal" gap={2} className="justify-content-end">
        <Button variant="secondary" onClick={() => hideModal()}>Cancel</Button>
        <Button variant="primary" type="submit">Save</Button>
      </Stack>
    </Form>
  );
};

export default FormBudget;
