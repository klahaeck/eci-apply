import { useForm, Controller } from 'react-hook-form';
import {
  Form,
  Stack,
  Button,
} from 'react-bootstrap';
import { defaultAsset } from '../data';

const FormWebsite = ({ submission, assetData, onSubmit, hideModal }) => {
  const { _id: submissionId, user: { id: userId } } = submission;

  const thisVideoData = {
    ...defaultAsset,
    url: '',
    ...assetData,
    submissionId,
    userId
  };

  const { handleSubmit, control, formState: { errors, isSubmitting } } = useForm();

  const thisOnSubmit = async (data) => {
    data.submissionId = submissionId;
    data.type = 'website';
    data.userId = userId;

    const url = assetData?._id ? `/api/assets/${assetData._id}` : '/api/assets';
    const method = assetData?._id ? 'PUT' : 'POST';
    
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      onSubmit(data);
    } catch(error) {
      console.error(error);
    }
  }

  return (
    <Form onSubmit={handleSubmit(thisOnSubmit)} className="mt-3">
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Controller
          name="title"
          control={control}
          defaultValue={thisVideoData.title}
          rules={{
            required: false
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter a title" disabled={isSubmitting} />}
        />            
        {errors.title?.type === 'required' && <Form.Text className="text-danger">A title is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Artist</Form.Label>
        <Controller
          name="artist"
          control={control}
          defaultValue={thisVideoData.artist}
          rules={{
            required: false
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter an artist" disabled={isSubmitting} />}
        />            
        {errors.artist?.type === 'required' && <Form.Text className="text-danger">An artist is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Year</Form.Label>
        <Controller
          name="year"
          control={control}
          defaultValue={thisVideoData.year}
          rules={{
            required: false,
            pattern: /^(19|20)[\d]{2,2}$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter a year" disabled={isSubmitting} />}
        />            
        {errors.year && <Form.Text className="text-danger">A valid year is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Controller
          name="description"
          control={control}
          defaultValue={thisVideoData.description}
          rules={{
            required: false
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} as="textarea" placeholder="image description..." disabled={isSubmitting} />}
        />
        {errors.description?.type === 'required' && <><Form.Text className="text-danger">A description is required</Form.Text><br /></>}
        <Form.Text>(50 words max.)</Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>URL</Form.Label>
        <Controller
          name="url"
          control={control}
          defaultValue={thisVideoData.url}
          rules={{
            required: true,
            pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter the full url" disabled={isSubmitting} />}
        />            
        {errors.url && <Form.Text className="text-danger">A valid url is required</Form.Text>}
      </Form.Group>

      <Stack direction="horizontal" gap={2} className="justify-content-end">
        <Button variant="secondary" disabled={isSubmitting} onClick={() => hideModal()}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...</> : 'Save'}</Button>
      </Stack>
    </Form>
  );
};

export default FormWebsite;