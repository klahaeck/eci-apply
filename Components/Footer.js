import Link from 'next/link';
import {
  Container,
  Row,
  Col,
  Stack
} from 'react-bootstrap';
import { meta } from '../data';

const Footer = () => {
  return (
    <footer className="pt-5">
      <Container fluid>
        <div className="mb-2 border-bottom border-3 border-dark"></div>
        <Row>
          <Col>
            <Stack direction="horizontal" gap={3}>
              <div>
                <Link href="/vaf/2022"><a className="text-muted text-decoration-none">home</a></Link>
              </div>
              <div>
                <Link href="https://www.midwayart.org/vaf/"><a className="text-muted text-decoration-none">about</a></Link>
              </div>
              {/* <div>
                <Link href="/contact"><a className="text-muted text-decoration-none">contact</a></Link>
              </div> */}
              {/* <div>
                <Link href="/terms"><a className="text-dark text-decoration-none">terms of use</a></Link>
              </div>
              <div>
                <Link href="/privacy"><a className="text-dark text-decoration-none">privacy policy</a></Link>
              </div> */}
            </Stack>
          </Col>
          <Col>
            <p className="text-end text-secondary"><small>&copy; 2022 {meta.copyright}</small></p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;