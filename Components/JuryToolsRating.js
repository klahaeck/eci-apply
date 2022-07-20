import { useEffect, useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Form
} from 'react-bootstrap';

const JuryToolsRating = ({ program, submission, mutate }) => {
  const { user } = useUser();
  const { watch, handleSubmit, control, formState: { errors } } = useForm();

  const { fields: scopes, replace: replaceScopes } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'scopes', // unique name for your Field Array
  });

  useEffect(() => {
    replaceScopes(!submission.ratingScopes?.length ? program.ratingScopes : submission.ratingScopes);
  }, [program.ratingScopes, submission.ratingScopes, replaceScopes]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === 'change') {
        onSubmit(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [onSubmit, watch]);

  const sortScopes = (a, b) => {
    if (a.weight === b.weight) {
      const attributeA = a.attribute.toUpperCase();
      const attributeB = b.attribute.toUpperCase();
      if (attributeA < attributeB) {
        return -1;
      }
      if (attributeA > attributeB) {
        return 1;
      }
      return 0;
    }
    return b.weight - a.weight;
  };

  const onSubmit = useCallback(async (data) => {
    const mappedScopes = data.scopes.map(s => ({...s, value: parseInt(s.value) || 0}));
    data.scopes = mappedScopes;
    await fetch(`/api/ratings?submissionId=${submission._id}&userId=${user.sub}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    mutate();    
  }, [mutate, submission, user]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
      {submission['avgRating'] === undefined && <>
        <p className="h4">Your Rating: <b>{submission.myRating}</b></p>
        {scopes.sort(sortScopes).map((scope, index) => (
          <div key={scope.id}>
            <Form.Label className="mb-0">{scope.attribute} ({scope.weight}%)</Form.Label>
            <Controller
              name={`scopes.${index}.value`}
              control={control}
              defaultValue={scope.value || 0}
              render={({ field }) => <Form.Range {...field} min="0" max="5" step="1" />}
            />
          </div>
        ))}
      </>}
      {submission['avgRating'] !== undefined && <p className="h4">Avg Rating: <b>{submission.avgRating}</b></p>}
    </Form>
  );
};

export default JuryToolsRating;