import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hideModal } from '../store/overlays/reducer';
import { useForm, Controller } from 'react-hook-form';
import Input from 'react-phone-number-input/input';
import {
  Form,
  Stack,
  Button,
} from 'react-bootstrap';

const FormSummary = ({ submissionData, hideModal }) => {
  const { handleSubmit, control, formState: { errors } } = useForm();

  const onSubmit = async data => {
    console.log('summary:', data);
    // const res = await fetch('/api/programs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // const resData = await res.json();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Controller
          name="title"
          control={control}
          defaultValue={submissionData.title}
          rules={{
            required: true
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter a title" />}
        />            
        {errors.title?.type === 'required' && <Form.Text className="text-danger">A title is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Summary</Form.Label>
        <Controller
          name="summary"
          control={control}
          defaultValue={submissionData.summary}
          rules={{
            required: true
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} as="textarea" placeholder="project summary..." />}
        />            
        <Form.Text>(50 words max.)</Form.Text>
        {errors.summary?.type === 'required' && <Form.Text className="text-danger"><br/>A summary is required</Form.Text>}
        
      </Form.Group>
      
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

export default connect(null, mapDispatchToProps)(FormSummary);
