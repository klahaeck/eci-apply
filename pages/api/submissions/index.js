import nextConnect from 'next-connect';
// import slugify from 'slugify';
// import { ObjectId } from 'mongodb';
// import { connectToDatabase } from '../../../../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getSubmissions, getSubmission } from '../../../lib/submissions';
import { isAdmin, isJuror } from '../../../lib/utils';

const handler = nextConnect();

handler.get(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  if (!isAdmin(user) && !isJuror(user)) {
    return res.status(403).send('You do not have permission');
  }
  
  const { query: { programId, userId } } = req;

  try {
    if (userId) {
      const submission = await getSubmission({ programId, userId });
      return res.json(submission || {});
    } else {
      const submissions = await getSubmissions({ programId });
      return res.json(submissions);
    }
  } catch(error) {
    console.error(error);
    return res.status(500).send(error);
  }
}));

// handler.put(withApiAuthRequired(async (req, res) => {
//   const user = await getSession(req, res).user;
//   if (!isAdmin(user)) {
//     return res.status(403).send('You do not have permission');
//   }

//   const { db } = await connectToDatabase();
//   const { body } = req;
//   const _id = body._id;

//   delete body._id;
//   delete body.createdAt;

//   body.updatedAt = new Date();
//   body.slug = slugify(body.title, { lower: true });

//   console.log(body);

//   const updated = await db.collection('submissions').updateOne({ _id: new ObjectId(_id) }, { $set: {...body} });

//   console.log(updated);

//   return res.status(200).send('ok');
// }));

export default handler;