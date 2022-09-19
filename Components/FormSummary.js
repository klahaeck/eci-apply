import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import {
  Form,
  Stack,
  Button,
  // InputGroup
} from 'react-bootstrap';
// import { getBudgetWithRequestedGrantValue, getBudgetTotal } from '../lib/utils';
import { grantAmounts } from '../data';

const Select = dynamic(() => import('react-select'), { ssr: false });

const FormSummary = ({ submission, onSubmit, hideModal }) => {
  const { title, budgetRequested, startDate, completionDate, summary } = submission;
  const { handleSubmit, control, formState: { errors } } = useForm();

  // const filteredIncome = getBudgetWithRequestedGrantValue(submission);
  // const expensesTotal = getBudgetTotal(submission.budget.expenses);
  // const incomeTotal = getBudgetTotal(filteredIncome);
  // const budgetTotal = getDifference(incomeTotal, expensesTotal);

  const thisOnSubmit = (data) => {
    // data.budgetTotal = parseInt(data.budgetTotal);
    data.budgetRequested = data.budgetRequested.value;
    data.startDate = new Date(data.startDate).toISOString();
    data.completionDate = new Date(data.completionDate).toISOString();
    onSubmit(data);
  };

  return (
    <Form onSubmit={handleSubmit(thisOnSubmit)} className="mt-3">
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Controller
          name="title"
          control={control}
          defaultValue={title}
          rules={{
            required: true
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter a title" />}
        />
        {errors.title?.type === 'required' && <Form.Text className="text-danger">A title is required</Form.Text>}
      </Form.Group>

      {/* <Form.Group className="mb-3">
        <Form.Label>Total Budget</Form.Label>
        <Controller
          name="budgetTotal"
          control={control}
          defaultValue={expensesTotal}
          rules={{
            required: true,
            // valueAsNumber: true,
          }}
          render={({ field }) => <InputGroup>
            <InputGroup.Text>$</InputGroup.Text>
            <Form.Control {...field} type="number" placeholder="Enter a total budget" disabled={true} />
          </InputGroup>}
        />       
        <Form.Text>Edit this in the Budget section</Form.Text>     
        {errors.budgetTotal?.type === 'required' && <Form.Text className="text-danger">A total budget is required</Form.Text>}
      </Form.Group> */}

      <Form.Group className="mb-3">
        <Form.Label>Amount Requested</Form.Label>
        <Controller
          control={control}
          name="budgetRequested"
          defaultValue={grantAmounts.find(obj => parseInt(obj.value) === budgetRequested)}
          rules={{
            required: true
          }}
          render={({ field }) => <Select {...field} options={grantAmounts} placeholder="Select a requested amount" className="select-custom" />}
        />
        {errors.budgetRequested?.type === 'required' && <Form.Text className="text-danger">A requested amount is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Start Date</Form.Label>
        <Controller
          name="startDate"
          control={control}
          defaultValue={startDate ? new Date(startDate).toISOString().substring(0, 10) : ''}
          rules={{
            required: true,
            valueAsDate: true,
          }}
          render={({ field }) => <Form.Control {...field} type="date" placeholder="Start date" />}
        />
        {errors.startDate?.type === 'required' && <Form.Text className="text-danger">A start date is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Completion Date</Form.Label>
        <Controller
          name="completionDate"
          control={control}
          defaultValue={completionDate ? new Date(completionDate).toISOString().substring(0, 10) : ''}
          rules={{
            required: true,
            valueAsDate: true,
          }}
          render={({ field }) => <Form.Control {...field} type="date" placeholder="Completion date" />}
        />
        {errors.completionDate?.type === 'required' && <Form.Text className="text-danger">A completion date is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Summary</Form.Label>
        <Controller
          name="summary"
          control={control}
          defaultValue={summary}
          rules={{
            required: true
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} as="textarea" placeholder="project summary..." />}
        />
        {errors.summary?.type === 'required' && <><Form.Text className="text-danger">A summary is required</Form.Text><br/></>}
        <Form.Text>(100 words max.)</Form.Text>
      </Form.Group>
      
      <Stack direction="horizontal" gap={2} className="justify-content-end">
        <Button variant="secondary" onClick={() => hideModal()}>Cancel</Button>
        <Button variant="primary" type="submit">Save</Button>
      </Stack>
    </Form>
  );
};

export default FormSummary;
