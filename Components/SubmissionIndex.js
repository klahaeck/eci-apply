import { isAdmin, isJuror } from '../lib/users';
import { stringify } from 'query-string';
import useQueryParams from '../hooks/useQueryParams';
import {
  Table,
  Button,
} from 'react-bootstrap';

const SubmissionIndex = ({ user, program, submissions, mutate }) => {
  const { queryParams, setQueryParams, structure, encodeQueryParams } = useQueryParams();
  const { sortBy, sortOrder, s: searchQuery, perPage, pageNumber } = queryParams;

  const removeSubmission = async (id) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
      mutate();
    }
  };

  const setSort = (key) => {
    // const thisSortBy = key === 'myRating' ? 'myRating.rate' : key;
    const thisSortOrder = key === sortBy && sortOrder === 'desc' ? 'asc'
                        : key === sortBy && sortOrder === 'asc' ? 'desc'
                        : sortOrder;

    setQueryParams({ sortBy: key, sortOrder: thisSortOrder });
  };

  const toggleFinalist = async (id, finalist) => {
    await fetch(`/api/submissions/${id}/set-finalist`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ finalist })
    });
    mutate();
  };

  const getMyRating = (ratings) => {
    const thisRating = ratings.find(rating => rating.round === program.ratingRound);
    return thisRating ? thisRating.rate : 'Not rated';
  };

  const getSubmissions = submissions?.data ? submissions.data : submissions;

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {isAdmin(user) && <th><a href="#" onClick={(event) => { event.preventDefault(); setSort('finalist'); }}>Finalist {sortBy === 'finalist' && <i className={`bi bi-caret-${sortOrder === 'asc' ? 'up' : 'down'}-fill`}></i>}</a></th>}
          <th>User</th>
          <th>Title</th>
          <th>Work Samples</th>
          {isJuror(user) && <th><a href="#" onClick={(event) => { event.preventDefault(); setSort('myRating'); }}>My Rating {sortBy === 'myRating' && <i className={`bi bi-caret-${sortOrder === 'asc' ? 'up' : 'down'}-fill`}></i>}</a></th>}
          {isAdmin(user) && <th><a href="#" onClick={(event) => { event.preventDefault(); setSort('avgRating'); }}>Avg. Rating {sortBy === 'avgRating' && <i className={`bi bi-caret-${sortOrder === 'asc' ? 'up' : 'down'}-fill`}></i>}</a></th>}
          {isAdmin(user) && <th>Eligible</th>}
          {isAdmin(user) && <th className="text-end">Tools</th>}
        </tr>
      </thead>
      <tbody>
        {submissions && getSubmissions.map((submission, index) => (
          <tr key={index}>
            {isAdmin(user) && <td className={submission.finalist ? 'text-success' : ''}>{submission.finalist ? String.fromCodePoint(0x2b50) : ''}</td>}
            <td>{submission.contacts.map(contact => contact.name).join(', ')}</td>
            <td>
              <a href={`/${program.campaign}/${program.slug}/submissions/${submission._id}?${stringify(encodeQueryParams(structure, {sortBy, sortOrder }))}`}>
                {submission.title}
              </a>
            </td>
            <td>{submission.assetsCount}</td>
            {isJuror(user) && <td>{getMyRating(submission.ratings)}</td>}
            {isAdmin(user) && <td>{submission.avgRating}</td>}
            {isAdmin(user) && <td className={!submission.eligible ? 'text-danger' : 'text-success'}>{submission.eligible.toString()}</td>}
            {isAdmin(user) && <td className="text-end">
              {/* <Button variant="info" size="sm" href={`/${program.campaign}/${program.slug}/submissions/${submission._id}?${stringify(encodeQueryParams(structure, {sortBy, sortOrder }))}`}>Show</Button> */}
              {isAdmin(user) && <Button variant={submission.finalist ? 'success' : 'light'} size="sm" className="ms-1" onClick={() => toggleFinalist(submission._id, !submission.finalist)}>Finalist</Button>}

              {isAdmin(user) && <Button variant="danger" size="sm" className="ms-1" onClick={() => removeSubmission(submission._id)}>Destroy</Button>}
            </td>}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default SubmissionIndex;