import Link from 'next/link';
import {
  Navbar,
  Nav,
  Button
} from 'react-bootstrap';
import { useUser } from '@auth0/nextjs-auth0';
import { isAdmin, isJuror } from '../lib/users';

const ToolbarProgram = ({ program }) => {
  const { campaign, slug } = program;
  const { user } = useUser();

  return (
    <Navbar bg="dark" variant="dark">
      <Nav className="ms-auto px-2">
        {!user && <Nav.Item>
          <span className="text-light">Login to create your submission</span>
        </Nav.Item>}
        {user && isAdmin(user) && <Nav.Item className="mx-1">
          <Link href={`/${campaign}/${slug}/panel`} passHref>
            <Button variant="success" size="sm">Panel View</Button>
          </Link>
        </Nav.Item>}
        {user && isAdmin(user) && <Nav.Item className="mx-1">
          <Link href={`/${campaign}/${slug}/edit`} passHref>
            <Button variant="warning" size="sm">Edit</Button>
          </Link>
        </Nav.Item>}
        
        {user && !isAdmin(user) && !isJuror(user) && <Nav.Item className="mx-1">
          <Link href={`/${campaign}/${slug}/apply`} passHref>
            <Button variant="primary" size="sm">My Submission</Button>
          </Link>
        </Nav.Item>}
      </Nav>
    </Navbar>
  );
};

export default ToolbarProgram;