import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import fetcher from '../../../../lib/fetcher';
import { useRouter } from 'next/router';
import {
  Container,
  Table,
  Button,
  Pagination
} from 'react-bootstrap';
import Layout from '../../../../layouts/Main';
import ToolbarProgram from '../../../../Components/ToolbarProgram';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { isAdmin, isJuror } from '../../../../lib/users';
import { useQueryParams, StringParam, NumberParam, withDefault } from 'use-query-params';

const ProgramSubmissions = ({ user }) => {
  const router = useRouter();
  const { campaign, slug } = router.query;
  const [ queryParams, setQueryParams ] = useQueryParams({
    sortBy: withDefault(StringParam, 'createdAt'),
    sortOrder: withDefault(StringParam, 'desc'),
    s: withDefault(StringParam, ''),
    perPage: withDefault(NumberParam, 30),
    pageNumber: withDefault(NumberParam, 1)
  });

  const { sortBy, sortOrder, s: searchQuery, perPage, pageNumber } = queryParams;

  const { data: program, error: errorProgram } = useSWR(`/api/programs/${campaign}/${slug}`, fetcher);
  const { data: submissions, error: errorSubmissions, mutate } = useSWR(program ? ['/api/submissions', { programId: program._id, s: searchQuery, sortBy, sortOrder, perPage, pageNumber }] : null, fetcher);

  const removeSubmission = async (id) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
      mutate();
    }
  };

  const setSort = (key) => {
    const thisSortBy = key === 'myRating' ? 'myRating.rate' : key;
    const thisSortOrder = key === sortBy && sortOrder === 'desc' ? 'asc'
                        : key === sortBy && sortOrder === 'asc' ? 'desc'
                        : sortOrder;

    setQueryParams({ ...queryParams, sortBy: thisSortBy, sortOrder: thisSortOrder });
  };

  const getSubmissions = submissions?.data ? submissions.data : submissions;

  return (
    <Layout>
      <Head>
        <title>VAF - {campaign} {slug}</title>
      </Head>

      <Container fluid>
        
        {(errorProgram || errorSubmissions) && <div>Failed to load</div>}
        {(!program || !submissions) && <div>Loading...</div>}
        {program && submissions && <>
          <ToolbarProgram program={program} showSearch={true} />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>User</th>
                <th>Title</th>
                <th>Work Samples</th>
                {isJuror(user) && <th onClick={() => setSort('myRating')}>My Rating</th>}
                {isAdmin(user) && <th onClick={() => setSort('avgRating')}>Avg. Rating</th>}
                {isAdmin(user) && <th>Eligible</th>}
                <th className="text-end">Tools</th>
              </tr>
            </thead>
            <tbody>
              {submissions && getSubmissions.map((submission, index) => (
                <tr key={index}>
                  <td>{submission.contacts.map(contact => contact.name).join(', ')}</td>
                  <td>
                    <Link href={`/${program.campaign}/${program.slug}/submissions/${submission._id}`} passHref>
                      <a>{submission.title}</a>
                    </Link>
                  </td>
                  <td>{submission.assetsCount}</td>
                  {isJuror(user) && <td>{submission.myRating?.rate}</td>}
                  {isAdmin(user) && <td>{submission.avgRating}</td>}
                  {isAdmin(user) && <td className={!submission.eligible ? 'text-danger' : 'text-success'}>{submission.eligible.toString()}</td>}
                  <td className="text-end">
                    <Link href={`/${program.campaign}/${program.slug}/submissions/${submission._id}`} passHref>
                      <Button variant="info" size="sm">Show</Button>
                    </Link>

                    {isAdmin(user) && <Button variant="danger" size="sm" className="ms-1" onClick={() => removeSubmission(submission._id)}>Destroy</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {submissions.totalPages > 1 && <Pagination>
            <Pagination.First onClick={() => setQueryParams({ ...queryParams, pageNumber: 1 })} />
            <Pagination.Prev onClick={() => setQueryParams({ ...queryParams, pageNumber: Math.max(1, queryParams.pageNumber - 1)})} />
            
            {[...Array(submissions.totalPages)].map((_, index) => (
              <Pagination.Item key={index} active={index + 1 === pageNumber} onClick={() => setQueryParams({ ...queryParams, pageNumber: index + 1 })}>
                {index + 1}
              </Pagination.Item>
            ))}
            {/* <Pagination.Ellipsis /> */}

            {/* <Pagination.Ellipsis /> */}
            <Pagination.Next onClick={() => setQueryParams({ ...queryParams, pageNumber: Math.min(submissions.totalPages, queryParams.pageNumber + 1)})} />
            <Pagination.Last onClick={() => setQueryParams({ ...queryParams, pageNumber: submissions.totalPages })} />
          </Pagination>}
        </>}
      </Container>
    </Layout>
  );
};

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ({ req, res }) => {
    const { user } = getSession(req, res);
    if (!user || (!isAdmin(user) && !isJuror(user))) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    return {
      props: {}
    };
  },
});

export default ProgramSubmissions;