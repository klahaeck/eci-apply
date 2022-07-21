import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { isAdmin, isJuror } from '../../../lib/users';
import { calculateRate } from '../../../lib/ratings';

const handler = nextConnect();

// handler.get(async (req, res) => {
//   const user = await getSession(req, res).user;
//   const role = getRole(user);

//   if (!isAdmin(user) && (!isJuror(user) && user.sub !== body.userId)) {
//     return res.status(403).send('You do not have permission');
//   }

//   const { query: { submissionId, userId } } = req;

//   try {
//     const ratings = await getRatings({ submissionId, userId, role });
//     return res.json(ratings);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

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
  body.round = parseInt(body.round) || 1;

  // console.log(body);
  if (body.scopes) {
    body.scopes = body.scopes.map(s => ({...s, value: parseFloat(s.value)}));
    body.rate = calculateRate(body.scopes);
  }

  try {
    await db.collection('ratings').updateOne({ submissionId: ObjectId(submissionId), userId, round: body.round }, { $set: body }, { upsert: true });
    // const updatedRating = await db.collection('ratings').findOne({ submissionId: ObjectId(submissionId), userId });
    return res.status(200).send();
  } catch(error) {
    console.error(error);
    return res.status(500).send(error);
  }
}));

export default handler;