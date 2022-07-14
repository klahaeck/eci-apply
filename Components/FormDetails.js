import { Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Form,
  Stack,
  Button,
} from 'react-bootstrap';

const FormDetails = ({ questions, submission, onSubmit, hideModal }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: submission
  });

  const thisOnSubmit = (data) => onSubmit({ details: data.details });

  return (
    <Form onSubmit={handleSubmit(thisOnSubmit)} className="mt-3">
      {questions.map((q, index) => (<Fragment key={index}>
        {/* <input type="hidden" {...register(`details[${index}].id`)} defaultValue={`${q.id}`} /> */}
        <input type="hidden" {...register(`details[${index}].question`)} defaultValue={`${q.question}`} />
        <Form.Group className="mb-3">
          <Form.Label>{q.question}</Form.Label>
          <Controller
            name={`details[${index}].answer`}
            control={control}
            defaultValue={q.answer}
            rules={{
              required: q.validations.required,
              // pattern: /^[A-Za-z]+$/
            }}
            render={({ field }) => <Form.Control {...field} as="textarea" placeholder={q.placeholder} />}
          />
          {errors.details && errors.details[index]?.answer?.type === 'required' && <><Form.Text className="text-danger">An answer is required</Form.Text><br /></>}
          {q.helperText !== '' && <Form.Text>{q.helperText}</Form.Text>}
        </Form.Group>
      </Fragment>))}
      
      <Stack direction="horizontal" gap={2} className="justify-content-end">
        <Button variant="secondary" onClick={() => hideModal()}>Cancel</Button>
        <Button variant="primary" type="submit">Save</Button>
      </Stack>
    </Form>
  );
};

export default FormDetails;
