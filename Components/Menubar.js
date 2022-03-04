// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import dynamic from 'next/dynamic';
import useSWR from 'swr';
import fetcher from '../lib/fetcher';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Button
} from 'react-bootstrap';
import { meta } from '../data';
import { useUser } from '@auth0/nextjs-auth0';

const Menubar = () => {
  const router = useRouter();
  const { campaign, slug } = router.query;

  const { user, error, isLoading } = useUser();

  const { data: programs, error: errorPrograms } = useSWR(campaign && slug ? `/api/programs/${campaign}/${slug}` : !campaign && !slug ? '/api/programs' : null, fetcher);

  return (
    <Container fluid>
      <Navbar bg="transparent" variant="light" collapseOnSelect expand="md" className={!programs?.length ? 'border-bottom border-3 border-dark' : ''}>
      
        <Navbar.Brand href="/">{meta.title}</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          {campaign && slug && <Nav className="ms-1 me-auto">
            <Link href={`/${campaign}/${slug}`} passHref>
              <Nav.Link>Description</Nav.Link>
            </Link>
            <Link href={`/${campaign}/${slug}/guidelines`} passHref>
              <Nav.Link>Guidelines</Nav.Link>
            </Link>
            <Link href={`/${campaign}/${slug}/juror-info`} passHref>
              <Nav.Link>Juror Info</Nav.Link>
            </Link>
            <Link href={`/${campaign}/${slug}/submissions`} passHref>
              <Nav.Link>Submissions</Nav.Link>
            </Link>
          </Nav>}
          <Nav className="ms-auto">
            {!user && <Nav.Link href="/api/auth/login">Login</Nav.Link>}
            {user && <Link href="/programs" passHref>
              <Nav.Link>Programs</Nav.Link>
            </Link>}
            {user && <NavDropdown title={user.email} id="collasible-nav-dropdown">
              <Link href="/profile" passHref>
                <NavDropdown.Item>Profile</NavDropdown.Item>
              </Link>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/api/auth/logout">Logout</NavDropdown.Item>
            </NavDropdown>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {programs?.length && <Navbar bg="dark" variant="dark" expand="lg">
        <Nav className="me-auto px-2">
          {campaign && slug && <Link href={`/${programs[0].campaign}/${programs[0].slug}/apply`} passHref>
            <Button variant="primary" size="sm">Create Submission</Button>
          </Link>}
        </Nav>
        <Nav className="ms-auto px-2">
          {campaign && slug && <Link href={`/${programs[0].campaign}/${programs[0].slug}/panel`} passHref>
            <Button variant="success" size="sm">Panel View</Button>
          </Link>}
          {campaign && slug && <Link href={`/${programs[0].campaign}/${programs[0].slug}/edit`} passHref>
            <Button variant="warning" size="sm">Edit</Button>
          </Link>}
          {!campaign && !slug && <Link href="/programs/new" passHref>
            <Button variant="primary" size="sm">New</Button>
          </Link>}
        </Nav>
      </Navbar>}
    </Container>
  );
};

// const mapStateToProps = (state) => {
//   const { programDetail } = state.root;
//   return { programDetail };
// };
// const mapDispatchToProps = (dispatch) => ({
//   showModal: bindActionCreators(showModal, dispatch),
// });

// export default connect(mapStateToProps)(Menubar);
export default Menubar;