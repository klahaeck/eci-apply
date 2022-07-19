import nextConnect from 'next-connect';
import { connectToDatabase } from '../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getSubmissions } from '../../../lib/submissions';
import { getUser, getRole } from '../../../lib/users';
import { defaultSubmission } from '../../../data';

const handler = nextConnect();

handler.get(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  const role = getRole(user);

  const { query: { programId } } = req;
  const userId = user.sub;

  try {
    const submissions = await getSubmissions({ programId, userId, role });

    if (!submissions.length) {
      const user = await getUser(userId);
      const newSubmissionData = {
        ...defaultSubmission,
        programId,
        userId,
        user: { id: userId, email: user.email, name: user.name },
        contacts: [
          {
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            ...user.user_metadata
          }
        ],
        createdAt: new Date()
      };
      const { db } = await connectToDatabase();
      const result = await db.collection('submissions').insertOne(newSubmissionData);
      const newSubmissions = await getSubmissions({ _id: result.insertedId, role });
      return res.json(newSubmissions[0]);
    } else {
      return res.json(submissions[0]);
    }
  } catch(error) {
    console.error(error);
    return res.status(500).send(error);
  }
}));

export default handler;