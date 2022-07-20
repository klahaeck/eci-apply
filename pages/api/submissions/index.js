import nextConnect from 'next-connect';
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
  
  const { query: { programId, s: searchQuery, perPage, pageNumber, sortBy, sortOrder } } = req;
  const userId = user.sub;

  try {
    const submissions = await getSubmissions({ programId, userId, role, searchQuery, sortBy, sortOrder, perPage, pageNumber });
    return res.json(submissions);
  } catch(error) {
    console.error(error);
    return res.status(500).send(error);
  }
}));

handler.put(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  const role = getRole(user);
  const { body } = req;

  if (!user) {
    return res.status(403).send('You do not have permission');
  }

  const userId = user.sub;

  const { db } = await connectToDatabase();
  
  const _id = body._id;

  delete body._id;
  delete body.createdAt;
  if (!isAdmin(user)) delete body.userId;

  const now = new Date();

  if (!_id) body.createdAt = now;
  body.updatedAt = now;
  if (body.programId) body.programId = ObjectId(body.programId);
  if (body.budgetTotal) body.budgetTotal = parseInt(body.budgetTotal);
  if (body.startDate) body.startDate = new Date(body.startDate);
  if (body.completionDate) body.completionDate = new Date(body.completionDate);

  const query = isAdmin(user) ? { _id: ObjectId(_id) } : { _id: ObjectId(_id), userId, submitted: false };
  
  const document = await db.collection('submissions').findOneAndUpdate(query, { $set: {...body} }, { upsert: false });
  if (!document.value) {
    return res.status(403).send('You do not have permission');
  } else {
    const updatedSubmissions = await getSubmissions({ _id: document.value._id ? document.value._id : ObjectId(_id), role });
    return res.status(200).json(updatedSubmissions[0]);
  }
}));

export default handler;