import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import {
  Form,
  Stack,
  Button,
} from 'react-bootstrap';
import { stripHtml } from 'string-strip-html';

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false });

const FormStatement = ({ submission, onSubmit, hideModal }) => {
  const { statement } = submission;
  const { handleSubmit, control, formState: { errors } } = useForm();

  const thisOnSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Form onSubmit={handleSubmit(thisOnSubmit)} className="mt-3">
      <h3>Statement of Interest (500 words max)</h3>
      <p>Guiding questions to address include:</p>
      <ul>
        <li>Why are you interested in participating in a curatorial intensive program?</li>
        <li>How would you benefit from this program? What do you hope to learn?</li>
        <li>Why do you identify as a curator or why do you want to be a curator?</li>
        <li>What are some of the principles, values, beliefs or ideas that inspire you to do curatorial work?</li>
        <li>Are there curators who inspire you? Who would you like to learn from and why?</li>
      </ul>
      <p>We encourage you to work offline and copy and paste your text into this field.</p>
      <Form.Group className="mb-3">
        <Form.Label className="visually-hidden">Statement</Form.Label>
        <Controller
          control={control}
          name="statement"
          defaultValue={statement}
          rules={{
            validate: {
              required: (v) =>
                (v && stripHtml(v).result.length > 0) ||
                'A statement is required',
              // maxLength: (v) =>
              //   (v && stripHtml(v).result.length <= 2000) ||
              //   "Maximum character limit is 2000",
            }
          }}
          render={({ field }) => <RichEditor {...field} />}
        />
        {errors.statement?.type === 'required' && <Form.Text className="text-danger">A statement is required</Form.Text>}
      </Form.Group>
      
      <Stack direction="horizontal" gap={2} className="justify-content-end">
        <Button variant="secondary" onClick={() => hideModal()}>Cancel</Button>
        <Button variant="primary" type="submit">Save</Button>
      </Stack>
    </Form>
  );
};

export default FormStatement;
