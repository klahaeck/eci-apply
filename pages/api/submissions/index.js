import nextConnect from 'next-connect';
// import slugify from 'slugify';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getRole, isAdmin } from '../../../lib/users';
import { getSubmissions } from '../../../lib/submissions';

const handler = nextConnect();

handler.get(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  const role = getRole(user);

  if (role !== 'admin' && role !== 'juror') {
    return res.status(403).send('You do not have permission');
  }
  
  const { query: { programId } } = req;

  try {
    const submissions = await getSubmissions({ programId, role, sortBy: 'createdAt', sortOrder: 'asc' });
    return res.json(submissions);
  } catch(error) {
    console.error(error);
    return res.status(500).send(error);
  }
}));

handler.put(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  const { body } = req;

  if (!isAdmin(user) && user.sub !== body.userId) {
    return res.status(403).send('You do not have permission');
  }

  const { db } = await connectToDatabase();
  
  const _id = body._id;

  delete body._id;
  delete body.createdAt;
  delete body.userId;

  const now = new Date();

  if (!_id) body.createdAt = now;
  body.updatedAt = now;
  if (body.programId) body.programId = ObjectId(body.programId);
  if (body.budgetTotal) body.budgetTotal = parseInt(body.budgetTotal);
  if (body.startDate) body.startDate = new Date(body.startDate);
  if (body.completionDate) body.completionDate = new Date(body.completionDate);
  
  const document = await db.collection('submissions').updateOne({ _id: ObjectId(_id) }, { $set: {...body} }, { upsert: true });
  const updatedDocument = await db.collection('submissions').findOne({ _id: document.upsertedId ? document.upsertedId : ObjectId(_id) });
  return res.status(200).json(updatedDocument);
}));

export default handler;