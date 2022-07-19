import { useCallback, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useForm, Controller } from 'react-hook-form';
import debounce from 'lodash/debounce';
import {
  Form
} from 'react-bootstrap';

const JuryToolsNotes = ({ submission, mutate }) => {
  const { user } = useUser();
  const { watch, getValues, handleSubmit, control, formState: { errors } } = useForm();

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === 'change') onSubmit(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, getValues, onSubmit]);

  const debouncedOnSubmit = debounce(async (data) => {
    await fetch(`/api/notes?submissionId=${submission._id}&userId=${user.sub}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    mutate();    
  }, 500);

  const onSubmit = useCallback((data) => debouncedOnSubmit(data), [debouncedOnSubmit]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
      <Form.Group className="h4 mb-3">
        <Form.Label>Notes</Form.Label>
        <Controller
          name="content"
          control={control}
          defaultValue={submission.myNotes?.content}
          render={({ field }) => <Form.Control {...field} as="textarea" placeholder="your notes..." rows="5" />}
        />
      </Form.Group>
    </Form>
  );
};

export default JuryToolsNotes;