import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Row,
  Col,
  Form,
  Table,
  Stack,
  Button,
  OverlayTrigger,
  Popover
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

  const popoverExpenses = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Expenses may include:</Popover.Header>
      <Popover.Body>
        <ul>
          <li>Lead Organizer stipends</li>
          <li>Artist stipends</li>
          <li>Materials</li>
          <li>Facility rental</li>
          <li>Equipment rental</li>
          <li>Production costs</li>
          <li>Marketing</li>
          <li>Reception costs</li>
          <li>Other</li>
        </ul>
      </Popover.Body>
    </Popover>
  );

  const popoverIncome = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Not required, but could include:</Popover.Header>
      <Popover.Body>
        <ul>
          <li>Other grants</li>
          <li>Crowd funding</li>
          <li>Personal contributions</li>
          <li>Other fundraising</li>
        </ul>
      </Popover.Body>
    </Popover>
  );

  const popoverInKind = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">In-kind contributions can include:</Popover.Header>
      <Popover.Body>
        <ul>
          <li>Donated space</li>
          <li>Pro-bono design services</li>
          <li>Donated materials</li>
          <li>Donated online ad space or printing used for marketing the project</li>
          <li>Donated equipment</li>
        </ul>
      </Popover.Body>
    </Popover>
  );
  
  return (
    <>
      <p>Be realistic about your income and expenses. Your budget should demonstrate the feasibility of your project to the jurors. This program supports fair pay for all artists involved with your project; Lead Organizers may budget up to 15% of the total grant requested for their time organizing the project. Only funds paid toward personnel or artist stipends are taxable; they are the responsibility of the individual who is paid.</p>

      <p>The amount you have requested from the VAF will automatically display under the Income section. You are not expected to have additional income for the project outside of the Visual Arts Fund grant, but please indicate it if you do. Please check the box indicating whether the additional income listed is secured (that you have already confirmed or received the money); if it is not confirmed or needs to be sourced, leave the box unchecked. Your budget must show a zero balance between your Expenses and Income.</p>

      <p>If you have questions regarding your project budget, please contact us via phone (612) 605-4504 or email vaf@midwayart.org.</p>

      {/* <ul>
        <li>Expenses (Lead Organizer stipends, artist stipends, materials, facility rental, equipment rental, production costs, marketing, reception costs, other)</li>
        <li>Income (other grants, crowd funding, personal contributions, etc. — not required)</li>
        <li>In-Kind donations (donated location, pro-bono design services, donated materials, etc.)</li>
      </ul> */}
    
      <Form onSubmit={handleSubmit(thisOnSubmit)} className="mt-3">
        <h4 className="mt-5">Expenses - <OverlayTrigger trigger="hover" placement="right" overlay={popoverExpenses}>
            <Button variant="secondary" size="sm">Examples of what to include</Button>
          </OverlayTrigger>
        </h4>
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
        
        <h4 className="mt-5">Income - <OverlayTrigger trigger="hover" placement="right" overlay={popoverIncome}>
            <Button variant="secondary" size="sm">Examples of what to include</Button>
          </OverlayTrigger>
        </h4>
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

        <h4 className="mt-3">In-kind / Additional Budget Notes - <OverlayTrigger trigger="hover" placement="right" overlay={popoverInKind}>
            <Button variant="secondary" size="sm">Examples of in-kind contributions</Button>
          </OverlayTrigger>
        </h4>

        <p>Please list any in-kind contributions that you will receive and who will be donating the products/services. If you have other notes regarding your budget that may be helpful for the jurors you may indicate them in the text box below as well.</p>
        
        <Form.Group>
          <Form.Label>In-Kind Donations (50 words max)</Form.Label>
          <Controller
            name="budget.notes"
            control={control}
            rules={{
              // required: true,
              // min: 0
            }}
            // defaultValue={0}
            render={({ field }) => <Form.Control as="textarea" {...field} />}
          />            
          <Form.Text>(50 words max.)</Form.Text>
        </Form.Group>

        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button variant="secondary" onClick={() => hideModal()}>Cancel</Button>
          <Button variant="primary" type="submit">Save</Button>
        </Stack>
      </Form>
    </>
  );
};

export default FormBudget;
