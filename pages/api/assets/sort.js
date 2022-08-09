import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { isAdmin } from '../../../lib/users';
// import { defaultSubmission } from '../../../data';
// import { getSubmissions } from '../../../lib/submissions';

const handler = nextConnect();

handler.post(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  const { body: { userId, assets } } = req;

  if (!isAdmin(user) && user.sub !== userId) {
    return res.status(403).send('You do not have permission');
  }

  const updatedItems = assets.map(asset => {
    return {
      updateOne: {
        filter: {
          _id: ObjectId(asset._id)
        },
        update: {
          $set: { position: asset.position }
        }
      }
    }
  })

  const { db } = await connectToDatabase();
  await db.collection('assets').bulkWrite(updatedItems);

  return res.status(200).send();
}));

export default handler;
