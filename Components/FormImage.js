import { useForm, Controller } from 'react-hook-form';
import { useFilePicker } from 'use-file-picker';
import {
  Form,
  Stack,
  Button,
} from 'react-bootstrap';
import { defaultAsset } from '../data';
import { useEffect } from 'react';

const FormImage = ({ submission, assetData, onSubmit, hideModal }) => {
  const { _id: submissionId, user: { id: userId } } = submission;

  const thisImageData = {
    ...defaultAsset,
    dimensions: '',
    ...assetData,
    submissionId,
    userId
  };

  const { register, handleSubmit, control, setValue, clearErrors, formState: { errors, isSubmitting } } = useForm();

  const [ openFileSelector, { filesContent, plainFiles, loading, errors: errorsFilepicker } ] = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*',
    // multiple: true,
    limitFilesConfig: { min: 1, max: 1 },
    // minFileSize: 0.1, // in megabytes
    maxFileSize: 5,
    // imageSizeRestrictions: {
    //   maxHeight: 5000, // in pixels
    //   maxWidth: 5000,
    //   minHeight: 300,
    //   minWidth: 300,
    // },
  });

  if (!assetData) {
    register('file', { required: true });
  }

  useEffect(() => {
    if (!assetData) {
      if (plainFiles.length > 0) {
        setValue('file', plainFiles[0]);
        clearErrors('file');
      } else {
        setValue('file', null);
      }
    }
  }, [assetData, setValue, clearErrors, plainFiles]);

  const thisOnSubmit = async (data) => {
    data.submissionId = submissionId;
    data.type = 'image';
    data.userId = userId;

    let formData, url, options;

    if (!assetData) {
      formData = new FormData();
      for (const name in data) {
        if (name !== 'file') {
          formData.append(name, data[name]);
        }
      }
      formData.append('file', data.file);
      url = '/api/assets';
      options = {
        method: 'POST',
        body: formData
      }
    } else {
      formData = JSON.stringify(data);
      url = `/api/assets/${assetData._id}`
      options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: formData
      }
    }
    
    try {
      await fetch(url, options);
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
          defaultValue={thisImageData.title}
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
          defaultValue={thisImageData.artist}
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
          defaultValue={thisImageData.year}
          rules={{
            required: false,
            pattern: /^(19|20)[\d]{2,2}$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter a year" disabled={isSubmitting} />}
        />            
        {errors.year && <Form.Text className="text-danger">A valid year is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Dimensions</Form.Label>
        <Controller
          name="dimensions"
          control={control}
          defaultValue={thisImageData.dimensions}
          rules={{
            required: false,
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter the dimensions" disabled={isSubmitting} />}
        />            
        {errors.dimensions && <Form.Text className="text-danger">Dimensions are required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Controller
          name="description"
          control={control}
          defaultValue={thisImageData.description}
          rules={{
            required: false
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} as="textarea" placeholder="image description..." disabled={isSubmitting} />}
        />
        {errors.description?.type === 'required' && <><Form.Text className="text-danger">A description is required</Form.Text><br /></>}
        <Form.Text>(50 words max.)</Form.Text>
      </Form.Group>
      
      {!assetData && loading && <div>Loading file chooser...</div>}
      {!assetData && !loading && <div>
        <Button size="sm" disabled={isSubmitting} onClick={() => openFileSelector()}>Choose your file</Button>
        {errors.file && <><br /><Form.Text className="text-danger">A JPG or PNG file is required</Form.Text></>}
        {filesContent.length === 0 && <><br /><Form.Text className="mb-2">Please choose a JPG or PNG</Form.Text></>}
        {errorsFilepicker.length > 0 && errorsFilepicker[0].fileSizeTooSmall && 'File size is too small!'}
        {errorsFilepicker.length > 0 && errorsFilepicker[0].fileSizeToolarge && 'File size is too large!'}
        {errorsFilepicker.length > 0 && errorsFilepicker[0].readerError && 'Problem occured while reading file!'}
        {errorsFilepicker.length > 0 && errorsFilepicker[0].maxLimitExceeded && 'Too many files'}
        {errorsFilepicker.length > 0 && errorsFilepicker[0].minLimitNotReached && 'Not enought files'}
        {filesContent.map((file, index) => (
          <div key={index} className="my-3">
            <p className="fs-5 mb-1">{file.name}</p>
            <img alt={file.name} src={file.content} className="w-25" />
          </div>
        ))}
      </div>}

      <Stack direction="horizontal" gap={2} className="justify-content-end">
        <Button variant="secondary" disabled={isSubmitting} onClick={() => hideModal()}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...</> : 'Save'}</Button>
      </Stack>
    </Form>
  );
};

export default FormImage;