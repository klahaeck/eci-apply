import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useRoot } from '../contexts/RootContext';
import {
  Row,
  Col,
  Stack,
  Form,
  Tabs,
  Tab,
  Button,
  Card
} from 'react-bootstrap';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import { stripHtml } from 'string-strip-html';
import { campaigns, defaultProgram, defaultQuestion, defaultScope } from '../data';

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false });

const FormProgram = ({ program }) => {
  const { addToast, addAlert } = useRoot();
  const formData = program || defaultProgram;
  const campaignOptions = campaigns.map(c => ({label:c, value:c.toLowerCase()}));
  const submitMethod = program ? 'PUT' : 'POST';
  const fetchUrl = program ? `/api/programs/${program.campaign}/${program.slug}` : '/api/programs';

  const router = useRouter();

  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      campaign: campaignOptions.find(c => c.value === formData.campaign)
    }
  });
  const { fields: questions, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: 'questions'
  });

  const { fields: scopes, append: appendScope, remove: removeScope } = useFieldArray({
    control,
    name: 'ratingScopes'
  });

  // const addQuestion = () => append(defaultQuestion);

  const confirmRemoveQuestion = (index) => {
    if (window.confirm('Are you sure you want to remove this question?')) {
      removeQuestion(index);
    }
  };

  const getUsers = async (inputValue) => {
    if (inputValue.length >= 3) {
      const res = await fetch(`/api/users?q=${inputValue}`);
      const users = await res.json();
      return users.map(user => ({
        id: user.user_id,
        email: user.email,
        name: user.name
      }));
    }
  };

  const onSubmit = async data => {
    data.campaign = data.campaign.value ? data.campaign.value : data.campaign;

    const scopesTotal = data.ratingScopes.reduce((acc, scope) => acc + parseInt(scope.weight), 0);
    if (scopesTotal !== 100) {
      addAlert({
        position: 'global',
        heading: 'There were errors with your program!',
        color: 'danger',
        msg: 'The total weight of all rating scopes must equal 100!'
      });
      return;
    }

    const res = await fetch(fetchUrl, {
      method: submitMethod,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.status !== 200 && res.status !== 201) {
      addAlert({position: 'global', color: 'danger', msg: 'Something went wrong. Please try again.'});
    } else {
      // addToast({bg: 'success', header: 'Success!', body: 'Program Saved'});
      router.push(`/${data.campaign}/${data.slug}`);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
      <Tabs defaultActiveKey="settings" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="settings" title="Settings">
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Controller
              name="title"
              control={control}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter a title" />}
            />            
            {errors.title?.type === 'required' && <Form.Text className="text-danger">A title is required</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Campaign</Form.Label>
            <Controller
              control={control}
              name="campaign"
              rules={{
                required: true
              }}
              render={({ field }) => <Select {...field} options={campaignOptions} placeholder="Select campaign" className="select-custom" />}
            />
            {errors.campaign?.type === 'required' && <Form.Text className="text-danger">A campaign is required</Form.Text>}
          </Form.Group>
          
          <Stack direction="horizontal" gap={3}>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Controller
                name="startDate"
                control={control}
                rules={{
                  required: true,
                  valueAsDate: true,
                }}
                render={({ field }) => <div className="card p-1"><DateTimePicker {...field} /></div>}
              />
              {errors.startDate?.type === 'required' && <Form.Text className="text-danger">A start date is required</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Controller
                name="endDate"
                control={control}
                rules={{
                  required: true,
                  valueAsDate: true,
                }}
                render={({ field }) => <div className="card p-1"><DateTimePicker {...field} /></div>}
              />
              {errors.endDate?.type === 'required' && <Form.Text className="text-danger">An end date is required</Form.Text>}
            </Form.Group>

            <Form.Group className="my-3">
              <Controller
                control={control}
                name="published"
                render={({ field }) => <Form.Check {...field} type="switch" label="Published" defaultChecked={formData.published} />}
              />
            </Form.Group>
          </Stack>
          
          
          <Form.Group className="mb-3">
            <Form.Label>Jurors</Form.Label>
            <Controller
              control={control}
              name="jurors"
              rules={{
                required: true
              }}
              render={({ field }) => <AsyncSelect {...field} placeholder="Select jurors" isMulti defaultOptions loadOptions={getUsers} getOptionLabel={option => option.name} getOptionValue={option => option.id} className="select-custom" />}
            />
            {errors.jurors?.type === 'required' && <Form.Text className="text-danger">Jurors are required</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Min Work Assets</Form.Label>
            <Controller
              name="minWorkAssets"
              control={control}
              defaultValue={5}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} type="number" placeholder="" />}
            />
            {errors.minWorkAssets?.type === 'required' && <Form.Text className="text-danger">Min work assets is required</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Max Work Assets</Form.Label>
            <Controller
              name="maxWorkAssets"
              control={control}
              defaultValue={10}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} type="number" placeholder="" />}
            />
            {errors.maxWorkAssets?.type === 'required' && <Form.Text className="text-danger">Max work assets is required</Form.Text>}
          </Form.Group>
        </Tab>
        <Tab eventKey="info" title="Info">
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Controller
              control={control}
              name="description"
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
        </Tab>
        <Tab eventKey="questions" title="Questions">
          {questions.length > 0 && <Form.Label>Questions</Form.Label>}
          {questions.map((q, index) => (
            <Card key={q.id} body className="position-relative mb-3">
              {/* <input type="hidden" {...register(`questions.${index}.id`)} defaultValue={`${f.id}`} /> */}

              <Button variant="danger" size="sm" onClick={() => confirmRemoveQuestion(index)} className="position-absolute top-0 end-0"><i className="bi bi-trash-fill"></i></Button>
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
                    // required: true
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
                    // required: true
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
                    render={({ field }) => <Form.Check {...field} type="checkbox" label="Required" defaultChecked={q.validations.required} />}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Min Words</Form.Label>
                  <Controller
                    name={`questions.${index}.validations.minWords`}
                    control={control}
                    // defaultValue={f.validations.minWords}
                    rules={{
                      // required: true
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
                      // required: true
                    }}
                    render={({ field }) => <Form.Control {...field} type="number" placeholder="" />}
                  />
                  {errors.questions && errors.questions[index] && errors.questions[index].validations?.maxWords?.type === 'required' && <Form.Text className="text-danger">Max words is required</Form.Text>}
                </Form.Group>
              </Stack>
            </Card>
          ))}
          <Button variant="success" onClick={() => appendQuestion(defaultQuestion)}><i className="bi bi-plus-lg"></i> Add Question</Button>
        </Tab>

        <Tab eventKey="jurorTools" title="Juror Tools">
          <Form.Group className="my-3">
            <Controller
              control={control}
              name="panelActive"
              defaultValue={formData.panelActive}
              render={({ field }) => <Form.Check {...field} type="switch" label="Panel Active" defaultChecked={formData.panelActive} />}
            />
          </Form.Group>

          <Form.Group className="my-3">
            <Controller
              control={control}
              name="showPanelRatings"
              defaultValue={formData.showPanelRatings}
              render={({ field }) => <Form.Check {...field} type="switch" label="Show Panel Ratings" defaultChecked={formData.showPanelRatings} />}
            />
          </Form.Group>
          
          <Form.Group className="my-3">
            <Controller
              control={control}
              name="filterFinalists"
              defaultValue={formData.filterFinalists}
              render={({ field }) => <Form.Check {...field} type="switch" label="Filter Finalists in Submissions View" defaultChecked={formData.filterFinalists} />}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Current Rating Round</Form.Label>
            <Controller
              name="ratingRound"
              control={control}
              defaultValue={1}
              rules={{
                required: true
              }}
              render={({ field }) => <Form.Control {...field} type="number" placeholder="" />}
            />
            {errors.maxWorkAssets?.type === 'required' && <Form.Text className="text-danger">Current rating round is required</Form.Text>}
          </Form.Group>

          <Form.Label>Rating Scopes</Form.Label>
          {scopes.map((s, index) => (
            <Row key={s.id} className="mb-3">
              <Controller
                name={`ratingScopes.${index}._id`}
                control={control}
                defaultValue={typeof s._id === 'string' ? s._id : s.id}
                rules={{
                  required: true
                }}
                render={({ field }) => <Form.Control {...field} type="hidden" />}
              />
              <Col>
                <Form.Group>
                  <Form.Label>Attribute</Form.Label>
                  <Controller
                    name={`ratingScopes.${index}.attribute`}
                    control={control}
                    // defaultValue={s.attribute}
                    rules={{
                      required: true
                    }}
                    render={({ field }) => <Form.Control {...field} type="text" placeholder="Enter the attribute" />}
                  />
                  {errors.ratingScopes && errors.ratingScopes[index] && errors.ratingScopes[index].attribute?.type === 'required' && <Form.Text className="text-danger">The attribute is required</Form.Text>}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Weight</Form.Label>
                  <Controller
                    name={`ratingScopes.${index}.weight`}
                    control={control}
                    // defaultValue={s.weight}
                    rules={{
                      required: true,
                      validate: {
                        positive: v => parseInt(v) >= 0,
                        lessThanHundred: v => parseInt(v) <= 100,
                      }
                    }}
                    render={({ field }) => <Form.Control {...field} type="number" placeholder="Enter the weight" />}
                  />
                  {errors.ratingScopes && errors.ratingScopes[index] && errors.ratingScopes[index].weight?.type === 'required' && <Form.Text className="text-danger">The weight is required</Form.Text>}
                  {errors.ratingScopes && errors.ratingScopes[index] && errors.ratingScopes[index].weight?.type === 'positive' && <Form.Text className="text-danger">The weight must be greater than 0</Form.Text>}
                  {errors.ratingScopes && errors.ratingScopes[index] && errors.ratingScopes[index].weight?.type === 'lessThanHundred' && <Form.Text className="text-danger">The weight must be less than 100</Form.Text>}
                  {/* {errors.ratingScopes && errors.ratingScopes[index] && errors.ratingScopes[index].weight?.type === 'validTotal' && <Form.Text className="text-danger">The total weight must equal 100</Form.Text>} */}
                </Form.Group>
              </Col>
              <Col className="d-flex align-items-end">
                <Button variant="danger" onClick={() => removeScope(index)}><i className="bi bi-trash-fill"></i></Button>
              </Col>
            </Row>
          ))}
          <Button variant="success" onClick={() => appendScope(defaultScope)}><i className="bi bi-plus-lg"></i> Add Scope</Button>
        </Tab>
      </Tabs>

      <Button variant="primary" type="submit" className="float-end">Save</Button>
    </Form>
  );
};

export default FormProgram;
