import {
  Container,
  // Row,
  // Col,
} from 'react-bootstrap';
import Layout from '../layouts/Main';

const Home = (props) => {
  return (
    <Layout>
      <Container fluid></Container>
    </Layout>
  )
}

// This gets called on every request
// export async function getServerSideProps() {
//   // Fetch data from external API
//   const res = await fetch(`https://.../data`)
//   const data = await res.json()

//   // Pass data to the page via props
//   return { props: { data } }
// }

export default Home;