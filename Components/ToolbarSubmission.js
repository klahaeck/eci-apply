import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';
import useQueryParams from '../hooks/useQueryParams';
import { useRoot } from '../contexts/RootContext';
import {
  Navbar,
  Nav,
  Button
} from 'react-bootstrap';
import { validateSubmission } from '../lib/validate';
import { isJuror } from '../lib/users';

const ToolbarSubmission = ({ program, submission }) => {
  const router = useRouter();
  const { user } = useUser();
  const { campaign, slug } = program;
  const { queryParams } = useQueryParams();
  const { sortBy, sortOrder } = queryParams;
  const { addAlert, clearAlerts } = useRoot();

  const handlErrors = (errors) => {
    const errorMsgs = `<ul>${errors.map(error => `<li>${error}</li>`).join('')}</ul>`;
    addAlert({
      position: 'submission',
      heading: 'There were errors with your submission!',
      color: 'danger',
      msg: errorMsgs
    });
  };

  const handleSubmit = async () => {
    clearAlerts('submission');
    const errors = validateSubmission(program, submission);

    const errorKeys = Object.keys(errors);
    if (errorKeys.length) {
      handlErrors(errorKeys.map(key => errors[key]));
      return;
    }

    const response = await fetch(`/api/submissions/${submission._id}/submit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    if (!response.ok) {
      const resJSON = await response.json();
      // console.log(resJSON);
      if (resJSON.errors) handlErrors(resJSON.errors);
    }
  };

  const navigatePrevNext = async (direction) => {
    const response = await fetch(`/api/submissions/${submission._id}/navigate?direction=${direction}&sortBy=${sortBy}&sortOrder=${sortOrder}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const resJSON = await response.json();
    if (resJSON._id) {
      window.location.href = `/${campaign}/${slug}/submissions/${resJSON._id}?sortBy=${sortBy}&sortOrder=${sortOrder}`;
      // router.push(`/${campaign}/${slug}/submissions/${resJSON._id}?sortBy=${sortBy}&sortOrder=${sortOrder}`);
    }
  }

  return (
    <Navbar bg="dark" variant="dark">
      {isJuror(user) && <Nav className="ms-auto px-2">
        <Nav.Item className="mx-1">
          <Button variant="secondary" size="sm" onClick={() => navigatePrevNext('next')}>Prev</Button>
        </Nav.Item>
        <Nav.Item className="mx-1">
          <Button variant="secondary" size="sm" onClick={() => navigatePrevNext('prev')}>Next</Button>
        </Nav.Item>
      </Nav>}
      {user.sub === submission.userId && <Nav className="ms-auto px-2">
        {!submission.submitted && <Nav.Item className="mx-1">
          <Button variant="success" size="sm" onClick={() => handleSubmit()}>Submit</Button>
        </Nav.Item>}
        {submission.submitted && <Nav.Item>
          <span className="text-light">Your application has been submitted</span>
        </Nav.Item>}
      </Nav>}
    </Navbar>
  );
};

export default ToolbarSubmission;