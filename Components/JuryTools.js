import {
  Row,
  Col,
  Card,
} from 'react-bootstrap';
// import Draggable from 'react-draggable';
import JuryToolsRating from './JuryToolsRating';
import JuryToolsNotes from './JuryToolsNotes';

const JuryTools = ({ program, submission, mutate }) => {
  return (
    <Card className="p-3 my-3">
      <Row>
        <Col>
          <JuryToolsRating program={program} submission={submission} mutate={mutate} />
        </Col>
        {/* <Draggable> */}
          <Col>
            <JuryToolsNotes submission={submission} mutate={mutate} />
          </Col>
        {/* </Draggable> */}
      </Row>
    </Card>
  );
};

export default JuryTools;