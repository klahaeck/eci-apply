import Link from 'next/link';
import {
  Navbar,
  Nav,
  Button
} from 'react-bootstrap';
import { useUser } from '@auth0/nextjs-auth0';
import { isAdmin } from '../lib/utils';

const ProgramToolbar = ({ program }) => {
  const { campaign, slug } = program;
  const { user } = useUser();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Nav className="me-auto px-2">
        {campaign && slug && <Link href={`/${campaign}/${slug}/apply`} passHref>
          <Button variant="primary" size="sm">{user && isAdmin(user) ? 'Create Submission' : 'Apply'}</Button>
        </Link>}
      </Nav>
      {user && isAdmin(user) && <Nav className="ms-auto px-2">
        {campaign && slug && <Link href={`/${campaign}/${slug}/panel`} passHref>
          <Button variant="success" size="sm">Panel View</Button>
        </Link>}
        {campaign && slug && <Link href={`/${campaign}/${slug}/edit`} passHref>
          <Button variant="warning" size="sm">Edit</Button>
        </Link>}
      </Nav>}
    </Navbar>
  );
};

export default ProgramToolbar;