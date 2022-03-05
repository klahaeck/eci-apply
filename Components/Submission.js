import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showModal } from '../store/overlays/reducer';
import useSWR from 'swr';
import fetcher from '../lib/fetcher';
import {
  Button,
  Card,
  Table,
  Accordion
} from 'react-bootstrap';
import { formatPhoneNumber } from 'react-phone-number-input'
import JurorTools from './JurorTools';
import FormContactInfo from './FormContactInfo';
import FormSummary from './FormSummary';
import FormDetails from './FormDetails';
// import { isAdmin } from '../lib/utils';
import { defaultSubmission } from '../data';

const Submission = ({ user, program, submission, showModal }) => {
  // console.log(submission);
  const [ submissionData, setSubmissionData ] = useState(submission._id ? submission : defaultSubmission);

  const { data: userData } = useSWR(user && !submissionData.leadOrganizer.email ? `/api/users/${user.sub}` : null, fetcher);

  useEffect(() => {
    if (userData) {
      setSubmissionData({
        ...submissionData,
        leadOrganizer: {
          ...submissionData.leadOrganizer,
          name: userData.name,
          email: userData.email,
          phone_number: userData.phone_number,
          ...userData.user_metadata
        }
      });
    }
  }, [submissionData, userData])

  // const onSubmit = async data => {
  //   console.log(data);
  //   // const res = await fetch('/api/programs', {
  //   //   method: 'POST',
  //   //   headers: { 'Content-Type': 'application/json' },
  //   //   body: JSON.stringify(data)
  //   // });
  //   // const resData = await res.json();
  // };

  const openForm = (header, body) => showModal({size: 'xl', header, body});

  return (
    <>
      <JurorTools />

      <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Contact info</Accordion.Header>
          <Accordion.Body>
            <Table size="sm">
              <tbody>
                <tr>
                  <td>Name:</td>
                  <td>{submissionData.leadOrganizer.name}</td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td>{submissionData.leadOrganizer.email}</td>
                </tr>
                <tr>
                  <td>Phone:</td>
                  <td>{formatPhoneNumber(submissionData.leadOrganizer.phone_number)}</td>
                </tr>
                <tr>
                  <td>Address 1:</td>
                  <td>{submissionData.leadOrganizer.address0}</td>
                </tr>
                <tr>
                  <td>Address 2:</td>
                  <td>{submissionData.leadOrganizer.address1}</td>
                </tr>
                <tr>
                  <td>County:</td>
                  <td>{submissionData.leadOrganizer.county}</td>
                </tr>
                <tr>
                  <td>Identifies As:</td>
                  <td>{submissionData.leadOrganizer.identifiesAs}</td>
                </tr>
              </tbody>
            </Table>
            <Button variant="primary" onClick={() => openForm('Edit Contact Info', <FormContactInfo submissionData={submissionData} />)}>Edit Contact Info</Button>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Summary</Accordion.Header>
          <Accordion.Body>
            <Table size="sm">
              <tbody>
                <tr>
                  <td>Project Title:</td>
                  <td>{submissionData.title}</td>
                </tr>
                <tr>
                  <td>Total Budget:</td>
                  <td>{submissionData.budgetTotal}</td>
                </tr>
                <tr>
                  <td>Amount Requested:</td>
                  <td>{submissionData.budgetRequested}</td>
                </tr>
                <tr>
                  <td>Start Date:</td>
                  <td>{submissionData.startDate}</td>
                </tr>
                <tr>
                  <td>Completion Date:</td>
                  <td>{submissionData.completionDate}</td>
                </tr>
                <tr>
                  <td>Project Summary:</td>
                  <td>{submissionData.summary}</td>
                </tr>
              </tbody>
            </Table>
            <Button variant="primary" onClick={() => openForm('Edit Summary', <FormSummary submissionData={submissionData} />)}>Edit Summary</Button>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Details</Accordion.Header>
          <Accordion.Body>
            {submission.details && <Table size="sm">
              <tbody>
                {submission.details.map(detail => (
                  <tr key={detail.id}>
                    <td>{detail.question}</td>
                    <td>{detail.answer}</td>
                  </tr>
                ))}
              </tbody>
            </Table>}
            <Button variant="primary" onClick={() => openForm('Edit Details', <FormDetails questions={program.questions} submissionData={submissionData} />)}>Edit Details</Button>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  showModal: bindActionCreators(showModal, dispatch),
});

export default connect(null, mapDispatchToProps)(Submission);