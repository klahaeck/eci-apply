import {
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import JuryToolsRating from './JuryToolsRating';
import JuryToolsNotes from './JuryToolsNotes';

const JuryTools = ({ program, submission, mutate }) => {
  return (
    <Card className="p-3 my-3">
      <Row>
        <Col>
          <JuryToolsRating program={program} submission={submission} mutate={mutate} />
        </Col>
        <Col>
          <JuryToolsNotes submission={submission} mutate={mutate} />
        </Col>
      </Row>
    </Card>
  );
};

export default JuryTools;