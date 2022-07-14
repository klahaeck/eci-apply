import { useForm, Controller } from 'react-hook-form';
import {
  Form,
  Stack,
  Button,
} from 'react-bootstrap';

const FormAdmin = ({ submission, onSubmit }) => {
  const { submitted, eligible } = submission;
  const { handleSubmit, control, formState: { errors } } = useForm();

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="horizontal" gap={5}>
        <Form.Group className="my-3">
          <Controller
            control={control}
            name="submitted"
            defaultValue={submitted}
            render={({ field }) => <Form.Check {...field} type="switch" label="Submitted" defaultChecked={submitted} />}
          />
        </Form.Group>

        <Form.Group className="my-3">
          <Controller
            control={control}
            name="eligible"
            defaultValue={eligible}
            render={({ field }) => <Form.Check {...field} type="switch" label="Eligible" defaultChecked={eligible} />}
          />
        </Form.Group>
      </Stack>

      {/* <Form.Group className="my-3">
        <Form.Label>User</Form.Label>
        <Controller
          control={control}
          name="user"
          defaultValue={submissionData.user}
          rules={{
            required: true
          }}
          render={({ field }) => <AsyncSelect {...field} placeholder="Select a user" defaultOptions loadOptions={getUsers} getOptionValue={option => option.id} getOptionLabel={option => option.email} className="select-custom" />}
        />
        {errors.user?.id?.type === 'required' && <Form.Text className="text-danger">A user is required</Form.Text>}
      </Form.Group> */}

      <Button type="submit">Save</Button>
    </Form>
  );
};

export default FormAdmin;