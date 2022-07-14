import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Row,
  Col,
  Form,
  Stack,
  Button,
  Card
} from 'react-bootstrap';
import { defaultBio } from '../data';

const FormBios = ({ submission, onSubmit, hideModal }) => {
  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: submission,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'bios'
  });

  const addBio = () => append(defaultBio);
  const removeBio = (index) => {
    if (window.confirm('Are you sure you want to remove this bio?')) {
      remove(index);
    }
  };

  const thisOnSubmit = (data) => onSubmit({ bios: data.bios });

  return (
    <Form onSubmit={handleSubmit(thisOnSubmit)} className="mt-3">
      {fields.map((field, index) => (
        <Card body key={field.id} className="mb-3">
          <Button variant="danger" size="sm" onClick={() => removeBio(index)} className="position-absolute top-0 end-0"><i className="bi bi-trash-fill"></i></Button>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Controller
              name={`bios.${index}.name`}
              control={control}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter a name" />}
            />            
            {errors.bios && errors.bios[index] && errors.bios[index].name?.type === 'required' && <Form.Text className="text-danger">A name is required</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Controller
              name={`bios.${index}.bio`}
              control={control}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} as="textarea" placeholder="Bio..." />}
            />            
            {errors.bios && errors.bios[index] && errors.bios[index].bio?.type === 'required' && <><Form.Text className="text-danger">Your personal identity is required</Form.Text><br/></>}
            <Form.Text>(50 words max.)</Form.Text>
          </Form.Group>
        </Card>
      ))}

      <Row>
        <Col>
          <Button variant="success" onClick={() => addBio()} disabled={fields.length >= 5}><i className="bi bi-plus-lg"></i> Add Bio</Button>
        </Col>
        <Col>
          <Stack direction="horizontal" gap={2} className="justify-content-end">
            <Button variant="secondary" onClick={() => hideModal()}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default FormBios;
