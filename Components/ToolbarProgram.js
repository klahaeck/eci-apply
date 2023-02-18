import Link from 'next/link';
import {
  Navbar,
  Nav,
  Button,
  Form,
  InputGroup
} from 'react-bootstrap';
import { useUser } from '@auth0/nextjs-auth0';
import isEmpty from 'lodash/isEmpty';
import { useForm, Controller } from 'react-hook-form';
import useQueryParams from '../hooks/useQueryParams';
import { isAdmin, isJuror } from '../lib/users';

const ToolbarProgram = ({ program, showSearch }) => {
  const { campaign, slug } = program;
  const { user } = useUser();
  const { queryParams, setQueryParams } = useQueryParams();
  const { s: searchQuery } = queryParams;
  const { handleSubmit, control } = useForm();

  const onSubmit = async data => setQueryParams({ s: !isEmpty(data.searchQuery) ? data.searchQuery : undefined });

  const now = new Date();

  const getCSV = async () => {
    try {
      const response = await fetch(`/api/programs/${program.campaign}/${program.slug}/export`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/octet-stream',
        }
      })
      console.log(response)
      // const data = await response.json()
      // console.log(data)
    } catch (error) {
      
    }
  };

  return (
    <Navbar bg="dark" variant="dark">
      {!isAdmin(user) && !isJuror(user) && now < new Date(program.startDate) && <Nav.Item>
        <span className="px-3 text-light">We are not yet accepting applications</span>
      </Nav.Item>}
      {!isAdmin(user) && !isJuror(user) && now > new Date(program.endDate) && <Nav.Item>
        <span className="px-3 text-light">The deadline for submissions has passed</span>
      </Nav.Item>}
      {showSearch && <Nav className="px-2">
        <Nav.Item>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <InputGroup size="sm">
              <Controller
                name="searchQuery"
                control={control}
                defaultValue={searchQuery}
                // rules={{
                //   required: true
                // }}
                render={({ field }) => <Form.Control {...field} placeholder="Search" aria-label="Search" size="sm" />}
              />
              <Button type="submit" size="sm">Search</Button>
            </InputGroup>
          </Form>
        </Nav.Item>
      </Nav>}
      <Nav className="ms-auto px-2">
        {!user && <Nav.Item>
          <span className="text-light">Login to create your submission</span>
        </Nav.Item>}
        {/* {user && (isAdmin(user) || (isJuror(user) && program.panelActive)) && <Nav.Item className="mx-1">
          <Link href={`/${campaign}/${slug}/panel`} passHref>
            <Button variant="success" size="sm">Panel View</Button>
          </Link>
        </Nav.Item>} */}
        {user && isAdmin(user) && <Nav.Item className="mx-1">
          <a href={`/api/programs/${campaign}/${slug}/export`} download>
            <Button variant="success" size="sm" className="me-2">Export CSV</Button>
          </a>
          <Link href={`/${campaign}/${slug}/edit`} passHref>
            <Button variant="warning" size="sm">Edit</Button>
          </Link>
        </Nav.Item>}
        
        {user && !isAdmin(user) && !isJuror(user) && now >= new Date(program.startDate) && now <= new Date(program.endDate) && <Nav.Item className="mx-1">
          <Link href={`/${campaign}/${slug}/apply`} passHref>
            <Button variant="primary" size="sm">My Submission</Button>
          </Link>
        </Nav.Item>}
      </Nav>
    </Navbar>
  );
};

export default ToolbarProgram;