import { isAdmin, isJuror } from '../lib/users';
import { stringify } from 'query-string';
import useQueryParams from '../hooks/useQueryParams';
import {
  Table,
  Button,
} from 'react-bootstrap';

const SubmissionIndex = ({ user, program, submissions, mutate, isPanel = false }) => {
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
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>User</th>
          <th>Work Samples</th>
          {!isPanel && isJuror(user) && <th><a href="#" onClick={(event) => { event.preventDefault(); setSort('myRating'); }}>My Rating {sortBy === 'myRating' && <i className={`bi bi-caret-${sortOrder === 'asc' ? 'up' : 'down'}-fill`}></i>}</a></th>}
          {isPanel && isJuror(user) && <th>My Rating</th>}
          {((isPanel && program.showPanelRatings) || !isPanel) && isAdmin(user) && <th><a href="#" onClick={(event) => { event.preventDefault(); setSort('avgRating'); }}>Avg. Rating {sortBy === 'avgRating' && <i className={`bi bi-caret-${sortOrder === 'asc' ? 'up' : 'down'}-fill`}></i>}</a></th>}
          {!isPanel && isAdmin(user) && <th><a href="#" onClick={(event) => { event.preventDefault(); setSort('eligible'); }}>Eligible {sortBy === 'eligible' && <i className={`bi bi-caret-${sortOrder === 'asc' ? 'up' : 'down'}-fill`}></i>}</a></th>}
          {!isPanel && isAdmin(user) && <th><a href="#" onClick={(event) => { event.preventDefault(); setSort('submitted'); }}>Submitted {sortBy === 'submitted' && <i className={`bi bi-caret-${sortOrder === 'asc' ? 'up' : 'down'}-fill`}></i>}</a></th>}
          {!isPanel && isAdmin(user) && <th><a href="#" onClick={(event) => { event.preventDefault(); setSort('finalist'); }}>Finalist {sortBy === 'finalist' && <i className={`bi bi-caret-${sortOrder === 'asc' ? 'up' : 'down'}-fill`}></i>}</a></th>}
          {!isPanel && (isAdmin(user) || isJuror(user)) && <th className="text-end">Tools</th>}
        </tr>
      </thead>
      <tbody>
        {submissions && getSubmissions.map((submission, index) => (
          <tr key={index}>
            <td><a href={`/${program.campaign}/${program.slug}/submissions/${submission._id}?${stringify(encodeQueryParams(structure, {sortBy, sortOrder }))}`}>{submission.contacts.map(contact => contact.name).join(', ')}</a></td>
            <td>{submission.assetsCount}</td>
            {isJuror(user) && <td>{getMyRating(submission.ratings)}</td>}
            {((isPanel && program.showPanelRatings) || !isPanel) && isAdmin(user) && <td>{submission.avgRating ? submission.avgRating.toFixed(2) : ''}</td>}
            {!isPanel && isAdmin(user) && <td className={submission.eligible ? 'text-success' : 'text-danger'}>{submission.eligible.toString()}</td>}
            {!isPanel && isAdmin(user) && <td className={submission.submitted ? 'text-success' : 'text-danger'}>{submission.submitted.toString()}</td>}
            {!isPanel && isAdmin(user) && <td className={submission.finalist ? 'text-success' : 'text-danger'}>{submission.finalist.toString()}</td>}
            {!isPanel && (isAdmin(user) || isJuror(user)) && <td className="text-end">
              <Button variant="info" size="sm" href={`/${program.campaign}/${program.slug}/submissions/${submission._id}?${stringify(encodeQueryParams(structure, {sortBy, sortOrder }))}`}>View</Button>
              {isAdmin(user) && <Button variant={submission.finalist ? 'success' : 'light'} size="sm" className="ms-1" onClick={() => toggleFinalist(submission._id, !submission.finalist)}>Finalist</Button>}

              {isAdmin(user) && <Button variant="danger" size="sm" className="ms-1" onClick={() => removeSubmission(submission._id)}><i className="bi bi-trash-fill"></i></Button>}
            </td>}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default SubmissionIndex;