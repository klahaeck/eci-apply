import Link from 'next/link';
import {
  Navbar,
  Nav,
  Button
} from 'react-bootstrap';
import { useUser } from '@auth0/nextjs-auth0';
import { isAdmin } from '../lib/users';

const ToolbarPrograms = () => {
  const { user } = useUser();

  return (
    <>
      {user && isAdmin(user) && <Navbar bg="dark" variant="dark" expand="lg">
        <Nav className="ms-auto px-2">
          <Link href="/programs/new" passHref>
            <Button variant="primary" size="sm">New</Button>
          </Link>
        </Nav>
      </Navbar>}
    </>
  );
};

export default ToolbarPrograms;