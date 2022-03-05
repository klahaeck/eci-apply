import { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hideModal } from '../store/overlays/reducer';
import { useForm, Controller } from 'react-hook-form';
import {
  Form,
  Stack,
  Button,
} from 'react-bootstrap';

const FormDetails = ({ questions, submissionData, hideModal }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    // defaultValues: submissionData.details,
  });

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: 'details'
  // });

  const onSubmit = async data => {
    console.log('details:', data);
    // const res = await fetch('/api/programs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // const resData = await res.json();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
      {questions.map((q, index) => (<Fragment key={index}>
        <input type="hidden" {...register(`details[${index}].id`)} defaultValue={`${q.id}`} />
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
          {q.helperText !== '' && <Form.Text>{q.helperText}</Form.Text>}
          {errors.details && errors.details[index]?.answer?.type === 'required' && <Form.Text className="text-danger"><br />An answer is required</Form.Text>}
        </Form.Group>
      </Fragment>))}
      
      <Stack direction="horizontal" gap={2} className="justify-content-end">
        <Button variant="secondary" onClick={() => hideModal()}>Cancel</Button>
        <Button variant="primary" type="submit">Save</Button>
      </Stack>
    </Form>
  );
};

const mapDispatchToProps = (dispatch) => ({
  hideModal: bindActionCreators(hideModal, dispatch),
});

export default connect(null, mapDispatchToProps)(FormDetails);
