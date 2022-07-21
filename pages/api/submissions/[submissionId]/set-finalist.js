import nextConnect from 'next-connect';
import { connectToDatabase } from '../../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { isAdmin } from '../../../../lib/users';
import { ObjectId } from 'mongodb';

const handler = nextConnect();

handler.put(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  if (!isAdmin(user)) {
    return res.status(403).send('You do not have permission');
  }

  const { query: { submissionId } } = req;
  const { body } = req;

  const { db } = await connectToDatabase();

  const document = await db.collection('submissions').updateOne({ _id: ObjectId(submissionId) }, { $set: { finalist: body.finalist } });
  
  if (document.modifiedCount > 0) {
    return res.status(200).send();
  } else {
    return res.status(404).send();
  }
}));

export default handler;