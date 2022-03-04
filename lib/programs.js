import { connectToDatabase } from './mongodb';

export const getPrograms = async ({ role }) => {
  const { db } = await connectToDatabase();
  const collection = db.collection('programs');

  const query = {};

  const projection = role === 'admin' ? {}
                  : role === 'juror' ? {_id: 1, campaign: 1, title: 1, slug: 1, description: 1, guidelines: 1, startDate: 1, endDate: 1, questions: 1, jurorInfo: 1}
                  : {_id: 1, campaign: 1, title: 1, slug: 1, description: 1, guidelines: 1, startDate: 1, endDate: 1, questions: 1};
  
  const programs = await collection.find(query).project(projection).toArray();

  return programs;
};

export const getProgram = async ({ campaign, slug, role }) => {
  const { db } = await connectToDatabase();
  const collection = db.collection('programs');

  const query = { campaign, slug: slug.trim().toLowerCase() };

  const projection = role === 'admin' ? {}
                  : role === 'juror' ? {_id: 1, campaign: 1, title: 1, slug: 1, description: 1, guidelines: 1, startDate: 1, endDate: 1, questions: 1, jurorInfo: 1}
                  : {_id: 1, campaign: 1, title: 1, slug: 1, description: 1, guidelines: 1, startDate: 1, endDate: 1, questions: 1};
  
  const program = await collection.findOne(query);

  return program;
};
