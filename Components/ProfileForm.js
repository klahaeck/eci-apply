import dynamic from 'next/dynamic';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import merge from 'lodash/merge';
import {
  Form,
  Button
} from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import Input from 'react-phone-number-input/input';
import { defaultProfile, states } from '../data';

const Select = dynamic(() => import('react-select'), { ssr: false });

const ProfileForm = ({ user }) => {
  const formData = merge(defaultProfile, user);

  const { handleSubmit, control, formState: { errors } } = useForm();

  const onSubmit = async data => {
    // console.log(data);
    data.user_metadata.state = data.user_metadata.state.value;
    
    const res = await fetch(`/api/users/${user.user_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    console.log(res);
    // const resData = await res.json();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
      <Form.Group className="mb-3">
        <Form.Label>Phone</Form.Label>
        <Controller
          name="user_metadata.phone_number"
          control={control}
          defaultValue={formData.user_metadata.phone_number}
          rules={{
            required: true,
            pattern: /\+[0-9]{11}$/
          }}
          render={({ field }) => <Input {...field} country="US" className="form-control" />}
        />            
        {errors.user_metadata?.phone_number?.type === 'required' && <Form.Text className="text-danger">Your phone number is required</Form.Text>}
        {errors.user_metadata?.phone_number?.type === 'pattern' && <Form.Text className="text-danger">A valid phone number is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Street 1</Form.Label>
        <Controller
          name="user_metadata.address0"
          control={control}
          defaultValue={formData.user_metadata.address0}
          rules={{
            required: true
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Street address 1" />}
        />            
        {errors.user_metadata?.address0?.type === 'required' && <Form.Text className="text-danger">Your street address is required</Form.Text>}
        {/* {errors.title?.type === 'pattern' && <Form.Text className="text-danger">A title is required</Form.Text>} */}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Street 2</Form.Label>
        <Controller
          name="user_metadata.address1"
          control={control}
          defaultValue={formData.user_metadata.address1}
          rules={{
            required: false
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Street address 2" />}
        />            
        {errors.user_metadata?.address1?.type === 'required' && <Form.Text className="text-danger">Your street address is required</Form.Text>}
        {/* {errors.title?.type === 'pattern' && <Form.Text className="text-danger">A title is required</Form.Text>} */}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>City</Form.Label>
        <Controller
          name="user_metadata.city"
          control={control}
          defaultValue={formData.user_metadata.city}
          rules={{
            required: true
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="City" />}
        />            
        {errors.user_metadata?.city?.type === 'required' && <Form.Text className="text-danger">Your city is required</Form.Text>}
        {/* {errors.title?.type === 'pattern' && <Form.Text className="text-danger">A title is required</Form.Text>} */}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>State</Form.Label>
        <Controller
          name="user_metadata.state"
          control={control}
          defaultValue={states.find(s => s.value === formData.user_metadata.state)}
          rules={{
            required: true
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Select {...field} options={states} placeholder="Select State" className="select-custom" />}
        />            
        {errors.user_metadata?.state?.type === 'required' && <Form.Text className="text-danger">Your state is required</Form.Text>}
        {/* {errors.title?.type === 'pattern' && <Form.Text className="text-danger">A title is required</Form.Text>} */}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Zip</Form.Label>
        <Controller
          name="user_metadata.zip"
          control={control}
          defaultValue={formData.user_metadata.zip}
          rules={{
            required: true
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Zip" />}
        />            
        {errors.user_metadata?.zip?.type === 'required' && <Form.Text className="text-danger">Your zip code is required</Form.Text>}
        {/* {errors.title?.type === 'pattern' && <Form.Text className="text-danger">A title is required</Form.Text>} */}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>County</Form.Label>
        <Controller
          name="user_metadata.county"
          control={control}
          defaultValue={formData.user_metadata.county}
          rules={{
            required: true
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="County" />}
        />            
        {errors.user_metadata?.county?.type === 'required' && <Form.Text className="text-danger">Your county is required</Form.Text>}
        {/* {errors.title?.type === 'pattern' && <Form.Text className="text-danger">A title is required</Form.Text>} */}
      </Form.Group>

      <Button variant="primary" type="submit" className="float-end">Save</Button>
    </Form>
  );
};

export default ProfileForm;