import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { isAdmin, isJuror } from '../../../lib/users';

const handler = nextConnect();

handler.get(async (req, res) => {
  const user = await getSession(req, res).user;
  if (!isAdmin(user) && (!isJuror(user) && user.sub !== body.userId)) {
    return res.status(403).send('You do not have permission');
  }

  const { db } = await connectToDatabase();
  const { query: { submissionId, userId } } = req;

  try {
    if (isAdmin(user) && !userId) {
      const ratings = await db.collection('ratings').find({ submissionId: ObjectId(submissionId) }).toArray();
      res.status(200).json(ratings);
    } else {
      const rating = await db.collection('ratings').findOne({ submissionId: ObjectId(submissionId), userId });
      // console.log(rating);
      res.status(200).json(rating || {});
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

handler.put(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  const { body, query: { submissionId, userId } } = req;
  if (!isAdmin(user) && (!isJuror(user) && user.sub !== body.userId)) {
    return res.status(403).send('You do not have permission');
  }

  const now = new Date();

  const { db } = await connectToDatabase();

  const _id = body._id;

  delete body._id;
  delete body.createdAt;

  if (!_id) body.createdAt = now;
  body.updatedAt = now;
  body.submissionId = ObjectId(submissionId);
  body.userId = isAdmin(user) ? userId : user.sub;

  // console.log(body);
  if (body.scopes) {
    body.scopes = body.scopes.map(s => ({...s, value: parseInt(s.value)}));
    body.ratingTotal = parseFloat(body.scopes.reduce((accumulator, scope) => accumulator + (scope.value * (scope.weight / 100)), 0).toFixed(3));
  }

  try {
    const rating = await db.collection('ratings').updateOne({ submissionId: ObjectId(submissionId), userId }, { $set: body }, { upsert: true });
    // console.log(rating);
    const updatedRating = await db.collection('ratings').findOne({ _id: rating.upsertedId || ObjectId(_id) });
    // console.log(updatedRating);
    return res.status(200).json(updatedRating);
  } catch(error) {
    console.error(error);
    return res.status(500).send(error);
  }
}));

export default handler;