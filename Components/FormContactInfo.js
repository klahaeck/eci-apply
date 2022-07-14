import { Fragment } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import Input from 'react-phone-number-input/input';
import {
  Form,
  Stack,
  Button,
} from 'react-bootstrap';

const FormContactInfo = ({ submission, onSubmit, hideModal }) => {
  const { contacts } = submission;
  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: { contacts },
  });

  const { fields } = useFieldArray({
    control,
    name: 'contacts'
  });

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
              name="contacts.0.phone_numer"
              control={control}
              rules={{
                required: true,
                pattern: /\+[0-9]{11}$/
              }}
              render={({ field }) => <Input {...field} country="US" className="form-control" />}
            />            
            {errors.contacts && errors.contacts[index]?.phone_numer?.type === 'required' && <Form.Text className="text-danger">A phone number is required</Form.Text>}
            {errors.contacts && errors.contacts[index]?.phone_numer?.type === 'pattern' && <Form.Text className="text-danger">A valid phone number is required</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address 1</Form.Label>
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
            <Form.Label>Address 2</Form.Label>
            <Controller
              name="contacts.0.address1"
              control={control}
              rules={{
                required: false
              }}
              render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter an address" />}
            />            
            {errors.contacts && errors.contacts[index]?.address1?.type === 'required' && <Form.Text className="text-danger">An address is required</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>County</Form.Label>
            <Controller
              name="contacts.0.county"
              control={control}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter a county" />}
            />            
            {errors.contacts && errors.contacts[index]?.county?.type === 'required' && <Form.Text className="text-danger">A county is required</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>I Identify As</Form.Label>
            <Controller
              name="contacts.0.identifyAs"
              control={control}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} as="textarea" placeholder="I identify as..." />}
            />            
            {errors.contacts && errors.contacts[index]?.identifyAs?.type === 'required' && <><Form.Text className="text-danger">Your personal identity is required</Form.Text><br/></>}
            <Form.Text>(50 words max. Please include all personally relevant demographic information)</Form.Text>
            
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
