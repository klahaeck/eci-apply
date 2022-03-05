import Link from 'next/link';
import {
  Table,
  Button
} from 'react-bootstrap';
import ProgramsToolbar from './ProgramsToolbar';

const ProgramList = ({ programs }) => {
  return (
    <>
      <ProgramsToolbar />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Campaign</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Published</th>
            <th>Submissions</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {programs.map((program, index) => (
            <tr key={index}>
              <td><Link href={`/${program.campaign}/${program.slug}`}><a>{program.title}</a></Link></td>
              <td>{program.campaign}</td>
              <td>{program.startDate}</td>
              <td>{program.endDate}</td>
              <td>{program.published.toString()}</td>
              <td>{program.submissions.length}</td>
              <td>
                <Link href={`/${program.campaign}/${program.slug}/edit`} passHref><Button variant="warning" size="sm">Edit</Button></Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ProgramList;