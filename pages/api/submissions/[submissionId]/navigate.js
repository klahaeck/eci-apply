import nextConnect from 'next-connect';
import findIndex from 'lodash/findIndex';
import { connectToDatabase } from '../../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { isAdmin, isJuror } from '../../../../lib/users';

const handler = nextConnect();

handler.get(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  if (!isAdmin(user) && !isJuror(user)) {
    return res.status(403).send('You do not have permission');
  }

  const { query: { submissionId, sortBy, sortOrder, direction } } = req;
  const thisSortOrder = sortOrder === 'asc' ? 1 : -1;
  // const operator = direction === 'next' ? '$gt' : '$lt';

  const { db } = await connectToDatabase();

  const documents = await db.collection('submissions').find({ submitted: true, eligible: true }).sort({ [sortBy]: thisSortOrder }).project({ _id: 1 }).toArray();
  const thisIndex = findIndex(documents, (document) => document._id.toString() == submissionId);
  const nextIndex = direction === 'next' ? thisIndex + 1 : thisIndex - 1;
  const loopedIndex = nextIndex < 0 ? documents.length - 1 : nextIndex >= documents.length ? 0 : nextIndex;
  const nextDocument = documents[loopedIndex];
  
  // if (documents.length > 0) {
    return res.status(200).json(nextDocument);
  // } else {
  //   return res.status(404).send();
  // }
}));

export default handler;