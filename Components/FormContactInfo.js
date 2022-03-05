import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hideModal } from '../store/overlays/reducer';
import { useForm, Controller } from 'react-hook-form';
import Input from 'react-phone-number-input/input';
import {
  Form,
  Stack,
  Button,
} from 'react-bootstrap';

const FormContactInfo = ({ submissionData, hideModal }) => {
  const { handleSubmit, control, formState: { errors } } = useForm();

  const onSubmit = async data => {
    console.log('data:', data);
    // const res = await fetch('/api/programs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // const resData = await res.json();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Controller
          name="leadOrganizer.name"
          control={control}
          defaultValue={submissionData.leadOrganizer.name}
          rules={{
            required: true
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter a name" />}
        />            
        {errors.leadOrganizer?.name?.type === 'required' && <Form.Text className="text-danger">A name is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Controller
          name="leadOrganizer.email"
          control={control}
          defaultValue={submissionData.leadOrganizer.email}
          rules={{
            required: true
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter an email address" />}
        />            
        {errors.leadOrganizer?.email?.type === 'required' && <Form.Text className="text-danger">An email address is required</Form.Text>}
        {/* {errors.title?.type === 'pattern' && <Form.Text className="text-danger">A title is required</Form.Text>} */}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Phone</Form.Label>
        <Controller
          name="leadOrganizer.phone_numer"
          control={control}
          defaultValue={submissionData.leadOrganizer.phone_number}
          rules={{
            required: true,
            pattern: /\+[0-9]{11}$/
          }}
          render={({ field }) => <Input {...field} country="US" className="form-control" />}
        />            
        {errors.leadOrganizer?.phone_numer?.type === 'required' && <Form.Text className="text-danger">A phone number is required</Form.Text>}
        {errors.leadOrganizer?.phone_numer?.type === 'pattern' && <Form.Text className="text-danger">A valid phone number is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Address 1</Form.Label>
        <Controller
          name="leadOrganizer.address0"
          control={control}
          defaultValue={submissionData.leadOrganizer.address0}
          rules={{
            required: true
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter an address" />}
        />            
        {errors.leadOrganizer?.address0?.type === 'required' && <Form.Text className="text-danger">An address is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Address 2</Form.Label>
        <Controller
          name="leadOrganizer.address1"
          control={control}
          defaultValue={submissionData.leadOrganizer.address1}
          rules={{
            required: false
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter an address" />}
        />            
        {errors.leadOrganizer?.address1?.type === 'required' && <Form.Text className="text-danger">An address is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>County</Form.Label>
        <Controller
          name="leadOrganizer.county"
          control={control}
          defaultValue={submissionData.leadOrganizer.county}
          rules={{
            required: true
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter a county" />}
        />            
        {errors.leadOrganizer?.county?.type === 'required' && <Form.Text className="text-danger">A county is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>I Identify As</Form.Label>
        <Controller
          name="leadOrganizer.identifyAs"
          control={control}
          defaultValue={submissionData.leadOrganizer.identifyAs}
          rules={{
            required: true
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} as="textarea" placeholder="I identify as..." />}
        />            
        <Form.Text>(50 words max. Please include all personally relevant demographic information)</Form.Text>
        {errors.leadOrganizer?.identifyAs?.type === 'required' && <Form.Text className="text-danger"><br/>Your personal identity is required</Form.Text>}
        
      </Form.Group>
      
      <Stack direction="horizontal" gap={2} className="justify-content-end">
        <Button variant="secondary" onClick={() => hideModal()}>Cancel</Button>
        <Button variant="primary" type="submit">Save</Button>
      </Stack>
    </Form>
  );
};

const mapDispatchToProps = (dispatch) => ({
  hideModal: bindActionCreators(hideModal, dispatch),
});

export default connect(null, mapDispatchToProps)(FormContactInfo);
