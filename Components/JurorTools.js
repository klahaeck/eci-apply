import { useRef, useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import fetcher from '../lib/fetcher';
import { useUser } from '@auth0/nextjs-auth0';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import debounce from 'lodash/debounce';
import {
  Row,
  Col,
  Card,
  Form
} from 'react-bootstrap';

const JurorTools = ({ program, submissionId }) => {
  const { user } = useUser();
  const { ratingScopes } = program;
  const initialized = useRef(false);
  const [ myRating, setMyRating ] = useState(0);
  const { mutate, data, error } = useSWR(program && submissionId && user ? `/api/ratings?submissionId=${submissionId}&userId=${user.sub}` : null, fetcher);
  const { watch, setValue, getValues, handleSubmit, control, formState: { errors } } = useForm({
    // defaultValue: {
    //   scopes: ratingScopes.map(scope => ({ ...scope, value: 0 })),
    //   notes: ''
    // }
  });

  const { fields: scopes, replace: replaceScopes } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'scopes', // unique name for your Field Array
  });

  useEffect(() => {
    if (data) {
      if (!data._id) {
        mutate({
          scopes: ratingScopes.map(scope => ({ ...scope, value: 0 })),
          notes: ''
        }, false);
      }
      if (!initialized.current && data.scopes?.length > 0) {
        setValue('notes', data.notes);
        replaceScopes(data.scopes);
        setMyRating(data.ratingTotal);
        initialized.current = true;
      }
    }
  }, [mutate, setValue, replaceScopes, ratingScopes, data]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === 'change') {
        const values = getValues();
        setMyRating(parseFloat(values.scopes.reduce((accumulator, scope) => accumulator + (scope.value * (scope.weight / 100)), 0).toFixed(3)));
        onSubmit(values);
      }
    });
    return () => subscription.unsubscribe();
  }, [getValues, onSubmit, watch]);

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

  const debouncedOnSubmit = debounce(async (formData) => {
    const mappedScopes = formData.scopes.map(s => ({...s, value: parseInt(s.value)}));
    formData.scopes = mappedScopes;
    await fetch(`/api/ratings?submissionId=${submissionId}&userId=${user.sub}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
  }, 500);

  const onSubmit = useCallback((formData) => debouncedOnSubmit(formData), [debouncedOnSubmit]);

  if (error) return <p>There has been an error loading the juror tools.</p>;
  if (!data) return <p>Loading juror tools...</p>;

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
      <Card className="p-3 my-3">
        <Row>
          <Col>
            <p className="h4">Your Rating: <b>{myRating}</b></p>
            {scopes.sort(sortScopes).map((scope, index) => (
              <div key={scope.id}>
                <Form.Label className="mb-0">{scope.attribute} ({scope.weight}%)</Form.Label>
                <Controller
                  name={`scopes.${index}.value`}
                  control={control}
                  defaultValue={scope.value}
                  render={({ field }) => <Form.Range {...field} min="0" max="5" step="1" />}
                />
              </div>
            ))}
          </Col>
          <Col>
            {/* <p className="h4">Notes</p> */}
            <Form.Group className="h4 mb-3">
              <Form.Label>Notes</Form.Label>
              <Controller
                name="notes"
                control={control}
                defaultValue={data.notes}
                render={({ field }) => <Form.Control {...field} as="textarea" placeholder="your notes..." rows="5" />}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default JurorTools;