import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getRole, isAdmin, isJuror } from '../../../../lib/users';
import { getSubmissions } from '../../../../lib/submissions';

const handler = nextConnect();

handler.get(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  const role = getRole(user);
  
  const { query: { submissionId } } = req;

  try {
    const submissions = await getSubmissions({ _id: ObjectId(submissionId), role });
    if (!submissions.length) {
      return res.status(404).send('Submission not found');
    }
    if (!isAdmin(user) && !isJuror(user) && submissions[0].userId !== user.sub) {
      return res.status(403).send('You do not have permission');
    }
    return res.json(submissions[0]);
  } catch(error) {
    console.error(error);
    return res.status(500).send(error);
  }
}));

handler.delete(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  if (!isAdmin(user)) {
    return res.status(403).send('You do not have permission');
  }

  const { query: { submissionId } } = req;
  const query = { _id: ObjectId(submissionId) };

  const { db } = await connectToDatabase();

  try {
    await db.collection('submissions').deleteOne(query);
    await db.collection('assets').deleteMany({submissionId: ObjectId(submissionId)});
    await db.collection('ratings').deleteMany({submissionId: ObjectId(submissionId)});
    if (result.n > 0) {
      return res.status(200).send('ok');
    } else {
      return res.status(404).send();
    }
  } catch(error) {
    console.error(error);
    return res.status(500).send(error);
  }
}));


export default handler;