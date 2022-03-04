// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import {
  Form,
  Button,
  Card
} from 'react-bootstrap';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { stripHtml } from 'string-strip-html';

const defaultSubmission = {
  createdBy: '',
  leadOrganizer: {
    // USER INFO HERE
  },
  title: '',
  startDate: '',
  completionDate: '',
  budgetTotal: 0,
  budgetRequested: 0,
  summary: '',
  details: [],
  bios: [],
  assets: [],
  budget: {
    expenses: [],
    income: [],
    notes: ''
  },
  notes: [],
  ratings: [],
  eligible: true,
  submitted: false,
};

const defaultBio = {
  name: '',
  bio: ''
};

// const Select = dynamic(() => import('react-select'), { ssr: false });
// const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false });

const SubmissionForm = ({ submission }) => {
  const formData = submission || defaultProgram;

  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: formData
  });
  const { fields: bios, append, remove } = useFieldArray({
    control,
    name: 'bios'
  });

  const addBio = () => append(defaultBio);

  const removeBio = (index) => {
    if (window.confirm('Are you sure you want to remove this bio?')) {
      remove(index);
    }
  };

  const onSubmit = async data => {
    console.log(data);
    // const res = await fetch('/api/programs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // const resData = await res.json();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Controller
          name="title"
          control={control}
          defaultValue={formData.title}
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
        <Form.Label>Start Date</Form.Label>
        <Controller
          name="startDate"
          control={control}
          defaultValue={formData.startDate}
          rules={{
            required: true
          }}
          render={({ field }) => <Form.Control {...field} type="date" placeholder="Start date" />}
        />
        {errors.startDate?.type === 'required' && <Form.Text className="text-danger">A start date is required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Completion Date</Form.Label>
        <Controller
          name="completionDate"
          control={control}
          defaultValue={formData.completionDate}
          rules={{
            required: true
          }}
          render={({ field }) => <Form.Control {...field} type="date" placeholder="Completion date" />}
        />
        {errors.completionDate?.type === 'required' && <Form.Text className="text-danger">A completion date is required</Form.Text>}
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Jurors</Form.Label>
        <Controller
          control={control}
          name="jurors"
          defaultValue={formData.jurors}
          rules={{
            required: true
          }}
          render={({ field }) => <Select {...field} options={options} placeholder="Select jurors" isMulti isSearchable className="select-custom" />}
        />
        {errors.jurors?.type === 'required' && <Form.Text className="text-danger">Jurors are required</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Controller
          control={control}
          name="description"
          defaultValue={formData.description}
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
          defaultValue={formData.guidelines}
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
          defaultValue={formData.jurorInfo}
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
          defaultValue={formData.confirmationEmail}
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
      {fields.map((q, index) => (
        <Card key={index} body className="position-relative mb-3">
          <Button variant="danger" size="sm" onClick={() => removeQuestion(index)} className="position-absolute" style={{right:0, top:0}}>Remove</Button>
          <Form.Group className="mb-3">
            <Form.Label>Question</Form.Label>
            <Controller
              name={`questions.${index}.question`}
              control={control}
              defaultValue={q.question}
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
              defaultValue={q.placeholder}
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
              defaultValue={q.helperText}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter the helper text" />}
            />
            {errors.questions && errors.questions[index] && errors.questions[index].helperText?.type === 'required' && <Form.Text className="text-danger">The helper text is required</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Controller
              name={`questions.${index}.validations.required`}
              control={control}
              render={({ field }) => <Form.Check {...field} type="checkbox" label="Required" defaultChecked={q.validations.required} />}
            />
          </Form.Group>
        </Card>
      ))}

      <Button variant="secondary" onClick={() => addQuestion()}>Add Question</Button>
      <Button variant="primary" type="submit" className="float-end">Save</Button>
    </Form>
  );
};

export default SubmissionForm;