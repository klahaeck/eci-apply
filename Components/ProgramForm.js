import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addToast, addAlert } from '../store/overlays/reducer';
import {
  Stack,
  Form,
  Button,
  Card
} from 'react-bootstrap';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { stripHtml } from 'string-strip-html';
import { campaigns, defaultProgram, defaultQuestion } from '../data';

const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false });
const Select = dynamic(() => import('react-select'), { ssr: false });
const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false });

const ProgramForm = ({ program, addToast, addAlert }) => {
  // console.log(program);
  const formData = program || defaultProgram;
  const submitMethod = program ? 'PUT' : 'POST';
  const fetchUrl = program ? `/api/programs/${program.campaign}/${program.slug}` : '/api/programs';

  const router = useRouter();

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {...formData, campaign: campaigns.find(c => c.value === formData.campaign)}
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  });

  const addQuestion = () => append(defaultQuestion);

  const removeQuestion = (index) => {
    if (window.confirm('Are you sure you want to remove this question?')) {
      remove(index);
    }
  };

  const getUsers = async (inputValue) => {
    if (inputValue.length >= 3) {
      const res = await fetch(`/api/users?q=${inputValue}`);
      const users = await res.json();
      return users.map(user => ({
        value: user.user_id,
        label: user.name
      }));
    }
  };

  const onSubmit = async data => {
    data.campaign = data.campaign.value;
    // console.log(data);
    const res = await fetch(fetchUrl, {
      method: submitMethod,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.status !== 200 && res.status !== 201) {
      addAlert({position: 'global', color: 'danger', msg: 'Something went wrong. Please try again.'});
    } else {
      addToast({bg: 'success', header: 'Success!', body: 'Program Saved'});
      router.push(`/${data.campaign}/${data.slug}`);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Controller
          name="title"
          control={control}
          // defaultValue={formData.title}
          rules={{
            required: true
            // pattern: /^[A-Za-z]+$/
          }}
          render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter a title" />}
        />            
        {errors.title?.type === 'required' && <Form.Text className="text-danger">A title is required</Form.Text>}
        {/* {errors.title?.type === 'pattern' && <Form.Text className="text-danger">A title is required</Form.Text>} */}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Campaign</Form.Label>
        <Controller
          control={control}
          name="campaign"
          // defaultValue={campaigns.find(c => c.value === formData.campaign)}
          rules={{
            required: true
          }}
          render={({ field }) => <Select {...field} options={campaigns} placeholder="Select campaign" className="select-custom" />}
        />
        {errors.campaign?.type === 'required' && <Form.Text className="text-danger">A campaign is required</Form.Text>}
      </Form.Group>
      
      <Stack direction="horizontal" gap={3}>
        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Controller
            name="startDate"
            control={control}
            // defaultValue={formData.startDate}
            rules={{
              required: true
            }}
            render={({ field }) => <Form.Control {...field} type="datetime-local" placeholder="Start date" />}
          />
          {errors.startDate?.type === 'required' && <Form.Text className="text-danger">A start date is required</Form.Text>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Controller
            name="endDate"
            control={control}
            // defaultValue={formData.endDate}
            rules={{
              required: true
            }}
            render={({ field }) => <Form.Control {...field} type="datetime-local" placeholder="End date" />}
          />
          {errors.endDate?.type === 'required' && <Form.Text className="text-danger">An end date is required</Form.Text>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Controller
            name="published"
            control={control}
            // defaultValue={formData.published}
            render={({ field }) => <Form.Check {...field} type="checkbox" label="Published" defaultChecked={formData.published} />}
          />
        </Form.Group>
      </Stack>
      
      
      <Form.Group className="mb-3">
        <Form.Label>Jurors</Form.Label>
        <Controller
          control={control}
          name="jurors"
          // defaultValue={formData.jurors}
          rules={{
            required: true
          }}
          render={({ field }) => <AsyncSelect {...field} placeholder="Select jurors" isMulti defaultOptions loadOptions={getUsers} className="select-custom" />}
        />
        {errors.jurors?.type === 'required' && <Form.Text className="text-danger">Jurors are required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Controller
          control={control}
          name="description"
          // defaultValue={formData.description}
          rules={{
            validate: {
              required: (v) =>
                (v && stripHtml(v).result.length > 0) ||
                'Description is required',
              // maxLength: (v) =>
              //   (v && stripHtml(v).result.length <= 2000) ||
              //   "Maximum character limit is 2000",
            }
          }}
          render={({ field }) => <RichEditor {...field} />}
        />
        {errors.description?.type === 'required' && <Form.Text className="text-danger">A description is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Guidelines</Form.Label>
        <Controller
          control={control}
          name="guidelines"
          // defaultValue={formData.guidelines}
          rules={{
            validate: {
              required: (v) =>
                (v && stripHtml(v).result.length > 0) ||
                'Guidelines are required',
              // maxLength: (v) =>
              //   (v && stripHtml(v).result.length <= 2000) ||
              //   "Maximum character limit is 2000",
            }
          }}
          render={({ field }) => <RichEditor {...field} />}
        />
        {errors.guidelines?.type === 'required' && <Form.Text className="text-danger">The guidelines are required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Juror Info</Form.Label>
        <Controller
          control={control}
          name="jurorInfo"
          // defaultValue={formData.jurorInfo}
          rules={{
            validate: {
              required: (v) =>
                (v && stripHtml(v).result.length > 0) ||
                'Juror info is required',
              // maxLength: (v) =>
              //   (v && stripHtml(v).result.length <= 2000) ||
              //   "Maximum character limit is 2000",
            }
          }}
          render={({ field }) => <RichEditor {...field} />}
        />
        {errors.jurorInfo?.type === 'required' && <Form.Text className="text-danger">The juror info is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Confirmation Email</Form.Label>
        <Controller
          control={control}
          name="confirmationEmail"
          // defaultValue={formData.confirmationEmail}
          rules={{
            validate: {
              required: (v) =>
                (v && stripHtml(v).result.length > 0) ||
                'The confirmation email is required',
              // maxLength: (v) =>
              //   (v && stripHtml(v).result.length <= 2000) ||
              //   "Maximum character limit is 2000",
            }
          }}
          render={({ field }) => <RichEditor {...field} />}
        />
        {errors.confirmationEmail?.type === 'required' && <Form.Text className="text-danger">The confirmation email is required</Form.Text>}
      </Form.Group>

      {fields.length > 0 && <Form.Label>Questions</Form.Label>}
      {fields.map((f, index) => (
        <Card key={f.id} body className="position-relative mb-3">
          <input type="hidden" {...register(`questions.${index}.id`)} defaultValue={`${f.id}`} />

          <Button variant="danger" size="sm" onClick={() => removeQuestion(index)} className="position-absolute top-0 end-0">Remove</Button>
          <Form.Group className="mb-3">
            <Form.Label>Question</Form.Label>
            <Controller
              name={`questions.${index}.question`}
              control={control}
              // defaultValue={f.question}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter the question" />}
            />
            {errors.questions && errors.questions[index] && errors.questions[index].question?.type === 'required' && <Form.Text className="text-danger">The question is required</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Placeholder</Form.Label>
            <Controller
              name={`questions.${index}.placeholder`}
              control={control}
              // defaultValue={f.placeholder}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter the placeholder" />}
            />
            {errors.questions && errors.questions[index] && errors.questions[index].placeholder?.type === 'required' && <Form.Text className="text-danger">The placeholder is required</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Helper Text</Form.Label>
            <Controller
              name={`questions.${index}.helperText`}
              control={control}
              // defaultValue={f.helperText}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter the helper text" />}
            />
            {errors.questions && errors.questions[index] && errors.questions[index].helperText?.type === 'required' && <Form.Text className="text-danger">The helper text is required</Form.Text>}
          </Form.Group>
          
          <Stack direction="horizontal" gap={3}>
            <Form.Group className="mb-3">
              <Controller
                name={`questions.${index}.validations.required`}
                control={control}
                render={({ field }) => <Form.Check {...field} type="checkbox" label="Required" defaultChecked={f.validations.required} />}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Min Words</Form.Label>
              <Controller
                name={`questions.${index}.validations.minWords`}
                control={control}
                // defaultValue={f.validations.minWords}
                rules={{
                  required: true
                }}
                render={({ field }) => <Form.Control {...field} type="number" placeholder="" />}
              />
              {errors.questions && errors.questions[index] && errors.questions[index].validations?.minWords?.type === 'required' && <Form.Text className="text-danger">Min words is required</Form.Text>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Max Words</Form.Label>
              <Controller
                name={`questions.${index}.validations.maxWords`}
                control={control}
                // defaultValue={f.validations.maxWords}
                rules={{
                  required: true
                }}
                render={({ field }) => <Form.Control {...field} type="number" placeholder="" />}
              />
              {errors.questions && errors.questions[index] && errors.questions[index].validations?.maxWords?.type === 'required' && <Form.Text className="text-danger">Max words is required</Form.Text>}
            </Form.Group>
          </Stack>
        </Card>
      ))}

      <Button variant="secondary" onClick={() => addQuestion()}>Add Question</Button>
      <Button variant="primary" type="submit" className="float-end">Save</Button>
    </Form>
  );
};

const mapDispatchToProps = (dispatch) => ({
  addToast: bindActionCreators(addToast, dispatch),
  addAlert: bindActionCreators(addAlert, dispatch),
});

export default connect(null, mapDispatchToProps)(ProgramForm);
// export default ProgramForm;