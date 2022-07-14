import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { deleteFile } from '../../../lib/aws';
import { isAdmin } from '../../../lib/users';

const handler = nextConnect();

handler.put(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  const { body } = req;

  const { query: { assetId } } = req;
  const query = { _id: ObjectId(assetId) };
  if (!isAdmin(user)) {
    query.userId = user.sub;
  }

  const now = new Date();

  body.updatedAt = now;

  delete body._id;
  delete body.createdAt;
  delete body.submissionId;

  const { db } = await connectToDatabase();

  try {
    const result = await db.collection('assets').updateOne(query, { $set: body });
    if (result.modifiedCount > 0) {
      return res.status(200).send();
    } else {
      return res.status(404).send();
    }
  } catch(error) {
    console.error(error);
    return res.status(500).send(error);
  }
}));

handler.delete(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;

  const { query: { assetId } } = req;
  const query = { _id: ObjectId(assetId) };
  if (!isAdmin(user)) {
    query.userId = user.sub;
  }

  const { db } = await connectToDatabase();

  try {
    const asset = await db.collection('assets').findOne(query);
    if (asset) {
      if (asset.imageKey) deleteFile(asset.imageKey);
      await db.collection('assets').deleteOne(query);
      return res.status(200).send('ok');
    } else {
      return res.status(404).send('not found');
    }
  } catch(error) {
    console.error(error);
    return res.status(500).send(error);
  }
}));

export default handler;