import { Fragment, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import Input from 'react-phone-number-input/input';
import {
  Form,
  Stack,
  Button,
} from 'react-bootstrap';
import Select from 'react-select';
import { states } from '../data';

const FormContactInfo = ({ submission, onSubmit, hideModal }) => {
  const { contacts } = submission;
  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: { contacts },
  });

  const { fields } = useFieldArray({
    control,
    name: 'contacts'
  });

  useEffect(() => {
    console.log(fields);
  }, [fields]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
      {fields.map((field, index) => (
        <Fragment key={field.id}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Controller
              name="contacts.0.name"
              control={control}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter a name" />}
            />            
            {errors.contacts && errors.contacts[index].name?.type === 'required' && <Form.Text className="text-danger">A name is required</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Controller
              name="contacts.0.email"
              control={control}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter an email address" />}
            />            
            {errors.contacts && errors.contacts[index]?.email?.type === 'required' && <Form.Text className="text-danger">An email address is required</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Controller
              name="contacts.0.phone_number"
              control={control}
              rules={{
                required: true,
                pattern: /\+[0-9]{11}$/
              }}
              render={({ field }) => <Input {...field} country="US" className="form-control" />}
            />            
            {errors.contacts && errors.contacts[index]?.phone_number?.type === 'required' && <Form.Text className="text-danger">A phone number is required</Form.Text>}
            {errors.contacts && errors.contacts[index]?.phone_number?.type === 'pattern' && <Form.Text className="text-danger">A valid phone number is required</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Street Address</Form.Label>
            <Controller
              name="contacts.0.address0"
              control={control}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter an address" />}
            />            
            {errors.contacts && errors.contacts[index]?.address0?.type === 'required' && <Form.Text className="text-danger">An address is required</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Controller
              name="contacts.0.city"
              control={control}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter a city" />}
            />            
            {errors.contacts && errors.contacts[index]?.city?.type === 'required' && <Form.Text className="text-danger">A city is required</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>State</Form.Label>
            <Controller
              control={control}
              name="contacts.0.state"
              rules={{
                required: true
              }}
              render={({ field }) => <Select {...field} options={states} placeholder="Select state" className="select-custom" />}
            />
            {errors.contacts && errors.contacts[index]?.state?.type === 'required' && <Form.Text className="text-danger">A state is required</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Zip</Form.Label>
            <Controller
              name="contacts.0.zip"
              control={control}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter a zip code" />}
            />            
            {errors.contacts && errors.contacts[index]?.zip?.type === 'required' && <Form.Text className="text-danger">Your zip is required</Form.Text>}
            
          </Form.Group>
        </Fragment>
      ))}
      
      <Stack direction="horizontal" gap={2} className="justify-content-end">
        <Button variant="secondary" onClick={() => hideModal()}>Cancel</Button>
        <Button variant="primary" type="submit">Save</Button>
      </Stack>
    </Form>
  );
};

export default FormContactInfo;
