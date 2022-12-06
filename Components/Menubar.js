import useSWR from 'swr';
import fetcher from '../lib/fetcher';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
} from 'react-bootstrap';
import { meta } from '../data';
import { useUser } from '@auth0/nextjs-auth0';
import { isAdmin, isJuror } from '../lib/users';
import useQueryParams from '../hooks/useQueryParams';
import { stringify } from 'query-string';

const Menubar = () => {
  const router = useRouter();
  const { campaign, slug } = router.query;
  const { queryParams, structure, encodeQueryParams } = useQueryParams();

  const { user } = useUser();

  const { data: program } = useSWR(campaign && slug ? `/api/programs/${campaign}/${slug}` : !campaign && !slug ? '/api/programs' : null, fetcher);

  return (
    <Container fluid>
      {program && <Navbar bg="transparent" variant="light" collapseOnSelect expand="md" className="border-bottom border-3 border-dark">
        <Navbar.Brand href="/">{meta.title}</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          {campaign && slug && <Nav className="ms-1 me-auto">
            <Link href={`/${campaign}/${slug}`} passHref>
              <Nav.Link>About</Nav.Link>
            </Link>
            <Link href={`/${campaign}/${slug}/guidelines`} passHref>
              <Nav.Link>Guidelines</Nav.Link>
            </Link>
            {user && (isAdmin(user) || isJuror(user)) && <Link href={`/${campaign}/${slug}/juror-info`} passHref>
              <Nav.Link>Juror Info</Nav.Link>
            </Link>}
            {user && (isAdmin(user) || (isJuror(user) && !program.panelActive)) && <Link href={`/${campaign}/${slug}/submissions?${stringify(encodeQueryParams(structure, queryParams))}`} passHref>
              <Nav.Link>Submissions</Nav.Link>
            </Link>}
            {user && program.panelActive && (isAdmin(user) || isJuror(user)) && <Link href={`/${campaign}/${slug}/panel?${stringify(encodeQueryParams(structure, queryParams))}`} passHref>
              <Nav.Link>Panel</Nav.Link>
            </Link>}
          </Nav>}
          <Nav className="ms-auto">
            {!user && <Nav.Link href="/api/auth/login">Login/Signup</Nav.Link>}
            {user && isAdmin(user) && <Link href="/programs" passHref>
              <Nav.Link>Programs</Nav.Link>
            </Link>}
            {user && <NavDropdown title={user.email} id="collasible-nav-dropdown">
              {/* <Link href="/profile" passHref>
                <NavDropdown.Item>Profile</NavDropdown.Item>
              </Link> */}
              {/* <NavDropdown.Divider /> */}
              <NavDropdown.Item href="/api/auth/logout">Logout</NavDropdown.Item>
            </NavDropdown>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>}
    </Container>
  );
};

export default Menubar;