import nextConnect from 'next-connect';
import slugify from 'slugify';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getPrograms } from '../../../../../lib/programs';
import { getRole, isAdmin } from '../../../../../lib/users';

const handler = nextConnect();

handler.get(async (req, res) => {
  const sessionUser = await getSession(req, res);
  const user = sessionUser ? sessionUser.user : null;
  const role = getRole(user);
  const { query: { campaign, slug } } = req;

  try {
    const programs = await getPrograms({ campaign, slug, role });
    const program = programs[0];
    res.status(200).send(program);
  } catch (error) {
    res.status(500).send(error);
  }
});

handler.put(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  if (!isAdmin(user)) {
    return res.status(403).send('You do not have permission');
  }

  const { body } = req;
  const _id = ObjectId(body._id);

  delete body._id;
  delete body.createdAt;

  body.updatedAt = new Date();
  body.startDate = new Date(body.startDate);
  body.endDate = new Date(body.endDate);
  body.slug = slugify(body.title, { lower: true });
  body.minWorkAssets = parseInt(body.minWorkAssets) || 0;
  body.maxWorkAssets = parseInt(body.maxWorkAssets) || 10;
  body.ratingRound = parseInt(body.ratingRound) || 1;
  body.ratingScopes = body.ratingScopes.map(scope => ({...scope, weight: parseInt(scope.weight)}));
  body.questions = body.questions.map(question => ({...question, validations: { ...question.validations, minWords: parseInt(question.validations.minWords), maxWords: parseInt(question.validations.maxWords) }}));

  const { db } = await connectToDatabase();

  await db.collection('programs').updateOne({ _id }, { $set: body });

  return res.status(200).send('ok');
}));

export default handler;