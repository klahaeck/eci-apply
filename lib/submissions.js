import { ObjectId } from 'mongodb';
import { connectToDatabase } from './mongodb';

export const getSubmissions = async ({ programId, role }) => {
  const { db } = await connectToDatabase();
  const collection = db.collection('submissions');

  const query = { programId: new ObjectId(programId) };

  const projection = role === 'admin' ? {}
                  : role === 'juror' ? {_id: 1, campaign: 1, title: 1, slug: 1, description: 1, guidelines: 1, startDate: 1, endDate: 1, questions: 1, jurorInfo: 1}
                  : {_id: 1, campaign: 1, title: 1, slug: 1, description: 1, guidelines: 1, startDate: 1, endDate: 1, questions: 1};
  
  const submissions = await collection.find(query).project(projection).toArray();

  return submissions;
};

export const getSubmission = async ({ programId, userId }) => {
  const { db } = await connectToDatabase();
  const collection = db.collection('submissions');

  const query = { programId: new ObjectId(programId), userId };

  // const projection = role === 'admin' ? {}
  //                 : role === 'juror' ? {_id: 1, campaign: 1, title: 1, slug: 1, description: 1, guidelines: 1, startDate: 1, endDate: 1, questions: 1, jurorInfo: 1}
  //                 : {_id: 1, campaign: 1, title: 1, slug: 1, description: 1, guidelines: 1, startDate: 1, endDate: 1, questions: 1};
  
  const submission = await collection.findOne(query);

  return submission;
};

export const getSubmissionById = async ({ submissionId }) => {
  const { db } = await connectToDatabase();
  const collection = db.collection('submissions');

  const query = { _id: new ObjectId(submissionId) };

  // const projection = role === 'admin' ? {}
  //                 : role === 'juror' ? {_id: 1, campaign: 1, title: 1, slug: 1, description: 1, guidelines: 1, startDate: 1, endDate: 1, questions: 1, jurorInfo: 1}
  //                 : {_id: 1, campaign: 1, title: 1, slug: 1, description: 1, guidelines: 1, startDate: 1, endDate: 1, questions: 1};
  
  const submission = await collection.findOne(query);

  return submission;
};
