import {
  Pagination
} from 'react-bootstrap';
import useQueryParams from '../hooks/useQueryParams';

const PaginationSubmissions = ({ totalPages }) => {
  const { queryParams, setQueryParams } = useQueryParams();
  const { pageNumber } = queryParams;

  return (
    <Pagination>
      <Pagination.First onClick={() => setQueryParams({ pageNumber: 1 })} />
      <Pagination.Prev onClick={() => setQueryParams({ pageNumber: Math.max(1, pageNumber - 1)})} />
      
      {[...Array(totalPages)].map((_, index) => (
        <Pagination.Item key={index} active={index + 1 === pageNumber} onClick={() => setQueryParams({ pageNumber: index + 1 })}>
          {index + 1}
        </Pagination.Item>
      ))}
      {/* <Pagination.Ellipsis /> */}

      {/* <Pagination.Ellipsis /> */}
      <Pagination.Next onClick={() => setQueryParams({ pageNumber: Math.min(totalPages, pageNumber + 1)})} />
      <Pagination.Last onClick={() => setQueryParams({ pageNumber: totalPages })} />
    </Pagination>
  );
};

export default PaginationSubmissions;