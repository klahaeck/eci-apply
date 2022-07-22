import nextConnect from 'next-connect';
// import slugify from 'slugify';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { validateSubmission } from '../../../../lib/validate';
import { getSubmissions } from '../../../../lib/submissions';
import { getRole } from '../../../../lib/users';
// import { keyBy } from 'lodash';

const handler = nextConnect();

handler.put(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  const role = getRole(user);
  const userId = user.sub;
  const { query: { submissionId } } = req;

  const { db } = await connectToDatabase();
  
  const now = new Date();

  const submissions = await getSubmissions({ _id: ObjectId(submissionId) });
  const submission = submissions[0];
  if (submission.userId !== userId) {
    return res.status(403).send({ errors: ['You do not have permission'] });
  }
  if (submission.submitted) {
    return res.status(403).send({ errors: ['This has already been submitted'] });
  }

  const program = await db.collection('programs').findOne({ _id: ObjectId(submission.programId) });

  const errors = validateSubmission(program, submission);
  const errorKeys = Object.keys(errors);
  if (errorKeys.length) {
    return res.status(400).send({ errors: errorKeys.map(key => errors[key]) });
  }

  if (now < program.startDate) {
    return res.status(403).send({ errors: ['we are not yet accepting submissions for this program'] });
  }
  
  if (now > program.endDate) {
    return res.status(403).send({ errors: ['The deadline for this submission has passed'] });
  }
  
  const document = await db.collection('submissions').updateOne({ _id: ObjectId(submissionId), userId }, { $set: { submitted: true, submittedAt: now } });
  if (document.acknowledged) {
    const updatedDocuments = await getSubmissions({ _id: document.upsertedId, role });
    return res.status(200).json(updatedDocuments[0]);
  } else {
    return res.status(404).send();
  }
}));

export default handler;