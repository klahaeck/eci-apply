import nextConnect from 'next-connect';
// import slugify from 'slugify';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { validateSubmission } from '../../../../lib/validate';
import { getSubmissions } from '../../../../lib/submissions';
// import { keyBy } from 'lodash';

const handler = nextConnect();

handler.put(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  const { query: { submissionId } } = req;

  const { db } = await connectToDatabase();
  
  const now = new Date();

  const submissions = await getSubmissions({ _id: ObjectId(submissionId) });
  const submission = submissions[0];
  if (user.sub !== submission.userId) {
    return res.status(403).send({ errors: ['You do not have permission'] });
  }

  const program = await db.collection('programs').findOne({ _id: ObjectId(submission.programId) });

  const errors = validateSubmission(program, submission);
  const errorKeys = Object.keys(errors);
  if (errorKeys.length) {
    return res.status(400).send({ errors: errorKeys.map(key => errors[key]) });
  }
  
  const document = await db.collection('submissions').updateOne({ _id: ObjectId(submissionId), userId: user.sub }, { $set: { submitted: true, submittedAt: now } });
  if (document.acknowledged) {
    const updatedDocuments = await getSubmissions({ _id: document.upsertedId });
    return res.status(200).json(updatedDocuments[0]);
  } else {
    return res.status(404).send();
  }
}));

export default handler;