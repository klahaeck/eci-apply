import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import {
  Form,
  Stack,
  Button,
} from 'react-bootstrap';
import { stripHtml } from 'string-strip-html';

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false });

const FormProposal = ({ submission, onSubmit, hideModal }) => {
  const { proposal } = submission;
  const { handleSubmit, control, formState: { errors } } = useForm();

  const thisOnSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Form onSubmit={handleSubmit(thisOnSubmit)} className="mt-3">
      <h3>Exhibition or Curatorial Project Proposal (1000 words max)</h3>
      <p>Proposals are intended to give us an idea of what curatorial project you would like to develop. Proposals are intended to be workshopped throughout the fellowship program, so applicants will not be judged on completeness of their proposals but instead on the quality of the ideas and potential for success within the framework of the program. Proposals are not limited to a gallery exhibition, they may include events, public programs, publications, or other experimental curatorial practices. Proposals may include art practices across any discipline (visual arts, film, media, community-based work, social practice, craft, sound, performance, etc.).</p>
      <p>Questions that might inspire your proposal include (not all are required):</p>
      <ul>
        <li>Is there a curatorial project you would like to organize?</li>
        <li>What themes or topics interest you and why?</li>
        <li>Why is this important to you?</li>
        <li>Which artists could be involved, or would you like to work with? Do you have an existing relationship with them?</li>
        <li>If you don’t plan to work with artists, which objects or materials would support your project?</li>
        <li>What kind of venue would work best for this exhibition/project? Is it in a gallery or somewhere else?</li>
      </ul>
      <p>We encourage you to work offline and copy and paste your text into this field.</p>
      <Form.Group className="mb-3">
        <Form.Label className="visually-hidden">Proposal</Form.Label>
        <Controller
          control={control}
          name="proposal"
          defaultValue={proposal}
          rules={{
            validate: {
              required: (v) =>
                (v && stripHtml(v).result.length > 0) ||
                'A proposal is required',
              // maxLength: (v) =>
              //   (v && stripHtml(v).result.length <= 2000) ||
              //   "Maximum character limit is 2000",
            }
          }}
          render={({ field }) => <RichEditor {...field} />}
        />
        {errors.proposal?.type === 'required' && <Form.Text className="text-danger">A proposal is required</Form.Text>}
      </Form.Group>
      
      <Stack direction="horizontal" gap={2} className="justify-content-end">
        <Button variant="secondary" onClick={() => hideModal()}>Cancel</Button>
        <Button variant="primary" type="submit">Save</Button>
      </Stack>
    </Form>
  );
};

export default FormProposal;
