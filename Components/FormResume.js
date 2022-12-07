import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import {
  Form,
  Stack,
  Button,
} from 'react-bootstrap';
import { stripHtml } from 'string-strip-html';

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false });

const FormResume = ({ submission, onSubmit, hideModal }) => {
  const { resume } = submission;
  const { handleSubmit, control, formState: { errors } } = useForm();

  const thisOnSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Form onSubmit={handleSubmit(thisOnSubmit)} className="mt-3">
      <h3>Resume</h3>
      <p>A resumé can take the form of a professional CV, a biography, or a listing of your accomplishments in the arts or adjacent fields. Previous curatorial experience is not required, but you must make a connection to your experience in your proposal and statement of interest.</p>
      <p>We encourage you to work offline and copy and paste your text into this field.</p>
      <Form.Group className="mb-3">
        <Form.Label className="visually-hidden">Resume</Form.Label>
        <Controller
          control={control}
          name="resume"
          defaultValue={resume}
          rules={{
            validate: {
              required: (v) =>
                (v && stripHtml(v).result.length > 0) ||
                'A resume is required',
              // maxLength: (v) =>
              //   (v && stripHtml(v).result.length <= 2000) ||
              //   "Maximum character limit is 2000",
            }
          }}
          render={({ field }) => <RichEditor {...field} />}
        />
        {errors.resume?.type === 'required' && <Form.Text className="text-danger">A resume is required</Form.Text>}
      </Form.Group>
      
      <Stack direction="horizontal" gap={2} className="justify-content-end">
        <Button variant="secondary" onClick={() => hideModal()}>Cancel</Button>
        <Button variant="primary" type="submit">Save</Button>
      </Stack>
    </Form>
  );
};

export default FormResume;
